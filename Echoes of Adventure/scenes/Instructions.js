function drawInstructions() {
  // **改进1: 让背景半透明，而不是完全黑色**
  fill(0, 180); // 半透明黑色，能看到 Main Menu
  rect(0, 0, width, height);

  // **改进2: 重新调整文本排版，让每个部分不会重叠**
  let padding = 60; // 边距
  let boxWidth = (width - 2 * padding) / 2;
  let boxHeight = (height - 140 - padding) / 2;

  let x1 = padding, x2 = padding + boxWidth;
  let y1 = 120, y2 = 120 + boxHeight;

  // **标题**
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(36);
  textStyle(BOLD);
  text("Instructions", width / 2, 60);

  // **绘制四个半透明区域**
  drawRoundedBox(x1, y1, boxWidth, boxHeight);
  drawRoundedBox(x2, y1, boxWidth, boxHeight);
  drawRoundedBox(x1, y2, boxWidth, boxHeight);
  drawRoundedBox(x2, y2, boxWidth, boxHeight);

  // 🎮 **左上角 - 控制方式 (蓝色)**
  // fill(180, 220, 255);
  // textSize(28);
  // text("Controls", x1 + boxWidth / 2, y1 + 40);
  
  // fill(255);
  // textSize(20);
  // let controlsText = "1: Move\n2: SPACE Jump\n3: Z Attack";
  // drawCenteredText(controlsText, x1 + boxWidth / 2, y1 + boxHeight / 2 + 10);

  // 🎮 **Upper Left - Controls (Blue)**
  fill(180, 220, 255);
  textSize(28);
  text("Controls", x1 + boxWidth / 2, y1 + 40);

  fill(255);
  textSize(20);
  let controlsText = "1: Use WASD keys or arrow keys and space to move\n2: Right mouse button or Z key to attack\n3: Character can double jump";
  drawCenteredText(controlsText, x1 + boxWidth / 2, y1 + boxHeight / 2 + 10);


  // 🎯 **右上角 - 目标 (绿色)**
  // fill(200, 255, 200);
  // textSize(28);
  // text("Goal", x2 + boxWidth / 2, y1 + 40);

  // fill(255);
  // textSize(20);
  // let goalText = "1: Collect 15 coins\n2: Enter portal to win\n3: Cope with weather challenges";
  // drawCenteredText(goalText, x2 + boxWidth / 2, y1 + boxHeight / 2 + 10);

  fill(200, 255, 200);
  textSize(28);
  text("Goal", x2 + boxWidth / 2, y1 + 40);

  fill(255);
  textSize(20);
  let goalText = "1: Collect all coins to open the exit door\n2: Overcome various weather challenges";
  drawCenteredText(goalText, x2 + boxWidth / 2, y1 + boxHeight / 2 + 10);

  // 🛠 **左下角 - 道具 (紫色)**
  // fill(220, 200, 255);
  // textSize(28);
  // text("Items", x1 + boxWidth / 2, y2 + 40);

  // fill(255);
  // textSize(20);
  // let itemsText = "1: Flame Gun, Freeze Gun\n2: Greatsword, Bomb\n3: Invincibility, Heart\n4: Mystery Box, Double Jump";
  // drawCenteredText(itemsText, x1 + boxWidth / 2, y2 + boxHeight / 2 + 10);

  fill(220, 200, 255);
  textSize(28);
  text("Items", x1 + boxWidth / 2, y2 + 40);

  fill(255);
  textSize(20);
  let itemsText = "1: Ranged weapons: Flame Gun, Freeze Gun\n2: Melee weapons: Sword, Bomb\n3: Health item: Heart";
  drawCenteredText(itemsText, x1 + boxWidth / 2, y2 + boxHeight / 2 + 10);

  // ⚠ **右下角 - 障碍 (浅红色)**
  // fill(255, 180, 180);
  // textSize(28);
  // text("Obstacles", x2 + boxWidth / 2, y2 + 40);

  // fill(255);
  // textSize(20);
  // let obstaclesText = "1: Flames, Gears, Blades\n2: Spiked Walls, Axes, Saws\n3: Laser, Falling Spikes";
  // drawCenteredText(obstaclesText, x2 + boxWidth / 2, y2 + boxHeight / 2 + 10);

  fill(255, 180, 180);
  textSize(28);
  text("Obstacles", x2 + boxWidth / 2, y2 + 40);

  fill(255);
  textSize(20);
  let obstaclesText = "1: Monsters: Spider, Frog, Ghost, Bat\n2: Objects: Gears, Axe, Spikes";
  drawCenteredText(obstaclesText, x2 + boxWidth / 2, y2 + boxHeight / 2 + 10);

  // 退出提示
  fill(255, 150, 150);
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Press M to return to Main Menu", width / 2, height - 40);
}

// 🎯 **文本居中函数**
function drawCenteredText(txt, x, y) {
  textAlign(CENTER, CENTER);
  let lines = txt.split("\n");
  let lineHeight = 24; // 适当缩小行间距
  let startY = y - (lines.length * lineHeight) / 2;
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], x, startY + i * lineHeight);
  }
}

// 🎨 **绘制半透明的圆角矩形**
function drawRoundedBox(x, y, w, h) {
  fill(50, 150); // 半透明背景
  rect(x, y, w - 10, h - 10, 10);
}
