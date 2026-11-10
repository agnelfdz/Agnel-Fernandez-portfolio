/**
 * Cyberpunk 2077 // Living Atmospheric Canvas Engine
 * Renders high-tech futuristic city atmosphere:
 * 1. Flying Aerodynes (AVs) with glowing neon light trails cutting across skyways
 * 2. Neon digital rain & atmospheric mist reflecting cyan & magenta light
 * 3. Luminescent cyber data packets & floating holographic motes
 * 4. Periodic holographic scanline sweep across the viewport
 * 5. Interactive cursor cyber-pulse reactor
 */

class CyberAtmosphere {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.time = 0;
    this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 };

    this.avs = [];            // Flying Aerodynes / vehicles
    this.rainDrops = [];      // Neon city drizzle
    this.cyberParticles = []; // Floating data motes
    this.scanlineY = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => {
      this.resize();
      this.initRain();
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

    this.initAVs();
    this.initRain();
    this.initParticles();

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  /* ==========================================================================
     1. FLYING VEHICLES (AERODYNES / AVs)
     ========================================================================== */
  initAVs() {
    this.avs = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      this.avs.push(this.newAV(true));
    }
  }

  newAV(randomX = false) {
    const dir = Math.random() < 0.6 ? 1 : -1; // 1: left-to-right, -1: right-to-left
    const depth = 0.5 + Math.random() * 0.9;  // scale & speed multiplier
    const speed = (1.2 + Math.random() * 1.8) * depth * dir;
    const isEmergency = Math.random() < 0.25; // trauma-team / police vehicle

    // Color schemes: classic cyan/red or trauma-team magenta/yellow
    const headColor = isEmergency ? '#00f0ff' : '#00f0ff';
    const tailColor = isEmergency ? '#ff0055' : (Math.random() < 0.5 ? '#ff2a6d' : '#fcee0a');

    return {
      x: randomX ? Math.random() * this.width : (dir > 0 ? -120 : this.width + 120),
      y: 40 + Math.random() * (this.height * 0.52), // cruising upper-mid skyscraper canyon
      speed: speed,
      dir: dir,
      depth: depth,
      length: (22 + Math.random() * 18) * depth,
      height: (4 + Math.random() * 3) * depth,
      headColor: headColor,
      tailColor: tailColor,
      trail: [],
      maxTrail: Math.floor(18 * depth),
      bobPhase: Math.random() * Math.PI * 2
    };
  }

  updateAVs() {
    for (let i = 0; i < this.avs.length; i++) {
      const v = this.avs[i];
      v.x += v.speed;
      v.y += Math.sin(this.time * 0.03 + v.bobPhase) * 0.25;

      // Add to light streak trail
      v.trail.unshift({ x: v.x, y: v.y });
      if (v.trail.length > v.maxTrail) {
        v.trail.pop();
      }

      // Reset when flown across the screen
      if (v.dir > 0 && v.x > this.width + 140) {
        this.avs[i] = this.newAV(false);
      } else if (v.dir < 0 && v.x < -140) {
        this.avs[i] = this.newAV(false);
      }
    }
  }

  drawAVs() {
    const ctx = this.ctx;

    for (let i = 0; i < this.avs.length; i++) {
      const v = this.avs[i];
      ctx.save();

      // 1. Draw glowing neon engine light trail
      if (v.trail.length > 2) {
        ctx.beginPath();
        ctx.moveTo(v.trail[0].x - v.dir * v.length * 0.5, v.trail[0].y);

        for (let t = 1; t < v.trail.length; t++) {
          const pt = v.trail[t];
          ctx.lineTo(pt.x - v.dir * v.length * 0.5, pt.y);
        }

        ctx.strokeStyle = v.tailColor;
        ctx.lineWidth = v.height * 0.9;
        ctx.lineCap = 'round';
        ctx.shadowColor = v.tailColor;
        ctx.shadowBlur = 10 * v.depth;
        ctx.globalAlpha = 0.65;
        ctx.stroke();
      }

      // 2. Draw Aerodyne vehicle chassis
      ctx.globalAlpha = 0.95;
      ctx.fillStyle = '#060a12';
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
      ctx.lineWidth = 1;

      const noseX = v.x + v.dir * v.length * 0.5;
      const tailX = v.x - v.dir * v.length * 0.5;

      ctx.beginPath();
      ctx.moveTo(noseX, v.y);
      ctx.lineTo(v.x + v.dir * v.length * 0.2, v.y - v.height * 0.7);
      ctx.lineTo(tailX, v.y - v.height * 0.5);
      ctx.lineTo(tailX, v.y + v.height * 0.5);
      ctx.lineTo(v.x + v.dir * v.length * 0.2, v.y + v.height * 0.7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 3. Headlight beam
      ctx.fillStyle = v.headColor;
      ctx.shadowColor = v.headColor;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(noseX, v.y, 1.8 * v.depth, 0, Math.PI * 2);
      ctx.fill();

      // 4. Taillight thruster
      ctx.fillStyle = v.tailColor;
      ctx.shadowColor = v.tailColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(tailX, v.y, 2.2 * v.depth, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     2. NEON CITY DRIZZLE & ATMOSPHERIC MIST
     ========================================================================== */
  initRain() {
    this.rainDrops = [];
    const count = Math.min(120, Math.floor(this.width / 14));
    for (let i = 0; i < count; i++) {
      this.rainDrops.push(this.newRainDrop(true));
    }
  }

  newRainDrop(randomY = false) {
    const isCyan = Math.random() < 0.65;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      len: 12 + Math.random() * 24,
      speed: 14 + Math.random() * 10,
      color: isCyan ? 'rgba(0, 240, 255, 0.45)' : 'rgba(255, 0, 100, 0.4)',
      width: 0.8 + Math.random() * 0.6
    };
  }

  updateRain() {
    for (let i = 0; i < this.rainDrops.length; i++) {
      const r = this.rainDrops[i];
      r.y += r.speed;
      r.x -= 2.2; // slight wind slant

      if (r.y > this.height + 30 || r.x < -20) {
        this.rainDrops[i] = this.newRainDrop(false);
      }
    }
  }

  drawRain() {
    const ctx = this.ctx;
    ctx.save();
    for (let i = 0; i < this.rainDrops.length; i++) {
      const r = this.rainDrops[i];
      ctx.strokeStyle = r.color;
      ctx.lineWidth = r.width;
      ctx.beginPath();
      ctx.moveTo(r.x, r.y);
      ctx.lineTo(r.x - 3, r.y + r.len);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ==========================================================================
     3. FLOATING DIGITAL PARTICLES & HOLOGRAPHIC MOTES
     ========================================================================== */
  initParticles() {
    this.cyberParticles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      this.cyberParticles.push(this.newParticle(true));
    }
  }

  newParticle(randomY = false) {
    const type = Math.random();
    let color = '#00f0ff';
    if (type < 0.4) color = '#00f0ff';       // cyan
    else if (type < 0.75) color = '#ff0055'; // magenta
    else color = '#fcee0a';                  // cyberpunk yellow

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 15,
      size: 1.2 + Math.random() * 1.8,
      color: color,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 0.7), // float upward
      alpha: 0.25 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.04 + Math.random() * 0.03
    };
  }

  updateParticles() {
    for (let i = 0; i < this.cyberParticles.length; i++) {
      const p = this.cyberParticles[i];
      p.pulse += p.pulseSpeed;
      p.x += p.vx + Math.sin(p.pulse) * 0.35;
      p.y += p.vy;

      if (p.y < -15 || p.x < -15 || p.x > this.width + 15) {
        this.cyberParticles[i] = this.newParticle(false);
      }
    }
  }

  drawParticles() {
    const ctx = this.ctx;
    for (let i = 0; i < this.cyberParticles.length; i++) {
      const p = this.cyberParticles[i];
      const curAlpha = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

      ctx.save();
      ctx.globalAlpha = Math.max(0.1, curAlpha);
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;

      ctx.beginPath();
      // Tech-diamond or circular micro-pixel
      if (p.size > 2) {
        ctx.rect(p.x, p.y, p.size, p.size);
      } else {
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      }
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     4. HOLOGRAPHIC SCANLINE BEAM
     ========================================================================== */
  drawScanline() {
    this.scanlineY += 1.8;
    if (this.scanlineY > this.height) {
      this.scanlineY = 0;
    }

    const ctx = this.ctx;
    ctx.save();

    const grad = ctx.createLinearGradient(0, this.scanlineY - 25, 0, this.scanlineY + 25);
    grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
    grad.addColorStop(0.5, 'rgba(0, 240, 255, 0.06)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, this.scanlineY - 25, this.width, 50);

    // Ultra-thin neon tracer line
    ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.scanlineY);
    ctx.lineTo(this.width, this.scanlineY);
    ctx.stroke();

    ctx.restore();
  }

  /* ==========================================================================
     5. INTERACTIVE CURSOR CYBER PULSE
     ========================================================================== */
  drawCursorPulse() {
    if (this.mouse.x < 0) return;
    const ctx = this.ctx;
    ctx.save();

    const grad = ctx.createRadialGradient(
      this.mouse.x, this.mouse.y, 5,
      this.mouse.x, this.mouse.y, 90
    );
    grad.addColorStop(0, 'rgba(0, 240, 255, 0.12)');
    grad.addColorStop(0.5, 'rgba(255, 0, 85, 0.05)');
    grad.addColorStop(1, 'rgba(0, 240, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.mouse.x, this.mouse.y, 90, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /* ==========================================================================
     MAIN ANIMATION LOOP (60 FPS)
     ========================================================================== */
  animate() {
    this.time++;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // 1. Neon city rain streaks
    this.updateRain();
    this.drawRain();

    // 2. Flying Aerodynes (AVs) with light trails
    this.updateAVs();
    this.drawAVs();

    // 3. Floating cyber particles
    this.updateParticles();
    this.drawParticles();

    // 4. Holographic scanline beam sweep
    this.drawScanline();

    // 5. Interactive cursor glow
    this.drawCursorPulse();

    requestAnimationFrame(() => this.animate());
  }
}

window.CyberAtmosphere = CyberAtmosphere;
