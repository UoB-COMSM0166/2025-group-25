let storyScene;
let currentScene = "story";
let currentLevelIndex = 0;
let levels = [];            
let player;          
let level;           
let projectiles = [];
let gameTimer = 0;   
let levelTimes = []; 
let cameraX = 0;     
let spiderSpritesheet;
let birdSpritesheet;
let batFrames = [];
let advancedBirdSpritesheet;
let ghostAppearFrames = [];
let ghostDisappearFrames = [];
let spikedWallImg;
let sawsImg;
let frogIdle, frogJump, frogFall;
let platformImage = {};//ycl
let heartImg;
let lives = 3;   
let maxLives = 5; //xin~~~~~
let coinSound;
let storyMusic; //zkx~~~~~~
let rainSound; 
let jumpSound; 
let gameOverSound;
let attackSound;
let clickSound;
let pickItemSound;
let runSound; 
let levelWinSound;
let winSound;
let damageFlashAlpha = 0;
let titleOffset = 0;
let mode = "normal"; // "normal" / "invincible"
let timeOfDay = 12;          // 0~24
let weatherState = "clear";  // "clear", "rain", "thunderstorm"
let weatherTimer = 0;
let rainParticles = [];
let snowParticles = [];
let thunderFlash = false;
let groundImage;
let globalParticles = [];
let starPositions = [];
let myFont;
let settings;

function preload() {

  myFont = loadFont('Round9x13.ttf');
  coinImages = [
    loadImage("assets/apple.png"),
    loadImage("assets/banana.png"),
    loadImage("assets/rabbish.png"),
    loadImage("assets/bottle.png"),
    loadImage("assets/box.png")
  ];

  
  frogIdle = loadImage("assets/frog-idle-1.png");
  frogJump = loadImage("assets/frog-jump-1.png");
  frogFall = loadImage("assets/frog-fall.png");
  
  coinSound = loadSound("sound/rabbish.mp3");//zkx~~~~~~~
  storyMusic = loadSound("sound/storyscene.mp3");
  clickSound = loadSound("sound/click.mp3");
  rainSound = loadSound("sound/rain.mp3");
  snowSound = loadSound("sound/snow.wav");
  jumpSound = loadSound("sound/jump.wav");
  attackSound = loadSound("sound/biu.mp3");
  pickItemSound = loadSound("sound/pickitem.mp3")
  aaaSound = loadSound("sound/aaa.mp3");
  gameOverSound = loadSound("sound/gameover.mp3");
  levelWinSound = loadSound("sound/level-win.mp3");
  winSound = loadSound("sound/win.mp3");
  runSound = loadSound("sound/run.mp3");
  


  //platformImage = loadImage("assets/Grass_Tileset.png");
  //ycl
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

  waterImg = loadImage("assets/Water.png");
  lavaImg  = loadImage("assets/magma.png");
  
  //Rui
  //Load the "Appeal" frame animation of ghosts
  for (let i = 0; i < 4; i++) {
    ghostAppearFrames[i] = loadImage(`assets/appear_frame_${i + 1}.png`);
  }

  //Load the "Disappear" frame animation of ghosts
  for (let i = 0; i < 4; i++) {
    ghostDisappearFrames[i] = loadImage(`assets/disappear_frame_${i + 1}.png`);
  }

  batFrames[0] = loadImage("assets/bat-fly1.png");
  batFrames[1] = loadImage("assets/bat-fly2.png");
  batFrames[2] = loadImage("assets/bat-fly3.png");

  //ZSA: Loading Level Background
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
  } 
  createCanvas(1280, 720);
  storyScene = new StoryScene();
  textFont(myFont);

  settings = new Settings();
  setupLevels(settings);

  switchScene("story"); //This place must be a story, not a meun, because we need to read the story first!!! It's crucial
}

/*function drawHearts() {
  for (let i = 0; i < player.lives; i++) {
    image(heartImg, 20 + i * 40, 20, 30, 30);
  }
}*/

