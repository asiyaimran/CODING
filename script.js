// State Variables
let currentStep = '1';
const bgMusic = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let isMusicPlaying = false;

// Initialize on Load
document.addEventListener('DOMContentLoaded', () => {
  createFloatingHearts();
  setupAudio();
});

// Create Floating Background Hearts
function createFloatingHearts() {
  const container = document.getElementById('heartsContainer');
  const heartIcons = ['💖', '💕', '💗', '💓', '❤️', '🌸', '✨'];

  for (let i = 0; i < 25; i++) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerText = heartIcons[Math.floor(Math.random() * heartIcons.length)];
    
    // Random positioning & sizing
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.animationDuration = `${6 + Math.random() * 6}s`;
    heart.style.animationDelay = `${Math.random() * 5}s`;
    heart.style.fontSize = `${14 + Math.random() * 20}px`;

    container.appendChild(heart);
  }
}

// Audio Toggle Handling
function setupAudio() {
  if (!musicToggle) return;
  musicToggle.addEventListener('click', () => {
    if (isMusicPlaying) {
      bgMusic.pause();
      musicToggle.classList.remove('playing');
      musicToggle.innerHTML = '<i class="fa-solid fa-music"></i><span class="music-pulse"></span>';
      isMusicPlaying = false;
    } else {
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i><span class="music-pulse"></span>';
        isMusicPlaying = true;
      }).catch(err => {
        console.log('Audio autoplay prevented by browser:', err);
      });
    }
  });
}

// Navigation between steps
function goToStep(stepId) {
  const currentCard = document.querySelector('.step-card.active');
  const targetCardId = (typeof stepId === 'number' || stepId === '1' || stepId === '2' || stepId === '3') 
    ? `step${stepId}` 
    : `step${stepId}`;
  
  const nextCard = document.getElementById(targetCardId);

  if (currentCard) {
    currentCard.classList.remove('active');
  }

  setTimeout(() => {
    if (nextCard) {
      nextCard.classList.add('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    if (stepId === 3 || stepId === '3') {
      triggerFinaleConfetti();
    }
  }, 400);
}

// Check Secret Password ("alpha")
function checkSecret() {
  const input = document.getElementById('secretInput');
  const errorMsg = document.getElementById('errorMsg');
  const lockBox = document.getElementById('lockBox');
  const envelopeWrapper = document.getElementById('envelopeWrapper');

  const userWord = input.value.trim().toLowerCase();

  // User must type "alpha" (case insensitive)
  if (userWord === 'alpha') {
    errorMsg.style.display = 'none';
    
    // Auto start audio if available
    if (!isMusicPlaying && bgMusic) {
      bgMusic.play().then(() => {
        musicToggle.classList.add('playing');
        musicToggle.innerHTML = '<i class="fa-solid fa-pause"></i><span class="music-pulse"></span>';
        isMusicPlaying = true;
      }).catch(() => {});
    }

    // Hide lock box smoothly
    lockBox.style.opacity = '0';
    lockBox.style.transform = 'scale(0.9)';

    setTimeout(() => {
      lockBox.style.display = 'none';
      envelopeWrapper.classList.remove('hidden');

      // Auto trigger open envelope effect after small delay
      setTimeout(() => {
        triggerOpenEffect();
      }, 500);
    }, 400);

  } else {
    // Show error & shake box
    errorMsg.style.display = 'flex';
    lockBox.classList.add('shake');
    
    setTimeout(() => {
      lockBox.classList.remove('shake');
    }, 500);
  }
}

// Trigger Envelope Open Animation & Confetti
function triggerOpenEffect() {
  const envelope = document.getElementById('envelope');
  const tapHint = document.getElementById('tapHint');

  if (!envelope.classList.contains('open')) {
    envelope.classList.add('open');
    if (tapHint) tapHint.style.display = 'none';

    // Launch Confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#c9184a', '#ffccd5', '#ffffff']
      });
    }

    // Automatically reveal full rectangle letter after envelope opens
    setTimeout(() => {
      goToStep('Letter');
    }, 1200);
  }
}

// Finale Confetti Blast
function triggerFinaleConfetti() {
  if (typeof confetti === 'function') {
    const count = 220;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ff4d6d', '#ffffff'] });
    fire(0.2, { spread: 60, colors: ['#c9184a', '#ffccd5'] });
    fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
    fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, colors: ['#e63946', '#ff4d6d'] });
  }
}

// Restart Experience
function restartExperience() {
  const envelope = document.getElementById('envelope');
  const lockBox = document.getElementById('lockBox');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const secretInput = document.getElementById('secretInput');

  if (envelope) envelope.classList.remove('open');
  if (secretInput) secretInput.value = '';
  
  if (lockBox) {
    lockBox.style.display = 'block';
    lockBox.style.opacity = '1';
    lockBox.style.transform = 'scale(1)';
  }
  
  if (envelopeWrapper) envelopeWrapper.classList.add('hidden');

  goToStep('1');
}