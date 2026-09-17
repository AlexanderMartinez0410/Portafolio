import type { CommandContext, CommandResult, VFSNode } from './types';
import { getNodeAtPath } from './autocomplete';
import { PINGU_ASCII_ART } from './vfsData';

export async function executeTerminalCommand(
  rawInput: string,
  context: CommandContext
): Promise<CommandResult> {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return { lines: [] };
  }

  const parts = trimmed.split(' ').filter(Boolean);
  const cmd = parts[0].toLowerCase();
  const arg = parts.slice(1).join(' ').trim();

  switch (cmd) {
    case 'help':
      return handleHelp();
    case 'ls':
    case 'dir':
      return handleLs(arg, context);
    case 'cat':
      return await handleCat(arg, context);
    case 'cd':
      return handleCd(arg, context);
    case 'pwd':
      return handlePwd(context);
    case 'clear':
    case 'cls':
      return { lines: [], clear: true };
    case 'whoami':
      return handleWhoami();
    case 'date':
      return handleDate();
    case 'echo':
      return handleEcho(arg);
    case 'tree':
      return handleTree(context);
    case 'neofetch':
    case 'fastfetch':
      return handleNeofetch();
    case 'pingu':
    case 'pinguino':
    case 'dino':
      return handlePingu(context);
    default:
      return {
        lines: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: 'error',
            content: `bash: comando no encontrado: '${cmd}'. Escribe 'help' para ver los comandos disponibles o presiona [Tab].`
          }
        ]
      };
  }
}

function handleHelp(): CommandResult {
  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: `╔══════════════════════════════════════════════════════════════════════════╗
║                    MANUAL DE COMANDOS DEL SISTEMA VFS                    ║
╚══════════════════════════════════════════════════════════════════════════╝

  NAVEGACIÓN & ARCHIVOS:
    ls               Lista los archivos y carpetas del directorio actual
    cd [directorio]  Cambia de carpeta (ej: cd proyectos, cd .., cd ~)
    cat [archivo]    Muestra el contenido de un archivo (ej: cat bio.txt)
    pwd              Muestra la ruta absoluta actual
    tree             Muestra la jerarquía completa del sistema de archivos

  ATAJOS DIRECTOS:
    cv               Abre el Currículum Vitae completo
    bio              Muestra la biografía y filosofía de trabajo
    foto / pingu     Muestra el avatar e ilustración completa de Pingu
    poema_1          Muestra el poema #1: 'El Compilador de Medianoche'
    poema_2          Muestra el poema #2: 'Oda al Buffer y al Lienzo'
    poema_3          Muestra el poema #3: 'Elegía al Bug de las 4 AM'
    lista_compras    Muestra la lista de compras del programador
    notas            Muestra borradores e ideas de desarrollo

  SISTEMA & UTILIDADES:
    neofetch         Ficha técnica del sistema con arte ASCII de Pingu
    whoami           Muestra el usuario de la sesión
    date             Muestra la hora y fecha actual
    echo [texto]     Imprime texto en la consola
    clear            Limpia la pantalla de la terminal

  PRO TIP: Presiona la tecla [Tab] en cualquier momento para autocompletar.`
      }
    ]
  };
}

function handleLs(arg: string, context: CommandContext): CommandResult {
  const targetPath = arg ? resolvePath(context.currentPath, arg) : context.currentPath;
  const node = getNodeAtPath(context.vfsRoot, targetPath);

  if (!node) {
    return {
      lines: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'error',
          content: `ls: no se puede acceder a '${arg}': No existe el archivo o el directorio`
        }
      ]
    };
  }

  if (node.type === 'file') {
    return {
      lines: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'output',
          content: `${node.permissions} 1 alexander staff ${node.size?.padStart(6, ' ')} ${node.modified} ${node.name}`
        }
      ]
    };
  }

  const children = node.children || {};
  const entries = Object.values(children);

  const formattedLines = entries.map((child) => {
    const isDir = child.type === 'dir';
    const displayName = isDir ? `${child.name}/` : child.name;
    const perms = child.permissions || (isDir ? 'drwxr-xr-x' : '-rw-r--r--');
    const size = (child.size || '1024').padStart(6, ' ');
    const mod = child.modified || 'Sep 03 15:30';
    return `${perms} 1 alexander staff ${size} ${mod}  ${displayName}`;
  });

  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: `total ${entries.length}\n` + formattedLines.join('\n')
      }
    ]
  };
}

