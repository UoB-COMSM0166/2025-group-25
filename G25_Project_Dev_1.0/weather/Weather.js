// =========================
// 天气 & 昼夜系统
// =========================

// [新增] 可选的5种天气状态
// "clear", "rain", "snow", "thunderstorm", "fog"

let fogParticles = [];       // 雾气粒子

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
    // 示例：雨滴颜色更深一点 + 半透明
for (let i = 0; i < 5; i++) {
  // 这里把颜色改成更深的蓝，带些透明度
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
    // 雪花只在空中飘落后消失，不落地堆积
    for (let i = 0; i < 3; i++) {
      snowParticles.push(
        new Particle(
          random(cameraX, cameraX + width),
          -10,
          createVector(random(-0.5, 0.5), random(1, 2)), // 缓慢下落
          color(255),
          150 // 给雪花设置一定寿命即可，不会堆积
        )
      );
    }
  }

  else if (weatherState === "fog") {
    // 1) 生成一些新的雾粒子
    //    你可以根据实际需求控制生成频率和数量
    for (let i = 0; i < 3; i++) {
      let p = {
        x: random(cameraX, cameraX + width),  // 初始 x 位置
        y: -10,                               // 初始 y（屏幕上方）
        vx: random(-0.1, 0.1),               // x 方向初速度
        vy: random(0.2, 0.5),                // y 方向下落速度
        lifetime: 0,                         // 已存在的帧数
        maxLifetime: 600 + int(random(200)), // 最大寿命(在 600~800 之间)
        size: random(40, 80)                 // 雾粒子的大小
      };
      fogParticles.push(p);
    }

    // 2) 更新已有雾粒子的位置、寿命等
    for (let i = fogParticles.length - 1; i >= 0; i--) {
      let p = fogParticles[i];

      // 让雾粒子有些左右轻微漂移
      p.vx += random(-0.01, 0.01);
      // 限制 x 速度，防止飞得太离谱
      p.vx = constrain(p.vx, -0.3, 0.3);

      // 更新位置
      p.x += p.vx;
      p.y += p.vy;

      // 寿命 +1
      p.lifetime++;

      // 如果超过最大寿命或移出屏幕很远，就移除
      if (p.lifetime > p.maxLifetime || p.y > height + 200) {
        fogParticles.splice(i, 1);
      }
    }
  }

  // "clear" 时不生成额外粒子
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
      // 默认粒子绘制(如椭圆)
      p.draw();
      // 若死亡或飞出屏幕，就移除
      if (p.isDead()) {
        rainParticles.splice(i, 1);
      }
    }
  }

  // 2. 雪（不落地堆积，直接在空中飘落后消失）
  if (weatherState === "snow") {
    for (let i = snowParticles.length - 1; i >= 0; i--) {
      let s = snowParticles[i];
      s.update();

      // 绘制“精美雪花”，可自定义替换
      push();
      translate(s.position.x - cameraX, s.position.y);
      // 让雪花随帧数微转动
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

      // 若已超出寿命或飘到屏幕下方，可将其移除
      if (s.isDead() || s.position.y > height + 20) {
        snowParticles.splice(i, 1);
      }
    }
  }

  // 3. 大雾
  if (weatherState === "fog") {
    // 1) 整体叠加一层蒙雾，颜色和透明度可根据需求调整
    fill(200, 200, 200, 60);
    rect(0, 0, width, height);

    // 2) 绘制所有雾粒子
    for (let i = 0; i < fogParticles.length; i++) {
      let p = fogParticles[i];

      // 根据粒子的存活时间，决定透明度（越靠后越淡）
      let alphaVal = map(p.lifetime, 0, p.maxLifetime, 120, 0);

      push();
      noStroke();

      // 第一层：大一些、淡一些
      fill(200, 200, 200, alphaVal);
      ellipse(p.x - cameraX, p.y, p.size * 1.2, p.size);

      // 第二层：稍微浓一点，并带随机小偏移
      fill(200, 200, 200, alphaVal + 20);
      ellipse(
        p.x - cameraX + random(-2, 2),
        p.y + random(-2, 2),
        p.size,
        p.size * 0.7
      );

      pop();
    }
  }


  // 4. 若有雷暴闪电，让画面闪一下
  if (thunderFlash) {
    fill(255, 255, 255, 200);
    rect(0, 0, width, height);
    thunderFlash = false;
  }
}




