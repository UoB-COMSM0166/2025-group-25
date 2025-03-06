// =========================
// weather.js
// =========================

// [新增] 可选的5种天气状态
// "clear", "rain", "snow", "thunderstorm", "fog"

let fogParticles = []; // 雾气粒子
let fogLayer;         // 只创建一次的雾图层

// 一个假设的地面参考高度（用于雪花落地停留的演示）
let groundLevel;

// 噪声用到的全局offset，用于让雾形状稍作平移动画
let fogNoiseOffset = 0;

function updateWeather() {
  // 1. 昼夜循环
  timeOfDay += 0.01;
  if (timeOfDay >= 24) {
    timeOfDay = 0;
  }

  // 2. 每 20 秒随机切换天气
  weatherTimer += deltaTime / 1000;
  if (weatherTimer > 20) {
    let r = random(1);
    if (r < 0.2) {
      weatherState = "clear";//clear
    } else if (r < 0.4) {
      weatherState = "rain";//rain
    } else if (r < 0.6) {
      weatherState = "snow";//snow
    } else if (r < 0.8) {
      weatherState = "thunderstorm";//thunderstorm
    } else {
      weatherState = "fog";//fog
    }
    // 切换天气后，清空各种粒子
    rainParticles = [];
    snowParticles = [];
    fogParticles = [];
    weatherTimer = 0;
  }

  // 3. 根据当前天气，生成对应粒子
  // == 雨 or 雷暴 ==
  if (weatherState === "rain" || weatherState === "thunderstorm") {
    // 每帧生成少量雨滴
    for (let i = 0; i < 5; i++) {
      let dropCol = color(80, 80, 220, 200);
      rainParticles.push(
        new Particle(
          random(cameraX, cameraX + width),
          0,
          createVector(0, random(4, 8)),
          dropCol,
          60
        )
      );
    }

    // 如果是雷暴 & 夜晚，则有小概率产生闪电
    if (
      weatherState === "thunderstorm" &&
      (timeOfDay < 6 || timeOfDay >= 18) &&
      random(1) < 0.01
    ) {
      thunderFlash = true;
    }
  }

  // == 雪天 ==
  else if (weatherState === "snow") {
    // 控制生成频率：每隔 3 帧生成一次
    if (frameCount % 3 === 0) {
      // 限制雪花粒子总数，避免数量过多（例如上限设为 200 个）
      if (snowParticles.length < 200) {
        snowParticles.push(
          new Particle(
            random(cameraX, cameraX + width),
            -10,
            createVector(random(-0.5, 0.5), random(1, 2)), // 缓慢下落
            color(255),
            150 // 寿命
          )
        );
      }
    }
  }

  // == 大雾 ==
  else if (weatherState === "fog") {
    // 若第一次使用雾图层，或画布尺寸变化后，需要重新创建
    if (!fogLayer || fogLayer.width !== width || fogLayer.height !== height) {
      fogLayer = createGraphics(width, height);
    }

    // 生成雾气粒子（简单随机）
    for (let i = 0; i < 3; i++) {
      let p = {
        x: random(cameraX, cameraX + width),
        y: -10,
        vx: random(-0.1, 0.1),
        vy: random(0.2, 0.5),
        lifetime: 0,
        maxLifetime: 600 + int(random(200)),
        size: random(40, 80),
      };
      fogParticles.push(p);
    }
  }
}

