const allSongs = [
    {
        id: 0,
        name: 'Sugar',
        genre: 'pop',
        artist: 'Anno Domini'
    },
    {
        id: 1,
        name: 'Mission',
        genre: 'rock',
        artist: 'Anno Domini'
    },
    {
        id: 2,
        name: 'Brave',
        genre: 'hip-pop',
        artist: 'Mark Karan'
    },

]

const songListContainer = document.getElementById("songs-list");
const customSelect = document.getElementById("custom-select");
const selected = customSelect.querySelector(".selected");
const optionsList = customSelect.querySelector(".select-options");
const newPlaylistName = document.getElementById("create-playlist-input");
const allPlaylistContainer = document.getElementById("all-playlist");
const allPlaylist = [];
let currentSong = { id: allSongs.id, name: allSongs[0].name, songImage: "", songArtist: allSongs[0].artist, songAudio: "" };
const currentPlaylistContainer = document.getElementById("current-playlist-items")
let currentPlaylist = ""
let currentPlaylistSongs = []
let playlists = {}
let filteredSongList = [...allSongs];
let currentSongIndex = 0;
let playlistNameToDisplay = document.createElement("span");
let theme = "light";
const searchSong = document.getElementById("search-song");
renderSongs(allSongs);
selected.addEventListener("click", () => {
    optionsList.style.display = optionsList.style.display === "block" ? "none" : "block";
})

optionsList.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
        const selectedGenre = option.getAttribute("data-value");
        selected.textContent = option.textContent;
        filteredSongList =
            selectedGenre === "all"
                ? allSongs
                : allSongs.filter((song) => song.genre === selectedGenre);
        currentSongIndex = 0;
        renderSongs(filteredSongList);
        optionsList.style.display = "none";
    })
})

document.addEventListener("click", (e) => {
    if (!customSelect.contains(e.target)) {
        optionsList.style.display = "none";
    }
});



document.getElementById("create-playlist-button").addEventListener("click", (e) => {
    e.preventDefault()
    playlistNameToDisplay.textContent = "";
    console.log("newPlaylistName", newPlaylistName.value);
    const playlistName = newPlaylistName.value.trim();
    if (!playlistName) {
        alert("Please enter a playlist name.");
        return;
    }

    if (allPlaylist.includes(playlistName)) {
        alert("Choose a different name for the playlist, as this name already exists.");
        return;
    }
    if (newPlaylistName.value) {
        allPlaylist.push(newPlaylistName.value)
        renderPlaylist(allPlaylist)
    }
    newPlaylistName.value = ""
})


function playSong(song) {
    console.log("song", song)
    const songToPlay = document.getElementById("song-audio");
    const coverImage = document.getElementById("song-image");
    const songArtist = document.getElementById("artist");
    const songTitle = document.getElementById("song-title");
    const audioPlayer = document.getElementById("audio-player");

    const audioSrc = `songs/${song.name}.mp3`;
    const imageSrc = `images/${song.name}.jpeg`;

    songToPlay.setAttribute("src", audioSrc);
    coverImage.setAttribute("src", imageSrc);
    songArtist.textContent = song.artist;
    songTitle.textContent = song.name;

    currentSong.id = song.id;
    currentSong.name = song.name;
    currentSong.songAudio = audioSrc;
    currentSong.songImage = imageSrc;
    currentSong.songArtist = song.artist;

    audioPlayer.load();
    audioPlayer.play();

    console.log("Now Playing:", currentSong);
}


