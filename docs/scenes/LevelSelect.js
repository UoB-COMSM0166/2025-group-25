let levelBg;


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function drawLevelSelect() {
  background(30);

  image(levelBg, 0, 0, width, height);

  textAlign(CENTER, CENTER);

  //Make the title dynamically float
  let titleOffset = sin(frameCount * 0.05) * 10;

  textSize(72);
  textStyle(BOLD);
  let titleText = "Select a Level";
  let titleWidth = textWidth(titleText) + 80; //Make the background wider and maintain consistency with 'drawMenu()'
  let titleHeight = 72 * 1.2;

  // **关卡选项**
  textSize(28);
  textStyle(NORMAL);
  let levelItems = [
    "                      ",
    "Press 1: Emerald Isles",
    "Press 2: Lava Castle",
    "Press 3: Celestial Citadel",
    "Press 4: Shadow Realm",
    "Press 5: Crystal Caverns"
  ];
  let lineSpacing = 50;
  let menuHeight = levelItems.length * lineSpacing;


  textSize(20);
  let backText = "Press M to return to Main Menu";
  let backHeight = 20 * 1.2;

  let boxWidth = max(titleWidth, 500); //Make the width the same as the main menu, at least 500px
  let boxHeight = titleHeight + menuHeight + backHeight + 80;
  let boxX = (width - boxWidth) / 2;
  let boxY = height / 2 - boxHeight / 2 + titleOffset; //Floating overall with the title

  noStroke();
  fill(0, 0, 0, 120);
  rect(boxX, boxY, boxWidth, boxHeight, 20);
  fill(255, 255, 255, 30);
  rect(boxX, boxY, boxWidth, boxHeight, 20);
  drawTextWithOutline(titleText, width / 2, boxY + titleHeight / 2, 72, 5);

  textSize(28);
  textStyle(NORMAL);
  let startY = boxY + titleHeight + 20;
  for (let i = 0; i < levelItems.length; i++) {
    drawTextWithOutline(levelItems[i], width / 2, startY + i * lineSpacing, 28, 3);
  }

  textSize(20);
  drawTextWithOutline(backText, width / 2, boxY + boxHeight - 30, 20, 2);
}

function drawTextWithOutline(txt, x, y, txtSize, outlineWeight) {
  textSize(txtSize);
  textStyle(BOLD);
  
  fill(0);
  for (let dx = -outlineWeight; dx <= outlineWeight; dx += outlineWeight / 2) {
    for (let dy = -outlineWeight; dy <= outlineWeight; dy += outlineWeight / 2) {
      text(txt, x + dx, y + dy);
    }
  }

  fill(255);
  text(txt, x, y);
}
