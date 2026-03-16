// Game Types for PixelDev Quest

export interface Position {
  x: number;
  y: number;
}

export interface TilePosition {
  tileX: number;
  tileY: number;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured: boolean;
  order: number;
  positionX: number;
  positionY: number;
  buildingType: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  description: string;
  iconUrl?: string;
  yearsOfExp?: number;
  isNpc: boolean;
  npcDialogue?: string[];
}

export interface NPCData {
  id: string;
  name: string;
  type: 'skill_mentor' | 'guide' | 'quest_giver' | 'about_me';
  spriteKey: string;
  positionX: number;
  positionY: number;
  dialogues: DialogueLine[];
}

export interface DialogueLine {
  text: string;
  speaker?: string;
  emotion?: 'neutral' | 'happy' | 'thinking' | 'excited';
}

export interface DeveloperProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  email?: string;
  github?: string;
  linkedin?: string;
  website?: string;
  resumeUrl?: string;
  avatarUrl?: string;
}

export interface GameState {
  // Game state
  isGamePaused: boolean;
  isModalOpen: boolean;
  modalType: 'project' | 'skill' | 'about' | 'contact' | null;
  
  // Current interaction data
  currentProject: Project | null;
  currentNPC: NPCData | null;
  currentSkill: Skill | null;
  currentDialogue: DialogueLine[] | null;
  dialogueIndex: number;
  
  // Player state
  playerPosition: Position;
  
  // UI state
  showControls: boolean;
  isLoading: boolean;
  
  // Actions
  pauseGame: () => void;
  resumeGame: () => void;
  openModal: (type: 'project' | 'skill' | 'about' | 'contact', data?: unknown) => void;
  closeModal: () => void;
  setDialogue: (dialogue: DialogueLine[]) => void;
  advanceDialogue: () => void;
  setPlayerPosition: (pos: Position) => void;
  setLoading: (loading: boolean) => void;
}

export interface GameConfig {
  TILE_SIZE: number;
  GAME_WIDTH: number;
  GAME_HEIGHT: number;
  PLAYER_SPEED: number;
  INTERACTION_RADIUS: number;
}

export const GAME_CONFIG: GameConfig = {
  TILE_SIZE: 32,
  GAME_WIDTH: 800,
  GAME_HEIGHT: 600,
  PLAYER_SPEED: 150,
  INTERACTION_RADIUS: 48, // 1.5 tiles
};
