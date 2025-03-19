// let menuBg;

// // function preload() {
// //   menuBg = loadImage("menubg.png"); // 预加载背景图片
// // }

// function setup() {
//   createCanvas(windowWidth, windowHeight);
// }

// function drawMenu() {
//   background(30);
  
//   // **绘制背景图片**
//   image(menuBg, 0, 0, width, height);
  
//   // **标题动态浮动**
//   let titleOffset = sin(frameCount * 0.05) * 10;

//   textAlign(CENTER, CENTER);

//   // **计算标题宽度**
//   textSize(72);
//   textStyle(BOLD);
//   let titleText = "Echoes of Adventure";
//   let titleWidth = textWidth(titleText) + 80; // 适当增加宽度内边距
//   let titleHeight = 72 * 1.2; // 估算标题高度

//   // **菜单项**
//   textSize(28);
//   textStyle(NORMAL);
//   let menuItems = [
//     "                           ",
//     "Press 1 for Invincible Mode",
//     "Press 2 for Normal Mode",
//     "Press I to view instructions"
//   ];
//   let lineSpacing = 50;
//   let menuHeight = menuItems.length * lineSpacing; // 计算菜单总高度

//   // **计算整个毛玻璃背景的大小**
//   let boxWidth = titleWidth; // 宽度等于标题宽度
//   let boxHeight = titleHeight + menuHeight + 60; // **增加间距，确保完整覆盖**
//   let boxX = (width - boxWidth) / 2; // 居中
//   let boxY = height / 2 - 150 + titleOffset - titleHeight / 2 - 10; // **向上调整，让标题完全被覆盖**

//   // **绘制半透明背景**
//   noStroke();
//   fill(0, 0, 0, 120); // 半透明黑色背景
//   rect(boxX, boxY, boxWidth, boxHeight, 20); // 圆角 20px

//   // **白色半透明层（模拟毛玻璃）**
//   fill(255, 255, 255, 30);
//   rect(boxX, boxY, boxWidth, boxHeight, 20);

//   // **绘制标题（带黑色描边）**
//   drawTextWithOutline(titleText, width / 2, height / 2 - 150 + titleOffset, 72, 5);

//   // **绘制菜单选项（带黑色描边）**
//   textSize(28);
//   textStyle(NORMAL);
//   let startY = height / 2 - 80 + titleOffset; // 让菜单随标题浮动
//   for (let i = 0; i < menuItems.length; i++) {
//     drawTextWithOutline(menuItems[i], width / 2, startY + i * lineSpacing, 28, 3);
//   }
// }

// // **封装一个带黑色描边的文字绘制函数**
// function drawTextWithOutline(txt, x, y, txtSize, outlineWeight) {
//   textSize(txtSize);
//   textStyle(BOLD);
  
//   fill(0); // 黑色描边
//   for (let dx = -outlineWeight; dx <= outlineWeight; dx += outlineWeight / 2) {
//     for (let dy = -outlineWeight; dy <= outlineWeight; dy += outlineWeight / 2) {
//       text(txt, x + dx, y + dy);
//     }
//   }

//   fill(255); // 白色文字
//   text(txt, x, y);
// }

let menuBg;

function preload() {
  // 如果你想预加载菜单背景，可以在这里执行
  // menuBg = loadImage("menubg.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  // 当游戏状态是菜单时，绘制菜单
  if (gameState === "mainMenu") {
    drawMenu();
  } else if (gameState === "credits") {
    drawCredits(); // 这里是你的 Credits 逻辑（需要你的 Credits.js 里对应的函数）
  }
  // 其它游戏状态...
}

// function drawMenu() {
//   background(30);
  
//   // 背景图片
//   image(menuBg, 0, 0, width, height);
  
//   // 标题动态浮动
//   let titleOffset = sin(frameCount * 0.05) * 10;

//   textAlign(CENTER, CENTER);

//   // 计算标题宽度
//   textSize(72);
//   textStyle(BOLD);
//   let titleText = "Echoes of Adventure";
//   let titleWidth = textWidth(titleText) + 80;
//   let titleHeight = 72 * 1.2; 

//   // 菜单选项 —— 在这里新增 "Press C to view Credits"
//   textSize(28);
//   textStyle(NORMAL);
//   let menuItems = [
//     "                           ",
//     "Press 1 for Invincible Mode",
//     "Press 2 for Normal Mode",
//     // "                           ",
//     // "Press I to view instructions",
//     // "Collect all the coins to complete the level",

