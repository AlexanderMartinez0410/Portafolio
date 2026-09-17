// =============================================================================
// EXPERIMENTO #01 — Sincronizador en Vivo de Notas Obsidian (GitHub API)
// Sincroniza en segundo plano el repositorio de Obsidian del usuario al VFS
// Repo: https://github.com/AlexanderMartinez0410/notas_obsidian
// =============================================================================

import type { VFSNode } from './types';
import { getNodeAtPath } from './autocomplete';

export const OBSIDIAN_CONFIG = {
  owner: 'AlexanderMartinez0410',
  repo: 'notas_obsidian',
  mountPath: '/home/alexander/obsidian',
  dirName: 'obsidian'
};

interface GitHubTreeItem {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha: string;
  size?: number;
  url: string;
}

interface GitHubTreeResponse {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
}

export interface ObsidianSyncResult {
  connected: boolean;
  count: number;
  message: string;
}

/**
 * Sincroniza de forma no bloqueante las notas remotas del repositorio GitHub al árbol VFS
 */
export async function syncObsidianVault(vfsRoot: VFSNode): Promise<ObsidianSyncResult> {
  try {
    const { owner, repo } = OBSIDIAN_CONFIG;
    
    // 1. Intentar obtener el árbol recursivo de Git en rama main o master
    let treeItems: GitHubTreeItem[] = [];
    let activeBranch = 'main';

    for (const branch of ['main', 'master']) {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, {
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        });

        if (res.ok) {
          const data: GitHubTreeResponse = await res.json();
          if (data.tree && Array.isArray(data.tree) && data.tree.length > 0) {
            treeItems = data.tree;
            activeBranch = branch;
            break;
          }
        }
      } catch {
        // Continuar al siguiente intento
      }
    }

    // 2. Si el árbol de git no devolvió items, intentar el endpoint de /contents directo
    if (treeItems.length === 0) {
      try {
        const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
          headers: {
            Accept: 'application/vnd.github.v3+json'
          }
        });
        if (res.ok) {
          const contents = await res.json();
          if (Array.isArray(contents) && contents.length > 0) {
            treeItems = contents.map((c) => ({
              path: c.path,
              mode: c.type === 'dir' ? '040000' : '100644',
              type: c.type === 'dir' ? 'tree' : 'blob',
              sha: c.sha,
              size: c.size,
              url: c.download_url || c.url
            }));
          }
        }
      } catch {
        // Ignorar fallo de red silenciosamente
      }
    }

    // 3. Obtener o crear el nodo de montaje /home/alexander
    const homeNode = getNodeAtPath(vfsRoot, '/home/alexander');
    if (!homeNode || !homeNode.children) {
      return { connected: false, count: 0, message: 'Ruta /home/alexander no encontrada en VFS' };
    }

    // Si no hay archivos en el repo (repo recién creado o vacío)
    if (treeItems.length === 0) {
      return { connected: false, count: 0, message: 'No conectado: Repositorio vacío o sin commits en GitHub.' };
    }

    // 4. Crear nodo raíz del vault de Obsidian
    const obsidianDir: VFSNode = {
      name: OBSIDIAN_CONFIG.dirName,
      type: 'dir',
      permissions: 'drwxr-xr-x',
      size: '4096',
      modified: 'Hoy',
      children: {}
    };

    let fileCount = 0;

    // 5. Poblar el árbol recursivo con los archivos de GitHub
    for (const item of treeItems) {
      // Filtrar archivos de configuración de Obsidian o git
      if (item.path.startsWith('.obsidian') || item.path.startsWith('.git') || item.path.includes('.DS_Store')) {
        continue;
      }

      const pathSegments = item.path.split('/').filter(Boolean);
      let currentDir = obsidianDir;

      // Navegar/crear subcarpetas
      for (let i = 0; i < pathSegments.length - 1; i++) {
        const segment = pathSegments[i];
        if (!currentDir.children) {
          currentDir.children = {};
        }
        if (!currentDir.children[segment]) {
          currentDir.children[segment] = {
            name: segment,
            type: 'dir',
            permissions: 'drwxr-xr-x',
            size: '4096',
            modified: 'Hoy',
            children: {}
          };
        }
        currentDir = currentDir.children[segment];
      }

      const fileName = pathSegments[pathSegments.length - 1];

      if (item.type === 'blob') {
        if (!currentDir.children) currentDir.children = {};

        const rawDownloadUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${activeBranch}/${item.path}`;

        currentDir.children[fileName] = {
          name: fileName,
          type: 'file',
          permissions: '-rw-r--r--',
          size: String(item.size || 1024),
          modified: 'Hoy',
          downloadUrl: rawDownloadUrl,
          isRemote: true
        };
        fileCount++;
      }
    }

    if (fileCount > 0) {
      homeNode.children[OBSIDIAN_CONFIG.dirName] = obsidianDir;
      return {
        connected: true,
        count: fileCount,
        message: `Conectado a GitHub (${owner}/${repo}) — ${fileCount} notas cargadas`
      };
    }

    return {
      connected: false,
      count: 0,
      message: 'No conectado: No se encontraron archivos válidos en el repositorio'
    };
  } catch (err) {
    return {
      connected: false,
      count: 0,
      message: `No conectado: ${err instanceof Error ? err.message : String(err)}`
    };
  }
}
