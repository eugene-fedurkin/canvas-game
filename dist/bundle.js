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
        this.render = { // TODO: mb useless
            width: unitInfo.width,
            height: unitInfo.height,
            fullWidth: unitInfo.fullWidth
        };

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
                    + state.currentLevel.enemies[0].getCurrentSprite().bodyXOffset;

                this.floatingText.add({
                    text: this.damage,
                    positionX: positionX,
                    positionY: state.currentLevel.enemies[0].y,
                    action: __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].attack,
                });
                state.instance.state.scenes.statistic.yourDamage++;
            } else {
                state.currentLevel.allies[0].health -= this.damage;

                const positionX = state.currentLevel.allies[0].x 
                    + state.currentLevel.allies[0].getCurrentSprite().bodyXOffset
                    + state.currentLevel.allies[0].getCurrentSprite().xOffset;

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
                + state.currentLevel.allies[0].getCurrentSprite().frameWidth / 2;

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
        background: './imgs/backgrounds/background-game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'bandit'
            },
            {
                name: 'bandit'
            },
            {
                name: 'bandit'
            },
            {
                name: 'bandit'
            }
        ]
    },
    {
        background: './imgs/backgrounds/background-game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'skeleton'
            },
            {
                name: 'blob'
            }
        ],
        allies: [
        ]
    },
    {
        background: './imgs/backgrounds/background-game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'skeleton'
            },
            {
                name: 'skeleton'
            },
            {
                name: 'country-knight'
            }
        ],
        allies: [
        ]
    },
    {
        background: './imgs/backgrounds/background-game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'skeleton'
            },
            {
                name: 'skeleton'
            },
            {
                name: 'country-knight'
            },
            {
                name: 'blob'
            }
        ],
        allies: [
        ]
    },
    {
        background: './imgs/backgrounds/background-game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'knight'
            },
            {
                name: 'skeleton'
            },
            {
                name: 'blob'
            },
            {
                name: 'skeleton'
            },
            {
                name: 'country-knight'
            },
            {
                name: 'blob'
            }
        ],
        allies: [
        ]
    },
    {
        background: './imgs/backgrounds/background-game.png',
        groundLevelY: 640,
        enemies: [
            {
                name: 'skeleton'
            },
            {
                name: 'blob'
            },
            {
                name: 'knight'
            },
            {
                name: 'blob'
            },
            {
                name: 'knight'
            },
        ],
        allies: [
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
        this.state.forEach(textParam => { // TODO: damage need to rename
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
    const statistic = new __WEBPACK_IMPORTED_MODULE_5__scenes_statistic__["a" /* default */](state, gameCanvas, music);

    // state.scenes.menu.instance = preloder;
    state.scenes.menu.instance = menuScene;
    state.scenes.game.instance = gameScene;
    state.scenes.statistic.instance = statistic;
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
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameCanvas;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__levels_levels__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_factory_unit_factory__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__queue_queue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__constants__ = __webpack_require__(22);





class State {
    constructor() {
        // this.isPaused = false;
        this.currentScene = null;
        this.scenes = {
            preloader: {
                instance: null,
            },
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
                enemiesSpawnX: __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* default */].enemiesSpawnX,
                alliesSpawnX: __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* default */].alliesSpawnX,
                isPauseGame: null,
                money: __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* default */].startMoney,
                pastMoney: __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* default */].startMoney,
                numberOfLevels: __WEBPACK_IMPORTED_MODULE_0__levels_levels__["a" /* default */].length,
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
                spentTime: 0,
                unsuccessfulAttempts: 0,
                yourDamage: 0,
                receivedDamage: 0,
                earnedMoney: __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* default */].startMoney,
                healedHp: 0
            }
        };

        // this.unitFactory = UnitFactory.getSingletonInstance();
        // this.queue = new Queue(this); // TODO: move
    }

    reset() {
        this.scenes.game.money = __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* default */].startMoney;
        this.scenes.game.pastMoney = __WEBPACK_IMPORTED_MODULE_3__constants__["a" /* default */].startMoney;
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
            health: 10,
            damage: 3,
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
        this.cost = 2;
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
            timeToFrame: 50,
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
                + targetUnit.getCurrentSprite().frameWidth / 2;
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

        return Math.abs(this.x - targetUnit.x) < 120;
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
            health: 6,
            damage: 2,
            attackTime: 600,
            rangeAttack: 15,
            timeToHit: 300,
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
    startMoney: 100
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
    this.state.currentScene.subscribeButtonsClick();
    this.state.currentScene.dialog.open(`Select a unit in the upper right corner`, 200, []);
  }

  toggleAbout() {
    this.state.scenes.menu.aboutSheetVisible
      = !this.state.scenes.menu.aboutSheetVisible;
  }

  getButtonsConfig() {
    return [
      { x: 75, y: 420, height: 50, width: 165, clickHandler: () => this.startGame() },
      { x: 65, y: 490, height: 50, width: 185, clickHandler: () => this.toggleAbout() }
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__unit_direction__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__controls_button__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__floating_text_floating_text__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__buff_manager_buff_manager__ = __webpack_require__(28);











class GameScene extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* SceneBase */] {
  constructor(state, gameCanvas, music, preloader) {
    super(state, gameCanvas, music);

    this.controlPanel = new __WEBPACK_IMPORTED_MODULE_1__control_panel_control_panel__["a" /* default */](state, gameCanvas);
    this.buffManager = new __WEBPACK_IMPORTED_MODULE_9__buff_manager_buff_manager__["a" /* default */](state, gameCanvas);
    this.floatingText = __WEBPACK_IMPORTED_MODULE_8__floating_text_floating_text__["a" /* default */].getSingletonInstance(gameCanvas.context);
    this.dialog = new __WEBPACK_IMPORTED_MODULE_2__dialog_dialog__["a" /* default */](gameCanvas.context);
    this.unitFactory = __WEBPACK_IMPORTED_MODULE_3__unit_factory_unit_factory__["a" /* default */].getSingletonInstance();
    this.queue = new __WEBPACK_IMPORTED_MODULE_4__queue_queue__["a" /* default */](state); // TODO: move
    this.prevTimeStamp = 0;

    this.initialize(0);
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
    this.gameCanvas.context.fillText(`${gameState.currentLevel.levelNumber}/${gameState.numberOfLevels}`, 1020, 90);
    this.helpMenuButton.render(this.gameCanvas.context);

    this.dialog.render();

    this.music.render();

    this.prevTimeStamp = timestamp;
  }

  initialize(level) {
    this.loadLevel(level);
    this.controlPanel.createControlPanel(level);
    this.addBuffManager();

    const state = this.state.scenes.game;
    state.isPauseGame = true;

    if (!this.nextButton) {
      this.nextButton = new __WEBPACK_IMPORTED_MODULE_7__controls_button__["a" /* default */]({
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
          this.initialize(state.currentLevel.levelNumber + 1);
          this.subscribeButtonsClick();
          state.pastMoney = state.money;
        }
      });
    }
    if (!this.prevButton) {
      this.prevButton = new __WEBPACK_IMPORTED_MODULE_7__controls_button__["a" /* default */]({
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
          this.initialize(state.currentLevel.levelNumber - 1);
          this.subscribeButtonsClick();
          this.state.scenes.statistic.unsuccessfulAttempts++;
          state.money = state.pastMoney;
        }
      });
    } 
    if (!this.replayButton) {
      this.replayButton = new __WEBPACK_IMPORTED_MODULE_7__controls_button__["a" /* default */]({
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
          this.initialize(state.currentLevel.levelNumber);
          this.subscribeButtonsClick();
          this.state.scenes.statistic.unsuccessfulAttempts++;
          state.money = state.pastMoney;

        }
      });
    }
    if (!this.exitButton) {
      this.exitButton = new __WEBPACK_IMPORTED_MODULE_7__controls_button__["a" /* default */]({
        x: 450,
        y: 270,
        height: 73,
        width: 61,
        iconUrl: 'imgs/UI/exit.png',
        clickHandler: () => {
          console.log('exit');
          this.initialize(0);
          this.dialog.close();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.state.currentScene = this.state.scenes.menu.instance;
          this.music.subscribe();
          this.gameCanvas.subscribeOnClick(...this.state.currentScene.buttons);
        }
      });
    }
    if (!this.closeButton) {
      this.closeButton = new __WEBPACK_IMPORTED_MODULE_7__controls_button__["a" /* default */]({
        x: 350,
        y: 270,
        height: 73,
        width: 61,
        iconUrl: 'imgs/UI/close.png',
        clickHandler: () => {
          console.log('close');
          this.dialog.close();
          this.gameCanvas.unsubscribeClick(this.closeButton);
          this.gameCanvas.unsubscribeClick(this.exitButton);
          this.gameCanvas.unsubscribeClick(this.replayButton);
          this.gameCanvas.subscribeOnClick(this.helpMenuButton);

          state.isPauseGame = false;
        }
      });
    }
    if (!this.helpMenuButton) {
      this.helpMenuButton = new __WEBPACK_IMPORTED_MODULE_7__controls_button__["a" /* default */]({
        x: 1025,
        y: 170,
        height: 73,
        width: 61,
        iconUrl: 'imgs/UI/help-menu.png',
        clickHandler: () => {
          console.log('help-menu');
          state.isPauseGame = true;
          this.dialog.reset();
          this.exitButton.x = !state.currentLevel.levelNumber ? 550 : 490;
          this.replayButton.x = 750;
          if (!state.currentLevel.levelNumber) {
            this.dialog.open('What do you want to do', 350, [this.closeButton, this.exitButton, this.replayButton]);
            this.gameCanvas.subscribeOnClick(this.closeButton, this.exitButton, this.replayButton);
          } else {
            this.dialog.open('What do you want to do', 350, [this.closeButton, this.exitButton, this.prevButton, this.replayButton]);
            this.gameCanvas.subscribeOnClick(this.closeButton, this.exitButton, this.prevButton, this.replayButton);
          }
          this.gameCanvas.unsubscribeClick(this.helpMenuButton);
        }
      });
    }
    if (!this.statisticButton) {
      this.statisticButton = new __WEBPACK_IMPORTED_MODULE_7__controls_button__["a" /* default */]({
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

  loadLevel(level) {
    this.state.scenes.game.currentLevel.allies = [];
    this.state.scenes.game.currentLevel.enemies = [];

    const currentLevel = __WEBPACK_IMPORTED_MODULE_5__levels_levels__["a" /* default */][level];
    currentLevel.enemies.forEach(entry => {
      const enemy = this.unitFactory.create(entry.name, __WEBPACK_IMPORTED_MODULE_6__unit_direction__["a" /* default */].left);
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
    this.gameCanvas.subscribeOnClick(this.helpMenuButton);
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
    // this.state.isPaused = true;
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

            const bonusMoney = this.state.scenes.game.currentLevel.levelNumber * 2 + 1;
            this.state.scenes.game.money += bonusMoney;
            this.state.scenes.game.pastMoney = this.state.scenes.game.money;
        }
    } else {
        this.exitButton.x = 450;
        this.replayButton.x = 650;
        this.gameCanvas.subscribeOnClick(this.replayButton, this.exitButton);
        this.dialog.open('You loose :( Try again!', 370 , [this.replayButton, this.exitButton]);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__unit_factory_unit_factory__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__queue_queue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__unit_direction__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__parameters_help_button__ = __webpack_require__(27);







class ControlPanel {
    constructor(state, gameCanvas) {
        this.buttons = null;
        this.state = state;
        this.gameCanvas = gameCanvas;
        this.unitFactory = __WEBPACK_IMPORTED_MODULE_2__unit_factory_unit_factory__["a" /* default */].getSingletonInstance();
        this.queue = new __WEBPACK_IMPORTED_MODULE_3__queue_queue__["a" /* default */](state);
    }

    createControlPanel(level) {
        level = level > 4 ? 4 : level; // TODO: ???
        this.buttons = __WEBPACK_IMPORTED_MODULE_1__parameters_unit_buttons__["a" /* default */][level].map(buttonParam => {
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
        const allyUnit = this.unitFactory.create(name, __WEBPACK_IMPORTED_MODULE_4__unit_direction__["a" /* default */].right);

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
            width: 30,
            height: 40
        },
        {
            name: 'wizard',
            imgUrl: 'imgs/units/wizard/wizard-icon.png',
            x: 90,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'blob',
            imgUrl: 'imgs/units/blob/blob-icon.png',
            x: 160,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'rogue',
            imgUrl: 'imgs/units/rogue/rogue-icon.png',
            x: 230,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 300,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'bandit',
            imgUrl: 'imgs/units/bandit/bandit-icon.png',
            x: 370,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'country-knight',
            imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
            x: 440,
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
            name: 'blob',
            imgUrl: 'imgs/units/blob/blob-icon.png',
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
            name: 'blob',
            imgUrl: 'imgs/units/blob/blob-icon.png',
            x: 90,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'country-knight',
            imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
            x: 160,
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
            name: 'blob',
            imgUrl: 'imgs/units/blob/blob-icon.png',
            x: 90,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'country-knight',
            imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
            x: 160,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 230,
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
            name: 'blob',
            imgUrl: 'imgs/units/blob/blob-icon.png',
            x: 90,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'country-knight',
            imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
            x: 160,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'knight',
            imgUrl: 'imgs/units/knight/knight-icon.png',
            x: 230,
            y: 20,
            width: 30,
            height: 40
        },
        {
            name: 'rogue',
            imgUrl: 'imgs/units/rogue/rogue-icon.png',
            x: 300,
            y: 20,
            width: 30,
            height: 40
        }
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

    improveWeapon() { // TODO: problem with multyBuff
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
        this.gameCanvas.context.font = '22px Pixelate';
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
                name: 'arm', iconUrl: 'imgs/buff-icon/arm.png',
                x: 20, y: 90, width: 30, height: 40,
                clickHandler: () => this.improveWeapon()
            },
            {
                name: 'armor', iconUrl: 'imgs/buff-icon/armor.png',
                x: 20, y: 160, width: 30, height: 40,
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




class Statistic extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* SceneBase */] { // TODO: rename
    constructor(state, gameCanvas, music) {
        super(state, gameCanvas, music);
        this.dialog = new __WEBPACK_IMPORTED_MODULE_1__dialog_dialog__["a" /* default */](gameCanvas.context);
        this.initialize();
    }

    updateState(timestamp) {
        const state = this.state.scenes.statistic;
        if (!state.spentTime) {
            state.spentTime = (timestamp / 60000).toFixed();
        }
    }

    render() {
        const state = this.state.scenes.statistic;

        this.gameCanvas.context.drawImage(state.background, 0, 0);

        this.gameCanvas.context.fillText('Statistics', 480, 100);
        this.gameCanvas.context.fillText('Time spent', 180, 200);
        this.gameCanvas.context.fillText(`${state.spentTime} minutes`, 750, 200);
        this.gameCanvas.context.fillText('Levels failed', 180, 250);
        this.gameCanvas.context.fillText(`${state.unsuccessfulAttempts} levels`, 750, 250);
        this.gameCanvas.context.fillText('Total damage', 180, 300);
        this.gameCanvas.context.fillText(`${state.yourDamage} dmg`, 750, 300);
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
        this.background.src = './imgs/backgrounds/background-statistic.jpg';
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
/* harmony export (immutable) */ __webpack_exports__["a"] = Statistic;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmI2YjE0OGJkYTExMjVjZWZkZTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvc3ByaXRlLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0L3VuaXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xzL2J1dHRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdC9kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQtZmFjdG9yeS91bml0LWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVldWUvcXVldWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9zY2VuZS5iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9sZXZlbHMvbGV2ZWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9mbG9hdGluZy10ZXh0L2Zsb2F0aW5nLXRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpYWxvZy9kaWFsb2cuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUtY2FudmFzL2dhbWUtY2FudmFzLmpzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS9zdGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvc3ByaXRlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMva25pZ2h0L2tuaWdodC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL3JvZ3VlL3JvZ3VlLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0cy9ibG9iL2Jsb2IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL3dpemFyZC93aXphcmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL2JhbmRpdC9iYW5kaXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL21lbnUuc2NlbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9nYW1lLnNjZW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sLXBhbmVsL2NvbnRyb2wtcGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2wtcGFuZWwvcGFyYW1ldGVycy11bml0LWJ1dHRvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2wtcGFuZWwvcGFyYW1ldGVycy1oZWxwLWJ1dHRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVmZi1tYW5hZ2VyL2J1ZmYtbWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbXVzaWMvbXVzaWMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9zdGF0aXN0aWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsOEJBQThCLFdBQVc7QUFDekM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQzs7Ozs7Ozs7O0FDOU1BO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0U7Ozs7Ozs7Ozs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtFOzs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFOzs7Ozs7OztBQ3pIQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQSxzREFBc0Qsa0JBQWtCO0FBQ3hFO0FBQ0EsYUFBYTtBQUNiLHlEQUF5RCxrQkFBa0I7QUFDM0U7QUFDQSxhQUFhO0FBQ2IscURBQXFELGtCQUFrQjtBQUN2RTtBQUNBO0FBQ0EscUNBQXFDLGVBQWU7QUFDcEQ7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkRzQjtBQUNOO0FBQ0k7QUFDQTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQzs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDOzs7Ozs7Ozs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3Q0FBd0M7QUFDeEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7OztBQ2xFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0RBQXNELGVBQWU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxzREFBc0QsZUFBZTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLHdEQUF3RCxlQUFlO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxxREFBcUQsZUFBZTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUNQQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtEQUFrRCxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esa0RBQWtELGVBQWU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxvREFBb0QsZUFBZTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsaURBQWlELGVBQWU7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEM7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxlQUFlO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsaUVBQWlFLGVBQWU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxvRUFBb0UsZUFBZTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGlFQUFpRSxlQUFlO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDOzs7Ozs7Ozs7OztBQ3pEQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsZUFBZTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLCtDQUErQyxlQUFlO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esa0RBQWtELGVBQWU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxpREFBaUQsZUFBZTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGVBQWU7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSw4Q0FBOEMsZUFBZTtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGdEQUFnRCxlQUFlO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsK0NBQStDLGVBQWU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtEQUFrRCxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsaURBQWlELGVBQWU7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxvREFBb0QsZUFBZTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsbURBQW1ELGVBQWU7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLGtEQUFrRCxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDeklBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrREFBa0QsZUFBZTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGlEQUFpRCxlQUFlO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esb0RBQW9ELGVBQWU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxtREFBbUQsZUFBZTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUU7Ozs7Ozs7Ozs7QUNOb0I7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPLDhFQUE4RTtBQUNyRixPQUFPO0FBQ1A7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvR29CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUFrQztBQUNsQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLHlDQUF5Qyw2QkFBNkI7QUFDdEUsd0NBQXdDLG1DQUFtQyxHQUFHLHlCQUF5QjtBQUN2Rzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0Y7Ozs7Ozs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVGOzs7Ozs7OztBQ1ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7OztBQ3ZLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7OztBQ2hFb0I7QUFDcEI7QUFDQTs7QUFFQSx3RkFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDLGdCQUFnQjtBQUM1RDtBQUNBLDRDQUE0QywyQkFBMkI7QUFDdkU7QUFDQSw0Q0FBNEMsaUJBQWlCO0FBQzdEO0FBQ0EsNENBQTRDLHFCQUFxQjtBQUNqRTtBQUNBLDRDQUE0QyxrQkFBa0I7QUFDOUQ7QUFDQSw0Q0FBNEMsZUFBZTs7QUFFM0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMmI2YjE0OGJkYTExMjVjZWZkZTgiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIGlmICghb3B0aW9ucykgdGhyb3cgbmV3IEVycm9yKCdObyBzcHJpdGUgb3B0aW9ucycpO1xyXG5cclxuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gb3B0aW9ucy51cmw7XHJcblxyXG4gICAgdGhpcy5mcmFtZVdpZHRoID0gb3B0aW9ucy5mcmFtZVdpZHRoO1xyXG4gICAgdGhpcy5mcmFtZUhlaWdodCA9IG9wdGlvbnMuZnJhbWVIZWlnaHQ7XHJcbiAgICB0aGlzLm51bWJlck9mRnJhbWVzID0gb3B0aW9ucy5udW1iZXJPZkZyYW1lcztcclxuICAgIHRoaXMudGltZVRvRnJhbWUgPSBvcHRpb25zLnRpbWVUb0ZyYW1lIHx8IDEwMDtcclxuICAgIHRoaXMueE9mZnNldCA9IG9wdGlvbnMueE9mZnNldCB8fCAwO1xyXG4gICAgdGhpcy5hdHRhY2tYT2Zmc2V0ID0gb3B0aW9ucy5hdHRhY2tYT2Zmc2V0IHx8IDA7XHJcbiAgICB0aGlzLmJvZHlYT2Zmc2V0ID0gb3B0aW9ucy5ib2R5WE9mZnNldDtcclxuICAgIFxyXG4gICAgdGhpcy5wcmVsb2FkZXIgPSBvcHRpb25zLnByZWxvYWRlcjtcclxuICAgIC8vIGlmICh0aGlzLnByZWxvZGVyKSB0aGlzLnByZWxvYWRlci5sb2FkKHRoaXMuaW1hZ2UpO1xyXG4gICAgLy8gWSBvZmZzZXRcclxuICAgIFxyXG4gICAgdGhpcy5jdXJyZW50VGljayA9IDA7XHJcbiAgICB0aGlzLmN1cnJlbnRJbWFnZUluZGV4ID0gMDtcclxuICB9XHJcblxyXG4gIHRpY2sodGltZXN0YW1wLCBwcmV2VGltZXN0YW1wKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRUaWNrICs9IE51bWJlcigodGltZXN0YW1wIC0gcHJldlRpbWVzdGFtcCkudG9GaXhlZCgyKSk7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50VGljayA+IHRoaXMudGltZVRvRnJhbWUgKiB0aGlzLmN1cnJlbnRJbWFnZUluZGV4KSB7XHJcbiAgICAgIHRoaXMubmV4dEZyYW1lKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZXh0RnJhbWUoKSB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9PT0gdGhpcy5udW1iZXJPZkZyYW1lcyAtIDEpIHtcclxuICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCsrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0RnJhbWVYKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZnJhbWVXaWR0aCAqIHRoaXMuY3VycmVudEltYWdlSW5kZXg7XHJcbiAgfVxyXG5cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMuY3VycmVudFRpY2sgPSAwO1xyXG4gICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9IDA7XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdC9zcHJpdGUuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuL3Nwcml0ZSc7XHJcbmltcG9ydCBTcHJpdGVzIGZyb20gJy4vc3ByaXRlcyc7XHJcbmltcG9ydCBEaXJlY3Rpb24gZnJvbSAnLi9kaXJlY3Rpb24nO1xyXG5pbXBvcnQgRmxvYXRpbmdUZXh0IGZyb20gJy4uL2Zsb2F0aW5nLXRleHQvZmxvYXRpbmctdGV4dCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbml0IHtcclxuICAgIGNvbnN0cnVjdG9yKHVuaXRJbmZvKSB7XHJcbiAgICAgICAgaWYgKCF1bml0SW5mbykgdGhyb3cgbmV3IEVycm9yKCdObyB1bml0IGluZm8nKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IHVuaXRJbmZvLmlkO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gdW5pdEluZm8uaGVhbHRoO1xyXG4gICAgICAgIHRoaXMuZGFtYWdlID0gdW5pdEluZm8uZGFtYWdlO1xyXG4gICAgICAgIHRoaXMucmFuZ2VBdHRhY2sgPSB1bml0SW5mby5yYW5nZUF0dGFjayB8fCAwOyAvLyBUT0RPOiBjaGFuZ2UhXHJcbiAgICAgICAgdGhpcy5pZGxlVGltZSA9IHVuaXRJbmZvLmlkbGVUaW1lIHx8IDIwMDA7XHJcbiAgICAgICAgdGhpcy5hdHRhY2tUaW1lID0gdW5pdEluZm8uYXR0YWNrVGltZTtcclxuICAgICAgICB0aGlzLnRpbWVUb0hpdCA9IHVuaXRJbmZvLnRpbWVUb0hpdDtcclxuICAgICAgICB0aGlzLmRlYXRoVGltZSA9IHVuaXRJbmZvLmRlYXRoVGltZTtcclxuICAgICAgICB0aGlzLnN0ZXBTaXplID0gdW5pdEluZm8uc3RlcFNpemU7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB1bml0SW5mby5kaXJlY3Rpb247XHJcbiAgICAgICAgdGhpcy5yZW5kZXIgPSB7IC8vIFRPRE86IG1iIHVzZWxlc3NcclxuICAgICAgICAgICAgd2lkdGg6IHVuaXRJbmZvLndpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHVuaXRJbmZvLmhlaWdodCxcclxuICAgICAgICAgICAgZnVsbFdpZHRoOiB1bml0SW5mby5mdWxsV2lkdGhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMgPSBuZXcgU3ByaXRlcygpO1xyXG4gICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0ID0gRmxvYXRpbmdUZXh0LmdldFNpbmdsZXRvbkluc3RhbmNlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyc1VuaXQgPSB0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLnJpZ2h0IFxyXG4gICAgICAgICAgICA/IHRydWVcclxuICAgICAgICAgICAgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLndlYXBvbklkQnVmZiA9IFtdO1xyXG4gICAgICAgIHRoaXMuYXJtb3JJZEJ1ZmYgPSBbXTtcclxuICAgICAgICB0aGlzLndhc0hpdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy54ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnkgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEN1cnJlbnRTcHJpdGUoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRBY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLnN0ZXA6IHJldHVybiB0aGlzLnNwcml0ZXMud2FsaztcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLmF0dGFjazogcmV0dXJuIHRoaXMuc3ByaXRlcy5hdHRhY2s7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9ucy5kaWU6IHJldHVybiB0aGlzLnNwcml0ZXMuZGllO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gdGhpcy5zcHJpdGVzLmlkbGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRvQWN0aW9uKHN0YXRlLCB0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpZShzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudEFjdGlvbiA9PT0gQWN0aW9ucy5pZGxlXHJcbiAgICAgICAgICAgICYmIHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPCB0aGlzLmlkbGVUaW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZBbGx5KHN0YXRlKSB8fCBzdGF0ZS5pc1BhdXNlR2FtZSBcclxuICAgICAgICAgICAgfHwgdGhpcy5pc0luRnJvbnRPZkVuZW15KHN0YXRlKSAmJiB0aGlzLmlzRW5lbXlEeWluZyhzdGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5pZGxlKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luRnJvbnRPZkVuZW15KHN0YXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmF0dGFjayhzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0ZXAoc3RhdGUsIHRpbWVzdGFtcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBhY3Rpb25zXHJcblxyXG4gICAgc3RlcChzdGF0ZSwgdGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5zdGVwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IEFjdGlvbnMuc3RlcDtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24ucmlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc3RlcFNpemU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IHRoaXMuc3RlcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlkbGUoc3RhdGUsIHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBY3Rpb24gIT09IEFjdGlvbnMuaWRsZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBBY3Rpb25zLmlkbGU7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjayhzdGF0ZSwgdGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5hdHRhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gQWN0aW9ucy5hdHRhY2s7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiB0aGlzLnRpbWVUb0hpdCAmJiAhdGhpcy53YXNIaXQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1VuaXQpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLmhlYWx0aCAtPSB0aGlzLmRhbWFnZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvblggPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS54IFxyXG4gICAgICAgICAgICAgICAgICAgICsgc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0uZ2V0Q3VycmVudFNwcml0ZSgpLmJvZHlYT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5kYW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YOiBwb3NpdGlvblgsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZOiBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS55LFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogQWN0aW9ucy5hdHRhY2ssXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmluc3RhbmNlLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMueW91ckRhbWFnZSsrO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXS5oZWFsdGggLT0gdGhpcy5kYW1hZ2U7XHJcblxyXG4gICAgICAgICAgICAgICAgY29uc3QgcG9zaXRpb25YID0gc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXS54IFxyXG4gICAgICAgICAgICAgICAgICAgICsgc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXS5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXRcclxuICAgICAgICAgICAgICAgICAgICArIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0uZ2V0Q3VycmVudFNwcml0ZSgpLnhPZmZzZXQ7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG9hdGluZ1RleHQuYWRkKHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmRhbWFnZSxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblg6IHBvc2l0aW9uWCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblk6IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0ueSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuYXR0YWNrLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5pbnN0YW5jZS5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLnJlY2VpdmVkRGFtYWdlKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy53YXNIaXQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGltZXN0YW1wIC0gdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA+IHRoaXMuYXR0YWNrVGltZSAmJiB0aGlzLndhc0hpdCkge1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgICAgICB0aGlzLndhc0hpdCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkaWUoc3RhdGUsIHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBY3Rpb24gIT09IEFjdGlvbnMuZGllKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IEFjdGlvbnMuZGllO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgICAgICB0aGlzLnNwcml0ZXMuZGllLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWShzdGF0ZSk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aW1lc3RhbXAgLSB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID4gdGhpcy5kZWF0aFRpbWUpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1VuaXQpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXMuc2hpZnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJvbnVzTW9uZXkgPSBNYXRoLmZsb29yKHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLmNvc3QgLyAyKTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uWCA9IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLnggXHJcbiAgICAgICAgICAgICAgICArIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0uZ2V0Q3VycmVudFNwcml0ZSgpLmZyYW1lV2lkdGggLyAyO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLm1vbmV5ICs9IGJvbnVzTW9uZXk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5mbG9hdGluZ1RleHQuYWRkKHtcclxuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBgJCR7Ym9udXNNb25leX1gLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWDogcG9zaXRpb25YLFxyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uWTogc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0ueSxcclxuICAgICAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuZGllLFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgc3RhdGUuaW5zdGFuY2Uuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYy5lYXJuZWRNb25leSArPSBib251c01vbmV5O1xyXG4gICAgICAgICAgICAgICAgc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXMuc2hpZnQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxuICAgIC8vI3JlZ2lvbiBoZWxwZXJzXHJcblxyXG4gICAgaXNJbkZyb250T2ZFbmVteShzdGF0ZSkgeyAvLyBUT0RPOiByZXdyaXRlIG1iP1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wcG9uZW50ID0gc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF07XHJcbiAgICAgICAgICAgIHJldHVybiBvcHBvbmVudCAmJiB0aGlzLnggKyB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5ib2R5WE9mZnNldCArIHRoaXMucmFuZ2VBdHRhY2sgPj0gb3Bwb25lbnQueCArIG9wcG9uZW50LmdldEN1cnJlbnRTcHJpdGUoKS5ib2R5WE9mZnNldDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBvcHBvbmVudCA9IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF07XHJcbiAgICAgICAgICAgIHJldHVybiBvcHBvbmVudCAmJiB0aGlzLnggKyB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5ib2R5WE9mZnNldCAtIHRoaXMucmFuZ2VBdHRhY2sgPD0gb3Bwb25lbnQueCArIG9wcG9uZW50LmdldEN1cnJlbnRTcHJpdGUoKS5ib2R5WE9mZnNldDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNFbmVteUR5aW5nKHN0YXRlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGxheWVyc1VuaXQpIHJldHVybiBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS5oZWFsdGggPD0gMDtcclxuICAgICAgICBlbHNlIHJldHVybiBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdLmhlYWx0aCA8PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIGdldENlbnRlck9mQm9keSgpIHtcclxuICAgIC8vICAgICByZXR1cm4gdGhpcy5cclxuICAgIC8vICAgICB0aGlzLnggKyB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5mcmFtZVdpZHRoICsgdGhpcy5nZXRDdXJyZW50U3ByaXRlKCkuYXR0YWNrWE9mZnNldFxyXG4gICAgLy8gfVxyXG5cclxuICAgIGlzSW5Gcm9udE9mQWxseShzdGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5leHRBbGx5ID0gc3RhdGUuY3VycmVudExldmVsLmFsbGllc1t0aGlzLmdldFVuaXRQb3NpdGlvbihzdGF0ZSkgLSAxXTtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHRBbGx5ICYmIHRoaXMueCArIHRoaXMuZ2V0Q3VycmVudFNwcml0ZSgpLmZyYW1lV2lkdGggPj0gbmV4dEFsbHkueDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0QWxseSA9IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzW3RoaXMuZ2V0VW5pdFBvc2l0aW9uKHN0YXRlKSAtIDFdO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV4dEFsbHkgJiYgdGhpcy54IDw9IG5leHRBbGx5LnggKyBuZXh0QWxseS5nZXRDdXJyZW50U3ByaXRlKCkuZnJhbWVXaWR0aDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VW5pdFBvc2l0aW9uKHN0YXRlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyc1VuaXRcclxuICAgICAgICAgICAgPyBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmZpbmRJbmRleChhbGx5ID0+IGFsbHkuaWQgPT09IHRoaXMuaWQpXHJcbiAgICAgICAgICAgIDogc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXMuZmluZEluZGV4KGVuZW15ID0+IGVuZW15LmlkID09PSB0aGlzLmlkKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVZKHN0YXRlKSB7XHJcbiAgICAgICAgY29uc3QgdW5pdEhlaWdodCA9IHRoaXMuZ2V0Q3VycmVudFNwcml0ZSgpLmZyYW1lSGVpZ2h0O1xyXG4gICAgICAgIHRoaXMueSA9IHN0YXRlLmN1cnJlbnRMZXZlbC5ncm91bmRMZXZlbFkgLSB1bml0SGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIC8vI2VuZHJlZ2lvblxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdC91bml0LmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1dHRvbiB7XHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKCFvcHRpb25zKSB0aHJvdyBuZXcgRXJyb3IoJ0J1dHRvbiBvcHRpb25zIG1pc3NpbmcnKTtcclxuXHJcbiAgICAgICAgdGhpcy54ID0gb3B0aW9ucy54O1xyXG4gICAgICAgIHRoaXMueSA9IG9wdGlvbnMueTtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0O1xyXG4gICAgICAgIHRoaXMud2lkdGggPSBvcHRpb25zLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaWNvblVybCA9IG9wdGlvbnMuaWNvblVybDtcclxuICAgICAgICB0aGlzLmNsaWNrSGFuZGxlciA9IG9wdGlvbnMuY2xpY2tIYW5kbGVyO1xyXG5cclxuICAgICAgICBpZiAob3B0aW9ucy5pY29uVXJsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SWNvbihvcHRpb25zLmljb25VcmwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWNvbiA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHNldEljb24odXJsKSB7XHJcbiAgICAgICAgY29uc3QgaWNvbiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIGljb24uc3JjID0gdXJsO1xyXG4gICAgICAgIHRoaXMuaWNvbiA9IGljb247XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKGNvbnRleHQpIHtcclxuICAgICAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLmljb24sIHRoaXMueCwgdGhpcy55KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbnRyb2xzL2J1dHRvbi5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBEaXJlY3Rpb24gPSB7XHJcbiAgbGVmdDogJ2xlZnQnLFxyXG4gIHJpZ2h0OiAncmlnaHQnXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBEaXJlY3Rpb247XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdC9kaXJlY3Rpb24uanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFNrZWxldG9uIGZyb20gJy4uL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uJztcclxuaW1wb3J0IEtuaWdodCBmcm9tICcuLi91bml0cy9rbmlnaHQva25pZ2h0JztcclxuaW1wb3J0IENvdW50cnlLbmlnaHQgZnJvbSAnLi4vdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQnO1xyXG5pbXBvcnQgUm9ndWUgZnJvbSAnLi4vdW5pdHMvcm9ndWUvcm9ndWUnO1xyXG5pbXBvcnQgQmxvYiBmcm9tICcuLi91bml0cy9ibG9iL2Jsb2InO1xyXG5pbXBvcnQgV2l6YXJkIGZyb20gJy4uL3VuaXRzL3dpemFyZC93aXphcmQnO1xyXG5pbXBvcnQgQmFuZGl0IGZyb20gJy4uL3VuaXRzL2JhbmRpdC9iYW5kaXQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pdEZhY3Rvcnkge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5pZCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFNpbmdsZXRvbkluc3RhbmNlKCkge1xyXG4gICAgICAgIGlmICghVW5pdEZhY3RvcnkuaW5zdGFuY2UpIFVuaXRGYWN0b3J5Lmluc3RhbmNlID0gbmV3IFVuaXRGYWN0b3J5KCk7XHJcbiAgICAgICAgcmV0dXJuIFVuaXRGYWN0b3J5Lmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZSh1bml0TmFtZSwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3dpdGNoKHVuaXROYW1lKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ3NrZWxldG9uJzogcmV0dXJuIG5ldyBTa2VsZXRvbih0aGlzLmlkKyssIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIGNhc2UgJ2tuaWdodCc6IHJldHVybiBuZXcgS25pZ2h0KHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgY2FzZSAnY291bnRyeS1rbmlnaHQnOiByZXR1cm4gbmV3IENvdW50cnlLbmlnaHQodGhpcy5pZCsrLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBjYXNlICdyb2d1ZSc6IHJldHVybiBuZXcgUm9ndWUodGhpcy5pZCsrLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBjYXNlICdibG9iJzogcmV0dXJuIG5ldyBCbG9iKHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgY2FzZSAnd2l6YXJkJzogcmV0dXJuIG5ldyBXaXphcmQodGhpcy5pZCsrLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBjYXNlICdiYW5kaXQnOiByZXR1cm4gbmV3IEJhbmRpdCh0aGlzLmlkKyssIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yKCd3cm9uZyBuYW1lIG9mIHVuaXQhISEnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0LWZhY3RvcnkvdW5pdC1mYWN0b3J5LmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IEFjdGlvbnMgPSB7XHJcbiAgaWRsZTogJ2lkbGUnLFxyXG4gIHN0ZXA6ICdzdGVwJyxcclxuICBhdHRhY2s6ICdhdHRhY2snLFxyXG4gIGRpZTogJ2RpZScsXHJcbiAgaGVhbDogJ2hlYWwnXHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBBY3Rpb25zO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvYWN0aW9ucy5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBRdWV1ZSB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIH1cclxuXHJcbiAgICBxdWV1ZUFsbHkoYWxsaWVzLCBhbGx5KSB7XHJcbiAgICAgICAgbGV0IGhvcml6b250YWxQb3NpdGlvbiA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuYWxsaWVzU3Bhd25YO1xyXG5cclxuICAgICAgICBpZiAoIWFsbGllcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgYWxseS54ID0gaG9yaXpvbnRhbFBvc2l0aW9uIC0gNTA7XHJcbiAgICAgICAgICAgIGFsbHkueSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuZ3JvdW5kTGV2ZWxZO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGFsbGllcy5mb3JFYWNoKGFsbHkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGhvcml6b250YWxQb3NpdGlvbiA+IGFsbHkueCkgXHJcbiAgICAgICAgICAgICAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uID0gYWxseS54O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGFsbHkueCA9IGhvcml6b250YWxQb3NpdGlvbiAtIDUwO1xyXG4gICAgICAgICAgICBhbGx5LnkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmdyb3VuZExldmVsWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcXVldWVFbmVteShlbmVtaWVzLCBlbmVteSkge1xyXG4gICAgICAgIGxldCBob3Jpem9udGFsUG9zaXRpb24gPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmVuZW1pZXNTcGF3blg7XHJcblxyXG4gICAgICAgIGlmICghZW5lbWllcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgZW5lbXkueCA9IGhvcml6b250YWxQb3NpdGlvbjtcclxuICAgICAgICAgICAgZW5lbXkueSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuZ3JvdW5kTGV2ZWxZO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGVuZW1pZXMuZm9yRWFjaChlbmVteSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaG9yaXpvbnRhbFBvc2l0aW9uIDwgZW5lbXkueCkgXHJcbiAgICAgICAgICAgICAgICBob3Jpem9udGFsUG9zaXRpb24gPSBlbmVteS54O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGVuZW15LnggPSBob3Jpem9udGFsUG9zaXRpb24gKyA1MDtcclxuICAgICAgICAgICAgZW5lbXkueSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuZ3JvdW5kTGV2ZWxZO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3F1ZXVlL3F1ZXVlLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBjbGFzcyBTY2VuZUJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYywgcHJlbG9kZXIpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcyA9IGdhbWVDYW52YXM7XHJcbiAgICB0aGlzLm11c2ljID0gbXVzaWM7XHJcbiAgICB0aGlzLnByZWxvZGVyID0gcHJlbG9kZXI7XHJcbiAgfVxyXG5cclxuICBmcmFtZSh0aW1lc3RhbXApIHtcclxuICAgIHRoaXMudXBkYXRlU3RhdGUodGltZXN0YW1wKTtcclxuICAgIHRoaXMucmVuZGVyKHRpbWVzdGFtcCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVTdGF0ZSgpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkLicpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKCkge1xyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQuJyk7XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2NlbmVzL3NjZW5lLmJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgbGV2ZWxzID0gW1xyXG4gICAge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICcuL2ltZ3MvYmFja2dyb3VuZHMvYmFja2dyb3VuZC1nYW1lLnBuZycsXHJcbiAgICAgICAgZ3JvdW5kTGV2ZWxZOiA2NDAsXHJcbiAgICAgICAgZW5lbWllczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmFuZGl0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmFuZGl0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmFuZGl0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmFuZGl0J1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2JhY2tncm91bmQtZ2FtZS5wbmcnLFxyXG4gICAgICAgIGdyb3VuZExldmVsWTogNjQwLFxyXG4gICAgICAgIGVuZW1pZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmxvYidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYWxsaWVzOiBbXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2JhY2tncm91bmQtZ2FtZS5wbmcnLFxyXG4gICAgICAgIGdyb3VuZExldmVsWTogNjQwLFxyXG4gICAgICAgIGVuZW1pZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdjb3VudHJ5LWtuaWdodCdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYWxsaWVzOiBbXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2JhY2tncm91bmQtZ2FtZS5wbmcnLFxyXG4gICAgICAgIGdyb3VuZExldmVsWTogNjQwLFxyXG4gICAgICAgIGVuZW1pZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdjb3VudHJ5LWtuaWdodCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Jsb2InXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIGFsbGllczogW1xyXG4gICAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogJy4vaW1ncy9iYWNrZ3JvdW5kcy9iYWNrZ3JvdW5kLWdhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Jsb2InXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmxvYidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYWxsaWVzOiBbXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2JhY2tncm91bmQtZ2FtZS5wbmcnLFxyXG4gICAgICAgIGdyb3VuZExldmVsWTogNjQwLFxyXG4gICAgICAgIGVuZW1pZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmxvYidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2tuaWdodCdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Jsb2InXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBhbGxpZXM6IFtcclxuICAgICAgICBdXHJcbiAgICB9XHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBsZXZlbHM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbGV2ZWxzL2xldmVscy5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgQWN0aW9ucyBmcm9tICcuLi91bml0L2FjdGlvbnMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXRpbmdUZXh0IHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBbXTtcclxuICAgICAgICB0aGlzLnNoaWZ0UmlnaHQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNoaWZ0ID0gMDtcclxuICAgIH1cclxuXHJcbiAgICBzdGF0aWMgZ2V0U2luZ2xldG9uSW5zdGFuY2UoY29udGV4dCkge1xyXG4gICAgICAgIGlmICghRmxvYXRpbmdUZXh0Lmluc3RhbmNlKSBGbG9hdGluZ1RleHQuaW5zdGFuY2UgPSBuZXcgRmxvYXRpbmdUZXh0KGNvbnRleHQpO1xyXG4gICAgICAgIHJldHVybiBGbG9hdGluZ1RleHQuaW5zdGFuY2U7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkKHVuaXQpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLnB1c2goe1xyXG4gICAgICAgICAgICB0ZXh0OiB1bml0LnRleHQsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uWDogdW5pdC5wb3NpdGlvblgsXHJcbiAgICAgICAgICAgIHBvc2l0aW9uWTogdW5pdC5wb3NpdGlvblksXHJcbiAgICAgICAgICAgIGFjdGlvbjogdW5pdC5hY3Rpb24sXHJcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuZm9yRWFjaCh0ZXh0UGFyYW0gPT4geyAvLyBUT0RPOiBkYW1hZ2UgbmVlZCB0byByZW5hbWVcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZvbnQgPScxNHB4IFBpeGVsYXRlJztcclxuICAgICAgICAgICAgaWYgKHRleHRQYXJhbS5hY3Rpb24gPT09IEFjdGlvbnMuYXR0YWNrKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCByZWRDb2xvciA9IGByZ2JhKDI0OCwgMjIsIDk3LCAke3RleHRQYXJhbS5vcGFjaXR5fSlgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gcmVkQ29sb3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGV4dFBhcmFtLmFjdGlvbiA9PT0gQWN0aW9ucy5oZWFsKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBncmVlbkNvbG9yID0gYHJnYmEoMTE3LCAyNDgsIDQ4LCAke3RleHRQYXJhbS5vcGFjaXR5fSlgXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gZ3JlZW5Db2xvcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IHdoaXRlID0gYHJnYmEoMjU1LCAyNTUsIDI1NSwgJHt0ZXh0UGFyYW0ub3BhY2l0eX0pYFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHdoaXRlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dChgJHt0ZXh0UGFyYW0udGV4dH1gLCB0ZXh0UGFyYW0ucG9zaXRpb25YLCB0ZXh0UGFyYW0ucG9zaXRpb25ZKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVQb3NpdGlvbigpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmZvckVhY2godGV4dCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0ZXh0Lm9wYWNpdHkgPD0gMCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLnN0YXRlLmZpbmRJbmRleChjdXJyZW50RGFtYWdlID0+IGN1cnJlbnREYW1hZ2UgPT09IHRleHQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGV4dC5wb3NpdGlvblggKz0gdGhpcy5zaGlmdDtcclxuICAgICAgICAgICAgICAgIHRleHQucG9zaXRpb25ZIC09IDAuNztcclxuICAgICAgICAgICAgICAgIHRleHQub3BhY2l0eSAtPSAwLjAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy50aWNrKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGljaygpIHtcclxuICAgICAgICBpZiAodGhpcy5zaGlmdCA+PSAwLjUpIHRoaXMuc2hpZnRSaWdodCA9IGZhbHNlO1xyXG4gICAgICAgIGVsc2UgaWYgKHRoaXMuc2hpZnQgPD0gLTAuNSkgdGhpcy5zaGlmdFJpZ2h0ID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLnNoaWZ0UmlnaHQgPyB0aGlzLnNoaWZ0ICs9IDAuMDMgOiB0aGlzLnNoaWZ0IC09IDAuMDM7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9mbG9hdGluZy10ZXh0L2Zsb2F0aW5nLXRleHQuanNcbi8vIG1vZHVsZSBpZCA9IDlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlhbG9nIHtcclxuICAgIGNvbnN0cnVjdG9yKGNvbnRleHQpIHtcclxuICAgICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xyXG4gICAgICAgIHRoaXMub3BhY2l0eSA9IDA7XHJcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIG9wZW4obWVzc2FnZSwgbWVzc2FnZVgsIGJ1dHRvbnMpIHtcclxuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xyXG4gICAgICAgIHRoaXMubWVzc2FnZVggPSBtZXNzYWdlWDtcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBidXR0b25zO1xyXG4gICAgICAgIHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xyXG4gICAgICAgIHRoaXMuZmFkZUluID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBjbG9zZSgpIHtcclxuICAgICAgICB0aGlzLmlzT3BlbmVkID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5mYWRlSW4gPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgaWYgKCF0aGlzLmlzT3BlbmVkICYmIHRoaXMub3BhY2l0eSA8PSAwLjEpIHJldHVybjtcclxuXHJcbiAgICAgICAgaWYgKCF0aGlzLmZhZGVJbikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vcGFjaXR5ID4gMC4xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHkgLT0gMC4wMztcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLm9wYWNpdHk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGhpcy5tZXNzYWdlLCB0aGlzLm1lc3NhZ2VYICwgMjAwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24ucmVuZGVyKHRoaXMuY29udGV4dCkpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZSA9ICcnO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tZXNzYWdlWCA9IDA7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3BhY2l0eSA8PSAxKSB0aGlzLm9wYWNpdHkgKz0gMC4wMTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5vcGFjaXR5O1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGhpcy5tZXNzYWdlLCB0aGlzLm1lc3NhZ2VYICwgMjAwKTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IGJ1dHRvbi5yZW5kZXIodGhpcy5jb250ZXh0KSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZGlhbG9nL2RpYWxvZy5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICB7IEdhbWVDYW52YXMgfSBmcm9tICcuL2dhbWUtY2FudmFzL2dhbWUtY2FudmFzJztcclxuaW1wb3J0IHsgU3RhdGUgfSBmcm9tICcuL3N0YXRlL3N0YXRlJztcclxuaW1wb3J0IHsgTWVudVNjZW5lIH0gZnJvbSAnLi9zY2VuZXMvbWVudS5zY2VuZSc7XHJcbmltcG9ydCB7IEdhbWVTY2VuZSB9IGZyb20gJy4vc2NlbmVzL2dhbWUuc2NlbmUnO1xyXG5pbXBvcnQgTXVzaWMgZnJvbSAnLi9tdXNpYy9tdXNpYyc7XHJcbmltcG9ydCBTdGF0aXN0aWMgZnJvbSAnLi9zY2VuZXMvc3RhdGlzdGljJztcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHN0YXRlID0gbmV3IFN0YXRlKCk7XHJcbiAgICBjb25zdCBnYW1lQ2FudmFzID0gbmV3IEdhbWVDYW52YXMoKTtcclxuICAgIGNvbnN0IG11c2ljID0gbmV3IE11c2ljKGdhbWVDYW52YXMpO1xyXG4gICAgLy8gY29uc3QgcHJlbG9kZXIgPSBuZXcgUHJlbG9hZGVyKHN0YXRlLCBnYW1lQ2FudmFzKTtcclxuICAgIGNvbnN0IG1lbnVTY2VuZSA9IG5ldyBNZW51U2NlbmUoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuICAgIGNvbnN0IGdhbWVTY2VuZSA9IG5ldyBHYW1lU2NlbmUoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuICAgIGNvbnN0IHN0YXRpc3RpYyA9IG5ldyBTdGF0aXN0aWMoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuXHJcbiAgICAvLyBzdGF0ZS5zY2VuZXMubWVudS5pbnN0YW5jZSA9IHByZWxvZGVyO1xyXG4gICAgc3RhdGUuc2NlbmVzLm1lbnUuaW5zdGFuY2UgPSBtZW51U2NlbmU7XHJcbiAgICBzdGF0ZS5zY2VuZXMuZ2FtZS5pbnN0YW5jZSA9IGdhbWVTY2VuZTtcclxuICAgIHN0YXRlLnNjZW5lcy5zdGF0aXN0aWMuaW5zdGFuY2UgPSBzdGF0aXN0aWM7XHJcbiAgICBzdGF0ZS5jdXJyZW50U2NlbmUgPSBtZW51U2NlbmU7XHJcblxyXG4gICAgKGZ1bmN0aW9uIGZyYW1lKHRpbWVzdGFtcCkge1xyXG4gICAgICAgIHN0YXRlLmN1cnJlbnRTY2VuZS5mcmFtZSh0aW1lc3RhbXApO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XHJcbiAgICB9KSgpO1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIEdhbWVDYW52YXMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5pZCA9ICdjYW52YXMnO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gMTEwMDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSA3MDA7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9JzMwcHggUGl4ZWxhdGUnO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG5cclxuICAgICAgICB0aGlzLmNsaWNrU3Vic2NyaWJlcnMgPSBbXTsgXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5leGVjdXRlQ2xpY2tIYW5kbGVycygpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdWJzY3JpYmVPbkNsaWNrKC4uLnN1YnNjcmliZXJzKSB7XHJcbiAgICAgICAgc3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1N1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zdWJzY3JpYmVDbGljayhzdWJzY3JpYmVyKSB7XHJcbiAgICAgICAgaWYgKHN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWNrU3Vic2NyaWJlcnMuaW5kZXhPZihzdWJzY3JpYmVyKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tTdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1N1YnNjcmliZXJzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4ZWN1dGVDbGlja0hhbmRsZXJzKCkge1xyXG4gICAgICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICB0aGlzLmNsaWNrU3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2tlZEluc2lkZVN1YnNjcmliZXIgPSBzdWJzY3JpYmVyLnggPD0geFxyXG4gICAgICAgICAgICAgICAgJiYgc3Vic2NyaWJlci54ICsgc3Vic2NyaWJlci53aWR0aCA+PSB4XHJcbiAgICAgICAgICAgICAgICAmJiBzdWJzY3JpYmVyLnkgPD0geSBcclxuICAgICAgICAgICAgICAgICYmIHN1YnNjcmliZXIueSArIHN1YnNjcmliZXIuaGVpZ2h0ID49IHk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xpY2tlZEluc2lkZVN1YnNjcmliZXIpIHN1YnNjcmliZXIuY2xpY2tIYW5kbGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9nYW1lLWNhbnZhcy9nYW1lLWNhbnZhcy5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGxldmVscyBmcm9tICcuLi9sZXZlbHMvbGV2ZWxzJztcclxuaW1wb3J0IFVuaXRGYWN0b3J5IGZyb20gJy4uL3VuaXQtZmFjdG9yeS91bml0LWZhY3RvcnknO1xyXG5pbXBvcnQgUXVldWUgZnJvbSAnLi4vcXVldWUvcXVldWUnO1xyXG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMgPSB7XHJcbiAgICAgICAgICAgIHByZWxvYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1lbnU6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZFNwcml0ZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGNsb3Vkc0ltYWdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgY2xvdWRzT2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgIGJlbHQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBiZWx0WTogLTcyMCxcclxuICAgICAgICAgICAgICAgIG1lbnVTaGVldDogbnVsbCxcclxuICAgICAgICAgICAgICAgIG1lbnVTaGVldFk6IC01NTAsXHJcbiAgICAgICAgICAgICAgICBhYm91dFNoZWV0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYWJvdXRTaGVldFk6IC02ODAsXHJcbiAgICAgICAgICAgICAgICBhYm91dFNoZWV0VmlzaWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogMCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiAwLjAxLFxyXG4gICAgICAgICAgICAgICAgZ3Jhdml0eTogLTkuODA2NjUsXHJcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb246IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2FtZToge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBlbmVtaWVzU3Bhd25YOiBkZWZhdWx0cy5lbmVtaWVzU3Bhd25YLFxyXG4gICAgICAgICAgICAgICAgYWxsaWVzU3Bhd25YOiBkZWZhdWx0cy5hbGxpZXNTcGF3blgsXHJcbiAgICAgICAgICAgICAgICBpc1BhdXNlR2FtZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIG1vbmV5OiBkZWZhdWx0cy5zdGFydE1vbmV5LFxyXG4gICAgICAgICAgICAgICAgcGFzdE1vbmV5OiBkZWZhdWx0cy5zdGFydE1vbmV5LFxyXG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZMZXZlbHM6IGxldmVscy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGV2ZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXZlbE51bWJlcjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VuZExldmVsWTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBhbGxpZXM6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5lbWllczogbnVsbFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RhdGlzdGljOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBzcGVudFRpbWU6IDAsXHJcbiAgICAgICAgICAgICAgICB1bnN1Y2Nlc3NmdWxBdHRlbXB0czogMCxcclxuICAgICAgICAgICAgICAgIHlvdXJEYW1hZ2U6IDAsXHJcbiAgICAgICAgICAgICAgICByZWNlaXZlZERhbWFnZTogMCxcclxuICAgICAgICAgICAgICAgIGVhcm5lZE1vbmV5OiBkZWZhdWx0cy5zdGFydE1vbmV5LFxyXG4gICAgICAgICAgICAgICAgaGVhbGVkSHA6IDBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIC8vIHRoaXMudW5pdEZhY3RvcnkgPSBVbml0RmFjdG9yeS5nZXRTaW5nbGV0b25JbnN0YW5jZSgpO1xyXG4gICAgICAgIC8vIHRoaXMucXVldWUgPSBuZXcgUXVldWUodGhpcyk7IC8vIFRPRE86IG1vdmVcclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLnNjZW5lcy5nYW1lLm1vbmV5ID0gZGVmYXVsdHMuc3RhcnRNb25leTtcclxuICAgICAgICB0aGlzLnNjZW5lcy5nYW1lLnBhc3RNb25leSA9IGRlZmF1bHRzLnN0YXJ0TW9uZXk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdGF0ZS9zdGF0ZS5qc1xuLy8gbW9kdWxlIGlkID0gMTNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuLi8uLi91bml0L3Nwcml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTa2VsZXRvbiBleHRlbmRzIFVuaXQge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBoZWFsdGg6IDEwLFxyXG4gICAgICAgICAgICBkYW1hZ2U6IDMsXHJcbiAgICAgICAgICAgIGF0dGFja1RpbWU6IDIxNDIsXHJcbiAgICAgICAgICAgIHJhbmdlQXR0YWNrOiAyMyxcclxuICAgICAgICAgICAgdGltZVRvSGl0OiA5NTIsXHJcbiAgICAgICAgICAgIGRlYXRoVGltZTogMTkwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDAuNixcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGlkbGVUaW1lOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gMjtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAyNCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDMyLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMTEsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiAxMFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLXdhbGstJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogMjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAzMyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEzLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogOTAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiAxMFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24tYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDQzLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMzcsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxOCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDEyNSxcclxuICAgICAgICAgICAgeE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDAgOiAtMTYsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiAxMFxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24tZGllLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDMzLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMzIsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxNSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDE1MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDEwXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy9za2VsZXRvbi9za2VsZXRvbi5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3ByaXRlcyB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLmlkbGUgPSBudWxsO1xyXG4gICAgdGhpcy53YWxrID0gbnVsbDtcclxuICAgIHRoaXMuYXR0YWNrID0gbnVsbDtcclxuICAgIHRoaXMuZGllID0gbnVsbDtcclxuICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0L3Nwcml0ZXMuanNcbi8vIG1vZHVsZSBpZCA9IDE1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgS25pZ2h0IGV4dGVuZHMgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGhlYWx0aDogMTUsXHJcbiAgICAgICAgICAgIGRhbWFnZTogNCxcclxuICAgICAgICAgICAgYXR0YWNrVGltZTogMTUwMCxcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDI0LFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDc1MCxcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiA3MDAsXHJcbiAgICAgICAgICAgIHN0ZXBTaXplOiAwLjgsXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29zdCA9IDQ7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVTcHJpdGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlU3ByaXRlcygpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtaWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA0MixcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDMwMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAyNiA6IDE2XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy53YWxrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC13YWxrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDQyLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNDAsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA4LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTUwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDI2IDogMTZcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmF0dGFjayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDgwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNDAsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxMCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDE3MCxcclxuICAgICAgICAgICAgeE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDAgOiAtMzgsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMjYgOiAxNlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1kaWUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNDIsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDksXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiA5MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAyNiA6IDE2XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy9rbmlnaHQva25pZ2h0LmpzXG4vLyBtb2R1bGUgaWQgPSAxNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVW5pdCBmcm9tICcuLi8uLi91bml0L3VuaXQnO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvdW50cnlLbmlnaHQgZXh0ZW5kcyBVbml0IHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24pIHtcclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgaGVhbHRoOiAxMCxcclxuICAgICAgICAgICAgZGFtYWdlOiAxLFxyXG4gICAgICAgICAgICBhdHRhY2tUaW1lOiA1MDAsXHJcbiAgICAgICAgICAgIHJhbmdlQXR0YWNrOiAxOSxcclxuICAgICAgICAgICAgdGltZVRvSGl0OiA0MDAsXHJcbiAgICAgICAgICAgIGRlYXRoVGltZTogMTAwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDEuNSxcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGlkbGVUaW1lOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gMztcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuICAgIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDY0LFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMzksXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA2LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMjAwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDM4IDogMjZcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1ydW4tJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA0NSxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDgsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMTIsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMzggOiAyNlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQtYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDY0LFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNDIsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA0LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMjAwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDM4IDogMjZcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmRpZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWRpZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA2NCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDQ1LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDE1NSxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAzOCA6IDI2XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuLi8uLi91bml0L3Nwcml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2d1ZSBleHRlbmRzIFVuaXQge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBoZWFsdGg6IDEwLFxyXG4gICAgICAgICAgICBkYW1hZ2U6IDIsXHJcbiAgICAgICAgICAgIGF0dGFja1RpbWU6IDEwMDAsXHJcbiAgICAgICAgICAgIHJhbmdlQXR0YWNrOiA0MCxcclxuICAgICAgICAgICAgdGltZVRvSGl0OiA4MDAsXHJcbiAgICAgICAgICAgIGRlYXRoVGltZTogMTAwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDEsXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICBpZGxlVGltZTogMTAwMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29zdCA9IDI7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVTcHJpdGVzKCk7XHJcbiAgICB9XHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvcm9ndWUvcm9ndWUtaWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA2NCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDIxLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMyxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDIwMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1ydW4tJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyMyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDYsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMTIsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiA3XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyMyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTEyLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogN1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvcm9ndWUvcm9ndWUtZGVhdGgtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogMzMsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyMSxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDksXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiA1MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDdcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL3JvZ3VlL3JvZ3VlLmpzXG4vLyBtb2R1bGUgaWQgPSAxOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVW5pdCBmcm9tICcuLi8uLi91bml0L3VuaXQnO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJsb2IgZXh0ZW5kcyBVbml0IHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24pIHtcclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgaGVhbHRoOiAzLFxyXG4gICAgICAgICAgICBkYW1hZ2U6IDQsXHJcbiAgICAgICAgICAgIGF0dGFja1RpbWU6IDEyMDAsXHJcbiAgICAgICAgICAgIHJhbmdlQXR0YWNrOiAyNyxcclxuICAgICAgICAgICAgdGltZVRvSGl0OiAxMTAwLFxyXG4gICAgICAgICAgICBkZWF0aFRpbWU6IDEwMDAsXHJcbiAgICAgICAgICAgIHN0ZXBTaXplOiAxLFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgICAgICAgICAgaWRsZVRpbWU6IDEwMDBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvc3QgPSAyO1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xyXG4gICAgfVxyXG4gICAgY29uZmlndXJlU3ByaXRlcygpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2Jsb2IvYmxvYi1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDgwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMjMsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAzLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMjUwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMzFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9ibG9iL2Jsb2ItbW92ZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA4MCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDExMixcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDMxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9ibG9iL2Jsb2ItYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDgwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMzMsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxMCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDEzMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDMxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9ibG9iL2Jsb2ItZGVhdGgtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA1NCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDgsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxNTUsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAzMVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdHMvYmxvYi9ibG9iLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVW5pdCBmcm9tICcuLi8uLi91bml0L3VuaXQnO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcclxuaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi4vLi4vdW5pdC9hY3Rpb25zJztcclxuaW1wb3J0IERpcmVjdGlvbiBmcm9tICcuLi8uLi91bml0L2RpcmVjdGlvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaXphcmQgZXh0ZW5kcyBVbml0IHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24pIHtcclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgaGVhbHRoOiAyMCxcclxuICAgICAgICAgICAgZGFtYWdlOiAxLFxyXG4gICAgICAgICAgICBhdHRhY2tUaW1lOiAxNTAwLFxyXG4gICAgICAgICAgICByYW5nZUF0dGFjazogMjgsXHJcbiAgICAgICAgICAgIHRpbWVUb0hpdDogMTAwMCxcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiAxOTAwLFxyXG4gICAgICAgICAgICBzdGVwU2l6ZTogMC40LFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgICAgICAgICAgaWRsZVRpbWU6IDEwMDBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmhlYWx0aFRvSGVhbCA9IDE7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gMztcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvd2l6YXJkL3dpemFyZC1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDgwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogODAsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxMCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDIwMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDIxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy53YWxrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvd2l6YXJkL3dpemFyZC1ydW4tJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNzAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA1NixcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDUsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyNTAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAyMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvd2l6YXJkL3dpemFyZC1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogMTAwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNTcsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA5LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTgwLFxyXG4gICAgICAgICAgICB4T2Zmc2V0OiAtMTQsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAyMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvd2l6YXJkL3dpemFyZC1kZWF0aC0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA4MCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDgwLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMTAsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyNTAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAyMVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5oZWFsID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvd2l6YXJkL3dpemFyZC1oZWFsLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDgwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogODAsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxMCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDI1MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDIxXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZG9BY3Rpb24oc3RhdGUsIHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICh0aGlzLmhlYWx0aCA8PSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGllKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50QWN0aW9uID09PSBBY3Rpb25zLmlkbGVcclxuICAgICAgICAgICAgJiYgdGltZXN0YW1wIC0gdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA8IHRoaXMuaWRsZVRpbWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luRnJvbnRPZkFsbHkoc3RhdGUpICYmIHRoaXMuaXNVbml0UmFuZ2Uoc3RhdGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGVhbChzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZBbGx5KHN0YXRlKSB8fCBzdGF0ZS5pc1BhdXNlR2FtZVxyXG4gICAgICAgICAgICB8fCB0aGlzLmlzSW5Gcm9udE9mRW5lbXkoc3RhdGUpICYmIHRoaXMuaXNFbmVteUR5aW5nKHN0YXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmlkbGUoc3RhdGUsIHRpbWVzdGFtcCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzSW5Gcm9udE9mRW5lbXkoc3RhdGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuYXR0YWNrKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RlcChzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaGVhbChzdGF0ZSwgdGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5oZWFsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IEFjdGlvbnMuaGVhbDtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVzLmhlYWwucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaGVhbFRpbWUgPSB0aGlzLmF0dGFja1RpbWU7XHJcbiAgICAgICAgY29uc3QgdGFyZ2V0VW5pdCA9IHRoaXMucGxheWVyc1VuaXQgPyBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdXHJcbiAgICAgICAgICAgIDogc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF07XHJcbiAgICAgICAgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiBoZWFsVGltZSBcclxuICAgICAgICAgICAgJiYgdGFyZ2V0VW5pdC5oZWFsdGggPiAwKSB7XHJcblxyXG4gICAgICAgICAgICB0YXJnZXRVbml0LmhlYWx0aCArPSB0aGlzLmhlYWx0aFRvSGVhbDtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uWCA9IHRhcmdldFVuaXQueCBcclxuICAgICAgICAgICAgICAgICsgdGFyZ2V0VW5pdC5nZXRDdXJyZW50U3ByaXRlKCkuZnJhbWVXaWR0aCAvIDI7XHJcbiAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICB0ZXh0OiB0aGlzLmhlYWx0aFRvSGVhbCxcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uWDogcG9zaXRpb25YLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25ZOiB0YXJnZXRVbml0LnksXHJcbiAgICAgICAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuaGVhbCxcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5wbGF5ZXJzVW5pdCkge1xyXG4gICAgICAgICAgICAgICAgc3RhdGUuaW5zdGFuY2Uuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYy5oZWFsZWRIcCArPSB0aGlzLmhlYWx0aFRvSGVhbDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaXNVbml0UmFuZ2Uoc3RhdGUpIHtcclxuICAgICAgICBjb25zdCB0YXJnZXRVbml0ID0gdGhpcy5wbGF5ZXJzVW5pdCA/IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF1cclxuICAgICAgICAgICAgOiBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXTtcclxuXHJcbiAgICAgICAgcmV0dXJuIE1hdGguYWJzKHRoaXMueCAtIHRhcmdldFVuaXQueCkgPCAxMjA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q3VycmVudFNwcml0ZSgpIHtcclxuICAgICAgICBzd2l0Y2ggKHRoaXMuY3VycmVudEFjdGlvbikge1xyXG4gICAgICAgICAgICBjYXNlIEFjdGlvbnMuc3RlcDogcmV0dXJuIHRoaXMuc3ByaXRlcy53YWxrO1xyXG4gICAgICAgICAgICBjYXNlIEFjdGlvbnMuYXR0YWNrOiByZXR1cm4gdGhpcy5zcHJpdGVzLmF0dGFjaztcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLmRpZTogcmV0dXJuIHRoaXMuc3ByaXRlcy5kaWU7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9ucy5oZWFsOiByZXR1cm4gdGhpcy5zcHJpdGVzLmhlYWw7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6IHJldHVybiB0aGlzLnNwcml0ZXMuaWRsZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy93aXphcmQvd2l6YXJkLmpzXG4vLyBtb2R1bGUgaWQgPSAyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVW5pdCBmcm9tICcuLi8uLi91bml0L3VuaXQnO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJhbmRpdCBleHRlbmRzIFVuaXQge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBoZWFsdGg6IDYsXHJcbiAgICAgICAgICAgIGRhbWFnZTogMixcclxuICAgICAgICAgICAgYXR0YWNrVGltZTogNjAwLFxyXG4gICAgICAgICAgICByYW5nZUF0dGFjazogMTUsXHJcbiAgICAgICAgICAgIHRpbWVUb0hpdDogMzAwLFxyXG4gICAgICAgICAgICBkZWF0aFRpbWU6IDE5MDAsXHJcbiAgICAgICAgICAgIHN0ZXBTaXplOiAwLjYsXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICBpZGxlVGltZTogMTAwMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29zdCA9IDI7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVTcHJpdGVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uZmlndXJlU3ByaXRlcygpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2JhbmRpdC9iYW5kaXQtaWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAzMCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDI3LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNixcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDE2MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy53YWxrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1ydW4tJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogMzAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyNyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDUsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMzAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTkgOiAxMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogMzAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyNSxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDcsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMzAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTkgOiAxMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1kZWF0aC0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAzMCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDI1LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNixcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDQwMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy9iYW5kaXQvYmFuZGl0LmpzXG4vLyBtb2R1bGUgaWQgPSAyMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBkZWZhdWx0cyA9IHtcclxuICAgIGVuZW1pZXNTcGF3blg6IDExMDAsXHJcbiAgICBhbGxpZXNTcGF3blg6IDAsXHJcbiAgICBzdGFydE1vbmV5OiAxMDBcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmF1bHRzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0YXRlL2NvbnN0YW50cy5qc1xuLy8gbW9kdWxlIGlkID0gMjJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU2NlbmVCYXNlIH0gZnJvbSBcIi4vc2NlbmUuYmFzZVwiO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gXCIuLi9jb250cm9scy9idXR0b25cIjtcclxuaW1wb3J0IFNwcml0ZSBmcm9tIFwiLi4vdW5pdC9zcHJpdGVcIjtcclxuXHJcbmV4cG9ydCBjbGFzcyBNZW51U2NlbmUgZXh0ZW5kcyBTY2VuZUJhc2Uge1xyXG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYykge1xyXG4gICAgc3VwZXIoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgdXJsOiAnaW1ncy9VSS9tZW51LnBuZycsXHJcbiAgICAgIGZyYW1lV2lkdGg6IDExMDAsXHJcbiAgICAgIGZyYW1lSGVpZ2h0OiA3MDAsXHJcbiAgICAgIG51bWJlck9mRnJhbWVzOiAxMCxcclxuICAgICAgdGltZVRvRnJhbWU6IDI3MFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5jbG91ZHNJbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5jbG91ZHNJbWFnZS5zcmMgPSAnaW1ncy9VSS9tZW51LWNsb3Vkcy5wbmcnO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5iZWx0LnNyYyA9ICdpbWdzL1VJL2JlbHQucG5nJztcclxuXHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lm1lbnVTaGVldCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5tZW51U2hlZXQuc3JjID0gJ2ltZ3MvVUkvc2hlZXQucG5nJztcclxuXHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXQgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldC5zcmMgPSAnaW1ncy9VSS9hYm91dC1zaGVldC5wbmcnO1xyXG5cclxuICAgIHRoaXMuYnV0dG9ucyA9IHRoaXMuZ2V0QnV0dG9uc0NvbmZpZygpLm1hcChvcHRpb25zID0+IG5ldyBCdXR0b24ob3B0aW9ucykpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2soLi4udGhpcy5idXR0b25zKTtcclxuICAgIHRoaXMubXVzaWMuc3Vic2NyaWJlKCk7XHJcblxyXG4gICAgdGhpcy5wcmV2VGltZVN0YW1wID0gMDtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVN0YXRlKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzT2Zmc2V0WCA+PSA5MDApIHtcclxuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5jbG91ZHNPZmZzZXRYID0gMDtcclxuICAgIH1cclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzT2Zmc2V0WCArPSAwLjE7XHJcblxyXG4gICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdFkgPCAwKSB7XHJcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdFkgKz0gMTA7XHJcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUubWVudVNoZWV0WSArPSAxMDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0VmlzaWJsZVxyXG4gICAgICAmJiB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRZIDwgLTE1KSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0WSArPSAxNTtcclxuICAgIH0gZWxzZSBpZiAoIXRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFZpc2libGVcclxuICAgICAgJiYgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0WSA+IC02ODApIHtcclxuICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRZIC09IDE1O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWNjZWxlcmF0aW9uXHJcbiAgICAgID0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5ncmF2aXR5ICogTWF0aC5zaW4odGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hbmdsZSk7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LnZlbG9jaXR5XHJcbiAgICAgICs9IHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWNjZWxlcmF0aW9uICogMTAgLyAxMDAwO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hbmdsZSArPSB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LnZlbG9jaXR5ICogMTAgLyAxMDAwO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKHRpbWVzdGFtcCA9IDApIHtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc0ltYWdlLFxyXG4gICAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc09mZnNldFgsIDAsIDkwMCwgMTI2LCAyNTAsIDAsIDkwMCwgMTI2KTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUuaW1hZ2UsXHJcbiAgICAgIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS5nZXRGcmFtZVgoKSwgMCxcclxuICAgICAgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS5mcmFtZUhlaWdodCxcclxuICAgICAgMCwgMCwgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS5mcmFtZUhlaWdodCk7XHJcbiAgICB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUudGljayh0aW1lc3RhbXAsIHRoaXMucHJldlRpbWVTdGFtcCk7XHJcblxyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdCxcclxuICAgICAgMCwgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5iZWx0WSk7XHJcblxyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuc2F2ZSgpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQudHJhbnNsYXRlKDE0MCwgMCk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yb3RhdGUodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hbmdsZSk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5tZW51U2hlZXQsXHJcbiAgICAgIC0yODAgLyAyLCB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lm1lbnVTaGVldFkpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnNhdmUoKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnRyYW5zbGF0ZSg3MDAsIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucm90YXRlKC10aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFuZ2xlICogNSk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0LFxyXG4gICAgICAtMzUwIC8gMiwgMCk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgdGhpcy5tdXNpYy5yZW5kZXIoKTtcclxuXHJcbiAgICB0aGlzLnByZXZUaW1lU3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgfVxyXG5cclxuICBzdGFydEdhbWUoKSB7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmluc3RhbmNlO1xyXG4gICAgdGhpcy5zdGF0ZS5yZXNldCgpOyAvLyBUT0RPOiBtYiByZW5hbWUgcmVzZXRNb25leVxyXG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XHJcbiAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5kaWFsb2cub3BlbihgU2VsZWN0IGEgdW5pdCBpbiB0aGUgdXBwZXIgcmlnaHQgY29ybmVyYCwgMjAwLCBbXSk7XHJcbiAgfVxyXG5cclxuICB0b2dnbGVBYm91dCgpIHtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFZpc2libGVcclxuICAgICAgPSAhdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0VmlzaWJsZTtcclxuICB9XHJcblxyXG4gIGdldEJ1dHRvbnNDb25maWcoKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICB7IHg6IDc1LCB5OiA0MjAsIGhlaWdodDogNTAsIHdpZHRoOiAxNjUsIGNsaWNrSGFuZGxlcjogKCkgPT4gdGhpcy5zdGFydEdhbWUoKSB9LFxyXG4gICAgICB7IHg6IDY1LCB5OiA0OTAsIGhlaWdodDogNTAsIHdpZHRoOiAxODUsIGNsaWNrSGFuZGxlcjogKCkgPT4gdGhpcy50b2dnbGVBYm91dCgpIH1cclxuICAgIF07XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2NlbmVzL21lbnUuc2NlbmUuanNcbi8vIG1vZHVsZSBpZCA9IDIzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IFNjZW5lQmFzZSB9IGZyb20gXCIuL3NjZW5lLmJhc2VcIjtcclxuaW1wb3J0IENvbnRyb2xQYW5lbCBmcm9tICcuLi9jb250cm9sLXBhbmVsL2NvbnRyb2wtcGFuZWwnO1xyXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4uL2RpYWxvZy9kaWFsb2cnO1xyXG5pbXBvcnQgVW5pdEZhY3RvcnkgZnJvbSAnLi4vdW5pdC1mYWN0b3J5L3VuaXQtZmFjdG9yeSc7XHJcbmltcG9ydCBRdWV1ZSBmcm9tICcuLi9xdWV1ZS9xdWV1ZSc7XHJcbmltcG9ydCBsZXZlbHMgZnJvbSAnLi4vbGV2ZWxzL2xldmVscyc7XHJcbmltcG9ydCBEaXJlY3Rpb24gZnJvbSAnLi4vdW5pdC9kaXJlY3Rpb24nO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBGbG9hdGluZ1RleHQgZnJvbSAnLi4vZmxvYXRpbmctdGV4dC9mbG9hdGluZy10ZXh0JztcclxuaW1wb3J0IEJ1ZmZNYW5hZ2VyIGZyb20gJy4uL2J1ZmYtbWFuYWdlci9idWZmLW1hbmFnZXInO1xyXG5cclxuZXhwb3J0IGNsYXNzIEdhbWVTY2VuZSBleHRlbmRzIFNjZW5lQmFzZSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljLCBwcmVsb2FkZXIpIHtcclxuICAgIHN1cGVyKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYyk7XHJcblxyXG4gICAgdGhpcy5jb250cm9sUGFuZWwgPSBuZXcgQ29udHJvbFBhbmVsKHN0YXRlLCBnYW1lQ2FudmFzKTtcclxuICAgIHRoaXMuYnVmZk1hbmFnZXIgPSBuZXcgQnVmZk1hbmFnZXIoc3RhdGUsIGdhbWVDYW52YXMpO1xyXG4gICAgdGhpcy5mbG9hdGluZ1RleHQgPSBGbG9hdGluZ1RleHQuZ2V0U2luZ2xldG9uSW5zdGFuY2UoZ2FtZUNhbnZhcy5jb250ZXh0KTtcclxuICAgIHRoaXMuZGlhbG9nID0gbmV3IERpYWxvZyhnYW1lQ2FudmFzLmNvbnRleHQpO1xyXG4gICAgdGhpcy51bml0RmFjdG9yeSA9IFVuaXRGYWN0b3J5LmdldFNpbmdsZXRvbkluc3RhbmNlKCk7XHJcbiAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKHN0YXRlKTsgLy8gVE9ETzogbW92ZVxyXG4gICAgdGhpcy5wcmV2VGltZVN0YW1wID0gMDtcclxuXHJcbiAgICB0aGlzLmluaXRpYWxpemUoMCk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVTdGF0ZSh0aW1lc3RhbXApIHtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKGFsbHkgPT4gYWxseS5kb0FjdGlvbih0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLCB0aW1lc3RhbXApKTtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmVuZW1pZXMuZm9yRWFjaChlbmVteSA9PiBlbmVteS5kb0FjdGlvbih0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLCB0aW1lc3RhbXApKTtcclxuXHJcbiAgICBjb25zdCB3aW5uZXIgPSB0aGlzLmdldFdpbm5lcigpO1xyXG4gICAgaWYgKHdpbm5lciAmJiAhdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5pc1BhdXNlR2FtZSkge1xyXG4gICAgICAgIHRoaXMuc2hvd0VuZEdhbWVXaW5kb3cod2lubmVyKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmJ1ZmZNYW5hZ2VyLnVwZGF0ZVRpbWUoKTtcclxuXHJcbiAgICB0aGlzLmZsb2F0aW5nVGV4dC51cGRhdGVQb3NpdGlvbigpO1xyXG4gIH1cclxuXHJcbiAgcmVuZGVyKHRpbWVzdGFtcCkge1xyXG4gICAgY29uc3QgZ2FtZVN0YXRlID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZTtcclxuXHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UoZ2FtZVN0YXRlLmN1cnJlbnRMZXZlbC5iYWNrZ3JvdW5kLCAwLCAwKTtcclxuICAgIHRoaXMuY29udHJvbFBhbmVsLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4gYnV0dG9uLnJlbmRlcih0aGlzLmdhbWVDYW52YXMuY29udGV4dCkpO1xyXG5cclxuICAgIHRoaXMuYnVmZk1hbmFnZXIucmVuZGVyKCk7XHJcblxyXG4gICAgZ2FtZVN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXMuZm9yRWFjaChhbGx5ID0+IHtcclxuICAgICAgY29uc3Qgc3ByaXRlID0gYWxseS5nZXRDdXJyZW50U3ByaXRlKCk7XHJcbiAgICAgIHNwcml0ZS50aWNrKHRpbWVzdGFtcCwgdGhpcy5wcmV2VGltZVN0YW1wKTtcclxuICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHNwcml0ZS5pbWFnZSwgc3ByaXRlLmdldEZyYW1lWCgpLCAwLFxyXG4gICAgICAgICAgc3ByaXRlLmZyYW1lV2lkdGggLSAxLCBzcHJpdGUuZnJhbWVIZWlnaHQsXHJcbiAgICAgICAgICBhbGx5LnggKyBzcHJpdGUueE9mZnNldCwgYWxseS55LCBzcHJpdGUuZnJhbWVXaWR0aCwgc3ByaXRlLmZyYW1lSGVpZ2h0KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGdhbWVTdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllcy5mb3JFYWNoKGVuZW15ID0+IHtcclxuICAgICAgY29uc3Qgc3ByaXRlID0gZW5lbXkuZ2V0Q3VycmVudFNwcml0ZSgpO1xyXG4gICAgICBjb25zdCBmcmFtZVggPSAoc3ByaXRlLmZyYW1lV2lkdGggKiAoc3ByaXRlLm51bWJlck9mRnJhbWVzIC0xKSlcclxuICAgICAgICAgIC0gc3ByaXRlLmdldEZyYW1lWCgpO1xyXG4gICAgICBzcHJpdGUudGljayh0aW1lc3RhbXAsIHRoaXMucHJldlRpbWVTdGFtcCk7XHJcbiAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZShzcHJpdGUuaW1hZ2UsIGZyYW1lWCwgMCxcclxuICAgICAgICAgIHNwcml0ZS5mcmFtZVdpZHRoLCBzcHJpdGUuZnJhbWVIZWlnaHQsXHJcbiAgICAgICAgICBlbmVteS54ICsgc3ByaXRlLnhPZmZzZXQsIGVuZW15LnksIHNwcml0ZS5mcmFtZVdpZHRoLCBzcHJpdGUuZnJhbWVIZWlnaHQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5mbG9hdGluZ1RleHQucmVuZGVyKCk7XHJcblxyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCQke3RoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXl9YCwgMTAyMCwgNDApO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7Z2FtZVN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlcn0vJHtnYW1lU3RhdGUubnVtYmVyT2ZMZXZlbHN9YCwgMTAyMCwgOTApO1xyXG4gICAgdGhpcy5oZWxwTWVudUJ1dHRvbi5yZW5kZXIodGhpcy5nYW1lQ2FudmFzLmNvbnRleHQpO1xyXG5cclxuICAgIHRoaXMuZGlhbG9nLnJlbmRlcigpO1xyXG5cclxuICAgIHRoaXMubXVzaWMucmVuZGVyKCk7XHJcblxyXG4gICAgdGhpcy5wcmV2VGltZVN0YW1wID0gdGltZXN0YW1wO1xyXG4gIH1cclxuXHJcbiAgaW5pdGlhbGl6ZShsZXZlbCkge1xyXG4gICAgdGhpcy5sb2FkTGV2ZWwobGV2ZWwpO1xyXG4gICAgdGhpcy5jb250cm9sUGFuZWwuY3JlYXRlQ29udHJvbFBhbmVsKGxldmVsKTtcclxuICAgIHRoaXMuYWRkQnVmZk1hbmFnZXIoKTtcclxuXHJcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWU7XHJcbiAgICBzdGF0ZS5pc1BhdXNlR2FtZSA9IHRydWU7XHJcblxyXG4gICAgaWYgKCF0aGlzLm5leHRCdXR0b24pIHtcclxuICAgICAgdGhpcy5uZXh0QnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgeDogNjUwLFxyXG4gICAgICAgIHk6IDI3MCxcclxuICAgICAgICBoZWlnaHQ6IDYxLFxyXG4gICAgICAgIHdpZHRoOiA2MSxcclxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9uZXh0LWJ1dHRvbi5wbmcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3BsYXknKVxyXG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgIHRoaXMuYnVmZk1hbmFnZXIuZnVsbFJlc2V0KCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5pbml0aWFsaXplKHN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciArIDEpO1xyXG4gICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25zQ2xpY2soKTtcclxuICAgICAgICAgIHN0YXRlLnBhc3RNb25leSA9IHN0YXRlLm1vbmV5O1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMucHJldkJ1dHRvbikge1xyXG4gICAgICB0aGlzLnByZXZCdXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICB4OiA2MjAsXHJcbiAgICAgICAgeTogMjcwLFxyXG4gICAgICAgIGhlaWdodDogNTUsXHJcbiAgICAgICAgd2lkdGg6IDU1LFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL3ByZXYtYnV0dG9uLnBuZycsXHJcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygncHJldicpXHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgICAgdGhpcy5idWZmTWFuYWdlci5mdWxsUmVzZXQoKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemUoc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyIC0gMSk7XHJcbiAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbnNDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLnVuc3VjY2Vzc2Z1bEF0dGVtcHRzKys7XHJcbiAgICAgICAgICBzdGF0ZS5tb25leSA9IHN0YXRlLnBhc3RNb25leTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBcclxuICAgIGlmICghdGhpcy5yZXBsYXlCdXR0b24pIHtcclxuICAgICAgdGhpcy5yZXBsYXlCdXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICB4OiA2NTAsXHJcbiAgICAgICAgeTogMjcwLFxyXG4gICAgICAgIGhlaWdodDogNTUsXHJcbiAgICAgICAgd2lkdGg6IDU1LFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL3JlcGxheS5wbmcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlcGxheScpXHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgICAgdGhpcy5idWZmTWFuYWdlci5mdWxsUmVzZXQoKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemUoc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyKTtcclxuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMudW5zdWNjZXNzZnVsQXR0ZW1wdHMrKztcclxuICAgICAgICAgIHN0YXRlLm1vbmV5ID0gc3RhdGUucGFzdE1vbmV5O1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmV4aXRCdXR0b24pIHtcclxuICAgICAgdGhpcy5leGl0QnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgeDogNDUwLFxyXG4gICAgICAgIHk6IDI3MCxcclxuICAgICAgICBoZWlnaHQ6IDczLFxyXG4gICAgICAgIHdpZHRoOiA2MSxcclxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9leGl0LnBuZycsXHJcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnZXhpdCcpO1xyXG4gICAgICAgICAgdGhpcy5pbml0aWFsaXplKDApO1xyXG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgIHRoaXMuYnVmZk1hbmFnZXIuZnVsbFJlc2V0KCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lmluc3RhbmNlO1xyXG4gICAgICAgICAgdGhpcy5tdXNpYy5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKC4uLnRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmJ1dHRvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuY2xvc2VCdXR0b24pIHtcclxuICAgICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgIHg6IDM1MCxcclxuICAgICAgICB5OiAyNzAsXHJcbiAgICAgICAgaGVpZ2h0OiA3MyxcclxuICAgICAgICB3aWR0aDogNjEsXHJcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvVUkvY2xvc2UucG5nJyxcclxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdjbG9zZScpO1xyXG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKHRoaXMuY2xvc2VCdXR0b24pO1xyXG4gICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2sodGhpcy5leGl0QnV0dG9uKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKHRoaXMucmVwbGF5QnV0dG9uKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKHRoaXMuaGVscE1lbnVCdXR0b24pO1xyXG5cclxuICAgICAgICAgIHN0YXRlLmlzUGF1c2VHYW1lID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5oZWxwTWVudUJ1dHRvbikge1xyXG4gICAgICB0aGlzLmhlbHBNZW51QnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgeDogMTAyNSxcclxuICAgICAgICB5OiAxNzAsXHJcbiAgICAgICAgaGVpZ2h0OiA3MyxcclxuICAgICAgICB3aWR0aDogNjEsXHJcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvVUkvaGVscC1tZW51LnBuZycsXHJcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnaGVscC1tZW51Jyk7XHJcbiAgICAgICAgICBzdGF0ZS5pc1BhdXNlR2FtZSA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5yZXNldCgpO1xyXG4gICAgICAgICAgdGhpcy5leGl0QnV0dG9uLnggPSAhc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyID8gNTUwIDogNDkwO1xyXG4gICAgICAgICAgdGhpcy5yZXBsYXlCdXR0b24ueCA9IDc1MDtcclxuICAgICAgICAgIGlmICghc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oJ1doYXQgZG8geW91IHdhbnQgdG8gZG8nLCAzNTAsIFt0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLmV4aXRCdXR0b24sIHRoaXMucmVwbGF5QnV0dG9uXSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKHRoaXMuY2xvc2VCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5kaWFsb2cub3BlbignV2hhdCBkbyB5b3Ugd2FudCB0byBkbycsIDM1MCwgW3RoaXMuY2xvc2VCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbiwgdGhpcy5wcmV2QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbl0pO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLmV4aXRCdXR0b24sIHRoaXMucHJldkJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2sodGhpcy5oZWxwTWVudUJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5zdGF0aXN0aWNCdXR0b24pIHtcclxuICAgICAgdGhpcy5zdGF0aXN0aWNCdXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICB4OiA2NTAsXHJcbiAgICAgICAgeTogMjcwLFxyXG4gICAgICAgIGhlaWdodDogNTUsXHJcbiAgICAgICAgd2lkdGg6IDU1LFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL3N0YXRpc3RpYy5wbmcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3N0YXRpc3RpYycpO1xyXG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZSA9IHRoaXMuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYy5pbnN0YW5jZTtcclxuICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLnN1YnNjcmliZU9uQ2xpY2soKTtcclxuICAgICAgICAgIHRoaXMubXVzaWMuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5kaWFsb2cub3BlbignJywgNTAwLCBbdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuZXhpdEJ1dHRvbl0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBsb2FkTGV2ZWwobGV2ZWwpIHtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcyA9IFtdO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcyA9IFtdO1xyXG5cclxuICAgIGNvbnN0IGN1cnJlbnRMZXZlbCA9IGxldmVsc1tsZXZlbF07XHJcbiAgICBjdXJyZW50TGV2ZWwuZW5lbWllcy5mb3JFYWNoKGVudHJ5ID0+IHtcclxuICAgICAgY29uc3QgZW5lbXkgPSB0aGlzLnVuaXRGYWN0b3J5LmNyZWF0ZShlbnRyeS5uYW1lLCBEaXJlY3Rpb24ubGVmdCk7XHJcbiAgICAgIHRoaXMucXVldWUucXVldWVFbmVteSh0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5lbmVtaWVzLCBlbmVteSk7XHJcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmVuZW1pZXMucHVzaChlbmVteSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5ncm91bmRMZXZlbFkgPSBjdXJyZW50TGV2ZWwuZ3JvdW5kTGV2ZWxZO1xyXG5cclxuICAgIGNvbnN0IGJhY2tncm91bmQgPSBuZXcgSW1hZ2UoKTtcclxuICAgIGJhY2tncm91bmQuc3JjID0gY3VycmVudExldmVsLmJhY2tncm91bmQ7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcclxuXHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciA9IGxldmVsO1xyXG4gIH1cclxuXHJcbiAgYWRkQnVmZk1hbmFnZXIoKSB7XHJcbiAgICB0aGlzLmJ1ZmZNYW5hZ2VyLmNyZWF0ZUJ1dHRvbigpO1xyXG4gIH1cclxuICBcclxuICBzdWJzY3JpYmVCdXR0b25zQ2xpY2soKSB7XHJcbiAgICB0aGlzLmNvbnRyb2xQYW5lbC5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMuYnVmZk1hbmFnZXIuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLm11c2ljLnN1YnNjcmliZSgpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5oZWxwTWVudUJ1dHRvbik7XHJcbiAgfVxyXG5cclxuICBnZXRXaW5uZXIoKSB7XHJcbiAgICBjb25zdCBlbmVtaWVzID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcztcclxuICAgIGNvbnN0IG5vRW5lbWllc0xlZnQgPSAhZW5lbWllcy5sZW5ndGg7XHJcbiAgICBjb25zdCBlbmVteVJlYWNoZWRMZWZ0U2lkZSA9IGVuZW1pZXNbMF0gJiYgZW5lbWllc1swXS54IDwgMDtcclxuXHJcbiAgICBpZiAobm9FbmVtaWVzTGVmdCkgcmV0dXJuICdhbGxpZXMnO1xyXG4gICAgaWYgKGVuZW15UmVhY2hlZExlZnRTaWRlKSByZXR1cm4gJ2VuZW1pZXMnO1xyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH1cclxuXHJcbiAgc2hvd0VuZEdhbWVXaW5kb3cod2lubmVyKSB7XHJcbiAgICAvLyB0aGlzLnN0YXRlLmlzUGF1c2VkID0gdHJ1ZTtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuaXNQYXVzZUdhbWUgPSB0cnVlO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2soKTtcclxuXHJcbiAgICBpZiAod2lubmVyID09PSAnYWxsaWVzJykge1xyXG4gICAgICAgIGNvbnN0IGlzTGFzdExldmVsID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwubGV2ZWxOdW1iZXIgPT09IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubnVtYmVyT2ZMZXZlbHMgLSAxO1xyXG4gICAgICAgIGlmIChpc0xhc3RMZXZlbCkge1xyXG4gICAgICAgICAgdGhpcy5leGl0QnV0dG9uLnggPSA0NTA7XHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCdHYW1lIG92ZXIuIFRoYW5rcyBmb3IgcGxheWluZyA6KScsIDI2MCAsIFt0aGlzLmV4aXRCdXR0b24sIHRoaXMuc3RhdGlzdGljQnV0dG9uXSk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmV4aXRCdXR0b24sIHRoaXMuc3RhdGlzdGljQnV0dG9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5leGl0QnV0dG9uLnggPSA0NTA7XHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCdZb3Ugd2luIScsIDQ5NSAsIFt0aGlzLm5leHRCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbl0pO1xyXG4gICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5uZXh0QnV0dG9uLCB0aGlzLmV4aXRCdXR0b24pO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgYm9udXNNb25leSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmxldmVsTnVtYmVyICogMiArIDE7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgKz0gYm9udXNNb25leTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5wYXN0TW9uZXkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5O1xyXG4gICAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5leGl0QnV0dG9uLnggPSA0NTA7XHJcbiAgICAgICAgdGhpcy5yZXBsYXlCdXR0b24ueCA9IDY1MDtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLnJlcGxheUJ1dHRvbiwgdGhpcy5leGl0QnV0dG9uKTtcclxuICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCdZb3UgbG9vc2UgOiggVHJ5IGFnYWluIScsIDM3MCAsIFt0aGlzLnJlcGxheUJ1dHRvbiwgdGhpcy5leGl0QnV0dG9uXSk7XHJcbiAgICB9XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2NlbmVzL2dhbWUuc2NlbmUuanNcbi8vIG1vZHVsZSBpZCA9IDI0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBCdXR0b24gZnJvbSAnLi4vY29udHJvbHMvYnV0dG9uJztcclxuaW1wb3J0IHBhcmFtZXRlcnNPZlVuaXRCdXR0b25zIGZyb20gJy4vcGFyYW1ldGVycy11bml0LWJ1dHRvbnMnO1xyXG5pbXBvcnQgVW5pdEZhY3RvcnkgZnJvbSAnLi4vdW5pdC1mYWN0b3J5L3VuaXQtZmFjdG9yeSc7XHJcbmltcG9ydCBRdWV1ZSBmcm9tICcuLi9xdWV1ZS9xdWV1ZSc7XHJcbmltcG9ydCBEaXJlY3Rpb24gZnJvbSAnLi4vdW5pdC9kaXJlY3Rpb24nO1xyXG5pbXBvcnQgc291bmRCdXR0b24gZnJvbSAnLi9wYXJhbWV0ZXJzLWhlbHAtYnV0dG9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xQYW5lbCB7XHJcbiAgICBjb25zdHJ1Y3RvcihzdGF0ZSwgZ2FtZUNhbnZhcykge1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcyA9IGdhbWVDYW52YXM7XHJcbiAgICAgICAgdGhpcy51bml0RmFjdG9yeSA9IFVuaXRGYWN0b3J5LmdldFNpbmdsZXRvbkluc3RhbmNlKCk7XHJcbiAgICAgICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZShzdGF0ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29udHJvbFBhbmVsKGxldmVsKSB7XHJcbiAgICAgICAgbGV2ZWwgPSBsZXZlbCA+IDQgPyA0IDogbGV2ZWw7IC8vIFRPRE86ID8/P1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IHBhcmFtZXRlcnNPZlVuaXRCdXR0b25zW2xldmVsXS5tYXAoYnV0dG9uUGFyYW0gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgIHg6IGJ1dHRvblBhcmFtLngsXHJcbiAgICAgICAgICAgICAgICB5OiBidXR0b25QYXJhbS55LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGJ1dHRvblBhcmFtLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBidXR0b25QYXJhbS5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBpY29uVXJsOiBidXR0b25QYXJhbS5pbWdVcmwsXHJcbiAgICAgICAgICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHRoaXMuY3JlYXRlVW5pdChidXR0b25QYXJhbS5uYW1lKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVVbml0KG5hbWUpIHtcclxuICAgICAgICBjb25zdCBhbGx5VW5pdCA9IHRoaXMudW5pdEZhY3RvcnkuY3JlYXRlKG5hbWUsIERpcmVjdGlvbi5yaWdodCk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5ID49IGFsbHlVbml0LmNvc3QpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leSAtPSBhbGx5VW5pdC5jb3N0O1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXVlLnF1ZXVlQWxseSh0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMsIGFsbHlVbml0KTtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLnB1c2goYWxseVVuaXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5kaWFsb2cuY2xvc2UoKTsgLy8gVE9ETzogbWIgbmVlZCB0byBtb3ZlXHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5pc1BhdXNlR2FtZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHN1YnNjcmliZSgpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayguLi50aGlzLmJ1dHRvbnMpO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29udHJvbC1wYW5lbC9jb250cm9sLXBhbmVsLmpzXG4vLyBtb2R1bGUgaWQgPSAyNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBwYXJhbWV0ZXJzT2ZVbml0QnV0dG9ucyA9IFtcclxuICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnd2l6YXJkJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogOTAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2Jsb2InLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2Jsb2IvYmxvYi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDE2MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAncm9ndWUnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3JvZ3VlL3JvZ3VlLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjMwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAzMDAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2JhbmRpdCcsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDM3MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogNDQwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnYmxvYicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvYmxvYi9ibG9iLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogOTAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9XHJcbiAgICBdLFxyXG4gICAgW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdibG9iJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9ibG9iL2Jsb2ItaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiA5MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMTYwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnYmxvYicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvYmxvYi9ibG9iLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogOTAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDE2MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAna25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjMwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnYmxvYicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvYmxvYi9ibG9iLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogOTAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDE2MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAna25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjMwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdyb2d1ZScsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvcm9ndWUvcm9ndWUtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAzMDAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9XHJcbiAgICBdXHJcbl07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBwYXJhbWV0ZXJzT2ZVbml0QnV0dG9ucztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb250cm9sLXBhbmVsL3BhcmFtZXRlcnMtdW5pdC1idXR0b25zLmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBzb3VuZEJ1dHRvbiA9IHtcclxuICAgICAgICBuYW1lOiAnc291bmQnLFxyXG4gICAgICAgIGZpcnN0VXJsOiAnaW1ncy9VSS9tdXNpYy1pY29uL3NvdW5kLW9uLnBuZycsXHJcbiAgICAgICAgc2Vjb25kVXJsOiAnaW1ncy9VSS9tdXNpYy1pY29uL3NvdW5kLW9mZi5wbmcnLFxyXG4gICAgICAgIHg6IDEwMjAsXHJcbiAgICAgICAgeTogNjAsXHJcbiAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgIGhlaWdodDogMzBcclxuICAgIH1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IHNvdW5kQnV0dG9uO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbnRyb2wtcGFuZWwvcGFyYW1ldGVycy1oZWxwLWJ1dHRvbi5qc1xuLy8gbW9kdWxlIGlkID0gMjdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9jb250cm9scy9idXR0b24nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnVmZk1hbmFnZXIge1xyXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsIGdhbWVDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMgPSBnYW1lQ2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLmJ1ZmZJZCA9IDA7XHJcblxyXG4gICAgICAgIHRoaXMuZnVsbFJlc2V0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQnV0dG9uKCkge1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucyA9IHRoaXMuZ2V0UGFyYW1ldGVyc09mQnVmZkJ1dHRvbigpLm1hcChidG4gPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICAgICAgICAgIHg6IGJ0bi54LFxyXG4gICAgICAgICAgICAgICAgeTogYnRuLnksXHJcbiAgICAgICAgICAgICAgICBoZWlnaHQ6IGJ0bi5oZWlnaHQsXHJcbiAgICAgICAgICAgICAgICB3aWR0aDogYnRuLndpZHRoLFxyXG4gICAgICAgICAgICAgICAgaWNvblVybDogYnRuLmljb25VcmwsXHJcbiAgICAgICAgICAgICAgICBjbGlja0hhbmRsZXI6IGJ0bi5jbGlja0hhbmRsZXJcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgaW1wcm92ZVdlYXBvbigpIHsgLy8gVE9ETzogcHJvYmxlbSB3aXRoIG11bHR5QnVmZlxyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5ID49IDMpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmZvckVhY2godW5pdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB1bml0LmRhbWFnZSsrO1xyXG4gICAgICAgICAgICAgICAgdW5pdC53ZWFwb25JZEJ1ZmYucHVzaCh0aGlzLmJ1ZmZJZCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy53ZWFwb25CdWZmcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmJ1ZmZJZCsrLFxyXG4gICAgICAgICAgICAgICAgd2VhcG9uU3RhcnQ6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjcsXHJcbiAgICAgICAgICAgICAgICBmYWRlSW46IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leSAtPSAzO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpbXByb3ZlQXJtb3IoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgPj0gNSkge1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMuZm9yRWFjaCh1bml0ID0+IHtcclxuICAgICAgICAgICAgICAgIHVuaXQuaGVhbHRoICs9IDU7XHJcbiAgICAgICAgICAgICAgICB1bml0LmFybW9ySWRCdWZmLnB1c2godGhpcy5idWZmSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXJtb3JCdWZmcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkOiB0aGlzLmJ1ZmZJZCxcclxuICAgICAgICAgICAgICAgIGFybW9yU3RhcnQ6IERhdGUubm93KCksXHJcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAwLjcsXHJcbiAgICAgICAgICAgICAgICBmYWRlSW46IGZhbHNlXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leSAtPSA1O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB3ZWFwb25SZXNldCgpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMuZm9yRWFjaCh1bml0ID0+IHtcclxuICAgICAgICAgICAgaWYgKHVuaXQud2VhcG9uSWRCdWZmLmxlbmd0aCAmJiB1bml0LndlYXBvbklkQnVmZlswXSA9PT0gdGhpcy53ZWFwb25CdWZmc1swXS5pZCkge1xyXG4gICAgICAgICAgICAgICAgdW5pdC5kYW1hZ2UtLTtcclxuICAgICAgICAgICAgICAgIHVuaXQud2VhcG9uSWRCdWZmLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy53ZWFwb25CdWZmcy5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFybW9yUmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmZvckVhY2godW5pdCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1bml0LmFybW9ySWRCdWZmLmxlbmd0aCAmJiB1bml0LmFybW9ySWRCdWZmWzBdID09PSB0aGlzLmFybW9yQnVmZnNbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh1bml0LmhlYWx0aCA+IDUpIHVuaXQuaGVhbHRoIC09IDU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIHVuaXQuaGVhbHRoID0gMTtcclxuXHJcbiAgICAgICAgICAgICAgICB1bml0LmFybW9ySWRCdWZmLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5hcm1vckJ1ZmZzLnNoaWZ0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVsbFJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMud2VhcG9uQnVmZnMgPSBbXTtcclxuICAgICAgICB0aGlzLmFybW9yQnVmZnMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVUaW1lKCkge1xyXG4gICAgICAgIGlmICh0aGlzLndlYXBvbkJ1ZmZzLmxlbmd0aCkge1xyXG4gICAgICAgICAgICBjb25zdCBwYXNzZWRXZWFwb25UaW1lID0gRGF0ZS5ub3coKSAtIHRoaXMud2VhcG9uQnVmZnNbMF0ud2VhcG9uU3RhcnQ7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZEdXJhdGlvbiA9IDMwMDAwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHBhc3NlZFdlYXBvblRpbWUgPiBidWZmRHVyYXRpb24pIHRoaXMud2VhcG9uUmVzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMud2VhcG9uQnVmZnMuZm9yRWFjaChidWZmID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRlbHRhID0gYnVmZi5mYWRlSW4gPyAwLjAxIDogLTAuMDE7XHJcbiAgICAgICAgICAgICAgICBidWZmLm9wYWNpdHkgKz0gZGVsdGE7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVmZi5vcGFjaXR5IDwgMC4xKSBidWZmLmZhZGVJbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChidWZmLm9wYWNpdHkgPiAwLjcpIGJ1ZmYuZmFkZUluID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuYXJtb3JCdWZmcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgcGFzc2VkQXJtb3JUaW1lID0gRGF0ZS5ub3coKSAtIHRoaXMuYXJtb3JCdWZmc1swXS5hcm1vclN0YXJ0O1xyXG4gICAgICAgICAgICBjb25zdCBidWZmRHVyYXRpb24gPSAyMDAwMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXNzZWRBcm1vclRpbWUgPiBidWZmRHVyYXRpb24pIHRoaXMuYXJtb3JSZXNldCgpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5hcm1vckJ1ZmZzLmZvckVhY2goYnVmZiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWx0YSA9IGJ1ZmYuZmFkZUluID8gMC4wMTUgOiAtMC4wMTU7XHJcbiAgICAgICAgICAgICAgICBidWZmLm9wYWNpdHkgKz0gZGVsdGE7XHJcbiAgICAgICAgICAgICAgICBpZiAoYnVmZi5vcGFjaXR5IDwgMC4xKSBidWZmLmZhZGVJbiA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmIChidWZmLm9wYWNpdHkgPiAwLjcpIGJ1ZmYuZmFkZUluID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzdWJzY3JpYmUoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2soLi4udGhpcy5idXR0b25zKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IGJ1dHRvbi5yZW5kZXIodGhpcy5nYW1lQ2FudmFzLmNvbnRleHQpKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZm9udCA9ICcyMnB4IFBpeGVsYXRlJztcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnJDMnLCA1MCwgMTQwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnJDUnLCA1MCwgMjEwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHdlYXBvbkJ0biA9IHRoaXMuYnV0dG9uc1swXTtcclxuICAgICAgICB0aGlzLndlYXBvbkJ1ZmZzLmZvckVhY2goKGJ1ZmYsIHBvc2l0aW9uKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnNhdmUoKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSBidWZmLm9wYWNpdHk7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1ZmZYUG9zaXRpb24gPSB3ZWFwb25CdG4ueCArIDcwICogKHBvc2l0aW9uICsgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh3ZWFwb25CdG4uaWNvbiwgYnVmZlhQb3NpdGlvbiwgd2VhcG9uQnRuLnkpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnN0IGFybW9yQnRuID0gdGhpcy5idXR0b25zWzFdO1xyXG4gICAgICAgIHRoaXMuYXJtb3JCdWZmcy5mb3JFYWNoKChidWZmLCBwb3NpdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gYnVmZi5vcGFjaXR5O1xyXG4gICAgICAgICAgICBjb25zdCBidWZmWFBvc2l0aW9uID0gYXJtb3JCdG4ueCArIDcwICogKHBvc2l0aW9uICsgMSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZShhcm1vckJ0bi5pY29uLCBidWZmWFBvc2l0aW9uLCBhcm1vckJ0bi55KTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucmVzdG9yZSgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBhcmFtZXRlcnNPZkJ1ZmZCdXR0b24oKSB7XHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FybScsIGljb25Vcmw6ICdpbWdzL2J1ZmYtaWNvbi9hcm0ucG5nJyxcclxuICAgICAgICAgICAgICAgIHg6IDIwLCB5OiA5MCwgd2lkdGg6IDMwLCBoZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLmltcHJvdmVXZWFwb24oKVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYXJtb3InLCBpY29uVXJsOiAnaW1ncy9idWZmLWljb24vYXJtb3IucG5nJyxcclxuICAgICAgICAgICAgICAgIHg6IDIwLCB5OiAxNjAsIHdpZHRoOiAzMCwgaGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4gdGhpcy5pbXByb3ZlQXJtb3IoKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgXTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2J1ZmYtbWFuYWdlci9idWZmLW1hbmFnZXIuanNcbi8vIG1vZHVsZSBpZCA9IDI4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBCdXR0b24gZnJvbSAnLi4vY29udHJvbHMvYnV0dG9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11c2ljIHtcclxuICAgIGNvbnN0cnVjdG9yKGdhbWVDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMgPSBnYW1lQ2FudmFzO1xyXG4gICAgICAgIHRoaXMuY291bnRlciA9IDA7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkTXVzaWMoKSB7XHJcbiAgICAgICAgdGhpcy5tdXNpYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhdWRpb1wiKTtcclxuICAgICAgICB0aGlzLm11c2ljLnNyYyA9ICdtdXNpYy9iYWNrZ3JvdW5kLW11c2ljLndhdic7XHJcbiAgICAgICAgdGhpcy5tdXNpYy5zZXRBdHRyaWJ1dGUoXCJwcmVsb2FkXCIsIFwiYXV0b1wiKTtcclxuICAgICAgICB0aGlzLm11c2ljLnNldEF0dHJpYnV0ZShcImNvbnRyb2xzXCIsIFwibm9uZVwiKTtcclxuICAgICAgICB0aGlzLm11c2ljLnNldEF0dHJpYnV0ZShcImxvb3BcIiwgXCJ0cnVlXCIpO1xyXG4gICAgICAgIHRoaXMubXVzaWMuc3R5bGUuZGlzcGxheSA9IFwibm9uZVwiO1xyXG4gICAgICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC41O1xyXG5cclxuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMubXVzaWMpO1xyXG5cclxuICAgICAgICB0aGlzLm11c2ljLnBsYXkoKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuYnV0dG9uLmljb24sIHRoaXMuYnV0dG9uLngsIHRoaXMuYnV0dG9uLnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgY29uc3QgbXVzaWNPbiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIG11c2ljT24uc3JjID0gJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1vbi5wbmcnO1xyXG5cclxuICAgICAgICBjb25zdCBtdXNpY0hhbGZPbiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIG11c2ljSGFsZk9uLnNyYyA9ICdpbWdzL1VJL211c2ljLWljb24vc291bmQtaGFsZi1vbi5wbmcnO1xyXG5cclxuICAgICAgICBjb25zdCBtdXNpY09mZiA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIG11c2ljT2ZmLnNyYyA9ICdpbWdzL1VJL211c2ljLWljb24vc291bmQtb2ZmLnBuZyc7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBbbXVzaWNPbiwgbXVzaWNIYWxmT24sIG11c2ljT2ZmXTtcclxuXHJcbiAgICAgICAgdGhpcy5idXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICAgICAgeDogOTUwLFxyXG4gICAgICAgICAgICB5OiAxMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgd2lkdGg6IDQwLFxyXG4gICAgICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHRoaXMudG9nZ2xlKClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5idXR0b24uaWNvbiA9IHRoaXMuc3RhdGVbdGhpcy5jb3VudGVyXTtcclxuICAgICAgICB0aGlzLmFkZE11c2ljKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlKCkge1xyXG4gICAgICAgIHRoaXMuY291bnRlciA9ICsrdGhpcy5jb3VudGVyICUgMztcclxuICAgICAgICB0aGlzLmJ1dHRvbi5pY29uID0gdGhpcy5zdGF0ZVt0aGlzLmNvdW50ZXJdO1xyXG4gICAgICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC41IC0gdGhpcy5jb3VudGVyIC8gNDtcclxuICAgIH1cclxuXHJcbiAgICBzdWJzY3JpYmUoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5idXR0b24pO1xyXG4gICAgfVxyXG5cclxuICAgIHVuc3Vic2NyaWJlKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKHRoaXMuYnV0dG9uKTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL211c2ljL211c2ljLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTY2VuZUJhc2UgfSBmcm9tIFwiLi9zY2VuZS5iYXNlXCI7XHJcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi4vZGlhbG9nL2RpYWxvZyc7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vY29udHJvbHMvYnV0dG9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0YXRpc3RpYyBleHRlbmRzIFNjZW5lQmFzZSB7IC8vIFRPRE86IHJlbmFtZVxyXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKSB7XHJcbiAgICAgICAgc3VwZXIoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuICAgICAgICB0aGlzLmRpYWxvZyA9IG5ldyBEaWFsb2coZ2FtZUNhbnZhcy5jb250ZXh0KTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTdGF0ZSh0aW1lc3RhbXApIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYztcclxuICAgICAgICBpZiAoIXN0YXRlLnNwZW50VGltZSkge1xyXG4gICAgICAgICAgICBzdGF0ZS5zcGVudFRpbWUgPSAodGltZXN0YW1wIC8gNjAwMDApLnRvRml4ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2Uoc3RhdGUuYmFja2dyb3VuZCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdTdGF0aXN0aWNzJywgNDgwLCAxMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdUaW1lIHNwZW50JywgMTgwLCAyMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLnNwZW50VGltZX0gbWludXRlc2AsIDc1MCwgMjAwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnTGV2ZWxzIGZhaWxlZCcsIDE4MCwgMjUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtzdGF0ZS51bnN1Y2Nlc3NmdWxBdHRlbXB0c30gbGV2ZWxzYCwgNzUwLCAyNTApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdUb3RhbCBkYW1hZ2UnLCAxODAsIDMwMCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7c3RhdGUueW91ckRhbWFnZX0gZG1nYCwgNzUwLCAzMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdUb3RhbCByZWNlaXZlZCBkYW1hZ2UnLCAxODAsIDM1MCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7c3RhdGUucmVjZWl2ZWREYW1hZ2V9IGRtZ2AsIDc1MCwgMzUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnTW9uZXkgZWFybmVkJywgMTgwLCA0MDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLmVhcm5lZE1vbmV5fSAkYCwgNzUwLCA0MDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdUb3RhbCBocCBoZWFsZWQnLCAxODAsIDQ1MCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7c3RhdGUuaGVhbGVkSHB9IGhwYCwgNzUwLCA0NTApO1xyXG5cclxuICAgICAgICB0aGlzLmRpYWxvZy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgICAgIHRoaXMuYmFja2dyb3VuZC5zcmMgPSAnLi9pbWdzL2JhY2tncm91bmRzL2JhY2tncm91bmQtc3RhdGlzdGljLmpwZyc7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmJhY2tncm91bmQgPSB0aGlzLmJhY2tncm91bmQ7XHJcblxyXG4gICAgICAgIHRoaXMuZXhpdEJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgICAgICB4OiA1NTAsXHJcbiAgICAgICAgICAgIHk6IDUwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA3MyxcclxuICAgICAgICAgICAgd2lkdGg6IDYxLFxyXG4gICAgICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9leGl0LnBuZycsXHJcbiAgICAgICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2V4aXQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuaW5zdGFuY2UuaW5pdGlhbGl6ZSgwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lmluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tdXNpYy5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKC4uLnRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmJ1dHRvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlT25DbGljaygpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmV4aXRCdXR0b24pO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2NlbmVzL3N0YXRpc3RpYy5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==