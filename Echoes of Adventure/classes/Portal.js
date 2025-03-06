// =========================
// 传送门类
// =========================

class Portal {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.width = 50;
    this.height = 80;
  }

  update() {
    // 可以做一些动画
  }

  draw() {
    push();
    let alpha = map(sin(frameCount * 0.1), -1, 1, 150, 255);
    fill(100, 0, 200, alpha);
    rect(this.position.x, this.position.y, this.width, this.height);
    pop();
  }
}