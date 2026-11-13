/**
 * Cyberpunk 2077 // Enhanced Living Atmospheric Canvas Engine
 * Renders high-fidelity futuristic Night City environment:
 * 1. Multi-tier Flying Aerodynes (Corporate Shuttles, Heavy Cargo, Trauma-Team AVs)
 *    with glowing plasma exhaust trails, particle embers, and anti-collision strobes
 * 2. Hovering Surveillance Drones with scanning volumetric downward searchlights
 * 3. Sweeping Rooftop Megatower Searchlights cutting through the volumetric night fog
 * 4. Atmospheric Storm Lightning Sheet Flashes illuminating building silhouettes
 * 5. Neon City Drizzle with ground micro-splash ripple physics
 * 6. Floating Cyber Data Motes & Luminescent Holographic Nanites
 * 7. CRT Holographic Scanline Sweep & Interactive Cursor Pulse
 */

class CyberAtmosphere {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');

    this.time = 0;
    this.mouse = { x: -1000, y: -1000, vx: 0, vy: 0, lastX: -1000, lastY: -1000 };

    this.avs = [];            // Flying Aerodynes / vehicles
    this.drones = [];         // Hovering surveillance drones
    this.searchlights = [];   // Rooftop sweeping searchlights
    this.rainDrops = [];      // Neon city drizzle
    this.splashes = [];       // Rain impact ripples
    this.cyberParticles = []; // Floating data motes
    this.exhaustEmbers = [];  // AV engine particle sparks
    this.lightningTimer = 0;
    this.lightningAlpha = 0;
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
    this.initDrones();
    this.initSearchlights();
    this.initRain();
    this.initParticles();

    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  /* ==========================================================================
     1. ROOFTOP VOLUMETRIC SEARCHLIGHTS (Blade Runner 2049 Style)
     ========================================================================== */
  initSearchlights() {
    this.searchlights = [
      {
        baseX: this.width * 0.18,
        baseY: this.height * 0.42,
        angle: -0.4,
        speed: 0.007,
        range: 0.45,
        beamLen: Math.max(this.width, this.height) * 0.85,
        beamWidth: 55,
        color: 'rgba(0, 240, 255, 0.08)'
      },
      {
        baseX: this.width * 0.82,
        baseY: this.height * 0.38,
        angle: 0.3,
        speed: -0.006,
        range: 0.5,
        beamLen: Math.max(this.width, this.height) * 0.9,
        beamWidth: 65,
        color: 'rgba(255, 0, 85, 0.06)'
      }
    ];
  }

  updateSearchlights() {
    for (let i = 0; i < this.searchlights.length; i++) {
      const s = this.searchlights[i];
      // Adapt base coordinates if resized
      s.baseX = i === 0 ? this.width * 0.18 : this.width * 0.82;
      s.baseY = i === 0 ? this.height * 0.42 : this.height * 0.38;
      s.angle += s.speed;
      if (Math.abs(s.angle) > s.range) {
        s.speed = -s.speed;
      }
    }
  }

