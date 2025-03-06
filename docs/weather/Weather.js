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
  if (weatherTimer > 20) {//20
    let r = random(1);
    if (r < 0.2) {
      weatherState = "clear";//clear
    } else if (r < 0.4) {
      weatherState = "clear";//rain
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
            150 // 寿命，达到寿命后在 drawWeather 中会删除
          )
        );
      }
    }
  }
  

  else if (weatherState === "fog") {
    // // 1) 生成一些新的雾粒子
    // //    你可以根据实际需求控制生成频率和数量
    // for (let i = 0; i < 3; i++) {
    //   let p = {
    //     x: random(cameraX, cameraX + width),  // 初始 x 位置
    //     y: -10,                               // 初始 y（屏幕上方）
    //     vx: random(-0.1, 0.1),               // x 方向初速度
    //     vy: random(0.2, 0.5),                // y 方向下落速度
    //     lifetime: 0,                         // 已存在的帧数
    //     maxLifetime: 600 + int(random(200)), // 最大寿命(在 600~800 之间)
    //     size: random(40, 80)                 // 雾粒子的大小
    //   };
    //   fogParticles.push(p);
    // }

    // // 2) 更新已有雾粒子的位置、寿命等
    // for (let i = fogParticles.length - 1; i >= 0; i--) {
    //   let p = fogParticles[i];

    //   // 让雾粒子有些左右轻微漂移
    //   p.vx += random(-0.01, 0.01);
    //   // 限制 x 速度，防止飞得太离谱
    //   p.vx = constrain(p.vx, -0.3, 0.3);

    //   // 更新位置
    //   p.x += p.vx;
    //   p.y += p.vy;

    //   // 寿命 +1
    //   p.lifetime++;

    //   // 如果超过最大寿命或移出屏幕很远，就移除
    //   if (p.lifetime > p.maxLifetime || p.y > height + 200) {
    //     fogParticles.splice(i, 1);
    //   }
    // }
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
    // // 1) 整体叠加一层蒙雾，颜色和透明度可根据需求调整
    // fill(200, 200, 200, 60);
    // rect(0, 0, width, height);

    // // 2) 绘制所有雾粒子
    // for (let i = 0; i < fogParticles.length; i++) {
    //   let p = fogParticles[i];

    //   // 根据粒子的存活时间，决定透明度（越靠后越淡）
    //   let alphaVal = map(p.lifetime, 0, p.maxLifetime, 120, 0);

    //   push();
    //   noStroke();

    //   // 第一层：大一些、淡一些
    //   fill(200, 200, 200, alphaVal);
    //   ellipse(p.x - cameraX, p.y, p.size * 1.2, p.size);

    //   // 第二层：稍微浓一点，并带随机小偏移
    //   fill(200, 200, 200, alphaVal + 20);
    //   ellipse(
    //     p.x - cameraX + random(-2, 2),
    //     p.y + random(-2, 2),
    //     p.size,
    //     p.size * 0.7
    //   );

    //   pop();
    // }

    if (weatherState === "fog") {


      // 创建一个独立的雾层图层
      let fogLayer = createGraphics(width, height);
    
      //1.在图层上填充整个屏幕为浓雾背景
      fogLayer.noErase(); // 关闭擦除模式，确保后续填充不受影响
      // 使用背景色并设置较高的不透明度（例如 220）
      fogLayer.background(200, 200, 200, 220);

      //2.获取玩家在主画布上的位置（注意减去 cameraX 以适应相机偏移）
      let holeX = player.position.x - cameraX;
      let holeY = player.position.y;
    
      //3.利用图层内的擦除模式，在玩家周围绘制一个渐变雾洞
    
      fogLayer.erase();  // 开启擦除模式，此时绘制的图形会从已有内容中抠出

      //使用径向渐变让雾洞更加柔和
      let maxRadius = 120; // 控制雾洞的最大半径
      for (let r = maxRadius; r > 0; r -= 2) {  // 减小步长，使渐变更平滑
        let alpha = map(r, maxRadius, 0, 0, 220);  // 让透明度平滑过渡
        let gradColor = lerpColor(color(200, 200, 200, alpha), color(200, 200, 200, 0), r / maxRadius);
        fogLayer.fill(gradColor);
        fogLayer.noStroke();
        fogLayer.ellipse(holeX, holeY, r * 2, r * 2);
      }
      fogLayer.noErase(); // 关闭擦除模式，防止后续绘制受影响

      // 4️⃣ 将雾层图层叠加到主画面上
      image(fogLayer, 0, 0);

    }
    
    
  }

  // 4. 若有雷暴闪电，让画面闪一下
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
  push();
  blendMode(MULTIPLY);
  drawLevelDecor(level);
  blendMode(BLEND);
  pop();
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



