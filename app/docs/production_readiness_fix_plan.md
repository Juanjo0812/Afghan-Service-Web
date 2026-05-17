# Production readiness fix plan — verificación 2026-05-17

**Veredicto directo:** ya no estamos en el estado crítico del primer audit. La mayoría de P0 técnicos fueron corregidos y los checks locales permitidos pasan. Pero **todavía no lo marcaría production-ready sin resolver/validar la revalidación WordPress**, completar QA manual real y cerrar decisiones operativas de privacidad/proveedores.

> No se ejecutó `pnpm run build`, respetando la regla del repo. El build debe correr en el hosting/deploy pipeline.

---

## 1. Evidencia verificada

| Check | Estado | Evidencia |
|---|---:|---|
| `pnpm lint` | ✅ | Pasa. |
| `pnpm exec tsc --noEmit --incremental false` | ✅ | Pasa. |
| `pnpm test` | ✅ | Pasa. |
| `pnpm audit --prod --audit-level moderate` | ✅ | Sin vulnerabilidades conocidas. |
| `pnpm audit --audit-level moderate` | ✅ | Sin vulnerabilidades conocidas. |
| `git status` | ✅/⚠️ | Estaba limpio antes de actualizar este documento; ahora este archivo queda modificado por esta verificación. |
| WordPress REST directo | ✅ | La API configurada devuelve eventos con fechas actuales. El síntoma de fechas lentas apunta a cache/revalidación Next.js, no a WordPress como fuente. |

---

## 2. P0 originales — estado actual

| Ítem | Estado | Conclusión |
|---|---:|---|
| Lint rojo | ✅ Corregido | Ya no bloquea deploy. |
| Archivos críticos sin trackear | ✅ Corregido | No se detectaron archivos nuevos críticos fuera de Git antes de este doc update. |
| `pnpm audit --prod` fallaba por `postcss` | ✅ Corregido | Audit productivo pasa. |
| IP cruda en Upstash | ✅/⚠️ Parcialmente corregido | Upstash usa hash/HMAC y `analytics: false`; el fallback en memoria todavía usa IP cruda como key efímera. Producción debe tener Upstash configurado para no depender del fallback. |
| `analytics: true` en Upstash | ✅ Corregido | APIs usan `analytics: false`. |
| Registro interno a eventos sin aprobación | ✅ Resuelto por PRD | La PRD actual marca el modal interno como aprobado por cliente el 2026-05-17. No borrarlo. |
| HTML sin escapar en emails | ✅ Corregido | Inputs se escapan antes de interpolar HTML. |
| `headers()` en root layout | ✅ Corregido | `app/src/app/layout.tsx` ya no usa `headers()`. Queda en `[lang]/layout.tsx`, acotado a rutas localizadas. |
| Cache CMS manual huérfana | ⚠️ Todavía débil | Las páginas importan `cms-cache`, pero la invalidación por tags no está conectada a fetches etiquetados. Ver sección WordPress. |

---

## 3. WordPress: por qué las fechas tardan más

**Diagnóstico:** no parece un problema de WordPress devolviendo datos viejos. El REST configurado devuelve fechas actuales. Lo que cambió es la arquitectura de cache: al sacar `headers()` del root layout, el sitio vuelve a comportarse más como estático/ISR. Eso es correcto para producción, pero significa que los cambios de WordPress pueden tardar hasta `revalidate = 3600` segundos si el webhook de revalidación no corre bien.

### Hallazgos técnicos

- [x] Las páginas de home/eventos tienen `export const revalidate = 3600`.
- [x] Existe `/api/revalidate` y llama `revalidatePath()` para rutas principales.
- [ ] `clearCmsCache()` llama `revalidateTag('events')` y `revalidateTag('metadata')`, pero los `fetch()` a WordPress no tienen `next.tags`; entonces esa parte de la invalidación es prácticamente placebo.
- [ ] Si WordPress cambia una fecha y el webhook no llama `/api/revalidate` con el secreto correcto, el usuario puede ver cache viejo hasta 1 hora.

