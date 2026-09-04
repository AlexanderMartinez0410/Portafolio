import React, { useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { NavigationProvider, useNavigation } from './context/NavigationContext';
import { Sidebar } from './components/Sidebar';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Lab } from './components/Lab';
import { Experience } from './components/Experience';
import { Contact } from './components/Contact';

import { motion, AnimatePresence, type Variants } from 'motion/react';
import { ReadingProgressBar } from './components/ReadingProgressBar';
import { CursorAura } from './components/CursorAura';

const sheetVariants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 80 : -80,
    y: 12,
    rotateZ: direction > 0 ? 1.5 : -1.5,
    scale: 0.985,
    opacity: 0,
    filter: 'blur(3px)',
  }),
  center: {
    x: 0,
    y: 0,
    rotateZ: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -80 : 80,
    y: -10,
    rotateZ: direction > 0 ? -1.5 : 1.5,
    scale: 0.985,
    opacity: 0,
    filter: 'blur(3px)',
    transition: {
      duration: 0.28,
      ease: [0.32, 0, 0.67, 0],
    },
  }),
};

const ExhibitionArea: React.FC = () => {
  const { activeSection, direction } = useNavigation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleExitComplete = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="lg:ml-[22%] xl:ml-[24%] h-[calc(100vh-65px)] lg:h-screen overflow-y-auto overflow-x-hidden focus:outline-none flex flex-col relative"
      tabIndex={-1}
    >
      <ReadingProgressBar containerRef={scrollContainerRef} />
      <main className="max-w-5xl w-full mx-auto px-6 sm:px-10 md:px-14 lg:px-16 py-8 sm:py-12 md:py-16 flex-1 flex flex-col">
        <AnimatePresence mode="wait" custom={direction} onExitComplete={handleExitComplete}>
          <motion.div
            key={activeSection}
            custom={direction}
            variants={sheetVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col w-full origin-center"
          >
            {activeSection === 'sobre-mi' && <Hero />}
            {activeSection === 'proyectos' && <Projects />}
            {activeSection === 'experimentos' && <Lab />}
            {activeSection === 'experiencia' && <Experience />}
            {activeSection === 'contacto' && <Contact />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NavigationProvider>
          <div className="min-h-screen bg-bg text-fg transition-colors duration-200 overflow-hidden relative">
            {/* Efecto de luz tenue (Dark) o silueta de tinta (Light) al mover el cursor */}
            <CursorAura />

            {/* Sidebar Fijo Izquierdo (Desktop) / Cabecera (Móvil) */}
            <Sidebar />

            {/* Área de Exhibición con Scroll Interno Independiente */}
            <ExhibitionArea />
          </div>
        </NavigationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;