//--------------------------- 太阳、月亮、星星 ---------------------------
//--------------------------- 太阳、月亮、星星 ---------------------------

// 太阳
// function drawSun() {
//   let sunX = map(timeOfDay, 6, 18, 0, width);
//   let sunY = height * 0.35 - sin(map(timeOfDay, 6, 18, 0, PI)) * 100;

//   let glowIntensity = sin(frameCount * 0.05) * 20 + 30;
//   let glowAlpha = sin(frameCount * 0.05) * 50 + 150;

//   push();
//   translate(sunX, sunY);
//   noStroke();

//   // 光晕
//   for (let i = 3; i >= 1; i--) {
//     let glowSize = 80 + glowIntensity * i;
//     fill(255, 200, 0, glowAlpha / i);
//     ellipse(0, 0, glowSize, glowSize);
//   }

//   // 太阳主体
//   fill(255, 255, 0);
//   ellipse(0, 0, 50, 50);

//   pop();
// }

// // 月牙
// function drawMoonCrescent() {
//   let moonX;
//   if (timeOfDay >= 18) {
//     moonX = map(timeOfDay, 18, 24, width, 0);
//   } else {
//     moonX = map(timeOfDay, 0, 6, 0, width);
//   }
//   let moonY =
//     height * 0.35 -
//     sin(
//       map(timeOfDay, timeOfDay > 18 ? 18 : 0, timeOfDay > 18 ? 24 : 6, 0, PI)
//     ) *
//       100;

//   let glowIntensity = sin(frameCount * 0.05) * 10 + 15;
//   let glowAlpha = sin(frameCount * 0.05) * 30 + 120;

//   push();
//   translate(moonX, moonY);
//   noStroke();

//   // 光晕
//   for (let i = 3; i >= 1; i--) {
//     let glowSize = 60 + glowIntensity * i;
//     fill(200, 200, 255, glowAlpha / i);
//     ellipse(0, 0, glowSize, glowSize);
//   }

//   // 月亮主体
//   fill(220);
//   ellipse(0, 0, 40, 40);

//   pop();
// }

// 太阳
function drawSun() {
  let sunX = map(timeOfDay, 6, 18, 0, width);
  let sunY = height * 0.35 - sin(map(timeOfDay, 6, 18, 0, PI)) * 100;

  let glowIntensity = sin(frameCount * 0.05) * 20 + 30;
  let glowAlpha = sin(frameCount * 0.05) * 50 + 150;

  push();
  translate(sunX, sunY);
  noStroke();

  // 平滑光晕
  for (let i = 1; i <= 10; i++) {  // 增加层数
    let glowSize = 80 * (1 + i * 0.2); // 让光晕扩散更平滑
    fill(255, 200, 0, glowAlpha * exp(-i * 0.5)); // 指数衰减透明度
    ellipse(0, 0, glowSize, glowSize);
  }

  // // 太阳主体
  // fill(255, 255, 0);
  // ellipse(0, 0, 50, 50);

  // 太阳主体（渐变色）
  for (let i = 0; i < 10; i++) {
    let lerpedColor = lerpColor(color(255, 255, 0), color(255, 150, 0), i / 10);
    fill(lerpedColor);
    ellipse(0, 0, 50 - i * 5, 50 - i * 5);
  }

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

  // 平滑光晕
  for (let i = 1; i <= 10; i++) {  // 增加层数
    let glowSize = 60 * (1 + i * 0.2); // 让光晕扩散更平滑
    fill(200, 200, 255, glowAlpha * exp(-i * 0.5)); // 指数衰减透明度
    ellipse(0, 0, glowSize, glowSize);
  }

  // // 月亮主体
  // fill(220);
  // ellipse(0, 0, 40, 40);

  // 月亮主体（渐变色）
  for (let i = 0; i < 10; i++) {
    let lerpedColor = lerpColor(color(255, 255, 255), color(180, 180, 255), i / 10);
    fill(lerpedColor);
    ellipse(0, 0, 40 - i * 4, 40 - i * 4);
  }

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
  // if (random(1) < 0.001) {
  //   let sx = random(width);
  //   let sy = random(height * 0.5);
  //   stroke(255, 255, 200);
  //   strokeWeight(2);
  //   line(sx, sy, sx + 30, sy + 10);
  // }
}
//--------------------------- 太阳、月亮、星星 ---------------------------
//--------------------------- 太阳、月亮、星星 ---------------------------




