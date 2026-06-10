<?php
/**
 * Plugin Name: Afghan Support Headless
 * Description: Custom post types and REST API support for the Afghan Support Phoenix Next.js headless frontend.
 * Version: 1.0.0
 * Author: Afghan Support Phoenix Team
 * Text Domain: afghan-support-headless
 */

if (!defined('ABSPATH')) {
    exit;
}

const ASP_TRANSLATION_MODELS = [
    'moonshotai/kimi-k2.6:free',
    'qwen/qwen3-235b-a22b:free',
    'openrouter/free',
];

class Afghan_Support_Headless_Plugin {

    public function __construct() {
        add_action('init', [$this, 'register_post_types']);
        add_action('init', [$this, 'register_meta_fields']);
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        add_action('save_post', [$this, 'save_meta_boxes']);
        add_action('save_post', [$this, 'check_translation_stale'], 10, 2);
        add_action('save_post', [$this, 'trigger_revalidation'], 10, 2);
        add_action('rest_api_init', [$this, 'register_rest_fields']);
        add_filter('rest_asp_event_query', [$this, 'filter_event_rest_query'], 10, 2);
        add_filter('rest_asp_page_meta_query', [$this, 'filter_page_meta_rest_query'], 10, 2);

        // AJAX handler for translation generation
        add_action('wp_ajax_asp_generate_translations', [$this, 'ajax_generate_translations']);
    }

    public function register_post_types(): void {
        // Events CPT
        register_post_type('asp_event', [
            'labels' => [
                'name'          => __('Events', 'afghan-support-headless'),
                'singular_name' => __('Event', 'afghan-support-headless'),
                'add_new'       => __('Add New Event', 'afghan-support-headless'),
                'add_new_item'  => __('Add New Event', 'afghan-support-headless'),
                'edit_item'     => __('Edit Event', 'afghan-support-headless'),
                'new_item'      => __('New Event', 'afghan-support-headless'),
                'view_item'     => __('View Event', 'afghan-support-headless'),
                'search_items'  => __('Search Events', 'afghan-support-headless'),
                'not_found'     => __('No events found', 'afghan-support-headless'),
            ],
            'public'       => true,
            'has_archive'  => false,
            'show_in_rest' => true,
            'rest_base'    => 'events',
            'supports'     => ['title', 'editor', 'thumbnail', 'custom-fields', 'revisions'],
            'menu_icon'    => 'dashicons-calendar-alt',
            'rewrite'      => ['slug' => 'event'],
        ]);

        // Page Metadata CPT
        register_post_type('asp_page_meta', [
            'labels' => [
                'name'          => __('Site Metadata', 'afghan-support-headless'),
                'singular_name' => __('Page Metadata', 'afghan-support-headless'),
                'add_new'       => __('Add New Metadata', 'afghan-support-headless'),
                'add_new_item'  => __('Add New Metadata', 'afghan-support-headless'),
                'edit_item'     => __('Edit Metadata', 'afghan-support-headless'),
                'new_item'      => __('New Metadata', 'afghan-support-headless'),
                'view_item'     => __('View Metadata', 'afghan-support-headless'),
                'search_items'  => __('Search Metadata', 'afghan-support-headless'),
                'not_found'     => __('No metadata found', 'afghan-support-headless'),
            ],
            'public'       => false,
            'show_ui'      => true,
            'show_in_menu' => true,
            'show_in_rest' => true,
            'rest_base'    => 'site-metadata',
            'supports'     => ['title', 'custom-fields', 'revisions'],
            'menu_icon'    => 'dashicons-admin-generic',
        ]);
    }

