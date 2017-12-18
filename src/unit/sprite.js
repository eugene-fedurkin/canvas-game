export default class Sprite {
  constructor(options) {
    if (!options) throw new Error('No sprite options');

    this.image = new Image();
    this.image.src = options.url;

    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.numberOfFrames = options.numberOfFrames;
    this.timeToFrame = options.timeToFrame || 100;
    this.xOffset = options.xOffset || 0;
    this.attackXOffset = options.attackXOffset || 0;
    this.bodyXOffset = options.bodyXOffset;
    
    this.preloader = options.preloader;
    // if (this.preloder) this.preloader.load(this.image);
    // Y offset
    
    this.currentTick = 0;
    this.currentImageIndex = 0;
  }

  tick(timestamp, prevTimestamp) {
    this.currentTick += Number((timestamp - prevTimestamp).toFixed(2));
    if (this.currentTick > this.timeToFrame * this.currentImageIndex) {
      this.nextFrame();
    }
  }

  nextFrame() {
    if (this.currentImageIndex === this.numberOfFrames - 1) {
      this.reset();
    } else {
      this.currentImageIndex++;
    }
  }

  getFrameX() {
    return this.frameWidth * this.currentImageIndex;
  }

  reset() {
    this.currentTick = 0;
    this.currentImageIndex = 0;
  }
}