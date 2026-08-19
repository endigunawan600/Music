const audio = document.getElementById('global-audio');
const playBtn = document.getElementById('play-btn');
const progressBg = document.getElementById('progress-bg');
const progressFill = document.getElementById('progress-fill');
const currentTimeEl = document.getElementById('current-time');
const durationTimeEl = document.getElementById('duration-time');
const trackTitle = document.getElementById('track-title');
const trackArtist = document.getElementById('track-artist');

const cards = document.querySelectorAll('.card');
let isPlaying = false;

// 1. Klik Lagu di Card
cards.forEach(card => {
  card.addEventListener('click', () => {
    const src = card.getAttribute('data-src');
    const title = card.getAttribute('data-title');
    const artist = card.getAttribute('data-artist');

    audio.src = src;
    trackTitle.innerText = title;
    trackArtist.innerText = artist;

    playSong();
  });
});

// 2. Fungsi Play / Pause
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.innerText = '⏸';
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerText = '▶';
}

playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    if (audio.src) playSong();
  }
});

// 3. Update Progress Bar & Waktu Durasi
audio.addEventListener('timeupdate', (e) => {
  const { currentTime, duration } = e.target;
  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progressFill.style.width = `${progressPercent}%`;

    // Format Menit:Detik
    currentTimeEl.innerText = formatTime(currentTime);
    durationTimeEl.innerText = formatTime(duration);
  }
});

// 4. Klik di Progress Bar untuk Menggeser Durasi
progressBg.addEventListener('click', (e) => {
  const width = progressBg.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  if (duration) {
    audio.currentTime = (clickX / width) * duration;
  }
});

function formatTime(time) {
  const mins = Math.floor(time / 60);
  const secs = Math.floor(time % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