// =========================
// 绘制动态背景 (天空渐变 + 太阳 / 月亮 / 星星 / 云朵 + 关卡装饰)
// （保持原来的昼夜代码和函数）
// =========================

function drawDynamicBackground(level) {
  // 1) 绘制天空渐变
  drawSkyGradient();

  // 2) 根据时间和天气，决定绘制太阳、月亮、星空、云朵等
  if (timeOfDay >= 6 && timeOfDay < 18) {
    // --- 白天 ---
    // 下列天气不显示太阳：rain, thunderstorm, snow
    if (
      weatherState !== "rain" &&
      weatherState !== "thunderstorm" &&
      weatherState !== "snow"
    ) {
      // 如果是晴天 / 大雾，依然能看见太阳
      drawSun();
    }

    // 如果要画“普通云朵”，只在天气是 clear / fog / snow 时画
    // 或者你保留原先drawClouds()即可
    // 下面示例：如果是雨 or 雷暴，就不画普通云，而改画乌云
    if (weatherState === "rain" || weatherState === "thunderstorm") {
      drawDarkClouds(); // 新增函数：画深色乌云
    } else {
      // 其它天气可用普通云朵
      drawClouds();
    }
  } else {
    // --- 夜晚 ---
    drawMoonCrescent();
    drawStars();
  }

  // 3) 最后绘制关卡背景装饰
  drawLevelDecor(level);
}