//--------------------------- 云朵 -------------------------------------
//--------------------------- 云朵 -------------------------------------

// 画白天的云朵
function drawClouds() {
  for (let i = 0; i < 5; i++) {
    let cx = ((frameCount * 0.2 + i * 200) % (width + 200)) - 100;
    let cy = 100 + i * 50 + sin(frameCount * 0.01 + i) * 10;
    drawCloud(cx, cy);
  }
}

// 画白云
function drawCloud(cx, cy) {
  push();
  translate(cx, cy);
  noStroke();
  
  // 主体云朵
  fill(255, 255, 255, 220);
  ellipse(0, 0, 100, 70);
  ellipse(-35, -5, 70, 60);
  ellipse(35, -5, 80, 60);
  
  // 添加底部的小弧形，增加蓬松感
  ellipse(-20, 25, 50, 30);
  ellipse(20, 25, 60, 35);
  
  // 添加顶部的小弧形，增加立体感
  ellipse(-30, -25, 40, 30);
  ellipse(10, -30, 50, 35);
  
  // 添加高光，增加立体感
  fill(255, 255, 255, 250);
  ellipse(-25, -20, 30, 20);
  ellipse(15, -25, 25, 15);
  
  pop();
}


// 画乌云
function drawDarkClouds() {
  for (let i = 0; i < 5; i++) {
    let cx = ((frameCount * 0.15 + i * 250) % (width + 300)) - 100;
    let cy = 120 + i * 40 + sin(frameCount * 0.01 + i) * 10;
    drawDarkCloud(cx, cy);
  }
}

// 绘制自然立体的乌云
function drawDarkCloud(cx, cy) {
  push();
  translate(cx, cy);
  noStroke();
  
  // 主体乌云，使用深灰色
  fill(50, 50, 50, 200);
  ellipse(0, 0, 100, 65);
  ellipse(-35, -10, 70, 55);
  ellipse(40, -10, 80, 55);

  // 添加底部的弧形，增加厚重感
  ellipse(-20, 20, 60, 35);
  ellipse(25, 25, 70, 40);

  // 添加顶部的弧形，增加立体感
  ellipse(-30, -25, 50, 35);
  ellipse(15, -30, 60, 40);

  // 额外的叠加层，制造厚重感
  fill(30, 30, 30, 180);
  ellipse(-15, 10, 90, 50);
  ellipse(25, 15, 80, 45);

  // // 添加高光，增加立体感
  // fill(80, 80, 80, 150);
  // ellipse(-25, -20, 35, 25);
  // ellipse(20, -25, 30, 20);

  pop();
}



//--------------------------- 云朵 ---------------------------
//--------------------------- 云朵 ---------------------------





