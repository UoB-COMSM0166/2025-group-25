// =========================
// 🎮 玩家类 (最终优化版)
// =========================

class Player {
  constructor(startPos) {
    this.position = startPos.copy();
    this.velocity = createVector(0, 0);
    this.width = 60;
    this.height = 60;
    this.baseSpeed = 3;//Rui
    this.speed = 3;//Rui
    this.jumpForce = 12;//cailing
    this.lives = 3;
    this.coins = 0;
    this.invincible = false;
    this.hasDoubleJump = true;
    this.hasDash = false;       
    this.jumps = 0;
    this.invincibleTimer = 0;
    this.damageCooldown = 0;
    this.isAttacking = false;
    this.attackCooldown = 0;
    this.attackDuration = 10;
    this.facingDirection = "right"; 
    this.state = "idle"; 
    this.isOnGround = false;  
    this.hasTeleport = false;

    // **冲刺相关**
    this.isDashing = false;  
    this.dashCooldown = 0;   
    this.dashDuration = 15;  
    this.dashSpeed = 12;     
    this.dashTimeLeft = 0;  

    // **动画相关**
    this.frameIndex = 0;
    this.frameDelay = 6;
    this.frameCounter = 0;
    this.loadAnimationFrames();

    // **物品相关**
    this.itemPickupMessage = "";  // 存储提示信息
    this.messageTimer = 0;        // 计时器，控制提示显示时间
    this.firstItemPickup = true;  // 记录是否是当前关卡第一次拾取道具
  }

  /** 🔄 统一加载动画帧 */
  loadAnimationFrames() {
    this.animations = {
      idle: this.loadFrames("player-idle", 4),
      run: this.loadFrames("player-run", 6),
      jump: [loadImage("assets/player-jump-1.png")], // 只有1帧
      attack: this.loadFrames("player-attack", 2),
      dash:[loadImage("assets/player-dash.png")]
    };
  }

  /** 📜 加载动画帧的辅助函数 */
  loadFrames(baseName, count) {
    return Array.from({ length: count }, (_, i) => 
      loadImage(`assets/${baseName}-${i + 1}.png`)
    );
  }