    public function register_meta_fields(): void {
        $event_meta = [
            '_asp_event_category'      => ['type' => 'string',  'description' => 'Event category'],
            '_asp_event_start_date'    => ['type' => 'string',  'description' => 'Event start date (ISO 8601)'],
            '_asp_event_end_date'      => ['type' => 'string',  'description' => 'Event end date (ISO 8601)'],
            '_asp_event_location'      => ['type' => 'string',  'description' => 'Event location'],
            '_asp_cta_label'           => ['type' => 'string',  'description' => 'Call-to-action button label'],
            '_asp_cta_url'             => ['type' => 'string',  'description' => 'Call-to-action URL'],
            '_asp_event_language'      => ['type' => 'string',  'description' => 'Language code: en, dari, uzbek, or pashto'],
            '_asp_featured_image_id'   => ['type' => 'integer', 'description' => 'Featured image attachment ID'],
        ];

        foreach ($event_meta as $key => $config) {
            register_post_meta('asp_event', $key, [
                'type'         => $config['type'],
                'description'  => $config['description'],
                'single'       => true,
                'show_in_rest' => true,
            ]);
        }

        // Translation content fields per language
        $translation_langs = ['dari', 'pashto', 'uzbek'];
        $translation_content_fields = [
            '_asp_event_title'       => ['type' => 'string', 'description' => 'Translated event title'],
            '_asp_event_description' => ['type' => 'string', 'description' => 'Translated event description (HTML)'],
            '_asp_event_location'    => ['type' => 'string', 'description' => 'Translated event location'],
            '_asp_cta_label'         => ['type' => 'string', 'description' => 'Translated CTA label'],
        ];

        foreach ($translation_langs as $lang) {
            foreach ($translation_content_fields as $base_key => $config) {
                register_post_meta('asp_event', "{$base_key}_{$lang}", [
                    'type'         => $config['type'],
                    'description'  => $config['description'] . " ({$lang})",
                    'single'       => true,
                    'show_in_rest' => true,
                ]);
            }
        }

        // Translation control fields per language
        $translation_control_fields = [
            '_asp_translation_status'      => ['type' => 'string',  'description' => 'Translation status: empty|draft|reviewed|stale|failed'],
            '_asp_translation_model'       => ['type' => 'string',  'description' => 'Model ID used for translation'],
            '_asp_translation_generated_at' => ['type' => 'string',  'description' => 'ISO 8601 timestamp of generation'],
        ];

        foreach ($translation_langs as $lang) {
            foreach ($translation_control_fields as $base_key => $config) {
                register_post_meta('asp_event', "{$base_key}_{$lang}", [
                    'type'         => $config['type'],
                    'description'  => $config['description'] . " ({$lang})",
                    'single'       => true,
                    'show_in_rest' => true,
                ]);
            }
        }

        // Shared translation control fields
        register_post_meta('asp_event', '_asp_translation_source_hash', [
            'type'         => 'string',
            'description'  => 'SHA-256 of English source at generation time',
            'single'       => true,
            'show_in_rest' => true,
        ]);

        register_post_meta('asp_event', '_asp_translation_error', [
            'type'         => 'string',
            'description'  => 'Last translation error message',
            'single'       => true,
            'show_in_rest' => true,
        ]);

        $page_meta = [
            '_asp_route_key'           => ['type' => 'string',  'description' => 'Route key, e.g. home, events, contact'],
            '_asp_seo_title'           => ['type' => 'string',  'description' => 'SEO title'],
            '_asp_seo_description'     => ['type' => 'string',  'description' => 'SEO meta description'],
            '_asp_og_title'            => ['type' => 'string',  'description' => 'Open Graph title'],
            '_asp_og_description'      => ['type' => 'string',  'description' => 'Open Graph description'],
            '_asp_og_image_id'         => ['type' => 'integer', 'description' => 'Open Graph image attachment ID'],
            '_asp_page_meta_language'  => ['type' => 'string',  'description' => 'Language code: en, dari, uzbek, or pashto'],
        ];

        foreach ($page_meta as $key => $config) {
            register_post_meta('asp_page_meta', $key, [
                'type'         => $config['type'],
                'description'  => $config['description'],
                'single'       => true,
                'show_in_rest' => true,
            ]);
        }
    }

    public function add_meta_boxes(): void {
        add_meta_box(
            'asp_event_details',
            __('Event Details', 'afghan-support-headless'),
            [$this, 'render_event_meta_box'],
            'asp_event',
            'normal',
            'high'
        );

        add_meta_box(
            'asp_page_meta_details',
            __('Page Metadata', 'afghan-support-headless'),
            [$this, 'render_page_meta_box'],
            'asp_page_meta',
            'normal',
            'high'
        );
    }

