document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('global-audio');
  const playBtn = document.getElementById('play-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const progressBg = document.getElementById('progress-bg');
  const progressFill = document.getElementById('progress-fill');
  const currentTimeEl = document.getElementById('current-time');
  const durationTimeEl = document.getElementById('duration-time');
  
  const trackTitle = document.getElementById('track-title');
  const trackArtist = document.getElementById('track-artist');
  const miniCover = document.getElementById('mini-cover');

  const cards = Array.from(document.querySelectorAll('.card'));
  let currentIndex = -1;

  // Fungsi untuk memutar lagu berdasarkan indeks kartu
  function playTrack(index) {
    if (index < 0 || index >= cards.length) return;
    
    currentIndex = index;
    const card = cards[currentIndex];
    
    const src = card.getAttribute('data-src');
    const title = card.getAttribute('data-title') || 'Unknown Title';
    const artist = card.getAttribute('data-artist') || 'Unknown Artist';
    const cover = card.getAttribute('data-cover');

    // Update Tampilan Player Bar
    trackTitle.textContent = title;
    trackArtist.textContent = artist;
    
    if (cover) {
      miniCover.innerHTML = `<img src="${cover}" alt="cover" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
      miniCover.innerHTML = '🎵';
    }

    // Set Audio Source dan Putar
    audio.src = src;
    audio.play().then(() => {
      playBtn.textContent = '⏸';
    }).catch(err => {
      console.error("Gagal memutar audio:", err);
      alert("Gagal memutar audio. Pastikan link audio masih aktif atau tidak diblokir browser.");
    });
  }

  // Event Listener Klik pada setiap Kartu Lagu
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      playTrack(index);
    });
  });

  // Tombol Play / Pause Utama
  playBtn.addEventListener('click', () => {
    if (!audio.src) {
      if (cards.length > 0) playTrack(0);
      return;
    }

    if (audio.paused) {
      audio.play();
      playBtn.textContent = '⏸';
    } else {
      audio.pause();
      playBtn.textContent = '▶';
    }
  });

  // Tombol Next & Prev
  nextBtn.addEventListener('click', () => {
    if (currentIndex < cards.length - 1) {
      playTrack(currentIndex + 1);
    } else {
      playTrack(0); // Loop kembali ke awal
    }
  });

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      playTrack(currentIndex - 1);
    }
  });

  // Update Progress Bar & Waktu
  audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${progressPercent}%`;

      // Format Menit : Detik
      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationTimeEl.textContent = formatTime(audio.duration);
    }
  });

  // Klik Progress Bar untuk Seek Waktu
  progressBg.addEventListener('click', (e) => {
    const width = progressBg.clientWidth;
    const clickX = e.offsetX;
    const duration = audio.duration;

    if (duration) {
      audio.currentTime = (clickX / width) * duration;
    }
  });

  // Ketika Lagu Selesai
  audio.addEventListener('ended', () => {
    if (currentIndex < cards.length - 1) {
      playTrack(currentIndex + 1);
    } else {
      playBtn.textContent = '▶';
    }
  });

  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
});
