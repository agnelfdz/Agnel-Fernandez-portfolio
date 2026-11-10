/**
 * Atmospheric Sound Engine
 * Procedural acoustic guitar plucks & warm harmonics via Web Audio API.
 * 100% procedurally synthesized - zero external audio files.
 */

class NatureAudio {
  constructor() {
    this.ctx = null;
    this.enabled = false;
    this.volume = 0.25;
    this.initDone = false;
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
      this.playHarmonic();
    }
    return this.enabled;
  }

  // Gentle acoustic string pluck
  playPluck(note = 220) {
    if (!this.enabled || !this.ctx) return;
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note, now);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.4);

      gain.gain.setValueAtTime(this.volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.55);
    } catch (e) {}
  }

  // Soft tactile click on link hover
  playHover() {
    if (!this.enabled || !this.ctx) return;
    try {
      this.ensureContext();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(260, now + 0.035);

      gain.gain.setValueAtTime(this.volume * 0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {}
  }

  // Acoustic harmonic chord on sound activation
  playHarmonic() {
    if (!this.ctx) return;
    try {
      const notes = [196, 246.94, 293.66, 392];
      notes.forEach((freq, idx) => {
        setTimeout(() => this.playPluck(freq), idx * 100);
      });
    } catch (e) {}
  }
}

window.natureAudio = new NatureAudio();
