# Plan de Preparación para Producción — Estado y Pasos Faltantes

**Veredicto directo:** el plan correcto NO es revertir los fixes móviles ni buscar “pureza” arquitectónica a costa de romper UX. La web debe pulirse con cambios quirúrgicos: mantener lo que estabilizó móvil/RTL, corregir la pantalla vacía con una solución opt-in, endurecer PII con HMAC, regenerar el ZIP real de WordPress y agregar revalidación segura.

> Esta actualización es documental. No se ejecutó app, tests ni build. La intención es preservar lo que ya funciona y dejar claro qué tocar —y qué NO tocar— antes de producción.

---

## 1. Áreas protegidas — no cambiar de forma amplia

Estas piezas ya resolvieron bugs reales. No se deben reescribir ni “limpiar” de forma global sin una razón fuerte y QA móvil/RTL posterior.

| Área | Estado | Regla de protección |
|---|---:|---|
| Animaciones con `FadeIn` + `IntersectionObserver` | Estabilizado | No cambiar el comportamiento default para todo el sitio. Agregar mejoras opt-in solamente. |
| Menú móvil | Estabilizado | Mantener cierre por cambio de ruta y no volver a meter el selector de idioma dentro del drawer si eso reabre bugs. |
| `AppShell` | Estabilizado | Mantener el guard contra AppShell anidado para evitar header/footer/chatbot duplicados. |
| `headers()` en root layout | Tradeoff aceptado | Mantener mientras sea necesario para SSR correcto de `html lang` / `dir` y evitar flash LTR/RTL en Dari. |
| Chatbot | Estabilizado | Mantener determinístico: JSON local + keywords/scoring. No LLM, no embeddings, no API externa. |
| Formularios | Parcialmente protegido | No persistir submissions. Enviar por proveedor aprobado, escapar HTML y endurecer fingerprints con HMAC. |

**Principio:** arreglar con bisturí, no con martillo. Si una solución rompe móvil, RTL o el menú, NO es una solución aceptable para este proyecto.

---

## 2. Decisiones de arquitectura aceptadas

### 2.1 Mantener `headers()` en `app/src/app/layout.tsx`

**Decisión:** se acepta que el root layout lea `x-lang` y `x-dir` para renderizar desde servidor:

- `html lang="fa" dir="rtl"` en Dari.
- `html lang="uz" dir="ltr"` en Uzbek.
- `html lang="en" dir="ltr"` en inglés.

**Tradeoff:** esto puede reducir pureza estática/ISR del root, pero evita el flash visual donde Dari aparece primero como LTR y luego cambia a RTL. Para esta web, la UX multilingüe y accesible pesa más.

**Guardrail:** no volver a mover esto sin una alternativa probada que preserve SSR correcto de `lang/dir` y no duplique HTML/chrome.

### 2.2 Mantener el scroll reveal default, pero agregar `priority`

**Decisión:** no se debe convertir todo `FadeIn` a visible por defecto porque eso mata la experiencia de scroll reveal que ya se afinó. La solución correcta es agregar una prop opt-in:

```tsx
<FadeIn priority>
  ...contenido crítico above-the-fold...
</FadeIn>
```

- `priority={true}`: visible desde SSR, sin pantalla vacía en home/hero/secciones iniciales.
- default: mantiene `IntersectionObserver` y animación al scrollear.

---

## 3. P0 — cambios obligatorios antes de producción

### P0-1 — Corregir pantalla vacía sin romper animaciones móviles

- [x] Agregar prop `priority?: boolean` a `app/src/components/FadeIn.tsx`.
- [x] Si `priority` es `true`, renderizar con `opacity: 1` desde SSR.
- [x] Aplicar `priority` solo a contenido crítico above-the-fold: hero del home, título principal y primeras secciones visibles al cargar.
- [x] Mantener el comportamiento actual de `IntersectionObserver` para el resto del sitio.
- [x] Agregar fallback defensivo para que, si `IntersectionObserver` no dispara, el contenido no quede invisible indefinidamente.
- [x] Validar manualmente en iPhone Safari / Android Chrome: home, resources, rights, stories y events.

