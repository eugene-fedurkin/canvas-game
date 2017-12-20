import Unit from '../../unit/unit';
import Sprite from '../../unit/sprite';

export default class Blob extends Unit {
  constructor(id, direction) {
    super({
      id,
      health: 3,
      damage: 4,
      attackTime: 1200,
      rangeAttack: 27,
      criticalChance: 0.04,
      accuracy: 0.93,
      timeToHit: 1100,
      deathTime: 1000,
      stepSize: 1,
      direction,
      idleTime: 1000,
    });
    this.cost = 2;
    this.configureSprites();
  }

  configureSprites() {
    this.sprites.idle = new Sprite({
      url: `imgs/units/blob/blob-idle-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 23,
      numberOfFrames: 3,
      timeToFrame: 250,
      bodyXOffset: this.playersUnit ? 49 : 31,
    });

    this.sprites.walk = new Sprite({
      url: `imgs/units/blob/blob-move-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 50,
      numberOfFrames: 8,
      timeToFrame: 112,
      bodyXOffset: this.playersUnit ? 49 : 31,
    });

    this.sprites.attack = new Sprite({
      url: `imgs/units/blob/blob-attack-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 33,
      numberOfFrames: 10,
      timeToFrame: 130,
      bodyXOffset: this.playersUnit ? 49 : 31,
    });

    this.sprites.die = new Sprite({
      url: `imgs/units/blob/blob-death-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 54,
      numberOfFrames: 8,
      timeToFrame: 155,
      bodyXOffset: this.playersUnit ? 49 : 31,
    });
  }
}
