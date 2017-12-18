import { SceneBase } from './scene.base';

export default class Preloader extends SceneBase {
    constructor(state, gameCanvas) {
        super(state, gameCanvas);
        this.isLoading = true;
        this.imgs = [];
    }

    load(...imgs) {
        imgs.forEach(img => {
            img.onload = this.toggle.bind(this, img);
            this.imgs.push(img);
        });
    }

    render() {
        this.gameCanvas.context.save();
        this.gameCanvas.context.fillStyle = 'rgba(117, 248, 48, 1';
        this.gameCanvas.context.fillText('Loding.....', 40, 40);
        this.gameCanvas.context.restore();
    }

    updateState() {
        this.isLoading = !this.imgs.every(img => img.ready);
        if (!this.isLoading) {
            this.state.currentScene = this.state.scenes.menu.instance
        }
    }

    toggle(img) {
        img.ready = true;
    }
}