export default class Button {
    constructor(options) {
        if (!options) throw new Error('Button options missing');

        this.x = options.x;
        this.y = options.y;
        this.height = options.height;
        this.width = options.width;
        this.iconUrl = options.iconUrl;
        this.clickHandler = options.clickHandler;

        if (options.iconUrl) {
            this.setIcon(options.iconUrl);
        } else {
            this.icon = null;
        }
    }

    setIcon(url) {
        const icon = new Image();
        icon.src = url;
        this.icon = icon;
    }

    render(context) {
        context.drawImage(this.icon, this.x, this.y);
    }
}