const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");
let stars = [];

function resizeStars() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const count = Math.min(170, Math.floor(window.innerWidth * window.innerHeight / 7000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.4 + .15,
    a: Math.random() * .7 + .25,
    s: Math.random() * .012 + .003
  }));
}

function drawStars(time) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star, i) => {
    const pulse = star.a + Math.sin(time * star.s + i) * .18;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(225, 235, 248, ${Math.max(.08, pulse)})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

resizeStars();
window.addEventListener("resize", resizeStars);
requestAnimationFrame(drawStars);

document.getElementById("openLetter").addEventListener("click", () => {
  document.getElementById("letter").scrollIntoView({ behavior: "smooth" });
});

const hearts = [];
function createFloatingHeart() {
  if (document.hidden) return;
  const heart = document.createElement("span");
  heart.textContent = Math.random() > .5 ? "♡" : "✦";
  heart.style.cssText = `
    position: fixed;
    left: ${Math.random() * 100}vw;
    bottom: -30px;
    z-index: 8;
    color: rgba(219, 230, 242, ${Math.random() * .35 + .25});
    font-size: ${Math.random() * 12 + 12}px;
    pointer-events: none;
    transition: transform ${Math.random() * 5 + 7}s linear, opacity 8s ease;
  `;
  document.body.appendChild(heart);
  hearts.push(heart);
  requestAnimationFrame(() => {
    heart.style.transform = `translate(${(Math.random() - .5) * 160}px, -110vh) rotate(${Math.random() * 180}deg)`;
    heart.style.opacity = "0";
  });
  setTimeout(() => heart.remove(), 13000);
}
setInterval(createFloatingHeart, 1400);

// Gentle original ambient instrumental generated in the browser.
let audioContext;
let musicTimer;
let isPlaying = false;
let masterGain;

function startAmbientMusic() {
  audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
  masterGain = audioContext.createGain();
  masterGain.gain.value = .045;
  masterGain.connect(audioContext.destination);

  const notes = [261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66, 349.23];
  let step = 0;

  function playNote() {
    if (!isPlaying) return;
    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "sine";
    osc.frequency.value = notes[step % notes.length];
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.65, now + .8);
    gain.gain.exponentialRampToValueAtTime(.01, now + 3.8);
    osc.connect(gain);
    gain.connect(masterGain);
    osc.start(now);
    osc.stop(now + 4);
    step++;
  }

  playNote();
  musicTimer = setInterval(playNote, 2100);
}

function stopAmbientMusic() {
  isPlaying = false;
  clearInterval(musicTimer);
  if (audioContext && masterGain) {
    masterGain.gain.setTargetAtTime(0, audioContext.currentTime, .08);
  }
}

document.getElementById("musicToggle").addEventListener("click", async () => {
  const label = document.getElementById("musicLabel");
  if (!isPlaying) {
    isPlaying = true;
    if (!audioContext) startAmbientMusic();
    else {
      await audioContext.resume();
      masterGain.gain.setTargetAtTime(.045, audioContext.currentTime, .1);
      musicTimer = setInterval(() => {}, 2100);
      // Restart the actual melody sequence after resuming.
      clearInterval(musicTimer);
      startAmbientMusic();
    }
    label.textContent = "Pause music";
  } else {
    stopAmbientMusic();
    label.textContent = "Play music";
  }
});

const modal = document.getElementById("loveModal");
const noButton = document.getElementById("noButton");

noButton.addEventListener("click", () => {
  modal.classList.add("open");
});

document.getElementById("modalClose").addEventListener("click", () => {
  modal.classList.remove("open");
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.classList.remove("open");
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") modal.classList.remove("open");
});

document.getElementById("yesButton").addEventListener("click", () => {
  document.getElementById("answerMessage").textContent =
    "And I’ll keep choosing you, in this life and in every one after it.";
  for (let i = 0; i < 28; i++) setTimeout(createFloatingHeart, i * 45);
  openSurprise();
});

const surprise = document.getElementById("surprise");
const celebrationCanvas = document.getElementById("celebration");
const celebrationContext = celebrationCanvas.getContext("2d");
let celebrationParticles = [];
let celebrationFrame;

function resizeCelebration() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  celebrationCanvas.width = window.innerWidth * dpr;
  celebrationCanvas.height = window.innerHeight * dpr;
  celebrationCanvas.style.width = `${window.innerWidth}px`;
  celebrationCanvas.style.height = `${window.innerHeight}px`;
  celebrationContext.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function createCelebration() {
  resizeCelebration();
  celebrationParticles = Array.from({ length: 110 }, () => ({
    x: window.innerWidth * .5,
    y: window.innerHeight * .48,
    vx: (Math.random() - .5) * 11,
    vy: (Math.random() - .75) * 11,
    size: Math.random() * 5 + 2,
    life: 1,
    heart: Math.random() > .55
  }));

  function animate() {
    celebrationContext.clearRect(0, 0, window.innerWidth, window.innerHeight);
    celebrationParticles.forEach((particle) => {
      particle.vy += .09;
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= .008;
      celebrationContext.globalAlpha = Math.max(0, particle.life);
      if (particle.heart) {
        celebrationContext.fillStyle = "#dbe6f2";
        celebrationContext.font = `${particle.size * 3}px serif`;
        celebrationContext.fillText("♡", particle.x, particle.y);
      } else {
        celebrationContext.fillStyle = Math.random() > .5 ? "#ffffff" : "#91b0d3";
        celebrationContext.beginPath();
        celebrationContext.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        celebrationContext.fill();
      }
    });
    celebrationContext.globalAlpha = 1;
    celebrationParticles = celebrationParticles.filter((particle) => particle.life > 0);
    if (celebrationParticles.length) celebrationFrame = requestAnimationFrame(animate);
  }
  cancelAnimationFrame(celebrationFrame);
  animate();
}

function openSurprise() {
  surprise.classList.add("open");
  createCelebration();
}

document.getElementById("surpriseClose").addEventListener("click", () => {
  surprise.classList.remove("open");
});

surprise.addEventListener("click", (event) => {
  if (event.target === surprise) surprise.classList.remove("open");
});
