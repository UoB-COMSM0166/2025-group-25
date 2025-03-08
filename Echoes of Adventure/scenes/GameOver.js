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
  fill(255, 0, 0);
  textSize(48);
  text("Game Over", width / 2, height / 2);

  textSize(24);
  text("Press M to return to Menu", width / 2, height / 2 + 50);
}