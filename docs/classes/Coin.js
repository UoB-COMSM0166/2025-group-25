class Coin {
  constructor(x, y, level) {
    this.position = createVector(x, y);
    this.collected = false;
    this.width = 50;
    this.height = 50;

    // 关卡对应图片的数组
    const images = [
      'assets/apple.png',   // 第一关
      'assets/banana.png',  // 第二关
      'assets/rabbish.png', // 第三关
      'assets/bottle.png',  // 第四关
      'assets/box.png'      // 第五关
    ];

    // 输出调试日志，检查 level 和 images[level - 1] 是否有效
    console.log('Level:', level);
    if (level === undefined || level < 1 || level > 5) {
      console.error("Invalid level: level is undefined or out of range");
      level = 1; // 默认设置为第一个关卡
    }

    console.log('Image Path:', images[level - 1]); // 输出对应图片的路径

    // 根据关卡选择相应的图片
    this.coinImage = loadImage(images[level - 1]); // 加载对应的图片

    // 控制浮动的幅度和速度
    this.floatSpeed = 0.1;  // 浮动的速度
    this.floatAmplitude = 0.2;  // 浮动的幅度
  }

  update() {
    // 使用 sin 函数来控制上下浮动
    this.position.y += sin(frameCount * this.floatSpeed) * this.floatAmplitude;
  }

  draw() {
    if (!this.collected && this.coinImage) {
      push();
      translate(this.position.x + this.width / 2, this.position.y + this.height / 2); // 移动到中心

      /*// 计算缩放比例，让金币像3D旋转
      let scaleX = abs(sin(radians(this.angle))); // 计算缩放，sin值从0到1变换
      scale(scaleX, 1); // 让金币沿 X 轴缩放*/

      imageMode(CENTER);
      image(this.coinImage, 0, 0, this.width, this.height);

      pop();
    }
  }

  collect() {
    if (!this.collected) {
      this.collected = true;

      console.log("💰 金币被拾取！");
      console.log("🎵 尝试播放音效...");

      if (coinSound) {
        console.log("🔊 coinSound 对象存在");
        if (!coinSound.isPlaying()) {
          coinSound.play();
          console.log("▶️ 音效已播放！");
        } else {
          console.warn("⚠️ 音效已经在播放！");
        }
      } else {
        console.error("❌ coinSound 未定义，无法播放！");
      }
    }
  }
}
