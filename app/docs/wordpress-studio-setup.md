# WordPress Studio Setup Guide

This guide walks through installing WordPress Studio locally, activating the Afghan Support Headless plugin, and importing seed data so the Next.js frontend can fetch content from WordPress.

## Prerequisites

- macOS or Windows (WordPress Studio supports both).
- The `wordpress-plugin/` folder from this repository.

## Step 1: Install WordPress Studio

1. Download WordPress Studio from [developer.wordpress.com/docs/developer-tools/studio](https://developer.wordpress.com/docs/developer-tools/studio/).
2. Install and open the application.
3. Create a new local site. Give it a name like `afghan-support-local`.
4. Note the local URL (typically `http://localhost:8888` or similar).

## Step 2: Install the Plugin

1. In WordPress Studio, click **Open in Finder / Explorer** to open the site's files.
2. Navigate to `wp-content/plugins/`.
3. Copy the `wordpress-plugin` folder from this repository into that directory.
4. Rename the copied folder to `afghan-support-headless`.

Alternatively, using the terminal:

```bash
# macOS example — adjust path to your WordPress Studio site
cp -r /path/to/repo/wordpress-plugin ~/Studio/afghan-support-local/wp-content/plugins/afghan-support-headless

# Windows PowerShell example
copy-item -Recurse J:\Web-Afghan-Migrations\wordpress-plugin C:\Users\YourName\Studio\afghan-support-local\wp-content\plugins\afghan-support-headless
```

## Step 3: Activate the Plugin

1. Go to the WordPress admin dashboard (`http://localhost:8888/wp-admin`).
2. Navigate to **Plugins > Installed Plugins**.
3. Find **Afghan Support Headless** and click **Activate**.
4. You should now see two new menu items in the left sidebar:
   - **Events**
   - **Site Metadata**

## Step 4: Verify REST API Endpoints

Open your browser or a REST client and test:

```
http://localhost:8888/wp-json/wp/v2/events
http://localhost:8888/wp-json/wp/v2/site-metadata
```

Both should return `[]` (empty arrays) because no content exists yet.

## Step 5: Import Seed Data

Seed data lives in `wordpress-plugin/seed/`. You can import it manually or via a script.

### Manual Import (Recommended for First Time)

#### Events

1. Go to **Events > Add New** in WordPress admin.
2. Create each event from `seed/events.json`:
   - Enter the **Title**.
   - Paste the `content` into the editor.
   - Fill in the **Event Details** metabox fields (category, start date, location, etc.).
   - Set the **Language** field.
   - Publish.
3. Repeat for all events in the file.

#### Site Metadata

1. Go to **Site Metadata > Add New**.
2. Create each record from `seed/site-metadata.json`:
   - Enter the **Title** (for admin reference only).
   - Fill in the **Page Metadata** metabox fields (route key, SEO title, description, OG fields, language).
   - Publish.
3. Repeat for all metadata records.

### Scripted Import (Advanced)

If you have WP CLI access in WordPress Studio, you can write a small PHP script or use the REST API to bulk-import the JSON.

Example REST API import via curl:

```bash
# Import an event
curl -X POST http://localhost:8888/wp-json/wp/v2/events \
  -u "username:password" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Community Immigration Workshop",
    "slug": "community-immigration-workshop",
    "content": "Join us for a free immigration workshop...",
    "meta": {
      "_asp_event_category": "immigration",
      "_asp_event_start_date": "2026-06-15T09:00:00",
      "_asp_event_end_date": "2026-06-15T13:00:00",
      "_asp_event_location": "Catholic Charities Community Center, 1825 W Northern Ave, Phoenix, AZ 85021",
      "_asp_cta_label": "Register Now",
      "_asp_cta_url": "https://afghansupport.org/contact",
      "_asp_event_language": "en",
      "_asp_featured_image_id": 0
    }
  }'
```

## Step 6: Test the Edit-to-Refresh Loop

1. Open the Next.js frontend (`pnpm dev` in the `app/` folder).
2. Visit the events page.
3. In WordPress Studio, edit an event title.
4. Save the event.
5. Refresh the Next.js events page.
6. The updated title should appear without any code changes.

> Note: Next.js caches WordPress data for performance. If you do not see the update immediately, wait up to the revalidation interval or trigger a revalidation via the ISR webhook.

## Step 7: Set Environment Variables

In the Next.js frontend, create or update `.env.local`:

```env
WORDPRESS_API_BASE_URL=http://localhost:8888/wp-json/wp/v2
WORDPRESS_MEDIA_HOSTNAME=localhost
```

Restart the Next.js dev server after changing env vars.

## Step 8: Add a Featured Image (Optional)

1. Go to **Media > Add New** in WordPress admin.
2. Upload an image.
3. Note the attachment ID (hover over the image in the media grid to see the ID in the URL).
4. Edit an event and enter that ID in the **Featured Image ID** field.
5. The image URL will be exposed in the REST API response.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| REST API returns 404 | Go to **Settings > Permalinks** and click **Save Changes** to flush rewrite rules. |
| Meta fields not in REST response | Ensure the plugin is active and the post was saved after activation. |
| Next.js cannot reach WordPress | Verify `WORDPRESS_API_BASE_URL` points to the correct local URL. |
| CORS errors | WordPress Studio should not produce CORS issues locally. If it does, check that no security plugin is blocking requests. |

## Next Steps

Once the local proof works:

1. Deploy the same plugin to Hostinger production.
2. Update the Next.js env vars to point to the production WordPress URL.
3. Re-import or recreate the seed data on production.
4. Update `next.config.ts` image remote patterns for the production media hostname.

## Support

For plugin code changes, contact the development team. For content edits, use the WordPress admin.
