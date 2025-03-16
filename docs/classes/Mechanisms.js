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
      /*
      this.position.x += this.direction * 1.5;
      if (this.position.x < 600 || this.position.x > 700) {
        this.direction *= -1;
      }*/
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
    } else if (this.type === "Flame") {//火焰
      fill(255, 100, 0);
      rect(-this.width / 2, -this.height / 2, this.width, this.height, 2);
      stroke(255, 150, 0);
      for (let i = -this.width / 2; i < this.width / 2; i += 5) {
        line(i, -this.height / 2, i + 2.5, -this.height / 2 - 5);
      }
    } else if (this.type === "Spiked Wall") {//尖刺
      imageMode(CENTER);
      image(spikedWallImg, 0, 0, this.width, this.height); 
      
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
    this.width = 96;
    this.height = 128;
  }

  update() {
    this.angle += this.swingDirection * (PI / 180);
    if (this.angle > PI / 4 || this.angle < -PI / 4) {
      this.swingDirection *= -1;
    }
  }
  /*
  draw() {
    push();
    translate(this.position.x, this.position.y);
    rotate(this.angle);
    fill(150);
    rect(-8, -24, 16, 48);
    pop();
  }*/
    draw() {
      push();
      translate(this.position.x, this.position.y);
      rotate(this.angle); // **让斧头摆动**
      
      // **绘制图片**
      imageMode(CENTER);
      image(axeSprite, 0, 0, this.width, this.height);
  
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
/*
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
}*/
class AdvancedBird {
  constructor(position, range, type) {
    this.position = position.copy();
    this.range = range;
    this.type = type;
    this.state = "fly-left";
    this.timer = 0;
    this.speed = 3;
    this.direction = 1;
    
    // **动画相关**
    this.frameIndex = 0;
    this.frameDelay = 8; // 每6帧切换一次
    this.frameCounter = 0;
    this.frameWidth = 48; // 设定每帧的宽度
    this.frameHeight = 48; // 设定每帧的高度
  }

  update() {
    this.timer += deltaTime / 1000;
    if (this.timer > 2) {
      this.timer = 0;
      this.direction *= -1;
      this.state = this.state === "fly-left" ? "fly-right" : "fly-left";
    }
    this.position.x += this.speed * this.direction;

    // **动画帧更新**
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameIndex = (this.frameIndex + 1) % 3; // 3帧循环
      this.frameCounter = 0;
    }
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    
    // **方向翻转**
    let sx = this.frameIndex * this.frameWidth;
    
    if (this.direction === 1) {
      // **朝右飞 (翻转)**
      push();
      scale(-1, 1); // **向右飞时，翻转**
      image(advancedBirdSpritesheet, -this.frameWidth / 2, -this.frameHeight / 2, 
            this.frameWidth, this.frameHeight, sx, 0, this.frameWidth, this.frameHeight);
      pop();
    } else {
      // **朝左飞 (不翻转)**
      push();
      scale(1, 1); // 只翻转图片，不翻转坐标系统
      image(advancedBirdSpritesheet, -this.frameWidth / 2, -this.frameHeight / 2, 
            -this.frameWidth, this.frameHeight,sx, 0, this.frameWidth, this.frameHeight);
      pop();
    }

    pop();
  }

}

class Ghost {
  constructor(position, range) {
    this.position = position.copy();
    this.range = range;
    this.speed = 2; 
    this.direction = 1; // 1 = 右, -1 = 左
    this.timer = 0;
    
    // 动画参数
    this.state = "appear"; // 初始状态
    this.frameIndex = 0;
    this.frameDelay = 8;
    this.frameCounter = 0;
    this.frameWidth = 44; // 每帧的宽度
    this.frameHeight = 30; // 每帧的高度
  }

  update() {

    // 计时器控制来回移动，每 2 秒换方向
    this.timer += deltaTime / 1000;
    if (this.timer > 2) { // 每 2 秒反转方向
      this.timer = 0;
      this.direction *= -1;
    }
    // 移动逻辑
    this.position.x += this.speed * this.direction;

    // 触碰范围边界时反向
    //if (this.position.x > this.range + this.position.x || this.position.x < this.position.x - this.range) {
      //this.direction *= -1;
    //}

    // 切换状态（每 2 秒切换一次）
    if (frameCount % 120 === 0) {
      this.state = this.state === "appear" ? "disappear" : "appear";
    }

    // 更新动画帧
    this.frameCounter++;
    if (this.frameCounter >= this.frameDelay) {
      this.frameIndex = (this.frameIndex + 1) % 4; // 4 帧循环
      this.frameCounter = 0;
    }
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);

    let frames = this.state === "appear" ? ghostAppearFrames : ghostDisappearFrames;
    let img = frames[this.frameIndex];

    let sx = this.frameIndex * this.frameWidth; // 获取当前帧的起始 x 坐标

    if (this.direction === 1) {
      // **向右移动，翻转**
      push();
      scale(-1, 1); // 水平翻转
      image(img, -this.frameWidth / 2, -this.frameHeight / 2, 
            this.frameWidth, this.frameHeight, sx, 0, this.frameWidth, this.frameHeight);
      pop();
    } else {
      // **向左移动，不翻转**
      push();
      image(img, -this.frameWidth / 2, -this.frameHeight / 2, 
            this.frameWidth, this.frameHeight, sx, 0, this.frameWidth, this.frameHeight);
      pop();
    }

    pop();
  }
}

