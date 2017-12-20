import Unit from '../../unit/unit';
import Sprite from '../../unit/sprite';

export default class CountryKnight extends Unit {
  constructor(id, direction) {
    super({
      id,
      health: 10,
      damage: 1,
      attackTime: 500,
      rangeAttack: 19,
      criticalChance: 0.05,
      accuracy: 0.92,
      timeToHit: 400,
      deathTime: 1000,
      stepSize: 1.5,
      direction,
      idleTime: 1000,
    });
    this.cost = 3;
    this.configureSprites();
  }

  configureSprites() {
    this.sprites.idle = new Sprite({
      url: `imgs/units/country-knight/country-knight-idle-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 39,
      numberOfFrames: 6,
      timeToFrame: 200,
      bodyXOffset: this.playersUnit ? 38 : 26,
    });

    this.sprites.walk = new Sprite({
      url: `imgs/units/country-knight/country-knight-run-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 45,
      numberOfFrames: 8,
      timeToFrame: 112,
      bodyXOffset: this.playersUnit ? 38 : 26,
    });

    this.sprites.attack = new Sprite({
      url: `imgs/units/country-knight/country-knight-attack-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 42,
      numberOfFrames: 4,
      timeToFrame: 200,
      bodyXOffset: this.playersUnit ? 38 : 26,
    });

    this.sprites.die = new Sprite({
      url: `imgs/units/country-knight/country-knight-die-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 45,
      numberOfFrames: 8,
      timeToFrame: 155,
      bodyXOffset: this.playersUnit ? 38 : 26,
    });
  }
}
