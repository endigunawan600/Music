const cards = document.querySelectorAll('.card');
const audioPlayer = document.getElementById('global-audio');
const nowPlayingText = document.getElementById('now-playing');

// Tambahkan event listener untuk setiap kartu lagu
cards.forEach(card => {
  card.addEventListener('click', () => {
    const audioSrc = card.getAttribute('data-src');
    const songTitle = card.getAttribute('data-title');

    if (audioSrc) {
      audioPlayer.src = audioSrc;
      audioPlayer.play();
      nowPlayingText.innerText = "Memutar: " + songTitle;
    }
  });
});