  drawSearchlights() {
    const ctx = this.ctx;
    for (let i = 0; i < this.searchlights.length; i++) {
      const s = this.searchlights[i];
      ctx.save();
      ctx.translate(s.baseX, s.baseY);
      ctx.rotate(s.angle - Math.PI / 2);

      const grad = ctx.createLinearGradient(0, 0, 0, s.beamLen);
      grad.addColorStop(0, s.color);
      grad.addColorStop(0.3, s.color);
      grad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(4, 0);
      ctx.lineTo(s.beamWidth * 0.8, s.beamLen);
      ctx.lineTo(-s.beamWidth * 0.8, s.beamLen);
      ctx.closePath();
      ctx.fill();

      // Spotlight emitter bulb glow
      ctx.fillStyle = '#00f0ff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     2. SURVEILLANCE DRONES (Hovering with Scanning Searchlight Cones)
     ========================================================================== */
  initDrones() {
    this.drones = [];
    const count = 3;
    for (let i = 0; i < count; i++) {
      this.drones.push({
        x: this.width * (0.25 + i * 0.26) + (Math.random() - 0.5) * 80,
        y: this.height * 0.25 + (Math.random() - 0.5) * 60,
        originX: this.width * (0.25 + i * 0.26),
        originY: this.height * 0.25,
        hoverSpeed: 0.02 + Math.random() * 0.02,
        hoverPhase: Math.random() * Math.PI * 2,
        scanAngle: 0,
        scanSpeed: 0.012 + Math.random() * 0.01,
        beamLen: 160 + Math.random() * 80,
        beamWidth: 40,
        color: i % 2 === 0 ? '#00f0ff' : '#ff0055'
      });
    }
  }

  updateDrones() {
    for (let i = 0; i < this.drones.length; i++) {
      const d = this.drones[i];
      d.hoverPhase += d.hoverSpeed;
      d.x = d.originX + Math.sin(d.hoverPhase * 0.7) * 45;
      d.y = d.originY + Math.cos(d.hoverPhase) * 20;

      d.scanAngle = Math.sin(d.hoverPhase * 0.8) * 0.35;
    }
  }

  drawDrones() {
    const ctx = this.ctx;
    for (let i = 0; i < this.drones.length; i++) {
      const d = this.drones[i];
      ctx.save();
      ctx.translate(d.x, d.y);

      // 1. Downward scanning volumetric spotlight cone
      ctx.save();
      ctx.rotate(d.scanAngle);
      const coneGrad = ctx.createLinearGradient(0, 0, 0, d.beamLen);
      coneGrad.addColorStop(0, d.color === '#00f0ff' ? 'rgba(0, 240, 255, 0.22)' : 'rgba(255, 0, 85, 0.2)');
      coneGrad.addColorStop(0.7, d.color === '#00f0ff' ? 'rgba(0, 240, 255, 0.05)' : 'rgba(255, 0, 85, 0.05)');
      coneGrad.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(-3, 0);
      ctx.lineTo(3, 0);
      ctx.lineTo(d.beamWidth, d.beamLen);
      ctx.lineTo(-d.beamWidth, d.beamLen);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 2. Drone chassis (high-tech quad shape)
      ctx.fillStyle = '#060a12';
      ctx.strokeStyle = d.color;
      ctx.lineWidth = 1.2;
      ctx.shadowColor = d.color;
      ctx.shadowBlur = 8;

      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Rotor arms
      ctx.beginPath();
      ctx.moveTo(-11, -3); ctx.lineTo(11, -3);
      ctx.moveTo(-11, 3);  ctx.lineTo(11, 3);
      ctx.stroke();

      // Pulsing center optic lens
      ctx.fillStyle = d.color;
      ctx.beginPath();
      ctx.arc(0, 0, 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  /* ==========================================================================
     3. MULTI-CLASS AERODYNES (AVs) WITH PLASMA EXHAUST & WINGTIP STROBES
     ========================================================================== */
  initAVs() {
    this.avs = [];
    const count = 7;
    for (let i = 0; i < count; i++) {
      this.avs.push(this.newAV(true));
    }
  }

  newAV(randomX = false) {
    const dir = Math.random() < 0.6 ? 1 : -1;
    const depth = 0.5 + Math.random() * 0.9;
    const speed = (1.3 + Math.random() * 1.8) * depth * dir;
    const isEmergency = Math.random() < 0.28; // Trauma Team or Police Gunship
    const isHeavyCargo = !isEmergency && Math.random() < 0.35; // Heavy Quad-Thruster

    const headColor = '#00f0ff';
    const tailColor = isEmergency ? '#ff0055' : (isHeavyCargo ? '#fcee0a' : '#00f0ff');

    return {
      x: randomX ? Math.random() * this.width : (dir > 0 ? -140 : this.width + 140),
      y: 45 + Math.random() * (this.height * 0.52),
      speed: speed,
      dir: dir,
      depth: depth,
      length: (24 + Math.random() * 22) * depth,
      height: (5 + Math.random() * 4) * depth,
      headColor: headColor,
      tailColor: tailColor,
      isEmergency: isEmergency,
      isHeavyCargo: isHeavyCargo,
      trail: [],
      maxTrail: Math.floor(22 * depth),
      bobPhase: Math.random() * Math.PI * 2,
      strobeTimer: Math.random() * 60
    };
  }

  updateAVs() {
    for (let i = 0; i < this.avs.length; i++) {
      const v = this.avs[i];
      v.x += v.speed;
      v.y += Math.sin(this.time * 0.03 + v.bobPhase) * 0.25;

      v.strobeTimer++;

      // Light streak trail history
      v.trail.unshift({ x: v.x, y: v.y });
      if (v.trail.length > v.maxTrail) {
        v.trail.pop();
      }

      // Spawn engine plasma ember sparks
      if (Math.random() < 0.4) {
        const tailX = v.x - v.dir * v.length * 0.5;
        this.exhaustEmbers.push({
          x: tailX,
          y: v.y + (Math.random() - 0.5) * 3,
          vx: -v.dir * (0.8 + Math.random() * 1.2),
          vy: (Math.random() - 0.5) * 0.6,
          life: 1,
          decay: 0.04 + Math.random() * 0.03,
          color: v.tailColor,
          size: 1.2 * v.depth
        });
      }

      if (v.dir > 0 && v.x > this.width + 160) {
        this.avs[i] = this.newAV(false);
      } else if (v.dir < 0 && v.x < -160) {
        this.avs[i] = this.newAV(false);
      }
    }

    // Update exhaust embers
    for (let j = this.exhaustEmbers.length - 1; j >= 0; j--) {
      const e = this.exhaustEmbers[j];
      e.x += e.vx;
      e.y += e.vy;
      e.life -= e.decay;
      if (e.life <= 0) {
        this.exhaustEmbers.splice(j, 1);
      }
    }
  }

  drawAVs() {
    const ctx = this.ctx;

    // 1. Draw glowing afterburner light trails
    for (let i = 0; i < this.avs.length; i++) {
      const v = this.avs[i];
      if (v.trail.length > 2) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(v.trail[0].x - v.dir * v.length * 0.5, v.trail[0].y);

        for (let t = 1; t < v.trail.length; t++) {
          const pt = v.trail[t];
          ctx.lineTo(pt.x - v.dir * v.length * 0.5, pt.y);
        }

        ctx.strokeStyle = v.tailColor;
        ctx.lineWidth = v.height * 1.1;
        ctx.lineCap = 'round';
        ctx.shadowColor = v.tailColor;
        ctx.shadowBlur = 12 * v.depth;
        ctx.globalAlpha = 0.7;
        ctx.stroke();
        ctx.restore();
      }
    }

    // 2. Draw plasma exhaust embers
    for (let j = 0; j < this.exhaustEmbers.length; j++) {
      const e = this.exhaustEmbers[j];
      ctx.save();
      ctx.globalAlpha = e.life * 0.8;
      ctx.fillStyle = e.color;
      ctx.shadowColor = e.color;
      ctx.shadowBlur = 6;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 3. Draw Aerodyne vehicle chassis
    for (let i = 0; i < this.avs.length; i++) {
      const v = this.avs[i];
      ctx.save();
      ctx.globalAlpha = 0.96;
      ctx.fillStyle = '#060a12';
      ctx.strokeStyle = v.isEmergency ? 'rgba(255, 0, 85, 0.6)' : 'rgba(0, 240, 255, 0.45)';
      ctx.lineWidth = 1;

      const noseX = v.x + v.dir * v.length * 0.5;
      const tailX = v.x - v.dir * v.length * 0.5;

      ctx.beginPath();
      ctx.moveTo(noseX, v.y);
      ctx.lineTo(v.x + v.dir * v.length * 0.25, v.y - v.height * 0.75);
      ctx.lineTo(tailX, v.y - v.height * 0.55);
      ctx.lineTo(tailX, v.y + v.height * 0.55);
      ctx.lineTo(v.x + v.dir * v.length * 0.25, v.y + v.height * 0.75);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Winglet / Stabilizer
      ctx.beginPath();
      ctx.moveTo(tailX, v.y - v.height * 0.55);
      ctx.lineTo(tailX - v.dir * 4 * v.depth, v.y - v.height * 1.2);
      ctx.lineTo(tailX + v.dir * 4 * v.depth, v.y - v.height * 0.55);
      ctx.stroke();

      // Headlight high-beam
      ctx.fillStyle = v.headColor;
      ctx.shadowColor = v.headColor;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(noseX, v.y, 2 * v.depth, 0, Math.PI * 2);
      ctx.fill();

      // Taillight thruster core
      ctx.fillStyle = v.tailColor;
      ctx.shadowColor = v.tailColor;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(tailX, v.y, 2.4 * v.depth, 0, Math.PI * 2);
      ctx.fill();

      // Wingtip Anti-Collision Strobe LED (Blinks intermittently)
      const strobeOn = Math.sin(v.strobeTimer * 0.2) > 0.85;
      if (strobeOn) {
        ctx.fillStyle = v.isEmergency ? '#ff0055' : '#ffffff';
        ctx.shadowColor = v.isEmergency ? '#ff0055' : '#ffffff';
        ctx.shadowBlur = 14;
        ctx.beginPath();
        ctx.arc(tailX, v.y - v.height * 1.2, 2.2 * v.depth, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  /* ==========================================================================
     4. ATMOSPHERIC STORM LIGHTNING SHEET FLASHES
     ========================================================================== */
  updateLightning() {
    this.lightningTimer++;
    // Occasional lightning burst every 300-500 frames
    if (this.lightningTimer > 380 && Math.random() < 0.02) {
      this.lightningAlpha = 0.25 + Math.random() * 0.2;
      this.lightningTimer = 0;
    }

    if (this.lightningAlpha > 0) {
      this.lightningAlpha -= 0.025;
      if (this.lightningAlpha < 0) this.lightningAlpha = 0;
    }
  }

  drawLightning() {
    if (this.lightningAlpha <= 0) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.globalAlpha = this.lightningAlpha;

    // Purple / Electric Cyan Sky Glow
    const grad = ctx.createLinearGradient(0, 0, 0, this.height * 0.6);
    grad.addColorStop(0, 'rgba(139, 37, 226, 0.45)');
    grad.addColorStop(0.4, 'rgba(0, 240, 255, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height * 0.6);
    ctx.restore();
  }

  /* ==========================================================================
     5. NEON CITY RAIN & GROUND SPLASH RIPPLES
     ========================================================================== */
  initRain() {
    this.rainDrops = [];
    const count = Math.min(130, Math.floor(this.width / 12));
    for (let i = 0; i < count; i++) {
      this.rainDrops.push(this.newRainDrop(true));
    }
  }

  newRainDrop(randomY = false) {
    const isCyan = Math.random() < 0.65;
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : -30,
      len: 14 + Math.random() * 26,
      speed: 15 + Math.random() * 11,
      color: isCyan ? 'rgba(0, 240, 255, 0.45)' : 'rgba(255, 0, 85, 0.4)',
      width: 0.8 + Math.random() * 0.6
    };
  }

  updateRain() {
    for (let i = 0; i < this.rainDrops.length; i++) {
      const r = this.rainDrops[i];
      r.y += r.speed;
      r.x -= 2.2;

      // When reaching near the bottom, trigger splash ripple
      if (r.y >= this.height - 35 && Math.random() < 0.3) {
        this.splashes.push({
          x: r.x,
          y: this.height - 15 + (Math.random() - 0.5) * 10,
          radius: 1,
          maxRadius: 6 + Math.random() * 6,
          alpha: 0.6,
          color: r.color
        });
      }

      if (r.y > this.height + 30 || r.x < -20) {
        this.rainDrops[i] = this.newRainDrop(false);
      }
    }

    // Update splash ripples
    for (let s = this.splashes.length - 1; s >= 0; s--) {
      const sp = this.splashes[s];
      sp.radius += 0.4;
      sp.alpha -= 0.04;
      if (sp.alpha <= 0) {
        this.splashes.splice(s, 1);
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

    // Draw ripples
    for (let s = 0; s < this.splashes.length; s++) {
      const sp = this.splashes[s];
      ctx.save();
      ctx.globalAlpha = Math.max(0, sp.alpha);
      ctx.strokeStyle = sp.color;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(sp.x, sp.y, sp.radius * 1.5, sp.radius * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  /* ==========================================================================
     6. FLOATING DIGITAL PARTICLES & HOLOGRAPHIC NANITES
     ========================================================================== */
  initParticles() {
    this.cyberParticles = [];
    const count = 48;
    for (let i = 0; i < count; i++) {
      this.cyberParticles.push(this.newParticle(true));
    }
  }

  newParticle(randomY = false) {
    const type = Math.random();
    let color = '#00f0ff';
    if (type < 0.42) color = '#00f0ff';      // cyan
    else if (type < 0.78) color = '#ff0055'; // magenta
    else color = '#fcee0a';                  // cyberpunk yellow

    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 15,
      size: 1.2 + Math.random() * 2,
      color: color,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(0.4 + Math.random() * 0.7),
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
     7. HOLOGRAPHIC SCANLINE BEAM & INTERACTIVE CURSOR PULSE
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

    ctx.strokeStyle = 'rgba(0, 240, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, this.scanlineY);
    ctx.lineTo(this.width, this.scanlineY);
    ctx.stroke();

    ctx.restore();
  }

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

    // 1. Storm lightning ambient flashes
    this.updateLightning();
    this.drawLightning();

    // 2. Rooftop volumetric searchlights
    this.updateSearchlights();
    this.drawSearchlights();

    // 3. Hovering surveillance drones with scanning cones
    this.updateDrones();
    this.drawDrones();

    // 4. Neon city drizzle & ground splashes
    this.updateRain();
    this.drawRain();

    // 5. Flying Aerodynes (AVs) with plasma trails & embers
    this.updateAVs();
    this.drawAVs();

    // 6. Floating cyber data particles
    this.updateParticles();
    this.drawParticles();

    // 7. Holographic scanline beam sweep
    this.drawScanline();

    // 8. Interactive cursor glow
    this.drawCursorPulse();

    requestAnimationFrame(() => this.animate());
  }
}

window.CyberAtmosphere = CyberAtmosphere;
