# Plan de corrección para producción — Auditoría 2026-05-17

**Veredicto directo:** NO está listo para producción todavía. Hay buena base, pero hoy hay bloqueantes reales: `pnpm lint` falla, hay flujo nuevo de registro a eventos fuera del layout acordado, hay riesgo de PII en rate limiting/analytics, y la estrategia de cache/ISR de WordPress no está limpia.

> No corrí `pnpm run build`, respetando la regla del repo.

## Verificación ejecutada

| Check | Resultado | Nota |
|---|---:|---|
| `pnpm lint` | ❌ Falla | `EventRegistrationModal.tsx` setea estado dentro de effect; `HomePage.tsx` tiene `toPlainText` muerto. |
| `pnpm exec tsc --noEmit --incremental false` | ✅ Pasa | TypeScript no reportó errores. |
| `pnpm test` | ✅ Pasa | 4 archivos / 13 tests. |
| `pnpm audit --prod --audit-level moderate` | ❌ Falla | `postcss < 8.5.10` vía `next`. |
| `pnpm audit --audit-level moderate` | ❌ Falla | 16 vulnerabilidades, mayormente dev tooling; igual hay que resolver antes de release. |

---

## Lo que ya está bien encaminado

- [x] App Router existe bajo `app/src/app/**` con rutas raíz y rutas localizadas `dari` / `uzbek`.
- [x] Inglés canónico vive en rutas raíz; `[lang]` rechaza `en` mediante `assertValidLang`.
- [x] El chatbot es determinístico: JSON local + scoring de keywords. No hay LLM, embeddings ni API externa de chatbot.
- [x] El contenido legal principal está en locale JSON / componentes, no generado dinámicamente.
- [x] Contact form usa Route Handler, Zod, honeypot, Resend y `Cache-Control: no-store`.
- [x] WordPress queda limitado a eventos y metadata/SEO, alineado con la PRD.
- [x] Hay sanitización allowlist antes de renderizar HTML de eventos con `dangerouslySetInnerHTML`.
- [x] Hay headers de seguridad base: `nosniff`, `frame-ancestors 'none'`, `X-Frame-Options`, `Permissions-Policy`, CSP en producción.
- [x] `.next/`, `dist/`, `node_modules/`, `.env.local` y `*.tsbuildinfo` están ignorados por Git.

Eso es buena arquitectura de base. PERO base no es producción. Producción es disciplina: checks verdes, contratos claros y cero ambigüedad con PII.

---

## P0 — Bloqueantes antes de deploy

### Calidad / deployability

- [ ] **Arreglar `pnpm lint`.**
  - Evidencia: `app/src/features/events/EventRegistrationModal.tsx:46` dispara `react-hooks/set-state-in-effect`; `app/src/pages/HomePage.tsx:13` declara `toPlainText` sin uso.
  - Por qué importa: si el pipeline permite deploy con lint rojo, estamos normalizando deuda. Eso no es “rápido”; es frágil.

- [ ] **Resolver el estado Git antes de producción.**
  - Evidencia: hay archivos críticos sin trackear: `app/src/app/api/event-register/route.ts`, `app/src/features/events/EventRegistrationModal.tsx`, `app/src/features/events/EventRegistrationToast.tsx` e imágenes nuevas bajo `app/public/images/`.
  - Riesgo: Vercel desplegando desde Git no incluye archivos sin trackear. Resultado posible: build/deploy roto o UI referenciando assets inexistentes.

- [ ] **No aprobar producción hasta que `pnpm audit --prod --audit-level moderate` pase o quede una excepción documentada.**
  - Evidencia: `postcss < 8.5.10` aparece en dependencias productivas vía `next`.
  - Tradeoff: si no hay upgrade seguro inmediato, documentar riesgo + mitigación + fecha de revisión. No lo escondas bajo la alfombra.

### PII / privacidad

- [ ] **Dejar de usar IP cruda como key persistida en Upstash.**
  - Evidencia: `app/src/app/api/contact/route.ts:105-106` usa `ipRatelimit.limit(ip)`; `app/src/app/api/event-register/route.ts:107-108` usa `event-reg:${ip}`.
  - Por qué está mal: IP puede ser dato personal. El contrato del proyecto dice no almacenar PII en analytics/logs/DB.
  - Corrección: usar HMAC SHA-256 con secreto server-side para IP y teléfono (`RATE_LIMIT_HASH_SECRET`), nunca hash simple sin secreto.

