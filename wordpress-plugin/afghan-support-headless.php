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

class Afghan_Support_Headless_Plugin {

    public function __construct() {
        add_action('init', [$this, 'register_post_types']);
        add_action('init', [$this, 'register_meta_fields']);
        add_action('add_meta_boxes', [$this, 'add_meta_boxes']);
        add_action('save_post', [$this, 'save_meta_boxes']);
        add_action('rest_api_init', [$this, 'register_rest_fields']);
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
            '_asp_event_language'      => ['type' => 'string',  'description' => 'Language code: en, dari, or uzbek'],
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

        $page_meta = [
            '_asp_route_key'           => ['type' => 'string',  'description' => 'Route key, e.g. home, events, contact'],
            '_asp_seo_title'           => ['type' => 'string',  'description' => 'SEO title'],
            '_asp_seo_description'     => ['type' => 'string',  'description' => 'SEO meta description'],
            '_asp_og_title'            => ['type' => 'string',  'description' => 'Open Graph title'],
            '_asp_og_description'      => ['type' => 'string',  'description' => 'Open Graph description'],
            '_asp_og_image_id'         => ['type' => 'integer', 'description' => 'Open Graph image attachment ID'],
            '_asp_page_meta_language'  => ['type' => 'string',  'description' => 'Language code: en, dari, or uzbek'],
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
                <option value="uzbek" <?php selected($language, 'uzbek'); ?>>Uzbek</option>
            </select>
        </p>
        <p>
            <label for="_asp_featured_image_id"><strong><?php _e('Featured Image ID', 'afghan-support-headless'); ?></strong></label><br>
            <input type="number" name="_asp_featured_image_id" id="_asp_featured_image_id" value="<?php echo esc_attr($image_id); ?>" style="width:100%">
            <small><?php _e('Enter the WordPress Media Library attachment ID.', 'afghan-support-headless'); ?></small>
        </p>
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
                <option value="uzbek" <?php selected($language, 'uzbek'); ?>>Uzbek</option>
            </select>
        </p>
        <?php
    }

    public function save_meta_boxes(int $post_id): void {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
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
}

new Afghan_Support_Headless_Plugin();
