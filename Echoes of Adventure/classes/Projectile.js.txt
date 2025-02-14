// =========================
// 投射物类
// =========================

// FlameProjectile
class FlameProjectile {
  constructor(x, y, direction) {
    this.position = createVector(x, y);
    this.velocity = createVector(direction === "right" ? 10 : -10, 0); // 根据方向调整
    this.lifetime = 60;
  }

  update() {
    this.position.add(this.velocity);
    this.lifetime--;
  }

  draw() {
    push();
    noStroke();
    let alpha = map(this.lifetime, 0, 60, 0, 255);
    fill(255, 50, 0, alpha);
    rect(this.position.x, this.position.y, 16, 6);
    pop();
  }

  isExpired() {
    return this.lifetime <= 0 || this.position.x > level.portalPosition.x + 500 || this.position.x < 0;
  }
}


// FreezeProjectile
class FreezeProjectile {
  constructor(x, y, direction) { // ✅ 传入方向
    this.position = createVector(x, y);
    this.velocity = createVector(direction === "right" ? 10 : -10, 0); // ✅ 方向控制
    this.lifetime = 60;
  }

  update() {
    this.position.add(this.velocity);
    this.lifetime--;
  }

  draw() {
    push();
    noStroke();
    let alpha = map(this.lifetime, 0, 60, 0, 255);
    fill(0, 200, 255, alpha);
    rect(this.position.x, this.position.y, 16, 10);
    pop();
  }

  isExpired() {
    return this.lifetime <= 0 || this.position.x > level.portalPosition.x + 500 || this.position.x < 0; // ✅ 左右都判断
  }
}


// =========================
// ThunderProjectile (雷电投射物)
// =========================
class ThunderProjectile {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0); // 雷电不会移动
    this.timer = 40;  // 持续时间（影响动画）
    this.exploded = false;
    this.explosionRadius = 125; // **雷电的AOE半径**
  }
/*
  update() {
    if (!this.exploded) {
      this.timer--;
      if (this.timer <= 0) {
        this.exploded = true;
      }
    }
  }
*/
  update() {
    /*
    if (!this.exploded) {
      this.timer--;
      if (this.timer <= 0) {
        this.exploded = true;

        // **触发雷电粒子特效**
        spawnThunderParticles(this.position.x, this.position.y);

        // **检测雷电范围内的敌人**
        for (let i = level.enemies.length - 1; i >= 0; i--) {
          let enemy = level.enemies[i];
          let d = dist(this.position.x, this.position.y, 
                      enemy.position.x + enemy.width / 2, 
                      enemy.position.y + enemy.height / 2);

          if (d < this.explosionRadius) {
            console.log("⚡ Thunder hit enemy! ⚡");
            level.enemies.splice(i, 1); // **删除被雷电打中的敌人**
          }
        }
      }
    }
    */
    if (!this.exploded) {
      // **飞行**
      this.position.add(this.velocity);
      this.timer--;

      // **当计时结束时，触发爆炸**
      if (this.timer <= 0) {
        this.exploded = true;
        spawnThunderParticles(this.position.x, this.position.y); // **粒子特效**
      }
    }

    // **爆炸后伤害敌人**
    if (this.exploded) {
      for (let i = level.enemies.length - 1; i >= 0; i--) {
        let enemy = level.enemies[i];
        let d = dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y);

        if (d < this.explosionRadius) {
          console.log("⚡ Thunder hit enemy! ⚡");
          level.enemies.splice(i, 1); // **移除敌人**
        }
      }
    }
  }

  draw() {
    /*
    push();
    noStroke();
    if (!this.exploded) {
      fill(255, 255, 0, 200); // 黄色闪电
      rect(this.position.x - 5, this.position.y - 40, 10, 40); // 雷电闪烁
      fill(255, 255, 255, 150);
      ellipse(this.position.x, this.position.y, 50, 20); // 雷电中心
    } else {
      fill(100, 100, 255, 150); // 蓝色电流
      ellipse(
        this.position.x,
        this.position.y,
        this.explosionRadius * 2,
        this.explosionRadius * 1.5
      );
    }
    pop();
    */
    if (this.exploded) {
      // **绘制爆炸效果**
      push();
      noStroke();
      fill(255, 255, 0, 180);
      ellipse(this.position.x, this.position.y, this.explosionRadius * 2);
      pop();
    } else {
      // **绘制飞行状态**
      push();
      fill(255, 255, 0);
      ellipse(this.position.x, this.position.y, 20, 20);
      //ellipse(this.position.x, this.position.y, 40, 20);
      pop();
    }
  }

  isExpired() {
    return this.exploded;
  }
}
