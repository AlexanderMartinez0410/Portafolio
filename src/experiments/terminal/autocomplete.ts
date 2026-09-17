import type { VFSNode } from './types';

export const COMMANDS_LIST = [
  'help',
  'ls',
  'cat',
  'cd',
  'pwd',
  'tree',
  'whoami',
  'date',
  'echo',
  'clear',
  'neofetch',
  'pingu'
];

/**
 * Encuentra el prefijo común más largo de una lista de strings
 */
function getLongestCommonPrefix(words: string[]): string {
  if (words.length === 0) return '';
  let prefix = words[0];
  for (let i = 1; i < words.length; i++) {
    while (words[i].indexOf(prefix) !== 0) {
      prefix = prefix.substring(0, prefix.length - 1);
      if (prefix === '') return '';
    }
  }
  return prefix;
}

/**
 * Obtiene el nodo VFS en una ruta dada
 */
export function getNodeAtPath(root: VFSNode, pathStr: string): VFSNode | null {
  const cleanPath = pathStr.trim();
  if (cleanPath === '/' || cleanPath === '') return root;

  const parts = cleanPath.split('/').filter(Boolean);
  let current: VFSNode = root;

  for (const part of parts) {
    if (!current.children || !current.children[part]) {
      return null;
    }
    current = current.children[part];
  }

  return current;
}

export interface AutocompleteResult {
  newInput: string;
  suggestions?: string[];
}

/**
 * Motor de autocompletado [Tab]
 */
export function handleTabAutocomplete(
  input: string,
  currentPath: string,
  vfsRoot: VFSNode
): AutocompleteResult {
  const trimmedLeft = input.trimStart();
  if (!trimmedLeft) {
    return { newInput: input, suggestions: COMMANDS_LIST.slice(0, 10) };
  }

  const parts = trimmedLeft.split(' ');

  // Caso 1: Autocompletar el nombre del comando
  if (parts.length === 1) {
    const query = parts[0].toLowerCase();
    const matches = COMMANDS_LIST.filter((cmd) => cmd.startsWith(query));

    if (matches.length === 0) {
      return { newInput: input };
    }

    if (matches.length === 1) {
      return { newInput: matches[0] + ' ' };
    }

    const commonPrefix = getLongestCommonPrefix(matches);
    return {
      newInput: commonPrefix.length > query.length ? commonPrefix : input,
      suggestions: matches
    };
  }

  // Caso 2: Autocompletar archivos o directorios de un comando
  const cmd = parts[0].toLowerCase();
  const rawArg = parts.slice(1).join(' ');
  const currentNode = getNodeAtPath(vfsRoot, currentPath);

  if (!currentNode || !currentNode.children) {
    return { newInput: input };
  }

  const items = Object.values(currentNode.children).map((node) => ({
    name: node.name,
    isDir: node.type === 'dir',
    display: node.type === 'dir' ? node.name + '/' : node.name
  }));

  const query = rawArg.toLowerCase();
  const matches = items.filter((item) => item.name.toLowerCase().startsWith(query));

  if (matches.length === 0) {
    return { newInput: input };
  }

  if (matches.length === 1) {
    const match = matches[0];
    const completion = match.isDir ? `${match.name}/` : `${match.name} `;
    return { newInput: `${cmd} ${completion}` };
  }

  const matchNames = matches.map((m) => m.name);
  const commonPrefix = getLongestCommonPrefix(matchNames);

  return {
    newInput: commonPrefix.length > query.length ? `${cmd} ${commonPrefix}` : input,
    suggestions: matches.map((m) => m.display)
  };
}