    public function render_event_meta_box(\WP_Post $post): void {
        wp_nonce_field('asp_event_meta', 'asp_event_meta_nonce');
        $category    = get_post_meta($post->ID, '_asp_event_category', true);
        $start_date  = get_post_meta($post->ID, '_asp_event_start_date', true);
        $end_date    = get_post_meta($post->ID, '_asp_event_end_date', true);
        $location    = get_post_meta($post->ID, '_asp_event_location', true);
        $cta_label   = get_post_meta($post->ID, '_asp_cta_label', true);
        $cta_url     = get_post_meta($post->ID, '_asp_cta_url', true);
        $language    = get_post_meta($post->ID, '_asp_event_language', true) ?: 'en';
        $image_id    = get_post_meta($post->ID, '_asp_featured_image_id', true);

        $categories = [
            'immigration' => __('Immigration Workshop', 'afghan-support-headless'),
            'legal'       => __('Legal Clinic', 'afghan-support-headless'),
            'cultural'    => __('Cultural Gathering', 'afghan-support-headless'),
            'holiday'     => __('Afghan Holiday', 'afghan-support-headless'),
        ];

        // Translation statuses
        $translation_langs = [
            'dari'   => __('Dari', 'afghan-support-headless'),
            'pashto' => __('Pashto', 'afghan-support-headless'),
            'uzbek'  => __('Afghan Uzbek', 'afghan-support-headless'),
        ];
        $status_labels = [
            'empty'    => __('Empty', 'afghan-support-headless'),
            'draft'    => __('Draft', 'afghan-support-headless'),
            'reviewed' => __('Reviewed', 'afghan-support-headless'),
            'stale'    => __('Stale', 'afghan-support-headless'),
            'failed'   => __('Failed', 'afghan-support-headless'),
        ];

        ?>
        <p>
            <label for="_asp_event_category"><strong><?php _e('Category', 'afghan-support-headless'); ?></strong></label><br>
            <select name="_asp_event_category" id="_asp_event_category" style="width:100%">
                <?php foreach ($categories as $value => $label) : ?>
                    <option value="<?php echo esc_attr($value); ?>" <?php selected($category, $value); ?>>
                        <?php echo esc_html($label); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </p>
        <p>
            <label for="_asp_event_start_date"><strong><?php _e('Start Date', 'afghan-support-headless'); ?></strong></label><br>
            <input type="datetime-local" name="_asp_event_start_date" id="_asp_event_start_date" value="<?php echo esc_attr($start_date); ?>" style="width:100%">
        </p>
        <p>
            <label for="_asp_event_end_date"><strong><?php _e('End Date (optional)', 'afghan-support-headless'); ?></strong></label><br>
            <input type="datetime-local" name="_asp_event_end_date" id="_asp_event_end_date" value="<?php echo esc_attr($end_date); ?>" style="width:100%">
        </p>
        <p>
            <label for="_asp_event_location"><strong><?php _e('Location', 'afghan-support-headless'); ?></strong></label><br>
            <input type="text" name="_asp_event_location" id="_asp_event_location" value="<?php echo esc_attr($location); ?>" style="width:100%">
        </p>
        <p>
            <label for="_asp_cta_label"><strong><?php _e('CTA Label', 'afghan-support-headless'); ?></strong></label><br>
            <input type="text" name="_asp_cta_label" id="_asp_cta_label" value="<?php echo esc_attr($cta_label); ?>" style="width:100%">
        </p>
        <p>
            <label for="_asp_cta_url"><strong><?php _e('CTA URL (optional)', 'afghan-support-headless'); ?></strong></label><br>
            <input type="url" name="_asp_cta_url" id="_asp_cta_url" value="<?php echo esc_attr($cta_url); ?>" style="width:100%">
        </p>
        <p>
            <label for="_asp_event_language"><strong><?php _e('Language', 'afghan-support-headless'); ?></strong></label><br>
            <select name="_asp_event_language" id="_asp_event_language" style="width:100%">
                <option value="en" <?php selected($language, 'en'); ?>>English</option>
                <option value="dari" <?php selected($language, 'dari'); ?>>Dari</option>
                <option value="uzbek" <?php selected($language, 'uzbek'); ?>>Afghan Uzbek</option>
                <option value="pashto" <?php selected($language, 'pashto'); ?>>Pashto</option>
            </select>
        </p>
        <p>
            <label for="_asp_featured_image_id"><strong><?php _e('Featured Image ID', 'afghan-support-headless'); ?></strong></label><br>
            <input type="number" name="_asp_featured_image_id" id="_asp_featured_image_id" value="<?php echo esc_attr($image_id); ?>" style="width:100%">
            <small><?php _e('Enter the WordPress Media Library attachment ID.', 'afghan-support-headless'); ?></small>
        </p>

        <hr>
        <h4><?php _e('AI Translations', 'afghan-support-headless'); ?></h4>
        <?php foreach ($translation_langs as $lang_code => $lang_label) :
            $status = get_post_meta($post->ID, "_asp_translation_status_{$lang_code}", true) ?: 'empty';
            $status_class = 'stale' === $status ? 'notice-warning' : ('failed' === $status ? 'notice-error' : 'notice-info');
        ?>
            <p style="margin:4px 0;">
                <strong><?php echo esc_html($lang_label); ?>:</strong>
                <span class="<?php echo esc_attr($status_class); ?>" style="padding:2px 6px; border-radius:3px; font-size:12px;">
                    <?php echo esc_html($status_labels[$status] ?? $status); ?>
                </span>
            </p>
        <?php endforeach; ?>

        <?php if (current_user_can('edit_post', $post->ID)) : ?>
            <p>
                <button type="button" id="asp-generate-translations" class="button button-primary" data-post-id="<?php echo esc_attr($post->ID); ?>">
                    <?php _e('Generate Translations', 'afghan-support-headless'); ?>
                </button>
                <span class="spinner" style="float:none; margin-top:0;"></span>
            </p>
            <div id="asp-translation-message" style="margin-top:8px;"></div>
            <?php wp_nonce_field('asp_generate_translations_nonce', 'asp_generate_translations_nonce'); ?>
            <script>
            (function($) {
                var successMessage = '<?php echo esc_js(__('Translations generated successfully.', 'afghan-support-headless')); ?>';
                var fallbackErrorMessage = '<?php echo esc_js(__('An error occurred.', 'afghan-support-headless')); ?>';
                var requestFailedMessage = '<?php echo esc_js(__('Request failed. Please try again.', 'afghan-support-headless')); ?>';

                $('#asp-generate-translations').on('click', function() {
                    var $btn = $(this),
                        $spinner = $btn.next('.spinner'),
                        $msg = $('#asp-translation-message');
                    $btn.prop('disabled', true);
                    $spinner.addClass('is-active');
                    $msg.html('');

                    $.post(ajaxurl, {
                        action: 'asp_generate_translations',
                        post_id: $btn.data('post-id'),
                        nonce: $('#asp_generate_translations_nonce').val()
                    }, function(response) {
                        $spinner.removeClass('is-active');
                        if (response.success) {
                            $msg.html('<div class="notice notice-success"><p>' + successMessage + '</p></div>');
                            location.reload();
                        } else {
                            $btn.prop('disabled', false);
                            $msg.html('<div class="notice notice-error"><p>' + (response.data || fallbackErrorMessage) + '</p></div>');
                        }
                    }).fail(function() {
                        $spinner.removeClass('is-active');
                        $btn.prop('disabled', false);
                        $msg.html('<div class="notice notice-error"><p>' + requestFailedMessage + '</p></div>');
                    });
                });
            })(jQuery);
            </script>
        <?php endif; ?>
        <?php
    }

