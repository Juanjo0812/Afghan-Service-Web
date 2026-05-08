# PRD — Afghan Support Phoenix

**Product**: Afghan Support — Community Resource Website  
**Version**: 1.0  
**Date**: 2026-05-06  
**Author**: Product & Engineering Team  
**Status**: Draft — Pending Stakeholder Review

---

## 1. Resumen Ejecutivo

Afghan Support Phoenix es un sitio web institucional dirigido a familias afganas radicadas en Phoenix, Arizona. Su propósito es centralizar información sobre servicios de inmigración, derechos legales, recursos comunitarios y eventos, en un formato accesible, multilingüe (EN / Dari / Pashto / Uzbek), y legalmente seguro.

El sitio prioriza claridad, confianza y accesibilidad por encima de innovación tecnológica. No almacena datos sensibles, no utiliza inteligencia artificial, y todo el contenido legal es estático y curado por humanos. Incluye un chatbot determinista basado en JSON local con matching por keywords.

**Stack actual**: React 19 + TypeScript + Vite 7 + Tailwind CSS 3.4 + GSAP + Framer Motion + shadcn/ui + Lenis smooth scroll.

---

## 2. Objetivos

### Objetivo principal
Proveer a familias afganas en Phoenix un punto de acceso único, confiable y multilingüe a servicios de inmigración, derechos legales y recursos comunitarios.

### Objetivos secundarios
- Reducir barreras de idioma con soporte EN / Dari / Pashto / Uzbek
- Ofrecer información legal estática verificada sin riesgo de respuestas dinámicas erróneas
- Facilitar contacto directo (formulario, WhatsApp, teléfono) sin fricción
- Generar confianza institucional mediante diseño sobrio, profesional y humano
- Ser mantenible por un equipo pequeño sin backend complejo

---

## 3. Público Objetivo

| Segmento | Características |
|---|---|
| **Primario** | Familias afganas recién llegadas a Phoenix (18-65 años). Pueden tener alfabetización digital limitada. Hablan Dari, Pashto o Uzbek como primera lengua |
| **Secundario** | Líderes comunitarios, trabajadores sociales y voluntarios que refieren familias a servicios |
| **Terciario** | Abogados de inmigración, organizaciones aliadas, donantes potenciales |

### Consideraciones clave del usuario primario
- Usuarios mayores con experiencia digital limitada → targets de toque grandes, navegación simple
- Confianza es el factor #1 → diseño institucional, no startup
- Contexto emocional alto → tono cálido, empático, no corporativo
- Posible uso en dispositivos móviles de gama media con conexión limitada

---

## 4. Problema que Resuelve

Las familias afganas en Phoenix enfrentan:

1. **Fragmentación de información**: recursos dispersos en múltiples organizaciones sin punto central
2. **Barrera de idioma**: la mayoría de sitios de ayuda están solo en inglés
3. **Desconfianza institucional**: experiencias previas con burocracia generan desconfianza → necesitan un sitio que se sienta "de la comunidad"
4. **Desconocimiento de derechos**: muchas familias no conocen sus derechos ante ICE o policía
5. **Aislamiento**: falta de visibilidad sobre eventos comunitarios y redes de apoyo

---

## 5. Alcance Funcional

| Incluido | Descripción |
|---|---|
| Home | Hero con video, parallax, quick access, about preview, event preview, CTA |
| Immigration Help | Info sobre asylum, TPS, work permit, green card, Afghan Adjustment Act |
| Know Your Rights | Contenido legal estático, PDFs descargables, videos informativos |
| Community Resources | Directorio categorizado: salud, comida, ESL, clínicas, empleo, legal |
| Events | Lista visual simple de workshops, clínicas legales, eventos culturales |
| Contact | Formulario (nombre, teléfono, pregunta), WhatsApp, mapa, envío email serverless |
| Testimonials | Stories simplificadas con scroll horizontal, avatar, modal con video/imagen |
| Chatbot | Determinista, bottom-right, JSON local, keyword matching, sin IA |
| Multilenguaje | EN / Dari / Pashto / Uzbek via JSON local |

---

## 6. Fuera del Alcance

| Excluido | Razón |
|---|---|
| Autenticación de usuarios | No se necesitan cuentas, complejidad innecesaria |
| Base de datos | No se almacenan datos de usuarios por seguridad y privacidad |
| CMS / Admin panel | Contenido gestionado por desarrolladores vía JSON/código |
| Chatbot con IA | Riesgo legal y de desinformación en contexto de inmigración |
| APIs externas para chatbot | Dependencia innecesaria, latencia, costos |
| Sistema de reservas para eventos | Complejidad innecesaria para MVP |
| Google Calendar embed | Dependencia externa, tracking, problemas de privacidad |
| Pagos / Donaciones | Fuera del scope actual, posible fase 2 |
| Blog / Noticias | Requiere mantenimiento editorial constante |

