class Coin {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.collected = false;
    this.width = 20; 
    this.height = 20;

    // **旋转相关**
    this.angle = 0; // 角度
  }

  update() {
    // **让金币沿中心对称轴旋转**
    this.angle += 5; // 控制旋转速度
    if (this.angle >= 360) {
      this.angle = 0;
    }
  }

  draw() {
    if (!this.collected && coinImage) {
      push();
      translate(this.position.x + this.width / 2, this.position.y + this.height / 2); // **移动到中心**
      
      // **计算缩放比例，让金币像3D旋转**
      let scaleX = abs(sin(radians(this.angle))); // 计算缩放，sin值从0到1变换
      scale(scaleX, 1); // **让金币沿 X 轴缩放**
      
      imageMode(CENTER);
      image(coinImage, 0, 0, this.width, this.height);
      
      pop();
    }
  }

  collect() {
    this.collected = true;
  }
}
