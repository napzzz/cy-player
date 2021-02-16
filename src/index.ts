interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
  length?: number;
  album?: string;
  year?: string;
  genre?: string;
}

interface PlayerHandlers {
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
}

export default class Player {
  songs: Track[];
  currentTrack: number;
  isPlaying: boolean;
  handlers: PlayerHandlers;
  audio: HTMLAudioElement;

  constructor(
    audio: HTMLAudioElement,
    songs: Track[],
    handlers: PlayerHandlers
  ) {
    this.songs = songs;
    this.currentTrack = 0;
    this.isPlaying = false;
    this.handlers = handlers;
    this.audio = audio;
  }

  async play() {
    const { title, artist, src } = this.songs[this.currentTrack];

    if (!this.audio.src.includes(".mp3")) {
      this.audio.src = src;
    }

    await this.audio.play();
    this.isPlaying = true;

    console.log(`Playing ${title} - ${artist}`);

    this.handlers.onPlay();
  }

  pause() {
    if (!this.audio) {
      return;
    }

    this.audio.pause();
    console.log("Paused");

    this.isPlaying = false;

    this.handlers.onPause();
  }

  togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  prevSong() {
    if (this.currentTrack === 0) {
      console.log("Cant go back");
      return;
    }

    console.log("Previous");
    this.currentTrack -= 1;

    this.audio.src = "";

    this.play();
  }

  nextSong() {
    this.audio.src = "";

    if (this.currentTrack + 1 === this.songs.length) {
      console.log("Player reset");
      this.isPlaying = false;
      this.currentTrack = 0;
      this.handlers.onReset();
      return;
    }

    console.log("Next");
    this.currentTrack += 1;

    this.play();
  }

  playById(id: number) {
    this.audio.src = "";
    this.currentTrack = id;
    this.play();
  }

  getCurrentSong() {
    if (!this.isPlaying) {
      return;
    }
    return this.songs[this.currentTrack];
  }
}

const setupPlayer = async () => {
  //const app = document.getElementById("app")! as HTMLElement;

  const audioDOM = document.getElementById("audioDOM")! as HTMLAudioElement;
  const coverDOM = document.getElementById("coverDOM")! as HTMLImageElement;
  const titleDOM = document.getElementById("titleDOM")! as HTMLElement;
  const artistDOM = document.getElementById("artistDOM")! as HTMLElement;
  const playlistDOM = document.getElementById(
    "playlistDOM"
  )! as HTMLUListElement;

  const playBtn = document.getElementById("playBtn")! as HTMLButtonElement;
  const nextBtn = document.getElementById("nextBtn")! as HTMLButtonElement;
  const prevBtn = document.getElementById("prevBtn")! as HTMLButtonElement;

  const response = await fetch("songs.json");
  const songs = await response.json();

  const handlers = {
    onPlay: function () {
      console.log("CALLED PLAY HANDLER");

      const song = p.getCurrentSong();

      console.log("SONG", song);

      if (!song) {
        return;
      }

      const { cover, title, artist } = song;

      coverDOM.src = cover;
      titleDOM.innerText = title;
      artistDOM.innerText = artist;

      playBtn.innerText = "Pause";
    },
    onPause: function () {
      playBtn.innerText = "Play";
    },
    onReset: function () {
      playBtn.innerText = "Play";

      coverDOM.src = "";
      titleDOM.innerText = "";
      artistDOM.innerText = "";
    },
  };

  const p = new Player(audioDOM, songs, handlers);

  playBtn.onclick = () => p.togglePlay();
  nextBtn.onclick = () => p.nextSong();
  prevBtn.onclick = () => p.prevSong();

  playBtn.disabled = false;
  nextBtn.disabled = false;
  prevBtn.disabled = false;

  for (let i = 0; i < songs.length; i++) {
    const song = songs[i];
    const li = document.createElement("li") as HTMLLIElement;
    li.innerText = `${song.artist} - ${song.title}`;
    li.onclick = () => p.playById(i);
    playlistDOM.appendChild(li);
  }

  audioDOM.onended = () => {
    console.log("ENDED");
    p.nextSong();
  };
};

setupPlayer();
