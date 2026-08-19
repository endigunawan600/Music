const audio = document.getElementById('audio');
const playBtn = document.getElementById('play-btn');

let isPlaying = false;

// Fungsi untuk memutar lagu
function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.innerText = 'Pause';
}

// Fungsi untuk menghentikan lagu sementara
function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.innerText = 'Play';
}

// Event listener saat tombol diklik
playBtn.addEventListener('click', () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
});

// Otomatis kembalikan tombol ke "Play" jika lagu selesai
audio.addEventListener('ended', () => {
  isPlaying = false;
  playBtn.innerText = 'Play';
});
