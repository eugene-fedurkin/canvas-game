import Button from '../controls/button';

export default class BuffManager {
    constructor(state, gameCanvas) {
        this.buttons = null;
        this.state = state;
        this.gameCanvas = gameCanvas;

        this.buffId = 0;

        this.fullReset();
    }

    createButton() {
        this.buttons = this.getParametersOfBuffButton().map(btn => {
            const button = new Button({
                x: btn.x,
                y: btn.y,
                height: btn.height,
                width: btn.width,
                iconUrl: btn.iconUrl,
                clickHandler: btn.clickHandler
            });
            return button;
        });
    }

    improveWeapon() { // TODO: problem with multyBuff
        if (this.state.scenes.game.money >= 3) {
            this.state.scenes.game.currentLevel.allies.forEach(unit => {
                unit.damage++;
                unit.weaponIdBuff.push(this.buffId);
            });
            
            this.weaponBuffs.push({
                id: this.buffId++,
                weaponStart: Date.now(),
                opacity: 0.7,
                fadeIn: false
            });

            this.state.scenes.game.money -= 3;
        }
    }

    improveArmor() {
        if (this.state.scenes.game.money >= 5) {
            this.state.scenes.game.currentLevel.allies.forEach(unit => {
                unit.health += 5;
                unit.armorIdBuff.push(this.buffId);
            });

            this.armorBuffs.push({
                id: this.buffId,
                armorStart: Date.now(),
                opacity: 0.7,
                fadeIn: false
            });

            this.state.scenes.game.money -= 5;
        }
    }

    weaponReset() {
        this.state.scenes.game.currentLevel.allies.forEach(unit => {
            if (unit.weaponIdBuff.length && unit.weaponIdBuff[0] === this.weaponBuffs[0].id) {
                unit.damage--;
                unit.weaponIdBuff.shift();
            }
        });

        this.weaponBuffs.shift();
    }

    armorReset() {
        this.state.scenes.game.currentLevel.allies.forEach(unit => {
            if (unit.armorIdBuff.length && unit.armorIdBuff[0] === this.armorBuffs[0].id) {
                if (unit.health > 5) unit.health -= 5;
                else unit.health = 1;

                unit.armorIdBuff.shift();
            }
        });

        this.armorBuffs.shift();
    }

    fullReset() {
        this.weaponBuffs = [];
        this.armorBuffs = [];
    }

    updateTime() {
        if (this.weaponBuffs.length) {
            const passedWeaponTime = Date.now() - this.weaponBuffs[0].weaponStart;
            const buffDuration = 30000;

            if (passedWeaponTime > buffDuration) this.weaponReset();

            this.weaponBuffs.forEach(buff => {
                const delta = buff.fadeIn ? 0.01 : -0.01;
                buff.opacity += delta;
                if (buff.opacity < 0.1) buff.fadeIn = true;
                else if (buff.opacity > 0.7) buff.fadeIn = false;
            });
        }

        if (this.armorBuffs.length) {
            const passedArmorTime = Date.now() - this.armorBuffs[0].armorStart;
            const buffDuration = 20000;

            if (passedArmorTime > buffDuration) this.armorReset();

            this.armorBuffs.forEach(buff => {
                const delta = buff.fadeIn ? 0.015 : -0.015;
                buff.opacity += delta;
                if (buff.opacity < 0.1) buff.fadeIn = true;
                else if (buff.opacity > 0.7) buff.fadeIn = false;
            });
        }
    }

    subscribe() {
        this.gameCanvas.subscribeOnClick(...this.buttons);
    }

    render() {
        this.buttons.forEach(button => button.render(this.gameCanvas.context));
        this.gameCanvas.context.save();
        this.gameCanvas.context.font = '22px Pixelate';
        this.gameCanvas.context.fillText('$3', 50, 140);
        this.gameCanvas.context.fillText('$5', 50, 210);
        this.gameCanvas.context.restore();

        const weaponBtn = this.buttons[0];
        this.weaponBuffs.forEach((buff, position) => {
            this.gameCanvas.context.save();
            this.gameCanvas.context.globalAlpha = buff.opacity;
            const buffXPosition = weaponBtn.x + 70 * (position + 1);
            this.gameCanvas.context.drawImage(weaponBtn.icon, buffXPosition, weaponBtn.y);
            this.gameCanvas.context.restore();
        });

        const armorBtn = this.buttons[1];
        this.armorBuffs.forEach((buff, position) => {
            this.gameCanvas.context.save();
            this.gameCanvas.context.globalAlpha = buff.opacity;
            const buffXPosition = armorBtn.x + 70 * (position + 1);
            this.gameCanvas.context.drawImage(armorBtn.icon, buffXPosition, armorBtn.y);
            this.gameCanvas.context.restore();
        });
    }

    getParametersOfBuffButton() {
        return [
            {
                name: 'arm', iconUrl: 'imgs/buff-icon/weapon.png',
                x: 20, y: 90, width: 30, height: 40,
                clickHandler: () => this.improveWeapon()
            },
            {
                name: 'armor', iconUrl: 'imgs/buff-icon/armor.png',
                x: 20, y: 160, width: 30, height: 40,
                clickHandler: () => this.improveArmor()
            }
        ];
    }
}