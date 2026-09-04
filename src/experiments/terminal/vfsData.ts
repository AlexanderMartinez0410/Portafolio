import type { VFSNode } from './types';
import { authorProfile, techStackData } from '../../data/manifesto';

export const createInitialVFS = (imageSrc: string): VFSNode => {
  return {
    name: '/',
    type: 'dir',
    permissions: 'drwxr-xr-x',
    size: '4096',
    modified: 'Sep 03 15:30',
    children: {
      home: {
        name: 'home',
        type: 'dir',
        permissions: 'drwxr-xr-x',
        size: '4096',
        modified: 'Sep 03 15:30',
        children: {
          alexander: {
            name: 'alexander',
            type: 'dir',
            permissions: 'drwxr-xr-x',
            size: '4096',
            modified: 'Sep 03 15:30',
            children: {
              'cv.txt': {
                name: 'cv.txt',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '2840',
                modified: 'Sep 03 15:30',
                content: `=============================================================================
CURRÍCULUM VITAE — ALEXANDER MARTÍNEZ (DINOPENGU DEV)
=============================================================================
Rol: ${authorProfile.discipline}
Ubicación: ${authorProfile.location} (${authorProfile.timezone})
Contacto: ${authorProfile.email}
GitHub: ${authorProfile.github}
LinkedIn: ${authorProfile.linkedin}
Disponibilidad: ${authorProfile.status}

[ 1. PERFIL PROFESIONAL ]
Desarrollador Full Stack con mentalidad de producto y obsesión por los detalles.
Especializado en construir aplicaciones web reactivas con React, TypeScript y Tailwind CSS,
complementadas con arquitecturas de backend sólidas en Node.js y Python. Con experiencia
en diseño UI/UX, optimización de rendimiento (Core Web Vitals) e integración de flujos
avanzados asistidos por Inteligencia Artificial.

[ 2. STACK TECNOLÓGICO ]
${techStackData.map((c) => `• ${c.title}: ${c.skills.join(', ')}`).join('\n')}

[ 3. FILOSOFÍA DE TRABAJO ]
• Cero deuda técnica prematura y tipado estricto de extremo a extremo.
• Experiencia de usuario impecable: transiciones fluidas, feedback táctil y accesibilidad.
• Micro-laboratorios y experimentación constante: WebGL, Web Audio API y Canvas 2D.

(Tip: escribe 'cat bio.txt' o 'foto' para ver más detalles)`
              },

              'bio.txt': {
                name: 'bio.txt',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '1920',
                modified: 'Sep 03 15:30',
                content: `=============================================================================
BIOGRAFÍA // ALEXANDER MARTÍNEZ
=============================================================================
Hola, soy Alexander Martínez. En el mundo del software me identifico como DinoPengu Dev.

¿Por qué "DinoPengu"?
Nace de fusionar la resistencia de los pingüinos (elegantes nadadores capaces de prosperar
en los climas más gélidos del planeta) con la fuerza evolutiva y persistente de los dinosaurios.
Para mí representa no temerle a los desafíos técnicos, mantener una curiosidad incombustible
y nunca perder el espíritu lúdico al construir software.

Cómo pienso y construyo:
1. Las interfaces de usuario deben ser intuitivas, responsivas y un placer de usar.
2. El rendimiento no se negocia: tiempos de carga mínimos y animaciones a 60 FPS.
3. La IA es una herramienta multiplicadora de ingenio humano, no un sustituto del criterio.

Intereses personales:
• Micro-interacciones frontend y diseño editorial contemporáneo.
• Síntesis polifónica de sonido digital (DSP) y shaders WebGL.
• Café de especialidad a medianoche y literatura de ciencia ficción.`
              },

              'poema_1.txt': {
                name: 'poema_1.txt',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '1120',
                modified: 'Sep 03 15:30',
                content: `╔══════════════════════════════════════════════════════════════════════════╗
║               POEMA #1: EL COMPILADOR DE MEDIANOCHE                     ║
╚══════════════════════════════════════════════════════════════════════════╝

  Entre llaves que abren y cierran el vacío,
  un cursor titila en la calma del frío.
  El stack trace dormita, la memoria respira,
  mientras una promesa en silencio aspira.

  No hay bug que resista al alba serena,
  ni ciclo infinito que doble la pena.
  Porque en cada byte y en cada función,
  el código late como un corazón.

  — Alexander Martínez (DinoPengu Dev)`
              },

              'poema_2.txt': {
                name: 'poema_2.txt',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '980',
                modified: 'Sep 03 15:30',
                content: `╔══════════════════════════════════════════════════════════════════════════╗
║                 POEMA #2: ODA AL BUFFER Y AL LIENZO                      ║
╚══════════════════════════════════════════════════════════════════════════╝

  Un pixel despierta en la matriz del Canvas,
  donde viajan veloces las ondas más mansas.
  Pintamos los mundos con álgebra pura,
  transformando bits en sutil arquitectura.

  A sesenta cuadros el tiempo se ordena,
  cada matemática dibuja una escena.
  El arte y la lógica se estrechan la mano:
  el render es vivo, el código es humano.

  — DinoPengu`
              },

              'poema_3.txt': {
                name: 'poema_3.txt',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '1050',
                modified: 'Sep 03 15:30',
                content: `╔══════════════════════════════════════════════════════════════════════════╗
║              POEMA #3: ELEGÍA AL BUG RESUELTO A LAS 4 AM                 ║
╚══════════════════════════════════════════════════════════════════════════╝

  Buscaba una sombra en la línea setenta,
  un punto y coma que nadie comenta.
  Pasaron las horas, menguó la cordura,
  hasta que un 'console.log' me dio la luz pura.

  Era una coma fuera de lugar,
  un simple detalle que hacía temblar.
  Git commit certero, sonrisa en la faz:
  el test pasó en verde, ya puedo estar en paz.

  — DinoPengu`
              },

              'lista_compras.txt': {
                name: 'lista_compras.txt',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '1350',
                modified: 'Sep 03 15:30',
                content: `╔══════════════════════════════════════════════════════════════════════════╗
║             LISTA DE COMPRAS OFICIAL DE UN PROGRAMADOR                   ║
╚══════════════════════════════════════════════════════════════════════════╝

  [VÍVERES ESENCIALES]
  [x] Café de especialidad grano arábica tueste medio (NO TORRADO, por favor)
  [x] Bebida de avena / leche para latte art improvisado
  [ ] Gomitas de gelatina con forma de dinosaurio para el boost de dopamina
  [x] Té verde matcha para cuando ya llevo 4 cafés y sigo teniendo sueño
  [ ] Frutos secos y nueces para masticar mientras pienso cómo nombrar una variable

  [HARDWARE & SETUP (NECESIDAD O CAPRICHO)]
  [ ] Lubricante Krytox 205g0 para switches mecánicos lineales
  [ ] Otro cable USB-C mallado (¿por qué siempre desaparecen?)
  [ ] Soporte ergonómico para muñecas
  [ ] Un tercer monitor ultra-wide que juro que aumentará mi productividad un 300%
  [x] Alfombrilla XXL donde quepa el teclado, ratón y mi taza de café favorita

  (Nota mental: no gastar todo el sueldo en teclados custom)`
              },

              'notas.txt': {
                name: 'notas.txt',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '1100',
                modified: 'Sep 03 15:30',
                content: `╔══════════════════════════════════════════════════════════════════════════╗
║               NOTAS RÁPIDAS & BORRADORES DE PROYECTOS                    ║
╚══════════════════════════════════════════════════════════════════════════╝

  • Idea #1: Crear un motor de sintetizador procedural de 8-bits chiptune en Web Audio.
  • Idea #2: Shader de lluvia en Three.js con gotas refractivas sobre vidrio.
  • Recordatorio: Reducir siempre el bundle size; cada kilobyte cuenta en redes móviles.
  • Principio: Si una función hace más de dos cosas, sepárala en dos funciones.
  • Pregunta filosófica: ¿Las inteligencias artificiales soñarán con modelos de lenguaje?`
              },

              'foto.png': {
                name: 'foto.png',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '88420',
                modified: 'Sep 03 15:30',
                imageSrc,
                imageAlt: 'Alexander Martínez — DinoPengu Avatar Oficial',
                content: `Foto oficial de Alexander Martínez (DinoPengu Dev)
Trazo vectorial estilizado · 512x512 PNG · Formato optimizado`
              },

              'pingu.png': {
                name: 'pingu.png',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '88420',
                modified: 'Sep 03 15:30',
                imageSrc,
                imageAlt: 'Pingu el Pingüino Dinosaurio',
                content: `Ilustración oficial de Pingu con pijama de dinosaurio cretácico
Mascota y símbolo del portfolio interactivo`
              },

              proyectos: {
                name: 'proyectos',
                type: 'dir',
                permissions: 'drwxr-xr-x',
                size: '4096',
                modified: 'Sep 03 15:30',
                children: {
                  'lab_01_terminal.txt': {
                    name: 'lab_01_terminal.txt',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    size: '680',
                    modified: 'Sep 03 15:30',
                    content: `LAB #01: Terminal Linux Virtual & VFS en Memoria
Emulador POSIX interactivo con autocompletado Tab, historial y sistema de archivos.`
                  },
                  'lab_02_pingu_voxel.txt': {
                    name: 'lab_02_pingu_voxel.txt',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    size: '720',
                    modified: 'Sep 03 15:30',
                    content: `LAB #02: Pingu Voxel Cretácico
Visor 3D con Three.js, cinemática de caminata 360°, salto gravitatorio y baile.`
                  },
                  'lab_07_scrubber.txt': {
                    name: 'lab_07_scrubber.txt',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    size: '740',
                    modified: 'Sep 03 15:30',
                    content: `LAB #07: Controlador de Video Scrubbing Frame a Frame
Procesamiento 100% en navegador (HTML5 Video + OffscreenCanvas + ImageBitmap en RAM).`
                  }
                }
              },

              musica: {
                name: 'musica',
                type: 'dir',
                permissions: 'drwxr-xr-x',
                size: '4096',
                modified: 'Sep 03 15:30',
                children: {
                  'playlists.txt': {
                    name: 'playlists.txt',
                    type: 'file',
                    permissions: '-rw-r--r--',
                    size: '650',
                    modified: 'Sep 03 15:30',
                    content: `PLAYLISTS PARA PROGRAMAR A MEDIANOCHE:
1. Synthwave / Cyberpunk 2077 OST (Para picar código a alta velocidad)
2. Lofi Hip Hop / Chillhop (Para depurar bugs complejos con paciencia)
3. Ambient & Minimalist Piano (Para pensar en arquitectura de software)`
                  }
                }
              },

              '.bashrc': {
                name: '.bashrc',
                type: 'file',
                permissions: '-rw-r--r--',
                size: '420',
                modified: 'Sep 03 15:30',
                content: `# DinoPengu Bash Configuration
export PS1="\\u@\\h:\\w\\$ "
alias ll="ls -la"
alias cls="clear"
alias dino="pingu"
alias coffee="cat lista_compras.txt"`
              }
            }
          }
        }
      }
    }
  };
};

export const PINGU_ASCII_ART = `
        .---.            
       /     \\           
      | () () |    < ¡Hola! Soy Pingu el Pingüino Dinosaurio
       \\  -  /           
      .-'---'-.          
     /    ▲    \\         
    |  ▲  ▲  ▲  |        
    |  │     │  |        
    |  ▲  ▲  ▲  |        
     \\  '---'  /         
      '-.....-'          
        _|| _||          
`;