// =========================
// 绘制各种天气效果
// =========================
function drawWeather() {
  // 1. 雨 / 雷暴
  if (weatherState === "rain" || weatherState === "thunderstorm") {
    for (let i = rainParticles.length - 1; i >= 0; i--) {
      let p = rainParticles[i];
      p.update();
      p.draw();
      if (p.isDead()) {
        rainParticles.splice(i, 1);
      }
    }
  }

  // 2. 雪
  if (weatherState === "snow") {
    for (let i = snowParticles.length - 1; i >= 0; i--) {
      let s = snowParticles[i];
      s.update();

      // 绘制“精美雪花”或更简单的图案
      push();
      translate(s.position.x - cameraX, s.position.y);
      rotate(frameCount * 0.01 + i);
      stroke(255);
      strokeWeight(2);
      noFill();
      let r = 6;
      for (let angle = 0; angle < 360; angle += 60) {
        let rad = radians(angle);
        line(0, 0, r * cos(rad), r * sin(rad));
      }
      pop();

      if (s.isDead() || s.position.y > height + 20) {
        snowParticles.splice(i, 1);
      }
    }
  }

  // 3. 大雾
  if (weatherState === "fog") {
    // 先更新雾粒子的位置和寿命
    for (let i = fogParticles.length - 1; i >= 0; i--) {
      let f = fogParticles[i];
      f.x += f.vx;
      f.y += f.vy;
      f.lifetime++;
      if (f.lifetime > f.maxLifetime) {
        fogParticles.splice(i, 1);
      }
    }

    // 清空上帧的 fogLayer
    fogLayer.clear();

    // 在雾图层上填充一个较浓的蒙版
    fogLayer.noErase();
    fogLayer.background(200, 200, 200, 220);

    // 在玩家周围抠一个可见区域（雾洞）
    fogLayer.erase(); // 开启擦除模式
    let holeX = width / 2; // 先给默认值
    let holeY = height / 2;

    // 如果 player 存在并且有 position，就用玩家位置
    if (player && player.position) {
      holeX = player.position.x - cameraX+25;//Rui //向右偏移
      holeY = player.position.y+30;//向下偏移
    }

    // 使用径向渐变擦除，做柔和过渡
    let maxRadius = 120;
    for (let r = maxRadius; r > 0; r -= 2) {
      let alpha = map(r, maxRadius, 0, 0, 220);
      let gradColor = lerpColor(
        color(200, 200, 200, alpha),
        color(200, 200, 200, 0),
        r / maxRadius
      );
      fogLayer.fill(gradColor);
      fogLayer.noStroke();
      fogLayer.ellipse(holeX, holeY, r * 2, r * 2);
    }
    fogLayer.noErase(); // 关闭擦除模式

    // 将雾图层叠加到主画面
    image(fogLayer, 0, 0);
  }

  // 4. 雷暴闪电
  if (thunderFlash) {
    fill(255, 255, 255, 200);
    rect(0, 0, width, height);
    thunderFlash = false;
  }
}

// ==========================================================
// 绘制动态背景 (天空渐变 + 太阳 / 月亮 / 星星 / 云朵 + 关卡装饰)
// ==========================================================
function drawDynamicBackground(level) {
  // 1) 绘制天空渐变
  drawSkyGradient();

  // 2) 如果当前关卡不是 "Crystal Caverns"，才绘制太阳、月亮、星星和云朵
  if (!level || !level.levelName) {
    return; // 如果 level 未初始化，直接跳过
  }

  if (level.levelName !== "Crystal Caverns") {
    if (timeOfDay >= 6 && timeOfDay < 18) {
      // --- 白天 ---
      // 下列天气不显示太阳：rain, thunderstorm, snow
      if (
        weatherState !== "rain" &&
        weatherState !== "thunderstorm" &&
        weatherState !== "snow"
      ) {
        drawSun();
      }
      if (weatherState === "rain" || weatherState === "thunderstorm") {
        drawDarkClouds();
      } else {
        drawClouds();
      }
    } else {
      // --- 夜晚 ---
      drawMoonCrescent();
      drawStars();
    }
  }

  // 3) 最后绘制关卡背景装饰
  push();
  blendMode(MULTIPLY);
  drawLevelDecor(level);
  blendMode(BLEND);
  pop();
}

