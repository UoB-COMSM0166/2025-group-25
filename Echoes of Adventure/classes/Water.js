class Water {
    constructor(x, y, width, height, waterType = "water") { // 传入 waterType
      this.position = createVector(x, y);
      this.width = width;
      this.height = height;
  
      // 选择不同的贴图
      if (waterType === "lava") {
        this.waterImage = loadImage("assets/magma.png");
      } else {
        this.waterImage = loadImage("assets/Water.png");
      }
      this.spriteWidth = 31.75;  // 每个水波的宽度
      this.frameCount = 4;    // 总帧数4
      this.frameDelay = 10;   // 控制动画速度
      this.frameTimer = 0;
  
      // **为每个水波块生成一个不同的起始帧**
      this.waveSegments = [];
      let numSegments = Math.ceil(this.width / this.spriteWidth); // 计算需要多少个水波
      for (let i = 0; i < numSegments; i++) {
        this.waveSegments.push({
          xOffset: i * this.spriteWidth,  // 每个水波块的 X 偏移
          currentFrame: i % this.frameCount // 依次循环 1234
        });
      }
    }
  
    update() {
      this.frameTimer++;
      if (this.frameTimer >= this.frameDelay) {
        this.frameTimer = 0;
  
        // **让每个水波块单独更新帧**
        for (let segment of this.waveSegments) {
          segment.currentFrame = (segment.currentFrame + 1) % this.frameCount;
        }
      }
    }
  
    draw() {
      for (let segment of this.waveSegments) {
        let frameX = segment.currentFrame * this.spriteWidth;
        
        image(
          this.waterImage,
          this.position.x + segment.xOffset,
          this.position.y,
          this.spriteWidth,
          this.height,
          frameX,
          0,
          this.spriteWidth,
          this.waterImage.height
        );
      }
    }
  }
  