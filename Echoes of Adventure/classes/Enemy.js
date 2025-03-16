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


class Frog extends Enemy {
  constructor(x, y, idleImg, jumpImg, fallImg) {
    super(x, y);
    this.width = 40;
    this.height = 30;
    this.speed = 2; 
    this.jumpForce = -8;  // 跳跃的力度
    this.gravity = 0.5;   // 重力
    this.velocity = createVector(0, 0);
    this.state = "idle";  // 初始状态：idle, jump, fall
    this.idleImg = idleImg;
    this.jumpImg = jumpImg;
    this.fallImg = fallImg;
    this.jumpTimer = 60;  // 控制跳跃间隔

    // **新增：Frog 的活动范围**
    this.startX = x;  // 初始位置
    this.movementRange = 100;  // 允许移动的范围（以初始位置为中心）
    this.facingDirection = "right"; // **默认朝右**
  }

  update() {
    super.update();

    if (!this.frozen) {
      this.jumpTimer--;

      // **如果 jumpTimer 归零，触发跳跃**
      if (this.jumpTimer <= 0) {
        let direction = random() > 0.5 ? 1 : -1; // 50% 概率向左或向右跳

        // **确保跳跃方向不会变成原地跳跃**
        if (direction !== (this.facingDirection === "right" ? 1 : -1)) {
          this.facingDirection = direction === 1 ? "right" : "left"; // **更新朝向**
        }

        let newVelocityX = this.speed * direction;

        let targetX = this.position.x + newVelocityX * 10; // 计算目标 X 位置

        // **确保 Frog 只能在指定范围内跳跃**
        if (targetX >= this.startX - this.movementRange && targetX <= this.startX + this.movementRange) {
          this.velocity.x = newVelocityX;
        } else {
          // **如果跳出范围，反向跳跃**
          this.velocity.x = -newVelocityX;
          this.facingDirection = this.velocity.x > 0 ? "right" : "left";
        }

        this.velocity.y = this.jumpForce; // **向上跳跃**
        this.jumpTimer = 120;  // 重新计时
        this.state = "jump";  // 进入跳跃状态
      }

      // **重力影响**
      this.velocity.y += this.gravity;
      this.position.y += this.velocity.y;

      // **只有在空中时才水平移动**
      if (this.state === "idle") {
        this.velocity.x = 0;
      } else {
        this.position.x += this.velocity.x; // **只有在跳跃期间才移动**
      }

      // **地面或平台检测**
      let onGround = false;
      for (let platform of level.platforms) {
        if (
          this.position.x + this.width > platform.position.x &&
          this.position.x < platform.position.x + platform.width &&
          this.position.y + this.height > platform.position.y &&
          this.position.y < platform.position.y + platform.height
        ) {
          this.position.y = platform.position.y - this.height;
          this.velocity.y = 0;
          this.state = "idle";  // 进入待机状态
          onGround = true;
        }
      }

      for (let ground of level.ground) {
        if (
          this.position.x + this.width > ground.position.x &&
          this.position.x < ground.position.x + ground.width &&
          this.position.y + this.height > ground.position.y &&
          this.position.y < ground.position.y + ground.height
        ) {
          this.position.y = ground.position.y - this.height;
          this.velocity.y = 0;
          this.state = "idle";  // 进入待机状态
          onGround = true;
        }
      }

      if (!onGround) {
        this.state = this.velocity.y < 0 ? "jump" : "fall";
      }
    }
  }


  draw() {
    push();
    translate(this.position.x, this.position.y);

    let currentFrame;
    if (this.state === "idle") {
      currentFrame = this.idleImg;
    } else if (this.state === "jump") {
      currentFrame = this.jumpImg;
    } else {
      currentFrame = this.fallImg;
    }

    // **检查 Frog 朝向，并翻转图像**
    if (this.facingDirection === "left") {
      scale(1, 1);  // **水平翻转**
      image(currentFrame, -this.width, 0, this.width, this.height);
    } else {
      scale(-1, 1)
      image(currentFrame, 0, 0, this.width, this.height);
    }

    pop();
  }
}





// =========================
// Spider
// =========================

class Spider extends Enemy {
  constructor(x, y, spritesheet) {
    super(x, y);
    //this.speed = 2;
    this.speed = 0.5;
    this.direction = -1; // 默认向左走
    this.spritesheet = spritesheet;

    this.width = 120;
    this.height = 80;

    
    this.frames = [];

    this.frameIndex = 0;
    this.frameDelay = 6;
    this.frameCounter = 0;

    // **设置蜘蛛的运动范围 (50 码)**
    this.startX = x; // 记录出生位置
    //this.movementRange = 200;
    this.movementRange = 45; 

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

    //冰冻上色
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
    this.speed = 1.5;
    this.amplitude = 60; // **上下移动的振幅**
    //this.offset = random(0, TWO_PI); // **随机偏移**

    this.startY = y;          // 保存初始的 y 坐标
    this.vDir = 1;            // 垂直运动方向：1 为向下，-1 为向上
    
    //this.height = 48; // **单帧高度**
    this.height = 56;
    this.width = 48;


    this.frames = [];  // **存储所有帧**
    this.frameIndex = 0;
    this.frameDelay = 12;  // **控制动画播放速度**
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
/*
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
  }*/
    update() {
      super.update(); 
      if (!this.frozen) {
        // 直线式垂直移动
        this.position.y += this.speed * this.vDir;
  
        // 当偏离初始位置超过 amplitude 后反转方向
        if (this.position.y > this.startY + this.amplitude || this.position.y < this.startY - this.amplitude) {
          this.vDir *= -1;
        }
  
        // 更新动画帧
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
    if (this.frozen) {
      tint(0, 200, 255);
    }
    /*
    // **修正朝向**
    if (this.direction === 1) {
      scale(-1, 1); // **向右飞时，翻转**
      image(currentFrame, 0, 0, this.width, this.height);
    } else {
      scale(1, 1); // **向左飞时，不翻转**
      image(currentFrame, -this.width, 0, this.width, this.height);
    }*/
      image(currentFrame, -this.width / 2, -this.height / 2, this.width, this.height);

    pop();
  }
}



class Bat extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.startX = x;            // 记录初始 x 坐标
    this.patrolRange = 600;    // 定义巡逻范围
    this.speed = 3;
    this.amplitude = 20;
    this.offset = random(0, TWO_PI);
    this.width = 63;  
    this.height = 93;

    this.frames = batFrames; 
    this.frameIndex = 0;
    this.frameDelay = 6;
    this.frameCounter = 0;
    
    this.direction = 1;         // 初始向右
  }

  update() {
    if (!this.frozen) {
      // 更新位置
      this.position.x += this.speed * this.direction;
      this.position.y += sin(frameCount * 0.1 + this.offset) * 2;

      // 边界判断：确保 Bat 在 [startX, startX + patrolRange] 范围内移动
      if (this.position.x > this.startX + this.patrolRange) {
        this.position.x = this.startX + this.patrolRange;
        this.direction = -1;
      } else if (this.position.x < this.startX) {
        this.position.x = this.startX;
        this.direction = 1;
      }

      // 更新动画帧
      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        this.frameCounter = 0;
      }
    }
  }

  draw() {
    if (this.frames.length === 0) return;

    push();
    translate(this.position.x, this.position.y);

    let currentFrame = this.frames[this.frameIndex];
    if (this.frozen) {
      tint(0, 200, 255);
    }

    if (this.direction === 1) {
      scale(1, 1);
      image(currentFrame, 0, 0, this.width, this.height);
    } else {
      scale(-1, 1);
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