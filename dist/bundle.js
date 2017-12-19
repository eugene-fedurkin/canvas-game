/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 11);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Sprite {
  constructor(options) {
    if (!options) throw new Error('No sprite options');

    this.image = new Image();
    this.image.src = options.url;

    this.frameWidth = options.frameWidth;
    this.frameHeight = options.frameHeight;
    this.numberOfFrames = options.numberOfFrames;
    this.timeToFrame = options.timeToFrame || 100;
    this.xOffset = options.xOffset || 0;
    this.attackXOffset = options.attackXOffset || 0;
    this.bodyXOffset = options.bodyXOffset;
    
    this.preloader = options.preloader;
    // if (this.preloder) this.preloader.load(this.image);
    // Y offset
    
    this.currentTick = 0;
    this.currentImageIndex = 0;
  }

  tick(timestamp, prevTimestamp) {
    this.currentTick += Number((timestamp - prevTimestamp).toFixed(2));
    if (this.currentTick > this.timeToFrame * this.currentImageIndex) {
      this.nextFrame();
    }
  }

  nextFrame() {
    if (this.currentImageIndex === this.numberOfFrames - 1) {
      this.reset();
    } else {
      this.currentImageIndex++;
    }
  }

  getFrameX() {
    return this.frameWidth * this.currentImageIndex;
  }

  reset() {
    this.currentTick = 0;
    this.currentImageIndex = 0;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Sprite;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sprite__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__sprites__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__direction__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__floating_text_floating_text__ = __webpack_require__(9);






class Unit {
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

        this.sprites = new __WEBPACK_IMPORTED_MODULE_2__sprites__["a" /* default */]();
        this.floatingText = __WEBPACK_IMPORTED_MODULE_4__floating_text_floating_text__["a" /* default */].getSingletonInstance();

        this.playersUnit = this.direction === __WEBPACK_IMPORTED_MODULE_3__direction__["a" /* default */].right 
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
            case __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].step: return this.sprites.walk;
            case __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].attack: return this.sprites.attack;
            case __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].die: return this.sprites.die;
            default: return this.sprites.idle;
        }
    }

    doAction(state, timestamp) {
        if (this.health <= 0) {
            this.die(state, timestamp);
        } else if (this.currentAction === __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].idle
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
        if (this.currentAction !== __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].step) {
            this.currentAction = __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].step;
            this.previousActionTimestamp = timestamp;
            this.sprites.walk.reset();
            this.updateY(state);
        } else if (this.direction === __WEBPACK_IMPORTED_MODULE_3__direction__["a" /* default */].right) {
            this.x += this.stepSize;
        } else {
            this.x -= this.stepSize;
        }
    }

    idle(state, timestamp) {
        if (this.currentAction !== __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].idle) {
            this.currentAction = __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].idle;
            this.previousActionTimestamp = timestamp;
            this.sprites.idle.reset();
            this.updateY(state);
        }
    }

    attack(state, timestamp) {
        if (this.currentAction !== __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].attack) {
            this.currentAction = __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].attack;
            this.previousActionTimestamp = timestamp;
            this.sprites.attack.reset();
            this.updateY(state);
        } else if (timestamp - this.previousActionTimestamp > this.timeToHit && !this.wasHit) {
            if (this.playersUnit) {
                state.currentLevel.enemies[0].health -= this.damage;

                const positionX = state.currentLevel.enemies[0].x 
                    + state.currentLevel.enemies[0].sprites.walk.bodyXOffset;

                this.floatingText.add({
                    text: this.damage,
                    positionX: positionX,
                    positionY: state.currentLevel.enemies[0].y,
                    action: __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].attack,
                });
                state.instance.state.scenes.statistic.totalDamage++;
            } else {
                state.currentLevel.allies[0].health -= this.damage;

                const positionX = state.currentLevel.allies[0].x 
                    + state.currentLevel.allies[0].sprites.walk.bodyXOffset;

                this.floatingText.add({
                    text: this.damage,
                    positionX: positionX,
                    positionY: state.currentLevel.allies[0].y,
                    action: __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].attack,
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
        if (this.currentAction !== __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].die) {
            this.currentAction = __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].die;
            this.previousActionTimestamp = timestamp;
            this.sprites.die.reset();
            this.updateY(state);
        } else if (timestamp - this.previousActionTimestamp > this.deathTime) {
            if (this.playersUnit) {
                state.currentLevel.allies.shift();
            } else {
                const bonusMoney = Math.floor(state.currentLevel.enemies[0].cost / 2);
                const positionX = state.currentLevel.enemies[0].x 
                + state.currentLevel.allies[0].sprites.walk.bodyXOffset;

                state.money += bonusMoney;

                this.floatingText.add({
                    text: `$${bonusMoney}`,
                    positionX: positionX,
                    positionY: state.currentLevel.enemies[0].y,
                    action: __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].die,
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Unit;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Button {
    constructor(options) {
        if (!options) throw new Error('Button options missing');

        this.x = options.x;
        this.y = options.y;
        this.height = options.height;
        this.width = options.width;
        this.iconUrl = options.iconUrl;
        this.clickHandler = options.clickHandler;

        if (options.iconUrl) {
            this.setIcon(options.iconUrl);
        } else {
            this.icon = null;
        }
    }

    setIcon(url) {
        const icon = new Image();
        icon.src = url;
        this.icon = icon;
    }

    render(context) {
        context.drawImage(this.icon, this.x, this.y);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Button;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Direction = {
  left: 'left',
  right: 'right'
};

/* harmony default export */ __webpack_exports__["a"] = (Direction);

/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__units_skeleton_skeleton__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__units_knight_knight__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__units_country_knight_country_knight__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__units_rogue_rogue__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__units_blob_blob__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__units_wizard_wizard__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__units_bandit_bandit__ = __webpack_require__(21);








class UnitFactory {
    constructor() {
        this.id = 0;
    }

    static getSingletonInstance() {
        if (!UnitFactory.instance) UnitFactory.instance = new UnitFactory();
        return UnitFactory.instance;
    }

    create(unitName, direction) {
        switch(unitName) {
            case 'skeleton': return new __WEBPACK_IMPORTED_MODULE_0__units_skeleton_skeleton__["a" /* default */](this.id++, direction);
            case 'knight': return new __WEBPACK_IMPORTED_MODULE_1__units_knight_knight__["a" /* default */](this.id++, direction);
            case 'country-knight': return new __WEBPACK_IMPORTED_MODULE_2__units_country_knight_country_knight__["a" /* default */](this.id++, direction);
            case 'rogue': return new __WEBPACK_IMPORTED_MODULE_3__units_rogue_rogue__["a" /* default */](this.id++, direction);
            case 'blob': return new __WEBPACK_IMPORTED_MODULE_4__units_blob_blob__["a" /* default */](this.id++, direction);
            case 'wizard': return new __WEBPACK_IMPORTED_MODULE_5__units_wizard_wizard__["a" /* default */](this.id++, direction);
            case 'bandit': return new __WEBPACK_IMPORTED_MODULE_6__units_bandit_bandit__["a" /* default */](this.id++, direction);
            default: throw Error('wrong name of unit!!!');
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UnitFactory;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Actions = {
  idle: 'idle',
  step: 'step',
  attack: 'attack',
  die: 'die',
  heal: 'heal'
};

/* harmony default export */ __webpack_exports__["a"] = (Actions);

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Queue {
    constructor(state) {
        this.state = state;
    }

    queueAlly(allies, ally) {
        let horizontalPosition = this.state.scenes.game.alliesSpawnX;

        if (!allies.length) {
            ally.x = horizontalPosition - 50;
            ally.y = this.state.scenes.game.groundLevelY;
        } else {
            allies.forEach(ally => {
                if (horizontalPosition > ally.x) 
                    horizontalPosition = ally.x;
            });

            ally.x = horizontalPosition - 50;
            ally.y = this.state.scenes.game.groundLevelY;
        }
    }

    queueEnemy(enemies, enemy) {
        let horizontalPosition = this.state.scenes.game.enemiesSpawnX;

        if (!enemies.length) {
            enemy.x = horizontalPosition;
            enemy.y = this.state.scenes.game.groundLevelY;
        } else {
            enemies.forEach(enemy => {
                if (horizontalPosition < enemy.x) 
                horizontalPosition = enemy.x;
            });

            enemy.x = horizontalPosition + 50;
            enemy.y = this.state.scenes.game.groundLevelY;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Queue;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class SceneBase {
  constructor(state, gameCanvas, music, preloder) {
    this.state = state;
    this.gameCanvas = gameCanvas;
    this.music = music;
    this.preloder = preloder;
  }

  frame(timestamp) {
    this.updateState(timestamp);
    this.render(timestamp);
  }

  updateState() {
    throw new Error('Not implemented.');
  }

  render() {
    throw new Error('Not implemented.');
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = SceneBase;


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const levels = [
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            { name: 'skeleton' },
            { name: 'skeleton' }
        ]
    },
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            { name: 'skeleton' },
            { name: 'country-knight' }
        ]
    },
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            { name: 'country-knight' },
            { name: 'bandit' },
            { name: 'skeleton' },
            { name: 'knight' },
            { name: 'wizard' },
        ]
    },
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            { name: 'skeleton' },
            { name: 'bandit' },
            { name: 'wizard' },
            { name: 'wizard' },
            { name: 'skeleton' },
            { name: 'skeleton' },
            { name: 'rogue' },
            { name: 'knight' }
        ]
    },
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            { name: 'knight' },
            { name: 'knight' },
            { name: 'rogue' },
            { name: 'wizard' },
            { name: 'wizard' },
            { name: 'country-knight' },
            { name: 'skeleton' },
            { name: 'skeleton' },
            { name: 'blob' },
            { name: 'skeleton' },
        ]
    },
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            { name: 'skeleton' },
            { name: 'skeleton' },
            { name: 'bandit' },
            { name: 'skeleton' },
            { name: 'rogue' },
            { name: 'wizard' },
            { name: 'knight' },
            { name: 'country-knight' },
            { name: 'blob' },
            { name: 'knight' },
            { name: 'bandit' },
            { name: 'knight' },
            { name: 'rogue' },
            { name: 'country-knight' },
            { name: 'bandit' },
            { name: 'knight' },
            { name: 'wizard' },
            { name: 'skeleton' },
        ]
    }
];

/* harmony default export */ __webpack_exports__["a"] = (levels);

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_actions__ = __webpack_require__(5);


class FloatingText {
    constructor(context) {
        this.context = context;
        this.state = [];
        this.shiftRight = false;
        this.shift = 0;
    }

    static getSingletonInstance(context) {
        if (!FloatingText.instance) FloatingText.instance = new FloatingText(context);
        return FloatingText.instance;
    }

    add(unit) {
        this.state.push({
            text: unit.text,
            positionX: unit.positionX,
            positionY: unit.positionY,
            action: unit.action,
            opacity: 1,
        });
    }

    render() {
        this.state.forEach(textParam => {
            this.context.save();
            this.context.font ='14px Pixelate';
            if (textParam.action === __WEBPACK_IMPORTED_MODULE_0__unit_actions__["a" /* default */].attack) {
                const redColor = `rgba(248, 22, 97, ${textParam.opacity})`
                this.context.fillStyle = redColor;
            } else if (textParam.action === __WEBPACK_IMPORTED_MODULE_0__unit_actions__["a" /* default */].heal) {
                const greenColor = `rgba(117, 248, 48, ${textParam.opacity})`
                this.context.fillStyle = greenColor;
            } else {
                const white = `rgba(255, 255, 255, ${textParam.opacity})`
                this.context.fillStyle = white;
            }
            this.context.fillText(`${textParam.text}`, textParam.positionX, textParam.positionY);
            this.context.restore();
        });
    }

    updatePosition() {
        this.state.forEach(text => {
            if (text.opacity <= 0) {
                const index = this.state.findIndex(currentDamage => currentDamage === text);
                this.state.splice(index, 1);
            } else {
                text.positionX += this.shift;
                text.positionY -= 0.7;
                text.opacity -= 0.01;
            }
        });
        this.tick();
    }

    tick() {
        if (this.shift >= 0.5) this.shiftRight = false;
        else if (this.shift <= -0.5) this.shiftRight = true;
        this.shiftRight ? this.shift += 0.03 : this.shift -= 0.03;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FloatingText;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Dialog {
    constructor(context) {
        this.context = context;
        this.opacity = 0;
        this.close();
    }

    open(message, messageX, buttons) {
        this.message = message;
        this.messageX = messageX;
        this.buttons = buttons;
        this.isOpened = true;
        this.fadeIn = true;
    }

    close() {
        this.isOpened = false;
        this.fadeIn = false;
    }

    render() {
        if (!this.isOpened && this.opacity <= 0.1) return;

        if (!this.fadeIn) {
            if (this.opacity > 0.1) {
                this.opacity -= 0.03;
                this.context.save();
                this.context.globalAlpha = this.opacity;
                this.context.fillText(this.message, this.messageX , 200);
                this.buttons.forEach(button => button.render(this.context));
                this.context.restore();
            } else {
                this.message = '';
                this.messageX = 0;
                this.buttons = [];
            }
            return;
        } else {
            if (this.opacity <= 1) this.opacity += 0.01;
            this.context.save();
            this.context.globalAlpha = this.opacity;
            this.context.fillText(this.message, this.messageX , 200);
            this.buttons.forEach(button => button.render(this.context));
            this.context.restore();
        }
    }

    reset() {
        this.close();
        this.opacity = 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Dialog;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_canvas_game_canvas__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state_state__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scenes_menu_scene__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scenes_game_scene__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__music_music__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scenes_statistic__ = __webpack_require__(30);







window.onload = function() {
    const state = new __WEBPACK_IMPORTED_MODULE_1__state_state__["a" /* State */]();
    const gameCanvas = new __WEBPACK_IMPORTED_MODULE_0__game_canvas_game_canvas__["a" /* GameCanvas */]();
    const music = new __WEBPACK_IMPORTED_MODULE_4__music_music__["a" /* default */](gameCanvas);
    // const preloder = new Preloader(state, gameCanvas);
    const menuScene = new __WEBPACK_IMPORTED_MODULE_2__scenes_menu_scene__["a" /* MenuScene */](state, gameCanvas, music);
    const gameScene = new __WEBPACK_IMPORTED_MODULE_3__scenes_game_scene__["a" /* GameScene */](state, gameCanvas, music);
    const statisticScene = new __WEBPACK_IMPORTED_MODULE_5__scenes_statistic__["a" /* default */](state, gameCanvas, music);

    // state.scenes.menu.instance = preloder;
    state.scenes.menu.instance = menuScene;
    state.scenes.game.instance = gameScene;
    state.scenes.statistic.instance = statisticScene;
    state.currentScene = menuScene;

    (function frame(timestamp) {
        state.currentScene.frame(timestamp);
        requestAnimationFrame(frame);
    })();
}

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class GameCanvas {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas';
        this.canvas.width = 1100;
        this.canvas.height = 700;
        this.context = this.canvas.getContext('2d');
        this.context.font ='30px Pixelate';
        this.context.fillStyle = 'white';

        this.clickSubscribers = []; 

        document.body.appendChild(this.canvas);
        this.canvas.addEventListener('click', () => this.executeClickHandlers());
        this.canvas.addEventListener('mousemove', () => this.changeMouse());
    }

    subscribeOnClick(...subscribers) {
        subscribers.forEach(subscriber => {
            this.clickSubscribers.push(subscriber);
        });
    }

    unsubscribeClick(subscriber) {
        if (subscriber) {
            const index = this.clickSubscribers.indexOf(subscriber);
            if (index >= 0) {
                this.clickSubscribers.splice(index, 1);
            }
        } else {
            this.clickSubscribers = [];
        }
    }

    executeClickHandlers() {
        const x = event.clientX - this.canvas.getBoundingClientRect().left;
        const y = event.clientY - this.canvas.getBoundingClientRect().top;
        this.clickSubscribers.forEach(subscriber => {
            const clickedInsideSubscriber = subscriber.x <= x
                && subscriber.x + subscriber.width >= x
                && subscriber.y <= y 
                && subscriber.y + subscriber.height >= y;

            if (clickedInsideSubscriber) subscriber.clickHandler();
        });
    }

    changeMouse() {
        const x = event.clientX - this.canvas.getBoundingClientRect().left;
        const y = event.clientY - this.canvas.getBoundingClientRect().top;
        const isHover = this.clickSubscribers.some(subscriber => {
            return subscriber.x <= x
                && subscriber.x + subscriber.width >= x
                && subscriber.y <= y 
                && subscriber.y + subscriber.height >= y;
        });

        if (isHover) document.getElementById('canvas').style.cursor = 'url("imgs/UI/cursor.png"), auto';
        else document.getElementById('canvas').style.cursor = 'default';
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameCanvas;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_factory_unit_factory__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__queue_queue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__constants__ = __webpack_require__(22);
// import levels from '../levels/levels';




class State {
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
                enemiesSpawnX: __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* default */].enemiesSpawnX,
                alliesSpawnX: __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* default */].alliesSpawnX,
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
                earnedMoney: __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* default */].startMoney,
                healedHp: 0
            }
        };
    }

    reset() {
        this.scenes.game.money = __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* default */].startMoney;
        this.scenes.game.pastMoney = __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* default */].startMoney;
        this.scenes.statistic.timeSpent = 0;
        this.scenes.statistic.levelsFailed = 0;
        this.scenes.statistic.totalDamage = 0;
        this.scenes.statistic.receivedDamage = 0;
        this.scenes.statistic.earnedMoney = __WEBPACK_IMPORTED_MODULE_2__constants__["a" /* default */].startMoney;
        this.scenes.statistic.healedHp = 0;
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = State;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Skeleton extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
    constructor(id, direction) {
        super({
            id: id,
            health: 8,
            damage: 2,
            attackTime: 2142,
            rangeAttack: 23,
            timeToHit: 952,
            deathTime: 1900,
            stepSize: 0.6,
            direction: direction,
            idleTime: 1000
        });
        this.cost = 2;
        this.configureSprites();
    }

    configureSprites() {
        this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/skeleton/skeleton-idle-${this.direction}.png`,
            frameWidth: 24,
            frameHeight: 32,
            numberOfFrames: 11,
            timeToFrame: 200,
            bodyXOffset: this.playersUnit ? 13 : 10
        });

        this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/skeleton/skeleton-walk-${this.direction}.png`,
            frameWidth: 24,
            frameHeight: 33,
            numberOfFrames: 13,
            timeToFrame: 90,
            bodyXOffset: this.playersUnit ? 13 : 10
        });

        this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/skeleton/skeleton-attack-${this.direction}.png`,
            frameWidth: 43,
            frameHeight: 37,
            numberOfFrames: 18,
            timeToFrame: 125,
            xOffset: this.playersUnit ? 0 : -16,
            bodyXOffset: this.playersUnit ? 13 : 10
        });

        this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/skeleton/skeleton-die-${this.direction}.png`,
            frameWidth: 33,
            frameHeight: 32,
            numberOfFrames: 15,
            timeToFrame: 150,
            bodyXOffset: this.playersUnit ? 13 : 10
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Skeleton;


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Sprites {
  constructor() {
    this.idle = null;
    this.walk = null;
    this.attack = null;
    this.die = null;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Sprites;


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Knight extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
    constructor(id, direction) {
        super({
            id: id,
            health: 15,
            damage: 4,
            attackTime: 1500,
            rangeAttack: 24,
            timeToHit: 750,
            deathTime: 700,
            stepSize: 0.8,
            direction: direction,
        });
        this.cost = 4;
        this.configureSprites();
    }

    configureSprites() {
        this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/knight/knight-idle-${this.direction}.png`,
            frameWidth: 42,
            frameHeight: 40,
            numberOfFrames: 4,
            timeToFrame: 300,
            bodyXOffset: this.playersUnit ? 26 : 16
        });

        this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/knight/knight-walk-${this.direction}.png`,
            frameWidth: 42,
            frameHeight: 40,
            numberOfFrames: 8,
            timeToFrame: 150,
            bodyXOffset: this.playersUnit ? 26 : 16
        });

        this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/knight/knight-attack-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 40,
            numberOfFrames: 10,
            timeToFrame: 170,
            xOffset: this.playersUnit ? 0 : -38,
            bodyXOffset: this.playersUnit ? 26 : 16
        });

        this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/knight/knight-die-${this.direction}.png`,
            frameWidth: 42,
            frameHeight: 40,
            numberOfFrames: 9,
            timeToFrame: 90,
            bodyXOffset: this.playersUnit ? 26 : 16
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Knight;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class CountryKnight extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
    constructor(id, direction) {
        super({
            id: id,
            health: 10,
            damage: 1,
            attackTime: 500,
            rangeAttack: 19,
            timeToHit: 400,
            deathTime: 1000,
            stepSize: 1.5,
            direction: direction,
            idleTime: 1000
        });
        this.cost = 3;
        this.configureSprites();
    }
    configureSprites() {
        this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/country-knight/country-knight-idle-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 39,
            numberOfFrames: 6,
            timeToFrame: 200,
            bodyXOffset: this.playersUnit ? 38 : 26
        });

        this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/country-knight/country-knight-run-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 45,
            numberOfFrames: 8,
            timeToFrame: 112,
            bodyXOffset: this.playersUnit ? 38 : 26
        });

        this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/country-knight/country-knight-attack-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 42,
            numberOfFrames: 4,
            timeToFrame: 200,
            bodyXOffset: this.playersUnit ? 38 : 26
        });

        this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/country-knight/country-knight-die-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 45,
            numberOfFrames: 8,
            timeToFrame: 155,
            bodyXOffset: this.playersUnit ? 38 : 26
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CountryKnight;


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Rogue extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
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
        this.cost = 3;
        this.configureSprites();
    }

    configureSprites() {
        this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/rogue/rogue-idle-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 21,
            numberOfFrames: 3,
            timeToFrame: 200,
            bodyXOffset: this.playersUnit ? 13 : 7
        });

        this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/rogue/rogue-run-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 23,
            numberOfFrames: 6,
            timeToFrame: 112,
            bodyXOffset: this.playersUnit ? 13 : 7
        });

        this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/rogue/rogue-attack-${this.direction}.png`,
            frameWidth: 64,
            frameHeight: 23,
            numberOfFrames: 10,
            timeToFrame: 112,
            bodyXOffset: this.playersUnit ? 13 : 7
        });

        this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/rogue/rogue-death-${this.direction}.png`,
            frameWidth: 33,
            frameHeight: 21,
            numberOfFrames: 9,
            timeToFrame: 130,
            bodyXOffset: this.playersUnit ? 13 : 7
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Rogue;


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Blob extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
    constructor(id, direction) {
        super({
            id: id,
            health: 3,
            damage: 4,
            attackTime: 1200,
            rangeAttack: 27,
            timeToHit: 1100,
            deathTime: 1000,
            stepSize: 1,
            direction: direction,
            idleTime: 1000
        });
        this.cost = 2;
        this.configureSprites();
    }
    configureSprites() {
        this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/blob/blob-idle-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 23,
            numberOfFrames: 3,
            timeToFrame: 250,
            bodyXOffset: this.playersUnit ? 49 : 31
        });

        this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/blob/blob-move-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 50,
            numberOfFrames: 8,
            timeToFrame: 112,
            bodyXOffset: this.playersUnit ? 49 : 31
        });

        this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/blob/blob-attack-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 33,
            numberOfFrames: 10,
            timeToFrame: 130,
            bodyXOffset: this.playersUnit ? 49 : 31
        });

        this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/blob/blob-death-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 54,
            numberOfFrames: 8,
            timeToFrame: 155,
            bodyXOffset: this.playersUnit ? 49 : 31
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Blob;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__unit_actions__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__unit_direction__ = __webpack_require__(3);





class Wizard extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
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
        this.healRange = 120;
        this.cost = 3;
        this.configureSprites();
    }

    configureSprites() {
        this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/wizard/wizard-idle-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 80,
            numberOfFrames: 10,
            timeToFrame: 200,
            bodyXOffset: this.playersUnit ? 49 : 21
        });

        this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/wizard/wizard-run-${this.direction}.png`,
            frameWidth: 70,
            frameHeight: 56,
            numberOfFrames: 5,
            timeToFrame: 250,
            bodyXOffset: this.playersUnit ? 49 : 21
        });

        this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/wizard/wizard-attack-${this.direction}.png`,
            frameWidth: 100,
            frameHeight: 57,
            numberOfFrames: 9,
            timeToFrame: 180,
            xOffset: -14,
            bodyXOffset: this.playersUnit ? 49 : 21
        });

        this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/wizard/wizard-death-${this.direction}.png`,
            frameWidth: 80,
            frameHeight: 80,
            numberOfFrames: 10,
            timeToFrame: 250,
            bodyXOffset: this.playersUnit ? 49 : 21
        });
        this.sprites.heal = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
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
        } else if (this.currentAction === __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].idle
            && timestamp - this.previousActionTimestamp < this.idleTime) {
            return;
        } else if (this.isInFrontOfAlly(state) && this.isUnitRange(state) && !state.isPauseGame) {
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
        if (this.currentAction !== __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].heal) {
            this.currentAction = __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].heal;
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
                + targetUnit.sprites.walk.bodyXOffset;
            this.floatingText.add({
                text: this.healthToHeal,
                positionX: positionX,
                positionY: targetUnit.y,
                action: __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].heal,
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

        return Math.abs(this.x - targetUnit.x) < this.healRange;
    }

    getCurrentSprite() {
        switch (this.currentAction) {
            case __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].step: return this.sprites.walk;
            case __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].attack: return this.sprites.attack;
            case __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].die: return this.sprites.die;
            case __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].heal: return this.sprites.heal;
            default: return this.sprites.idle;
        }
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Wizard;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Bandit extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
    constructor(id, direction) {
        super({
            id: id,
            health: 7,
            damage: 2,
            attackTime: 600,
            rangeAttack: 15,
            timeToHit: 300,
            deathTime: 1900,
            stepSize: 0.6,
            direction: direction,
            idleTime: 1000
        });
        this.cost = 3;
        this.configureSprites();
    }

    configureSprites() {
        this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/bandit/bandit-idle-${this.direction}.png`,
            frameWidth: 30,
            frameHeight: 27,
            numberOfFrames: 6,
            timeToFrame: 160,
            bodyXOffset: this.playersUnit ? 19 : 11
        });

        this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/bandit/bandit-run-${this.direction}.png`,
            frameWidth: 30,
            frameHeight: 27,
            numberOfFrames: 5,
            timeToFrame: 130,
            bodyXOffset: this.playersUnit ? 19 : 11
        });

        this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/bandit/bandit-attack-${this.direction}.png`,
            frameWidth: 30,
            frameHeight: 25,
            numberOfFrames: 7,
            timeToFrame: 130,
            bodyXOffset: this.playersUnit ? 19 : 11
        });

        this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
            url: `imgs/units/bandit/bandit-death-${this.direction}.png`,
            frameWidth: 30,
            frameHeight: 25,
            numberOfFrames: 6,
            timeToFrame: 400,
            bodyXOffset: this.playersUnit ? 19 : 11
        });
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bandit;


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const defaults = {
    enemiesSpawnX: 1100,
    alliesSpawnX: 0,
    startMoney: 10
};

/* harmony default export */ __webpack_exports__["a"] = (defaults);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_base__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controls_button__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__unit_sprite__ = __webpack_require__(0);




class MenuScene extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* SceneBase */] {
  constructor(state, gameCanvas, music) {
    super(state, gameCanvas, music);

    this.state.backgroundSprite = new __WEBPACK_IMPORTED_MODULE_2__unit_sprite__["a" /* default */]({
      url: 'imgs/UI/menu.png',
      frameWidth: 1100,
      frameHeight: 700,
      numberOfFrames: 10,
      timeToFrame: 270
    });

    this.state.scenes.menu.cloudsImage = new Image();
    this.state.scenes.menu.cloudsImage.src = 'imgs/UI/menu-clouds.png';

    this.state.scenes.menu.belt = new Image();
    this.state.scenes.menu.belt.src = 'imgs/UI/belt.png';

    this.state.scenes.menu.menuSheet = new Image();
    this.state.scenes.menu.menuSheet.src = 'imgs/UI/sheet.png';

    this.state.scenes.menu.aboutSheet = new Image();
    this.state.scenes.menu.aboutSheet.src = 'imgs/UI/about-sheet.png';

    this.buttons = this.getButtonsConfig().map(options => new __WEBPACK_IMPORTED_MODULE_1__controls_button__["a" /* default */](options));
    this.gameCanvas.subscribeOnClick(...this.buttons);
    this.music.subscribe();

    this.prevTimeStamp = 0;
  }

  updateState() {
    if (this.state.scenes.menu.cloudsOffsetX >= 900) {
      this.state.scenes.menu.cloudsOffsetX = 0;
    }
    this.state.scenes.menu.cloudsOffsetX += 0.1;

    if (this.state.scenes.menu.beltY < 0) {
      this.state.scenes.menu.beltY += 10;
      this.state.scenes.menu.menuSheetY += 10;
    }

    if (this.state.scenes.menu.aboutSheetVisible
      && this.state.scenes.menu.aboutSheetY < -15) {
        this.state.scenes.menu.aboutSheetY += 15;
    } else if (!this.state.scenes.menu.aboutSheetVisible
      && this.state.scenes.menu.aboutSheetY > -680) {
        this.state.scenes.menu.aboutSheetY -= 15;
    }

    this.state.scenes.menu.acceleration
      = this.state.scenes.menu.gravity * Math.sin(this.state.scenes.menu.angle);
    this.state.scenes.menu.velocity
      += this.state.scenes.menu.acceleration * 10 / 1000;
    this.state.scenes.menu.angle += this.state.scenes.menu.velocity * 10 / 1000;
  }

  render(timestamp = 0) {
    this.gameCanvas.context.drawImage(this.state.scenes.menu.cloudsImage,
      this.state.scenes.menu.cloudsOffsetX, 0, 900, 126, 250, 0, 900, 126);
    this.gameCanvas.context.drawImage(this.state.backgroundSprite.image,
      this.state.backgroundSprite.getFrameX(), 0,
      this.state.backgroundSprite.frameWidth, this.state.backgroundSprite.frameHeight,
      0, 0, this.state.backgroundSprite.frameWidth, this.state.backgroundSprite.frameHeight);
    this.state.backgroundSprite.tick(timestamp, this.prevTimeStamp);

    this.gameCanvas.context.drawImage(this.state.scenes.menu.belt,
      0, this.state.scenes.menu.beltY);

    this.gameCanvas.context.save();
    this.gameCanvas.context.translate(140, 0);
    this.gameCanvas.context.rotate(this.state.scenes.menu.angle);
    this.gameCanvas.context.drawImage(this.state.scenes.menu.menuSheet,
      -280 / 2, this.state.scenes.menu.menuSheetY);
    this.gameCanvas.context.restore();

    this.gameCanvas.context.save();
    this.gameCanvas.context.translate(700, this.state.scenes.menu.aboutSheetY);
    this.gameCanvas.context.rotate(-this.state.scenes.menu.angle * 5);
    this.gameCanvas.context.drawImage(this.state.scenes.menu.aboutSheet,
      -350 / 2, 0);
    this.gameCanvas.context.restore();

    this.music.render();

    this.prevTimeStamp = timestamp;
  }

  startGame() {
    this.gameCanvas.unsubscribeClick();
    this.state.currentScene = this.state.scenes.game.instance;
    this.state.reset(); // TODO: mb rename resetMoney
    this.state.scenes.game.isDemo = false;
    this.state.currentScene.initialize(0);
    this.state.currentScene.subscribeButtonsClick();
    this.state.currentScene.dialog.open(`Select a unit in the upper right corner`, 200, []);
  }
  
  startDemoGame() {
    this.gameCanvas.unsubscribeClick();
    this.state.currentScene = this.state.scenes.game.instance;
    this.state.reset(); // TODO: mb rename resetMoney
    this.state.scenes.game.isDemo = true;
    this.state.currentScene.initialize(0);
    this.state.currentScene.subscribeButtonsClick();
    this.state.currentScene.dialog.open(`Select a unit in the upper right corner`, 200, []);
  }

  toggleAbout() {
    this.state.scenes.menu.aboutSheetVisible
      = !this.state.scenes.menu.aboutSheetVisible;
  }

  getButtonsConfig() {
    return [
      { x: 75, y: 400, height: 45, width: 165, clickHandler: () => this.startGame() },
      { x: 75, y: 455, height: 45, width: 165, clickHandler: () => this.startDemoGame() },
      { x: 65, y: 515, height: 45, width: 185, clickHandler: () => this.toggleAbout() }
    ];
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MenuScene;


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_base__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__control_panel_control_panel__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dialog_dialog__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__unit_factory_unit_factory__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__queue_queue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__levels_levels__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__levels_demoLevels__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__unit_direction__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__controls_button__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__floating_text_floating_text__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__buff_manager_buff_manager__ = __webpack_require__(28);












class GameScene extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* SceneBase */] {
  constructor(state, gameCanvas, music) {
    super(state, gameCanvas, music);

    this.controlPanel = new __WEBPACK_IMPORTED_MODULE_1__control_panel_control_panel__["a" /* default */](state, gameCanvas);
    this.buffManager = new __WEBPACK_IMPORTED_MODULE_10__buff_manager_buff_manager__["a" /* default */](state, gameCanvas);
    this.floatingText = __WEBPACK_IMPORTED_MODULE_9__floating_text_floating_text__["a" /* default */].getSingletonInstance(gameCanvas.context);
    this.dialog = new __WEBPACK_IMPORTED_MODULE_2__dialog_dialog__["a" /* default */](gameCanvas.context);
    this.unitFactory = __WEBPACK_IMPORTED_MODULE_3__unit_factory_unit_factory__["a" /* default */].getSingletonInstance();
    this.queue = new __WEBPACK_IMPORTED_MODULE_4__queue_queue__["a" /* default */](state);
    this.prevTimeStamp = 0;
  }

  updateState(timestamp) {
    this.state.scenes.game.currentLevel.allies.forEach(ally => ally.doAction(this.state.scenes.game, timestamp));
    this.state.scenes.game.currentLevel.enemies.forEach(enemy => enemy.doAction(this.state.scenes.game, timestamp));

    const winner = this.getWinner();
    if (winner && !this.state.scenes.game.isPauseGame) {
        this.showEndGameWindow(winner);
    }

    this.buffManager.updateTime();

    this.floatingText.updatePosition();
  }

  render(timestamp) {
    const gameState = this.state.scenes.game;

    this.gameCanvas.context.drawImage(gameState.currentLevel.background, 0, 0);
    this.controlPanel.buttons.forEach(button => button.render(this.gameCanvas.context));

    this.buffManager.render();

    gameState.currentLevel.allies.forEach(ally => {
      const sprite = ally.getCurrentSprite();
      sprite.tick(timestamp, this.prevTimeStamp);
      this.gameCanvas.context.drawImage(sprite.image, sprite.getFrameX(), 0,
          sprite.frameWidth - 1, sprite.frameHeight,
          ally.x + sprite.xOffset, ally.y, sprite.frameWidth, sprite.frameHeight);
    });

    gameState.currentLevel.enemies.forEach(enemy => {
      const sprite = enemy.getCurrentSprite();
      const frameX = (sprite.frameWidth * (sprite.numberOfFrames -1))
          - sprite.getFrameX();
      sprite.tick(timestamp, this.prevTimeStamp);
      this.gameCanvas.context.drawImage(sprite.image, frameX, 0,
          sprite.frameWidth, sprite.frameHeight,
          enemy.x + sprite.xOffset, enemy.y, sprite.frameWidth, sprite.frameHeight);
    });

    this.floatingText.render();

    this.gameCanvas.context.fillText(`$${this.state.scenes.game.money}`, 1020, 40);
    this.gameCanvas.context.fillText(`${gameState.currentLevel.levelNumber + 1}/${gameState.numberOfLevels}`, 1020, 90);
    this.pauseMenuButton.render(this.gameCanvas.context);

    this.dialog.render();

    this.music.render();

    this.prevTimeStamp = timestamp;
  }

  initialize(level) {
    const state = this.state.scenes.game;
    const isDemo = state.isDemo;

    state.isPauseGame = true;
    state.numberOfLevels = isDemo ? __WEBPACK_IMPORTED_MODULE_6__levels_demoLevels__["a" /* default */].length : __WEBPACK_IMPORTED_MODULE_5__levels_levels__["a" /* default */].length;

    this.loadLevel(level, isDemo);
    this.controlPanel.createControlPanel(level, isDemo);
    this.addBuffManager();

    if (!this.nextButton) {
      this.nextButton = new __WEBPACK_IMPORTED_MODULE_8__controls_button__["a" /* default */]({
        x: 650,
        y: 270,
        height: 61,
        width: 61,
        iconUrl: 'imgs/UI/next-button.png',
        clickHandler: () => {
          console.log('play')
          this.dialog.close();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.initialize(state.currentLevel.levelNumber + 1, isDemo);
          this.subscribeButtonsClick();
          state.pastMoney = state.money;
        }
      });
    }
    if (!this.prevButton) {
      this.prevButton = new __WEBPACK_IMPORTED_MODULE_8__controls_button__["a" /* default */]({
        x: 620,
        y: 270,
        height: 55,
        width: 55,
        iconUrl: 'imgs/UI/prev-button.png',
        clickHandler: () => {
          console.log('prev')
          this.dialog.close();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.initialize(state.currentLevel.levelNumber - 1, isDemo);
          this.subscribeButtonsClick();
          this.state.scenes.statistic.levelsFailed++;
          state.money = state.pastMoney;
        }
      });
    } 
    if (!this.replayButton) {
      this.replayButton = new __WEBPACK_IMPORTED_MODULE_8__controls_button__["a" /* default */]({
        x: 650,
        y: 270,
        height: 55,
        width: 55,
        iconUrl: 'imgs/UI/replay.png',
        clickHandler: () => {
          console.log('replay')
          this.dialog.close();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.initialize(state.currentLevel.levelNumber, isDemo);
          this.subscribeButtonsClick();
          this.state.scenes.statistic.levelsFailed++;
          state.money = state.pastMoney;

        }
      });
    }
    if (!this.exitButton) {
      this.exitButton = new __WEBPACK_IMPORTED_MODULE_8__controls_button__["a" /* default */]({
        x: 450,
        y: 270,
        height: 73,
        width: 61,
        iconUrl: 'imgs/UI/exit.png',
        clickHandler: () => {
          console.log('exit');
          this.dialog.reset();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.state.currentScene = this.state.scenes.menu.instance;
          this.music.subscribe();
          this.gameCanvas.subscribeOnClick(...this.state.currentScene.buttons);
        }
      });
    }
    if (!this.closeButton) {
      this.closeButton = new __WEBPACK_IMPORTED_MODULE_8__controls_button__["a" /* default */]({
        x: 350,
        y: 270,
        height: 73,
        width: 61,
        iconUrl: 'imgs/UI/close.png',
        clickHandler: () => {
          console.log('close');
          this.dialog.close();
          this.gameCanvas.unsubscribeClick();
          this.subscribeButtonsClick();

          state.isPauseGame = false;
        }
      });
    }
    if (!this.pauseMenuButton) {
      this.pauseMenuButton = new __WEBPACK_IMPORTED_MODULE_8__controls_button__["a" /* default */]({
        x: 1025,
        y: 170,
        height: 40,
        width: 61,
        iconUrl: 'imgs/UI/help-menu.png',
        clickHandler: () => {
          console.log('help-menu');
          this.gameCanvas.unsubscribeClick();
          state.isPauseGame = true;
          this.dialog.reset();
          this.exitButton.x = !state.currentLevel.levelNumber ? 550 : 490;
          this.prevButton.x = 620;
          this.replayButton.x = 760;
          if (!state.currentLevel.levelNumber) {
            this.dialog.open('What do you want to do', 350, [this.closeButton, this.exitButton, this.replayButton]);
            this.gameCanvas.subscribeOnClick(this.closeButton, this.exitButton, this.replayButton);
          } else {
            this.dialog.open('What do you want to do', 350, [this.closeButton, this.exitButton, this.prevButton, this.replayButton]);
            this.gameCanvas.subscribeOnClick(this.closeButton, this.exitButton, this.prevButton, this.replayButton);
          }
        }
      });
    }
    if (!this.statisticButton) {
      this.statisticButton = new __WEBPACK_IMPORTED_MODULE_8__controls_button__["a" /* default */]({
        x: 650,
        y: 270,
        height: 55,
        width: 55,
        iconUrl: 'imgs/UI/statistic.png',
        clickHandler: () => {
          console.log('statistic');
          this.dialog.close();
          this.gameCanvas.unsubscribeClick();
          this.state.currentScene = this.state.scenes.statistic.instance;
          this.state.currentScene.subscribeOnClick();
          this.music.subscribe();
          this.state.currentScene.dialog.open('', 500, [this.state.currentScene.exitButton]);
        }
      });
    }
  }

  loadLevel(level, isDemo) {
    this.state.scenes.game.currentLevel.allies = [];
    this.state.scenes.game.currentLevel.enemies = [];

    const currentLevel = isDemo ? __WEBPACK_IMPORTED_MODULE_6__levels_demoLevels__["a" /* default */][level] : __WEBPACK_IMPORTED_MODULE_5__levels_levels__["a" /* default */][level];
    currentLevel.enemies.forEach(entry => {
      const enemy = this.unitFactory.create(entry.name, __WEBPACK_IMPORTED_MODULE_7__unit_direction__["a" /* default */].left);
      this.queue.queueEnemy(this.state.scenes.game.currentLevel.enemies, enemy);
      this.state.scenes.game.currentLevel.enemies.push(enemy);
    });

    this.state.scenes.game.currentLevel.groundLevelY = currentLevel.groundLevelY;

    const background = new Image();
    background.src = currentLevel.background;
    this.state.scenes.game.currentLevel.background = background;

    this.state.scenes.game.currentLevel.levelNumber = level;
  }

  addBuffManager() {
    this.buffManager.createButton();
  }
  
  subscribeButtonsClick() {
    this.controlPanel.subscribe();
    this.buffManager.subscribe();
    this.music.subscribe();
    this.gameCanvas.subscribeOnClick(this.pauseMenuButton);
  }

  getWinner() {
    const enemies = this.state.scenes.game.currentLevel.enemies;
    const noEnemiesLeft = !enemies.length;
    const enemyReachedLeftSide = enemies[0] && enemies[0].x < 0;

    if (noEnemiesLeft) return 'allies';
    if (enemyReachedLeftSide) return 'enemies';

    return null;
  }

  showEndGameWindow(winner) {
    this.state.scenes.game.isPauseGame = true;
    this.gameCanvas.unsubscribeClick();

    if (winner === 'allies') {
      const isLastLevel = this.state.scenes.game.currentLevel.levelNumber === this.state.scenes.game.numberOfLevels - 1;
      if (isLastLevel) {
        this.exitButton.x = 450;
        this.dialog.open('Game over. Thanks for playing :)', 260 , [this.exitButton, this.statisticButton]);
        this.gameCanvas.subscribeOnClick(this.exitButton, this.statisticButton);
      } else {
        this.exitButton.x = 450;
        this.dialog.open('You win!', 495 , [this.nextButton, this.exitButton]);
        this.gameCanvas.subscribeOnClick(this.nextButton, this.exitButton);

          const bonusMoney = this.state.scenes.game.currentLevel.levelNumber * 3 + 3;
          this.state.scenes.game.money += bonusMoney;
          this.state.scenes.game.pastMoney = this.state.scenes.game.money;
      }
    } else {
      if (this.state.scenes.game.currentLevel.levelNumber) {
        this.exitButton.x = 400;
        this.prevButton.x = 550;
        this.replayButton.x = 700;
        this.gameCanvas.subscribeOnClick(this.exitButton, this.prevButton, this.replayButton);
        this.dialog.open('You loose :( Try again!', 370 , [this.exitButton, this.prevButton, this.replayButton]);
      } else {
        this.exitButton.x = 450;
        this.replayButton.x = 650;
        this.gameCanvas.subscribeOnClick(this.exitButton, this.replayButton);
        this.dialog.open('You loose :( Try again!', 370 , [this.exitButton, this.replayButton]);
      }
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameScene;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_button__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parameters_unit_buttons__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__demo_parameters_unit_buttons_js__ = __webpack_require__(32);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__unit_factory_unit_factory__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__queue_queue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__unit_direction__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__parameters_help_button__ = __webpack_require__(27);








class ControlPanel {
    constructor(state, gameCanvas) {
        this.buttons = null;
        this.state = state;
        this.gameCanvas = gameCanvas;
        this.unitFactory = __WEBPACK_IMPORTED_MODULE_3__unit_factory_unit_factory__["a" /* default */].getSingletonInstance();
        this.queue = new __WEBPACK_IMPORTED_MODULE_4__queue_queue__["a" /* default */](state);
    }

    createControlPanel(level, isDemo) {
        const parmeters = isDemo 
            ? __WEBPACK_IMPORTED_MODULE_2__demo_parameters_unit_buttons_js__["a" /* default */]
            : __WEBPACK_IMPORTED_MODULE_1__parameters_unit_buttons__["a" /* default */];
        this.buttons = parmeters[level].map(buttonParam => {
            const button = new __WEBPACK_IMPORTED_MODULE_0__controls_button__["a" /* default */]({
                x: buttonParam.x,
                y: buttonParam.y,
                width: buttonParam.width,
                height: buttonParam.height,
                iconUrl: buttonParam.imgUrl,
                clickHandler: () => this.createUnit(buttonParam.name)
            });
            return button;
        });
    }

    createUnit(name) {
        const allyUnit = this.unitFactory.create(name, __WEBPACK_IMPORTED_MODULE_5__unit_direction__["a" /* default */].right);

        if (this.state.scenes.game.money >= allyUnit.cost) {
            this.state.scenes.game.money -= allyUnit.cost;
            this.queue.queueAlly(this.state.scenes.game.currentLevel.allies, allyUnit);
            this.state.scenes.game.currentLevel.allies.push(allyUnit);
        }
        this.state.currentScene.dialog.close(); // TODO: mb need to move
        this.state.scenes.game.isPauseGame = false;
    }

    subscribe() {
        this.gameCanvas.subscribeOnClick(...this.buttons);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlPanel;


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const parametersOfUnitButtons = [
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 40,
            height: 40
        }
    ],
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'wizard',
            imgUrl: 'imgs/units/wizard/wizard-icon.png',
            x: 90,
            y: 20,
            width: 40,
            height: 40
        }
    ],
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 90,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'country-knight',
            imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
            x: 160,
            y: 20,
            width: 40,
            height: 40
        }
    ],
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'bandit',
            imgUrl: 'imgs/units/bandit/bandit-icon.png',
            x: 90,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'country-knight',
            imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
            x: 160,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 230,
            y: 20,
            width: 40,
            height: 40
        }
    ],
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'wizard',
            imgUrl: 'imgs/units/wizard/wizard-icon.png',
            x: 90,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'country-knight',
            imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
            x: 160,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 230,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'rogue',
            imgUrl: 'imgs/units/rogue/rogue-icon.png',
            x: 300,
            y: 20,
            width: 40,
            height: 40
        }
    ],
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'wizard',
            imgUrl: 'imgs/units/wizard/wizard-icon.png',
            x: 90,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'country-knight',
            imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
            x: 160,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 230,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'rogue',
            imgUrl: 'imgs/units/rogue/rogue-icon.png',
            x: 300,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'bandit',
            imgUrl: 'imgs/units/bandit/bandit-icon.png',
            x: 370,
            y: 20,
            width: 40,
            height: 40
        },
        {
            name: 'blob',
            imgUrl: 'imgs/units/blob/blob-icon.png',
            x: 440,
            y: 20,
            width: 40,
            height: 40
        },
    ]
];

/* harmony default export */ __webpack_exports__["a"] = (parametersOfUnitButtons);

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const soundButton = {
        name: 'sound',
        firstUrl: 'imgs/UI/music-icon/sound-on.png',
        secondUrl: 'imgs/UI/music-icon/sound-off.png',
        x: 1020,
        y: 60,
        width: 30,
        height: 30
    }

/* unused harmony default export */ var _unused_webpack_default_export = (soundButton);

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_button__ = __webpack_require__(2);


class BuffManager {
    constructor(state, gameCanvas) {
        this.buttons = null;
        this.state = state;
        this.gameCanvas = gameCanvas;

        this.buffId = 0;

        this.fullReset();
    }

    createButton() {
        this.buttons = this.getParametersOfBuffButton().map(btn => {
            const button = new __WEBPACK_IMPORTED_MODULE_0__controls_button__["a" /* default */]({
                x: btn.x,
                y: btn.y,
                height: btn.height,
                width: btn.width,
                iconUrl: btn.iconUrl,
                clickHandler: btn.clickHandler
            });
            return button;
        });
    }

    improveWeapon() {
        if (this.state.scenes.game.money >= 3) {
            this.state.scenes.game.currentLevel.allies.forEach(unit => {
                unit.damage++;
                unit.weaponIdBuff.push(this.buffId);
            });
            
            this.weaponBuffs.push({
                id: this.buffId++,
                weaponStart: Date.now(),
                opacity: 0.7,
                fadeIn: false
            });

            this.state.scenes.game.money -= 3;
        }
    }

    improveArmor() {
        if (this.state.scenes.game.money >= 5) {
            this.state.scenes.game.currentLevel.allies.forEach(unit => {
                unit.health += 5;
                unit.armorIdBuff.push(this.buffId);
            });

            this.armorBuffs.push({
                id: this.buffId,
                armorStart: Date.now(),
                opacity: 0.7,
                fadeIn: false
            });

            this.state.scenes.game.money -= 5;
        }
    }

    weaponReset() {
        this.state.scenes.game.currentLevel.allies.forEach(unit => {
            if (unit.weaponIdBuff.length && unit.weaponIdBuff[0] === this.weaponBuffs[0].id) {
                unit.damage--;
                unit.weaponIdBuff.shift();
            }
        });

        this.weaponBuffs.shift();
    }

    armorReset() {
        this.state.scenes.game.currentLevel.allies.forEach(unit => {
            if (unit.armorIdBuff.length && unit.armorIdBuff[0] === this.armorBuffs[0].id) {
                if (unit.health > 5) unit.health -= 5;
                else unit.health = 1;

                unit.armorIdBuff.shift();
            }
        });

        this.armorBuffs.shift();
    }

    fullReset() {
        this.weaponBuffs = [];
        this.armorBuffs = [];
    }

    updateTime() {
        if (this.weaponBuffs.length) {
            const passedWeaponTime = Date.now() - this.weaponBuffs[0].weaponStart;
            const buffDuration = 30000;

            if (passedWeaponTime > buffDuration) this.weaponReset();

            this.weaponBuffs.forEach(buff => {
                const delta = buff.fadeIn ? 0.01 : -0.01;
                buff.opacity += delta;
                if (buff.opacity < 0.1) buff.fadeIn = true;
                else if (buff.opacity > 0.7) buff.fadeIn = false;
            });
        }

        if (this.armorBuffs.length) {
            const passedArmorTime = Date.now() - this.armorBuffs[0].armorStart;
            const buffDuration = 20000;

            if (passedArmorTime > buffDuration) this.armorReset();

            this.armorBuffs.forEach(buff => {
                const delta = buff.fadeIn ? 0.015 : -0.015;
                buff.opacity += delta;
                if (buff.opacity < 0.1) buff.fadeIn = true;
                else if (buff.opacity > 0.7) buff.fadeIn = false;
            });
        }
    }

    subscribe() {
        this.gameCanvas.subscribeOnClick(...this.buttons);
    }

    render() {
        this.buttons.forEach(button => button.render(this.gameCanvas.context));
        this.gameCanvas.context.save();
        this.gameCanvas.context.font = '18px Pixelate';
        this.gameCanvas.context.fillText('$3', 50, 140);
        this.gameCanvas.context.fillText('$5', 50, 210);
        this.gameCanvas.context.restore();

        const weaponBtn = this.buttons[0];
        this.weaponBuffs.forEach((buff, position) => {
            this.gameCanvas.context.save();
            this.gameCanvas.context.globalAlpha = buff.opacity;
            const buffXPosition = weaponBtn.x + 70 * (position + 1);
            this.gameCanvas.context.drawImage(weaponBtn.icon, buffXPosition, weaponBtn.y);
            this.gameCanvas.context.restore();
        });

        const armorBtn = this.buttons[1];
        this.armorBuffs.forEach((buff, position) => {
            this.gameCanvas.context.save();
            this.gameCanvas.context.globalAlpha = buff.opacity;
            const buffXPosition = armorBtn.x + 70 * (position + 1);
            this.gameCanvas.context.drawImage(armorBtn.icon, buffXPosition, armorBtn.y);
            this.gameCanvas.context.restore();
        });
    }

    getParametersOfBuffButton() {
        return [
            {
                name: 'arm', iconUrl: 'imgs/buff-icon/weapon.png',
                x: 20, y: 90, width: 40, height: 40,
                clickHandler: () => this.improveWeapon()
            },
            {
                name: 'armor', iconUrl: 'imgs/buff-icon/armor.png',
                x: 20, y: 160, width: 40, height: 40,
                clickHandler: () => this.improveArmor()
            }
        ];
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BuffManager;


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_button__ = __webpack_require__(2);


class Music {
    constructor(gameCanvas) {
        this.gameCanvas = gameCanvas;
        this.counter = 0;
        this.initialize();
    }

    addMusic() {
        this.music = document.createElement("audio");
        this.music.src = 'music/background-music.wav';
        this.music.setAttribute("preload", "auto");
        this.music.setAttribute("controls", "none");
        this.music.setAttribute("loop", "true");
        this.music.style.display = "none";
        this.music.volume = 0.5;

        document.body.appendChild(this.music);

        this.music.play();
    }

    render() {
        this.gameCanvas.context.drawImage(this.button.icon, this.button.x, this.button.y);
    }

    initialize() {
        const musicOn = new Image();
        musicOn.src = 'imgs/UI/music-icon/sound-on.png';

        const musicHalfOn = new Image();
        musicHalfOn.src = 'imgs/UI/music-icon/sound-half-on.png';

        const musicOff = new Image();
        musicOff.src = 'imgs/UI/music-icon/sound-off.png';

        this.state = [musicOn, musicHalfOn, musicOff];

        this.button = new __WEBPACK_IMPORTED_MODULE_0__controls_button__["a" /* default */]({
            x: 950,
            y: 10,
            height: 40,
            width: 40,
            clickHandler: () => this.toggle()
        });

        this.button.icon = this.state[this.counter];
        this.addMusic();
    }

    toggle() {
        this.counter = ++this.counter % 3;
        this.button.icon = this.state[this.counter];
        this.music.volume = 0.5 - this.counter / 4;
    }

    subscribe() {
        this.gameCanvas.subscribeOnClick(this.button);
    }

    unsubscribe() {
        this.gameCanvas.unsubscribeClick(this.button);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Music;


/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_base__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dialog_dialog__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controls_button__ = __webpack_require__(2);




class StatisticScene extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* SceneBase */] {
    constructor(state, gameCanvas, music) {
        super(state, gameCanvas, music);
        this.dialog = new __WEBPACK_IMPORTED_MODULE_1__dialog_dialog__["a" /* default */](gameCanvas.context);
        this.initialize();
    }

    updateState(timestamp) {
        const state = this.state.scenes.statistic;
        if (!state.timeSpent) {
            state.timeSpent = (timestamp / 60000).toFixed();
        }
    }

    render() {
        const state = this.state.scenes.statistic;

        this.gameCanvas.context.drawImage(state.background, 0, 0);

        this.gameCanvas.context.fillText('Statistics', 480, 100);
        this.gameCanvas.context.fillText('Time spent', 180, 200);
        this.gameCanvas.context.fillText(`${state.timeSpent} minutes`, 750, 200);
        this.gameCanvas.context.fillText('Levels failed', 180, 250);
        this.gameCanvas.context.fillText(`${state.levelsFailed} levels`, 750, 250);
        this.gameCanvas.context.fillText('Total damage', 180, 300);
        this.gameCanvas.context.fillText(`${state.totalDamage} dmg`, 750, 300);
        this.gameCanvas.context.fillText('Total received damage', 180, 350);
        this.gameCanvas.context.fillText(`${state.receivedDamage} dmg`, 750, 350);
        this.gameCanvas.context.fillText('Money earned', 180, 400);
        this.gameCanvas.context.fillText(`${state.earnedMoney} $`, 750, 400);
        this.gameCanvas.context.fillText('Total hp healed', 180, 450);
        this.gameCanvas.context.fillText(`${state.healedHp} hp`, 750, 450);

        this.dialog.render();
    }

    initialize() {
        this.background = new Image();
        this.background.src = './imgs/backgrounds/statistic.jpg';
        this.state.scenes.statistic.background = this.background;

        this.exitButton = new __WEBPACK_IMPORTED_MODULE_2__controls_button__["a" /* default */]({
            x: 550,
            y: 500,
            height: 73,
            width: 61,
            iconUrl: 'imgs/UI/exit.png',
            clickHandler: () => {
                console.log('exit');
                this.state.scenes.game.instance.initialize(0);
                this.dialog.close();
                this.gameCanvas.unsubscribeClick();
                this.state.currentScene = this.state.scenes.menu.instance;
                this.music.subscribe();
                this.gameCanvas.subscribeOnClick(...this.state.currentScene.buttons);
            }
        });
    }

    subscribeOnClick() {
        this.gameCanvas.subscribeOnClick(this.exitButton);
    }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StatisticScene;


/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const levels = [
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'skeleton'
            }
        ]
    },
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'rogue'
            },
            {
                name: 'country-knight'
            }
        ]
    },
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'knight'
            },
            {
                name: 'wizard'
            }
        ]
    },
    {
        background: './imgs/backgrounds/game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'rogue'
            },
            {
                name: 'bandit'
            },
            {
                name: 'blob'
            }
        ]
    }
];

/* harmony default export */ __webpack_exports__["a"] = (levels);

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const parametersOfUnitButtons = [
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 30,
            height: 40
        }
    ],
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 90,
            y: 20,
            width: 30,
            height: 40
        }
    ],
    [
        {
            name: 'skeleton',
            imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
            x: 20,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 90,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'wizard',
            imgUrl: 'imgs/units/wizard/wizard-icon.png',
            x: 160,
            y: 20,
            width: 30,
            height: 40
        }
    ],
    [
        {
            name: 'bandit',
            imgUrl: 'imgs/units/bandit/bandit-icon.png',
            x: 20,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 90,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'wizard',
            imgUrl: 'imgs/units/wizard/wizard-icon.png',
            x: 160,
            y: 20,
            width: 30,
            height: 40
        }
    ]
];

/* harmony default export */ __webpack_exports__["a"] = (parametersOfUnitButtons);

/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDg2ODUwNTBkMDU2ZDliYzA0YTkiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvc3ByaXRlLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0L3VuaXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xzL2J1dHRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdC9kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQtZmFjdG9yeS91bml0LWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVldWUvcXVldWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9zY2VuZS5iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9sZXZlbHMvbGV2ZWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9mbG9hdGluZy10ZXh0L2Zsb2F0aW5nLXRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpYWxvZy9kaWFsb2cuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUtY2FudmFzL2dhbWUtY2FudmFzLmpzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS9zdGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvc3ByaXRlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMva25pZ2h0L2tuaWdodC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL3JvZ3VlL3JvZ3VlLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0cy9ibG9iL2Jsb2IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL3dpemFyZC93aXphcmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL2JhbmRpdC9iYW5kaXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL21lbnUuc2NlbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9nYW1lLnNjZW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sLXBhbmVsL2NvbnRyb2wtcGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2wtcGFuZWwvcGFyYW1ldGVycy11bml0LWJ1dHRvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2wtcGFuZWwvcGFyYW1ldGVycy1oZWxwLWJ1dHRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVmZi1tYW5hZ2VyL2J1ZmYtbWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbXVzaWMvbXVzaWMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9zdGF0aXN0aWMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2xldmVscy9kZW1vTGV2ZWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sLXBhbmVsL2RlbW8tcGFyYW1ldGVycy11bml0LWJ1dHRvbnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBLDhCQUE4QixXQUFXO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjs7QUFFakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEM7Ozs7Ozs7OztBQ25NQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7O0FDM0JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLG9FOzs7Ozs7Ozs7Ozs7OztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxrRTs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1CQUFtQjtBQUNoQyxhQUFhO0FBQ2I7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLG1CQUFtQjtBQUNoQyxhQUFhO0FBQ2I7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhLHlCQUF5QjtBQUN0QyxhQUFhLGlCQUFpQjtBQUM5QixhQUFhLG1CQUFtQjtBQUNoQyxhQUFhLGlCQUFpQjtBQUM5QixhQUFhLGlCQUFpQjtBQUM5QjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQW1CO0FBQ2hDLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsbUJBQW1CO0FBQ2hDLGFBQWEsbUJBQW1CO0FBQ2hDLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWE7QUFDYjtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEseUJBQXlCO0FBQ3RDLGFBQWEsbUJBQW1CO0FBQ2hDLGFBQWEsbUJBQW1CO0FBQ2hDLGFBQWEsZUFBZTtBQUM1QixhQUFhLG1CQUFtQjtBQUNoQztBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsbUJBQW1CO0FBQ2hDLGFBQWEsbUJBQW1CO0FBQ2hDLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsbUJBQW1CO0FBQ2hDLGFBQWEsZ0JBQWdCO0FBQzdCLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEsaUJBQWlCO0FBQzlCLGFBQWEseUJBQXlCO0FBQ3RDLGFBQWEsZUFBZTtBQUM1QixhQUFhLGlCQUFpQjtBQUM5QixhQUFhLGlCQUFpQjtBQUM5QixhQUFhLGlCQUFpQjtBQUM5QixhQUFhLGdCQUFnQjtBQUM3QixhQUFhLHlCQUF5QjtBQUN0QyxhQUFhLGlCQUFpQjtBQUM5QixhQUFhLGlCQUFpQjtBQUM5QixhQUFhLGlCQUFpQjtBQUM5QixhQUFhLG1CQUFtQjtBQUNoQztBQUNBO0FBQ0E7O0FBRUEsaUU7Ozs7Ozs7O0FDcEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Qsa0JBQWtCO0FBQ3hFO0FBQ0EsYUFBYTtBQUNiLHlEQUF5RCxrQkFBa0I7QUFDM0U7QUFDQSxhQUFhO0FBQ2IscURBQXFELGtCQUFrQjtBQUN2RTtBQUNBO0FBQ0EscUNBQXFDLGVBQWU7QUFDcEQ7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkRzQjtBQUNOO0FBQ0k7QUFDQTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQzs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7OztBQzVEQTtBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDbkVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxzREFBc0QsZUFBZTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLHNEQUFzRCxlQUFlO0FBQ3JFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esd0RBQXdELGVBQWU7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLHFEQUFxRCxlQUFlO0FBQ3BFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDOzs7Ozs7Ozs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7OztBQ1BBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0RBQWtELGVBQWU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxrREFBa0QsZUFBZTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLG9EQUFvRCxlQUFlO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxpREFBaUQsZUFBZTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFLGVBQWU7QUFDakY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxpRUFBaUUsZUFBZTtBQUNoRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLG9FQUFvRSxlQUFlO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsaUVBQWlFLGVBQWU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEM7Ozs7Ozs7Ozs7O0FDekRBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxnREFBZ0QsZUFBZTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLCtDQUErQyxlQUFlO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esa0RBQWtELGVBQWU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxpREFBaUQsZUFBZTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUMxREE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGVBQWU7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSw4Q0FBOEMsZUFBZTtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGdEQUFnRCxlQUFlO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsK0NBQStDLGVBQWU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0RBQWtELGVBQWU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxpREFBaUQsZUFBZTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLG9EQUFvRCxlQUFlO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxtREFBbUQsZUFBZTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0Esa0RBQWtELGVBQWU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDM0lBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrREFBa0QsZUFBZTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGlEQUFpRCxlQUFlO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esb0RBQW9ELGVBQWU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxtREFBbUQsZUFBZTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUU7Ozs7Ozs7Ozs7QUNOb0I7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTyw4RUFBOEU7QUFDckYsT0FBTyxrRkFBa0Y7QUFDekYsT0FBTztBQUNQO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVIb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUEseUNBQXlDLDZCQUE2QjtBQUN0RSx3Q0FBd0MsdUNBQXVDLEdBQUcseUJBQXlCO0FBQzNHOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7Ozs7OztBQzlTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBLGtGOzs7Ozs7O0FDL0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1Rjs7Ozs7Ozs7QUNWQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7O0FDdktBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7O0FDaEVvQjtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDLGdCQUFnQjtBQUM1RDtBQUNBLDRDQUE0QyxtQkFBbUI7QUFDL0Q7QUFDQSw0Q0FBNEMsa0JBQWtCO0FBQzlEO0FBQ0EsNENBQTRDLHFCQUFxQjtBQUNqRTtBQUNBLDRDQUE0QyxrQkFBa0I7QUFDOUQ7QUFDQSw0Q0FBNEMsZUFBZTs7QUFFM0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7O0FDbEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpRTs7Ozs7OztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0YiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMTEpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDQ4Njg1MDUwZDA1NmQ5YmMwNGE5IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaXRlIHtcclxuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICBpZiAoIW9wdGlvbnMpIHRocm93IG5ldyBFcnJvcignTm8gc3ByaXRlIG9wdGlvbnMnKTtcclxuXHJcbiAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLmltYWdlLnNyYyA9IG9wdGlvbnMudXJsO1xyXG5cclxuICAgIHRoaXMuZnJhbWVXaWR0aCA9IG9wdGlvbnMuZnJhbWVXaWR0aDtcclxuICAgIHRoaXMuZnJhbWVIZWlnaHQgPSBvcHRpb25zLmZyYW1lSGVpZ2h0O1xyXG4gICAgdGhpcy5udW1iZXJPZkZyYW1lcyA9IG9wdGlvbnMubnVtYmVyT2ZGcmFtZXM7XHJcbiAgICB0aGlzLnRpbWVUb0ZyYW1lID0gb3B0aW9ucy50aW1lVG9GcmFtZSB8fCAxMDA7XHJcbiAgICB0aGlzLnhPZmZzZXQgPSBvcHRpb25zLnhPZmZzZXQgfHwgMDtcclxuICAgIHRoaXMuYXR0YWNrWE9mZnNldCA9IG9wdGlvbnMuYXR0YWNrWE9mZnNldCB8fCAwO1xyXG4gICAgdGhpcy5ib2R5WE9mZnNldCA9IG9wdGlvbnMuYm9keVhPZmZzZXQ7XHJcbiAgICBcclxuICAgIHRoaXMucHJlbG9hZGVyID0gb3B0aW9ucy5wcmVsb2FkZXI7XHJcbiAgICAvLyBpZiAodGhpcy5wcmVsb2RlcikgdGhpcy5wcmVsb2FkZXIubG9hZCh0aGlzLmltYWdlKTtcclxuICAgIC8vIFkgb2Zmc2V0XHJcbiAgICBcclxuICAgIHRoaXMuY3VycmVudFRpY2sgPSAwO1xyXG4gICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9IDA7XHJcbiAgfVxyXG5cclxuICB0aWNrKHRpbWVzdGFtcCwgcHJldlRpbWVzdGFtcCkge1xyXG4gICAgdGhpcy5jdXJyZW50VGljayArPSBOdW1iZXIoKHRpbWVzdGFtcCAtIHByZXZUaW1lc3RhbXApLnRvRml4ZWQoMikpO1xyXG4gICAgaWYgKHRoaXMuY3VycmVudFRpY2sgPiB0aGlzLnRpbWVUb0ZyYW1lICogdGhpcy5jdXJyZW50SW1hZ2VJbmRleCkge1xyXG4gICAgICB0aGlzLm5leHRGcmFtZSgpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmV4dEZyYW1lKCkge1xyXG4gICAgaWYgKHRoaXMuY3VycmVudEltYWdlSW5kZXggPT09IHRoaXMubnVtYmVyT2ZGcmFtZXMgLSAxKSB7XHJcbiAgICAgIHRoaXMucmVzZXQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudEltYWdlSW5kZXgrKztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGdldEZyYW1lWCgpIHtcclxuICAgIHJldHVybiB0aGlzLmZyYW1lV2lkdGggKiB0aGlzLmN1cnJlbnRJbWFnZUluZGV4O1xyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRUaWNrID0gMDtcclxuICAgIHRoaXMuY3VycmVudEltYWdlSW5kZXggPSAwO1xyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvc3ByaXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi9zcHJpdGUnO1xyXG5pbXBvcnQgU3ByaXRlcyBmcm9tICcuL3Nwcml0ZXMnO1xyXG5pbXBvcnQgRGlyZWN0aW9uIGZyb20gJy4vZGlyZWN0aW9uJztcclxuaW1wb3J0IEZsb2F0aW5nVGV4dCBmcm9tICcuLi9mbG9hdGluZy10ZXh0L2Zsb2F0aW5nLXRleHQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3Rvcih1bml0SW5mbykge1xyXG4gICAgICAgIGlmICghdW5pdEluZm8pIHRocm93IG5ldyBFcnJvcignTm8gdW5pdCBpbmZvJyk7XHJcblxyXG4gICAgICAgIHRoaXMuaWQgPSB1bml0SW5mby5pZDtcclxuICAgICAgICB0aGlzLmhlYWx0aCA9IHVuaXRJbmZvLmhlYWx0aDtcclxuICAgICAgICB0aGlzLmRhbWFnZSA9IHVuaXRJbmZvLmRhbWFnZTtcclxuICAgICAgICB0aGlzLnJhbmdlQXR0YWNrID0gdW5pdEluZm8ucmFuZ2VBdHRhY2sgfHwgMDsgLy8gVE9ETzogY2hhbmdlIVxyXG4gICAgICAgIHRoaXMuaWRsZVRpbWUgPSB1bml0SW5mby5pZGxlVGltZSB8fCAyMDAwO1xyXG4gICAgICAgIHRoaXMuYXR0YWNrVGltZSA9IHVuaXRJbmZvLmF0dGFja1RpbWU7XHJcbiAgICAgICAgdGhpcy50aW1lVG9IaXQgPSB1bml0SW5mby50aW1lVG9IaXQ7XHJcbiAgICAgICAgdGhpcy5kZWF0aFRpbWUgPSB1bml0SW5mby5kZWF0aFRpbWU7XHJcbiAgICAgICAgdGhpcy5zdGVwU2l6ZSA9IHVuaXRJbmZvLnN0ZXBTaXplO1xyXG4gICAgICAgIHRoaXMuZGlyZWN0aW9uID0gdW5pdEluZm8uZGlyZWN0aW9uO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMgPSBuZXcgU3ByaXRlcygpO1xyXG4gICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0ID0gRmxvYXRpbmdUZXh0LmdldFNpbmdsZXRvbkluc3RhbmNlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyc1VuaXQgPSB0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLnJpZ2h0IFxyXG4gICAgICAgICAgICA/IHRydWVcclxuICAgICAgICAgICAgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLndlYXBvbklkQnVmZiA9IFtdO1xyXG4gICAgICAgIHRoaXMuYXJtb3JJZEJ1ZmYgPSBbXTtcclxuICAgICAgICB0aGlzLndhc0hpdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy54ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnkgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEN1cnJlbnRTcHJpdGUoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRBY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLnN0ZXA6IHJldHVybiB0aGlzLnNwcml0ZXMud2FsaztcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLmF0dGFjazogcmV0dXJuIHRoaXMuc3ByaXRlcy5hdHRhY2s7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9ucy5kaWU6IHJldHVybiB0aGlzLnNwcml0ZXMuZGllO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gdGhpcy5zcHJpdGVzLmlkbGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRvQWN0aW9uKHN0YXRlLCB0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpZShzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudEFjdGlvbiA9PT0gQWN0aW9ucy5pZGxlXHJcbiAgICAgICAgICAgICYmIHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPCB0aGlzLmlkbGVUaW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZBbGx5KHN0YXRlKSB8fCBzdGF0ZS5pc1BhdXNlR2FtZSBcclxuICAgICAgICAgICAgfHwgdGhpcy5pc0luRnJvbnRPZkVuZW15KHN0YXRlKSAmJiB0aGlzLmlzRW5lbXlEeWluZyhzdGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5pZGxlKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luRnJvbnRPZkVuZW15KHN0YXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmF0dGFjayhzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0ZXAoc3RhdGUsIHRpbWVzdGFtcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBhY3Rpb25zXHJcblxyXG4gICAgc3RlcChzdGF0ZSwgdGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5zdGVwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IEFjdGlvbnMuc3RlcDtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24ucmlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc3RlcFNpemU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IHRoaXMuc3RlcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlkbGUoc3RhdGUsIHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBY3Rpb24gIT09IEFjdGlvbnMuaWRsZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBBY3Rpb25zLmlkbGU7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjayhzdGF0ZSwgdGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5hdHRhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gQWN0aW9ucy5hdHRhY2s7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiB0aGlzLnRpbWVUb0hpdCAmJiAhdGhpcy53YXNIaXQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1VuaXQpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLmhlYWx0aCAtPSB0aGlzLmRhbWFnZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvblggPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS54IFxyXG4gICAgICAgICAgICAgICAgICAgICsgc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0uc3ByaXRlcy53YWxrLmJvZHlYT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5kYW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YOiBwb3NpdGlvblgsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZOiBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS55LFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogQWN0aW9ucy5hdHRhY2ssXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmluc3RhbmNlLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMudG90YWxEYW1hZ2UrKztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0uaGVhbHRoIC09IHRoaXMuZGFtYWdlO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uWCA9IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0ueCBcclxuICAgICAgICAgICAgICAgICAgICArIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0uc3ByaXRlcy53YWxrLmJvZHlYT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5kYW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YOiBwb3NpdGlvblgsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZOiBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdLnksXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLmF0dGFjayxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc3RhdGUuaW5zdGFuY2Uuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYy5yZWNlaXZlZERhbWFnZSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMud2FzSGl0ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiB0aGlzLmF0dGFja1RpbWUgJiYgdGhpcy53YXNIaXQpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgdGhpcy53YXNIaXQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGllKHN0YXRlLCB0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QWN0aW9uICE9PSBBY3Rpb25zLmRpZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBBY3Rpb25zLmRpZTtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVzLmRpZS5yZXNldCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVkoc3RhdGUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGltZXN0YW1wIC0gdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA+IHRoaXMuZGVhdGhUaW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib251c01vbmV5ID0gTWF0aC5mbG9vcihzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS5jb3N0IC8gMik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvblggPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS54IFxyXG4gICAgICAgICAgICAgICAgKyBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdLnNwcml0ZXMud2Fsay5ib2R5WE9mZnNldDtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5tb25leSArPSBib251c01vbmV5O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYCQke2JvbnVzTW9uZXl9YCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblg6IHBvc2l0aW9uWCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblk6IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLnksXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLmRpZSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLmluc3RhbmNlLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMuZWFybmVkTW9uZXkgKz0gYm9udXNNb25leTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcbiAgICAvLyNyZWdpb24gaGVscGVyc1xyXG5cclxuICAgIGlzSW5Gcm9udE9mRW5lbXkoc3RhdGUpIHsgLy8gVE9ETzogcmV3cml0ZSBtYj9cclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzVW5pdCkge1xyXG4gICAgICAgICAgICBjb25zdCBvcHBvbmVudCA9IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdO1xyXG4gICAgICAgICAgICByZXR1cm4gb3Bwb25lbnQgJiYgdGhpcy54ICsgdGhpcy5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXQgKyB0aGlzLnJhbmdlQXR0YWNrID49IG9wcG9uZW50LnggKyBvcHBvbmVudC5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb3Bwb25lbnQgPSBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdO1xyXG4gICAgICAgICAgICByZXR1cm4gb3Bwb25lbnQgJiYgdGhpcy54ICsgdGhpcy5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXQgLSB0aGlzLnJhbmdlQXR0YWNrIDw9IG9wcG9uZW50LnggKyBvcHBvbmVudC5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzRW5lbXlEeWluZyhzdGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSByZXR1cm4gc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0uaGVhbHRoIDw9IDA7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXS5oZWFsdGggPD0gMDtcclxuICAgIH1cclxuXHJcbiAgICBpc0luRnJvbnRPZkFsbHkoc3RhdGUpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzVW5pdCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0QWxseSA9IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbdGhpcy5nZXRVbml0UG9zaXRpb24oc3RhdGUpIC0gMV07XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0QWxseSAmJiB0aGlzLnggKyB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5mcmFtZVdpZHRoID49IG5leHRBbGx5Lng7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbmV4dEFsbHkgPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1t0aGlzLmdldFVuaXRQb3NpdGlvbihzdGF0ZSkgLSAxXTtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHRBbGx5ICYmIHRoaXMueCA8PSBuZXh0QWxseS54ICsgbmV4dEFsbHkuZ2V0Q3VycmVudFNwcml0ZSgpLmZyYW1lV2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFVuaXRQb3NpdGlvbihzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNVbml0XHJcbiAgICAgICAgICAgID8gc3RhdGUuY3VycmVudExldmVsLmFsbGllcy5maW5kSW5kZXgoYWxseSA9PiBhbGx5LmlkID09PSB0aGlzLmlkKVxyXG4gICAgICAgICAgICA6IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzLmZpbmRJbmRleChlbmVteSA9PiBlbmVteS5pZCA9PT0gdGhpcy5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlWShzdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHVuaXRIZWlnaHQgPSB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5mcmFtZUhlaWdodDtcclxuICAgICAgICB0aGlzLnkgPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZ3JvdW5kTGV2ZWxZIC0gdW5pdEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvdW5pdC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b24ge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIGlmICghb3B0aW9ucykgdGhyb3cgbmV3IEVycm9yKCdCdXR0b24gb3B0aW9ucyBtaXNzaW5nJyk7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IG9wdGlvbnMueDtcclxuICAgICAgICB0aGlzLnkgPSBvcHRpb25zLnk7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcclxuICAgICAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aDtcclxuICAgICAgICB0aGlzLmljb25VcmwgPSBvcHRpb25zLmljb25Vcmw7XHJcbiAgICAgICAgdGhpcy5jbGlja0hhbmRsZXIgPSBvcHRpb25zLmNsaWNrSGFuZGxlcjtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaWNvblVybCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEljb24ob3B0aW9ucy5pY29uVXJsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmljb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRJY29uKHVybCkge1xyXG4gICAgICAgIGNvbnN0IGljb24gPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpY29uLnNyYyA9IHVybDtcclxuICAgICAgICB0aGlzLmljb24gPSBpY29uO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb250ZXh0KSB7XHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5pY29uLCB0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb250cm9scy9idXR0b24uanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgRGlyZWN0aW9uID0ge1xyXG4gIGxlZnQ6ICdsZWZ0JyxcclxuICByaWdodDogJ3JpZ2h0J1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGlyZWN0aW9uO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvZGlyZWN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBTa2VsZXRvbiBmcm9tICcuLi91bml0cy9za2VsZXRvbi9za2VsZXRvbic7XHJcbmltcG9ydCBLbmlnaHQgZnJvbSAnLi4vdW5pdHMva25pZ2h0L2tuaWdodCc7XHJcbmltcG9ydCBDb3VudHJ5S25pZ2h0IGZyb20gJy4uL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0JztcclxuaW1wb3J0IFJvZ3VlIGZyb20gJy4uL3VuaXRzL3JvZ3VlL3JvZ3VlJztcclxuaW1wb3J0IEJsb2IgZnJvbSAnLi4vdW5pdHMvYmxvYi9ibG9iJztcclxuaW1wb3J0IFdpemFyZCBmcm9tICcuLi91bml0cy93aXphcmQvd2l6YXJkJztcclxuaW1wb3J0IEJhbmRpdCBmcm9tICcuLi91bml0cy9iYW5kaXQvYmFuZGl0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaXRGYWN0b3J5IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRTaW5nbGV0b25JbnN0YW5jZSgpIHtcclxuICAgICAgICBpZiAoIVVuaXRGYWN0b3J5Lmluc3RhbmNlKSBVbml0RmFjdG9yeS5pbnN0YW5jZSA9IG5ldyBVbml0RmFjdG9yeSgpO1xyXG4gICAgICAgIHJldHVybiBVbml0RmFjdG9yeS5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGUodW5pdE5hbWUsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCh1bml0TmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdza2VsZXRvbic6IHJldHVybiBuZXcgU2tlbGV0b24odGhpcy5pZCsrLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBjYXNlICdrbmlnaHQnOiByZXR1cm4gbmV3IEtuaWdodCh0aGlzLmlkKyssIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvdW50cnkta25pZ2h0JzogcmV0dXJuIG5ldyBDb3VudHJ5S25pZ2h0KHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgY2FzZSAncm9ndWUnOiByZXR1cm4gbmV3IFJvZ3VlKHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgY2FzZSAnYmxvYic6IHJldHVybiBuZXcgQmxvYih0aGlzLmlkKyssIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIGNhc2UgJ3dpemFyZCc6IHJldHVybiBuZXcgV2l6YXJkKHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgY2FzZSAnYmFuZGl0JzogcmV0dXJuIG5ldyBCYW5kaXQodGhpcy5pZCsrLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvcignd3JvbmcgbmFtZSBvZiB1bml0ISEhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdC1mYWN0b3J5L3VuaXQtZmFjdG9yeS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBBY3Rpb25zID0ge1xyXG4gIGlkbGU6ICdpZGxlJyxcclxuICBzdGVwOiAnc3RlcCcsXHJcbiAgYXR0YWNrOiAnYXR0YWNrJyxcclxuICBkaWU6ICdkaWUnLFxyXG4gIGhlYWw6ICdoZWFsJ1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWN0aW9ucztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0L2FjdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVldWUge1xyXG4gICAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcXVldWVBbGx5KGFsbGllcywgYWxseSkge1xyXG4gICAgICAgIGxldCBob3Jpem9udGFsUG9zaXRpb24gPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmFsbGllc1NwYXduWDtcclxuXHJcbiAgICAgICAgaWYgKCFhbGxpZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGFsbHkueCA9IGhvcml6b250YWxQb3NpdGlvbiAtIDUwO1xyXG4gICAgICAgICAgICBhbGx5LnkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmdyb3VuZExldmVsWTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGxpZXMuZm9yRWFjaChhbGx5ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChob3Jpem9udGFsUG9zaXRpb24gPiBhbGx5LngpIFxyXG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxQb3NpdGlvbiA9IGFsbHkueDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhbGx5LnggPSBob3Jpem9udGFsUG9zaXRpb24gLSA1MDtcclxuICAgICAgICAgICAgYWxseS55ID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5ncm91bmRMZXZlbFk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHF1ZXVlRW5lbXkoZW5lbWllcywgZW5lbXkpIHtcclxuICAgICAgICBsZXQgaG9yaXpvbnRhbFBvc2l0aW9uID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5lbmVtaWVzU3Bhd25YO1xyXG5cclxuICAgICAgICBpZiAoIWVuZW1pZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGVuZW15LnggPSBob3Jpem9udGFsUG9zaXRpb247XHJcbiAgICAgICAgICAgIGVuZW15LnkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmdyb3VuZExldmVsWTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbmVtaWVzLmZvckVhY2goZW5lbXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGhvcml6b250YWxQb3NpdGlvbiA8IGVuZW15LngpIFxyXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uID0gZW5lbXkueDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlbmVteS54ID0gaG9yaXpvbnRhbFBvc2l0aW9uICsgNTA7XHJcbiAgICAgICAgICAgIGVuZW15LnkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmdyb3VuZExldmVsWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9xdWV1ZS9xdWV1ZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgU2NlbmVCYXNlIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMsIHByZWxvZGVyKSB7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMgPSBnYW1lQ2FudmFzO1xyXG4gICAgdGhpcy5tdXNpYyA9IG11c2ljO1xyXG4gICAgdGhpcy5wcmVsb2RlciA9IHByZWxvZGVyO1xyXG4gIH1cclxuXHJcbiAgZnJhbWUodGltZXN0YW1wKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVN0YXRlKHRpbWVzdGFtcCk7XHJcbiAgICB0aGlzLnJlbmRlcih0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZC4nKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkLicpO1xyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NjZW5lcy9zY2VuZS5iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGxldmVscyA9IFtcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdza2VsZXRvbicgfVxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogJy4vaW1ncy9iYWNrZ3JvdW5kcy9nYW1lLnBuZycsXHJcbiAgICAgICAgZ3JvdW5kTGV2ZWxZOiA2NDAsXHJcbiAgICAgICAgZW5lbWllczogW1xyXG4gICAgICAgICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnY291bnRyeS1rbmlnaHQnIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICcuL2ltZ3MvYmFja2dyb3VuZHMvZ2FtZS5wbmcnLFxyXG4gICAgICAgIGdyb3VuZExldmVsWTogNjQwLFxyXG4gICAgICAgIGVuZW1pZXM6IFtcclxuICAgICAgICAgICAgeyBuYW1lOiAnY291bnRyeS1rbmlnaHQnIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2JhbmRpdCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2tuaWdodCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnd2l6YXJkJyB9LFxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogJy4vaW1ncy9iYWNrZ3JvdW5kcy9nYW1lLnBuZycsXHJcbiAgICAgICAgZ3JvdW5kTGV2ZWxZOiA2NDAsXHJcbiAgICAgICAgZW5lbWllczogW1xyXG4gICAgICAgICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnYmFuZGl0JyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICd3aXphcmQnIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ3dpemFyZCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdyb2d1ZScgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAna25pZ2h0JyB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2tuaWdodCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAna25pZ2h0JyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdyb2d1ZScgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnd2l6YXJkJyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICd3aXphcmQnIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2NvdW50cnkta25pZ2h0JyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2Jsb2InIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxyXG4gICAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogJy4vaW1ncy9iYWNrZ3JvdW5kcy9nYW1lLnBuZycsXHJcbiAgICAgICAgZ3JvdW5kTGV2ZWxZOiA2NDAsXHJcbiAgICAgICAgZW5lbWllczogW1xyXG4gICAgICAgICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2JhbmRpdCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ3JvZ3VlJyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICd3aXphcmQnIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2tuaWdodCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnY291bnRyeS1rbmlnaHQnIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2Jsb2InIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ2tuaWdodCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnYmFuZGl0JyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdrbmlnaHQnIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ3JvZ3VlJyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdjb3VudHJ5LWtuaWdodCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnYmFuZGl0JyB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6ICdrbmlnaHQnIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogJ3dpemFyZCcgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbGV2ZWxzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2xldmVscy9sZXZlbHMuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi4vdW5pdC9hY3Rpb25zJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0aW5nVGV4dCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLnN0YXRlID0gW107XHJcbiAgICAgICAgdGhpcy5zaGlmdFJpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zaGlmdCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFNpbmdsZXRvbkluc3RhbmNlKGNvbnRleHQpIHtcclxuICAgICAgICBpZiAoIUZsb2F0aW5nVGV4dC5pbnN0YW5jZSkgRmxvYXRpbmdUZXh0Lmluc3RhbmNlID0gbmV3IEZsb2F0aW5nVGV4dChjb250ZXh0KTtcclxuICAgICAgICByZXR1cm4gRmxvYXRpbmdUZXh0Lmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh1bml0KSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5wdXNoKHtcclxuICAgICAgICAgICAgdGV4dDogdW5pdC50ZXh0LFxyXG4gICAgICAgICAgICBwb3NpdGlvblg6IHVuaXQucG9zaXRpb25YLFxyXG4gICAgICAgICAgICBwb3NpdGlvblk6IHVuaXQucG9zaXRpb25ZLFxyXG4gICAgICAgICAgICBhY3Rpb246IHVuaXQuYWN0aW9uLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmZvckVhY2godGV4dFBhcmFtID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPScxNHB4IFBpeGVsYXRlJztcclxuICAgICAgICAgICAgaWYgKHRleHRQYXJhbS5hY3Rpb24gPT09IEFjdGlvbnMuYXR0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWRDb2xvciA9IGByZ2JhKDI0OCwgMjIsIDk3LCAke3RleHRQYXJhbS5vcGFjaXR5fSlgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gcmVkQ29sb3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGV4dFBhcmFtLmFjdGlvbiA9PT0gQWN0aW9ucy5oZWFsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBncmVlbkNvbG9yID0gYHJnYmEoMTE3LCAyNDgsIDQ4LCAke3RleHRQYXJhbS5vcGFjaXR5fSlgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gZ3JlZW5Db2xvcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdoaXRlID0gYHJnYmEoMjU1LCAyNTUsIDI1NSwgJHt0ZXh0UGFyYW0ub3BhY2l0eX0pYFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHdoaXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChgJHt0ZXh0UGFyYW0udGV4dH1gLCB0ZXh0UGFyYW0ucG9zaXRpb25YLCB0ZXh0UGFyYW0ucG9zaXRpb25ZKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQb3NpdGlvbigpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmZvckVhY2godGV4dCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0ZXh0Lm9wYWNpdHkgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnN0YXRlLmZpbmRJbmRleChjdXJyZW50RGFtYWdlID0+IGN1cnJlbnREYW1hZ2UgPT09IHRleHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGV4dC5wb3NpdGlvblggKz0gdGhpcy5zaGlmdDtcclxuICAgICAgICAgICAgICAgIHRleHQucG9zaXRpb25ZIC09IDAuNztcclxuICAgICAgICAgICAgICAgIHRleHQub3BhY2l0eSAtPSAwLjAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50aWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICBpZiAodGhpcy5zaGlmdCA+PSAwLjUpIHRoaXMuc2hpZnRSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc2hpZnQgPD0gLTAuNSkgdGhpcy5zaGlmdFJpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNoaWZ0UmlnaHQgPyB0aGlzLnNoaWZ0ICs9IDAuMDMgOiB0aGlzLnNoaWZ0IC09IDAuMDM7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9mbG9hdGluZy10ZXh0L2Zsb2F0aW5nLXRleHQuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW4obWVzc2FnZSwgbWVzc2FnZVgsIGJ1dHRvbnMpIHtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZVggPSBtZXNzYWdlWDtcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBidXR0b25zO1xyXG4gICAgICAgIHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZmFkZUluID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLmlzT3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5mYWRlSW4gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzT3BlbmVkICYmIHRoaXMub3BhY2l0eSA8PSAwLjEpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZhZGVJbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcGFjaXR5ID4gMC4xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHkgLT0gMC4wMztcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLm9wYWNpdHk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGhpcy5tZXNzYWdlLCB0aGlzLm1lc3NhZ2VYICwgMjAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24ucmVuZGVyKHRoaXMuY29udGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlWCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3BhY2l0eSA8PSAxKSB0aGlzLm9wYWNpdHkgKz0gMC4wMTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5vcGFjaXR5O1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGhpcy5tZXNzYWdlLCB0aGlzLm1lc3NhZ2VYICwgMjAwKTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IGJ1dHRvbi5yZW5kZXIodGhpcy5jb250ZXh0KSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZGlhbG9nL2RpYWxvZy5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICB7IEdhbWVDYW52YXMgfSBmcm9tICcuL2dhbWUtY2FudmFzL2dhbWUtY2FudmFzJztcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3N0YXRlL3N0YXRlJztcclxuaW1wb3J0IHsgTWVudVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvbWVudS5zY2VuZSc7XHJcbmltcG9ydCB7IEdhbWVTY2VuZSB9IGZyb20gJy4vc2NlbmVzL2dhbWUuc2NlbmUnO1xyXG5pbXBvcnQgTXVzaWMgZnJvbSAnLi9tdXNpYy9tdXNpYyc7XHJcbmltcG9ydCBTdGF0aXN0aWNTY2VuZSBmcm9tICcuL3NjZW5lcy9zdGF0aXN0aWMnO1xyXG5cclxud2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgY29uc3Qgc3RhdGUgPSBuZXcgU3RhdGUoKTtcclxuICAgIGNvbnN0IGdhbWVDYW52YXMgPSBuZXcgR2FtZUNhbnZhcygpO1xyXG4gICAgY29uc3QgbXVzaWMgPSBuZXcgTXVzaWMoZ2FtZUNhbnZhcyk7XHJcbiAgICAvLyBjb25zdCBwcmVsb2RlciA9IG5ldyBQcmVsb2FkZXIoc3RhdGUsIGdhbWVDYW52YXMpO1xyXG4gICAgY29uc3QgbWVudVNjZW5lID0gbmV3IE1lbnVTY2VuZShzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMpO1xyXG4gICAgY29uc3QgZ2FtZVNjZW5lID0gbmV3IEdhbWVTY2VuZShzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMpO1xyXG4gICAgY29uc3Qgc3RhdGlzdGljU2NlbmUgPSBuZXcgU3RhdGlzdGljU2NlbmUoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuXHJcbiAgICAvLyBzdGF0ZS5zY2VuZXMubWVudS5pbnN0YW5jZSA9IHByZWxvZGVyO1xyXG4gICAgc3RhdGUuc2NlbmVzLm1lbnUuaW5zdGFuY2UgPSBtZW51U2NlbmU7XHJcbiAgICBzdGF0ZS5zY2VuZXMuZ2FtZS5pbnN0YW5jZSA9IGdhbWVTY2VuZTtcclxuICAgIHN0YXRlLnNjZW5lcy5zdGF0aXN0aWMuaW5zdGFuY2UgPSBzdGF0aXN0aWNTY2VuZTtcclxuICAgIHN0YXRlLmN1cnJlbnRTY2VuZSA9IG1lbnVTY2VuZTtcclxuXHJcbiAgICAoZnVuY3Rpb24gZnJhbWUodGltZXN0YW1wKSB7XHJcbiAgICAgICAgc3RhdGUuY3VycmVudFNjZW5lLmZyYW1lKHRpbWVzdGFtcCk7XHJcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcclxuICAgIH0pKCk7XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tYWluLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgR2FtZUNhbnZhcyB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmlkID0gJ2NhbnZhcyc7XHJcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSAxMTAwO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmhlaWdodCA9IDcwMDtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5mb250ID0nMzBweCBQaXhlbGF0ZSc7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XHJcblxyXG4gICAgICAgIHRoaXMuY2xpY2tTdWJzY3JpYmVycyA9IFtdOyBcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmNhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoKSA9PiB0aGlzLmV4ZWN1dGVDbGlja0hhbmRsZXJzKCkpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsICgpID0+IHRoaXMuY2hhbmdlTW91c2UoKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlT25DbGljayguLi5zdWJzY3JpYmVycykge1xyXG4gICAgICAgIHN1YnNjcmliZXJzLmZvckVhY2goc3Vic2NyaWJlciA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tTdWJzY3JpYmVycy5wdXNoKHN1YnNjcmliZXIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVuc3Vic2NyaWJlQ2xpY2soc3Vic2NyaWJlcikge1xyXG4gICAgICAgIGlmIChzdWJzY3JpYmVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGlja1N1YnNjcmliZXJzLmluZGV4T2Yoc3Vic2NyaWJlcik7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWNrU3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tTdWJzY3JpYmVycyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleGVjdXRlQ2xpY2tIYW5kbGVycygpIHtcclxuICAgICAgICBjb25zdCB4ID0gZXZlbnQuY2xpZW50WCAtIHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmxlZnQ7XHJcbiAgICAgICAgY29uc3QgeSA9IGV2ZW50LmNsaWVudFkgLSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XHJcbiAgICAgICAgdGhpcy5jbGlja1N1YnNjcmliZXJzLmZvckVhY2goc3Vic2NyaWJlciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNsaWNrZWRJbnNpZGVTdWJzY3JpYmVyID0gc3Vic2NyaWJlci54IDw9IHhcclxuICAgICAgICAgICAgICAgICYmIHN1YnNjcmliZXIueCArIHN1YnNjcmliZXIud2lkdGggPj0geFxyXG4gICAgICAgICAgICAgICAgJiYgc3Vic2NyaWJlci55IDw9IHkgXHJcbiAgICAgICAgICAgICAgICAmJiBzdWJzY3JpYmVyLnkgKyBzdWJzY3JpYmVyLmhlaWdodCA+PSB5O1xyXG5cclxuICAgICAgICAgICAgaWYgKGNsaWNrZWRJbnNpZGVTdWJzY3JpYmVyKSBzdWJzY3JpYmVyLmNsaWNrSGFuZGxlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZU1vdXNlKCkge1xyXG4gICAgICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICBjb25zdCBpc0hvdmVyID0gdGhpcy5jbGlja1N1YnNjcmliZXJzLnNvbWUoc3Vic2NyaWJlciA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdWJzY3JpYmVyLnggPD0geFxyXG4gICAgICAgICAgICAgICAgJiYgc3Vic2NyaWJlci54ICsgc3Vic2NyaWJlci53aWR0aCA+PSB4XHJcbiAgICAgICAgICAgICAgICAmJiBzdWJzY3JpYmVyLnkgPD0geSBcclxuICAgICAgICAgICAgICAgICYmIHN1YnNjcmliZXIueSArIHN1YnNjcmliZXIuaGVpZ2h0ID49IHk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmIChpc0hvdmVyKSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykuc3R5bGUuY3Vyc29yID0gJ3VybChcImltZ3MvVUkvY3Vyc29yLnBuZ1wiKSwgYXV0byc7XHJcbiAgICAgICAgZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJykuc3R5bGUuY3Vyc29yID0gJ2RlZmF1bHQnO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZ2FtZS1jYW52YXMvZ2FtZS1jYW52YXMuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIGltcG9ydCBsZXZlbHMgZnJvbSAnLi4vbGV2ZWxzL2xldmVscyc7XHJcbmltcG9ydCBVbml0RmFjdG9yeSBmcm9tICcuLi91bml0LWZhY3RvcnkvdW5pdC1mYWN0b3J5JztcclxuaW1wb3J0IFF1ZXVlIGZyb20gJy4uL3F1ZXVlL3F1ZXVlJztcclxuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vY29uc3RhbnRzJztcclxuXHJcbmV4cG9ydCBjbGFzcyBTdGF0ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB0aGlzLmlzUGF1c2VkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NlbmUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc2NlbmVzID0ge1xyXG4gICAgICAgICAgICBtZW51OiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmRTcHJpdGU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBjbG91ZHNJbWFnZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGNsb3Vkc09mZnNldFg6IDAsXHJcbiAgICAgICAgICAgICAgICBiZWx0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYmVsdFk6IC03MjAsXHJcbiAgICAgICAgICAgICAgICBtZW51U2hlZXQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBtZW51U2hlZXRZOiAtNTUwLFxyXG4gICAgICAgICAgICAgICAgYWJvdXRTaGVldDogbnVsbCxcclxuICAgICAgICAgICAgICAgIGFib3V0U2hlZXRZOiAtNjgwLFxyXG4gICAgICAgICAgICAgICAgYWJvdXRTaGVldFZpc2libGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgdmVsb2NpdHk6IDAsXHJcbiAgICAgICAgICAgICAgICBhbmdsZTogMC4wMSxcclxuICAgICAgICAgICAgICAgIGdyYXZpdHk6IC05LjgwNjY1LFxyXG4gICAgICAgICAgICAgICAgYWNjZWxlcmF0aW9uOiBudWxsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdhbWU6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgZW5lbWllc1NwYXduWDogZGVmYXVsdHMuZW5lbWllc1NwYXduWCxcclxuICAgICAgICAgICAgICAgIGFsbGllc1NwYXduWDogZGVmYXVsdHMuYWxsaWVzU3Bhd25YLFxyXG4gICAgICAgICAgICAgICAgaXNQYXVzZUdhbWU6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBpc0RlbW86IG51bGwsXHJcbiAgICAgICAgICAgICAgICBtb25leTogbnVsbCxcclxuICAgICAgICAgICAgICAgIHBhc3RNb25leTogbnVsbCxcclxuICAgICAgICAgICAgICAgIG51bWJlck9mTGV2ZWxzOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgY3VycmVudExldmVsOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV2ZWxOdW1iZXI6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZDogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBncm91bmRMZXZlbFk6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgYWxsaWVzOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGVuZW1pZXM6IG51bGxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHN0YXRpc3RpYzoge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgdGltZVNwZW50OiAwLFxyXG4gICAgICAgICAgICAgICAgbGV2ZWxzRmFpbGVkOiAwLFxyXG4gICAgICAgICAgICAgICAgdG90YWxEYW1hZ2U6IDAsXHJcbiAgICAgICAgICAgICAgICByZWNlaXZlZERhbWFnZTogMCxcclxuICAgICAgICAgICAgICAgIGVhcm5lZE1vbmV5OiBkZWZhdWx0cy5zdGFydE1vbmV5LFxyXG4gICAgICAgICAgICAgICAgaGVhbGVkSHA6IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMuZ2FtZS5tb25leSA9IGRlZmF1bHRzLnN0YXJ0TW9uZXk7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMuZ2FtZS5wYXN0TW9uZXkgPSBkZWZhdWx0cy5zdGFydE1vbmV5O1xyXG4gICAgICAgIHRoaXMuc2NlbmVzLnN0YXRpc3RpYy50aW1lU3BlbnQgPSAwO1xyXG4gICAgICAgIHRoaXMuc2NlbmVzLnN0YXRpc3RpYy5sZXZlbHNGYWlsZWQgPSAwO1xyXG4gICAgICAgIHRoaXMuc2NlbmVzLnN0YXRpc3RpYy50b3RhbERhbWFnZSA9IDA7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMuc3RhdGlzdGljLnJlY2VpdmVkRGFtYWdlID0gMDtcclxuICAgICAgICB0aGlzLnNjZW5lcy5zdGF0aXN0aWMuZWFybmVkTW9uZXkgPSBkZWZhdWx0cy5zdGFydE1vbmV5O1xyXG4gICAgICAgIHRoaXMuc2NlbmVzLnN0YXRpc3RpYy5oZWFsZWRIcCA9IDA7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdGF0ZS9zdGF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuLi8uLi91bml0L3Nwcml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTa2VsZXRvbiBleHRlbmRzIFVuaXQge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBoZWFsdGg6IDgsXHJcbiAgICAgICAgICAgIGRhbWFnZTogMixcclxuICAgICAgICAgICAgYXR0YWNrVGltZTogMjE0MixcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDIzLFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDk1MixcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiAxOTAwLFxyXG4gICAgICAgICAgICBzdGVwU2l6ZTogMC42LFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgICAgICAgICAgaWRsZVRpbWU6IDEwMDBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvc3QgPSAyO1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDI0LFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMzIsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxMSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDIwMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDEwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy53YWxrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24td2Fsay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAyNCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDMzLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMTMsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiA5MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDEwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNDMsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAzNyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDE4LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTI1LFxyXG4gICAgICAgICAgICB4T2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMCA6IC0xNixcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDEwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1kaWUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogMzMsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAzMixcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDE1LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTUwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogMTBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGVzIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaWRsZSA9IG51bGw7XHJcbiAgICB0aGlzLndhbGsgPSBudWxsO1xyXG4gICAgdGhpcy5hdHRhY2sgPSBudWxsO1xyXG4gICAgdGhpcy5kaWUgPSBudWxsO1xyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvc3ByaXRlcy5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuLi8uLi91bml0L3Nwcml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLbmlnaHQgZXh0ZW5kcyBVbml0IHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24pIHtcclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgaGVhbHRoOiAxNSxcclxuICAgICAgICAgICAgZGFtYWdlOiA0LFxyXG4gICAgICAgICAgICBhdHRhY2tUaW1lOiAxNTAwLFxyXG4gICAgICAgICAgICByYW5nZUF0dGFjazogMjQsXHJcbiAgICAgICAgICAgIHRpbWVUb0hpdDogNzUwLFxyXG4gICAgICAgICAgICBkZWF0aFRpbWU6IDcwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDAuOCxcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gNDtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDQyLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNDAsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA0LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMzAwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDI2IDogMTZcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LXdhbGstJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNDIsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDgsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxNTAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMjYgOiAxNlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTcwLFxyXG4gICAgICAgICAgICB4T2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMCA6IC0zOCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAyNiA6IDE2XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LWRpZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA0MixcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDkwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDI2IDogMTZcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL2tuaWdodC9rbmlnaHQuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291bnRyeUtuaWdodCBleHRlbmRzIFVuaXQge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBoZWFsdGg6IDEwLFxyXG4gICAgICAgICAgICBkYW1hZ2U6IDEsXHJcbiAgICAgICAgICAgIGF0dGFja1RpbWU6IDUwMCxcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDE5LFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDQwMCxcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiAxMDAwLFxyXG4gICAgICAgICAgICBzdGVwU2l6ZTogMS41LFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgICAgICAgICAgaWRsZVRpbWU6IDEwMDBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvc3QgPSAzO1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xyXG4gICAgfVxyXG4gICAgY29uZmlndXJlU3ByaXRlcygpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWlkbGUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAzOSxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDYsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMzggOiAyNlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LXJ1bi0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA2NCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDQ1LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDExMixcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAzOCA6IDI2XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA0MixcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDQsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMzggOiAyNlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQtZGllLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDY0LFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNDUsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA4LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTU1LFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDM4IDogMjZcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVW5pdCBmcm9tICcuLi8uLi91bml0L3VuaXQnO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvZ3VlIGV4dGVuZHMgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGhlYWx0aDogMTAsXHJcbiAgICAgICAgICAgIGRhbWFnZTogMixcclxuICAgICAgICAgICAgYXR0YWNrVGltZTogMTAwMCxcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDQwLFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDgwMCxcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiAxMDAwLFxyXG4gICAgICAgICAgICBzdGVwU2l6ZTogMSxcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGlkbGVUaW1lOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gMztcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvcm9ndWUvcm9ndWUtaWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA2NCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDIxLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMyxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDIwMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1ydW4tJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyMyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDYsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMTIsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiA3XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyMyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTEyLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogN1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvcm9ndWUvcm9ndWUtZGVhdGgtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogMzMsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyMSxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDksXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMzAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiA3XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy9yb2d1ZS9yb2d1ZS5qc1xuLy8gbW9kdWxlIGlkID0gMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuLi8uLi91bml0L3Nwcml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbG9iIGV4dGVuZHMgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGhlYWx0aDogMyxcclxuICAgICAgICAgICAgZGFtYWdlOiA0LFxyXG4gICAgICAgICAgICBhdHRhY2tUaW1lOiAxMjAwLFxyXG4gICAgICAgICAgICByYW5nZUF0dGFjazogMjcsXHJcbiAgICAgICAgICAgIHRpbWVUb0hpdDogMTEwMCxcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiAxMDAwLFxyXG4gICAgICAgICAgICBzdGVwU2l6ZTogMSxcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGlkbGVUaW1lOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gMjtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuICAgIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9ibG9iL2Jsb2ItaWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA4MCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDIzLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMyxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDI1MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDMxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy53YWxrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmxvYi9ibG9iLW1vdmUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDgsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMTIsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAzMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmxvYi9ibG9iLWF0dGFjay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA4MCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDMzLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMTAsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMzAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAzMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmxvYi9ibG9iLWRlYXRoLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDgwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNTQsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA4LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTU1LFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMzFcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL2Jsb2IvYmxvYi5qc1xuLy8gbW9kdWxlIGlkID0gMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuLi8uLi91bml0L3Nwcml0ZSc7XHJcbmltcG9ydCBBY3Rpb25zIGZyb20gJy4uLy4uL3VuaXQvYWN0aW9ucyc7XHJcbmltcG9ydCBEaXJlY3Rpb24gZnJvbSAnLi4vLi4vdW5pdC9kaXJlY3Rpb24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV2l6YXJkIGV4dGVuZHMgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGhlYWx0aDogMjAsXHJcbiAgICAgICAgICAgIGRhbWFnZTogMSxcclxuICAgICAgICAgICAgYXR0YWNrVGltZTogMTUwMCxcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDI4LFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDEwMDAsXHJcbiAgICAgICAgICAgIGRlYXRoVGltZTogMTkwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDAuNCxcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGlkbGVUaW1lOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5oZWFsdGhUb0hlYWwgPSAxO1xyXG4gICAgICAgIHRoaXMuaGVhbFJhbmdlID0gMTIwO1xyXG4gICAgICAgIHRoaXMuY29zdCA9IDM7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVTcHJpdGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlU3ByaXRlcygpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtaWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA4MCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDgwLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMTAsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAyMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtcnVuLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDcwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNTYsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA1LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMjUwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMjFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmF0dGFjayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDEwMCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDU3LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDE4MCxcclxuICAgICAgICAgICAgeE9mZnNldDogLTE0LFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMjFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmRpZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtZGVhdGgtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA4MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMjUwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMjFcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNwcml0ZXMuaGVhbCA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtaGVhbC0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA4MCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDgwLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMTAsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyNTAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAyMVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRvQWN0aW9uKHN0YXRlLCB0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpZShzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudEFjdGlvbiA9PT0gQWN0aW9ucy5pZGxlXHJcbiAgICAgICAgICAgICYmIHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPCB0aGlzLmlkbGVUaW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZBbGx5KHN0YXRlKSAmJiB0aGlzLmlzVW5pdFJhbmdlKHN0YXRlKSAmJiAhc3RhdGUuaXNQYXVzZUdhbWUpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFsKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luRnJvbnRPZkFsbHkoc3RhdGUpIHx8IHN0YXRlLmlzUGF1c2VHYW1lXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNJbkZyb250T2ZFbmVteShzdGF0ZSkgJiYgdGhpcy5pc0VuZW15RHlpbmcoc3RhdGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWRsZShzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZFbmVteShzdGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5hdHRhY2soc3RhdGUsIHRpbWVzdGFtcCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdGVwKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoZWFsKHN0YXRlLCB0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QWN0aW9uICE9PSBBY3Rpb25zLmhlYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gQWN0aW9ucy5oZWFsO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgICAgICB0aGlzLnNwcml0ZXMuaGVhbC5yZXNldCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVkoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaGVhbFRpbWUgPSB0aGlzLmF0dGFja1RpbWU7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0VW5pdCA9IHRoaXMucGxheWVyc1VuaXQgPyBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdXHJcbiAgICAgICAgICAgIDogc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF07XHJcbiAgICAgICAgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiBoZWFsVGltZSBcclxuICAgICAgICAgICAgJiYgdGFyZ2V0VW5pdC5oZWFsdGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICB0YXJnZXRVbml0LmhlYWx0aCArPSB0aGlzLmhlYWx0aFRvSGVhbDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uWCA9IHRhcmdldFVuaXQueCBcclxuICAgICAgICAgICAgICAgICsgdGFyZ2V0VW5pdC5zcHJpdGVzLndhbGsuYm9keVhPZmZzZXQ7XHJcbiAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmhlYWx0aFRvSGVhbCxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uWDogcG9zaXRpb25YLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25ZOiB0YXJnZXRVbml0LnksXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuaGVhbCxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzVW5pdCkge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUuaW5zdGFuY2Uuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYy5oZWFsZWRIcCArPSB0aGlzLmhlYWx0aFRvSGVhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNVbml0UmFuZ2Uoc3RhdGUpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXRVbml0ID0gdGhpcy5wbGF5ZXJzVW5pdCA/IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF1cclxuICAgICAgICAgICAgOiBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMueCAtIHRhcmdldFVuaXQueCkgPCB0aGlzLmhlYWxSYW5nZTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDdXJyZW50U3ByaXRlKCkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5jdXJyZW50QWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9ucy5zdGVwOiByZXR1cm4gdGhpcy5zcHJpdGVzLndhbGs7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9ucy5hdHRhY2s6IHJldHVybiB0aGlzLnNwcml0ZXMuYXR0YWNrO1xyXG4gICAgICAgICAgICBjYXNlIEFjdGlvbnMuZGllOiByZXR1cm4gdGhpcy5zcHJpdGVzLmRpZTtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLmhlYWw6IHJldHVybiB0aGlzLnNwcml0ZXMuaGVhbDtcclxuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHRoaXMuc3ByaXRlcy5pZGxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL3dpemFyZC93aXphcmQuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFuZGl0IGV4dGVuZHMgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGhlYWx0aDogNyxcclxuICAgICAgICAgICAgZGFtYWdlOiAyLFxyXG4gICAgICAgICAgICBhdHRhY2tUaW1lOiA2MDAsXHJcbiAgICAgICAgICAgIHJhbmdlQXR0YWNrOiAxNSxcclxuICAgICAgICAgICAgdGltZVRvSGl0OiAzMDAsXHJcbiAgICAgICAgICAgIGRlYXRoVGltZTogMTkwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDAuNixcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGlkbGVUaW1lOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gMztcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMjcsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA2LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTYwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDE5IDogMTFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LXJ1bi0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAzMCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDI3LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDEzMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWF0dGFjay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAzMCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDI1LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNyxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDEzMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWRlYXRoLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMjUsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA2LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogNDAwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDE5IDogMTFcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL2JhbmRpdC9iYW5kaXQuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGRlZmF1bHRzID0ge1xyXG4gICAgZW5lbWllc1NwYXduWDogMTEwMCxcclxuICAgIGFsbGllc1NwYXduWDogMCxcclxuICAgIHN0YXJ0TW9uZXk6IDEwXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZhdWx0cztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdGF0ZS9jb25zdGFudHMuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNjZW5lQmFzZSB9IGZyb20gXCIuL3NjZW5lLmJhc2VcIjtcclxuaW1wb3J0IEJ1dHRvbiBmcm9tIFwiLi4vY29udHJvbHMvYnV0dG9uXCI7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSBcIi4uL3VuaXQvc3ByaXRlXCI7XHJcblxyXG5leHBvcnQgY2xhc3MgTWVudVNjZW5lIGV4dGVuZHMgU2NlbmVCYXNlIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMpIHtcclxuICAgIHN1cGVyKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYyk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgIHVybDogJ2ltZ3MvVUkvbWVudS5wbmcnLFxyXG4gICAgICBmcmFtZVdpZHRoOiAxMTAwLFxyXG4gICAgICBmcmFtZUhlaWdodDogNzAwLFxyXG4gICAgICBudW1iZXJPZkZyYW1lczogMTAsXHJcbiAgICAgIHRpbWVUb0ZyYW1lOiAyNzBcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzSW1hZ2Uuc3JjID0gJ2ltZ3MvVUkvbWVudS1jbG91ZHMucG5nJztcclxuXHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmJlbHQgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdC5zcmMgPSAnaW1ncy9VSS9iZWx0LnBuZyc7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5tZW51U2hlZXQgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUubWVudVNoZWV0LnNyYyA9ICdpbWdzL1VJL3NoZWV0LnBuZyc7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0ID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXQuc3JjID0gJ2ltZ3MvVUkvYWJvdXQtc2hlZXQucG5nJztcclxuXHJcbiAgICB0aGlzLmJ1dHRvbnMgPSB0aGlzLmdldEJ1dHRvbnNDb25maWcoKS5tYXAob3B0aW9ucyA9PiBuZXcgQnV0dG9uKG9wdGlvbnMpKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKC4uLnRoaXMuYnV0dG9ucyk7XHJcbiAgICB0aGlzLm11c2ljLnN1YnNjcmliZSgpO1xyXG5cclxuICAgIHRoaXMucHJldlRpbWVTdGFtcCA9IDA7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVTdGF0ZSgpIHtcclxuICAgIGlmICh0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc09mZnNldFggPj0gOTAwKSB7XHJcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzT2Zmc2V0WCA9IDA7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc09mZnNldFggKz0gMC4xO1xyXG5cclxuICAgIGlmICh0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmJlbHRZIDwgMCkge1xyXG4gICAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmJlbHRZICs9IDEwO1xyXG4gICAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lm1lbnVTaGVldFkgKz0gMTA7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFZpc2libGVcclxuICAgICAgJiYgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0WSA8IC0xNSkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkgKz0gMTU7XHJcbiAgICB9IGVsc2UgaWYgKCF0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRWaXNpYmxlXHJcbiAgICAgICYmIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkgPiAtNjgwKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0WSAtPSAxNTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFjY2VsZXJhdGlvblxyXG4gICAgICA9IHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuZ3Jhdml0eSAqIE1hdGguc2luKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYW5nbGUpO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS52ZWxvY2l0eVxyXG4gICAgICArPSB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFjY2VsZXJhdGlvbiAqIDEwIC8gMTAwMDtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYW5nbGUgKz0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS52ZWxvY2l0eSAqIDEwIC8gMTAwMDtcclxuICB9XHJcblxyXG4gIHJlbmRlcih0aW1lc3RhbXAgPSAwKSB7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5jbG91ZHNJbWFnZSxcclxuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5jbG91ZHNPZmZzZXRYLCAwLCA5MDAsIDEyNiwgMjUwLCAwLCA5MDAsIDEyNik7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmltYWdlLFxyXG4gICAgICB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUuZ2V0RnJhbWVYKCksIDAsXHJcbiAgICAgIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUuZnJhbWVIZWlnaHQsXHJcbiAgICAgIDAsIDAsIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS5mcmFtZVdpZHRoLCB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUuZnJhbWVIZWlnaHQpO1xyXG4gICAgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLnRpY2sodGltZXN0YW1wLCB0aGlzLnByZXZUaW1lU3RhbXApO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmJlbHQsXHJcbiAgICAgIDAsIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdFkpO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnNhdmUoKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnRyYW5zbGF0ZSgxNDAsIDApO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucm90YXRlKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYW5nbGUpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUubWVudVNoZWV0LFxyXG4gICAgICAtMjgwIC8gMiwgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5tZW51U2hlZXRZKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC50cmFuc2xhdGUoNzAwLCB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRZKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnJvdGF0ZSgtdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hbmdsZSAqIDUpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldCxcclxuICAgICAgLTM1MCAvIDIsIDApO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgIHRoaXMubXVzaWMucmVuZGVyKCk7XHJcblxyXG4gICAgdGhpcy5wcmV2VGltZVN0YW1wID0gdGltZXN0YW1wO1xyXG4gIH1cclxuXHJcbiAgc3RhcnRHYW1lKCkge1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2soKTtcclxuICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5pbnN0YW5jZTtcclxuICAgIHRoaXMuc3RhdGUucmVzZXQoKTsgLy8gVE9ETzogbWIgcmVuYW1lIHJlc2V0TW9uZXlcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuaXNEZW1vID0gZmFsc2U7XHJcbiAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5pbml0aWFsaXplKDApO1xyXG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XHJcbiAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5kaWFsb2cub3BlbihgU2VsZWN0IGEgdW5pdCBpbiB0aGUgdXBwZXIgcmlnaHQgY29ybmVyYCwgMjAwLCBbXSk7XHJcbiAgfVxyXG4gIFxyXG4gIHN0YXJ0RGVtb0dhbWUoKSB7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmluc3RhbmNlO1xyXG4gICAgdGhpcy5zdGF0ZS5yZXNldCgpOyAvLyBUT0RPOiBtYiByZW5hbWUgcmVzZXRNb25leVxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5pc0RlbW8gPSB0cnVlO1xyXG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuaW5pdGlhbGl6ZSgwKTtcclxuICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLnN1YnNjcmliZUJ1dHRvbnNDbGljaygpO1xyXG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuZGlhbG9nLm9wZW4oYFNlbGVjdCBhIHVuaXQgaW4gdGhlIHVwcGVyIHJpZ2h0IGNvcm5lcmAsIDIwMCwgW10pO1xyXG4gIH1cclxuXHJcbiAgdG9nZ2xlQWJvdXQoKSB7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRWaXNpYmxlXHJcbiAgICAgID0gIXRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFZpc2libGU7XHJcbiAgfVxyXG5cclxuICBnZXRCdXR0b25zQ29uZmlnKCkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgeyB4OiA3NSwgeTogNDAwLCBoZWlnaHQ6IDQ1LCB3aWR0aDogMTY1LCBjbGlja0hhbmRsZXI6ICgpID0+IHRoaXMuc3RhcnRHYW1lKCkgfSxcclxuICAgICAgeyB4OiA3NSwgeTogNDU1LCBoZWlnaHQ6IDQ1LCB3aWR0aDogMTY1LCBjbGlja0hhbmRsZXI6ICgpID0+IHRoaXMuc3RhcnREZW1vR2FtZSgpIH0sXHJcbiAgICAgIHsgeDogNjUsIHk6IDUxNSwgaGVpZ2h0OiA0NSwgd2lkdGg6IDE4NSwgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLnRvZ2dsZUFib3V0KCkgfVxyXG4gICAgXTtcclxuICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zY2VuZXMvbWVudS5zY2VuZS5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU2NlbmVCYXNlIH0gZnJvbSBcIi4vc2NlbmUuYmFzZVwiO1xyXG5pbXBvcnQgQ29udHJvbFBhbmVsIGZyb20gJy4uL2NvbnRyb2wtcGFuZWwvY29udHJvbC1wYW5lbCc7XHJcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi4vZGlhbG9nL2RpYWxvZyc7XHJcbmltcG9ydCBVbml0RmFjdG9yeSBmcm9tICcuLi91bml0LWZhY3RvcnkvdW5pdC1mYWN0b3J5JztcclxuaW1wb3J0IFF1ZXVlIGZyb20gJy4uL3F1ZXVlL3F1ZXVlJztcclxuaW1wb3J0IGxldmVscyBmcm9tICcuLi9sZXZlbHMvbGV2ZWxzJztcclxuaW1wb3J0IGRlbW9MZXZlbHMgZnJvbSAnLi4vbGV2ZWxzL2RlbW9MZXZlbHMnO1xyXG5pbXBvcnQgRGlyZWN0aW9uIGZyb20gJy4uL3VuaXQvZGlyZWN0aW9uJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9jb250cm9scy9idXR0b24nO1xyXG5pbXBvcnQgRmxvYXRpbmdUZXh0IGZyb20gJy4uL2Zsb2F0aW5nLXRleHQvZmxvYXRpbmctdGV4dCc7XHJcbmltcG9ydCBCdWZmTWFuYWdlciBmcm9tICcuLi9idWZmLW1hbmFnZXIvYnVmZi1tYW5hZ2VyJztcclxuXHJcbmV4cG9ydCBjbGFzcyBHYW1lU2NlbmUgZXh0ZW5kcyBTY2VuZUJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYykge1xyXG4gICAgc3VwZXIoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuXHJcbiAgICB0aGlzLmNvbnRyb2xQYW5lbCA9IG5ldyBDb250cm9sUGFuZWwoc3RhdGUsIGdhbWVDYW52YXMpO1xyXG4gICAgdGhpcy5idWZmTWFuYWdlciA9IG5ldyBCdWZmTWFuYWdlcihzdGF0ZSwgZ2FtZUNhbnZhcyk7XHJcbiAgICB0aGlzLmZsb2F0aW5nVGV4dCA9IEZsb2F0aW5nVGV4dC5nZXRTaW5nbGV0b25JbnN0YW5jZShnYW1lQ2FudmFzLmNvbnRleHQpO1xyXG4gICAgdGhpcy5kaWFsb2cgPSBuZXcgRGlhbG9nKGdhbWVDYW52YXMuY29udGV4dCk7XHJcbiAgICB0aGlzLnVuaXRGYWN0b3J5ID0gVW5pdEZhY3RvcnkuZ2V0U2luZ2xldG9uSW5zdGFuY2UoKTtcclxuICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoc3RhdGUpO1xyXG4gICAgdGhpcy5wcmV2VGltZVN0YW1wID0gMDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVN0YXRlKHRpbWVzdGFtcCkge1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmZvckVhY2goYWxseSA9PiBhbGx5LmRvQWN0aW9uKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUsIHRpbWVzdGFtcCkpO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcy5mb3JFYWNoKGVuZW15ID0+IGVuZW15LmRvQWN0aW9uKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUsIHRpbWVzdGFtcCkpO1xyXG5cclxuICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuZ2V0V2lubmVyKCk7XHJcbiAgICBpZiAod2lubmVyICYmICF0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzUGF1c2VHYW1lKSB7XHJcbiAgICAgICAgdGhpcy5zaG93RW5kR2FtZVdpbmRvdyh3aW5uZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYnVmZk1hbmFnZXIudXBkYXRlVGltZSgpO1xyXG5cclxuICAgIHRoaXMuZmxvYXRpbmdUZXh0LnVwZGF0ZVBvc2l0aW9uKCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIodGltZXN0YW1wKSB7XHJcbiAgICBjb25zdCBnYW1lU3RhdGUgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZShnYW1lU3RhdGUuY3VycmVudExldmVsLmJhY2tncm91bmQsIDAsIDApO1xyXG4gICAgdGhpcy5jb250cm9sUGFuZWwuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24ucmVuZGVyKHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0KSk7XHJcblxyXG4gICAgdGhpcy5idWZmTWFuYWdlci5yZW5kZXIoKTtcclxuXHJcbiAgICBnYW1lU3RhdGUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKGFsbHkgPT4ge1xyXG4gICAgICBjb25zdCBzcHJpdGUgPSBhbGx5LmdldEN1cnJlbnRTcHJpdGUoKTtcclxuICAgICAgc3ByaXRlLnRpY2sodGltZXN0YW1wLCB0aGlzLnByZXZUaW1lU3RhbXApO1xyXG4gICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2Uoc3ByaXRlLmltYWdlLCBzcHJpdGUuZ2V0RnJhbWVYKCksIDAsXHJcbiAgICAgICAgICBzcHJpdGUuZnJhbWVXaWR0aCAtIDEsIHNwcml0ZS5mcmFtZUhlaWdodCxcclxuICAgICAgICAgIGFsbHkueCArIHNwcml0ZS54T2Zmc2V0LCBhbGx5LnksIHNwcml0ZS5mcmFtZVdpZHRoLCBzcHJpdGUuZnJhbWVIZWlnaHQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZ2FtZVN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzLmZvckVhY2goZW5lbXkgPT4ge1xyXG4gICAgICBjb25zdCBzcHJpdGUgPSBlbmVteS5nZXRDdXJyZW50U3ByaXRlKCk7XHJcbiAgICAgIGNvbnN0IGZyYW1lWCA9IChzcHJpdGUuZnJhbWVXaWR0aCAqIChzcHJpdGUubnVtYmVyT2ZGcmFtZXMgLTEpKVxyXG4gICAgICAgICAgLSBzcHJpdGUuZ2V0RnJhbWVYKCk7XHJcbiAgICAgIHNwcml0ZS50aWNrKHRpbWVzdGFtcCwgdGhpcy5wcmV2VGltZVN0YW1wKTtcclxuICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHNwcml0ZS5pbWFnZSwgZnJhbWVYLCAwLFxyXG4gICAgICAgICAgc3ByaXRlLmZyYW1lV2lkdGgsIHNwcml0ZS5mcmFtZUhlaWdodCxcclxuICAgICAgICAgIGVuZW15LnggKyBzcHJpdGUueE9mZnNldCwgZW5lbXkueSwgc3ByaXRlLmZyYW1lV2lkdGgsIHNwcml0ZS5mcmFtZUhlaWdodCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmZsb2F0aW5nVGV4dC5yZW5kZXIoKTtcclxuXHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJCR7dGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leX1gLCAxMDIwLCA0MCk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtnYW1lU3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyICsgMX0vJHtnYW1lU3RhdGUubnVtYmVyT2ZMZXZlbHN9YCwgMTAyMCwgOTApO1xyXG4gICAgdGhpcy5wYXVzZU1lbnVCdXR0b24ucmVuZGVyKHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0KTtcclxuXHJcbiAgICB0aGlzLmRpYWxvZy5yZW5kZXIoKTtcclxuXHJcbiAgICB0aGlzLm11c2ljLnJlbmRlcigpO1xyXG5cclxuICAgIHRoaXMucHJldlRpbWVTdGFtcCA9IHRpbWVzdGFtcDtcclxuICB9XHJcblxyXG4gIGluaXRpYWxpemUobGV2ZWwpIHtcclxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZTtcclxuICAgIGNvbnN0IGlzRGVtbyA9IHN0YXRlLmlzRGVtbztcclxuXHJcbiAgICBzdGF0ZS5pc1BhdXNlR2FtZSA9IHRydWU7XHJcbiAgICBzdGF0ZS5udW1iZXJPZkxldmVscyA9IGlzRGVtbyA/IGRlbW9MZXZlbHMubGVuZ3RoIDogbGV2ZWxzLmxlbmd0aDtcclxuXHJcbiAgICB0aGlzLmxvYWRMZXZlbChsZXZlbCwgaXNEZW1vKTtcclxuICAgIHRoaXMuY29udHJvbFBhbmVsLmNyZWF0ZUNvbnRyb2xQYW5lbChsZXZlbCwgaXNEZW1vKTtcclxuICAgIHRoaXMuYWRkQnVmZk1hbmFnZXIoKTtcclxuXHJcbiAgICBpZiAoIXRoaXMubmV4dEJ1dHRvbikge1xyXG4gICAgICB0aGlzLm5leHRCdXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICB4OiA2NTAsXHJcbiAgICAgICAgeTogMjcwLFxyXG4gICAgICAgIGhlaWdodDogNjEsXHJcbiAgICAgICAgd2lkdGg6IDYxLFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL25leHQtYnV0dG9uLnBuZycsXHJcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygncGxheScpXHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgICAgdGhpcy5idWZmTWFuYWdlci5mdWxsUmVzZXQoKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemUoc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyICsgMSwgaXNEZW1vKTtcclxuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XHJcbiAgICAgICAgICBzdGF0ZS5wYXN0TW9uZXkgPSBzdGF0ZS5tb25leTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLnByZXZCdXR0b24pIHtcclxuICAgICAgdGhpcy5wcmV2QnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgeDogNjIwLFxyXG4gICAgICAgIHk6IDI3MCxcclxuICAgICAgICBoZWlnaHQ6IDU1LFxyXG4gICAgICAgIHdpZHRoOiA1NSxcclxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9wcmV2LWJ1dHRvbi5wbmcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3ByZXYnKVxyXG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgIHRoaXMuYnVmZk1hbmFnZXIuZnVsbFJlc2V0KCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5pbml0aWFsaXplKHN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciAtIDEsIGlzRGVtbyk7XHJcbiAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbnNDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmxldmVsc0ZhaWxlZCsrO1xyXG4gICAgICAgICAgc3RhdGUubW9uZXkgPSBzdGF0ZS5wYXN0TW9uZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH0gXHJcbiAgICBpZiAoIXRoaXMucmVwbGF5QnV0dG9uKSB7XHJcbiAgICAgIHRoaXMucmVwbGF5QnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgeDogNjUwLFxyXG4gICAgICAgIHk6IDI3MCxcclxuICAgICAgICBoZWlnaHQ6IDU1LFxyXG4gICAgICAgIHdpZHRoOiA1NSxcclxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9yZXBsYXkucG5nJyxcclxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdyZXBsYXknKVxyXG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgIHRoaXMuYnVmZk1hbmFnZXIuZnVsbFJlc2V0KCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5pbml0aWFsaXplKHN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciwgaXNEZW1vKTtcclxuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMubGV2ZWxzRmFpbGVkKys7XHJcbiAgICAgICAgICBzdGF0ZS5tb25leSA9IHN0YXRlLnBhc3RNb25leTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5leGl0QnV0dG9uKSB7XHJcbiAgICAgIHRoaXMuZXhpdEJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgIHg6IDQ1MCxcclxuICAgICAgICB5OiAyNzAsXHJcbiAgICAgICAgaGVpZ2h0OiA3MyxcclxuICAgICAgICB3aWR0aDogNjEsXHJcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvVUkvZXhpdC5wbmcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2V4aXQnKTtcclxuICAgICAgICAgIHRoaXMuZGlhbG9nLnJlc2V0KCk7XHJcbiAgICAgICAgICB0aGlzLmJ1ZmZNYW5hZ2VyLmZ1bGxSZXNldCgpO1xyXG4gICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2soKTtcclxuICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lID0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5pbnN0YW5jZTtcclxuICAgICAgICAgIHRoaXMubXVzaWMuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayguLi50aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5idXR0b25zKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmNsb3NlQnV0dG9uKSB7XHJcbiAgICAgIHRoaXMuY2xvc2VCdXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICB4OiAzNTAsXHJcbiAgICAgICAgeTogMjcwLFxyXG4gICAgICAgIGhlaWdodDogNzMsXHJcbiAgICAgICAgd2lkdGg6IDYxLFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL2Nsb3NlLnBuZycsXHJcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2xvc2UnKTtcclxuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25zQ2xpY2soKTtcclxuXHJcbiAgICAgICAgICBzdGF0ZS5pc1BhdXNlR2FtZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMucGF1c2VNZW51QnV0dG9uKSB7XHJcbiAgICAgIHRoaXMucGF1c2VNZW51QnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgeDogMTAyNSxcclxuICAgICAgICB5OiAxNzAsXHJcbiAgICAgICAgaGVpZ2h0OiA0MCxcclxuICAgICAgICB3aWR0aDogNjEsXHJcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvVUkvaGVscC1tZW51LnBuZycsXHJcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGVscC1tZW51Jyk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgc3RhdGUuaXNQYXVzZUdhbWUgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5kaWFsb2cucmVzZXQoKTtcclxuICAgICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gIXN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciA/IDU1MCA6IDQ5MDtcclxuICAgICAgICAgIHRoaXMucHJldkJ1dHRvbi54ID0gNjIwO1xyXG4gICAgICAgICAgdGhpcy5yZXBsYXlCdXR0b24ueCA9IDc2MDtcclxuICAgICAgICAgIGlmICghc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oJ1doYXQgZG8geW91IHdhbnQgdG8gZG8nLCAzNTAsIFt0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLmV4aXRCdXR0b24sIHRoaXMucmVwbGF5QnV0dG9uXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKHRoaXMuY2xvc2VCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kaWFsb2cub3BlbignV2hhdCBkbyB5b3Ugd2FudCB0byBkbycsIDM1MCwgW3RoaXMuY2xvc2VCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbiwgdGhpcy5wcmV2QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbl0pO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLmV4aXRCdXR0b24sIHRoaXMucHJldkJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuc3RhdGlzdGljQnV0dG9uKSB7XHJcbiAgICAgIHRoaXMuc3RhdGlzdGljQnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgeDogNjUwLFxyXG4gICAgICAgIHk6IDI3MCxcclxuICAgICAgICBoZWlnaHQ6IDU1LFxyXG4gICAgICAgIHdpZHRoOiA1NSxcclxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9zdGF0aXN0aWMucG5nJyxcclxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGF0aXN0aWMnKTtcclxuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMuaW5zdGFuY2U7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5zdWJzY3JpYmVPbkNsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLm11c2ljLnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuZGlhbG9nLm9wZW4oJycsIDUwMCwgW3RoaXMuc3RhdGUuY3VycmVudFNjZW5lLmV4aXRCdXR0b25dKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZExldmVsKGxldmVsLCBpc0RlbW8pIHtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcyA9IFtdO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcyA9IFtdO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRMZXZlbCA9IGlzRGVtbyA/IGRlbW9MZXZlbHNbbGV2ZWxdIDogbGV2ZWxzW2xldmVsXTtcclxuICAgIGN1cnJlbnRMZXZlbC5lbmVtaWVzLmZvckVhY2goZW50cnkgPT4ge1xyXG4gICAgICBjb25zdCBlbmVteSA9IHRoaXMudW5pdEZhY3RvcnkuY3JlYXRlKGVudHJ5Lm5hbWUsIERpcmVjdGlvbi5sZWZ0KTtcclxuICAgICAgdGhpcy5xdWV1ZS5xdWV1ZUVuZW15KHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmVuZW1pZXMsIGVuZW15KTtcclxuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcy5wdXNoKGVuZW15KTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmdyb3VuZExldmVsWSA9IGN1cnJlbnRMZXZlbC5ncm91bmRMZXZlbFk7XHJcblxyXG4gICAgY29uc3QgYmFja2dyb3VuZCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgYmFja2dyb3VuZC5zcmMgPSBjdXJyZW50TGV2ZWwuYmFja2dyb3VuZDtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmJhY2tncm91bmQgPSBiYWNrZ3JvdW5kO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmxldmVsTnVtYmVyID0gbGV2ZWw7XHJcbiAgfVxyXG5cclxuICBhZGRCdWZmTWFuYWdlcigpIHtcclxuICAgIHRoaXMuYnVmZk1hbmFnZXIuY3JlYXRlQnV0dG9uKCk7XHJcbiAgfVxyXG4gIFxyXG4gIHN1YnNjcmliZUJ1dHRvbnNDbGljaygpIHtcclxuICAgIHRoaXMuY29udHJvbFBhbmVsLnN1YnNjcmliZSgpO1xyXG4gICAgdGhpcy5idWZmTWFuYWdlci5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMubXVzaWMuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLnBhdXNlTWVudUJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBnZXRXaW5uZXIoKSB7XHJcbiAgICBjb25zdCBlbmVtaWVzID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcztcclxuICAgIGNvbnN0IG5vRW5lbWllc0xlZnQgPSAhZW5lbWllcy5sZW5ndGg7XHJcbiAgICBjb25zdCBlbmVteVJlYWNoZWRMZWZ0U2lkZSA9IGVuZW1pZXNbMF0gJiYgZW5lbWllc1swXS54IDwgMDtcclxuXHJcbiAgICBpZiAobm9FbmVtaWVzTGVmdCkgcmV0dXJuICdhbGxpZXMnO1xyXG4gICAgaWYgKGVuZW15UmVhY2hlZExlZnRTaWRlKSByZXR1cm4gJ2VuZW1pZXMnO1xyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgc2hvd0VuZEdhbWVXaW5kb3cod2lubmVyKSB7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzUGF1c2VHYW1lID0gdHJ1ZTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcblxyXG4gICAgaWYgKHdpbm5lciA9PT0gJ2FsbGllcycpIHtcclxuICAgICAgY29uc3QgaXNMYXN0TGV2ZWwgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciA9PT0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5udW1iZXJPZkxldmVscyAtIDE7XHJcbiAgICAgIGlmIChpc0xhc3RMZXZlbCkge1xyXG4gICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gNDUwO1xyXG4gICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oJ0dhbWUgb3Zlci4gVGhhbmtzIGZvciBwbGF5aW5nIDopJywgMjYwICwgW3RoaXMuZXhpdEJ1dHRvbiwgdGhpcy5zdGF0aXN0aWNCdXR0b25dKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmV4aXRCdXR0b24sIHRoaXMuc3RhdGlzdGljQnV0dG9uKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLmV4aXRCdXR0b24ueCA9IDQ1MDtcclxuICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCdZb3Ugd2luIScsIDQ5NSAsIFt0aGlzLm5leHRCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbl0pO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKHRoaXMubmV4dEJ1dHRvbiwgdGhpcy5leGl0QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICBjb25zdCBib251c01vbmV5ID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwubGV2ZWxOdW1iZXIgKiAzICsgMztcclxuICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgKz0gYm9udXNNb25leTtcclxuICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUucGFzdE1vbmV5ID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmxldmVsTnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5leGl0QnV0dG9uLnggPSA0MDA7XHJcbiAgICAgICAgdGhpcy5wcmV2QnV0dG9uLnggPSA1NTA7XHJcbiAgICAgICAgdGhpcy5yZXBsYXlCdXR0b24ueCA9IDcwMDtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmV4aXRCdXR0b24sIHRoaXMucHJldkJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b24pO1xyXG4gICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oJ1lvdSBsb29zZSA6KCBUcnkgYWdhaW4hJywgMzcwICwgW3RoaXMuZXhpdEJ1dHRvbiwgdGhpcy5wcmV2QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbl0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gNDUwO1xyXG4gICAgICAgIHRoaXMucmVwbGF5QnV0dG9uLnggPSA2NTA7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5leGl0QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbik7XHJcbiAgICAgICAgdGhpcy5kaWFsb2cub3BlbignWW91IGxvb3NlIDooIFRyeSBhZ2FpbiEnLCAzNzAgLCBbdGhpcy5leGl0QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbl0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2NlbmVzL2dhbWUuc2NlbmUuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBCdXR0b24gZnJvbSAnLi4vY29udHJvbHMvYnV0dG9uJztcclxuaW1wb3J0IHBhcmFtZXRlcnNPZlVuaXRCdXR0b25zIGZyb20gJy4vcGFyYW1ldGVycy11bml0LWJ1dHRvbnMnO1xyXG5pbXBvcnQgZGVtb1BhcmFtZXRlcnNPZlVuaXRCdXR0b25zIGZyb20gJy4vZGVtby1wYXJhbWV0ZXJzLXVuaXQtYnV0dG9ucy5qcyc7XHJcbmltcG9ydCBVbml0RmFjdG9yeSBmcm9tICcuLi91bml0LWZhY3RvcnkvdW5pdC1mYWN0b3J5JztcclxuaW1wb3J0IFF1ZXVlIGZyb20gJy4uL3F1ZXVlL3F1ZXVlJztcclxuaW1wb3J0IERpcmVjdGlvbiBmcm9tICcuLi91bml0L2RpcmVjdGlvbic7XHJcbmltcG9ydCBzb3VuZEJ1dHRvbiBmcm9tICcuL3BhcmFtZXRlcnMtaGVscC1idXR0b24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udHJvbFBhbmVsIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzID0gZ2FtZUNhbnZhcztcclxuICAgICAgICB0aGlzLnVuaXRGYWN0b3J5ID0gVW5pdEZhY3RvcnkuZ2V0U2luZ2xldG9uSW5zdGFuY2UoKTtcclxuICAgICAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKHN0YXRlKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb250cm9sUGFuZWwobGV2ZWwsIGlzRGVtbykge1xyXG4gICAgICAgIGNvbnN0IHBhcm1ldGVycyA9IGlzRGVtbyBcclxuICAgICAgICAgICAgPyBkZW1vUGFyYW1ldGVyc09mVW5pdEJ1dHRvbnNcclxuICAgICAgICAgICAgOiBwYXJhbWV0ZXJzT2ZVbml0QnV0dG9ucztcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBwYXJtZXRlcnNbbGV2ZWxdLm1hcChidXR0b25QYXJhbSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgICAgICAgICAgeDogYnV0dG9uUGFyYW0ueCxcclxuICAgICAgICAgICAgICAgIHk6IGJ1dHRvblBhcmFtLnksXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogYnV0dG9uUGFyYW0ud2lkdGgsXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGJ1dHRvblBhcmFtLmhlaWdodCxcclxuICAgICAgICAgICAgICAgIGljb25Vcmw6IGJ1dHRvblBhcmFtLmltZ1VybCxcclxuICAgICAgICAgICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4gdGhpcy5jcmVhdGVVbml0KGJ1dHRvblBhcmFtLm5hbWUpXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVVuaXQobmFtZSkge1xyXG4gICAgICAgIGNvbnN0IGFsbHlVbml0ID0gdGhpcy51bml0RmFjdG9yeS5jcmVhdGUobmFtZSwgRGlyZWN0aW9uLnJpZ2h0KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgPj0gYWxseVVuaXQuY29zdCkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5IC09IGFsbHlVbml0LmNvc3Q7XHJcbiAgICAgICAgICAgIHRoaXMucXVldWUucXVldWVBbGx5KHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcywgYWxseVVuaXQpO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMucHVzaChhbGx5VW5pdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmRpYWxvZy5jbG9zZSgpOyAvLyBUT0RPOiBtYiBuZWVkIHRvIG1vdmVcclxuICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzUGF1c2VHYW1lID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKC4uLnRoaXMuYnV0dG9ucyk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb250cm9sLXBhbmVsL2NvbnRyb2wtcGFuZWwuanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHBhcmFtZXRlcnNPZlVuaXRCdXR0b25zID0gW1xyXG4gICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnd2l6YXJkJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogOTAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiA5MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMTYwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnYmFuZGl0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogOTAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDE2MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAna25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjMwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnd2l6YXJkJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogOTAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDE2MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAna25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjMwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdyb2d1ZScsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvcm9ndWUvcm9ndWUtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAzMDAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICd3aXphcmQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiA5MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMTYwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMzAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3JvZ3VlJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDMwMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnYmFuZGl0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMzcwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdibG9iJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9ibG9iL2Jsb2ItaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiA0NDAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgXVxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcGFyYW1ldGVyc09mVW5pdEJ1dHRvbnM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29udHJvbC1wYW5lbC9wYXJhbWV0ZXJzLXVuaXQtYnV0dG9ucy5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3Qgc291bmRCdXR0b24gPSB7XHJcbiAgICAgICAgbmFtZTogJ3NvdW5kJyxcclxuICAgICAgICBmaXJzdFVybDogJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1vbi5wbmcnLFxyXG4gICAgICAgIHNlY29uZFVybDogJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1vZmYucG5nJyxcclxuICAgICAgICB4OiAxMDIwLFxyXG4gICAgICAgIHk6IDYwLFxyXG4gICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICBoZWlnaHQ6IDMwXHJcbiAgICB9XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzb3VuZEJ1dHRvbjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb250cm9sLXBhbmVsL3BhcmFtZXRlcnMtaGVscC1idXR0b24uanNcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBCdXR0b24gZnJvbSAnLi4vY29udHJvbHMvYnV0dG9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1ZmZNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzID0gZ2FtZUNhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5idWZmSWQgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmZ1bGxSZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUJ1dHRvbigpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSB0aGlzLmdldFBhcmFtZXRlcnNPZkJ1ZmZCdXR0b24oKS5tYXAoYnRuID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICB4OiBidG4ueCxcclxuICAgICAgICAgICAgICAgIHk6IGJ0bi55LFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBidG4uaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGJ0bi53aWR0aCxcclxuICAgICAgICAgICAgICAgIGljb25Vcmw6IGJ0bi5pY29uVXJsLFxyXG4gICAgICAgICAgICAgICAgY2xpY2tIYW5kbGVyOiBidG4uY2xpY2tIYW5kbGVyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGltcHJvdmVXZWFwb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgPj0gMykge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMuZm9yRWFjaCh1bml0ID0+IHtcclxuICAgICAgICAgICAgICAgIHVuaXQuZGFtYWdlKys7XHJcbiAgICAgICAgICAgICAgICB1bml0LndlYXBvbklkQnVmZi5wdXNoKHRoaXMuYnVmZklkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLndlYXBvbkJ1ZmZzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuYnVmZklkKyssXHJcbiAgICAgICAgICAgICAgICB3ZWFwb25TdGFydDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNyxcclxuICAgICAgICAgICAgICAgIGZhZGVJbjogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5IC09IDM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGltcHJvdmVBcm1vcigpIHtcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leSA+PSA1KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKHVuaXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdW5pdC5oZWFsdGggKz0gNTtcclxuICAgICAgICAgICAgICAgIHVuaXQuYXJtb3JJZEJ1ZmYucHVzaCh0aGlzLmJ1ZmZJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hcm1vckJ1ZmZzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRoaXMuYnVmZklkLFxyXG4gICAgICAgICAgICAgICAgYXJtb3JTdGFydDogRGF0ZS5ub3coKSxcclxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDAuNyxcclxuICAgICAgICAgICAgICAgIGZhZGVJbjogZmFsc2VcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5IC09IDU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHdlYXBvblJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKHVuaXQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodW5pdC53ZWFwb25JZEJ1ZmYubGVuZ3RoICYmIHVuaXQud2VhcG9uSWRCdWZmWzBdID09PSB0aGlzLndlYXBvbkJ1ZmZzWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICB1bml0LmRhbWFnZS0tO1xyXG4gICAgICAgICAgICAgICAgdW5pdC53ZWFwb25JZEJ1ZmYuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLndlYXBvbkJ1ZmZzLnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgYXJtb3JSZXNldCgpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMuZm9yRWFjaCh1bml0ID0+IHtcclxuICAgICAgICAgICAgaWYgKHVuaXQuYXJtb3JJZEJ1ZmYubGVuZ3RoICYmIHVuaXQuYXJtb3JJZEJ1ZmZbMF0gPT09IHRoaXMuYXJtb3JCdWZmc1swXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHVuaXQuaGVhbHRoID4gNSkgdW5pdC5oZWFsdGggLT0gNTtcclxuICAgICAgICAgICAgICAgIGVsc2UgdW5pdC5oZWFsdGggPSAxO1xyXG5cclxuICAgICAgICAgICAgICAgIHVuaXQuYXJtb3JJZEJ1ZmYuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmFybW9yQnVmZnMuc2hpZnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBmdWxsUmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy53ZWFwb25CdWZmcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYXJtb3JCdWZmcyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVRpbWUoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMud2VhcG9uQnVmZnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3NlZFdlYXBvblRpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy53ZWFwb25CdWZmc1swXS53ZWFwb25TdGFydDtcclxuICAgICAgICAgICAgY29uc3QgYnVmZkR1cmF0aW9uID0gMzAwMDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFzc2VkV2VhcG9uVGltZSA+IGJ1ZmZEdXJhdGlvbikgdGhpcy53ZWFwb25SZXNldCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy53ZWFwb25CdWZmcy5mb3JFYWNoKGJ1ZmYgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBidWZmLmZhZGVJbiA/IDAuMDEgOiAtMC4wMTtcclxuICAgICAgICAgICAgICAgIGJ1ZmYub3BhY2l0eSArPSBkZWx0YTtcclxuICAgICAgICAgICAgICAgIGlmIChidWZmLm9wYWNpdHkgPCAwLjEpIGJ1ZmYuZmFkZUluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmYub3BhY2l0eSA+IDAuNykgYnVmZi5mYWRlSW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5hcm1vckJ1ZmZzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXNzZWRBcm1vclRpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5hcm1vckJ1ZmZzWzBdLmFybW9yU3RhcnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZEdXJhdGlvbiA9IDIwMDAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhc3NlZEFybW9yVGltZSA+IGJ1ZmZEdXJhdGlvbikgdGhpcy5hcm1vclJlc2V0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFybW9yQnVmZnMuZm9yRWFjaChidWZmID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gYnVmZi5mYWRlSW4gPyAwLjAxNSA6IC0wLjAxNTtcclxuICAgICAgICAgICAgICAgIGJ1ZmYub3BhY2l0eSArPSBkZWx0YTtcclxuICAgICAgICAgICAgICAgIGlmIChidWZmLm9wYWNpdHkgPCAwLjEpIGJ1ZmYuZmFkZUluID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGJ1ZmYub3BhY2l0eSA+IDAuNykgYnVmZi5mYWRlSW4gPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZSgpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayguLi50aGlzLmJ1dHRvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4gYnV0dG9uLnJlbmRlcih0aGlzLmdhbWVDYW52YXMuY29udGV4dCkpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5mb250ID0gJzE4cHggUGl4ZWxhdGUnO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCckMycsIDUwLCAxNDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCckNScsIDUwLCAyMTApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICAgICAgY29uc3Qgd2VhcG9uQnRuID0gdGhpcy5idXR0b25zWzBdO1xyXG4gICAgICAgIHRoaXMud2VhcG9uQnVmZnMuZm9yRWFjaCgoYnVmZiwgcG9zaXRpb24pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IGJ1ZmYub3BhY2l0eTtcclxuICAgICAgICAgICAgY29uc3QgYnVmZlhQb3NpdGlvbiA9IHdlYXBvbkJ0bi54ICsgNzAgKiAocG9zaXRpb24gKyAxKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHdlYXBvbkJ0bi5pY29uLCBidWZmWFBvc2l0aW9uLCB3ZWFwb25CdG4ueSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgY29uc3QgYXJtb3JCdG4gPSB0aGlzLmJ1dHRvbnNbMV07XHJcbiAgICAgICAgdGhpcy5hcm1vckJ1ZmZzLmZvckVhY2goKGJ1ZmYsIHBvc2l0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSBidWZmLm9wYWNpdHk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZYUG9zaXRpb24gPSBhcm1vckJ0bi54ICsgNzAgKiAocG9zaXRpb24gKyAxKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKGFybW9yQnRuLmljb24sIGJ1ZmZYUG9zaXRpb24sIGFybW9yQnRuLnkpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UGFyYW1ldGVyc09mQnVmZkJ1dHRvbigpIHtcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXJtJywgaWNvblVybDogJ2ltZ3MvYnVmZi1pY29uL3dlYXBvbi5wbmcnLFxyXG4gICAgICAgICAgICAgICAgeDogMjAsIHk6IDkwLCB3aWR0aDogNDAsIGhlaWdodDogNDAsXHJcbiAgICAgICAgICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHRoaXMuaW1wcm92ZVdlYXBvbigpXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhcm1vcicsIGljb25Vcmw6ICdpbWdzL2J1ZmYtaWNvbi9hcm1vci5wbmcnLFxyXG4gICAgICAgICAgICAgICAgeDogMjAsIHk6IDE2MCwgd2lkdGg6IDQwLCBoZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLmltcHJvdmVBcm1vcigpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYnVmZi1tYW5hZ2VyL2J1ZmYtbWFuYWdlci5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9jb250cm9scy9idXR0b24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTXVzaWMge1xyXG4gICAgY29uc3RydWN0b3IoZ2FtZUNhbnZhcykge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcyA9IGdhbWVDYW52YXM7XHJcbiAgICAgICAgdGhpcy5jb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRNdXNpYygpIHtcclxuICAgICAgICB0aGlzLm11c2ljID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImF1ZGlvXCIpO1xyXG4gICAgICAgIHRoaXMubXVzaWMuc3JjID0gJ211c2ljL2JhY2tncm91bmQtbXVzaWMud2F2JztcclxuICAgICAgICB0aGlzLm11c2ljLnNldEF0dHJpYnV0ZShcInByZWxvYWRcIiwgXCJhdXRvXCIpO1xyXG4gICAgICAgIHRoaXMubXVzaWMuc2V0QXR0cmlidXRlKFwiY29udHJvbHNcIiwgXCJub25lXCIpO1xyXG4gICAgICAgIHRoaXMubXVzaWMuc2V0QXR0cmlidXRlKFwibG9vcFwiLCBcInRydWVcIik7XHJcbiAgICAgICAgdGhpcy5tdXNpYy5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCI7XHJcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjU7XHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5tdXNpYyk7XHJcblxyXG4gICAgICAgIHRoaXMubXVzaWMucGxheSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5idXR0b24uaWNvbiwgdGhpcy5idXR0b24ueCwgdGhpcy5idXR0b24ueSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdGlhbGl6ZSgpIHtcclxuICAgICAgICBjb25zdCBtdXNpY09uID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgbXVzaWNPbi5zcmMgPSAnaW1ncy9VSS9tdXNpYy1pY29uL3NvdW5kLW9uLnBuZyc7XHJcblxyXG4gICAgICAgIGNvbnN0IG11c2ljSGFsZk9uID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgbXVzaWNIYWxmT24uc3JjID0gJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1oYWxmLW9uLnBuZyc7XHJcblxyXG4gICAgICAgIGNvbnN0IG11c2ljT2ZmID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgbXVzaWNPZmYuc3JjID0gJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1vZmYucG5nJztcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IFttdXNpY09uLCBtdXNpY0hhbGZPbiwgbXVzaWNPZmZdO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgICAgICB4OiA5NTAsXHJcbiAgICAgICAgICAgIHk6IDEwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICB3aWR0aDogNDAsXHJcbiAgICAgICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4gdGhpcy50b2dnbGUoKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmJ1dHRvbi5pY29uID0gdGhpcy5zdGF0ZVt0aGlzLmNvdW50ZXJdO1xyXG4gICAgICAgIHRoaXMuYWRkTXVzaWMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0b2dnbGUoKSB7XHJcbiAgICAgICAgdGhpcy5jb3VudGVyID0gKyt0aGlzLmNvdW50ZXIgJSAzO1xyXG4gICAgICAgIHRoaXMuYnV0dG9uLmljb24gPSB0aGlzLnN0YXRlW3RoaXMuY291bnRlcl07XHJcbiAgICAgICAgdGhpcy5tdXNpYy52b2x1bWUgPSAwLjUgLSB0aGlzLmNvdW50ZXIgLyA0O1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZSgpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmJ1dHRvbik7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zdWJzY3JpYmUoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2sodGhpcy5idXR0b24pO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbXVzaWMvbXVzaWMuanNcbi8vIG1vZHVsZSBpZCA9IDI5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNjZW5lQmFzZSB9IGZyb20gXCIuL3NjZW5lLmJhc2VcIjtcclxuaW1wb3J0IERpYWxvZyBmcm9tICcuLi9kaWFsb2cvZGlhbG9nJztcclxuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9jb250cm9scy9idXR0b24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RhdGlzdGljU2NlbmUgZXh0ZW5kcyBTY2VuZUJhc2Uge1xyXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKSB7XHJcbiAgICAgICAgc3VwZXIoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuICAgICAgICB0aGlzLmRpYWxvZyA9IG5ldyBEaWFsb2coZ2FtZUNhbnZhcy5jb250ZXh0KTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTdGF0ZSh0aW1lc3RhbXApIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYztcclxuICAgICAgICBpZiAoIXN0YXRlLnRpbWVTcGVudCkge1xyXG4gICAgICAgICAgICBzdGF0ZS50aW1lU3BlbnQgPSAodGltZXN0YW1wIC8gNjAwMDApLnRvRml4ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2Uoc3RhdGUuYmFja2dyb3VuZCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdTdGF0aXN0aWNzJywgNDgwLCAxMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdUaW1lIHNwZW50JywgMTgwLCAyMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLnRpbWVTcGVudH0gbWludXRlc2AsIDc1MCwgMjAwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnTGV2ZWxzIGZhaWxlZCcsIDE4MCwgMjUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtzdGF0ZS5sZXZlbHNGYWlsZWR9IGxldmVsc2AsIDc1MCwgMjUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnVG90YWwgZGFtYWdlJywgMTgwLCAzMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLnRvdGFsRGFtYWdlfSBkbWdgLCA3NTAsIDMwMCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJ1RvdGFsIHJlY2VpdmVkIGRhbWFnZScsIDE4MCwgMzUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtzdGF0ZS5yZWNlaXZlZERhbWFnZX0gZG1nYCwgNzUwLCAzNTApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdNb25leSBlYXJuZWQnLCAxODAsIDQwMCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7c3RhdGUuZWFybmVkTW9uZXl9ICRgLCA3NTAsIDQwMCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJ1RvdGFsIGhwIGhlYWxlZCcsIDE4MCwgNDUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtzdGF0ZS5oZWFsZWRIcH0gaHBgLCA3NTAsIDQ1MCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlhbG9nLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnNyYyA9ICcuL2ltZ3MvYmFja2dyb3VuZHMvc3RhdGlzdGljLmpwZyc7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmJhY2tncm91bmQgPSB0aGlzLmJhY2tncm91bmQ7XHJcblxyXG4gICAgICAgIHRoaXMuZXhpdEJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgICAgICB4OiA1NTAsXHJcbiAgICAgICAgICAgIHk6IDUwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA3MyxcclxuICAgICAgICAgICAgd2lkdGg6IDYxLFxyXG4gICAgICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9leGl0LnBuZycsXHJcbiAgICAgICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2V4aXQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuaW5zdGFuY2UuaW5pdGlhbGl6ZSgwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lmluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tdXNpYy5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKC4uLnRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmJ1dHRvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlT25DbGljaygpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmV4aXRCdXR0b24pO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2NlbmVzL3N0YXRpc3RpYy5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgbGV2ZWxzID0gW1xyXG4gICAge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICcuL2ltZ3MvYmFja2dyb3VuZHMvZ2FtZS5wbmcnLFxyXG4gICAgICAgIGdyb3VuZExldmVsWTogNjQwLFxyXG4gICAgICAgIGVuZW1pZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdyb2d1ZSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICd3aXphcmQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICcuL2ltZ3MvYmFja2dyb3VuZHMvZ2FtZS5wbmcnLFxyXG4gICAgICAgIGdyb3VuZExldmVsWTogNjQwLFxyXG4gICAgICAgIGVuZW1pZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3JvZ3VlJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmFuZGl0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmxvYidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF1cclxuICAgIH1cclxuXTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGxldmVscztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sZXZlbHMvZGVtb0xldmVscy5qc1xuLy8gbW9kdWxlIGlkID0gMzFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgcGFyYW1ldGVyc09mVW5pdEJ1dHRvbnMgPSBbXHJcbiAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiA5MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2tuaWdodCcsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDkwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICd3aXphcmQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAxNjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2JhbmRpdCcsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiA5MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnd2l6YXJkJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMTYwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcGFyYW1ldGVyc09mVW5pdEJ1dHRvbnM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29udHJvbC1wYW5lbC9kZW1vLXBhcmFtZXRlcnMtdW5pdC1idXR0b25zLmpzXG4vLyBtb2R1bGUgaWQgPSAzMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9