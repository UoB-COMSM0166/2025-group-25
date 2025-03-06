// =========================
// 🎮 玩家类 (最终优化版)
// =========================

class Player {
  constructor(startPos) {
    this.position = startPos.copy();
    this.velocity = createVector(0, 0);
    this.width = 60;
    this.height = 60;
    this.baseSpeed = 5;   
    this.speed = 5;
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
    if (keyIsDown(LEFT_ARROW)) {
      horiz -= this.speed;
      this.facingDirection = "left";
    }
    if (keyIsDown(RIGHT_ARROW)) {
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
  }

  /** 🎮 处理跳跃 (在 `keyPressed()` 里调用) */
  jump() {
    if (this.isJumpKeyReleased && this.jumps < (this.hasDoubleJump ? 2 : 1)) {
      this.velocity.y = -this.jumpForce;
      this.jumps++;
      this.isJumpKeyReleased = true; // **允许重复跳跃**
    }
  }

  /** 🚀 处理冲刺 */
  dash() {
    if (!this.hasDash || this.isDashing || this.dashCooldown > 0) return;

    this.isDashing = true;
    this.dashTimeLeft = this.dashDuration;
    this.dashCooldown = 60; 

    // **计算冲刺方向**
    let dashAngle;
    if (keyIsDown(UP_ARROW)) { 
      dashAngle = this.facingDirection === "right" ? -PI / 3 : -2 * PI / 3; 
    } else {
      dashAngle = this.facingDirection === "right" ? -PI / 6 : -5 * PI / 6; 
    }

    this.velocity.x = this.dashSpeed * cos(dashAngle);
    this.velocity.y = this.dashSpeed * sin(dashAngle);
  }
  /*
  teleport() {
    if (this.currentItem === "Teleport Scroll") {
      let newX = this.position.x + 200;
      
      // **检查新位置是否安全**
      if (this.isSafePosition(newX, this.position.y)) {
        this.position.x = newX;
        console.log("✨ Teleported to safe position:", this.position);
      } else {
        console.log("⚠️ Unsafe teleport, canceled.");
      }

      this.currentItem = null;  // **使用后消耗**
    }
   
  }
*/
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

    if (safe) {
      console.log(`🔹 传送前位置: ${this.position.x}`);
      this.position.x = newX;
      console.log(`✅ 传送后位置: ${this.position.x}`);
      this.hasTeleport = false;
      player.currentItem = "NONE"; // **用完后清空 ITEM**
    } else {
      console.log("❌ 传送失败，目标点有敌人！");
    }
  }


  /** 检查目标位置是否安全 */
  isSafePosition(x, y) {
    for (let plat of level.platforms) {
      if (
        x + this.width > plat.position.x &&
        x < plat.position.x + plat.width &&
        y + this.height > plat.position.y &&
        y < plat.position.y + plat.height
      ) {
        return true;  // **安全：有平台可站立**
      }
    }
    return false;  // **危险：无支撑点，可能掉下去**
  }


   /** 🎮 普通攻击 */
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
  
    let attackX = this.facingDirection === "right"
      ? this.position.x + this.width
      : this.position.x - 20;
    let attackY = this.position.y + this.height / 2;
  
