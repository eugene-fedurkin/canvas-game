export default class Queue {
    constructor(state) {
        this.state = state;
    }

    queueAlly(allies, ally) {
        let horizontalPosition = this.state.scenes.game.alliesSpawnX;

        if (!allies.length) {
            ally.x = horizontalPosition - 50;
            ally.y = this.state.scenes.game.groundLevelY;
        } else {
            allies.forEach(ally => {
                if (horizontalPosition > ally.x) 
                    horizontalPosition = ally.x;
            });

            ally.x = horizontalPosition - 50;
            ally.y = this.state.scenes.game.groundLevelY;
        }
    }

    queueEnemy(enemies, enemy) {
        let horizontalPosition = this.state.scenes.game.enemiesSpawnX;

        if (!enemies.length) {
            enemy.x = horizontalPosition;
            enemy.y = this.state.scenes.game.groundLevelY;
        } else {
            enemies.forEach(enemy => {
                if (horizontalPosition < enemy.x) 
                horizontalPosition = enemy.x;
            });

            enemy.x = horizontalPosition + 50;
            enemy.y = this.state.scenes.game.groundLevelY;
        }
    }
}