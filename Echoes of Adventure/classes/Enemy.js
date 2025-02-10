// =========================
// 敌人基类
// =========================

class Enemy {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.width = 40;
    this.height = 40;
    this.frozen = false; // 是否被冰冻
  }

  update() {}

  draw() {
    fill(0);
    rect(this.position.x, this.position.y, this.width, this.height);
  }
}

// =========================
// Spider
// =========================

class Spider extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.speed = 2;
    this.direction = 1;
  }

  update() {
    if (!this.frozen) {
      this.position.x += this.speed * this.direction;
      if (this.position.x < 0 || this.position.x > width - this.width) {
        this.direction *= -1;
      }
    }
  }

  draw() {
    if (this.frozen) {
      fill(0, 200, 255);
      rect(this.position.x + 10, this.position.y + 10, 20, 20);
      fill(0);
      rect(this.position.x, this.position.y + 25, 10, 5);
      rect(this.position.x + 30, this.position.y + 25, 10, 5);
    } else {
      fill(0);
      rect(this.position.x + 10, this.position.y + 10, 20, 20);
      fill(50);
      rect(this.position.x, this.position.y + 25, 10, 5);
      rect(this.position.x + 30, this.position.y + 25, 10, 5);
    }
  }
}

// =========================
// Bird
// =========================

class Bird extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.speed = 3;
    this.amplitude = 20;
    this.offset = random(0, TWO_PI);
  }

  update() {
    if (!this.frozen) {
      this.position.x += this.speed;
      this.position.y += sin(frameCount * 0.1 + this.offset) * 2;
      if (this.position.x > width) {
        this.position.x = -this.width;
      }
    }
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);

    if (this.frozen) {
      fill(0, 200, 255);
    } else {
      fill(255, 255, 0);
    }
    rectMode(CENTER);
    rect(0, 0, 10, 10);

    fill(255, 200, 0);
    triangle(-5, 0, -15, -5, -5, -10);
    triangle(5, 0, 15, -5, 5, -10);

    pop();
  }
}

// =========================
// Fish
// =========================

class Fish extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.speed = 1.5;
    this.amplitude = 15;
    this.offset = random(0, TWO_PI);
  }

  update() {
    if (!this.frozen) {
      this.position.y += sin(frameCount * 0.1 + this.offset) * 2;
    }
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);

    if (this.frozen) {
      fill(0, 200, 255);
    } else {
      fill(0, 0, 255);
    }
    rect(0, 0, this.width, this.height / 2);

    fill(0);
    triangle(
      this.width,
      this.height / 8,
      this.width + 10,
      this.height / 4,
      this.width,
      this.height / 2
    );

    pop();
  }
}