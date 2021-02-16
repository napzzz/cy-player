interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
  length: number;
  album?: string;
  year?: string;
  genre?: string;
}

interface PlayerHandlers {
  onPlay: () => void;
}

export default class Player {
  songs: Track[];
  currentTrack: number;
  isPlaying: boolean;
  handlers: PlayerHandlers;

  constructor(songs: Track[], handlers: PlayerHandlers) {
    this.songs = songs;
    this.currentTrack = 0;
    this.isPlaying = false;

    this.handlers = handlers;
  }

  play() {
    const { title, artist } = this.songs[this.currentTrack];
    console.log(`Playing ${title} - ${artist}`);
    this.isPlaying = true;
  }

  pause() {
    console.log("Paused");
    this.isPlaying = false;
  }

  prevSong() {
    if (this.currentTrack === 0) {
      console.log("Cant go back");
      return;
    }

    console.log("Previous");
    this.currentTrack -= 1;

    this.play();
  }

  nextSong() {
    if (this.currentTrack + 1 === this.songs.length) {
      console.log("Player reset");
      this.currentTrack = 0;
      return;
    }

    console.log("Next");
    this.currentTrack += 1;

    this.play();
  }

  playlist() {
    console.log("Playlist:");
    console.log(this.songs);
  }

  getCurrentSong() {
    if (!this.isPlaying) {
      return;
    }
    return this.songs[this.currentTrack];
  }
}