    public function render_page_meta_box(\WP_Post $post): void {
        wp_nonce_field('asp_page_meta_meta', 'asp_page_meta_nonce');
        $route_key       = get_post_meta($post->ID, '_asp_route_key', true);
        $seo_title       = get_post_meta($post->ID, '_asp_seo_title', true);
        $seo_description = get_post_meta($post->ID, '_asp_seo_description', true);
        $og_title        = get_post_meta($post->ID, '_asp_og_title', true);
        $og_description  = get_post_meta($post->ID, '_asp_og_description', true);
        $og_image_id     = get_post_meta($post->ID, '_asp_og_image_id', true);
        $language        = get_post_meta($post->ID, '_asp_page_meta_language', true) ?: 'en';

        $routes = [
            'home'       => __('Home', 'afghan-support-headless'),
            'events'     => __('Events', 'afghan-support-headless'),
            'stories'    => __('Stories', 'afghan-support-headless'),
            'contact'    => __('Contact', 'afghan-support-headless'),
            'immigration'=> __('Immigration', 'afghan-support-headless'),
            'rights'     => __('Rights', 'afghan-support-headless'),
            'resources'  => __('Resources', 'afghan-support-headless'),
        ];

        ?>
        <p>
            <label for="_asp_route_key"><strong><?php _e('Route Key', 'afghan-support-headless'); ?></strong></label><br>
            <select name="_asp_route_key" id="_asp_route_key" style="width:100%">
                <?php foreach ($routes as $value => $label) : ?>
                    <option value="<?php echo esc_attr($value); ?>" <?php selected($route_key, $value); ?>>
                        <?php echo esc_html($label); ?>
                    </option>
                <?php endforeach; ?>
            </select>
        </p>
        <p>
            <label for="_asp_seo_title"><strong><?php _e('SEO Title', 'afghan-support-headless'); ?></strong></label><br>
            <input type="text" name="_asp_seo_title" id="_asp_seo_title" value="<?php echo esc_attr($seo_title); ?>" style="width:100%">
        </p>
        <p>
            <label for="_asp_seo_description"><strong><?php _e('SEO Description', 'afghan-support-headless'); ?></strong></label><br>
            <textarea name="_asp_seo_description" id="_asp_seo_description" rows="3" style="width:100%"><?php echo esc_textarea($seo_description); ?></textarea>
        </p>
        <p>
            <label for="_asp_og_title"><strong><?php _e('Open Graph Title', 'afghan-support-headless'); ?></strong></label><br>
            <input type="text" name="_asp_og_title" id="_asp_og_title" value="<?php echo esc_attr($og_title); ?>" style="width:100%">
        </p>
        <p>
            <label for="_asp_og_description"><strong><?php _e('Open Graph Description', 'afghan-support-headless'); ?></strong></label><br>
            <textarea name="_asp_og_description" id="_asp_og_description" rows="3" style="width:100%"><?php echo esc_textarea($og_description); ?></textarea>
        </p>
        <p>
            <label for="_asp_og_image_id"><strong><?php _e('Open Graph Image ID', 'afghan-support-headless'); ?></strong></label><br>
            <input type="number" name="_asp_og_image_id" id="_asp_og_image_id" value="<?php echo esc_attr($og_image_id); ?>" style="width:100%">
            <small><?php _e('Enter the WordPress Media Library attachment ID.', 'afghan-support-headless'); ?></small>
        </p>
        <p>
            <label for="_asp_page_meta_language"><strong><?php _e('Language', 'afghan-support-headless'); ?></strong></label><br>
            <select name="_asp_page_meta_language" id="_asp_page_meta_language" style="width:100%">
                <option value="en" <?php selected($language, 'en'); ?>>English</option>
                <option value="dari" <?php selected($language, 'dari'); ?>>Dari</option>
                <option value="uzbek" <?php selected($language, 'uzbek'); ?>>Afghan Uzbek</option>
                <option value="pashto" <?php selected($language, 'pashto'); ?>>Pashto</option>
            </select>
        </p>
        <?php
    }

