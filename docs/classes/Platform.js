// =========================
// 平台类
// =========================

class Platform {
  constructor(x, y, w, h) {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
  }
/*
  draw() {
    fill(120, 80, 40);
    rect(this.position.x, this.position.y, this.width, this.height, 5);
  }*/
    draw() {
      if (platformImage) {
        image(platformImage, this.position.x, this.position.y, this.width, this.height);
      } else {
        fill(120, 80, 40);
        rect(this.position.x, this.position.y, this.width, this.height, 5);
      }
    }

    // draw() {
    //   if (platformImage) {
    //     // 平铺地面
    //     for (let i = 0; i < this.width; i += 20) {
    //       for (let j = 0; j < this.height; j += 20) {
    //         image(platformImage, this.position.x + i, this.position.y + j, 20, 20);
    //       }
    //     }
    //   } else {
    //     fill(50, 200, 50); // 备用颜色
    //     rect(this.position.x, this.position.y, this.width, this.height, 5);
    //   }
    // }
}


  

