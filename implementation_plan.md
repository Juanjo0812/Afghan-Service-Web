# Generación de traducciones de eventos desde WordPress

## Decisión

La persona que manejará WordPress creará los eventos **sólo en inglés**. Para que los eventos aparezcan en Dari, Pashto y Afghan Uzbek sin depender de traducción en runtime público, WordPress tendrá un botón de admin:

```text
Evento en inglés
  ↓
Botón "Generate Translations"
  ↓
OpenRouter con modelos gratis + fallback
  ↓
Guardar borradores en post_meta
  ↓
Next.js lee campos guardados o cae a inglés
```

Esta es la solución preferida porque la web pública no llama LLMs al renderizar, los textos quedan editables/revisables en WordPress y los eventos nunca quedan vacíos por falta de registros duplicados por idioma.

---

## Problema

Hoy `getEvents(lang)` pide eventos filtrados por `lang`. El plugin de WordPress traduce ese parámetro a un filtro sobre `_asp_event_language`.

Si todos los eventos se crean como **English**, entonces:

- `/en/events` sí encuentra eventos.
- `/events`, `/pashto/events` y `/uzbek/events` pueden quedar vacíos.
- El problema no es visual: WordPress directamente no devuelve eventos para esos idiomas.

---

## Solución propuesta

### Principios

1. **English es la fuente única de verdad** para eventos.
2. Las traducciones son **borradores guardados**, no generación invisible en la página pública.
3. Si una traducción falta o falla, la app muestra inglés como fallback.
4. OpenRouter se usa sólo desde WordPress admin.
5. Dari, Pashto y Afghan Uzbek deben quedar editables para revisión humana.

### Idiomas generados

| Idioma destino | Campo público | Nota |
|---|---|---|
| Dari | `/events` | RTL, `fa-AF` en la app |
| Pashto | `/pashto/events` | RTL, `ps-AF` |
| Afghan Uzbek | `/uzbek/events` | RTL, escritura árabe, `uz-Arab-AF` |

---

## User Review Required

> [!IMPORTANT]
> **OpenRouter Free no es garantía de disponibilidad.** Los modelos `:free` pueden tener límites, latencia o caídas. Por eso se usa en admin, con fallback y guardado persistente.

> [!WARNING]
> **Las traducciones son borradores.** Dari, Pashto y Afghan Uzbek deben quedar marcados como `draft` hasta revisión humana. Esto importa especialmente por contenido migratorio/legal.

> [!IMPORTANT]
> **API key requerida en WordPress/Hostinger:** se necesita `OPENROUTER_API_KEY` configurada en el plugin, no en el frontend público.

---

## Proposed Changes

### 1. WordPress plugin: campos de traducción

#### [MODIFY] [afghan-support-headless.php](file:///j:/Web-Afghan-Migrations/wordpress-plugin/afghan-support-headless.php)

Agregar `post_meta` para guardar traducciones por idioma.

Campos por idioma:

- `_asp_event_title_dari`
- `_asp_event_description_dari`
- `_asp_event_location_dari`
- `_asp_cta_label_dari`
- `_asp_event_title_pashto`
- `_asp_event_description_pashto`
- `_asp_event_location_pashto`
- `_asp_cta_label_pashto`
- `_asp_event_title_uzbek`
- `_asp_event_description_uzbek`
- `_asp_event_location_uzbek`
- `_asp_cta_label_uzbek`

Campos de control:

- `_asp_translation_status_dari`: `empty | draft | reviewed | stale | failed`
- `_asp_translation_status_pashto`
- `_asp_translation_status_uzbek`
- `_asp_translation_model_dari`
- `_asp_translation_model_pashto`
- `_asp_translation_model_uzbek`
- `_asp_translation_generated_at_dari`
- `_asp_translation_generated_at_pashto`
- `_asp_translation_generated_at_uzbek`
- `_asp_translation_source_hash`
- `_asp_translation_error`