// 下方这些函数基本保持不变，可根据需要微调
function drawSkyGradient() {
  push();

  // ① 为每个整点小时定义一个顶部(top)和底部(bottom)颜色
  let skyColorsTop = [
    color(11, 0, 51),
    color(11, 16, 51),
    color(11, 32, 51),
    color(11, 48, 51),
    color(31, 43, 68),
    color(62, 74, 102),
    color(249, 217, 160),
    color(255, 210, 127),
    color(173, 216, 230),
    color(160, 223, 248),
    color(144, 224, 255),
    color(128, 225, 255),
    color(112, 226, 255),
    color(144, 223, 255),
    color(160, 220, 255),
    color(176, 217, 255),
    color(192, 214, 255),
    color(208, 211, 255),
    color(255, 160, 122),
    color(255, 130, 67),
    color(75, 0, 130),
    color(42, 0, 51),
    color(31, 0, 51),
    color(21, 0, 51)
  ];

  let skyColorsBottom = [
    color(21, 0, 60),
    color(21, 16, 60),
    color(21, 32, 60),
    color(21, 48, 60),
    color(41, 53, 78),
    color(72, 84, 112),
    color(255, 227, 180),
    color(255, 220, 157),
    color(183, 226, 240),
    color(170, 233, 255),
    color(154, 234, 255),
    color(138, 235, 255),
    color(122, 236, 255),
    color(154, 233, 255),
    color(170, 230, 255),
    color(186, 227, 255),
    color(202, 224, 255),
    color(218, 221, 255),
    color(255, 180, 142),
    color(255, 150, 87),
    color(85, 10, 140),
    color(52, 10, 61),
    color(41, 10, 61),
    color(31, 10, 61)
  ];

  let hour = floor(timeOfDay);
  let nextHour = (hour + 1) % 24;
  let frac = timeOfDay - hour;

  let topColor = lerpColor(skyColorsTop[hour], skyColorsTop[nextHour], frac);
  let bottomColor = lerpColor(
    skyColorsBottom[hour],
    skyColorsBottom[nextHour],
    frac
  );

  noFill();
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, t);
    stroke(c);
    line(0, y, width, y);
  }

  // 如果天气是雨 or 雷暴，就让天空变灰暗一些
  if (weatherState === "rain" || weatherState === "thunderstorm") {
    fill(50, 50, 50, 80);
    rect(0, 0, width, height);
  }

  pop();
}

function drawSun() {
  let sunX = map(timeOfDay, 6, 18, 0, width);
  let sunY = height * 0.35 - sin(map(timeOfDay, 6, 18, 0, PI)) * 100;

  let glowAlpha = sin(frameCount * 0.05) * 50 + 150;

  push();
  translate(sunX, sunY);
  noStroke();

  // 平滑光晕
  for (let i = 1; i <= 10; i++) {
    let glowSize = 80 * (1 + i * 0.2);
    fill(255, 200, 0, glowAlpha * exp(-i * 0.5));
    ellipse(0, 0, glowSize, glowSize);
  }

  // 太阳主体（渐变色）
  for (let i = 0; i < 10; i++) {
    let lerpedColor = lerpColor(color(255, 255, 0), color(255, 150, 0), i / 10);
    fill(lerpedColor);
    ellipse(0, 0, 50 - i * 5, 50 - i * 5);
  }

  pop();
}

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

  let glowAlpha = sin(frameCount * 0.05) * 30 + 120;

  push();
  translate(moonX, moonY);
  noStroke();

  // 平滑光晕
  for (let i = 1; i <= 10; i++) {
    let glowSize = 60 * (1 + i * 0.2);
    fill(200, 200, 255, glowAlpha * exp(-i * 0.5));
    ellipse(0, 0, glowSize, glowSize);
  }

  // 月亮主体（渐变色）
  for (let i = 0; i < 10; i++) {
    let lerpedColor = lerpColor(color(255, 255, 255), color(180, 180, 255), i / 10);
    fill(lerpedColor);
    ellipse(0, 0, 40 - i * 4, 40 - i * 4);
  }

  pop();
}

function drawStars() {
  if (starPositions.length < 100) {
    for (let i = 0; i < 100; i++) {
      starPositions.push({
        x: random(width),
        y: random(height * 0.5),
        size: random(1, 3),
      });
    }
  }
  noStroke();
  for (let s of starPositions) {
    fill(255, 255, 200, random(180, 255));
    ellipse(s.x, s.y, s.size, s.size);
  }
}

