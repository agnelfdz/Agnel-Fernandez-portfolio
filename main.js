/**
 * Cyberpunk 2077 // Main Application Orchestrator
 * Controls HUD interface, Cyber Atmosphere Canvas, Audio SFX, and Telemetry
 * For Agnel Fernandez - Technical Support Engineer & 3D Artist
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Living Cyberpunk Atmosphere Canvas (Flying AVs, rain, cyber motes, scanlines)
  if (document.getElementById('atmosphere-canvas') && window.CyberAtmosphere) {
    new window.CyberAtmosphere('atmosphere-canvas');
  }

  // 2. Cyberpunk Audio Engine Toggle
  const audioBtn = document.getElementById('audio-toggle');
  if (audioBtn && window.cyberAudio) {
    audioBtn.addEventListener('click', () => {
      const active = window.cyberAudio.toggle();
      audioBtn.classList.toggle('active', active);
      const label = audioBtn.querySelector('.audio-label');
      if (label) {
        label.textContent = active ? 'AUDIO: ON' : 'AUDIO: OFF';
      }
    });
  }

  // Tactile futuristic sound triggers on interactive elements
  const interactives = document.querySelectorAll('a, button, input, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.cyberAudio) window.cyberAudio.playHover();
    });
    el.addEventListener('click', () => {
      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  });

  // 3. Mobile Navigation Menu Toggle
  const menuToggle = document.getElementById('mobile-menu-btn');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', open);
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 4. Encrypted Transmission Contact Form Handler
  const contactForm = document.getElementById('nature-contact-form');
  const statusMsg = document.getElementById('form-feedback');
  if (contactForm && statusMsg) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value;
      const email = contactForm.querySelector('[name="email"]').value;

      statusMsg.innerHTML = `<span class="feedback-sending">[TRANSMITTING_ENCRYPTED_PACKET...]</span>`;
      if (window.cyberAudio) window.cyberAudio.playTransmit();

      setTimeout(() => {
        statusMsg.innerHTML = `
          <div class="feedback-success">
            <strong>[TRANSMISSION_ACKNOWLEDGED]</strong><br>
            Payload received from <strong>${name}</strong> (&lt;${email}&gt;). Dispatch routed to Technical Support Engineer Agnel Fernandez. Response protocol initialized.
          </div>
        `;
        contactForm.reset();
      }, 850);
    });
  }

  // 5. Live Cyberpunk Telemetry Clock in Footer (Local & IST)
  const clock = document.getElementById('live-time');
  if (clock) {
    function updateClock() {
      const now = new Date();
      const ist = new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      const hours = String(ist.getUTCHours()).padStart(2, '0');
      const mins = String(ist.getUTCMinutes()).padStart(2, '0');
      const secs = String(ist.getUTCSeconds()).padStart(2, '0');
      clock.textContent = `[NET_TIME: IST ${hours}:${mins}:${secs}] // NODE: ERNAKULAM_SECTOR_07`;
    }
    updateClock();
    setInterval(updateClock, 1000);
  }
});
