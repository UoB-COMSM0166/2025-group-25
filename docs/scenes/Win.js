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
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(48);
  text("Mission Accomplished!", width / 2, 80);
  textSize(32);
  text("You collected:", width / 2, 140);

  const iconSize = 48;
  const lineGap  = iconSize + 20;
  const items = [
    { img: appleImg,   label: "Apple",   count: 10, factor: 0.04 },
    { img: bananaImg,  label: "Banana",  count: 10, factor: 0.03 },
    { img: rubbishImg, label: "Rubbish", count: 11, factor: 0.05 },
    { img: bottleImg,  label: "Bottle",  count: 9,  factor: 0.20 },
    { img: boxImg,     label: "Box",     count: 10, factor: 0.25 }
  ];

  textSize(28);
  for (let i = 0; i < items.length; i++) {
    const { img, label, count, factor } = items[i];
    const saved = nf(count * factor, 1, 2);
    const lineStr = `${label}: ${count}  (CO2 saved: ${saved} kg)`;

    textAlign(LEFT, CENTER);
    const tw = textWidth(lineStr);
    const totalW = iconSize + 20 + tw;

    const x = width / 2 - totalW / 2;
    const y = 180 + i * lineGap;

    imageMode(CORNER);
    image(img, x, y, iconSize, iconSize);
    text(lineStr, x + iconSize + 20, y + iconSize / 2);
  }

  const baseY = 180 + items.length * lineGap + 40;
  textAlign(CENTER, CENTER);
  textSize(24);
  text("Your efforts help heal the lands of Echoes of Adventure.", width / 2, baseY);
  text("Nature is truly grateful for your dedication!",           width / 2, baseY + 30);

  textSize(24);
  text("Press M to return to Menu", width / 2, height - 40);
  text("Press Q to view Credits",   width / 2, height - 80);

  if (winSound && !winPlayed) {
    winSound.play();
    winPlayed = true;
  }
}