- [ ] **Desactivar o justificar `analytics: true` en Upstash antes de producción.**
  - Evidencia: `contact/route.ts:75,80` y `event-register/route.ts:76`.
  - Riesgo: si Upstash conserva identificadores/eventos de rate limit, eso puede contradecir “no PII en analytics”.

- [ ] **Definir si el registro interno a eventos está aprobado.**
  - Evidencia: `EventDetail.tsx` abre `EventRegistrationModal` si no hay `event.ctaUrl`; la route `api/event-register` envía nombre + teléfono/email por Resend.
  - Comparación con spec: `Website_Layout_Afghan_Immigration.md` pide calendario/lista; la PRD dice que si hay registro, debe ir a un enlace externo aprobado o contacto. Esto implementa un mini booking interno. No asumas aprobación.
  - Corrección preferida: eliminar el modal interno y usar `ctaUrl` aprobado o `/contact`. Si se mantiene, requiere aprobación explícita, política de retención y controles PII.

- [ ] **Escapar HTML en emails; no alcanza con “sacar tags”.**
  - Evidencia: `contact/route.ts:211-219` y `event-register/route.ts:181-188` interpolan datos de usuario en `html`.
  - Corrección: usar `escapeHtml()` para `name`, `phone/contactValue`, `message`, `eventTitle`, y después convertir saltos de línea a `<br>`.

### Arquitectura App Router / cache

- [ ] **Sacar `headers()` del root layout o aceptar formalmente render dinámico global.**
  - Evidencia: `app/src/app/layout.tsx:21` usa `await headers()` para `x-lang` / `x-dir`.
  - Por qué importa: en App Router, `headers()` es Dynamic API y opta la ruta a dynamic rendering. Eso pelea con el objetivo de sitio mayormente estático/ISR.
  - Corrección: mover `lang/dir` a layouts por segmento (`[lang]/layout.tsx`) o una estrategia estática por ruta. Middleware/proxy puede redirigir, pero no debería forzar todo el árbol a dynamic.

- [ ] **Unificar la capa CMS/cache.**
  - Evidencia: las páginas importan `@/server/cms/wordpress` directamente (`app/page.tsx`, `app/events/page.tsx`, `[lang]/events/page.tsx`); `cms-cache.ts` casi no se usa salvo `clearCmsCache()` en revalidate.
  - Riesgo: el endpoint `/api/revalidate` limpia un cache custom que las páginas no consultan. Eso es arquitectura placebo.
  - Corrección: usar una sola estrategia: `fetch(..., { next: { revalidate: 3600, tags: [...] } })` + `revalidateTag`, o wrapper cacheado real. No mezcles cache manual huérfana con ISR.

---

## P1 — Importante antes de launch público

- [ ] **Ordenar eventos por fecha real del evento, no por fecha de publicación WordPress.**
  - Evidencia: `wordpress.ts:57-58` pide `orderby=date&order=desc`; eso ordena por post date salvo query meta custom.
  - Corrección: ordenar en mapper/route por `startDate` ascendente para eventos futuros, o hacer `meta_key=_asp_event_start_date&orderby=meta_value` en WordPress si el REST lo permite.

- [ ] **Evitar doble fetch de eventos/metadata.**
  - Evidencia: `generateMetadata()` y la página pueden llamar WordPress por separado; `generateEventDetailMetadata()` vuelve a pedir el evento que la página también pide.
  - Corrección: cache por URL/tag o wrapper compartido por request.

- [ ] **Validar/allowlistear `event.ctaUrl`.**
  - Evidencia: `EventDetail.tsx` renderiza `event.ctaUrl` como link externo.
  - Riesgo: un editor WordPress puede publicar una URL no aprobada. No es XSS, pero sí riesgo de phishing/confianza.
  - Corrección: permitir solo dominios aprobados o marcar links externos claramente.

- [ ] **Comprimir o mover videos grandes a CDN/streaming.**
  - Evidencia: videos locales de 17–28 MB (`Story_5.mp4`, `Story_1.mp4`, etc.).
  - Riesgo: Lighthouse/performance móvil sufre, más para familias en dispositivos modestos.

- [ ] **Migrar imágenes críticas a `next/image` o justificar `<img>`.**
  - Evidencia: la UI usa muchos `<img>` en páginas y componentes.
  - Corrección: usar `next/image` en hero/cards cuando se conozcan dimensiones. Ganas optimización, tamaños correctos y menos layout shift.

