import Actions from '../unit/actions';

export default class FloatingText {
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
      } else if (textParam.action === Actions.attack && !textParam.isCriticalHit) {
        const redColor = `rgba(248, 22, 97, ${textParam.opacity})`;
        this.context.fillStyle = redColor;
      } else if (textParam.action === Actions.attack && textParam.isCriticalHit) {
        this.context.font = '20px Pixelate';
        const redColor = `rgba(248, 22, 97, ${textParam.opacity})`;
        this.context.fillStyle = redColor;
      } else if (textParam.action === Actions.heal) {
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
