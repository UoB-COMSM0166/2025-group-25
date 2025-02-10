// =========================
// 投射物类
// =========================

// FlameProjectile
class FlameProjectile {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(10, 0);
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

    // 根据关卡 element 变色
    let col;
    if (level.element === "fire") {
      col = color(255, 50, 0);
    } else if (level.element === "ice") {
      col = color(0, 150, 255);
    } else if (level.element === "wind") {
      col = color(0, 255, 0);
    } else if (level.element === "earth") {
      col = color(150, 75, 0);
    } else {
      col = color(255, 150, 0);
    }

    fill(red(col), green(col), blue(col), alpha);
    rect(this.position.x, this.position.y, 16, 6);
    pop();
  }

  isExpired() {
    // 超过范围或时间
    return this.lifetime <= 0 || this.position.x > level.portalPosition.x + 500;
  }
}

// FreezeProjectile
class FreezeProjectile {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(10, 0);
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
    rect(this.position.x, this.position.y, 16, 6);
    pop();
  }

  isExpired() {
    return this.lifetime <= 0 || this.position.x > level.portalPosition.x + 500;
  }
}

// BombProjectile
class BombProjectile {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(5, 0);
    this.timer = 90;
    this.exploded = false;
    this.explosionRadius = 80;
  }

  update() {
    if (!this.exploded) {
      this.position.add(this.velocity);
      this.timer--;
      if (this.timer <= 0) {
        this.exploded = true;
      }
    }
  }

  draw() {
    push();
    noStroke();
    if (!this.exploded) {
      fill(150);
      rect(this.position.x, this.position.y, 16, 16);
    } else {
      fill(255, 0, 0, 150);
      ellipse(
        this.position.x,
        this.position.y,
        this.explosionRadius * 2,
        this.explosionRadius * 2
      );
    }
    pop();
  }

  isExpired() {
    // 爆炸完成后即移除
    return this.exploded;
  }
}
