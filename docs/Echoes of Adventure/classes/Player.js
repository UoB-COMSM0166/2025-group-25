// =========================
// 玩家类
// =========================

class Player {
  constructor(startPos) {
    this.position = startPos.copy();
    this.velocity = createVector(0, 0); 
    this.width = 40;
    this.height = 60;

    // 角色基础参数
    this.baseSpeed = 5;   // 正常情况下的移动速度
    this.speed = 5;       // 当前帧实际移动速度
    this.jumpForce = 15;

    this.lives = 3;
    this.coins = 0;
    this.currentItem = null;
    this.invincible = false;

    // 双重跳
    this.hasDoubleJump = true;
    this.jumps = 0;

    // 无敌计时 & 受伤冷却
    this.invincibleTimer = 0;
    this.damageCooldown = 0;
  }

  update() {
    // --------------------------------
    // 1) 伤害冷却 & 无敌判定
    // --------------------------------
    if (this.damageCooldown > 0) {
      this.damageCooldown -= deltaTime / 1000;
    }
    if (this.invincibleTimer > 0) {
      this.invincible = true;
      this.invincibleTimer -= deltaTime / 1000;
    } else {
      this.invincible = false;
    }
    // 如果全局模式是 invincible，则永久无敌
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

    // --------------------------------
    // 3) 限制 x 范围 (在关卡内)
    // --------------------------------
    if (level) {
      let levelWidth = level.portalPosition.x + 200;
      this.position.x = constrain(
        this.position.x,
        0,
        levelWidth - this.width
      );
    }

    // --------------------------------
    // 4) 垂直方向重力 & 碰撞
    // --------------------------------
    this.velocity.y += 0.8;  // 简易重力
    this.position.y += this.velocity.y;

    // 平台碰撞
    if (level && level.platforms) {
      for (let plat of level.platforms) {
        // 只在下落时检测
        if (
          this.velocity.y >= 0 &&
          collides(
            this.position.x,
            this.position.y,
            this.width,
            this.height,
            plat.position.x,
            plat.position.y,
            plat.width,
            plat.height
          )
        ) {
          // 判断是否在平台上方
          if (
            this.position.y + this.height - this.velocity.y <=
            plat.position.y + 5
          ) {
            // 停在平台上
            this.position.y = plat.position.y - this.height;
            this.velocity.y = 0;
            this.jumps = 0; // 重置跳跃次数
          }
        }
      }
    }

    // 如果有被冰冻的敌人，也能踩在上面
    if (level && level.enemies) {
      for (let enemy of level.enemies) {
        if (
          enemy.frozen &&
          this.velocity.y >= 0 &&
          collides(
            this.position.x,
            this.position.y,
            this.width,
            this.height,
            enemy.position.x,
            enemy.position.y,
            enemy.width,
            enemy.height
          )
        ) {
          if (
            this.position.y + this.height - this.velocity.y <=
            enemy.position.y + 5
          ) {
            this.position.y = enemy.position.y - this.height;
            this.velocity.y = 0;
            this.jumps = 0;
          }
        }
      }
    }
  }

  // 判断是否在下落
  isFalling() {
    return this.velocity.y >= 0;
  }

  // 跳跃逻辑：支持双重跳
  jump() {
    let maxJumps = this.hasDoubleJump ? 2 : 1;
    if (this.jumps < maxJumps) {
      this.velocity.y = -this.jumpForce;
      this.jumps++;
    }
  }

  // 攻击：根据当前道具发射子弹 or 近战
  attack() {
    if (this.currentItem === "Flame Gun") {
      let proj = new FlameProjectile(
        this.position.x + this.width,
        this.position.y + this.height / 2
      );
      projectiles.push(proj);

    } else if (this.currentItem === "Freeze Gun") {
      let proj = new FreezeProjectile(
        this.position.x + this.width,
        this.position.y + this.height / 2
      );
      projectiles.push(proj);

    } else if (this.currentItem === "Greatsword") {
      let attackRange = 50;
      for (let i = level.enemies.length - 1; i >= 0; i--) {
        let enemy = level.enemies[i];
        if (
          enemy.position.x > this.position.x &&
          enemy.position.x < this.position.x + attackRange &&
          abs(enemy.position.y - this.position.y) < 50
        ) {
          level.enemies.splice(i, 1);
        }
      }

    } else if (this.currentItem === "Timed Bomb") {
      let bomb = new BombProjectile(
        this.position.x + this.width,
        this.position.y + this.height / 2
      );
      projectiles.push(bomb);

    } else if (this.currentItem === "Invincibility") {
      this.invincibleTimer = 5;

    } else {
      // 空手或默认近战
      let attackRange = 30;
      for (let i = level.enemies.length - 1; i >= 0; i--) {
        let enemy = level.enemies[i];
        if (
          enemy.position.x > this.position.x &&
          enemy.position.x < this.position.x + attackRange &&
          abs(enemy.position.y - this.position.y) < 40
        ) {
          level.enemies.splice(i, 1);
        }
      }
    }
  }

  // 受伤
  takeDamage(amount) {
    if (!this.invincible && this.damageCooldown <= 0) {
      this.lives -= amount;
      this.damageCooldown = 1;
      damageFlashAlpha = 150;

      // 短暂无敌
      this.invincible = true;
      setTimeout(() => {
        this.invincible = false;
      }, 1000);
    }
  }

  // 绘制玩家外形
  draw() {
    push();
    translate(this.position.x, this.position.y);

    // 身体
    fill(200, 0, 0);
    rect(0, 20, this.width, this.height - 20, 10);

    // 头
    fill(255, 220, 177);
    ellipse(this.width / 2, 10, this.width * 0.8, this.width * 0.8);

    // 眼睛
    fill(0);
    ellipse(this.width / 2 - 5, 8, 5, 5);
    ellipse(this.width / 2 + 5, 8, 5, 5);

    // 如果拿着火枪/冰枪/大剑，画一个简单的武器形状
    if (
      this.currentItem === "Flame Gun" ||
      this.currentItem === "Freeze Gun" ||
      this.currentItem === "Greatsword"
    ) {
      fill(80);
      rect(this.width, 30, 15, 5, 2);
    }

    pop();

    // 无敌时的光环效果
    if (this.invincibleTimer > 0) {
      push();
      noFill();
      
      // 画主护盾圈（淡黄色半透明）
      stroke(255, 215, 0, 180); // 金黄色，带透明度
      strokeWeight(4);
      ellipse(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2,
        this.width + 20,
        this.height + 20
      );
    
      // 画外围光晕（更大、更透明）
      stroke(255, 223, 120, 60); // 更亮更透明的金色
      strokeWeight(10);
      ellipse(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2,
        this.width + 35,
        this.height + 35
      );
    
      // 画一个稍暗的内圈，制造光影效果
      stroke(255, 200, 0, 100);
      strokeWeight(2);
      ellipse(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2,
        this.width + 10,
        this.height + 10
      );
    
      pop();
    }
    
  }

  // 碰撞辅助
  collidesWith(obj) {
    return collides(
      this.position.x,
      this.position.y,
      this.width,
      this.height,
      obj.position.x,
      obj.position.y,
      obj.width,
      obj.height
    );
  }
}