  /** 🚀 处理角色移动 */
  handleMovement() {
    if (this.isDashing) return; // **正在冲刺时不进行普通移动**

    let horiz = 0;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) { // A 键 或 左方向键
      horiz -= this.speed;
      this.facingDirection = "left";
    }
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) { // D 键 或 右方向键
      horiz += this.speed;
      this.facingDirection = "right";
    }

    this.position.x += horiz;

    if (level) {
      let levelWidth = level.portalPosition.x + 200;
      this.position.x = constrain(this.position.x, 0, levelWidth - this.width);
    }

    this.velocity.y += 0.8;
    this.position.y += this.velocity.y;

    if (this.position.y >= height - this.height) {
      this.position.y = height - this.height;
      this.velocity.y = 0;
      this.jumps = 0;
      this.isJumpKeyReleased = true;
    }
    //Check if the canvas falls out, if it falls out, it will respawn
    if (this.position.y > height-70) {
      this.takeDamage(1);
      this.respawn();
    }

    if (horiz !== 0) {
      if (runSound && !runSound.isPlaying()) {
        runSound.setVolume(0.5);
        runSound.loop();
      }
    } else { 
      if (runSound && runSound.isPlaying()) {
        runSound.stop();
      }
    }
  }

  //After falling into water, return to the starting position of this level kx~~~~

  respawn() {
    //if (level.levelNumber === 2) {
    if(level){
        let respawnX = this.position.x;
        let respawnY = 10;

        //If there is a security platform before, use it first
        if (this.lastSafePlatform) {
            respawnY = this.lastSafePlatform.position.y - this.height;
            respawnX = this.lastSafePlatform.position.x + this.lastSafePlatform.width / 2 - this.width / 2;
        } 
        else {
            //No record of security platform, search for the nearest platform above the water surface
            let highestValidPlatform = null;
            let highestY = -Infinity;

            for (let platform of level.platforms) {
                if (platform.position.y < this.position.y && platform.position.y > highestY) {
                    highestY = platform.position.y;
                    highestValidPlatform = platform;
                }
            }

            //If a suitable platform is found, set it as a respawn point
            if (highestValidPlatform) {
                respawnY = highestValidPlatform.position.y - this.height;
                respawnX = highestValidPlatform.position.x + highestValidPlatform.width / 2 - this.width / 2;
            }
        }

        this.position = createVector(respawnX, respawnY);
    } else {
        this.position = level.playerStart.copy();
    }

    this.velocity.set(0, 0);
}

  jump() {
    if (this.isJumpKeyReleased && this.jumps < (this.hasDoubleJump ? 2 : 1)) {
      this.velocity.y = -this.jumpForce;
      this.jumps++;
      this.isJumpKeyReleased = true;
      if (jumpSound) {
        jumpSound.play();
      }
    }
  }

 /*
  dash() {
    if (!this.hasDash || this.isDashing || this.dashCooldown > 0) return;

    this.isDashing = true;
    this.dashTimeLeft = this.dashDuration;
    this.dashCooldown = 60; 

    let dashAngle;
    if (keyIsDown(UP_ARROW)) { 
      dashAngle = this.facingDirection === "right" ? -PI / 3 : -2 * PI / 3; 
    } else {
      dashAngle = this.facingDirection === "right" ? -PI / 6 : -5 * PI / 6; 
    }

    this.velocity.x = this.dashSpeed * cos(dashAngle);
    this.velocity.y = this.dashSpeed * sin(dashAngle);
  }*/

  /*
  teleport() {
    if (this.currentItem === "Teleport Scroll") {
      let newX = this.position.x + 200;

      if (this.isSafePosition(newX, this.position.y)) {
        this.position.x = newX;
        console.log("Teleported to safe position:", this.position);
      } else {
        console.log("Unsafe teleport, canceled.");
      }

      this.currentItem = null; 
    }
   
  }
*/
/*
  teleport() {
    if (!this.hasTeleport) return;

    let teleportDistance = 200;
    let newX = this.position.x + teleportDistance;

    let safe = true;
    for (let enemy of level.enemies) {
      if (abs(enemy.position.x - newX) < 50) {
        safe = false;
        break;
      }
    }

  }*/


  //Check if the target location is safe
  isSafePosition(x, y) {
    for (let plat of level.platforms) {
      if (
        x + this.width > plat.position.x &&
        x < plat.position.x + plat.width &&
        y + this.height > plat.position.y &&
        y < plat.position.y + plat.height
      ) {
        return true;
      }
    }
    return false;
  }


   attack() {
    if (this.isAttacking || this.attackCooldown > 0) return;
  
    this.isAttacking = true;
    this.state = "attack";
    this.frameIndex = 0;
    this.frameCounter = 0;
  
    setTimeout(() => {
      this.isAttacking = false;
      this.attackCooldown = 10;
      this.state = "idle";
    }, 400);


    if (this.currentItem && (this.currentItem === "Flame Element" || this.currentItem === "Freeze Element" || this.currentItem === "Thunder Element")) {
      if (attackSound) {
        attackSound.play();
       //console.log("Play attack sound effects");
      }
    }
  /*
    let attackX = this.facingDirection === "right"
      ? this.position.x + this.width
      : this.position.x - 20;
    let attackY = this.position.y + this.height / 2;
    //let attackY = this.position.y + this.height;
  */
    let attackX = this.facingDirection === "right"
    ? this.position.x + this.width
    : this.position.x - 20;
    let attackY = this.position.y + this.height-20;
    
    //Rui
    let attackRadius = 100; 

    let playerCenterX = this.position.x + this.width;
    let playerCenterY = this.position.y + this.height;

    //Remote attack logic
    if (this.currentItem === "Flame Element") {
      let fireProj = new FlameProjectile(attackX, attackY, this.facingDirection);
      projectiles.push(fireProj);
    } else if (this.currentItem === "Freeze Element") {
      let freezeProj = new FreezeProjectile(attackX, attackY, this.facingDirection);
      projectiles.push(freezeProj);
    } else if (this.currentItem === "Thunder Element") {
      let thunderProj = new ThunderProjectile(attackX, attackY,this.facingDirection);
      projectiles.push(thunderProj);
    } else {
      /*
      let attackRange = 35;
      for (let i = level.enemies.length - 1; i >= 0; i--) {
        let enemy = level.enemies[i];
        if (
          enemy.position.x > attackX - attackRange &&
          enemy.position.x < attackX + attackRange &&
          abs(enemy.position.y - this.position.y) < 40
        ) {
          level.enemies.splice(i, 1);
          console.log("Hit enemy!");
        }
      }*/
     //(Rui)
     for (let i = level.enemies.length - 1; i >= 0; i--) {
      let enemy = level.enemies[i];
      let enemyCenterX = enemy.position.x + enemy.width;
      let enemyCenterY = enemy.position.y + enemy.height;
  
      //Calculate the distance between the player and the enemy
      let distance = dist(playerCenterX, playerCenterY, enemyCenterX, enemyCenterY);
  
      //If the distance is less than the attack radius, hit the enemy
      if (distance < attackRadius) {
        level.enemies.splice(i, 1);
      }
    }
    }
  }

  
  keyPressed() {
    if (key === " " || key === "w" || key === "W" || keyIsDown(UP_ARROW)) {
      this.jump();
    }
    if (key === "Z" || key === "z" || key === "j" || key === "J") {
      this.attack();
    }
    //if (key === "X" || key === "x") this.dash();
    
    /*if (key === "T" || key === "t") {
      player.teleport();
    }*/
   /*
    if (this.hasTeleport && (key === "T" || key === "t")) {
      this.teleport();
    }*/
    
  }
  mousePressed() {
    if (mouseButton === LEFT) {
      this.attack();
    }
  }

  /*
  keyReleased() {
    if (key === " ") {
      this.isJumpKeyReleased = true; //
    }
  }
*/
//Handling collision detection
  handleCollisions() {
    if (!level) return;
    let { ground, platforms, enemies } = level;
    let { obstacles } = level;
    

    for (let obs of obstacles) {
      if (obs.type === "Spiked Wall" && this.collidesWith(obs)) {
        this.takeDamage(1);
        this.respawn();
      }
    }
  
    for (let plat of platforms) {
        if (collides(this.position.x, this.position.y, this.width, this.height,
                     plat.position.x, plat.position.y, plat.width, plat.height)) {
  
            let playerBottom = this.position.y + this.height;
            let playerTop = this.position.y;
            let playerLeft = this.position.x;
            let playerRight = this.position.x + this.width;
  
            let platformBottom = plat.position.y + plat.height;
            let platformTop = plat.position.y;
            let platformLeft = plat.position.x;
            let platformRight = plat.position.x + plat.width;
  
            let overlapX = Math.min(playerRight - platformLeft, platformRight - playerLeft);
            let overlapY = Math.min(playerBottom - platformTop, platformBottom - playerTop);
  
            if (overlapX < overlapY) {
                //Left collision
                if (playerRight > platformLeft && playerLeft < platformLeft) {
                    this.position.x = platformLeft - this.width;
                    this.velocity.x = 0;
                }
                //Right side collision
                else if (playerLeft < platformRight && playerRight > platformRight) {
                    this.position.x = platformRight;
                    this.velocity.x = 0;
                }
            } else {
                //Top collision
                if (playerBottom > platformTop && playerTop < platformTop) {
                    this.position.y = platformTop - this.height;
                    this.velocity.y = 0;
                    this.jumps = 0;
                    this.isJumpKeyReleased = true;
                    this.isOnGround = true;

                    //Record the latest security platforms
                    this.lastSafePlatform = plat;
                }
                //Bottom collision (hitting below the platform to prevent people from passing through)
                else if (playerTop < platformBottom && playerBottom > platformBottom) {
                    this.position.y = platformBottom;
                    this.velocity.y = Math.max(this.velocity.y, 0); //Prevent characters from moving up
                }
            }
        }
    }

    //Check for collision with the water surface kx~~~~~
    if (level.water) {
      for (let waterInstance of level.water) {
        if (collides(this.position.x, this.position.y, this.width, this.height,
                    waterInstance.position.x, waterInstance.position.y, waterInstance.width, waterInstance.height)) {
          this.takeDamage(1);
          this.respawn();
        }
      }
    }
    
    if (Array.isArray(ground)) {
      for (let groundInstance of ground) {
          if (groundInstance && groundInstance.position) {
              if (collides(this.position.x, this.position.y, this.width, this.height,
                          groundInstance.position.x, groundInstance.position.y, 
                          groundInstance.width, groundInstance.height)) {

                  let playerBottom = this.position.y + this.height;
                  let playerTop = this.position.y;
                  let playerLeft = this.position.x;
                  let playerRight = this.position.x + this.width;

                  let groundBottom = groundInstance.position.y + groundInstance.height;
                  let groundTop = groundInstance.position.y;
                  let groundLeft = groundInstance.position.x;
                  let groundRight = groundInstance.position.x + groundInstance.width;

                  let overlapX = Math.min(playerRight - groundLeft, groundRight - playerLeft);
                  let overlapY = Math.min(playerBottom - groundTop, groundBottom - playerTop);

                  if (overlapX < overlapY) {
                      if (playerRight > groundLeft && playerLeft < groundLeft) {
                          this.position.x = groundLeft - this.width;
                          this.velocity.x = 0;
                      }
                      else if (playerLeft < groundRight && playerRight > groundRight) {
                          this.position.x = groundRight;
                          this.velocity.x = 0;
                      }
                  } else {
                      if (playerBottom > groundTop && playerTop < groundTop) {
                          this.position.y = groundTop - this.height;
                          this.velocity.y = 0;
                          this.jumps = 0;
                          this.isJumpKeyReleased = true;
                          this.isOnGround = true;
                      }
                      else if (playerTop < groundBottom && playerBottom > groundBottom) {
                          this.position.y = groundBottom;
                          this.velocity.y = Math.max(this.velocity.y, 0);
                      }
                  }
              }
          }
      }
    }

  
    //Dealing with enemy collisions
    //(Can only stand on the head)(Rui)
    for (let enemy of enemies) {
      if (enemy.frozen && enemy.isSolidWhenFrozen) {
        if (
          this.velocity.y >= 0 &&
          collides(this.position.x, this.position.y, this.width, this.height,
                   enemy.position.x+ enemy.width * 0.2,
                   //enemy.position.y,
                   enemy.position.y + enemy.height * 0.4,
                   enemy.width * 0.3,
                   //enemy.height
                   enemy.height * 0.2
                  )
        ) {
          //let standingHeight = enemy.position.y + enemy.height + 12;
          let standingHeight = enemy.position.y + enemy.height; //Adjust the height range for standing

          if (!this.isOnFrozenEnemy) {//Avoid repeatedly entering a standing state in a short period of time
            this.isOnFrozenEnemy = true; 
            setTimeout(() => { this.isOnFrozenEnemy = false; }, 50);
          }

          if (this.position.y + this.height - this.velocity.y <= standingHeight +2) {
            //this.position.y = enemy.position.y - this.height;
            //this.position.y = enemy.position.y - this.height + 52;
            this.position.y = enemy.position.y - this.height + 50;
            //this.position.y = standingHeight;- this.height + 1;
            //this.velocity.y = 0;
            if (this.velocity.y > 0) {  //Only reset to zero when falling, to avoid shaking caused by floating up
              this.velocity.y = 0;
            }
            this.jumps = 0;
            this.isJumpKeyReleased = true;
          }
        }else {
          this.isOnFrozenEnemy = false;//Ensure that re detection is allowed when Player leaves Enemy's head
        }
        
      } else if (!this.invincible && collides(this.position.x, this.position.y, this.width, this.height,
                                              enemy.position.x, enemy.position.y, enemy.width, enemy.height)) {
        this.takeDamage(1);
      }
    }
  }

  updateAnimationState() {
    let previousState = this.state; 
    let previousDirection = this.facingDirection;

    if (this.velocity.y < 0) {
      this.state = "jump";
    } 
     else if (keyIsDown(65) || keyIsDown(68) || keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
      this.state = "run";
    }else if (this.isAttacking) {
      this.state = "attack"; 
    }else {
      this.state = "idle";
    }

    //If there is a change in status or direction, reset the ` frameIndex `(Rui)
    if (this.state !== previousState || this.facingDirection !== previousDirection) {
        this.frameIndex = 0;
        this.frameCounter = 0;
    }
  }

  getCurrentAnimation() {
    return this.animations[this.state];
  }

  //Dealing with damage logic
  takeDamage(amount) {
    if (this.invincible || this.lives <= 0) return;

    this.lives -= amount;
    this.lives = max(0, this.lives);
    this.invincible = true;
    this.invincibleTimer = 2;
    damageFlashAlpha = 150;
    //console.log(`Player took damage! Lives left: ${this.lives}`);

    //Play injury sound effects zkx~~~~~~~~~
    if (aaaSound) {
      aaaSound.play();
    }

    if (this.lives <= 0) {
      this.die();
    }
  }

  //Player death 
  die() {
    //console.log("Player has died!");
    if (typeof resetGame === "function") {
      resetGame();
    } else {
      console.error("No resetGame() function found!");
    }
    if (gameOverSound) {
      gameOverSound.play();
    }

  }

  update() {
    if (this.damageCooldown > 0) this.damageCooldown -= deltaTime / 1000;
    
    //invulnerable
    if (this.invincibleTimer > 0) {
        this.invincible = true;
        this.invincibleTimer -= deltaTime / 1000;
    } else {
        this.invincible = false;
    }
    if (mode === "invincible") {
        this.invincible = true;
    }

    if (this.messageTimer > 0) { 
      this.messageTimer--;
    } else {
        this.itemPickupMessage = "";
    }
  
    //Determine the movement method based on the weather
    if (weatherState === "snow") {
      //Snow: Inertia
      if (keyIsDown(LEFT_ARROW)||keyIsDown(65))  {
        this.velocity.x -= 0.2;
      }
      else if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)) {
        this.velocity.x += 0.2;
      }
      else {
        this.velocity.x *= 0.95;
      }

      this.velocity.x = constrain(this.velocity.x, -5, 5);

      this.position.x += this.velocity.x;

    } else {
      //On non snowy days, first determine whether it is rainy/thunderstorm, and then proceed with fixed movement
      if (weatherState === "rain" || weatherState === "thunderstorm") {
        this.speed = 2;  //Slow down during rain/thunderstorms
      } else {
        //Sunny/foggy/other=>Restore normal speed
        this.speed = this.baseSpeed;
      }
      let horiz = 0;
      if (keyIsDown(LEFT_ARROW)||keyIsDown(65)) {
        horiz -= this.speed;
      }
      if (keyIsDown(RIGHT_ARROW)||keyIsDown(68)) {
        horiz += this.speed;
      }
      this.position.x += horiz;
    }

    if (this.isDashing) {
      this.dashTimeLeft--;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.dashTimeLeft <= 0) {
          this.isDashing = false;
          this.dashCooldown = 30;
      }
  } else {
        this.handleMovement();
        this.handleCollisions();
    }

    if (this.dashCooldown > 0) {
        this.dashCooldown--;
    }

    this.updateAnimationState();

    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
        let currentAnimation = this.getCurrentAnimation();
        if (currentAnimation.length > 0) {
            this.frameIndex = (this.frameIndex + 1) % currentAnimation.length;
        } else {
            this.frameIndex = 0;
        }
        this.frameCounter = 0;
    }


    if (this.attackCooldown > 0) {
        this.attackCooldown--;
    }
}


  draw() {
    push();
    if (this.messageTimer > 0) {
      push();
      fill(255, 255, 255);
      textSize(14);
      textAlign(CENTER, CENTER);
      text(this.itemPickupMessage, this.position.x + this.width / 2, this.position.y - 20);
      pop();
    }
  
    translate(this.position.x + this.width / 2, this.position.y + this.height / 2);
    if (this.facingDirection === "left") {
        scale(-1, 1);
    }

    let currentFrame = this.getCurrentAnimation()[this.frameIndex];
    image(currentFrame, -this.width / 2, -this.height / 2, this.width, this.height);

    pop();
  }

  collidesWith(obj) {
    return collides(this.position.x, this.position.y, this.width, this.height,
                    obj.position.x, obj.position.y, obj.width, obj.height);
  }
}
