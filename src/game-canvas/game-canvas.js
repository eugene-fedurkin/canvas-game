export default class GameCanvas {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'canvas';
    this.canvas.width = 1100;
    this.canvas.height = 700;
    this.context = this.canvas.getContext('2d');
    this.context.font = '30px Pixelate';
    this.context.fillStyle = 'white';

    this.cursor = new Image();
    this.cursor.src = 'imgs/UI/cursor.png';
    // this.img = 'url("imgs/UI/cursor.png"), auto';

    this.clickSubscribers = [];

    document.body.appendChild(this.canvas);

    this.canvas.addEventListener('click', (e) => {
      this.executeClickHandlers(e);
    });
    this.canvas.addEventListener('mousemove', (e) => {
      this.changeMouse(e);
    });
  }

  subscribeOnClick(...subscribers) {
    subscribers.forEach(subscriber => this.clickSubscribers.push(subscriber));
  }

  unsubscribeClick(subscriber) {
    if (subscriber) {
      const index = this.clickSubscribers.indexOf(subscriber);
      if (index >= 0) {
        this.clickSubscribers.splice(index, 1);
      }
    } else {
      this.clickSubscribers = [];
    }
  }

  executeClickHandlers(e) {
    const x = e.clientX - this.canvas.getBoundingClientRect().left;
    const y = e.clientY - this.canvas.getBoundingClientRect().top;
    this.clickSubscribers.forEach((subscriber) => {
      const clickedInsideSubscriber = subscriber.x <= x
        && subscriber.x + subscriber.width >= x
        && subscriber.y <= y
        && subscriber.y + subscriber.height >= y;

      if (clickedInsideSubscriber) subscriber.clickHandler();
    });
  }

  changeMouse(e) {
    const x = e.clientX - this.canvas.getBoundingClientRect().left;
    const y = e.clientY - this.canvas.getBoundingClientRect().top;
    const isHover = this.clickSubscribers.some((subscriber) => {
      return subscriber.x <= x
        && subscriber.x + subscriber.width >= x
        && subscriber.y <= y
        && subscriber.y + subscriber.height >= y;
    });

    if (isHover) document.getElementById('canvas').classList.add('hover');
    else document.getElementById('canvas').classList.remove('hover');
  }
}
