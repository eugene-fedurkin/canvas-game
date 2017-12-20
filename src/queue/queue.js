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
      allies.forEach((allyUnit) => {
        if (horizontalPosition > allyUnit.x) horizontalPosition = allyUnit.x;
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
      enemies.forEach((enemyUnit) => {
        if (horizontalPosition < enemyUnit.x) horizontalPosition = enemyUnit.x;
      });

      enemy.x = horizontalPosition + 50;
      enemy.y = this.state.scenes.game.groundLevelY;
    }
  }
}
