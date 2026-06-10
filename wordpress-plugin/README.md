# Afghan Support Headless WordPress Plugin

WordPress plugin that powers the content-managed areas of the Afghan Support Phoenix Next.js frontend: events and page metadata (SEO/Open Graph).

## What it does

- Registers two Custom Post Types:
  - **Events** (`asp_event`) — client-editable events with category, dates, location, CTA, and featured image.
  - **Site Metadata** (`asp_page_meta`) — per-route SEO and Open Graph metadata.
- Exposes both post types through the WordPress REST API.
- Adds admin metaboxes so staff can edit structured fields without code changes.
- Does NOT require ACF, Elementor, or any page builder — uses native WordPress meta.

## Installation (WordPress Studio — Local)

1. Install [WordPress Studio](https://developer.wordpress.com/docs/developer-tools/studio/).
2. Create a new local site.
3. In your terminal, navigate to the site's `wp-content/plugins/` folder.
4. Copy or symlink this `wordpress-plugin` folder into it:
   ```bash
   cp -r /path/to/repo/wordpress-plugin /path/to/wp-site/wp-content/plugins/afghan-support-headless
   ```
5. Go to **Plugins** in the WordPress admin and activate **Afghan Support Headless**.
6. Visit **Events > Add New** to create your first event.
7. Visit **Site Metadata > Add New** to create page metadata records.

## Installation (Hostinger — Production)

1. Log in to your Hostinger WordPress admin.
2. Go to **Plugins > Add New > Upload Plugin**.
3. Zip this `wordpress-plugin` folder and upload it.
4. Activate the plugin.
5. Create events and metadata entries as needed.

## REST API Endpoints

Once activated, the following endpoints are available (assuming pretty permalinks):

| Endpoint | Description |
|----------|-------------|
| `/wp-json/wp/v2/events` | List all events |
| `/wp-json/wp/v2/events?lang=en` | Filter by language (`dari`, `en`, `uzbek`, `pashto`) |
| `/wp-json/wp/v2/events?slug=my-event` | Get a single event by slug |
| `/wp-json/wp/v2/site-metadata` | List all page metadata records |
| `/wp-json/wp/v2/site-metadata?route_key=events&lang=en` | Filter by route and language (`dari`, `en`, `uzbek`, `pashto`) |

## Language Support

Both post types support four languages:

- `en` — English
- `dari` — Dari (RTL)
- `uzbek` — Afghan Uzbek (Arabic script, RTL)
- `pashto` — Pashto (RTL)

Set the language field on each event or metadata record so the Next.js frontend can fetch the correct content per route.

## Meta Fields

### Events (`asp_event`)

| Field | REST Key | Type |
|-------|----------|------|
| Category | `_asp_event_category` | string |
| Start Date | `_asp_event_start_date` | string (ISO 8601) |
| End Date | `_asp_event_end_date` | string (ISO 8601) |
| Location | `_asp_event_location` | string |
| CTA Label | `_asp_cta_label` | string |
| CTA URL | `_asp_cta_url` | string |
| Language | `_asp_event_language` | string |
| Featured Image ID | `_asp_featured_image_id` | integer |

### Site Metadata (`asp_page_meta`)

| Field | REST Key | Type |
|-------|----------|------|
| Route Key | `_asp_route_key` | string |
| SEO Title | `_asp_seo_title` | string |
| SEO Description | `_asp_seo_description` | string |
| OG Title | `_asp_og_title` | string |
| OG Description | `_asp_og_description` | string |
| OG Image ID | `_asp_og_image_id` | integer |
| Language | `_asp_page_meta_language` | string |

## Webhook Configuration (Next.js Revalidation)

To enable automatic revalidation (ISR clear) on the Next.js frontend when events or metadata are created, updated, or published, you need to configure the webhook target URL and secret.

You can configure these in one of two ways:

### Option A: Defining constants in `wp-config.php` (Recommended for production)

Add the following lines to your WordPress `wp-config.php` file:

```php
define('ASP_REVALIDATE_URL', 'https://your-nextjs-site.vercel.app/api/revalidate');
define('ASP_REVALIDATE_SECRET', 'your_secure_revalidation_secret_here');
```

### Option B: WordPress Options database

If you cannot edit `wp-config.php`, you can set these values as WordPress options in your database (e.g., via WP-CLI or a database manager):

- Option name `asp_revalidate_url` with your Next.js webhook URL.
- Option name `asp_revalidate_secret` with your secure revalidation secret.

## OpenRouter Configuration (Event Translation Button)

The **Generate Translations** button runs from WordPress admin and calls OpenRouter server-side. Configure the API key in WordPress/Hostinger, not in Vercel and never in frontend code.

### Option A: Defining constant in `wp-config.php` (Recommended for production)

Add this line to your WordPress `wp-config.php` file, above the line that says `/* That's all, stop editing! */`:

```php
define('OPENROUTER_API_KEY', 'your_openrouter_api_key_here');
```

### Option B: WordPress Options database

If you cannot edit `wp-config.php`, set this WordPress option via WP-CLI, a database manager, or a secure admin-only helper:

- Option name `openrouter_api_key` with your OpenRouter API key.

Recommended WP-CLI command:

```bash
wp option update openrouter_api_key 'your_openrouter_api_key_here'
```

After configuring the key:

1. Open an English event in WordPress admin.
2. Click **Generate Translations**.
3. Confirm Dari, Pashto, and Afghan Uzbek statuses become `draft`.
4. Review/edit generated translations before marking them as production-ready.

## Seed Data

Import the JSON files in `seed/` using your preferred method (WP CLI, admin import, or a custom script) to populate initial events and metadata for testing.

## Updating

When you update the plugin:

1. Deactivate the old version.
2. Replace the plugin folder with the new version.
3. Reactivate.

Existing events and metadata will remain intact.

## Support

For changes to this plugin, contact the development team. Content staff should use the WordPress admin only — never edit plugin files directly.
