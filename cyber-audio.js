/**
 * Cyberpunk 2077 // Procedural Web Audio API Sound Engine
 * Synthesizes high-tech sci-fi HUD audio effects:
 * - Blade Runner Cinematic Ambient Night City Drone
 * - Cyber Boot Sequence (Dual-oscillator CS-80 style synth chord)
 * - Tactile HUD Hover Chirp (High-frequency cyber click)
 * - Interactive Select / Decrypt (Frequency modulated pulse)
 * - Encrypted Transmission (Data burst on form submit)
 */

class CyberAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.volume = 0.22;
    this.initDone = false;
    this.ambientNodes = null;
  }

  init() {
    if (this.initDone) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initDone = true;
      }
    } catch (e) {
      console.warn("AudioContext not supported", e);
    }
  }

  ensureContext() {
    if (!this.initDone) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.ensureContext();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playBoot();
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }
    return this.enabled;
  }

  // Blade Runner / Cyberpunk 2077 synth chord on audio boot
  playBoot() {
    if (!this.ctx) return;
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      const notes = [130.81, 196.00, 261.63, 392.00]; // C3, G3, C4, G4

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.35);
        filter.frequency.exponentialRampToValueAtTime(600, now + 1.2);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.exponentialRampToValueAtTime(this.volume * 0.25, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.3);
      });
    } catch (e) {}
  }

  // Low-frequency atmospheric cyberpunk ambient synth drone
  startAmbientDrone() {
    if (!this.ctx || this.ambientNodes) return;
    try {
      const now = this.ctx.currentTime;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Deep sub-harmonics
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(65.41, now); // C2
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(65.8, now); // slight detune beat frequency

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(this.volume * 0.08, now + 2); // very soft warm bed

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);

      this.ambientNodes = { osc1, osc2, gain };
    } catch (e) {}
  }

  stopAmbientDrone() {
    if (!this.ambientNodes || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      this.ambientNodes.gain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      setTimeout(() => {
        if (this.ambientNodes) {
          try {
            this.ambientNodes.osc1.stop();
            this.ambientNodes.osc2.stop();
          } catch (e) {}
          this.ambientNodes = null;
        }
      }, 850);
    } catch (e) {
      this.ambientNodes = null;
    }
  }

  // Futuristic tactile chirp on hovering buttons/links
  playHover() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(2200, now + 0.025);

      gain.gain.setValueAtTime(this.volume * 0.09, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {}
  }

  // Tactile click on button select
  playClick() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.04);

      gain.gain.setValueAtTime(this.volume * 0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    } catch (e) {}
  }

  // Cyber data packet transmission burst
  playTransmit() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;

      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const timeOffset = now + i * 0.07;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800 + i * 350, timeOffset);

        gain.gain.setValueAtTime(this.volume * 0.14, timeOffset);
        gain.gain.exponentialRampToValueAtTime(0.001, timeOffset + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(timeOffset);
        osc.stop(timeOffset + 0.055);
      }
    } catch (e) {}
  }
}

window.cyberAudio = new CyberAudio();
