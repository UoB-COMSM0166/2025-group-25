function keyPressed() {
  if (currentScene === "gameOver") {
    if (key === "M" || key === "m") {
      switchScene("menu");
      if (clickSound) clickSound.play();
    }
  }
}

function drawGameOver() {
  background(0);
  textAlign(CENTER, CENTER);

  fill(255, 0, 0);
  textSize(70);
  text("Game Over", width / 2, height / 2 - 100);
  

  fill(255);
  textSize(36);
  text("Restart this Level -> Press 'P' then 'R'", width / 2, height / 2 - 20);
  text("Return to Menu -> Press 'M'", width / 2, height / 2 + 30);
}
