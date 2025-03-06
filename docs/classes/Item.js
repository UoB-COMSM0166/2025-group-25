// =========================
// 道具类
// =========================

class Item {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.width = 30;
    this.height = 30;
    this.type = type;
    this.collected = false;
  }

  update() {
    // 可做一些漂浮动画等
  }

  draw() {
    if (!this.collected) {
      push();
      translate(this.position.x, this.position.y);
      textSize(12);
      textAlign(CENTER, CENTER);

      if (this.type === "Flame Gun") {
        fill(255, 100, 0);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("FG", this.width / 2, this.height / 2);
      } else if (this.type === "Freeze Gun") {
        fill(0, 150, 255);
        rect(0, 0, this.width, this.height, 5);
        fill(255);
        text("FrG", this.width / 2, this.height / 2);
      } else if (this.type === "Greatsword") {
        fill(150);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("GS", this.width / 2, this.height / 2);
      } else if (this.type === "Invincibility") {
        fill(255, 215, 0);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("INV", this.width / 2, this.height / 2);
      } else if (this.type === "Heart") {
        fill(255, 0, 0);
        ellipse(this.width / 2, this.height / 2, this.width, this.height);
      } else if (this.type === "Timed Bomb") {
        fill(50);
        rect(0, 0, this.width, this.height, 5);
        fill(255);
        text("Bomb", this.width / 2, this.height / 2);
      } else if (this.type === "Mystery Box") {
        fill(100, 0, 200);
        rect(0, 0, this.width, this.height, 5);
        fill(255);
        text("Box", this.width / 2, this.height / 2);
      } else if (this.type === "Double Jump") {
        fill(0, 255, 0);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("2J", this.width / 2, this.height / 2);
      }

      pop();
    }
  }

  collect() {
    this.collected = true;
    // 如果是Mystery Box，会在Level类里额外逻辑处理
  }
}