**Por qué:** hoy `FadeIn` inicia con `isVisible=false`, por lo que SSR puede servir `opacity: 0`. En móviles lentos o Safari, eso puede verse como home vacío hasta que hidrata React.

**No hacer:** no eliminar todas las animaciones, no cambiar globalmente todos los `FadeIn` a visible, no tocar el menú móvil para resolver esto.

---

### P0-2 — Proteger teléfono con HMAC

- [x] Cambiar `hashPhone()` en `app/src/lib/fingerprint.ts` para usar HMAC-SHA-256 con `RATE_LIMIT_HASH_SECRET`, igual que `hashIP()`.
- [x] Mantener normalización del teléfono antes de firmar: solo dígitos.
- [x] Actualizar tests de `fingerprint.test.ts`.
- [ ] Confirmar que `RATE_LIMIT_HASH_SECRET` existe en Vercel Production y Preview.

**Por qué:** SHA-256 simple no alcanza para teléfonos. Los números son enumerables; alguien puede generar hashes de posibles números y comparar. HMAC evita eso porque requiere el secreto server-side.

**No hacer:** no guardar teléfonos en DB, localStorage, WordPress ni analytics. Esto es solo fingerprint transitorio para rate limiting.

---

### P0-3 — Regenerar el ZIP del plugin WordPress

- [x] Regenerar `wordpress-plugin/afghan-support-headless.zip` desde el código actual.
- [x] Confirmar que el ZIP contiene `afghan-support-headless/afghan-support-headless.php` actualizado.
- [x] Comparar hash del PHP dentro del ZIP contra `wordpress-plugin/afghan-support-headless.php`.
- [x] No subir a Hostinger un ZIP viejo.

**Por qué:** el ZIP es lo que se instala en Hostinger. Si el ZIP no coincide con el PHP fuente, podés creer que subiste un fix de seguridad y en realidad instalar código anterior.

---

### P0-4 — Agregar webhook seguro de revalidación WordPress → Next.js

- [x] Agregar en el plugin un hook controlado sobre `save_post` para `asp_event` y `asp_page_meta`.
- [x] Ignorar autosaves, revisions y post types no relacionados.
- [x] Enviar un `wp_remote_post()` a `https://<dominio-vercel>/api/revalidate`.
- [x] El body debe ser JSON compatible con la route actual:

```json
{
  "secret": "<WORDPRESS_REVALIDATE_SECRET>",
  "paths": ["/", "/events", "/dari", "/dari/events", "/uzbek", "/uzbek/events"]
}
```

- [x] Usar headers `Content-Type: application/json`.
- [x] Usar timeout corto y preferiblemente modo no bloqueante para no hacer lenta la edición en wp-admin.
- [x] Guardar URL/secreto como constantes/option del plugin o documentar claramente dónde se configuran.
- [x] Probar edición de fecha en WordPress y confirmar que Vercel refleja el cambio sin esperar 1 hora.

**Por qué:** sin webhook, Next depende de `revalidate = 3600`. Eso explica cambios de fechas lentos.

**No hacer:** no exponer el secreto en frontend, no aceptar revalidación sin secret, no hacer webhook para cualquier post si no hace falta.

---

### P0-5 — Configuración final de dominio, CMS y variables

- [ ] Definir dominio público final: `https://<dominio-final>`.
- [ ] Definir subdominio CMS recomendado: `https://cms.<dominio-final>`.
- [ ] Configurar en Vercel:
  - `NEXT_PUBLIC_SITE_URL=https://<dominio-final>`
  - `WORDPRESS_API_BASE_URL=https://cms.<dominio-final>/wp-json/wp/v2`
  - `WORDPRESS_MEDIA_HOSTNAME=cms.<dominio-final>`
  - `WORDPRESS_REVALIDATE_SECRET=<secreto largo>`
  - `RATE_LIMIT_HASH_SECRET=<secreto largo>`
  - `RESEND_API_KEY`
  - `RESEND_FROM_EMAIL`
  - `CONTACT_TO_EMAIL`
  - `UPSTASH_REDIS_REST_URL`
  - `UPSTASH_REDIS_REST_TOKEN`
