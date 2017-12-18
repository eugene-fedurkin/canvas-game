import { SceneBase } from "./scene.base";
import Dialog from '../dialog/dialog';
import Button from '../controls/button';

export default class StatisticScene extends SceneBase { // TODO: rename
    constructor(state, gameCanvas, music) {
        super(state, gameCanvas, music);
        this.dialog = new Dialog(gameCanvas.context);
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

        this.exitButton = new Button({
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