---

## 7. Arquitectura Funcional

```
┌─────────────────────────────────────────────────────┐
│                    Cliente (SPA)                     │
│  React 19 + TypeScript + Vite 7 + Tailwind CSS 3.4  │
├─────────────────────────────────────────────────────┤
│  Secciones: Hero │ QuickAccess │ About │ Rights │   │
│  Resources │ Events │ Contact │ Testimonials        │
├─────────────────────────────────────────────────────┤
│  Chatbot Determinista  │  i18n (JSON local)         │
│  └─ chatbot-data.json  │  └─ /locales/{lang}.json   │
├─────────────────────────────────────────────────────┤
│  Formulario Contact → Serverless Email API           │
│  (Resend / EmailJS / Formspree)                     │
├─────────────────────────────────────────────────────┤
│  Deploy: Vercel / Netlify / Cloudflare Pages        │
│  Assets: Video + Images en /public                  │
└─────────────────────────────────────────────────────┘
```

### Evaluación del Stack Actual

| Aspecto | Stack Actual | Evaluación |
|---|---|---|
| Framework | React 19 + Vite 7 | ✅ Correcto para SPA, excelente DX y performance |
| Estilos | Tailwind 3.4 + shadcn | ✅ Productivo, consistente. Evaluar si shadcn agrega valor real dado el diseño custom |
| Animaciones | GSAP + Framer Motion | ⚠️ Redundante — usar UNO. GSAP es más robusto para scroll-triggered, Framer para layout animations |
| Smooth Scroll | Lenis | ✅ Correcto para el efecto parallax del hero |
| Tipografía | Google Fonts (Cormorant Garamond + Inter) | ✅ Excelente elección institucional |
| Form handling | react-hook-form + zod | ✅ Robusto para validación |

> [!IMPORTANT]
> **Recomendación**: Eliminar dependencias no utilizadas de shadcn/radix. El proyecto tiene 40+ componentes Radix instalados pero la implementación real usa componentes custom con inline styles. Esto infla `node_modules` y el bundle innecesariamente. Mantener solo: `dialog`, `accordion`, `scroll-area`, `tooltip`.

> [!TIP]
> **Alternativa SSG considerada**: Astro o Next.js con `output: 'export'` darían mejor SEO out-of-the-box (HTML pre-renderizado). Sin embargo, el equipo ya tiene el SPA funcional y migrar añade riesgo sin beneficio proporcional para un sitio single-page. **Recomendación: mantener Vite SPA** y agregar `react-helmet-async` para meta tags + prerendering plugin para SEO.

---

## 8. Sitemap / Estructura

```
/ (Single Page Application - scroll-based navigation)
├── #home ─────────── Hero + Video parallax
├── #services ─────── Immigration Help / Quick Access
├── #about ────────── About the Organization
├── #rights ───────── Know Your Rights
├── #resources ────── Community Resources Directory
├── #events ───────── Upcoming Events
├── #contact ──────── Contact Form + Info
├── #stories ──────── Testimonials
├── [Chatbot] ─────── Floating widget (all sections)
└── [Language Toggle]─ Persistent (navbar)
```

---

## 9. Requerimientos Funcionales por Sección

### 9.1 Home (Hero)

| ID | Requerimiento | Prioridad |
|---|---|---|
| H-01 | Video de fondo a pantalla completa con auto-play, muted, loop | MVP |
| H-02 | Overlay oscuro suave con gradiente (top dark → bottom light blend) | MVP |
| H-03 | Efecto parallax con capas de video a diferentes velocidades | MVP |
| H-04 | Texto: "Welcome Home" (h1) + "Free, confidential support for Afghan families in Phoenix" | MVP |
| H-05 | Label superior: "Phoenix, Arizona" | MVP |
| H-06 | CTA principal: "Get Help Now" → scroll a #contact | MVP |
| H-07 | Animación de entrada secuencial (label → title → subtitle → CTA) con GSAP | MVP |
| H-08 | Video oculto en layer 3 en mobile (`hidden md:block`) para performance | MVP |

**Estado actual**: ✅ Implementado. Funcional y alineado con spec.

