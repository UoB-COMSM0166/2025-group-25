// =========================
// 金币类
// =========================

class Coin {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.radius = 10;
    this.collected = false;
    this.width = this.radius * 2;
    this.height = this.radius * 2;
  }

  update() {
    // 在这里可添加一些旋转或闪烁动画
  }

  draw() {
    if (!this.collected) {
      fill(255, 215, 0);
      rect(this.position.x - 5, this.position.y - 5, 10, 10);
    }
  }

  collect() {
    this.collected = true;
  }
}