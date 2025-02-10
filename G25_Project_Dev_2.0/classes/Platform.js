// =========================
// 平台类
// =========================

class Platform {
  constructor(x, y, w, h) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
  }

  draw() {
    fill(120, 80, 40);
    rect(this.position.x, this.position.y, this.width, this.height, 5);
  }
}