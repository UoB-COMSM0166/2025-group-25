// =========================
// 道具类
// =========================

class Item {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.width = 30;
    this.height = 30;
    this.type = type;
    this.collected = false;
    this.bounceSpeed = 0.05; // 跳动速度
    this.bounceHeight = 1;   // 跳动高度
    this.time = 0;  // 时间变量，用来控制跳动的效果
  }

  update() {
    // 用sin函数来模拟上下跳动
    if (this.type === "Heart" && !this.collected) {
      // 用sin函数来模拟心形上下跳动
      this.time += this.bounceSpeed;  // 增加时间，控制跳动
      this.position.y += Math.sin(this.time) * this.bounceHeight;  // 用sin值控制上下跳动的幅度
    }
  }

  draw() {
    if (!this.collected) {
      push();
      translate(this.position.x, this.position.y);
      textSize(12);
      textAlign(CENTER, CENTER);

      if (this.type === "Flame Element") {
        fill(255, 100, 0);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("FG", this.width / 2, this.height / 2);
      } else if (this.type === "Freeze Element") {
        fill(0, 150, 255);
        rect(0, 0, this.width, this.height, 5);
        fill(255);
        text("FrG", this.width / 2, this.height / 2);
      } else if (this.type === "Strengthen") {
        fill(150);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("GS", this.width / 2, this.height / 2);
      } else if (this.type === "Invincibility") {
        fill(255, 215, 0);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("INV", this.width / 2, this.height / 2);
      } /*else if (this.type === "Heart") {
        fill(255, 0, 0);
        ellipse(this.width / 2, this.height / 2, this.width, this.height);
      } */
     else if (this.type === "Heart") {
        // 加载图片并显示
        let scaleFactor = 3; // 放大倍数
        image(heartImg, 0, 0, this.width * scaleFactor, this.height * scaleFactor); // 调整宽高以放大图像  
      }
     else if (this.type === "Double Jump") {
        fill(0, 255, 0);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("2J", this.width / 2, this.height / 2);
      }else if (this.type === "Dash") { // ✅ 新增 Dash 道具
        fill(0, 255, 255);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("Dash", this.width / 2, this.height / 2);
      }else if (this.type === "Teleport Scroll") {
        fill(0, 150, 255); // 蓝色
        rect(0, 0, this.width, this.height, 5);
        fill(255);
        text("TP", this.width / 2, this.height / 2);
    }   else if (this.type === "Thunder Element") {
        fill(255, 255, 0);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("TH", this.width / 2, this.height / 2);
    }
     /*else if (this.type === "Mystery Box") {
        fill(100, 0, 200);
        rect(0, 0, this.width, this.height, 5);
        fill(255);
        text("Box", this.width / 2, this.height / 2);
      } */
      pop();
    }
  }

  collect() {
    this.collected = true;
    
    if (player.firstItemPickup && this.type !== "Heart") {       // 新增
      player.itemPickupMessage = "Press Z to use item";
      player.messageTimer = 120; // 显示提示 2 秒
      player.firstItemPickup = false; // 之后不再显示提示
    }
     // ✅ **播放拾取音效**
    if (pickItemSound) {
      console.log("🎵 拾取道具，播放音效！");
      pickItemSound.play();
    } else {
      console.error("❌ `pickItemSound` 未定义，无法播放拾取音效！");
    }


    // 如果是Mystery Box，会在Level类里额外逻辑处理
    if (this.type === "Flame Element") {
      player.currentItem = "Flame Element";
    } else if (this.type === "Freeze Element") {
      player.currentItem = "Freeze Element";
    } else if (this.type === "Strengthen") {
      player.currentItem = "Greatsword";
    } else if (this.type === "Invincibility") {
      player.invincibleTimer = 5; // 5秒无敌
    } else if (this.type === "Heart") {
      player.lives = min(player.lives + 1, 5); // 生命值+1，最多5个
    } else if (this.type === "Dash") { // ✅ 启用冲刺
      player.canDash = true;
    }
    
      if (this.type === "Teleport Scroll") {
        player.hasTeleport = true;
        player.currentItem = "Teleport Scroll";
        console.log("📜 玩家获得瞬移卷轴!");
      }
    
    
  }
}
