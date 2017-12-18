import { SceneBase } from "./scene.base";
import ControlPanel from '../control-panel/control-panel';
import Dialog from '../dialog/dialog';
import UnitFactory from '../unit-factory/unit-factory';
import Queue from '../queue/queue';
import levels from '../levels/levels';
import Direction from '../unit/direction';
import Button from '../controls/button';
import FloatingText from '../floating-text/floating-text';
import BuffManager from '../buff-manager/buff-manager';

export class GameScene extends SceneBase {
  constructor(state, gameCanvas, music, preloader) {
    super(state, gameCanvas, music);

    this.controlPanel = new ControlPanel(state, gameCanvas);
    this.buffManager = new BuffManager(state, gameCanvas);
    this.floatingText = FloatingText.getSingletonInstance(gameCanvas.context);
    this.dialog = new Dialog(gameCanvas.context);
    this.unitFactory = UnitFactory.getSingletonInstance();
    this.queue = new Queue(state); // TODO: move
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
      this.nextButton = new Button({
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
      this.prevButton = new Button({
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
      this.replayButton = new Button({
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
      this.exitButton = new Button({
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
      this.closeButton = new Button({
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
      this.helpMenuButton = new Button({
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
      this.statisticButton = new Button({
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

    const currentLevel = levels[level];
    currentLevel.enemies.forEach(entry => {
      const enemy = this.unitFactory.create(entry.name, Direction.left);
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