// 下方这些函数基本保持不变，可以根据需要局部微调
function drawSkyGradient() {
  push();

  // ① 为每个整点小时定义一个顶部(top)和底部(bottom)颜色
  let skyColorsTop = [
    color(11, 0, 51),    // 0点 - 深夜
    color(11, 16, 51),   // 1点
    color(11, 32, 51),   // 2点
    color(11, 48, 51),   // 3点 - 夜空略变亮
    color(31, 43, 68),   // 4点
    color(62, 74, 102),  // 5点 - 逐渐泛青
    color(249, 217, 160),// 6点 - 破晓/日出
    color(255, 210, 127),// 7点
    color(173, 216, 230),// 8点 - 白天开始
    color(160, 223, 248),// 9点
    color(144, 224, 255),// 10点
    color(128, 225, 255),// 11点
    color(112, 226, 255),// 12点 - 正午偏蓝
    color(144, 223, 255),// 13点
    color(160, 220, 255),// 14点
    color(176, 217, 255),// 15点
    color(192, 214, 255),// 16点
    color(208, 211, 255),// 17点
    color(255, 160, 122),// 18点 - 傍晚/日落
    color(255, 130, 67), // 19点
    color(75, 0, 130),   // 20点 - 夜幕降临（偏紫）
    color(42, 0, 51),    // 21点
    color(31, 0, 51),    // 22点
    color(21, 0, 51)     // 23点 - 深夜
  ];

  let skyColorsBottom = [
    color(21, 0, 60),    // 0点
    color(21, 16, 60),   // 1点
    color(21, 32, 60),   // 2点
    color(21, 48, 60),   // 3点
    color(41, 53, 78),   // 4点
    color(72, 84, 112),  // 5点
    color(255, 227, 180),// 6点 - 破晓/日出
    color(255, 220, 157),// 7点
    color(183, 226, 240),// 8点 - 白天
    color(170, 233, 255),// 9点
    color(154, 234, 255),// 10点
    color(138, 235, 255),// 11点
    color(122, 236, 255),// 12点 - 正午
    color(154, 233, 255),// 13点
    color(170, 230, 255),// 14点
    color(186, 227, 255),// 15点
    color(202, 224, 255),// 16点
    color(218, 221, 255),// 17点
    color(255, 180, 142),// 18点 - 日落橙
    color(255, 150, 87), // 19点
    color(85, 10, 140),  // 20点 - 夜幕更紫
    color(52, 10, 61),   // 21点
    color(41, 10, 61),   // 22点
    color(31, 10, 61)    // 23点
  ];

  // ② 根据 timeOfDay 获取当前小时和下一小时
  let hour = floor(timeOfDay);       // 0 ~ 23
  let nextHour = (hour + 1) % 24;    // 下一小时
  let frac = timeOfDay - hour;       // 小数部分 0~1

  // ③ 对顶部颜色做插值
  let topColor = lerpColor(skyColorsTop[hour], skyColorsTop[nextHour], frac);
  // ④ 对底部颜色也做插值
  let bottomColor = lerpColor(skyColorsBottom[hour], skyColorsBottom[nextHour], frac);

  // ⑤ 用这两个颜色做垂直渐变
  noFill();
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, t);
    stroke(c);
    line(0, y, width, y);
  }

  // ⑥ 如果天气是雨 or 雷暴，就让天空变得灰暗一些
  if (weatherState === "rain" || weatherState === "thunderstorm") {
    fill(50, 50, 50, 80); // 一个轻度灰色蒙版，你可自行调节
    rect(0, 0, width, height);
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
        size: random(1, 3),
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

function drawDarkClouds() {
  // 画几团深色云
  for (let i = 0; i < 5; i++) {
    let cx = ((frameCount * 0.15 + i * 250) % (width + 300)) - 100;
    let cy = 120 + i * 40 + sin(frameCount * 0.01 + i) * 10;
    push();
    translate(cx, cy);
    fill(50, 50, 50, 200); // 暗一些
    noStroke();
    ellipse(0, 0, 80, 50);
    ellipse(-30, 0, 50, 40);
    ellipse(25, 0, 60, 40);
    pop();
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



// =========================
// 附加：画“精美雪花”与“真实雾气”相关的函数
// =========================

// 画更精美的雪花 ❄️
function drawFancySnowflake(s, index) {
  push();
  translate(s.position.x - cameraX, s.position.y);

  // 如果没落地则让雪花旋转（落地后就不再旋转，可根据需求决定是否继续转）
  if (!s.stopped) {
    rotate(frameCount * 0.01 + index);
  }

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

// 随机生成一个雾团形状（不规则多边形），可自行调整实现
function generateRandomFogShape() {
  // 用于控制雾团大小
  let baseRadius = random(20, 40);
  let vertexCount = floor(random(5, 8));

  let shapePoints = [];
  for (let i = 0; i < vertexCount; i++) {
    let angle = map(i, 0, vertexCount, 0, TWO_PI);
    // 在baseRadius附近随机波动
    let r = baseRadius + random(-10, 10);
    let x = r * cos(angle);
    let y = r * sin(angle);
    shapePoints.push(createVector(x, y));
  }
  return shapePoints;
}

// 自定义雾粒子的绘制
function drawFogParticle(f) {
  push();
  translate(f.position.x - cameraX, f.position.y);
  noStroke();

  // 让雾的透明度根据剩余寿命慢慢变化
  let alpha = map(f.lifetime, 0, f.maxLifetime, 0, 180);
  fill(200, 200, 200, alpha);

  // 用不规则多边形来表现雾团
  beginShape();
  for (let v of f.fogShape) {
    // 可加入一点噪声抖动，让雾边缘不断轻微变化
    // 这样会显得更“活”，不过消耗稍微大一点
    let noiseVal = noise(v.x * 0.01 + fogNoiseOffset, v.y * 0.01 + fogNoiseOffset);
    let offset = map(noiseVal, 0, 1, -2, 2);
    vertex(v.x + offset, v.y + offset);
  }
  endShape(CLOSE);

  pop();
}