// 根据关卡名称，绘制更丰富的背景
function drawLevelDecor(level) {
  if (!level) return;
  push();
  noStroke();

  if (level.levelName === "Emerald Isles") {
    // // 底部草地
    // fill(34, 139, 34);
    // rect(0, height - 150, width, 150);

    // // 远处山丘
    // fill(46, 139, 87);
    // ellipse(width * 0.2, height, 600, 300);
    // ellipse(width * 0.8, height + 20, 700, 250);

    // // 小树
    // fill(34, 100, 34);
    // for (let i = 0; i < 5; i++) {
    //   let tx = i * 200 + 100;
    //   let ty = height - 170;
    //   rect(tx, ty, 20, 50);
    //   ellipse(tx + 10, ty - 10, 60, 60);
    // }


  //--------------------------- 第一关 ---------------------------

    // 远处山丘
    noStroke();
    fill(46, 139, 87, 200);
    beginShape();
    curveVertex(-100, height);
    curveVertex(0, height - 100);
    curveVertex(width * 0.3, height - 180);
    curveVertex(width * 0.7, height - 150);
    curveVertex(width, height - 200);
    curveVertex(width + 100, height);
    endShape(CLOSE);

    // 中距离山丘
    fill(34, 139, 34, 220);
    beginShape();
    curveVertex(-100, height);
    curveVertex(0, height - 50);
    curveVertex(width * 0.4, height - 120);
    curveVertex(width * 0.6, height - 90);
    curveVertex(width, height - 140);
    curveVertex(width + 100, height);
    endShape(CLOSE);

    // 底部草地
    fill(34, 139, 34);
    rect(0, height - 150, width, 150);

    // 小树
    fill(34, 100, 34);
    for (let i = 0; i < 5; i++) {
      let tx = i * 200 + 100;
      let ty = height - 170;
      rect(tx, ty, 20, 50);
      ellipse(tx + 10, ty - 10, 60, 60);
    }
 
    // 绘制简单的花朵
    for (let i = 0; i < 20; i++) {
      let fx = i * 50 + 25;
      let fy = height - 20 - (i % 3) * 40;
      noStroke();
      // 花瓣
      fill(255, 192, 203);
      for (let j = 0; j < 5; j++) {
        push();
        translate(fx, fy);
        rotate(j * TWO_PI / 5);
        ellipse(0, -5, 10, 15);
        pop();
      }
      // 花蕊
      fill(255, 255, 0);
      ellipse(fx, fy, 8, 8);
      // 茎
      stroke(0, 100, 0);
      strokeWeight(2);
      line(fx, fy + 5, fx, fy + 20);
    }


  //--------------------------- 第二关 ---------------------------

  } else if (level.levelName === "Lava Castle") {
    // 天空背景（暗红色调，半透明）
    let skyGradient = drawingContext.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, color(80, 0, 0, 150));  // 添加 alpha 值 150
    skyGradient.addColorStop(1, color(150, 30, 0, 150));  // 添加 alpha 值 150
    drawingContext.fillStyle = skyGradient;
    rect(0, 0, width, height);
  
    // 远处的火山
    push();
    translate(200, height - 280);
    noStroke();
    
    // 火山主体
    fill(50, 0, 0);
    beginShape();
    vertex(-200, 280);
    vertex(0, 0);
    vertex(200, 280);
    endShape(CLOSE);
  
    // 火山口
    fill(255, 80, 0);
    ellipse(0, 20, 60, 30);
    fill(255, 150, 0);
    ellipse(0, 25, 40, 20);
  
    pop();
  
    // 主要熔岩河
    fill(255, 100, 0, 220);
    beginShape();
    for (let x = 0; x <= width; x += 20) {
      let y = height - 80 + sin(x * 0.05 + frameCount * 0.02) * 10;
      vertex(x, y);
    }
    vertex(width, height);
    vertex(0, height);
    endShape(CLOSE);
  
    // 熔岩泡泡
    for (let i = 0; i < 10; i++) {
      let bubbleX = (i * width / 10 + frameCount * 0.5) % width;
      let bubbleY = height - 60 - abs(sin(frameCount * 0.02 + i) * 40);
      fill(255, 200, 0, 150);
      ellipse(bubbleX, bubbleY, 20, 20);
      fill(255, 255, 0, 200);
      ellipse(bubbleX - 2, bubbleY - 2, 8, 8);
    }
  
    // 城堡
    push();
    translate(700, height - 300);
    
    // 主塔
    fill(100, 20, 20);
    rect(0, 0, 200, 300);
    
    // 石块纹理
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 10; j++) {
        stroke(80, 10, 10);
        strokeWeight(1);
        line(i * 14, j * 30, (i + 1) * 14, j * 30);
      }
    }
    
    // 塔顶
    fill(80, 10, 10);
    beginShape();
    vertex(0, 0);
    vertex(100, -50);
    vertex(200, 0);
    endShape(CLOSE);
    
    // 窗户
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        // 窗户框
        fill(60, 10, 10);
        rect(35 + j * 100, 45 + i * 80, 30, 50);
        // 窗户玻璃
        fill(255, 150, 0, 150);
        rect(40 + j * 100, 50 + i * 80, 20, 40);
        // 窗框横条
        stroke(60, 10, 10);
        strokeWeight(2);
        line(40 + j * 100, 70 + i * 80, 60 + j * 100, 70 + i * 80);
      }
    }
    
    // 城垛
    fill(120, 30, 30);
    for (let i = 0; i < 10; i++) {
      rect(i * 20, -10, 15, 20);
      // 城垛阴影
      fill(90, 20, 20);
      rect(i * 20 + 2, -8, 11, 16);
    }
    
    // 侧塔
    push();
    translate(220, 50);
    fill(90, 15, 15);
    rect(0, 0, 80, 250);
    // 石块纹理
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 8; j++) {
        stroke(70, 10, 10);
        strokeWeight(1);
        line(i * 14, j * 30, (i + 1) * 14, j * 30);
      }
    }
    fill(70, 10, 10);
    triangle(0, 0, 40, -30, 80, 0);
    // 窗户
    fill(60, 10, 10);
    rect(25, 25, 30, 40);
    fill(255, 150, 0, 150);
    rect(30, 30, 20, 30);
    rect(30, 80, 20, 30);
    pop();
    
    pop();
  
    // 前景的岩石
    fill(60, 0, 0);
    beginShape();
    vertex(0, height);
    vertex(50, height - 30);
    vertex(120, height - 20);
    vertex(200, height);
    endShape(CLOSE);
  
    beginShape();
    vertex(width - 200, height);
    vertex(width - 150, height - 40);
    vertex(width - 80, height - 30);
    vertex(width, height - 50);
    vertex(width, height);
    endShape(CLOSE);
  }




  //--------------------------- 第三关 ---------------------------
  else if (level.levelName === "Celestial Citadel") {
   {
    // 🌤 柔和的天空背景（马卡龙渐变色）
    let skyGradient = drawingContext.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, color(250, 220, 250, 220)); // 淡粉色
    skyGradient.addColorStop(0.5, color(220, 250, 255, 200)); // 薄荷蓝
    skyGradient.addColorStop(1, color(200, 230, 250, 180)); // 淡蓝白
    drawingContext.fillStyle = skyGradient;
    rect(0, 0, width, height);


    // 🌈 漂浮的梦幻光球
    for (let i = 0; i < 4; i++) {
        let orbX = (i * width / 4 + frameCount * 0.5) % width;
        let orbY = height / 3 + sin(i * 1.5 + frameCount * 0.02) * 20;
        noFill();
        stroke(255, 220, 180, 120);
        strokeWeight(4);
        ellipse(orbX, orbY - 30, 40, 40);
    }

    // 🌍 漂浮的大理石浮岛
    push();
    translate(350, height - 500);
    fill(245, 240, 255);
    beginShape();
    vertex(-160, 140);
    vertex(0, 0);
    vertex(160, 140);
    vertex(110, 200);
    vertex(-110, 200);
    endShape(CLOSE);


    pop();

    // 🏰 重新设计的 Celestial Citadel（天穹城堡）
    push();
    translate(600, height - 550);

    // 城堡主体（奶油白 + 淡粉）
    fill(255, 250, 255);
    rect(0, 0, 240, 340, 20);

    // 立柱（柔和色调）
    for (let i = 0; i < 6; i++) {
        fill(230, 230, 250);
        rect(40 * i + 15, 0, 20, 340);
    }

    // 屋顶（粉紫色圆顶）
    fill(220, 190, 255);
    ellipse(120, -50, 250, 120);

    // 发光窗户（奶油金色）
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 2; j++) {
            fill(255, 240, 180, 200);
            rect(45 + j * 110, 70 + i * 90, 35, 55, 8);
            stroke(255, 210, 140);
            line(45 + j * 110, 95 + i * 90, 80 + j * 110, 95 + i * 90);
        }
    }

    // 城垛（柔和光晕装饰）
    fill(250, 250, 255);
    for (let i = 0; i < 12; i++) {
        rect(i * 20, -10, 18, 25, 5);
        fill(255, 220, 200, 180);
        ellipse(i * 20 + 9, -18, 14, 7);
    }

    // 侧塔（童话风格尖塔）
    push();
    translate(260, 70);
    fill(250, 250, 255);
    rect(0, 0, 100, 300, 15);
    fill(220, 190, 255);
    triangle(0, 0, 50, -50, 100, 0);

    // 侧塔窗户
    fill(255, 230, 160, 200);
    rect(30, 50, 40, 50, 10);
    rect(30, 120, 40, 50, 10);
    pop();

    pop();

    // 💫 轻盈浮空阶梯
    for (let i = 0; i < 6; i++) {
        let stepX = width / 2 - 100 + i * 50;
        let stepY = height - 300 + i * 30;
        fill(255, 250, 250, 180);
        rect(stepX, stepY, 60, 20, 10);
    }

    }


  }





  //--------------------------- 第四关 ---------------------------
  else if (level.levelName === "Shadow Realm") {
   {
    // 🌌 梦幻暗影背景（渐变蓝紫色+马卡龙色迷雾）
    let skyGradient = drawingContext.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, color(140, 130, 200, 220)); // 柔和紫色
    skyGradient.addColorStop(0.5, color(100, 110, 180, 200)); // 深蓝紫
    skyGradient.addColorStop(1, color(80, 90, 150, 180)); // 深蓝色
    drawingContext.fillStyle = skyGradient;
    rect(0, 0, width, height);

    // // 🌫 远处漂浮的梦幻迷雾
    // for (let i = 0; i < 3; i++) {
    //     let mistX = (i * width / 3 + frameCount * 0.3) % width;
    //     let mistY = height / 2 + sin(i * 1.5 + frameCount * 0.02) * 30;
    //     fill(200, 180, 255, 80);
    //     ellipse(mistX, mistY, 400, 120);
    // }

    // 🌑 幽蓝漂浮地面
    fill(60, 50, 120);
    rect(0, height - 220, width, 220);

    fill(100, 90, 180, 100);
    ellipse(width * 0.3, height - 200, 450, 130);
    ellipse(width * 0.6, height - 220, 550, 160);

    // 🌲 梦幻扭曲树木（马卡龙色调）
    for (let i = 0; i < 4; i++) {
        let tx = i * 280 + 100;
        let ty = height - 230;

        // 树干
        fill(120, 90, 180);
        rect(tx, ty, 18, 80);

        // 扭曲树冠（马卡龙色的幽光）
        fill(180, 150, 220, 200);
        ellipse(tx + 10, ty - 40, 80, 90);
        fill(140, 200, 230, 150);
        ellipse(tx - 25, ty - 10, 55, 45);
        ellipse(tx + 45, ty - 15, 55, 45);
    }

    // ✨ 远处漂浮的幽灵光球
    for (let i = 0; i < 6; i++) {
        let orbX = (i * width / 6 + frameCount * 0.4) % width;
        let orbY = height / 3 + sin(i * 1.2 + frameCount * 0.03) * 25;
        fill(220, 200, 250, 120);
        ellipse(orbX, orbY, 30, 30);
    }

  }
}


  //--------------------------- 第五关 ---------------------------
  else if (level.levelName === "Crystal Caverns") {
   {
    // 💎 水晶洞穴背景（冰蓝 + 浅紫渐变）
    let skyGradient = drawingContext.createLinearGradient(0, 0, 0, height);
    skyGradient.addColorStop(0, color(200, 220, 255, 220)); // 冰蓝色
    skyGradient.addColorStop(0.5, color(170, 200, 255, 200)); // 浅紫蓝
    skyGradient.addColorStop(1, color(140, 180, 255, 180)); // 淡蓝紫
    drawingContext.fillStyle = skyGradient;
    rect(0, 0, width, height);

    // 🏔 洞穴地面（发光晶石地板）
    fill(100, 160, 220);
    rect(0, height - 150, width, 150);

    fill(80, 140, 200);
    rect(0, height - 220, width, 70);

    // ✨ 远景中的悬浮水晶碎片
    for (let i = 0; i < 4; i++) {
        let fragmentX = (i * width / 4 + frameCount * 0.4) % width;
        let fragmentY = height / 3 + sin(i * 1.2 + frameCount * 0.03) * 20;
        fill(120, 200, 255, 150);
        beginShape();
        vertex(fragmentX, fragmentY);
        vertex(fragmentX + 15, fragmentY - 40);
        vertex(fragmentX + 30, fragmentY);
        endShape(CLOSE);
    }

    // 🌟 水晶簇（细节丰富）
    for (let i = 0; i < 5; i++) {
        let cx = i * 250 + 100;
        let cy = height - 220;

        // 主水晶（高光）
        fill(150, 220, 255);
        beginShape();
        vertex(cx, cy);
        vertex(cx + 15, cy - 80);
        vertex(cx + 30, cy);
        endShape(CLOSE);

        // 侧面水晶
        fill(120, 200, 255);
        beginShape();
        vertex(cx + 25, cy);
        vertex(cx + 40, cy - 50);
        vertex(cx + 55, cy);
        endShape(CLOSE);

        // 另一侧
        fill(100, 180, 230);
        beginShape();
        vertex(cx - 20, cy);
        vertex(cx - 5, cy - 60);
        vertex(cx + 10, cy);
        endShape(CLOSE);

        // ✨ 水晶反光（增加高光）
        stroke(255, 255, 255, 180);
        strokeWeight(2);
        line(cx + 10, cy - 40, cx + 15, cy - 75);
        line(cx - 5, cy - 30, cx, cy - 60);
        line(cx + 30, cy - 20, cx + 35, cy - 45);
    }
    
    }
  }

  pop();
}


