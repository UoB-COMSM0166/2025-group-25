class Coin {
  constructor(x, y, level) {
    this.position = createVector(x, y);
    this.collected = false;
    this.width = 50;
    this.height = 50;

    
    const images = [
      'assets/apple.png',   
      'assets/banana.png', 
      'assets/rabbish.png',
      'assets/bottle.png',
      'assets/box.png'
    ];

    if (level === undefined || level < 1 || level > 5) {
      level = 1;
    }

    //console.log('Image Path:',images[level - 1]);

    //Select the corresponding image based on the level
    this.coinImage = loadImage(images[level - 1]);

    this.floatSpeed = 0.1;
    this.floatAmplitude = 0.2;
  }

  update() {
    this.position.y += sin(frameCount * this.floatSpeed) * this.floatAmplitude;
  }

  draw() {
    if (!this.collected && this.coinImage) {
      push();
      translate(this.position.x + this.width / 2, this.position.y + this.height / 2); 

      /*
      let scaleX = abs(sin(radians(this.angle)));
      scale(scaleX, 1); */

      imageMode(CENTER);
      image(this.coinImage, 0, 0, this.width, this.height);

      pop();
    }
  }

  collect() {
    if (!this.collected) {
      this.collected = true;

      if (coinSound) {
        if (!coinSound.isPlaying()) {
          coinSound.play();
          console.log("The sound effect has been played！");
        } else {
          console.warn("The sound effect is already playing！");
        }
      } else {
        console.error(" coinSound is undefined and cannot be played！");
      }
    }
  }
}
