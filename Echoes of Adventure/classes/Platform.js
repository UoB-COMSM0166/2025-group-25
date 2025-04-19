class Platform {
  // ycl:constructor(x, y, w, h, image) {
  //   this.position = createVector(x, y);
  //   this.width = w;
  //   this.height = h;
  //   this.image = image;
  // }
  constructor(x, y, w, h, imageType = '#') {
    this.position = createVector(x, y);
    this.width = w;
    this.height = h;
    this.imageType = imageType;
  }

/*
  draw() {
    fill(120, 80, 40);
    rect(this.position.x, this.position.y, this.width, this.height, 5);
  }*/

    //ycl:Modify the drawing method of the platform to use the input image object for drawing
    // draw() {
    //   if (this.image) {
    //     image(this.image, this.position.x, this.position.y, this.width, this.height);
    //   } else {
    //     fill(120, 80, 40);
    //     rect(this.position.x, this.position.y, this.width, this.height, 5);
    //   }
    // }
    draw() {
      if (platformImage[this.imageType]) {
        image(platformImage[this.imageType], this.position.x, this.position.y, this.width, this.height);
      } else {
        fill(120, 80, 40);
        rect(this.position.x, this.position.y, this.width, this.height, 5);
      }
    }


    // draw() {
    //   if (platformImage) {
    //
    //     for (let i = 0; i < this.width; i += 20) {
    //       for (let j = 0; j < this.height; j += 20) {
    //         image(platformImage, this.position.x + i, this.position.y + j, 20, 20);
    //       }
    //     }
    //   } else {
    //     fill(50, 200, 50);
    //     rect(this.position.x, this.position.y, this.width, this.height, 5);
    //   }
    // }
}


  

