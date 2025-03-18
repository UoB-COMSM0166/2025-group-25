/*
Echoes of Adventure
修复&改进版：背景更精美、子弹发射修复、Credits文字不重叠

----------------------------------
【主要修复和改动】
1. drawLevelDecor(level): 为每个关卡绘制了更丰富的背景场景（山峰、火山、城堡、晶体等）。
2. 修复子弹射击：现在子弹从玩家位置发射，而不再从屏幕左侧出现。
3. 修复 Credits 文字重叠：改为多行绘制。
----------------------------------
*/

// =========================
// 全局变量
// =========================


let storyScene; // 新增：StoryScene 实例
let currentScene = "story"; // ✅ 让游戏默认进入背景故事界面
// let currentScene = "menu";    // "menu", "instructions", "levelSelect", "level", "gameover", "win", "credits"
let currentLevelIndex = 0;
let levels = [];             // 在 setupLevels() 中赋值
let player;                  // Player 实例
let level;                   // 当前关卡 Level 实例
let projectiles = [];        // 投射物数组
let gameTimer = 0;           // 关卡计时
let levelTimes = [];         // 记录每关耗时
let cameraX = 0;             // 摄像机偏移
let spiderSpritesheet;
let birdSpritesheet;
let batFrames = [];
let advancedBirdSpritesheet;
let ghostAppearFrames = [];
let ghostDisappearFrames = [];

let spikedWallImg;
let sawsImg;
let frogIdle, frogJump, frogFall;
// let portalImage;
let platformImage = {};//ycl

let heartImg;
let lives = 3;   
let maxLives = 5; //xin~~~~~

//添加音效zkx
let coinSound;//zkx~~~~~~~
let storyMusic; //zkx~~~~~~
let rainSound; 
let jumpSound; 
let gameOverSound; // 存储 Game Over 音效
let attackSound;
let clickSound;
let pickItemSound; // 存储拾取道具音效
let runSound; // 存储行进音效
let levelWinSound;
let winSound; // 存储胜利音效

// 受伤闪屏
let damageFlashAlpha = 0;

// 开始界面标题动画
let titleOffset = 0;

// 游戏模式
let mode = "normal"; // "normal" / "invincible"

// 天气 & 昼夜
let timeOfDay = 12;          // 0~24
let weatherState = "clear";  // "clear", "rain", "thunderstorm"
let weatherTimer = 0;
let rainParticles = [];      // 存储雨滴粒子
let thunderFlash = false;
let groundImage;
// 全局粒子（爆炸等）
let globalParticles = [];

// 夜晚星星
let starPositions = [];

// 自定义字体
let myFont;

let settings; // 新增：Settings 实例

// =========================
// p5.js 核心
// =========================

