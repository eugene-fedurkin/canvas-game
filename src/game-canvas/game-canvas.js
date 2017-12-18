export class GameCanvas {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'canvas';
        this.canvas.width = 1100;
        this.canvas.height = 700;
        this.context = this.canvas.getContext('2d');
        this.context.font ='30px Pixelate';
        this.context.fillStyle = 'white';

        this.clickSubscribers = []; 

        document.body.appendChild(this.canvas);
        this.canvas.addEventListener('click', () => this.executeClickHandlers());
    }

    subscribeOnClick(...subscribers) {
        subscribers.forEach(subscriber => {
            this.clickSubscribers.push(subscriber);
        });
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

    executeClickHandlers() {
        const x = event.clientX - this.canvas.getBoundingClientRect().left;
        const y = event.clientY - this.canvas.getBoundingClientRect().top;
        this.clickSubscribers.forEach(subscriber => {
            const clickedInsideSubscriber = subscriber.x <= x
                && subscriber.x + subscriber.width >= x
                && subscriber.y <= y 
                && subscriber.y + subscriber.height >= y;

            if (clickedInsideSubscriber) subscriber.clickHandler();
        });
    }
}