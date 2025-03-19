
// HUD (顶部信息显示)
// =========================

function drawHUD() {
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);

  let timeStr = nf(gameTimer, 2, 2);
  text("Level" + level.levelNumber +": " + level.levelName, 20, 20);
  text("Time: " + timeStr + " s", 20, 50);
  text("Lives: ", 20, 80);
  text("Coins: " + player.coins + " / " + level.totalCoins, 20, 110);
  text("Item: " + (player.currentItem ? player.currentItem : "None"), 20, 140);
  text("Weather: " + weatherState, 20, 170);
  // text("TimeOfDay: " + nf(timeOfDay, 1, 1) + "h", 20, 200);
  // text("Mode: " + mode, 20, 230);
  // ✅ **用图片显示生命值**
  let heartX = 90;  // 生命图标的 X 位置
  let heartY = 65;  // 生命图标的 Y 位置
  let heartSize = 50; // 生命图标大小
  let heartSpacing = 35; // 每个heart的水平间隔

  for (let i = 0; i < player.lives; i++) {
    image(heartImg, heartX + i * heartSpacing, heartY, heartSize, heartSize);
  }//xin~~~~
}

// Credits (游戏制作团队名单)
// =========================
//
// 在游戏中添加一个 Credits 页面，显示游戏制作团队名单。

// let currentImage; // 当前显示的图片
// let images = [];  // 存储图片数组
// let currentIndex = 0; // 当前图片索引

// function preload() {
//   images = [
//     loadImage("img1.png"),
//     loadImage("img2.png"),
//     loadImage("img3.png"),
//     loadImage("img4.png"),
//     loadImage("img5.png")
//   ];
// }

// function showCredits() {
//   currentIndex = 0;  // 确保从第一张开始
//   currentImage = images[currentIndex];
//   gameState = "credits";
// }

// function drawCredits() {
//   background(20);

//   // 计算居中位置
//   let imageWidth = width / 2 - 70;
//   let imageHeight = height * 0.6; // 让图片占比 60% 高度
//   let imageX = 50;
//   let imageY = (height - imageHeight) / 2; // 让图片垂直居中

//   let boxWidth = width / 2 - 100;
//   let boxHeight = height * 0.6; // 让文本区域也占 60% 高度
//   let textX = width / 2 + 50;
//   let textY = (height - boxHeight) / 2; // 让文本区域垂直居中

//   // 显示图片
//   if (currentImage) {
//     image(currentImage, imageX, imageY, imageWidth, imageHeight);
//   } else {
//     fill(255, 0, 0);
//     textSize(24);
//     textAlign(CENTER, CENTER);
//     text("Error: Image not loaded", imageX + imageWidth / 2, imageY + imageHeight / 2);
//   }

//   // 右侧 Credits 信息
//   fill(0, 0, 0, 150);
//   rect(textX - 20, textY - 20, boxWidth + 40, boxHeight + 40, 10);

//   fill(255);
//   textAlign(CENTER, TOP);
//   textSize(36);
//   text("Credits", textX + boxWidth / 2, textY);

//   textSize(24);
//   let teamMembers = ["        ","Rui Xiong","Cailing Yang", "Junjie Yan", "Shuao Zhang", "Kexing Zhang"];
//   let lineSpacing = 50;
//   for (let i = 0; i < teamMembers.length; i++) {
//     text(teamMembers[i], textX + boxWidth / 2, textY + 80 + i * lineSpacing);
//   }

//   // 底部返回主菜单提示
//   textSize(20);
//   text("Press M to return to Main Menu", width / 2, height - 50);
// }


// function mousePressed() {
//   let imageX = 50, imageY = 200;
//   let imageWidth = width / 2 - 70;
//   let imageHeight = height - 250;

//   if (mouseX > imageX && mouseX < imageX + imageWidth && mouseY > imageY && mouseY < imageY + imageHeight) {
//     currentIndex = (currentIndex + 1) % images.length;
//     currentImage = images[currentIndex];
//   }
// }

// function keyPressed() {
//   if (key === 'M') {
//     gameState = "mainMenu";
//   }
// }

// =============================
// Credits.js
// 你可以直接将此文件替换/合并到你的工程中
// =============================

// =============================
// Credits.js (精简版，只加载并显示1张图片)
// =============================

// 单张图片对象
let creditImage;

function preload() {
  // 只加载一张图片 C1
  creditImage = loadImage("assets/C1.png");
}

function showCredits() {
  // 进入 Credits 场景
  gameState = "credits";
}

function drawCredits() {
  background(20);

  // 计算左侧图片区域的尺寸与位置
  let imageWidth = width / 2 - 70;
  let imageHeight = height * 0.6; 
  let imageX = 50;
  let imageY = (height - imageHeight) / 2;

  // 显示左侧图片
  if (creditImage) {
    image(creditImage, imageX, imageY, imageWidth, imageHeight);
  } else {
    fill(255, 0, 0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Error: Image not loaded", imageX + imageWidth / 2, imageY + imageHeight / 2);
  }

  // 右侧 Credits 信息区域
  let boxWidth = width / 2 - 100;
  let boxHeight = height * 0.6; 
  let textX = width / 2 + 50;
  let textY = (height - boxHeight) / 2;

  // 半透明背景，提升文字可读性
  fill(0, 0, 0, 150);
  rect(textX - 20, textY - 20, boxWidth + 40, boxHeight + 40, 10);

  // 显示文字
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

  // 底部提示信息
  textSize(20);
  text("Press M to return to Main Menu", width / 2, height - 50);
}

function mousePressed() {
  // 去掉了点击切换图片的逻辑，这里可以留空或者删掉
}

function keyPressed() {
  if (key === 'M') {
    gameState = "mainMenu";
  }
}

