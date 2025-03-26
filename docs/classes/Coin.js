// **加载音效**
class Coin {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.collected = false;
    this.width = 20; 
    this.height = 20;

    // **旋转**
    this.angle = 0; // 角度
  }

  update() {
    // **让金币沿中心对称旋转**
    this.angle += 5; // 旋转速度
    if (this.angle >= 360) {
      this.angle = 0;
    }
  }

  draw() {
    if (!this.collected && coinImage) {
      push();
      translate(this.position.x + this.width / 2, this.position.y + this.height / 2); // **移到中心**
      
      // **计算缩放比例**
      let scaleX = abs(sin(radians(this.angle))); // 计算缩放，sin值从0到1
      scale(scaleX, 1); // **沿 X 轴缩放**
      
      imageMode(CENTER);
      image(coinImage, 0, 0, this.width, this.height);
      
      pop();
    }
  }

  collect() {
    if (!this.collected) {
      this.collected = true;
      
      if (coinSound) {
        console.log("coinSound 对象存在");
        if (!coinSound.isPlaying()) {
          coinSound.play();
          console.log("音效已播放！");//zkx~~~~~
        } else {
          console.warn("音效已经在播放！");
        }
      } else {
        console.error("coinSound 未定义，无法播放！");
      }
    }
  }
}
