export class SceneBase {
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