    public function save_meta_boxes(int $post_id): void {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        $post_type = get_post_type($post_id);

        if ($post_type === 'asp_event') {
            if (!isset($_POST['asp_event_meta_nonce']) || !wp_verify_nonce($_POST['asp_event_meta_nonce'], 'asp_event_meta')) {
                return;
            }
            $fields = [
                '_asp_event_category',
                '_asp_event_start_date',
                '_asp_event_end_date',
                '_asp_event_location',
                '_asp_cta_label',
                '_asp_cta_url',
                '_asp_event_language',
                '_asp_featured_image_id',
            ];
            foreach ($fields as $field) {
                if (isset($_POST[$field])) {
                    update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
                }
            }
        }

        if ($post_type === 'asp_page_meta') {
            if (!isset($_POST['asp_page_meta_nonce']) || !wp_verify_nonce($_POST['asp_page_meta_nonce'], 'asp_page_meta_meta')) {
                return;
            }
            $fields = [
                '_asp_route_key',
                '_asp_seo_title',
                '_asp_seo_description',
                '_asp_og_title',
                '_asp_og_description',
                '_asp_og_image_id',
                '_asp_page_meta_language',
            ];
            foreach ($fields as $field) {
                if (isset($_POST[$field])) {
                    update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
                }
            }
        }
    }

    public function trigger_revalidation(int $post_id, \WP_Post $post): void {
        // Ignore autosaves and revisions
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (wp_is_post_revision($post_id)) {
            return;
        }

        // Only trigger for our CPTs
        if ($post->post_type !== 'asp_event' && $post->post_type !== 'asp_page_meta') {
            return;
        }

        // Only revalidate if the post is actually published!
        if (get_post_status($post_id) !== 'publish') {
            return;
        }

        // Check configured URL and secret
        $url = defined('ASP_REVALIDATE_URL') ? ASP_REVALIDATE_URL : get_option('asp_revalidate_url', '');
        $secret = defined('ASP_REVALIDATE_SECRET') ? ASP_REVALIDATE_SECRET : get_option('asp_revalidate_secret', '');

        if (empty($url) || empty($secret)) {
            return;
        }

        // Define paths to revalidate
        $paths = [
            '/',
            '/events',
            '/events/[slug]',
            '/contact',
            '/immigration',
            '/resources',
            '/rights',
            '/stories',
            '/en',
            '/en/events',
            '/en/events/[slug]',
            '/en/contact',
            '/en/immigration',
            '/en/resources',
            '/en/rights',
            '/en/stories',
            '/uzbek',
            '/uzbek/events',
            '/uzbek/events/[slug]',
            '/uzbek/contact',
            '/uzbek/immigration',
            '/uzbek/resources',
            '/uzbek/rights',
            '/uzbek/stories',
            '/pashto',
            '/pashto/events',
            '/pashto/events/[slug]',
            '/pashto/contact',
            '/pashto/immigration',
            '/pashto/resources',
            '/pashto/rights',
            '/pashto/stories',
        ];

        // Send non-blocking remote post request to Next.js API
        wp_remote_post($url, [
            'method'      => 'POST',
            'timeout'     => 5,
            'redirection' => 5,
            'httpversion' => '1.0',
            'blocking'    => false, // Non-blocking!
            'headers'     => [
                'Content-Type' => 'application/json',
            ],
            'body'        => wp_json_encode([
                'secret' => $secret,
                'paths'  => $paths,
            ]),
            'cookies'     => [],
        ]);
    }

