console.log("Lets start javascript");
let currentSong = new Audio();

////function for converting seconds into minutes
function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  return formatted;
}
/////////////////////////

//Function to fetch songs//////////

async function getSongs() {

    let a = await fetch("http://127.0.0.1:3000/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    if (!pause){
        currentSong.play()
        playSong.src = "assets/pause.svg"
    }
    

    document.querySelector(".songInfo").innerHTML = track

    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}


async function main() {
    
    ////For getting the list of all the songs
    let songs = await getSongs()
    // console.log(songs);
    playMusic(songs[0], true)
    ///Show all the songs in the play list....
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
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

    //Attact an event listener to previous, play and next button////

    playSong.addEventListener("click", ()=>{
        if (currentSong.paused){
            currentSong.play()
            playSong.src = "assets/pause.svg"
        }
        else{
            currentSong.pause()
            playSong.src = "assets/play.svg"
        }
    } )

    //Adding an event listener for time update/////
    currentSong.addEventListener("timeupdate", ()=>{
        // console.log(currentSong.currentTime, currentSong.duration);

        document.querySelector(".songTime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`

        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)*100 + "%"
    })

    ////Adding an event listener to the seekbar

    document.querySelector(".seekbar").addEventListener("click", e=>{
        let percent = e.offsetX/e.target.getBoundingClientRect().width *100 
        document.querySelector(".circle").style.left = percent + "%";

        currentSong.currentTime = ((currentSong.duration)*percent)/100;

    })

    /////Adding an event listener to the hamburger
    document.querySelector(".hamburger").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "0"
    })

    ///Adding the event listener to the close
    document.querySelector(".close").addEventListener("click", ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

}

main()
