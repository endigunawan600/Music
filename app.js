document.addEventListener("DOMContentLoaded", () => {
  // 1. ELEMEN DOM
  const audio = document.getElementById("global-audio");
  const playBtn = document.getElementById("play-btn");
  const prevBtn = document.getElementById("prev-btn");
  const nextBtn = document.getElementById("next-btn");
  const progressBg = document.getElementById("progress-bg");
  const progressFill = document.getElementById("progress-fill");
  const currentTimeEl = document.getElementById("current-time");
  const durationTimeEl = document.getElementById("duration-time");
  const trackArtistEl = document.getElementById("track-artist");
  const trackTitleEl = document.getElementById("track-title");
  const miniCoverEl = document.getElementById("mini-cover");
  const searchInput = document.querySelector(".search-box input");
  const genreChips = document.querySelectorAll(".genre-chip");

  // 2. PLAYLIST & STATE
  let playlist = [];
  let currentIndex = -1;
  let isPlaying = false;

  // Membaca semua card lagu yang ada di halaman untuk dijadikan Playlist
  function buildPlaylist() {
    const cards = document.querySelectorAll(".card");
    playlist = [];
    cards.forEach((card, index) => {
      playlist.push({
        index: index,
        src: card.getAttribute("data-src"),
        title: card.getAttribute("data-title") || "Unknown Title",
        artist: card.getAttribute("data-artist") || "Unknown Artist",
        cover: card.getAttribute("data-cover") || "",
        element: card
      });

      // Tambahkan event click pada tiap card
      card.addEventListener("click", () => {
        playTrack(index);
      });
    });
  }

  // 3. FUNGSI MEMUTAR LAGU
  function playTrack(index) {
    if (index < 0 || index >= playlist.length) return;

    currentIndex = index;
    const track = playlist[currentIndex];

    // Jika lagu baru dipanggil, ganti source
    if (audio.src !== window.location.origin + "/" + track.src && audio.getAttribute("src") !== track.src) {
      audio.src = track.src;
    }

    audio.play()
      .then(() => {
        isPlaying = true;
        updatePlayerUI();
      })
      .catch((err) => {
        console.error("Gagal memutar audio:", err);
        alert("Gagal memutar file: " + track.src + "\nPastikan nama file di GitHub sudah sesuai.");
      });
  }

  function togglePlay() {
    if (currentIndex === -1 && playlist.length > 0) {
      // Jika belum ada lagu yang dipilih, putar lagu pertama
      playTrack(0);
      return;
    }

    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play();
      isPlaying = true;
    }
    updatePlayButton();
  }

  function nextTrack() {
    if (playlist.length === 0) return;
    let nextIndex = currentIndex + 1;
    if (nextIndex >= playlist.length) nextIndex = 0; // Loop kembali ke lagu pertama
    playTrack(nextIndex);
  }

  function prevTrack() {
    if (playlist.length === 0) return;
    let prevIndex = currentIndex - 1;
    if (prevIndex < 0) prevIndex = playlist.length - 1; // Kembali ke lagu terakhir
    playTrack(prevIndex);
  }

  // 4. UPDATE TAMPILAN PLAYER
  function updatePlayerUI() {
    const track = playlist[currentIndex];
    
    trackTitleEl.innerText = track.title;
    trackArtistEl.innerText = track.artist;

    if (track.cover) {
      miniCoverEl.innerHTML = `<img src="${track.cover}" alt="Cover">`;
    } else {
      miniCoverEl.innerHTML = "🎵";
    }

    updatePlayButton();
  }

  function updatePlayButton() {
    playBtn.innerText = isPlaying ? "⏸" : "▶";
  }

  // Format Detik ke Menit:Detik (cth: 3:45)
  function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // 5. EVENT LISTENERS CONTROL
  playBtn.addEventListener("click", togglePlay);
  nextBtn.addEventListener("click", nextTrack);
  prevBtn.addEventListener("click", prevTrack);

  // Update Progress Bar saat lagu berjalan
  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const progressPercent = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${progressPercent}%`;
      currentTimeEl.innerText = formatTime(audio.currentTime);
      durationTimeEl.innerText = formatTime(audio.duration);
    }
  });

  // Klik di Progress Bar untuk seek / melompati durasi
  progressBg.addEventListener("click", (e) => {
    const rect = progressBg.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    if (audio.duration) {
      audio.currentTime = (clickX / width) * audio.duration;
    }
  });

  // Begitu lagu selesai -> OOTOMATIS LANJUT LAGU BEREKUTNYA
  audio.addEventListener("ended", () => {
    nextTrack();
  });

  // 6. FITUR SEARCH / PENCARIAN LAGU
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      const keyword = e.target.value.toLowerCase();
      playlist.forEach((track) => {
        const isMatch = track.title.toLowerCase().includes(keyword) || 
                        track.artist.toLowerCase().includes(keyword);
        track.element.style.display = isMatch ? "block" : "none";
      });
    });
  }

  // 7. FITUR GENRE CHIPS FILTER
  genreChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const genre = chip.innerText.replace(/[^\w\s]/gi, '').trim().toLowerCase();
      
      if (genre.includes("trending")) {
        playlist.forEach(track => track.element.style.display = "block");
      } else {
        playlist.forEach(track => {
          const isMatch = track.title.toLowerCase().includes(genre) || 
                          track.artist.toLowerCase().includes(genre);
          track.element.style.display = isMatch ? "block" : "none";
        });
      }
    });
  });

  // INITIALIZE
  buildPlaylist();
});
