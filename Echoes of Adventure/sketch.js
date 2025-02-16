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
let currentScene = "menu";    // "menu", "instructions", "levelSelect", "level", "gameover", "win", "credits"
let currentLevelIndex = 0;
let levels = [];             // 在 setupLevels() 中赋值
let player;                  // Player 实例
let level;                   // 当前关卡 Level 实例
let projectiles = [];        // 投射物数组
let gameTimer = 0;           // 关卡计时
let levelTimes = [];         // 记录每关耗时
let cameraX = 0;             // 摄像机偏移

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

// 全局粒子（爆炸等）
let globalParticles = [];

// 夜晚星星
let starPositions = [];

// 自定义字体
let myFont;

// =========================
// p5.js 核心
// =========================

function preload() {
  // 如果需要自定义字体，可在此处加载
  //textFont("Press Start 2P");
  myFont = loadFont('Round9x13.ttf');
}

function setup() {
  createCanvas(1280, 720);
  textFont(myFont);
  setupLevels();        // 初始化关卡数据
  switchScene("menu");  // 默认进入主菜单
}


function draw() {
  // 1. 更新天气 & 粒子
  updateWeather();
  updateParticles();

  // 2. 根据场景绘制
  if (currentScene === "menu") {
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
            enemy.frozen = true;
            projectiles.splice(i, 1);
            break;
          }
        }
      } else if (proj instanceof BombProjectile) {
        if (proj.exploded) {
          let explosionRadius = proj.explosionRadius;
          for (let j = level.enemies.length - 1; j >= 0; j--) {
            let enemy = level.enemies[j];
            let d = dist(
              proj.position.x,
              proj.position.y,
              enemy.position.x + enemy.width / 2,
              enemy.position.y + enemy.height / 2
            );
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
  currentScene = sceneName;
  gameTimer = 0;
  projectiles = [];

  if (sceneName === "menu") {
    currentLevelIndex = 0;
    levelTimes = []; // 清空统计
  }

  if (sceneName === "level") {
    let config = levels[currentLevelIndex];
    level = new Level(config);
    player = new Player(config.playerStart);
  }
}

// =========================
// 键盘事件
// =========================

function keyPressed() {
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