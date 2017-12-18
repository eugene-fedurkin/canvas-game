import Unit from '../../unit/unit';
import Sprite from '../../unit/sprite';

export default class Rogue extends Unit {
    constructor(id, direction) {
        super({
            id: id,
            health: 10,
            damage: 2,
            attackTime: 1000,
            rangeAttack: 40,
            timeToHit: 800,
            deathTime: 1000,
            stepSize: 1,
            direction: direction,
            idleTime: 1000
        });
        this.cost = 2;
        this.configureSprites();
    }
    configureSprites() {
        this.sprites.idle = new Sprite({
            url: `imgs/units/rogue/rogue-idle-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 21,
            numberOfFrames: 3,
            timeToFrame: 200,
            bodyXOffset: this.playersUnit ? 13 : 7
        });

        this.sprites.walk = new Sprite({
            url: `imgs/units/rogue/rogue-run-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 23,
            numberOfFrames: 6,
            timeToFrame: 112,
            bodyXOffset: this.playersUnit ? 13 : 7
        });

        this.sprites.attack = new Sprite({
            url: `imgs/units/rogue/rogue-attack-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 23,
            numberOfFrames: 10,
            timeToFrame: 112,
            bodyXOffset: this.playersUnit ? 13 : 7
        });

        this.sprites.die = new Sprite({
            url: `imgs/units/rogue/rogue-death-${this.direction}.png`,
            frameWidth: 33,
            frameHeight: 21,
            numberOfFrames: 9,
            timeToFrame: 50,
            bodyXOffset: this.playersUnit ? 13 : 7
        });
    }
}