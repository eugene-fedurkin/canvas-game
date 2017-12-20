export default class SceneBase {
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
