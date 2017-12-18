import  { GameCanvas } from './game-canvas/game-canvas';
import { State } from './state/state';
import { MenuScene } from './scenes/menu.scene';
import { GameScene } from './scenes/game.scene';
import Music from './music/music';
import Statistic from './scenes/statistic';
import Preloader from './scenes/preloder.scene';

window.onload = function() {
    const state = new State();
    const gameCanvas = new GameCanvas();
    const music = new Music(gameCanvas);
    const preloder = new Preloader(state, gameCanvas);
    const menuScene = new MenuScene(state, gameCanvas, music, preloder);
    const gameScene = new GameScene(state, gameCanvas, music, preloder);
    const statistic = new Statistic(state, gameCanvas, music, preloder);

    state.scenes.menu.instance = preloder;
    state.scenes.menu.instance = menuScene;
    state.scenes.game.instance = gameScene;
    state.scenes.statistic.instance = statistic;
    state.currentScene = preloder;

    (function frame(timestamp) {
        state.currentScene.frame(timestamp);
        requestAnimationFrame(frame);
    })();
}