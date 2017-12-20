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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__actions__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__sprites__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__direction__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__floating_text_floating_text__ = __webpack_require__(7);





class Unit {
  constructor(unitInfo) {
    if (!unitInfo) throw new Error('No unit info');

    this.id = unitInfo.id;
    this.health = unitInfo.health;
    this.damage = unitInfo.damage;
    this.rangeAttack = unitInfo.rangeAttack || 0;
    this.criticalChance = unitInfo.criticalChance || 0;
    this.accuracy = unitInfo.accuracy || 0.9;
    this.idleTime = unitInfo.idleTime || 2000;
    this.attackTime = unitInfo.attackTime;
    this.timeToHit = unitInfo.timeToHit;
    this.deathTime = unitInfo.deathTime;
    this.stepSize = unitInfo.stepSize;
    this.direction = unitInfo.direction;

    this.sprites = new __WEBPACK_IMPORTED_MODULE_1__sprites__["a" /* default */]();
    this.floatingText = __WEBPACK_IMPORTED_MODULE_3__floating_text_floating_text__["a" /* default */].getSingletonInstance();

    this.playersUnit = this.direction === __WEBPACK_IMPORTED_MODULE_2__direction__["a" /* default */].right;
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
      return false;
    } else if (this.isInFrontOfAlly(state) || state.isPauseGame
      || (this.isInFrontOfEnemy(state) && this.isEnemyDying(state))) {
      this.idle(state, timestamp);
    } else if (this.isInFrontOfEnemy(state)) {
      this.attack(state, timestamp);
    } else {
      this.step(state, timestamp);
    }
  }

  // #region actions

  step(state, timestamp) {
    if (this.currentAction !== __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].step) {
      this.currentAction = __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].step;
      this.previousActionTimestamp = timestamp;
      this.sprites.walk.reset();
      this.updateY(state);
    } else if (this.direction === __WEBPACK_IMPORTED_MODULE_2__direction__["a" /* default */].right) {
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
      const isCriticalHit = Math.random() <= this.criticalChance;
      const isMissHit = Math.random() > this.accuracy;
      if (this.playersUnit) {
        if (isCriticalHit && !isMissHit) {
          state.currentLevel.enemies[0].health -= this.damage * 2;
          state.instance.state.scenes.statistic.totalDamage += this.damage * 2;
        } else if (!isCriticalHit && !isMissHit) {
          state.currentLevel.enemies[0].health -= this.damage;
          state.instance.state.scenes.statistic.totalDamage++;
        }

        const positionX = state.currentLevel.enemies[0].x
          + state.currentLevel.enemies[0].sprites.walk.bodyXOffset;

        this.floatingText.add({
          text: isCriticalHit ? this.damage * 2 : this.damage,
          positionX,
          positionY: state.currentLevel.enemies[0].y,
          action: __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].attack,
          isCriticalHit,
          isMissHit,
        });
      } else {
        if (isCriticalHit && !isMissHit) {
          state.currentLevel.allies[0].health -= this.damage * 2;
          state.instance.state.scenes.statistic.receivedDamage += this.damage * 2;
        } else if (!isCriticalHit && !isMissHit) {
          state.currentLevel.allies[0].health -= this.damage;
          state.instance.state.scenes.statistic.receivedDamage++;
        }

        const positionX = state.currentLevel.allies[0].x
          + state.currentLevel.allies[0].sprites.walk.bodyXOffset;

        this.floatingText.add({
          text: isCriticalHit ? this.damage * 2 : this.damage,
          positionX,
          positionY: state.currentLevel.allies[0].y,
          action: __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].attack,
          isCriticalHit,
          isMissHit,
        });
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
          positionX,
          positionY: state.currentLevel.enemies[0].y,
          action: __WEBPACK_IMPORTED_MODULE_0__actions__["a" /* default */].die,
        });

        state.instance.state.scenes.statistic.earnedMoney += bonusMoney;
        state.currentLevel.enemies.shift();
      }
    }
  }

  // #endregion
  // #region helpers

  isInFrontOfEnemy(state) {
    if (this.playersUnit) {
      const opponent = state.currentLevel.enemies[0];
      const xImpactArea = this.x + this.getCurrentSprite().bodyXOffset + this.rangeAttack;
      return opponent && xImpactArea >= opponent.x + opponent.getCurrentSprite().bodyXOffset;
    }

    const opponent = state.currentLevel.allies[0];
    const xImpactArea = (this.x + this.getCurrentSprite().bodyXOffset) - this.rangeAttack;
    return opponent && xImpactArea <= opponent.x + opponent.getCurrentSprite().bodyXOffset;
  }

  isEnemyDying(state) {
    if (this.playersUnit && state.currentLevel.enemies.length) {
      return state.currentLevel.enemies[0].health <= 0;
    } else if (!this.playersUnit && state.currentLevel.allies.length) {
      return state.currentLevel.allies[0].health <= 0;
    }
  }

  isInFrontOfAlly(state) {
    if (this.playersUnit) {
      const nextAlly = state.currentLevel.allies[this.getUnitPosition(state) - 1];
      return nextAlly && this.x + this.getCurrentSprite().frameWidth >= nextAlly.x;
    }

    const nextAlly = state.currentLevel.enemies[this.getUnitPosition(state) - 1];
    return nextAlly && this.x <= nextAlly.x + nextAlly.getCurrentSprite().frameWidth;
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

  // #endregion
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
class SceneBase {
  constructor(state, gameCanvas, music) {
    this.state = state;
    this.gameCanvas = gameCanvas;
    this.music = music;
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
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Actions = {
  idle: 'idle',
  step: 'step',
  attack: 'attack',
  die: 'die',
  heal: 'heal',
};

/* harmony default export */ __webpack_exports__["a"] = (Actions);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Direction = {
  left: 'left',
  right: 'right',
};

/* harmony default export */ __webpack_exports__["a"] = (Direction);


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__units_skeleton_skeleton__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__units_knight_knight__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__units_country_knight_country_knight__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__units_rogue_rogue__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__units_blob_blob__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__units_wizard_wizard__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__units_bandit_bandit__ = __webpack_require__(26);








class UnitFactory {
  constructor() {
    this.id = 0;
  }

  static getSingletonInstance() {
    if (!UnitFactory.instance) UnitFactory.instance = new UnitFactory();
    return UnitFactory.instance;
  }

  create(unitName, direction) {
    switch (unitName) {
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
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_actions__ = __webpack_require__(4);


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
    if (unit.isMissHit) unit.text = 'miss';
    else if (unit.isCriticalHit) unit.text = `${unit.text}!`;

    this.state.push({
      text: unit.text,
      positionX: unit.positionX,
      positionY: unit.positionY,
      action: unit.action,
      isCriticalHit: unit.isCriticalHit,
      isMissHit: unit.isMissHit,
      opacity: 1,
    });
  }

  render() {
    this.state.forEach((textParam) => {
      this.context.save();
      this.context.font = '14px Pixelate';

      if (textParam.isMissHit) {
        this.context.font = '10px Pixelate';
        const purpleColor = `rgba(223, 215, 215, ${textParam.opacity})`;
        this.context.fillStyle = purpleColor;
      } else if (textParam.action === __WEBPACK_IMPORTED_MODULE_0__unit_actions__["a" /* default */].attack && !textParam.isCriticalHit) {
        const redColor = `rgba(248, 22, 97, ${textParam.opacity})`;
        this.context.fillStyle = redColor;
      } else if (textParam.action === __WEBPACK_IMPORTED_MODULE_0__unit_actions__["a" /* default */].attack && textParam.isCriticalHit) {
        this.context.font = '20px Pixelate';
        const redColor = `rgba(248, 22, 97, ${textParam.opacity})`;
        this.context.fillStyle = redColor;
      } else if (textParam.action === __WEBPACK_IMPORTED_MODULE_0__unit_actions__["a" /* default */].heal) {
        const greenColor = `rgba(117, 248, 48, ${textParam.opacity})`;
        this.context.fillStyle = greenColor;
      } else {
        const white = `rgba(255, 255, 255, ${textParam.opacity})`;
        this.context.fillStyle = white;
      }
      this.context.fillText(`${textParam.text}`, textParam.positionX, textParam.positionY);
      this.context.restore();
    });
  }

  updatePosition() {
    this.state.forEach((text) => {
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
    if (this.shiftRight) this.shift += 0.03;
    else this.shift -= 0.03;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FloatingText;



/***/ }),
/* 8 */
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
      allies.forEach((allyUnit) => {
        if (horizontalPosition > allyUnit.x) horizontalPosition = allyUnit.x;
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
      enemies.forEach((enemyUnit) => {
        if (horizontalPosition < enemyUnit.x) horizontalPosition = enemyUnit.x;
      });

      enemy.x = horizontalPosition + 50;
      enemy.y = this.state.scenes.game.groundLevelY;
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Queue;



/***/ }),
/* 9 */
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
        this.context.fillText(this.message, this.messageX, 200);
        this.buttons.forEach(button => button.render(this.context));
        this.context.restore();
      } else {
        this.message = '';
        this.messageX = 0;
        this.buttons = [];
      }
    } else {
      if (this.opacity <= 1) this.opacity += 0.01;
      this.context.save();
      this.context.globalAlpha = this.opacity;
      this.context.fillText(this.message, this.messageX, 200);
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
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__game_canvas_game_canvas__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__state_state__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__scenes_menu_scene__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__scenes_game_scene__ = __webpack_require__(15);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__music_music__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__scenes_statistic_scene__ = __webpack_require__(31);







window.onload = () => {
  const state = new __WEBPACK_IMPORTED_MODULE_1__state_state__["a" /* default */]();
  const gameCanvas = new __WEBPACK_IMPORTED_MODULE_0__game_canvas_game_canvas__["a" /* default */]();
  const music = new __WEBPACK_IMPORTED_MODULE_4__music_music__["a" /* default */](gameCanvas);
  const menuScene = new __WEBPACK_IMPORTED_MODULE_2__scenes_menu_scene__["a" /* default */](state, gameCanvas, music);
  const gameScene = new __WEBPACK_IMPORTED_MODULE_3__scenes_game_scene__["a" /* default */](state, gameCanvas, music);
  const statisticScene = new __WEBPACK_IMPORTED_MODULE_5__scenes_statistic_scene__["a" /* default */](state, gameCanvas, music);

  state.scenes.menu.instance = menuScene;
  state.scenes.game.instance = gameScene;
  state.scenes.statistic.instance = statisticScene;
  state.currentScene = menuScene;

  ((function frame(timestamp) {
    state.currentScene.frame(timestamp);
    requestAnimationFrame(frame);
  })());
};


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class GameCanvas {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas';
    this.canvas.width = 1100;
    this.canvas.height = 700;
    this.context = this.canvas.getContext('2d');
    this.context.font = '30px Pixelate';
    this.context.fillStyle = 'white';

    this.cursor = new Image();
    this.cursor.src = 'imgs/UI/cursor.png';
    // this.img = 'url("imgs/UI/cursor.png"), auto';

    this.clickSubscribers = [];

    document.body.appendChild(this.canvas);

    this.canvas.addEventListener('click', (e) => {
      this.executeClickHandlers(e);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      this.changeMouse(e);
    });
  }

  subscribeOnClick(...subscribers) {
    subscribers.forEach(subscriber => this.clickSubscribers.push(subscriber));
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

  executeClickHandlers(e) {
    const x = e.clientX - this.canvas.getBoundingClientRect().left;
    const y = e.clientY - this.canvas.getBoundingClientRect().top;
    this.clickSubscribers.forEach((subscriber) => {
      const clickedInsideSubscriber = subscriber.x <= x
        && subscriber.x + subscriber.width >= x
        && subscriber.y <= y
        && subscriber.y + subscriber.height >= y;

      if (clickedInsideSubscriber) subscriber.clickHandler();
    });
  }

  changeMouse(e) {
    const x = e.clientX - this.canvas.getBoundingClientRect().left;
    const y = e.clientY - this.canvas.getBoundingClientRect().top;
    const isHover = this.clickSubscribers.some((subscriber) => {
      return subscriber.x <= x
        && subscriber.x + subscriber.width >= x
        && subscriber.y <= y
        && subscriber.y + subscriber.height >= y;
    });

    if (isHover) document.getElementById('canvas').classList.add('hover');
    else document.getElementById('canvas').classList.remove('hover');
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameCanvas;



/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__constants__ = __webpack_require__(13);


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
        acceleration: null,
      },
      game: {
        instance: null,
        enemiesSpawnX: __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* default */].enemiesSpawnX,
        alliesSpawnX: __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* default */].alliesSpawnX,
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
          enemies: null,
        },
      },
      statistic: {
        instance: null,
        background: null,
        timeSpent: 0,
        levelsFailed: 0,
        totalDamage: 0,
        receivedDamage: 0,
        earnedMoney: __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* default */].startMoney,
        healedHp: 0,
      },
    };
  }

  reset() {
    this.scenes.game.money = __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* default */].startMoney;
    this.scenes.game.pastMoney = __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* default */].startMoney;
    this.scenes.statistic.timeSpent = 0;
    this.scenes.statistic.levelsFailed = 0;
    this.scenes.statistic.totalDamage = 0;
    this.scenes.statistic.receivedDamage = 0;
    this.scenes.statistic.earnedMoney = __WEBPACK_IMPORTED_MODULE_0__constants__["a" /* default */].startMoney;
    this.scenes.statistic.healedHp = 0;
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = State;



/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const defaults = {
  enemiesSpawnX: 1100,
  alliesSpawnX: 0,
  startMoney: 10,
};

/* harmony default export */ __webpack_exports__["a"] = (defaults);


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_base__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__controls_button__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__unit_sprite__ = __webpack_require__(0);




class MenuScene extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* default */] {
  constructor(state, gameCanvas, music) {
    super(state, gameCanvas, music);

    this.state.backgroundSprite = new __WEBPACK_IMPORTED_MODULE_2__unit_sprite__["a" /* default */]({
      url: 'imgs/UI/menu.png',
      frameWidth: 1100,
      frameHeight: 700,
      numberOfFrames: 10,
      timeToFrame: 270,
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
      += this.state.scenes.menu.acceleration * 0.01;
    this.state.scenes.menu.angle += this.state.scenes.menu.velocity * 0.01;
  }

  render(timestamp = 0) {
    this.gameCanvas.context.drawImage(
      this.state.scenes.menu.cloudsImage,
      this.state.scenes.menu.cloudsOffsetX, 0, 900, 126, 250, 0, 900, 126,
    );
    this.gameCanvas.context.drawImage(
      this.state.backgroundSprite.image, this.state.backgroundSprite.getFrameX(),
      0, this.state.backgroundSprite.frameWidth, this.state.backgroundSprite.frameHeight,
      0, 0, this.state.backgroundSprite.frameWidth, this.state.backgroundSprite.frameHeight,
    );
    this.state.backgroundSprite.tick(timestamp, this.prevTimeStamp);

    this.gameCanvas.context.drawImage(
      this.state.scenes.menu.belt,
      0, this.state.scenes.menu.beltY,
    );

    this.gameCanvas.context.save();
    this.gameCanvas.context.translate(140, 0);
    this.gameCanvas.context.rotate(this.state.scenes.menu.angle);
    this.gameCanvas.context.drawImage(
      this.state.scenes.menu.menuSheet, -280 / 2,
      this.state.scenes.menu.menuSheetY,
    );
    this.gameCanvas.context.restore();

    this.gameCanvas.context.save();
    this.gameCanvas.context.translate(700, this.state.scenes.menu.aboutSheetY);
    this.gameCanvas.context.rotate(-this.state.scenes.menu.angle * 5);
    this.gameCanvas.context.drawImage(this.state.scenes.menu.aboutSheet, -410 / 2, 0);
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
    this.state.currentScene.dialog.open('Select a unit in the upper right corner', 200, []);
  }

  startDemoGame() {
    this.gameCanvas.unsubscribeClick();
    this.state.currentScene = this.state.scenes.game.instance;
    this.state.reset();
    this.state.scenes.game.isDemo = true;
    this.state.currentScene.initialize(0);
    this.state.currentScene.subscribeButtonsClick();
    this.state.currentScene.dialog.open('Select a unit in the upper right corner', 200, []);
  }

  toggleAbout() {
    this.state.scenes.menu.aboutSheetVisible
      = !this.state.scenes.menu.aboutSheetVisible;
  }

  getButtonsConfig() {
    return [
      {
        x: 75, y: 400, height: 45, width: 165, clickHandler: () => this.startGame(),
      },
      {
        x: 75, y: 455, height: 45, width: 165, clickHandler: () => this.startDemoGame(),
      },
      {
        x: 65, y: 515, height: 45, width: 185, clickHandler: () => this.toggleAbout(),
      },
    ];
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MenuScene;



/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_base__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__control_panel_control_panel__ = __webpack_require__(16);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dialog_dialog__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__unit_factory_unit_factory__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__queue_queue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__levels_levels__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__levels_demoLevels__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__unit_direction__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__controls_button__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__floating_text_floating_text__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__buff_manager_buff_manager__ = __webpack_require__(29);












class GameScene extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* default */] {
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
    this.state.scenes.game.currentLevel.allies
      .forEach(ally => ally.doAction(this.state.scenes.game, timestamp));
    this.state.scenes.game.currentLevel.enemies
      .forEach(enemy => enemy.doAction(this.state.scenes.game, timestamp));

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

    gameState.currentLevel.allies.forEach((ally) => {
      const sprite = ally.getCurrentSprite();

      sprite.tick(timestamp, this.prevTimeStamp);

      this.gameCanvas.context.drawImage(
        sprite.image, sprite.getFrameX(), 0, sprite.frameWidth - 1,
        sprite.frameHeight, ally.x + sprite.xOffset,
        ally.y, sprite.frameWidth, sprite.frameHeight,
      );
    });

    gameState.currentLevel.enemies.forEach((enemy) => {
      const sprite = enemy.getCurrentSprite();
      const frameX = (sprite.frameWidth * (sprite.numberOfFrames - 1))
          - sprite.getFrameX();

      sprite.tick(timestamp, this.prevTimeStamp);

      this.gameCanvas.context.drawImage(
        sprite.image, frameX, 0, sprite.frameWidth,
        sprite.frameHeight, enemy.x + sprite.xOffset,
        enemy.y, sprite.frameWidth, sprite.frameHeight,
      );
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
    const [state, isDemo] = [this.state.scenes.game, this.state.scenes.game.isDemo];

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
          this.dialog.close();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.initialize(state.currentLevel.levelNumber + 1, isDemo);
          this.subscribeButtonsClick();
          state.pastMoney = state.money;
        },
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
          this.dialog.close();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.initialize(state.currentLevel.levelNumber - 1, isDemo);
          this.subscribeButtonsClick();
          this.state.scenes.statistic.levelsFailed++;
          state.money = state.pastMoney;
        },
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
          this.dialog.close();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.initialize(state.currentLevel.levelNumber, isDemo);
          this.subscribeButtonsClick();
          this.state.scenes.statistic.levelsFailed++;
          state.money = state.pastMoney;
        },
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
          this.dialog.reset();
          this.buffManager.fullReset();
          this.gameCanvas.unsubscribeClick();
          this.state.currentScene = this.state.scenes.menu.instance;
          this.music.subscribe();
          this.gameCanvas.subscribeOnClick(...this.state.currentScene.buttons);
        },
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
          this.dialog.close();
          this.gameCanvas.unsubscribeClick();
          this.subscribeButtonsClick();

          state.isPauseGame = false;
        },
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
            this.gameCanvas.subscribeOnClick(
              this.closeButton,
              this.exitButton,
              this.prevButton,
              this.replayButton,
            );
          }
        },
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
          this.dialog.close();
          this.gameCanvas.unsubscribeClick();
          this.state.currentScene = this.state.scenes.statistic.instance;
          this.state.currentScene.subscribeOnClick();
          this.music.subscribe();
          this.state.currentScene.dialog.open('', 500, [this.state.currentScene.exitButton]);
        },
      });
    }
  }

  loadLevel(level, isDemo) {
    this.state.scenes.game.currentLevel.allies = [];
    this.state.scenes.game.currentLevel.enemies = [];

    const currentLevel = isDemo ? __WEBPACK_IMPORTED_MODULE_6__levels_demoLevels__["a" /* default */][level] : __WEBPACK_IMPORTED_MODULE_5__levels_levels__["a" /* default */][level];
    currentLevel.enemies.forEach((entry) => {
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
      const currentLevel = this.state.scenes.game.currentLevel.levelNumber;
      const lastLevel = this.state.scenes.game.numberOfLevels - 1;
      const isLastLevel = currentLevel === lastLevel;
      if (isLastLevel) {
        this.exitButton.x = 450;
        this.dialog.open('Game over. Thanks for playing :)', 260, [this.exitButton, this.statisticButton]);
        this.gameCanvas.subscribeOnClick(this.exitButton, this.statisticButton);
      } else {
        this.exitButton.x = 450;
        this.dialog.open('You win!', 495, [this.nextButton, this.exitButton]);
        this.gameCanvas.subscribeOnClick(this.nextButton, this.exitButton);

        const bonusMoney = (this.state.scenes.game.currentLevel.levelNumber * 3) + 3;
        this.state.scenes.game.money += bonusMoney;
        this.state.scenes.game.pastMoney = this.state.scenes.game.money;
      }
    } else if (winner === 'enemies' && this.state.scenes.game.currentLevel.levelNumber) {
      this.exitButton.x = 400;
      this.prevButton.x = 550;
      this.replayButton.x = 700;
      this.gameCanvas.subscribeOnClick(this.exitButton, this.prevButton, this.replayButton);
      this.dialog.open('You loose :( Try again!', 370, [this.exitButton, this.prevButton, this.replayButton]);
    } else {
      this.exitButton.x = 450;
      this.replayButton.x = 650;
      this.gameCanvas.subscribeOnClick(this.exitButton, this.replayButton);
      this.dialog.open('You loose :( Try again!', 370, [this.exitButton, this.replayButton]);
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = GameScene;



/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_button__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__parameters_unit_buttons__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__demo_parameters_unit_buttons__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__unit_factory_unit_factory__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__queue_queue__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__unit_direction__ = __webpack_require__(5);







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
      ? __WEBPACK_IMPORTED_MODULE_2__demo_parameters_unit_buttons__["a" /* default */]
      : __WEBPACK_IMPORTED_MODULE_1__parameters_unit_buttons__["a" /* default */];
    this.buttons = parmeters[level].map((buttonParam) => {
      const button = new __WEBPACK_IMPORTED_MODULE_0__controls_button__["a" /* default */]({
        x: buttonParam.x,
        y: buttonParam.y,
        width: buttonParam.width,
        height: buttonParam.height,
        iconUrl: buttonParam.imgUrl,
        clickHandler: () => this.createUnit(buttonParam.name),
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
    this.state.currentScene.dialog.close();
    this.state.scenes.game.isPauseGame = false;
  }

  subscribe() {
    this.gameCanvas.subscribeOnClick(...this.buttons);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ControlPanel;



/***/ }),
/* 17 */
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
      height: 40,
    },
  ],
  [
    {
      name: 'skeleton',
      imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
      x: 20,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'wizard',
      imgUrl: 'imgs/units/wizard/wizard-icon.png',
      x: 90,
      y: 20,
      width: 40,
      height: 40,
    },
  ],
  [
    {
      name: 'skeleton',
      imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
      x: 20,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'knight',
      imgUrl: 'imgs/units/knight/knight-icon.png',
      x: 90,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'country-knight',
      imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
      x: 160,
      y: 20,
      width: 40,
      height: 40,
    },
  ],
  [
    {
      name: 'skeleton',
      imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
      x: 20,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'bandit',
      imgUrl: 'imgs/units/bandit/bandit-icon.png',
      x: 90,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'country-knight',
      imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
      x: 160,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'knight',
      imgUrl: 'imgs/units/knight/knight-icon.png',
      x: 230,
      y: 20,
      width: 40,
      height: 40,
    },
  ],
  [
    {
      name: 'skeleton',
      imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
      x: 20,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'wizard',
      imgUrl: 'imgs/units/wizard/wizard-icon.png',
      x: 90,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'country-knight',
      imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
      x: 160,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'knight',
      imgUrl: 'imgs/units/knight/knight-icon.png',
      x: 230,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'rogue',
      imgUrl: 'imgs/units/rogue/rogue-icon.png',
      x: 300,
      y: 20,
      width: 40,
      height: 40,
    },
  ],
  [
    {
      name: 'skeleton',
      imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
      x: 20,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'wizard',
      imgUrl: 'imgs/units/wizard/wizard-icon.png',
      x: 90,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'country-knight',
      imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
      x: 160,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'knight',
      imgUrl: 'imgs/units/knight/knight-icon.png',
      x: 230,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'rogue',
      imgUrl: 'imgs/units/rogue/rogue-icon.png',
      x: 300,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'bandit',
      imgUrl: 'imgs/units/bandit/bandit-icon.png',
      x: 370,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'blob',
      imgUrl: 'imgs/units/blob/blob-icon.png',
      x: 440,
      y: 20,
      width: 40,
      height: 40,
    },
  ],
];

/* harmony default export */ __webpack_exports__["a"] = (parametersOfUnitButtons);


/***/ }),
/* 18 */
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
      height: 40,
    },
  ],
  [
    {
      name: 'skeleton',
      imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
      x: 20,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'knight',
      imgUrl: 'imgs/units/knight/knight-icon.png',
      x: 90,
      y: 20,
      width: 40,
      height: 40,
    },
  ],
  [
    {
      name: 'skeleton',
      imgUrl: 'imgs/units/skeleton/skeleton-icon.png',
      x: 20,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'knight',
      imgUrl: 'imgs/units/knight/knight-icon.png',
      x: 90,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'wizard',
      imgUrl: 'imgs/units/wizard/wizard-icon.png',
      x: 160,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'bandit',
      imgUrl: 'imgs/units/bandit/bandit-icon.png',
      x: 230,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'rogue',
      imgUrl: 'imgs/units/rogue/rogue-icon.png',
      x: 300,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'country-knight',
      imgUrl: 'imgs/units/country-knight/country-knight-icon.png',
      x: 370,
      y: 20,
      width: 40,
      height: 40,
    },
    {
      name: 'blob',
      imgUrl: 'imgs/units/blob/blob-icon.png',
      x: 440,
      y: 20,
      width: 40,
      height: 40,
    },
  ],
];

