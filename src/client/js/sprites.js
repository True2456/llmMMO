/**
 * PRIMA: Age of Bronze - Pixel Art Sprite Engine
 * Generates and caches authentic 16-bit pixel-art sprite sheets and tile graphics
 * onto offscreen canvases for zero-latency, high-performance rendering.
 */

export class SpriteEngine {
  constructor() {
    this.sprites = new Map(); // key -> HTMLCanvasElement
    this.initAllSprites();
  }

  createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    return { canvas, ctx };
  }

  initAllSprites() {
    this.generatePlayerSprites();
    this.generateMonsterSprites();
    this.generateTileSprites();
    this.generateResourceSprites();
    this.generateItemIcons();
    console.log(`[SpriteEngine] 16-Bit Pixel Art Sprites initialized successfully (${this.sprites.size} sprites cached).`);
  }

  getSprite(key) {
    return this.sprites.get(key);
  }

  // =========================================================================
  // 1. Player Character Sprites (4 Directions, Walk Animation Frames)
  // =========================================================================
  generatePlayerSprites() {
    const directions = ['S', 'N', 'E', 'W'];
    const frames = [0, 1, 2]; // 0: Idle/Step L, 1: Idle, 2: Step R

    directions.forEach(dir => {
      frames.forEach(frame => {
        const { canvas, ctx } = this.createCanvas(24, 28);
        const bob = (frame === 1) ? 0 : 1;
        const legShift = (frame === 0) ? -2 : (frame === 2 ? 2 : 0);

        // Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.beginPath();
        ctx.ellipse(12, 26, 7, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Legs / Leather wraps
        ctx.fillStyle = '#6e4726';
        ctx.fillRect(8 + legShift, 18 + bob, 3, 7 - bob);
        ctx.fillRect(13 - legShift, 18 + bob, 3, 7 - bob);
        ctx.fillStyle = '#4a2f18'; // Fur boots
        ctx.fillRect(7 + legShift, 23, 4, 3);
        ctx.fillRect(13 - legShift, 23, 4, 3);

        // Body / Hide Tunic
        ctx.fillStyle = '#8a5a36';
        ctx.fillRect(7, 10 + bob, 10, 9);
        // Bronze Chestplate
        ctx.fillStyle = '#d48a37';
        ctx.fillRect(8, 11 + bob, 8, 7);
        ctx.fillStyle = '#f3a847'; // Specular highlight
        ctx.fillRect(9, 12 + bob, 3, 4);

        // Head / Face
        ctx.fillStyle = '#e0a96d'; // Skin tone
        ctx.fillRect(8, 4 + bob, 8, 7);

        // Hair / Feathered Headdress
        ctx.fillStyle = '#3a2010'; // Hair
        ctx.fillRect(7, 3 + bob, 10, 3);
        ctx.fillStyle = '#e74c3c'; // Red Feather
        ctx.fillRect(dir === 'E' ? 6 : (dir === 'W' ? 16 : 11), 0 + bob, 2, 4);
        ctx.fillStyle = '#3498db'; // Blue Feather
        ctx.fillRect(dir === 'E' ? 8 : (dir === 'W' ? 14 : 13), 1 + bob, 2, 3);

        // Eyes & Facial Details based on Direction
        if (dir === 'S') {
          ctx.fillStyle = '#1a1005';
          ctx.fillRect(9, 6 + bob, 2, 2);
          ctx.fillRect(13, 6 + bob, 2, 2);
          // War Paint (Ochre Red)
          ctx.fillStyle = '#c0392b';
          ctx.fillRect(9, 9 + bob, 2, 1);
          ctx.fillRect(13, 9 + bob, 2, 1);
        } else if (dir === 'E') {
          ctx.fillStyle = '#1a1005';
          ctx.fillRect(13, 6 + bob, 2, 2);
        } else if (dir === 'W') {
          ctx.fillStyle = '#1a1005';
          ctx.fillRect(9, 6 + bob, 2, 2);
        }

        // Weapon: Bronze Spear / Axe in Hand
        ctx.fillStyle = '#5c3a21'; // Wooden shaft
        if (dir === 'E') {
          ctx.fillRect(16, 4 + bob, 2, 18);
          ctx.fillStyle = '#d48a37'; // Bronze spearhead
          ctx.fillRect(15, 2 + bob, 4, 3);
          ctx.fillRect(16, 0 + bob, 2, 2);
        } else if (dir === 'W') {
          ctx.fillRect(6, 4 + bob, 2, 18);
          ctx.fillStyle = '#d48a37';
          ctx.fillRect(5, 2 + bob, 4, 3);
          ctx.fillRect(6, 0 + bob, 2, 2);
        } else {
          ctx.fillRect(17, 6 + bob, 2, 16);
          ctx.fillStyle = '#d48a37';
          ctx.fillRect(16, 3 + bob, 4, 3);
          ctx.fillRect(17, 1 + bob, 2, 2);
        }

        this.sprites.set(`player_${dir}_${frame}`, canvas);
      });
    });
  }

  // =========================================================================
  // 2. Monster, Fauna & Town Elder Sprites
  // =========================================================================
  generateMonsterSprites() {
    // 1. Prairie Hare (24x20)
    {
      const { canvas, ctx } = this.createCanvas(24, 20);
      // Fluffy body
      ctx.fillStyle = '#b08968';
      ctx.beginPath();
      ctx.ellipse(11, 13, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      // White belly & tail
      ctx.fillStyle = '#f8f9fa';
      ctx.beginPath();
      ctx.arc(4, 13, 3, 0, Math.PI * 2);
      ctx.fill();
      // Head
      ctx.fillStyle = '#b08968';
      ctx.beginPath();
      ctx.arc(17, 10, 4, 0, Math.PI * 2);
      ctx.fill();
      // Long tall ears
      ctx.fillStyle = '#7f5539';
      ctx.fillRect(15, 2, 2, 6);
      ctx.fillRect(18, 1, 2, 7);
      ctx.fillStyle = '#ffccd5'; // Pink ear inside
      ctx.fillRect(16, 3, 1, 4);
      ctx.fillRect(19, 2, 1, 5);
      // Dark eye & nose
      ctx.fillStyle = '#212529';
      ctx.fillRect(18, 9, 1, 1);
      ctx.fillRect(20, 11, 1, 1);
      // Paws
      ctx.fillStyle = '#7f5539';
      ctx.fillRect(9, 17, 3, 2);
      ctx.fillRect(15, 17, 3, 2);

      this.sprites.set('monster_hare', canvas);
    }

    // 2. Wild Forest Boar (32x24)
    {
      const { canvas, ctx } = this.createCanvas(32, 24);
      // Bristly Torso
      ctx.fillStyle = '#58311a';
      ctx.fillRect(6, 8, 18, 10);
      ctx.fillStyle = '#3a1f10'; // Spine ridge
      ctx.fillRect(8, 5, 14, 4);
      // Heavy Snout & Head
      ctx.fillStyle = '#58311a';
      ctx.fillRect(20, 9, 8, 7);
      ctx.fillStyle = '#8c5028'; // Snout plate
      ctx.fillRect(26, 11, 4, 5);
      // White Curved Tusks
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(25, 13, 2, 4);
      ctx.fillRect(26, 13, 1, 2);
      // Beady red-brown eye
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(22, 10, 2, 2);
      // Stubby Legs
      ctx.fillStyle = '#2b170c';
      ctx.fillRect(8, 17, 3, 6);
      ctx.fillRect(13, 17, 3, 6);
      ctx.fillRect(18, 17, 3, 6);
      ctx.fillRect(22, 17, 3, 6);
      // Tail
      ctx.fillStyle = '#3a1f10';
      ctx.fillRect(3, 11, 4, 2);

      this.sprites.set('monster_boar', canvas);
    }

    // 3. River Bank Crab (24x20)
    {
      const { canvas, ctx } = this.createCanvas(24, 20);
      // Red-Orange Carapace Shell
      ctx.fillStyle = '#d9480f';
      ctx.beginPath();
      ctx.ellipse(12, 11, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f76707';
      ctx.fillRect(8, 9, 8, 3);
      // Pincer Claws
      ctx.fillStyle = '#e03131';
      ctx.fillRect(2, 6, 4, 5);
      ctx.fillRect(18, 6, 4, 5);
      ctx.fillStyle = '#ffe3e3'; // Claw tips
      ctx.fillRect(3, 5, 2, 2);
      ctx.fillRect(19, 5, 2, 2);
      // Eyestalks
      ctx.fillStyle = '#212529';
      ctx.fillRect(10, 4, 2, 3);
      ctx.fillRect(13, 4, 2, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 4, 1, 1);
      ctx.fillRect(13, 4, 1, 1);
      // Walking Legs
      ctx.fillStyle = '#c92a2a';
      ctx.fillRect(4, 15, 2, 4);
      ctx.fillRect(8, 16, 2, 4);
      ctx.fillRect(14, 16, 2, 4);
      ctx.fillRect(18, 15, 2, 4);

      this.sprites.set('monster_crab', canvas);
    }

    // 4. Savannah Fox (28x22)
    {
      const { canvas, ctx } = this.createCanvas(28, 22);
      // Sleek Red-Gold Body
      ctx.fillStyle = '#e8590c';
      ctx.fillRect(6, 9, 14, 7);
      // White Chest & Underbelly
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(14, 11, 5, 5);
      // Head
      ctx.fillStyle = '#e8590c';
      ctx.fillRect(18, 7, 7, 6);
      ctx.fillRect(24, 9, 3, 3); // Snout
      // Black Ears
      ctx.fillStyle = '#212529';
      ctx.fillRect(19, 3, 2, 4);
      ctx.fillRect(23, 4, 2, 3);
      // Eye & Nose
      ctx.fillStyle = '#212529';
      ctx.fillRect(21, 8, 2, 2);
      ctx.fillRect(26, 10, 1, 1);
      // Slender Legs
      ctx.fillStyle = '#212529';
      ctx.fillRect(8, 15, 2, 6);
      ctx.fillRect(12, 15, 2, 6);
      ctx.fillRect(17, 15, 2, 6);
      ctx.fillRect(20, 15, 2, 6);
      // Bushy White-Tipped Tail
      ctx.fillStyle = '#e8590c';
      ctx.fillRect(2, 8, 5, 5);
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(0, 7, 3, 3);

      this.sprites.set('monster_fox', canvas);
    }

    // 5. Dire Wolf (32x24)
    {
      const { canvas, ctx } = this.createCanvas(32, 24);
      // Muscular Grey/Charcoal Torso & Spine
      ctx.fillStyle = '#495057';
      ctx.fillRect(6, 8, 16, 9);
      ctx.fillStyle = '#343a40'; // Spine & neck mane
      ctx.fillRect(8, 5, 12, 4);
      ctx.fillStyle = '#6c757d'; // Underbelly
      ctx.fillRect(10, 14, 10, 3);
      // Wolf Head & Predatory Snout
      ctx.fillStyle = '#495057';
      ctx.fillRect(20, 6, 8, 7);
      ctx.fillRect(26, 8, 5, 4); // Muzzle
      // Pointed Wolf Ears
      ctx.fillStyle = '#212529';
      ctx.fillRect(21, 2, 2, 5);
      ctx.fillRect(25, 3, 2, 4);
      // Glowing Yellow Eyes & Black Nose
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(23, 7, 2, 2);
      ctx.fillStyle = '#000000';
      ctx.fillRect(30, 9, 1, 2);
      // Bared White Fangs
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(28, 12, 1, 2);
      ctx.fillRect(26, 12, 1, 1);
      // Muscular Legs
      ctx.fillStyle = '#343a40';
      ctx.fillRect(8, 15, 3, 7);
      ctx.fillRect(13, 15, 3, 7);
      ctx.fillRect(17, 15, 3, 7);
      ctx.fillRect(21, 15, 3, 7);
      // Bushy Wolf Tail
      ctx.fillStyle = '#495057';
      ctx.fillRect(1, 10, 6, 4);
      ctx.fillStyle = '#212529';
      ctx.fillRect(0, 13, 4, 3);

      this.sprites.set('monster_dire_wolf', canvas);
      this.sprites.set('monster_wolf', canvas);
    }

    // 6. Saber Raptor (32x30)
    {
      const { canvas, ctx } = this.createCanvas(32, 30);
      // Emerald Scaled Theropod Body
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(8, 10, 14, 8);
      ctx.fillStyle = '#52b788'; // Belly
      ctx.fillRect(10, 15, 10, 3);
      // Arching Neck & Head
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(18, 6, 5, 8);
      ctx.fillRect(21, 3, 9, 6);
      ctx.fillStyle = '#e76f51'; // Feathered crest
      ctx.fillRect(19, 1, 6, 3);
      // Yellow Eye & Teeth
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(24, 4, 2, 2);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(26, 8, 4, 2);
      // Bipedal Legs & Sickle Claw
      ctx.fillStyle = '#1b4332';
      ctx.fillRect(10, 17, 4, 10);
      ctx.fillRect(16, 17, 4, 10);
      ctx.fillStyle = '#ffffff'; // Sickle claw
      ctx.fillRect(18, 25, 4, 2);
      // Forelimb claws
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(19, 13, 4, 3);
      // Whip Tail
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(1, 11, 8, 3);
      ctx.fillRect(0, 10, 3, 2);

      this.sprites.set('monster_raptor', canvas);
    }

    // 7. Primordial Stone Golem (36x36)
    {
      const { canvas, ctx } = this.createCanvas(36, 36);
      // Cracked Basalt Core
      ctx.fillStyle = '#343a40';
      ctx.fillRect(8, 10, 20, 16);
      ctx.fillStyle = '#495057';
      ctx.fillRect(10, 12, 7, 6);
      ctx.fillRect(19, 12, 7, 6);
      ctx.fillRect(10, 19, 16, 5);
      // Glowing Cyan Runic Core
      ctx.fillStyle = '#00f2fe';
      ctx.fillRect(16, 15, 4, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(17, 16, 2, 2);
      // Head & Eye Slits
      ctx.fillStyle = '#212529';
      ctx.fillRect(12, 4, 12, 7);
      ctx.fillStyle = '#00f2fe';
      ctx.fillRect(14, 6, 2, 2);
      ctx.fillRect(20, 6, 2, 2);
      // Moss on shoulders
      ctx.fillStyle = '#2b9348';
      ctx.fillRect(7, 8, 4, 3);
      ctx.fillRect(25, 8, 4, 3);
      // Boulder Arms & Legs
      ctx.fillStyle = '#212529';
      ctx.fillRect(3, 12, 6, 12);
      ctx.fillRect(27, 12, 6, 12);
      ctx.fillRect(10, 26, 6, 8);
      ctx.fillRect(20, 26, 6, 8);

      this.sprites.set('monster_stone_golem', canvas);
      this.sprites.set('monster_golem', canvas);
    }

    // 8. Woolly Mammoth (48x40)
    {
      const { canvas, ctx } = this.createCanvas(48, 40);
      // Shaggy Brown Body
      ctx.fillStyle = '#4a2810';
      ctx.fillRect(10, 12, 26, 18);
      ctx.fillStyle = '#2e190a';
      ctx.fillRect(12, 8, 22, 6);
      ctx.fillRect(8, 24, 28, 4);
      // Head & Trunk
      ctx.fillStyle = '#4a2810';
      ctx.fillRect(30, 10, 12, 12);
      ctx.fillStyle = '#3a1f0d';
      ctx.fillRect(40, 14, 4, 14);
      ctx.fillRect(38, 26, 4, 4);
      // Ear & Eye
      ctx.fillStyle = '#2e190a';
      ctx.fillRect(32, 8, 3, 4);
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(34, 13, 2, 2);
      // Massive Curved White Ivory Tusks
      ctx.fillStyle = '#fefae0';
      ctx.beginPath();
      ctx.arc(38, 22, 10, Math.PI * 0.4, Math.PI * 1.6, true);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fefae0';
      ctx.stroke();
      // Pillar Legs
      ctx.fillStyle = '#2e190a';
      ctx.fillRect(12, 28, 6, 10);
      ctx.fillRect(20, 28, 6, 10);
      ctx.fillRect(27, 28, 6, 10);
      ctx.fillRect(34, 28, 6, 10);
      // Tail
      ctx.fillStyle = '#2e190a';
      ctx.fillRect(6, 16, 4, 8);

      this.sprites.set('monster_mammoth', canvas);
    }

    // 9. Cave Bear (36x28)
    {
      const { canvas, ctx } = this.createCanvas(36, 28);
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(8, 9, 20, 12);
      ctx.fillStyle = '#3e2716';
      ctx.fillRect(10, 6, 16, 5);
      // Head & Ears
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(24, 8, 9, 8);
      ctx.fillRect(31, 11, 4, 4);
      ctx.fillStyle = '#3e2716';
      ctx.fillRect(25, 5, 3, 3);
      ctx.fillRect(29, 5, 3, 3);
      // Eyes & Snout
      ctx.fillStyle = '#212529';
      ctx.fillRect(28, 9, 2, 2);
      ctx.fillRect(34, 12, 1, 2);
      // Paws
      ctx.fillStyle = '#3e2716';
      ctx.fillRect(10, 19, 4, 7);
      ctx.fillRect(16, 19, 4, 7);
      ctx.fillRect(22, 19, 4, 7);
      ctx.fillRect(27, 19, 4, 7);

      this.sprites.set('monster_bear', canvas);
    }

    // 10. Primeval Viper / Serpent (28x24)
    {
      const { canvas, ctx } = this.createCanvas(28, 24);
      ctx.fillStyle = '#2b9348';
      ctx.beginPath();
      ctx.arc(14, 15, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e9d8a6';
      ctx.fillRect(9, 13, 10, 4);
      ctx.fillStyle = '#2b9348';
      ctx.fillRect(18, 6, 8, 6);
      ctx.fillStyle = '#ee9b00';
      ctx.fillRect(21, 7, 2, 2);
      ctx.fillStyle = '#e63946';
      ctx.fillRect(26, 8, 2, 1);
      ctx.fillRect(27, 7, 1, 3);

      this.sprites.set('monster_serpent', canvas);
      this.sprites.set('monster_viper', canvas);
      this.sprites.set('monster_snake', canvas);
    }

    // 11. Desert Scorpion (28x24)
    {
      const { canvas, ctx } = this.createCanvas(28, 24);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(8, 11, 10, 7);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(16, 8, 6, 3);
      ctx.fillRect(21, 6, 3, 6);
      ctx.fillRect(16, 16, 6, 3);
      ctx.fillRect(21, 15, 3, 6);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4, 10, 4, 4);
      ctx.fillRect(2, 6, 4, 5);
      ctx.fillRect(4, 3, 5, 3);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(8, 2, 3, 3);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(7, 18, 2, 4);
      ctx.fillRect(11, 18, 2, 4);
      ctx.fillRect(15, 18, 2, 4);

      this.sprites.set('monster_scorpion', canvas);
    }

    // 12. Savannah Hyena (28x22)
    {
      const { canvas, ctx } = this.createCanvas(28, 22);
      ctx.fillStyle = '#b08968';
      ctx.fillRect(6, 8, 14, 8);
      ctx.fillStyle = '#4a2f18'; // Spots
      ctx.fillRect(9, 10, 2, 2);
      ctx.fillRect(14, 11, 2, 2);
      ctx.fillRect(11, 13, 2, 2);
      ctx.fillStyle = '#b08968'; // Head
      ctx.fillRect(18, 5, 7, 7);
      ctx.fillRect(23, 7, 4, 4); // Muzzle
      ctx.fillStyle = '#4a2f18'; // Ears
      ctx.fillRect(19, 2, 3, 3);
      ctx.fillStyle = '#212529'; // Eye & nose
      ctx.fillRect(21, 6, 2, 2);
      ctx.fillRect(26, 8, 1, 2);
      ctx.fillStyle = '#4a2f18'; // Legs
      ctx.fillRect(8, 15, 2, 6);
      ctx.fillRect(12, 15, 2, 6);
      ctx.fillRect(17, 14, 3, 7);
      ctx.fillRect(20, 14, 3, 7);

      this.sprites.set('monster_hyena', canvas);
    }

    // 13. Town Elder: Elder Kael (Chieftain) (24x30)
    {
      const { canvas, ctx } = this.createCanvas(24, 30);
      // Robe / Tunic
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(7, 11, 10, 15);
      ctx.fillStyle = '#d4a373'; // Ochre Sash
      ctx.fillRect(6, 16, 12, 3);
      // Head & Grey Beard
      ctx.fillStyle = '#e0a96d';
      ctx.fillRect(8, 5, 8, 6);
      ctx.fillStyle = '#e9ecef'; // Wise White Beard
      ctx.fillRect(7, 10, 10, 5);
      // Eagle Headdress
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(8, 1, 8, 3);
      ctx.fillStyle = '#f1c40f'; // Gold Band
      ctx.fillRect(7, 4, 10, 2);
      ctx.fillStyle = '#ffffff'; // White Eagle Feathers
      ctx.fillRect(9, 0, 2, 3);
      ctx.fillRect(13, 0, 2, 3);
      // Eyes
      ctx.fillStyle = '#212529';
      ctx.fillRect(9, 7, 2, 1);
      ctx.fillRect(13, 7, 2, 1);
      // Chieftain Staff
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(18, 4, 2, 24);
      ctx.fillStyle = '#f39c12'; // Amber crystal on top
      ctx.fillRect(17, 2, 4, 3);

      this.sprites.set('npc_elder_kael', canvas);
    }

    // 6. Town Artisan: Knapper Urk (24x28)
    {
      const { canvas, ctx } = this.createCanvas(24, 28);
      // Muscular Torso & Leather Apron
      ctx.fillStyle = '#c68642'; // Tan skin
      ctx.fillRect(7, 8, 10, 6);
      ctx.fillStyle = '#4a2f18'; // Dark leather apron
      ctx.fillRect(8, 13, 8, 11);
      // Head & Copper Headband
      ctx.fillStyle = '#c68642';
      ctx.fillRect(8, 3, 8, 6);
      ctx.fillStyle = '#d35400'; // Copper band
      ctx.fillRect(7, 4, 10, 2);
      ctx.fillStyle = '#1a1005'; // Dark hair
      ctx.fillRect(7, 2, 10, 3);
      // Eyes
      ctx.fillStyle = '#212529';
      ctx.fillRect(9, 5, 2, 2);
      ctx.fillRect(13, 5, 2, 2);
      // Stone Knapping Hammer in Hand
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(18, 11, 2, 12);
      ctx.fillStyle = '#7f8c8d'; // Basalt hammer head
      ctx.fillRect(16, 9, 6, 4);

      this.sprites.set('npc_knapper_urk', canvas);
    }

    // 7. Town Hunter: Scout Tara (24x28)
    {
      const { canvas, ctx } = this.createCanvas(24, 28);
      // Green Camo Fur Cloak
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(7, 9, 10, 15);
      // Head & Braided Hair
      ctx.fillStyle = '#e0a96d';
      ctx.fillRect(8, 3, 8, 6);
      ctx.fillStyle = '#6e4726'; // Brown braids
      ctx.fillRect(6, 4, 3, 10);
      ctx.fillRect(15, 4, 3, 10);
      // Eyes
      ctx.fillStyle = '#212529';
      ctx.fillRect(9, 5, 2, 2);
      ctx.fillRect(13, 5, 2, 2);
      // Hunter Bow on Back
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(18, 5, 2, 18);
      ctx.fillStyle = '#ced4da'; // Bowstring
      ctx.fillRect(20, 6, 1, 16);

      this.sprites.set('npc_scout_tara', canvas);
    }

    // 8. Town Vault Keeper: Banker Torok (24x28)
    {
      const { canvas, ctx } = this.createCanvas(24, 28);
      // Ornate Heavy Robe
      ctx.fillStyle = '#3a506b';
      ctx.fillRect(6, 9, 12, 16);
      // Head
      ctx.fillStyle = '#e0a96d';
      ctx.fillRect(8, 3, 8, 6);
      ctx.fillStyle = '#1c2541'; // Hood
      ctx.fillRect(7, 1, 10, 4);
      // Amber Bead Necklace
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(8, 10, 8, 2);
      // Vault Scroll / Stone Seal in Hand
      ctx.fillStyle = '#f4e29f';
      ctx.fillRect(17, 12, 5, 7);

      this.sprites.set('npc_banker_torok', canvas);
    }

    // =========================================================================
    // Structures & Decorative World Features
    // =========================================================================
    // Thatched Hut (48x44)
    {
      const { canvas, ctx } = this.createCanvas(48, 44);
      // Wooden Beam Walls
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(6, 18, 36, 22);
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(8, 20, 4, 20);
      ctx.fillRect(36, 20, 4, 20);
      // Dark Open Doorway
      ctx.fillStyle = '#1a0e08';
      ctx.fillRect(20, 24, 8, 16);
      // Conical Thatched Straw Roof
      ctx.fillStyle = '#c79c5e';
      ctx.beginPath();
      ctx.moveTo(24, 2);
      ctx.lineTo(2, 20);
      ctx.lineTo(46, 20);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#dfb87a'; // Sunlit reed layers
      ctx.fillRect(10, 14, 28, 3);
      ctx.fillRect(16, 8, 16, 3);

      this.sprites.set('struct_thatched_hut', canvas);
    }

    // Sacred Animal Totem Pole (18x44)
    {
      const { canvas, ctx } = this.createCanvas(18, 44);
      // Carved Wooden Pole
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(4, 4, 10, 38);
      // Top Eagle Head & Beak
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(3, 4, 12, 8);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(7, 8, 4, 4);
      // Mid Wolf Carving
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(3, 16, 12, 10);
      ctx.fillStyle = '#ffffff'; // Wolf eyes
      ctx.fillRect(5, 18, 2, 2);
      ctx.fillRect(11, 18, 2, 2);
      // Bottom Mammoth Base
      ctx.fillStyle = '#5d4037';
      ctx.fillRect(2, 28, 14, 12);
      ctx.fillStyle = '#fff'; // Mini tusks
      ctx.fillRect(3, 34, 2, 4);
      ctx.fillRect(13, 34, 2, 4);

      this.sprites.set('struct_totem_pole', canvas);
    }

    // Timber Boundary Fence (32x18)
    {
      const { canvas, ctx } = this.createCanvas(32, 18);
      // Vertical Posts
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(2, 2, 4, 14);
      ctx.fillRect(14, 2, 4, 14);
      ctx.fillRect(26, 2, 4, 14);
      // Horizontal Timber Rails
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(0, 5, 32, 3);
      ctx.fillRect(0, 11, 32, 3);
      // Rope bindings
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(3, 5, 2, 3);
      ctx.fillRect(15, 5, 2, 3);
      ctx.fillRect(27, 5, 2, 3);

      this.sprites.set('struct_fence_wood', canvas);
    }

    // River Papyrus Reeds (18x26)
    {
      const { canvas, ctx } = this.createCanvas(18, 26);
      ctx.fillStyle = '#2d6a4f';
      // Green Reeds
      ctx.fillRect(3, 8, 2, 16);
      ctx.fillRect(7, 4, 2, 20);
      ctx.fillRect(12, 6, 2, 18);
      // Brown Cattail Heads
      ctx.fillStyle = '#58311a';
      ctx.fillRect(2, 4, 4, 7);
      ctx.fillRect(6, 1, 4, 7);
      ctx.fillRect(11, 3, 4, 7);

      this.sprites.set('decal_river_reeds', canvas);
    }

    // Savannah Shrub Bush (24x18)
    {
      const { canvas, ctx } = this.createCanvas(24, 18);
      ctx.fillStyle = '#557a2b';
      ctx.beginPath();
      ctx.ellipse(12, 11, 10, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#8cb044'; // Bright foliage highlight
      ctx.beginPath();
      ctx.arc(9, 8, 4, 0, Math.PI * 2);
      ctx.arc(15, 8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f1c40f'; // Little yellow berries
      ctx.fillRect(7, 10, 2, 2);
      ctx.fillRect(14, 12, 2, 2);

      this.sprites.set('decal_savannah_bush', canvas);
    }

    // Ancestral Stone Cairn (18x18)
    {
      const { canvas, ctx } = this.createCanvas(18, 18);
      ctx.fillStyle = '#495057';
      ctx.fillRect(2, 12, 14, 5);
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(4, 7, 10, 5);
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(6, 2, 6, 5);
      ctx.fillStyle = '#f8f9fa'; // White pebble top
      ctx.fillRect(8, 0, 2, 2);

      this.sprites.set('decal_cairn', canvas);
    }
  }

  // =========================================================================
  // 3. Tile Sprites & Procedural Variations
  // =========================================================================
  generateTileSprites() {
    const createTile = (key, drawFn) => {
      const { canvas, ctx } = this.createCanvas(32, 32);
      drawFn(ctx);
      this.sprites.set(key, canvas);
    };

    // Clay / Savannah Ground (Tile 0)
    createTile('tile_clay', (ctx) => {
      ctx.fillStyle = '#9e6d44';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#b58356'; // Warm clay speckles
      ctx.fillRect(2, 4, 4, 3);
      ctx.fillRect(18, 12, 5, 3);
      ctx.fillRect(10, 22, 6, 3);
      ctx.fillStyle = '#7a512d'; // Earth shadow crevices
      ctx.fillRect(4, 6, 2, 2);
      ctx.fillRect(20, 14, 2, 2);
      ctx.fillRect(12, 24, 2, 2);
      ctx.fillStyle = '#6b8e23'; // Small savanna grass tuft
      ctx.fillRect(26, 4, 2, 3);
      ctx.fillRect(6, 18, 2, 2);
    });

    // Clay Variation 1 (Cracked Earth)
    createTile('tile_clay_var1', (ctx) => {
      ctx.fillStyle = '#96643c';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#7a512d';
      ctx.fillRect(8, 6, 8, 2);
      ctx.fillRect(14, 8, 2, 8);
      ctx.fillRect(10, 20, 12, 2);
      ctx.fillStyle = '#b58356';
      ctx.fillRect(4, 14, 4, 3);
      ctx.fillRect(22, 12, 4, 3);
    });

    // Clay Variation 2 (Wild Grass Sprouts & Pebbles)
    createTile('tile_clay_var2', (ctx) => {
      ctx.fillStyle = '#9e6d44';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#749c28'; // Green grass sprouts
      ctx.fillRect(6, 8, 2, 4);
      ctx.fillRect(8, 6, 2, 6);
      ctx.fillRect(20, 16, 2, 5);
      ctx.fillRect(22, 14, 2, 7);
      ctx.fillStyle = '#495057'; // River pebbles
      ctx.fillRect(14, 10, 3, 2);
      ctx.fillRect(26, 24, 2, 2);
    });

    // Steppe Grassland (Tile 1)
    createTile('tile_steppe', (ctx) => {
      ctx.fillStyle = '#557a2b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#6b8e23'; // Mid grass
      ctx.fillRect(0, 0, 32, 16);
      ctx.fillStyle = '#8cb044'; // Bright sunlit grass blades
      ctx.fillRect(4, 2, 2, 6);
      ctx.fillRect(12, 14, 2, 5);
      ctx.fillRect(22, 6, 2, 6);
      ctx.fillRect(26, 20, 2, 5);
      ctx.fillStyle = '#3e581c'; // Root shadow
      ctx.fillRect(4, 8, 2, 2);
      ctx.fillRect(22, 12, 2, 2);
    });

    // Steppe Wildflowers
    createTile('tile_steppe_var1', (ctx) => {
      ctx.fillStyle = '#557a2b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#8cb044';
      ctx.fillRect(6, 4, 2, 6);
      ctx.fillRect(18, 12, 2, 6);
      // Small yellow wildflower blossoms
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(5, 2, 4, 4);
      ctx.fillRect(17, 10, 4, 4);
      ctx.fillStyle = '#fff';
      ctx.fillRect(6, 3, 2, 2);
    });

    // Water Shoreline Foam Overlay
    createTile('tile_water_foam', (ctx) => {
      ctx.fillStyle = 'rgba(255,255,255,0.75)';
      ctx.fillRect(0, 0, 32, 3);
      ctx.fillRect(4, 3, 24, 2);
      ctx.fillStyle = '#74c0fc';
      ctx.fillRect(8, 5, 16, 2);
    });

    // Steppe Grassland (Tile 1)
    createTile('tile_steppe', (ctx) => {
      ctx.fillStyle = '#557a2b';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#6b8e23'; // Mid grass
      ctx.fillRect(0, 0, 32, 16);
      ctx.fillStyle = '#8cb044'; // Bright sunlit grass blades
      ctx.fillRect(4, 2, 2, 6);
      ctx.fillRect(12, 14, 2, 5);
      ctx.fillRect(22, 6, 2, 6);
      ctx.fillRect(26, 20, 2, 5);
      ctx.fillStyle = '#3e581c'; // Root shadow
      ctx.fillRect(4, 8, 2, 2);
      ctx.fillRect(22, 12, 2, 2);
    });

    // Obsidian Basalt Rock (Tile 2)
    createTile('tile_basalt', (ctx) => {
      ctx.fillStyle = '#34384a';
      ctx.fillRect(0, 0, 32, 32);
      ctx.strokeStyle = '#1e202d';
      ctx.strokeRect(1, 1, 30, 30);
      ctx.fillStyle = '#4f5570'; // Chiseled rock slabs
      ctx.fillRect(3, 3, 12, 10);
      ctx.fillRect(17, 15, 12, 12);
      ctx.fillStyle = '#7209b7'; // Subtle obsidian purple glimmer
      ctx.fillRect(6, 6, 2, 2);
      ctx.fillRect(22, 20, 2, 2);
      ctx.fillStyle = '#1c1d26'; // Deep rock crack
      ctx.fillRect(15, 0, 2, 32);
      ctx.fillRect(0, 14, 32, 2);
    });

    // Ocean & River Water (Tile 3)
    createTile('tile_water', (ctx) => {
      ctx.fillStyle = '#1b5e94';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#2980b9';
      ctx.fillRect(0, 6, 32, 6);
      ctx.fillRect(0, 20, 32, 6);
      ctx.fillStyle = '#5dade2'; // Surface wave highlights
      ctx.fillRect(4, 8, 10, 2);
      ctx.fillRect(18, 22, 12, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; // Water foam glint
      ctx.fillRect(6, 9, 4, 1);
      ctx.fillRect(22, 23, 4, 1);
    });

    // Tundra Ice / Snow (Tile 4)
    createTile('tile_tundra', (ctx) => {
      ctx.fillStyle = '#e5edf2';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#c7d8e2'; // Ice shadow
      ctx.fillRect(4, 10, 8, 4);
      ctx.fillRect(18, 20, 10, 4);
      ctx.fillStyle = '#ffffff'; // Crisp frost sparkles
      ctx.fillRect(6, 11, 4, 2);
      ctx.fillRect(20, 21, 4, 2);
      ctx.fillStyle = '#85a3b2'; // Sub-zero ice crack
      ctx.fillRect(14, 4, 1, 8);
    });

    // Molten Lava Fissure (Tile 5)
    createTile('tile_lava', (ctx) => {
      ctx.fillStyle = '#8b0000';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#d90429'; // Magma flow
      ctx.fillRect(2, 4, 28, 24);
      ctx.fillStyle = '#f77f00'; // Hot magma core
      ctx.fillRect(6, 8, 20, 16);
      ctx.fillStyle = '#ffea00'; // White-hot bubbling vent
      ctx.fillRect(10, 12, 12, 8);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(14, 14, 4, 4);
    });

    // Primeval Cycad Rainforest (Tile 6)
    createTile('tile_rainforest', (ctx) => {
      ctx.fillStyle = '#1c4c34';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#2d6a4f'; // Deep moss
      ctx.fillRect(2, 2, 14, 14);
      ctx.fillRect(16, 16, 14, 14);
      ctx.fillStyle = '#52b788'; // Vibrant fern leaves
      ctx.fillRect(4, 4, 8, 8);
      ctx.fillRect(18, 18, 8, 8);
      ctx.fillStyle = '#74c69d';
      ctx.fillRect(6, 6, 4, 4);
    });

    // Sunken Crypts & Starfall Ruins (Tile 7)
    createTile('tile_crypts', (ctx) => {
      ctx.fillStyle = '#3f3a4f';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#564d6e'; // Weathered cobblestones
      ctx.fillRect(2, 2, 12, 12);
      ctx.fillRect(18, 2, 12, 12);
      ctx.fillRect(2, 18, 12, 12);
      ctx.fillRect(18, 18, 12, 12);
      ctx.fillStyle = '#b5179e'; // Glowing celestial ruin glyph
      ctx.fillRect(6, 6, 4, 4);
      ctx.fillRect(22, 22, 4, 4);
    });

    // Desert Dunes & Sand (Tile 8)
    createTile('tile_dunes', (ctx) => {
      ctx.fillStyle = '#df9e42';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#c78328'; // Sand dune crest shadow
      ctx.fillRect(0, 8, 32, 4);
      ctx.fillRect(0, 22, 32, 4);
      ctx.fillStyle = '#f8d488'; // Sunlit ridge
      ctx.fillRect(0, 6, 32, 2);
      ctx.fillRect(0, 20, 32, 2);
    });

    // Coastal Sandy Beach (Tile 9)
    createTile('tile_beach', (ctx) => {
      ctx.fillStyle = '#e9c46a';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#d4a347'; // Moist sand gradient
      ctx.fillRect(0, 16, 32, 16);
      ctx.fillStyle = '#f4e29f'; // Dry sun-bleached shells
      ctx.fillRect(6, 6, 3, 2);
      ctx.fillRect(20, 10, 4, 2);
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; // White foam ripple
      ctx.fillRect(2, 24, 12, 2);
      ctx.fillRect(18, 28, 10, 2);
    });

    // High Mountain Peak (Tile 10)
    createTile('tile_mountain', (ctx) => {
      ctx.fillStyle = '#5c6470';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#3a3e47'; // Dark mountain shadow
      ctx.fillRect(0, 14, 32, 18);
      ctx.fillStyle = '#eef2f7'; // Snowcapped summit
      ctx.beginPath();
      ctx.moveTo(16, 2);
      ctx.lineTo(6, 14);
      ctx.lineTo(26, 14);
      ctx.fill();
    });

    // Stone Bridge / River Ford (Tile 11)
    createTile('tile_bridge', (ctx) => {
      ctx.fillStyle = '#7a7672';
      ctx.fillRect(0, 0, 32, 32);
      ctx.fillStyle = '#524e4a'; // Timber/stone bridge borders
      ctx.fillRect(0, 0, 32, 4);
      ctx.fillRect(0, 28, 32, 4);
      ctx.fillStyle = '#a8a29e'; // Weathered cobblestones
      ctx.fillRect(4, 6, 10, 8);
      ctx.fillRect(18, 6, 10, 8);
      ctx.fillRect(4, 18, 10, 8);
      ctx.fillRect(18, 18, 10, 8);
    });
  }

  // =========================================================================
  // 4. Resource Nodes (Copper Boulder, Tin Rock, Malachite, Cycad Tree, Fire)
  // =========================================================================
  generateResourceSprites() {
    // Native Copper Ore Boulder (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#4a443e'; // Granite rock
      ctx.beginPath();
      ctx.arc(16, 18, 13, 0, Math.PI * 2);
      ctx.fill();
      // Copper Veins
      ctx.fillStyle = '#d97736';
      ctx.fillRect(8, 12, 5, 3);
      ctx.fillRect(16, 14, 7, 4);
      ctx.fillRect(12, 22, 6, 3);
      // Bright Specular Copper Shimmer
      ctx.fillStyle = '#fca311';
      ctx.fillRect(9, 13, 2, 2);
      ctx.fillRect(18, 15, 3, 2);

      this.sprites.set('node_copper_boulder', canvas);
    }

    // Cassiterite Tin Rock (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#3a3e42';
      ctx.beginPath();
      ctx.arc(16, 18, 13, 0, Math.PI * 2);
      ctx.fill();
      // Silvery Tin Veins
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(10, 11, 6, 4);
      ctx.fillRect(17, 18, 7, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(12, 12, 2, 2);
      ctx.fillRect(19, 19, 2, 2);

      this.sprites.set('node_tin_rock', canvas);
    }

    // Malachite Green Rock (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#2d3748';
      ctx.beginPath();
      ctx.arc(16, 18, 13, 0, Math.PI * 2);
      ctx.fill();
      // Vivid Malachite Bands
      ctx.fillStyle = '#2a9d8f';
      ctx.fillRect(8, 12, 8, 4);
      ctx.fillRect(14, 18, 8, 5);
      ctx.fillStyle = '#52b788';
      ctx.fillRect(10, 13, 4, 2);

      this.sprites.set('node_malachite_rock', canvas);
    }

    // Obsidian Glass Node (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#1a1829';
      ctx.beginPath();
      ctx.arc(16, 18, 13, 0, Math.PI * 2);
      ctx.fill();
      // Glossy Purple Glass Sheen
      ctx.fillStyle = '#7209b7';
      ctx.fillRect(10, 10, 6, 5);
      ctx.fillRect(16, 16, 8, 4);
      ctx.fillStyle = '#f72585';
      ctx.fillRect(12, 11, 2, 2);

      this.sprites.set('node_obsidian_rock', canvas);
    }

    // Ancient Cycad Palm / Bristlecone Tree (32x40)
    {
      const { canvas, ctx } = this.createCanvas(32, 40);
      // Fibrous Trunk
      ctx.fillStyle = '#5c4033';
      ctx.fillRect(12, 18, 8, 20);
      ctx.fillStyle = '#3e2723';
      ctx.fillRect(14, 22, 4, 14);
      // Fan Palm Foliage
      ctx.fillStyle = '#2d6a4f';
      ctx.beginPath();
      ctx.arc(16, 14, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#52b788'; // Top Leaves Highlight
      ctx.beginPath();
      ctx.arc(14, 10, 9, 0, Math.PI * 2);
      ctx.fill();

      this.sprites.set('node_cycad_tree', canvas);
    }

    // Willow Tree (32x40)
    {
      const { canvas, ctx } = this.createCanvas(32, 40);
      ctx.fillStyle = '#4a2f18';
      ctx.fillRect(13, 20, 6, 18);
      ctx.fillStyle = '#82954b';
      ctx.beginPath();
      ctx.arc(16, 16, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a9ba6b';
      ctx.fillRect(10, 18, 3, 12);
      ctx.fillRect(19, 18, 3, 12);
      this.sprites.set('node_willow_tree', canvas);
    }

    // Acacia Tree (32x40)
    {
      const { canvas, ctx } = this.createCanvas(32, 40);
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(14, 16, 4, 22);
      ctx.fillStyle = '#2d6a4f';
      ctx.beginPath();
      ctx.ellipse(16, 14, 15, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      this.sprites.set('node_acacia_tree', canvas);
    }

    // Bristlecone Pine (32x40)
    {
      const { canvas, ctx } = this.createCanvas(32, 40);
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(13, 20, 6, 18);
      ctx.fillStyle = '#1e382b';
      ctx.beginPath();
      ctx.moveTo(16, 4);
      ctx.lineTo(26, 26);
      ctx.lineTo(6, 26);
      ctx.closePath();
      ctx.fill();
      this.sprites.set('node_bristlecone_tree', canvas);
    }

    // Ironwood Giant (32x40)
    {
      const { canvas, ctx } = this.createCanvas(32, 40);
      ctx.fillStyle = '#212529';
      ctx.fillRect(11, 16, 10, 22);
      ctx.fillStyle = '#132a13';
      ctx.beginPath();
      ctx.arc(16, 14, 15, 0, Math.PI * 2);
      ctx.fill();
      this.sprites.set('node_ironwood_tree', canvas);
    }

    // Ebony Tree (32x40)
    {
      const { canvas, ctx } = this.createCanvas(32, 40);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(13, 18, 6, 20);
      ctx.fillStyle = '#2f3542';
      ctx.beginPath();
      ctx.arc(16, 14, 14, 0, Math.PI * 2);
      ctx.fill();
      this.sprites.set('node_ebony_tree', canvas);
    }

    // Ashwood Tree (32x40)
    {
      const { canvas, ctx } = this.createCanvas(32, 40);
      ctx.fillStyle = '#57606f';
      ctx.fillRect(13, 18, 6, 20);
      ctx.fillStyle = '#e74c3c'; // Ember-lit leaves
      ctx.beginPath();
      ctx.arc(16, 14, 14, 0, Math.PI * 2);
      ctx.fill();
      this.sprites.set('node_ashwood_tree', canvas);
    }

    // Sulfur Crystals Node (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(8, 14, 16, 14);
      ctx.fillStyle = '#f1c40f'; // Yellow sulfur spires
      ctx.beginPath();
      ctx.moveTo(12, 18); ctx.lineTo(14, 6); ctx.lineTo(16, 18); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(18, 20); ctx.lineTo(20, 8); ctx.lineTo(22, 20); ctx.fill();
      this.sprites.set('node_sulfur_crystals', canvas);
    }

    // Foraged Botanical Plants (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(10, 18, 12, 8);
      ctx.fillStyle = '#e84118'; // Sweet berries
      ctx.beginPath(); ctx.arc(12, 16, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(18, 14, 3, 0, Math.PI * 2); ctx.fill();
      this.sprites.set('node_prairie_berries', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(12, 14, 8, 12);
      ctx.fillStyle = '#c0392b'; // Red fever root
      ctx.fillRect(14, 8, 4, 10);
      this.sprites.set('node_fever_root', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#2ed573'; // River reeds
      ctx.fillRect(8, 6, 3, 22);
      ctx.fillRect(14, 4, 3, 24);
      ctx.fillRect(20, 8, 3, 20);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(7, 6, 5, 4);
      ctx.fillRect(13, 4, 5, 4);
      ctx.fillRect(19, 8, 5, 4);
      this.sprites.set('node_river_reeds', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#00d2d3'; // Glowing mushrooms
      ctx.beginPath(); ctx.arc(12, 16, 5, Math.PI, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(20, 14, 6, Math.PI, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#f1f2f6';
      ctx.fillRect(11, 16, 2, 8);
      ctx.fillRect(19, 14, 2, 10);
      this.sprites.set('node_glow_fungus', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#f1c40f'; // Wild wheat
      ctx.fillRect(10, 8, 4, 20);
      ctx.fillRect(18, 6, 4, 22);
      this.sprites.set('node_wild_wheat', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#55efc4'; // Tundra moss
      ctx.fillRect(6, 16, 20, 10);
      this.sprites.set('node_tundra_moss', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#10ac84'; // Serpent vine
      ctx.fillRect(8, 8, 16, 4);
      ctx.fillRect(20, 12, 4, 10);
      ctx.fillRect(8, 18, 16, 4);
      this.sprites.set('node_serpent_vine', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(14, 16, 4, 12);
      ctx.fillStyle = '#f1f2f6'; // Ghost orchid
      ctx.beginPath(); ctx.arc(16, 12, 7, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#be2edd';
      ctx.fillRect(15, 11, 2, 2);
      this.sprites.set('node_ghost_orchid', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#f8c291'; // Mountain ginseng
      ctx.fillRect(12, 10, 8, 16);
      ctx.fillStyle = '#2ed573';
      ctx.fillRect(14, 6, 4, 4);
      this.sprites.set('node_mountain_ginseng', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#2d3436'; // Sunken Crypt Truffle
      ctx.beginPath(); ctx.arc(16, 18, 8, 0, Math.PI * 2); ctx.fill();
      this.sprites.set('node_crypt_truffle', canvas);
    }

    // Fishing Ripple Spot (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.strokeStyle = '#74b9ff';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(16, 16, 6, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(16, 16, 11, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = '#ff7675'; // Leaping fish
      ctx.fillRect(14, 12, 4, 3);
      this.sprites.set('node_fishing_spot', canvas);
    }

    // Archaeology Dig Site (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(6, 12, 20, 16);
      ctx.fillStyle = '#5c3a21'; // Trench
      ctx.fillRect(10, 16, 12, 8);
      ctx.fillStyle = '#f5f6fa'; // Fossil bone exposed
      ctx.fillRect(13, 18, 6, 3);
      this.sprites.set('node_archaeology_dig', canvas);
    }

    // =========================================================================
    // Specialized Crafting Station Sprites (32x32)
    // =========================================================================
    // Clay Smelting Crucible / Bloomery
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(8, 12, 16, 16);
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(6, 10, 20, 3);
      ctx.fillStyle = '#ff7b00';
      ctx.fillRect(12, 16, 8, 8);
      ctx.fillStyle = '#ffea00';
      ctx.fillRect(14, 18, 4, 4);
      this.sprites.set('node_crucible_station', canvas);
    }

    // Basalt Shaping Anvil
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(6, 14, 20, 10);
      ctx.fillRect(10, 24, 12, 6);
      ctx.fillRect(4, 12, 6, 6);
      ctx.fillStyle = '#747d8c';
      ctx.fillRect(8, 12, 16, 3);
      ctx.fillStyle = '#d48a37'; // Bronze hammer on top
      ctx.fillRect(12, 8, 8, 3);
      this.sprites.set('node_anvil_station', canvas);
    }

    // Flint Knapping Bench
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#57606f';
      ctx.fillRect(6, 14, 20, 14);
      ctx.fillStyle = '#ced4da'; // Flint chips
      ctx.fillRect(8, 10, 4, 4);
      ctx.fillRect(16, 11, 5, 4);
      ctx.fillRect(12, 8, 3, 5);
      this.sprites.set('node_knapping_station', canvas);
    }

    // Carpenter's Workbench
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(4, 14, 24, 6);
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(6, 20, 4, 10);
      ctx.fillRect(22, 20, 4, 10);
      ctx.fillStyle = '#d4a373'; // Timber plank
      ctx.fillRect(8, 10, 16, 4);
      this.sprites.set('node_carpenter_station', canvas);
    }

    // Tanning Rack & Furrier
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(6, 6, 3, 24);
      ctx.fillRect(23, 6, 3, 24);
      ctx.fillRect(6, 6, 20, 3);
      ctx.fillRect(6, 27, 20, 3);
      ctx.fillStyle = '#8a5a36'; // Stretched hide
      ctx.fillRect(10, 10, 12, 16);
      this.sprites.set('node_tannery_station', canvas);
    }

    // Apothecary Cauldron
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#1e272e';
      ctx.beginPath();
      ctx.arc(16, 20, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2ed573'; // Bubbling green potion
      ctx.beginPath();
      ctx.arc(16, 14, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7bed9f';
      ctx.fillRect(13, 11, 3, 3);
      ctx.fillRect(17, 13, 2, 2);
      this.sprites.set('node_cauldron_station', canvas);
    }

    // Loom of the Ancients
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(4, 4, 24, 3);
      ctx.fillRect(6, 4, 3, 26);
      ctx.fillRect(23, 4, 3, 26);
      ctx.fillStyle = '#f1f2f6'; // Strung warp threads
      for (let i = 10; i < 22; i += 2) {
        ctx.fillRect(i, 7, 1, 20);
      }
      ctx.fillStyle = '#e74c3c'; // Woven red cloth
      ctx.fillRect(9, 14, 14, 8);
      this.sprites.set('node_loom_station', canvas);
    }

    // Lapidary Gem Bench
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(6, 14, 20, 12);
      ctx.fillStyle = '#ffa502'; // Amber gem
      ctx.fillRect(10, 10, 5, 5);
      ctx.fillStyle = '#70a1ff'; // Lapis gem
      ctx.fillRect(17, 10, 5, 5);
      this.sprites.set('node_lapidary_station', canvas);
    }

    // Tribal Stash Chest (32x32)
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#4a2c11'; // Dark sturdy wood
      ctx.fillRect(4, 12, 24, 16);
      ctx.fillStyle = '#784923'; // Lighter wood planks
      ctx.fillRect(6, 14, 20, 12);
      // Bronze banding & rivets
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(4, 12, 24, 3);
      ctx.fillRect(4, 20, 24, 2);
      ctx.fillRect(8, 12, 3, 16);
      ctx.fillRect(21, 12, 3, 16);
      // Amber lock plate
      ctx.fillStyle = '#ffb703';
      ctx.fillRect(14, 18, 4, 4);
      ctx.fillStyle = '#fb8500';
      ctx.fillRect(15, 19, 2, 2);
      this.sprites.set('node_stash_chest', canvas);
    }

    // Depleted Resource Nodes
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#4b4b4b'; // Broken rock pile
      ctx.fillRect(10, 22, 12, 6);
      ctx.fillRect(14, 18, 6, 4);
      this.sprites.set('node_depleted_rock', canvas);
    }
    {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#4a2f18'; // Tree stump
      ctx.fillRect(11, 22, 10, 8);
      ctx.fillStyle = '#8b5a2b'; // Cut rings
      ctx.beginPath();
      ctx.ellipse(16, 22, 5, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      this.sprites.set('node_depleted_stump', canvas);
    }
  }

  // =========================================================================
  // 5. 24x24 Pixel Item Icons (All 32+ Unique Items)
  // =========================================================================
  generateItemIcons() {
    const createIcon = (key, drawFn) => {
      const { canvas, ctx } = this.createCanvas(24, 24);
      drawFn(ctx);
      this.sprites.set(`icon_${key}`, canvas);
    };

    // Currency
    createIcon('amber_beads', (ctx) => {
      ctx.fillStyle = '#ffb703';
      ctx.beginPath();
      ctx.arc(8, 13, 5, 0, Math.PI * 2);
      ctx.arc(16, 11, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(6, 11, 2, 2);
      ctx.fillRect(14, 9, 2, 2);
    });

    // Ores & Raw Minerals
    createIcon('ore_copper', (ctx) => {
      ctx.fillStyle = '#5c4033';
      ctx.beginPath();
      ctx.arc(12, 12, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e67e22';
      ctx.fillRect(8, 8, 4, 3);
      ctx.fillRect(13, 13, 4, 3);
    });

    createIcon('ore_tin', (ctx) => {
      ctx.fillStyle = '#3a3e42';
      ctx.beginPath();
      ctx.arc(12, 12, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(8, 8, 5, 4);
      ctx.fillRect(13, 12, 4, 3);
    });

    createIcon('ore_malachite', (ctx) => {
      ctx.fillStyle = '#1e382b';
      ctx.beginPath();
      ctx.arc(12, 12, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#2ed573';
      ctx.fillRect(7, 9, 6, 3);
      ctx.fillRect(12, 13, 5, 4);
    });

    createIcon('glass_obsidian', (ctx) => {
      ctx.fillStyle = '#1a1829';
      ctx.beginPath();
      ctx.moveTo(12, 4);
      ctx.lineTo(20, 16);
      ctx.lineTo(4, 18);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#9b59b6';
      ctx.fillRect(10, 8, 4, 3);
    });

    createIcon('ore_starfall', (ctx) => {
      ctx.fillStyle = '#4834d4';
      ctx.beginPath();
      ctx.arc(12, 12, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e056fd';
      ctx.fillRect(8, 8, 4, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(13, 11, 3, 3);
    });

    createIcon('clay_lump', (ctx) => {
      ctx.fillStyle = '#b7791f';
      ctx.beginPath();
      ctx.ellipse(12, 14, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d69e2e';
      ctx.fillRect(9, 10, 6, 4);
    });

    // Ingots
    createIcon('ingot_bronze', (ctx) => {
      ctx.fillStyle = '#b87333';
      ctx.fillRect(4, 8, 16, 8);
      ctx.fillStyle = '#e59866';
      ctx.fillRect(6, 6, 14, 3);
      ctx.fillStyle = '#f8c471';
      ctx.fillRect(7, 7, 4, 1);
    });

    createIcon('ingot_arsenical', (ctx) => {
      ctx.fillStyle = '#4a5568';
      ctx.fillRect(4, 8, 16, 8);
      ctx.fillStyle = '#718096';
      ctx.fillRect(6, 6, 14, 3);
      ctx.fillStyle = '#48bb78'; // Greenish tint
      ctx.fillRect(7, 7, 5, 2);
    });

    createIcon('ingot_starfall', (ctx) => {
      ctx.fillStyle = '#686de0';
      ctx.fillRect(4, 8, 16, 8);
      ctx.fillStyle = '#be2edd';
      ctx.fillRect(6, 6, 14, 3);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, 7, 4, 2);
    });

    // Timbers
    createIcon('wood_cycad', (ctx) => {
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(4, 8, 16, 8);
      ctx.fillStyle = '#2d6a4f'; // Green bark hint
      ctx.fillRect(6, 6, 14, 2);
    });

    createIcon('wood_bristlecone', (ctx) => {
      ctx.fillStyle = '#ced4da';
      ctx.fillRect(4, 8, 16, 8);
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(6, 6, 14, 2);
    });

    createIcon('wood_ironwood', (ctx) => {
      ctx.fillStyle = '#212529';
      ctx.fillRect(4, 8, 16, 8);
      ctx.fillStyle = '#495057';
      ctx.fillRect(6, 6, 14, 2);
    });

    // Foods
    createIcon('meat_raw', (ctx) => {
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.ellipse(12, 12, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(3, 11, 4, 2); // Bone
    });

    createIcon('meat_cooked', (ctx) => {
      ctx.fillStyle = '#8b4513';
      ctx.beginPath();
      ctx.ellipse(12, 12, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.fillRect(3, 11, 4, 2);
    });

    createIcon('fish_salmon', (ctx) => {
      ctx.fillStyle = '#ff7675';
      ctx.beginPath();
      ctx.ellipse(12, 12, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#74b9ff';
      ctx.fillRect(18, 10, 4, 4); // Tail
    });

    createIcon('mammoth_steak', (ctx) => {
      ctx.fillStyle = '#b71540';
      ctx.fillRect(5, 7, 14, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(8, 9, 3, 6); // Marbling
      ctx.fillRect(14, 9, 2, 5);
    });

    createIcon('mammoth_tusk', (ctx) => {
      ctx.fillStyle = '#fefae0';
      ctx.beginPath();
      ctx.arc(12, 12, 9, Math.PI * 0.5, Math.PI * 1.8);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#fefae0';
      ctx.stroke();
    });

    // Weapons & Tools
    createIcon('spear_flint', (ctx) => {
      ctx.fillStyle = '#8d5b4c';
      ctx.fillRect(4, 18, 14, 2);
      ctx.fillStyle = '#6c757d';
      ctx.fillRect(18, 16, 5, 5);
    });

    createIcon('axe_bronze', (ctx) => {
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(10, 4, 3, 16);
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(5, 5, 10, 6);
      ctx.fillStyle = '#f3a847';
      ctx.fillRect(4, 6, 2, 4);
    });

    createIcon('dagger_obsidian', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(6, 16, 4, 4);
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(10, 6, 8, 8);
      ctx.fillStyle = '#9b59b6';
      ctx.fillRect(12, 8, 3, 3);
    });

    createIcon('spear_bronze', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(4, 18, 14, 2);
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(18, 15, 6, 6);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(20, 14, 3, 3);
    });

    createIcon('spear_starfall', (ctx) => {
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(4, 18, 14, 2);
      ctx.fillStyle = '#be2edd';
      ctx.fillRect(17, 14, 7, 7);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(20, 13, 3, 3);
    });

    createIcon('shield_wood', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.beginPath();
      ctx.arc(12, 12, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(10, 10, 4, 4);
    });

    createIcon('bow_hunting', (ctx) => {
      ctx.strokeStyle = '#8b5a2b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(14, 12, 8, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
      ctx.strokeStyle = '#ced4da';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(14, 4);
      ctx.lineTo(14, 20);
      ctx.stroke();
    });

    // Armors
    createIcon('armor_hide', (ctx) => {
      ctx.fillStyle = '#8a5a36';
      ctx.fillRect(6, 6, 12, 12);
      ctx.fillStyle = '#6e4726';
      ctx.fillRect(8, 8, 8, 8);
    });

    createIcon('armor_bronze', (ctx) => {
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(6, 6, 12, 12);
      ctx.fillStyle = '#f3a847';
      ctx.fillRect(8, 8, 4, 4);
      ctx.fillRect(12, 12, 4, 4);
    });

    createIcon('headdress_feather', (ctx) => {
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(6, 14, 12, 4);
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(8, 6, 2, 8);
      ctx.fillStyle = '#3498db';
      ctx.fillRect(11, 4, 2, 10);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(14, 6, 2, 8);
    });

    // Potions & Consumables
    createIcon('potion_health', (ctx) => {
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(8, 10, 8, 10);
      ctx.fillStyle = '#ced4da';
      ctx.fillRect(10, 6, 4, 4);
    });

    createIcon('potion_spirit', (ctx) => {
      ctx.fillStyle = '#3498db';
      ctx.fillRect(8, 10, 8, 10);
      ctx.fillStyle = '#ced4da';
      ctx.fillRect(10, 6, 4, 4);
    });

    createIcon('potion_fever_poultice', (ctx) => {
      ctx.fillStyle = '#27ae60';
      ctx.fillRect(7, 9, 10, 11);
      ctx.fillStyle = '#f1f2f6';
      ctx.fillRect(9, 6, 6, 3);
    });

    createIcon('item_clay_phial', (ctx) => {
      ctx.fillStyle = '#b7791f';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#d69e2e';
      ctx.fillRect(10, 5, 4, 4);
    });

    createIcon('item_serpent_toxin', (ctx) => {
      ctx.fillStyle = '#8e44ad';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#2ed573';
      ctx.fillRect(10, 11, 4, 4);
    });

    createIcon('potion_stamina', (ctx) => {
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#ced4da';
      ctx.fillRect(10, 5, 4, 4);
    });

    createIcon('potion_strength', (ctx) => {
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(10, 11, 4, 4);
    });

    createIcon('potion_antidote', (ctx) => {
      ctx.fillStyle = '#1abc9c';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(10, 11, 4, 4);
    });

    createIcon('potion_berserker', (ctx) => {
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#8e44ad';
      ctx.fillRect(9, 12, 6, 4);
    });

    createIcon('potion_fire_resist', (ctx) => {
      ctx.fillStyle = '#d35400';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(10, 5, 4, 4);
    });

    createIcon('potion_night_eye', (ctx) => {
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#00d2d3';
      ctx.fillRect(10, 11, 4, 4);
    });

    createIcon('potion_super_strength', (ctx) => {
      ctx.fillStyle = '#881111';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(9, 11, 6, 5);
    });

    createIcon('potion_raptor_speed', (ctx) => {
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(8, 9, 8, 11);
      ctx.fillStyle = '#ffff00';
      ctx.fillRect(10, 11, 4, 4);
    });

    createIcon('potion_liquid_fire', (ctx) => {
      ctx.fillStyle = '#ff4757';
      ctx.beginPath();
      ctx.arc(12, 14, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffa502';
      ctx.fillRect(10, 5, 4, 4);
    });

    // Foods & Fish
    createIcon('fish_trout', (ctx) => {
      ctx.fillStyle = '#a4b0be';
      ctx.beginPath();
      ctx.ellipse(12, 12, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff6b81';
      ctx.fillRect(10, 11, 4, 2);
    });

    createIcon('fish_crayfish', (ctx) => {
      ctx.fillStyle = '#e84118';
      ctx.fillRect(8, 10, 8, 6);
      ctx.fillRect(6, 8, 3, 3);
      ctx.fillRect(15, 8, 3, 3);
    });

    createIcon('fish_sturgeon', (ctx) => {
      ctx.fillStyle = '#57606f';
      ctx.beginPath();
      ctx.ellipse(12, 12, 10, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ced6e0';
      ctx.fillRect(8, 10, 8, 2);
    });

    createIcon('fish_eel', (ctx) => {
      ctx.fillStyle = '#2f3542';
      ctx.fillRect(4, 11, 16, 3);
      ctx.fillRect(16, 14, 4, 3);
    });

    createIcon('fish_arapaima', (ctx) => {
      ctx.fillStyle = '#2ed573';
      ctx.beginPath();
      ctx.ellipse(12, 12, 10, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff4757';
      ctx.fillRect(16, 10, 4, 4);
    });

    createIcon('fish_magma_eel', (ctx) => {
      ctx.fillStyle = '#ff4757';
      ctx.fillRect(4, 11, 16, 3);
      ctx.fillStyle = '#ffa502';
      ctx.fillRect(8, 10, 8, 2);
    });

    createIcon('fish_smoked', (ctx) => {
      ctx.fillStyle = '#c85a17';
      ctx.beginPath();
      ctx.ellipse(12, 12, 8, 4, 0, 0, Math.PI * 2);
      ctx.fill();
    });

    createIcon('food_porridge', (ctx) => {
      ctx.fillStyle = '#b7791f';
      ctx.beginPath();
      ctx.arc(12, 14, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f5cd79';
      ctx.beginPath();
      ctx.arc(12, 12, 5, 0, Math.PI * 2);
      ctx.fill();
    });

    createIcon('food_berry_tart', (ctx) => {
      ctx.fillStyle = '#e58e26';
      ctx.beginPath();
      ctx.arc(12, 13, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#eb2f06';
      ctx.fillRect(10, 10, 4, 4);
    });

    createIcon('food_wolf_flank', (ctx) => {
      ctx.fillStyle = '#78281f';
      ctx.fillRect(6, 8, 12, 8);
    });

    createIcon('food_raptor_omelet', (ctx) => {
      ctx.fillStyle = '#f6b93b';
      ctx.beginPath();
      ctx.ellipse(12, 13, 8, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78e08f';
      ctx.fillRect(10, 11, 4, 3);
    });

    createIcon('food_venison_roast', (ctx) => {
      ctx.fillStyle = '#6e2c00';
      ctx.fillRect(6, 8, 12, 9);
      ctx.fillStyle = '#ff7675';
      ctx.fillRect(10, 10, 4, 3);
    });

    createIcon('food_herbal_skewers', (ctx) => {
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(4, 12, 16, 2);
      ctx.fillStyle = '#8b4513';
      ctx.fillRect(7, 9, 4, 6);
      ctx.fillStyle = '#2ed573';
      ctx.fillRect(13, 9, 4, 6);
    });

    createIcon('food_spiced_stew', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.beginPath();
      ctx.arc(12, 14, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b71540';
      ctx.fillRect(9, 10, 6, 4);
    });

    createIcon('food_salmon_jerky', (ctx) => {
      ctx.fillStyle = '#b83b5e';
      ctx.fillRect(6, 9, 12, 3);
      ctx.fillRect(6, 14, 12, 3);
    });

    createIcon('food_bear_ribs', (ctx) => {
      ctx.fillStyle = '#4a235a';
      ctx.fillRect(6, 8, 12, 9);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(4, 9, 3, 2);
      ctx.fillRect(4, 14, 3, 2);
    });

    // Botanicals & Wood Types
    createIcon('wood_willow', (ctx) => {
      ctx.fillStyle = '#82954b';
      ctx.fillRect(4, 8, 16, 8);
    });
    createIcon('wood_acacia', (ctx) => {
      ctx.fillStyle = '#b86b35';
      ctx.fillRect(4, 8, 16, 8);
    });
    createIcon('wood_ebony', (ctx) => {
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(4, 8, 16, 8);
    });
    createIcon('wood_ashwood', (ctx) => {
      ctx.fillStyle = '#747d8c';
      ctx.fillRect(4, 8, 16, 8);
    });
    createIcon('plank_hardwood', (ctx) => {
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(4, 7, 16, 5);
      ctx.fillRect(4, 13, 16, 5);
    });
    createIcon('item_tree_bark', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(7, 7, 10, 10);
    });
    createIcon('item_tree_resin', (ctx) => {
      ctx.fillStyle = '#ffa502';
      ctx.beginPath();
      ctx.arc(12, 13, 6, 0, Math.PI * 2);
      ctx.fill();
    });

    createIcon('berry_sweet', (ctx) => {
      ctx.fillStyle = '#e84118';
      ctx.beginPath();
      ctx.arc(10, 13, 4, 0, Math.PI * 2);
      ctx.arc(14, 11, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    createIcon('root_fever', (ctx) => {
      ctx.fillStyle = '#c0392b';
      ctx.fillRect(9, 6, 6, 12);
    });
    createIcon('reeds_river', (ctx) => {
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(8, 5, 2, 14);
      ctx.fillRect(11, 4, 2, 15);
      ctx.fillRect(14, 6, 2, 13);
    });
    createIcon('fungus_glow', (ctx) => {
      ctx.fillStyle = '#00d2d3';
      ctx.beginPath();
      ctx.arc(12, 11, 6, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#c8d6e5';
      ctx.fillRect(11, 11, 2, 6);
    });
    createIcon('grain_wheat', (ctx) => {
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(10, 5, 4, 14);
    });
    createIcon('moss_tundra', (ctx) => {
      ctx.fillStyle = '#55efc4';
      ctx.fillRect(6, 10, 12, 6);
    });
    createIcon('vine_serpent', (ctx) => {
      ctx.fillStyle = '#10ac84';
      ctx.fillRect(6, 6, 12, 3);
      ctx.fillRect(15, 9, 3, 6);
      ctx.fillRect(6, 15, 12, 3);
    });
    createIcon('flower_ghost_orchid', (ctx) => {
      ctx.fillStyle = '#f1f2f6';
      ctx.beginPath();
      ctx.arc(12, 11, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#be2edd';
      ctx.fillRect(11, 10, 2, 2);
    });
    createIcon('root_ginseng', (ctx) => {
      ctx.fillStyle = '#f8c291';
      ctx.fillRect(10, 6, 4, 12);
      ctx.fillRect(7, 12, 3, 4);
      ctx.fillRect(14, 13, 3, 4);
    });
    createIcon('fungus_crypt_truffle', (ctx) => {
      ctx.fillStyle = '#2d3436';
      ctx.beginPath();
      ctx.arc(12, 13, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    createIcon('mineral_sulfur', (ctx) => {
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(7, 8, 10, 9);
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(9, 10, 5, 4);
    });

    // Weapons, Tools & Armors
    createIcon('knife_flint', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(6, 14, 4, 4);
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(10, 8, 7, 7);
    });
    createIcon('knife_copper', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(6, 14, 4, 4);
      ctx.fillStyle = '#d35400';
      ctx.fillRect(10, 8, 7, 7);
    });
    createIcon('axe_flint', (ctx) => {
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(10, 4, 3, 16);
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(6, 5, 8, 6);
    });
    createIcon('adze_copper', (ctx) => {
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(10, 4, 3, 16);
      ctx.fillStyle = '#e67e22';
      ctx.fillRect(5, 5, 9, 5);
    });
    createIcon('greataxe_bronze', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(10, 2, 4, 20);
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(3, 4, 18, 7);
    });
    createIcon('spear_raptor_harpoon', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(4, 18, 14, 2);
      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(18, 14, 5, 5);
    });
    createIcon('spear_bronze_harpoon', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(4, 18, 14, 2);
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(17, 13, 6, 6);
    });
    createIcon('bow_bone_recurve', (ctx) => {
      ctx.strokeStyle = '#f5f6fa';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(14, 12, 8, Math.PI * 0.5, Math.PI * 1.5);
      ctx.stroke();
    });
    createIcon('club_hardwood', (ctx) => {
      ctx.fillStyle = '#6e2c00';
      ctx.fillRect(9, 4, 6, 16);
    });
    createIcon('hammer_ironwood_sledge', (ctx) => {
      ctx.fillStyle = '#212529';
      ctx.fillRect(10, 4, 4, 16);
      ctx.fillRect(4, 5, 16, 7);
    });
    createIcon('blade_obsidian_razor', (ctx) => {
      ctx.fillStyle = '#1a1829';
      ctx.fillRect(6, 6, 12, 12);
      ctx.fillStyle = '#be2edd';
      ctx.fillRect(8, 8, 4, 4);
    });
    createIcon('pickaxe_flint', (ctx) => {
      ctx.fillStyle = '#6f4e37';
      ctx.fillRect(10, 4, 3, 16);
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(4, 4, 16, 4);
    });
    createIcon('chisel_runestone', (ctx) => {
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(8, 5, 8, 14);
      ctx.fillStyle = '#00d2d3';
      ctx.fillRect(11, 7, 2, 8);
    });
    createIcon('scythe_obsidian', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(10, 4, 3, 16);
      ctx.fillStyle = '#1a1829';
      ctx.fillRect(4, 4, 14, 5);
    });
    createIcon('javelin_obsidian', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(4, 18, 14, 2);
      ctx.fillStyle = '#1a1829';
      ctx.fillRect(18, 14, 5, 5);
    });
    createIcon('maul_obsidian', (ctx) => {
      ctx.fillStyle = '#212529';
      ctx.fillRect(10, 4, 4, 16);
      ctx.fillStyle = '#1a1829';
      ctx.fillRect(4, 4, 16, 8);
    });
    createIcon('sword_bronze', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(10, 16, 4, 5);
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(9, 4, 6, 12);
    });
    createIcon('shield_wicker', (ctx) => {
      ctx.fillStyle = '#e58e26';
      ctx.beginPath();
      ctx.arc(12, 12, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    createIcon('shield_arsenical_bronze', (ctx) => {
      ctx.fillStyle = '#48bb78';
      ctx.fillRect(5, 5, 14, 14);
    });
    createIcon('armor_mammoth_vest', (ctx) => {
      ctx.fillStyle = '#fefae0';
      ctx.fillRect(6, 6, 12, 12);
      ctx.fillStyle = '#b71540';
      ctx.fillRect(8, 8, 8, 8);
    });
    createIcon('armor_raptor_vest', (ctx) => {
      ctx.fillStyle = '#10ac84';
      ctx.fillRect(6, 6, 12, 12);
    });
    createIcon('armor_hardened_leather', (ctx) => {
      ctx.fillStyle = '#4a2c11';
      ctx.fillRect(6, 6, 12, 12);
    });
    createIcon('armor_raptor_coat', (ctx) => {
      ctx.fillStyle = '#006266';
      ctx.fillRect(5, 5, 14, 14);
    });
    createIcon('armor_obsidian_plate', (ctx) => {
      ctx.fillStyle = '#1a1829';
      ctx.fillRect(5, 5, 14, 14);
      ctx.fillStyle = '#be2edd';
      ctx.fillRect(8, 8, 8, 8);
    });
    createIcon('boots_leather', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(7, 10, 10, 8);
    });
    createIcon('quiver_rawhide', (ctx) => {
      ctx.fillStyle = '#6e4726';
      ctx.fillRect(8, 6, 8, 12);
    });
    createIcon('gloves_studded_leather', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(6, 8, 12, 9);
    });
    createIcon('cape_bear_fur', (ctx) => {
      ctx.fillStyle = '#2d3436';
      ctx.fillRect(5, 5, 14, 14);
    });
    createIcon('gloves_raptor_gauntlets', (ctx) => {
      ctx.fillStyle = '#10ac84';
      ctx.fillRect(6, 8, 12, 9);
    });
    createIcon('greaves_bronze', (ctx) => {
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(6, 8, 12, 10);
    });
    createIcon('helmet_bronze', (ctx) => {
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(6, 6, 12, 10);
      ctx.fillStyle = '#fefae0';
      ctx.fillRect(4, 4, 3, 4);
      ctx.fillRect(17, 4, 3, 4);
    });

    // Traps, Mounts, Boats, Talismans
    createIcon('trap_reed_snare', (ctx) => {
      ctx.strokeStyle = '#2ecc71';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(12, 12, 6, 0, Math.PI * 2);
      ctx.stroke();
    });
    createIcon('trap_stone_deadfall', (ctx) => {
      ctx.fillStyle = '#7f8c8d';
      ctx.fillRect(6, 8, 12, 6);
    });
    createIcon('trap_pitfall_spike', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(6, 12, 12, 4);
    });
    createIcon('trap_bone_jaw', (ctx) => {
      ctx.fillStyle = '#f5f6fa';
      ctx.fillRect(6, 10, 12, 5);
    });
    createIcon('trap_raptor_cage', (ctx) => {
      ctx.fillStyle = '#212529';
      ctx.fillRect(5, 5, 14, 14);
    });
    createIcon('trap_bronze_bear', (ctx) => {
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(5, 8, 14, 8);
    });
    createIcon('trap_mammoth_trench', (ctx) => {
      ctx.fillStyle = '#2d3436';
      ctx.fillRect(4, 6, 16, 12);
    });
    createIcon('whistle_primitive', (ctx) => {
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(6, 10, 12, 4);
    });
    createIcon('item_animal_feed', (ctx) => {
      ctx.fillStyle = '#f1c40f';
      ctx.fillRect(6, 9, 12, 7);
    });
    createIcon('saddle_raptor', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(6, 8, 12, 8);
    });

    createIcon('boat_reed_raft', (ctx) => {
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(4, 9, 16, 6);
    });
    createIcon('boat_dugout_canoe', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(4, 9, 16, 6);
    });
    createIcon('boat_wicker_sail', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(4, 12, 16, 5);
      ctx.fillStyle = '#f1f2f6';
      ctx.fillRect(9, 4, 6, 8);
    });
    createIcon('boat_outrigger_canoe', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(4, 9, 16, 6);
      ctx.fillRect(4, 4, 16, 2);
    });
    createIcon('boat_war_canoe', (ctx) => {
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(4, 9, 16, 6);
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(18, 8, 3, 8);
    });
    createIcon('boat_trade_barge', (ctx) => {
      ctx.fillStyle = '#d4a373';
      ctx.fillRect(3, 7, 18, 10);
    });
    createIcon('boat_lake_longboat', (ctx) => {
      ctx.fillStyle = '#1e272e';
      ctx.fillRect(3, 8, 18, 8);
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(19, 6, 3, 10);
    });

    createIcon('tool_bone_needle', (ctx) => {
      ctx.fillStyle = '#f5f6fa';
      ctx.fillRect(6, 12, 12, 2);
    });
    createIcon('tool_wooden_paddle', (ctx) => {
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(5, 11, 14, 3);
    });
    createIcon('tool_merchant_scales', (ctx) => {
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(6, 7, 12, 3);
      ctx.fillRect(11, 10, 2, 8);
    });
    createIcon('item_sundial_bone', (ctx) => {
      ctx.fillStyle = '#f5f6fa';
      ctx.beginPath();
      ctx.arc(12, 12, 7, 0, Math.PI * 2);
      ctx.fill();
    });
    createIcon('item_astrolabe', (ctx) => {
      ctx.strokeStyle = '#d48a37';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(12, 12, 7, 0, Math.PI * 2);
      ctx.stroke();
    });
    createIcon('talisman_spark', (ctx) => {
      ctx.fillStyle = '#ffb703';
      ctx.beginPath();
      ctx.arc(12, 12, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    createIcon('talisman_solar_flare', (ctx) => {
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(12, 12, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    createIcon('fossil_trilobite', (ctx) => {
      ctx.fillStyle = '#7f8c8d';
      ctx.beginPath();
      ctx.ellipse(12, 12, 6, 8, 0, 0, Math.PI * 2);
      ctx.fill();
    });
    createIcon('brick_clay', (ctx) => {
      ctx.fillStyle = '#b7791f';
      ctx.fillRect(6, 8, 12, 8);
    });
    createIcon('mold_clay', (ctx) => {
      ctx.fillStyle = '#b7791f';
      ctx.fillRect(6, 7, 12, 10);
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(8, 9, 8, 6);
    });
    createIcon('ingot_copper', (ctx) => {
      ctx.fillStyle = '#e67e22';
      ctx.fillRect(4, 8, 16, 8);
    });
    createIcon('ingot_tin', (ctx) => {
      ctx.fillStyle = '#adb5bd';
      ctx.fillRect(4, 8, 16, 8);
    });
    createIcon('ingot_bismuth_bronze', (ctx) => {
      ctx.fillStyle = '#f39c12';
      ctx.fillRect(4, 8, 16, 8);
      ctx.fillStyle = '#2ecc71';
      ctx.fillRect(7, 10, 4, 3);
    });

    createIcon('amulet_amber', (ctx) => {
      ctx.strokeStyle = '#ced4da';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(12, 10, 6, 0, Math.PI);
      ctx.stroke();
      ctx.fillStyle = '#ffb703';
      ctx.fillRect(10, 14, 4, 6);
    });
  }

  // Dynamic Procedural Fallback Sprite Generator for Any Key
  getSprite(key) {
    if (this.sprites.has(key)) {
      return this.sprites.get(key);
    }

    const lowerKey = (key || '').toLowerCase();

    // 1. CANINES & WOLVES
    if (lowerKey.includes('wolf') || lowerKey.includes('hound') || lowerKey.includes('dog') || lowerKey.includes('jackal')) {
      const { canvas, ctx } = this.createCanvas(32, 24);
      ctx.fillStyle = lowerKey.includes('dire') ? '#343a40' : '#6c757d';
      ctx.fillRect(6, 8, 16, 9);
      ctx.fillStyle = '#212529'; // Ears & back
      ctx.fillRect(8, 5, 12, 4);
      ctx.fillRect(21, 2, 2, 5);
      ctx.fillRect(25, 3, 2, 4);
      ctx.fillRect(20, 6, 8, 7);
      ctx.fillRect(26, 8, 5, 4);
      ctx.fillStyle = '#f1c40f'; // Eyes
      ctx.fillRect(23, 7, 2, 2);
      ctx.fillStyle = '#212529'; // Legs
      ctx.fillRect(8, 15, 3, 7);
      ctx.fillRect(13, 15, 3, 7);
      ctx.fillRect(17, 15, 3, 7);
      ctx.fillRect(21, 15, 3, 7);
      ctx.fillRect(1, 10, 6, 4); // Tail
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 2. BOARS, SWINE & RHINOS
    if (lowerKey.includes('boar') || lowerKey.includes('swine') || lowerKey.includes('pig') || lowerKey.includes('rhino')) {
      const { canvas, ctx } = this.createCanvas(32, 24);
      ctx.fillStyle = lowerKey.includes('rhino') ? '#7f8c8d' : '#58311a';
      ctx.fillRect(6, 8, 18, 10);
      ctx.fillStyle = '#3a1f10';
      ctx.fillRect(8, 5, 14, 4);
      ctx.fillRect(20, 9, 8, 7);
      ctx.fillRect(26, 11, 4, 5);
      ctx.fillStyle = '#ffffff'; // Tusks / Horn
      ctx.fillRect(25, 12, 2, 4);
      ctx.fillStyle = '#212529';
      ctx.fillRect(8, 17, 3, 6);
      ctx.fillRect(13, 17, 3, 6);
      ctx.fillRect(18, 17, 3, 6);
      ctx.fillRect(22, 17, 3, 6);
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 3. FOXES & FELINES
    if (lowerKey.includes('fox') || lowerKey.includes('cat') || lowerKey.includes('panther') || lowerKey.includes('lion') || lowerKey.includes('tiger') || lowerKey.includes('leopard')) {
      const { canvas, ctx } = this.createCanvas(28, 22);
      ctx.fillStyle = lowerKey.includes('panther') ? '#212529' : (lowerKey.includes('fox') ? '#e8590c' : '#d48a37');
      ctx.fillRect(6, 9, 14, 7);
      ctx.fillStyle = '#f8f9fa';
      ctx.fillRect(14, 11, 5, 5);
      ctx.fillStyle = lowerKey.includes('panther') ? '#212529' : '#e8590c';
      ctx.fillRect(18, 7, 7, 6);
      ctx.fillRect(24, 9, 3, 3);
      ctx.fillStyle = '#212529';
      ctx.fillRect(19, 3, 2, 4);
      ctx.fillRect(23, 4, 2, 3);
      ctx.fillRect(8, 15, 2, 6);
      ctx.fillRect(12, 15, 2, 6);
      ctx.fillRect(17, 15, 2, 6);
      ctx.fillRect(20, 15, 2, 6);
      ctx.fillRect(2, 8, 5, 5); // Tail
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 4. HARES, RABBITS & RODENTS
    if (lowerKey.includes('hare') || lowerKey.includes('rabbit') || lowerKey.includes('rodent') || lowerKey.includes('rat') || lowerKey.includes('mouse')) {
      const { canvas, ctx } = this.createCanvas(24, 20);
      ctx.fillStyle = '#b08968';
      ctx.beginPath();
      ctx.ellipse(11, 13, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f8f9fa';
      ctx.beginPath();
      ctx.arc(4, 13, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7f5539';
      ctx.fillRect(15, 2, 2, 6);
      ctx.fillRect(18, 1, 2, 7);
      ctx.fillStyle = '#212529';
      ctx.fillRect(18, 9, 1, 1);
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 5. CRABS, SCORPIONS & ARTHROPODS
    if (lowerKey.includes('crab') || lowerKey.includes('scorpion') || lowerKey.includes('spider') || lowerKey.includes('beetle') || lowerKey.includes('insect')) {
      const { canvas, ctx } = this.createCanvas(24, 20);
      ctx.fillStyle = lowerKey.includes('crab') ? '#d9480f' : '#78350f';
      ctx.beginPath();
      ctx.ellipse(12, 11, 7, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e03131'; // Claws
      ctx.fillRect(2, 6, 4, 5);
      ctx.fillRect(18, 6, 4, 5);
      ctx.fillStyle = '#212529';
      ctx.fillRect(4, 15, 2, 4);
      ctx.fillRect(8, 16, 2, 4);
      ctx.fillRect(14, 16, 2, 4);
      ctx.fillRect(18, 15, 2, 4);
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 6. SERPENTS & REPTILES
    if (lowerKey.includes('snake') || lowerKey.includes('serpent') || lowerKey.includes('viper') || lowerKey.includes('cobra') || lowerKey.includes('worm')) {
      const { canvas, ctx } = this.createCanvas(28, 24);
      ctx.fillStyle = '#2b9348';
      ctx.beginPath();
      ctx.arc(14, 15, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e9d8a6';
      ctx.fillRect(9, 13, 10, 4);
      ctx.fillStyle = '#2b9348';
      ctx.fillRect(18, 6, 8, 6);
      ctx.fillStyle = '#e63946'; // Tongue
      ctx.fillRect(26, 8, 2, 1);
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 7. DINOSAURS & RAPTORS
    if (lowerKey.includes('raptor') || lowerKey.includes('dino') || lowerKey.includes('t-rex') || lowerKey.includes('lizard')) {
      const { canvas, ctx } = this.createCanvas(32, 30);
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(8, 10, 14, 8);
      ctx.fillRect(18, 6, 5, 8);
      ctx.fillRect(21, 3, 9, 6);
      ctx.fillStyle = '#e76f51';
      ctx.fillRect(19, 1, 6, 3);
      ctx.fillStyle = '#1b4332';
      ctx.fillRect(10, 17, 4, 10);
      ctx.fillRect(16, 17, 4, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(18, 25, 4, 2);
      ctx.fillStyle = '#2d6a4f';
      ctx.fillRect(1, 11, 8, 3);
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 8. GOLEMS, CONSTRUCTS & ELEMENTALS
    if (lowerKey.includes('golem') || lowerKey.includes('elemental') || lowerKey.includes('construct') || lowerKey.includes('rock_beast') || lowerKey.includes('titan')) {
      const { canvas, ctx } = this.createCanvas(36, 36);
      ctx.fillStyle = '#343a40';
      ctx.fillRect(8, 10, 20, 16);
      ctx.fillStyle = '#00f2fe'; // Glowing eye core
      ctx.fillRect(16, 15, 4, 4);
      ctx.fillRect(14, 6, 2, 2);
      ctx.fillRect(20, 6, 2, 2);
      ctx.fillStyle = '#212529';
      ctx.fillRect(3, 12, 6, 12);
      ctx.fillRect(27, 12, 6, 12);
      ctx.fillRect(10, 26, 6, 8);
      ctx.fillRect(20, 26, 6, 8);
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 9. CRAFTING STATIONS & OBJECTS
    if (lowerKey.includes('station') || lowerKey.includes('bench') || lowerKey.includes('furnace') || lowerKey.includes('anvil') || lowerKey.includes('rack') || lowerKey.includes('table') || lowerKey.includes('cauldron') || lowerKey.includes('loom')) {
      const { canvas, ctx } = this.createCanvas(32, 32);
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(6, 12, 20, 14);
      ctx.fillStyle = '#d48a37';
      ctx.fillRect(4, 10, 24, 4);
      ctx.fillStyle = '#5c3a21';
      ctx.fillRect(8, 24, 4, 6);
      ctx.fillRect(20, 24, 4, 6);
      this.sprites.set(key, canvas);
      return canvas;
    }

    // 10. HUMANOIDS & TOWN CITIZENS (Elder, Warrior, Shaman, Guard, Merchant, Player)
    const { canvas, ctx } = this.createCanvas(24, 28);
    let skin = '#e0a96d';
    let robe = '#3a506b';
    let helm = '#d48a37';

    if (lowerKey.includes('warrior') || lowerKey.includes('guard')) {
      robe = '#8a5a36';
      helm = '#b87333';
    } else if (lowerKey.includes('shaman') || lowerKey.includes('elder') || lowerKey.includes('priest')) {
      robe = '#2d6a4f';
      helm = '#9b59b6';
    } else if (lowerKey.includes('merchant') || lowerKey.includes('trader')) {
      robe = '#8b5a2b';
      helm = '#f39c12';
    }

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.ellipse(12, 26, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = robe;
    ctx.fillRect(6, 10, 12, 14);
    // Head
    ctx.fillStyle = skin;
    ctx.fillRect(8, 4, 8, 7);
    // Hat/Helm
    ctx.fillStyle = helm;
    ctx.fillRect(7, 2, 10, 3);
    // Eyes
    ctx.fillStyle = '#212529';
    ctx.fillRect(9, 6, 2, 2);
    ctx.fillRect(13, 6, 2, 2);

    this.sprites.set(key, canvas);
    return canvas;
  }
}

