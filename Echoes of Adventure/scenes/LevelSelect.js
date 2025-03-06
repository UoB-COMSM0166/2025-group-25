// =========================
// 关卡选择界面
// =========================

function drawLevelSelect() {
  background(30);
  noStroke();
  fill(50, 150, 200);
  rect(0, 0, width, height);

  textAlign(CENTER, CENTER);
  textSize(36);
  fill(255);
  text("Select a Level", width / 2, 100);

  textSize(24);
  text("Press 1: Emerald Isles", width / 2, 180);
  text("Press 2: Lava Castle", width / 2, 220);
  text("Press 3: Celestial Citadel", width / 2, 260);
  text("Press 4: Shadow Realm", width / 2, 300);
  text("Press 5: Crystal Caverns", width / 2, 340);

  textSize(20);
  text("Press M to return to Main Menu", width / 2, height - 80);
}