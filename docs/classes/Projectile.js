// =========================
// 投射物类
// =========================

// FlameProjectile
class FlameProjectile {
  constructor(x, y, direction) {
    this.position = createVector(x, y);
    this.velocity = createVector(direction === "right" ? 10 : -10, 0);
    this.lifetime = 60;
  }

  update() {
    this.position.add(this.velocity);
    this.lifetime--;
  }

  draw() {
    push();
    noStroke();
    let alpha = map(this.lifetime, 0, 60, 0, 255);
    fill(255, 50, 0, alpha);
    rect(this.position.x, this.position.y, 16, 6);
    pop();
  }

  isExpired() {
    return this.lifetime <= 0 || this.position.x > level.portalPosition.x + 500 || this.position.x < 0;
  }
}


// FreezeProjectile
class FreezeProjectile {
  constructor(x, y, direction) {
    this.position = createVector(x, y);
    this.velocity = createVector(direction === "right" ? 10 : -10, 0);
    this.lifetime = 60;
  }

  update() {
    this.position.add(this.velocity);
    this.lifetime--;
  }

  draw() {
    push();
    noStroke();
    let alpha = map(this.lifetime, 0, 60, 0, 255);
    fill(0, 200, 255, alpha);
    rect(this.position.x, this.position.y, 16, 10);
    pop();
  }

  isExpired() {
    return this.lifetime <= 0 || this.position.x > level.portalPosition.x + 500 || this.position.x < 0;
  }
}


class ThunderProjectile {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0); 
    this.timer = 40;
    this.exploded = false;
    this.explosionRadius = 125;
  }
/*
  update() {
    if (!this.exploded) {
      this.timer--;
      if (this.timer <= 0) {
        this.exploded = true;
      }
    }
  }
*/
  update() {
    /*
    if (!this.exploded) {
      this.timer--;
      if (this.timer <= 0) {
        this.exploded = true;

        spawnThunderParticles(this.position.x, this.position.y);

        for (let i = level.enemies.length - 1; i >= 0; i--) {
          let enemy = level.enemies[i];
          let d = dist(this.position.x, this.position.y, 
                      enemy.position.x + enemy.width / 2, 
                      enemy.position.y + enemy.height / 2);

          if (d < this.explosionRadius) {
            console.log("Thunder hit enemy!");
            level.enemies.splice(i, 1);
          }
        }
      }
    }
    */
    if (!this.exploded) {
      // **飞行**
      this.position.add(this.velocity);
      this.timer--;

      if (this.timer <= 0) {
        this.exploded = true;
        spawnThunderParticles(this.position.x, this.position.y); 
      }
    }


    if (this.exploded) {
      for (let i = level.enemies.length - 1; i >= 0; i--) {
        let enemy = level.enemies[i];
        let d = dist(this.position.x, this.position.y, enemy.position.x, enemy.position.y);

        if (d < this.explosionRadius) {
          //console.log("Thunder hit enemy! ");
          level.enemies.splice(i, 1);
        }
      }
    }
  }

  draw() {
    /*
    push();
    noStroke();
    if (!this.exploded) {
      fill(255, 255, 0, 200);
      rect(this.position.x - 5, this.position.y - 40, 10, 40);
      fill(255, 255, 255, 150);
      ellipse(this.position.x, this.position.y, 50, 20);
    } else {
      fill(100, 100, 255, 150);
      ellipse(
        this.position.x,
        this.position.y,
        this.explosionRadius * 2,
        this.explosionRadius * 1.5
      );
    }
    pop();
    */
    if (this.exploded) {
      push();
      noStroke();
      fill(255, 255, 0, 180);
      ellipse(this.position.x, this.position.y, this.explosionRadius * 2);
      pop();
    } else {
      push();
      fill(255, 255, 0);
      ellipse(this.position.x, this.position.y, 20, 20);
      //ellipse(this.position.x, this.position.y, 40, 20);
      pop();
    }
  }

  isExpired() {
    return this.exploded;
  }
}
