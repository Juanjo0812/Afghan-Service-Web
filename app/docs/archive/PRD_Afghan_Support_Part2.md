# PRD — Afghan Support Phoenix (Parte 2)

Continuación de [PRD Part 1](file:///C:/Users/jjmor/.gemini/antigravity/brain/076cd716-f9cb-48ab-a05b-89c57e3953d4/PRD_Afghan_Support_Part1.md)

---

## 10. Requerimientos No Funcionales

### 10.1 Accesibilidad (WCAG 2.2 AA)

| Req | Detalle |
|---|---|
| A11Y-01 | Contraste mínimo 4.5:1 en texto, 3:1 en texto grande |
| A11Y-02 | Navegación completa por teclado (Tab, Enter, Escape, Arrow keys) |
| A11Y-03 | `aria-label`, `role`, `aria-modal` en todos los elementos interactivos |
| A11Y-04 | Skip-to-content link oculto pero accesible por teclado |
| A11Y-05 | Focus visible (`focus-visible:ring`) en todos los elementos interactivos |
| A11Y-06 | Videos con `aria-hidden="true"` cuando son decorativos |
| A11Y-07 | Formularios con labels asociados (`htmlFor` o `aria-label`) |
| A11Y-08 | Alt text descriptivo en todas las imágenes funcionales |
| A11Y-09 | `prefers-reduced-motion`: desactivar animaciones GSAP/Framer |
| A11Y-10 | Soporte RTL para Dari y Pashto (`dir="rtl"` en `<html>`) |

### 10.2 Performance

| Req | Target |
|---|---|
| PERF-01 | LCP < 2.5s en 4G |
| PERF-02 | INP < 200ms (reemplaza FID desde marzo 2024) |
| PERF-03 | CLS < 0.1 |
| PERF-04 | Bundle JS < 200KB gzipped (actualmente sobredimensionado por Radix) |
| PERF-05 | Videos: formato WebM con fallback MP4, poster frame |
| PERF-06 | Imágenes: WebP/AVIF con fallback, srcset para responsive |
| PERF-07 | Lazy loading de secciones below-the-fold |
| PERF-08 | Font display: swap (ya implementado via Google Fonts `display=swap`) |
| PERF-09 | Preload del video hero principal |
| PERF-10 | Video hero: comprimir a <3MB, formato WebM, poster frame, UN solo `<video>` element (no 3 simultáneos) |
| PERF-11 | Imágenes avatar: convertir PNG→WebP, target <50KB por avatar (actual: ~650KB c/u) |

### 10.3 Responsive Design

| Breakpoint | Layout |
|---|---|
| < 640px (mobile) | Stack vertical, hamburger menu, scroll horizontal testimonials |
| 640-1024px (tablet) | 2 columnas en grids, nav colapsada |
| > 1024px (desktop) | Full layout, nav horizontal, 3 columnas en grids |

### 10.4 Seguridad

| Req | Detalle |
|---|---|
| SEC-01 | HTTPS obligatorio |
| SEC-02 | CSP headers en deploy (Vercel/Netlify config) |
| SEC-03 | Sanitización de inputs en formulario |
| SEC-04 | No almacenar PII en ningún lado (ni localStorage para datos de formulario) |
| SEC-05 | Rate limiting en serverless email endpoint |
| SEC-06 | Honeypot field anti-spam en formulario |
| SEC-07 | No exponer API keys en frontend |

### 10.5 SEO

| Req | Detalle |
|---|---|
| SEO-01 | Meta tags dinámicos con `react-helmet-async` |
| SEO-02 | `<title>` descriptivo: "Afghan Support Phoenix — Free Immigration & Community Help" |
| SEO-03 | `<meta name="description">` optimizado |
| SEO-04 | Open Graph + Twitter Card meta tags |
| SEO-05 | Prerendering plugin (`vite-plugin-prerender`) para HTML estático indexable |
| SEO-06 | Structured data JSON-LD (Organization, LocalBusiness) |
| SEO-07 | `sitemap.xml` y `robots.txt` en `/public` |
| SEO-08 | Canonical URL |
| SEO-09 | `hreflang` tags para versiones multilingüe |

### 10.6 Mantenibilidad

| Req | Detalle |
|---|---|
| MNT-01 | Contenido externalizado en JSON: eventos, recursos, testimonios, chatbot KB |
| MNT-02 | Design tokens centralizados en CSS variables (ya parcialmente en `index.css`) |
| MNT-03 | Componentes tipados con TypeScript strict |
| MNT-04 | Estructura de archivos clara: `sections/`, `components/`, `data/`, `locales/` |
| MNT-05 | Eliminar dependencias no utilizadas (recharts, input-otp, cmdk, etc.) |

---

## 11. Reglas del Chatbot Determinista

### 11.1 Flujo de Interacción

```
[Usuario abre chatbot]
    ↓
[Bot]: "Welcome to Afghan Support. How can we help you today?
       Select a topic or type your question."
    ↓
[Mostrar botones quick action en grid 2x3]:
  • Immigration Help
  • Know Your Rights
  • Community Resources
  • Events
  • Contact Us
  • Speak to Someone
    ↓
[Si click en botón] → Respuesta predeterminada + scroll a sección
[Si input texto] → Keyword matching → Respuesta desde JSON
[Si no hay match] → Fallback message
```

### 11.2 Motor de Matching

**Algoritmo**: Scoring aditivo ponderado — no usa ratio ni umbrales proporcionales, lo que lo hace resistente a queries en lenguaje natural con palabras de relleno.

**Tiers de scoring (puntos acumulativos por entrada del KB):**

| Tier | Puntos | Condición |
|------|--------|-----------|
| Keyword exacto | +10 | Token del input coincide exactamente con una keyword del KB |
| Phrase match | +8 | Frase multi-palabra del KB aparece como substring en el input |
| Mención de sección | +6 | El input menciona una categoría (ej: "immigration" → todas las entradas de #services) |
| Match parcial | +4 | Token y keyword se contienen mutuamente (substring, mínimo 3 caracteres) |
| Body text | +2 | Token aparece en el texto de respuesta de la entrada (mínimo 3 caracteres) |

**Lógica de decisión (4 niveles):**

| Condición | Resultado |
|-----------|-----------|
| Score ≥ 10 y ventaja > 4 pts sobre el 2º | Respuesta directa con botones de acción |
| Score ≥ 5 y scores empatados (gap ≤ 4) | "Did you mean..." — muestra top 3 candidatos con botones |
| Score ≥ 5 y ganador claro (gap > 4 o único candidato) | Respuesta directa |
| Score < 5 | Fallback: mensaje genérico + quick actions |

| Fuente | `/src/data/chatbot-kb.json` — array de `{ keywords: string[], response: string, section?: string, actions?: [] }` |
| Sin IA | No usar embeddings, no usar LLMs, no llamar APIs externas |
| Idioma | Keyword sets por idioma (`keywords_en`, `keywords_dari`, etc.) |
| Motor | `/src/lib/matchKeywords.ts` — función pura, sin dependencias externas |

### 11.3 Mensaje de Fallback

```
"I couldn't find specific information about that topic. 
For immediate assistance, please call us at (602) 555-0147 
or use WhatsApp. You can also browse the topics below."

[Mostrar botones quick action de nuevo]
```

### 11.4 Estructura del Knowledge Base

```json
{
  "entries": [
    {
      "id": "asylum",
      "keywords_en": ["asylum", "political asylum", "refugee", "persecution"],
      "keywords_dari": ["پناهندگی", "پناهنده"],
      "response_en": "We provide free assistance with asylum applications...",
      "response_dari": "ما در درخواست پناهندگی کمک رایگان ارائه می‌دهیم...",
      "section": "#services",
      "actions": [
        { "label": "Go to Immigration Help", "href": "#services" },
        { "label": "Contact Us", "href": "#contact" }
      ]
    }
  ]
}
```

### 11.5 Reglas Estrictas

- ❌ NO generar respuestas — solo seleccionar de JSON
- ❌ NO llamar APIs externas (OpenAI, Google, etc.)
- ❌ NO usar modelos de machine learning
- ❌ NO almacenar historial de conversación en servidor
- ✅ Matching por keywords con scoring determinista
- ✅ Botones de navegación post-respuesta
- ✅ Respuestas multilingüe desde JSON

---

## 12. Modelo de Contenido y Manejo de Datos

### Fuentes de datos

| Tipo | Fuente | Formato |
|---|---|---|
| Contenido de secciones | JSON local o constantes TS | Estático |
| Traducciones | `/src/locales/{lang}.json` | JSON |
| Chatbot KB | `/src/data/chatbot-kb.json` | JSON |
| Eventos | `/src/data/events.json` | JSON |
| Testimonios | `/src/data/testimonials.json` | JSON |
| Recursos | `/src/data/resources.json` | JSON |
| Derechos legales | Constantes TS (contenido sensible, revisado) | Estático |

### Formulario de Contacto

```
Input → Validación (zod) → Serverless API → Email → Respuesta UI
```

- **Servicio recomendado**: Resend (free tier: 100 emails/día, API simple, TypeScript SDK)
- **Alternativas**: Formspree, EmailJS, Netlify Forms
- **NO guardar** datos del formulario en ningún almacenamiento persistente

---

## 13. Recomendaciones de Diseño Visual

### Paleta de Colores (ya definida y correcta)

| Token | Valor | Uso |
|---|---|---|
| `--color-primary` | `#162d5a` (Navy) | Headings, nav, fondos oscuros |
| `--color-accent` | `#b87333` (Copper) | CTAs, badges, acentos |
| `--color-bg-sand` | `#faf5ef` | Fondo principal |
| `--color-bg-cream` | `#f5efe7` | Fondo alternativo secciones |
| `--color-text` | `#1a1a2e` | Texto body |
| `--color-text-secondary` | `#6b6b7b` | Texto secundario |

### Tipografía

| Uso | Fuente | Peso |
|---|---|---|
| Headings | Cormorant Garamond | 600 (semibold) |
| Body, UI, Labels | Inter | 400, 500 |

### Principios de Diseño

- ✅ Institucional y sobrio — NO startup, NO SaaS
- ✅ Cálido y humano — colores tierra (copper + sand), tipografía serif para headings
- ✅ Buena jerarquía visual — labels uppercase small → heading grande → body → CTA
- ✅ Espaciado consistente — `clamp()` para padding responsive
- ✅ Bordes rectos o mínimamente redondeados (`--radius: 0rem` — correcto)
- ❌ NO cards tipo burbuja (border-radius alto)
- ❌ NO glassmorphism
- ❌ NO gradientes agresivos
- ❌ NO dark mode tipo startup
- ❌ NO fondos negros puros (usar navy `#162d5a` o dark `#1a1a2e`)

---

## 14. Reglas de Interacción y Animación

| Tipo | Implementación | Duración |
|---|---|---|
| Fade-in al scroll | GSAP ScrollTrigger, `opacity: 0 → 1`, `y: 30 → 0` | 0.5-0.8s |
| Hover en cards | `translateY(-4px)` + shadow sutil + border-color change | 0.3-0.4s |
| Hover en links | Color transition a `--color-accent` | 0.3s |
| Parallax hero | Capas de video con velocidades diferentes | Continuo |
| Smooth scroll | Lenis library para scroll nativo suave | Global |
| Modal entrada | Framer Motion: scale 0.97 → 1, opacity 0 → 1 | 0.25-0.3s |
| Chatbot entrada | CSS keyframes slideIn (translateY 16px → 0) | 0.35s |
| Stagger en grids | GSAP stagger 0.08-0.12s entre cards | Per card |

### Reglas estrictas

- ❌ NO bouncing, NO shaking, NO rotating
- ❌ NO parallax agresivo que cause mareo
- ❌ NO animaciones que bloqueen interacción
- ✅ Respetar `prefers-reduced-motion` → desactivar TODAS las animaciones
- ✅ Ease: `power3.out` o `ease-out` — nunca linear

---

## 15. Accesibilidad para Usuarios Mayores

| Req | Detalle |
|---|---|
| ELD-01 | Font size mínimo 16px para body text (actualmente 14-15px en varias secciones — **necesita ajuste**) |
| ELD-02 | Tap targets mínimo 44x44px en mobile |
| ELD-03 | Contraste alto en CTAs — copper sobre sand tiene 3.8:1 → **evaluar ajustar a 4.5:1** |
| ELD-04 | Navegación lineal y predecible — scroll vertical simple |
| ELD-05 | Labels claros en formularios — NO solo placeholder text (agregar `<label>`) |
| ELD-06 | Botón del chatbot suficientemente grande (64px — ✅ correcto) |
| ELD-07 | Textos claros sin jerga técnica |
| ELD-08 | Teléfono clickable (`tel:` link) para llamar directamente |
| ELD-09 | WhatsApp como botón prominente (no solo texto informativo) |
| ELD-10 | Evitar gestos complejos — scroll horizontal con flechas visibles |

> [!WARNING]
> **Contraste**: El copper `#b87333` sobre sand `#faf5ef` da ~3.8:1, que NO cumple WCAG AA para texto normal. Opciones: (1) oscurecer copper a `#96592a` para 4.5:1, o (2) usar copper SOLO en elementos grandes (headings, botones con fondo) donde 3:1 es suficiente.

---

## 16. Criterios de Éxito

| Métrica | Target | Cómo medir |
|---|---|---|
| Lighthouse Performance | ≥ 90 | Lighthouse CI |
| Lighthouse Accessibility | ≥ 95 | Lighthouse CI |
| Lighthouse SEO | ≥ 90 | Lighthouse CI |
| LCP | < 2.5s | Core Web Vitals |
| Formularios enviados/mes | ≥ 20 | Analytics de email provider |
| Tasa de rebote | < 50% | Analytics (Plausible o Simple Analytics — privacidad first) |
| Chatbot interactions/mes | ≥ 50 | Evento custom en analytics |
| Idiomas utilizados | ≥ 2 activos | Analytics de i18n toggle |
| Tiempo de carga en 3G | < 5s | WebPageTest |

---

## 17. Riesgos y Mitigaciones

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | Traducciones incorrectas en Dari/Pashto/Uzbek | Alta | Alto | Revisión por hablantes nativos ANTES de deploy. No usar traducción automática |
| R2 | Contenido legal desactualizado | Media | Alto | Disclaimer visible: "Last updated: [date]". Revisión trimestral con abogado |
| R3 | Video hero pesa demasiado para conexiones lentas | Alta | Medio | Poster image, lazy load, formato WebM, comprimir a <5MB |
| R4 | Chatbot da información legal incorrecta | Baja | Crítico | Solo respuestas curadas por humanos. Disclaimer en chatbot. Sin generación dinámica |
| R5 | Email spam via formulario | Media | Bajo | Honeypot field + rate limiting en serverless function |
| R6 | RTL layout rompe diseño | Media | Medio | Usar CSS logical properties (`margin-inline-start` vs `margin-left`). Testing manual en Dari |
| R7 | Bundle size excesivo por dependencias no usadas | Actual | Bajo | Auditar y eliminar Radix/shadcn components no utilizados |
| R8 | SEO deficiente por SPA rendering | Alta | Medio | Prerendering plugin + meta tags + structured data |

---

## 18. Priorización por Fases

### MVP (Fase 1) — 4-6 semanas

- [x] Hero con video parallax + overlay + CTA
- [x] Navigation sticky + responsive + mobile menu
- [x] Quick Access (services grid)
- [x] About section
- [x] Know Your Rights (contenido estático + PDF link)
- [x] Community Resources directory
- [x] Events list
- [x] Contact form (UI completa)
- [x] Testimonials con modal
- [x] Chatbot UI (quick actions)
- [x] Footer
- [x] **Integración email real** (Resend + Vercel serverless)
- [x] **Chatbot keyword matching engine** (scoring aditivo 5 tiers, KB 17 entradas)
- [x] **Externalizar datos a JSON** (eventos, recursos, testimonios)
- [x] **SEO meta tags** (react-helmet-async, OG, Twitter Cards, JSON-LD, sitemap)
- [x] **Accesibilidad**: labels en form, skip-to-content, contraste WCAG AA, prefers-reduced-motion
- [x] **Honeypot anti-spam** en formulario
- [x] **WhatsApp como botón funcional** (`wa.me/` link)
- [ ] **Prerendering** para SEO (diferido — meta tags cubren 80% del valor)

### Fase 2 — 3-4 semanas

- [ ] **Multilenguaje completo** (EN / Dari / Pashto / Uzbek)
- [ ] **RTL support** para Dari y Pashto
- [ ] **Videos informativos** en Know Your Rights
- [ ] **Immigration Help expandido** (accordion con detalles por servicio)
- [ ] **Chatbot multilingüe** (KB en 4 idiomas)
- [x] **prefers-reduced-motion** support
- [x] **Structured data JSON-LD**
- [ ] **Analytics** (Plausible — privacy-first)
- [ ] **Optimización de imágenes** (WebP/AVIF, srcset)
- [ ] **Optimización de video** (WebM, poster frames, compresión)

### Mejoras Opcionales (Fase 3+)

- [ ] Sección de donaciones (link externo a GoFundMe/similar)
- [ ] Blog / noticias comunitarias
- [ ] Mapa interactivo con ubicaciones de recursos
- [ ] PWA (offline access para contenido de derechos)
- [ ] Print-friendly version de Know Your Rights
- [ ] Dark mode institucional (navy base)

---

## 19. Backlog Sugerido

| Prioridad | Item | Esfuerzo | Estado |
|-----------|---|---|---|
| P0 | Integrar email API en formulario | S | ✅ Resend + Vercel serverless |
| P0 | Chatbot: keyword matching engine + KB JSON | M | ✅ Scoring aditivo 5 tiers, 17 entradas |
| P0 | Fix contraste WCAG en copper text | XS | ✅ `--color-accent: #96592a` (4.5:1) |
| P0 | Labels `<label>` en formulario | XS | ✅ sr-only labels + aria-label |
| P1 | Externalizar datos a `/src/data/*.json` | S | ✅ events, testimonials, resources |
| P1 | SEO: meta tags + prerendering | S | ✅ react-helmet-async, OG, JSON-LD, sitemap |
| P1 | WhatsApp button funcional | XS | ✅ `wa.me/14804162333` |
| P1 | Honeypot anti-spam | XS | ✅ Campo oculto + server-side check |
| P1 | Skip-to-content link | XS | ✅ Link oculto, visible en :focus |
| P2 | i18n sistema completo | L | 🔲 Pendiente — Fase 2 |
| P2 | RTL CSS support | M | 🔲 Pendiente — Fase 2 |
| P2 | Immigration Help accordion expandido | S | 🔲 Pendiente |
| P2 | Chatbot multilingüe (KB en 4 idiomas) | M | 🔲 Pendiente — Fase 2 |
| P2 | Videos en Know Your Rights | M | 🔲 Pendiente |
| P2 | Analytics (Plausible) | S | 🔲 Pendiente |
| P3 | PWA offline | M | 🔲 Pendiente |
| P3 | Blog section | L | 🔲 Pendiente |
| P3 | Donaciones | S | 🔲 Pendiente |

**Esfuerzos**: XS (<2h), S (2-8h), M (1-3 días), L (1-2 semanas)

---

## 20. Recomendación Técnica Final

### Stack: Mantener, Optimizar, No Migrar

El stack actual (React + Vite + Tailwind) es **correcto para este proyecto**. Una migración a SSG (Astro/Next.js) no justifica el costo en un sitio que ya está 80% construido.

### Acciones técnicas prioritarias

| # | Acción | Impacto |
|---|---|---|
| 1 | **Eliminar dependencias no utilizadas**: ~30 paquetes Radix instalados pero no usados. Reducirá bundle ~40%. Solo mantener lo que se usa (dialog, si se necesita). | Performance |
| 2 | **Elegir UNA librería de animación**: GSAP O Framer Motion, no ambas. GSAP recomendado — ya se usa en 8/11 secciones. Migrar Testimonials modal de Framer a GSAP o CSS. | Bundle size, consistencia |
| 3 | **Agregar `react-helmet-async`** + `vite-plugin-prerender`: SEO para SPA sin migrar a SSR. | SEO |
| 4 | **Crear carpeta `/src/data/`**: Centralizar todos los datos (eventos, recursos, testimonios, chatbot KB) en JSON. Separar datos de presentación. | Mantenibilidad |
| 5 | **Implementar i18n con `react-i18next`**: Ligero, bien soportado, lazy loading de locales. No reinventar la rueda con context custom. | Multilenguaje |
| 6 | **Migrar inline styles a Tailwind classes o CSS modules**: 90% de los estilos están en inline `style={{}}`. Esto dificulta mantenimiento, media queries, y RTL. | Mantenibilidad, RTL |
| 7 | **Eliminar `next-themes`**: No aplica — no hay Next.js ni dark mode. Dependencia innecesaria. | Limpieza |
| 8 | **Eliminar `recharts`, `react-resizable-panels`, `input-otp`, `cmdk`, `react-day-picker`, `vaul`**: No se usan. Peso muerto. | Bundle size |

### Comparación breve de alternativas

| Criterio | Vite SPA (actual) | Astro SSG | Next.js SSG |
|---|---|---|---|
| SEO out-of-box | ⚠️ Requiere prerendering plugin | ✅ HTML estático | ✅ Con `output: 'export'` |
| Performance | ✅ Con optimización | ✅ Excelente | ✅ Buena |
| Curva de migración | ✅ Ya construido | ❌ Reescribir todo | ❌ Adaptar routing |
| Complejidad | ✅ Simple | ✅ Simple | ⚠️ Más conceptos |
| Bundle size | ⚠️ SPA carga todo | ✅ Islands, parcial | ⚠️ Similar a Vite |
| **Veredicto** | **✅ MANTENER** | Mejor para sitio nuevo | Overkill para esto |

---

## Disclaimer Legal

> [!CAUTION]
> Todo contenido legal en la sección "Know Your Rights" y en las respuestas del chatbot DEBE ser revisado y aprobado por un abogado de inmigración antes del lanzamiento. El sitio debe incluir un disclaimer visible: *"This information is for educational purposes only and does not constitute legal advice. For legal assistance, please contact an immigration attorney."*

---

**Documento preparado por**: Product & Engineering Team  
**Próximo paso**: Revisión por stakeholders → Aprobación → Sprint planning  
**Fecha de revisión**: 2026-05-13
