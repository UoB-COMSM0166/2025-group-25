// =========================
// Credits 界面
// =========================

function drawCredits() {
  background(20);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(32);
  text("Credits", width / 2, 60);

  textSize(24);
  let lines = [
    "制作：百里守约",
    "美术：公孙离",
    "音效：蔡文姬",
    "特别鸣谢：王者荣耀"
  ];
  let startY = 160;
  let lineHeight = 40;
  for (let i = 0; i < lines.length; i++) {
    text(lines[i], width / 2, startY + i * lineHeight);
  }

  textSize(20);
  text("Press M to return to Main Menu", width / 2, height - 80);
}

// =========================
// HUD (顶部信息显示)
// =========================

function drawHUD() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);

  let timeStr = nf(gameTimer, 2, 2);
  text("Time: " + timeStr + " s", 20, 20);
  text("Level: " + level.levelName, 20, 50);
  text("Lives: " + player.lives, 20, 80);
  text("Coins: " + player.coins + " / " + level.totalCoins, 20, 110);
  text("Item: " + (player.currentItem ? player.currentItem : "None"), 20, 140);
  text("Weather: " + weatherState, 20, 170);
  text("TimeOfDay: " + nf(timeOfDay, 1, 1) + "h", 20, 200);
  text("Mode: " + mode, 20, 230);
}