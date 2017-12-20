import SceneBase from './scene.base';
import Button from '../controls/button';
import Sprite from '../unit/sprite';

export default class MenuScene extends SceneBase {
  constructor(state, gameCanvas, music) {
    super(state, gameCanvas, music);

    this.state.backgroundSprite = new Sprite({
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

    this.buttons = this.getButtonsConfig().map(options => new Button(options));
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