Todos los campos necesarios para lectura pública deben tener `show_in_rest => true`.

---

### 2. WordPress admin: botón Generate Translations

#### [MODIFY] [afghan-support-headless.php](file:///j:/Web-Afghan-Migrations/wordpress-plugin/afghan-support-headless.php)

Agregar un botón en el metabox de eventos:

```text
Generate Translations
```

Comportamiento:

1. Sólo usuarios con permisos de edición del evento pueden ejecutarlo.
2. Validar nonce.
3. Tomar como fuente:
   - `post_title`
   - `post_content`
   - `_asp_event_location`
   - `_asp_cta_label`
4. Calcular `source_hash`.
5. Llamar a OpenRouter para Dari, Pashto y Afghan Uzbek.
6. Guardar traducciones en `post_meta`.
7. Marcar cada idioma como `draft`.
8. Guardar modelo usado y timestamp.
9. Disparar revalidación hacia Next.js.

Si el inglés cambia después de generar traducciones:

- comparar hash actual vs `_asp_translation_source_hash`;
- mostrar aviso en admin;
- marcar traducciones como `stale` hasta regenerar o revisar.

---

### 3. OpenRouter service en el plugin

#### [MODIFY] [afghan-support-headless.php](file:///j:/Web-Afghan-Migrations/wordpress-plugin/afghan-support-headless.php)

Agregar un cliente REST liviano usando `wp_remote_post()` contra:

```text
https://openrouter.ai/api/v1/chat/completions
```

Modelo/fallback recomendado:

```json
{
  "model": "moonshotai/kimi-k2.6:free",
  "models": [
    "qwen/qwen3-235b-a22b:free",
    "openrouter/free"
  ]
}
```

> Nota: verificar el ID exacto de Qwen disponible en OpenRouter al implementar, porque la lista de modelos gratis cambia.

Prompt recomendado:

```text
You are translating public event content for Afghan immigrant families in Phoenix, Arizona.

Translate from English into:
- Dari (Afghan Persian), Arabic script
- Pashto, Arabic script
- Afghan Uzbek, Arabic script

Return strict JSON only:
{
  "dari": {
    "title": "",
    "description_html": "",
    "location": "",
    "cta_label": ""
  },
  "pashto": {
    "title": "",
    "description_html": "",
    "location": "",
    "cta_label": ""
  },
  "uzbek": {
    "title": "",
    "description_html": "",
    "location": "",
    "cta_label": ""
  }
}

Rules:
- Preserve names, addresses, phone numbers, URLs, dates, and organization names.
- Do not add legal advice.
- Do not invent details.
- Keep safe HTML tags from the input description only.
- If uncertain, translate conservatively.
```

Parsing:

- Rechazar respuestas que no sean JSON válido.
- Sanitizar HTML antes de guardar.
- Si un idioma falla, guardar los otros y marcar el idioma fallido como `failed`.

Configuración:

- `OPENROUTER_API_KEY` por constante PHP o setting del plugin.
- Opcional: `ASP_OPENROUTER_SITE_URL`
- Opcional: `ASP_OPENROUTER_SITE_NAME`

---

### 4. WordPress REST: exponer traducciones

#### [MODIFY] [afghan-support-headless.php](file:///j:/Web-Afghan-Migrations/wordpress-plugin/afghan-support-headless.php)

Actualizar el registro de meta para que Next.js reciba:

- traducciones;
- status;
- modelo usado;
- timestamps;
- hash.

No crear posts duplicados por idioma para eventos. Los eventos se siguen creando una vez en inglés.

---

### 5. Next.js CMS layer: leer fuente inglesa + traducciones guardadas

#### [MODIFY] [wordpress.schemas.ts](file:///j:/Web-Afghan-Migrations/app/src/server/cms/wordpress.schemas.ts)

Agregar al schema los nuevos campos meta de traducción.

#### [MODIFY] [wordpress.ts](file:///j:/Web-Afghan-Migrations/app/src/server/cms/wordpress.ts)

