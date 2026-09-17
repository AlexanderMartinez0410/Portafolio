# 📋 Lista de Pendientes - Portafolio Developer

Estado del proyecto, tareas prioritarias y especificaciones técnicas para llevar el portafolio a producción con estándar de alta calidad.

---

## 🚀 Fase 1: Git & Repositorio Remoto
- [x] **Configuración de Integración Continua (CI/CD) y Pipeline GitHub Actions:**
  - [x] Creado flujo de trabajo `.github/workflows/ci.yml` con validación automática de Oxlint, Vitest y build de producción Vite en cada push y pull request.
  - [x] Verificado `git status` y árbol local listo para commit y despliegue continuo.
- [ ] **Sincronización con Repositorio Remoto GitHub:**
  - [ ] Crear commit con el estado actual del portafolio.
  - [ ] Realizar `git push -u origin main` (o `origin master`).
  - [ ] Vincular despliegue con Vercel o Netlify.

---

## 🎨 Fase 2: Layout Fluido y Animaciones (Full-Width & Micro-interacciones)
- [x] **Vista de Demos / Experimentos (Playground):**
  - [x] Permitir que al abrir un Demo (`ExperimentDetail.tsx`) ocupe **el 100% del ancho (`w-full`)** del viewport / contenedor principal sin limitarse por `max-w-5xl`.
  - [x] Implementar transición suave con `motion/react` (`opacity`, `scale: 0.995 -> 1`, `y: 14 -> 0`, transición spring / ease suave) al entrar y salir del demo.
  - [x] Mantener controles de retorno (`Volver al Lab`) fijados y accesibles en mobile y desktop.

- [x] **Vista de Catálogo Completo de Proyectos:**
  - [x] Al hacer clic en *"Ver Catálogo Completo"*, la vista consume todo el ancho disponible (`w-full`), con un grid dinámico de 3 columnas en pantallas grandes.
  - [x] Añadir animación de apertura leve (fade in + slide vertical sutil con `AnimatePresence`) al desplegar el catálogo y al regresar a la vista de proyectos destacados.

---

## 🧠 Fase 3: Casos de Estudio (Formato Segundo Cerebro / Obsidian)
- [x] **Botón de "Caso de Estudio" en Proyectos:**
  - [x] Añadido botón `[ 📖 CASO DE ESTUDIO // OBSIDIAN ]` en los proyectos principales de la tríada.
  - [x] Añadido botón `[ CASO DE ESTUDIO ]` en cada tarjeta del Catálogo de Proyectos.
- [x] **Modal / Visor de Caso de Estudio (Estilo Obsidian):**
  - [x] **Frontmatter YAML:** Metadatos visuales en bloque de código (`type`, `tags`, `fecha`, `stack`, `complexity`, `impact`).
  - [x] **Estructura de la Nota:**
    1. `## 01. Contexto Operativo & Reto Crítico`: Dolor y problema original.
    2. `## 02. Arquitectura & Decisiones de Diseño (ADR)`: Diagrama ASCII arquitectónico y justificación técnica.
    3. `## 03. Solución Técnica & Código Clave`: Snippets y patrones aplicados.
    4. `## 04. Retos Técnicos & Soluciones`: Problemas reales superados con rigor.
    5. `## 05. Resultados, Métricas & Conexiones`: Métricas cuantitativas y backlinks de Obsidian `[[Segundo-Cerebro]]`.
  - [x] Estética Obsidian: Bloques de callout (`> [!IMPORTANT]`, `> [!TIP]`, `> [!NOTE]`), botón para copiar la nota en Markdown puro y cierre por tecla `Escape`.

---

