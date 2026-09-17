import React, { useState, useEffect, useRef } from 'react';

const BOOT = [
  'DinoSoft BIOS v2.4 — Copyright 1993 DinoSoft Corp.',
  'Verificando memoria RAM... 640K OK',
  'Detectando VGA... OK [CGA 320x200]',
  'Cargando MS-RetroOS 3.11...',
  'Inicializando FAT16...',
  'Cargando PC Speaker Driver...',
  'Sistema listo. Bienvenido.',
  '',
  'C:\\GAMES> _',
];

export const BootSequence: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [lines, setLines] = useState<string[]>([]);
  const idx = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      if (idx.current < BOOT.length) {
        setLines(p => [...p, BOOT[idx.current]]);
        idx.current++;
      } else {
        clearInterval(id);
        setTimeout(onDone, 600);
      }
    }, 260);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className="bg-black text-green-400 font-mono text-sm p-4 flex flex-col leading-relaxed min-h-[380px]">
      {lines.map((l, i) => (
        <div key={i}>{l || '\u00A0'}</div>
      ))}
      <div className="animate-pulse">▌</div>
    </div>
  );
};
