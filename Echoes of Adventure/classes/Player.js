// =========================
// 玩家类
// =========================

class Player {
  constructor(startPos) {
    this.position = startPos.copy();
    this.velocity = createVector(0, 0);
    this.width = 40;
    this.height = 60;
    this.speed = 5;
    this.jumpForce = 15;
    this.lives = 3;
    this.coins = 0;
    this.currentItem = null;
    this.invincible = false;
    this.hasDoubleJump = true;
    this.jumps = 0;
    this.invincibleTimer = 0;
    this.damageCooldown = 0;
  }

  update() {
    // 受伤冷却
    if (this.damageCooldown > 0) {
      this.damageCooldown -= deltaTime / 1000;
    }

    // 无敌计时
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

    // 水平移动
    let horiz = 0;
    if (keyIsDown(LEFT_ARROW)) {
      horiz -= this.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      horiz += this.speed;
    }
    this.position.x += horiz;

    // 限制在关卡范围
    if (level) {
      let levelWidth = level.portalPosition.x + 200;
      this.position.x = constrain(
        this.position.x,
        0,
        levelWidth - this.width
      );
    }

    // 重力
    this.velocity.y += 0.8;
    this.position.y += this.velocity.y;

    // 平台碰撞
    if (level && level.platforms) {
      for (let plat of level.platforms) {
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
          // 简易落地判断
          if (
            this.position.y + this.height - this.velocity.y <=
            plat.position.y + 5
          ) {
            this.position.y = plat.position.y - this.height;
            this.velocity.y = 0;
            this.jumps = 0;
          }
        }
      }
    }

    // 冰冻敌人也可当“平台”
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

  isFalling() {
    return this.velocity.y >= 0;
  }

  jump() {
    let maxJumps = this.hasDoubleJump ? 2 : 1;
    if (this.jumps < maxJumps) {
      this.velocity.y = -this.jumpForce;
      this.jumps++;
    }
  }

  attack() {
    // 根据当前道具发射不同类型的投射物
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
      // 默认近战或空手攻击
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

  takeDamage(amount) {
    if (!this.invincible && this.damageCooldown <= 0) {
      this.lives -= amount;
      this.damageCooldown = 1;
      damageFlashAlpha = 150;

      this.invincible = true;
      setTimeout(() => {
        this.invincible = false;
      }, 1000);
    }
  }

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

    // 如果拿着武器枪剑
    if (
      this.currentItem === "Flame Gun" ||
      this.currentItem === "Freeze Gun" ||
      this.currentItem === "Greatsword"
    ) {
      fill(80);
      rect(this.width, 30, 15, 5, 2);
    }

    pop();

    // 显示无敌护盾
    if (this.invincibleTimer > 0) {
      push();
      noFill();
      stroke(255, 215, 0);
      strokeWeight(4);
      ellipse(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2,
        this.width + 20,
        this.height + 20
      );
      pop();
    }
  }

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