/* harmony default export */ __webpack_exports__["a"] = (parametersOfUnitButtons);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Skeleton extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
  constructor(id, direction) {
    super({
      id,
      health: 8,
      damage: 2,
      attackTime: 2142,
      rangeAttack: 23,
      criticalChance: 0.07,
      accuracy: 0.93,
      timeToHit: 952,
      deathTime: 1900,
      stepSize: 0.6,
      direction,
      idleTime: 1000,
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
      bodyXOffset: this.playersUnit ? 13 : 10,
    });

    this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/skeleton/skeleton-walk-${this.direction}.png`,
      frameWidth: 24,
      frameHeight: 33,
      numberOfFrames: 13,
      timeToFrame: 90,
      bodyXOffset: this.playersUnit ? 13 : 10,
    });

    this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/skeleton/skeleton-attack-${this.direction}.png`,
      frameWidth: 43,
      frameHeight: 37,
      numberOfFrames: 18,
      timeToFrame: 125,
      xOffset: this.playersUnit ? 0 : -16,
      bodyXOffset: this.playersUnit ? 13 : 10,
    });

    this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/skeleton/skeleton-die-${this.direction}.png`,
      frameWidth: 33,
      frameHeight: 32,
      numberOfFrames: 15,
      timeToFrame: 150,
      bodyXOffset: this.playersUnit ? 13 : 10,
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Skeleton;



/***/ }),
/* 20 */
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
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Knight extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
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
    this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/knight/knight-idle-${this.direction}.png`,
      frameWidth: 42,
      frameHeight: 40,
      numberOfFrames: 4,
      timeToFrame: 300,
      bodyXOffset: this.playersUnit ? 26 : 16,
    });

    this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/knight/knight-walk-${this.direction}.png`,
      frameWidth: 42,
      frameHeight: 40,
      numberOfFrames: 8,
      timeToFrame: 150,
      bodyXOffset: this.playersUnit ? 26 : 16,
    });

    this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/knight/knight-attack-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 40,
      numberOfFrames: 10,
      timeToFrame: 170,
      xOffset: this.playersUnit ? 0 : -38,
      bodyXOffset: this.playersUnit ? 26 : 16,
    });

    this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/knight/knight-die-${this.direction}.png`,
      frameWidth: 42,
      frameHeight: 40,
      numberOfFrames: 9,
      timeToFrame: 90,
      bodyXOffset: this.playersUnit ? 26 : 16,
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Knight;



/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class CountryKnight extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
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
    this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/country-knight/country-knight-idle-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 39,
      numberOfFrames: 6,
      timeToFrame: 200,
      bodyXOffset: this.playersUnit ? 38 : 26,
    });

    this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/country-knight/country-knight-run-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 45,
      numberOfFrames: 8,
      timeToFrame: 112,
      bodyXOffset: this.playersUnit ? 38 : 26,
    });

    this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/country-knight/country-knight-attack-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 42,
      numberOfFrames: 4,
      timeToFrame: 200,
      bodyXOffset: this.playersUnit ? 38 : 26,
    });

    this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/country-knight/country-knight-die-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 45,
      numberOfFrames: 8,
      timeToFrame: 155,
      bodyXOffset: this.playersUnit ? 38 : 26,
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CountryKnight;