    public function register_rest_fields(): void {
        // Expose featured image URL on events
        register_rest_field('asp_event', 'featured_image_url', [
            'get_callback' => function ($post) {
                $image_id = get_post_meta($post['id'], '_asp_featured_image_id', true);
                if ($image_id) {
                    $url = wp_get_attachment_image_url((int) $image_id, 'full');
                    return $url ?: null;
                }
                return null;
            },
            'schema' => [
                'type'    => ['string', 'null'],
                'description' => 'Featured image URL',
            ],
        ]);

        // Expose OG image URL on page metadata
        register_rest_field('asp_page_meta', 'og_image_url', [
            'get_callback' => function ($post) {
                $image_id = get_post_meta($post['id'], '_asp_og_image_id', true);
                if ($image_id) {
                    $url = wp_get_attachment_image_url((int) $image_id, 'full');
                    return $url ?: null;
                }
                return null;
            },
            'schema' => [
                'type'    => ['string', 'null'],
                'description' => 'Open Graph image URL',
            ],
        ]);
    }

    private function append_meta_filter(array $args, string $key, string $value): array {
        $meta_query = $args['meta_query'] ?? [];

        if (!is_array($meta_query)) {
            $meta_query = [];
        }

        if (!isset($meta_query['relation'])) {
            $meta_query['relation'] = 'AND';
        }

        $meta_query[] = [
            'key'     => $key,
            'value'   => sanitize_text_field($value),
            'compare' => '=',
        ];

        $args['meta_query'] = $meta_query;
        return $args;
    }

    public function filter_event_rest_query(array $args, \WP_REST_Request $request): array {
        $lang = $request->get_param('lang');

        if (is_string($lang) && $lang !== '') {
            $args = $this->append_meta_filter($args, '_asp_event_language', $lang);
        }

        return $args;
    }

    public function filter_page_meta_rest_query(array $args, \WP_REST_Request $request): array {
        $lang = $request->get_param('lang');
        $route_key = $request->get_param('route_key');

        if (is_string($lang) && $lang !== '') {
            $args = $this->append_meta_filter($args, '_asp_page_meta_language', $lang);
        }

        if (is_string($route_key) && $route_key !== '') {
            $args = $this->append_meta_filter($args, '_asp_route_key', $route_key);
        }

        return $args;
    }

    /**
     * Call OpenRouter API with model fallback chain.
     *
     * @param array $payload Source fields for translation.
     * @return array|\WP_Error Parsed response or error.
     */
    private function call_openrouter(array $payload) {
        $api_key = defined('OPENROUTER_API_KEY') ? OPENROUTER_API_KEY : get_option('openrouter_api_key', '');
        if (empty($api_key)) {
            return new \WP_Error('no_api_key', 'OpenRouter API key is not configured.');
        }

        $prompt = $this->build_translation_prompt($payload);

        foreach (ASP_TRANSLATION_MODELS as $model) {
            $response = wp_remote_post('https://openrouter.ai/api/v1/chat/completions', [
                'timeout'     => 45,
                'headers'     => [
                    'Authorization' => 'Bearer ' . $api_key,
                    'Content-Type'  => 'application/json',
                    'HTTP-Referer'  => home_url(),
                    'X-Title'       => 'Afghan Support Phoenix Translation',
                ],
                'body'        => wp_json_encode([
                    'model'    => $model,
                    'response_format' => ['type' => 'json_object'],
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a professional translator for Afghan immigrant families in Phoenix, Arizona. Return ONLY valid JSON. Do not include markdown, explanations, or comments. Translate the English source into Dari, Pashto, and Afghan Uzbek in Arabic script. Preserve formal organization names, street addresses, phone numbers, URLs, and dates. Localize city/state names and generic venue words when they appear as display text. Do not add legal advice or invent details.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                ]),
            ]);

            if (is_wp_error($response)) {
                continue;
            }

            $status = wp_remote_retrieve_response_code($response);
            if ($status < 200 || $status >= 300) {
                continue;
            }

            $body = wp_remote_retrieve_body($response);
            $data = json_decode($body, true);

            if (!is_array($data) || !isset($data['choices'][0]['message']['content'])) {
                continue;
            }

            $content = $data['choices'][0]['message']['content'];
            $content = $this->extract_json_from_model_content($content);

            $parsed = json_decode($content, true);
            if (!is_array($parsed)) {
                continue;
            }

            $normalized = $this->normalize_translation_response($parsed);
            if (empty($normalized)) {
                continue;
            }

            return [
                'model' => $model,
                'data'  => $normalized,
            ];
        }

        return new \WP_Error('all_models_failed', 'All translation models failed. Please check your API key and try again.');
    }

