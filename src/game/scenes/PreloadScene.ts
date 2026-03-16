// Preload Scene - Load all game assets
import Phaser from 'phaser';
import { ASSET_KEYS, ANIM_KEYS } from '../config/gameConfig';

export class PreloadScene extends Phaser.Scene {
  private loadingBar!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;
  private loadingText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.createLoadingBar();
    
    // Set up load events
    this.load.on('progress', (value: number) => {
      this.updateProgress(value);
    });
    
    this.load.on('complete', () => {
      this.loadComplete();
    });

    // Load player sprites
    this.load.image(ASSET_KEYS.PLAYER_IDLE, '/assets/characters/player/spr_player_idle.png');
    this.load.image(ASSET_KEYS.PLAYER_WALK, '/assets/characters/player/spr_player_walk.png');
    
    // Load NPC sprites
    this.load.image(ASSET_KEYS.NPC_MENTOR, '/assets/characters/npcs/spr_npc_mentor.png');
    this.load.image(ASSET_KEYS.NPC_TECH, '/assets/characters/npcs/spr_npc_tech.png');
    
    // Load environment
    this.load.image(ASSET_KEYS.WORLD_TILESET, '/assets/environment/tiles/tex_world_tileset.png');
    this.load.image(ASSET_KEYS.BUILDINGS, '/assets/environment/tiles/tex_buildings.png');
    this.load.image(ASSET_KEYS.DECORATIONS, '/assets/environment/tiles/tex_decorations.png');
    
    // Load UI
    this.load.image(ASSET_KEYS.DIALOG_BOX, '/assets/ui/spr_dialog_box_9slice.png');
    this.load.image(ASSET_KEYS.ICONS, '/assets/ui/spr_icons.png');
    
    // Note: Audio would be loaded here in production
    // this.load.audio(ASSET_KEYS.BGM_MAIN, '/assets/audio/bgm_chill_lofi.mp3');
  }

  private createLoadingBar(): void {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Loading bar background
    this.loadingBar = this.add.graphics();
    this.loadingBar.fillStyle(0x222222, 1);
    this.loadingBar.fillRect(width / 4, height / 2 - 15, width / 2, 30);
    
    // Progress bar
    this.progressBar = this.add.graphics();
    
    // Loading text
    this.loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading PixelDev Quest...', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffffff',
    });
    this.loadingText.setOrigin(0.5, 0.5);
    
    // Title
    const titleText = this.add.text(width / 2, height / 3, '🎮 PixelDev Quest', {
      fontFamily: 'monospace',
      fontSize: '32px',
      color: '#4ade80',
      fontStyle: 'bold',
    });
    titleText.setOrigin(0.5, 0.5);
  }

  private updateProgress(value: number): void {
    const width = this.cameras.main.width;
    
    this.progressBar.clear();
    this.progressBar.fillStyle(0x4ade80, 1);
    this.progressBar.fillRect(
      width / 4 + 5,
      this.cameras.main.height / 2 - 10,
      (width / 2 - 10) * value,
      20
    );
  }

  private loadComplete(): void {
    this.createAnimations();
    
    // Transition to main scene
    this.cameras.main.fadeOut(500, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('MainWorldScene');
    });
  }

  private createAnimations(): void {
    // Player walk animations
    // Note: In production, these would use proper sprite sheet frames
    // For now, we'll create simple animations
    
    this.anims.create({
      key: ANIM_KEYS.PLAYER_WALK_DOWN,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_WALK, { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });
    
    this.anims.create({
      key: ANIM_KEYS.PLAYER_WALK_UP,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_WALK, { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });
    
    this.anims.create({
      key: ANIM_KEYS.PLAYER_WALK_LEFT,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_WALK, { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });
    
    this.anims.create({
      key: ANIM_KEYS.PLAYER_WALK_RIGHT,
      frames: this.anims.generateFrameNumbers(ASSET_KEYS.PLAYER_WALK, { start: 12, end: 15 }),
      frameRate: 8,
      repeat: -1,
    });
    
  }
}
