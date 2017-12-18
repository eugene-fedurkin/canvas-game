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
        background: './imgs/backgrounds/game.png',
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
        background: './imgs/backgrounds/game.png',
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
        background: './imgs/backgrounds/game.png',
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
        background: './imgs/backgrounds/game.png',
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
        background: './imgs/backgrounds/game.png',
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
        background: './imgs/backgrounds/game.png',
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
                timeSpent: 0,
                levelsFailed: 0,
                totalDamage: 0,
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
          this.state.scenes.statistic.levelsFailed++;
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
          this.state.scenes.statistic.levelsFailed++;
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
                name: 'arm', iconUrl: 'imgs/buff-icon/weapon.png',
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




class StatisticScene extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* SceneBase */] { // TODO: rename
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


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTBkNDU5N2Y2NzUzMDc1ZTZmZTkiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvc3ByaXRlLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0L3VuaXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xzL2J1dHRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdC9kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQtZmFjdG9yeS91bml0LWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVldWUvcXVldWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9zY2VuZS5iYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9sZXZlbHMvbGV2ZWxzLmpzIiwid2VicGFjazovLy8uL3NyYy9mbG9hdGluZy10ZXh0L2Zsb2F0aW5nLXRleHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpYWxvZy9kaWFsb2cuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUtY2FudmFzL2dhbWUtY2FudmFzLmpzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS9zdGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvc3ByaXRlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMva25pZ2h0L2tuaWdodC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL3JvZ3VlL3JvZ3VlLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0cy9ibG9iL2Jsb2IuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL3dpemFyZC93aXphcmQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL2JhbmRpdC9iYW5kaXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3N0YXRlL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL21lbnUuc2NlbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9nYW1lLnNjZW5lLmpzIiwid2VicGFjazovLy8uL3NyYy9jb250cm9sLXBhbmVsL2NvbnRyb2wtcGFuZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2wtcGFuZWwvcGFyYW1ldGVycy11bml0LWJ1dHRvbnMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2wtcGFuZWwvcGFyYW1ldGVycy1oZWxwLWJ1dHRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYnVmZi1tYW5hZ2VyL2J1ZmYtbWFuYWdlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbXVzaWMvbXVzaWMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NjZW5lcy9zdGF0aXN0aWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7OztBQzdEQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0EsOEJBQThCLFdBQVc7QUFDekM7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCOztBQUVqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUEsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsQzs7Ozs7Ozs7O0FDOU1BO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsb0U7Ozs7Ozs7Ozs7Ozs7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGtFOzs7Ozs7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSxhQUFhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlFOzs7Ozs7OztBQ3pIQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQSxzREFBc0Qsa0JBQWtCO0FBQ3hFO0FBQ0EsYUFBYTtBQUNiLHlEQUF5RCxrQkFBa0I7QUFDM0U7QUFDQSxhQUFhO0FBQ2IscURBQXFELGtCQUFrQjtBQUN2RTtBQUNBO0FBQ0EscUNBQXFDLGVBQWU7QUFDcEQ7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7O0FDbkRzQjtBQUNOO0FBQ0k7QUFDQTtBQUNwQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wsQzs7Ozs7OztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUM7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDOzs7Ozs7Ozs7Ozs7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSx3Q0FBd0M7QUFDeEM7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7OztBQ2xFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esc0RBQXNELGVBQWU7QUFDckU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxzREFBc0QsZUFBZTtBQUNyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLHdEQUF3RCxlQUFlO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxxREFBcUQsZUFBZTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7O0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUNQQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtEQUFrRCxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esa0RBQWtELGVBQWU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxvREFBb0QsZUFBZTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsaURBQWlELGVBQWU7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEM7Ozs7Ozs7Ozs7O0FDMURBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtFQUFrRSxlQUFlO0FBQ2pGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsaUVBQWlFLGVBQWU7QUFDaEY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxvRUFBb0UsZUFBZTtBQUNuRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGlFQUFpRSxlQUFlO0FBQ2hGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxDOzs7Ozs7Ozs7OztBQ3pEQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0QsZUFBZTtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLCtDQUErQyxlQUFlO0FBQzlEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esa0RBQWtELGVBQWU7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxpREFBaUQsZUFBZTtBQUNoRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDLGVBQWU7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSw4Q0FBOEMsZUFBZTtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGdEQUFnRCxlQUFlO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsK0NBQStDLGVBQWU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtEQUFrRCxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsaURBQWlELGVBQWU7QUFDaEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxvREFBb0QsZUFBZTtBQUNuRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0EsbURBQW1ELGVBQWU7QUFDbEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLGtEQUFrRCxlQUFlO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7O0FDeklBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrREFBa0QsZUFBZTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBLGlEQUFpRCxlQUFlO0FBQ2hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0Esb0RBQW9ELGVBQWU7QUFDbkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQSxtREFBbUQsZUFBZTtBQUNsRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsQzs7Ozs7Ozs7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsbUU7Ozs7Ozs7Ozs7QUNOb0I7QUFDcEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPLDhFQUE4RTtBQUNyRixPQUFPO0FBQ1A7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvR29CO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBGQUFrQztBQUNsQzs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLHlDQUF5Qyw2QkFBNkI7QUFDdEUsd0NBQXdDLG1DQUFtQyxHQUFHLHlCQUF5QjtBQUN2Rzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEs7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7Ozs7Ozs7QUN2U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxzQ0FBc0M7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLFNBQVM7QUFDVDs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDOzs7Ozs7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsa0Y7Ozs7Ozs7QUNyTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHVGOzs7Ozs7OztBQ1ZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQSxTQUFTO0FBQ1Q7O0FBRUEscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7O0FBRWI7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxTQUFTOztBQUVUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQzs7Ozs7Ozs7OztBQ3ZLQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7O0FBRVQ7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEM7Ozs7Ozs7Ozs7OztBQ2hFb0I7QUFDcEI7QUFDQTs7QUFFQSw2RkFBdUQ7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDLGdCQUFnQjtBQUM1RDtBQUNBLDRDQUE0QyxtQkFBbUI7QUFDL0Q7QUFDQSw0Q0FBNEMsa0JBQWtCO0FBQzlEO0FBQ0EsNENBQTRDLHFCQUFxQjtBQUNqRTtBQUNBLDRDQUE0QyxrQkFBa0I7QUFDOUQ7QUFDQSw0Q0FBNEMsZUFBZTs7QUFFM0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMSk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMTBkNDU5N2Y2NzUzMDc1ZTZmZTkiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGUge1xyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIGlmICghb3B0aW9ucykgdGhyb3cgbmV3IEVycm9yKCdObyBzcHJpdGUgb3B0aW9ucycpO1xyXG5cclxuICAgIHRoaXMuaW1hZ2UgPSBuZXcgSW1hZ2UoKTtcclxuICAgIHRoaXMuaW1hZ2Uuc3JjID0gb3B0aW9ucy51cmw7XHJcblxyXG4gICAgdGhpcy5mcmFtZVdpZHRoID0gb3B0aW9ucy5mcmFtZVdpZHRoO1xyXG4gICAgdGhpcy5mcmFtZUhlaWdodCA9IG9wdGlvbnMuZnJhbWVIZWlnaHQ7XHJcbiAgICB0aGlzLm51bWJlck9mRnJhbWVzID0gb3B0aW9ucy5udW1iZXJPZkZyYW1lcztcclxuICAgIHRoaXMudGltZVRvRnJhbWUgPSBvcHRpb25zLnRpbWVUb0ZyYW1lIHx8IDEwMDtcclxuICAgIHRoaXMueE9mZnNldCA9IG9wdGlvbnMueE9mZnNldCB8fCAwO1xyXG4gICAgdGhpcy5hdHRhY2tYT2Zmc2V0ID0gb3B0aW9ucy5hdHRhY2tYT2Zmc2V0IHx8IDA7XHJcbiAgICB0aGlzLmJvZHlYT2Zmc2V0ID0gb3B0aW9ucy5ib2R5WE9mZnNldDtcclxuICAgIFxyXG4gICAgdGhpcy5wcmVsb2FkZXIgPSBvcHRpb25zLnByZWxvYWRlcjtcclxuICAgIC8vIGlmICh0aGlzLnByZWxvZGVyKSB0aGlzLnByZWxvYWRlci5sb2FkKHRoaXMuaW1hZ2UpO1xyXG4gICAgLy8gWSBvZmZzZXRcclxuICAgIFxyXG4gICAgdGhpcy5jdXJyZW50VGljayA9IDA7XHJcbiAgICB0aGlzLmN1cnJlbnRJbWFnZUluZGV4ID0gMDtcclxuICB9XHJcblxyXG4gIHRpY2sodGltZXN0YW1wLCBwcmV2VGltZXN0YW1wKSB7XHJcbiAgICB0aGlzLmN1cnJlbnRUaWNrICs9IE51bWJlcigodGltZXN0YW1wIC0gcHJldlRpbWVzdGFtcCkudG9GaXhlZCgyKSk7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50VGljayA+IHRoaXMudGltZVRvRnJhbWUgKiB0aGlzLmN1cnJlbnRJbWFnZUluZGV4KSB7XHJcbiAgICAgIHRoaXMubmV4dEZyYW1lKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZXh0RnJhbWUoKSB7XHJcbiAgICBpZiAodGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9PT0gdGhpcy5udW1iZXJPZkZyYW1lcyAtIDEpIHtcclxuICAgICAgdGhpcy5yZXNldCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCsrO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgZ2V0RnJhbWVYKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZnJhbWVXaWR0aCAqIHRoaXMuY3VycmVudEltYWdlSW5kZXg7XHJcbiAgfVxyXG5cclxuICByZXNldCgpIHtcclxuICAgIHRoaXMuY3VycmVudFRpY2sgPSAwO1xyXG4gICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9IDA7XHJcbiAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdC9zcHJpdGUuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi9hY3Rpb25zJztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuL3Nwcml0ZSc7XHJcbmltcG9ydCBTcHJpdGVzIGZyb20gJy4vc3ByaXRlcyc7XHJcbmltcG9ydCBEaXJlY3Rpb24gZnJvbSAnLi9kaXJlY3Rpb24nO1xyXG5pbXBvcnQgRmxvYXRpbmdUZXh0IGZyb20gJy4uL2Zsb2F0aW5nLXRleHQvZmxvYXRpbmctdGV4dCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbml0IHtcclxuICAgIGNvbnN0cnVjdG9yKHVuaXRJbmZvKSB7XHJcbiAgICAgICAgaWYgKCF1bml0SW5mbykgdGhyb3cgbmV3IEVycm9yKCdObyB1bml0IGluZm8nKTtcclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IHVuaXRJbmZvLmlkO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoID0gdW5pdEluZm8uaGVhbHRoO1xyXG4gICAgICAgIHRoaXMuZGFtYWdlID0gdW5pdEluZm8uZGFtYWdlO1xyXG4gICAgICAgIHRoaXMucmFuZ2VBdHRhY2sgPSB1bml0SW5mby5yYW5nZUF0dGFjayB8fCAwOyAvLyBUT0RPOiBjaGFuZ2UhXHJcbiAgICAgICAgdGhpcy5pZGxlVGltZSA9IHVuaXRJbmZvLmlkbGVUaW1lIHx8IDIwMDA7XHJcbiAgICAgICAgdGhpcy5hdHRhY2tUaW1lID0gdW5pdEluZm8uYXR0YWNrVGltZTtcclxuICAgICAgICB0aGlzLnRpbWVUb0hpdCA9IHVuaXRJbmZvLnRpbWVUb0hpdDtcclxuICAgICAgICB0aGlzLmRlYXRoVGltZSA9IHVuaXRJbmZvLmRlYXRoVGltZTtcclxuICAgICAgICB0aGlzLnN0ZXBTaXplID0gdW5pdEluZm8uc3RlcFNpemU7XHJcbiAgICAgICAgdGhpcy5kaXJlY3Rpb24gPSB1bml0SW5mby5kaXJlY3Rpb247XHJcbiAgICAgICAgdGhpcy5yZW5kZXIgPSB7IC8vIFRPRE86IG1iIHVzZWxlc3NcclxuICAgICAgICAgICAgd2lkdGg6IHVuaXRJbmZvLndpZHRoLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHVuaXRJbmZvLmhlaWdodCxcclxuICAgICAgICAgICAgZnVsbFdpZHRoOiB1bml0SW5mby5mdWxsV2lkdGhcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMgPSBuZXcgU3ByaXRlcygpO1xyXG4gICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0ID0gRmxvYXRpbmdUZXh0LmdldFNpbmdsZXRvbkluc3RhbmNlKCk7XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyc1VuaXQgPSB0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLnJpZ2h0IFxyXG4gICAgICAgICAgICA/IHRydWVcclxuICAgICAgICAgICAgOiBmYWxzZTtcclxuICAgICAgICB0aGlzLndlYXBvbklkQnVmZiA9IFtdO1xyXG4gICAgICAgIHRoaXMuYXJtb3JJZEJ1ZmYgPSBbXTtcclxuICAgICAgICB0aGlzLndhc0hpdCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IG51bGw7XHJcbiAgICAgICAgdGhpcy54ID0gbnVsbDtcclxuICAgICAgICB0aGlzLnkgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEN1cnJlbnRTcHJpdGUoKSB7XHJcbiAgICAgICAgc3dpdGNoICh0aGlzLmN1cnJlbnRBY3Rpb24pIHtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLnN0ZXA6IHJldHVybiB0aGlzLnNwcml0ZXMud2FsaztcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLmF0dGFjazogcmV0dXJuIHRoaXMuc3ByaXRlcy5hdHRhY2s7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9ucy5kaWU6IHJldHVybiB0aGlzLnNwcml0ZXMuZGllO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiByZXR1cm4gdGhpcy5zcHJpdGVzLmlkbGU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRvQWN0aW9uKHN0YXRlLCB0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAodGhpcy5oZWFsdGggPD0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLmRpZShzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudEFjdGlvbiA9PT0gQWN0aW9ucy5pZGxlXHJcbiAgICAgICAgICAgICYmIHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPCB0aGlzLmlkbGVUaW1lKSB7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZBbGx5KHN0YXRlKSB8fCBzdGF0ZS5pc1BhdXNlR2FtZSBcclxuICAgICAgICAgICAgfHwgdGhpcy5pc0luRnJvbnRPZkVuZW15KHN0YXRlKSAmJiB0aGlzLmlzRW5lbXlEeWluZyhzdGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5pZGxlKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luRnJvbnRPZkVuZW15KHN0YXRlKSkge1xyXG4gICAgICAgICAgICB0aGlzLmF0dGFjayhzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnN0ZXAoc3RhdGUsIHRpbWVzdGFtcCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vI3JlZ2lvbiBhY3Rpb25zXHJcblxyXG4gICAgc3RlcChzdGF0ZSwgdGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5zdGVwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IEFjdGlvbnMuc3RlcDtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuZGlyZWN0aW9uID09PSBEaXJlY3Rpb24ucmlnaHQpIHtcclxuICAgICAgICAgICAgdGhpcy54ICs9IHRoaXMuc3RlcFNpemU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy54IC09IHRoaXMuc3RlcFNpemU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlkbGUoc3RhdGUsIHRpbWVzdGFtcCkge1xyXG4gICAgICAgIGlmICh0aGlzLmN1cnJlbnRBY3Rpb24gIT09IEFjdGlvbnMuaWRsZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBBY3Rpb25zLmlkbGU7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlLnJlc2V0KCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlWShzdGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGF0dGFjayhzdGF0ZSwgdGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5hdHRhY2spIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gQWN0aW9ucy5hdHRhY2s7XHJcbiAgICAgICAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgICAgICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sucmVzZXQoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiB0aGlzLnRpbWVUb0hpdCAmJiAhdGhpcy53YXNIaXQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGxheWVyc1VuaXQpIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLmhlYWx0aCAtPSB0aGlzLmRhbWFnZTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvblggPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS54IFxyXG4gICAgICAgICAgICAgICAgICAgICsgc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0uZ2V0Q3VycmVudFNwcml0ZSgpLmJvZHlYT2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5kYW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YOiBwb3NpdGlvblgsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZOiBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS55LFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGlvbjogQWN0aW9ucy5hdHRhY2ssXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmluc3RhbmNlLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMudG90YWxEYW1hZ2UrKztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0uaGVhbHRoIC09IHRoaXMuZGFtYWdlO1xyXG5cclxuICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uWCA9IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0ueCBcclxuICAgICAgICAgICAgICAgICAgICArIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0uZ2V0Q3VycmVudFNwcml0ZSgpLmJvZHlYT2Zmc2V0XHJcbiAgICAgICAgICAgICAgICAgICAgKyBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdLmdldEN1cnJlbnRTcHJpdGUoKS54T2Zmc2V0O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogdGhpcy5kYW1hZ2UsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25YOiBwb3NpdGlvblgsXHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25ZOiBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdLnksXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLmF0dGFjayxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgc3RhdGUuaW5zdGFuY2Uuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYy5yZWNlaXZlZERhbWFnZSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMud2FzSGl0ID0gdHJ1ZTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiB0aGlzLmF0dGFja1RpbWUgJiYgdGhpcy53YXNIaXQpIHtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgdGhpcy53YXNIaXQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGllKHN0YXRlLCB0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QWN0aW9uICE9PSBBY3Rpb25zLmRpZSkge1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBBY3Rpb25zLmRpZTtcclxuICAgICAgICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcclxuICAgICAgICAgICAgdGhpcy5zcHJpdGVzLmRpZS5yZXNldCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVkoc3RhdGUpO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGltZXN0YW1wIC0gdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA+IHRoaXMuZGVhdGhUaW1lKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBib251c01vbmV5ID0gTWF0aC5mbG9vcihzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS5jb3N0IC8gMik7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvblggPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS54IFxyXG4gICAgICAgICAgICAgICAgKyBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdLmdldEN1cnJlbnRTcHJpdGUoKS5mcmFtZVdpZHRoIC8gMjtcclxuXHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5tb25leSArPSBib251c01vbmV5O1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogYCQke2JvbnVzTW9uZXl9YCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblg6IHBvc2l0aW9uWCxcclxuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblk6IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLnksXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLmRpZSxcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgIHN0YXRlLmluc3RhbmNlLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMuZWFybmVkTW9uZXkgKz0gYm9udXNNb25leTtcclxuICAgICAgICAgICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzLnNoaWZ0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8jZW5kcmVnaW9uXHJcbiAgICAvLyNyZWdpb24gaGVscGVyc1xyXG5cclxuICAgIGlzSW5Gcm9udE9mRW5lbXkoc3RhdGUpIHsgLy8gVE9ETzogcmV3cml0ZSBtYj9cclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzVW5pdCkge1xyXG4gICAgICAgICAgICBjb25zdCBvcHBvbmVudCA9IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdO1xyXG4gICAgICAgICAgICByZXR1cm4gb3Bwb25lbnQgJiYgdGhpcy54ICsgdGhpcy5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXQgKyB0aGlzLnJhbmdlQXR0YWNrID49IG9wcG9uZW50LnggKyBvcHBvbmVudC5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXQ7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qgb3Bwb25lbnQgPSBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdO1xyXG4gICAgICAgICAgICByZXR1cm4gb3Bwb25lbnQgJiYgdGhpcy54ICsgdGhpcy5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXQgLSB0aGlzLnJhbmdlQXR0YWNrIDw9IG9wcG9uZW50LnggKyBvcHBvbmVudC5nZXRDdXJyZW50U3ByaXRlKCkuYm9keVhPZmZzZXQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlzRW5lbXlEeWluZyhzdGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSByZXR1cm4gc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0uaGVhbHRoIDw9IDA7XHJcbiAgICAgICAgZWxzZSByZXR1cm4gc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXS5oZWFsdGggPD0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBnZXRDZW50ZXJPZkJvZHkoKSB7XHJcbiAgICAvLyAgICAgcmV0dXJuIHRoaXMuXHJcbiAgICAvLyAgICAgdGhpcy54ICsgdGhpcy5nZXRDdXJyZW50U3ByaXRlKCkuZnJhbWVXaWR0aCArIHRoaXMuZ2V0Q3VycmVudFNwcml0ZSgpLmF0dGFja1hPZmZzZXRcclxuICAgIC8vIH1cclxuXHJcbiAgICBpc0luRnJvbnRPZkFsbHkoc3RhdGUpIHtcclxuICAgICAgICBpZiAodGhpcy5wbGF5ZXJzVW5pdCkge1xyXG4gICAgICAgICAgICBjb25zdCBuZXh0QWxseSA9IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbdGhpcy5nZXRVbml0UG9zaXRpb24oc3RhdGUpIC0gMV07XHJcbiAgICAgICAgICAgIHJldHVybiBuZXh0QWxseSAmJiB0aGlzLnggKyB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5mcmFtZVdpZHRoID49IG5leHRBbGx5Lng7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbmV4dEFsbHkgPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1t0aGlzLmdldFVuaXRQb3NpdGlvbihzdGF0ZSkgLSAxXTtcclxuICAgICAgICAgICAgcmV0dXJuIG5leHRBbGx5ICYmIHRoaXMueCA8PSBuZXh0QWxseS54ICsgbmV4dEFsbHkuZ2V0Q3VycmVudFNwcml0ZSgpLmZyYW1lV2lkdGg7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGdldFVuaXRQb3NpdGlvbihzdGF0ZSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNVbml0XHJcbiAgICAgICAgICAgID8gc3RhdGUuY3VycmVudExldmVsLmFsbGllcy5maW5kSW5kZXgoYWxseSA9PiBhbGx5LmlkID09PSB0aGlzLmlkKVxyXG4gICAgICAgICAgICA6IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzLmZpbmRJbmRleChlbmVteSA9PiBlbmVteS5pZCA9PT0gdGhpcy5pZCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlWShzdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHVuaXRIZWlnaHQgPSB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5mcmFtZUhlaWdodDtcclxuICAgICAgICB0aGlzLnkgPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZ3JvdW5kTGV2ZWxZIC0gdW5pdEhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICAvLyNlbmRyZWdpb25cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvdW5pdC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBCdXR0b24ge1xyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgICAgIGlmICghb3B0aW9ucykgdGhyb3cgbmV3IEVycm9yKCdCdXR0b24gb3B0aW9ucyBtaXNzaW5nJyk7XHJcblxyXG4gICAgICAgIHRoaXMueCA9IG9wdGlvbnMueDtcclxuICAgICAgICB0aGlzLnkgPSBvcHRpb25zLnk7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBvcHRpb25zLmhlaWdodDtcclxuICAgICAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aDtcclxuICAgICAgICB0aGlzLmljb25VcmwgPSBvcHRpb25zLmljb25Vcmw7XHJcbiAgICAgICAgdGhpcy5jbGlja0hhbmRsZXIgPSBvcHRpb25zLmNsaWNrSGFuZGxlcjtcclxuXHJcbiAgICAgICAgaWYgKG9wdGlvbnMuaWNvblVybCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldEljb24ob3B0aW9ucy5pY29uVXJsKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLmljb24gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBzZXRJY29uKHVybCkge1xyXG4gICAgICAgIGNvbnN0IGljb24gPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBpY29uLnNyYyA9IHVybDtcclxuICAgICAgICB0aGlzLmljb24gPSBpY29uO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcihjb250ZXh0KSB7XHJcbiAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5pY29uLCB0aGlzLngsIHRoaXMueSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb250cm9scy9idXR0b24uanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgRGlyZWN0aW9uID0ge1xyXG4gIGxlZnQ6ICdsZWZ0JyxcclxuICByaWdodDogJ3JpZ2h0J1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRGlyZWN0aW9uO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvZGlyZWN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBTa2VsZXRvbiBmcm9tICcuLi91bml0cy9za2VsZXRvbi9za2VsZXRvbic7XHJcbmltcG9ydCBLbmlnaHQgZnJvbSAnLi4vdW5pdHMva25pZ2h0L2tuaWdodCc7XHJcbmltcG9ydCBDb3VudHJ5S25pZ2h0IGZyb20gJy4uL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0JztcclxuaW1wb3J0IFJvZ3VlIGZyb20gJy4uL3VuaXRzL3JvZ3VlL3JvZ3VlJztcclxuaW1wb3J0IEJsb2IgZnJvbSAnLi4vdW5pdHMvYmxvYi9ibG9iJztcclxuaW1wb3J0IFdpemFyZCBmcm9tICcuLi91bml0cy93aXphcmQvd2l6YXJkJztcclxuaW1wb3J0IEJhbmRpdCBmcm9tICcuLi91bml0cy9iYW5kaXQvYmFuZGl0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaXRGYWN0b3J5IHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHRoaXMuaWQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXRpYyBnZXRTaW5nbGV0b25JbnN0YW5jZSgpIHtcclxuICAgICAgICBpZiAoIVVuaXRGYWN0b3J5Lmluc3RhbmNlKSBVbml0RmFjdG9yeS5pbnN0YW5jZSA9IG5ldyBVbml0RmFjdG9yeSgpO1xyXG4gICAgICAgIHJldHVybiBVbml0RmFjdG9yeS5pbnN0YW5jZTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGUodW5pdE5hbWUsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCh1bml0TmFtZSkge1xyXG4gICAgICAgICAgICBjYXNlICdza2VsZXRvbic6IHJldHVybiBuZXcgU2tlbGV0b24odGhpcy5pZCsrLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBjYXNlICdrbmlnaHQnOiByZXR1cm4gbmV3IEtuaWdodCh0aGlzLmlkKyssIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIGNhc2UgJ2NvdW50cnkta25pZ2h0JzogcmV0dXJuIG5ldyBDb3VudHJ5S25pZ2h0KHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgY2FzZSAncm9ndWUnOiByZXR1cm4gbmV3IFJvZ3VlKHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgY2FzZSAnYmxvYic6IHJldHVybiBuZXcgQmxvYih0aGlzLmlkKyssIGRpcmVjdGlvbik7XHJcbiAgICAgICAgICAgIGNhc2UgJ3dpemFyZCc6IHJldHVybiBuZXcgV2l6YXJkKHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcclxuICAgICAgICAgICAgY2FzZSAnYmFuZGl0JzogcmV0dXJuIG5ldyBCYW5kaXQodGhpcy5pZCsrLCBkaXJlY3Rpb24pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OiB0aHJvdyBFcnJvcignd3JvbmcgbmFtZSBvZiB1bml0ISEhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdC1mYWN0b3J5L3VuaXQtZmFjdG9yeS5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBBY3Rpb25zID0ge1xyXG4gIGlkbGU6ICdpZGxlJyxcclxuICBzdGVwOiAnc3RlcCcsXHJcbiAgYXR0YWNrOiAnYXR0YWNrJyxcclxuICBkaWU6ICdkaWUnLFxyXG4gIGhlYWw6ICdoZWFsJ1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQWN0aW9ucztcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0L2FjdGlvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVldWUge1xyXG4gICAgY29uc3RydWN0b3Ioc3RhdGUpIHtcclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB9XHJcblxyXG4gICAgcXVldWVBbGx5KGFsbGllcywgYWxseSkge1xyXG4gICAgICAgIGxldCBob3Jpem9udGFsUG9zaXRpb24gPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmFsbGllc1NwYXduWDtcclxuXHJcbiAgICAgICAgaWYgKCFhbGxpZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGFsbHkueCA9IGhvcml6b250YWxQb3NpdGlvbiAtIDUwO1xyXG4gICAgICAgICAgICBhbGx5LnkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmdyb3VuZExldmVsWTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBhbGxpZXMuZm9yRWFjaChhbGx5ID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChob3Jpem9udGFsUG9zaXRpb24gPiBhbGx5LngpIFxyXG4gICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxQb3NpdGlvbiA9IGFsbHkueDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBhbGx5LnggPSBob3Jpem9udGFsUG9zaXRpb24gLSA1MDtcclxuICAgICAgICAgICAgYWxseS55ID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5ncm91bmRMZXZlbFk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHF1ZXVlRW5lbXkoZW5lbWllcywgZW5lbXkpIHtcclxuICAgICAgICBsZXQgaG9yaXpvbnRhbFBvc2l0aW9uID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5lbmVtaWVzU3Bhd25YO1xyXG5cclxuICAgICAgICBpZiAoIWVuZW1pZXMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGVuZW15LnggPSBob3Jpem9udGFsUG9zaXRpb247XHJcbiAgICAgICAgICAgIGVuZW15LnkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmdyb3VuZExldmVsWTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBlbmVtaWVzLmZvckVhY2goZW5lbXkgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGhvcml6b250YWxQb3NpdGlvbiA8IGVuZW15LngpIFxyXG4gICAgICAgICAgICAgICAgaG9yaXpvbnRhbFBvc2l0aW9uID0gZW5lbXkueDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBlbmVteS54ID0gaG9yaXpvbnRhbFBvc2l0aW9uICsgNTA7XHJcbiAgICAgICAgICAgIGVuZW15LnkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmdyb3VuZExldmVsWTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9xdWV1ZS9xdWV1ZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgY2xhc3MgU2NlbmVCYXNlIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMsIHByZWxvZGVyKSB7XHJcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMgPSBnYW1lQ2FudmFzO1xyXG4gICAgdGhpcy5tdXNpYyA9IG11c2ljO1xyXG4gICAgdGhpcy5wcmVsb2RlciA9IHByZWxvZGVyO1xyXG4gIH1cclxuXHJcbiAgZnJhbWUodGltZXN0YW1wKSB7XHJcbiAgICB0aGlzLnVwZGF0ZVN0YXRlKHRpbWVzdGFtcCk7XHJcbiAgICB0aGlzLnJlbmRlcih0aW1lc3RhbXApO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ05vdCBpbXBsZW1lbnRlZC4nKTtcclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHRocm93IG5ldyBFcnJvcignTm90IGltcGxlbWVudGVkLicpO1xyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NjZW5lcy9zY2VuZS5iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGxldmVscyA9IFtcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdiYW5kaXQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdiYW5kaXQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdiYW5kaXQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdiYW5kaXQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICAgIGJhY2tncm91bmQ6ICcuL2ltZ3MvYmFja2dyb3VuZHMvZ2FtZS5wbmcnLFxyXG4gICAgICAgIGdyb3VuZExldmVsWTogNjQwLFxyXG4gICAgICAgIGVuZW1pZXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmxvYidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYWxsaWVzOiBbXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NrZWxldG9uJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIGFsbGllczogW1xyXG4gICAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgICAgYmFja2dyb3VuZDogJy4vaW1ncy9iYWNrZ3JvdW5kcy9nYW1lLnBuZycsXHJcbiAgICAgICAgZ3JvdW5kTGV2ZWxZOiA2NDAsXHJcbiAgICAgICAgZW5lbWllczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmxvYidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYWxsaWVzOiBbXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Jsb2InXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnYmxvYidcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYWxsaWVzOiBbXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcclxuICAgICAgICBncm91bmRMZXZlbFk6IDY0MCxcclxuICAgICAgICBlbmVtaWVzOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2Jsb2InXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdrbmlnaHQnXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdibG9iJ1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBuYW1lOiAna25pZ2h0J1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgYWxsaWVzOiBbXHJcbiAgICAgICAgXVxyXG4gICAgfVxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbGV2ZWxzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2xldmVscy9sZXZlbHMuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi4vdW5pdC9hY3Rpb25zJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZsb2F0aW5nVGV4dCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLnN0YXRlID0gW107XHJcbiAgICAgICAgdGhpcy5zaGlmdFJpZ2h0ID0gZmFsc2U7XHJcbiAgICAgICAgdGhpcy5zaGlmdCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhdGljIGdldFNpbmdsZXRvbkluc3RhbmNlKGNvbnRleHQpIHtcclxuICAgICAgICBpZiAoIUZsb2F0aW5nVGV4dC5pbnN0YW5jZSkgRmxvYXRpbmdUZXh0Lmluc3RhbmNlID0gbmV3IEZsb2F0aW5nVGV4dChjb250ZXh0KTtcclxuICAgICAgICByZXR1cm4gRmxvYXRpbmdUZXh0Lmluc3RhbmNlO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZCh1bml0KSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5wdXNoKHtcclxuICAgICAgICAgICAgdGV4dDogdW5pdC50ZXh0LFxyXG4gICAgICAgICAgICBwb3NpdGlvblg6IHVuaXQucG9zaXRpb25YLFxyXG4gICAgICAgICAgICBwb3NpdGlvblk6IHVuaXQucG9zaXRpb25ZLFxyXG4gICAgICAgICAgICBhY3Rpb246IHVuaXQuYWN0aW9uLFxyXG4gICAgICAgICAgICBvcGFjaXR5OiAxLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLmZvckVhY2godGV4dFBhcmFtID0+IHsgLy8gVE9ETzogZGFtYWdlIG5lZWQgdG8gcmVuYW1lXHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5mb250ID0nMTRweCBQaXhlbGF0ZSc7XHJcbiAgICAgICAgICAgIGlmICh0ZXh0UGFyYW0uYWN0aW9uID09PSBBY3Rpb25zLmF0dGFjaykge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgcmVkQ29sb3IgPSBgcmdiYSgyNDgsIDIyLCA5NywgJHt0ZXh0UGFyYW0ub3BhY2l0eX0pYFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHJlZENvbG9yO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRleHRQYXJhbS5hY3Rpb24gPT09IEFjdGlvbnMuaGVhbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZ3JlZW5Db2xvciA9IGByZ2JhKDExNywgMjQ4LCA0OCwgJHt0ZXh0UGFyYW0ub3BhY2l0eX0pYFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IGdyZWVuQ29sb3I7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3aGl0ZSA9IGByZ2JhKDI1NSwgMjU1LCAyNTUsICR7dGV4dFBhcmFtLm9wYWNpdHl9KWBcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSB3aGl0ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQoYCR7dGV4dFBhcmFtLnRleHR9YCwgdGV4dFBhcmFtLnBvc2l0aW9uWCwgdGV4dFBhcmFtLnBvc2l0aW9uWSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlUG9zaXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5mb3JFYWNoKHRleHQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGV4dC5vcGFjaXR5IDw9IDApIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zdGF0ZS5maW5kSW5kZXgoY3VycmVudERhbWFnZSA9PiBjdXJyZW50RGFtYWdlID09PSB0ZXh0KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRleHQucG9zaXRpb25YICs9IHRoaXMuc2hpZnQ7XHJcbiAgICAgICAgICAgICAgICB0ZXh0LnBvc2l0aW9uWSAtPSAwLjc7XHJcbiAgICAgICAgICAgICAgICB0ZXh0Lm9wYWNpdHkgLT0gMC4wMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudGljaygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRpY2soKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc2hpZnQgPj0gMC41KSB0aGlzLnNoaWZ0UmlnaHQgPSBmYWxzZTtcclxuICAgICAgICBlbHNlIGlmICh0aGlzLnNoaWZ0IDw9IC0wLjUpIHRoaXMuc2hpZnRSaWdodCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5zaGlmdFJpZ2h0ID8gdGhpcy5zaGlmdCArPSAwLjAzIDogdGhpcy5zaGlmdCAtPSAwLjAzO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvZmxvYXRpbmctdGV4dC9mbG9hdGluZy10ZXh0LmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIERpYWxvZyB7XHJcbiAgICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcclxuICAgICAgICB0aGlzLm9wYWNpdHkgPSAwO1xyXG4gICAgICAgIHRoaXMuY2xvc2UoKTtcclxuICAgIH1cclxuXHJcbiAgICBvcGVuKG1lc3NhZ2UsIG1lc3NhZ2VYLCBidXR0b25zKSB7XHJcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcclxuICAgICAgICB0aGlzLm1lc3NhZ2VYID0gbWVzc2FnZVg7XHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gYnV0dG9ucztcclxuICAgICAgICB0aGlzLmlzT3BlbmVkID0gdHJ1ZTtcclxuICAgICAgICB0aGlzLmZhZGVJbiA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgY2xvc2UoKSB7XHJcbiAgICAgICAgdGhpcy5pc09wZW5lZCA9IGZhbHNlO1xyXG4gICAgICAgIHRoaXMuZmFkZUluID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICghdGhpcy5pc09wZW5lZCAmJiB0aGlzLm9wYWNpdHkgPD0gMC4xKSByZXR1cm47XHJcblxyXG4gICAgICAgIGlmICghdGhpcy5mYWRlSW4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub3BhY2l0eSA+IDAuMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcGFjaXR5IC09IDAuMDM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gdGhpcy5vcGFjaXR5O1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KHRoaXMubWVzc2FnZSwgdGhpcy5tZXNzYWdlWCAsIDIwMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJ1dHRvbnMuZm9yRWFjaChidXR0b24gPT4gYnV0dG9uLnJlbmRlcih0aGlzLmNvbnRleHQpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29udGV4dC5yZXN0b3JlKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm1lc3NhZ2UgPSAnJztcclxuICAgICAgICAgICAgICAgIHRoaXMubWVzc2FnZVggPSAwO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5idXR0b25zID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9wYWNpdHkgPD0gMSkgdGhpcy5vcGFjaXR5ICs9IDAuMDE7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IHRoaXMub3BhY2l0eTtcclxuICAgICAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KHRoaXMubWVzc2FnZSwgdGhpcy5tZXNzYWdlWCAsIDIwMCk7XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24ucmVuZGVyKHRoaXMuY29udGV4dCkpO1xyXG4gICAgICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXNldCgpIHtcclxuICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gMDtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2RpYWxvZy9kaWFsb2cuanNcbi8vIG1vZHVsZSBpZCA9IDEwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCAgeyBHYW1lQ2FudmFzIH0gZnJvbSAnLi9nYW1lLWNhbnZhcy9nYW1lLWNhbnZhcyc7XHJcbmltcG9ydCB7IFN0YXRlIH0gZnJvbSAnLi9zdGF0ZS9zdGF0ZSc7XHJcbmltcG9ydCB7IE1lbnVTY2VuZSB9IGZyb20gJy4vc2NlbmVzL21lbnUuc2NlbmUnO1xyXG5pbXBvcnQgeyBHYW1lU2NlbmUgfSBmcm9tICcuL3NjZW5lcy9nYW1lLnNjZW5lJztcclxuaW1wb3J0IE11c2ljIGZyb20gJy4vbXVzaWMvbXVzaWMnO1xyXG5pbXBvcnQgU3RhdGlzdGljU2NlbmUgZnJvbSAnLi9zY2VuZXMvc3RhdGlzdGljJztcclxuXHJcbndpbmRvdy5vbmxvYWQgPSBmdW5jdGlvbigpIHtcclxuICAgIGNvbnN0IHN0YXRlID0gbmV3IFN0YXRlKCk7XHJcbiAgICBjb25zdCBnYW1lQ2FudmFzID0gbmV3IEdhbWVDYW52YXMoKTtcclxuICAgIGNvbnN0IG11c2ljID0gbmV3IE11c2ljKGdhbWVDYW52YXMpO1xyXG4gICAgLy8gY29uc3QgcHJlbG9kZXIgPSBuZXcgUHJlbG9hZGVyKHN0YXRlLCBnYW1lQ2FudmFzKTtcclxuICAgIGNvbnN0IG1lbnVTY2VuZSA9IG5ldyBNZW51U2NlbmUoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuICAgIGNvbnN0IGdhbWVTY2VuZSA9IG5ldyBHYW1lU2NlbmUoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuICAgIGNvbnN0IHN0YXRpc3RpY1NjZW5lID0gbmV3IFN0YXRpc3RpY1NjZW5lKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYyk7XHJcblxyXG4gICAgLy8gc3RhdGUuc2NlbmVzLm1lbnUuaW5zdGFuY2UgPSBwcmVsb2RlcjtcclxuICAgIHN0YXRlLnNjZW5lcy5tZW51Lmluc3RhbmNlID0gbWVudVNjZW5lO1xyXG4gICAgc3RhdGUuc2NlbmVzLmdhbWUuaW5zdGFuY2UgPSBnYW1lU2NlbmU7XHJcbiAgICBzdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmluc3RhbmNlID0gc3RhdGlzdGljU2NlbmU7XHJcbiAgICBzdGF0ZS5jdXJyZW50U2NlbmUgPSBtZW51U2NlbmU7XHJcblxyXG4gICAgKGZ1bmN0aW9uIGZyYW1lKHRpbWVzdGFtcCkge1xyXG4gICAgICAgIHN0YXRlLmN1cnJlbnRTY2VuZS5mcmFtZSh0aW1lc3RhbXApO1xyXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShmcmFtZSk7XHJcbiAgICB9KSgpO1xyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGNsYXNzIEdhbWVDYW52YXMge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcclxuICAgICAgICB0aGlzLmNhbnZhcy5pZCA9ICdjYW52YXMnO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gMTEwMDtcclxuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSA3MDA7XHJcbiAgICAgICAgdGhpcy5jb250ZXh0ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9JzMwcHggUGl4ZWxhdGUnO1xyXG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsU3R5bGUgPSAnd2hpdGUnO1xyXG5cclxuICAgICAgICB0aGlzLmNsaWNrU3Vic2NyaWJlcnMgPSBbXTsgXHJcblxyXG4gICAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4gdGhpcy5leGVjdXRlQ2xpY2tIYW5kbGVycygpKTtcclxuICAgIH1cclxuXHJcbiAgICBzdWJzY3JpYmVPbkNsaWNrKC4uLnN1YnNjcmliZXJzKSB7XHJcbiAgICAgICAgc3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1N1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcik7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdW5zdWJzY3JpYmVDbGljayhzdWJzY3JpYmVyKSB7XHJcbiAgICAgICAgaWYgKHN1YnNjcmliZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmNsaWNrU3Vic2NyaWJlcnMuaW5kZXhPZihzdWJzY3JpYmVyKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID49IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xpY2tTdWJzY3JpYmVycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbGlja1N1YnNjcmliZXJzID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4ZWN1dGVDbGlja0hhbmRsZXJzKCkge1xyXG4gICAgICAgIGNvbnN0IHggPSBldmVudC5jbGllbnRYIC0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcclxuICAgICAgICBjb25zdCB5ID0gZXZlbnQuY2xpZW50WSAtIHRoaXMuY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcDtcclxuICAgICAgICB0aGlzLmNsaWNrU3Vic2NyaWJlcnMuZm9yRWFjaChzdWJzY3JpYmVyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2xpY2tlZEluc2lkZVN1YnNjcmliZXIgPSBzdWJzY3JpYmVyLnggPD0geFxyXG4gICAgICAgICAgICAgICAgJiYgc3Vic2NyaWJlci54ICsgc3Vic2NyaWJlci53aWR0aCA+PSB4XHJcbiAgICAgICAgICAgICAgICAmJiBzdWJzY3JpYmVyLnkgPD0geSBcclxuICAgICAgICAgICAgICAgICYmIHN1YnNjcmliZXIueSArIHN1YnNjcmliZXIuaGVpZ2h0ID49IHk7XHJcblxyXG4gICAgICAgICAgICBpZiAoY2xpY2tlZEluc2lkZVN1YnNjcmliZXIpIHN1YnNjcmliZXIuY2xpY2tIYW5kbGVyKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9nYW1lLWNhbnZhcy9nYW1lLWNhbnZhcy5qc1xuLy8gbW9kdWxlIGlkID0gMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IGxldmVscyBmcm9tICcuLi9sZXZlbHMvbGV2ZWxzJztcclxuaW1wb3J0IFVuaXRGYWN0b3J5IGZyb20gJy4uL3VuaXQtZmFjdG9yeS91bml0LWZhY3RvcnknO1xyXG5pbXBvcnQgUXVldWUgZnJvbSAnLi4vcXVldWUvcXVldWUnO1xyXG5pbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9jb25zdGFudHMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFN0YXRlIHtcclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIC8vIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5zY2VuZXMgPSB7XHJcbiAgICAgICAgICAgIHByZWxvYWRlcjoge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1lbnU6IHtcclxuICAgICAgICAgICAgICAgIGluc3RhbmNlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYmFja2dyb3VuZFNwcml0ZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGNsb3Vkc0ltYWdlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgY2xvdWRzT2Zmc2V0WDogMCxcclxuICAgICAgICAgICAgICAgIGJlbHQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBiZWx0WTogLTcyMCxcclxuICAgICAgICAgICAgICAgIG1lbnVTaGVldDogbnVsbCxcclxuICAgICAgICAgICAgICAgIG1lbnVTaGVldFk6IC01NTAsXHJcbiAgICAgICAgICAgICAgICBhYm91dFNoZWV0OiBudWxsLFxyXG4gICAgICAgICAgICAgICAgYWJvdXRTaGVldFk6IC02ODAsXHJcbiAgICAgICAgICAgICAgICBhYm91dFNoZWV0VmlzaWJsZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eTogMCxcclxuICAgICAgICAgICAgICAgIGFuZ2xlOiAwLjAxLFxyXG4gICAgICAgICAgICAgICAgZ3Jhdml0eTogLTkuODA2NjUsXHJcbiAgICAgICAgICAgICAgICBhY2NlbGVyYXRpb246IG51bGxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2FtZToge1xyXG4gICAgICAgICAgICAgICAgaW5zdGFuY2U6IG51bGwsXHJcbiAgICAgICAgICAgICAgICBlbmVtaWVzU3Bhd25YOiBkZWZhdWx0cy5lbmVtaWVzU3Bhd25YLFxyXG4gICAgICAgICAgICAgICAgYWxsaWVzU3Bhd25YOiBkZWZhdWx0cy5hbGxpZXNTcGF3blgsXHJcbiAgICAgICAgICAgICAgICBpc1BhdXNlR2FtZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIG1vbmV5OiBkZWZhdWx0cy5zdGFydE1vbmV5LFxyXG4gICAgICAgICAgICAgICAgcGFzdE1vbmV5OiBkZWZhdWx0cy5zdGFydE1vbmV5LFxyXG4gICAgICAgICAgICAgICAgbnVtYmVyT2ZMZXZlbHM6IGxldmVscy5sZW5ndGgsXHJcbiAgICAgICAgICAgICAgICBjdXJyZW50TGV2ZWw6IHtcclxuICAgICAgICAgICAgICAgICAgICBsZXZlbE51bWJlcjogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBiYWNrZ3JvdW5kOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIGdyb3VuZExldmVsWTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBhbGxpZXM6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgZW5lbWllczogbnVsbFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgc3RhdGlzdGljOiB7XHJcbiAgICAgICAgICAgICAgICBpbnN0YW5jZTogbnVsbCxcclxuICAgICAgICAgICAgICAgIGJhY2tncm91bmQ6IG51bGwsXHJcbiAgICAgICAgICAgICAgICB0aW1lU3BlbnQ6IDAsXHJcbiAgICAgICAgICAgICAgICBsZXZlbHNGYWlsZWQ6IDAsXHJcbiAgICAgICAgICAgICAgICB0b3RhbERhbWFnZTogMCxcclxuICAgICAgICAgICAgICAgIHJlY2VpdmVkRGFtYWdlOiAwLFxyXG4gICAgICAgICAgICAgICAgZWFybmVkTW9uZXk6IGRlZmF1bHRzLnN0YXJ0TW9uZXksXHJcbiAgICAgICAgICAgICAgICBoZWFsZWRIcDogMFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy51bml0RmFjdG9yeSA9IFVuaXRGYWN0b3J5LmdldFNpbmdsZXRvbkluc3RhbmNlKCk7XHJcbiAgICAgICAgLy8gdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZSh0aGlzKTsgLy8gVE9ETzogbW92ZVxyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuc2NlbmVzLmdhbWUubW9uZXkgPSBkZWZhdWx0cy5zdGFydE1vbmV5O1xyXG4gICAgICAgIHRoaXMuc2NlbmVzLmdhbWUucGFzdE1vbmV5ID0gZGVmYXVsdHMuc3RhcnRNb25leTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3N0YXRlL3N0YXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAxM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVW5pdCBmcm9tICcuLi8uLi91bml0L3VuaXQnO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNrZWxldG9uIGV4dGVuZHMgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGhlYWx0aDogMTAsXHJcbiAgICAgICAgICAgIGRhbWFnZTogMyxcclxuICAgICAgICAgICAgYXR0YWNrVGltZTogMjE0MixcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDIzLFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDk1MixcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiAxOTAwLFxyXG4gICAgICAgICAgICBzdGVwU2l6ZTogMC42LFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgICAgICAgICAgaWRsZVRpbWU6IDEwMDBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvc3QgPSAyO1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDI0LFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMzIsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxMSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDIwMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDEwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy53YWxrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24td2Fsay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAyNCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDMzLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMTMsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiA5MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDEwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNDMsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAzNyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDE4LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTI1LFxyXG4gICAgICAgICAgICB4T2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMCA6IC0xNixcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDEwXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1kaWUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogMzMsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAzMixcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDE1LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTUwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogMTBcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLmpzXG4vLyBtb2R1bGUgaWQgPSAxNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGVzIHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHRoaXMuaWRsZSA9IG51bGw7XHJcbiAgICB0aGlzLndhbGsgPSBudWxsO1xyXG4gICAgdGhpcy5hdHRhY2sgPSBudWxsO1xyXG4gICAgdGhpcy5kaWUgPSBudWxsO1xyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvc3ByaXRlcy5qc1xuLy8gbW9kdWxlIGlkID0gMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcclxuaW1wb3J0IFNwcml0ZSBmcm9tICcuLi8uLi91bml0L3Nwcml0ZSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLbmlnaHQgZXh0ZW5kcyBVbml0IHtcclxuICAgIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24pIHtcclxuICAgICAgICBzdXBlcih7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgaGVhbHRoOiAxNSxcclxuICAgICAgICAgICAgZGFtYWdlOiA0LFxyXG4gICAgICAgICAgICBhdHRhY2tUaW1lOiAxNTAwLFxyXG4gICAgICAgICAgICByYW5nZUF0dGFjazogMjQsXHJcbiAgICAgICAgICAgIHRpbWVUb0hpdDogNzUwLFxyXG4gICAgICAgICAgICBkZWF0aFRpbWU6IDcwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDAuOCxcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gNDtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDQyLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNDAsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA0LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMzAwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDI2IDogMTZcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LXdhbGstJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNDIsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDgsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxNTAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMjYgOiAxNlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTcwLFxyXG4gICAgICAgICAgICB4T2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMCA6IC0zOCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAyNiA6IDE2XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LWRpZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA0MixcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDQwLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDkwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDI2IDogMTZcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL2tuaWdodC9rbmlnaHQuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291bnRyeUtuaWdodCBleHRlbmRzIFVuaXQge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBoZWFsdGg6IDEwLFxyXG4gICAgICAgICAgICBkYW1hZ2U6IDEsXHJcbiAgICAgICAgICAgIGF0dGFja1RpbWU6IDUwMCxcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDE5LFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDQwMCxcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiAxMDAwLFxyXG4gICAgICAgICAgICBzdGVwU2l6ZTogMS41LFxyXG4gICAgICAgICAgICBkaXJlY3Rpb246IGRpcmVjdGlvbixcclxuICAgICAgICAgICAgaWRsZVRpbWU6IDEwMDBcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmNvc3QgPSAzO1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xyXG4gICAgfVxyXG4gICAgY29uZmlndXJlU3ByaXRlcygpIHtcclxuICAgICAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWlkbGUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAzOSxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDYsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMzggOiAyNlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LXJ1bi0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA2NCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDQ1LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDExMixcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAzOCA6IDI2XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogNjQsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA0MixcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDQsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMzggOiAyNlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQtZGllLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDY0LFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNDUsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA4LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTU1LFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDM4IDogMjZcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LmpzXG4vLyBtb2R1bGUgaWQgPSAxN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVW5pdCBmcm9tICcuLi8uLi91bml0L3VuaXQnO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvZ3VlIGV4dGVuZHMgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGhlYWx0aDogMTAsXHJcbiAgICAgICAgICAgIGRhbWFnZTogMixcclxuICAgICAgICAgICAgYXR0YWNrVGltZTogMTAwMCxcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDQwLFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDgwMCxcclxuICAgICAgICAgICAgZGVhdGhUaW1lOiAxMDAwLFxyXG4gICAgICAgICAgICBzdGVwU2l6ZTogMSxcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGlkbGVUaW1lOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gMjtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuICAgIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDY0LFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMjEsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAzLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMjAwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogN1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL3JvZ3VlL3JvZ3VlLXJ1bi0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA2NCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDIzLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNixcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDExMixcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDdcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmF0dGFjayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL3JvZ3VlL3JvZ3VlLWF0dGFjay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA2NCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDIzLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogMTAsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxMTIsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiA3XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1kZWF0aC0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAzMyxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDIxLFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDUwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogN1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdHMvcm9ndWUvcm9ndWUuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmxvYiBleHRlbmRzIFVuaXQge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBoZWFsdGg6IDMsXHJcbiAgICAgICAgICAgIGRhbWFnZTogNCxcclxuICAgICAgICAgICAgYXR0YWNrVGltZTogMTIwMCxcclxuICAgICAgICAgICAgcmFuZ2VBdHRhY2s6IDI3LFxyXG4gICAgICAgICAgICB0aW1lVG9IaXQ6IDExMDAsXHJcbiAgICAgICAgICAgIGRlYXRoVGltZTogMTAwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDEsXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICBpZGxlVGltZTogMTAwMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY29zdCA9IDI7XHJcbiAgICAgICAgdGhpcy5jb25maWd1cmVTcHJpdGVzKCk7XHJcbiAgICB9XHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmxvYi9ibG9iLWlkbGUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAyMyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDMsXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAyNTAsXHJcbiAgICAgICAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAzMVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2Jsb2IvYmxvYi1tb3ZlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDgwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogNTAsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA4LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTEyLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMzFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmF0dGFjayA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2Jsb2IvYmxvYi1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiAzMyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTMwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMzFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmRpZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICAgICAgICB1cmw6IGBpbWdzL3VuaXRzL2Jsb2IvYmxvYi1kZWF0aC0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA4MCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDU0LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogOCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDE1NSxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDMxXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy9ibG9iL2Jsb2IuanNcbi8vIG1vZHVsZSBpZCA9IDE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xyXG5pbXBvcnQgQWN0aW9ucyBmcm9tICcuLi8uLi91bml0L2FjdGlvbnMnO1xyXG5pbXBvcnQgRGlyZWN0aW9uIGZyb20gJy4uLy4uL3VuaXQvZGlyZWN0aW9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdpemFyZCBleHRlbmRzIFVuaXQge1xyXG4gICAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xyXG4gICAgICAgIHN1cGVyKHtcclxuICAgICAgICAgICAgaWQ6IGlkLFxyXG4gICAgICAgICAgICBoZWFsdGg6IDIwLFxyXG4gICAgICAgICAgICBkYW1hZ2U6IDEsXHJcbiAgICAgICAgICAgIGF0dGFja1RpbWU6IDE1MDAsXHJcbiAgICAgICAgICAgIHJhbmdlQXR0YWNrOiAyOCxcclxuICAgICAgICAgICAgdGltZVRvSGl0OiAxMDAwLFxyXG4gICAgICAgICAgICBkZWF0aFRpbWU6IDE5MDAsXHJcbiAgICAgICAgICAgIHN0ZXBTaXplOiAwLjQsXHJcbiAgICAgICAgICAgIGRpcmVjdGlvbjogZGlyZWN0aW9uLFxyXG4gICAgICAgICAgICBpZGxlVGltZTogMTAwMFxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuaGVhbHRoVG9IZWFsID0gMTtcclxuICAgICAgICB0aGlzLmNvc3QgPSAzO1xyXG4gICAgICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWlkbGUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA4MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMjAwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMjFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy93aXphcmQvd2l6YXJkLXJ1bi0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiA3MCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDU2LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDI1MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDIxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWF0dGFjay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAxMDAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA1NyxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDksXHJcbiAgICAgICAgICAgIHRpbWVUb0ZyYW1lOiAxODAsXHJcbiAgICAgICAgICAgIHhPZmZzZXQ6IC0xNCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDIxXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWRlYXRoLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDgwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogODAsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiAxMCxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDI1MCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyA0OSA6IDIxXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLmhlYWwgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWhlYWwtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcclxuICAgICAgICAgICAgZnJhbWVXaWR0aDogODAsXHJcbiAgICAgICAgICAgIGZyYW1lSGVpZ2h0OiA4MCxcclxuICAgICAgICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMjUwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMjFcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkb0FjdGlvbihzdGF0ZSwgdGltZXN0YW1wKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGVhbHRoIDw9IDApIHtcclxuICAgICAgICAgICAgdGhpcy5kaWUoc3RhdGUsIHRpbWVzdGFtcCk7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRBY3Rpb24gPT09IEFjdGlvbnMuaWRsZVxyXG4gICAgICAgICAgICAmJiB0aW1lc3RhbXAgLSB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wIDwgdGhpcy5pZGxlVGltZSkge1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzSW5Gcm9udE9mQWxseShzdGF0ZSkgJiYgdGhpcy5pc1VuaXRSYW5nZShzdGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5oZWFsKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0luRnJvbnRPZkFsbHkoc3RhdGUpIHx8IHN0YXRlLmlzUGF1c2VHYW1lXHJcbiAgICAgICAgICAgIHx8IHRoaXMuaXNJbkZyb250T2ZFbmVteShzdGF0ZSkgJiYgdGhpcy5pc0VuZW15RHlpbmcoc3RhdGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaWRsZShzdGF0ZSwgdGltZXN0YW1wKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZFbmVteShzdGF0ZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5hdHRhY2soc3RhdGUsIHRpbWVzdGFtcCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zdGVwKHN0YXRlLCB0aW1lc3RhbXApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBoZWFsKHN0YXRlLCB0aW1lc3RhbXApIHtcclxuICAgICAgICBpZiAodGhpcy5jdXJyZW50QWN0aW9uICE9PSBBY3Rpb25zLmhlYWwpIHtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gQWN0aW9ucy5oZWFsO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgICAgICB0aGlzLnNwcml0ZXMuaGVhbC5yZXNldCgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVkoc3RhdGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBoZWFsVGltZSA9IHRoaXMuYXR0YWNrVGltZTtcclxuICAgICAgICBjb25zdCB0YXJnZXRVbml0ID0gdGhpcy5wbGF5ZXJzVW5pdCA/IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF1cclxuICAgICAgICAgICAgOiBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXTtcclxuICAgICAgICBpZiAodGltZXN0YW1wIC0gdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA+IGhlYWxUaW1lIFxyXG4gICAgICAgICAgICAmJiB0YXJnZXRVbml0LmhlYWx0aCA+IDApIHtcclxuXHJcbiAgICAgICAgICAgIHRhcmdldFVuaXQuaGVhbHRoICs9IHRoaXMuaGVhbHRoVG9IZWFsO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25YID0gdGFyZ2V0VW5pdC54IFxyXG4gICAgICAgICAgICAgICAgKyB0YXJnZXRVbml0LmdldEN1cnJlbnRTcHJpdGUoKS5mcmFtZVdpZHRoIC8gMjtcclxuICAgICAgICAgICAgdGhpcy5mbG9hdGluZ1RleHQuYWRkKHtcclxuICAgICAgICAgICAgICAgIHRleHQ6IHRoaXMuaGVhbHRoVG9IZWFsLFxyXG4gICAgICAgICAgICAgICAgcG9zaXRpb25YOiBwb3NpdGlvblgsXHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvblk6IHRhcmdldFVuaXQueSxcclxuICAgICAgICAgICAgICAgIGFjdGlvbjogQWN0aW9ucy5oZWFsLFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5pbnN0YW5jZS5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmhlYWxlZEhwICs9IHRoaXMuaGVhbHRoVG9IZWFsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpc1VuaXRSYW5nZShzdGF0ZSkge1xyXG4gICAgICAgIGNvbnN0IHRhcmdldFVuaXQgPSB0aGlzLnBsYXllcnNVbml0ID8gc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXVxyXG4gICAgICAgICAgICA6IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdO1xyXG5cclxuICAgICAgICByZXR1cm4gTWF0aC5hYnModGhpcy54IC0gdGFyZ2V0VW5pdC54KSA8IDEyMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDdXJyZW50U3ByaXRlKCkge1xyXG4gICAgICAgIHN3aXRjaCAodGhpcy5jdXJyZW50QWN0aW9uKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9ucy5zdGVwOiByZXR1cm4gdGhpcy5zcHJpdGVzLndhbGs7XHJcbiAgICAgICAgICAgIGNhc2UgQWN0aW9ucy5hdHRhY2s6IHJldHVybiB0aGlzLnNwcml0ZXMuYXR0YWNrO1xyXG4gICAgICAgICAgICBjYXNlIEFjdGlvbnMuZGllOiByZXR1cm4gdGhpcy5zcHJpdGVzLmRpZTtcclxuICAgICAgICAgICAgY2FzZSBBY3Rpb25zLmhlYWw6IHJldHVybiB0aGlzLnNwcml0ZXMuaGVhbDtcclxuICAgICAgICAgICAgZGVmYXVsdDogcmV0dXJuIHRoaXMuc3ByaXRlcy5pZGxlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL3dpemFyZC93aXphcmQuanNcbi8vIG1vZHVsZSBpZCA9IDIwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XHJcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFuZGl0IGV4dGVuZHMgVW5pdCB7XHJcbiAgICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XHJcbiAgICAgICAgc3VwZXIoe1xyXG4gICAgICAgICAgICBpZDogaWQsXHJcbiAgICAgICAgICAgIGhlYWx0aDogNixcclxuICAgICAgICAgICAgZGFtYWdlOiAyLFxyXG4gICAgICAgICAgICBhdHRhY2tUaW1lOiA2MDAsXHJcbiAgICAgICAgICAgIHJhbmdlQXR0YWNrOiAxNSxcclxuICAgICAgICAgICAgdGltZVRvSGl0OiAzMDAsXHJcbiAgICAgICAgICAgIGRlYXRoVGltZTogMTkwMCxcclxuICAgICAgICAgICAgc3RlcFNpemU6IDAuNixcclxuICAgICAgICAgICAgZGlyZWN0aW9uOiBkaXJlY3Rpb24sXHJcbiAgICAgICAgICAgIGlkbGVUaW1lOiAxMDAwXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jb3N0ID0gMjtcclxuICAgICAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVTcHJpdGVzKCkge1xyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XHJcbiAgICAgICAgICAgIHVybDogYGltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMjcsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA2LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogMTYwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDE5IDogMTFcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LXJ1bi0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAzMCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDI3LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNSxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDEzMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWF0dGFjay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxyXG4gICAgICAgICAgICBmcmFtZVdpZHRoOiAzMCxcclxuICAgICAgICAgICAgZnJhbWVIZWlnaHQ6IDI1LFxyXG4gICAgICAgICAgICBudW1iZXJPZkZyYW1lczogNyxcclxuICAgICAgICAgICAgdGltZVRvRnJhbWU6IDEzMCxcclxuICAgICAgICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcclxuICAgICAgICAgICAgdXJsOiBgaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWRlYXRoLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXHJcbiAgICAgICAgICAgIGZyYW1lV2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBmcmFtZUhlaWdodDogMjUsXHJcbiAgICAgICAgICAgIG51bWJlck9mRnJhbWVzOiA2LFxyXG4gICAgICAgICAgICB0aW1lVG9GcmFtZTogNDAwLFxyXG4gICAgICAgICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDE5IDogMTFcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL2JhbmRpdC9iYW5kaXQuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGRlZmF1bHRzID0ge1xyXG4gICAgZW5lbWllc1NwYXduWDogMTEwMCxcclxuICAgIGFsbGllc1NwYXduWDogMCxcclxuICAgIHN0YXJ0TW9uZXk6IDEwMFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdHM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3RhdGUvY29uc3RhbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSAyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgeyBTY2VuZUJhc2UgfSBmcm9tIFwiLi9zY2VuZS5iYXNlXCI7XHJcbmltcG9ydCBCdXR0b24gZnJvbSBcIi4uL2NvbnRyb2xzL2J1dHRvblwiO1xyXG5pbXBvcnQgU3ByaXRlIGZyb20gXCIuLi91bml0L3Nwcml0ZVwiO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lbnVTY2VuZSBleHRlbmRzIFNjZW5lQmFzZSB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKSB7XHJcbiAgICBzdXBlcihzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMpO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZSA9IG5ldyBTcHJpdGUoe1xyXG4gICAgICB1cmw6ICdpbWdzL1VJL21lbnUucG5nJyxcclxuICAgICAgZnJhbWVXaWR0aDogMTEwMCxcclxuICAgICAgZnJhbWVIZWlnaHQ6IDcwMCxcclxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxyXG4gICAgICB0aW1lVG9GcmFtZTogMjcwXHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc0ltYWdlID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc0ltYWdlLnNyYyA9ICdpbWdzL1VJL21lbnUtY2xvdWRzLnBuZyc7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5iZWx0ID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmJlbHQuc3JjID0gJ2ltZ3MvVUkvYmVsdC5wbmcnO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUubWVudVNoZWV0ID0gbmV3IEltYWdlKCk7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lm1lbnVTaGVldC5zcmMgPSAnaW1ncy9VSS9zaGVldC5wbmcnO1xyXG5cclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldCA9IG5ldyBJbWFnZSgpO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0LnNyYyA9ICdpbWdzL1VJL2Fib3V0LXNoZWV0LnBuZyc7XHJcblxyXG4gICAgdGhpcy5idXR0b25zID0gdGhpcy5nZXRCdXR0b25zQ29uZmlnKCkubWFwKG9wdGlvbnMgPT4gbmV3IEJ1dHRvbihvcHRpb25zKSk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayguLi50aGlzLmJ1dHRvbnMpO1xyXG4gICAgdGhpcy5tdXNpYy5zdWJzY3JpYmUoKTtcclxuXHJcbiAgICB0aGlzLnByZXZUaW1lU3RhbXAgPSAwO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlU3RhdGUoKSB7XHJcbiAgICBpZiAodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5jbG91ZHNPZmZzZXRYID49IDkwMCkge1xyXG4gICAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc09mZnNldFggPSAwO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5jbG91ZHNPZmZzZXRYICs9IDAuMTtcclxuXHJcbiAgICBpZiAodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5iZWx0WSA8IDApIHtcclxuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5iZWx0WSArPSAxMDtcclxuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5tZW51U2hlZXRZICs9IDEwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRWaXNpYmxlXHJcbiAgICAgICYmIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkgPCAtMTUpIHtcclxuICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRZICs9IDE1O1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0VmlzaWJsZVxyXG4gICAgICAmJiB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRZID4gLTY4MCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkgLT0gMTU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hY2NlbGVyYXRpb25cclxuICAgICAgPSB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmdyYXZpdHkgKiBNYXRoLnNpbih0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFuZ2xlKTtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUudmVsb2NpdHlcclxuICAgICAgKz0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hY2NlbGVyYXRpb24gKiAxMCAvIDEwMDA7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFuZ2xlICs9IHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUudmVsb2NpdHkgKiAxMCAvIDEwMDA7XHJcbiAgfVxyXG5cclxuICByZW5kZXIodGltZXN0YW1wID0gMCkge1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzSW1hZ2UsXHJcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzT2Zmc2V0WCwgMCwgOTAwLCAxMjYsIDI1MCwgMCwgOTAwLCAxMjYpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS5pbWFnZSxcclxuICAgICAgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmdldEZyYW1lWCgpLCAwLFxyXG4gICAgICB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmZyYW1lSGVpZ2h0LFxyXG4gICAgICAwLCAwLCB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmZyYW1lSGVpZ2h0KTtcclxuICAgIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS50aWNrKHRpbWVzdGFtcCwgdGhpcy5wcmV2VGltZVN0YW1wKTtcclxuXHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5iZWx0LFxyXG4gICAgICAwLCB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmJlbHRZKTtcclxuXHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC50cmFuc2xhdGUoMTQwLCAwKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnJvdGF0ZSh0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFuZ2xlKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lm1lbnVTaGVldCxcclxuICAgICAgLTI4MCAvIDIsIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUubWVudVNoZWV0WSk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yZXN0b3JlKCk7XHJcblxyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuc2F2ZSgpO1xyXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQudHJhbnNsYXRlKDcwMCwgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0WSk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yb3RhdGUoLXRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYW5nbGUgKiA1KTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXQsXHJcbiAgICAgIC0zNTAgLyAyLCAwKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuXHJcbiAgICB0aGlzLm11c2ljLnJlbmRlcigpO1xyXG5cclxuICAgIHRoaXMucHJldlRpbWVTdGFtcCA9IHRpbWVzdGFtcDtcclxuICB9XHJcblxyXG4gIHN0YXJ0R2FtZSgpIHtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcbiAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuaW5zdGFuY2U7XHJcbiAgICB0aGlzLnN0YXRlLnJlc2V0KCk7IC8vIFRPRE86IG1iIHJlbmFtZSByZXNldE1vbmV5XHJcbiAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5zdWJzY3JpYmVCdXR0b25zQ2xpY2soKTtcclxuICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmRpYWxvZy5vcGVuKGBTZWxlY3QgYSB1bml0IGluIHRoZSB1cHBlciByaWdodCBjb3JuZXJgLCAyMDAsIFtdKTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZUFib3V0KCkge1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0VmlzaWJsZVxyXG4gICAgICA9ICF0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXRWaXNpYmxlO1xyXG4gIH1cclxuXHJcbiAgZ2V0QnV0dG9uc0NvbmZpZygpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHsgeDogNzUsIHk6IDQyMCwgaGVpZ2h0OiA1MCwgd2lkdGg6IDE2NSwgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLnN0YXJ0R2FtZSgpIH0sXHJcbiAgICAgIHsgeDogNjUsIHk6IDQ5MCwgaGVpZ2h0OiA1MCwgd2lkdGg6IDE4NSwgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLnRvZ2dsZUFib3V0KCkgfVxyXG4gICAgXTtcclxuICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zY2VuZXMvbWVudS5zY2VuZS5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU2NlbmVCYXNlIH0gZnJvbSBcIi4vc2NlbmUuYmFzZVwiO1xyXG5pbXBvcnQgQ29udHJvbFBhbmVsIGZyb20gJy4uL2NvbnRyb2wtcGFuZWwvY29udHJvbC1wYW5lbCc7XHJcbmltcG9ydCBEaWFsb2cgZnJvbSAnLi4vZGlhbG9nL2RpYWxvZyc7XHJcbmltcG9ydCBVbml0RmFjdG9yeSBmcm9tICcuLi91bml0LWZhY3RvcnkvdW5pdC1mYWN0b3J5JztcclxuaW1wb3J0IFF1ZXVlIGZyb20gJy4uL3F1ZXVlL3F1ZXVlJztcclxuaW1wb3J0IGxldmVscyBmcm9tICcuLi9sZXZlbHMvbGV2ZWxzJztcclxuaW1wb3J0IERpcmVjdGlvbiBmcm9tICcuLi91bml0L2RpcmVjdGlvbic7XHJcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vY29udHJvbHMvYnV0dG9uJztcclxuaW1wb3J0IEZsb2F0aW5nVGV4dCBmcm9tICcuLi9mbG9hdGluZy10ZXh0L2Zsb2F0aW5nLXRleHQnO1xyXG5pbXBvcnQgQnVmZk1hbmFnZXIgZnJvbSAnLi4vYnVmZi1tYW5hZ2VyL2J1ZmYtbWFuYWdlcic7XHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZVNjZW5lIGV4dGVuZHMgU2NlbmVCYXNlIHtcclxuICBjb25zdHJ1Y3RvcihzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMsIHByZWxvYWRlcikge1xyXG4gICAgc3VwZXIoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuXHJcbiAgICB0aGlzLmNvbnRyb2xQYW5lbCA9IG5ldyBDb250cm9sUGFuZWwoc3RhdGUsIGdhbWVDYW52YXMpO1xyXG4gICAgdGhpcy5idWZmTWFuYWdlciA9IG5ldyBCdWZmTWFuYWdlcihzdGF0ZSwgZ2FtZUNhbnZhcyk7XHJcbiAgICB0aGlzLmZsb2F0aW5nVGV4dCA9IEZsb2F0aW5nVGV4dC5nZXRTaW5nbGV0b25JbnN0YW5jZShnYW1lQ2FudmFzLmNvbnRleHQpO1xyXG4gICAgdGhpcy5kaWFsb2cgPSBuZXcgRGlhbG9nKGdhbWVDYW52YXMuY29udGV4dCk7XHJcbiAgICB0aGlzLnVuaXRGYWN0b3J5ID0gVW5pdEZhY3RvcnkuZ2V0U2luZ2xldG9uSW5zdGFuY2UoKTtcclxuICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoc3RhdGUpOyAvLyBUT0RPOiBtb3ZlXHJcbiAgICB0aGlzLnByZXZUaW1lU3RhbXAgPSAwO1xyXG5cclxuICAgIHRoaXMuaW5pdGlhbGl6ZSgwKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZVN0YXRlKHRpbWVzdGFtcCkge1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmZvckVhY2goYWxseSA9PiBhbGx5LmRvQWN0aW9uKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUsIHRpbWVzdGFtcCkpO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcy5mb3JFYWNoKGVuZW15ID0+IGVuZW15LmRvQWN0aW9uKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUsIHRpbWVzdGFtcCkpO1xyXG5cclxuICAgIGNvbnN0IHdpbm5lciA9IHRoaXMuZ2V0V2lubmVyKCk7XHJcbiAgICBpZiAod2lubmVyICYmICF0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzUGF1c2VHYW1lKSB7XHJcbiAgICAgICAgdGhpcy5zaG93RW5kR2FtZVdpbmRvdyh3aW5uZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYnVmZk1hbmFnZXIudXBkYXRlVGltZSgpO1xyXG5cclxuICAgIHRoaXMuZmxvYXRpbmdUZXh0LnVwZGF0ZVBvc2l0aW9uKCk7XHJcbiAgfVxyXG5cclxuICByZW5kZXIodGltZXN0YW1wKSB7XHJcbiAgICBjb25zdCBnYW1lU3RhdGUgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lO1xyXG5cclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZShnYW1lU3RhdGUuY3VycmVudExldmVsLmJhY2tncm91bmQsIDAsIDApO1xyXG4gICAgdGhpcy5jb250cm9sUGFuZWwuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24ucmVuZGVyKHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0KSk7XHJcblxyXG4gICAgdGhpcy5idWZmTWFuYWdlci5yZW5kZXIoKTtcclxuXHJcbiAgICBnYW1lU3RhdGUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKGFsbHkgPT4ge1xyXG4gICAgICBjb25zdCBzcHJpdGUgPSBhbGx5LmdldEN1cnJlbnRTcHJpdGUoKTtcclxuICAgICAgc3ByaXRlLnRpY2sodGltZXN0YW1wLCB0aGlzLnByZXZUaW1lU3RhbXApO1xyXG4gICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2Uoc3ByaXRlLmltYWdlLCBzcHJpdGUuZ2V0RnJhbWVYKCksIDAsXHJcbiAgICAgICAgICBzcHJpdGUuZnJhbWVXaWR0aCAtIDEsIHNwcml0ZS5mcmFtZUhlaWdodCxcclxuICAgICAgICAgIGFsbHkueCArIHNwcml0ZS54T2Zmc2V0LCBhbGx5LnksIHNwcml0ZS5mcmFtZVdpZHRoLCBzcHJpdGUuZnJhbWVIZWlnaHQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgZ2FtZVN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzLmZvckVhY2goZW5lbXkgPT4ge1xyXG4gICAgICBjb25zdCBzcHJpdGUgPSBlbmVteS5nZXRDdXJyZW50U3ByaXRlKCk7XHJcbiAgICAgIGNvbnN0IGZyYW1lWCA9IChzcHJpdGUuZnJhbWVXaWR0aCAqIChzcHJpdGUubnVtYmVyT2ZGcmFtZXMgLTEpKVxyXG4gICAgICAgICAgLSBzcHJpdGUuZ2V0RnJhbWVYKCk7XHJcbiAgICAgIHNwcml0ZS50aWNrKHRpbWVzdGFtcCwgdGhpcy5wcmV2VGltZVN0YW1wKTtcclxuICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHNwcml0ZS5pbWFnZSwgZnJhbWVYLCAwLFxyXG4gICAgICAgICAgc3ByaXRlLmZyYW1lV2lkdGgsIHNwcml0ZS5mcmFtZUhlaWdodCxcclxuICAgICAgICAgIGVuZW15LnggKyBzcHJpdGUueE9mZnNldCwgZW5lbXkueSwgc3ByaXRlLmZyYW1lV2lkdGgsIHNwcml0ZS5mcmFtZUhlaWdodCk7XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLmZsb2F0aW5nVGV4dC5yZW5kZXIoKTtcclxuXHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJCR7dGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leX1gLCAxMDIwLCA0MCk7XHJcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtnYW1lU3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyfS8ke2dhbWVTdGF0ZS5udW1iZXJPZkxldmVsc31gLCAxMDIwLCA5MCk7XHJcbiAgICB0aGlzLmhlbHBNZW51QnV0dG9uLnJlbmRlcih0aGlzLmdhbWVDYW52YXMuY29udGV4dCk7XHJcblxyXG4gICAgdGhpcy5kaWFsb2cucmVuZGVyKCk7XHJcblxyXG4gICAgdGhpcy5tdXNpYy5yZW5kZXIoKTtcclxuXHJcbiAgICB0aGlzLnByZXZUaW1lU3RhbXAgPSB0aW1lc3RhbXA7XHJcbiAgfVxyXG5cclxuICBpbml0aWFsaXplKGxldmVsKSB7XHJcbiAgICB0aGlzLmxvYWRMZXZlbChsZXZlbCk7XHJcbiAgICB0aGlzLmNvbnRyb2xQYW5lbC5jcmVhdGVDb250cm9sUGFuZWwobGV2ZWwpO1xyXG4gICAgdGhpcy5hZGRCdWZmTWFuYWdlcigpO1xyXG5cclxuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZTtcclxuICAgIHN0YXRlLmlzUGF1c2VHYW1lID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoIXRoaXMubmV4dEJ1dHRvbikge1xyXG4gICAgICB0aGlzLm5leHRCdXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICB4OiA2NTAsXHJcbiAgICAgICAgeTogMjcwLFxyXG4gICAgICAgIGhlaWdodDogNjEsXHJcbiAgICAgICAgd2lkdGg6IDYxLFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL25leHQtYnV0dG9uLnBuZycsXHJcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygncGxheScpXHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgICAgdGhpcy5idWZmTWFuYWdlci5mdWxsUmVzZXQoKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemUoc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyICsgMSk7XHJcbiAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbnNDbGljaygpO1xyXG4gICAgICAgICAgc3RhdGUucGFzdE1vbmV5ID0gc3RhdGUubW9uZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5wcmV2QnV0dG9uKSB7XHJcbiAgICAgIHRoaXMucHJldkJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgIHg6IDYyMCxcclxuICAgICAgICB5OiAyNzAsXHJcbiAgICAgICAgaGVpZ2h0OiA1NSxcclxuICAgICAgICB3aWR0aDogNTUsXHJcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvVUkvcHJldi1idXR0b24ucG5nJyxcclxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdwcmV2JylcclxuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICB0aGlzLmJ1ZmZNYW5hZ2VyLmZ1bGxSZXNldCgpO1xyXG4gICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2soKTtcclxuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZShzdGF0ZS5jdXJyZW50TGV2ZWwubGV2ZWxOdW1iZXIgLSAxKTtcclxuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMubGV2ZWxzRmFpbGVkKys7XHJcbiAgICAgICAgICBzdGF0ZS5tb25leSA9IHN0YXRlLnBhc3RNb25leTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSBcclxuICAgIGlmICghdGhpcy5yZXBsYXlCdXR0b24pIHtcclxuICAgICAgdGhpcy5yZXBsYXlCdXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICB4OiA2NTAsXHJcbiAgICAgICAgeTogMjcwLFxyXG4gICAgICAgIGhlaWdodDogNTUsXHJcbiAgICAgICAgd2lkdGg6IDU1LFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL3JlcGxheS5wbmcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ3JlcGxheScpXHJcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xyXG4gICAgICAgICAgdGhpcy5idWZmTWFuYWdlci5mdWxsUmVzZXQoKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemUoc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyKTtcclxuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMubGV2ZWxzRmFpbGVkKys7XHJcbiAgICAgICAgICBzdGF0ZS5tb25leSA9IHN0YXRlLnBhc3RNb25leTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIGlmICghdGhpcy5leGl0QnV0dG9uKSB7XHJcbiAgICAgIHRoaXMuZXhpdEJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgIHg6IDQ1MCxcclxuICAgICAgICB5OiAyNzAsXHJcbiAgICAgICAgaGVpZ2h0OiA3MyxcclxuICAgICAgICB3aWR0aDogNjEsXHJcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvVUkvZXhpdC5wbmcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2V4aXQnKTtcclxuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgwKTtcclxuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICB0aGlzLmJ1ZmZNYW5hZ2VyLmZ1bGxSZXNldCgpO1xyXG4gICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2soKTtcclxuICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lID0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5pbnN0YW5jZTtcclxuICAgICAgICAgIHRoaXMubXVzaWMuc3Vic2NyaWJlKCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayguLi50aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5idXR0b25zKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgaWYgKCF0aGlzLmNsb3NlQnV0dG9uKSB7XHJcbiAgICAgIHRoaXMuY2xvc2VCdXR0b24gPSBuZXcgQnV0dG9uKHtcclxuICAgICAgICB4OiAzNTAsXHJcbiAgICAgICAgeTogMjcwLFxyXG4gICAgICAgIGhlaWdodDogNzMsXHJcbiAgICAgICAgd2lkdGg6IDYxLFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL2Nsb3NlLnBuZycsXHJcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnY2xvc2UnKTtcclxuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljayh0aGlzLmNsb3NlQnV0dG9uKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKHRoaXMuZXhpdEJ1dHRvbik7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljayh0aGlzLnJlcGxheUJ1dHRvbik7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmhlbHBNZW51QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICBzdGF0ZS5pc1BhdXNlR2FtZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuaGVscE1lbnVCdXR0b24pIHtcclxuICAgICAgdGhpcy5oZWxwTWVudUJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgIHg6IDEwMjUsXHJcbiAgICAgICAgeTogMTcwLFxyXG4gICAgICAgIGhlaWdodDogNzMsXHJcbiAgICAgICAgd2lkdGg6IDYxLFxyXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL2hlbHAtbWVudS5wbmcnLFxyXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ2hlbHAtbWVudScpO1xyXG4gICAgICAgICAgc3RhdGUuaXNQYXVzZUdhbWUgPSB0cnVlO1xyXG4gICAgICAgICAgdGhpcy5kaWFsb2cucmVzZXQoKTtcclxuICAgICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gIXN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciA/IDU1MCA6IDQ5MDtcclxuICAgICAgICAgIHRoaXMucmVwbGF5QnV0dG9uLnggPSA3NTA7XHJcbiAgICAgICAgICBpZiAoIXN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCdXaGF0IGRvIHlvdSB3YW50IHRvIGRvJywgMzUwLCBbdGhpcy5jbG9zZUJ1dHRvbiwgdGhpcy5leGl0QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbl0pO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLmV4aXRCdXR0b24sIHRoaXMucmVwbGF5QnV0dG9uKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oJ1doYXQgZG8geW91IHdhbnQgdG8gZG8nLCAzNTAsIFt0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLmV4aXRCdXR0b24sIHRoaXMucHJldkJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b25dKTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5jbG9zZUJ1dHRvbiwgdGhpcy5leGl0QnV0dG9uLCB0aGlzLnByZXZCdXR0b24sIHRoaXMucmVwbGF5QnV0dG9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKHRoaXMuaGVscE1lbnVCdXR0b24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIXRoaXMuc3RhdGlzdGljQnV0dG9uKSB7XHJcbiAgICAgIHRoaXMuc3RhdGlzdGljQnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgeDogNjUwLFxyXG4gICAgICAgIHk6IDI3MCxcclxuICAgICAgICBoZWlnaHQ6IDU1LFxyXG4gICAgICAgIHdpZHRoOiA1NSxcclxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9zdGF0aXN0aWMucG5nJyxcclxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHtcclxuICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGF0aXN0aWMnKTtcclxuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMuaW5zdGFuY2U7XHJcbiAgICAgICAgICB0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5zdWJzY3JpYmVPbkNsaWNrKCk7XHJcbiAgICAgICAgICB0aGlzLm11c2ljLnN1YnNjcmliZSgpO1xyXG4gICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuZGlhbG9nLm9wZW4oJycsIDUwMCwgW3RoaXMuc3RhdGUuY3VycmVudFNjZW5lLmV4aXRCdXR0b25dKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbG9hZExldmVsKGxldmVsKSB7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMgPSBbXTtcclxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmVuZW1pZXMgPSBbXTtcclxuXHJcbiAgICBjb25zdCBjdXJyZW50TGV2ZWwgPSBsZXZlbHNbbGV2ZWxdO1xyXG4gICAgY3VycmVudExldmVsLmVuZW1pZXMuZm9yRWFjaChlbnRyeSA9PiB7XHJcbiAgICAgIGNvbnN0IGVuZW15ID0gdGhpcy51bml0RmFjdG9yeS5jcmVhdGUoZW50cnkubmFtZSwgRGlyZWN0aW9uLmxlZnQpO1xyXG4gICAgICB0aGlzLnF1ZXVlLnF1ZXVlRW5lbXkodGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcywgZW5lbXkpO1xyXG4gICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5lbmVtaWVzLnB1c2goZW5lbXkpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZ3JvdW5kTGV2ZWxZID0gY3VycmVudExldmVsLmdyb3VuZExldmVsWTtcclxuXHJcbiAgICBjb25zdCBiYWNrZ3JvdW5kID0gbmV3IEltYWdlKCk7XHJcbiAgICBiYWNrZ3JvdW5kLnNyYyA9IGN1cnJlbnRMZXZlbC5iYWNrZ3JvdW5kO1xyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYmFja2dyb3VuZCA9IGJhY2tncm91bmQ7XHJcblxyXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwubGV2ZWxOdW1iZXIgPSBsZXZlbDtcclxuICB9XHJcblxyXG4gIGFkZEJ1ZmZNYW5hZ2VyKCkge1xyXG4gICAgdGhpcy5idWZmTWFuYWdlci5jcmVhdGVCdXR0b24oKTtcclxuICB9XHJcbiAgXHJcbiAgc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCkge1xyXG4gICAgdGhpcy5jb250cm9sUGFuZWwuc3Vic2NyaWJlKCk7XHJcbiAgICB0aGlzLmJ1ZmZNYW5hZ2VyLnN1YnNjcmliZSgpO1xyXG4gICAgdGhpcy5tdXNpYy5zdWJzY3JpYmUoKTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKHRoaXMuaGVscE1lbnVCdXR0b24pO1xyXG4gIH1cclxuXHJcbiAgZ2V0V2lubmVyKCkge1xyXG4gICAgY29uc3QgZW5lbWllcyA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmVuZW1pZXM7XHJcbiAgICBjb25zdCBub0VuZW1pZXNMZWZ0ID0gIWVuZW1pZXMubGVuZ3RoO1xyXG4gICAgY29uc3QgZW5lbXlSZWFjaGVkTGVmdFNpZGUgPSBlbmVtaWVzWzBdICYmIGVuZW1pZXNbMF0ueCA8IDA7XHJcblxyXG4gICAgaWYgKG5vRW5lbWllc0xlZnQpIHJldHVybiAnYWxsaWVzJztcclxuICAgIGlmIChlbmVteVJlYWNoZWRMZWZ0U2lkZSkgcmV0dXJuICdlbmVtaWVzJztcclxuXHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9XHJcblxyXG4gIHNob3dFbmRHYW1lV2luZG93KHdpbm5lcikge1xyXG4gICAgLy8gdGhpcy5zdGF0ZS5pc1BhdXNlZCA9IHRydWU7XHJcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzUGF1c2VHYW1lID0gdHJ1ZTtcclxuICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XHJcblxyXG4gICAgaWYgKHdpbm5lciA9PT0gJ2FsbGllcycpIHtcclxuICAgICAgICBjb25zdCBpc0xhc3RMZXZlbCA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmxldmVsTnVtYmVyID09PSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm51bWJlck9mTGV2ZWxzIC0gMTtcclxuICAgICAgICBpZiAoaXNMYXN0TGV2ZWwpIHtcclxuICAgICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gNDUwO1xyXG4gICAgICAgICAgdGhpcy5kaWFsb2cub3BlbignR2FtZSBvdmVyLiBUaGFua3MgZm9yIHBsYXlpbmcgOiknLCAyNjAgLCBbdGhpcy5leGl0QnV0dG9uLCB0aGlzLnN0YXRpc3RpY0J1dHRvbl0pO1xyXG4gICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5leGl0QnV0dG9uLCB0aGlzLnN0YXRpc3RpY0J1dHRvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gNDUwO1xyXG4gICAgICAgICAgdGhpcy5kaWFsb2cub3BlbignWW91IHdpbiEnLCA0OTUgLCBbdGhpcy5uZXh0QnV0dG9uLCB0aGlzLmV4aXRCdXR0b25dKTtcclxuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKHRoaXMubmV4dEJ1dHRvbiwgdGhpcy5leGl0QnV0dG9uKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGJvbnVzTW9uZXkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciAqIDIgKyAxO1xyXG4gICAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5ICs9IGJvbnVzTW9uZXk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUucGFzdE1vbmV5ID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leTtcclxuICAgICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gNDUwO1xyXG4gICAgICAgIHRoaXMucmVwbGF5QnV0dG9uLnggPSA2NTA7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5yZXBsYXlCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbik7XHJcbiAgICAgICAgdGhpcy5kaWFsb2cub3BlbignWW91IGxvb3NlIDooIFRyeSBhZ2FpbiEnLCAzNzAgLCBbdGhpcy5yZXBsYXlCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbl0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NjZW5lcy9nYW1lLnNjZW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgQnV0dG9uIGZyb20gJy4uL2NvbnRyb2xzL2J1dHRvbic7XHJcbmltcG9ydCBwYXJhbWV0ZXJzT2ZVbml0QnV0dG9ucyBmcm9tICcuL3BhcmFtZXRlcnMtdW5pdC1idXR0b25zJztcclxuaW1wb3J0IFVuaXRGYWN0b3J5IGZyb20gJy4uL3VuaXQtZmFjdG9yeS91bml0LWZhY3RvcnknO1xyXG5pbXBvcnQgUXVldWUgZnJvbSAnLi4vcXVldWUvcXVldWUnO1xyXG5pbXBvcnQgRGlyZWN0aW9uIGZyb20gJy4uL3VuaXQvZGlyZWN0aW9uJztcclxuaW1wb3J0IHNvdW5kQnV0dG9uIGZyb20gJy4vcGFyYW1ldGVycy1oZWxwLWJ1dHRvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250cm9sUGFuZWwge1xyXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsIGdhbWVDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMgPSBnYW1lQ2FudmFzO1xyXG4gICAgICAgIHRoaXMudW5pdEZhY3RvcnkgPSBVbml0RmFjdG9yeS5nZXRTaW5nbGV0b25JbnN0YW5jZSgpO1xyXG4gICAgICAgIHRoaXMucXVldWUgPSBuZXcgUXVldWUoc3RhdGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbnRyb2xQYW5lbChsZXZlbCkge1xyXG4gICAgICAgIGxldmVsID0gbGV2ZWwgPiA0ID8gNCA6IGxldmVsOyAvLyBUT0RPOiA/Pz9cclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBwYXJhbWV0ZXJzT2ZVbml0QnV0dG9uc1tsZXZlbF0ubWFwKGJ1dHRvblBhcmFtID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICB4OiBidXR0b25QYXJhbS54LFxyXG4gICAgICAgICAgICAgICAgeTogYnV0dG9uUGFyYW0ueSxcclxuICAgICAgICAgICAgICAgIHdpZHRoOiBidXR0b25QYXJhbS53aWR0aCxcclxuICAgICAgICAgICAgICAgIGhlaWdodDogYnV0dG9uUGFyYW0uaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgaWNvblVybDogYnV0dG9uUGFyYW0uaW1nVXJsLFxyXG4gICAgICAgICAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLmNyZWF0ZVVuaXQoYnV0dG9uUGFyYW0ubmFtZSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBidXR0b247XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlVW5pdChuYW1lKSB7XHJcbiAgICAgICAgY29uc3QgYWxseVVuaXQgPSB0aGlzLnVuaXRGYWN0b3J5LmNyZWF0ZShuYW1lLCBEaXJlY3Rpb24ucmlnaHQpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leSA+PSBhbGx5VW5pdC5jb3N0KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgLT0gYWxseVVuaXQuY29zdDtcclxuICAgICAgICAgICAgdGhpcy5xdWV1ZS5xdWV1ZUFsbHkodGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLCBhbGx5VW5pdCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcy5wdXNoKGFsbHlVbml0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuZGlhbG9nLmNsb3NlKCk7IC8vIFRPRE86IG1iIG5lZWQgdG8gbW92ZVxyXG4gICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuaXNQYXVzZUdhbWUgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBzdWJzY3JpYmUoKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2soLi4udGhpcy5idXR0b25zKTtcclxuICAgIH1cclxufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2NvbnRyb2wtcGFuZWwvY29udHJvbC1wYW5lbC5qc1xuLy8gbW9kdWxlIGlkID0gMjVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgcGFyYW1ldGVyc09mVW5pdEJ1dHRvbnMgPSBbXHJcbiAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3dpemFyZCcsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvd2l6YXJkL3dpemFyZC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDkwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdibG9iJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9ibG9iL2Jsb2ItaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAxNjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ3JvZ3VlJyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIzMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAna25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9rbmlnaHQva25pZ2h0LWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMzAwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdiYW5kaXQnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2JhbmRpdC9iYW5kaXQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAzNzAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDQ0MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2Jsb2InLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2Jsb2IvYmxvYi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDkwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXSxcclxuICAgIFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdza2VsZXRvbicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAyMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnYmxvYicsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvYmxvYi9ibG9iLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogOTAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2NvdW50cnkta25pZ2h0JyxcclxuICAgICAgICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDE2MCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2Jsb2InLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2Jsb2IvYmxvYi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDkwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdjb3VudHJ5LWtuaWdodCcsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAxNjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2tuaWdodCcsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIzMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH1cclxuICAgIF0sXHJcbiAgICBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAnc2tlbGV0b24nLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2Jsb2InLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2Jsb2IvYmxvYi1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDkwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICAgIG5hbWU6ICdjb3VudHJ5LWtuaWdodCcsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQtaWNvbi5wbmcnLFxyXG4gICAgICAgICAgICB4OiAxNjAsXHJcbiAgICAgICAgICAgIHk6IDIwLFxyXG4gICAgICAgICAgICB3aWR0aDogMzAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDBcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgICAgbmFtZTogJ2tuaWdodCcsXHJcbiAgICAgICAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pY29uLnBuZycsXHJcbiAgICAgICAgICAgIHg6IDIzMCxcclxuICAgICAgICAgICAgeTogMjAsXHJcbiAgICAgICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA0MFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgICBuYW1lOiAncm9ndWUnLFxyXG4gICAgICAgICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3JvZ3VlL3JvZ3VlLWljb24ucG5nJyxcclxuICAgICAgICAgICAgeDogMzAwLFxyXG4gICAgICAgICAgICB5OiAyMCxcclxuICAgICAgICAgICAgd2lkdGg6IDMwLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IDQwXHJcbiAgICAgICAgfVxyXG4gICAgXVxyXG5dO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgcGFyYW1ldGVyc09mVW5pdEJ1dHRvbnM7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29udHJvbC1wYW5lbC9wYXJhbWV0ZXJzLXVuaXQtYnV0dG9ucy5qc1xuLy8gbW9kdWxlIGlkID0gMjZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3Qgc291bmRCdXR0b24gPSB7XHJcbiAgICAgICAgbmFtZTogJ3NvdW5kJyxcclxuICAgICAgICBmaXJzdFVybDogJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1vbi5wbmcnLFxyXG4gICAgICAgIHNlY29uZFVybDogJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1vZmYucG5nJyxcclxuICAgICAgICB4OiAxMDIwLFxyXG4gICAgICAgIHk6IDYwLFxyXG4gICAgICAgIHdpZHRoOiAzMCxcclxuICAgICAgICBoZWlnaHQ6IDMwXHJcbiAgICB9XHJcblxyXG5leHBvcnQgZGVmYXVsdCBzb3VuZEJ1dHRvbjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb250cm9sLXBhbmVsL3BhcmFtZXRlcnMtaGVscC1idXR0b24uanNcbi8vIG1vZHVsZSBpZCA9IDI3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBCdXR0b24gZnJvbSAnLi4vY29udHJvbHMvYnV0dG9uJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEJ1ZmZNYW5hZ2VyIHtcclxuICAgIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5idXR0b25zID0gbnVsbDtcclxuICAgICAgICB0aGlzLnN0YXRlID0gc3RhdGU7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzID0gZ2FtZUNhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5idWZmSWQgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLmZ1bGxSZXNldCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUJ1dHRvbigpIHtcclxuICAgICAgICB0aGlzLmJ1dHRvbnMgPSB0aGlzLmdldFBhcmFtZXRlcnNPZkJ1ZmZCdXR0b24oKS5tYXAoYnRuID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgICAgICAgICB4OiBidG4ueCxcclxuICAgICAgICAgICAgICAgIHk6IGJ0bi55LFxyXG4gICAgICAgICAgICAgICAgaGVpZ2h0OiBidG4uaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgd2lkdGg6IGJ0bi53aWR0aCxcclxuICAgICAgICAgICAgICAgIGljb25Vcmw6IGJ0bi5pY29uVXJsLFxyXG4gICAgICAgICAgICAgICAgY2xpY2tIYW5kbGVyOiBidG4uY2xpY2tIYW5kbGVyXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGltcHJvdmVXZWFwb24oKSB7IC8vIFRPRE86IHByb2JsZW0gd2l0aCBtdWx0eUJ1ZmZcclxuICAgICAgICBpZiAodGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leSA+PSAzKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKHVuaXQgPT4ge1xyXG4gICAgICAgICAgICAgICAgdW5pdC5kYW1hZ2UrKztcclxuICAgICAgICAgICAgICAgIHVuaXQud2VhcG9uSWRCdWZmLnB1c2godGhpcy5idWZmSWQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMud2VhcG9uQnVmZnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5idWZmSWQrKyxcclxuICAgICAgICAgICAgICAgIHdlYXBvblN0YXJ0OiBEYXRlLm5vdygpLFxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC43LFxyXG4gICAgICAgICAgICAgICAgZmFkZUluOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgLT0gMztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaW1wcm92ZUFybW9yKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5ID49IDUpIHtcclxuICAgICAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmZvckVhY2godW5pdCA9PiB7XHJcbiAgICAgICAgICAgICAgICB1bml0LmhlYWx0aCArPSA1O1xyXG4gICAgICAgICAgICAgICAgdW5pdC5hcm1vcklkQnVmZi5wdXNoKHRoaXMuYnVmZklkKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmFybW9yQnVmZnMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZDogdGhpcy5idWZmSWQsXHJcbiAgICAgICAgICAgICAgICBhcm1vclN0YXJ0OiBEYXRlLm5vdygpLFxyXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMC43LFxyXG4gICAgICAgICAgICAgICAgZmFkZUluOiBmYWxzZVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgLT0gNTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgd2VhcG9uUmVzZXQoKSB7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmZvckVhY2godW5pdCA9PiB7XHJcbiAgICAgICAgICAgIGlmICh1bml0LndlYXBvbklkQnVmZi5sZW5ndGggJiYgdW5pdC53ZWFwb25JZEJ1ZmZbMF0gPT09IHRoaXMud2VhcG9uQnVmZnNbMF0uaWQpIHtcclxuICAgICAgICAgICAgICAgIHVuaXQuZGFtYWdlLS07XHJcbiAgICAgICAgICAgICAgICB1bml0LndlYXBvbklkQnVmZi5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMud2VhcG9uQnVmZnMuc2hpZnQoKTtcclxuICAgIH1cclxuXHJcbiAgICBhcm1vclJlc2V0KCkge1xyXG4gICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKHVuaXQgPT4ge1xyXG4gICAgICAgICAgICBpZiAodW5pdC5hcm1vcklkQnVmZi5sZW5ndGggJiYgdW5pdC5hcm1vcklkQnVmZlswXSA9PT0gdGhpcy5hcm1vckJ1ZmZzWzBdLmlkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodW5pdC5oZWFsdGggPiA1KSB1bml0LmhlYWx0aCAtPSA1O1xyXG4gICAgICAgICAgICAgICAgZWxzZSB1bml0LmhlYWx0aCA9IDE7XHJcblxyXG4gICAgICAgICAgICAgICAgdW5pdC5hcm1vcklkQnVmZi5zaGlmdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYXJtb3JCdWZmcy5zaGlmdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bGxSZXNldCgpIHtcclxuICAgICAgICB0aGlzLndlYXBvbkJ1ZmZzID0gW107XHJcbiAgICAgICAgdGhpcy5hcm1vckJ1ZmZzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVGltZSgpIHtcclxuICAgICAgICBpZiAodGhpcy53ZWFwb25CdWZmcy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgY29uc3QgcGFzc2VkV2VhcG9uVGltZSA9IERhdGUubm93KCkgLSB0aGlzLndlYXBvbkJ1ZmZzWzBdLndlYXBvblN0YXJ0O1xyXG4gICAgICAgICAgICBjb25zdCBidWZmRHVyYXRpb24gPSAzMDAwMDtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXNzZWRXZWFwb25UaW1lID4gYnVmZkR1cmF0aW9uKSB0aGlzLndlYXBvblJlc2V0KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLndlYXBvbkJ1ZmZzLmZvckVhY2goYnVmZiA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkZWx0YSA9IGJ1ZmYuZmFkZUluID8gMC4wMSA6IC0wLjAxO1xyXG4gICAgICAgICAgICAgICAgYnVmZi5vcGFjaXR5ICs9IGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1ZmYub3BhY2l0eSA8IDAuMSkgYnVmZi5mYWRlSW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnVmZi5vcGFjaXR5ID4gMC43KSBidWZmLmZhZGVJbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmFybW9yQnVmZnMubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBhc3NlZEFybW9yVGltZSA9IERhdGUubm93KCkgLSB0aGlzLmFybW9yQnVmZnNbMF0uYXJtb3JTdGFydDtcclxuICAgICAgICAgICAgY29uc3QgYnVmZkR1cmF0aW9uID0gMjAwMDA7XHJcblxyXG4gICAgICAgICAgICBpZiAocGFzc2VkQXJtb3JUaW1lID4gYnVmZkR1cmF0aW9uKSB0aGlzLmFybW9yUmVzZXQoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuYXJtb3JCdWZmcy5mb3JFYWNoKGJ1ZmYgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGVsdGEgPSBidWZmLmZhZGVJbiA/IDAuMDE1IDogLTAuMDE1O1xyXG4gICAgICAgICAgICAgICAgYnVmZi5vcGFjaXR5ICs9IGRlbHRhO1xyXG4gICAgICAgICAgICAgICAgaWYgKGJ1ZmYub3BhY2l0eSA8IDAuMSkgYnVmZi5mYWRlSW4gPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoYnVmZi5vcGFjaXR5ID4gMC43KSBidWZmLmZhZGVJbiA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKC4uLnRoaXMuYnV0dG9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24ucmVuZGVyKHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0KSk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZvbnQgPSAnMjJweCBQaXhlbGF0ZSc7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJyQzJywgNTAsIDE0MCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJyQ1JywgNTAsIDIxMCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucmVzdG9yZSgpO1xyXG5cclxuICAgICAgICBjb25zdCB3ZWFwb25CdG4gPSB0aGlzLmJ1dHRvbnNbMF07XHJcbiAgICAgICAgdGhpcy53ZWFwb25CdWZmcy5mb3JFYWNoKChidWZmLCBwb3NpdGlvbikgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5zYXZlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gYnVmZi5vcGFjaXR5O1xyXG4gICAgICAgICAgICBjb25zdCBidWZmWFBvc2l0aW9uID0gd2VhcG9uQnRuLnggKyA3MCAqIChwb3NpdGlvbiArIDEpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2Uod2VhcG9uQnRuLmljb24sIGJ1ZmZYUG9zaXRpb24sIHdlYXBvbkJ0bi55KTtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucmVzdG9yZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBjb25zdCBhcm1vckJ0biA9IHRoaXMuYnV0dG9uc1sxXTtcclxuICAgICAgICB0aGlzLmFybW9yQnVmZnMuZm9yRWFjaCgoYnVmZiwgcG9zaXRpb24pID0+IHtcclxuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuc2F2ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5nbG9iYWxBbHBoYSA9IGJ1ZmYub3BhY2l0eTtcclxuICAgICAgICAgICAgY29uc3QgYnVmZlhQb3NpdGlvbiA9IGFybW9yQnRuLnggKyA3MCAqIChwb3NpdGlvbiArIDEpO1xyXG4gICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UoYXJtb3JCdG4uaWNvbiwgYnVmZlhQb3NpdGlvbiwgYXJtb3JCdG4ueSk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnJlc3RvcmUoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQYXJhbWV0ZXJzT2ZCdWZmQnV0dG9uKCkge1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIG5hbWU6ICdhcm0nLCBpY29uVXJsOiAnaW1ncy9idWZmLWljb24vd2VhcG9uLnBuZycsXHJcbiAgICAgICAgICAgICAgICB4OiAyMCwgeTogOTAsIHdpZHRoOiAzMCwgaGVpZ2h0OiA0MCxcclxuICAgICAgICAgICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4gdGhpcy5pbXByb3ZlV2VhcG9uKClcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2FybW9yJywgaWNvblVybDogJ2ltZ3MvYnVmZi1pY29uL2FybW9yLnBuZycsXHJcbiAgICAgICAgICAgICAgICB4OiAyMCwgeTogMTYwLCB3aWR0aDogMzAsIGhlaWdodDogNDAsXHJcbiAgICAgICAgICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHRoaXMuaW1wcm92ZUFybW9yKClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIF07XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWZmLW1hbmFnZXIvYnVmZi1tYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAyOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgQnV0dG9uIGZyb20gJy4uL2NvbnRyb2xzL2J1dHRvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNdXNpYyB7XHJcbiAgICBjb25zdHJ1Y3RvcihnYW1lQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzID0gZ2FtZUNhbnZhcztcclxuICAgICAgICB0aGlzLmNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZE11c2ljKCkge1xyXG4gICAgICAgIHRoaXMubXVzaWMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYXVkaW9cIik7XHJcbiAgICAgICAgdGhpcy5tdXNpYy5zcmMgPSAnbXVzaWMvYmFja2dyb3VuZC1tdXNpYy53YXYnO1xyXG4gICAgICAgIHRoaXMubXVzaWMuc2V0QXR0cmlidXRlKFwicHJlbG9hZFwiLCBcImF1dG9cIik7XHJcbiAgICAgICAgdGhpcy5tdXNpYy5zZXRBdHRyaWJ1dGUoXCJjb250cm9sc1wiLCBcIm5vbmVcIik7XHJcbiAgICAgICAgdGhpcy5tdXNpYy5zZXRBdHRyaWJ1dGUoXCJsb29wXCIsIFwidHJ1ZVwiKTtcclxuICAgICAgICB0aGlzLm11c2ljLnN0eWxlLmRpc3BsYXkgPSBcIm5vbmVcIjtcclxuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNTtcclxuXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm11c2ljKTtcclxuXHJcbiAgICAgICAgdGhpcy5tdXNpYy5wbGF5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLmJ1dHRvbi5pY29uLCB0aGlzLmJ1dHRvbi54LCB0aGlzLmJ1dHRvbi55KTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0aWFsaXplKCkge1xyXG4gICAgICAgIGNvbnN0IG11c2ljT24gPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBtdXNpY09uLnNyYyA9ICdpbWdzL1VJL211c2ljLWljb24vc291bmQtb24ucG5nJztcclxuXHJcbiAgICAgICAgY29uc3QgbXVzaWNIYWxmT24gPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBtdXNpY0hhbGZPbi5zcmMgPSAnaW1ncy9VSS9tdXNpYy1pY29uL3NvdW5kLWhhbGYtb24ucG5nJztcclxuXHJcbiAgICAgICAgY29uc3QgbXVzaWNPZmYgPSBuZXcgSW1hZ2UoKTtcclxuICAgICAgICBtdXNpY09mZi5zcmMgPSAnaW1ncy9VSS9tdXNpYy1pY29uL3NvdW5kLW9mZi5wbmcnO1xyXG5cclxuICAgICAgICB0aGlzLnN0YXRlID0gW211c2ljT24sIG11c2ljSGFsZk9uLCBtdXNpY09mZl07XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9uID0gbmV3IEJ1dHRvbih7XHJcbiAgICAgICAgICAgIHg6IDk1MCxcclxuICAgICAgICAgICAgeTogMTAsXHJcbiAgICAgICAgICAgIGhlaWdodDogNDAsXHJcbiAgICAgICAgICAgIHdpZHRoOiA0MCxcclxuICAgICAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLnRvZ2dsZSgpXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuYnV0dG9uLmljb24gPSB0aGlzLnN0YXRlW3RoaXMuY291bnRlcl07XHJcbiAgICAgICAgdGhpcy5hZGRNdXNpYygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZSgpIHtcclxuICAgICAgICB0aGlzLmNvdW50ZXIgPSArK3RoaXMuY291bnRlciAlIDM7XHJcbiAgICAgICAgdGhpcy5idXR0b24uaWNvbiA9IHRoaXMuc3RhdGVbdGhpcy5jb3VudGVyXTtcclxuICAgICAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNSAtIHRoaXMuY291bnRlciAvIDQ7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlKCkge1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKHRoaXMuYnV0dG9uKTtcclxuICAgIH1cclxuXHJcbiAgICB1bnN1YnNjcmliZSgpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljayh0aGlzLmJ1dHRvbik7XHJcbiAgICB9XHJcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9tdXNpYy9tdXNpYy5qc1xuLy8gbW9kdWxlIGlkID0gMjlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgU2NlbmVCYXNlIH0gZnJvbSBcIi4vc2NlbmUuYmFzZVwiO1xyXG5pbXBvcnQgRGlhbG9nIGZyb20gJy4uL2RpYWxvZy9kaWFsb2cnO1xyXG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2NvbnRyb2xzL2J1dHRvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0aXN0aWNTY2VuZSBleHRlbmRzIFNjZW5lQmFzZSB7IC8vIFRPRE86IHJlbmFtZVxyXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKSB7XHJcbiAgICAgICAgc3VwZXIoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcclxuICAgICAgICB0aGlzLmRpYWxvZyA9IG5ldyBEaWFsb2coZ2FtZUNhbnZhcy5jb250ZXh0KTtcclxuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTdGF0ZSh0aW1lc3RhbXApIHtcclxuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYztcclxuICAgICAgICBpZiAoIXN0YXRlLnRpbWVTcGVudCkge1xyXG4gICAgICAgICAgICBzdGF0ZS50aW1lU3BlbnQgPSAodGltZXN0YW1wIC8gNjAwMDApLnRvRml4ZWQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljO1xyXG5cclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2Uoc3RhdGUuYmFja2dyb3VuZCwgMCwgMCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdTdGF0aXN0aWNzJywgNDgwLCAxMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdUaW1lIHNwZW50JywgMTgwLCAyMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLnRpbWVTcGVudH0gbWludXRlc2AsIDc1MCwgMjAwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnTGV2ZWxzIGZhaWxlZCcsIDE4MCwgMjUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtzdGF0ZS5sZXZlbHNGYWlsZWR9IGxldmVsc2AsIDc1MCwgMjUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnVG90YWwgZGFtYWdlJywgMTgwLCAzMDApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLnRvdGFsRGFtYWdlfSBkbWdgLCA3NTAsIDMwMCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJ1RvdGFsIHJlY2VpdmVkIGRhbWFnZScsIDE4MCwgMzUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtzdGF0ZS5yZWNlaXZlZERhbWFnZX0gZG1nYCwgNzUwLCAzNTApO1xyXG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdNb25leSBlYXJuZWQnLCAxODAsIDQwMCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7c3RhdGUuZWFybmVkTW9uZXl9ICRgLCA3NTAsIDQwMCk7XHJcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJ1RvdGFsIGhwIGhlYWxlZCcsIDE4MCwgNDUwKTtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtzdGF0ZS5oZWFsZWRIcH0gaHBgLCA3NTAsIDQ1MCk7XHJcblxyXG4gICAgICAgIHRoaXMuZGlhbG9nLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRpYWxpemUoKSB7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kID0gbmV3IEltYWdlKCk7XHJcbiAgICAgICAgdGhpcy5iYWNrZ3JvdW5kLnNyYyA9ICcuL2ltZ3MvYmFja2dyb3VuZHMvc3RhdGlzdGljLmpwZyc7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmJhY2tncm91bmQgPSB0aGlzLmJhY2tncm91bmQ7XHJcblxyXG4gICAgICAgIHRoaXMuZXhpdEJ1dHRvbiA9IG5ldyBCdXR0b24oe1xyXG4gICAgICAgICAgICB4OiA1NTAsXHJcbiAgICAgICAgICAgIHk6IDUwMCxcclxuICAgICAgICAgICAgaGVpZ2h0OiA3MyxcclxuICAgICAgICAgICAgd2lkdGg6IDYxLFxyXG4gICAgICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9leGl0LnBuZycsXHJcbiAgICAgICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2V4aXQnKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuaW5zdGFuY2UuaW5pdGlhbGl6ZSgwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lmluc3RhbmNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5tdXNpYy5zdWJzY3JpYmUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKC4uLnRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmJ1dHRvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc3Vic2NyaWJlT25DbGljaygpIHtcclxuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmV4aXRCdXR0b24pO1xyXG4gICAgfVxyXG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc2NlbmVzL3N0YXRpc3RpYy5qc1xuLy8gbW9kdWxlIGlkID0gMzBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==