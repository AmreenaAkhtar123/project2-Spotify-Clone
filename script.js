// console.log("Lets start javascript");
let currentSong = new Audio();
let songs;
let currfolder;

////function for converting seconds into minutes
function formatTime(seconds) {
    if (isNaN(seconds)) {
        return "00:00";
    }

    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);

    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    return formatted;
}
/////////////////////////

//Function to fetch songs//////////

async function getSongs(folder) {
    currfolder = folder;

    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    ///Show all the songs in the play list....
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="assets/music.svg" alt="">

                            <div class="info">
                                <div>${song}</div>
                                <div>Amreena</div>
                            </div>

                            <div class="playNow">
                                <span>Play Now</span>
                                <img 
                            class="invert" src="assets/play.svg" alt="">
                            </div>
                            
                        </li>`;


    }


    //Attach an event listener to each song 
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            //console.log(e.querySelector(".info").firstElementChild.innerHTML);
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    });
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currfolder}/` + track
    if (!pause) {
        currentSong.play()
        playSong.src = "assets/pause.svg"
    }


    document.querySelector(".songInfo").innerHTML = track.replace(".mp3", "").replaceAll("%20", "");


    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}

async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".card-container")
    //console.log(anchors)
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 

        if (e.href.includes("/songs")) {
            let folder = (e.href.split("/").slice(-2)[0])

            ////Get the meta deta of the data

            let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`)
            let response = await a.json();
            //console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                <div class="play">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="black" width="24" height="24">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                    </svg>
                </div>
                <img src="/songs/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;


        }
    }
    ////////////Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}

async function displayArtist() {
    let a = await fetch(`http://127.0.0.1:3000/albums/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".artist-card-container")
    //console.log(anchors)
    let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 

        if (e.href.includes("/albums")) {
            let folder = (e.href.split("/").slice(-2)[0])

            ////Get the meta deta of the data

            let a = await fetch(`http://127.0.0.1:3000/albums/${folder}/info.json`)
            let response = await a.json();
            //console.log(response)

            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="artist-card">
                    <div class="artist-card">
                        <div class="artist-play">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="black" width="24" height="24">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
                            </svg>

                        </div>
                <img src="/albums/${folder}/cover.jpg" alt="">
                <h2>${response.title}</h2>
                <p>${response.description}</p>
            </div>`;


        }
    }
    ////////////Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("artist-card")).forEach(e => {
        // console.log(e);
        e.addEventListener("click", async item => {
            songs = await getSongs(`albums/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])

        })
    })
}


async function main() {

    ////For getting the list of all the songs
    await getSongs("songs/ncs")
    // console.log(songs);
    playMusic(songs[0], true)
    

    ////Display all the albums on the page
    displayAlbums();
    displayArtist();



    //Attact an event listener to previous, play and next button////

    playSong.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            playSong.src = "assets/pause.svg"
        }
        else {
            currentSong.pause()
            playSong.src = "assets/play.svg"
        }
    })

    //Adding an event listener for time update/////
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    ////Adding an event listener to the seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = e.offsetX / e.target.getBoundingClientRect().width * 100
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration) * percent) / 100;

    })

    /////Adding an event listener to the hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    ///Adding the event listener to the close
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //////////
    ////////////

    ////////////////Making the prev and next button interactive
    next.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        } else {
            playMusic(songs[0]);
        }
    });

    previous.addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index > 0) {
            playMusic(songs[index - 1]);
        } else {
            // Optional: jump to last song
            playMusic(songs[songs.length - 1]);
        }
    });



    currentSong.addEventListener("ended", () => {
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if (index < songs.length - 1) {
            playMusic(songs[index + 1]);
        } else {
            // Optionally restart the playlist or pause
            playMusic(songs[0]);
        }
    });

    //////////Adding the functionality of mute and unmute volume
    ////////// Volume slider, mute toggle and dynamic fill ////////
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeIcon = document.querySelector(".volumebtn");

    // Handle volume input
    volumeSlider.addEventListener("input", () => {
        currentSong.volume = volumeSlider.value;

        // Update background fill color
        const val = volumeSlider.value * 100;
        volumeSlider.style.background = `linear-gradient(to right, white ${val}%, #white ${val}%)`;

        // Change icon based on volume
        if (currentSong.volume == 0) {
            currentSong.muted = true;
            volumeIcon.src = "assets/mute.svg";
        } else {
            currentSong.muted = false;
            volumeIcon.src = "assets/volume.svg";
        }
    });

    // Toggle mute/unmute
    volumeIcon.addEventListener("click", () => {
        currentSong.muted = !currentSong.muted;

        volumeIcon.src = currentSong.muted ? "assets/mute.svg" : "assets/volume.svg";

        // Visually reflect muted state
        volumeSlider.value = currentSong.muted ? 0 : currentSong.volume || 1;
        const val = volumeSlider.value * 100;
        volumeSlider.style.background = `linear-gradient(to right, white ${val}%, #ddd ${val}%)`;
    });
    

}

main();