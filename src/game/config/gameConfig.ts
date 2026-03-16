// Phaser Game Configuration
import Phaser from 'phaser';
import { GAME_CONFIG } from '@/types/game';

export const phaserGameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_CONFIG.GAME_WIDTH,
  height: GAME_CONFIG.GAME_HEIGHT,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  pixelArt: true, // Critical for crisp pixel art
  roundPixels: true,
  antialias: false,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 240,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 0 },
      debug: false,
      tileBias: 16,
    },
  },
  render: {
    pixelArt: true,
    antialias: false,
    roundPixels: true,
  },
};

// Asset keys
export const ASSET_KEYS = {
  // Player sprites
  PLAYER_IDLE: 'player_idle',
  PLAYER_WALK: 'player_walk',
  
  // NPCs
  NPC_MENTOR: 'npc_mentor',
  NPC_TECH: 'npc_tech',
  
  // Environment
  WORLD_TILESET: 'world_tileset',
  BUILDINGS: 'buildings',
  DECORATIONS: 'decorations',
  
  // UI
  DIALOG_BOX: 'dialog_box',
  ICONS: 'icons',
  
  // Audio
  BGM_MAIN: 'bgm_main',
  SFX_FOOTSTEP_GRASS: 'sfx_footstep_grass',
  SFX_FOOTSTEP_DIRT: 'sfx_footstep_dirt',
  SFX_INTERACT: 'sfx_interact',
  SFX_DIALOGUE_BLEEP: 'sfx_dialogue_bleep',
  
  // Maps
  MAP_MAIN: 'map_main',
};

// Animation keys
export const ANIM_KEYS = {
  PLAYER_IDLE_DOWN: 'player_idle_down',
  PLAYER_IDLE_UP: 'player_idle_up',
  PLAYER_IDLE_LEFT: 'player_idle_left',
  PLAYER_IDLE_RIGHT: 'player_idle_right',
  PLAYER_WALK_DOWN: 'player_walk_down',
  PLAYER_WALK_UP: 'player_walk_up',
  PLAYER_WALK_LEFT: 'player_walk_left',
  PLAYER_WALK_RIGHT: 'player_walk_right',
  
  NPC_MENTOR_IDLE: 'npc_mentor_idle',
  NPC_TECH_IDLE: 'npc_tech_idle',
  
  EXCLAMATION_BOUNCE: 'exclamation_bounce',
  WATER_RIPPLE: 'water_ripple',
};

// Tile indices for collision
export const COLLISION_TILES = {
  WATER: [1, 2, 3, 4],
  TREES: [10, 11, 12, 13],
  BUILDINGS: [20, 21, 22, 23, 24, 25],
  ROCKS: [30, 31],
};
