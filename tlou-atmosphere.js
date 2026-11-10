/**
 * The Last of Us - Living Atmospheric Canvas Engine
 * Brings the 4K cinematic Seattle ruins landscape to life with:
 * 1. Radiant Sunbeams & Shimmering God-rays aligned with the 4K sky light break
 * 2. Volumetric Drifting Clouds across the upper sky strata
 * 3. Realistic Flocks of Birds with natural wing articulation & soaring physics
 * 4. Falling Foliage & Tumbling Tree Leaves drifting from the flanking building canopies
 * 5. Floating Sunlit Spores, Pollen & Dandelion Tufts in the breeze
 * 6. PHOTOREALISTIC MULTI-LAYERED WILD MEADOW GRASS & BOTANICAL WILDFLOWERS:
 *    - Clumped organic sods with natural fanning, leaning, and crisscrossing blades
 *    - Tapered polygon blade geometry (wide base to needle-sharp tip, no cartoon strokes)
 *    - Per-blade dynamic sunlight gradients (dark root -> forest green -> translucent sunlit tip)
 *    - Specular spine highlights and authentic weathered/cured straw blades
 *    - Multi-petaled wild chamomile daisies with perspective foreshortening & textured discs
 *    - Delicate golden-yellow buttercups/wildflowers matching the 4K photo
 *    - Purple/pink wild clover flower clusters & nodding wheat/foxtail seed heads
 *    - Natural compound wind physics (multi-octave breeze) and elastic cursor deflection
 */

