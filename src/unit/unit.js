import Actions from './actions';
import Sprite from './sprite';
import Sprites from './sprites';
import Direction from './direction';
import FloatingText from '../floating-text/floating-text';

export default class Unit {
    constructor(unitInfo) {
        if (!unitInfo) throw new Error('No unit info');

        this.id = unitInfo.id;
        this.health = unitInfo.health;
        this.damage = unitInfo.damage;
        this.rangeAttack = unitInfo.rangeAttack || 0; // TODO: change!
        this.idleTime = unitInfo.idleTime || 2000;
        this.attackTime = unitInfo.attackTime;
        this.timeToHit = unitInfo.timeToHit;
        this.deathTime = unitInfo.deathTime;
        this.stepSize = unitInfo.stepSize;
        this.direction = unitInfo.direction;
        this.render = { // TODO: mb useless
            width: unitInfo.width,
            height: unitInfo.height,
            fullWidth: unitInfo.fullWidth
        };

        this.sprites = new Sprites();
        this.floatingText = FloatingText.getSingletonInstance();

        this.playersUnit = this.direction === Direction.right 
            ? true
            : false;
        this.weaponIdBuff = [];
        this.armorIdBuff = [];
        this.wasHit = false;
        this.previousActionTimestamp = null;
        this.currentAction = null;
        this.x = null;
        this.y = null;
    }

    getCurrentSprite() {
        switch (this.currentAction) {
            case Actions.step: return this.sprites.walk;
            case Actions.attack: return this.sprites.attack;
            case Actions.die: return this.sprites.die;
            default: return this.sprites.idle;
        }
    }

    doAction(state, timestamp) {
        if (this.health <= 0) {
            this.die(state, timestamp);
        } else if (this.currentAction === Actions.idle
            && timestamp - this.previousActionTimestamp < this.idleTime) {
            return;
        } else if (this.isInFrontOfAlly(state) || state.isPauseGame 
            || this.isInFrontOfEnemy(state) && this.isEnemyDying(state)) {
            this.idle(state, timestamp);
        } else if (this.isInFrontOfEnemy(state)) {
            this.attack(state, timestamp);
        } else {
            this.step(state, timestamp);
        }
    }

    //#region actions

    step(state, timestamp) {
        if (this.currentAction !== Actions.step) {
            this.currentAction = Actions.step;
            this.previousActionTimestamp = timestamp;
            this.sprites.walk.reset();
            this.updateY(state);
        } else if (this.direction === Direction.right) {
            this.x += this.stepSize;
        } else {
            this.x -= this.stepSize;
        }
    }

    idle(state, timestamp) {
        if (this.currentAction !== Actions.idle) {
            this.currentAction = Actions.idle;
            this.previousActionTimestamp = timestamp;
            this.sprites.idle.reset();
            this.updateY(state);
        }
    }

    attack(state, timestamp) {
        if (this.currentAction !== Actions.attack) {
            this.currentAction = Actions.attack;
            this.previousActionTimestamp = timestamp;
            this.sprites.attack.reset();
            this.updateY(state);
        } else if (timestamp - this.previousActionTimestamp > this.timeToHit && !this.wasHit) {
            if (this.playersUnit) {
                state.currentLevel.enemies[0].health -= this.damage;

                const positionX = state.currentLevel.enemies[0].x 
                    + state.currentLevel.enemies[0].getCurrentSprite().bodyXOffset;

                this.floatingText.add({
                    text: this.damage,
                    positionX: positionX,
                    positionY: state.currentLevel.enemies[0].y,
                    action: Actions.attack,
                });
                state.instance.state.scenes.statistic.totalDamage++;
            } else {
                state.currentLevel.allies[0].health -= this.damage;

                const positionX = state.currentLevel.allies[0].x 
                    + state.currentLevel.allies[0].getCurrentSprite().bodyXOffset
                    + state.currentLevel.allies[0].getCurrentSprite().xOffset;

                this.floatingText.add({
                    text: this.damage,
                    positionX: positionX,
                    positionY: state.currentLevel.allies[0].y,
                    action: Actions.attack,
                });
                state.instance.state.scenes.statistic.receivedDamage++;
            }
            this.wasHit = true;
        } else if (timestamp - this.previousActionTimestamp > this.attackTime && this.wasHit) {
            this.previousActionTimestamp = timestamp;
            this.wasHit = false;
        }
    }

    die(state, timestamp) {
        if (this.currentAction !== Actions.die) {
            this.currentAction = Actions.die;
            this.previousActionTimestamp = timestamp;
            this.sprites.die.reset();
            this.updateY(state);
        } else if (timestamp - this.previousActionTimestamp > this.deathTime) {
            if (this.playersUnit) {
                state.currentLevel.allies.shift();
            } else {
                const bonusMoney = Math.floor(state.currentLevel.enemies[0].cost / 2);
                const positionX = state.currentLevel.enemies[0].x 
                + state.currentLevel.allies[0].getCurrentSprite().frameWidth / 2;

                state.money += bonusMoney;

                this.floatingText.add({
                    text: `$${bonusMoney}`,
                    positionX: positionX,
                    positionY: state.currentLevel.enemies[0].y,
                    action: Actions.die,
                });

                state.instance.state.scenes.statistic.earnedMoney += bonusMoney;
                state.currentLevel.enemies.shift();
            }
        }
    }

    //#endregion
    //#region helpers

    isInFrontOfEnemy(state) { // TODO: rewrite mb?
        if (this.playersUnit) {
            const opponent = state.currentLevel.enemies[0];
            return opponent && this.x + this.getCurrentSprite().bodyXOffset + this.rangeAttack >= opponent.x + opponent.getCurrentSprite().bodyXOffset;
        } else {
            const opponent = state.currentLevel.allies[0];
            return opponent && this.x + this.getCurrentSprite().bodyXOffset - this.rangeAttack <= opponent.x + opponent.getCurrentSprite().bodyXOffset;
        }
    }

    isEnemyDying(state) {
        if (this.playersUnit) return state.currentLevel.enemies[0].health <= 0;
        else return state.currentLevel.allies[0].health <= 0;
    }

    // getCenterOfBody() {
    //     return this.
    //     this.x + this.getCurrentSprite().frameWidth + this.getCurrentSprite().attackXOffset
    // }

    isInFrontOfAlly(state) {
        if (this.playersUnit) {
            const nextAlly = state.currentLevel.allies[this.getUnitPosition(state) - 1];
            return nextAlly && this.x + this.getCurrentSprite().frameWidth >= nextAlly.x;
        } else {
            const nextAlly = state.currentLevel.enemies[this.getUnitPosition(state) - 1];
            return nextAlly && this.x <= nextAlly.x + nextAlly.getCurrentSprite().frameWidth;
        }
    }

    getUnitPosition(state) {
        return this.playersUnit
            ? state.currentLevel.allies.findIndex(ally => ally.id === this.id)
            : state.currentLevel.enemies.findIndex(enemy => enemy.id === this.id);
    }

    updateY(state) {
        const unitHeight = this.getCurrentSprite().frameHeight;
        this.y = state.currentLevel.groundLevelY - unitHeight;
    }

    //#endregion
}