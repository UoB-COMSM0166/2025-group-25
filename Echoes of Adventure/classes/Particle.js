// =========================
// 粒子系统相关
// =========================

class Particle {
  constructor(x, y, velocity, col, lifetime) {
    this.position = createVector(x, y);
    this.velocity = velocity;
    this.col = col;
    this.lifetime = lifetime;
    this.maxLifetime = lifetime;
  }

  update() {
    this.position.add(this.velocity);
    this.lifetime--;
  }

  draw() {
    noStroke();
    let a = map(this.lifetime, 0, this.maxLifetime, 0, 255);
    fill(red(this.col), green(this.col), blue(this.col), a);

    // 对于雨滴等粒子，直接减去 cameraX，以便在屏幕坐标绘制
    ellipse(this.position.x - cameraX, this.position.y, 3, 3);
  }

  isDead() {
    return this.lifetime <= 0;
  }
}

// 全局粒子数组（爆炸、火花等）
function updateParticles() {
  for (let i = globalParticles.length - 1; i >= 0; i--) {
    globalParticles[i].update();
    if (globalParticles[i].isDead()) {
      globalParticles.splice(i, 1);
    }
  }
}

function drawParticles() {
  for (let p of globalParticles) {
    p.draw();
  }
}

function spawnExplosion(x, y) {
  for (let i = 0; i < 30; i++) {
    let angle = random(TWO_PI);
    let speed = random(1, 5);
    let vx = cos(angle) * speed;
    let vy = sin(angle) * speed;
    globalParticles.push(
      new Particle(x, y, createVector(vx, vy), color(255, 150, 0), 60)
    );
  }
}