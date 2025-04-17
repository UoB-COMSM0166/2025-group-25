// =========================
// Level 类 (优化版本)
// =========================

class Level {
  // constructor(config, spiderSpritesheet) {
  constructor(config, platformImage){//ycl
    this.levelName = config.levelName;
    this.levelNumber = config.levelNumber;//cai
    this.element = config.element; // 元素属性，用于武器转换
    this.playerStart = config.playerStart;
    this.coinPositions = config.coins;
    this.enemyConfigs = config.enemies;
    this.portalPosition = config.portalPosition;
    this.totalCoins = config.coins.length;
    this.spiderSpritesheet = spiderSpritesheet; // 传入蜘蛛Spritesheet
    this.platformImage = platformImage;  // ycl：存储平台图片

    // 创建 Coin 实例
    console.log(`Creating coins for level ${this.levelNumber}`);  // 输出关卡号
    this.coins = config.coins.map((pos) => {
      console.log(`Creating coin at position: (${pos.x}, ${pos.y}) for level ${this.levelNumber}`);
      return new Coin(pos.x, pos.y, this.levelNumber);  // 确保传递 levelNumber
    });

    // 道具，新增
    if (player) {
      player.firstItemPickup = true;
    }

    // 创建 Coin 实例
    this.coins = config.coins.map(pos => new Coin(pos.x, pos.y));

    // 清空旧的敌人，确保不会叠加
    this.enemies = [];

    // **初始化敌人**
    for (let enemyConfig of config.enemies) {
      if (enemyConfig.type === "Frog") {
        this.enemies.push(new Frog(enemyConfig.position.x, enemyConfig.position.y, frogIdle, frogJump, frogFall));
      }      
      if (enemyConfig.type === "Spider") {
        this.enemies.push(new Spider(enemyConfig.position.x, enemyConfig.position.y, this.spiderSpritesheet));
      } //else if (enemyConfig.type === "Bird") {
        else if (enemyConfig.type === "Bat") {  // ✅ 替换 `Bird` 为 `Bat`
        //this.enemies.push(new Bird(enemyConfig.position.x, enemyConfig.position.y));
        //this.enemies.push(new Bird(enemyConfig.position.x, enemyConfig.position.y, birdSpritesheet));
        this.enemies.push(new Bat(enemyConfig.position.x, enemyConfig.position.y));
      } else if (enemyConfig.type === "Fish") {
        this.enemies.push(new Fish(enemyConfig.position.x, enemyConfig.position.y));
      }else if (enemyConfig.type === "Bird"){
        this.enemies.push(new Bird(enemyConfig.position.x, enemyConfig.position.y, birdSpritesheet));
      }
    }

    // 为每个水面区域创建 Water 实例kx~~~~
    this.water = [];
    if (config.waterRegions) {
      for (let waterConfig of config.waterRegions) {
        let waterType = config.levelName === "Lava Castle" ? "lava" : "water";
        this.water.push(new Water(waterConfig.x, waterConfig.y, waterConfig.width, waterConfig.height, waterType));
      }
    }


    // 创建多个地面实例kx~~~~~~~
    // **确保 ground 是数组**
    this.ground = [];

    if (config.ground) {
      if (Array.isArray(config.ground)) {
        // 如果 ground 已经是数组，则映射创建 Ground 实例
        this.ground = config.ground.map(g => new Ground(g.x, g.y, g.w, g.h));
      } else {
        // 如果 ground 只是单个对象，则转换为数组
        this.ground.push(new Ground(config.ground.x, config.ground.y, config.ground.w, config.ground.h));
      }
    }

    // 平台
    //ycl
    // this.platforms = [];
    // if (config.platforms) {
    //   for (let p of config.platforms) {
    //     this.platforms.push(new Platform(p.x, p.y, p.w, p.h, this.platformImage));//ycl:加入第五个参数
    //   }
    // }
    // this.platforms = [];
    // if (config.platforms) {
    //   for (let p of config.platforms) {
    //     let imageType = p.type || '1'; // 如果没有指定type，默认使用'#'
    //     this.platforms.push(new Platform(p.x, p.y, p.w, p.h, imageType));
    //   }
    // }
    this.platforms = [];
    if (config.platforms) {
      for (let p of config.platforms) {
        if (p.type) {
          // 如果定义了type，则使用它
          let types = p.type.split('');
          let segmentWidth = p.w / types.length;
          for (let i = 0; i < types.length; i++) {
            this.platforms.push(
              new Platform(
                p.x + i * segmentWidth,
                p.y,
                segmentWidth,
                p.h,
                types[i]
              )
            );
          }
        } else {
          // 如果没有定义type，使用默认的'#'
          this.platforms.push(new Platform(p.x, p.y, p.w, p.h, '#'));
        }
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
    
    /*if (config.saws) {
      this.saws = new Saws(config.saws.positions, config.saws.ranges);
    }*/
   if (config.saws) {//锯子
      this.saws = config.saws ? config.saws.positions.map((pos, index) => ({
        position: pos,
        width: config.saws.ranges[index], // 假设 ranges 定义了每个锯子的宽度
        height: config.saws.ranges[index]  // 假设锯子的宽高相等
      })) : [];
      
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

    this.ghosts = [];
    if (config.ghosts) {
      for (let ghostConfig of config.ghosts) {
        this.ghosts.push(new Ghost(ghostConfig.position, ghostConfig.range));
      }
    }


    // 传送门
    this.portal = new Portal(this.portalPosition.x, this.portalPosition.y);


  }

  update() {
    if (millis() - this.startTime > this.storyDuration) {
      console.log("⏳ 背景故事播放完毕，切换到主菜单...");
      
      // ✅ **停止音乐**
      if (storyMusic && storyMusic.isPlaying()) {
        console.log("⏹️ 停止背景故事音乐...");
        storyMusic.stop();
      }
  
      switchScene("menu"); 
    }
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
        } else if (item.type === "Dash") {  // ✅ 处理 Dash 道具
          player.hasDash = true;  // 让 Dash 可用
          player.currentItem = "Dash";
          console.log("Dash Unlocked!"); // ✅ 调试输出，看看是否生效
        } else if (item.type === "Teleport Scroll") {
          //player.currentItem = "Teleport Scroll";  // **存储瞬移道具**
          player.hasTeleport = true;
          player.currentItem = "Teleport Scroll";
          console.log("✅ 玩家获得瞬移卷轴！");
        } else if (item.type === "Heart") {
          if (!item.collected) {
            item.collected = true;  // ✅ 防止重复加命
            player.lives = min(player.lives + 1, 5);
            player.currentItem = null;
    
            if (pickItemSound) {
                pickItemSound.play();
            }
          }
        } else if (item.type === "Mystery Box") {
          let possibleItems = [
            "Flame Element",
            "Freeze Element",
            "Strengthen",
            "Timed Bomb",
            "Invincibility",
            "Double Jump",
            "Dash" // ✅ 确保 Mystery Box 也能开出 Dash
          ];
          let randomItem = random(possibleItems);
          player.currentItem = randomItem;
          console.log("Mystery Box revealed: " + randomItem);
        } else {
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

    // 更新水面动画kx~~~~
    for (let waterInstance of this.water) {
      //console.log(`Updating water at x: ${waterInstance.position.x}, y: ${waterInstance.position.y}`); // 打印水波的更新信息
      waterInstance.update();
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
    console.log("🛠️ 碰撞检测: ", player.collidesWith(this.portal));

  
/*
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
*/
    // Saws
    if (this.saws) {
      for (let saw of this.saws) { // 遍历数组
        if (collides(player.position.x, player.position.y, player.width, player.height, saw.position.x - 20, saw.position.y - 20, 40, 40)) {
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

    for (let ghost of this.ghosts) {
      ghost.update();
      if (
        player.position.x < ghost.position.x + 30 &&
        player.position.x + player.width > ghost.position.x &&
        player.position.y < ghost.position.y + 30 &&
        player.position.y + player.height > ghost.position.y
      ) {
        if (!player.invincible) {
          player.takeDamage(1);
        }
      }
    }
    
    

    // 传送门
    if (this.portal) {
      this.portal.update();
    }
  }

  draw() {

    // 绘制水面kx~~~~~~
    for (let waterInstance of this.water) {
      //console.log(`Drawing water at x: ${waterInstance.position.x}, y: ${waterInstance.position.y}`); // 打印水波的绘制信息
      waterInstance.draw();
    }

    // 绘制地面kx~~~~~
    for (let groundInstance of this.ground) {
      groundInstance.draw(); 
    }

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

    for (let ghost of this.ghosts) {
      ghost.draw();
    }
    

    // 绘制斧子(axes)
    if (this.axes) {
      this.axes.draw();
    }

    // 绘制锯子(saws)
    /*
    if (this.saws) {
      this.saws.draw();
    }*/
   // 绘制锯子 (Saws)
   if (this.saws && sawsImg) {
    for (let saw of this.saws) {
      push();
      
      // 将锯子移动到它的位置
      translate(saw.position.x, saw.position.y);
      
      // 旋转锯子 (根据 frameCount 来旋转，speed 控制旋转速度)
      let angle = frameCount * 0.05;  // 旋转速度可以调整
      rotate(angle);  // 根据 angle 进行旋转
  
      // 使用锯子图片，锯子的宽度和高度
      image(sawsImg, -saw.width / 2, -saw.height / 2, saw.width, saw.height);
      
      pop();
    }
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
