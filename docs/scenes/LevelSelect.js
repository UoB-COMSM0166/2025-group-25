let levelBg;


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function drawLevelSelect() {
  background(30);
  
  // **绘制背景图片**
  image(levelBg, 0, 0, width, height);

  textAlign(CENTER, CENTER);

  // **标题动态浮动**
  let titleOffset = sin(frameCount * 0.05) * 10;

  // **计算标题的宽度**
  textSize(72);
  textStyle(BOLD);
  let titleText = "Select a Level";
  let titleWidth = textWidth(titleText) + 80; // 让背景更宽，保持和 `drawMenu()` 统一
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

  // **底部返回菜单提示**
  textSize(20);
  let backText = "Press M to return to Main Menu";
  let backHeight = 20 * 1.2;

  // **计算整体毛玻璃背景大小**
  let boxWidth = max(titleWidth, 500); // 让宽度和主菜单一样，最少 500px
  let boxHeight = titleHeight + menuHeight + backHeight + 80; // 额外留点空隙
  let boxX = (width - boxWidth) / 2;
  let boxY = height / 2 - boxHeight / 2 + titleOffset; // **整体随标题浮动**

  // **绘制半透明背景**
  noStroke();
  fill(0, 0, 0, 120); // 半透明黑色背景
  rect(boxX, boxY, boxWidth, boxHeight, 20);

  // **白色半透明层（模拟毛玻璃）**
  fill(255, 255, 255, 30);
  rect(boxX, boxY, boxWidth, boxHeight, 20);

  // **绘制标题（带黑色描边）**
  drawTextWithOutline(titleText, width / 2, boxY + titleHeight / 2, 72, 5);

  // **绘制关卡选项**
  textSize(28);
  textStyle(NORMAL);
  let startY = boxY + titleHeight + 20; // **选项从标题下方开始**
  for (let i = 0; i < levelItems.length; i++) {
    drawTextWithOutline(levelItems[i], width / 2, startY + i * lineSpacing, 28, 3);
  }

  // **绘制返回主菜单的提示**
  textSize(20);
  drawTextWithOutline(backText, width / 2, boxY + boxHeight - 30, 20, 2);
}

// **封装带黑色描边的文字绘制函数**
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