function preload() {
  // 如果需要自定义字体，可在此处加载
  //textFont("Press Start 2P");
  myFont = loadFont('Round9x13.ttf');
  coinImage = loadImage("assets/Coin.png"); 


  
  frogIdle = loadImage("assets/frog-idle-1.png");
  frogJump = loadImage("assets/frog-jump-1.png");
  frogFall = loadImage("assets/frog-fall.png");
  
  
  
  coinSound = loadSound("sound/coins.mp3");//zkx~~~~~~~
  storyMusic = loadSound("sound/storyscene.mp3");//背景介绍
  clickSound = loadSound("sound/click.mp3");//鼠标点击
  rainSound = loadSound("sound/rain.mp3");//雨天
  snowSound = loadSound("sound/snow.wav");//雪天
  jumpSound = loadSound("sound/jump.wav");//跳
  attackSound = loadSound("sound/biu.mp3");//攻击敌人
  pickItemSound = loadSound("sound/pickitem.mp3")//拾取item
  aaaSound = loadSound("sound/aaa.mp3");//live-1
  gameOverSound = loadSound("sound/gameover.mp3");//gameover
  levelWinSound = loadSound("sound/level-win.mp3", 
    () => console.log("✅ 关卡胜利音效加载成功！"),
    () => console.error("❌ level-win.mp3 加载失败，请检查路径！")
  );
  winSound = loadSound("sound/win.mp3");
  runSound = loadSound("sound/run.mp3");
  


  //platformImage = loadImage("assets/Grass_Tileset.png");
  //ycl-加载添加不同关卡的图片
  // platformImage = {
  //   1: loadImage("assets/Grass_Tileset.png"),
  //   2: loadImage("assets/Platform.png"),
  //   3: loadImage("assets/Platform2.png"),
  //   4: loadImage("assets/Circular_Saw.png"),
  //   5: loadImage("assets/tile_0000.png"),
  // };
  platformImage = {
    '#': loadImage("assets/Grass_Oneway.png"),
    'a': loadImage("assets/a.png"),
    'b': loadImage("assets/b.png"),
    'c': loadImage("assets/c.png"),
    'd': loadImage("assets/d.png"),
    'e': loadImage("assets/e.png"),
    'h': loadImage("assets/h.png"),
    'i': loadImage("assets/i.png"),
    'j': loadImage("assets/j.png"),
    'k': loadImage("assets/k.png"),
    'l': loadImage("assets/l.png"),
    'm': loadImage("assets/m.png"),
    'o': loadImage("assets/o.png"),
    'u': loadImage("assets/u.png"),
    'v': loadImage("assets/v.png"),
  };

  groundImage = loadImage("assets/Grass_Tileset.png");
  spiderSpritesheet = loadImage("assets/Spider_1.png"); 
  birdSpritesheet = loadImage("assets/Bird_1.png");
  advancedBirdSpritesheet = loadImage("assets/Bird_2.png");
  axeSprite = loadImage("assets/Axe_Trap.png");
  heartImg = loadImage("assets/heart.png");
  spikedWallImg = loadImage('assets/spikedwall.png');
  sawsImg = loadImage("assets/saws.png");
  heartImg = loadImage("assets/heart.png"); //xin~~~
  
  //Rui
  // 加载鬼魂的 "Appear" 帧动画
  for (let i = 0; i < 4; i++) {
    ghostAppearFrames[i] = loadImage(`assets/appear_frame_${i + 1}.png`);
  }

  // 加载鬼魂的 "Disappear" 帧动画
  for (let i = 0; i < 4; i++) {
    ghostDisappearFrames[i] = loadImage(`assets/disappear_frame_${i + 1}.png`);
  }

  batFrames[0] = loadImage("assets/bat-fly1.png");
  batFrames[1] = loadImage("assets/bat-fly2.png");
  batFrames[2] = loadImage("assets/bat-fly3.png");

  //ZSA 新增：加载关卡背景
  levelOneBg = loadImage("assets/levelone.png");
  levelTwoBg = loadImage("assets/levetwo.png");
  levelThreeBg = loadImage("assets/levelthree.png");
  levelFourBg = loadImage("assets/levelfour.png");
  levelFiveBg = loadImage("assets/levefive.png");
  levelBg = loadImage("assets/levelbg.png");
  menuBg = loadImage("assets/menubg.png");

  img1 = loadImage("assets/C1.png");
  img2 = loadImage("assets/C2.png");
  img3 = loadImage("assets/C3.png");
  img4 = loadImage("assets/C4.png");
  img5 = loadImage("assets/C5.png");

  creditImage = loadImage("assets/C1.png");
  
}

function setup() {
  if (typeof userStartAudio === "function") {
    userStartAudio();
  } // 允许播放音频kx~~~~~~~~~~
  createCanvas(1280, 720);
  storyScene = new StoryScene(); // ✅ 初始化背景故事界面
  textFont(myFont);

  settings = new Settings();  // ✅ 初始化设置界面
  setupLevels(settings);      // ✅ 传入 settings 实例

  switchScene("story"); //这个地方一定是story，不是meun，因为我们要先看故事！！！很关键
}

/*function drawHearts() {
  for (let i = 0; i < player.lives; i++) {
    image(heartImg, 20 + i * 40, 20, 30, 30);
  }
}*/

