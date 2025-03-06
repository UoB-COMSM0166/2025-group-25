class StoryScene {
    constructor() {
      this.backgroundImg = null;  // ✅ 防止 `loadImage()` 出错
      this.textLines = [
        "Echoes of Adventure", // ✅ 在最上方加标题
        "",
        "In the ancient and mysterious world of Echoes of Adventure,",
        "the land nurtures five magical continents: Emerald Isles, Lava Castle,",
        "Celestial Citadel, Shadow Realm, and Crystal Caverns.",
        "However, a sudden catastrophe struck, disrupting the balance of elemental power.",
        "You are a brave little fox, gifted with ancient elemental powers.",
        "To restore balance, you must traverse storms, evade dangers,",
        "collect elemental energy, and defeat dark creatures.",
        "Only by gathering the mystic coins can you unlock the portal to the next continent.",
        "The adventure is about to begin. Are you ready?",
        "",
        "[ Click anywhere to skip the story ]" // ✅ 在最下方加跳过提示
      ];
      
  
      this.startTime = millis();
      this.imageDelay = 1000;  // ✅ 2 秒的背景图停留时间
      this.fadeInDuration = 800; // ✅ 文字淡入时间为 10 秒
      this.storyDuration = 15000; // ✅ 总时间 14 秒
      this.textIndex = 0;
      this.lineSpacing = 40;
  
      this.loadBackground(); // ✅ 加载背景图片
    }
  
    loadBackground() {
      this.backgroundImg = loadImage("assets/story_background.png", 
        () => console.log("✅ 背景图片加载成功"),
        () => console.error("❌ 背景图片加载失败，检查路径！")
      );
    }
  
    update() {
      if (millis() - this.startTime > this.storyDuration) {
        console.log("⏳ 背景故事播放完毕，切换到主菜单...");
        switchScene("menu"); // ✅ 5秒后进入菜单
      }
    }
  
    draw() {
      background(0);
      
      if (this.backgroundImg) {
        tint(255, 180); // ✅ 70% 透明度
        image(this.backgroundImg, 0, 0, width, height);
        noTint(); // ✅ 取消透明度影响
      } else {
        fill(50);
        rect(0, 0, width, height); // ⚠️ 图片加载失败时用灰色背景代替
      }
    
      let elapsed = millis() - this.startTime;
      let textElapsed = elapsed - this.imageDelay; // ✅ 2 秒后才开始显示文字
    
      textAlign(CENTER, CENTER);
      textSize(26);
    
      if (textElapsed >= 0) { // ✅ 2 秒后才开始显示文字
        for (let i = 0; i < this.textLines.length; i++) {
          let y = height / 5 + i * this.lineSpacing;
          let alpha = map(textElapsed - i * 800, 0, this.fadeInDuration, 0, 255);
          alpha = constrain(alpha, 0, 255);
          
          // ✅ 让标题加大加粗
          if (i === 0) {
            textSize(36);
            strokeWeight(6); // 更粗的黑色描边
          } else if (i === this.textLines.length - 1) {
            textSize(20); // ✅ 跳过提示稍小
            strokeWeight(3);
          } else {
            textSize(26);
            strokeWeight(4);
          }
  
          // ✅ 让黑色描边也渐变，而不是先出现
          stroke(0, alpha); // 黑色描边跟随透明度
          strokeWeight(4);
          fill(255, 255, 255, alpha); // ✅ 白色文字同步淡入
          text(this.textLines[i], width / 2, y);
        }
      }
    }
    
  
    mousePressed() {
      console.log("🎮 背景故事被跳过");
      switchScene("menu"); // ✅ 鼠标点击跳过背景故事
    }
  }
  