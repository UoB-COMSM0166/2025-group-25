class Ground {
    constructor(x, y, w, h) {
        this.position = createVector(x, y);
        this.width = w;
        this.height = h;
        this.gfx = createGraphics(w, h);
        for (let i = 0; i < w; i += 48) {
          for (let j = 0; j < h; j += 48) {
            this.gfx.image(groundImage, i, j, 48, 48);
          }
        }
    }
    
  /*
    draw() {
        if (groundImage) {
  
            for (let i = 0; i < this.width; i += 48) {
                for (let j = 0; j < this.height; j += 48) {
                    image(groundImage, this.position.x + i, this.position.y + j, 48, 48);
                }
            }
        } else {
            fill(50, 200, 50);
            rect(this.position.x, this.position.y, this.width, this.height);
        }
    }*/
    draw() {
         image(this.gfx, this.position.x, this.position.y);
    }
  
  //collision detection
    collidesWith(player) {
        return collides(player.position.x, player.position.y, player.width, player.height,
                        this.position.x, this.position.y, this.width, this.height);
    }
  }
  