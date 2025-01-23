// Importation et gestion des sons avec Howler.js
const playlist = [
    {
        title: "A Toulon ",
        src: "music/A Toulon master (online-audio-converter.com).mp3",
    },
    {
        title: "Chanson 2",
        src: "song2.mp3",
    },
    {
        title: "Chanson 3",
        src: "song3.mp3",
    },
];

let currentSongIndex = 0;
let isPlaying = false;

// Initialisation d'un objet Howl pour gérer la lecture
let sound = new Howl({
    src: [playlist[currentSongIndex].src],
    html5: true, // Assure la compatibilité avec les navigateurs modernes
    onend: () => {
        nextSong(); // Passe automatiquement à la chanson suivante
    },
});

// Mise à jour des informations du lecteur
const updatePlayerUI = () => {
    document.getElementById("song-title").textContent = playlist[currentSongIndex].title;
    document.getElementById("progress-bar").value = 0;
    document.getElementById("current-time").textContent = "00:00";
    document.getElementById("total-duration").textContent = formatTime(sound.duration());
};

// Formatage des secondes en minutes:secondes
const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60) || 0;
    const secs = Math.floor(seconds % 60) || 0;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
};

// Lecture de la chanson
const playSong = () => {
    if (!isPlaying) {
        sound.play();
        isPlaying = true;
        document.getElementById("play-btn").textContent = "Pause";
    } else {
        sound.pause();
        isPlaying = false;
        document.getElementById("play-btn").textContent = "Play";
    }
};

// Passer à la chanson suivante
const nextSong = () => {
    sound.stop();
    currentSongIndex = (currentSongIndex + 1) % playlist.length;
    sound = new Howl({
        src: [playlist[currentSongIndex].src],
        html5: true,
        onend: () => {
            nextSong();
        },
    });
    updatePlayerUI();
    playSong();
};

// Revenir à la chanson précédente
const prevSong = () => {
    sound.stop();
    currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    sound = new Howl({
        src: [playlist[currentSongIndex].src],
        html5: true,
        onend: () => {
            nextSong();
        },
    });
    updatePlayerUI();
    playSong();
};

// Mise à jour de la barre de progression en temps réel
setInterval(() => {
    if (isPlaying) {
        const currentTime = sound.seek();
        document.getElementById("current-time").textContent = formatTime(currentTime);
        document.getElementById("progress-bar").value = (currentTime / sound.duration()) * 100;
    }
}, 500);

// Événement pour ajuster la position de lecture
document.getElementById("progress-bar").addEventListener("input", (e) => {
    const seekTime = (e.target.value / 100) * sound.duration();
    sound.seek(seekTime);
});

// Écouteurs d'événements pour les boutons de contrôle
document.getElementById("play-btn").addEventListener("click", playSong);
document.getElementById("pause-btn").addEventListener("click", playSong);

document.getElementById("next-btn")?.addEventListener("click", nextSong);
document.getElementById("prev-btn")?.addEventListener("click", prevSong);

// Initialiser le lecteur avec la première chanson
updatePlayerUI();
