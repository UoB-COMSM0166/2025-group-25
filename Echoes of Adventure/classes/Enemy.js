//Enemy base class: Provides basic position and size properties, from which all other specific types of enemies inherit
class Enemy {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.width = 0;
    this.height = 0;
    this.frozen = false;
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
    this.jumpForce = -8; 
    this.gravity = 0.5;
    this.velocity = createVector(0, 0);
    this.state = "idle";
    this.idleImg = idleImg;
    this.jumpImg = jumpImg;
    this.fallImg = fallImg;
    this.jumpTimer = 60;
    this.startX = x;  
    this.movementRange = 100;  
    this.facingDirection = "right"; 
  }

  update() {
    super.update();
    //If it freezes, it won't move
    if (!this.frozen) {
      this.jumpTimer--;
      if (this.jumpTimer <= 0) {
        //The probability of randomly jumping half and a half on each side
        let direction = random() > 0.5 ? 1 : -1; //Make the frog jump left or right with a 50% chance

        //Ensure that the frog does not turn into a stationary jump when turning and jumping
        if (direction !== (this.facingDirection === "right" ? 1 : -1)) {
          this.facingDirection = direction === 1 ? "right" : "left";
        }

        let newVelocityX = this.speed * direction;

        let targetX = this.position.x + newVelocityX * 10;

        //Allow frogs to only jump within a certain range
        if (targetX >= this.startX - this.movementRange && targetX <= this.startX + this.movementRange) {
          this.velocity.x = newVelocityX;
        } 
        else {//Jump in the opposite direction beyond the range
          this.velocity.x = -newVelocityX;
          this.facingDirection = this.velocity.x > 0 ? "right" : "left";
        }

        this.velocity.y = this.jumpForce;
        this.jumpTimer = 120;
        this.state = "jump";
      }

      
      this.velocity.y += this.gravity;
      this.position.y += this.velocity.y;

      //Make the frog move horizontally only when in the air, which is more in line with the actual frog movement
      if (this.state === "idle") {
        this.velocity.x = 0;
      } else {
        this.position.x += this.velocity.x; //
      }

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
          this.state = "idle";  
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
          this.state = "idle";
          onGround = true;
        }
      }
      //If not on the ground, determine whether to ascend or descend based on the vertical velocity
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
    //Flip the texture of the frog based on its orientation
    if (this.facingDirection === "left") {
      scale(1, 1);
      image(currentFrame, -this.width, 0, this.width, this.height);
    } else {
      scale(-1, 1)
      image(currentFrame, 0, 0, this.width, this.height);
    }

    pop();
  }
}




class Spider extends Enemy {
  constructor(x, y, spritesheet) {
    super(x, y);
    this.speed = 0.5;
    this.direction = -1;
    this.spritesheet = spritesheet;
    this.width = 120;
    this.height = 80;
    this.frames = [];
    this.frameIndex = 0;
    this.frameDelay = 6;
    this.frameCounter = 0;
    this.startX = x; 
    //this.movementRange = 200;
    this.movementRange = 45;//The range of motion of spiders 

    this.extractFrames();
  }

  extractFrames() {
    if (!this.spritesheet) {
      //console.error("Spritesheet not loaded!");
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

      //Allow spiders to only move within ± 100 yards of their birth point
      if (this.position.x < this.startX - this.movementRange / 2 ||
          this.position.x > this.startX + this.movementRange / 2) {
        this.direction *= -1;
      }


      this.frameCounter++;
      if (this.frameCounter >= this.frameDelay) {
        this.frameIndex = (this.frameIndex + 1) % this.frames.length;
        this.frameCounter = 0;
      }
    }
  }

  draw() {
    if (this.frames.length === 0) {
      //console.error("No frames available for animation!");
      return;
    }

    push();
    translate(this.position.x, this.position.y);

    let currentFrame = this.frames[this.frameIndex];

    //After being frozen, it turns blue
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





class Bird extends Enemy {
  constructor(x, y, spritesheet) {
    super(x, y);
    this.spritesheet = spritesheet;
    this.speed = 1.5;
    this.amplitude = 60;
    //this.offset = random(0, TWO_PI); 

    this.startY = y;
    this.vDir = 1;
    
    //this.height = 48;
    this.height = 56;
    this.width = 48;


    this.frames = [];
    this.frameIndex = 0;
    this.frameDelay = 12;
    this.frameCounter = 0;
    
    this.direction = 1;

    this.extractFrames();
  }


  extractFrames() {
    if (!this.spritesheet) {
      //console.error(" Bird spritesheet not loaded!");
      return;
    }

    let cols = 3;
    for (let i = 0; i < cols; i++) {
      let frame = this.spritesheet.get(i * this.width, 0, this.width, this.height);
      this.frames.push(frame);
    }
  }
/*
  update() {
    if (!this.frozen) {
      this.position.x += this.speed * this.direction;
      this.position.y += sin(frameCount * 0.1 + this.offset) * 2;

      if (this.position.x > width) {
        this.position.x = -this.width;
      }

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
        //Make the bird move vertically in a straight line
        this.position.y += this.speed * this.vDir;
  
        if (this.position.y > this.startY + this.amplitude || this.position.y < this.startY - this.amplitude) {
          this.vDir *= -1;//When birds deviate from their initial position beyond amplitude, they reverse direction
        }

        this.frameCounter++;
        if (this.frameCounter >= this.frameDelay) {
          this.frameIndex = (this.frameIndex + 1) % this.frames.length;
          this.frameCounter = 0;
        }
      }
    }

  draw() {
    if (this.frames.length === 0) {
      //console.error(" No frames available for Bird animation!");
      return;
    }

    push();
    translate(this.position.x, this.position.y);

    let currentFrame = this.frames[this.frameIndex];
    if (this.frozen) {
      tint(0, 200, 255);
    }
    /*
    if (this.direction === 1) {
      scale(-1, 1);
      image(currentFrame, 0, 0, this.width, this.height);
    } else {
      scale(1, 1);
      image(currentFrame, -this.width, 0, this.width, this.height);
    }*/
      image(currentFrame, -this.width / 2, -this.height / 2, this.width, this.height);

    pop();
  }
}



class Bat extends Enemy {
  constructor(x, y) {
    super(x, y);
    this.startX = x;
    this.patrolRange = 600;
    this.speed = 3;
    this.amplitude = 20;
    this.offset = random(0, TWO_PI);
    this.width = 63;  
    this.height = 93;

    this.frames = batFrames; 
    this.frameIndex = 0;
    this.frameDelay = 6;
    this.frameCounter = 0;
    
    this.direction = 1;
  }

  update() {
    if (!this.frozen) {
      this.position.x += this.speed * this.direction;
      this.position.y += sin(frameCount * 0.1 + this.offset) * 2;

      //Ensure that Bat moves within the range of [startX, startX+patrolRange]
      if (this.position.x > this.startX + this.patrolRange) {
        this.position.x = this.startX + this.patrolRange;
        this.direction = -1;
      } else if (this.position.x < this.startX) {
        this.position.x = this.startX;
        this.direction = 1;
      }

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


/*

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
}*/