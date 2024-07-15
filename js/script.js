console.log('Spotify clone By Muhammad Sami Khan - @CodeWithSami');
let currentSong = new Audio();
let songs;
let cuurentFolder;

// Function That Convert Seconds to Minutes:Seconds
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60);

    var minutesStr = String(minutes).padStart(2, '0');
    var secondsStr = String(remainingSeconds).padStart(2, '0');

    return `${minutesStr}:${secondsStr}`;
}

// Async function that fetch the songs
async function getSongs(folder) {
    cuurentFolder = folder;
    let a = await fetch(`/${folder}/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`./${folder}/`)[1]);
        }
    }

    // Show all the song in play list 
    let songUl = document.querySelector('.songList').getElementsByTagName("ul")[0]
    songUl.innerHTML = "";
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `
            <li>
                <img src="img/music.svg" class="invert" alt="">
                <div class="songInfo">
                    <h2 class="songName">${song.replaceAll('%20', ' ')}</h2>
                    <h3 class="songArtist">Sami Khan</h3>
                </div>
                <div class="d-flex justify-center item-center" style="gap: 7px;">
                    <span>Play Now</span>
                    <img class="invert" src="img/play.svg" alt="">
                 </div>
            </li>
        `
    }

    // attach an event listener to each song
    Array.from(document.querySelector('.songList').getElementsByTagName('li')).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector('.songInfo').firstElementChild.innerHTML)
        })
    })

    return songs
}

const playMusic = (track, pause = false) => {
    currentSong.src = `./${cuurentFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "img/pause.svg"
    }
    document.getElementById('songInfo').innerHTML = decodeURI(track)
    document.getElementById('songTime').innerHTML = "00:00 / 00:00"
}

// asyn function that display the dynamic albums
async function displayAlbum() {
    let a = await fetch(`./songs/`);
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchor = div.getElementsByTagName("a");
    let cardsContainer = document.querySelector('.cardsContainer');
    let array = Array.from(anchor)
    // creat loop for print the albums card
    for (let index = 0; index < array.length; index++) {
        const e = array[index];
        if (e.href.includes("/songs")) {
            let folder = e.href.split('/').slice(-2)[0]
            let a = await fetch(`/songs/${folder}/info.json`);
            let response = await a.json()
            cardsContainer.innerHTML = cardsContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="card-img">
                            <img src="/songs/${folder}/cover.jpg" alt="">
                            <i class="fa-solid fa-play play-icon"></i>
                        </div>
                        <div class="card-body">
                            <h2 class="text-secondary">${response.title}</h2>
                            <span class="text-secondary">${response.description}</span>
                        </div>
                    </div>`
        }
    }

    // Load the playlist when ever card is clicked
    Array.from(document.getElementsByClassName('card')).forEach(e => {
        e.addEventListener('click', async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    })

}


async function main() {
    await getSongs('songs/cs');
    playMusic(songs[0], true)

    // display all the albums on the page 
    displayAlbum()

    // attach an event listener to play next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        } else {
            currentSong.pause()
            play.src = "img/play.svg"
        }
    })

    // listen for time update
    currentSong.addEventListener("timeupdate", () => {
        document.getElementById('songTime').innerHTML = `
        ${secondsToMinutesSeconds(currentSong.currentTime)} : ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector('.circle').style.left = (currentSong.currentTime / currentSong.duration) * 100 + '%';

    })

    document.querySelector('.seekbar').addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector('.circle').style.left = + percent + '%';
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    document.querySelector('.humberger').addEventListener('click', (e => {
        e.target = document.querySelector('.sidebar').style.left = 0 + '%';
    }))

    document.querySelector('.close').addEventListener('click', (e => {
        e.target = document.querySelector('.sidebar').style.left = -120 + '%';
    }))

    previous.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    next.addEventListener('click', () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // adding volume bar 
    let volumeBar = document.querySelector('#volumeBar')
    volumeBar.addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })
    let volumeIcon = document.querySelector('.volumeIcon')
    volumeIcon.addEventListener('click', (e) => {
        if (currentSong.volume > 0) {
            currentSong.volume = 0;
            volumeIcon.src = "img/volume2.svg";
            volumeBar.value = 0
        }
        else {
            currentSong.volume = 0.10;
            volumeIcon.src = "img/volume.svg";
            volumeBar.value = 10
        }
    })

}
main();