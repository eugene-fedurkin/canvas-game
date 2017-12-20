import Unit from '../../unit/unit';
import Sprite from '../../unit/sprite';

export default class Rogue extends Unit {
  constructor(id, direction) {
    super({
      id,
      health: 10,
      damage: 2,
      attackTime: 1000,
      rangeAttack: 40,
      criticalChance: 0.1,
      accuracy: 0.96,
      timeToHit: 800,
      deathTime: 1000,
      stepSize: 1,
      direction,
      idleTime: 1000,
    });
    this.cost = 3;
    this.configureSprites();
  }

  configureSprites() {
    this.sprites.idle = new Sprite({
      url: `imgs/units/rogue/rogue-idle-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 21,
      numberOfFrames: 3,
      timeToFrame: 200,
      bodyXOffset: this.playersUnit ? 13 : 43,
    });

    this.sprites.walk = new Sprite({
      url: `imgs/units/rogue/rogue-run-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 23,
      numberOfFrames: 6,
      timeToFrame: 112,
      bodyXOffset: this.playersUnit ? 13 : 43,
    });

    this.sprites.attack = new Sprite({
      url: `imgs/units/rogue/rogue-attack-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 23,
      numberOfFrames: 10,
      timeToFrame: 112,
      bodyXOffset: this.playersUnit ? 13 : 43,
    });

    this.sprites.die = new Sprite({
      url: `imgs/units/rogue/rogue-death-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 21,
      numberOfFrames: 9,
      timeToFrame: 130,
      bodyXOffset: this.playersUnit ? 13 : 43,
    });
  }
}
