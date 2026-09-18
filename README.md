#  Alexander Rafael Martínez Morillo (DinoPengu Dev)
### Full Stack Engineer | Frontend Architecture & Applied AI

[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-WebGL-000000?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Tests-44%20Passed-22c55e?style=flat-square&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square)]()

---

> **Portafolio de ingeniería de software y sandbox interactivo.** Diseñado con una identidad editorial sobria (*Swiss / Editorial / Brutalism Clean*), enfoque en modernización de sistemas empresariales sobre bases de datos legadas con +20 años en producción, arquitecturas desacopladas (.NET 8 & Angular Signals/SSR) y experimentos técnicos a bajo nivel.

 **Demo en Producción:** [https://alexandermartinez.dev](https://github.com/AlexanderMartinez0410/Portafolio)

---

##  Tabla de Contenidos

1. [Arquitectura y Concepto](#-arquitectura-y-concepto)
2. [Características Principales](#-características-principales)
3. [Stack Tecnológico](#-stack-tecnológico)
4. [Estructura del Proyecto](#-estructura-del-proyecto)
5. [Laboratorio Técnico (Sandbox & WebGL)](#-laboratorio-técnico-sandbox--webgl)
6. [Instalación y Uso Local](#-instalación-y-uso-local)
7. [Suite de Pruebas y Calidad](#-suite-de-pruebas-y-calidad)
8. [Currículum Vitae (Formato Harvard)](#-curr%C3%ADculum-vitae-formato-harvard)
9. [Contacto y Redes](#-contacto-y-redes)

---

## 🏛️ Arquitectura y Concepto

A diferencia de los portafolios convencionales basados en plantillas comerciales, este proyecto está construido desde cero bajo principios de arquitectura de software y diseño editorial técnico:

* **Estética Gaceta / Diario de Ingeniería:** Tipografía monoespaciada estructurada (`JetBrains Mono` e `Inter`), cuadrícula simétrica de alto contraste y navegación fluida orientada a lectura técnica.
* **Evaluación de Habilidades bajo Estándar Internacional SFIA:** Marco de 7 niveles (*Skills Framework for the Information Age*) con alcance activo hasta L5 (*Ensure / Lead*), evitando barras de porcentaje arbitrarias.
* **Internacionalización Dinámica Reactiva (ES / EN):** Detección automática del idioma del sistema operativo del visitante (`navigator.language`) con persistencia local y alternancia en caliente.
* **Casos de Estudio con ADRs (Architecture Decision Records):** Cada proyecto cuenta con desglose de desafío, solución técnica, diagramas de flujo ASCII y métricas medibles en producción.

---

##  Características Principales

* ** Navegación por Habitaciones (Rooms):** Navegación fluida y accesible entre Sobre Mí, Proyectos, Experiencia, Laboratorio y Contacto.
* ** Habilidades Técnicas & Habilidades Blandas:** Desglose categorizado en Frontend, Backend, Bases de Datos, DevOps, IA Aplicada y Habilidades Blandas orientadas a Recursos Humanos (*HR Insights*).
* ** Bot de Triage y Asistencia:** Asistente interactivo guiado para canalizar consultas de reclutadores, propuestas de proyectos y consultoría técnica.
* ** Protección contra Web-Scraping:** Ofuscación de correos electrónicos y números de teléfono contra crawlers y bots automatizados de spam.
* ** Harvard Resume Generator:** Plantillas de CV integradas en formato Harvard estándar de 1 página (en español e inglés) con estilos optimizados para exportación a PDF (`Ctrl + P`).

---

## 💻 Stack Tecnológico

### Frontend & Core
* **React 19** – Componentes funcionales y renderizado reactivo de última generación.
* **TypeScript (Strict Mode)** – Tipado estricto en el 100% de la base de código.
* **Tailwind CSS** – Sistema de tokens y diseño visual responsive.
* **Motion (Motion/React)** – Animaciones declarativas de alto rendimiento con microinteracciones.
* **Lucide React** – Iconografía técnica minimalista y accesible.

### Gráficos 3D & Audio DSP
* **Three.js & WebGL** – Renderizado de escenas tridimensionales interactivas y shaders.
* **Web Audio API** – Síntesis de sonido polifónico y procesamiento digital de señales (DSP) en el navegador.

### Calidad & Tooling
* **Vite 8** – Servidor de desarrollo instantáneo y empaquetado optimizado con Rollup.
* **Vitest & Testing Library** – 44 pruebas unitarias que verifican seguridad, renderizado y deep linking.
* **Oxlint** – Linter estático ultra-rápido basado en Rust (0 errores / 0 advertencias).

---

##  Estructura del Proyecto

```text
portafolio_developer/
├── public/
│   ├── cv_alexander_martinez_es.html   # CV Formato Harvard (Español)
│   ├── cv_alexander_martinez_en.html   # CV Formato Harvard (Inglés)
│   ├── favicon.svg                     # Icono de pestaña
│   ├── og-image.png                    # Imagen OpenGraph para redes
│   └── images/                         # Capturas de proyectos en formato WebP
├── src/
│   ├── __tests__/                      # Suite de 44 tests unitarios (Vitest)
│   │   ├── deepLinking.test.ts
│   │   ├── easterEgg.test.tsx
│   │   ├── manifesto.test.ts
│   │   ├── render.test.tsx
│   │   ├── security.test.ts
│   │   └── triageOptions.test.ts
│   ├── components/                     # Componentes modulares de interfaz
│   │   ├── Contact.tsx                 # Formulario protegido y perfiles
│   │   ├── ContactTriageBot.tsx        # Asistente de despacho
│   │   ├── Experience.tsx              # Línea temporal y credenciales
│   │   ├── Hero.tsx                    # Cabecera editorial y habilidades SFIA
│   │   ├── Lab.tsx                     # Laboratorio experimental
│   │   ├── Projects.tsx                # Casos de estudio y catálogo (+11)
│   │   ├── Sidebar.tsx                 # Navegación y controles de idioma/tema
│   │   └── SpotlightCard.tsx           # Tarjeta con iluminación dinámica
│   ├── context/                        # Contextos de React (Idioma, Tema, Navegación)
│   ├── data/                           # Manifiesto, experiencia y proyectos
│   │   ├── experience.ts
│   │   ├── manifesto.ts
│   │   ├── projects.ts
│   │   └── studyCases.ts
│   ├── experiments/                    # Experimentos interactivos de laboratorio
│   │   ├── GroqLlmStreaming.tsx        # Streaming de LLM en el navegador
│   │   ├── LinuxVirtualCli.tsx         # Terminal virtual con VFS en memoria
│   │   ├── PinguVoxelCretaceous.tsx    # Escena 3D WebGL con Three.js
│   │   ├── PolyphonicSynthAudio.tsx    # Sintetizador con Web Audio API
│   │   └── RetroPcEmulator.tsx         # Simulador de OS retro y minijuegos
│   ├── i18n/                           # Diccionarios de traducción (ES / EN)
│   │   └── translations.ts
│   ├── types/                          # Definición de tipos e interfaces TypeScript
│   ├── App.tsx                         # Orquestador raíz de la aplicación
│   └── main.tsx                        # Punto de entrada de React 19
├── index.html                          # Metadatos SEO, OpenGraph y fuentes web
├── package.json                        # Dependencias y scripts
└── tsconfig.json                       # Configuración de compilación TypeScript
```

---

##  Laboratorio Técnico (Sandbox & WebGL)

El portafolio incluye una sección de laboratorio interactivo que demuestra habilidades avanzadas sobre estándares web nativos:

1. ** Linux Virtual CLI:** Emulador de terminal con sistema de archivos virtual en memoria (`ls`, `cat`, `cd`, `grep`, `history`).
2. ** Retro PC Emulator:** Simulación de entorno retro con mini-juegos de lógica (*Snake*, *Tetris*, *Buscaminas*).
3. ** 3D Voxel Cretaceous:** Renderizado WebGL interactivo en tiempo real con iluminación dinámica en Three.js.
4. ** Polyphonic Synth Audio:** Sintetizador con osciladores sinusoidales y envolventes ADSR usando la API nativa de Web Audio.
5. ** LLM Streaming Lab:** Simulación de flujos de tokenización y streaming de modelos de lenguaje con métricas de latencia.

---

##  Instalación y Uso Local

### Prerrequisitos
* **Node.js** v18.0 o superior
* **npm** v9.0 o superior

### Pasos de ejecución

```bash
# 1. Clonar el repositorio
git clone https://github.com/AlexanderMartinez0410/Portafolio.git

# 2. Entrar al directorio
cd Portafolio

# 3. Instalar dependencias
npm install

# 4. Iniciar el servidor de desarrollo (HMR)
npm run dev
```

Abre tu navegador en `http://localhost:5173`.

---

##  Scripts Disponibles

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Inicia el servidor de desarrollo con Hot Module Replacement (HMR). |
| `npm run build` | Ejecuta `tsc -b` y compila los assets optimizados en la carpeta `dist/`. |
| `npm run preview` | Previsualiza localmente el build de producción generado. |
| `npm test` | Ejecuta la suite completa de 44 tests unitarios con Vitest. |
| `npm run lint` | Ejecuta el análisis estático de código ultra-rápido con Oxlint. |

---

##  Currículum Vitae (Formato Harvard)

El proyecto incluye dos plantillas independientes con diseño formal Harvard de 1 página exacta:

* 🇪🇸 **Español:** [`/cv_alexander_martinez_es.html`](public/cv_alexander_martinez_es.html)
* 🇺🇸 **Inglés:** [`/cv_alexander_martinez_en.html`](public/cv_alexander_martinez_en.html)

Ambas versiones cuentan con estilos `@media print` calibrados para imprimir o guardar directamente en PDF (`Ctrl + P`) sin desbordes.

---

##  Contacto y Redes

* **Ingeniero:** Alexander Rafael Martínez Morillo (DinoPengu Dev)
* **Ubicación:** Quito, Ecuador (Disponible Remoto UTC-5 / Híbrido)
* **Correo Electrónico:** [alkut202@gmail.com](mailto:alkut202@gmail.com)
* **Teléfono / WhatsApp:** [+593 96 996 2799](https://wa.me/593969962799)
* **LinkedIn:** [linkedin.com/in/alexander-martinez-a1261921a](https://www.linkedin.com/in/alexander-martinez-a1261921a/)
* **GitHub:** [github.com/AlexanderMartinez0410](https://github.com/AlexanderMartinez0410)

---

<div align="center">
  <sub>Desarrollado con criterio de ingeniería, arquitectura limpia y pasión por el software bien hecho. © 2026 DinoPengu Dev.</sub>
</div>