//--------------------------- 云朵 -------------------------------------
function drawClouds() {
  for (let i = 0; i < 5; i++) {
    let cx = ((frameCount * 0.2 + i * 200) % (width + 200)) - 100;
    let cy = 100 + i * 50 + sin(frameCount * 0.01 + i) * 10;
    drawCloud(cx, cy);
  }
}

function drawCloud(cx, cy) {
  push();
  translate(cx, cy);
  noStroke();

  fill(255, 255, 255, 220);
  ellipse(0, 0, 100, 70);
  ellipse(-35, -5, 70, 60);
  ellipse(35, -5, 80, 60);

  ellipse(-20, 25, 50, 30);
  ellipse(20, 25, 60, 35);

  ellipse(-30, -25, 40, 30);
  ellipse(10, -30, 50, 35);

  fill(255, 255, 255, 250);
  ellipse(-25, -20, 30, 20);
  ellipse(15, -25, 25, 15);
  pop();
}

function drawDarkClouds() {
  for (let i = 0; i < 5; i++) {
    let cx = ((frameCount * 0.15 + i * 250) % (width + 300)) - 100;
    let cy = 120 + i * 40 + sin(frameCount * 0.01 + i) * 10;
    drawDarkCloud(cx, cy);
  }
}

function drawDarkCloud(cx, cy) {
  push();
  translate(cx, cy);
  noStroke();

  fill(50, 50, 50, 200);
  ellipse(0, 0, 100, 65);
  ellipse(-35, -10, 70, 55);
  ellipse(40, -10, 80, 55);

  ellipse(-20, 20, 60, 35);
  ellipse(25, 25, 70, 40);

  ellipse(-30, -25, 50, 35);
  ellipse(15, -30, 60, 40);

  fill(30, 30, 30, 180);
  ellipse(-15, 10, 90, 50);
  ellipse(25, 15, 80, 45);

  pop();
}

//--------------------------- 云朵 -------------------------------------

// 根据关卡名称，绘制更丰富的背景
function drawLevelDecor(level) {
  if (!level) return;
  push();
  noStroke();

  // 此处保留你原有的贴图或背景逻辑
  if (level.levelName === "Emerald Isles") {
    image(levelOneBg, 0, 0, width, height);
  } else if (level.levelName === "Lava Castle") {
    image(levelTwoBg, 0, 0, width, height);
  } else if (level.levelName === "Celestial Citadel") {
    image(levelThreeBg, 0, 0, width, height);
  } else if (level.levelName === "Shadow Realm") {
    image(levelFourBg, 0, 0, width, height);
  } else if (level.levelName === "Crystal Caverns") {
    image(levelFiveBg, 0, 0, width, height);
  }

  pop();
}

// =========================
// 附加：画“精美雪花”与“真实雾气”相关的函数（原本已在上面体现）
// =========================

// 这里保留 drawFancySnowflake 等自定义函数的示例：
// function drawFancySnowflake(s, index) { ... }



// =========================
// 附加：画“精美雪花”与“真实雾气”相关的函数
// =========================

// 画更精美的雪花
function drawFancySnowflake(s, index) {
  push();
  translate(s.position.x - cameraX, s.position.y);


  stroke(255);
  strokeWeight(2);
  noFill();

  // 半径可调大一些
  let r = 8;

  // 画6个主要分支 + 每个分支再画两个小分叉
  for (let angle = 0; angle < 360; angle += 60) {
    let rad = radians(angle);

    // 主分支
    line(0, 0, r * cos(rad), r * sin(rad));

    // 在分支的中点画2个小分叉
    let midX = (r * 0.5) * cos(rad);
    let midY = (r * 0.5) * sin(rad);

    let branchAngle1 = rad + radians(15);
    let branchAngle2 = rad - radians(15);

    line(
      midX,
      midY,
      midX + (r * 0.3) * cos(branchAngle1),
      midY + (r * 0.3) * sin(branchAngle1)
    );
    line(
      midX,
      midY,
      midX + (r * 0.3) * cos(branchAngle2),
      midY + (r * 0.3) * sin(branchAngle2)
    );
  }

  pop();
}
