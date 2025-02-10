// =========================
// 天气 & 昼夜系统
// =========================

function updateWeather() {
  // 昼夜变化：timeOfDay 每秒增加 0.01（可调），0~24循环
  timeOfDay += 0.01;
  if (timeOfDay >= 24) timeOfDay = 0;

  // 每20秒随机切换天气状态
  weatherTimer += deltaTime / 1000;
  if (weatherTimer > 20) {
    let r = random(1);
    if (r < 0.5) {
      weatherState = "clear";
    } else if (r < 0.8) {
      weatherState = "rain";
      rainParticles = [];
    } else {
      weatherState = "thunderstorm";
      rainParticles = [];
    }
    weatherTimer = 0;
  }

  // 如果是下雨或雷暴，则生成雨滴
  if (weatherState === "rain" || weatherState === "thunderstorm") {
    for (let i = 0; i < 5; i++) {
      rainParticles.push(
        new Particle(
          random(cameraX, cameraX + width),
          0,
          createVector(0, random(4, 8)),
          color(180, 180, 255),
          60
        )
      );
    }
  }

  // 雷暴 + 夜晚时，1% 概率触发闪电
  if (
    weatherState === "thunderstorm" &&
    (timeOfDay < 6 || timeOfDay >= 18) &&
    random(1) < 0.01
  ) {
    thunderFlash = true;
  }
}

function drawWeather() {
  // 绘制雨滴
  for (let p of rainParticles) {
    p.update();
    p.draw();
  }

  // 雷暴闪光
  if (thunderFlash) {
    fill(255, 255, 255, 200);
    rect(0, 0, width, height);
    thunderFlash = false;
  }
}

// =========================
// 动态背景 (天空渐变 + 太阳 / 月亮 / 星星 / 云朵 + 关卡装饰)
// =========================

function drawDynamicBackground(level) {
  // 天空渐变
  drawSkyGradient();

  // 白天或夜晚
  if (timeOfDay >= 6 && timeOfDay < 18) {
    drawSun();
    drawClouds();
  } else {
    drawMoonCrescent();
    drawStars();
  }

  // 根据关卡名称，绘制更丰富的背景
  drawLevelDecor(level);
}

function drawSkyGradient() {
  push();
  let nightTop = color(10, 10, 40);
  let nightBottom = color(30, 30, 60);

  let sunriseTop = color(255, 100, 100);
  let sunriseBottom = color(255, 150, 100);

  let dayTop = color(135, 206, 250);
  let dayBottom = color(180, 230, 255);

  let sunsetTop = color(255, 130, 80);
  let sunsetBottom = color(255, 180, 100);

  let topColor, bottomColor;

  if (timeOfDay < 6) {
    topColor = nightTop;
    bottomColor = nightBottom;
  } else if (timeOfDay < 8) {
    let amt = map(timeOfDay, 6, 8, 0, 1);
    topColor = lerpColor(nightTop, sunriseTop, amt);
    bottomColor = lerpColor(nightBottom, sunriseBottom, amt);
  } else if (timeOfDay < 18) {
    topColor = dayTop;
    bottomColor = dayBottom;
  } else if (timeOfDay < 20) {
    let amt = map(timeOfDay, 18, 20, 0, 1);
    topColor = lerpColor(dayTop, sunsetTop, amt);
    bottomColor = lerpColor(dayBottom, sunsetBottom, amt);
  } else {
    topColor = nightTop;
    bottomColor = nightBottom;
  }

  noFill();
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, t);
    stroke(c);
    line(0, y, width, y);
  }
  pop();
}

// 太阳
function drawSun() {
  let sunX = map(timeOfDay, 6, 18, 0, width);
  let sunY = height * 0.35 - sin(map(timeOfDay, 6, 18, 0, PI)) * 100;

  let glowIntensity = sin(frameCount * 0.05) * 20 + 30;
  let glowAlpha = sin(frameCount * 0.05) * 50 + 150;

  push();
  translate(sunX, sunY);
  noStroke();

  // 光晕
  for (let i = 3; i >= 1; i--) {
    let glowSize = 80 + glowIntensity * i;
    fill(255, 200, 0, glowAlpha / i);
    ellipse(0, 0, glowSize, glowSize);
  }

  // 太阳主体
  fill(255, 255, 0);
  ellipse(0, 0, 50, 50);

  pop();
}

// 月牙
function drawMoonCrescent() {
  let moonX;
  if (timeOfDay >= 18) {
    moonX = map(timeOfDay, 18, 24, width, 0);
  } else {
    moonX = map(timeOfDay, 0, 6, 0, width);
  }
  let moonY =
    height * 0.35 -
    sin(
      map(timeOfDay, timeOfDay > 18 ? 18 : 0, timeOfDay > 18 ? 24 : 6, 0, PI)
    ) *
      100;

  let glowIntensity = sin(frameCount * 0.05) * 10 + 15;
  let glowAlpha = sin(frameCount * 0.05) * 30 + 120;

  push();
  translate(moonX, moonY);
  noStroke();

  // 光晕
  for (let i = 3; i >= 1; i--) {
    let glowSize = 60 + glowIntensity * i;
    fill(200, 200, 255, glowAlpha / i);
    ellipse(0, 0, glowSize, glowSize);
  }

  // 月亮主体
  fill(220);
  ellipse(0, 0, 40, 40);

  pop();
}

