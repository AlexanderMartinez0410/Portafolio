export interface VFSNode {
  name: string;
  type: 'file' | 'dir';
  content?: string;
  imageSrc?: string;
  imageAlt?: string;
  size?: string;
  modified?: string;
  permissions?: string;
  children?: Record<string, VFSNode>;
}

export interface TerminalLine {
  id: string;
  type: 'command' | 'output' | 'error' | 'image' | 'banner' | 'suggestions';
  content?: string;
  imageSrc?: string;
  imageAlt?: string;
  promptPath?: string;
  suggestions?: string[];
}

export interface CommandContext {
  currentPath: string;
  vfsRoot: VFSNode;
  imageSrc: string;
}

export interface CommandResult {
  lines: TerminalLine[];
  newPath?: string;
  clear?: boolean;
}