- [ ] **Revisar CSP de producción.**
  - Evidencia: `script-src` mantiene `'unsafe-inline'`; `style-src` también.
  - Tradeoff: puede ser aceptable con Next/Tailwind y velocidad de entrega, pero debe quedar documentado. Más seguro: nonce/hashes donde aplique.

- [ ] **Agregar `Cache-Control: no-store` explícito para `/api/event-register`.**
  - Evidencia: `next.config.ts` cubre `/api/contact` y `/api/revalidate`, pero no `/api/event-register`.
  - La route ya responde `no-store`; igual conviene cubrirla en config para consistencia operacional.

- [ ] **Agregar fallback de eventos cuando WordPress esté caído.**
  - Evidencia: `wordpress.ts` devuelve `[]`; la página queda vacía con “no events”. Eso no crashea, pero puede ocultar contenido operativo.
  - Corrección: fallback estático mínimo aprobado o mensaje explícito “llamá/contactanos para próximos eventos”.

- [ ] **Eliminar o justificar assets no referenciados.**
  - Detectados: `app/public/images/Community_home.jpg`, `event-workshop.jpg`, `img-about.jpg`, `img-rights.jpg`.

---

## Comparación con `Website_Layout_Afghan_Immigration.md`

| Sección acordada | Estado | Brecha |
|---|---:|---|
| Header: logo, menú, idiomas, CTA Get Help Now | Parcial | Existe, pero hay que QA en EN/Dari/Uzbek y confirmar que el CTA es consistente en móvil/desktop. |
| Home hero: family picture, headline, subtext, CTA visible | Parcial | Hay video hero y el CTA principal dentro del hero apunta a Rights, no a “Get Help Now”. Puede ser decisión visual, pero no coincide literal con el layout. |
| Quick access | OK | Immigration, Rights, Resources, Events están presentes. |
| About snapshot | OK | Presente. |
| Announcements/events preview | OK técnico | Dinámico desde WordPress, pero revisar cache/ordering. |
| Immigration Help | OK | Servicios, idiomas y contacto aparecen. |
| Know Your Rights | Parcial | Contenido, PDFs y disclaimer existen; falta sign-off legal y revisar si el video de “past clients” requerido está cubierto por Stories o falta en Rights. |
| Community Resources | OK | English classes, mental health, food banks, health clinics están. |
| Events Calendar | Parcial | Lista/calendario existen; el registro interno no estaba en layout y requiere aprobación. |
| Contact Page | OK técnico | Form name/phone/message + WhatsApp/phone/email/map presentes; falta PII/provider approval. |
| Stories / Community Impact | OK con QA | Videos presentes; revisar tamaño, captions y autorización de uso. |

---

## Obsoleto / sospechoso

- [ ] `app/src/server/cms/cms-cache.ts`: wrapper de cache no usado por las páginas; hoy solo se limpia en revalidate. O se usa de verdad o se elimina.
- [ ] `app/src/pages/HomePage.tsx:13-18`: `toPlainText` muerto; causa lint rojo.
- [ ] Imágenes no referenciadas: `Community_home.jpg`, `event-workshop.jpg`, `img-about.jpg`, `img-rights.jpg`.
- [ ] Archivos generados locales (`app/.next/`, `app/dist/`, `app/tsconfig.tsbuildinfo`) existen en disco pero están ignorados. No subir por FTP/manual deploy.
- [ ] `wordpress-plugin/afghan-support-headless.zip`: confirmar que corresponde al PHP actual antes de subir a Hostinger; si no, regenerar zip.

---

## Checklist manual de despliegue

### Repo / release

- [ ] Dejar `git status` limpio o con un commit/release branch claro.
- [ ] Asegurar que archivos nuevos críticos estén trackeados si se van a desplegar.
- [ ] Confirmar que no se suben `.env.local`, `.next/`, `dist/`, `node_modules/`, `*.tsbuildinfo`.
- [ ] Correr y dejar verdes: `pnpm lint`, `pnpm exec tsc --noEmit --incremental false`, `pnpm test`, `pnpm audit --prod --audit-level moderate`.
- [ ] No correr build local salvo override explícito del maintainer; Vercel hará build en deploy.

### Vercel / hosting Next.js

- [ ] Project root: `app/`.
- [ ] Package manager: `pnpm`.
- [ ] Install command: `pnpm install --frozen-lockfile`.
- [ ] Build command en hosting: `pnpm build`.
- [ ] Framework preset: Next.js.
- [ ] Node version compatible con Next 16/React 19.
- [ ] Configurar dominio final y redirección canónica (`www` → apex o apex → `www`, uno solo).
- [ ] HTTPS activo.
- [ ] Revisar headers en producción: CSP, `frame-ancestors`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.

