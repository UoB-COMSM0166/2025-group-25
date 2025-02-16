// =========================
// 机关类
// =========================

// 激光障碍
class LaserObstacle {
  constructor(x, y, w, h) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
    this.active = false;
    this.timer = 0;
    this.interval = 100; // 每100帧切换状态
  }

  update() {
    this.timer++;
    if (this.timer > this.interval) {
      this.active = !this.active;
      this.timer = 0;
    }
  }

  draw() {
    if (this.active) {
      fill(255, 0, 0);
      rect(this.position.x, this.position.y, this.width, this.height);
    }
  }
}

// 下落尖刺
class FallingSpike {
  constructor(x, y, w, h) {
    this.initialY = y;
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
    this.active = false;
    this.timer = 0;
    this.interval = 150;
  }

  update() {
    this.timer++;
    if (this.timer > this.interval) {
      this.active = true;
      this.timer = 0;
    }
    if (this.active) {
      this.position.y += 5;
      if (this.position.y > height + 50) {
        this.position.y = this.initialY;
        this.active = false;
      }
    }
  }

  draw() {
    fill(150);
    triangle(
      this.position.x,
      this.position.y,
      this.position.x + this.width / 2,
      this.position.y + this.height,
      this.position.x + this.width,
      this.position.y
    );
  }
}

// 通用障碍 (Flame, Gear, Blade, Spiked Wall 等)
class Obstacle {
  constructor(x, y, w, h, type) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
    this.type = type;
    this.angle = 0;
    this.direction = 1;
  }

  update() {
    if (this.type === "Flame") {
      this.position.y += sin(frameCount * 0.1) * 1.5;
    } else if (this.type === "Gear") {
      this.angle += 0.05;
    } else if (this.type === "Blade") {
      this.angle = sin(frameCount * 0.1) * (PI / 4);
    } else if (this.type === "Spiked Wall") {
      this.position.x += this.direction * 1.5;
      if (this.position.x < 600 || this.position.x > 700) {
        this.direction *= -1;
      }
    }
  }

  draw() {
    push();
    translate(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    );

    if (this.type === "Gear") {
      rotate(this.angle);
      fill(150);
      rect(-10, -10, 20, 20);
      fill(100);
      rect(-20, -4, 8, 8);
      rect(12, -4, 8, 8);
      rect(-4, -20, 8, 8);
      rect(-4, 12, 8, 8);
    } else if (this.type === "Blade") {
      rotate(this.angle);
      fill(100);
      rect(-this.width / 2, -this.height / 2, this.width, this.height, 2);
    } else if (this.type === "Flame") {
      fill(255, 100, 0);
      rect(-this.width / 2, -this.height / 2, this.width, this.height, 2);
      stroke(255, 150, 0);
      for (let i = -this.width / 2; i < this.width / 2; i += 5) {
        line(i, -this.height / 2, i + 2.5, -this.height / 2 - 5);
      }
    } else if (this.type === "Spiked Wall") {
      fill(80);
      rect(-this.width / 2, -this.height / 2, this.width, this.height);
      fill(200, 0, 0);
      for (let i = -this.width / 2; i < this.width / 2; i += 10) {
        triangle(i, -this.height / 2, i + 5, -this.height / 2 - 10, i + 10, -this.height / 2);
      }
    }
    pop();
  }
}

// Axes
class Axes {
  constructor(positions, swingTimes) {
    this.swingTimes = swingTimes;
    this.positions = positions;
    this.axes = [];
    for (let pos of positions) {
      this.axes.push(new Axe(pos, swingTimes[0]));
    }
  }

  update() {
    for (let axe of this.axes) {
      axe.update();
    }
  }

  draw() {
    for (let axe of this.axes) {
      axe.draw();
    }
  }
}

class Axe {
  constructor(position, swingTime) {
    this.position = position.copy();
    this.swingTime = swingTime;
    this.angle = 0;
    this.swingDirection = 1;
  }

  update() {
    this.angle += this.swingDirection * (PI / 180);
    if (this.angle > PI / 4 || this.angle < -PI / 4) {
      this.swingDirection *= -1;
    }
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    fill(150);
    rect(-8, -24, 16, 48);
    pop();
  }
}

// Saws
class Saws {
  constructor(positions, ranges) {
    this.positions = positions;
    this.ranges = ranges;
    this.saws = [];
    for (let pos of positions) {
      this.saws.push(new Saw(pos, ranges[0]));
    }
  }

  update() {
    for (let saw of this.saws) {
      saw.update();
    }
  }

  draw() {
    for (let saw of this.saws) {
      saw.draw();
    }
  }
}

class Saw {
  constructor(position, range) {
    this.position = position.copy();
    this.range = range;
    this.angle = 0;
  }

  update() {
    this.angle += 0.1;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    fill(100);
    rect(-20, -20, 40, 40);
    pop();
  }
}

// AdvancedBirds
class AdvancedBirds {
  constructor(positions, ranges, type) {
    this.positions = positions;
    this.ranges = ranges;
    this.type = type;
    this.birds = [];
    for (let pos of positions) {
      this.birds.push(new AdvancedBird(pos, ranges[0], type));
    }
  }

  update() {
    for (let bird of this.birds) {
      bird.update();
    }
  }

  draw() {
    for (let bird of this.birds) {
      bird.draw();
    }
  }
}

class AdvancedBird {
  constructor(position, range, type) {
    this.position = position.copy();
    this.range = range;
    this.type = type;
    this.state = "fly-left";
    this.timer = 0;
    this.speed = 3;
    this.direction = -1;
  }

  update() {
    this.timer += deltaTime / 1000;
    if (this.timer > 2) {
      this.timer = 0;
      if (this.state === "fly-left") {
        this.state = "fly-right";
        this.direction = 1;
      } else {
        this.state = "fly-left";
        this.direction = -1;
      }
    }
    this.position.x += this.speed * this.direction;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    fill(255, 255, 0);
    rectMode(CENTER);
    rect(0, 0, 10, 10);
    fill(255, 200, 0);
    triangle(-5, 0, -15, -5, -5, -10);
    triangle(5, 0, 15, -5, 5, -10);
    pop();
  }
}