function draw() {
  updateWeather();
  updateParticles();
  background(0);

  if (settings.isOpen) {
    settings.draw();
    return;
  }

  //Draw//modify according to the scene
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
    //Draw dynamic backgrounds (sky, clouds, starry sky, etc.) that are not affected by cameraX
    drawDynamicBackground(level);

    //Camera Follow
    if (level) {
      let levelWidth = level.portalPosition.x + 200;
      cameraX = constrain(
        player.position.x - width / 2,
        0,
        levelWidth - width
      );
    }
    push();
    translate(-cameraX, 0);


    if (level) {
      level.update();
      level.draw();
    }


    if (player) {
      player.update();
      player.draw();
    }


    for (let i = projectiles.length - 1; i >= 0; i--) {
      let proj = projectiles[i];
      proj.update();
      proj.draw();

      if (proj.isExpired()) {
        projectiles.splice(i, 1);
        continue;
      }

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
            enemy.isSolidWhenFrozen = true;  //The enemy freezes and hardens
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

    //Draw weather effects (rain, thunder) and overlay them on the game scene
    drawWeather();
    //drawHearts(lives); //The lives here are the current player's destiny (1-3) xin~~~~~~~


    //When injured, the screen flashes red light
    if (damageFlashAlpha > 0) {
      noStroke();
      fill(255, 0, 0, damageFlashAlpha);
      rect(0, 0, width, height);
      damageFlashAlpha = max(0, damageFlashAlpha - 5);
    }
    updateGameTimer();
    drawHUD();


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
  drawParticles();

  settings.drawGlobalSettingsButton(); //Add a "SET" button in the upper right corner of all interfaces
}


function updateGameTimer() {
  gameTimer += deltaTime / 1000;
}


function switchScene(sceneName) {
  currentScene = sceneName;
  gameTimer = 0;
  //projectiles = [];
  
  projectiles.length     = 0;        
  rainParticles.length   = 0;        
  snowParticles.length   = 0;        
  globalParticles.length = 0;  

  if (sceneName !== "level") {

    if (runSound && runSound.isPlaying()) {
      runSound.stop();
    }
    if (rainSound && rainSound.isPlaying()) {
      rainSound.stop();
    }
    if (snowSound && snowSound.isPlaying()) {
      snowSound.stop();
    }
    /*if (levelWinSound && levelWinSound.isPlaying()) {
      levelWinSound.stop();
    }*/
  }

  if (sceneName !== "win" && winSound && winSound.isPlaying()) {
    winSound.stop();
  }
  if (!["level", "win"].includes(sceneName)) {
    if (clickSound) {
        clickSound.play();
    }
  }

  if (sceneName === "menu") {
    currentLevelIndex = 0;
    levelTimes = [];
  }
  if (clickSound) {
    clickSound.play();
  } 

  if (!["level","win"].includes(sceneName)) {
    if (levelWinSound && levelWinSound.isPlaying()) {
        levelWinSound.stop();
    }
  }

  if (sceneName === "story") {
    if (storyMusic && !storyMusic.isPlaying()) {
      userStartAudio();
      storyMusic.setVolume(0.6);
      storyMusic.loop();
    }
  } else {
    if (storyMusic && storyMusic.isPlaying()) {
      storyMusic.stop();
    }
  }

  if (sceneName === "level") {
    let config = levels[currentLevelIndex];

    //Clear old level enemies(Rui)
    if (level) {
      level.enemies = [];
    }
    level = new Level(config, spiderSpritesheet);
    player = new Player(config.playerStart);
    //Check if the entry is through a portal and the current level is not level 1
    //Check if it is entered through a portal and level>1
    if (currentLevelIndex > 1) {
        if (levelWinSound) {
            levelWinSound.play();
        }
        sessionStorage.removeItem("enteredFromPortal");
    } else {
        levelWinSound.play();
    }

  }
}


function keyPressed() {
  
  if (settings.isOpen) {
    switch (key) {
      case "R": case "r":
        switchScene("level"); //Restart this level
        settings.toggle();
        break;
      case "M": case "m":
        switchScene("menu"); //Return to the main menu
        settings.toggle();
        break;
      case "I": case "i":
        switchScene("instructions"); //View game instructions
        settings.toggle();
        break;
      case "S": case "s":
        settings.toggleSound(); //Switch sound
        break;
      //Add full screen switching
      case "F": case "f":
        settings.toggleFullscreen();
        break;
      case "P": case "p":
        settings.toggle(); //Close the settings interface
        break;

    }
    return;
  }

  //Press P to open the settings in the game
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
    if (key === " " || key === "w" || key === "W" || keyCode === UP_ARROW) {
      player.jump();
    }
    if (key === "Z" || key === "z" || key === "j" || key === "J") {
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

function handleMouseClick() {
  //console.log("Mouse clicked!");
}

function mousePressed() {
  if (clickSound) {
    clickSound.play();

  }
  //settings.handleMouseClick(mouseX, mouseY);
  if (settings.handleMouseClick(mouseX, mouseY)) {
    return;
  }

  if (currentScene === "level" && !settings.isOpen) {
    player.attack();
  }

  if (currentScene === "story") {
    storyScene.mousePressed();
  }
}
