// =========================
// Level 类
// =========================

class Level {
  constructor(config) {
    this.levelName = config.levelName;
    this.element = config.element; // 元素属性，用于武器转换
    this.playerStart = config.playerStart;
    this.coinPositions = config.coins;
    this.enemyConfigs = config.enemies;
    this.portalPosition = config.portalPosition;
    this.totalCoins = config.coins.length;

    // 创建 Coin 实例
    this.coins = [];
    for (let pos of this.coinPositions) {
      this.coins.push(new Coin(pos.x, pos.y));
    }

    // 创建敌人
    this.enemies = [];
    for (let enemyConfig of this.enemyConfigs) {
      if (enemyConfig.type === "Spider") {
        this.enemies.push(new Spider(enemyConfig.position.x, enemyConfig.position.y));
      } else if (enemyConfig.type === "Bird") {
        this.enemies.push(new Bird(enemyConfig.position.x, enemyConfig.position.y));
      } else if (enemyConfig.type === "Fish") {
        this.enemies.push(new Fish(enemyConfig.position.x, enemyConfig.position.y));
      }
    }

    // 平台
    this.platforms = [];
    if (config.platforms) {
      for (let p of config.platforms) {
        this.platforms.push(new Platform(p.x, p.y, p.w, p.h));
      }
    }

    // 道具
    this.items = [];
    if (config.items) {
      for (let item of config.items) {
        this.items.push(new Item(item.x, item.y, item.type));
      }
    }

    // 障碍物/机关
    this.obstacles = [];
    if (config.obstacles) {
      for (let obs of config.obstacles) {
        if (obs.type === "Laser") {
          this.obstacles.push(new LaserObstacle(obs.x, obs.y, obs.w, obs.h));
        } else if (obs.type === "FallingSpike") {
          this.obstacles.push(new FallingSpike(obs.x, obs.y, obs.w, obs.h));
        } else {
          this.obstacles.push(new Obstacle(obs.x, obs.y, obs.w, obs.h, obs.type));
        }
      }
    }
    if (config.axes) {
      this.axes = new Axes(config.axes.positions, config.axes.swingTimes);
    } else {
      this.axes = null;
    }
    if (config.saws) {
      this.saws = new Saws(config.saws.positions, config.saws.ranges);
    } else {
      this.saws = null;
    }
    if (config.advancedBirds) {
      this.advancedBirds = new AdvancedBirds(
        config.advancedBirds.positions,
        config.advancedBirds.ranges,
        config.advancedBirds.type
      );
    } else {
      this.advancedBirds = null;
    }

    // 传送门
    this.portal = new Portal(this.portalPosition.x, this.portalPosition.y);
  }

  update() {
    // 更新并检测金币收集
    for (let coin of this.coins) {
      coin.update();
      if (!coin.collected && player.collidesWith(coin)) {
        coin.collect();
        player.coins++;
      }
    }

    // 更新并检测道具收集
    for (let i = this.items.length - 1; i >= 0; i--) {
      let item = this.items[i];
      item.update();
      if (!item.collected && player.collidesWith(item)) {
        item.collect();
        if (item.type === "Double Jump") {
          player.hasDoubleJump = true;
          player.currentItem = "Double Jump";
        } else if (item.type === "Heart") {
          player.lives += 1;
          player.currentItem = null;
        } else if (item.type === "Mystery Box") {
          // 随机生成道具
          let possibleItems = [
            "Flame Gun",
            "Freeze Gun",
            "Greatsword",
            "Timed Bomb",
            "Invincibility",
            "Double Jump"
          ];
          let randomItem = random(possibleItems);
          player.currentItem = randomItem;
          console.log("Mystery Box revealed: " + randomItem);
        } else {
          // 其它道具
          player.currentItem = item.type;
          if (item.type === "Invincibility") {
            player.invincibleTimer = 5;
          }
        }
        this.items.splice(i, 1);
      }
    }

    // 更新障碍物 (如激光、尖刺等)
    for (let obs of this.obstacles) {
      obs.update();
      if (player.collidesWith(obs)) {
        if (!player.invincible) {
          player.takeDamage(1);
        }
      }
    }

    // 更新敌人
    for (let enemy of this.enemies) {
      enemy.update();
      if (!enemy.frozen && player.collidesWith(enemy)) {
        if (!player.invincible) {
          player.takeDamage(1);
        }
      }
    }

    // Axes
    if (this.axes) {
      this.axes.update();
      for (let axe of this.axes.axes) {
        if (
          collides(
            player.position.x,
            player.position.y,
            player.width,
            player.height,
            axe.position.x - 20,
            axe.position.y - 30,
            40,
            60
          )
        ) {
          if (!player.invincible) {
            player.takeDamage(1);
          }
        }
      }
    }

    // Saws
    if (this.saws) {
      this.saws.update();
      for (let saw of this.saws.saws) {
        if (
          collides(
            player.position.x,
            player.position.y,
            player.width,
            player.height,
            saw.position.x - 20,
            saw.position.y - 20,
            40,
            40
          )
        ) {
          if (!player.invincible) {
            player.takeDamage(1);
          }
        }
      }
    }

    // AdvancedBirds
    if (this.advancedBirds) {
      this.advancedBirds.update();
      for (let bird of this.advancedBirds.birds) {
        if (
          collides(
            player.position.x,
            player.position.y,
            player.width,
            player.height,
            bird.position.x - 20,
            bird.position.y - 10,
            40,
            20
          )
        ) {
          if (!player.invincible) {
            player.takeDamage(1);
          }
        }
      }
    }

    // 传送门
    if (this.portal) {
      this.portal.update();
    }
  }

  draw() {
    // 绘制平台
    for (let p of this.platforms) {
      p.draw();
    }

    // 绘制金币
    for (let coin of this.coins) {
      coin.draw();
    }

    // 绘制道具
    for (let item of this.items) {
      item.draw();
    }

    // 绘制障碍物/机关
    for (let obs of this.obstacles) {
      obs.draw();
    }

    // 绘制敌人
    for (let enemy of this.enemies) {
      enemy.draw();
    }

    // 绘制斧子(axes)
    if (this.axes) {
      this.axes.draw();
    }

    // 绘制锯子(saws)
    if (this.saws) {
      this.saws.draw();
    }

    // 绘制高级鸟群(advancedBirds)
    if (this.advancedBirds) {
      this.advancedBirds.draw();
    }

    // 如果全部金币收集完毕，则显示传送门
    if (this.allCoinsCollected()) {
      this.portal.draw();
    }
  }

  allCoinsCollected() {
    return this.coins.every((coin) => coin.collected);
  }
}