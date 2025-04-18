function keyPressed() {
  if (currentScene === "win") {
    if (key === "M" || key === "m") {
      switchScene("menu");
      if (clickSound) clickSound.play();
    }
    if (key === "Q" || key === "q") {
      switchScene("credits");
      if (clickSound) clickSound.play();
    }
  }
}

let winPlayed = false;
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
  //Ensure that the victory sound effect is only played once zkx~~~`
  if (winSound && !winPlayed) {
    winSound.play();
    winPlayed = true;
  }
}