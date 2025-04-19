class Particle {

  constructor (x, y, velocity, col, lifetime) {
    this.reset(x, y, velocity, col, lifetime)
  }

  reset (x, y, velocity, col, lifetime) {
    this.position    = createVector(x, y)
    this.velocity    = velocity
    this.col         = col
    this.lifetime    = lifetime
    this.maxLifetime = lifetime
    return this
  }


  static get (x, y, velocity, col, lifetime) {
    if (!Particle.pool) Particle.pool = []
    const p = Particle.pool.pop() || new Particle(x, y, velocity, col, lifetime)
    return p.reset(x, y, velocity, col, lifetime)
  }

  recycle () {
    Particle.pool.push(this)
  }

  // ------------------------------------------------------------

  update () {
    this.position.add(this.velocity)
    this.lifetime--
  }

  draw () {
    noStroke()
    const a = map(this.lifetime, 0, this.maxLifetime, 0, 255)
    fill(red(this.col), green(this.col), blue(this.col), a)
    ellipse(this.position.x - cameraX, this.position.y, 3, 3)
  }

  isDead () {
    return this.lifetime <= 0
  }
}


function updateParticles () {
  const margin = 150

  for (let i = globalParticles.length - 1; i >= 0; i--) {
    const p = globalParticles[i]
    p.update()

    const offScreen = p.position.x < cameraX - margin ||
                      p.position.x > cameraX + width + margin

    if (p.isDead() || offScreen) {
      p.recycle()
      globalParticles.splice(i, 1)
    }
  }
}

function drawParticles () {
  for (const p of globalParticles) p.draw()
}


function spawnExplosion (x, y) {
  for (let i = 0; i < 30; i++) {
    const ang   = random(TWO_PI)
    const speed = random(1, 5)
    const vx = cos(ang) * speed
    const vy = sin(ang) * speed
    globalParticles.push(
      Particle.get(x, y, createVector(vx, vy), color(255, 150, 0), 60)
    )
  }
}

function spawnThunderParticles (x, y) {
  for (let i = 0; i < 60; i++) {
    const ang   = random(TWO_PI)
    const speed = random(2, 8)
    const vx = cos(ang) * speed
    const vy = sin(ang) * speed
    const thunderColor = color(random(180, 255), random(180, 255), 255)
    globalParticles.push(
      Particle.get(x, y, createVector(vx, vy), thunderColor, random(30, 50))
    )
  }
}