    /**
     * Build the translation prompt from source payload.
     */
    private function build_translation_prompt(array $payload): string {
        $source = [
            'title'       => $payload['title'] ?? '',
            'description' => $payload['description'] ?? '',
            'location'    => $payload['location'] ?? '',
            'cta_label'   => $payload['cta_label'] ?? '',
        ];

        return "Translate this English event content into Dari, Pashto, and Afghan Uzbek.\n\n"
            . "Return exactly this JSON shape with no extra text:\n"
            . "{\n"
            . "  \"dari\": {\"title\": \"\", \"description_html\": \"\", \"location\": \"\", \"cta_label\": \"\"},\n"
            . "  \"pashto\": {\"title\": \"\", \"description_html\": \"\", \"location\": \"\", \"cta_label\": \"\"},\n"
            . "  \"uzbek\": {\"title\": \"\", \"description_html\": \"\", \"location\": \"\", \"cta_label\": \"\"}\n"
            . "}\n\n"
            . "Rules:\n"
            . "- Dari must be Afghan Persian in Arabic script.\n"
            . "- Pashto must be Pashto in Arabic script.\n"
            . "- Afghan Uzbek must be Uzbek used in Afghanistan in Arabic script, not Cyrillic and not Latin.\n"
            . "- Keep safe HTML tags from description_html only. If source description is plain text, wrap it in <p>...</p>.\n"
            . "- Preserve formal organization names, street addresses, URLs, phone numbers, and dates.\n"
            . "- Localize city/state names and generic venue words in the location field. For example, translate \"Phoenix, Arizona\" into the target language/script.\n"
            . "- If a source field is empty, return an empty string for that field.\n\n"
            . "Source JSON:\n"
            . wp_json_encode($source, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }

    /**
     * Extract JSON from model content, including markdown-fenced responses.
     */
    private function extract_json_from_model_content(string $content): string {
        $content = trim($content);
        $content = preg_replace('/^```(?:json)?\s*/i', '', $content);
        $content = preg_replace('/\s*```$/', '', $content);

        $start = strpos($content, '{');
        $end = strrpos($content, '}');

        if ($start !== false && $end !== false && $end > $start) {
            return substr($content, $start, $end - $start + 1);
        }

        return $content;
    }

    /**
     * Normalize model response into the expected language map.
     */
    private function normalize_translation_response(array $parsed): array {
        $languages = ['dari', 'pashto', 'uzbek'];
        $normalized = [];

        foreach ($languages as $lang) {
            if (!isset($parsed[$lang]) || !is_array($parsed[$lang])) {
                continue;
            }

            $item = $parsed[$lang];
            $normalized[$lang] = [
                'title'            => isset($item['title']) ? (string) $item['title'] : '',
                'description_html' => isset($item['description_html']) ? (string) $item['description_html'] : '',
                'location'         => isset($item['location']) ? (string) $item['location'] : '',
                'cta_label'        => isset($item['cta_label']) ? (string) $item['cta_label'] : '',
            ];
        }

        return $normalized;
    }

    /**
     * Generate translations for all three languages.
     */
    public function generate_translations(int $post_id): array {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'asp_event') {
            return ['success' => false, 'message' => 'Invalid event post.'];
        }

        $payload = [
            'title'       => $post->post_title,
            'description' => $post->post_content,
            'location'    => get_post_meta($post_id, '_asp_event_location', true),
            'cta_label'   => get_post_meta($post_id, '_asp_cta_label', true),
        ];

        $source_string = implode('|', array_map('strval', $payload));
        $source_hash = hash('sha256', $source_string);

        $languages = ['dari', 'pashto', 'uzbek'];
        $results = [];
        $any_success = false;
        $errors = [];
        $response = $this->call_openrouter($payload);

        if (is_wp_error($response)) {
            foreach ($languages as $lang) {
                update_post_meta($post_id, "_asp_translation_status_{$lang}", 'failed');
                $errors[] = $lang . ': ' . $response->get_error_message();
            }
        } else {
            $model = $response['model'] ?? 'unknown';
            $parsed = $response['data'] ?? [];

            foreach ($languages as $lang) {
                $lang_data = $parsed[$lang] ?? null;

                if (!is_array($lang_data)) {
                    update_post_meta($post_id, "_asp_translation_status_{$lang}", 'failed');
                    $errors[] = $lang . ': Missing data in response.';
                    continue;
                }

                // Sanitize and save fields. Only title is strictly required; optional
                // source fields may legitimately translate to an empty string.
                $title = isset($lang_data['title']) ? sanitize_text_field($lang_data['title']) : '';
                $description = isset($lang_data['description_html']) ? wp_kses_post($lang_data['description_html']) : '';
                $location = isset($lang_data['location']) ? sanitize_text_field($lang_data['location']) : '';
                $cta_label = isset($lang_data['cta_label']) ? sanitize_text_field($lang_data['cta_label']) : '';

                if (empty($title)) {
                    update_post_meta($post_id, "_asp_translation_status_{$lang}", 'failed');
                    $errors[] = $lang . ': Empty required title in response.';
                    continue;
                }

                update_post_meta($post_id, "_asp_event_title_{$lang}", $title);
                update_post_meta($post_id, "_asp_event_description_{$lang}", $description);
                update_post_meta($post_id, "_asp_event_location_{$lang}", $location);
                update_post_meta($post_id, "_asp_cta_label_{$lang}", $cta_label);
                update_post_meta($post_id, "_asp_translation_status_{$lang}", 'draft');
                update_post_meta($post_id, "_asp_translation_model_{$lang}", $model);
                update_post_meta($post_id, "_asp_translation_generated_at_{$lang}", gmdate('c'));

                $results[$lang] = 'draft';
                $any_success = true;
            }
        }

        if ($any_success) {
            update_post_meta($post_id, '_asp_translation_source_hash', $source_hash);
        }

        if (!empty($errors)) {
            update_post_meta($post_id, '_asp_translation_error', implode(' | ', $errors));
        } else {
            delete_post_meta($post_id, '_asp_translation_error');
        }

        // Trigger revalidation for event routes
        $this->trigger_event_revalidation($post_id);

        return [
            'success'     => $any_success,
            'results'     => $results,
            'errors'      => $errors,
            'source_hash' => $source_hash,
        ];
    }