    // **远程攻击逻辑**
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
      // **默认近战攻击**
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
      }
    }
  }

  


  /** 🎮 监听键盘按下 */
  keyPressed() {
    if (key === " ") {
      this.jump();
    }
    if (key === "Z" || key === "z") {
      this.attack();
    }
    if (key === "X" || key === "x") this.dash();
    
    /*if (key === "T" || key === "t") {
      player.teleport();
    }*/
    if (this.hasTeleport && (key === "T" || key === "t")) {
      this.teleport();
    }
    
  }

  /** 🎮 监听键盘释放 */
  /*
  keyReleased() {
    if (key === " ") {
      this.isJumpKeyReleased = true; // **松开空格后，允许再次跳跃**
    }
  }
*/
  /** ⚡ 处理碰撞检测 */
  handleCollisions() {
    if (!level) return;
    let { ground, platforms, enemies } = level;

    for (let plat of platforms) {
      if (this.velocity.y >= 0 && collides(this.position.x, this.position.y, this.width, this.height,
                                           plat.position.x, plat.position.y, plat.width, plat.height)) {
        if (this.position.y + this.height - this.velocity.y <= plat.position.y + 5) {
          this.position.y = plat.position.y - this.height;
          this.velocity.y = 0;
          this.jumps = 0;
          this.isJumpKeyReleased = true;
        }
      }
    }

    // **处理地面碰撞**
    if (ground) {
      if (this.velocity.y >= 0 && collides(this.position.x, this.position.y, this.width, this.height,
                                          ground.position.x, ground.position.y, ground.width, ground.height)) {
          if (this.position.y + this.height - this.velocity.y <= ground.position.y + 5) {
              this.position.y = ground.position.y - this.height;
              this.velocity.y = 0;
              this.jumps = 0;
              this.isJumpKeyReleased = true;
              this.isOnGround = true;
          }
      }
    }


    for (let enemy of enemies) {
      if (!this.invincible && collides(this.position.x, this.position.y, this.width, this.height,
                                       enemy.position.x, enemy.position.y, enemy.width, enemy.height)) {
        this.takeDamage(1);
      }
    }
  }

  /** 🎥 计算当前动画状态并重置 `frameIndex` */
  updateAnimationState() {
    let previousState = this.state; // 记录之前的状态
    let previousDirection = this.facingDirection; // 记录之前的方向

    if (this.velocity.y < 0) {
      this.state = "jump";  // **跳跃状态**
    } else if (this.isDashing) {
      this.state = "dash";  // **冲刺状态**
    } else if (keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW)) {
      this.state = "run";  // **跑步状态**
    }else if (this.isAttacking) {// **攻击状态**
      this.state = "attack"; 
    }else {
      this.state = "idle"; // **静止状态**
    }

    // **如果状态或方向发生变化，重置 `frameIndex`**
    if (this.state !== previousState || this.facingDirection !== previousDirection) {
        this.frameIndex = 0;
        this.frameCounter = 0;
    }
  }

  /** 🎥 获取当前动画帧 */
  getCurrentAnimation() {
    return this.animations[this.state];
  }

  /** 🛡️ 处理伤害 */
  takeDamage(amount) {
    if (this.invincible || this.lives <= 0) return;

    this.lives -= amount;
    this.lives = max(0, this.lives);
    this.invincible = true;
    this.invincibleTimer = 2; // 2秒无敌
    damageFlashAlpha = 150;
    console.log(`Player took damage! Lives left: ${this.lives}`);

    if (this.lives <= 0) {
      this.die();
    }
  }

  /** 🎮 玩家死亡 */
  die() {
    console.log("Player has died!");
    if (typeof resetGame === "function") {
      resetGame();
    } else {
      console.error("No resetGame() function found!");
    }
  }

  update() {
    // **受伤冷却**
    if (this.damageCooldown > 0) this.damageCooldown -= deltaTime / 1000;
    
    // **无敌状态**
    if (this.invincibleTimer > 0) {
        this.invincible = true;
        this.invincibleTimer -= deltaTime / 1000;
    } else {
        this.invincible = false;
    }
    if (mode === "invincible") {
        this.invincible = true;
    }

    // --------------------------------
    // 2) 根据天气决定移动方式
    // --------------------------------
    // 如果是雪天 -> 惯性移动，否则 -> 普通移动
    if (weatherState === "snow") {
      // 雪地：有惯性
      // a) 先根据按键给 velocity.x 加速度
      if (keyIsDown(LEFT_ARROW)) {
        this.velocity.x -= 0.2; // 向左加速度，可微调
      }
      else if (keyIsDown(RIGHT_ARROW)) {
        this.velocity.x += 0.2; // 向右加速度，可微调
      }
      else {
        // 如果没按左右键，则逐渐减速
        this.velocity.x *= 0.95; // 减速系数可调
      }

      // b) 限制最大速度（左右）
      this.velocity.x = constrain(this.velocity.x, -5, 5);

      // c) 将位置加上 velocity.x
      this.position.x += this.velocity.x;

    } else {
      // 非雪天，先判断是否为雨天 / 雷暴，再给固定移动
      if (weatherState === "rain" || weatherState === "thunderstorm") {
        this.speed = 3;  // 下雨 / 雷暴时速度变慢
      } else {
        // 晴天 / 大雾 / 其它 => 恢复正常速度
        this.speed = this.baseSpeed;
      }

      // 按键左右移动
      let horiz = 0;
      if (keyIsDown(LEFT_ARROW)) {
        horiz -= this.speed;
      }
      if (keyIsDown(RIGHT_ARROW)) {
        horiz += this.speed;
      }
      this.position.x += horiz;
    }

    // **Dash 冲刺逻辑**
    if (this.isDashing) {
      this.dashTimeLeft--;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      if (this.dashTimeLeft <= 0) {
          this.isDashing = false;
          this.dashCooldown = 30;
      }
  } else {
        // **普通移动和碰撞**
        this.handleMovement();
        this.handleCollisions();
    }

    // **Dash 冷却**
    if (this.dashCooldown > 0) {
        this.dashCooldown--;
    }

    // **更新动画**
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

    // **攻击冷却**
    if (this.attackCooldown > 0) {
        this.attackCooldown--;
    }
}


  draw() {
    push();
    translate(this.position.x + this.width / 2, this.position.y + this.height / 2);

    // **如果面朝左，翻转图像**
    if (this.facingDirection === "left") {
        scale(-1, 1);
    }

    let currentFrame = this.getCurrentAnimation()[this.frameIndex];
    image(currentFrame, -this.width / 2, -this.height / 2, this.width, this.height);

    pop();
  }



  /** 🎯 碰撞检测 */
  collidesWith(obj) {
    return collides(this.position.x, this.position.y, this.width, this.height,
                    obj.position.x, obj.position.y, obj.width, obj.height);
  }
}