function renderSongs(filteredSongs, container = songListContainer) {
    container.innerHTML = "";
    const isDarkTheme = document.getElementById("theme-toggle").checked;

    const searchPlaylist = document.getElementById("search-playlist");



    searchPlaylist.addEventListener("input", () => {
        const searchTerm = searchPlaylist.value.toLowerCase();
        const filteredPlaylists = allPlaylist.filter(name =>
            name.toLowerCase().includes(searchTerm)
        );
        renderPlaylist(filteredPlaylists);
    });


    searchSong.addEventListener("input", () => {
        const searchTerm = searchSong.value.toLowerCase().trim();
        console.log("Search term:", searchTerm);
        let listSongs = [...filteredSongs];
        const filteredSongsByName = listSongs.filter(song =>
            song.name.toLowerCase().includes(searchTerm)
        );
        renderSongs(filteredSongsByName, container);

        if (searchTerm === "") {
            console.log("Input cleared. Rendering full list.");
            console.log("filteredSongs",filteredSongs)
            renderSongs(filteredSongList, container);
            return;
        }
    });


    filteredSongs.forEach((song) => {
        const songItemWrapper = document.createElement("div");
        songItemWrapper.classList.add("songItemWrapper");
        const songItem = document.createElement("div");
        songItem.textContent = song.name;

        songItem.classList.add("song-item");

        if (isDarkTheme) {
            songItem.classList.add("dark-theme-song-item");
        }

        songItem.addEventListener("click", () => {
            const songToPlay = document.getElementById("song-audio");
            const coverImage = document.getElementById("song-image");
            const songArtist = document.getElementById("artist");
            const songTitle = document.getElementById("song-title");
            const audioPlayer = document.getElementById("audio-player");
            const audioSrc = `songs/${song.name}.mp3`;
            const imageSrc = `images/${song.name}.jpeg`;

            songToPlay.setAttribute("src", audioSrc);
            coverImage.setAttribute("src", imageSrc);
            songArtist.textContent = song.artist;
            songTitle.textContent = song.name;

            let selectedSong = {
                id: song.id,
                name: song.name,
                songAudio: audioSrc,
                songImage: imageSrc,
                songArtist: song.artist
            };
            currentSong = selectedSong;
            currentSongIndex = currentSong.id;
            audioPlayer.load();
            audioPlayer.play();

            console.log("Now Playing:", currentSong);
        });
        songItemWrapper.append(songItem);
        if (container !== songListContainer) {
            const DeleteButton = document.createElement("div");
            DeleteButton.textContent = "Delete";
            DeleteButton.classList.add("play-button")
            console.log(container)
            DeleteButton.addEventListener("click", () => {
                const indexToRemove = playlists[currentPlaylist].findIndex((s) => s.id === song.id);

                if (indexToRemove !== -1) {
                    playlists[currentPlaylist].splice(indexToRemove, 1);
                    renderPlaylistSongs(currentPlaylist);
                }
            })
            songItemWrapper.append(DeleteButton)
        }
        container.appendChild(songItemWrapper);
    });
}

document.getElementById("next").addEventListener("click", () => {

    if (currentPlaylistSongs.length === 0) currentPlaylistSongs = filteredSongList;

    currentSongIndex = (currentSongIndex + 1) % currentPlaylistSongs.length;
    playSong(currentPlaylistSongs[currentSongIndex]);
});

document.getElementById("prev").addEventListener("click", () => {
    if (currentPlaylistSongs.length === 0) currentPlaylistSongs = filteredSongList;

    currentSongIndex = (currentSongIndex - 1 + currentPlaylistSongs.length) % currentPlaylistSongs.length;
    playSong(currentPlaylistSongs[currentSongIndex]);
});

const playCurrentPlaylistBtn = document.getElementById("play-current-playlist");

if (!playlists[currentPlaylist] || playlists[currentPlaylist].length < 1) {
    playCurrentPlaylistBtn.style.display = "none";
} else {
    playCurrentPlaylistBtn.style.display = "block";
}

document.getElementById("play-current-playlist").addEventListener("click", () => {
    const playlistSongs = playlists[currentPlaylist] || [];
    if (playlistSongs.length === 0) return;

    currentPlaylistSongs = playlistSongs;
    currentSongIndex = 0;
    playSong(currentPlaylistSongs[currentSongIndex]);
});

document.getElementById("play-all-filtered-list").addEventListener("click", () => {
    if (filteredSongList.length === 0) return;

    currentPlaylistSongs = filteredSongList;
    currentSongIndex = 0;
    playSong(currentPlaylistSongs[currentSongIndex]);
});