**Mejoras recomendadas**:
- Agregar `<noscript>` con imagen estática fallback para SEO crawlers
- Lazy-load de video layers 2 y 3 (actualmente las 3 cargan simultáneamente)
- Agregar atributo `fetchpriority="high"` al video principal

---

### 9.2 Quick Access (Services)

| ID | Requerimiento | Prioridad |
|---|---|---|
| QA-01 | Grid de 6 servicios: Immigration, Housing, Healthcare, Education, Employment, Legal Aid | MVP |
| QA-02 | Cada card: icono + título + descripción + "Learn More" link | MVP |
| QA-03 | Hover effect: elevación sutil + border accent | MVP |
| QA-04 | Animación: scroll-triggered stagger con GSAP | MVP |
| QA-05 | Responsive: 3 columnas desktop → 2 tablet → 1 mobile | MVP |

**Estado actual**: ✅ Implementado.

**Mejoras recomendadas**:
- "Learn More" links deben navegar a la sección correspondiente (#rights, #resources, etc.)
- Agregar `aria-label` descriptivos a cada card

---

### 9.3 Immigration Help

| ID | Requerimiento | Prioridad |
|---|---|---|
| IM-01 | Información sobre: Asylum, Work Permit, TPS, Green Card / Reunification, Afghan Adjustment Act | MVP |
| IM-02 | Soporte multilingüe: EN / Pashto / Dari / Uzbek | MVP |
| IM-03 | Información de contacto: teléfono, email, horario de atención | MVP |
| IM-04 | CTA: "Request a Call Back" → scroll a formulario de contacto | MVP |
| IM-05 | Contenido estático, NO generado dinámicamente | MVP |
| IM-06 | Estructura tipo accordion o tabs para los diferentes servicios | MVP |

**Estado actual**: Parcialmente implementado en QuickAccess. Necesita sección dedicada expandida o accordion dentro de la sección actual.

---

### 9.4 Know Your Rights

| ID | Requerimiento | Prioridad |
|---|---|---|
| KR-01 | Contenido legal estático sobre: interacción con policía, ICE en casa, manejo de documentos | MVP |
| KR-02 | Descargas PDF de guías de derechos | MVP |
| KR-03 | Videos informativos embebidos | Fase 2 |
| KR-04 | NO generar respuestas dinámicas en esta sección | MVP |
| KR-05 | Lista clara de derechos con formato visual jerárquico | MVP |
| KR-06 | CTA: "Download Rights Guide (PDF)" | MVP |

**Estado actual**: ✅ Implementado con layout de dos columnas (imagen + texto). Lista de derechos presente. PDF link funcional.

**Mejoras recomendadas**:
- Expandir contenido con accordion para detallar cada escenario (policía, ICE, documentos)
- Agregar badge visual "Available in Dari / Pashto" junto al PDF

---

### 9.5 Community Resources

| ID | Requerimiento | Prioridad |
|---|---|---|
| CR-01 | Directorio categorizado: Healthcare, Housing, Food, ESL, Employment, Legal | MVP |
| CR-02 | Cada categoría: título + lista de organizaciones/servicios | MVP |
| CR-03 | Grid responsive con hover subtle | MVP |
| CR-04 | Links funcionales a sitios externos de cada recurso | Fase 2 |
| CR-05 | Numeración visual por categoría | MVP |

**Estado actual**: ✅ Implementado con grid de 6 categorías. Diseño limpio y funcional.

**Mejoras recomendadas**:
- Agregar datos de contacto (teléfono/dirección) por recurso
- Links placeholder actualmente hacen `preventDefault()` — conectar a URLs reales

---

### 9.6 Events

| ID | Requerimiento | Prioridad |
|---|---|---|
| EV-01 | Lista visual de eventos con fecha, título y detalles | MVP |
| EV-02 | Tipos: workshops, clínicas legales, eventos culturales | MVP |
| EV-03 | Sin sistema de reservas | MVP |
| EV-04 | Sin Google Calendar | MVP |
| EV-05 | Hover: desplazamiento sutil + border-left accent | MVP |
| EV-06 | Datos desde JSON local o constante TypeScript | MVP |

**Estado actual**: ✅ Implementado. Lista limpia con date box + contenido + flecha.

**Mejoras recomendadas**:
- Externalizar datos de eventos a JSON para facilitar actualizaciones sin tocar código
- Agregar indicador visual de "próximo evento" vs "recurrente"

---

### 9.7 Contact

| ID | Requerimiento | Prioridad |
|---|---|---|
| CO-01 | Formulario: nombre, teléfono, email, mensaje | MVP |
| CO-02 | Validación client-side con react-hook-form + zod | MVP |
| CO-03 | Envío vía serverless email API (Resend / EmailJS / Formspree) | MVP |
| CO-04 | NO guardar en base de datos | MVP |
| CO-05 | Botón WhatsApp con link directo `wa.me/` | MVP |
| CO-06 | Info de contacto: teléfono, email, dirección | MVP |
| CO-07 | Mapa placeholder (imagen estática o `<iframe>` simple) | MVP |
| CO-08 | Feedback visual post-envío ("Thank You" message) | MVP |
| CO-09 | Links a redes sociales: Facebook, Instagram, Telegram | MVP |

**Estado actual**: ✅ Implementado. Formulario funcional con feedback. Actualmente `handleSubmit` es mock (no envía email real).

**Mejoras pendientes**:
- Integrar API de envío real (Resend recomendado — free tier 100 emails/día)
- Mapa placeholder pendiente
- WhatsApp link: cambiar de texto informativo a botón `<a href="https://wa.me/16025550148">`

---

### 9.8 Testimonials

| ID | Requerimiento | Prioridad |
|---|---|---|
| TE-01 | Strip horizontal de avatares con scroll en mobile | MVP |
| TE-02 | Click en avatar abre modal con video o imagen + quote + nombre | MVP |
| TE-03 | Navegación prev/next en modal con keyboard support | MVP |
| TE-04 | Badge de play en avatares con video | MVP |
| TE-05 | Featured quote debajo del strip | MVP |
| TE-06 | Sin lógica tipo Instagram/stories complejas | MVP |
| TE-07 | Datos desde JSON local o constante TypeScript | MVP |

**Estado actual**: ✅ Implementado completamente. Modal con video/imagen, keyboard nav, scroll horizontal, featured quote.

---

### 9.9 Chatbot Determinista

| ID | Requerimiento | Prioridad |
|---|---|---|
| CB-01 | Widget flotante bottom-right con botón circular | MVP |
| CB-02 | Mensaje inicial: "Welcome to Afghan Support. Select a topic below or type your question." | MVP |
| CB-03 | Opciones rápidas en grid: Immigration Help, Know Your Rights, Resources, Events, Contact, Speak to Someone | MVP |
| CB-04 | Click en opción → respuesta predeterminada + scroll a sección | MVP |
| CB-05 | Input de texto libre → matching por keywords contra JSON | MVP |
| CB-06 | Respuestas desde archivos JSON locales, NO desde APIs externas | MVP |
| CB-07 | Fallback si no hay match: mensaje + teléfono + quick actions | MVP |
| CB-08 | Sin IA, sin modelos de lenguaje, sin APIs externas | MVP |
| CB-09 | Animación de entrada slide-in | MVP |
| CB-10 | Botones de navegación post-respuesta (acciones del KB) | MVP |
| CB-11 | Multi-candidato: "Did you mean..." cuando hay empate de scores | MVP |

**Estado actual**: ✅ Implementado. Motor de matching aditivo con 5 tiers de scoring (+10 keyword exacto, +8 phrase match, +6 sección, +4 parcial, +2 body text). KB de 17 entradas en `/src/data/chatbot-kb.json`. Soporte multi-candidato cuando varias respuestas compiten. El input libre responde correctamente a queries en lenguaje natural.

---

### 9.10 Multilenguaje

| ID | Requerimiento | Prioridad |
|---|---|---|
| ML-01 | Idiomas soportados: English, Dari, Pashto, Uzbek | MVP |
| ML-02 | Toggle de idioma visible en navbar | MVP |
| ML-03 | Traducciones en archivos JSON locales (`/locales/{lang}.json`) | MVP |
| ML-04 | Sin APIs de traducción externas | MVP |
| ML-05 | RTL support para Dari y Pashto | MVP |
| ML-06 | Persistencia de preferencia de idioma en localStorage | MVP |
| ML-07 | Sistema i18n ligero (react-i18next o custom context) | MVP |

**Estado actual**: ⚠️ No implementado. El toggle en navbar muestra "EN | FA" como placeholder con tooltip "Coming soon". Todo el contenido está hardcoded en inglés.

> [!IMPORTANT]
> **Gap mayor**: La internacionalización es un requisito central del proyecto. Requiere: (1) estructura de archivos JSON por idioma, (2) context provider de i18n, (3) soporte RTL en CSS para Dari/Pashto, (4) traducción del chatbot knowledge base.