function draw() {
  // 1. 更新天气 & 粒子
  updateWeather();
  updateParticles();
  background(0);

  // 如果设置界面打开，直接绘制设置界面
  if (settings.isOpen) {
    settings.draw();
    return;
  }

  // 2. 根据场景绘制  //修改
  if (currentScene === "story") {
    storyScene.update();
    storyScene.draw();
  
  } else if (currentScene === "menu") {
    drawMenu();

  } else if (currentScene === "instructions") {
    drawInstructions();

  } else if (currentScene === "levelSelect") {
    drawLevelSelect();

  } else if (currentScene === "level") {
    // 绘制动态背景（天空、云、星空等），不受 cameraX 影响
    drawDynamicBackground(level);

    // 摄像机跟随
    if (level) {
      let levelWidth = level.portalPosition.x + 200;
      cameraX = constrain(
        player.position.x - width / 2,
        0,
        levelWidth - width
      );
    }

    // 推栈，进行平移
    push();
    translate(-cameraX, 0);

    // 更新并绘制关卡
    if (level) {
      level.update();
      level.draw();
    }

    // 更新并绘制玩家
    if (player) {
      player.update();
      player.draw();
    }

    // 处理投射物
    for (let i = projectiles.length - 1; i >= 0; i--) {
      let proj = projectiles[i];
      proj.update();
      proj.draw();

      // 移除过期
      if (proj.isExpired()) {
        projectiles.splice(i, 1);
        continue;
      }

      // 碰撞逻辑
      if (proj instanceof FlameProjectile) {
        for (let j = level.enemies.length - 1; j >= 0; j--) {
          let enemy = level.enemies[j];
          if (
            collides(
              proj.position.x,
              proj.position.y,
              20,
              10,
              enemy.position.x,
              enemy.position.y,
              enemy.width,
              enemy.height
            )
          ) {
            spawnExplosion(proj.position.x, proj.position.y);
            level.enemies.splice(j, 1);
            projectiles.splice(i, 1);
            break;
          }
        }
      } else if (proj instanceof FreezeProjectile) {
       //Rui
        for (let j = level.enemies.length - 1; j >= 0; j--) {
          let enemy = level.enemies[j];
          if (
            collides(
              proj.position.x, proj.position.y, 20, 10,
              enemy.position.x, enemy.position.y, enemy.width, enemy.height
            )
          ) {
            enemy.frozen = true;
            enemy.isSolidWhenFrozen = true;  // 敌人冻结后变硬
            projectiles.splice(i, 1);
            break;
          }
        }
      } else if (proj instanceof ThunderProjectile) {
        /*
        if (proj.exploded) {
          let explosionRadius = proj.explosionRadius;
          for (let j = level.enemies.length - 1; j >= 0; j--) {
            let enemy = level.enemies[j];
            let d = dist(proj.position.x, proj.position.y, enemy.position.x, enemy.position.y);

            if (d < explosionRadius) {
              spawnExplosion(proj.position.x, proj.position.y);
              level.enemies.splice(j, 1);
            }
          }
          projectiles.splice(i, 1);
        }*/
          if (proj.exploded) {
            let explosionRadius = proj.explosionRadius;
            for (let j = level.enemies.length - 1; j >= 0; j--) {
              let enemy = level.enemies[j];
              let d = dist(proj.position.x, proj.position.y, enemy.position.x, enemy.position.y);
        
              if (d < explosionRadius) {
                spawnExplosion(proj.position.x, proj.position.y);
                level.enemies.splice(j, 1);
              }
            }
            projectiles.splice(i, 1);
          }
    }
    }

    pop();

    // 3. 绘制天气效果（雨、雷），覆盖在游戏场景之上
    drawWeather();
    //drawHearts(lives); // 这里的 lives 是当前玩家的命数（1~3）xin~~~~~~~


    // 4. 受伤闪红
    if (damageFlashAlpha > 0) {
      noStroke();
      fill(255, 0, 0, damageFlashAlpha);
      rect(0, 0, width, height);
      damageFlashAlpha = max(0, damageFlashAlpha - 5);
    }

    // HUD
    updateGameTimer();
    drawHUD();

    // 检查关卡完成
    if (
      level.portal &&
      level.allCoinsCollected() &&
      player.collidesWith(level.portal)
    ) {
      levelTimes.push({ level: level.levelName, time: gameTimer });
      currentLevelIndex++;
      if (currentLevelIndex < levels.length) {
        switchScene("level");
      } else {
        switchScene("win");
      }
    }

    // 检查游戏结束
    if (player.lives <= 0) {
      switchScene("gameover");
    }

  } else if (currentScene === "gameover") {
    drawGameOver();

  } else if (currentScene === "win") {
    drawWin();

  } else if (currentScene === "credits") {
    drawCredits();
  }

  // 5. 最后绘制全局粒子（如爆炸等）
  drawParticles();

  settings.drawGlobalSettingsButton(); // ✅ 所有界面右上角添加“SET”按钮
}

