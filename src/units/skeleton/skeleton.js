import Unit from '../../unit/unit';
import Sprite from '../../unit/sprite';

export default class Skeleton extends Unit {
  constructor(id, direction) {
    super({
      id,
      health: 8,
      damage: 2,
      attackTime: 2142,
      rangeAttack: 23,
      criticalChance: 0.07,
      accuracy: 0.93,
      timeToHit: 952,
      deathTime: 1900,
      stepSize: 0.6,
      direction,
      idleTime: 1000,
    });
    this.cost = 2;
    this.configureSprites();
  }

  configureSprites() {
    this.sprites.idle = new Sprite({
      url: `imgs/units/skeleton/skeleton-idle-${this.direction}.png`,
      frameWidth: 24,
      frameHeight: 32,
      numberOfFrames: 11,
      timeToFrame: 200,
      bodyXOffset: this.playersUnit ? 13 : 10,
    });

    this.sprites.walk = new Sprite({
      url: `imgs/units/skeleton/skeleton-walk-${this.direction}.png`,
      frameWidth: 24,
      frameHeight: 33,
      numberOfFrames: 13,
      timeToFrame: 90,
      bodyXOffset: this.playersUnit ? 13 : 10,
    });

    this.sprites.attack = new Sprite({
      url: `imgs/units/skeleton/skeleton-attack-${this.direction}.png`,
      frameWidth: 43,
      frameHeight: 37,
      numberOfFrames: 18,
      timeToFrame: 125,
      xOffset: this.playersUnit ? 0 : -16,
      bodyXOffset: this.playersUnit ? 13 : 10,
    });

    this.sprites.die = new Sprite({
      url: `imgs/units/skeleton/skeleton-die-${this.direction}.png`,
      frameWidth: 33,
      frameHeight: 32,
      numberOfFrames: 15,
      timeToFrame: 150,
      bodyXOffset: this.playersUnit ? 13 : 10,
    });
  }
}