## 👤 Fase 4: Datos de Contacto Reales & Responsividad
- [x] **Actualización de Datos en `src/data/manifesto.ts` y componentes:**
  - [x] **Nombre y Especialidad:** ALEXANDER RAFAEL MARTÍNEZ MORILLO - Full Stack Engineer | Frontend Architecture & Applied AI.
  - [x] **Correo Electrónico:** `alkut202@gmail.com` con botón táctil de copiado y feedback visual.
  - [x] **GitHub & LinkedIn:** Enlaces reales verificados (`https://github.com/AlexanderMartinez0410` y `https://www.linkedin.com/in/alexander-martinez-a1261921a/`).
  - [x] **Tríada Principal:** AMMI Online (Angular 20 SSR + .NET 8 CQRS), Bioregistro (Flutter Anti-Fraude en 5 días SLA) y Desaparecidos EC (FastAPI + Celery + Redis Geo).
  - [x] **Catálogo Completo ISTPET:** 9 subsistemas institucionales (Bienestar, Distributivos, RRHH, Auth Core RBAC, VITA, SIPLICI, Titulación, Sincronizador Telnet, Mi ISTPET) + Sandboxes personales.
  - [x] **Trayectoria & Formación:** ISTPET (1 año produccion activa), Consultoría Freelance, Ingeniería UPS (en curso) / Tecnólogo ISTPET y AWS Builder Student.
  - [x] **CV / Dossier PDF:** Archivo en `/public/cv_alexander_martinez.pdf` y enlace funcional de descarga.
  - [x] **Ubicación & Disponibilidad horaria:** Quito, Ecuador (UTC-5) y estado activo para roles remotos internacionales B2B e híbridos.

- [x] **Auditoría Responsive de Contacto y Sidebar:**
  - [x] Verificado en pantallas móviles (`< 640px`) sin desbordes horizontales (`break-all` en email y grid adaptable).
  - [x] Botones táctiles con áreas mínimas de toque (`min-h-[44px]`).
  - [x] Feedback visual háptico/copiado instantáneo al interactuar con el email.

---

## 🔍 Fase 5: Revisión de Pendientes Adicionales Detectados
- [x] **Asset del CV:** Archivo PDF del currículum verificado en la carpeta `public/` para evitar errores 404 al descargarlo.
- [x] **SEO & OpenGraph:** Configurados metadatos en `index.html` (título, autor, descripción profesional, keywords y tarjetas preview para compartir en LinkedIn/Twitter).
- [x] **Optimización de Assets en Experimentos:** Comprobar que los videos y modelos 3D / shaders carguen de forma diferida (lazy load con `React.lazy` y `Suspense`) para evitar consumo excesivo de memoria al iniciar la web.

---

## 🛡️ Fase 6: Estabilización Técnica, Seguridad & Testing Automatizado (Completado)
- [x] **Sanitización de Reactividad & Advertencias de Hooks (React 19):**
  - [x] Resuelta lectura de `ref.current` durante el render en [`RetroPcEmulator.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/RetroPcEmulator.tsx) mediante migración a estado `finalScore`.
  - [x] Corregido orden de inicialización de callbacks `triggerJump` y `triggerDance` en [`PinguVoxelCretaceous.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/PinguVoxelCretaceous.tsx) con `useCallback` y array de dependencias completo.
  - [x] Resueltos stale closures y cleanup seguro de referencias en [`PolyphonicSynthAudio.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/PolyphonicSynthAudio.tsx).
  - [x] Resueltas llamadas impuras en render y sincronización síncrona en [`WhatsAppBotSimulator.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/WhatsAppBotSimulator.tsx).
  - [x] Corrección de mutación de propiedad `window.location.href` a `window.location.assign` en [`QuickContactRail.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/QuickContactRail.tsx).
  - [x] Optimización de [`TypewriterText.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/TypewriterText.tsx) y [`AnimatedCounter.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/AnimatedCounter.tsx) con guardias defensivas contra cascading renders.
- [x] **Blindaje de Seguridad y Fuga de Credenciales:**
  - [x] Erradicación de clave privada real de Groq API de `.env.local` y verificación de cero fugas en bundles compilados de producción (`dist/`).
  - [x] Aislamiento de clave de API opcional en almacenamiento local de sesión y opción de modo simulación/demo.
- [x] **Refactorización de God Components:**
  - [x] Desacoplada la máquina de datos y generador de mensajes de [`ContactTriageBot.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/ContactTriageBot.tsx) hacia [`src/components/triage/triageOptions.ts`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/triage/triageOptions.ts).
  - [x] Reducción de más de 250 líneas de código monolítico y tipado estricto de iconos Lucide.