    /**
     * AJAX handler for generating translations from admin.
     */
    public function ajax_generate_translations(): void {
        if (!isset($_POST['post_id']) || !isset($_POST['nonce'])) {
            wp_send_json_error('Missing parameters.');
        }

        $post_id = intval($_POST['post_id']);
        $nonce = sanitize_text_field(wp_unslash($_POST['nonce']));

        if (!wp_verify_nonce($nonce, 'asp_generate_translations_nonce')) {
            wp_send_json_error('Invalid nonce.');
        }

        if (!current_user_can('edit_post', $post_id)) {
            wp_send_json_error('Insufficient permissions.');
        }

        $result = $this->generate_translations($post_id);

        if ($result['success']) {
            wp_send_json_success($result);
        } else {
            wp_send_json_error($result['message'] ?? implode(' | ', $result['errors']));
        }
    }

    /**
     * Check if translations are stale after event save.
     */
    public function check_translation_stale(int $post_id, \WP_Post $post): void {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (wp_is_post_revision($post_id)) {
            return;
        }

        if ($post->post_type !== 'asp_event') {
            return;
        }

        $source_hash = get_post_meta($post_id, '_asp_translation_source_hash', true);
        if (empty($source_hash)) {
            return;
        }

        $payload = [
            'title'       => $post->post_title,
            'description' => $post->post_content,
            'location'    => get_post_meta($post_id, '_asp_event_location', true),
            'cta_label'   => get_post_meta($post_id, '_asp_cta_label', true),
        ];
        $current_hash = hash('sha256', implode('|', array_map('strval', $payload)));

        if ($current_hash === $source_hash) {
            return;
        }

        $languages = ['dari', 'pashto', 'uzbek'];
        $stale_set = false;

        foreach ($languages as $lang) {
            $status = get_post_meta($post_id, "_asp_translation_status_{$lang}", true);
            if ($status === 'draft' || $status === 'reviewed') {
                update_post_meta($post_id, "_asp_translation_status_{$lang}", 'stale');
                $stale_set = true;
            }
        }

        if ($stale_set) {
            update_post_meta($post_id, '_asp_translation_source_hash', $current_hash);
        }
    }

    /**
     * Trigger revalidation specifically for event routes.
     */
    private function trigger_event_revalidation(int $post_id): void {
        $post = get_post($post_id);
        if (!$post || $post->post_type !== 'asp_event') {
            return;
        }

        if (get_post_status($post_id) !== 'publish') {
            return;
        }

        $url = defined('ASP_REVALIDATE_URL') ? ASP_REVALIDATE_URL : get_option('asp_revalidate_url', '');
        $secret = defined('ASP_REVALIDATE_SECRET') ? ASP_REVALIDATE_SECRET : get_option('asp_revalidate_secret', '');

        if (empty($url) || empty($secret)) {
            return;
        }

        $paths = [
            '/events',
            '/events/' . $post->post_name,
            '/en/events',
            '/en/events/' . $post->post_name,
            '/pashto/events',
            '/pashto/events/' . $post->post_name,
            '/uzbek/events',
            '/uzbek/events/' . $post->post_name,
        ];

        wp_remote_post($url, [
            'method'      => 'POST',
            'timeout'     => 5,
            'redirection' => 5,
            'httpversion' => '1.0',
            'blocking'    => false,
            'headers'     => [
                'Content-Type' => 'application/json',
            ],
            'body'        => wp_json_encode([
                'secret' => $secret,
                'paths'  => $paths,
            ]),
            'cookies'     => [],
        ]);
    }
}

new Afghan_Support_Headless_Plugin();
