// Main World Scene - The playable portfolio world
import Phaser from 'phaser';
import { ASSET_KEYS, ANIM_KEYS } from '../config/gameConfig';
import { GAME_CONFIG } from '@/types/game';
import { gameEventBus } from '@/store/gameStore';

interface InteractableObject {
  sprite: Phaser.GameObjects.Sprite;
  type: 'project' | 'npc' | 'skill' | 'contact';
  data: Record<string, unknown>;
  exclamation?: Phaser.GameObjects.Sprite;
  isActive: boolean;
}

export class MainWorldScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private interactKey!: Phaser.Input.Keyboard.Key;
  private wasdKeys!: { W: Phaser.Input.Keyboard.Key; A: Phaser.Input.Keyboard.Key; S: Phaser.Input.Keyboard.Key; D: Phaser.Input.Keyboard.Key };
  private interactables: InteractableObject[] = [];
  private currentInteractable: InteractableObject | null = null;
  private playerDirection: 'down' | 'up' | 'left' | 'right' = 'down';
  private isMoving = false;
  private shadow!: Phaser.GameObjects.Ellipse;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter | null = null;
  private interactHint: Phaser.GameObjects.Text | null = null;

  constructor() {
    super({ key: 'MainWorldScene' });
  }

  create(): void {
    // Fade in
    this.cameras.main.fadeIn(500);
    
    // Create the world
    this.createWorld();
    
    // Create player
    this.createPlayer();
    
    // Create interactable objects (buildings, NPCs)
    this.createInteractables();
    
    // Setup input
    this.setupInput();
    
    // Setup camera
    this.setupCamera();
    
    // Create UI elements
    this.createUI();
    
    // Listen for events from React
    this.setupEventListeners();
    
    // Initial position check
    this.checkInteractables();
  }

  private createWorld(): void {
    // Create a simple colored background as base
    const graphics = this.add.graphics();
    
    // Draw grass background
    graphics.fillStyle(0x3d8b40, 1);
    graphics.fillRect(0, 0, this.scale.width * 2, this.scale.height * 2);
    
    // Draw dirt paths
    graphics.fillStyle(0x8b6914, 1);
    graphics.fillRect(350, 0, 100, this.scale.height * 2);
    graphics.fillRect(0, 250, this.scale.width * 2, 80);
    
    // Add some decorative elements
    this.createEnvironmentDetails();
  }

  private createEnvironmentDetails(): void {
    // Add trees
    const treePositions = [
      { x: 100, y: 100 }, { x: 200, y: 80 }, { x: 600, y: 120 },
      { x: 50, y: 400 }, { x: 700, y: 450 }, { x: 750, y: 200 },
      { x: 650, y: 500 }, { x: 80, y: 550 },
    ];
    
    treePositions.forEach(pos => {
      const tree = this.add.graphics();
      // Tree trunk
      tree.fillStyle(0x5c3d2e, 1);
      tree.fillRect(pos.x + 8, pos.y + 20, 16, 20);
      // Tree foliage
      tree.fillStyle(0x2d5a27, 1);
      tree.fillCircle(pos.x + 16, pos.y + 10, 20);
      tree.fillStyle(0x3d7a37, 1);
      tree.fillCircle(pos.x + 10, pos.y + 15, 15);
      tree.fillCircle(pos.x + 22, pos.y + 15, 15);
      
      // Make tree interactable (blocking)
      const treeZone = this.add.zone(pos.x + 16, pos.y + 25, 32, 40);
      this.physics.add.existing(treeZone, true);
    });
    
    // Add water pond
    const water = this.add.graphics();
    water.fillStyle(0x4a90d9, 0.8);
    water.fillEllipse(650, 350, 100, 60);
    
    // Add water ripple effect
    this.tweens.add({
      targets: water,
      alpha: 0.6,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Add flowers
    const flowerPositions = [
      { x: 150, y: 500 }, { x: 180, y: 520 }, { x: 500, y: 450 },
      { x: 550, y: 500 }, { x: 300, y: 150 },
    ];
    
    flowerPositions.forEach((pos, i) => {
      const flower = this.add.graphics();
      const colors = [0xff6b6b, 0xffd93d, 0xff8fd8];
      flower.fillStyle(colors[i % colors.length], 1);
      flower.fillCircle(pos.x, pos.y, 5);
      flower.fillStyle(0xffffff, 1);
      flower.fillCircle(pos.x, pos.y, 2);
    });
  }

  private createPlayer(): void {
    const startX = 400;
    const startY = 300;
    
    // Create shadow first
    this.shadow = this.add.ellipse(startX, startY + 5, 24, 8, 0x000000, 0.3);
    this.shadow.setDepth(5);
    
    // Create player sprite
    this.player = this.physics.add.sprite(startX, startY, ASSET_KEYS.PLAYER_IDLE);
    this.player.setCollideWorldBounds(true);
    this.player.setDepth(10);
    this.player.setScale(1.5);
    
    // Set physics body size for better collision
    this.player.body?.setSize(20, 20);
    this.player.body?.setOffset(22, 44);
  }

  private createInteractables(): void {
    // Create project buildings
    this.createProjectBuilding({
      x: 200,
      y: 250,
      id: 'project-1',
      title: 'E-Commerce Platform',
      description: 'A full-stack e-commerce solution built with Next.js, Prisma, and Stripe.',
      techStack: ['Next.js', 'TypeScript', 'Prisma', 'Stripe'],
      githubUrl: 'https://github.com/example/ecommerce',
      liveUrl: 'https://ecommerce-demo.vercel.app',
      buildingType: 'shop',
    });
    
    this.createProjectBuilding({
      x: 550,
      y: 250,
      id: 'project-2',
      title: 'Task Management App',
      description: 'Real-time collaborative task management with drag-and-drop functionality.',
      techStack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
      githubUrl: 'https://github.com/example/taskapp',
      buildingType: 'workshop',
    });
    
    this.createProjectBuilding({
      x: 300,
      y: 480,
      id: 'project-3',
      title: 'AI Chat Application',
      description: 'An intelligent chatbot powered by GPT-4 with context awareness.',
      techStack: ['Next.js', 'OpenAI API', 'Tailwind CSS', 'Vercel'],
      githubUrl: 'https://github.com/example/aichat',
      liveUrl: 'https://ai-chat-demo.vercel.app',
      buildingType: 'tower',
    });
    
    // Create NPCs
    this.createNPC({
      x: 500,
      y: 150,
      id: 'npc-skills',
      name: 'Tech Mentor',
      type: 'skill_mentor',
      dialogues: [
        { text: "Welcome, traveler! I'm the Tech Mentor.", emotion: 'happy' },
        { text: 'I see you\'re interested in my skills. Let me share my expertise with you.', emotion: 'neutral' },
        { text: 'I specialize in React, TypeScript, Node.js, and modern web technologies.', emotion: 'excited' },
        { text: 'Feel free to explore the buildings around here to see my projects!', emotion: 'happy' },
      ],
    });
    
    this.createNPC({
      x: 150,
      y: 350,
      id: 'npc-about',
      name: 'Guide Luna',
      type: 'about_me',
      dialogues: [
        { text: "Hello there! I'm Luna, your guide.", emotion: 'happy' },
        { text: 'I\'m a passionate full-stack developer with 5+ years of experience.', emotion: 'neutral' },
        { text: 'I love building interactive experiences and beautiful user interfaces.', emotion: 'excited' },
        { text: 'This world represents my journey and projects. Enjoy exploring!', emotion: 'happy' },
      ],
    });
    
    // Create contact point
    this.createContactPoint({
      x: 650,
      y: 480,
    });
  }

  private createProjectBuilding(project: {
    x: number;
    y: number;
    id: string;
    title: string;
    description: string;
    techStack: string[];
    githubUrl?: string;
    liveUrl?: string;
    buildingType: string;
  }): void {
    // Create building graphic
    const building = this.add.graphics();
    
    // Building base
    const colors: Record<string, number> = {
      shop: 0x8b4513,
      workshop: 0x4a5568,
      tower: 0x2d3748,
    };
    
    const baseColor = colors[project.buildingType] || 0x8b4513;
    
    // Building body
    building.fillStyle(baseColor, 1);
    building.fillRect(project.x - 40, project.y - 30, 80, 60);
    
    // Roof
    building.fillStyle(0x654321, 1);
    building.fillTriangle(project.x - 50, project.y - 30, project.x + 50, project.y - 30, project.x, project.y - 60);
    
    // Door
    building.fillStyle(0x2d1810, 1);
    building.fillRect(project.x - 10, project.y, 20, 30);
    
    // Window
    building.fillStyle(0x87ceeb, 0.8);
    building.fillRect(project.x - 30, project.y - 15, 15, 15);
    building.fillRect(project.x + 15, project.y - 15, 15, 15);
    
    // Window frames
    building.lineStyle(2, 0x4a3728, 1);
    building.strokeRect(project.x - 30, project.y - 15, 15, 15);
    building.strokeRect(project.x + 15, project.y - 15, 15, 15);
    
    // Project title sign
    const signText = this.add.text(project.x, project.y + 50, project.title, {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffffff',
      backgroundColor: '#1a1a2e',
      padding: { x: 4, y: 2 },
    });
    signText.setOrigin(0.5, 0);
    signText.setDepth(15);
    
    // Create interactable zone
    const zone = this.add.zone(project.x, project.y + 15, 90, 80);
    this.physics.add.existing(zone, true);
    
    // Create exclamation mark (hidden initially)
    const exclamation = this.add.text(project.x, project.y - 70, '!', {
      fontFamily: 'monospace',
      fontSize: '24px',
      color: '#ffd700',
      fontStyle: 'bold',
    });
    exclamation.setOrigin(0.5, 0.5);
    exclamation.setDepth(20);
    exclamation.setVisible(false);
    
    this.interactables.push({
      sprite: this.add.sprite(project.x, project.y, '__DEFAULT').setVisible(false),
      type: 'project',
      data: project,
      exclamation: exclamation as unknown as Phaser.GameObjects.Sprite,
      isActive: false,
    });
  }

  private createNPC(npc: {
    x: number;
    y: number;
    id: string;
    name: string;
    type: string;
    dialogues: Array<{ text: string; emotion?: string }>;
  }): void {
    // Create NPC shadow
    const shadow = this.add.ellipse(npc.x, npc.y + 5, 20, 6, 0x000000, 0.3);
    shadow.setDepth(5);
    
    // Create NPC sprite (using placeholder graphics)
    const npcSprite = this.add.graphics();
    
    // Body
    npcSprite.fillStyle(0x6b4c9a, 1);
    npcSprite.fillEllipse(npc.x, npc.y - 10, 24, 30);
    
    // Head
    npcSprite.fillStyle(0xffd5b4, 1);
    npcSprite.fillCircle(npc.x, npc.y - 30, 12);
    
    // Hair
    npcSprite.fillStyle(0x4a2c2a, 1);
    npcSprite.fillEllipse(npc.x, npc.y - 38, 14, 10);
    
    // Eyes
    npcSprite.fillStyle(0x000000, 1);
    npcSprite.fillCircle(npc.x - 4, npc.y - 30, 2);
    npcSprite.fillCircle(npc.x + 4, npc.y - 30, 2);
    
    // Name tag
    const nameTag = this.add.text(npc.x, npc.y - 55, npc.name, {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffffff',
      backgroundColor: '#4a5568',
      padding: { x: 3, y: 1 },
    });
    nameTag.setOrigin(0.5, 0.5);
    nameTag.setDepth(15);
    
    // Idle animation (subtle bobbing)
    this.tweens.add({
      targets: npcSprite,
      y: -2,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    
    // Create interactable zone
    const zone = this.add.zone(npc.x, npc.y, 40, 50);
    this.physics.add.existing(zone, true);
    
    // Create exclamation mark
    const exclamation = this.add.text(npc.x, npc.y - 60, '!', {
      fontFamily: 'monospace',
      fontSize: '20px',
      color: '#ffd700',
      fontStyle: 'bold',
    });
    exclamation.setOrigin(0.5, 0.5);
    exclamation.setDepth(20);
    exclamation.setVisible(false);
    
    this.interactables.push({
      sprite: this.add.sprite(npc.x, npc.y, '__DEFAULT').setVisible(false),
      type: 'npc',
      data: npc,
      exclamation: exclamation as unknown as Phaser.GameObjects.Sprite,
      isActive: false,
    });
  }

  private createContactPoint(data: { x: number; y: number }): void {
    // Create mailbox/contact point
    const mailbox = this.add.graphics();
    
    // Post
    mailbox.fillStyle(0x8b4513, 1);
    mailbox.fillRect(data.x - 5, data.y - 30, 10, 40);
    
    // Box
    mailbox.fillStyle(0x1e40af, 1);
    mailbox.fillRect(data.x - 15, data.y - 45, 30, 20);
    
    // Flag
    mailbox.fillStyle(0xef4444, 1);
    mailbox.fillTriangle(data.x + 15, data.y - 45, data.x + 25, data.y - 45, data.x + 15, data.y - 35);
    
    // Label
    const label = this.add.text(data.x, data.y + 20, 'Contact Me', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffffff',
      backgroundColor: '#1e40af',
      padding: { x: 4, y: 2 },
    });
    label.setOrigin(0.5, 0);
    label.setDepth(15);
    
    // Create interactable zone
    const zone = this.add.zone(data.x, data.y, 40, 50);
    this.physics.add.existing(zone, true);
    
    this.interactables.push({
      sprite: this.add.sprite(data.x, data.y, '__DEFAULT').setVisible(false),
      type: 'contact',
      data: { type: 'contact' },
      isActive: false,
    });
  }

  private setupInput(): void {
    if (this.input.keyboard) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.interactKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
      
      this.wasdKeys = {
        W: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        A: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        S: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
        D: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      };
    }
  }

  private setupCamera(): void {
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setZoom(1);
    this.cameras.main.setBounds(0, 0, this.scale.width * 2, this.scale.height * 2);
  }

  private createUI(): void {
    // Controls hint
    const controlsBox = this.add.graphics();
    controlsBox.fillStyle(0x000000, 0.7);
    controlsBox.fillRoundedRect(10, 10, 150, 70, 8);
    controlsBox.setScrollFactor(0);
    controlsBox.setDepth(100);
    
    const controlsText = this.add.text(20, 20, 'Controls:\nWASD / Arrows: Move\nSpace / E: Interact', {
      fontFamily: 'monospace',
      fontSize: '11px',
      color: '#ffffff',
      lineSpacing: 4,
    });
    controlsText.setScrollFactor(0);
    controlsText.setDepth(101);
    
    // Interaction hint (shown near interactables)
    this.interactHint = this.add.text(0, 0, 'Press SPACE to interact', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#4ade80',
      backgroundColor: '#000000aa',
      padding: { x: 6, y: 3 },
    });
    this.interactHint.setOrigin(0.5, 0.5);
    this.interactHint.setDepth(100);
    this.interactHint.setVisible(false);
  }

  private setupEventListeners(): void {
    gameEventBus.on('closeModal', () => {
      this.resumePlayer();
    });
  }

  update(): void {
    if (!this.player || !this.cursors) return;
    
    // Handle player movement
    this.handlePlayerMovement();
    
    // Check for nearby interactables
    this.checkInteractables();
    
    // Handle interaction input
    this.handleInteraction();
    
    // Update shadow position
    if (this.shadow) {
      this.shadow.setPosition(this.player.x, this.player.y + 5);
    }
  }

  private handlePlayerMovement(): void {
    const speed = GAME_CONFIG.PLAYER_SPEED;
    let velocityX = 0;
    let velocityY = 0;
    
    // Check WASD and arrow keys
    if (this.cursors.left.isDown || this.wasdKeys.A.isDown) {
      velocityX = -speed;
      this.playerDirection = 'left';
      this.isMoving = true;
    } else if (this.cursors.right.isDown || this.wasdKeys.D.isDown) {
      velocityX = speed;
      this.playerDirection = 'right';
      this.isMoving = true;
    }
    
    if (this.cursors.up.isDown || this.wasdKeys.W.isDown) {
      velocityY = -speed;
      this.playerDirection = 'up';
      this.isMoving = true;
    } else if (this.cursors.down.isDown || this.wasdKeys.S.isDown) {
      velocityY = speed;
      this.playerDirection = 'down';
      this.isMoving = true;
    }
    
    // Diagonal movement normalization
    if (velocityX !== 0 && velocityY !== 0) {
      velocityX *= 0.707;
      velocityY *= 0.707;
    }
    
    // Apply velocity
    if (this.player.body) {
      this.player.body.setVelocity(velocityX, velocityY);
    }
    
    // Update isMoving flag
    this.isMoving = velocityX !== 0 || velocityY !== 0;
  }

  private checkInteractables(): void {
    const playerPos = this.player;
    let closestInteractable: InteractableObject | null = null;
    let closestDistance = GAME_CONFIG.INTERACTION_RADIUS;
    
    this.interactables.forEach(interactable => {
      const distance = Phaser.Math.Distance.Between(
        playerPos.x,
        playerPos.y,
        interactable.sprite.x,
        interactable.sprite.y
      );
      
      // Update active state
      const isActive = distance < GAME_CONFIG.INTERACTION_RADIUS;
      interactable.isActive = isActive;
      
      // Show/hide exclamation
      if (interactable.exclamation) {
        interactable.exclamation.setVisible(isActive);
        
        // Animate exclamation
        if (isActive && !interactable.exclamation.getData('animating')) {
          interactable.exclamation.setData('animating', true);
          this.tweens.add({
            targets: interactable.exclamation,
            y: interactable.sprite.y - 80,
            duration: 500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
          });
        } else if (!isActive) {
          interactable.exclamation.setData('animating', false);
          this.tweens.killTweensOf(interactable.exclamation);
        }
      }
      
      // Find closest
      if (isActive && distance < closestDistance) {
        closestDistance = distance;
        closestInteractable = interactable;
      }
    });
    
    // Update current interactable
    this.currentInteractable = closestInteractable;
    
    // Show/hide interaction hint
    if (this.interactHint) {
      if (closestInteractable) {
        this.interactHint.setVisible(true);
        this.interactHint.setPosition(
          this.player.x,
          this.player.y - 50
        );
      } else {
        this.interactHint.setVisible(false);
      }
    }
  }

  private handleInteraction(): void {
    if (Phaser.Input.Keyboard.JustDown(this.interactKey) && this.currentInteractable) {
      this.triggerInteraction(this.currentInteractable);
    }
  }

  private triggerInteraction(interactable: InteractableObject): void {
    // Play interaction sound effect
    // this.sound.play(ASSET_KEYS.SFX_INTERACT);
    
    // Camera zoom effect
    this.cameras.main.zoomTo(1.1, 200, 'Sine.easeOut');
    
    // Emit event to React
    gameEventBus.emit('playerInteract', interactable);
    
    // Pause player movement
    this.pausePlayer();
    
    // Open appropriate modal based on type
    switch (interactable.type) {
      case 'project':
        gameEventBus.emit('openProject', interactable.data);
        break;
      case 'npc':
        // Check if NPC is a skill mentor
        const npcData = interactable.data as { type?: string };
        if (npcData.type === 'skill_mentor') {
          gameEventBus.emit('openSkill', interactable.data);
        } else {
          gameEventBus.emit('openAbout', interactable.data);
        }
        break;
      case 'skill':
        gameEventBus.emit('openSkill', interactable.data);
        break;
      case 'contact':
        gameEventBus.emit('openContact', interactable.data);
        break;
    }
  }

  pausePlayer(): void {
    if (this.player.body) {
      this.player.body.setVelocity(0, 0);
    }
    this.isMoving = false;
  }

  resumePlayer(): void {
    this.cameras.main.zoomTo(1, 200, 'Sine.easeOut');
  }
}