### Checklist para cerrar el problema de fechas

- [ ] Confirmar en WordPress/Hostinger que el webhook se dispara al crear/editar/publicar eventos.
- [ ] Confirmar que el webhook llama `https://<dominio>/api/revalidate` con `WORDPRESS_REVALIDATE_SECRET` correcto.
- [ ] Probar manualmente el endpoint con secreto válido después de cambiar una fecha.
- [ ] Etiquetar los fetches de WordPress con `next: { tags: [...] }` y usar `revalidateTag(tag, { expire: 0 })` en el webhook, o eliminar tags y depender solo de `revalidatePath()`.
- [ ] Considerar bajar el TTL de eventos de `3600` a `60` si el cliente necesita ver cambios casi inmediatos sin depender tanto del webhook.

**Recomendación de arquitectura:** webhook + tags reales. Si el cliente edita fechas seguido, `3600` está bien solo si el webhook funciona perfecto; si no, es demasiado lento para operación diaria.

---

## 4. P1 que siguen importando

- [ ] **Allowlist para `event.ctaUrl`.** Hoy `EventDetail.tsx` renderiza la URL de WordPress como link externo. No es XSS, pero sí riesgo de confianza/phishing si un editor o plugin mete una URL no aprobada.
- [ ] **Doble fetch posible en metadata + page.** Next memoiza algunos fetches iguales durante render, pero conviene revisar event detail y metadata para no duplicar llamadas innecesarias.
- [ ] **Videos pesados.** Hay assets locales grandes; falta QA de performance móvil real/Lighthouse.
- [ ] **CSP con `'unsafe-inline'`.** Puede ser aceptable para este release si queda documentado, pero no es el ideal de seguridad.
- [ ] **Fallback de eventos.** Si WordPress cae, el sitio puede quedar sin eventos en vez de mostrar contenido estático aprobado o un mensaje operacional claro.
- [ ] **Aprobaciones manuales.** Falta cierre formal de traducciones Dari/Uzbek, contenido legal, derechos de imagen/video y proveedores Resend/Upstash.

---

## 5. Comparación contra `Website_Layout_Afghan_Immigration.md`

| Sección acordada | Estado | Brecha real |
|---|---:|---|
| Header con logo, menú, idiomas, CTA | ✅/⚠️ | Implementado; falta QA final móvil/RTL. |
| Home hero con bienvenida, subtexto y CTA | ✅/⚠️ | Implementado con dirección visual propia; confirmar que CTA “Get Help Now” sea suficientemente visible. |
| Quick access: Immigration/Rights/Resources/Events | ✅ | Cumple. |
| About snapshot | ✅ | Cumple. |
| Announcements/events preview | ⚠️ | Funciona, pero depende de cerrar cache/revalidación WordPress. |
| Immigration Help | ✅ | Cumple base. |
| Know Your Rights + downloads/videos | ✅/⚠️ | Cumple técnico; falta sign-off legal y QA de archivos aprobados. |
| Community Resources | ✅ | Cumple base. |
| Events calendar/list | ✅/⚠️ | Cumple; registro interno ahora está aprobado en PRD, pero la cache de fechas sigue pendiente. |
| Contact page | ✅/⚠️ | Cumple técnico; falta cierre de proveedor/privacidad. |
| Stories / Community Impact | ✅/⚠️ | Cumple si assets están aprobados; falta QA performance/autorización. |

---

## 6. Checklist manual de deploy

### Repo / release

- [ ] Dejar `git status` limpio con este documento committeado o descartado.
- [ ] Confirmar que no se suben `.env.local`, `.next/`, `dist/`, `node_modules/`, `*.tsbuildinfo`.
- [ ] Verificar otra vez antes del release: `pnpm lint`, `pnpm exec tsc --noEmit --incremental false`, `pnpm test`, `pnpm audit --prod --audit-level moderate`.
- [ ] No correr build local salvo override explícito; el hosting debe correrlo.

### Vercel / hosting Next.js

