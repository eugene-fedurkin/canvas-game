// import levels from '../levels/levels';
import UnitFactory from '../unit-factory/unit-factory';
import Queue from '../queue/queue';
import defaults from './constants';

export class State {
    constructor() {
        this.isPaused = false;
        this.currentScene = null;
        this.scenes = {
            menu: {
                instance: null,
                backgroundSprite: null,
                cloudsImage: null,
                cloudsOffsetX: 0,
                belt: null,
                beltY: -720,
                menuSheet: null,
                menuSheetY: -550,
                aboutSheet: null,
                aboutSheetY: -680,
                aboutSheetVisible: false,
                velocity: 0,
                angle: 0.01,
                gravity: -9.80665,
                acceleration: null
            },
            game: {
                instance: null,
                enemiesSpawnX: defaults.enemiesSpawnX,
                alliesSpawnX: defaults.alliesSpawnX,
                isPauseGame: null,
                isDemo: null,
                money: null,
                pastMoney: null,
                numberOfLevels: null,
                currentLevel: {
                    levelNumber: null,
                    background: null,
                    groundLevelY: null,
                    allies: null,
                    enemies: null
                },
            },
            statistic: {
                instance: null,
                background: null,
                timeSpent: 0,
                levelsFailed: 0,
                totalDamage: 0,
                receivedDamage: 0,
                earnedMoney: defaults.startMoney,
                healedHp: 0
            }
        };
    }

    reset() {
        this.scenes.game.money = defaults.startMoney;
        this.scenes.game.pastMoney = defaults.startMoney;
        this.scenes.statistic.timeSpent = 0;
        this.scenes.statistic.levelsFailed = 0;
        this.scenes.statistic.totalDamage = 0;
        this.scenes.statistic.receivedDamage = 0;
        this.scenes.statistic.earnedMoney = defaults.startMoney;
        this.scenes.statistic.healedHp = 0;
    }
}