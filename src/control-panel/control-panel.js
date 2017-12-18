import Button from '../controls/button';
import parametersOfUnitButtons from './parameters-unit-buttons';
import UnitFactory from '../unit-factory/unit-factory';
import Queue from '../queue/queue';
import Direction from '../unit/direction';
import soundButton from './parameters-help-button';

export default class ControlPanel {
    constructor(state, gameCanvas) {
        this.buttons = null;
        this.state = state;
        this.gameCanvas = gameCanvas;
        this.unitFactory = UnitFactory.getSingletonInstance();
        this.queue = new Queue(state);
    }

    createControlPanel(level) {
        level = level > 4 ? 4 : level; // TODO: ???
        this.buttons = parametersOfUnitButtons[level].map(buttonParam => {
            const button = new Button({
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
        const allyUnit = this.unitFactory.create(name, Direction.right);

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