// 夜晚星星
function drawStars() {
  // 初始化星星
  if (starPositions.length < 100) {
    for (let i = 0; i < 100; i++) {
      starPositions.push({
        x: random(width),
        y: random(height * 0.5),
        size: random(1, 3)
      });
    }
  }
  noStroke();
  for (let s of starPositions) {
    fill(255, 255, 200, random(180, 255));
    ellipse(s.x, s.y, s.size, s.size);
  }
  // 偶尔出现流星
  if (random(1) < 0.001) {
    let sx = random(width);
    let sy = random(height * 0.5);
    stroke(255, 255, 200);
    strokeWeight(2);
    line(sx, sy, sx + 30, sy + 10);
  }
}

// 白天云朵
function drawClouds() {
  for (let i = 0; i < 5; i++) {
    let cx = ((frameCount * 0.2 + i * 200) % (width + 200)) - 100;
    let cy = 100 + i * 50 + sin(frameCount * 0.01 + i) * 10;
    drawCloud(cx, cy);
  }
}

function drawCloud(x, y) {
  push();
  translate(x, y);
  fill(255, 255, 255, 200);
  noStroke();
  ellipse(0, 0, 60, 40);
  ellipse(-20, 0, 40, 30);
  ellipse(20, 0, 40, 30);
  pop();
}

// 根据关卡名称，绘制更丰富的背景
function drawLevelDecor(level) {
  if (!level) return;
  push();
  noStroke();

  if (level.levelName === "Emerald Isles") {
    // 底部草地
    fill(34, 139, 34);
    rect(0, height - 150, width, 150);

    // 远处山丘
    fill(46, 139, 87);
    ellipse(width * 0.2, height, 600, 300);
    ellipse(width * 0.8, height + 20, 700, 250);

    // 小树
    fill(34, 100, 34);
    for (let i = 0; i < 5; i++) {
      let tx = i * 200 + 100;
      let ty = height - 170;
      rect(tx, ty, 20, 50);
      ellipse(tx + 10, ty - 10, 60, 60);
    }

  } else if (level.levelName === "Lava Castle") {
    // 熔岩城堡背景
    fill(80, 0, 0);
    rect(0, height - 180, width, 180);

    // 火山
    fill(50, 0, 0);
    triangle(200, height - 180, 400, height - 180, 300, height - 380);
    fill(255, 80, 0);
    ellipse(300, height - 380, 40, 20);

    // 熔岩河
    fill(255, 80, 0, 200);
    rect(400, height - 80, 300, 80);
    ellipse(700, height - 80, 60, 60);

    // 城堡墙
    fill(120, 30, 30);
    rect(700, height - 220, 200, 220);
    rect(950, height - 250, 80, 250);

  } else if (level.levelName === "Celestial Citadel") {
    // 天空圣城背景
    fill(200, 200, 255);
    rect(0, height - 160, width, 160);

    // 悬浮平台
    fill(180, 180, 220);
    ellipse(300, height - 300, 200, 50);
    fill(150, 150, 200);
    rect(250, height - 360, 100, 60);

    // 小塔楼
    fill(180, 180, 220);
    rect(260, height - 420, 20, 60);
    triangle(250, height - 420, 290, height - 420, 270, height - 460);

    fill(180, 180, 220);
    ellipse(800, height - 280, 150, 40);
    fill(150, 150, 200);
    rect(770, height - 330, 60, 50);
    fill(180, 180, 220);
    rect(780, height - 380, 20, 50);
    triangle(770, height - 380, 810, height - 380, 790, height - 410);

  } else if (level.levelName === "Shadow Realm") {
    // 暗影领域
    fill(50, 50, 80);
    rect(0, height - 200, width, 200);

    fill(100, 100, 150, 80);
    ellipse(width * 0.3, height - 200, 400, 120);
    ellipse(width * 0.6, height - 220, 500, 150);

    // 扭曲树木
    fill(30, 30, 50);
    for (let i = 0; i < 4; i++) {
      let tx = i * 300 + 100;
      let ty = height - 220;
      rect(tx, ty, 20, 70);
      ellipse(tx + 10, ty - 30, 70, 80);
      ellipse(tx - 20, ty - 10, 50, 40);
      ellipse(tx + 40, ty - 10, 50, 40);
    }

  } else if (level.levelName === "Crystal Caverns") {
    // 水晶洞穴
    fill(80, 150, 200);
    rect(0, height - 150, width, 150);

    fill(60, 100, 150);
    rect(0, height - 220, width, 70);

    // 水晶
    fill(100, 200, 255);
    for (let i = 0; i < 5; i++) {
      let cx = i * 250 + 100;
      let cy = height - 220;
      triangle(cx, cy, cx + 10, cy - 60, cx + 20, cy);
      fill(80, 180, 230);
      triangle(cx + 15, cy, cx + 25, cy - 40, cx + 35, cy);
      fill(100, 200, 255);
    }
  }

  pop();
}