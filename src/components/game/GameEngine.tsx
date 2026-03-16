'use client';

import { useEffect, useRef, useCallback } from 'react';
import Phaser from 'phaser';
import { PreloadScene } from '@/game/scenes/PreloadScene';
import { MainWorldScene } from '@/game/scenes/MainWorldScene';
import { phaserGameConfig } from '@/game/config/gameConfig';
import { useGameStore, gameEventBus } from '@/store/gameStore';
import type { Project, NPCData, Skill } from '@/types/game';

// Extend Phaser config with scenes
const gameConfig: Phaser.Types.Core.GameConfig = {
  ...phaserGameConfig,
  scene: [PreloadScene, MainWorldScene],
};

export default function GameEngine() {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { 
    openModal, 
    setLoading,
    resumeGame 
  } = useGameStore();

  // Handle events from Phaser
  const setupEventListeners = useCallback(() => {
    gameEventBus.on('openProject', (data) => {
      openModal('project', data as Project);
    });
    
    gameEventBus.on('openAbout', (data) => {
      openModal('about', data as NPCData);
    });
    
    gameEventBus.on('openSkill', () => {
      openModal('skill');
    });
    
    gameEventBus.on('openContact', () => {
      openModal('contact');
    });
    
    gameEventBus.on('closeModal', () => {
      resumeGame();
    });
  }, [openModal, resumeGame]);

  useEffect(() => {
    // Only initialize game on client side
    if (typeof window === 'undefined' || !containerRef.current) return;
    
    // Prevent multiple game instances
    if (gameRef.current) return;
    
    // Initialize Phaser game
    gameRef.current = new Phaser.Game({
      ...gameConfig,
      parent: containerRef.current,
    });
    
    // Setup event listeners
    setupEventListeners();
    
    // Signal that game is loaded
    gameRef.current.events.once('ready', () => {
      setLoading(false);
    });
    
    // Cleanup
    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [setupEventListeners, setLoading]);

  return (
    <div className="relative w-full h-full">
      {/* Game container */}
      <div 
        ref={containerRef} 
        id="game-container"
        className="w-full h-full"
      />
      
      {/* Scanline overlay for retro effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
        }}
      />
    </div>
  );
}
