/**
 * Cyberpunk 2077 // Main Application Orchestrator
 * Controls HUD interface, Cyber Atmosphere Canvas, Audio SFX, Reticle Cursor & 3D Card Tilt
 * For Agnel Fernandez - Technical Support Engineer & 3D Artist
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Living Cyberpunk Atmosphere Canvas (Flying AVs, drones, searchlights, rain, lightning)
  if (document.getElementById('atmosphere-canvas') && window.CyberAtmosphere) {
    new window.CyberAtmosphere('atmosphere-canvas');
  }

  // 2. Cyberpunk Audio Engine Toggle & Blade Runner Ambient Drone
  const audioBtn = document.getElementById('audio-toggle');
  const eqBars = document.querySelectorAll('.eq-bar');
  let eqInterval = null;

  if (audioBtn && window.cyberAudio) {
    audioBtn.addEventListener('click', () => {
      const active = window.cyberAudio.toggle();
      audioBtn.classList.toggle('active', active);
      const label = audioBtn.querySelector('.audio-label');
      if (label) {
        label.textContent = active ? 'AUDIO: ON' : 'AUDIO: OFF';
      }

      // Animate equalizer frequency visualizer bars
      if (active) {
        if (!eqInterval) {
          eqInterval = setInterval(() => {
            eqBars.forEach(bar => {
              const h = Math.floor(Math.random() * 85) + 15;
              bar.style.height = `${h}%`;
            });
          }, 120);
        }
      } else {
        if (eqInterval) {
          clearInterval(eqInterval);
          eqInterval = null;
        }
        eqBars.forEach((bar, i) => {
          bar.style.height = `${(i % 3 + 1) * 30}%`;
        });
      }
    });
  }

  // 3. Tactile Futuristic Sound Triggers on Interactive Elements
  const interactives = document.querySelectorAll('a, button, input, textarea');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (window.cyberAudio) window.cyberAudio.playHover();
    });
    el.addEventListener('click', () => {
      if (window.cyberAudio) window.cyberAudio.playClick();
    });
  });

  // 4. Custom Futuristic Cyber Reticle Cursor with Live Coordinates
  const reticle = document.getElementById('cyber-reticle');
  const rx = document.getElementById('reticle-x');
  const ry = document.getElementById('reticle-y');
  if (reticle && rx && ry) {
    window.addEventListener('mousemove', (e) => {
      reticle.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      rx.textContent = e.clientX;
      ry.textContent = e.clientY;
    });

    interactives.forEach(el => {
      el.addEventListener('mouseenter', () => reticle.classList.add('active'));
      el.addEventListener('mouseleave', () => reticle.classList.remove('active'));
    });
  }

  // 5. Interactive 3D Card Parallax / Tilt Physics
  const tiltCards = document.querySelectorAll(
    '.hero-field-profile, .journal-card, .exp-card, .skills-journal-box, ' +
    '.language-card, .tools-card, .edu-journal-card, .artstation-spotlight-card, ' +
    '.contact-info-card, .contact-form-card, .focus-card'
  );

  tiltCards.forEach(card => {
    card.classList.add('has-3d-tilt');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      const rotX = -(y / (rect.height / 2)) * 4.2;
      const rotY = (x / (rect.width / 2)) * 4.2;
      card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });

  // 6. Mobile Navigation Menu Toggle
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

  // 7. Encrypted Transmission Contact Form Handler
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

  // 8. Live Cyberpunk Telemetry Clock in Footer (Local & IST)
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