/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Rogue extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
  constructor(id, direction) {
    super({
      id,
      health: 10,
      damage: 2,
      attackTime: 1000,
      rangeAttack: 40,
      criticalChance: 0.1,
      accuracy: 0.96,
      timeToHit: 800,
      deathTime: 1000,
      stepSize: 1,
      direction,
      idleTime: 1000,
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
      bodyXOffset: this.playersUnit ? 13 : 43,
    });

    this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/rogue/rogue-run-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 23,
      numberOfFrames: 6,
      timeToFrame: 112,
      bodyXOffset: this.playersUnit ? 13 : 43,
    });

    this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/rogue/rogue-attack-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 23,
      numberOfFrames: 10,
      timeToFrame: 112,
      bodyXOffset: this.playersUnit ? 13 : 43,
    });

    this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/rogue/rogue-death-${this.direction}.png`,
      frameWidth: 64,
      frameHeight: 21,
      numberOfFrames: 9,
      timeToFrame: 130,
      bodyXOffset: this.playersUnit ? 13 : 43,
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Rogue;



/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Blob extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
  constructor(id, direction) {
    super({
      id,
      health: 3,
      damage: 4,
      attackTime: 1200,
      rangeAttack: 27,
      criticalChance: 0.04,
      accuracy: 0.93,
      timeToHit: 1100,
      deathTime: 1000,
      stepSize: 1,
      direction,
      idleTime: 1000,
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
      bodyXOffset: this.playersUnit ? 49 : 31,
    });

    this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/blob/blob-move-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 50,
      numberOfFrames: 8,
      timeToFrame: 112,
      bodyXOffset: this.playersUnit ? 49 : 31,
    });

    this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/blob/blob-attack-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 33,
      numberOfFrames: 10,
      timeToFrame: 130,
      bodyXOffset: this.playersUnit ? 49 : 31,
    });

    this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/blob/blob-death-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 54,
      numberOfFrames: 8,
      timeToFrame: 155,
      bodyXOffset: this.playersUnit ? 49 : 31,
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Blob;



/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__unit_actions__ = __webpack_require__(4);




class Wizard extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
  constructor(id, direction) {
    super({
      id,
      health: 7,
      damage: 1,
      attackTime: 1500,
      rangeAttack: 28,
      criticalChance: 0.04,
      accuracy: 0.9,
      timeToHit: 1000,
      deathTime: 1900,
      stepSize: 0.4,
      direction,
      idleTime: 1000,
    });
    this.healTime = 1300;
    this.healthToHeal = 1;
    this.healRange = 240;
    this.cost = 4;
    this.configureSprites();
  }

  configureSprites() {
    this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/wizard/wizard-idle-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 80,
      numberOfFrames: 10,
      timeToFrame: 200,
      bodyXOffset: this.playersUnit ? 49 : 21,
    });

    this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/wizard/wizard-run-${this.direction}.png`,
      frameWidth: 70,
      frameHeight: 56,
      numberOfFrames: 5,
      timeToFrame: 250,
      xOffset: this.playersUnit ? 9 : 0,
      bodyXOffset: this.playersUnit ? 49 : 21,
    });

    this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/wizard/wizard-attack-${this.direction}.png`,
      frameWidth: 100,
      frameHeight: 57,
      numberOfFrames: 9,
      timeToFrame: 180,
      xOffset: -14,
      bodyXOffset: this.playersUnit ? 49 : 21,
    });

    this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/wizard/wizard-death-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 80,
      numberOfFrames: 10,
      timeToFrame: 250,
      bodyXOffset: this.playersUnit ? 49 : 21,
    });
    this.sprites.heal = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/wizard/wizard-heal-${this.direction}.png`,
      frameWidth: 80,
      frameHeight: 80,
      numberOfFrames: 10,
      timeToFrame: 250,
      bodyXOffset: this.playersUnit ? 49 : 21,
    });
  }

  doAction(state, timestamp) {
    if (this.health <= 0) {
      this.die(state, timestamp);
    } else if (this.currentAction === __WEBPACK_IMPORTED_MODULE_2__unit_actions__["a" /* default */].idle
      && timestamp - this.previousActionTimestamp < this.idleTime) {
      return false;
    } else if (this.isInFrontOfAlly(state) && this.isUnitRange(state) && !state.isPauseGame) {
      this.heal(state, timestamp);
    } else if (this.isInFrontOfAlly(state) || state.isPauseGame
      || (this.isInFrontOfEnemy(state) && this.isEnemyDying(state))) {
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

    const targetUnit = this.playersUnit
      ? state.currentLevel.allies[0]
      : state.currentLevel.enemies[0];
    if (timestamp - this.previousActionTimestamp > this.healTime && targetUnit.health > 0) {
      targetUnit.health += this.healthToHeal;

      const positionX = targetUnit.x
        + targetUnit.sprites.walk.bodyXOffset;
      this.floatingText.add({
        text: this.healthToHeal,
        positionX,
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
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__unit_unit__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__unit_sprite__ = __webpack_require__(0);



class Bandit extends __WEBPACK_IMPORTED_MODULE_0__unit_unit__["a" /* default */] {
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
    this.sprites.idle = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/bandit/bandit-idle-${this.direction}.png`,
      frameWidth: 30,
      frameHeight: 27,
      numberOfFrames: 6,
      timeToFrame: 160,
      bodyXOffset: this.playersUnit ? 19 : 11,
    });

    this.sprites.walk = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/bandit/bandit-run-${this.direction}.png`,
      frameWidth: 30,
      frameHeight: 27,
      numberOfFrames: 5,
      timeToFrame: 130,
      bodyXOffset: this.playersUnit ? 19 : 11,
    });

    this.sprites.attack = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/bandit/bandit-attack-${this.direction}.png`,
      frameWidth: 30,
      frameHeight: 25,
      numberOfFrames: 7,
      timeToFrame: 130,
      bodyXOffset: this.playersUnit ? 19 : 11,
    });

    this.sprites.die = new __WEBPACK_IMPORTED_MODULE_1__unit_sprite__["a" /* default */]({
      url: `imgs/units/bandit/bandit-death-${this.direction}.png`,
      frameWidth: 30,
      frameHeight: 25,
      numberOfFrames: 6,
      timeToFrame: 400,
      bodyXOffset: this.playersUnit ? 19 : 11,
    });
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Bandit;



/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const levels = [
  {
    background: './imgs/backgrounds/game.png',
    groundLevelY: 640,
    enemies: [
      { name: 'skeleton' },
      { name: 'skeleton' },
    ],
  },
  {
    background: './imgs/backgrounds/game.png',
    groundLevelY: 640,
    enemies: [
      { name: 'skeleton' },
      { name: 'country-knight' },
    ],
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
    ],
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
      { name: 'knight' },
    ],
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
    ],
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
    ],
  },
];

/* harmony default export */ __webpack_exports__["a"] = (levels);


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const levels = [
  {
    background: './imgs/backgrounds/game.png',
    groundLevelY: 640,
    enemies: [
      { name: 'skeleton' },
    ],
  },
  {
    background: './imgs/backgrounds/game.png',
    groundLevelY: 640,
    enemies: [
      { name: 'rogue' },
      { name: 'country-knight' },
    ],
  },
  {
    background: './imgs/backgrounds/game.png',
    groundLevelY: 640,
    enemies: [
      { name: 'knight' },
      { name: 'wizard' },
    ],
  },
];

/* harmony default export */ __webpack_exports__["a"] = (levels);


/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__controls_button__ = __webpack_require__(2);


class BuffManager {
  constructor(state, gameCanvas) {
    this.buttons = null;
    this.state = state;
    this.gameCanvas = gameCanvas;

    this.armorBuffsDuration = 60000;
    this.weaponBuffsDuration = 30000;

    this.buffId = 0;

    this.fullReset();
  }

  createButton() {
    this.buttons = this.getParametersOfBuffButton().map((btn) => {
      const button = new __WEBPACK_IMPORTED_MODULE_0__controls_button__["a" /* default */]({
        x: btn.x,
        y: btn.y,
        height: btn.height,
        width: btn.width,
        iconUrl: btn.iconUrl,
        clickHandler: btn.clickHandler,
      });
      return button;
    });
  }

  improveWeapon() {
    if (this.state.scenes.game.money >= 3) {
      this.state.scenes.game.currentLevel.allies.forEach((unit) => {
        unit.damage++;
        unit.weaponIdBuff.push(this.buffId);
      });

      this.weaponBuffs.push({
        id: this.buffId++,
        weaponStart: Date.now(),
        opacity: 0.7,
        fadeIn: false,
      });

      this.state.scenes.game.money -= 3;
    }
  }

  improveArmor() {
    if (this.state.scenes.game.money >= 5) {
      this.state.scenes.game.currentLevel.allies.forEach((unit) => {
        unit.health += 5;
        unit.armorIdBuff.push(this.buffId);
      });

      this.armorBuffs.push({
        id: this.buffId,
        armorStart: Date.now(),
        opacity: 0.7,
        fadeIn: false,
      });

      this.state.scenes.game.money -= 5;
    }
  }

  weaponReset() {
    this.state.scenes.game.currentLevel.allies.forEach((unit) => {
      if (unit.weaponIdBuff.length && unit.weaponIdBuff[0] === this.weaponBuffs[0].id) {
        unit.damage--;
        unit.weaponIdBuff.shift();
      }
    });

    this.weaponBuffs.shift();
  }

  armorReset() {
    this.state.scenes.game.currentLevel.allies.forEach((unit) => {
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

      if (passedWeaponTime > this.weaponBuffsDuration) this.weaponReset();

      this.weaponBuffs.forEach((buff) => {
        const delta = buff.fadeIn ? 0.01 : -0.01;
        buff.opacity += delta;
        if (buff.opacity < 0.1) buff.fadeIn = true;
        else if (buff.opacity > 0.7) buff.fadeIn = false;
      });
    }

    if (this.armorBuffs.length) {
      const passedArmorTime = Date.now() - this.armorBuffs[0].armorStart;

      if (passedArmorTime > this.armorBuffsDuration) this.armorReset();

      this.armorBuffs.forEach((buff) => {
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
      const buffXPosition = weaponBtn.x + (70 * (position + 1));
      this.gameCanvas.context.drawImage(weaponBtn.icon, buffXPosition, weaponBtn.y);
      this.gameCanvas.context.restore();
    });

    const armorBtn = this.buttons[1];
    this.armorBuffs.forEach((buff, position) => {
      this.gameCanvas.context.save();
      this.gameCanvas.context.globalAlpha = buff.opacity;
      const buffXPosition = armorBtn.x + (70 * (position + 1));
      this.gameCanvas.context.drawImage(armorBtn.icon, buffXPosition, armorBtn.y);
      this.gameCanvas.context.restore();
    });
  }

  getParametersOfBuffButton() {
    return [
      {
        name: 'arm',
        iconUrl: 'imgs/buff-icon/weapon.png',
        x: 20,
        y: 90,
        width: 40,
        height: 40,
        clickHandler: () => this.improveWeapon(),
      },
      {
        name: 'armor',
        iconUrl: 'imgs/buff-icon/armor.png',
        x: 20,
        y: 160,
        width: 40,
        height: 40,
        clickHandler: () => this.improveArmor(),
      },
    ];
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BuffManager;



/***/ }),
/* 30 */
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
    this.music = document.createElement('audio');
    this.music.src = 'music/background-music.wav';
    this.music.setAttribute('preload', 'auto');
    this.music.setAttribute('controls', 'none');
    this.music.setAttribute('loop', 'true');
    this.music.style.display = 'none';
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
      clickHandler: () => this.toggle(),
    });

    this.button.icon = this.state[this.counter];
    this.addMusic();
  }

  toggle() {
    this.counter = ++this.counter % 3;
    this.button.icon = this.state[this.counter];
    this.music.volume = 0.5 - (this.counter / 4);
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
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__scene_base__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dialog_dialog__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__controls_button__ = __webpack_require__(2);




class StatisticScene extends __WEBPACK_IMPORTED_MODULE_0__scene_base__["a" /* default */] {
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
    this.gameCanvas.context.fillText('Total damage dealt', 180, 300);
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
        this.state.scenes.game.instance.initialize(0);
        this.dialog.close();
        this.gameCanvas.unsubscribeClick();
        this.state.currentScene = this.state.scenes.menu.instance;
        this.music.subscribe();
        this.gameCanvas.subscribeOnClick(...this.state.currentScene.buttons);
      },
    });
  }

  subscribeOnClick() {
    this.gameCanvas.subscribeOnClick(this.exitButton);
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StatisticScene;



/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTA2ZjYyOTFkMDJiYmRkNGYwYTgiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvc3ByaXRlLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0L3VuaXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2xzL2J1dHRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL3NjZW5lLmJhc2UuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQvYWN0aW9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdC9kaXJlY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXQtZmFjdG9yeS91bml0LWZhY3RvcnkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Zsb2F0aW5nLXRleHQvZmxvYXRpbmctdGV4dC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcXVldWUvcXVldWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2RpYWxvZy9kaWFsb2cuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2dhbWUtY2FudmFzL2dhbWUtY2FudmFzLmpzIiwid2VicGFjazovLy8uL3NyYy9zdGF0ZS9zdGF0ZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGUvY29uc3RhbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9zY2VuZXMvbWVudS5zY2VuZS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc2NlbmVzL2dhbWUuc2NlbmUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvbnRyb2wtcGFuZWwvY29udHJvbC1wYW5lbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbC1wYW5lbC9wYXJhbWV0ZXJzLXVuaXQtYnV0dG9ucy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udHJvbC1wYW5lbC9kZW1vLXBhcmFtZXRlcnMtdW5pdC1idXR0b25zLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0cy9za2VsZXRvbi9za2VsZXRvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdC9zcHJpdGVzLmpzIiwid2VicGFjazovLy8uL3NyYy91bml0cy9rbmlnaHQva25pZ2h0LmpzIiwid2VicGFjazovLy8uL3NyYy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvcm9ndWUvcm9ndWUuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VuaXRzL2Jsb2IvYmxvYi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvd2l6YXJkL3dpemFyZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdW5pdHMvYmFuZGl0L2JhbmRpdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGV2ZWxzL2xldmVscy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvbGV2ZWxzL2RlbW9MZXZlbHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2J1ZmYtbWFuYWdlci9idWZmLW1hbmFnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL211c2ljL211c2ljLmpzIiwid2VicGFjazovLy8uL3NyYy9zY2VuZXMvc3RhdGlzdGljLnNjZW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7Ozs7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0Esb0JBQW9CLFdBQVc7QUFDL0I7QUFDQTtBQUNBO0FBQ0EsU0FBUzs7QUFFVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUN2TkE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7OztBQ1JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQzlCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0RBQWdELFVBQVU7O0FBRTFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1EQUFtRCxrQkFBa0I7QUFDckU7QUFDQSxPQUFPO0FBQ1AsOENBQThDLGtCQUFrQjtBQUNoRTtBQUNBLE9BQU87QUFDUDtBQUNBLDhDQUE4QyxrQkFBa0I7QUFDaEU7QUFDQSxPQUFPO0FBQ1AsaURBQWlELGtCQUFrQjtBQUNuRTtBQUNBLE9BQU87QUFDUCw2Q0FBNkMsa0JBQWtCO0FBQy9EO0FBQ0E7QUFDQSwrQkFBK0IsZUFBZTtBQUM5QztBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7OztBQzlFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTzs7QUFFUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7Ozs7Ozs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7OztBQ25FQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7Ozs7QUNOQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMOztBQUVBLHlDQUF5Qyw2QkFBNkI7QUFDdEUsd0NBQXdDLHVDQUF1QyxHQUFHLHlCQUF5QjtBQUMzRzs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7OztBQ3BUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7Ozs7Ozs7QUMvTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ3pGQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGdEQUFnRCxlQUFlO0FBQy9EO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsZ0RBQWdELGVBQWU7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSxrREFBa0QsZUFBZTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsK0NBQStDLGVBQWU7QUFDOUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7QUNQQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEMsZUFBZTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDRDQUE0QyxlQUFlO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDLGVBQWU7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDJDQUEyQyxlQUFlO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7QUM1REE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0REFBNEQsZUFBZTtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDJEQUEyRCxlQUFlO0FBQzFFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOERBQThELGVBQWU7QUFDN0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwyREFBMkQsZUFBZTtBQUMxRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7O0FDNURBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsMENBQTBDLGVBQWU7QUFDekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSx5Q0FBeUMsZUFBZTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDRDQUE0QyxlQUFlO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsMkNBQTJDLGVBQWU7QUFDMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQUE7QUFBQTs7Ozs7Ozs7OztBQzVEQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxlQUFlO0FBQ3ZEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0Esd0NBQXdDLGVBQWU7QUFDdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSwwQ0FBMEMsZUFBZTtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLHlDQUF5QyxlQUFlO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7O0FDNURBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEMsZUFBZTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDJDQUEyQyxlQUFlO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw4Q0FBOEMsZUFBZTtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsNkNBQTZDLGVBQWU7QUFDNUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLDRDQUE0QyxlQUFlO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7QUM1SUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEMsZUFBZTtBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDJDQUEyQyxlQUFlO0FBQzFEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0EsOENBQThDLGVBQWU7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQSw2Q0FBNkMsZUFBZTtBQUM1RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7OztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxtQkFBbUI7QUFDMUI7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLHlCQUF5QjtBQUNoQztBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8seUJBQXlCO0FBQ2hDLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8sbUJBQW1CO0FBQzFCLE9BQU8saUJBQWlCO0FBQ3hCLE9BQU8saUJBQWlCO0FBQ3hCO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxtQkFBbUI7QUFDMUIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxpQkFBaUI7QUFDeEI7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLHlCQUF5QjtBQUNoQyxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGVBQWU7QUFDdEIsT0FBTyxtQkFBbUI7QUFDMUI7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLG1CQUFtQjtBQUMxQixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLGdCQUFnQjtBQUN2QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLGlCQUFpQjtBQUN4QixPQUFPLHlCQUF5QjtBQUNoQyxPQUFPLGVBQWU7QUFDdEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyx5QkFBeUI7QUFDaEMsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxtQkFBbUI7QUFDMUI7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPLG1CQUFtQjtBQUMxQjtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU8sZ0JBQWdCO0FBQ3ZCLE9BQU8seUJBQXlCO0FBQ2hDO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTyxpQkFBaUI7QUFDeEIsT0FBTyxpQkFBaUI7QUFDeEI7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7Ozs7Ozs7OztBQzFCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFBQTtBQUFBOzs7Ozs7Ozs7QUNoTEE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLOztBQUVMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7Ozs7Ozs7Ozs7O0FDaEVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxnQkFBZ0I7QUFDeEQ7QUFDQSx3Q0FBd0MsbUJBQW1CO0FBQzNEO0FBQ0Esd0NBQXdDLGtCQUFrQjtBQUMxRDtBQUNBLHdDQUF3QyxxQkFBcUI7QUFDN0Q7QUFDQSx3Q0FBd0Msa0JBQWtCO0FBQzFEO0FBQ0Esd0NBQXdDLGVBQWU7O0FBRXZEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQUE7QUFBQSIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTA2ZjYyOTFkMDJiYmRkNGYwYTgiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGUge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zKSB0aHJvdyBuZXcgRXJyb3IoJ05vIHNwcml0ZSBvcHRpb25zJyk7XG5cbiAgICB0aGlzLmltYWdlID0gbmV3IEltYWdlKCk7XG4gICAgdGhpcy5pbWFnZS5zcmMgPSBvcHRpb25zLnVybDtcblxuICAgIHRoaXMuZnJhbWVXaWR0aCA9IG9wdGlvbnMuZnJhbWVXaWR0aDtcbiAgICB0aGlzLmZyYW1lSGVpZ2h0ID0gb3B0aW9ucy5mcmFtZUhlaWdodDtcbiAgICB0aGlzLm51bWJlck9mRnJhbWVzID0gb3B0aW9ucy5udW1iZXJPZkZyYW1lcztcbiAgICB0aGlzLnRpbWVUb0ZyYW1lID0gb3B0aW9ucy50aW1lVG9GcmFtZSB8fCAxMDA7XG4gICAgdGhpcy54T2Zmc2V0ID0gb3B0aW9ucy54T2Zmc2V0IHx8IDA7XG4gICAgdGhpcy5hdHRhY2tYT2Zmc2V0ID0gb3B0aW9ucy5hdHRhY2tYT2Zmc2V0IHx8IDA7XG4gICAgdGhpcy5ib2R5WE9mZnNldCA9IG9wdGlvbnMuYm9keVhPZmZzZXQ7XG5cbiAgICB0aGlzLmN1cnJlbnRUaWNrID0gMDtcbiAgICB0aGlzLmN1cnJlbnRJbWFnZUluZGV4ID0gMDtcbiAgfVxuXG4gIHRpY2sodGltZXN0YW1wLCBwcmV2VGltZXN0YW1wKSB7XG4gICAgdGhpcy5jdXJyZW50VGljayArPSBOdW1iZXIoKHRpbWVzdGFtcCAtIHByZXZUaW1lc3RhbXApLnRvRml4ZWQoMikpO1xuICAgIGlmICh0aGlzLmN1cnJlbnRUaWNrID4gdGhpcy50aW1lVG9GcmFtZSAqIHRoaXMuY3VycmVudEltYWdlSW5kZXgpIHtcbiAgICAgIHRoaXMubmV4dEZyYW1lKCk7XG4gICAgfVxuICB9XG5cbiAgbmV4dEZyYW1lKCkge1xuICAgIGlmICh0aGlzLmN1cnJlbnRJbWFnZUluZGV4ID09PSB0aGlzLm51bWJlck9mRnJhbWVzIC0gMSkge1xuICAgICAgdGhpcy5yZXNldCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmN1cnJlbnRJbWFnZUluZGV4Kys7XG4gICAgfVxuICB9XG5cbiAgZ2V0RnJhbWVYKCkge1xuICAgIHJldHVybiB0aGlzLmZyYW1lV2lkdGggKiB0aGlzLmN1cnJlbnRJbWFnZUluZGV4O1xuICB9XG5cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5jdXJyZW50VGljayA9IDA7XG4gICAgdGhpcy5jdXJyZW50SW1hZ2VJbmRleCA9IDA7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvc3ByaXRlLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBBY3Rpb25zIGZyb20gJy4vYWN0aW9ucyc7XG5pbXBvcnQgU3ByaXRlcyBmcm9tICcuL3Nwcml0ZXMnO1xuaW1wb3J0IERpcmVjdGlvbiBmcm9tICcuL2RpcmVjdGlvbic7XG5pbXBvcnQgRmxvYXRpbmdUZXh0IGZyb20gJy4uL2Zsb2F0aW5nLXRleHQvZmxvYXRpbmctdGV4dCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFVuaXQge1xuICBjb25zdHJ1Y3Rvcih1bml0SW5mbykge1xuICAgIGlmICghdW5pdEluZm8pIHRocm93IG5ldyBFcnJvcignTm8gdW5pdCBpbmZvJyk7XG5cbiAgICB0aGlzLmlkID0gdW5pdEluZm8uaWQ7XG4gICAgdGhpcy5oZWFsdGggPSB1bml0SW5mby5oZWFsdGg7XG4gICAgdGhpcy5kYW1hZ2UgPSB1bml0SW5mby5kYW1hZ2U7XG4gICAgdGhpcy5yYW5nZUF0dGFjayA9IHVuaXRJbmZvLnJhbmdlQXR0YWNrIHx8IDA7XG4gICAgdGhpcy5jcml0aWNhbENoYW5jZSA9IHVuaXRJbmZvLmNyaXRpY2FsQ2hhbmNlIHx8IDA7XG4gICAgdGhpcy5hY2N1cmFjeSA9IHVuaXRJbmZvLmFjY3VyYWN5IHx8IDAuOTtcbiAgICB0aGlzLmlkbGVUaW1lID0gdW5pdEluZm8uaWRsZVRpbWUgfHwgMjAwMDtcbiAgICB0aGlzLmF0dGFja1RpbWUgPSB1bml0SW5mby5hdHRhY2tUaW1lO1xuICAgIHRoaXMudGltZVRvSGl0ID0gdW5pdEluZm8udGltZVRvSGl0O1xuICAgIHRoaXMuZGVhdGhUaW1lID0gdW5pdEluZm8uZGVhdGhUaW1lO1xuICAgIHRoaXMuc3RlcFNpemUgPSB1bml0SW5mby5zdGVwU2l6ZTtcbiAgICB0aGlzLmRpcmVjdGlvbiA9IHVuaXRJbmZvLmRpcmVjdGlvbjtcblxuICAgIHRoaXMuc3ByaXRlcyA9IG5ldyBTcHJpdGVzKCk7XG4gICAgdGhpcy5mbG9hdGluZ1RleHQgPSBGbG9hdGluZ1RleHQuZ2V0U2luZ2xldG9uSW5zdGFuY2UoKTtcblxuICAgIHRoaXMucGxheWVyc1VuaXQgPSB0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLnJpZ2h0O1xuICAgIHRoaXMud2VhcG9uSWRCdWZmID0gW107XG4gICAgdGhpcy5hcm1vcklkQnVmZiA9IFtdO1xuICAgIHRoaXMud2FzSGl0ID0gZmFsc2U7XG4gICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IG51bGw7XG4gICAgdGhpcy5jdXJyZW50QWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLnggPSBudWxsO1xuICAgIHRoaXMueSA9IG51bGw7XG4gIH1cblxuICBnZXRDdXJyZW50U3ByaXRlKCkge1xuICAgIHN3aXRjaCAodGhpcy5jdXJyZW50QWN0aW9uKSB7XG4gICAgICBjYXNlIEFjdGlvbnMuc3RlcDogcmV0dXJuIHRoaXMuc3ByaXRlcy53YWxrO1xuICAgICAgY2FzZSBBY3Rpb25zLmF0dGFjazogcmV0dXJuIHRoaXMuc3ByaXRlcy5hdHRhY2s7XG4gICAgICBjYXNlIEFjdGlvbnMuZGllOiByZXR1cm4gdGhpcy5zcHJpdGVzLmRpZTtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiB0aGlzLnNwcml0ZXMuaWRsZTtcbiAgICB9XG4gIH1cblxuICBkb0FjdGlvbihzdGF0ZSwgdGltZXN0YW1wKSB7XG4gICAgaWYgKHRoaXMuaGVhbHRoIDw9IDApIHtcbiAgICAgIHRoaXMuZGllKHN0YXRlLCB0aW1lc3RhbXApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5jdXJyZW50QWN0aW9uID09PSBBY3Rpb25zLmlkbGVcbiAgICAgICYmIHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPCB0aGlzLmlkbGVUaW1lKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzSW5Gcm9udE9mQWxseShzdGF0ZSkgfHwgc3RhdGUuaXNQYXVzZUdhbWVcbiAgICAgIHx8ICh0aGlzLmlzSW5Gcm9udE9mRW5lbXkoc3RhdGUpICYmIHRoaXMuaXNFbmVteUR5aW5nKHN0YXRlKSkpIHtcbiAgICAgIHRoaXMuaWRsZShzdGF0ZSwgdGltZXN0YW1wKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZFbmVteShzdGF0ZSkpIHtcbiAgICAgIHRoaXMuYXR0YWNrKHN0YXRlLCB0aW1lc3RhbXApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN0ZXAoc3RhdGUsIHRpbWVzdGFtcCk7XG4gICAgfVxuICB9XG5cbiAgLy8gI3JlZ2lvbiBhY3Rpb25zXG5cbiAgc3RlcChzdGF0ZSwgdGltZXN0YW1wKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5zdGVwKSB7XG4gICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBBY3Rpb25zLnN0ZXA7XG4gICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgICAgdGhpcy5zcHJpdGVzLndhbGsucmVzZXQoKTtcbiAgICAgIHRoaXMudXBkYXRlWShzdGF0ZSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmRpcmVjdGlvbiA9PT0gRGlyZWN0aW9uLnJpZ2h0KSB7XG4gICAgICB0aGlzLnggKz0gdGhpcy5zdGVwU2l6ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy54IC09IHRoaXMuc3RlcFNpemU7XG4gICAgfVxuICB9XG5cbiAgaWRsZShzdGF0ZSwgdGltZXN0YW1wKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5pZGxlKSB7XG4gICAgICB0aGlzLmN1cnJlbnRBY3Rpb24gPSBBY3Rpb25zLmlkbGU7XG4gICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgICAgdGhpcy5zcHJpdGVzLmlkbGUucmVzZXQoKTtcbiAgICAgIHRoaXMudXBkYXRlWShzdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgYXR0YWNrKHN0YXRlLCB0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5jdXJyZW50QWN0aW9uICE9PSBBY3Rpb25zLmF0dGFjaykge1xuICAgICAgdGhpcy5jdXJyZW50QWN0aW9uID0gQWN0aW9ucy5hdHRhY2s7XG4gICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgICAgdGhpcy5zcHJpdGVzLmF0dGFjay5yZXNldCgpO1xuICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcbiAgICB9IGVsc2UgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiB0aGlzLnRpbWVUb0hpdCAmJiAhdGhpcy53YXNIaXQpIHtcbiAgICAgIGNvbnN0IGlzQ3JpdGljYWxIaXQgPSBNYXRoLnJhbmRvbSgpIDw9IHRoaXMuY3JpdGljYWxDaGFuY2U7XG4gICAgICBjb25zdCBpc01pc3NIaXQgPSBNYXRoLnJhbmRvbSgpID4gdGhpcy5hY2N1cmFjeTtcbiAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSB7XG4gICAgICAgIGlmIChpc0NyaXRpY2FsSGl0ICYmICFpc01pc3NIaXQpIHtcbiAgICAgICAgICBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS5oZWFsdGggLT0gdGhpcy5kYW1hZ2UgKiAyO1xuICAgICAgICAgIHN0YXRlLmluc3RhbmNlLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMudG90YWxEYW1hZ2UgKz0gdGhpcy5kYW1hZ2UgKiAyO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0NyaXRpY2FsSGl0ICYmICFpc01pc3NIaXQpIHtcbiAgICAgICAgICBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1swXS5oZWFsdGggLT0gdGhpcy5kYW1hZ2U7XG4gICAgICAgICAgc3RhdGUuaW5zdGFuY2Uuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYy50b3RhbERhbWFnZSsrO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcG9zaXRpb25YID0gc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0ueFxuICAgICAgICAgICsgc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0uc3ByaXRlcy53YWxrLmJvZHlYT2Zmc2V0O1xuXG4gICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XG4gICAgICAgICAgdGV4dDogaXNDcml0aWNhbEhpdCA/IHRoaXMuZGFtYWdlICogMiA6IHRoaXMuZGFtYWdlLFxuICAgICAgICAgIHBvc2l0aW9uWCxcbiAgICAgICAgICBwb3NpdGlvblk6IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLnksXG4gICAgICAgICAgYWN0aW9uOiBBY3Rpb25zLmF0dGFjayxcbiAgICAgICAgICBpc0NyaXRpY2FsSGl0LFxuICAgICAgICAgIGlzTWlzc0hpdCxcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNDcml0aWNhbEhpdCAmJiAhaXNNaXNzSGl0KSB7XG4gICAgICAgICAgc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXS5oZWFsdGggLT0gdGhpcy5kYW1hZ2UgKiAyO1xuICAgICAgICAgIHN0YXRlLmluc3RhbmNlLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMucmVjZWl2ZWREYW1hZ2UgKz0gdGhpcy5kYW1hZ2UgKiAyO1xuICAgICAgICB9IGVsc2UgaWYgKCFpc0NyaXRpY2FsSGl0ICYmICFpc01pc3NIaXQpIHtcbiAgICAgICAgICBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdLmhlYWx0aCAtPSB0aGlzLmRhbWFnZTtcbiAgICAgICAgICBzdGF0ZS5pbnN0YW5jZS5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLnJlY2VpdmVkRGFtYWdlKys7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBwb3NpdGlvblggPSBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdLnhcbiAgICAgICAgICArIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0uc3ByaXRlcy53YWxrLmJvZHlYT2Zmc2V0O1xuXG4gICAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XG4gICAgICAgICAgdGV4dDogaXNDcml0aWNhbEhpdCA/IHRoaXMuZGFtYWdlICogMiA6IHRoaXMuZGFtYWdlLFxuICAgICAgICAgIHBvc2l0aW9uWCxcbiAgICAgICAgICBwb3NpdGlvblk6IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0ueSxcbiAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuYXR0YWNrLFxuICAgICAgICAgIGlzQ3JpdGljYWxIaXQsXG4gICAgICAgICAgaXNNaXNzSGl0LFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRoaXMud2FzSGl0ID0gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKHRpbWVzdGFtcCAtIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPiB0aGlzLmF0dGFja1RpbWUgJiYgdGhpcy53YXNIaXQpIHtcbiAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICB0aGlzLndhc0hpdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGRpZShzdGF0ZSwgdGltZXN0YW1wKSB7XG4gICAgaWYgKHRoaXMuY3VycmVudEFjdGlvbiAhPT0gQWN0aW9ucy5kaWUpIHtcbiAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IEFjdGlvbnMuZGllO1xuICAgICAgdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA9IHRpbWVzdGFtcDtcbiAgICAgIHRoaXMuc3ByaXRlcy5kaWUucmVzZXQoKTtcbiAgICAgIHRoaXMudXBkYXRlWShzdGF0ZSk7XG4gICAgfSBlbHNlIGlmICh0aW1lc3RhbXAgLSB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID4gdGhpcy5kZWF0aFRpbWUpIHtcbiAgICAgIGlmICh0aGlzLnBsYXllcnNVbml0KSB7XG4gICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXMuc2hpZnQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGJvbnVzTW9uZXkgPSBNYXRoLmZsb29yKHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdLmNvc3QgLyAyKTtcbiAgICAgICAgY29uc3QgcG9zaXRpb25YID0gc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0ueFxuICAgICAgICAgICsgc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXS5zcHJpdGVzLndhbGsuYm9keVhPZmZzZXQ7XG5cbiAgICAgICAgc3RhdGUubW9uZXkgKz0gYm9udXNNb25leTtcblxuICAgICAgICB0aGlzLmZsb2F0aW5nVGV4dC5hZGQoe1xuICAgICAgICAgIHRleHQ6IGAkJHtib251c01vbmV5fWAsXG4gICAgICAgICAgcG9zaXRpb25YLFxuICAgICAgICAgIHBvc2l0aW9uWTogc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0ueSxcbiAgICAgICAgICBhY3Rpb246IEFjdGlvbnMuZGllLFxuICAgICAgICB9KTtcblxuICAgICAgICBzdGF0ZS5pbnN0YW5jZS5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmVhcm5lZE1vbmV5ICs9IGJvbnVzTW9uZXk7XG4gICAgICAgIHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzLnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gI2VuZHJlZ2lvblxuICAvLyAjcmVnaW9uIGhlbHBlcnNcblxuICBpc0luRnJvbnRPZkVuZW15KHN0YXRlKSB7XG4gICAgaWYgKHRoaXMucGxheWVyc1VuaXQpIHtcbiAgICAgIGNvbnN0IG9wcG9uZW50ID0gc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF07XG4gICAgICBjb25zdCB4SW1wYWN0QXJlYSA9IHRoaXMueCArIHRoaXMuZ2V0Q3VycmVudFNwcml0ZSgpLmJvZHlYT2Zmc2V0ICsgdGhpcy5yYW5nZUF0dGFjaztcbiAgICAgIHJldHVybiBvcHBvbmVudCAmJiB4SW1wYWN0QXJlYSA+PSBvcHBvbmVudC54ICsgb3Bwb25lbnQuZ2V0Q3VycmVudFNwcml0ZSgpLmJvZHlYT2Zmc2V0O1xuICAgIH1cblxuICAgIGNvbnN0IG9wcG9uZW50ID0gc3RhdGUuY3VycmVudExldmVsLmFsbGllc1swXTtcbiAgICBjb25zdCB4SW1wYWN0QXJlYSA9ICh0aGlzLnggKyB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5ib2R5WE9mZnNldCkgLSB0aGlzLnJhbmdlQXR0YWNrO1xuICAgIHJldHVybiBvcHBvbmVudCAmJiB4SW1wYWN0QXJlYSA8PSBvcHBvbmVudC54ICsgb3Bwb25lbnQuZ2V0Q3VycmVudFNwcml0ZSgpLmJvZHlYT2Zmc2V0O1xuICB9XG5cbiAgaXNFbmVteUR5aW5nKHN0YXRlKSB7XG4gICAgaWYgKHRoaXMucGxheWVyc1VuaXQgJiYgc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXNbMF0uaGVhbHRoIDw9IDA7XG4gICAgfSBlbHNlIGlmICghdGhpcy5wbGF5ZXJzVW5pdCAmJiBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXNbMF0uaGVhbHRoIDw9IDA7XG4gICAgfVxuICB9XG5cbiAgaXNJbkZyb250T2ZBbGx5KHN0YXRlKSB7XG4gICAgaWYgKHRoaXMucGxheWVyc1VuaXQpIHtcbiAgICAgIGNvbnN0IG5leHRBbGx5ID0gc3RhdGUuY3VycmVudExldmVsLmFsbGllc1t0aGlzLmdldFVuaXRQb3NpdGlvbihzdGF0ZSkgLSAxXTtcbiAgICAgIHJldHVybiBuZXh0QWxseSAmJiB0aGlzLnggKyB0aGlzLmdldEN1cnJlbnRTcHJpdGUoKS5mcmFtZVdpZHRoID49IG5leHRBbGx5Lng7XG4gICAgfVxuXG4gICAgY29uc3QgbmV4dEFsbHkgPSBzdGF0ZS5jdXJyZW50TGV2ZWwuZW5lbWllc1t0aGlzLmdldFVuaXRQb3NpdGlvbihzdGF0ZSkgLSAxXTtcbiAgICByZXR1cm4gbmV4dEFsbHkgJiYgdGhpcy54IDw9IG5leHRBbGx5LnggKyBuZXh0QWxseS5nZXRDdXJyZW50U3ByaXRlKCkuZnJhbWVXaWR0aDtcbiAgfVxuXG4gIGdldFVuaXRQb3NpdGlvbihzdGF0ZSkge1xuICAgIHJldHVybiB0aGlzLnBsYXllcnNVbml0XG4gICAgICA/IHN0YXRlLmN1cnJlbnRMZXZlbC5hbGxpZXMuZmluZEluZGV4KGFsbHkgPT4gYWxseS5pZCA9PT0gdGhpcy5pZClcbiAgICAgIDogc3RhdGUuY3VycmVudExldmVsLmVuZW1pZXMuZmluZEluZGV4KGVuZW15ID0+IGVuZW15LmlkID09PSB0aGlzLmlkKTtcbiAgfVxuXG4gIHVwZGF0ZVkoc3RhdGUpIHtcbiAgICBjb25zdCB1bml0SGVpZ2h0ID0gdGhpcy5nZXRDdXJyZW50U3ByaXRlKCkuZnJhbWVIZWlnaHQ7XG4gICAgdGhpcy55ID0gc3RhdGUuY3VycmVudExldmVsLmdyb3VuZExldmVsWSAtIHVuaXRIZWlnaHQ7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uXG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0L3VuaXQuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQnV0dG9uIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykgdGhyb3cgbmV3IEVycm9yKCdCdXR0b24gb3B0aW9ucyBtaXNzaW5nJyk7XG5cbiAgICB0aGlzLnggPSBvcHRpb25zLng7XG4gICAgdGhpcy55ID0gb3B0aW9ucy55O1xuICAgIHRoaXMuaGVpZ2h0ID0gb3B0aW9ucy5oZWlnaHQ7XG4gICAgdGhpcy53aWR0aCA9IG9wdGlvbnMud2lkdGg7XG4gICAgdGhpcy5pY29uVXJsID0gb3B0aW9ucy5pY29uVXJsO1xuICAgIHRoaXMuY2xpY2tIYW5kbGVyID0gb3B0aW9ucy5jbGlja0hhbmRsZXI7XG5cbiAgICBpZiAob3B0aW9ucy5pY29uVXJsKSB7XG4gICAgICB0aGlzLnNldEljb24ob3B0aW9ucy5pY29uVXJsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pY29uID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBzZXRJY29uKHVybCkge1xuICAgIGNvbnN0IGljb24gPSBuZXcgSW1hZ2UoKTtcbiAgICBpY29uLnNyYyA9IHVybDtcbiAgICB0aGlzLmljb24gPSBpY29uO1xuICB9XG5cbiAgcmVuZGVyKGNvbnRleHQpIHtcbiAgICBjb250ZXh0LmRyYXdJbWFnZSh0aGlzLmljb24sIHRoaXMueCwgdGhpcy55KTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29udHJvbHMvYnV0dG9uLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFNjZW5lQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYykge1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLmdhbWVDYW52YXMgPSBnYW1lQ2FudmFzO1xuICAgIHRoaXMubXVzaWMgPSBtdXNpYztcbiAgfVxuXG4gIGZyYW1lKHRpbWVzdGFtcCkge1xuICAgIHRoaXMudXBkYXRlU3RhdGUodGltZXN0YW1wKTtcbiAgICB0aGlzLnJlbmRlcih0aW1lc3RhbXApO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdOb3QgaW1wbGVtZW50ZWQuJyk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NjZW5lcy9zY2VuZS5iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IEFjdGlvbnMgPSB7XG4gIGlkbGU6ICdpZGxlJyxcbiAgc3RlcDogJ3N0ZXAnLFxuICBhdHRhY2s6ICdhdHRhY2snLFxuICBkaWU6ICdkaWUnLFxuICBoZWFsOiAnaGVhbCcsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBBY3Rpb25zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdC9hY3Rpb25zLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IERpcmVjdGlvbiA9IHtcbiAgbGVmdDogJ2xlZnQnLFxuICByaWdodDogJ3JpZ2h0Jyxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IERpcmVjdGlvbjtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvZGlyZWN0aW9uLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBTa2VsZXRvbiBmcm9tICcuLi91bml0cy9za2VsZXRvbi9za2VsZXRvbic7XG5pbXBvcnQgS25pZ2h0IGZyb20gJy4uL3VuaXRzL2tuaWdodC9rbmlnaHQnO1xuaW1wb3J0IENvdW50cnlLbmlnaHQgZnJvbSAnLi4vdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQnO1xuaW1wb3J0IFJvZ3VlIGZyb20gJy4uL3VuaXRzL3JvZ3VlL3JvZ3VlJztcbmltcG9ydCBCbG9iIGZyb20gJy4uL3VuaXRzL2Jsb2IvYmxvYic7XG5pbXBvcnQgV2l6YXJkIGZyb20gJy4uL3VuaXRzL3dpemFyZC93aXphcmQnO1xuaW1wb3J0IEJhbmRpdCBmcm9tICcuLi91bml0cy9iYW5kaXQvYmFuZGl0JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVW5pdEZhY3Rvcnkge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICB0aGlzLmlkID0gMDtcbiAgfVxuXG4gIHN0YXRpYyBnZXRTaW5nbGV0b25JbnN0YW5jZSgpIHtcbiAgICBpZiAoIVVuaXRGYWN0b3J5Lmluc3RhbmNlKSBVbml0RmFjdG9yeS5pbnN0YW5jZSA9IG5ldyBVbml0RmFjdG9yeSgpO1xuICAgIHJldHVybiBVbml0RmFjdG9yeS5pbnN0YW5jZTtcbiAgfVxuXG4gIGNyZWF0ZSh1bml0TmFtZSwgZGlyZWN0aW9uKSB7XG4gICAgc3dpdGNoICh1bml0TmFtZSkge1xuICAgICAgY2FzZSAnc2tlbGV0b24nOiByZXR1cm4gbmV3IFNrZWxldG9uKHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcbiAgICAgIGNhc2UgJ2tuaWdodCc6IHJldHVybiBuZXcgS25pZ2h0KHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcbiAgICAgIGNhc2UgJ2NvdW50cnkta25pZ2h0JzogcmV0dXJuIG5ldyBDb3VudHJ5S25pZ2h0KHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcbiAgICAgIGNhc2UgJ3JvZ3VlJzogcmV0dXJuIG5ldyBSb2d1ZSh0aGlzLmlkKyssIGRpcmVjdGlvbik7XG4gICAgICBjYXNlICdibG9iJzogcmV0dXJuIG5ldyBCbG9iKHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcbiAgICAgIGNhc2UgJ3dpemFyZCc6IHJldHVybiBuZXcgV2l6YXJkKHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcbiAgICAgIGNhc2UgJ2JhbmRpdCc6IHJldHVybiBuZXcgQmFuZGl0KHRoaXMuaWQrKywgZGlyZWN0aW9uKTtcbiAgICAgIGRlZmF1bHQ6IHRocm93IEVycm9yKCd3cm9uZyBuYW1lIG9mIHVuaXQhISEnKTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQtZmFjdG9yeS91bml0LWZhY3RvcnkuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEFjdGlvbnMgZnJvbSAnLi4vdW5pdC9hY3Rpb25zJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmxvYXRpbmdUZXh0IHtcbiAgY29uc3RydWN0b3IoY29udGV4dCkge1xuICAgIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgdGhpcy5zdGF0ZSA9IFtdO1xuICAgIHRoaXMuc2hpZnRSaWdodCA9IGZhbHNlO1xuICAgIHRoaXMuc2hpZnQgPSAwO1xuICB9XG5cbiAgc3RhdGljIGdldFNpbmdsZXRvbkluc3RhbmNlKGNvbnRleHQpIHtcbiAgICBpZiAoIUZsb2F0aW5nVGV4dC5pbnN0YW5jZSkgRmxvYXRpbmdUZXh0Lmluc3RhbmNlID0gbmV3IEZsb2F0aW5nVGV4dChjb250ZXh0KTtcbiAgICByZXR1cm4gRmxvYXRpbmdUZXh0Lmluc3RhbmNlO1xuICB9XG5cbiAgYWRkKHVuaXQpIHtcbiAgICBpZiAodW5pdC5pc01pc3NIaXQpIHVuaXQudGV4dCA9ICdtaXNzJztcbiAgICBlbHNlIGlmICh1bml0LmlzQ3JpdGljYWxIaXQpIHVuaXQudGV4dCA9IGAke3VuaXQudGV4dH0hYDtcblxuICAgIHRoaXMuc3RhdGUucHVzaCh7XG4gICAgICB0ZXh0OiB1bml0LnRleHQsXG4gICAgICBwb3NpdGlvblg6IHVuaXQucG9zaXRpb25YLFxuICAgICAgcG9zaXRpb25ZOiB1bml0LnBvc2l0aW9uWSxcbiAgICAgIGFjdGlvbjogdW5pdC5hY3Rpb24sXG4gICAgICBpc0NyaXRpY2FsSGl0OiB1bml0LmlzQ3JpdGljYWxIaXQsXG4gICAgICBpc01pc3NIaXQ6IHVuaXQuaXNNaXNzSGl0LFxuICAgICAgb3BhY2l0eTogMSxcbiAgICB9KTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICB0aGlzLnN0YXRlLmZvckVhY2goKHRleHRQYXJhbSkgPT4ge1xuICAgICAgdGhpcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgIHRoaXMuY29udGV4dC5mb250ID0gJzE0cHggUGl4ZWxhdGUnO1xuXG4gICAgICBpZiAodGV4dFBhcmFtLmlzTWlzc0hpdCkge1xuICAgICAgICB0aGlzLmNvbnRleHQuZm9udCA9ICcxMHB4IFBpeGVsYXRlJztcbiAgICAgICAgY29uc3QgcHVycGxlQ29sb3IgPSBgcmdiYSgyMjMsIDIxNSwgMjE1LCAke3RleHRQYXJhbS5vcGFjaXR5fSlgO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gcHVycGxlQ29sb3I7XG4gICAgICB9IGVsc2UgaWYgKHRleHRQYXJhbS5hY3Rpb24gPT09IEFjdGlvbnMuYXR0YWNrICYmICF0ZXh0UGFyYW0uaXNDcml0aWNhbEhpdCkge1xuICAgICAgICBjb25zdCByZWRDb2xvciA9IGByZ2JhKDI0OCwgMjIsIDk3LCAke3RleHRQYXJhbS5vcGFjaXR5fSlgO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gcmVkQ29sb3I7XG4gICAgICB9IGVsc2UgaWYgKHRleHRQYXJhbS5hY3Rpb24gPT09IEFjdGlvbnMuYXR0YWNrICYmIHRleHRQYXJhbS5pc0NyaXRpY2FsSGl0KSB7XG4gICAgICAgIHRoaXMuY29udGV4dC5mb250ID0gJzIwcHggUGl4ZWxhdGUnO1xuICAgICAgICBjb25zdCByZWRDb2xvciA9IGByZ2JhKDI0OCwgMjIsIDk3LCAke3RleHRQYXJhbS5vcGFjaXR5fSlgO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gcmVkQ29sb3I7XG4gICAgICB9IGVsc2UgaWYgKHRleHRQYXJhbS5hY3Rpb24gPT09IEFjdGlvbnMuaGVhbCkge1xuICAgICAgICBjb25zdCBncmVlbkNvbG9yID0gYHJnYmEoMTE3LCAyNDgsIDQ4LCAke3RleHRQYXJhbS5vcGFjaXR5fSlgO1xuICAgICAgICB0aGlzLmNvbnRleHQuZmlsbFN0eWxlID0gZ3JlZW5Db2xvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHdoaXRlID0gYHJnYmEoMjU1LCAyNTUsIDI1NSwgJHt0ZXh0UGFyYW0ub3BhY2l0eX0pYDtcbiAgICAgICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9IHdoaXRlO1xuICAgICAgfVxuICAgICAgdGhpcy5jb250ZXh0LmZpbGxUZXh0KGAke3RleHRQYXJhbS50ZXh0fWAsIHRleHRQYXJhbS5wb3NpdGlvblgsIHRleHRQYXJhbS5wb3NpdGlvblkpO1xuICAgICAgdGhpcy5jb250ZXh0LnJlc3RvcmUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIHVwZGF0ZVBvc2l0aW9uKCkge1xuICAgIHRoaXMuc3RhdGUuZm9yRWFjaCgodGV4dCkgPT4ge1xuICAgICAgaWYgKHRleHQub3BhY2l0eSA8PSAwKSB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5zdGF0ZS5maW5kSW5kZXgoY3VycmVudERhbWFnZSA9PiBjdXJyZW50RGFtYWdlID09PSB0ZXh0KTtcbiAgICAgICAgdGhpcy5zdGF0ZS5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGV4dC5wb3NpdGlvblggKz0gdGhpcy5zaGlmdDtcbiAgICAgICAgdGV4dC5wb3NpdGlvblkgLT0gMC43O1xuICAgICAgICB0ZXh0Lm9wYWNpdHkgLT0gMC4wMTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICB0aGlzLnRpY2soKTtcbiAgfVxuXG4gIHRpY2soKSB7XG4gICAgaWYgKHRoaXMuc2hpZnQgPj0gMC41KSB0aGlzLnNoaWZ0UmlnaHQgPSBmYWxzZTtcbiAgICBlbHNlIGlmICh0aGlzLnNoaWZ0IDw9IC0wLjUpIHRoaXMuc2hpZnRSaWdodCA9IHRydWU7XG4gICAgaWYgKHRoaXMuc2hpZnRSaWdodCkgdGhpcy5zaGlmdCArPSAwLjAzO1xuICAgIGVsc2UgdGhpcy5zaGlmdCAtPSAwLjAzO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9mbG9hdGluZy10ZXh0L2Zsb2F0aW5nLXRleHQuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgUXVldWUge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSkge1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgfVxuXG4gIHF1ZXVlQWxseShhbGxpZXMsIGFsbHkpIHtcbiAgICBsZXQgaG9yaXpvbnRhbFBvc2l0aW9uID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5hbGxpZXNTcGF3blg7XG5cbiAgICBpZiAoIWFsbGllcy5sZW5ndGgpIHtcbiAgICAgIGFsbHkueCA9IGhvcml6b250YWxQb3NpdGlvbiAtIDUwO1xuICAgICAgYWxseS55ID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5ncm91bmRMZXZlbFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFsbGllcy5mb3JFYWNoKChhbGx5VW5pdCkgPT4ge1xuICAgICAgICBpZiAoaG9yaXpvbnRhbFBvc2l0aW9uID4gYWxseVVuaXQueCkgaG9yaXpvbnRhbFBvc2l0aW9uID0gYWxseVVuaXQueDtcbiAgICAgIH0pO1xuXG4gICAgICBhbGx5LnggPSBob3Jpem9udGFsUG9zaXRpb24gLSA1MDtcbiAgICAgIGFsbHkueSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuZ3JvdW5kTGV2ZWxZO1xuICAgIH1cbiAgfVxuXG4gIHF1ZXVlRW5lbXkoZW5lbWllcywgZW5lbXkpIHtcbiAgICBsZXQgaG9yaXpvbnRhbFBvc2l0aW9uID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5lbmVtaWVzU3Bhd25YO1xuXG4gICAgaWYgKCFlbmVtaWVzLmxlbmd0aCkge1xuICAgICAgZW5lbXkueCA9IGhvcml6b250YWxQb3NpdGlvbjtcbiAgICAgIGVuZW15LnkgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmdyb3VuZExldmVsWTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW5lbWllcy5mb3JFYWNoKChlbmVteVVuaXQpID0+IHtcbiAgICAgICAgaWYgKGhvcml6b250YWxQb3NpdGlvbiA8IGVuZW15VW5pdC54KSBob3Jpem9udGFsUG9zaXRpb24gPSBlbmVteVVuaXQueDtcbiAgICAgIH0pO1xuXG4gICAgICBlbmVteS54ID0gaG9yaXpvbnRhbFBvc2l0aW9uICsgNTA7XG4gICAgICBlbmVteS55ID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5ncm91bmRMZXZlbFk7XG4gICAgfVxuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9xdWV1ZS9xdWV1ZS5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBEaWFsb2cge1xuICBjb25zdHJ1Y3Rvcihjb250ZXh0KSB7XG4gICAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgICB0aGlzLm9wYWNpdHkgPSAwO1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgfVxuXG4gIG9wZW4obWVzc2FnZSwgbWVzc2FnZVgsIGJ1dHRvbnMpIHtcbiAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIHRoaXMubWVzc2FnZVggPSBtZXNzYWdlWDtcbiAgICB0aGlzLmJ1dHRvbnMgPSBidXR0b25zO1xuICAgIHRoaXMuaXNPcGVuZWQgPSB0cnVlO1xuICAgIHRoaXMuZmFkZUluID0gdHJ1ZTtcbiAgfVxuXG4gIGNsb3NlKCkge1xuICAgIHRoaXMuaXNPcGVuZWQgPSBmYWxzZTtcbiAgICB0aGlzLmZhZGVJbiA9IGZhbHNlO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGlmICghdGhpcy5pc09wZW5lZCAmJiB0aGlzLm9wYWNpdHkgPD0gMC4xKSByZXR1cm47XG5cbiAgICBpZiAoIXRoaXMuZmFkZUluKSB7XG4gICAgICBpZiAodGhpcy5vcGFjaXR5ID4gMC4xKSB7XG4gICAgICAgIHRoaXMub3BhY2l0eSAtPSAwLjAzO1xuICAgICAgICB0aGlzLmNvbnRleHQuc2F2ZSgpO1xuICAgICAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLm9wYWNpdHk7XG4gICAgICAgIHRoaXMuY29udGV4dC5maWxsVGV4dCh0aGlzLm1lc3NhZ2UsIHRoaXMubWVzc2FnZVgsIDIwMCk7XG4gICAgICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24ucmVuZGVyKHRoaXMuY29udGV4dCkpO1xuICAgICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5tZXNzYWdlID0gJyc7XG4gICAgICAgIHRoaXMubWVzc2FnZVggPSAwO1xuICAgICAgICB0aGlzLmJ1dHRvbnMgPSBbXTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3BhY2l0eSA8PSAxKSB0aGlzLm9wYWNpdHkgKz0gMC4wMTtcbiAgICAgIHRoaXMuY29udGV4dC5zYXZlKCk7XG4gICAgICB0aGlzLmNvbnRleHQuZ2xvYmFsQWxwaGEgPSB0aGlzLm9wYWNpdHk7XG4gICAgICB0aGlzLmNvbnRleHQuZmlsbFRleHQodGhpcy5tZXNzYWdlLCB0aGlzLm1lc3NhZ2VYLCAyMDApO1xuICAgICAgdGhpcy5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IGJ1dHRvbi5yZW5kZXIodGhpcy5jb250ZXh0KSk7XG4gICAgICB0aGlzLmNvbnRleHQucmVzdG9yZSgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuY2xvc2UoKTtcbiAgICB0aGlzLm9wYWNpdHkgPSAwO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9kaWFsb2cvZGlhbG9nLmpzXG4vLyBtb2R1bGUgaWQgPSA5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBHYW1lQ2FudmFzIGZyb20gJy4vZ2FtZS1jYW52YXMvZ2FtZS1jYW52YXMnO1xuaW1wb3J0IFN0YXRlIGZyb20gJy4vc3RhdGUvc3RhdGUnO1xuaW1wb3J0IE1lbnVTY2VuZSBmcm9tICcuL3NjZW5lcy9tZW51LnNjZW5lJztcbmltcG9ydCBHYW1lU2NlbmUgZnJvbSAnLi9zY2VuZXMvZ2FtZS5zY2VuZSc7XG5pbXBvcnQgTXVzaWMgZnJvbSAnLi9tdXNpYy9tdXNpYyc7XG5pbXBvcnQgU3RhdGlzdGljU2NlbmUgZnJvbSAnLi9zY2VuZXMvc3RhdGlzdGljLnNjZW5lJztcblxud2luZG93Lm9ubG9hZCA9ICgpID0+IHtcbiAgY29uc3Qgc3RhdGUgPSBuZXcgU3RhdGUoKTtcbiAgY29uc3QgZ2FtZUNhbnZhcyA9IG5ldyBHYW1lQ2FudmFzKCk7XG4gIGNvbnN0IG11c2ljID0gbmV3IE11c2ljKGdhbWVDYW52YXMpO1xuICBjb25zdCBtZW51U2NlbmUgPSBuZXcgTWVudVNjZW5lKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYyk7XG4gIGNvbnN0IGdhbWVTY2VuZSA9IG5ldyBHYW1lU2NlbmUoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcbiAgY29uc3Qgc3RhdGlzdGljU2NlbmUgPSBuZXcgU3RhdGlzdGljU2NlbmUoc3RhdGUsIGdhbWVDYW52YXMsIG11c2ljKTtcblxuICBzdGF0ZS5zY2VuZXMubWVudS5pbnN0YW5jZSA9IG1lbnVTY2VuZTtcbiAgc3RhdGUuc2NlbmVzLmdhbWUuaW5zdGFuY2UgPSBnYW1lU2NlbmU7XG4gIHN0YXRlLnNjZW5lcy5zdGF0aXN0aWMuaW5zdGFuY2UgPSBzdGF0aXN0aWNTY2VuZTtcbiAgc3RhdGUuY3VycmVudFNjZW5lID0gbWVudVNjZW5lO1xuXG4gICgoZnVuY3Rpb24gZnJhbWUodGltZXN0YW1wKSB7XG4gICAgc3RhdGUuY3VycmVudFNjZW5lLmZyYW1lKHRpbWVzdGFtcCk7XG4gICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGZyYW1lKTtcbiAgfSkoKSk7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvbWFpbi5qc1xuLy8gbW9kdWxlIGlkID0gMTBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgR2FtZUNhbnZhcyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgdGhpcy5jYW52YXMuaWQgPSAnY2FudmFzJztcbiAgICB0aGlzLmNhbnZhcy53aWR0aCA9IDExMDA7XG4gICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gNzAwO1xuICAgIHRoaXMuY29udGV4dCA9IHRoaXMuY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5jb250ZXh0LmZvbnQgPSAnMzBweCBQaXhlbGF0ZSc7XG4gICAgdGhpcy5jb250ZXh0LmZpbGxTdHlsZSA9ICd3aGl0ZSc7XG5cbiAgICB0aGlzLmN1cnNvciA9IG5ldyBJbWFnZSgpO1xuICAgIHRoaXMuY3Vyc29yLnNyYyA9ICdpbWdzL1VJL2N1cnNvci5wbmcnO1xuICAgIC8vIHRoaXMuaW1nID0gJ3VybChcImltZ3MvVUkvY3Vyc29yLnBuZ1wiKSwgYXV0byc7XG5cbiAgICB0aGlzLmNsaWNrU3Vic2NyaWJlcnMgPSBbXTtcblxuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5jYW52YXMpO1xuXG4gICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZSkgPT4ge1xuICAgICAgdGhpcy5leGVjdXRlQ2xpY2tIYW5kbGVycyhlKTtcbiAgICB9KTtcbiAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCAoZSkgPT4ge1xuICAgICAgdGhpcy5jaGFuZ2VNb3VzZShlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHN1YnNjcmliZU9uQ2xpY2soLi4uc3Vic2NyaWJlcnMpIHtcbiAgICBzdWJzY3JpYmVycy5mb3JFYWNoKHN1YnNjcmliZXIgPT4gdGhpcy5jbGlja1N1YnNjcmliZXJzLnB1c2goc3Vic2NyaWJlcikpO1xuICB9XG5cbiAgdW5zdWJzY3JpYmVDbGljayhzdWJzY3JpYmVyKSB7XG4gICAgaWYgKHN1YnNjcmliZXIpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5jbGlja1N1YnNjcmliZXJzLmluZGV4T2Yoc3Vic2NyaWJlcik7XG4gICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICB0aGlzLmNsaWNrU3Vic2NyaWJlcnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbGlja1N1YnNjcmliZXJzID0gW107XG4gICAgfVxuICB9XG5cbiAgZXhlY3V0ZUNsaWNrSGFuZGxlcnMoZSkge1xuICAgIGNvbnN0IHggPSBlLmNsaWVudFggLSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS5sZWZ0O1xuICAgIGNvbnN0IHkgPSBlLmNsaWVudFkgLSB0aGlzLmNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgdGhpcy5jbGlja1N1YnNjcmliZXJzLmZvckVhY2goKHN1YnNjcmliZXIpID0+IHtcbiAgICAgIGNvbnN0IGNsaWNrZWRJbnNpZGVTdWJzY3JpYmVyID0gc3Vic2NyaWJlci54IDw9IHhcbiAgICAgICAgJiYgc3Vic2NyaWJlci54ICsgc3Vic2NyaWJlci53aWR0aCA+PSB4XG4gICAgICAgICYmIHN1YnNjcmliZXIueSA8PSB5XG4gICAgICAgICYmIHN1YnNjcmliZXIueSArIHN1YnNjcmliZXIuaGVpZ2h0ID49IHk7XG5cbiAgICAgIGlmIChjbGlja2VkSW5zaWRlU3Vic2NyaWJlcikgc3Vic2NyaWJlci5jbGlja0hhbmRsZXIoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGNoYW5nZU1vdXNlKGUpIHtcbiAgICBjb25zdCB4ID0gZS5jbGllbnRYIC0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICBjb25zdCB5ID0gZS5jbGllbnRZIC0gdGhpcy5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wO1xuICAgIGNvbnN0IGlzSG92ZXIgPSB0aGlzLmNsaWNrU3Vic2NyaWJlcnMuc29tZSgoc3Vic2NyaWJlcikgPT4ge1xuICAgICAgcmV0dXJuIHN1YnNjcmliZXIueCA8PSB4XG4gICAgICAgICYmIHN1YnNjcmliZXIueCArIHN1YnNjcmliZXIud2lkdGggPj0geFxuICAgICAgICAmJiBzdWJzY3JpYmVyLnkgPD0geVxuICAgICAgICAmJiBzdWJzY3JpYmVyLnkgKyBzdWJzY3JpYmVyLmhlaWdodCA+PSB5O1xuICAgIH0pO1xuXG4gICAgaWYgKGlzSG92ZXIpIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKS5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xuICAgIGVsc2UgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2dhbWUtY2FudmFzL2dhbWUtY2FudmFzLmpzXG4vLyBtb2R1bGUgaWQgPSAxMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgZGVmYXVsdHMgZnJvbSAnLi9jb25zdGFudHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0ZSB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuaXNQYXVzZWQgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRTY2VuZSA9IG51bGw7XG4gICAgdGhpcy5zY2VuZXMgPSB7XG4gICAgICBtZW51OiB7XG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgICBiYWNrZ3JvdW5kU3ByaXRlOiBudWxsLFxuICAgICAgICBjbG91ZHNJbWFnZTogbnVsbCxcbiAgICAgICAgY2xvdWRzT2Zmc2V0WDogMCxcbiAgICAgICAgYmVsdDogbnVsbCxcbiAgICAgICAgYmVsdFk6IC03MjAsXG4gICAgICAgIG1lbnVTaGVldDogbnVsbCxcbiAgICAgICAgbWVudVNoZWV0WTogLTU1MCxcbiAgICAgICAgYWJvdXRTaGVldDogbnVsbCxcbiAgICAgICAgYWJvdXRTaGVldFk6IC02ODAsXG4gICAgICAgIGFib3V0U2hlZXRWaXNpYmxlOiBmYWxzZSxcbiAgICAgICAgdmVsb2NpdHk6IDAsXG4gICAgICAgIGFuZ2xlOiAwLjAxLFxuICAgICAgICBncmF2aXR5OiAtOS44MDY2NSxcbiAgICAgICAgYWNjZWxlcmF0aW9uOiBudWxsLFxuICAgICAgfSxcbiAgICAgIGdhbWU6IHtcbiAgICAgICAgaW5zdGFuY2U6IG51bGwsXG4gICAgICAgIGVuZW1pZXNTcGF3blg6IGRlZmF1bHRzLmVuZW1pZXNTcGF3blgsXG4gICAgICAgIGFsbGllc1NwYXduWDogZGVmYXVsdHMuYWxsaWVzU3Bhd25YLFxuICAgICAgICBpc1BhdXNlR2FtZTogbnVsbCxcbiAgICAgICAgaXNEZW1vOiBudWxsLFxuICAgICAgICBtb25leTogbnVsbCxcbiAgICAgICAgcGFzdE1vbmV5OiBudWxsLFxuICAgICAgICBudW1iZXJPZkxldmVsczogbnVsbCxcbiAgICAgICAgY3VycmVudExldmVsOiB7XG4gICAgICAgICAgbGV2ZWxOdW1iZXI6IG51bGwsXG4gICAgICAgICAgYmFja2dyb3VuZDogbnVsbCxcbiAgICAgICAgICBncm91bmRMZXZlbFk6IG51bGwsXG4gICAgICAgICAgYWxsaWVzOiBudWxsLFxuICAgICAgICAgIGVuZW1pZXM6IG51bGwsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgICAgc3RhdGlzdGljOiB7XG4gICAgICAgIGluc3RhbmNlOiBudWxsLFxuICAgICAgICBiYWNrZ3JvdW5kOiBudWxsLFxuICAgICAgICB0aW1lU3BlbnQ6IDAsXG4gICAgICAgIGxldmVsc0ZhaWxlZDogMCxcbiAgICAgICAgdG90YWxEYW1hZ2U6IDAsXG4gICAgICAgIHJlY2VpdmVkRGFtYWdlOiAwLFxuICAgICAgICBlYXJuZWRNb25leTogZGVmYXVsdHMuc3RhcnRNb25leSxcbiAgICAgICAgaGVhbGVkSHA6IDAsXG4gICAgICB9LFxuICAgIH07XG4gIH1cblxuICByZXNldCgpIHtcbiAgICB0aGlzLnNjZW5lcy5nYW1lLm1vbmV5ID0gZGVmYXVsdHMuc3RhcnRNb25leTtcbiAgICB0aGlzLnNjZW5lcy5nYW1lLnBhc3RNb25leSA9IGRlZmF1bHRzLnN0YXJ0TW9uZXk7XG4gICAgdGhpcy5zY2VuZXMuc3RhdGlzdGljLnRpbWVTcGVudCA9IDA7XG4gICAgdGhpcy5zY2VuZXMuc3RhdGlzdGljLmxldmVsc0ZhaWxlZCA9IDA7XG4gICAgdGhpcy5zY2VuZXMuc3RhdGlzdGljLnRvdGFsRGFtYWdlID0gMDtcbiAgICB0aGlzLnNjZW5lcy5zdGF0aXN0aWMucmVjZWl2ZWREYW1hZ2UgPSAwO1xuICAgIHRoaXMuc2NlbmVzLnN0YXRpc3RpYy5lYXJuZWRNb25leSA9IGRlZmF1bHRzLnN0YXJ0TW9uZXk7XG4gICAgdGhpcy5zY2VuZXMuc3RhdGlzdGljLmhlYWxlZEhwID0gMDtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvc3RhdGUvc3RhdGUuanNcbi8vIG1vZHVsZSBpZCA9IDEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IGRlZmF1bHRzID0ge1xuICBlbmVtaWVzU3Bhd25YOiAxMTAwLFxuICBhbGxpZXNTcGF3blg6IDAsXG4gIHN0YXJ0TW9uZXk6IDEwLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgZGVmYXVsdHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zdGF0ZS9jb25zdGFudHMuanNcbi8vIG1vZHVsZSBpZCA9IDEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBTY2VuZUJhc2UgZnJvbSAnLi9zY2VuZS5iYXNlJztcbmltcG9ydCBCdXR0b24gZnJvbSAnLi4vY29udHJvbHMvYnV0dG9uJztcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vdW5pdC9zcHJpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBNZW51U2NlbmUgZXh0ZW5kcyBTY2VuZUJhc2Uge1xuICBjb25zdHJ1Y3RvcihzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMpIHtcbiAgICBzdXBlcihzdGF0ZSwgZ2FtZUNhbnZhcywgbXVzaWMpO1xuXG4gICAgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlID0gbmV3IFNwcml0ZSh7XG4gICAgICB1cmw6ICdpbWdzL1VJL21lbnUucG5nJyxcbiAgICAgIGZyYW1lV2lkdGg6IDExMDAsXG4gICAgICBmcmFtZUhlaWdodDogNzAwLFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxuICAgICAgdGltZVRvRnJhbWU6IDI3MCxcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzSW1hZ2UgPSBuZXcgSW1hZ2UoKTtcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc0ltYWdlLnNyYyA9ICdpbWdzL1VJL21lbnUtY2xvdWRzLnBuZyc7XG5cbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmJlbHQgPSBuZXcgSW1hZ2UoKTtcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmJlbHQuc3JjID0gJ2ltZ3MvVUkvYmVsdC5wbmcnO1xuXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5tZW51U2hlZXQgPSBuZXcgSW1hZ2UoKTtcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lm1lbnVTaGVldC5zcmMgPSAnaW1ncy9VSS9zaGVldC5wbmcnO1xuXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0ID0gbmV3IEltYWdlKCk7XG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0LnNyYyA9ICdpbWdzL1VJL2Fib3V0LXNoZWV0LnBuZyc7XG5cbiAgICB0aGlzLmJ1dHRvbnMgPSB0aGlzLmdldEJ1dHRvbnNDb25maWcoKS5tYXAob3B0aW9ucyA9PiBuZXcgQnV0dG9uKG9wdGlvbnMpKTtcbiAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayguLi50aGlzLmJ1dHRvbnMpO1xuICAgIHRoaXMubXVzaWMuc3Vic2NyaWJlKCk7XG5cbiAgICB0aGlzLnByZXZUaW1lU3RhbXAgPSAwO1xuICB9XG5cbiAgdXBkYXRlU3RhdGUoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzT2Zmc2V0WCA+PSA5MDApIHtcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzT2Zmc2V0WCA9IDA7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzT2Zmc2V0WCArPSAwLjE7XG5cbiAgICBpZiAodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5iZWx0WSA8IDApIHtcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdFkgKz0gMTA7XG4gICAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51Lm1lbnVTaGVldFkgKz0gMTA7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFZpc2libGVcbiAgICAgICYmIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkgPCAtMTUpIHtcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkgKz0gMTU7XG4gICAgfSBlbHNlIGlmICghdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0VmlzaWJsZVxuICAgICAgJiYgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0WSA+IC02ODApIHtcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkgLT0gMTU7XG4gICAgfVxuXG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hY2NlbGVyYXRpb25cbiAgICAgID0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5ncmF2aXR5ICogTWF0aC5zaW4odGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hbmdsZSk7XG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS52ZWxvY2l0eVxuICAgICAgKz0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hY2NlbGVyYXRpb24gKiAwLjAxO1xuICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYW5nbGUgKz0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS52ZWxvY2l0eSAqIDAuMDE7XG4gIH1cblxuICByZW5kZXIodGltZXN0YW1wID0gMCkge1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZShcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuY2xvdWRzSW1hZ2UsXG4gICAgICB0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmNsb3Vkc09mZnNldFgsIDAsIDkwMCwgMTI2LCAyNTAsIDAsIDkwMCwgMTI2LFxuICAgICk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmltYWdlLCB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUuZ2V0RnJhbWVYKCksXG4gICAgICAwLCB0aGlzLnN0YXRlLmJhY2tncm91bmRTcHJpdGUuZnJhbWVXaWR0aCwgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmZyYW1lSGVpZ2h0LFxuICAgICAgMCwgMCwgdGhpcy5zdGF0ZS5iYWNrZ3JvdW5kU3ByaXRlLmZyYW1lV2lkdGgsIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS5mcmFtZUhlaWdodCxcbiAgICApO1xuICAgIHRoaXMuc3RhdGUuYmFja2dyb3VuZFNwcml0ZS50aWNrKHRpbWVzdGFtcCwgdGhpcy5wcmV2VGltZVN0YW1wKTtcblxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZShcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdCxcbiAgICAgIDAsIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYmVsdFksXG4gICAgKTtcblxuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnNhdmUoKTtcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC50cmFuc2xhdGUoMTQwLCAwKTtcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yb3RhdGUodGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hbmdsZSk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKFxuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5tZW51U2hlZXQsIC0yODAgLyAyLFxuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5tZW51U2hlZXRZLFxuICAgICk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuc2F2ZSgpO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnRyYW5zbGF0ZSg3MDAsIHRoaXMuc3RhdGUuc2NlbmVzLm1lbnUuYWJvdXRTaGVldFkpO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnJvdGF0ZSgtdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hbmdsZSAqIDUpO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLnN0YXRlLnNjZW5lcy5tZW51LmFib3V0U2hlZXQsIC00MTAgLyAyLCAwKTtcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yZXN0b3JlKCk7XG5cbiAgICB0aGlzLm11c2ljLnJlbmRlcigpO1xuXG4gICAgdGhpcy5wcmV2VGltZVN0YW1wID0gdGltZXN0YW1wO1xuICB9XG5cbiAgc3RhcnRHYW1lKCkge1xuICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUgPSB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmluc3RhbmNlO1xuICAgIHRoaXMuc3RhdGUucmVzZXQoKTsgLy8gVE9ETzogbWIgcmVuYW1lIHJlc2V0TW9uZXlcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzRGVtbyA9IGZhbHNlO1xuICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmluaXRpYWxpemUoMCk7XG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuZGlhbG9nLm9wZW4oJ1NlbGVjdCBhIHVuaXQgaW4gdGhlIHVwcGVyIHJpZ2h0IGNvcm5lcicsIDIwMCwgW10pO1xuICB9XG5cbiAgc3RhcnREZW1vR2FtZSgpIHtcbiAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xuICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5pbnN0YW5jZTtcbiAgICB0aGlzLnN0YXRlLnJlc2V0KCk7XG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5pc0RlbW8gPSB0cnVlO1xuICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmluaXRpYWxpemUoMCk7XG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCk7XG4gICAgdGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuZGlhbG9nLm9wZW4oJ1NlbGVjdCBhIHVuaXQgaW4gdGhlIHVwcGVyIHJpZ2h0IGNvcm5lcicsIDIwMCwgW10pO1xuICB9XG5cbiAgdG9nZ2xlQWJvdXQoKSB7XG4gICAgdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0VmlzaWJsZVxuICAgICAgPSAhdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5hYm91dFNoZWV0VmlzaWJsZTtcbiAgfVxuXG4gIGdldEJ1dHRvbnNDb25maWcoKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHtcbiAgICAgICAgeDogNzUsIHk6IDQwMCwgaGVpZ2h0OiA0NSwgd2lkdGg6IDE2NSwgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLnN0YXJ0R2FtZSgpLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgeDogNzUsIHk6IDQ1NSwgaGVpZ2h0OiA0NSwgd2lkdGg6IDE2NSwgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLnN0YXJ0RGVtb0dhbWUoKSxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHg6IDY1LCB5OiA1MTUsIGhlaWdodDogNDUsIHdpZHRoOiAxODUsIGNsaWNrSGFuZGxlcjogKCkgPT4gdGhpcy50b2dnbGVBYm91dCgpLFxuICAgICAgfSxcbiAgICBdO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zY2VuZXMvbWVudS5zY2VuZS5qc1xuLy8gbW9kdWxlIGlkID0gMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFNjZW5lQmFzZSBmcm9tICcuL3NjZW5lLmJhc2UnO1xuaW1wb3J0IENvbnRyb2xQYW5lbCBmcm9tICcuLi9jb250cm9sLXBhbmVsL2NvbnRyb2wtcGFuZWwnO1xuaW1wb3J0IERpYWxvZyBmcm9tICcuLi9kaWFsb2cvZGlhbG9nJztcbmltcG9ydCBVbml0RmFjdG9yeSBmcm9tICcuLi91bml0LWZhY3RvcnkvdW5pdC1mYWN0b3J5JztcbmltcG9ydCBRdWV1ZSBmcm9tICcuLi9xdWV1ZS9xdWV1ZSc7XG5pbXBvcnQgbGV2ZWxzIGZyb20gJy4uL2xldmVscy9sZXZlbHMnO1xuaW1wb3J0IGRlbW9MZXZlbHMgZnJvbSAnLi4vbGV2ZWxzL2RlbW9MZXZlbHMnO1xuaW1wb3J0IERpcmVjdGlvbiBmcm9tICcuLi91bml0L2RpcmVjdGlvbic7XG5pbXBvcnQgQnV0dG9uIGZyb20gJy4uL2NvbnRyb2xzL2J1dHRvbic7XG5pbXBvcnQgRmxvYXRpbmdUZXh0IGZyb20gJy4uL2Zsb2F0aW5nLXRleHQvZmxvYXRpbmctdGV4dCc7XG5pbXBvcnQgQnVmZk1hbmFnZXIgZnJvbSAnLi4vYnVmZi1tYW5hZ2VyL2J1ZmYtbWFuYWdlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdhbWVTY2VuZSBleHRlbmRzIFNjZW5lQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYykge1xuICAgIHN1cGVyKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYyk7XG5cbiAgICB0aGlzLmNvbnRyb2xQYW5lbCA9IG5ldyBDb250cm9sUGFuZWwoc3RhdGUsIGdhbWVDYW52YXMpO1xuICAgIHRoaXMuYnVmZk1hbmFnZXIgPSBuZXcgQnVmZk1hbmFnZXIoc3RhdGUsIGdhbWVDYW52YXMpO1xuICAgIHRoaXMuZmxvYXRpbmdUZXh0ID0gRmxvYXRpbmdUZXh0LmdldFNpbmdsZXRvbkluc3RhbmNlKGdhbWVDYW52YXMuY29udGV4dCk7XG4gICAgdGhpcy5kaWFsb2cgPSBuZXcgRGlhbG9nKGdhbWVDYW52YXMuY29udGV4dCk7XG4gICAgdGhpcy51bml0RmFjdG9yeSA9IFVuaXRGYWN0b3J5LmdldFNpbmdsZXRvbkluc3RhbmNlKCk7XG4gICAgdGhpcy5xdWV1ZSA9IG5ldyBRdWV1ZShzdGF0ZSk7XG4gICAgdGhpcy5wcmV2VGltZVN0YW1wID0gMDtcbiAgfVxuXG4gIHVwZGF0ZVN0YXRlKHRpbWVzdGFtcCkge1xuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllc1xuICAgICAgLmZvckVhY2goYWxseSA9PiBhbGx5LmRvQWN0aW9uKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUsIHRpbWVzdGFtcCkpO1xuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmVuZW1pZXNcbiAgICAgIC5mb3JFYWNoKGVuZW15ID0+IGVuZW15LmRvQWN0aW9uKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUsIHRpbWVzdGFtcCkpO1xuXG4gICAgY29uc3Qgd2lubmVyID0gdGhpcy5nZXRXaW5uZXIoKTtcbiAgICBpZiAod2lubmVyICYmICF0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzUGF1c2VHYW1lKSB7XG4gICAgICB0aGlzLnNob3dFbmRHYW1lV2luZG93KHdpbm5lcik7XG4gICAgfVxuXG4gICAgdGhpcy5idWZmTWFuYWdlci51cGRhdGVUaW1lKCk7XG5cbiAgICB0aGlzLmZsb2F0aW5nVGV4dC51cGRhdGVQb3NpdGlvbigpO1xuICB9XG5cbiAgcmVuZGVyKHRpbWVzdGFtcCkge1xuICAgIGNvbnN0IGdhbWVTdGF0ZSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWU7XG5cbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UoZ2FtZVN0YXRlLmN1cnJlbnRMZXZlbC5iYWNrZ3JvdW5kLCAwLCAwKTtcbiAgICB0aGlzLmNvbnRyb2xQYW5lbC5idXR0b25zLmZvckVhY2goYnV0dG9uID0+IGJ1dHRvbi5yZW5kZXIodGhpcy5nYW1lQ2FudmFzLmNvbnRleHQpKTtcblxuICAgIHRoaXMuYnVmZk1hbmFnZXIucmVuZGVyKCk7XG5cbiAgICBnYW1lU3RhdGUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKChhbGx5KSA9PiB7XG4gICAgICBjb25zdCBzcHJpdGUgPSBhbGx5LmdldEN1cnJlbnRTcHJpdGUoKTtcblxuICAgICAgc3ByaXRlLnRpY2sodGltZXN0YW1wLCB0aGlzLnByZXZUaW1lU3RhbXApO1xuXG4gICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIHNwcml0ZS5pbWFnZSwgc3ByaXRlLmdldEZyYW1lWCgpLCAwLCBzcHJpdGUuZnJhbWVXaWR0aCAtIDEsXG4gICAgICAgIHNwcml0ZS5mcmFtZUhlaWdodCwgYWxseS54ICsgc3ByaXRlLnhPZmZzZXQsXG4gICAgICAgIGFsbHkueSwgc3ByaXRlLmZyYW1lV2lkdGgsIHNwcml0ZS5mcmFtZUhlaWdodCxcbiAgICAgICk7XG4gICAgfSk7XG5cbiAgICBnYW1lU3RhdGUuY3VycmVudExldmVsLmVuZW1pZXMuZm9yRWFjaCgoZW5lbXkpID0+IHtcbiAgICAgIGNvbnN0IHNwcml0ZSA9IGVuZW15LmdldEN1cnJlbnRTcHJpdGUoKTtcbiAgICAgIGNvbnN0IGZyYW1lWCA9IChzcHJpdGUuZnJhbWVXaWR0aCAqIChzcHJpdGUubnVtYmVyT2ZGcmFtZXMgLSAxKSlcbiAgICAgICAgICAtIHNwcml0ZS5nZXRGcmFtZVgoKTtcblxuICAgICAgc3ByaXRlLnRpY2sodGltZXN0YW1wLCB0aGlzLnByZXZUaW1lU3RhbXApO1xuXG4gICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UoXG4gICAgICAgIHNwcml0ZS5pbWFnZSwgZnJhbWVYLCAwLCBzcHJpdGUuZnJhbWVXaWR0aCxcbiAgICAgICAgc3ByaXRlLmZyYW1lSGVpZ2h0LCBlbmVteS54ICsgc3ByaXRlLnhPZmZzZXQsXG4gICAgICAgIGVuZW15LnksIHNwcml0ZS5mcmFtZVdpZHRoLCBzcHJpdGUuZnJhbWVIZWlnaHQsXG4gICAgICApO1xuICAgIH0pO1xuXG4gICAgdGhpcy5mbG9hdGluZ1RleHQucmVuZGVyKCk7XG5cbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJCR7dGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leX1gLCAxMDIwLCA0MCk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7Z2FtZVN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciArIDF9LyR7Z2FtZVN0YXRlLm51bWJlck9mTGV2ZWxzfWAsIDEwMjAsIDkwKTtcbiAgICB0aGlzLnBhdXNlTWVudUJ1dHRvbi5yZW5kZXIodGhpcy5nYW1lQ2FudmFzLmNvbnRleHQpO1xuXG4gICAgdGhpcy5kaWFsb2cucmVuZGVyKCk7XG5cbiAgICB0aGlzLm11c2ljLnJlbmRlcigpO1xuXG4gICAgdGhpcy5wcmV2VGltZVN0YW1wID0gdGltZXN0YW1wO1xuICB9XG5cbiAgaW5pdGlhbGl6ZShsZXZlbCkge1xuICAgIGNvbnN0IFtzdGF0ZSwgaXNEZW1vXSA9IFt0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLCB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzRGVtb107XG5cbiAgICBzdGF0ZS5pc1BhdXNlR2FtZSA9IHRydWU7XG4gICAgc3RhdGUubnVtYmVyT2ZMZXZlbHMgPSBpc0RlbW8gPyBkZW1vTGV2ZWxzLmxlbmd0aCA6IGxldmVscy5sZW5ndGg7XG5cbiAgICB0aGlzLmxvYWRMZXZlbChsZXZlbCwgaXNEZW1vKTtcbiAgICB0aGlzLmNvbnRyb2xQYW5lbC5jcmVhdGVDb250cm9sUGFuZWwobGV2ZWwsIGlzRGVtbyk7XG4gICAgdGhpcy5hZGRCdWZmTWFuYWdlcigpO1xuXG4gICAgaWYgKCF0aGlzLm5leHRCdXR0b24pIHtcbiAgICAgIHRoaXMubmV4dEJ1dHRvbiA9IG5ldyBCdXR0b24oe1xuICAgICAgICB4OiA2NTAsXG4gICAgICAgIHk6IDI3MCxcbiAgICAgICAgaGVpZ2h0OiA2MSxcbiAgICAgICAgd2lkdGg6IDYxLFxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9uZXh0LWJ1dHRvbi5wbmcnLFxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgIHRoaXMuYnVmZk1hbmFnZXIuZnVsbFJlc2V0KCk7XG4gICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnVuc3Vic2NyaWJlQ2xpY2soKTtcbiAgICAgICAgICB0aGlzLmluaXRpYWxpemUoc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyICsgMSwgaXNEZW1vKTtcbiAgICAgICAgICB0aGlzLnN1YnNjcmliZUJ1dHRvbnNDbGljaygpO1xuICAgICAgICAgIHN0YXRlLnBhc3RNb25leSA9IHN0YXRlLm1vbmV5O1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5wcmV2QnV0dG9uKSB7XG4gICAgICB0aGlzLnByZXZCdXR0b24gPSBuZXcgQnV0dG9uKHtcbiAgICAgICAgeDogNjIwLFxuICAgICAgICB5OiAyNzAsXG4gICAgICAgIGhlaWdodDogNTUsXG4gICAgICAgIHdpZHRoOiA1NSxcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvVUkvcHJldi1idXR0b24ucG5nJyxcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB0aGlzLmJ1ZmZNYW5hZ2VyLmZ1bGxSZXNldCgpO1xuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XG4gICAgICAgICAgdGhpcy5pbml0aWFsaXplKHN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciAtIDEsIGlzRGVtbyk7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25zQ2xpY2soKTtcbiAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMubGV2ZWxzRmFpbGVkKys7XG4gICAgICAgICAgc3RhdGUubW9uZXkgPSBzdGF0ZS5wYXN0TW9uZXk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnJlcGxheUJ1dHRvbikge1xuICAgICAgdGhpcy5yZXBsYXlCdXR0b24gPSBuZXcgQnV0dG9uKHtcbiAgICAgICAgeDogNjUwLFxuICAgICAgICB5OiAyNzAsXG4gICAgICAgIGhlaWdodDogNTUsXG4gICAgICAgIHdpZHRoOiA1NSxcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvVUkvcmVwbGF5LnBuZycsXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgICAgdGhpcy5idWZmTWFuYWdlci5mdWxsUmVzZXQoKTtcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZShzdGF0ZS5jdXJyZW50TGV2ZWwubGV2ZWxOdW1iZXIsIGlzRGVtbyk7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25zQ2xpY2soKTtcbiAgICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMubGV2ZWxzRmFpbGVkKys7XG4gICAgICAgICAgc3RhdGUubW9uZXkgPSBzdGF0ZS5wYXN0TW9uZXk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmV4aXRCdXR0b24pIHtcbiAgICAgIHRoaXMuZXhpdEJ1dHRvbiA9IG5ldyBCdXR0b24oe1xuICAgICAgICB4OiA0NTAsXG4gICAgICAgIHk6IDI3MCxcbiAgICAgICAgaGVpZ2h0OiA3MyxcbiAgICAgICAgd2lkdGg6IDYxLFxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9leGl0LnBuZycsXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuZGlhbG9nLnJlc2V0KCk7XG4gICAgICAgICAgdGhpcy5idWZmTWFuYWdlci5mdWxsUmVzZXQoKTtcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xuICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lID0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5pbnN0YW5jZTtcbiAgICAgICAgICB0aGlzLm11c2ljLnN1YnNjcmliZSgpO1xuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKC4uLnRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmJ1dHRvbnMpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5jbG9zZUJ1dHRvbikge1xuICAgICAgdGhpcy5jbG9zZUJ1dHRvbiA9IG5ldyBCdXR0b24oe1xuICAgICAgICB4OiAzNTAsXG4gICAgICAgIHk6IDI3MCxcbiAgICAgICAgaGVpZ2h0OiA3MyxcbiAgICAgICAgd2lkdGg6IDYxLFxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9jbG9zZS5wbmcnLFxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmRpYWxvZy5jbG9zZSgpO1xuICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XG4gICAgICAgICAgdGhpcy5zdWJzY3JpYmVCdXR0b25zQ2xpY2soKTtcblxuICAgICAgICAgIHN0YXRlLmlzUGF1c2VHYW1lID0gZmFsc2U7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnBhdXNlTWVudUJ1dHRvbikge1xuICAgICAgdGhpcy5wYXVzZU1lbnVCdXR0b24gPSBuZXcgQnV0dG9uKHtcbiAgICAgICAgeDogMTAyNSxcbiAgICAgICAgeTogMTcwLFxuICAgICAgICBoZWlnaHQ6IDQwLFxuICAgICAgICB3aWR0aDogNjEsXG4gICAgICAgIGljb25Vcmw6ICdpbWdzL1VJL2hlbHAtbWVudS5wbmcnLFxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHtcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xuICAgICAgICAgIHN0YXRlLmlzUGF1c2VHYW1lID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLmRpYWxvZy5yZXNldCgpO1xuICAgICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gIXN0YXRlLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciA/IDU1MCA6IDQ5MDtcbiAgICAgICAgICB0aGlzLnByZXZCdXR0b24ueCA9IDYyMDtcbiAgICAgICAgICB0aGlzLnJlcGxheUJ1dHRvbi54ID0gNzYwO1xuICAgICAgICAgIGlmICghc3RhdGUuY3VycmVudExldmVsLmxldmVsTnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCdXaGF0IGRvIHlvdSB3YW50IHRvIGRvJywgMzUwLCBbdGhpcy5jbG9zZUJ1dHRvbiwgdGhpcy5leGl0QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbl0pO1xuICAgICAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5jbG9zZUJ1dHRvbiwgdGhpcy5leGl0QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbik7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZGlhbG9nLm9wZW4oJ1doYXQgZG8geW91IHdhbnQgdG8gZG8nLCAzNTAsIFt0aGlzLmNsb3NlQnV0dG9uLCB0aGlzLmV4aXRCdXR0b24sIHRoaXMucHJldkJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b25dKTtcbiAgICAgICAgICAgIHRoaXMuZ2FtZUNhbnZhcy5zdWJzY3JpYmVPbkNsaWNrKFxuICAgICAgICAgICAgICB0aGlzLmNsb3NlQnV0dG9uLFxuICAgICAgICAgICAgICB0aGlzLmV4aXRCdXR0b24sXG4gICAgICAgICAgICAgIHRoaXMucHJldkJ1dHRvbixcbiAgICAgICAgICAgICAgdGhpcy5yZXBsYXlCdXR0b24sXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAoIXRoaXMuc3RhdGlzdGljQnV0dG9uKSB7XG4gICAgICB0aGlzLnN0YXRpc3RpY0J1dHRvbiA9IG5ldyBCdXR0b24oe1xuICAgICAgICB4OiA2NTAsXG4gICAgICAgIHk6IDI3MCxcbiAgICAgICAgaGVpZ2h0OiA1NSxcbiAgICAgICAgd2lkdGg6IDU1LFxuICAgICAgICBpY29uVXJsOiAnaW1ncy9VSS9zdGF0aXN0aWMucG5nJyxcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kaWFsb2cuY2xvc2UoKTtcbiAgICAgICAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xuICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lID0gdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmluc3RhbmNlO1xuICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLnN1YnNjcmliZU9uQ2xpY2soKTtcbiAgICAgICAgICB0aGlzLm11c2ljLnN1YnNjcmliZSgpO1xuICAgICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmRpYWxvZy5vcGVuKCcnLCA1MDAsIFt0aGlzLnN0YXRlLmN1cnJlbnRTY2VuZS5leGl0QnV0dG9uXSk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBsb2FkTGV2ZWwobGV2ZWwsIGlzRGVtbykge1xuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcyA9IFtdO1xuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmVuZW1pZXMgPSBbXTtcblxuICAgIGNvbnN0IGN1cnJlbnRMZXZlbCA9IGlzRGVtbyA/IGRlbW9MZXZlbHNbbGV2ZWxdIDogbGV2ZWxzW2xldmVsXTtcbiAgICBjdXJyZW50TGV2ZWwuZW5lbWllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgY29uc3QgZW5lbXkgPSB0aGlzLnVuaXRGYWN0b3J5LmNyZWF0ZShlbnRyeS5uYW1lLCBEaXJlY3Rpb24ubGVmdCk7XG4gICAgICB0aGlzLnF1ZXVlLnF1ZXVlRW5lbXkodGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcywgZW5lbXkpO1xuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuZW5lbWllcy5wdXNoKGVuZW15KTtcbiAgICB9KTtcblxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmdyb3VuZExldmVsWSA9IGN1cnJlbnRMZXZlbC5ncm91bmRMZXZlbFk7XG5cbiAgICBjb25zdCBiYWNrZ3JvdW5kID0gbmV3IEltYWdlKCk7XG4gICAgYmFja2dyb3VuZC5zcmMgPSBjdXJyZW50TGV2ZWwuYmFja2dyb3VuZDtcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5iYWNrZ3JvdW5kID0gYmFja2dyb3VuZDtcblxuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmxldmVsTnVtYmVyID0gbGV2ZWw7XG4gIH1cblxuICBhZGRCdWZmTWFuYWdlcigpIHtcbiAgICB0aGlzLmJ1ZmZNYW5hZ2VyLmNyZWF0ZUJ1dHRvbigpO1xuICB9XG5cbiAgc3Vic2NyaWJlQnV0dG9uc0NsaWNrKCkge1xuICAgIHRoaXMuY29udHJvbFBhbmVsLnN1YnNjcmliZSgpO1xuICAgIHRoaXMuYnVmZk1hbmFnZXIuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5tdXNpYy5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLnBhdXNlTWVudUJ1dHRvbik7XG4gIH1cblxuICBnZXRXaW5uZXIoKSB7XG4gICAgY29uc3QgZW5lbWllcyA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmVuZW1pZXM7XG4gICAgY29uc3Qgbm9FbmVtaWVzTGVmdCA9ICFlbmVtaWVzLmxlbmd0aDtcbiAgICBjb25zdCBlbmVteVJlYWNoZWRMZWZ0U2lkZSA9IGVuZW1pZXNbMF0gJiYgZW5lbWllc1swXS54IDwgMDtcblxuICAgIGlmIChub0VuZW1pZXNMZWZ0KSByZXR1cm4gJ2FsbGllcyc7XG4gICAgaWYgKGVuZW15UmVhY2hlZExlZnRTaWRlKSByZXR1cm4gJ2VuZW1pZXMnO1xuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBzaG93RW5kR2FtZVdpbmRvdyh3aW5uZXIpIHtcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmlzUGF1c2VHYW1lID0gdHJ1ZTtcbiAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljaygpO1xuXG4gICAgaWYgKHdpbm5lciA9PT0gJ2FsbGllcycpIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRMZXZlbCA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmxldmVsTnVtYmVyO1xuICAgICAgY29uc3QgbGFzdExldmVsID0gdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5udW1iZXJPZkxldmVscyAtIDE7XG4gICAgICBjb25zdCBpc0xhc3RMZXZlbCA9IGN1cnJlbnRMZXZlbCA9PT0gbGFzdExldmVsO1xuICAgICAgaWYgKGlzTGFzdExldmVsKSB7XG4gICAgICAgIHRoaXMuZXhpdEJ1dHRvbi54ID0gNDUwO1xuICAgICAgICB0aGlzLmRpYWxvZy5vcGVuKCdHYW1lIG92ZXIuIFRoYW5rcyBmb3IgcGxheWluZyA6KScsIDI2MCwgW3RoaXMuZXhpdEJ1dHRvbiwgdGhpcy5zdGF0aXN0aWNCdXR0b25dKTtcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5leGl0QnV0dG9uLCB0aGlzLnN0YXRpc3RpY0J1dHRvbik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmV4aXRCdXR0b24ueCA9IDQ1MDtcbiAgICAgICAgdGhpcy5kaWFsb2cub3BlbignWW91IHdpbiEnLCA0OTUsIFt0aGlzLm5leHRCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbl0pO1xuICAgICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLm5leHRCdXR0b24sIHRoaXMuZXhpdEJ1dHRvbik7XG5cbiAgICAgICAgY29uc3QgYm9udXNNb25leSA9ICh0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlciAqIDMpICsgMztcbiAgICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leSArPSBib251c01vbmV5O1xuICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLnBhc3RNb25leSA9IHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXk7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh3aW5uZXIgPT09ICdlbmVtaWVzJyAmJiB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5sZXZlbE51bWJlcikge1xuICAgICAgdGhpcy5leGl0QnV0dG9uLnggPSA0MDA7XG4gICAgICB0aGlzLnByZXZCdXR0b24ueCA9IDU1MDtcbiAgICAgIHRoaXMucmVwbGF5QnV0dG9uLnggPSA3MDA7XG4gICAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmV4aXRCdXR0b24sIHRoaXMucHJldkJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b24pO1xuICAgICAgdGhpcy5kaWFsb2cub3BlbignWW91IGxvb3NlIDooIFRyeSBhZ2FpbiEnLCAzNzAsIFt0aGlzLmV4aXRCdXR0b24sIHRoaXMucHJldkJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b25dKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5leGl0QnV0dG9uLnggPSA0NTA7XG4gICAgICB0aGlzLnJlcGxheUJ1dHRvbi54ID0gNjUwO1xuICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2sodGhpcy5leGl0QnV0dG9uLCB0aGlzLnJlcGxheUJ1dHRvbik7XG4gICAgICB0aGlzLmRpYWxvZy5vcGVuKCdZb3UgbG9vc2UgOiggVHJ5IGFnYWluIScsIDM3MCwgW3RoaXMuZXhpdEJ1dHRvbiwgdGhpcy5yZXBsYXlCdXR0b25dKTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3NjZW5lcy9nYW1lLnNjZW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAxNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgQnV0dG9uIGZyb20gJy4uL2NvbnRyb2xzL2J1dHRvbic7XG5pbXBvcnQgcGFyYW1ldGVyc09mVW5pdEJ1dHRvbnMgZnJvbSAnLi9wYXJhbWV0ZXJzLXVuaXQtYnV0dG9ucyc7XG5pbXBvcnQgZGVtb1BhcmFtZXRlcnNPZlVuaXRCdXR0b25zIGZyb20gJy4vZGVtby1wYXJhbWV0ZXJzLXVuaXQtYnV0dG9ucyc7XG5pbXBvcnQgVW5pdEZhY3RvcnkgZnJvbSAnLi4vdW5pdC1mYWN0b3J5L3VuaXQtZmFjdG9yeSc7XG5pbXBvcnQgUXVldWUgZnJvbSAnLi4vcXVldWUvcXVldWUnO1xuaW1wb3J0IERpcmVjdGlvbiBmcm9tICcuLi91bml0L2RpcmVjdGlvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRyb2xQYW5lbCB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzKSB7XG4gICAgdGhpcy5idXR0b25zID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5nYW1lQ2FudmFzID0gZ2FtZUNhbnZhcztcbiAgICB0aGlzLnVuaXRGYWN0b3J5ID0gVW5pdEZhY3RvcnkuZ2V0U2luZ2xldG9uSW5zdGFuY2UoKTtcbiAgICB0aGlzLnF1ZXVlID0gbmV3IFF1ZXVlKHN0YXRlKTtcbiAgfVxuXG4gIGNyZWF0ZUNvbnRyb2xQYW5lbChsZXZlbCwgaXNEZW1vKSB7XG4gICAgY29uc3QgcGFybWV0ZXJzID0gaXNEZW1vXG4gICAgICA/IGRlbW9QYXJhbWV0ZXJzT2ZVbml0QnV0dG9uc1xuICAgICAgOiBwYXJhbWV0ZXJzT2ZVbml0QnV0dG9ucztcbiAgICB0aGlzLmJ1dHRvbnMgPSBwYXJtZXRlcnNbbGV2ZWxdLm1hcCgoYnV0dG9uUGFyYW0pID0+IHtcbiAgICAgIGNvbnN0IGJ1dHRvbiA9IG5ldyBCdXR0b24oe1xuICAgICAgICB4OiBidXR0b25QYXJhbS54LFxuICAgICAgICB5OiBidXR0b25QYXJhbS55LFxuICAgICAgICB3aWR0aDogYnV0dG9uUGFyYW0ud2lkdGgsXG4gICAgICAgIGhlaWdodDogYnV0dG9uUGFyYW0uaGVpZ2h0LFxuICAgICAgICBpY29uVXJsOiBidXR0b25QYXJhbS5pbWdVcmwsXG4gICAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4gdGhpcy5jcmVhdGVVbml0KGJ1dHRvblBhcmFtLm5hbWUpLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gYnV0dG9uO1xuICAgIH0pO1xuICB9XG5cbiAgY3JlYXRlVW5pdChuYW1lKSB7XG4gICAgY29uc3QgYWxseVVuaXQgPSB0aGlzLnVuaXRGYWN0b3J5LmNyZWF0ZShuYW1lLCBEaXJlY3Rpb24ucmlnaHQpO1xuXG4gICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgPj0gYWxseVVuaXQuY29zdCkge1xuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5tb25leSAtPSBhbGx5VW5pdC5jb3N0O1xuICAgICAgdGhpcy5xdWV1ZS5xdWV1ZUFsbHkodGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLCBhbGx5VW5pdCk7XG4gICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMucHVzaChhbGx5VW5pdCk7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lLmRpYWxvZy5jbG9zZSgpO1xuICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuaXNQYXVzZUdhbWUgPSBmYWxzZTtcbiAgfVxuXG4gIHN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayguLi50aGlzLmJ1dHRvbnMpO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb250cm9sLXBhbmVsL2NvbnRyb2wtcGFuZWwuanNcbi8vIG1vZHVsZSBpZCA9IDE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImNvbnN0IHBhcmFtZXRlcnNPZlVuaXRCdXR0b25zID0gW1xuICBbXG4gICAge1xuICAgICAgbmFtZTogJ3NrZWxldG9uJyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxuICAgICAgeDogMjAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgIHtcbiAgICAgIG5hbWU6ICdza2VsZXRvbicsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcbiAgICAgIHg6IDIwLFxuICAgICAgeTogMjAsXG4gICAgICB3aWR0aDogNDAsXG4gICAgICBoZWlnaHQ6IDQwLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3dpemFyZCcsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtaWNvbi5wbmcnLFxuICAgICAgeDogOTAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgIHtcbiAgICAgIG5hbWU6ICdza2VsZXRvbicsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcbiAgICAgIHg6IDIwLFxuICAgICAgeTogMjAsXG4gICAgICB3aWR0aDogNDAsXG4gICAgICBoZWlnaHQ6IDQwLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2tuaWdodCcsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtaWNvbi5wbmcnLFxuICAgICAgeDogOTAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiAxNjAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgIHtcbiAgICAgIG5hbWU6ICdza2VsZXRvbicsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcbiAgICAgIHg6IDIwLFxuICAgICAgeTogMjAsXG4gICAgICB3aWR0aDogNDAsXG4gICAgICBoZWlnaHQ6IDQwLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ2JhbmRpdCcsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2JhbmRpdC9iYW5kaXQtaWNvbi5wbmcnLFxuICAgICAgeDogOTAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiAxNjAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAna25pZ2h0JyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiAyMzAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgIHtcbiAgICAgIG5hbWU6ICdza2VsZXRvbicsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcbiAgICAgIHg6IDIwLFxuICAgICAgeTogMjAsXG4gICAgICB3aWR0aDogNDAsXG4gICAgICBoZWlnaHQ6IDQwLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3dpemFyZCcsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtaWNvbi5wbmcnLFxuICAgICAgeDogOTAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiAxNjAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAna25pZ2h0JyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiAyMzAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAncm9ndWUnLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1pY29uLnBuZycsXG4gICAgICB4OiAzMDAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgXSxcbiAgW1xuICAgIHtcbiAgICAgIG5hbWU6ICdza2VsZXRvbicsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLWljb24ucG5nJyxcbiAgICAgIHg6IDIwLFxuICAgICAgeTogMjAsXG4gICAgICB3aWR0aDogNDAsXG4gICAgICBoZWlnaHQ6IDQwLFxuICAgIH0sXG4gICAge1xuICAgICAgbmFtZTogJ3dpemFyZCcsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtaWNvbi5wbmcnLFxuICAgICAgeDogOTAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnY291bnRyeS1rbmlnaHQnLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9jb3VudHJ5LWtuaWdodC9jb3VudHJ5LWtuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiAxNjAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAna25pZ2h0JyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiAyMzAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAncm9ndWUnLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1pY29uLnBuZycsXG4gICAgICB4OiAzMDAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnYmFuZGl0JyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1pY29uLnBuZycsXG4gICAgICB4OiAzNzAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAnYmxvYicsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2Jsb2IvYmxvYi1pY29uLnBuZycsXG4gICAgICB4OiA0NDAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgXSxcbl07XG5cbmV4cG9ydCBkZWZhdWx0IHBhcmFtZXRlcnNPZlVuaXRCdXR0b25zO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvY29udHJvbC1wYW5lbC9wYXJhbWV0ZXJzLXVuaXQtYnV0dG9ucy5qc1xuLy8gbW9kdWxlIGlkID0gMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiY29uc3QgcGFyYW1ldGVyc09mVW5pdEJ1dHRvbnMgPSBbXG4gIFtcbiAgICB7XG4gICAgICBuYW1lOiAnc2tlbGV0b24nLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pY29uLnBuZycsXG4gICAgICB4OiAyMCxcbiAgICAgIHk6IDIwLFxuICAgICAgd2lkdGg6IDQwLFxuICAgICAgaGVpZ2h0OiA0MCxcbiAgICB9LFxuICBdLFxuICBbXG4gICAge1xuICAgICAgbmFtZTogJ3NrZWxldG9uJyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxuICAgICAgeDogMjAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAna25pZ2h0JyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiA5MCxcbiAgICAgIHk6IDIwLFxuICAgICAgd2lkdGg6IDQwLFxuICAgICAgaGVpZ2h0OiA0MCxcbiAgICB9LFxuICBdLFxuICBbXG4gICAge1xuICAgICAgbmFtZTogJ3NrZWxldG9uJyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24taWNvbi5wbmcnLFxuICAgICAgeDogMjAsXG4gICAgICB5OiAyMCxcbiAgICAgIHdpZHRoOiA0MCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgfSxcbiAgICB7XG4gICAgICBuYW1lOiAna25pZ2h0JyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pY29uLnBuZycsXG4gICAgICB4OiA5MCxcbiAgICAgIHk6IDIwLFxuICAgICAgd2lkdGg6IDQwLFxuICAgICAgaGVpZ2h0OiA0MCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICd3aXphcmQnLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWljb24ucG5nJyxcbiAgICAgIHg6IDE2MCxcbiAgICAgIHk6IDIwLFxuICAgICAgd2lkdGg6IDQwLFxuICAgICAgaGVpZ2h0OiA0MCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdiYW5kaXQnLFxuICAgICAgaW1nVXJsOiAnaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWljb24ucG5nJyxcbiAgICAgIHg6IDIzMCxcbiAgICAgIHk6IDIwLFxuICAgICAgd2lkdGg6IDQwLFxuICAgICAgaGVpZ2h0OiA0MCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdyb2d1ZScsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL3JvZ3VlL3JvZ3VlLWljb24ucG5nJyxcbiAgICAgIHg6IDMwMCxcbiAgICAgIHk6IDIwLFxuICAgICAgd2lkdGg6IDQwLFxuICAgICAgaGVpZ2h0OiA0MCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdjb3VudHJ5LWtuaWdodCcsXG4gICAgICBpbWdVcmw6ICdpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWljb24ucG5nJyxcbiAgICAgIHg6IDM3MCxcbiAgICAgIHk6IDIwLFxuICAgICAgd2lkdGg6IDQwLFxuICAgICAgaGVpZ2h0OiA0MCxcbiAgICB9LFxuICAgIHtcbiAgICAgIG5hbWU6ICdibG9iJyxcbiAgICAgIGltZ1VybDogJ2ltZ3MvdW5pdHMvYmxvYi9ibG9iLWljb24ucG5nJyxcbiAgICAgIHg6IDQ0MCxcbiAgICAgIHk6IDIwLFxuICAgICAgd2lkdGg6IDQwLFxuICAgICAgaGVpZ2h0OiA0MCxcbiAgICB9LFxuICBdLFxuXTtcblxuZXhwb3J0IGRlZmF1bHQgcGFyYW1ldGVyc09mVW5pdEJ1dHRvbnM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9jb250cm9sLXBhbmVsL2RlbW8tcGFyYW1ldGVycy11bml0LWJ1dHRvbnMuanNcbi8vIG1vZHVsZSBpZCA9IDE4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2tlbGV0b24gZXh0ZW5kcyBVbml0IHtcbiAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xuICAgIHN1cGVyKHtcbiAgICAgIGlkLFxuICAgICAgaGVhbHRoOiA4LFxuICAgICAgZGFtYWdlOiAyLFxuICAgICAgYXR0YWNrVGltZTogMjE0MixcbiAgICAgIHJhbmdlQXR0YWNrOiAyMyxcbiAgICAgIGNyaXRpY2FsQ2hhbmNlOiAwLjA3LFxuICAgICAgYWNjdXJhY3k6IDAuOTMsXG4gICAgICB0aW1lVG9IaXQ6IDk1MixcbiAgICAgIGRlYXRoVGltZTogMTkwMCxcbiAgICAgIHN0ZXBTaXplOiAwLjYsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBpZGxlVGltZTogMTAwMCxcbiAgICB9KTtcbiAgICB0aGlzLmNvc3QgPSAyO1xuICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xuICB9XG5cbiAgY29uZmlndXJlU3ByaXRlcygpIHtcbiAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiAyNCxcbiAgICAgIGZyYW1lSGVpZ2h0OiAzMixcbiAgICAgIG51bWJlck9mRnJhbWVzOiAxMSxcbiAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogMTAsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy9za2VsZXRvbi9za2VsZXRvbi13YWxrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiAyNCxcbiAgICAgIGZyYW1lSGVpZ2h0OiAzMyxcbiAgICAgIG51bWJlck9mRnJhbWVzOiAxMyxcbiAgICAgIHRpbWVUb0ZyYW1lOiA5MCxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiAxMCxcbiAgICB9KTtcblxuICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24tYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiA0MyxcbiAgICAgIGZyYW1lSGVpZ2h0OiAzNyxcbiAgICAgIG51bWJlck9mRnJhbWVzOiAxOCxcbiAgICAgIHRpbWVUb0ZyYW1lOiAxMjUsXG4gICAgICB4T2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMCA6IC0xNixcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiAxMCxcbiAgICB9KTtcblxuICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvc2tlbGV0b24vc2tlbGV0b24tZGllLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiAzMyxcbiAgICAgIGZyYW1lSGVpZ2h0OiAzMixcbiAgICAgIG51bWJlck9mRnJhbWVzOiAxNSxcbiAgICAgIHRpbWVUb0ZyYW1lOiAxNTAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogMTAsXG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL3NrZWxldG9uL3NrZWxldG9uLmpzXG4vLyBtb2R1bGUgaWQgPSAxOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBTcHJpdGVzIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5pZGxlID0gbnVsbDtcbiAgICB0aGlzLndhbGsgPSBudWxsO1xuICAgIHRoaXMuYXR0YWNrID0gbnVsbDtcbiAgICB0aGlzLmRpZSA9IG51bGw7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXQvc3ByaXRlcy5qc1xuLy8gbW9kdWxlIGlkID0gMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBLbmlnaHQgZXh0ZW5kcyBVbml0IHtcbiAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xuICAgIHN1cGVyKHtcbiAgICAgIGlkLFxuICAgICAgaGVhbHRoOiAxNSxcbiAgICAgIGRhbWFnZTogNCxcbiAgICAgIGNyaXRpY2FsQ2hhbmNlOiAwLjA3LFxuICAgICAgYWNjdXJhY3k6IDAuOTUsXG4gICAgICBhdHRhY2tUaW1lOiAxNTAwLFxuICAgICAgcmFuZ2VBdHRhY2s6IDI0LFxuICAgICAgdGltZVRvSGl0OiA3NTAsXG4gICAgICBkZWF0aFRpbWU6IDcwMCxcbiAgICAgIHN0ZXBTaXplOiAwLjgsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgfSk7XG4gICAgdGhpcy5jb3N0ID0gNDtcbiAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XG4gICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiA0MixcbiAgICAgIGZyYW1lSGVpZ2h0OiA0MCxcbiAgICAgIG51bWJlck9mRnJhbWVzOiA0LFxuICAgICAgdGltZVRvRnJhbWU6IDMwMCxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMjYgOiAxNixcbiAgICB9KTtcblxuICAgIHRoaXMuc3ByaXRlcy53YWxrID0gbmV3IFNwcml0ZSh7XG4gICAgICB1cmw6IGBpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtd2Fsay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxuICAgICAgZnJhbWVXaWR0aDogNDIsXG4gICAgICBmcmFtZUhlaWdodDogNDAsXG4gICAgICBudW1iZXJPZkZyYW1lczogOCxcbiAgICAgIHRpbWVUb0ZyYW1lOiAxNTAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDI2IDogMTYsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XG4gICAgICB1cmw6IGBpbWdzL3VuaXRzL2tuaWdodC9rbmlnaHQtYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiA4MCxcbiAgICAgIGZyYW1lSGVpZ2h0OiA0MCxcbiAgICAgIG51bWJlck9mRnJhbWVzOiAxMCxcbiAgICAgIHRpbWVUb0ZyYW1lOiAxNzAsXG4gICAgICB4T2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMCA6IC0zOCxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMjYgOiAxNixcbiAgICB9KTtcblxuICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMva25pZ2h0L2tuaWdodC1kaWUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDQyLFxuICAgICAgZnJhbWVIZWlnaHQ6IDQwLFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDksXG4gICAgICB0aW1lVG9GcmFtZTogOTAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDI2IDogMTYsXG4gICAgfSk7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL2tuaWdodC9rbmlnaHQuanNcbi8vIG1vZHVsZSBpZCA9IDIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ291bnRyeUtuaWdodCBleHRlbmRzIFVuaXQge1xuICBjb25zdHJ1Y3RvcihpZCwgZGlyZWN0aW9uKSB7XG4gICAgc3VwZXIoe1xuICAgICAgaWQsXG4gICAgICBoZWFsdGg6IDEwLFxuICAgICAgZGFtYWdlOiAxLFxuICAgICAgYXR0YWNrVGltZTogNTAwLFxuICAgICAgcmFuZ2VBdHRhY2s6IDE5LFxuICAgICAgY3JpdGljYWxDaGFuY2U6IDAuMDUsXG4gICAgICBhY2N1cmFjeTogMC45MixcbiAgICAgIHRpbWVUb0hpdDogNDAwLFxuICAgICAgZGVhdGhUaW1lOiAxMDAwLFxuICAgICAgc3RlcFNpemU6IDEuNSxcbiAgICAgIGRpcmVjdGlvbixcbiAgICAgIGlkbGVUaW1lOiAxMDAwLFxuICAgIH0pO1xuICAgIHRoaXMuY29zdCA9IDM7XG4gICAgdGhpcy5jb25maWd1cmVTcHJpdGVzKCk7XG4gIH1cblxuICBjb25maWd1cmVTcHJpdGVzKCkge1xuICAgIHRoaXMuc3ByaXRlcy5pZGxlID0gbmV3IFNwcml0ZSh7XG4gICAgICB1cmw6IGBpbWdzL3VuaXRzL2NvdW50cnkta25pZ2h0L2NvdW50cnkta25pZ2h0LWlkbGUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDY0LFxuICAgICAgZnJhbWVIZWlnaHQ6IDM5LFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDYsXG4gICAgICB0aW1lVG9GcmFtZTogMjAwLFxuICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAzOCA6IDI2LFxuICAgIH0pO1xuXG4gICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQtcnVuLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiA2NCxcbiAgICAgIGZyYW1lSGVpZ2h0OiA0NSxcbiAgICAgIG51bWJlck9mRnJhbWVzOiA4LFxuICAgICAgdGltZVRvRnJhbWU6IDExMixcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMzggOiAyNixcbiAgICB9KTtcblxuICAgIHRoaXMuc3ByaXRlcy5hdHRhY2sgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQtYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiA2NCxcbiAgICAgIGZyYW1lSGVpZ2h0OiA0MixcbiAgICAgIG51bWJlck9mRnJhbWVzOiA0LFxuICAgICAgdGltZVRvRnJhbWU6IDIwMCxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMzggOiAyNixcbiAgICB9KTtcblxuICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQtZGllLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiA2NCxcbiAgICAgIGZyYW1lSGVpZ2h0OiA0NSxcbiAgICAgIG51bWJlck9mRnJhbWVzOiA4LFxuICAgICAgdGltZVRvRnJhbWU6IDE1NSxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMzggOiAyNixcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdHMvY291bnRyeS1rbmlnaHQvY291bnRyeS1rbmlnaHQuanNcbi8vIG1vZHVsZSBpZCA9IDIyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUm9ndWUgZXh0ZW5kcyBVbml0IHtcbiAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xuICAgIHN1cGVyKHtcbiAgICAgIGlkLFxuICAgICAgaGVhbHRoOiAxMCxcbiAgICAgIGRhbWFnZTogMixcbiAgICAgIGF0dGFja1RpbWU6IDEwMDAsXG4gICAgICByYW5nZUF0dGFjazogNDAsXG4gICAgICBjcml0aWNhbENoYW5jZTogMC4xLFxuICAgICAgYWNjdXJhY3k6IDAuOTYsXG4gICAgICB0aW1lVG9IaXQ6IDgwMCxcbiAgICAgIGRlYXRoVGltZTogMTAwMCxcbiAgICAgIHN0ZXBTaXplOiAxLFxuICAgICAgZGlyZWN0aW9uLFxuICAgICAgaWRsZVRpbWU6IDEwMDAsXG4gICAgfSk7XG4gICAgdGhpcy5jb3N0ID0gMztcbiAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XG4gICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvcm9ndWUvcm9ndWUtaWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxuICAgICAgZnJhbWVXaWR0aDogNjQsXG4gICAgICBmcmFtZUhlaWdodDogMjEsXG4gICAgICBudW1iZXJPZkZyYW1lczogMyxcbiAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDEzIDogNDMsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1ydW4tJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDY0LFxuICAgICAgZnJhbWVIZWlnaHQ6IDIzLFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDYsXG4gICAgICB0aW1lVG9GcmFtZTogMTEyLFxuICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDQzLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zcHJpdGVzLmF0dGFjayA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy9yb2d1ZS9yb2d1ZS1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDY0LFxuICAgICAgZnJhbWVIZWlnaHQ6IDIzLFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxuICAgICAgdGltZVRvRnJhbWU6IDExMixcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gMTMgOiA0MyxcbiAgICB9KTtcblxuICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvcm9ndWUvcm9ndWUtZGVhdGgtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDY0LFxuICAgICAgZnJhbWVIZWlnaHQ6IDIxLFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDksXG4gICAgICB0aW1lVG9GcmFtZTogMTMwLFxuICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxMyA6IDQzLFxuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy9yb2d1ZS9yb2d1ZS5qc1xuLy8gbW9kdWxlIGlkID0gMjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IFVuaXQgZnJvbSAnLi4vLi4vdW5pdC91bml0JztcbmltcG9ydCBTcHJpdGUgZnJvbSAnLi4vLi4vdW5pdC9zcHJpdGUnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCbG9iIGV4dGVuZHMgVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24pIHtcbiAgICBzdXBlcih7XG4gICAgICBpZCxcbiAgICAgIGhlYWx0aDogMyxcbiAgICAgIGRhbWFnZTogNCxcbiAgICAgIGF0dGFja1RpbWU6IDEyMDAsXG4gICAgICByYW5nZUF0dGFjazogMjcsXG4gICAgICBjcml0aWNhbENoYW5jZTogMC4wNCxcbiAgICAgIGFjY3VyYWN5OiAwLjkzLFxuICAgICAgdGltZVRvSGl0OiAxMTAwLFxuICAgICAgZGVhdGhUaW1lOiAxMDAwLFxuICAgICAgc3RlcFNpemU6IDEsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBpZGxlVGltZTogMTAwMCxcbiAgICB9KTtcbiAgICB0aGlzLmNvc3QgPSAyO1xuICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xuICB9XG5cbiAgY29uZmlndXJlU3ByaXRlcygpIHtcbiAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy9ibG9iL2Jsb2ItaWRsZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxuICAgICAgZnJhbWVXaWR0aDogODAsXG4gICAgICBmcmFtZUhlaWdodDogMjMsXG4gICAgICBudW1iZXJPZkZyYW1lczogMyxcbiAgICAgIHRpbWVUb0ZyYW1lOiAyNTAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMzEsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy9ibG9iL2Jsb2ItbW92ZS0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxuICAgICAgZnJhbWVXaWR0aDogODAsXG4gICAgICBmcmFtZUhlaWdodDogNTAsXG4gICAgICBudW1iZXJPZkZyYW1lczogOCxcbiAgICAgIHRpbWVUb0ZyYW1lOiAxMTIsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMzEsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XG4gICAgICB1cmw6IGBpbWdzL3VuaXRzL2Jsb2IvYmxvYi1hdHRhY2stJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDgwLFxuICAgICAgZnJhbWVIZWlnaHQ6IDMzLFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxuICAgICAgdGltZVRvRnJhbWU6IDEzMCxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAzMSxcbiAgICB9KTtcblxuICAgIHRoaXMuc3ByaXRlcy5kaWUgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvYmxvYi9ibG9iLWRlYXRoLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiA4MCxcbiAgICAgIGZyYW1lSGVpZ2h0OiA1NCxcbiAgICAgIG51bWJlck9mRnJhbWVzOiA4LFxuICAgICAgdGltZVRvRnJhbWU6IDE1NSxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAzMSxcbiAgICB9KTtcbiAgfVxufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvdW5pdHMvYmxvYi9ibG9iLmpzXG4vLyBtb2R1bGUgaWQgPSAyNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgVW5pdCBmcm9tICcuLi8uLi91bml0L3VuaXQnO1xuaW1wb3J0IFNwcml0ZSBmcm9tICcuLi8uLi91bml0L3Nwcml0ZSc7XG5pbXBvcnQgQWN0aW9ucyBmcm9tICcuLi8uLi91bml0L2FjdGlvbnMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXaXphcmQgZXh0ZW5kcyBVbml0IHtcbiAgY29uc3RydWN0b3IoaWQsIGRpcmVjdGlvbikge1xuICAgIHN1cGVyKHtcbiAgICAgIGlkLFxuICAgICAgaGVhbHRoOiA3LFxuICAgICAgZGFtYWdlOiAxLFxuICAgICAgYXR0YWNrVGltZTogMTUwMCxcbiAgICAgIHJhbmdlQXR0YWNrOiAyOCxcbiAgICAgIGNyaXRpY2FsQ2hhbmNlOiAwLjA0LFxuICAgICAgYWNjdXJhY3k6IDAuOSxcbiAgICAgIHRpbWVUb0hpdDogMTAwMCxcbiAgICAgIGRlYXRoVGltZTogMTkwMCxcbiAgICAgIHN0ZXBTaXplOiAwLjQsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBpZGxlVGltZTogMTAwMCxcbiAgICB9KTtcbiAgICB0aGlzLmhlYWxUaW1lID0gMTMwMDtcbiAgICB0aGlzLmhlYWx0aFRvSGVhbCA9IDE7XG4gICAgdGhpcy5oZWFsUmFuZ2UgPSAyNDA7XG4gICAgdGhpcy5jb3N0ID0gNDtcbiAgICB0aGlzLmNvbmZpZ3VyZVNwcml0ZXMoKTtcbiAgfVxuXG4gIGNvbmZpZ3VyZVNwcml0ZXMoKSB7XG4gICAgdGhpcy5zcHJpdGVzLmlkbGUgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvd2l6YXJkL3dpemFyZC1pZGxlLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiA4MCxcbiAgICAgIGZyYW1lSGVpZ2h0OiA4MCxcbiAgICAgIG51bWJlck9mRnJhbWVzOiAxMCxcbiAgICAgIHRpbWVUb0ZyYW1lOiAyMDAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMjEsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMud2FsayA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy93aXphcmQvd2l6YXJkLXJ1bi0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxuICAgICAgZnJhbWVXaWR0aDogNzAsXG4gICAgICBmcmFtZUhlaWdodDogNTYsXG4gICAgICBudW1iZXJPZkZyYW1lczogNSxcbiAgICAgIHRpbWVUb0ZyYW1lOiAyNTAsXG4gICAgICB4T2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gOSA6IDAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMjEsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMuYXR0YWNrID0gbmV3IFNwcml0ZSh7XG4gICAgICB1cmw6IGBpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtYXR0YWNrLSR7dGhpcy5kaXJlY3Rpb259LnBuZ2AsXG4gICAgICBmcmFtZVdpZHRoOiAxMDAsXG4gICAgICBmcmFtZUhlaWdodDogNTcsXG4gICAgICBudW1iZXJPZkZyYW1lczogOSxcbiAgICAgIHRpbWVUb0ZyYW1lOiAxODAsXG4gICAgICB4T2Zmc2V0OiAtMTQsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDQ5IDogMjEsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XG4gICAgICB1cmw6IGBpbWdzL3VuaXRzL3dpemFyZC93aXphcmQtZGVhdGgtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDgwLFxuICAgICAgZnJhbWVIZWlnaHQ6IDgwLFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxuICAgICAgdGltZVRvRnJhbWU6IDI1MCxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAyMSxcbiAgICB9KTtcbiAgICB0aGlzLnNwcml0ZXMuaGVhbCA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy93aXphcmQvd2l6YXJkLWhlYWwtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDgwLFxuICAgICAgZnJhbWVIZWlnaHQ6IDgwLFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDEwLFxuICAgICAgdGltZVRvRnJhbWU6IDI1MCxcbiAgICAgIGJvZHlYT2Zmc2V0OiB0aGlzLnBsYXllcnNVbml0ID8gNDkgOiAyMSxcbiAgICB9KTtcbiAgfVxuXG4gIGRvQWN0aW9uKHN0YXRlLCB0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5oZWFsdGggPD0gMCkge1xuICAgICAgdGhpcy5kaWUoc3RhdGUsIHRpbWVzdGFtcCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmN1cnJlbnRBY3Rpb24gPT09IEFjdGlvbnMuaWRsZVxuICAgICAgJiYgdGltZXN0YW1wIC0gdGhpcy5wcmV2aW91c0FjdGlvblRpbWVzdGFtcCA8IHRoaXMuaWRsZVRpbWUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZBbGx5KHN0YXRlKSAmJiB0aGlzLmlzVW5pdFJhbmdlKHN0YXRlKSAmJiAhc3RhdGUuaXNQYXVzZUdhbWUpIHtcbiAgICAgIHRoaXMuaGVhbChzdGF0ZSwgdGltZXN0YW1wKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNJbkZyb250T2ZBbGx5KHN0YXRlKSB8fCBzdGF0ZS5pc1BhdXNlR2FtZVxuICAgICAgfHwgKHRoaXMuaXNJbkZyb250T2ZFbmVteShzdGF0ZSkgJiYgdGhpcy5pc0VuZW15RHlpbmcoc3RhdGUpKSkge1xuICAgICAgdGhpcy5pZGxlKHN0YXRlLCB0aW1lc3RhbXApO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc0luRnJvbnRPZkVuZW15KHN0YXRlKSkge1xuICAgICAgdGhpcy5hdHRhY2soc3RhdGUsIHRpbWVzdGFtcCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3RlcChzdGF0ZSwgdGltZXN0YW1wKTtcbiAgICB9XG4gIH1cblxuICBoZWFsKHN0YXRlLCB0aW1lc3RhbXApIHtcbiAgICBpZiAodGhpcy5jdXJyZW50QWN0aW9uICE9PSBBY3Rpb25zLmhlYWwpIHtcbiAgICAgIHRoaXMuY3VycmVudEFjdGlvbiA9IEFjdGlvbnMuaGVhbDtcbiAgICAgIHRoaXMucHJldmlvdXNBY3Rpb25UaW1lc3RhbXAgPSB0aW1lc3RhbXA7XG4gICAgICB0aGlzLnNwcml0ZXMuaGVhbC5yZXNldCgpO1xuICAgICAgdGhpcy51cGRhdGVZKHN0YXRlKTtcbiAgICB9XG5cbiAgICBjb25zdCB0YXJnZXRVbml0ID0gdGhpcy5wbGF5ZXJzVW5pdFxuICAgICAgPyBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdXG4gICAgICA6IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdO1xuICAgIGlmICh0aW1lc3RhbXAgLSB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID4gdGhpcy5oZWFsVGltZSAmJiB0YXJnZXRVbml0LmhlYWx0aCA+IDApIHtcbiAgICAgIHRhcmdldFVuaXQuaGVhbHRoICs9IHRoaXMuaGVhbHRoVG9IZWFsO1xuXG4gICAgICBjb25zdCBwb3NpdGlvblggPSB0YXJnZXRVbml0LnhcbiAgICAgICAgKyB0YXJnZXRVbml0LnNwcml0ZXMud2Fsay5ib2R5WE9mZnNldDtcbiAgICAgIHRoaXMuZmxvYXRpbmdUZXh0LmFkZCh7XG4gICAgICAgIHRleHQ6IHRoaXMuaGVhbHRoVG9IZWFsLFxuICAgICAgICBwb3NpdGlvblgsXG4gICAgICAgIHBvc2l0aW9uWTogdGFyZ2V0VW5pdC55LFxuICAgICAgICBhY3Rpb246IEFjdGlvbnMuaGVhbCxcbiAgICAgIH0pO1xuXG4gICAgICBpZiAodGhpcy5wbGF5ZXJzVW5pdCkge1xuICAgICAgICBzdGF0ZS5pbnN0YW5jZS5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljLmhlYWxlZEhwICs9IHRoaXMuaGVhbHRoVG9IZWFsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByZXZpb3VzQWN0aW9uVGltZXN0YW1wID0gdGltZXN0YW1wO1xuICAgIH1cbiAgfVxuXG4gIGlzVW5pdFJhbmdlKHN0YXRlKSB7XG4gICAgY29uc3QgdGFyZ2V0VW5pdCA9IHRoaXMucGxheWVyc1VuaXQgPyBzdGF0ZS5jdXJyZW50TGV2ZWwuYWxsaWVzWzBdXG4gICAgICA6IHN0YXRlLmN1cnJlbnRMZXZlbC5lbmVtaWVzWzBdO1xuXG4gICAgcmV0dXJuIE1hdGguYWJzKHRoaXMueCAtIHRhcmdldFVuaXQueCkgPCB0aGlzLmhlYWxSYW5nZTtcbiAgfVxuXG4gIGdldEN1cnJlbnRTcHJpdGUoKSB7XG4gICAgc3dpdGNoICh0aGlzLmN1cnJlbnRBY3Rpb24pIHtcbiAgICAgIGNhc2UgQWN0aW9ucy5zdGVwOiByZXR1cm4gdGhpcy5zcHJpdGVzLndhbGs7XG4gICAgICBjYXNlIEFjdGlvbnMuYXR0YWNrOiByZXR1cm4gdGhpcy5zcHJpdGVzLmF0dGFjaztcbiAgICAgIGNhc2UgQWN0aW9ucy5kaWU6IHJldHVybiB0aGlzLnNwcml0ZXMuZGllO1xuICAgICAgY2FzZSBBY3Rpb25zLmhlYWw6IHJldHVybiB0aGlzLnNwcml0ZXMuaGVhbDtcbiAgICAgIGRlZmF1bHQ6IHJldHVybiB0aGlzLnNwcml0ZXMuaWRsZTtcbiAgICB9XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL3VuaXRzL3dpemFyZC93aXphcmQuanNcbi8vIG1vZHVsZSBpZCA9IDI1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCBVbml0IGZyb20gJy4uLy4uL3VuaXQvdW5pdCc7XG5pbXBvcnQgU3ByaXRlIGZyb20gJy4uLy4uL3VuaXQvc3ByaXRlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFuZGl0IGV4dGVuZHMgVW5pdCB7XG4gIGNvbnN0cnVjdG9yKGlkLCBkaXJlY3Rpb24pIHtcbiAgICBzdXBlcih7XG4gICAgICBpZCxcbiAgICAgIGhlYWx0aDogNyxcbiAgICAgIGRhbWFnZTogMixcbiAgICAgIGF0dGFja1RpbWU6IDYwMCxcbiAgICAgIHJhbmdlQXR0YWNrOiAxNSxcbiAgICAgIGNyaXRpY2FsQ2hhbmNlOiAwLjA0LFxuICAgICAgYWNjdXJhY3k6IDAuOTYsXG4gICAgICB0aW1lVG9IaXQ6IDMwMCxcbiAgICAgIGRlYXRoVGltZTogMTkwMCxcbiAgICAgIHN0ZXBTaXplOiAwLjYsXG4gICAgICBkaXJlY3Rpb24sXG4gICAgICBpZGxlVGltZTogMTAwMCxcbiAgICB9KTtcbiAgICB0aGlzLmNvc3QgPSAzO1xuICAgIHRoaXMuY29uZmlndXJlU3ByaXRlcygpO1xuICB9XG5cbiAgY29uZmlndXJlU3ByaXRlcygpIHtcbiAgICB0aGlzLnNwcml0ZXMuaWRsZSA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWlkbGUtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDMwLFxuICAgICAgZnJhbWVIZWlnaHQ6IDI3LFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDYsXG4gICAgICB0aW1lVG9GcmFtZTogMTYwLFxuICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zcHJpdGVzLndhbGsgPSBuZXcgU3ByaXRlKHtcbiAgICAgIHVybDogYGltZ3MvdW5pdHMvYmFuZGl0L2JhbmRpdC1ydW4tJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDMwLFxuICAgICAgZnJhbWVIZWlnaHQ6IDI3LFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDUsXG4gICAgICB0aW1lVG9GcmFtZTogMTMwLFxuICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExLFxuICAgIH0pO1xuXG4gICAgdGhpcy5zcHJpdGVzLmF0dGFjayA9IG5ldyBTcHJpdGUoe1xuICAgICAgdXJsOiBgaW1ncy91bml0cy9iYW5kaXQvYmFuZGl0LWF0dGFjay0ke3RoaXMuZGlyZWN0aW9ufS5wbmdgLFxuICAgICAgZnJhbWVXaWR0aDogMzAsXG4gICAgICBmcmFtZUhlaWdodDogMjUsXG4gICAgICBudW1iZXJPZkZyYW1lczogNyxcbiAgICAgIHRpbWVUb0ZyYW1lOiAxMzAsXG4gICAgICBib2R5WE9mZnNldDogdGhpcy5wbGF5ZXJzVW5pdCA/IDE5IDogMTEsXG4gICAgfSk7XG5cbiAgICB0aGlzLnNwcml0ZXMuZGllID0gbmV3IFNwcml0ZSh7XG4gICAgICB1cmw6IGBpbWdzL3VuaXRzL2JhbmRpdC9iYW5kaXQtZGVhdGgtJHt0aGlzLmRpcmVjdGlvbn0ucG5nYCxcbiAgICAgIGZyYW1lV2lkdGg6IDMwLFxuICAgICAgZnJhbWVIZWlnaHQ6IDI1LFxuICAgICAgbnVtYmVyT2ZGcmFtZXM6IDYsXG4gICAgICB0aW1lVG9GcmFtZTogNDAwLFxuICAgICAgYm9keVhPZmZzZXQ6IHRoaXMucGxheWVyc1VuaXQgPyAxOSA6IDExLFxuICAgIH0pO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy91bml0cy9iYW5kaXQvYmFuZGl0LmpzXG4vLyBtb2R1bGUgaWQgPSAyNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBsZXZlbHMgPSBbXG4gIHtcbiAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcbiAgICBncm91bmRMZXZlbFk6IDY0MCxcbiAgICBlbmVtaWVzOiBbXG4gICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcbiAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcbiAgICBncm91bmRMZXZlbFk6IDY0MCxcbiAgICBlbmVtaWVzOiBbXG4gICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcbiAgICAgIHsgbmFtZTogJ2NvdW50cnkta25pZ2h0JyB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcbiAgICBncm91bmRMZXZlbFk6IDY0MCxcbiAgICBlbmVtaWVzOiBbXG4gICAgICB7IG5hbWU6ICdjb3VudHJ5LWtuaWdodCcgfSxcbiAgICAgIHsgbmFtZTogJ2JhbmRpdCcgfSxcbiAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxuICAgICAgeyBuYW1lOiAna25pZ2h0JyB9LFxuICAgICAgeyBuYW1lOiAnd2l6YXJkJyB9LFxuICAgIF0sXG4gIH0sXG4gIHtcbiAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcbiAgICBncm91bmRMZXZlbFk6IDY0MCxcbiAgICBlbmVtaWVzOiBbXG4gICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcbiAgICAgIHsgbmFtZTogJ2JhbmRpdCcgfSxcbiAgICAgIHsgbmFtZTogJ3dpemFyZCcgfSxcbiAgICAgIHsgbmFtZTogJ3dpemFyZCcgfSxcbiAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxuICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXG4gICAgICB7IG5hbWU6ICdyb2d1ZScgfSxcbiAgICAgIHsgbmFtZTogJ2tuaWdodCcgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgYmFja2dyb3VuZDogJy4vaW1ncy9iYWNrZ3JvdW5kcy9nYW1lLnBuZycsXG4gICAgZ3JvdW5kTGV2ZWxZOiA2NDAsXG4gICAgZW5lbWllczogW1xuICAgICAgeyBuYW1lOiAna25pZ2h0JyB9LFxuICAgICAgeyBuYW1lOiAna25pZ2h0JyB9LFxuICAgICAgeyBuYW1lOiAncm9ndWUnIH0sXG4gICAgICB7IG5hbWU6ICd3aXphcmQnIH0sXG4gICAgICB7IG5hbWU6ICd3aXphcmQnIH0sXG4gICAgICB7IG5hbWU6ICdjb3VudHJ5LWtuaWdodCcgfSxcbiAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxuICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXG4gICAgICB7IG5hbWU6ICdibG9iJyB9LFxuICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXG4gICAgXSxcbiAgfSxcbiAge1xuICAgIGJhY2tncm91bmQ6ICcuL2ltZ3MvYmFja2dyb3VuZHMvZ2FtZS5wbmcnLFxuICAgIGdyb3VuZExldmVsWTogNjQwLFxuICAgIGVuZW1pZXM6IFtcbiAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxuICAgICAgeyBuYW1lOiAnc2tlbGV0b24nIH0sXG4gICAgICB7IG5hbWU6ICdiYW5kaXQnIH0sXG4gICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcbiAgICAgIHsgbmFtZTogJ3JvZ3VlJyB9LFxuICAgICAgeyBuYW1lOiAnd2l6YXJkJyB9LFxuICAgICAgeyBuYW1lOiAna25pZ2h0JyB9LFxuICAgICAgeyBuYW1lOiAnY291bnRyeS1rbmlnaHQnIH0sXG4gICAgICB7IG5hbWU6ICdibG9iJyB9LFxuICAgICAgeyBuYW1lOiAna25pZ2h0JyB9LFxuICAgICAgeyBuYW1lOiAnYmFuZGl0JyB9LFxuICAgICAgeyBuYW1lOiAna25pZ2h0JyB9LFxuICAgICAgeyBuYW1lOiAncm9ndWUnIH0sXG4gICAgICB7IG5hbWU6ICdjb3VudHJ5LWtuaWdodCcgfSxcbiAgICAgIHsgbmFtZTogJ2JhbmRpdCcgfSxcbiAgICAgIHsgbmFtZTogJ2tuaWdodCcgfSxcbiAgICAgIHsgbmFtZTogJ3dpemFyZCcgfSxcbiAgICAgIHsgbmFtZTogJ3NrZWxldG9uJyB9LFxuICAgIF0sXG4gIH0sXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sZXZlbHMvbGV2ZWxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJjb25zdCBsZXZlbHMgPSBbXG4gIHtcbiAgICBiYWNrZ3JvdW5kOiAnLi9pbWdzL2JhY2tncm91bmRzL2dhbWUucG5nJyxcbiAgICBncm91bmRMZXZlbFk6IDY0MCxcbiAgICBlbmVtaWVzOiBbXG4gICAgICB7IG5hbWU6ICdza2VsZXRvbicgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgYmFja2dyb3VuZDogJy4vaW1ncy9iYWNrZ3JvdW5kcy9nYW1lLnBuZycsXG4gICAgZ3JvdW5kTGV2ZWxZOiA2NDAsXG4gICAgZW5lbWllczogW1xuICAgICAgeyBuYW1lOiAncm9ndWUnIH0sXG4gICAgICB7IG5hbWU6ICdjb3VudHJ5LWtuaWdodCcgfSxcbiAgICBdLFxuICB9LFxuICB7XG4gICAgYmFja2dyb3VuZDogJy4vaW1ncy9iYWNrZ3JvdW5kcy9nYW1lLnBuZycsXG4gICAgZ3JvdW5kTGV2ZWxZOiA2NDAsXG4gICAgZW5lbWllczogW1xuICAgICAgeyBuYW1lOiAna25pZ2h0JyB9LFxuICAgICAgeyBuYW1lOiAnd2l6YXJkJyB9LFxuICAgIF0sXG4gIH0sXG5dO1xuXG5leHBvcnQgZGVmYXVsdCBsZXZlbHM7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9sZXZlbHMvZGVtb0xldmVscy5qc1xuLy8gbW9kdWxlIGlkID0gMjhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9jb250cm9scy9idXR0b24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBCdWZmTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzKSB7XG4gICAgdGhpcy5idXR0b25zID0gbnVsbDtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5nYW1lQ2FudmFzID0gZ2FtZUNhbnZhcztcblxuICAgIHRoaXMuYXJtb3JCdWZmc0R1cmF0aW9uID0gNjAwMDA7XG4gICAgdGhpcy53ZWFwb25CdWZmc0R1cmF0aW9uID0gMzAwMDA7XG5cbiAgICB0aGlzLmJ1ZmZJZCA9IDA7XG5cbiAgICB0aGlzLmZ1bGxSZXNldCgpO1xuICB9XG5cbiAgY3JlYXRlQnV0dG9uKCkge1xuICAgIHRoaXMuYnV0dG9ucyA9IHRoaXMuZ2V0UGFyYW1ldGVyc09mQnVmZkJ1dHRvbigpLm1hcCgoYnRuKSA9PiB7XG4gICAgICBjb25zdCBidXR0b24gPSBuZXcgQnV0dG9uKHtcbiAgICAgICAgeDogYnRuLngsXG4gICAgICAgIHk6IGJ0bi55LFxuICAgICAgICBoZWlnaHQ6IGJ0bi5oZWlnaHQsXG4gICAgICAgIHdpZHRoOiBidG4ud2lkdGgsXG4gICAgICAgIGljb25Vcmw6IGJ0bi5pY29uVXJsLFxuICAgICAgICBjbGlja0hhbmRsZXI6IGJ0bi5jbGlja0hhbmRsZXIsXG4gICAgICB9KTtcbiAgICAgIHJldHVybiBidXR0b247XG4gICAgfSk7XG4gIH1cblxuICBpbXByb3ZlV2VhcG9uKCkge1xuICAgIGlmICh0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLm1vbmV5ID49IDMpIHtcbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUuY3VycmVudExldmVsLmFsbGllcy5mb3JFYWNoKCh1bml0KSA9PiB7XG4gICAgICAgIHVuaXQuZGFtYWdlKys7XG4gICAgICAgIHVuaXQud2VhcG9uSWRCdWZmLnB1c2godGhpcy5idWZmSWQpO1xuICAgICAgfSk7XG5cbiAgICAgIHRoaXMud2VhcG9uQnVmZnMucHVzaCh7XG4gICAgICAgIGlkOiB0aGlzLmJ1ZmZJZCsrLFxuICAgICAgICB3ZWFwb25TdGFydDogRGF0ZS5ub3coKSxcbiAgICAgICAgb3BhY2l0eTogMC43LFxuICAgICAgICBmYWRlSW46IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgLT0gMztcbiAgICB9XG4gIH1cblxuICBpbXByb3ZlQXJtb3IoKSB7XG4gICAgaWYgKHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgPj0gNSkge1xuICAgICAgdGhpcy5zdGF0ZS5zY2VuZXMuZ2FtZS5jdXJyZW50TGV2ZWwuYWxsaWVzLmZvckVhY2goKHVuaXQpID0+IHtcbiAgICAgICAgdW5pdC5oZWFsdGggKz0gNTtcbiAgICAgICAgdW5pdC5hcm1vcklkQnVmZi5wdXNoKHRoaXMuYnVmZklkKTtcbiAgICAgIH0pO1xuXG4gICAgICB0aGlzLmFybW9yQnVmZnMucHVzaCh7XG4gICAgICAgIGlkOiB0aGlzLmJ1ZmZJZCxcbiAgICAgICAgYXJtb3JTdGFydDogRGF0ZS5ub3coKSxcbiAgICAgICAgb3BhY2l0eTogMC43LFxuICAgICAgICBmYWRlSW46IGZhbHNlLFxuICAgICAgfSk7XG5cbiAgICAgIHRoaXMuc3RhdGUuc2NlbmVzLmdhbWUubW9uZXkgLT0gNTtcbiAgICB9XG4gIH1cblxuICB3ZWFwb25SZXNldCgpIHtcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMuZm9yRWFjaCgodW5pdCkgPT4ge1xuICAgICAgaWYgKHVuaXQud2VhcG9uSWRCdWZmLmxlbmd0aCAmJiB1bml0LndlYXBvbklkQnVmZlswXSA9PT0gdGhpcy53ZWFwb25CdWZmc1swXS5pZCkge1xuICAgICAgICB1bml0LmRhbWFnZS0tO1xuICAgICAgICB1bml0LndlYXBvbklkQnVmZi5zaGlmdCgpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy53ZWFwb25CdWZmcy5zaGlmdCgpO1xuICB9XG5cbiAgYXJtb3JSZXNldCgpIHtcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmN1cnJlbnRMZXZlbC5hbGxpZXMuZm9yRWFjaCgodW5pdCkgPT4ge1xuICAgICAgaWYgKHVuaXQuYXJtb3JJZEJ1ZmYubGVuZ3RoICYmIHVuaXQuYXJtb3JJZEJ1ZmZbMF0gPT09IHRoaXMuYXJtb3JCdWZmc1swXS5pZCkge1xuICAgICAgICBpZiAodW5pdC5oZWFsdGggPiA1KSB1bml0LmhlYWx0aCAtPSA1O1xuICAgICAgICBlbHNlIHVuaXQuaGVhbHRoID0gMTtcblxuICAgICAgICB1bml0LmFybW9ySWRCdWZmLnNoaWZ0KCk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLmFybW9yQnVmZnMuc2hpZnQoKTtcbiAgfVxuXG4gIGZ1bGxSZXNldCgpIHtcbiAgICB0aGlzLndlYXBvbkJ1ZmZzID0gW107XG4gICAgdGhpcy5hcm1vckJ1ZmZzID0gW107XG4gIH1cblxuICB1cGRhdGVUaW1lKCkge1xuICAgIGlmICh0aGlzLndlYXBvbkJ1ZmZzLmxlbmd0aCkge1xuICAgICAgY29uc3QgcGFzc2VkV2VhcG9uVGltZSA9IERhdGUubm93KCkgLSB0aGlzLndlYXBvbkJ1ZmZzWzBdLndlYXBvblN0YXJ0O1xuXG4gICAgICBpZiAocGFzc2VkV2VhcG9uVGltZSA+IHRoaXMud2VhcG9uQnVmZnNEdXJhdGlvbikgdGhpcy53ZWFwb25SZXNldCgpO1xuXG4gICAgICB0aGlzLndlYXBvbkJ1ZmZzLmZvckVhY2goKGJ1ZmYpID0+IHtcbiAgICAgICAgY29uc3QgZGVsdGEgPSBidWZmLmZhZGVJbiA/IDAuMDEgOiAtMC4wMTtcbiAgICAgICAgYnVmZi5vcGFjaXR5ICs9IGRlbHRhO1xuICAgICAgICBpZiAoYnVmZi5vcGFjaXR5IDwgMC4xKSBidWZmLmZhZGVJbiA9IHRydWU7XG4gICAgICAgIGVsc2UgaWYgKGJ1ZmYub3BhY2l0eSA+IDAuNykgYnVmZi5mYWRlSW4gPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmFybW9yQnVmZnMubGVuZ3RoKSB7XG4gICAgICBjb25zdCBwYXNzZWRBcm1vclRpbWUgPSBEYXRlLm5vdygpIC0gdGhpcy5hcm1vckJ1ZmZzWzBdLmFybW9yU3RhcnQ7XG5cbiAgICAgIGlmIChwYXNzZWRBcm1vclRpbWUgPiB0aGlzLmFybW9yQnVmZnNEdXJhdGlvbikgdGhpcy5hcm1vclJlc2V0KCk7XG5cbiAgICAgIHRoaXMuYXJtb3JCdWZmcy5mb3JFYWNoKChidWZmKSA9PiB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gYnVmZi5mYWRlSW4gPyAwLjAxNSA6IC0wLjAxNTtcbiAgICAgICAgYnVmZi5vcGFjaXR5ICs9IGRlbHRhO1xuICAgICAgICBpZiAoYnVmZi5vcGFjaXR5IDwgMC4xKSBidWZmLmZhZGVJbiA9IHRydWU7XG4gICAgICAgIGVsc2UgaWYgKGJ1ZmYub3BhY2l0eSA+IDAuNykgYnVmZi5mYWRlSW4gPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayguLi50aGlzLmJ1dHRvbnMpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuYnV0dG9ucy5mb3JFYWNoKGJ1dHRvbiA9PiBidXR0b24ucmVuZGVyKHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0KSk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuc2F2ZSgpO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZvbnQgPSAnMThweCBQaXhlbGF0ZSc7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJyQzJywgNTAsIDE0MCk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJyQ1JywgNTAsIDIxMCk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQucmVzdG9yZSgpO1xuXG4gICAgY29uc3Qgd2VhcG9uQnRuID0gdGhpcy5idXR0b25zWzBdO1xuICAgIHRoaXMud2VhcG9uQnVmZnMuZm9yRWFjaCgoYnVmZiwgcG9zaXRpb24pID0+IHtcbiAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gYnVmZi5vcGFjaXR5O1xuICAgICAgY29uc3QgYnVmZlhQb3NpdGlvbiA9IHdlYXBvbkJ0bi54ICsgKDcwICogKHBvc2l0aW9uICsgMSkpO1xuICAgICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHdlYXBvbkJ0bi5pY29uLCBidWZmWFBvc2l0aW9uLCB3ZWFwb25CdG4ueSk7XG4gICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfSk7XG5cbiAgICBjb25zdCBhcm1vckJ0biA9IHRoaXMuYnV0dG9uc1sxXTtcbiAgICB0aGlzLmFybW9yQnVmZnMuZm9yRWFjaCgoYnVmZiwgcG9zaXRpb24pID0+IHtcbiAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LnNhdmUoKTtcbiAgICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0Lmdsb2JhbEFscGhhID0gYnVmZi5vcGFjaXR5O1xuICAgICAgY29uc3QgYnVmZlhQb3NpdGlvbiA9IGFybW9yQnRuLnggKyAoNzAgKiAocG9zaXRpb24gKyAxKSk7XG4gICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5kcmF3SW1hZ2UoYXJtb3JCdG4uaWNvbiwgYnVmZlhQb3NpdGlvbiwgYXJtb3JCdG4ueSk7XG4gICAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5yZXN0b3JlKCk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRQYXJhbWV0ZXJzT2ZCdWZmQnV0dG9uKCkge1xuICAgIHJldHVybiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICdhcm0nLFxuICAgICAgICBpY29uVXJsOiAnaW1ncy9idWZmLWljb24vd2VhcG9uLnBuZycsXG4gICAgICAgIHg6IDIwLFxuICAgICAgICB5OiA5MCxcbiAgICAgICAgd2lkdGg6IDQwLFxuICAgICAgICBoZWlnaHQ6IDQwLFxuICAgICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHRoaXMuaW1wcm92ZVdlYXBvbigpLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ2FybW9yJyxcbiAgICAgICAgaWNvblVybDogJ2ltZ3MvYnVmZi1pY29uL2FybW9yLnBuZycsXG4gICAgICAgIHg6IDIwLFxuICAgICAgICB5OiAxNjAsXG4gICAgICAgIHdpZHRoOiA0MCxcbiAgICAgICAgaGVpZ2h0OiA0MCxcbiAgICAgICAgY2xpY2tIYW5kbGVyOiAoKSA9PiB0aGlzLmltcHJvdmVBcm1vcigpLFxuICAgICAgfSxcbiAgICBdO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9idWZmLW1hbmFnZXIvYnVmZi1tYW5hZ2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAyOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgQnV0dG9uIGZyb20gJy4uL2NvbnRyb2xzL2J1dHRvbic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE11c2ljIHtcbiAgY29uc3RydWN0b3IoZ2FtZUNhbnZhcykge1xuICAgIHRoaXMuZ2FtZUNhbnZhcyA9IGdhbWVDYW52YXM7XG4gICAgdGhpcy5jb3VudGVyID0gMDtcbiAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgfVxuXG4gIGFkZE11c2ljKCkge1xuICAgIHRoaXMubXVzaWMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpO1xuICAgIHRoaXMubXVzaWMuc3JjID0gJ211c2ljL2JhY2tncm91bmQtbXVzaWMud2F2JztcbiAgICB0aGlzLm11c2ljLnNldEF0dHJpYnV0ZSgncHJlbG9hZCcsICdhdXRvJyk7XG4gICAgdGhpcy5tdXNpYy5zZXRBdHRyaWJ1dGUoJ2NvbnRyb2xzJywgJ25vbmUnKTtcbiAgICB0aGlzLm11c2ljLnNldEF0dHJpYnV0ZSgnbG9vcCcsICd0cnVlJyk7XG4gICAgdGhpcy5tdXNpYy5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIHRoaXMubXVzaWMudm9sdW1lID0gMC41O1xuXG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLm11c2ljKTtcblxuICAgIHRoaXMubXVzaWMucGxheSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmRyYXdJbWFnZSh0aGlzLmJ1dHRvbi5pY29uLCB0aGlzLmJ1dHRvbi54LCB0aGlzLmJ1dHRvbi55KTtcbiAgfVxuXG4gIGluaXRpYWxpemUoKSB7XG4gICAgY29uc3QgbXVzaWNPbiA9IG5ldyBJbWFnZSgpO1xuICAgIG11c2ljT24uc3JjID0gJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1vbi5wbmcnO1xuXG4gICAgY29uc3QgbXVzaWNIYWxmT24gPSBuZXcgSW1hZ2UoKTtcbiAgICBtdXNpY0hhbGZPbi5zcmMgPSAnaW1ncy9VSS9tdXNpYy1pY29uL3NvdW5kLWhhbGYtb24ucG5nJztcblxuICAgIGNvbnN0IG11c2ljT2ZmID0gbmV3IEltYWdlKCk7XG4gICAgbXVzaWNPZmYuc3JjID0gJ2ltZ3MvVUkvbXVzaWMtaWNvbi9zb3VuZC1vZmYucG5nJztcblxuICAgIHRoaXMuc3RhdGUgPSBbbXVzaWNPbiwgbXVzaWNIYWxmT24sIG11c2ljT2ZmXTtcblxuICAgIHRoaXMuYnV0dG9uID0gbmV3IEJ1dHRvbih7XG4gICAgICB4OiA5NTAsXG4gICAgICB5OiAxMCxcbiAgICAgIGhlaWdodDogNDAsXG4gICAgICB3aWR0aDogNDAsXG4gICAgICBjbGlja0hhbmRsZXI6ICgpID0+IHRoaXMudG9nZ2xlKCksXG4gICAgfSk7XG5cbiAgICB0aGlzLmJ1dHRvbi5pY29uID0gdGhpcy5zdGF0ZVt0aGlzLmNvdW50ZXJdO1xuICAgIHRoaXMuYWRkTXVzaWMoKTtcbiAgfVxuXG4gIHRvZ2dsZSgpIHtcbiAgICB0aGlzLmNvdW50ZXIgPSArK3RoaXMuY291bnRlciAlIDM7XG4gICAgdGhpcy5idXR0b24uaWNvbiA9IHRoaXMuc3RhdGVbdGhpcy5jb3VudGVyXTtcbiAgICB0aGlzLm11c2ljLnZvbHVtZSA9IDAuNSAtICh0aGlzLmNvdW50ZXIgLyA0KTtcbiAgfVxuXG4gIHN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmJ1dHRvbik7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmdhbWVDYW52YXMudW5zdWJzY3JpYmVDbGljayh0aGlzLmJ1dHRvbik7XG4gIH1cbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL211c2ljL211c2ljLmpzXG4vLyBtb2R1bGUgaWQgPSAzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJpbXBvcnQgU2NlbmVCYXNlIGZyb20gJy4vc2NlbmUuYmFzZSc7XG5pbXBvcnQgRGlhbG9nIGZyb20gJy4uL2RpYWxvZy9kaWFsb2cnO1xuaW1wb3J0IEJ1dHRvbiBmcm9tICcuLi9jb250cm9scy9idXR0b24nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTdGF0aXN0aWNTY2VuZSBleHRlbmRzIFNjZW5lQmFzZSB7XG4gIGNvbnN0cnVjdG9yKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYykge1xuICAgIHN1cGVyKHN0YXRlLCBnYW1lQ2FudmFzLCBtdXNpYyk7XG4gICAgdGhpcy5kaWFsb2cgPSBuZXcgRGlhbG9nKGdhbWVDYW52YXMuY29udGV4dCk7XG4gICAgdGhpcy5pbml0aWFsaXplKCk7XG4gIH1cblxuICB1cGRhdGVTdGF0ZSh0aW1lc3RhbXApIHtcbiAgICBjb25zdCBzdGF0ZSA9IHRoaXMuc3RhdGUuc2NlbmVzLnN0YXRpc3RpYztcbiAgICBpZiAoIXN0YXRlLnRpbWVTcGVudCkge1xuICAgICAgc3RhdGUudGltZVNwZW50ID0gKHRpbWVzdGFtcCAvIDYwMDAwKS50b0ZpeGVkKCk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHN0YXRlID0gdGhpcy5zdGF0ZS5zY2VuZXMuc3RhdGlzdGljO1xuXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZHJhd0ltYWdlKHN0YXRlLmJhY2tncm91bmQsIDAsIDApO1xuXG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJ1N0YXRpc3RpY3MnLCA0ODAsIDEwMCk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJ1RpbWUgc3BlbnQnLCAxODAsIDIwMCk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7c3RhdGUudGltZVNwZW50fSBtaW51dGVzYCwgNzUwLCAyMDApO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdMZXZlbHMgZmFpbGVkJywgMTgwLCAyNTApO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLmxldmVsc0ZhaWxlZH0gbGV2ZWxzYCwgNzUwLCAyNTApO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KCdUb3RhbCBkYW1hZ2UgZGVhbHQnLCAxODAsIDMwMCk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoYCR7c3RhdGUudG90YWxEYW1hZ2V9IGRtZ2AsIDc1MCwgMzAwKTtcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnVG90YWwgcmVjZWl2ZWQgZGFtYWdlJywgMTgwLCAzNTApO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLnJlY2VpdmVkRGFtYWdlfSBkbWdgLCA3NTAsIDM1MCk7XG4gICAgdGhpcy5nYW1lQ2FudmFzLmNvbnRleHQuZmlsbFRleHQoJ01vbmV5IGVhcm5lZCcsIDE4MCwgNDAwKTtcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dChgJHtzdGF0ZS5lYXJuZWRNb25leX0gJGAsIDc1MCwgNDAwKTtcbiAgICB0aGlzLmdhbWVDYW52YXMuY29udGV4dC5maWxsVGV4dCgnVG90YWwgaHAgaGVhbGVkJywgMTgwLCA0NTApO1xuICAgIHRoaXMuZ2FtZUNhbnZhcy5jb250ZXh0LmZpbGxUZXh0KGAke3N0YXRlLmhlYWxlZEhwfSBocGAsIDc1MCwgNDUwKTtcblxuICAgIHRoaXMuZGlhbG9nLnJlbmRlcigpO1xuICB9XG5cbiAgaW5pdGlhbGl6ZSgpIHtcbiAgICB0aGlzLmJhY2tncm91bmQgPSBuZXcgSW1hZ2UoKTtcbiAgICB0aGlzLmJhY2tncm91bmQuc3JjID0gJy4vaW1ncy9iYWNrZ3JvdW5kcy9zdGF0aXN0aWMuanBnJztcbiAgICB0aGlzLnN0YXRlLnNjZW5lcy5zdGF0aXN0aWMuYmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZDtcblxuICAgIHRoaXMuZXhpdEJ1dHRvbiA9IG5ldyBCdXR0b24oe1xuICAgICAgeDogNTUwLFxuICAgICAgeTogNTAwLFxuICAgICAgaGVpZ2h0OiA3MyxcbiAgICAgIHdpZHRoOiA2MSxcbiAgICAgIGljb25Vcmw6ICdpbWdzL1VJL2V4aXQucG5nJyxcbiAgICAgIGNsaWNrSGFuZGxlcjogKCkgPT4ge1xuICAgICAgICB0aGlzLnN0YXRlLnNjZW5lcy5nYW1lLmluc3RhbmNlLmluaXRpYWxpemUoMCk7XG4gICAgICAgIHRoaXMuZGlhbG9nLmNsb3NlKCk7XG4gICAgICAgIHRoaXMuZ2FtZUNhbnZhcy51bnN1YnNjcmliZUNsaWNrKCk7XG4gICAgICAgIHRoaXMuc3RhdGUuY3VycmVudFNjZW5lID0gdGhpcy5zdGF0ZS5zY2VuZXMubWVudS5pbnN0YW5jZTtcbiAgICAgICAgdGhpcy5tdXNpYy5zdWJzY3JpYmUoKTtcbiAgICAgICAgdGhpcy5nYW1lQ2FudmFzLnN1YnNjcmliZU9uQ2xpY2soLi4udGhpcy5zdGF0ZS5jdXJyZW50U2NlbmUuYnV0dG9ucyk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9XG5cbiAgc3Vic2NyaWJlT25DbGljaygpIHtcbiAgICB0aGlzLmdhbWVDYW52YXMuc3Vic2NyaWJlT25DbGljayh0aGlzLmV4aXRCdXR0b24pO1xuICB9XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9zY2VuZXMvc3RhdGlzdGljLnNjZW5lLmpzXG4vLyBtb2R1bGUgaWQgPSAzMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9