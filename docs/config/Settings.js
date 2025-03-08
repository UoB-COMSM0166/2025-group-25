// =========================
// 🎛️ 游戏设置模块 (Settings.js)
// =========================

class Settings {
    constructor() {
      this.isOpen = false;
      this.buttonX = width - 100; // 右上角 SET 按钮
      this.buttonY = 20;
      this.buttonSize = 60;
  
      this.soundEnabled = true; // 默认开启声音
  
      // 🎯 设置界面按钮区域
      this.buttons = [
        { label: "[R] Restart Level", x: width / 2 - 100, y: 200, action: () => switchScene("level") },
        { label: "[M] Main Menu", x: width / 2 - 100, y: 260, action: () => switchScene("menu") },
        { label: "[I] Instructions", x: width / 2 - 100, y: 320, action: () => switchScene("instructions") },
        { label: "[S] Switching sound", x: width / 2 - 100, y: 380, action: () => this.toggleSound() },
        { label: "[F] Fullscreen", x: width / 2 - 100, y: 440, action: () => this.toggleFullscreen() } // 🆕 新增全屏按钮
      ];
    }
  
    // 🎛️ 切换设置界面
    toggle() {
      this.isOpen = !this.isOpen;
      console.log(`🔧 设置界面 ${this.isOpen ? "打开" : "关闭"}`);
    
      // ✅ 确保播放点击音效
      if (clickSound) {
        console.log("🎵 按 P 关闭设置界面，播放点击音效");
        clickSound.play();
      } else {
        console.error("❌ clickSound 未定义，无法播放点击音效！");
      }
    }
    
  
    // 🎛️ 绘制右上角 SET 按钮
    drawGlobalSettingsButton() {
      if (currentScene !== "level") return;
  
      push();
      fill(100);
      stroke(255);
      strokeWeight(1);
      rect(this.buttonX, this.buttonY, this.buttonSize, this.buttonSize, 10);
      fill(255);
      textSize(18);
      textAlign(CENTER, CENTER);
      text("SET", this.buttonX + this.buttonSize / 2, this.buttonY + this.buttonSize / 2);
      pop();
    }
  
    // 📜 绘制设置界面
    draw() {
      if (!this.isOpen) return;
  
      push();
      fill(50, 50, 50, 220);
      rect(100, 100, width - 200, height - 200, 10);
  
      // 🎯 标题
      fill(255);
      textSize(30);
      textAlign(CENTER, CENTER);
      text("SETTINGS", width / 2, 130);
  
      // 🎯 绘制按钮及其快捷键提示
      this.buttons.forEach((btn) => {
        fill(80);
        rect(btn.x-50, btn.y, 300, 50, 10);
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(btn.label, btn.x + 100, btn.y + 25);
      });
  
      // 🎯 底部提示：按 P 关闭设置界面
      fill(200);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Press [P] to close settings", width / 2, height - 140);
  
      pop();
    }
  
    // 🔍 鼠标点击事件：检测是否点击了按钮
    handleMouseClick(mx, my) {
      // 播放点击音效zkx~~~~~~~~~~~~~
      if (clickSound) {
        clickSound.play();
        console.log("🔧 点击设置按钮音效！");
      }

      // 检测右上角 SET 按钮
      if (
        mx > this.buttonX &&
        mx < this.buttonX + this.buttonSize &&
        my > this.buttonY &&
        my < this.buttonY + this.buttonSize
      ) {
        this.toggle();
        return;
      }
  
      // 检测设置界面按钮点击
      if (this.isOpen) {
        for (let btn of this.buttons) {
          if (mx > btn.x && mx < btn.x + 200 && my > btn.y && my < btn.y + 50) {
            btn.action();
            this.toggle(); // 点击后关闭设置界面
            return;
          }
        }
      }
    }
  
    // 🔊 切换声音状态
    toggleSound() {
      this.soundEnabled = !this.soundEnabled;
      console.log(`Sound ${this.soundEnabled ? "enabled" : "disabled"}.`);
    }
  
    // 🖥️ 全屏切换功能
    toggleFullscreen() {
      let fs = fullscreen();
      fullscreen(!fs);
      console.log(`Fullscreen: ${!fs}`);
    }
  }
  