async function handleCat(arg: string, context: CommandContext): Promise<CommandResult> {
  if (!arg) {
    return {
      lines: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'error',
          content: 'cat: falta el nombre del archivo. Ejemplo: cat bio.txt, cat cv.txt'
        }
      ]
    };
  }

  const targetPath = resolvePath(context.currentPath, arg);
  const node = getNodeAtPath(context.vfsRoot, targetPath);

  if (!node) {
    return {
      lines: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'error',
          content: `cat: ${arg}: No existe el archivo o el directorio`
        }
      ]
    };
  }

  if (node.type === 'dir') {
    return {
      lines: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'error',
          content: `cat: ${arg}: Es un directorio. Usa 'cd ${arg}' o 'ls ${arg}'.`
        }
      ]
    };
  }

  // Descarga remota si es un archivo de GitHub/Obsidian que no ha sido cacheado
  if (node.downloadUrl && node.content === undefined) {
    try {
      const res = await fetch(node.downloadUrl);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status} ${res.statusText}`);
      }
      const fetchedText = await res.text();
      node.content = fetchedText;
      node.size = String(fetchedText.length);
    } catch (err) {
      return {
        lines: [
          {
            id: Math.random().toString(36).substring(2, 9),
            type: 'error',
            content: `cat: error al descargar '${node.name}' desde GitHub: ${err instanceof Error ? err.message : String(err)}`
          }
        ]
      };
    }
  }

  // Si tiene imagen asociada (foto.png o pingu.png)
  if (node.imageSrc) {
    return {
      lines: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'image',
          imageSrc: node.imageSrc,
          imageAlt: node.imageAlt || node.name,
          content: `${node.content || node.name}\nResolución: 512x512 · Formato: PNG Vectorial Renderizado`
        }
      ]
    };
  }

  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: node.content || ''
      }
    ]
  };
}

function handleCd(arg: string, context: CommandContext): CommandResult {
  if (!arg || arg === '~' || arg === '/home/alexander') {
    return {
      lines: [],
      newPath: '/home/alexander'
    };
  }

  if (arg === '/') {
    return {
      lines: [],
      newPath: '/'
    };
  }

  const targetPath = resolvePath(context.currentPath, arg);
  const node = getNodeAtPath(context.vfsRoot, targetPath);

  if (!node) {
    return {
      lines: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'error',
          content: `cd: ${arg}: No existe el directorio`
        }
      ]
    };
  }

  if (node.type !== 'dir') {
    return {
      lines: [
        {
          id: Math.random().toString(36).substring(2, 9),
          type: 'error',
          content: `cd: ${arg}: No es un directorio`
        }
      ]
    };
  }

  return {
    lines: [],
    newPath: targetPath
  };
}

function handlePwd(context: CommandContext): CommandResult {
  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: context.currentPath
      }
    ]
  };
}

function handleWhoami(): CommandResult {
  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: 'alexander (Full Stack Developer & UI Craftsman // DinoPengu Dev)'
      }
    ]
  };
}

function handleDate(): CommandResult {
  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: new Date().toUTCString()
      }
    ]
  };
}

function handleEcho(arg: string): CommandResult {
  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: arg
      }
    ]
  };
}

function handlePingu(context: CommandContext): CommandResult {
  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: PINGU_ASCII_ART
      },
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'image',
        imageSrc: context.imageSrc,
        imageAlt: 'Pingu el Pingüino Dinosaurio',
        content: `Mascota oficial: Pingu el Pingüino Dinosaurio Cretácico
Estado: Caminando, saltando y bailando en el Laboratorio #02
Escribe 'cat pingu.png' o visita el Experimento #02 para verlo en 3D interactivo.`
      }
    ]
  };
}

function handleNeofetch(): CommandResult {
  const content = `
        .---.            alexander@dinopengu
       /     \\           -------------------
      | () () |          OS: DinoPenguOS GNU/Linux x86_64
       \\  -  /           Host: React 19 + TypeScript VFS
      .-'---'-.          Kernel: 6.10.8-zen-portfolio
     /    ▲    \\         Uptime: 24/7 Disponible
    |  ▲  ▲  ▲  |        Shell: DinoBash 5.2.15 (Interactive VFS)
    |  │     │  |        Terminal: React-Virtual-Console
    |  ▲  ▲  ▲  |        CPU: Cerebro Humano + Copiloto IA (Multitarea)
     \\  '---'  /         Memory: 16 GB RAM / Pasión Ilimitada
      '-.....-'          Theme: Modern Editorial (Light/Dark Auto)
        _|| _||          Disk: 0 Bytes en Disco (100% Client-Side Web)
  `;

  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content
      }
    ]
  };
}

function handleTree(context: CommandContext): CommandResult {
  const startNode = getNodeAtPath(context.vfsRoot, context.currentPath);
  if (!startNode) return { lines: [] };

  const lines: string[] = [context.currentPath];

  function walk(node: VFSNode, prefix: string) {
    if (!node.children) return;
    const entries = Object.values(node.children);
    entries.forEach((child, index) => {
      const isLast = index === entries.length - 1;
      const pointer = isLast ? '└── ' : '├── ';
      const displayName = child.type === 'dir' ? `${child.name}/` : child.name;
      lines.push(`${prefix}${pointer}${displayName}`);
      if (child.type === 'dir') {
        walk(child, prefix + (isLast ? '    ' : '│   '));
      }
    });
  }

  walk(startNode, '');

  return {
    lines: [
      {
        id: Math.random().toString(36).substring(2, 9),
        type: 'output',
        content: lines.join('\n')
      }
    ]
  };
}

/**
 * Resuelve rutas relativas y absolutas ('..', '.', 'proyectos', etc.)
 */
function resolvePath(currentPath: string, target: string): string {
  if (target.startsWith('/')) {
    return normalizePath(target);
  }
  if (target === '~') {
    return '/home/alexander';
  }
  if (target.startsWith('~/')) {
    return normalizePath('/home/alexander/' + target.slice(2));
  }
  return normalizePath(currentPath + '/' + target);
}

function normalizePath(p: string): string {
  const parts = p.split('/').filter(Boolean);
  const stack: string[] = [];

  for (const part of parts) {
    if (part === '.') continue;
    if (part === '..') {
      if (stack.length > 0) stack.pop();
    } else {
      stack.push(part);
    }
  }

  return '/' + stack.join('/');
}

