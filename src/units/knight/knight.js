import Unit from '../../unit/unit';
import Sprite from '../../unit/sprite';

export default class Knight extends Unit {
  constructor(id, direction) {
    super({
      id,
      health: 15,
      damage: 4,
      criticalChance: 0.07,
      accuracy: 0.95,
      attackTime: 1500,
      rangeAttack: 24,
      timeToHit: 750,
      deathTime: 700,
      stepSize: 0.8,
      direction,
    });
    this.cost = 4;
    this.configureSprites();
  }

  configureSprites() {
    this.sprites.idle = new Sprite({
      url: `imgs/units/knight/knight-idle-${this.direction}.png`,
      frameWidth: 42,
      frameHeight: 40,
      numberOfFrames: 4,
      timeToFrame: 300,
      bodyXOffset: this.playersUnit ? 26 : 16,
    });

    this.sprites.walk = new Sprite({
      url: `imgs/units/knight/knight-walk-${this.direction}.png`,
      frameWidth: 42,
      frameHeight: 40,
      numberOfFrames: 8,
      timeToFrame: 150,
      bodyXOffset: this.playersUnit ? 26 : 16,
    });

    this.sprites.attack = new Sprite({
      url: `imgs/units/knight/knight-attack-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 40,
      numberOfFrames: 10,
      timeToFrame: 170,
      xOffset: this.playersUnit ? 0 : -38,
      bodyXOffset: this.playersUnit ? 26 : 16,
    });

    this.sprites.die = new Sprite({
      url: `imgs/units/knight/knight-die-${this.direction}.png`,
      frameWidth: 42,
      frameHeight: 40,
      numberOfFrames: 9,
      timeToFrame: 90,
      bodyXOffset: this.playersUnit ? 26 : 16,
    });
  }
}