// =========================
// 函数：更新关卡时间
// =========================

function updateGameTimer() {
  gameTimer += deltaTime / 1000;
}

// =========================
// 函数：场景切换
// =========================

function switchScene(sceneName) {
  console.log(`🔄 切换场景: ${sceneName}`); // ✅ Debug log
  currentScene = sceneName;
  gameTimer = 0;
  projectiles = [];
  // ✅ **如果离开 "level" 场景，停止行进音效**
  if (sceneName !== "level") {

    if (runSound && runSound.isPlaying()) {
      console.log("⏹️ 退出关卡，停止行进音效...");
      runSound.stop();
    }
    if (rainSound && rainSound.isPlaying()) {
      console.log("⏹️ 切换到非游戏场景，停止雨天音效...");
      rainSound.stop();
    }
    if (snowSound && snowSound.isPlaying()) {
      console.log("⏹️ 切换到非游戏场景，停止雪天音效...");
      snowSound.stop();
    }
    /*if (levelWinSound && levelWinSound.isPlaying()) {
      console.log("⏹️ 停止关卡胜利音效...");
      levelWinSound.stop();
    }*/
  }

  // ✅ **离开 "win" 场景时，停止胜利音效**
  if (sceneName !== "win" && winSound && winSound.isPlaying()) {
    console.log("⏹️ 退出胜利界面，停止胜利音效...");
    winSound.stop();
  }
  // ✅ **确保 `clickSound` 不在通关时覆盖 `levelWinSound`**
  if (!["level", "win"].includes(sceneName)) {
    if (clickSound) {
        console.log("🎵 在切换场景时播放点击音效");
        clickSound.play();
    }
  }

  if (sceneName === "menu") {
    currentLevelIndex = 0;
    levelTimes = []; // 清空统计
  }
  // ✅ 确保切换场景时播放音效zkx~~~~~~
  if (clickSound) {
    console.log("🎵 在切换场景时播放点击音效");
    clickSound.play();
  } else {
    console.error("❌ clickSound 未定义，无法播放点击音效！");
  }
  // ✅ **如果离开 "level" 场景，立即停止 `level-win.mp3`**
  if (!["level","win"].includes(sceneName)) {
    if (levelWinSound && levelWinSound.isPlaying()) {
        console.log("⏹️ 退出 `level` 场景，停止 `level-win.mp3`...");
        levelWinSound.stop();
    }
  }

  // ✅ **如果进入 `story` 场景，确保背景音乐播放**
  if (sceneName === "story") {
    if (storyMusic && !storyMusic.isPlaying()) {
      console.log("🎵 进入 StoryScene，播放背景音乐...");
      userStartAudio(); // 解锁音频
      storyMusic.setVolume(0.6);
      storyMusic.loop();
    }
  } else {
    // ✅ **如果离开 `story` 场景，停止背景音乐**
    if (storyMusic && storyMusic.isPlaying()) {
      console.log("⏹️ 退出 StoryScene，停止背景音乐...");
      storyMusic.stop();
    }
  }

  if (sceneName === "level") {
    let config = levels[currentLevelIndex];

    // **清空旧关卡敌人**
    if (level) {
      level.enemies = [];
    }

    // **创建新关卡，确保 `spiderSpritesheet` 传入**
    level = new Level(config, spiderSpritesheet);
    player = new Player(config.playerStart);
    // ✅ **检查是否是通过传送门进入，并且当前关卡不是 `level 1`**
    // ✅ **检查是否是通过传送门进入，并且 `level > 1`**
    if (currentLevelIndex > 1) {
        console.log("✅ 通过通关门进入 `level " + currentLevelIndex + "`，播放 `level-win.mp3`...");
        if (levelWinSound) {
            levelWinSound.play();
        }
        sessionStorage.removeItem("enteredFromPortal"); // **清除标志**
    } else {
        console.log("❌ 直接进入关卡（非通关门），不播放 `level-win.mp3`");
        levelWinSound.play();
    }

    // **调试信息**
    //console.log(` 进入关卡 "${config.levelName}"`);
    //console.log(" 生成的敌人:", level.enemies);

    if (!level.levelName) {
        console.error("Level name is undefined! Check level config.");
    }
  }
}


