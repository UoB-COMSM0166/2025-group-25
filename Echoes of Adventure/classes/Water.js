class Water {
  constructor(x, y, width, height, waterType = "water") {
    this.position = createVector(x, y);
    this.width = width;
    this.height = height;

    //Select different textures according to the level
    /*
    if (waterType === "lava") {
      this.waterImage = loadImage("assets/magma.png");
    } else {
      this.waterImage = loadImage("assets/Water.png");
    }*/
    this.waterImage = waterType === "lava" ? lavaImg : waterImg;
    this.spriteWidth = 31.75;
    this.frameCount = 4;
    this.frameDelay = 10;
    this.frameTimer = 0;

    //Generate a different starting frame for each water wave
    this.waveSegments = [];
    let numSegments = Math.ceil(this.width / this.spriteWidth); //Calculate how many water waves are needed
    for (let i = 0; i < numSegments; i++) {
      this.waveSegments.push({
        xOffset: i * this.spriteWidth,  //The X offset of each water wave
        currentFrame: i % this.frameCount //Cycle 1234 in sequence
      });
    }
  }

  update() {
    this.frameTimer++;
    if (this.frameTimer >= this.frameDelay) {
      this.frameTimer = 0;
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

