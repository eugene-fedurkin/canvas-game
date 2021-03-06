import GameCanvas from './game-canvas/game-canvas';
import State from './state/state';
import MenuScene from './scenes/menu.scene';
import GameScene from './scenes/game.scene';
import Music from './music/music';
import StatisticScene from './scenes/statistic.scene';

window.onload = () => {
  const state = new State();
  const gameCanvas = new GameCanvas();
  const music = new Music(gameCanvas);
  const menuScene = new MenuScene(state, gameCanvas, music);
  const gameScene = new GameScene(state, gameCanvas, music);
  const statisticScene = new StatisticScene(state, gameCanvas, music);

  state.scenes.menu.instance = menuScene;
  state.scenes.game.instance = gameScene;
  state.scenes.statistic.instance = statisticScene;
  state.currentScene = menuScene;

  ((function frame(timestamp) {
    state.currentScene.frame(timestamp);
    requestAnimationFrame(frame);
  })());
};
