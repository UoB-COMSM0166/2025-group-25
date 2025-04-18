let menuBg;

function preload() {
  
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {

  if (gameState === "mainMenu") {
    drawMenu();
  } else if (gameState === "credits") {
    drawCredits();
  }

}


function drawMenu() {
  background(30);
  

  image(menuBg, 0, 0, width, height);
  

  let titleOffset = sin(frameCount * 0.05) * 10;

  textAlign(CENTER, CENTER);


  textSize(72);
  textStyle(BOLD);
  let titleText = "Echoes of Adventure";
  let titleWidth = textWidth(titleText) + 80;
  let titleHeight = 72 * 1.2; 
  let menuItems = [
    "                           ",
    "Press 1 : Invincible Mode  /  Press 2 : Normal Mode",
    //"Press 2 : Normal Mode",
    "                           ",
    "Collect all the coins to complete the level",
    "Press I to view instructions",
  ];
  let lineSpacing = 50;
  let menuHeight = menuItems.length * lineSpacing;
  let boxWidth = titleWidth;
  let boxHeight = titleHeight + menuHeight + 60;
  let boxX = (width - boxWidth) / 2;
  let boxY = height / 2 - 150 + titleOffset - titleHeight / 2 - 10;


  noStroke();
  fill(0, 0, 0, 120);
  rect(boxX, boxY, boxWidth, boxHeight, 20);
  fill(255, 255, 255, 30);
  rect(boxX, boxY, boxWidth, boxHeight, 20);
  drawTextWithOutline(titleText, width / 2, height / 2 - 150 + titleOffset, 72, 5);


  let startY = height / 2 - 80 + titleOffset;
  for (let i = 0; i < menuItems.length; i++) {
    let fontSize = 28; 
 
    if (
      menuItems[i] === "Collect all the coins to complete the level" ||
      menuItems[i] === "Press I to view instructions"
    ) {
      fontSize = 24;
    }
    drawTextWithOutline(menuItems[i], width / 2, startY + i * lineSpacing, fontSize, 3);
  }
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

function keyPressed() {
  if (key === '1') {
    //Invincible Mode
  } else if (key === '2') {
    //Normal Mode
  } else if (key === 'I') {
    //Instruction
  } else if (key === 'C') {

    showCredits(); 
  }
}
