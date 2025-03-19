// =========================
// Game Over
// =========================
function keyPressed() {
  if (currentScene === "gameOver") {
    if (key === "M" || key === "m") {
      switchScene("menu");

      // ✅ 播放点击音效zkx~~~~~~~
      if (clickSound) clickSound.play();
    }
  }
}

function drawGameOver() {
  background(0);
  textAlign(CENTER, CENTER);
  
  // 绘制标题 "Game Over"：红色、大字体，放在画面上半部分
  fill(255, 0, 0);
  textSize(70);
  text("Game Over", width / 2, height / 2 - 100);
  
  // 绘制说明文字：白色、小字体，放在标题下方，间距适中
  fill(255);
  textSize(36);
  text("Restart this Level -> Press 'P' then 'R'", width / 2, height / 2 - 20);
  text("Return to Menu -> Press 'M'", width / 2, height / 2 + 30);
}
