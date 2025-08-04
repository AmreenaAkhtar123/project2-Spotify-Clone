console.log("Lets start javascript");
let currentSong = new Audio();

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

const playMusic = (track) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = "/songs/" + track
    currentSong.play()
    playSong.src = "assets/pause.svg"

    document.querySelector(".songInfo").innerHTML = track

    document.querySelector(".songTime").innerHTML = "00:00/00:00"
}
async function main() {
    
    ////For getting the list of all the songs
    let songs = await getSongs()
    console.log(songs);
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
            console.log(e.querySelector(".info").firstElementChild.innerHTML);
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


}

main()