Cambiar `getEvents(lang)`:

- siempre pedir eventos fuente en inglés:

```text
/events?_embed&per_page=100&orderby=date&order=desc&lang=en
```

- no pedir `lang=dari`, `lang=pashto` ni `lang=uzbek` para eventos;
- mantener `getPageMetadata(routeKey, lang)` como está, porque metadata sí puede existir por idioma.

Cambiar `getEventBySlug(slug, lang)`:

```text
/events?_embed&slug=<slug>&lang=en
```

Esto permite que `/pashto/events/<english-slug>` encuentre el evento fuente y muestre campos traducidos si existen.

#### [MODIFY] [wordpress.mappers.ts](file:///j:/Web-Afghan-Migrations/app/src/server/cms/wordpress.mappers.ts)

`mapWPEventToDomain(wp, lang)` debe elegir campos así:

```text
if lang === "en":
  title = wp.title.rendered
  description = wp.content.rendered
  location = _asp_event_location
  ctaLabel = _asp_cta_label

if lang !== "en":
  title = translated title for lang OR wp.title.rendered
  description = translated description for lang OR wp.content.rendered
  location = translated location for lang OR _asp_event_location
  ctaLabel = translated cta label for lang OR _asp_cta_label
```

Agregar metadata opcional al dominio si ayuda en UI/admin/debug:

```ts
translationStatus?: 'empty' | 'draft' | 'reviewed' | 'stale' | 'failed'
translationModel?: string
translationGeneratedAt?: string
```

La UI pública no debe bloquearse por status `draft`; sólo lo usamos para revisión interna.

---

### 6. Revalidation

Después de guardar traducciones, el plugin debe llamar el endpoint existente:

```text
POST /api/revalidate
```

Debe revalidar las rutas de eventos en todos los idiomas:

- `/events`
- `/events/[slug]`
- `/en/events`
- `/en/events/[slug]`
- `/uzbek/events`
- `/uzbek/events/[slug]`
- `/pashto/events`
- `/pashto/events/[slug]`

También puede usar la matriz completa ya definida en el plugin si se quiere simplificar.

---

## Out of Scope

- No traducir eventos en runtime público de Next.js.
- No usar LLMs para chatbot.
- No generar consejos legales.
- No crear posts duplicados por idioma para cada evento.
- No depender de modelos pagos salvo aprobación explícita.

---

## Verification Plan

### Automated Tests

Agregar tests para:

- `mapWPEventToDomain()` usa campos ingleses cuando `lang === 'en'`.
- `mapWPEventToDomain()` usa campos Dari/Pashto/Afghan Uzbek cuando existen.
- `mapWPEventToDomain()` cae a inglés cuando falta una traducción.
- `getEvents('pashto')`, `getEvents('dari')`, `getEvents('uzbek')` piden `lang=en` al endpoint WordPress.
- El parser de respuesta OpenRouter rechaza JSON inválido.
- El generador no borra traducciones existentes si falla un idioma.

```bash
pnpm test
```

### Manual Verification

1. Configurar `OPENROUTER_API_KEY` en WordPress/Hostinger.
2. Crear o editar un evento en inglés.
3. Click en **Generate Translations**.
4. Confirmar que se llenan campos Dari, Pashto y Afghan Uzbek.
5. Confirmar status `draft`.
6. Navegar:
   - `/en/events` — inglés original.
   - `/events` — Dari guardado.
   - `/pashto/events` — Pashto guardado.
   - `/uzbek/events` — Afghan Uzbek guardado en escritura árabe.
7. Cambiar el título inglés y confirmar aviso `stale`.
8. Probar OpenRouter sin API key: el admin debe mostrar error claro y la web debe seguir mostrando inglés.

### Typecheck & Lint

```bash
pnpm lint
pnpm exec tsc --noEmit --incremental false
```

No correr build local salvo autorización explícita del maintainer.
