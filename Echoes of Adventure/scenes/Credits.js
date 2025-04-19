function drawHUD() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);

  let timeStr = nf(gameTimer, 2, 2);
  text("Level" + level.levelNumber +": " + level.levelName, 20, 20);
  text("Time: " + timeStr + " s", 20, 50);
  text("Lives: ", 20, 80);
  text("Rabbish: " + player.coins + " / " + level.totalCoins, 20, 110);
  text("Item: " + (player.currentItem ? player.currentItem : "None"), 20, 140);
  text("Weather: " + weatherState, 20, 170);
  // text("TimeOfDay: " + nf(timeOfDay, 1, 1) + "h", 20, 200);
  // text("Mode: " + mode, 20, 230);

  let heartX = 90;
  let heartY = 65;
  let heartSize = 50;
  let heartSpacing = 35;

  for (let i = 0; i < player.lives; i++) {
    image(heartImg, heartX + i * heartSpacing, heartY, heartSize, heartSize);
  }//xin~~~~
}

let creditImage;

function preload() {
  creditImage = loadImage("assets/C1.png");
}

function showCredits() {
  gameState = "credits";
}

function drawCredits() {
  background(20);
  let imageWidth = width / 2 - 70;
  let imageHeight = height * 0.6; 
  let imageX = 50;
  let imageY = (height - imageHeight) / 2;

  if (creditImage) {
    image(creditImage, imageX, imageY, imageWidth, imageHeight);
  } else {
    fill(255, 0, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Error: Image not loaded", imageX + imageWidth / 2, imageY + imageHeight / 2);
  }

  let boxWidth = width / 2 - 100;
  let boxHeight = height * 0.6; 
  let textX = width / 2 + 50;
  let textY = (height - boxHeight) / 2;

  fill(0, 0, 0, 150);
  rect(textX - 20, textY - 20, boxWidth + 40, boxHeight + 40, 10);
  fill(255);
  textAlign(CENTER, TOP);
  textSize(36);
  text("Credits", textX + boxWidth / 2, textY);

  textSize(24);
  let teamMembers = [
    "        ",
    "Rui Xiong",
    "Cailing Yang",
    "Junjie Yan",
    "Shuao Zhang",
    "Kexin Zhang"
  ];
  let lineSpacing = 50;
  for (let i = 0; i < teamMembers.length; i++) {
    text(teamMembers[i], textX + boxWidth / 2, textY + 80 + i * lineSpacing);
  }

  textSize(20);
  text("Press M to return to Main Menu", width / 2, height - 50);
}

function mousePressed() {


  
}

function keyPressed() {
  if (key === 'M') {
    gameState = "mainMenu";
  }
}

