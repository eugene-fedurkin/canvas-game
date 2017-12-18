import Unit from '../../unit/unit';
import Sprite from '../../unit/sprite';
import Actions from '../../unit/actions';
import Direction from '../../unit/direction';

export default class Wizard extends Unit {
    constructor(id, direction) {
        super({
            id: id,
            health: 20,
            damage: 1,
            attackTime: 1500,
            rangeAttack: 28,
            timeToHit: 1000,
            deathTime: 1900,
            stepSize: 0.4,
            direction: direction,
            idleTime: 1000
        });
        this.healthToHeal = 1;
        this.cost = 3;
        this.configureSprites();
    }

    configureSprites() {
        this.sprites.idle = new Sprite({
            url: `imgs/units/wizard/wizard-idle-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 80,
            numberOfFrames: 10,
            timeToFrame: 200,
            bodyXOffset: this.playersUnit ? 49 : 21
        });

        this.sprites.walk = new Sprite({
            url: `imgs/units/wizard/wizard-run-${this.direction}.png`,
            frameWidth: 70,
            frameHeight: 56,
            numberOfFrames: 5,
            timeToFrame: 250,
            bodyXOffset: this.playersUnit ? 49 : 21
        });

        this.sprites.attack = new Sprite({
            url: `imgs/units/wizard/wizard-attack-${this.direction}.png`,
            frameWidth: 100,
            frameHeight: 57,
            numberOfFrames: 9,
            timeToFrame: 180,
            xOffset: -14,
            bodyXOffset: this.playersUnit ? 49 : 21
        });

        this.sprites.die = new Sprite({
            url: `imgs/units/wizard/wizard-death-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 80,
            numberOfFrames: 10,
            timeToFrame: 250,
            bodyXOffset: this.playersUnit ? 49 : 21
        });
        this.sprites.heal = new Sprite({
            url: `imgs/units/wizard/wizard-heal-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 80,
            numberOfFrames: 10,
            timeToFrame: 250,
            bodyXOffset: this.playersUnit ? 49 : 21
        });
    }

    doAction(state, timestamp) {
        if (this.health <= 0) {
            this.die(state, timestamp);
        } else if (this.currentAction === Actions.idle
            && timestamp - this.previousActionTimestamp < this.idleTime) {
            return;
        } else if (this.isInFrontOfAlly(state) && this.isUnitRange(state)) {
            this.heal(state, timestamp);
        } else if (this.isInFrontOfAlly(state) || state.isPauseGame
            || this.isInFrontOfEnemy(state) && this.isEnemyDying(state)) {
            this.idle(state, timestamp);
        } else if (this.isInFrontOfEnemy(state)) {
            this.attack(state, timestamp);
        } else {
            this.step(state, timestamp);
        }
    }

    heal(state, timestamp) {
        if (this.currentAction !== Actions.heal) {
            this.currentAction = Actions.heal;
            this.previousActionTimestamp = timestamp;
            this.sprites.heal.reset();
            this.updateY(state);
        }
        const healTime = this.attackTime;
        const targetUnit = this.playersUnit ? state.currentLevel.allies[0]
            : state.currentLevel.enemies[0];
        if (timestamp - this.previousActionTimestamp > healTime 
            && targetUnit.health > 0) {

            targetUnit.health += this.healthToHeal;

            const positionX = targetUnit.x 
                + targetUnit.getCurrentSprite().frameWidth / 2;
            this.floatingText.add({
                text: this.healthToHeal,
                positionX: positionX,
                positionY: targetUnit.y,
                action: Actions.heal,
            });

            if (this.playersUnit) {
                state.instance.state.scenes.statistic.healedHp += this.healthToHeal;
            }

            this.previousActionTimestamp = timestamp;
        }
    }

    isUnitRange(state) {
        const targetUnit = this.playersUnit ? state.currentLevel.allies[0]
            : state.currentLevel.enemies[0];

        return Math.abs(this.x - targetUnit.x) < 120;
    }

    getCurrentSprite() {
        switch (this.currentAction) {
            case Actions.step: return this.sprites.walk;
            case Actions.attack: return this.sprites.attack;
            case Actions.die: return this.sprites.die;
            case Actions.heal: return this.sprites.heal;
            default: return this.sprites.idle;
        }
    }
}