//     //"Press C to view Credits"  // <-- 新增这一行
    
//   ];
//   let lineSpacing = 50;
//   let menuHeight = menuItems.length * lineSpacing;

//   // 计算毛玻璃背景大小
//   let boxWidth = titleWidth;
//   let boxHeight = titleHeight + menuHeight + 60;
//   let boxX = (width - boxWidth) / 2;
//   let boxY = height / 2 - 150 + titleOffset - titleHeight / 2 - 10;

//   // 绘制半透明背景
//   noStroke();
//   fill(0, 0, 0, 120);
//   rect(boxX, boxY, boxWidth, boxHeight, 20);

//   // 白色半透明层（模拟毛玻璃）
//   fill(255, 255, 255, 30);
//   rect(boxX, boxY, boxWidth, boxHeight, 20);

//   // 绘制标题（带黑色描边）
//   drawTextWithOutline(titleText, width / 2, height / 2 - 150 + titleOffset, 72, 5);

//   // 绘制菜单选项（带黑色描边）
//   textSize(28);
//   textStyle(NORMAL);
//   let startY = height / 2 - 80 + titleOffset;
//   for (let i = 0; i < menuItems.length; i++) {
//     drawTextWithOutline(menuItems[i], width / 2, startY + i * lineSpacing, 28, 3);
//   }
// }

// 带描边的文字绘制函数

function drawMenu() {
  background(30);
  
  // 背景图片
  image(menuBg, 0, 0, width, height);
  
  // 标题动态浮动
  let titleOffset = sin(frameCount * 0.05) * 10;

  textAlign(CENTER, CENTER);

  // 计算标题宽度
  textSize(72);
  textStyle(BOLD);
  let titleText = "Echoes of Adventure";
  let titleWidth = textWidth(titleText) + 80;
  let titleHeight = 72 * 1.2; 

  // 菜单选项 —— 在这里新增 "Press C to view Credits"
  let menuItems = [
    "                           ",
    "Press 1 : Invincible Mode  /  Press 2 : Normal Mode",
    //"Press 2 : Normal Mode",
    "                           ",
    "Collect all the coins to complete the level",
    "Press I to view instructions",
    // "Press C to view Credits"  // <-- 新增这一行（如需使用请取消注释）
  ];
  let lineSpacing = 50;
  let menuHeight = menuItems.length * lineSpacing;

  // 计算毛玻璃背景大小
  let boxWidth = titleWidth;
  let boxHeight = titleHeight + menuHeight + 60;
  let boxX = (width - boxWidth) / 2;
  let boxY = height / 2 - 150 + titleOffset - titleHeight / 2 - 10;

  // 绘制半透明背景
  noStroke();
  fill(0, 0, 0, 120);
  rect(boxX, boxY, boxWidth, boxHeight, 20);

  // 白色半透明层（模拟毛玻璃）
  fill(255, 255, 255, 30);
  rect(boxX, boxY, boxWidth, boxHeight, 20);

  // 绘制标题（带黑色描边）
  drawTextWithOutline(titleText, width / 2, height / 2 - 150 + titleOffset, 72, 5);

  // 绘制菜单选项（带黑色描边）
  let startY = height / 2 - 80 + titleOffset;
  for (let i = 0; i < menuItems.length; i++) {
    let fontSize = 28; // 默认字体大小
    // 针对指令与提示行使用较小字体
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
  
  fill(0); // 黑色描边
  for (let dx = -outlineWeight; dx <= outlineWeight; dx += outlineWeight / 2) {
    for (let dy = -outlineWeight; dy <= outlineWeight; dy += outlineWeight / 2) {
      text(txt, x + dx, y + dy);
    }
  }

  fill(255); // 白色文字
  text(txt, x, y);
}

// 在 keyPressed 中添加一个分支，按下 C 时进入 Credits
function keyPressed() {
  if (key === '1') {
    // Invincible Mode
    // TODO: 进入游戏某状态
  } else if (key === '2') {
    // Normal Mode
    // TODO: 进入游戏某状态
  } else if (key === 'I') {
    // 进入 Instruction
  } else if (key === 'C') {
    // 进入 Credits
    showCredits(); // 这里需要调用你在 Credits.js 中定义的 showCredits()，并切换状态
  }
}