// =========================
// 键盘事件
// =========================

function keyPressed() {
  
  if (settings.isOpen) {
    switch (key) {
      case "R": case "r":
        switchScene("level"); // 重新开始本关卡
        settings.toggle();
        break;
      case "M": case "m":
        switchScene("menu"); // 返回主菜单
        settings.toggle();
        break;
      case "I": case "i":
        switchScene("instructions"); // 查看游戏说明
        settings.toggle();
        break;
      case "S": case "s":
        settings.toggleSound(); // 切换声音
        break;
      // 🆕 新增全屏切换
      case "F": case "f":
        settings.toggleFullscreen();
        break;
      case "P": case "p":
        settings.toggle(); // 关闭设置界面
        break;

    }
    return;
  }

  // 游戏内按 P 打开设置
  if (key === "P" || key === "p") {
    settings.toggle();
  }
  
  if (currentScene === "menu") {
    if (key === "1") {
      mode = "invincible";
      switchScene("levelSelect");
    }
    if (key === "2") {
      mode = "normal";
      switchScene("level");
    }
    if (key === "I" || key === "i") {
      switchScene("instructions");
    }
    if (keyCode === ENTER) {
      mode = "normal";
      switchScene("level");
    }

  } else if (currentScene === "instructions") {
    if (key === "M" || key === "m") {
      switchScene("menu");
    }

  } else if (currentScene === "levelSelect") {
    if (key >= "1" && key <= "5") {
      currentLevelIndex = int(key) - 1;
      switchScene("level");
    }
    if (key === "M" || key === "m") {
      switchScene("menu");
    }

  } else if (currentScene === "level") {
    if (key === " ") {
      player.jump();
    }
    if (key === "Z" || key === "z") {
      player.attack();
    }

  } else if (currentScene === "gameover") {
    if (key === "M" || key === "m") {
      switchScene("menu");
    }

  } else if (currentScene === "win") {
    if (key === "M" || key === "m") {
      switchScene("menu");
    }
    if ((key === "Q" || key === "q") && currentScene !== "credits") {
      switchScene("credits");
    }

  } else if (currentScene === "credits") {
    if (key === "M" || key === "m") {
      switchScene("menu");
    }
  }
}

// 🖱️ 鼠标点击：全局检测 SET 按钮和设置界面按钮
function mousePressed() {
  if (clickSound) {
    clickSound.play();
    console.log("🖱️ 播放点击音效！");//zkx~~~~~~~~~
  }
  
  settings.handleMouseClick(mouseX, mouseY);
  if (currentScene === "level") {
    player.attack();
}

  if (currentScene === "story") {
    storyScene.mousePressed(); // 🎮 允许鼠标点击跳过故事
  }
}