document.getElementById("add").addEventListener("click", (e) => {
    e.preventDefault()
    playCurrentPlaylistBtn.style.display = "block";
    if (!currentPlaylist) {
        alert("Please select a playlist first.");
        return;
    }

    if (!playlists[currentPlaylist]) {
        playlists[currentPlaylist] = [];
    }

    if (playlists[currentPlaylist].some(song => song.id === currentSong.id)) {
        alert("Song already added to the current playlist");
        return;
    }
    playlists[currentPlaylist].push({
        id: currentSong.id,
        name: currentSong.name,
        songImage: currentSong.songImage,
        songArtist: currentSong.songArtist,
        songAudio: currentSong.songAudio
    });
    console.log(`Added to ${currentPlaylist}:`, currentSong);
    console.log("Playlists:", playlists);
    renderPlaylistSongs(currentPlaylist);


})

function renderPlaylist(allPlaylist) {
    allPlaylistContainer.textContent = "";
    const isDarkTheme = document.getElementById("theme-toggle").checked;
    allPlaylist.forEach(item => {
        const playlist = document.createElement("p");
        playlist.textContent = item;
        playlist.classList.add("song-item")

        if (isDarkTheme) {
            playlist.classList.add("dark-theme-song-item");
        }

        allPlaylistContainer.append(playlist)

        playlist.addEventListener("click", () => {
            currentPlaylist = item;
            renderPlaylistSongs(item);

            playlistNameToDisplay.textContent = ` - ${currentPlaylist}`;
            document.getElementById("currentPlaylistHeading").append(playlistNameToDisplay)
        });

    })
}
function renderPlaylistSongs(playlistName) {
    const playlistSongs = playlists[playlistName] || [];
    console.log(playlistSongs)
    renderSongs(playlistSongs, currentPlaylistContainer);
}

const checkbox = document.getElementById("theme-toggle");
const body = document.body;
const cards = document.querySelectorAll(".card");
const playerCard = document.querySelector(".player-card");
const createPlaylistInput = document.getElementById("create-playlist-input");
checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
        console.log(checkbox.checked)
        // Dark mode
        body.classList.add("dark-theme-body");
        body.classList.remove("light-theme-body");

        cards.forEach(card => {
            card.classList.add("dark-theme-card");
        });

        playerCard.classList.add("dark-theme-player-card")
        const playlistItems = document.querySelectorAll("#all-playlist p");
        console.log(playlistItems)
        playlistItems.forEach(item => {
            item.classList.add("dark-theme-song-item");
        });
        const filteredListItems = document.querySelectorAll(".songItemWrapper div");
        filteredListItems.forEach(item => {
            item.classList.add("dark-theme-song-item");
        });
        const currentPlaylistItems = document.querySelectorAll("#current-playlist-items div");
        currentPlaylistItems.forEach(item => {
            item.classList.add("dark-theme-song-item");
        });
        newPlaylistName.classList.add("dark-theme-create-playlist-input")

    } else {
        // Light mode
        body.classList.add("light-theme-body");
        body.classList.remove("dark-theme-body");
        cards.forEach(card => {
            card.classList.remove("dark-theme-card");
        });
        playerCard.classList.remove("dark-theme-player-card");
        const playlistItems = document.querySelectorAll("#all-playlist p");
        playlistItems.forEach(item => {
            item.classList.remove("dark-theme-song-item");
        });
        const filteredListItems = document.querySelectorAll("#songs-list div");
        filteredListItems.forEach(item => {
            item.classList.remove("dark-theme-song-item");
        });
        const currentPlaylistItems = document.querySelectorAll("#current-playlist-items div");
        currentPlaylistItems.forEach(item => {
            item.classList.remove("dark-theme-song-item");
        });
        newPlaylistName.classList.remove("dark-theme-create-playlist-input");
        console.log(createPlaylistInput)
    }
});