### Variables de entorno en producción

- [ ] `NEXT_PUBLIC_SITE_URL=https://<dominio-final>`.
- [ ] `WORDPRESS_API_BASE_URL=https://<cms-domain>/wp-json/wp/v2`.
- [ ] `WORDPRESS_MEDIA_HOSTNAME=<cms-domain>`.
- [ ] `WORDPRESS_REVALIDATE_SECRET=<secreto largo random>`.
- [ ] `RESEND_API_KEY=<production key>`.
- [ ] `RESEND_FROM_EMAIL=<sender verificado>`.
- [ ] `CONTACT_TO_EMAIL=<inbox aprobada>`.
- [ ] `UPSTASH_REDIS_REST_URL=<production redis>`.
- [ ] `UPSTASH_REDIS_REST_TOKEN=<production token>`.
- [ ] Si se corrige PII hashing: `RATE_LIMIT_HASH_SECRET=<secreto largo random>`.

### DNS / email

- [ ] DNS del sitio apuntando a Vercel según proveedor: CNAME/ALIAS/A record según corresponda.
- [ ] DNS de Resend configurado: SPF, DKIM y DMARC.
- [ ] Sender domain verificado en Resend.
- [ ] Probar envío real a `CONTACT_TO_EMAIL` desde producción.
- [ ] Rotar claves usadas durante desarrollo.

### WordPress / Hostinger

- [ ] Instalar/actualizar plugin `afghan-support-headless` con zip generado desde el PHP actual.
- [ ] Activar plugin y guardar permalinks.
- [ ] Crear/verificar eventos en EN/Dari/Uzbek o definir fallback inglés aprobado.
- [ ] Crear/verificar metadata SEO por ruta e idioma.
- [ ] Subir media aprobada para eventos/OG.
- [ ] Probar REST público: `/wp-json/wp/v2/events?lang=en` y `/site-metadata?route_key=home&lang=en`.
- [ ] Configurar webhook WordPress → `https://<site>/api/revalidate` con `WORDPRESS_REVALIDATE_SECRET`.
- [ ] Probar revalidation con secreto válido e inválido.
- [ ] Proteger `/wp-admin`: contraseñas fuertes, 2FA si está disponible, usuarios mínimos.
- [ ] Noindex para el subdominio CMS si no debe aparecer públicamente.

### Privacidad / legal

- [ ] Aprobar Resend como procesador de datos y documentar retención.
- [ ] Aprobar Upstash como procesador de datos o desactivar cualquier analytics/retención incompatible.
- [ ] Confirmar que no se persiste PII en DB, localStorage, analytics, logs, WordPress o archivos estáticos.
- [ ] Revisar contenido legal/rights con reviewer calificado.
- [ ] Revisar traducciones Dari/Uzbek con hablantes fluidos/nativos.
- [ ] Confirmar autorizaciones de uso para imágenes/videos/testimonios.
- [ ] Confirmar que chatbot/rights no generan consejo legal dinámico.

### QA final

- [ ] Navegación completa EN.
- [ ] Navegación completa Dari, con RTL desde primer render.
- [ ] Navegación completa Uzbek.
- [ ] Contact form: éxito, validación, rate limit, honeypot, error Resend.
- [ ] Eventos: list view, calendar view, detalle, CTA/registro aprobado.
- [ ] Rights PDFs: EN/Dari/Uzbek abren/descargan.
- [ ] Chatbot: respuestas determinísticas, links internos localizados, PDF/teléfono/WhatsApp.
- [ ] Keyboard-only nav: header, main, forms, chatbot, modals, footer.
- [ ] Lighthouse: performance/accessibility/SEO según PRD.
- [ ] Sitemap y robots usan dominio final.

---

## Referencias técnicas usadas para esta auditoría

- Next.js `headers()` es Dynamic API y opta a dynamic rendering: https://nextjs.org/docs/app/api-reference/functions/headers
- Next.js `revalidatePath` requiere `type` para rutas dinámicas: https://nextjs.org/docs/app/api-reference/functions/revalidatePath
- Next.js Proxy reemplaza Middleware desde Next 16: https://nextjs.org/docs/app/getting-started/proxy
- Next.js Image Optimization: https://nextjs.org/docs/app/building-your-application/optimizing/images