- [x] **Infraestructura de Testing Automatizado:**
  - [x] Instalación y configuración de Vitest con entorno `jsdom` en [`vitest.config.ts`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/vitest.config.ts).
  - [x] Creación de 13 pruebas unitarias y de integración (`security.test.ts`, `manifesto.test.ts`, `triageOptions.test.ts`, `render.test.tsx`).
  - [x] Integración de script `"test": "vitest run"` en `package.json` con 100% de pruebas en verde.
  - [x] Verificación de compilación limpia de TypeScript (`tsc -b`) y Vite en producción sin errores.

---

## ⚡ Fase 7: Optimización de Chunks, React 19 Strictness & CI/CD Pipeline (Completado)
- [x] **Optimización de Empaquetado y Code-Splitting en `vite.config.ts`:**
  - [x] Configuración de `manualChunks` para `vendor-react`, `vendor-motion`, `vendor-icons` y `vendor-three`.
  - [x] Reducción del chunk principal `index.js` de **586 kB a 275 kB** (y solo **75 kB gzip**).
  - [x] Reducción de `PinguVoxelCretaceous` de **536 kB a 17.7 kB**.
  - [x] Eliminación total de advertencias de tamaño de chunk en Vite.
- [x] **Erradicación de Cascading Renders y React 19 Lint Warnings:**
  - [x] Eliminadas advertencias de `set-state-in-effect` en [`ExperimentDetail.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/ExperimentDetail.tsx), [`NetworkPerformanceLab.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/NetworkPerformanceLab.tsx) y [`VideoScrubbing.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/VideoScrubbing.tsx).
  - [x] Sanitizados hooks y dependencias en [`BrokenLampEasterEgg.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/BrokenLampEasterEgg.tsx) e [`InteractiveBackground.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/InteractiveBackground.tsx).
  - [x] **0 advertencias y 0 errores** en Oxlint sobre 69 archivos analizados.
- [x] **Modularización de God Components:**
  - [x] Desacoplado [`RetroPcEmulator.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/RetroPcEmulator.tsx) de 861 líneas en submódulos especializados en [`src/experiments/retro/`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/retro/) (`SnakeGame`, `MinesweeperGame`, `TetrisGame`, `Leaderboard`, `GameOverModal`, `BootSequence`).
  - [x] Extraída la lógica DSP y tipos de audio de [`PolyphonicSynthAudio.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/PolyphonicSynthAudio.tsx) hacia [`src/experiments/synth/`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/synth/) (`synthData.ts`, `drumSynth.ts`).
- [x] **Infraestructura CI/CD y Testing:**
  - [x] Creado workflow automatizado en [`.github/workflows/ci.yml`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/.github/workflows/ci.yml).
  - [x] 16 tests automatizados iniciales pasando al 100% en verde con Vitest.

---

## 🔗 Fase 8: Deep Linking, Enrutamiento Canónico por Hash & Rendimiento Híbrido (Completado)
- [x] **Arquitectura de Deep Linking & Sincronización Canónica de URL:**
  - [x] Extendido [`NavigationContext.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/context/NavigationContext.tsx) con soporte para parseo de rutas canónicas (`parseHash`), formateo (`formatHash`), y sincronización bidireccional mediante `hashchange`.
  - [x] Soporte de URLs compartibles para secciones principales (`#/sobre-mi`, `#/proyectos`, `#/experimentos`, `#/experiencia`, `#/contacto`).
  - [x] Soporte de Deep Links directos a Casos de Estudio (`#/proyectos/caso-estudio/ammi-online`, `#/proyectos/caso-estudio/bioregistro-anti-fraude`, etc.).
  - [x] Soporte de Deep Links anidados para el Catálogo de Proyectos (`#/proyectos/catalogo` y `#/proyectos/catalogo/caso-estudio/:id`).
  - [x] Soporte de Deep Links directos a Experimentos del Laboratorio (`#/experimentos/polyphonic-synth-audio`, `#/experimentos/pingu-3d-voxel`, etc.).
  - [x] Soporte nativo para botones "Atrás" y "Adelante" del navegador sin recargas de página.
