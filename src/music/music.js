import Button from '../controls/button';

export default class Music {
  constructor(gameCanvas) {
    this.gameCanvas = gameCanvas;
    this.counter = 0;
    this.initialize();
  }

  addMusic() {
    this.music = document.createElement('audio');
    this.music.src = 'music/background-music.wav';
    this.music.setAttribute('preload', 'auto');
    this.music.setAttribute('controls', 'none');
    this.music.setAttribute('loop', 'true');
    this.music.style.display = 'none';
    this.music.volume = 0.5;

    document.body.appendChild(this.music);

    this.music.play();
  }

  render() {
    this.gameCanvas.context.drawImage(this.button.icon, this.button.x, this.button.y);
  }

  initialize() {
    const musicOn = new Image();
    musicOn.src = 'imgs/UI/music-icon/sound-on.png';

    const musicHalfOn = new Image();
    musicHalfOn.src = 'imgs/UI/music-icon/sound-half-on.png';

    const musicOff = new Image();
    musicOff.src = 'imgs/UI/music-icon/sound-off.png';

    this.state = [musicOn, musicHalfOn, musicOff];

    this.button = new Button({
      x: 950,
      y: 10,
      height: 40,
      width: 40,
      clickHandler: () => this.toggle(),
    });

    this.button.icon = this.state[this.counter];
    this.addMusic();
  }

  toggle() {
    this.counter = ++this.counter % 3;
    this.button.icon = this.state[this.counter];
    this.music.volume = 0.5 - (this.counter / 4);
  }

  subscribe() {
    this.gameCanvas.subscribeOnClick(this.button);
  }

  unsubscribe() {
    this.gameCanvas.unsubscribeClick(this.button);
  }
}
