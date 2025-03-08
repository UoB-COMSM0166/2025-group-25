// =========================
// 游戏胜利界面
// =========================
function keyPressed() {
  if (currentScene === "win") {
    if (key === "M" || key === "m") {
      switchScene("menu");

      // ✅ 播放点击音效~~~~~~~~~
      if (clickSound) clickSound.play();
    }
    if (key === "Q" || key === "q") {
      switchScene("credits");

      // ✅ 播放点击音效
      if (clickSound) clickSound.play();
    }
  }
}

let winPlayed = false; // ✅ 记录是否已经播放胜利音效
function drawWin() {
  background(0, 100, 0);
  textAlign(CENTER, CENTER);
  fill(255);
  textSize(48);
  text("You Win!", width / 2, 100);

  textSize(32);
  let yPos = 180;
  for (let rec of levelTimes) {
    text(rec.level + ": " + nf(rec.time, 2, 2) + " seconds", width / 2, yPos);
    yPos += 40;
  }

  textSize(24);
  text("Press Q to view credits", width / 2, yPos + 20);
  text("Press M to return to Menu", width / 2, height - 80);
  // ✅ **确保胜利音效只播放一次**zkx~~~`
  if (winSound && !winPlayed) {
    console.log("🎵 播放胜利音效...");
    winSound.play();
    winPlayed = true; // ✅ 记录已经播放过
  }
}