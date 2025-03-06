class Ground {
  constructor(x, y, w, h) {
      this.position = createVector(x, y);
      this.width = w;
      this.height = h;
  }
  update(){
    // 如果地面有变化（例如移动），在这里处理
  // 暂时没有什么变化可以写在这里~~~~~~

  }

  draw() {
      if (groundImage) {
          // 平铺地面
          for (let i = 0; i < this.width; i += 48) {
              for (let j = 0; j < this.height; j += 48) {
                  image(groundImage, this.position.x + i, this.position.y + j, 48, 48);
              }
          }
      } else {
          fill(50, 200, 50); // 备用颜色
          rect(this.position.x, this.position.y, this.width, this.height);
      }
  }

  /** 🔄 碰撞检测 */
  collidesWith(player) {
      return collides(player.position.x, player.position.y, player.width, player.height,
                      this.position.x, this.position.y, this.width, this.height);
  }
}
