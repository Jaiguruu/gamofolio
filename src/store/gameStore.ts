import { create } from 'zustand';
import type { GameState, Project, NPCData, Skill, DialogueLine, Position } from '@/types/game';

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  isGamePaused: false,
  isModalOpen: false,
  modalType: null,
  
  currentProject: null,
  currentNPC: null,
  currentSkill: null,
  currentDialogue: null,
  dialogueIndex: 0,
  
  playerPosition: { x: 0, y: 0 },
  
  showControls: true,
  isLoading: true,
  
  // Actions
  pauseGame: () => set({ isGamePaused: true }),
  
  resumeGame: () => set({ 
    isGamePaused: false,
    isModalOpen: false,
    modalType: null,
    currentDialogue: null,
    dialogueIndex: 0
  }),
  
  openModal: (type, data) => {
    const updates: Partial<GameState> = {
      isModalOpen: true,
      isGamePaused: true,
      modalType: type,
    };
    
    if (type === 'project' && data) {
      updates.currentProject = data as Project;
    } else if (type === 'skill' && data) {
      updates.currentSkill = data as Skill;
    } else if (type === 'about' && data) {
      updates.currentNPC = data as NPCData;
    }
    
    set(updates);
  },
  
  closeModal: () => set({
    isModalOpen: false,
    isGamePaused: false,
    modalType: null,
    currentProject: null,
    currentNPC: null,
    currentSkill: null,
    currentDialogue: null,
    dialogueIndex: 0
  }),
  
  setDialogue: (dialogue: DialogueLine[]) => set({
    currentDialogue: dialogue,
    dialogueIndex: 0
  }),
  
  advanceDialogue: () => {
    const { currentDialogue, dialogueIndex } = get();
    if (currentDialogue && dialogueIndex < currentDialogue.length - 1) {
      set({ dialogueIndex: dialogueIndex + 1 });
    } else {
      // End of dialogue
      set({ 
        currentDialogue: null, 
        dialogueIndex: 0,
        isModalOpen: false,
        isGamePaused: false 
      });
    }
  },
  
  setPlayerPosition: (pos: Position) => set({ playerPosition: pos }),
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
}));

// Event bus for Phaser-React communication
type GameEventType = 
  | 'playerInteract'
  | 'openProject'
  | 'openSkill'
  | 'openAbout'
  | 'openContact'
  | 'closeModal'
  | 'dialogueAdvance';

type GameEventCallback = (data?: unknown) => void;

class GameEventBus {
  private listeners: Map<GameEventType, GameEventCallback[]> = new Map();
  
  on(event: GameEventType, callback: GameEventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }
  
  off(event: GameEventType, callback: GameEventCallback) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
  
  emit(event: GameEventType, data?: unknown) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
  }
}

export const gameEventBus = new GameEventBus();