class TLOUAtmosphere {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.time = 0;
    this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 };

    this.sunbeams = [];
    this.clouds = [];
    this.birds = [];
    this.leaves = [];
    this.spores = [];
    this.backGrass = [];
    this.midGrass = [];
    this.frontGrass = [];

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.initGrass();
    });

    window.addEventListener('mousemove', (e) => {
      this.mouse.vx = e.clientX - this.mouse.lastX;
      this.mouse.vy = e.clientY - this.mouse.lastY;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
      this.mouse.lastX = e.clientX;
      this.mouse.lastY = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = -1000;
      this.mouse.y = -1000;
    });

    this.initSunbeams();
    this.initClouds();
    this.initBirds();
    this.initLeaves();
    this.initSpores();
    this.initGrass();

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  /* ==========================================================================
     1. SHIMMERING SUNBEAMS & GOD-RAYS (Aligned with Cloud Break in 4K Scene)
     ========================================================================== */
  initSunbeams() {
    // Angled down-left emanating from the bright sky break (x: 62%, y: 8%)
    this.sunbeams = [
      { angle: 1.88, width: 85, length: 0.9, alpha: 0.12, speed: 0.007, phase: 0 },
      { angle: 2.05, width: 140, length: 0.98, alpha: 0.16, speed: 0.005, phase: 1.5 },
      { angle: 2.22, width: 110, length: 0.95, alpha: 0.14, speed: 0.008, phase: 3.1 },
      { angle: 2.38, width: 80, length: 0.85, alpha: 0.11, speed: 0.006, phase: 4.6 }
    ];
  }

  drawSunbeams() {
    const ctx = this.ctx;
    // Sunbreak coordinates aligned with the 4K landscape photo
    const originX = this.width * 0.62;
    const originY = this.height * 0.08;
    const maxLen = Math.max(this.width, this.height);

    ctx.save();
    for (let i = 0; i < this.sunbeams.length; i++) {
      const b = this.sunbeams[i];
      const pulse = Math.sin(this.time * b.speed + b.phase) * 0.045 + b.alpha;
      const angle = b.angle + Math.sin(this.time * 0.004 + b.phase) * 0.02;

      ctx.save();
      ctx.translate(originX, originY);
      ctx.rotate(angle);

      const grad = ctx.createLinearGradient(0, 0, 0, maxLen * b.length);
      grad.addColorStop(0, `rgba(255, 250, 225, ${pulse * 1.35})`);
      grad.addColorStop(0.35, `rgba(245, 235, 195, ${pulse})`);
      grad.addColorStop(1, 'rgba(230, 220, 180, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(10, 0);
      ctx.lineTo(b.width * 0.8, maxLen * b.length);
      ctx.lineTo(-b.width * 0.8, maxLen * b.length);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }

  /* ==========================================================================
     2. VOLUMETRIC DRIFTING CLOUDS
     ========================================================================== */
  initClouds() {
    this.clouds = [];
    const count = 6;
    for (let i = 0; i < count; i++) {
      this.clouds.push(this.newCloud(true));
    }
  }

  newCloud(randomX = false) {
    const scale = Math.random() * 0.7 + 0.65;
    const width = (320 + Math.random() * 320) * scale;
    const height = (110 + Math.random() * 100) * scale;
    const speed = 0.18 + Math.random() * 0.22;

    return {
      x: randomX ? Math.random() * (this.width + width) - width * 0.5 : -width - 60,
      y: Math.random() * (this.height * 0.32) - 25,
      width: width,
      height: height,
      speed: speed,
      alpha: 0.13 + Math.random() * 0.15,
      puffs: [
        { ox: 0, oy: 0, r: width * 0.32 },
        { ox: width * 0.25, oy: -height * 0.18, r: width * 0.36 },
        { ox: width * 0.52, oy: -height * 0.08, r: width * 0.34 },
        { ox: width * 0.75, oy: height * 0.05, r: width * 0.28 },
        { ox: width * 0.38, oy: height * 0.15, r: width * 0.3 }
      ]
    };
  }

  updateClouds() {
    for (let i = 0; i < this.clouds.length; i++) {
      const c = this.clouds[i];
      c.x += c.speed;
      if (c.x > this.width + 120) {
        this.clouds[i] = this.newCloud(false);
      }
    }
  }

  drawClouds() {
    const ctx = this.ctx;
    for (let i = 0; i < this.clouds.length; i++) {
      const c = this.clouds[i];
      ctx.save();
      ctx.globalAlpha = c.alpha;

      const grad = ctx.createRadialGradient(
        c.x + c.width * 0.4, c.y + c.height * 0.3, 15,
        c.x + c.width * 0.4, c.y + c.height * 0.3, c.width * 0.55
      );
      grad.addColorStop(0, 'rgba(248, 250, 252, 0.55)');
      grad.addColorStop(0.5, 'rgba(220, 230, 236, 0.28)');
      grad.addColorStop(1, 'rgba(180, 195, 205, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      for (let j = 0; j < c.puffs.length; j++) {
        const p = c.puffs[j];
        ctx.arc(c.x + p.ox, c.y + p.oy, p.r, 0, Math.PI * 2);
      }
      ctx.fill();
      ctx.restore();
    }
  }

  /* ==========================================================================
     3. FLOCKS OF BIRDS (Natural Wing Contours & Soaring Physics)
     ========================================================================== */
  initBirds() {
    this.birds = [];
    const flockSize = 13;
    const originX = -70;
    const originY = 85 + Math.random() * 80;

    for (let i = 0; i < flockSize; i++) {
      const row = Math.floor(i / 2);
      const side = (i % 2 === 0) ? 1 : -1;
      const bx = originX - row * 36 - Math.random() * 14;
      const by = originY + side * row * 17 + (Math.random() - 0.5) * 15;
      this.birds.push(this.newBird(bx, by, true));
    }

    for (let i = 0; i < 3; i++) {
      const b = this.newBird(Math.random() * this.width, 35 + Math.random() * 100, false);
      b.scale *= 0.7;
      b.speed *= 0.85;
      this.birds.push(b);
    }
  }

  newBird(x, y, isFlock = false) {
    const scale = 0.65 + Math.random() * 0.55;
    const speed = 1.6 + Math.random() * 1.1;

    return {
      x: x !== undefined ? x : -60,
      y: y !== undefined ? y : 70 + Math.random() * (this.height * 0.28),
      vx: speed,
      vy: 0,
      speed: speed,
      scale: scale,
      wingspan: 13 * scale,
      wingAngle: Math.random() * Math.PI * 2,
      wingSpeed: 0.16 + Math.random() * 0.08,
      gliding: false,
      glideTimer: Math.floor(Math.random() * 140),
      isFlock: isFlock,
      alpha: 0.78 + Math.random() * 0.18
    };
  }

  updateBirds() {
    for (let i = 0; i < this.birds.length; i++) {
      const b = this.birds[i];
      b.x += b.vx;
      b.y += b.vy;

      b.glideTimer++;
      if (b.glideTimer > 160) {
        b.gliding = !b.gliding;
        b.glideTimer = 0;
      }

      if (!b.gliding) {
        b.wingAngle += b.wingSpeed;
      } else {
        b.wingAngle = 0;
      }

      b.vy = Math.sin(this.time * 0.025 + b.x * 0.006) * 0.32;

      if (b.x > this.width + 100) {
        b.x = -80 - Math.random() * 60;
        b.y = 50 + Math.random() * (this.height * 0.3);
      }
    }
  }

  drawBirds() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = '#182117';

    for (let i = 0; i < this.birds.length; i++) {
      const b = this.birds[i];
      const flapY = Math.sin(b.wingAngle) * (b.wingspan * 0.55);

      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.globalAlpha = b.alpha;

      ctx.beginPath();
      ctx.moveTo(-b.wingspan, -flapY);
      ctx.quadraticCurveTo(-b.wingspan * 0.45, -flapY * 0.85, 0, 0);
      ctx.quadraticCurveTo(b.wingspan * 0.45, -flapY * 0.85, b.wingspan, -flapY);
      ctx.quadraticCurveTo(b.wingspan * 0.4, -flapY * 0.2 + 2, 0, 3);
      ctx.quadraticCurveTo(-b.wingspan * 0.4, -flapY * 0.2 + 2, -b.wingspan, -flapY);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(-2, 2);
      ctx.lineTo(0, 6);
      ctx.lineTo(2, 2);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  }

  /* ==========================================================================
     4. DRIFTING TREE LEAVES
     ========================================================================== */
  initLeaves() {
    this.leaves = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      this.leaves.push(this.newLeaf(true));
    }
  }

  newLeaf(random = false) {
    const colors = ['#5e883a', '#476e2c', '#79ab4a', '#8ca141', '#b08a42'];
    return {
      x: random ? Math.random() * this.width : Math.random() * (this.width * 0.45),
      y: random ? Math.random() * this.height : -20 - Math.random() * 40,
      size: 4 + Math.random() * 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: 0.6 + Math.random() * 0.9,
      vy: 0.5 + Math.random() * 0.7,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.06,
      flutter: Math.random() * Math.PI * 2,
      flutterSpeed: 0.04 + Math.random() * 0.03,
      alpha: 0.65 + Math.random() * 0.25
    };
  }

  updateLeaves() {
    for (let i = 0; i < this.leaves.length; i++) {
      const l = this.leaves[i];
      l.flutter += l.flutterSpeed;
      l.rotation += l.rotSpeed;
      l.x += l.vx + Math.sin(l.flutter) * 0.8;
      l.y += l.vy;

      if (l.y > this.height + 25 || l.x > this.width + 30) {
        this.leaves[i] = this.newLeaf(false);
      }
    }
  }

  drawLeaves() {
    const ctx = this.ctx;
    for (let i = 0; i < this.leaves.length; i++) {
      const l = this.leaves[i];
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.rotation);
      ctx.globalAlpha = l.alpha;
      ctx.fillStyle = l.color;

      const flutterScaleY = Math.cos(l.flutter);
      ctx.beginPath();
      ctx.ellipse(0, 0, l.size, l.size * 0.5 * Math.abs(flutterScaleY), 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     5. FLOATING SPORES & DANDELION SEEDS
     ========================================================================== */
  initSpores() {
    this.spores = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      this.spores.push(this.newSpore(true));
    }
  }

  newSpore(randomY = false) {
    const isTuft = Math.random() < 0.2;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 15,
      size: isTuft ? 2.8 + Math.random() * 1.5 : 1.2 + Math.random() * 1.4,
      isTuft: isTuft,
      vx: 0.3 + Math.random() * 0.45,
      vy: -(0.32 + Math.random() * 0.5),
      alpha: 0.35 + Math.random() * 0.45,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: 0.03 + Math.random() * 0.02
    };
  }

  updateSpores() {
    for (let i = 0; i < this.spores.length; i++) {
      const s = this.spores[i];
      s.wobble += s.wobbleSpeed;
      s.x += s.vx + Math.sin(s.wobble) * 0.4;
      s.y += s.vy;

      if (s.y < -20 || s.x > this.width + 25) {
        this.spores[i] = this.newSpore(false);
      }
    }
  }

  drawSpores() {
    const ctx = this.ctx;
    for (let i = 0; i < this.spores.length; i++) {
      const s = this.spores[i];
      ctx.save();
      ctx.globalAlpha = s.alpha;

      if (s.isTuft) {
        ctx.strokeStyle = 'rgba(252, 253, 248, 0.7)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - 2, s.y + 4);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size * 0.55, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = 'rgba(240, 205, 125, 0.8)';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  /* ==========================================================================
     6. PHOTOREALISTIC MULTI-LAYERED MEADOW GRASS & BOTANICAL WILDFLOWERS
     ========================================================================== */
  initGrass() {
    this.backGrass = [];
    this.midGrass = [];
    this.frontGrass = [];

    // Clump-based natural sod growth distribution
    const clumpSpacing = 36;
    const clumpCount = Math.ceil(this.width / clumpSpacing) + 2;

    for (let c = 0; c < clumpCount; c++) {
      const clumpX = (c - 0.5) * clumpSpacing + (Math.random() - 0.5) * 16;
      const sodHeightFactor = 0.75 + Math.random() * 0.5;

      // Layer 1: Deep Background Grass (dense, darker soil-tone undergrowth)
      const backBladesInClump = 7 + Math.floor(Math.random() * 6);
      for (let b = 0; b < backBladesInClump; b++) {
        const lean = (Math.random() - 0.5) * 28;
        const h = (35 + Math.random() * 45) * sodHeightFactor;
        this.backGrass.push(this.createBlade(
          clumpX + (Math.random() - 0.5) * 22,
          this.height,
          h,
          lean,
          1.8 + Math.random() * 1.4,
          '#0f170c',
          '#1f3016',
          '#385025',
          0.02 + Math.random() * 0.012,
          false,
          'none'
        ));
      }

      // Layer 2: Midground Field Grass (varied heights, dry straw blades, clover, yellow wildflowers & wheat)
      const midBladesInClump = 8 + Math.floor(Math.random() * 7);
      for (let b = 0; b < midBladesInClump; b++) {
        const lean = (Math.random() - 0.5) * 32;
        const h = (55 + Math.random() * 65) * sodHeightFactor;
        const isDry = Math.random() < 0.18;

        let rootCol = '#131e0f';
        let midCol = isDry ? '#6d5a36' : '#3f6226';
        let tipCol = isDry ? '#a8905a' : '#7cb745';

        // Wildflower or wheat seed head in midground
        let flowerType = 'none';
        const flowerRoll = Math.random();
        if (flowerRoll < 0.05) {
          flowerType = 'clover'; // purple/pink clover blossom
        } else if (flowerRoll < 0.09) {
          flowerType = 'yellow'; // delicate yellow wildflower
        } else if (flowerRoll < 0.13) {
          flowerType = 'wheat'; // nodding wild wheat head
        }

        this.midGrass.push(this.createBlade(
          clumpX + (Math.random() - 0.5) * 28,
          this.height,
          h,
          lean,
          2.2 + Math.random() * 1.6,
          rootCol,
          midCol,
          tipCol,
          0.024 + Math.random() * 0.015,
          Math.random() < 0.35,
          flowerType
        ));
      }

      // Layer 3: Foreground Hero Grass (tall, tapered blades, specular spine, daisies, yellow blooms & clovers)
      const frontBladesInClump = 6 + Math.floor(Math.random() * 5);
      for (let b = 0; b < frontBladesInClump; b++) {
        const lean = (Math.random() - 0.5) * 36;
        const h = (75 + Math.random() * 70) * sodHeightFactor;
        const isDry = Math.random() < 0.12;

        let rootCol = '#162312';
        let midCol = isDry ? '#756338' : '#4d762e';
        let tipCol = isDry ? '#b89d5f' : '#9edd56';

        let flowerType = 'none';
        const flowerRoll = Math.random();
        if (flowerRoll < 0.09) {
          flowerType = 'daisy'; // multi-petaled wild chamomile daisy
        } else if (flowerRoll < 0.14) {
          flowerType = 'yellow'; // delicate yellow wildflower
        } else if (flowerRoll < 0.18) {
          flowerType = 'clover'; // purple/pink clover
        }

        this.frontGrass.push(this.createBlade(
          clumpX + (Math.random() - 0.5) * 30,
          this.height,
          h,
          lean,
          2.6 + Math.random() * 1.8,
          rootCol,
          midCol,
          tipCol,
          0.027 + Math.random() * 0.016,
          true,
          flowerType
        ));
      }
    }
  }

  createBlade(x, baseY, height, lean, baseWidth, rootColor, midColor, tipColor, speed, hasSpine, flowerType) {
    return {
      x: x,
      baseY: baseY,
      height: height,
      lean: lean,
      baseWidth: baseWidth,
      rootColor: rootColor,
      midColor: midColor,
      tipColor: tipColor,
      speed: speed,
      phase: Math.random() * Math.PI * 2,
      stiffness: 0.65 + Math.random() * 0.5,
      hasSpine: hasSpine,
      spineColor: 'rgba(215, 245, 170, 0.32)',
      flowerType: flowerType,
      flowerSize: 4.8 + Math.random() * 2.5,
      flowerTilt: (Math.random() - 0.5) * 0.4
    };
  }

  /* Renders a photorealistic tapered blade with lighting gradients & highlights */
  drawBlade(ctx, g, windWave, isForeground = false) {
    const localSway = Math.sin(this.time * g.speed + g.phase + g.x * 0.012) * 8 * g.stiffness;
    let totalSway = (windWave * g.stiffness) + localSway + g.lean;

    if (isForeground) {
      const distToMouse = Math.hypot(this.mouse.x - g.x, this.mouse.y - (g.baseY - g.height * 0.65));
      if (distToMouse < 140) {
        const force = (1 - distToMouse / 140) * 30;
        totalSway += (g.x > this.mouse.x ? force : -force);
      }
    }

    const halfBase = g.baseWidth * 0.5;
    const halfMid = halfBase * 0.55;

    const tipX = g.x + totalSway;
    const tipY = g.baseY - g.height;
    const ctrlX = g.x + totalSway * 0.42;
    const ctrlY = g.baseY - g.height * 0.52;

    // 1. Tapered polygon blade geometry
    ctx.beginPath();
    ctx.moveTo(g.x - halfBase, g.baseY);
    ctx.quadraticCurveTo(ctrlX - halfMid, ctrlY, tipX, tipY);
    ctx.quadraticCurveTo(ctrlX + halfMid, ctrlY, g.x + halfBase, g.baseY);
    ctx.closePath();

    // 2. Linear sunlight gradient per blade
    const grad = ctx.createLinearGradient(g.x, g.baseY, tipX, tipY);
    grad.addColorStop(0, g.rootColor);
    grad.addColorStop(0.55, g.midColor);
    grad.addColorStop(1, g.tipColor);

    ctx.fillStyle = grad;
    ctx.fill();

    // 3. Central midrib spine highlight on hero foreground blades
    if (g.hasSpine && isForeground) {
      ctx.strokeStyle = g.spineColor;
      ctx.lineWidth = 0.65;
      ctx.beginPath();
      ctx.moveTo(g.x, g.baseY);
      ctx.quadraticCurveTo(ctrlX, ctrlY, tipX, tipY);
      ctx.stroke();
    }

    // 4. Botanical wildflowers and seed heads on blade tips
    if (g.flowerType === 'daisy') {
      this.drawRealisticDaisy(ctx, tipX, tipY, g.flowerSize, totalSway * 0.02 + g.flowerTilt);
    } else if (g.flowerType === 'yellow') {
      this.drawRealisticYellowFlower(ctx, tipX, tipY, g.flowerSize, totalSway * 0.02 + g.flowerTilt);
    } else if (g.flowerType === 'clover') {
      this.drawRealisticClover(ctx, tipX, tipY, g.flowerSize, totalSway * 0.02 + g.flowerTilt);
    } else if (g.flowerType === 'wheat') {
      this.drawRealisticWheat(ctx, tipX, tipY, g.flowerSize, totalSway * 0.02 + g.flowerTilt);
    }
  }

  /* Photorealistic Chamomile Daisy with 15 Slender Petals & Stippled Golden Disc */
  drawRealisticDaisy(ctx, x, y, size, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    ctx.fillStyle = '#263b18';
    ctx.beginPath();
    ctx.ellipse(0, 3, size * 0.42, size * 0.26, 0, 0, Math.PI * 2);
    ctx.fill();

    const petalCount = 15;
    const petalLen = size * 1.35;
    const petalW = size * 0.28;

    for (let p = 0; p < petalCount; p++) {
      const angle = (p / petalCount) * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      const px = cosA * petalLen * 0.68;
      const py = sinA * petalLen * 0.38;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);

      const pGrad = ctx.createLinearGradient(0, 0, 0, -petalLen * 0.65);
      pGrad.addColorStop(0, 'rgba(224, 230, 218, 0.92)');
      pGrad.addColorStop(0.35, 'rgba(246, 248, 242, 0.98)');
      pGrad.addColorStop(1, '#ffffff');

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, petalW, petalLen * 0.52, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    const discR = size * 0.48;
    const discGrad = ctx.createRadialGradient(-1, -1, 1, 0, 0, discR);
    discGrad.addColorStop(0, '#f5d14e');
    discGrad.addColorStop(0.65, '#d69424');
    discGrad.addColorStop(1, '#8c5912');

    ctx.fillStyle = discGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, discR, discR * 0.76, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(120, 75, 15, 0.45)';
    for (let d = 0; d < 7; d++) {
      const sx = Math.cos(d * 0.95) * discR * 0.48;
      const sy = Math.sin(d * 0.95) * discR * 0.36;
      ctx.fillRect(sx, sy, 1.2, 1.2);
    }

    ctx.restore();
  }

  /* Photorealistic Yellow Wildflower (Buttercup / Dandelion) matching 4K landscape */
  drawRealisticYellowFlower(ctx, x, y, size, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    ctx.fillStyle = '#2b401c';
    ctx.beginPath();
    ctx.ellipse(0, 2, size * 0.35, size * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    const petalCount = 8;
    const pLen = size * 1.05;
    const pW = size * 0.36;
    for (let p = 0; p < petalCount; p++) {
      const angle = (p / petalCount) * Math.PI * 2;
      const px = Math.cos(angle) * pLen * 0.6;
      const py = Math.sin(angle) * pLen * 0.38;

      ctx.save();
      ctx.translate(px, py);
      ctx.rotate(angle);

      const pGrad = ctx.createLinearGradient(0, 0, 0, -pLen * 0.5);
      pGrad.addColorStop(0, '#e5ad20');
      pGrad.addColorStop(0.5, '#f7cd34');
      pGrad.addColorStop(1, '#ffea6c');

      ctx.fillStyle = pGrad;
      ctx.beginPath();
      ctx.ellipse(0, 0, pW, pLen * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.fillStyle = '#cc8414';
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* Photorealistic Purple/Pink Clover Cluster matching 4K landscape */
  drawRealisticClover(ctx, x, y, size, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    ctx.fillStyle = '#283c1a';
    ctx.beginPath();
    ctx.ellipse(0, 3, size * 0.38, size * 0.22, 0, 0, Math.PI * 2);
    ctx.fill();

    const floretColors = ['#d46f97', '#e89bbd', '#ab4570', '#bd5682', '#9c3868'];
    const count = 18;
    for (let f = 0; f < count; f++) {
      const fx = (Math.sin(f * 1.8) * size * 0.42);
      const fy = -(f / count) * size * 1.25 + (Math.cos(f * 2.2) * 1.5);
      const color = floretColors[f % floretColors.length];

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(fx, fy, size * 0.2, size * 0.34, (f % 2 === 0 ? 0.3 : -0.3), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  /* Photorealistic Wild Wheat / Foxtail Grass Spike */
  drawRealisticWheat(ctx, x, y, size, tilt) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(tilt);

    const grains = 6;
    for (let g = 0; g < grains; g++) {
      const gy = -g * 4.2;
      const side = (g % 2 === 0) ? 1 : -1;

      ctx.fillStyle = '#8ea858';
      ctx.beginPath();
      ctx.ellipse(side * 2.2, gy, 1.7, 3.8, side * 0.32, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(195, 220, 150, 0.6)';
      ctx.lineWidth = 0.6;
      ctx.beginPath();
      ctx.moveTo(side * 2.2, gy - 1.5);
      ctx.lineTo(side * 7, gy - 6.5);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* Ambient Ground Shadow Occlusion */
  drawGroundOcclusion() {
    const ctx = this.ctx;
    const groundH = 45;
    const grad = ctx.createLinearGradient(0, this.height - groundH, 0, this.height);
    grad.addColorStop(0, 'rgba(6, 10, 6, 0)');
    grad.addColorStop(0.65, 'rgba(6, 10, 6, 0.45)');
    grad.addColorStop(1, 'rgba(4, 7, 4, 0.75)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, this.height - groundH, this.width, groundH);
  }

  /* ==========================================================================
     MAIN ANIMATION LOOP (60 FPS)
     ========================================================================== */
  animate() {
    this.time++;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Radiant sunbeams aligned with 4K sky break
    this.drawSunbeams();

    // 2. Volumetric moving clouds
    this.updateClouds();
    this.drawClouds();

    // 3. Birds soaring across the sky
    this.updateBirds();
    this.drawBirds();

    // 4. Drifting tree leaves
    this.updateLeaves();
    this.drawLeaves();

    // 5. Sunlit pollen & floating spores
    this.updateSpores();
    this.drawSpores();

    // Global wind wave formula for the entire field
    const windWave = Math.sin(this.time * 0.032) * 12
                   + Math.cos(this.time * 0.018 + 1) * 7
                   + Math.sin(this.time * 0.065) * 3;

    // 6. Deep background grass layer
    for (let i = 0; i < this.backGrass.length; i++) {
      this.drawBlade(this.ctx, this.backGrass[i], windWave, false);
    }

    // 7. Midground grass layer (varied heights, dry straw blades, yellow wildflowers, clover & wheat)
    for (let i = 0; i < this.midGrass.length; i++) {
      this.drawBlade(this.ctx, this.midGrass[i], windWave, false);
    }

    // 8. Foreground hero grass layer (tapered blades, highlights, daisies, yellow buttercups, clovers)
    for (let i = 0; i < this.frontGrass.length; i++) {
      this.drawBlade(this.ctx, this.frontGrass[i], windWave, true);
    }

    // 9. Ambient moist earth ground occlusion
    this.drawGroundOcclusion();

    requestAnimationFrame(() => this.animate());
  }
}

window.TLOUAtmosphere = TLOUAtmosphere;
