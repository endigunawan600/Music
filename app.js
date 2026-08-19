document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("global-audio");
  const playBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  
  const trackTitle = document.getElementById("track-title");
  const trackArtist = document.getElementById("track-artist");
  const miniCover = document.getElementById("mini-cover");
  
  const currentTimeEl = document.getElementById("current-time");
  const durationTimeEl = document.getElementById("duration-time");
  const progressBg = document.getElementById("progress-bg");
  const progressFill = document.getElementById("progress-fill");

  const cards = Array.from(document.querySelectorAll(".card"));
  let currentIndex = -1;

  // Fungsi untuk memuat dan memutar lagu
  function loadAndPlayTrack(index) {
    if (index < 0 || index >= cards.length) return;

    currentIndex = index;
    const card = cards[currentIndex];
    
    const src = card.getAttribute("data-src");
    const title = card.getAttribute("data-title") || "Unknown Title";
    const artist = card.getAttribute("data-artist") || "Unknown Artist";
    const cover = card.getAttribute("data-cover");

    // Update Info Tampilan Player Bar
    trackTitle.textContent = title;
    trackArtist.textContent = artist;

    if (cover) {
      miniCover.innerHTML = `<img src="${cover}" alt="Cover">`;
    } else {
      miniCover.innerHTML = "🎵";
    }

    // Set Audio Source & Play
    audio.src = src;
    audio.load();

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          playBtn.textContent = "⏸";
        })
        .catch((error) => {
          console.error("Audio Playback Error:", error);
          alert(`Gagal memutar audio: ${error.message}\n\nPastikan file '${src}' tersedia di GitHub/URL tersebut.`);
          playBtn.textContent = "▶";
        });
    }
  }

  // Event Klik pada Kartu Lagu
  cards.forEach((card, index) => {
    card.addEventListener("click", () => {
      loadAndPlayTrack(index);
    });
  });

  // Tombol Play / Pause
  playBtn.addEventListener("click", () => {
    if (!audio.src) {
      if (cards.length > 0) loadAndPlayTrack(0);
      return;
    }

    if (audio.paused) {
      audio.play().then(() => {
        playBtn.textContent = "⏸";
      }).catch(err => alert("Gagal memutar: " + err.message));
    } else {
      audio.pause();
      playBtn.textContent = "▶";
    }
  });

  // Tombol Next & Prev
  nextBtn.addEventListener("click", () => {
    if (cards.length === 0) return;
    let nextIndex = (currentIndex + 1) % cards.length;
    loadAndPlayTrack(nextIndex);
  });

  prevBtn.addEventListener("click", () => {
    if (cards.length === 0) return;
    let prevIndex = (currentIndex - 1 + cards.length) % cards.length;
    loadAndPlayTrack(prevIndex);
  });

  // Update Progress Bar saat Lagu Berjalan
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${pct}%`;

      currentTimeEl.textContent = formatTime(audio.currentTime);
      durationTimeEl.textContent = formatTime(audio.duration);
    }
  });

  // Klik Progress Bar untuk Seek
  progressBg.addEventListener("click", (e) => {
    if (!audio.duration) return;
    const rect = progressBg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    audio.currentTime = (clickX / width) * audio.duration;
  });

  // Otomatis Lanjut ke Lagu Berikutnya Saat Selesai
  audio.addEventListener("ended", () => {
    nextBtn.click();
  });

  // Helper Format Waktu (MM:SS)
  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  }
});
