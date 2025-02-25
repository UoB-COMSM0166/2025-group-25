// =========================
// 主菜单
// =========================

function drawMenu() {
  background(30);
  noStroke();
  fill(50, 150, 200);
  rect(0, 0, width, height);

  titleOffset = sin(frameCount * 0.05) * 10;

  textAlign(CENTER, CENTER);
  fill(255);
  textSize(48);
  text("Echoes of Adventure", width / 2, height / 2 - 150 + titleOffset);

  textSize(24);
  text("Press 1 for Invincible Mode", width / 2, height / 2 - 50 + titleOffset);
  text("Press 2 for Normal Mode", width / 2, height / 2 + 0 + titleOffset);
  text("Press I to view instructions", width / 2, height / 2 + 50 + titleOffset);
}