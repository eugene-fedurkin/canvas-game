export default class Dialog {
    constructor(context) {
        this.context = context;
        this.opacity = 0;
        this.close();
    }

    open(message, messageX, buttons) {
        this.message = message;
        this.messageX = messageX;
        this.buttons = buttons;
        this.isOpened = true;
        this.fadeIn = true;
    }

    close() {
        this.isOpened = false;
        this.fadeIn = false;
    }

    render() {
        if (!this.isOpened && this.opacity <= 0.1) return;

        if (!this.fadeIn) {
            if (this.opacity > 0.1) {
                this.opacity -= 0.03;
                this.context.save();
                this.context.globalAlpha = this.opacity;
                this.context.fillText(this.message, this.messageX , 200);
                this.buttons.forEach(button => button.render(this.context));
                this.context.restore();
            } else {
                this.message = '';
                this.messageX = 0;
                this.buttons = [];
            }
            return;
        } else {
            if (this.opacity <= 1) this.opacity += 0.01;
            this.context.save();
            this.context.globalAlpha = this.opacity;
            this.context.fillText(this.message, this.messageX , 200);
            this.buttons.forEach(button => button.render(this.context));
            this.context.restore();
        }
    }

    reset() {
        this.close();
        this.opacity = 0;
    }
}