- [ ] Probar REST público de Hostinger antes de asumir que Vercel está fallando:
  - `/wp-json/wp/v2/events?lang=en`
  - `/wp-json/wp/v2/events?lang=dari`
  - `/wp-json/wp/v2/events?lang=uzbek`
  - `/wp-json/wp/v2/site-metadata?route_key=home&lang=en`

---

## 4. P1 — mejoras recomendadas antes del lanzamiento público

- [ ] **Optimización de videos:** `Video_main.mp4` y stories son pesados para móvil. Mantener poster instantáneo y comprimir videos con HandBrake/FFmpeg o moverlos a CDN/streaming si Lighthouse móvil sufre.
- [ ] **Chatbot móvil:** validar panel con teclado abierto en iOS Safari. Si se corta por barras dinámicas, usar `100dvh`/safe-area o estrategia con `visualViewport`.
- [ ] **Allowlist de `event.ctaUrl`:** permitir solo dominios aprobados para CTAs de WordPress. No es XSS directo, pero sí riesgo de phishing/confianza si alguien mete una URL externa maliciosa.
- [ ] **Cache tags de detalle:** `getEvents()` y metadata usan tags, pero `getEventBySlug()` debe quedar alineado si se quiere invalidación por tags consistente.
- [ ] **QA accesibilidad:** validar navegación por teclado en menú, chatbot, modal de registro y formularios.
- [ ] **Legal/traducciones:** contenido de derechos y traducciones Dari/Uzbek requieren revisión humana/aprobada antes del launch.

---

## 5. Checklist Hostinger — WordPress CMS

1. Instalar WordPress en `cms.<dominio-final>`.
2. Subir el ZIP regenerado del plugin.
3. Activar **Afghan Support Headless**.
4. Guardar permalinks en “Post name”.
5. Crear eventos reales y metadata mínima por idioma.
6. Verificar REST público.
7. Configurar/probar webhook de revalidación.
8. Proteger `/wp-admin`:
   - contraseña fuerte,
   - usuarios mínimos,
   - 2FA si Hostinger/plugin aprobado lo permite,
   - registro público desactivado,
   - plugins innecesarios evitados.
9. Confirmar que WordPress no almacena submissions de contacto/event registration.

---

## 6. Checklist Vercel — Frontend Next.js

1. Project root: `app/`.
2. Package manager: `pnpm`.
3. Install command: `pnpm install --frozen-lockfile`.
4. Build command en hosting: `pnpm build`.
5. Configurar todas las variables de entorno P0.
6. Configurar dominio final y redirección canónica (`www` o apex, uno solo como principal).
7. Validar headers en producción:
   - CSP,
   - `frame-ancestors`,
   - `X-Frame-Options`,
   - `nosniff`,
   - `Referrer-Policy`,
   - `Permissions-Policy`.
8. Probar forms reales con Resend productivo.
9. Probar rate limit con Upstash productivo.
10. Probar webhook de WordPress contra producción.

---

## 7. Definition of Done para producción

No marcar como production-ready hasta que esto esté cerrado:

- [ ] `FadeIn priority` implementado sin romper scroll reveal móvil.
- [ ] `hashPhone()` usa HMAC.
- [ ] ZIP WordPress regenerado y verificado contra PHP fuente.
- [ ] Plugin/webhook revalida Next.js al editar eventos/metadata.
- [ ] Variables Vercel production configuradas.
- [ ] REST de Hostinger responde correctamente.
- [ ] QA móvil real en iPhone Safari y Android Chrome.
- [ ] QA Dari RTL sin flash visual ni duplicación de chrome.
- [ ] Contact/event forms no persisten PII y envían email correctamente.
- [ ] Contenido legal y traducciones revisadas por humanos/aprobadas.

---

## 8. Resumen ejecutivo

La dirección actual es correcta: **preservar los fixes móviles/RTL y pulir con cambios puntuales**. Los cambios que sí valen la pena ahora son pequeños pero críticos: `FadeIn priority`, HMAC para teléfono, ZIP WordPress sincronizado, webhook de revalidación y checklist de dominio/Vercel/Hostinger.

No necesitamos romper la arquitectura para mejorarla. Necesitamos disciplina: tocar poco, probar bien, y no volver a abrir bugs que ya costó cerrar.
