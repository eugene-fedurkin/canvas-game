import Unit from '../../unit/unit';
import Sprite from '../../unit/sprite';

export default class Bandit extends Unit {
  constructor(id, direction) {
    super({
      id,
      health: 7,
      damage: 2,
      attackTime: 600,
      rangeAttack: 15,
      criticalChance: 0.04,
      accuracy: 0.96,
      timeToHit: 300,
      deathTime: 1900,
      stepSize: 0.6,
      direction,
      idleTime: 1000,
    });
    this.cost = 3;
    this.configureSprites();
  }

  configureSprites() {
    this.sprites.idle = new Sprite({
      url: `imgs/units/bandit/bandit-idle-${this.direction}.png`,
      frameWidth: 30,
      frameHeight: 27,
      numberOfFrames: 6,
      timeToFrame: 160,
      bodyXOffset: this.playersUnit ? 19 : 11,
    });

    this.sprites.walk = new Sprite({
      url: `imgs/units/bandit/bandit-run-${this.direction}.png`,
      frameWidth: 30,
      frameHeight: 27,
      numberOfFrames: 5,
      timeToFrame: 130,
      bodyXOffset: this.playersUnit ? 19 : 11,
    });

    this.sprites.attack = new Sprite({
      url: `imgs/units/bandit/bandit-attack-${this.direction}.png`,
      frameWidth: 30,
      frameHeight: 25,
      numberOfFrames: 7,
      timeToFrame: 130,
      bodyXOffset: this.playersUnit ? 19 : 11,
    });

    this.sprites.die = new Sprite({
      url: `imgs/units/bandit/bandit-death-${this.direction}.png`,
      frameWidth: 30,
      frameHeight: 25,
      numberOfFrames: 6,
      timeToFrame: 400,
      bodyXOffset: this.playersUnit ? 19 : 11,
    });
  }
}