- [ ] Project root: `app/`.
- [ ] Package manager: `pnpm`.
- [ ] Install command: `pnpm install --frozen-lockfile`.
- [ ] Build command en hosting: `pnpm build`.
- [ ] Framework preset: Next.js.
- [ ] Node version compatible con Next 16 / React 19.
- [ ] Dominio canónico definido: apex o `www`, no ambos compitiendo.
- [ ] HTTPS activo.
- [ ] Revisar headers reales en producción: CSP, `frame-ancestors`, `nosniff`, `Referrer-Policy`, `Permissions-Policy`.

### Variables de entorno producción

- [ ] `NEXT_PUBLIC_SITE_URL=https://<dominio-final>`.
- [ ] `WORDPRESS_API_BASE_URL=https://<cms-domain>/wp-json/wp/v2`.
- [ ] `WORDPRESS_MEDIA_HOSTNAME=<cms-domain>`.
- [ ] `WORDPRESS_REVALIDATE_SECRET=<secreto largo random>`.
- [ ] `RESEND_API_KEY=<production key>`.
- [ ] `RESEND_FROM_EMAIL=<sender verificado>`.
- [ ] `CONTACT_TO_EMAIL=<inbox aprobada>`.
- [ ] `UPSTASH_REDIS_REST_URL=<production redis>`.
- [ ] `UPSTASH_REDIS_REST_TOKEN=<production token>`.
- [ ] `RATE_LIMIT_HASH_SECRET=<secreto largo random>`.

### WordPress / Hostinger

- [ ] Instalar/actualizar plugin `afghan-support-headless` generado desde el PHP actual.
- [ ] Guardar permalinks después de activar/actualizar plugin.
- [ ] Probar REST público: `/wp-json/wp/v2/events?lang=en` y metadata por idioma/ruta.
- [ ] Configurar webhook WordPress → `/api/revalidate` con secreto correcto.
- [ ] Probar edición de fecha en WordPress y verificar cuánto tarda en `/events` producción.
- [ ] Proteger `/wp-admin`: usuarios mínimos, password fuerte, 2FA si está disponible.
- [ ] Noindex para CMS si no debe indexarse públicamente.

### Privacidad / legal / contenido

- [ ] Aprobar Resend como procesador de datos.
- [ ] Aprobar Upstash como procesador de datos o documentar retención compatible con no PII.
- [ ] Confirmar que no se persiste PII en DB, localStorage, analytics, logs o WordPress.
- [ ] Revisar contenido legal/rights con reviewer calificado.
- [ ] Revisar traducciones Dari/Uzbek con hablantes fluidos/nativos.
- [ ] Confirmar autorizaciones de imágenes, videos y testimonios.
- [ ] Confirmar que chatbot/rights no generan consejo legal dinámico.

### QA final

- [ ] Navegación completa EN.
- [ ] Navegación completa Dari con RTL desde primer render.
- [ ] Navegación completa Uzbek.
- [ ] Contact form: éxito, validación, rate limit, honeypot y error Resend.
- [ ] Event registration modal: éxito, validación, rate limit, honeypot y error Resend.
- [ ] Eventos: list view, calendar view, detalle, CTA externo y modal interno aprobado.
- [ ] Rights PDFs: EN/Dari/Uzbek abren/descargan.
- [ ] Chatbot: respuestas determinísticas, links internos localizados, PDF/teléfono/WhatsApp.
- [ ] Keyboard-only nav: header, main, forms, chatbot, modals, footer.
- [ ] Lighthouse/performance/accessibility/SEO según PRD.
- [ ] Sitemap y robots usan dominio final.

---

## 7. Referencias técnicas

- Next.js `fetch`: `next.revalidate` y `next.tags` definen cache y tags de datos.
- Next.js `revalidateTag`: los tags deben existir primero en `fetch(..., { next: { tags } })`; para webhooks con expiración inmediata se puede usar `{ expire: 0 }`.
- Next.js `revalidatePath`: en Route Handlers marca la ruta para regenerarse en la próxima visita; en rutas dinámicas requiere el parámetro `type`.
