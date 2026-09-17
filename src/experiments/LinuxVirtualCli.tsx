// =============================================================================
// EXPERIMENTO #01 — Terminal Linux Virtual & Sistema de Archivos en Memoria
// Arquitectura Modular y Desacoplada (6+ Meses de Mantenibilidad):
//   - VFS estructurado en árbol de nodos (vfsData.ts)
//   - Motor de autocompletado Bash con Tab y sugerencias (autocomplete.ts)
//   - Handlers de comandos aislados y funciones puras (commands.ts)
//   - Renderizado dinámico de texto enriquecido, arte ASCII, tarjetas e imágenes
// =============================================================================

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { ExperimentComponentProps } from '../components/ExperimentDetail';
import dinoPenguImg from '../assets/Trazo Vectorial.png';
import type { TerminalLine } from './terminal/types';
import { createInitialVFS } from './terminal/vfsData';
import { executeTerminalCommand } from './terminal/commands';
import { handleTabAutocomplete } from './terminal/autocomplete';
import { syncObsidianVault } from './terminal/obsidianSync';
import {
  Terminal as TerminalIcon,
  Sparkles,
  Trash2
} from 'lucide-react';

export const LinuxVirtualCli: React.FC<ExperimentComponentProps> = ({
  onTelemetryUpdate
}) => {
  // Inicialización del sistema de archivos virtual VFS
  const vfsRoot = useMemo(() => createInitialVFS(dinoPenguImg), []);

  const [currentDir, setCurrentDir] = useState<string>('/home/alexander');
  const [inputVal, setInputVal] = useState<string>('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [commandCount, setCommandCount] = useState<number>(0);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'banner',
      type: 'banner',
      content: `╔══════════════════════════════════════════════════════════════════════════╗
║         DinoPenguOS (GNU/Linux x86_64 Virtual Environment v2.6.4)        ║
║       Presiona [Tab] para autocompletar · Escribe 'help' para ayuda      ║
╚══════════════════════════════════════════════════════════════════════════╝`
    },
    {
      id: 'init-msg',
      type: 'output',
      content: `Bienvenido a la estación de trabajo de Alexander Martínez.
Escribe 'help' para ver la lista de comandos o explora el sistema con 'ls'.`
    }
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Telemetría para el panel de métricas superior
  const updateTelemetry = useCallback(
    (lastCmd: string, total: number, dir: string, connected: boolean) => {
      onTelemetryUpdate?.({
        renderTime: 0.03,
        eventName: `CMD: ${lastCmd}`,
        customMetrics: [
          { label: 'Shell', value: 'DinoBash 5.2', color: 'text-emerald-500' },
          { label: 'CMD', value: total, color: connected ? 'text-emerald-500' : 'text-red-500' },
          { label: 'Ruta', value: dir === '/home/alexander' ? '~' : dir, color: 'text-blue-500' }
        ]
      });
    },
    [onTelemetryUpdate]
  );

  // Sincronizar en segundo plano el repositorio de Obsidian al montar el componente
  useEffect(() => {
    let isMounted = true;
    syncObsidianVault(vfsRoot).then((res) => {
      if (!isMounted) return;
      const status = res.connected && res.count > 0;
      setIsConnected(status);
      updateTelemetry('init', 0, currentDir, status);
    });
    return () => {
      isMounted = false;
    };
  }, [vfsRoot, currentDir, updateTelemetry]);

  // Auto-scroll al final del buffer
  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Foco al input
  const focusInput = () => {
    inputRef.current?.focus();
  };

  // Ejecutar comando usando la capa modular de commands.ts (asíncrono)
  const runCommand = async (rawText: string) => {
    const trimmed = rawText.trim();
    if (!trimmed) return;

    const newTotal = commandCount + 1;
    setCommandCount(newTotal);
    setCmdHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const promptPath = currentDir === '/home/alexander' ? '~' : currentDir;
    const cmdLine: TerminalLine = {
      id: Math.random().toString(36).substring(2, 9),
      type: 'command',
      content: trimmed,
      promptPath
    };

    const result = await executeTerminalCommand(trimmed, {
      currentPath: currentDir,
      vfsRoot,
      imageSrc: dinoPenguImg
    });

    if (result.clear) {
      setHistory([]);
      updateTelemetry('clear', newTotal, currentDir, isConnected);
      return;
    }

    const nextDir = result.newPath || currentDir;
    if (result.newPath) {
      setCurrentDir(result.newPath);
    }

    setHistory((prev) => [...prev, cmdLine, ...result.lines]);
    updateTelemetry(trimmed.split(' ')[0], newTotal, nextDir, isConnected);
  };

  // Manejador del teclado con soporte de Tab, Enter y flechas arriba/abajo
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      runCommand(inputVal);
      setInputVal('');
      return;
    }

    // Autocompletado Bash con Tab
    if (e.key === 'Tab') {
      e.preventDefault();
      e.stopPropagation();

      const result = handleTabAutocomplete(inputVal, currentDir, vfsRoot);

      if (result.newInput !== inputVal) {
        setInputVal(result.newInput);
      }

      // Si hay múltiples sugerencias, mostrarlas en la terminal estilo Bash
      if (result.suggestions && result.suggestions.length > 1) {
        const suggestionLine: TerminalLine = {
          id: Math.random().toString(36).substring(2, 9),
          type: 'suggestions',
          content: result.suggestions.join('   ')
        };
        setHistory((prev) => [...prev, suggestionLine]);
      }
      return;
    }

    // Historial con flecha hacia arriba
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIndex === -1 ? cmdHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
      return;
    }

    // Historial con flecha hacia abajo
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (cmdHistory.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIndex(-1);
        setInputVal('');
      } else {
        setHistoryIndex(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
      return;
    }
  };

  return (
    <div className="w-full h-full flex flex-col space-y-3 select-none font-mono text-fg">
      {/* ── BARRA SUPERIOR DE HERRAMIENTAS Y ACCESOS RÁPIDOS ── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-border pb-3 text-xs shrink-0">
        <div className="flex items-center space-x-2 min-w-0">
          <TerminalIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="font-bold tracking-wider uppercase text-[11px] sm:text-xs truncate text-fg">
            BASH CLI // <span className="hidden sm:inline">ESTACIÓN VIRTUAL EN MEMORIA</span>
            <span className="sm:hidden">TERMINAL</span>
          </span>
        </div>

        {/* Botón de limpiar pantalla */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => runCommand('clear')}
            className="px-2 py-1 border border-border hover:border-fg bg-bg-subtle text-fg-subtle hover:text-fg text-[11px] font-mono flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            title="Limpiar pantalla (clear)"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">clear</span>
          </button>
        </div>
      </div>

      {/* ── VENTANA DE LA TERMINAL LINUX (ALTO CONTRASTE) ── */}
      <div
        onClick={focusInput}
        className="relative w-full flex-1 min-h-[380px] sm:min-h-[460px] max-h-[560px] bg-bg-subtle dark:bg-[#0c1017] border border-border overflow-hidden flex flex-col shadow-inner cursor-text transition-colors"
      >
        {/* Cabecera de la ventana con controles */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-bg/80 dark:bg-[#161b22] text-[11px] text-fg-subtle shrink-0 select-none">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono font-medium ml-1 text-fg-muted">
              alexander@dinopengu:{currentDir === '/home/alexander' ? '~' : currentDir} (bash)
            </span>
          </div>
          <span className="text-[10px] hidden sm:inline text-fg-subtle">
            UTF-8 // Virtual FileSystem
          </span>
        </div>

        {/* Buffer de salida con scroll */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 text-xs font-mono leading-relaxed">
          {history.map((line) => {
            if (line.type === 'banner') {
              return (
                <div
                  key={line.id}
                  className="text-emerald-600 dark:text-emerald-400 whitespace-pre font-mono text-[11px] sm:text-xs overflow-x-auto pb-1"
                >
                  {line.content}
                </div>
              );
            }

            if (line.type === 'command') {
              return (
                <div key={line.id} className="flex items-center space-x-2 text-fg pt-1">
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold select-none">
                    alexander@dinopengu:{line.promptPath || '~'}$
                  </span>
                  <span className="font-semibold">{line.content}</span>
                </div>
              );
            }

            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-red-500 font-mono pl-2 border-l-2 border-red-500/60">
                  {line.content}
                </div>
              );
            }

            if (line.type === 'suggestions') {
              return (
                <div key={line.id} className="text-cyan-600 dark:text-cyan-400 font-mono py-1 px-2 bg-cyan-500/10 border border-cyan-500/20 text-[11px]">
                  {line.content}
                </div>
              );
            }

            if (line.type === 'image') {
              return (
                <div
                  key={line.id}
                  className="my-3 p-3 border border-border bg-bg dark:bg-[#161b22] inline-flex flex-col sm:flex-row items-center gap-4 max-w-lg shadow-sm"
                >
                  <img
                    src={line.imageSrc}
                    alt={line.imageAlt}
                    className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded border border-border/80 bg-white/5 p-1"
                  />
                  <div className="space-y-1.5 text-xs">
                    <p className="font-bold text-fg flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      {line.imageAlt}
                    </p>
                    <p className="text-fg-muted text-[11px] whitespace-pre font-mono">
                      {line.content}
                    </p>
                    <span className="inline-block px-2 py-0.5 border border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold">
                      RENDER VISUAL 100% CARGADO
                    </span>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={line.id}
                className="text-fg-muted dark:text-fg/90 whitespace-pre-wrap font-mono text-[11.5px] sm:text-xs"
              >
                {line.content}
              </div>
            );
          })}

          {/* Línea de Input Activo */}
          <div className="flex items-center space-x-2 pt-1">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold select-none whitespace-nowrap">
              alexander@dinopengu:{currentDir === '/home/alexander' ? '~' : currentDir}$
            </span>
            <div className="relative flex-1 flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent border-none outline-none font-mono text-xs text-fg caret-emerald-500 p-0 m-0 focus:ring-0"
                autoFocus
                spellCheck={false}
                autoComplete="off"
                aria-label="Terminal input"
              />
            </div>
          </div>

          <div ref={terminalEndRef} />
        </div>

        {/* Barra de estado inferior */}
        <div className="px-3 py-1.5 border-t border-border bg-bg/80 dark:bg-[#161b22] text-[10px] text-fg-subtle flex justify-between items-center shrink-0 font-mono select-none">
          <span className="hidden sm:inline">
            Presiona <kbd className="px-1 py-0.5 border border-border bg-bg-subtle text-fg font-bold">Tab</kbd> para autocompletar · <kbd className="px-1 py-0.5 border border-border bg-bg-subtle text-fg font-bold">↑</kbd> <kbd className="px-1 py-0.5 border border-border bg-bg-subtle text-fg font-bold">↓</kbd> historial
          </span>
          <span className="sm:hidden">
            Escribe 'help' o 'ls' para comenzar
          </span>
          <span className={`font-bold transition-colors ${isConnected ? 'text-emerald-500' : 'text-red-500'}`}>
            CMD #{commandCount}
          </span>
        </div>
      </div>
    </div>
  );
};

