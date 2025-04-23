class Level {
  // constructor(config, spiderSpritesheet) {
  constructor(config, platformImage){//ycl
    this.levelName = config.levelName;
    this.levelNumber = config.levelNumber;//cai
    this.element = config.element;
    this.playerStart = config.playerStart;
    this.coinPositions = config.coins;
    this.enemyConfigs = config.enemies;
    this.portalPosition = config.portalPosition;
    this.totalCoins = config.coins.length;
    this.spiderSpritesheet = spiderSpritesheet;
    this.platformImage = platformImage;

    //console.log(`Creating coins for level ${this.levelNumber}`);
    this.coins = config.coins.map((pos) => {
      //console.log(`Creating coin at position: (${pos.x}, ${pos.y}) for level ${this.levelNumber}`);
      return new Coin(pos.x, pos.y, this.levelNumber);
    });
    //Reset the prompt status for the player's first item pickup
    if (player) {
      player.firstItemPickup = true;
    }


    //Clear old enemies to ensure they do not stack
    this.enemies = [];

    for (let enemyConfig of config.enemies) {
      if (enemyConfig.type === "Frog") {
        this.enemies.push(new Frog(enemyConfig.position.x, enemyConfig.position.y, frogIdle, frogJump, frogFall));
      }      
      if (enemyConfig.type === "Spider") {
        this.enemies.push(new Spider(enemyConfig.position.x, enemyConfig.position.y, this.spiderSpritesheet));
      } //else if (enemyConfig.type === "Bird") {
        else if (enemyConfig.type === "Bat") {
        //this.enemies.push(new Bird(enemyConfig.position.x, enemyConfig.position.y));
        //this.enemies.push(new Bird(enemyConfig.position.x, enemyConfig.position.y, birdSpritesheet));
        this.enemies.push(new Bat(enemyConfig.position.x, enemyConfig.position.y));
      } else if (enemyConfig.type === "Bird"){
        this.enemies.push(new Bird(enemyConfig.position.x, enemyConfig.position.y, birdSpritesheet));
      }
    }

    //Water (or magma) region
    this.water = [];
    if (config.waterRegions) {
      for (let waterConfig of config.waterRegions) {
        let waterType = config.levelName === "Lava Castle" ? "lava" : "water";
        this.water.push(new Water(waterConfig.x, waterConfig.y, waterConfig.width, waterConfig.height, waterType));
      }
    }

    this.ground = [];

    if (config.ground) {
      if (Array.isArray(config.ground)) {
        this.ground = config.ground.map(g => new Ground(g.x, g.y, g.w, g.h));
      } else {
        this.ground.push(new Ground(config.ground.x, config.ground.y, config.ground.w, config.ground.h));
      }
    }

    
    //ycl
    // this.platforms = [];
    // if (config.platforms) {
    //   for (let p of config.platforms) {
    //     this.platforms.push(new Platform(p.x, p.y, p.w, p.h, this.platformImage));//ycl
    //   }
    // }
    // this.platforms = [];
    // if (config.platforms) {
    //   for (let p of config.platforms) {
    //     let imageType = p.type || '1';
    //     this.platforms.push(new Platform(p.x, p.y, p.w, p.h, imageType));
    //   }
    // }

    //Platform (can segment and stitch various types of images)
    this.platforms = [];
    if (config.platforms) {
      for (let p of config.platforms) {
        if (p.type) {
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
          this.platforms.push(new Platform(p.x, p.y, p.w, p.h, '#'));
        }
      }
    }


    this.items = [];
    if (config.items) {
      for (let item of config.items) {
        this.items.push(new Item(item.x, item.y, item.type));
      }
    }


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
   if (config.saws) {
      this.saws = config.saws ? config.saws.positions.map((pos, index) => ({
        position: pos,
        width: config.saws.ranges[index], 
        height: config.saws.ranges[index]
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

    this.portal = new Portal(this.portalPosition.x, this.portalPosition.y);//Portal initialization


  }

  update() {
    /*
    if (millis() - this.startTime > this.storyDuration) {
      //console.log("The background story has finished playing, switch to the main menu...");
      
      if (storyMusic && storyMusic.isPlaying()) {
        //console.log("Stop the background story music");
        storyMusic.stop();
      }
  
      switchScene("menu"); 
    }*/

    //Coin collision detection and collection
    for (let coin of this.coins) {
      coin.update();
      if (!coin.collected && player.collidesWith(coin)) {
        coin.collect();
        player.coins++;
      }
    }

    for (let i = this.items.length - 1; i >= 0; i--) {
      let item = this.items[i];
      item.update();
      if (!item.collected && player.collidesWith(item)) {
        item.collect();
    
        if (item.type === "Double Jump") {
          player.hasDoubleJump = true;
          player.currentItem = "Double Jump";
        } /*else if (item.type === "Dash") { 
          player.hasDash = true; 
          player.currentItem = "Dash";
          console.log("Dash Unlocked!");
        } else if (item.type === "Teleport Scroll") {
          //player.currentItem = "Teleport Scroll";
          player.hasTeleport = true;
          player.currentItem = "Teleport Scroll";
          console.log("Players obtain teleportation scrolls！");
        }*/
         else if (item.type === "Heart") {
          if (!item.collected) {
            item.collected = true;
            player.lives = min(player.lives + 1, 5);
            player.currentItem = null;
    
            if (pickItemSound) {
                pickItemSound.play();
            }
          }
        } /*else if (item.type === "Mystery Box") {
          let possibleItems = [
            "Flame Element",
            "Freeze Element",
            "Strengthen",
            "Timed Bomb",
            "Invincibility",
            "Double Jump",
            "Dash" //
          ];
          let randomItem = random(possibleItems);
          player.currentItem = randomItem;
          console.log("Mystery Box revealed: " + randomItem);
        }*/ else {
          player.currentItem = item.type;
          if (item.type === "Invincibility") {
            player.invincibleTimer = 5;
          }
        }
    
        this.items.splice(i, 1);
      }
    }
    
    for (let obs of this.obstacles) {
      //Obstacle update+collision with deduction of blood
      obs.update();
      if (player.collidesWith(obs)) {
        if (!player.invincible) {
          player.takeDamage(1);
        }
      }
    }

    for (let waterInstance of this.water) {
      //console.log(`Updating water at x: ${waterInstance.position.x}, y: ${waterInstance.position.y}`);
      waterInstance.update();
    }


    for (let enemy of this.enemies) {
      enemy.update();
      if (!enemy.frozen && player.collidesWith(enemy)) {
        if (!player.invincible) {
          player.takeDamage(1);
        }
      }
    }



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



    if (this.saws) {//Can rotate
      for (let saw of this.saws) {
        if (collides(player.position.x, player.position.y, player.width, player.height, saw.position.x - 20, saw.position.y - 20, 40, 40)) {
          if (!player.invincible) {
            player.takeDamage(1);
          }
        }
      }
    }




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
    
    

    if (this.portal) {
      this.portal.update();
    }
  }



  draw() {

    for (let waterInstance of this.water) {
      //console.log(`Drawing water at x: ${waterInstance.position.x}, y: ${waterInstance.position.y}`);
      waterInstance.draw();
    }


    for (let groundInstance of this.ground) {
      groundInstance.draw(); 
    }

    for (let p of this.platforms) {
      p.draw();
    }


    for (let coin of this.coins) {
      coin.draw();
    }

    for (let item of this.items) {
      item.draw();
    }
    for (let obs of this.obstacles) {
      obs.draw();
    }
    for (let enemy of this.enemies) {
      enemy.draw();
    }


    for (let ghost of this.ghosts) {
      ghost.draw();
    }
    

    if (this.axes) {
      this.axes.draw();
    }

    /*
    if (this.saws) {
      this.saws.draw();
    }*/


   if (this.saws && sawsImg) {
    for (let saw of this.saws) {
      push();
      
      translate(saw.position.x, saw.position.y);
      
      //Rotating saw (rotates according to frameCount, speed controls rotation speed)
      let angle = frameCount * 0.05;
      rotate(angle);
  
      image(sawsImg, -saw.width / 2, -saw.height / 2, saw.width, saw.height);
      
      pop();
    }
  }


  
    if (this.advancedBirds) {
      this.advancedBirds.draw();
    }

    
    if (this.allCoinsCollected()) {
      this.portal.draw();
    }
  }

  allCoinsCollected() {//Check if all coins have been picked up
    return this.coins.every((coin) => coin.collected);
  }
}