// =========================
// 附加：画“精美雪花”与“真实雾气”相关的函数
// =========================

// 画更精美的雪花
function drawFancySnowflake(s, index) {
  push();
  translate(s.position.x - cameraX, s.position.y);

  // 如果没落地则让雪花旋转（落地后就不再旋转，可根据需求决定是否继续转）
  // if (!s.stopped) {
  //   rotate(frameCount * 0.01 + index);
  // }

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

// // 随机生成一个雾团形状（不规则多边形），可自行调整实现
// function generateRandomFogShape() {
//   // 用于控制雾团大小
//   let baseRadius = random(20, 40);
//   let vertexCount = floor(random(5, 8));

//   let shapePoints = [];
//   for (let i = 0; i < vertexCount; i++) {
//     let angle = map(i, 0, vertexCount, 0, TWO_PI);
//     // 在baseRadius附近随机波动
//     let r = baseRadius + random(-10, 10);
//     let x = r * cos(angle);
//     let y = r * sin(angle);
//     shapePoints.push(createVector(x, y));
//   }
//   return shapePoints;
// }

// // 自定义雾粒子的绘制
// function drawFogParticle(f) {
//   push();
//   translate(f.position.x - cameraX, f.position.y);
//   noStroke();

//   // 让雾的透明度根据剩余寿命慢慢变化
//   let alpha = map(f.lifetime, 0, f.maxLifetime, 0, 180);
//   fill(200, 200, 200, alpha);

//   // 用不规则多边形来表现雾团
//   beginShape();
//   for (let v of f.fogShape) {
//     // 可加入一点噪声抖动，让雾边缘不断轻微变化
//     // 这样会显得更“活”，不过消耗稍微大一点
//     let noiseVal = noise(v.x * 0.01 + fogNoiseOffset, v.y * 0.01 + fogNoiseOffset);
//     let offset = map(noiseVal, 0, 1, -2, 2);
//     vertex(v.x + offset, v.y + offset);
//   }
//   endShape(CLOSE);

//   pop();
// }