- [x] **Single Source of Truth & Erradicación de Renders en Cascada:**
  - [x] Estado de proyectos y experimentos derivado puramente de la URL (`currentRoute`), eliminando llamadas a `setState` en efectos secundarios en [`Projects.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/Projects.tsx) y [`Lab.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/Lab.tsx).
  - [x] Cero advertencias de React 19 y 0 errores en Oxlint (69 archivos verificados).
- [x] **Estrategia Híbrida de Rendimiento (Pestaña Oculta & Modo Idle):**
  - [x] Detección de `visibilitychange` y `document.hidden` en [`InteractiveBackground.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/components/InteractiveBackground.tsx) para cancelar el loop de animación cuando la pestaña esté en segundo plano, y modo reposo con 0% de uso de CPU cuando las partículas se asientan.
  - [x] Pausa automática de cálculos y dibujado WebGL en [`PinguVoxelCretaceous.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/PinguVoxelCretaceous.tsx) ante `document.hidden`.
  - [x] Pausa reactiva del osciloscopio en tiempo real en [`PolyphonicSynthAudio.tsx`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/experiments/PolyphonicSynthAudio.tsx) cuando la pestaña se minimiza u oculta.
- [x] **Ampliación de Testing Automatizado:**
  - [x] Creada suite [`src/__tests__/deepLinking.test.ts`](file:///C:/Users/DESARROLLADOR-PC02/Desktop/PROYECTOS%20DESARROLLADOS/PERSONAL/portafolio_developer/src/__tests__/deepLinking.test.ts) con 10 nuevas pruebas unitarias para parseo, formateo e integridad referencial de todos los experimentos y casos de estudio.
  - [x] **26 pruebas automatizadas en total pasando al 100% en verde** en Vitest.
  - [x] Compilación de producción en Vite (`npm run build`) verificada en < 800ms.

---

## 🚀 Fase 9: Reordenamiento Canónico, OpenGraph Social Card & Accesibilidad a11y (Completado)
- [x] **Reordenamiento de Navegación Profesional:**
  - [x] Home se mantiene en `00 / SOBRE MÍ`.
  - [x] `01 / PROYECTOS` preservado como primer punto de conversión.
  - [x] `02 / EXPERIENCIA` sube al tercer lugar para destacar inmediatamente la trayectoria profesional (ISTPET, consultoría y formación).
  - [x] `03 / EXPERIMENTOS` pasa al cuarto lugar para ofrecer el laboratorio interactivo como demostración avanzada sin eclipsar la experiencia.
  - [x] `04 / CONTACTO` como cierre directo para reclutadores y clientes.
  - [x] Sincronización completa en `NavigationContext.tsx`, `App.tsx` y animaciones direccionales.
- [x] **Tarjeta Social OpenGraph & Twitter Cards:**
  - [x] Generada imagen de alta definición `public/og-image.png` (1200x630) con diseño blueprint, branding y métricas institucionales de Alexander Martínez.
  - [x] Metadatos completos en `index.html`: `og:image`, `og:image:width`, `og:image:height`, `og:site_name`, `og:locale`, `twitter:card="summary_large_image"` y `theme-color`.
- [x] **Validación y Cumplimiento de Accesibilidad (a11y):**
  - [x] `role="dialog"`, `aria-modal="true"` y `aria-labelledby` integrados en el visor de casos de estudio estilo Obsidian.
  - [x] `aria-expanded` y etiquetas descriptivas en los canales de contacto rápido y HUD lateral flotante.
  - [x] `role="alertdialog"` y `aria-label` en el Easter Egg del corte de energía.
  - [x] `aria-label` en controles del sintetizador Web Audio, reproductor demo y controles direccionales del D-Pad en el visor 3D de Pingu.