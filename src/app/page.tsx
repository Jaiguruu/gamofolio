'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { useGameStore, gameEventBus } from '@/store/gameStore';
import { ProjectModal, AboutModal, ContactModal } from '@/components/game/GameModals';
import { SkillsModal } from '@/components/game/SkillsModal';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Keyboard, MousePointer } from 'lucide-react';

// Dynamically import GameEngine to avoid SSR issues with Phaser
const GameEngine = dynamic(() => import('@/components/game/GameEngine'), {
  ssr: false,
  loading: () => <LoadingScreen />,
});

function LoadingScreen() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
        className="text-6xl mb-6"
      >
        🎮
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-emerald-400 font-mono text-xl mb-4"
      >
        Loading PixelDev Quest...
      </motion.div>
      <div className="w-64 h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-1/2 h-full bg-gradient-to-r from-emerald-500 to-teal-400"
        />
      </div>
    </div>
  );
}

function WelcomeOverlay({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900"
    >
      <div className="text-center px-6 max-w-lg">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 200, delay: 0.2 }}
          className="text-8xl mb-6"
        >
          🎮
        </motion.div>
        
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 text-transparent bg-clip-text font-mono"
        >
          PixelDev Quest
        </motion.h1>
        
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-slate-400 font-mono mb-8 text-sm md:text-base"
        >
          An Interactive Developer Portfolio RPG
          <br />
          <span className="text-slate-500">Explore • Discover • Connect</span>
        </motion.p>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-3 gap-4 mb-8 text-xs md:text-sm"
        >
          <div className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <Gamepad2 className="w-6 h-6 text-emerald-400" />
            <span className="text-slate-300">WASD / Arrows</span>
            <span className="text-slate-500">Move</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <Keyboard className="w-6 h-6 text-amber-400" />
            <span className="text-slate-300">Space / E</span>
            <span className="text-slate-500">Interact</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
            <MousePointer className="w-6 h-6 text-cyan-400" />
            <span className="text-slate-300">Click</span>
            <span className="text-slate-500">Navigate</span>
          </div>
        </motion.div>
        
        <motion.button
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onStart}
          className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg font-bold text-white font-mono text-lg shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-shadow"
        >
          Start Adventure
        </motion.button>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-slate-600 text-xs font-mono"
        >
          A portfolio experience by a passionate developer
        </motion.p>
      </div>
    </motion.div>
  );
}

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const { isLoading, closeModal } = useGameStore();
  
  // Handle ESC key to close modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);
  
  const handleStartGame = () => {
    setShowWelcome(false);
    setGameStarted(true);
  };
  
  return (
    <main className="w-screen h-screen overflow-hidden bg-slate-900">
      {/* Welcome overlay */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeOverlay onStart={handleStartGame} />
        )}
      </AnimatePresence>
      
      {/* Game container */}
      {gameStarted && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full relative"
        >
          <GameEngine />
        </motion.div>
      )}
      
      {/* Modal overlays */}
      <ProjectModal />
      <AboutModal />
      <ContactModal />
      <SkillsModal />
      
      {/* Pixel border frame */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute inset-0 border-4 border-slate-800 rounded-lg" />
        <div className="absolute inset-2 border-2 border-slate-700/50 rounded-lg" />
      </div>
    </main>
  );
}
