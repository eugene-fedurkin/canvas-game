import Skeleton from '../units/skeleton/skeleton';
import Knight from '../units/knight/knight';
import CountryKnight from '../units/country-knight/country-knight';
import Rogue from '../units/rogue/rogue';
import Blob from '../units/blob/blob';
import Wizard from '../units/wizard/wizard';
import Bandit from '../units/bandit/bandit';

export default class UnitFactory {
    constructor() {
        this.id = 0;
    }

    static getSingletonInstance() {
        if (!UnitFactory.instance) UnitFactory.instance = new UnitFactory();
        return UnitFactory.instance;
    }

    create(unitName, direction) {
        switch(unitName) {
            case 'skeleton': return new Skeleton(this.id++, direction);
            case 'knight': return new Knight(this.id++, direction);
            case 'country-knight': return new CountryKnight(this.id++, direction);
            case 'rogue': return new Rogue(this.id++, direction);
            case 'blob': return new Blob(this.id++, direction);
            case 'wizard': return new Wizard(this.id++, direction);
            case 'bandit': return new Bandit(this.id++, direction);
            default: throw Error('wrong name of unit!!!');
        }
    }
}