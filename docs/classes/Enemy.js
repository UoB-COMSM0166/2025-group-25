// =========================
// 敌人基类
// =========================

class Enemy {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.width = 0;
    this.height = 0;
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
  constructor(x, y, spritesheet) {
    super(x, y);
    this.speed = 2;
    this.direction = -1; // 默认向左走
    this.spritesheet = spritesheet;

    this.width = 120;
    this.height = 80;

    this.frames = [];
    this.frameIndex = 0;
    this.frameDelay = 6;
    this.frameCounter = 0;

    // **设置蜘蛛的运动范围 (200 码)**
    this.startX = x; // 记录出生位置
    this.movementRange = 200; // 蜘蛛最多移动 200 码

    this.extractFrames();
  }

  extractFrames() {
    if (!this.spritesheet) {
      console.error("Spritesheet not loaded!");
      return;
    }

    let frameWidth = 64;
    let frameHeight = 32;
    let cols = 3;

    for (let x = 0; x < cols; x++) {
      let frame = this.spritesheet.get(x * frameWidth, 0, frameWidth, frameHeight);
      this.frames.push(frame);
    }
  }

  update() {
    if (!this.frozen) {
      this.position.x += this.speed * this.direction;

      // **限制蜘蛛在出生点 ±100 码范围内移动**
      if (this.position.x < this.startX - this.movementRange / 2 ||
          this.position.x > this.startX + this.movementRange / 2) {
        this.direction *= -1; // 反向移动
      }

      // **更新动画**
      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        this.frameCounter = 0;
      }
    }
  }

  draw() {
    if (this.frames.length === 0) {
      console.error("No frames available for animation!");
      return;
    }

    push();
    translate(this.position.x, this.position.y);

    let currentFrame = this.frames[this.frameIndex];

    if (this.frozen) {
      tint(0, 200, 255);
    }

    if (this.direction === 1) {
      scale(-1, 1);
      image(currentFrame, -this.width, 0, this.width, this.height);
    } else {
      image(currentFrame, 0, 0, this.width, this.height);
    }

    pop();
  }
}




// =========================
// Bird
// =========================

class Bird extends Enemy {
  constructor(x, y, spritesheet) {
    super(x, y);
    this.spritesheet = spritesheet;
    this.speed = 3;
    this.amplitude = 20; // **上下移动的振幅**
    this.offset = random(0, TWO_PI); // **随机偏移**
    
    this.width = 48;  // **单帧宽度**
    this.height = 48; // **单帧高度**

    this.frames = [];  // **存储所有帧**
    this.frameIndex = 0;
    this.frameDelay = 6;  // **控制动画播放速度**
    this.frameCounter = 0;
    
    this.direction = 1; // **默认向右飞**

    this.extractFrames();
  }

  // **从精灵表中裁剪出动画帧**
  extractFrames() {
    if (!this.spritesheet) {
      console.error(" Bird spritesheet not loaded!");
      return;
    }

    let cols = 3; // **3 帧动画**
    for (let i = 0; i < cols; i++) {
      let frame = this.spritesheet.get(i * this.width, 0, this.width, this.height);
      this.frames.push(frame);
    }
  }

  update() {
    if (!this.frozen) {
      // **让鸟左右飞行**
      this.position.x += this.speed * this.direction;

      // **让鸟上下摆动**
      this.position.y += sin(frameCount * 0.1 + this.offset) * 2;

      // **边界检测：反转方向**
      if (this.position.x > width) {
        this.position.x = -this.width;
      }

      // **更新动画帧**
      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        this.frameCounter = 0;
      }
    }
  }

  draw() {
    if (this.frames.length === 0) {
      console.error(" No frames available for Bird animation!");
      return;
    }

    push();
    translate(this.position.x, this.position.y);

    let currentFrame = this.frames[this.frameIndex];

    // **修正朝向**
    if (this.direction === 1) {
      scale(-1, 1); // **向右飞时，翻转**
      image(currentFrame, 0, 0, this.width, this.height);
    } else {
      scale(1, 1); // **向左飞时，不翻转**
      image(currentFrame, -this.width, 0, this.width, this.height);
    }

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