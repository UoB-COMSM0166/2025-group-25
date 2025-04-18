//5 weather conditions: "clear", "rain", "snow", "thunderstorm", "fog"

let previousWeather = "clear";
let fogParticles = [];
let fogLayer;
let groundLevel;
let fogNoiseOffset = 0;

function updateWeather() {
  previousWeather = weatherState;//zkx~~~~~~~~~
  timeOfDay += 0.01;
  if (timeOfDay >= 24) {
    timeOfDay = 0;
  }

  //Randomly switch weather every 20 seconds
  weatherTimer += deltaTime / 1000;
  if (weatherTimer > 20) {
    let r = random(1);
    if (r < 0.2) {
      weatherState = "clear";//clear
    } else if (r < 0.4) {
      weatherState = "rain";//rain
    } else if (r < 0.6) {
      weatherState = "snow";//snow
    } else if (r < 0.8) {
      weatherState = "thunderstorm";//thunderstorm
    } else {
      weatherState = "fog";//fog
    }
    //After switching weather, clear various particles
    rainParticles = [];
    snowParticles = [];
    fogParticles = [];
    weatherTimer = 0;
  }
  if (currentScene !== "level") {
    if (rainSound && rainSound.isPlaying()) {
      rainSound.stop();
    }
    if (snowSound && snowSound.isPlaying()) {
      snowSound.stop();
    }
    return;
  }

  if (weatherState === "snow") {
    if (snowSound && !snowSound.isPlaying()) {
      snowSound.setVolume(0.4);
      snowSound.loop();
    }
  } 
  else if (previousWeather === "snow") {
    if (snowSound && snowSound.isPlaying()) {

      snowSound.stop();
    }
  }

  if (weatherState === "rain" || weatherState === "thunderstorm") {
    if (rainSound && !rainSound.isPlaying()) {
      rainSound.setVolume(0.5);
      rainSound.loop();
    }
  } 
  else if (previousWeather === "rain" || previousWeather === "thunderstorm") {
    if (rainSound && rainSound.isPlaying()) {
      rainSound.stop();
    }
  }

  //Generate corresponding particles based on current weather conditions
  if (weatherState === "rain" || weatherState === "thunderstorm") {
    if (rainParticles.length < 300) {
    for (let i = 0; i < 5; i++) {
      let dropCol = color(80, 80, 220, 200);
      rainParticles.push(
        //new Particle(
          Particle.get(
          random(cameraX, cameraX + width),
          0,
          createVector(0, random(4, 8)),
          dropCol,
          60
        )
      );
    }

    //If it is a thunderstorm or night, there is a small probability of lightning occurring
    if (
      weatherState === "thunderstorm" &&
      (timeOfDay < 6 || timeOfDay >= 18) &&
      random(1) < 0.01
    ) {
      thunderFlash = true;
    }
   }
  }

  //snow
  else if (weatherState === "snow") {
    if (frameCount % 3 === 0) {
      if (snowParticles.length < 100) {
        snowParticles.push(
          //new Particle(
            Particle.get(
            random(cameraX, cameraX + width),
            -10,
            createVector(random(-0.5, 0.5), random(1, 2)),
            color(255),
            150
          )
        );
      }
    }
  }

  //fog
  else if (weatherState === "fog") {
    if (!fogLayer || fogLayer.width !== width || fogLayer.height !== height) {
      fogLayer = createGraphics(width, height);
    }

    for (let i = 0; i < 3; i++) {
      let p = {
        x: random(cameraX, cameraX + width),
        y: -10,
        vx: random(-0.1, 0.1),
        vy: random(0.2, 0.5),
        lifetime: 0,
        maxLifetime: 600 + int(random(200)),
        size: random(40, 80),
      };
      fogParticles.push(p);
    }
  }
}

function drawWeather() {
  if (weatherState === "rain" || weatherState === "thunderstorm") {
    for (let i = rainParticles.length - 1; i >= 0; i--) {
      let p = rainParticles[i];
      p.update();
      p.draw();
      if (p.isDead()) {
        rainParticles.splice(i, 1);
      }
    }
  }

  if (weatherState === "snow") {
    for (let i = snowParticles.length - 1; i >= 0; i--) {
      let s = snowParticles[i];
      s.update();
      //Draw snowflake
      push();
      translate(s.position.x - cameraX, s.position.y);
      rotate(frameCount * 0.01 + i);
      stroke(255);
      strokeWeight(2);
      noFill();
      let r = 6;
      for (let angle = 0; angle < 360; angle += 60) {
        let rad = radians(angle);
        line(0, 0, r * cos(rad), r * sin(rad));
      }
      pop();

      if (s.isDead() || s.position.y > height + 20) {
        snowParticles.splice(i, 1);
      }
    }
  }

  //fog
  if (weatherState === "fog") {
    for (let i = fogParticles.length - 1; i >= 0; i--) {
      let f = fogParticles[i];
      f.x += f.vx;
      f.y += f.vy;
      f.lifetime++;
      if (f.lifetime > f.maxLifetime) {
        fogParticles.splice(i, 1);
      }
    }
    fogLayer.clear();

    //Fill a thicker mask on the fog layer
    fogLayer.noErase();
    fogLayer.background(200, 200, 200, 220);

    //Dig a visible area (fog hole) around the player
    fogLayer.erase();
    let holeX = width / 2;
    let holeY = height / 2;

    if (player && player.position) {
      holeX = player.position.x - cameraX+25;//Rui
      holeY = player.position.y+30;
    }

    let maxRadius = 120;
    for (let r = maxRadius; r > 0; r -= 2) {
      let alpha = map(r, maxRadius, 0, 0, 220);
      let gradColor = lerpColor(
        color(200, 200, 200, alpha),
        color(200, 200, 200, 0),
        r / maxRadius
      );
      fogLayer.fill(gradColor);
      fogLayer.noStroke();
      fogLayer.ellipse(holeX, holeY, r * 2, r * 2);
    }
    fogLayer.noErase();
    image(fogLayer, 0, 0);
  }

  if (thunderFlash) {
    fill(255, 255, 255, 200);
    rect(0, 0, width, height);
    thunderFlash = false;
  }
}

function drawDynamicBackground(level) {
  drawSkyGradient();

  //If the current level is not 'Crystal Caverns', only draw the sun, moon, stars, and clouds
  if (!level || !level.levelName) {
    return;
  }

  if (level.levelName !== "Crystal Caverns") {
    if (timeOfDay >= 6 && timeOfDay < 18) {
      //The following weather conditions do not display the sun: rain, thunderstorm, snow
      if (
        weatherState !== "rain" &&
        weatherState !== "thunderstorm" &&
        weatherState !== "snow"
      ) {
        drawSun();
      }
      if (weatherState === "rain" || weatherState === "thunderstorm") {
        drawDarkClouds();
      } else {
        drawClouds();
      }
    } else {
      //Night
      drawMoonCrescent();
      drawStars();
    }
  }

  //Finally, draw the level background decoration
  push();
  blendMode(MULTIPLY);
  drawLevelDecor(level);
  blendMode(BLEND);
  pop();
}

function drawSkyGradient() {
  push();

  //Define a top and bottom color for each hourly hour
  let skyColorsTop = [
    color(11, 0, 51),
    color(11, 16, 51),
    color(11, 32, 51),
    color(11, 48, 51),
    color(31, 43, 68),
    color(62, 74, 102),
    color(249, 217, 160),
    color(255, 210, 127),
    color(173, 216, 230),
    color(160, 223, 248),
    color(144, 224, 255),
    color(128, 225, 255),
    color(112, 226, 255),
    color(144, 223, 255),
    color(160, 220, 255),
    color(176, 217, 255),
    color(192, 214, 255),
    color(208, 211, 255),
    color(255, 160, 122),
    color(255, 130, 67),
    color(75, 0, 130),
    color(42, 0, 51),
    color(31, 0, 51),
    color(21, 0, 51)
  ];

  let skyColorsBottom = [
    color(21, 0, 60),
    color(21, 16, 60),
    color(21, 32, 60),
    color(21, 48, 60),
    color(41, 53, 78),
    color(72, 84, 112),
    color(255, 227, 180),
    color(255, 220, 157),
    color(183, 226, 240),
    color(170, 233, 255),
    color(154, 234, 255),
    color(138, 235, 255),
    color(122, 236, 255),
    color(154, 233, 255),
    color(170, 230, 255),
    color(186, 227, 255),
    color(202, 224, 255),
    color(218, 221, 255),
    color(255, 180, 142),
    color(255, 150, 87),
    color(85, 10, 140),
    color(52, 10, 61),
    color(41, 10, 61),
    color(31, 10, 61)
  ];

  let hour = floor(timeOfDay);
  let nextHour = (hour + 1) % 24;
  let frac = timeOfDay - hour;

  let topColor = lerpColor(skyColorsTop[hour], skyColorsTop[nextHour], frac);
  let bottomColor = lerpColor(
    skyColorsBottom[hour],
    skyColorsBottom[nextHour],
    frac
  );

  noFill();
  for (let y = 0; y < height; y++) {
    let t = map(y, 0, height, 0, 1);
    let c = lerpColor(topColor, bottomColor, t);
    stroke(c);
    line(0, y, width, y);
  }

  //If the weather is rain or thunderstorms, make the sky darker
  if (weatherState === "rain" || weatherState === "thunderstorm") {
    fill(50, 50, 50, 80);
    rect(0, 0, width, height);
  }

  pop();
}

function drawSun() {
  let sunX = map(timeOfDay, 6, 18, 0, width);
  let sunY = height * 0.35 - sin(map(timeOfDay, 6, 18, 0, PI)) * 100;

  let glowAlpha = sin(frameCount * 0.05) * 50 + 150;

  push();
  translate(sunX, sunY);
  noStroke();

  for (let i = 1; i <= 10; i++) {
    let glowSize = 80 * (1 + i * 0.2);
    fill(255, 200, 0, glowAlpha * exp(-i * 0.5));
    ellipse(0, 0, glowSize, glowSize);
  }

  //Sun Body
  for (let i = 0; i < 10; i++) {
    let lerpedColor = lerpColor(color(255, 255, 0), color(255, 150, 0), i / 10);
    fill(lerpedColor);
    ellipse(0, 0, 50 - i * 5, 50 - i * 5);
  }

  pop();
}

function drawMoonCrescent() {
  let moonX;
  if (timeOfDay >= 18) {
    moonX = map(timeOfDay, 18, 24, width, 0);
  } else {
    moonX = map(timeOfDay, 0, 6, 0, width);
  }
  let moonY =
    height * 0.35 -
    sin(
      map(timeOfDay, timeOfDay > 18 ? 18 : 0, timeOfDay > 18 ? 24 : 6, 0, PI)
    ) *
      100;

  let glowAlpha = sin(frameCount * 0.05) * 30 + 120;

  push();
  translate(moonX, moonY);
  noStroke();

  for (let i = 1; i <= 10; i++) {
    let glowSize = 60 * (1 + i * 0.2);
    fill(200, 200, 255, glowAlpha * exp(-i * 0.5));
    ellipse(0, 0, glowSize, glowSize);
  }

  //Main body of the moon
  for (let i = 0; i < 10; i++) {
    let lerpedColor = lerpColor(color(255, 255, 255), color(180, 180, 255), i / 10);
    fill(lerpedColor);
    ellipse(0, 0, 40 - i * 4, 40 - i * 4);
  }

  pop();
}

function drawStars() {
  if (starPositions.length < 100) {
    for (let i = 0; i < 100; i++) {
      starPositions.push({
        x: random(width),
        y: random(height * 0.5),
        size: random(1, 3),
      });
    }
  }
  noStroke();
  for (let s of starPositions) {
    fill(255, 255, 200, random(180, 255));
    ellipse(s.x, s.y, s.size, s.size);
  }
}


function drawClouds() {
  for (let i = 0; i < 5; i++) {
    let cx = ((frameCount * 0.2 + i * 200) % (width + 200)) - 100;
    let cy = 100 + i * 50 + sin(frameCount * 0.01 + i) * 10;
    drawCloud(cx, cy);
  }
}

function drawCloud(cx, cy) {
  push();
  translate(cx, cy);
  noStroke();

  fill(255, 255, 255, 220);
  ellipse(0, 0, 100, 70);
  ellipse(-35, -5, 70, 60);
  ellipse(35, -5, 80, 60);

  ellipse(-20, 25, 50, 30);
  ellipse(20, 25, 60, 35);

  ellipse(-30, -25, 40, 30);
  ellipse(10, -30, 50, 35);

  fill(255, 255, 255, 250);
  ellipse(-25, -20, 30, 20);
  ellipse(15, -25, 25, 15);
  pop();
}

function drawDarkClouds() {
  for (let i = 0; i < 5; i++) {
    let cx = ((frameCount * 0.15 + i * 250) % (width + 300)) - 100;
    let cy = 120 + i * 40 + sin(frameCount * 0.01 + i) * 10;
    drawDarkCloud(cx, cy);
  }
}

function drawDarkCloud(cx, cy) {
  push();
  translate(cx, cy);
  noStroke();

  fill(50, 50, 50, 200);
  ellipse(0, 0, 100, 65);
  ellipse(-35, -10, 70, 55);
  ellipse(40, -10, 80, 55);

  ellipse(-20, 20, 60, 35);
  ellipse(25, 25, 70, 40);

  ellipse(-30, -25, 50, 35);
  ellipse(15, -30, 60, 40);

  fill(30, 30, 30, 180);
  ellipse(-15, 10, 90, 50);
  ellipse(25, 15, 80, 45);

  pop();
}



function drawLevelDecor(level) {
  if (!level) return;
  push();
  noStroke();
  if (level.levelName === "Emerald Isles") {
    image(levelOneBg, 0, 0, width, height);
  } else if (level.levelName === "Lava Castle") {
    image(levelTwoBg, 0, 0, width, height);
  } else if (level.levelName === "Celestial Citadel") {
    image(levelThreeBg, 0, 0, width, height);
  } else if (level.levelName === "Shadow Realm") {
    image(levelFourBg, 0, 0, width, height);
  } else if (level.levelName === "Crystal Caverns") {
    image(levelFiveBg, 0, 0, width, height);
  }

  pop();
}


function drawFancySnowflake(s, index) {
  push();
  translate(s.position.x - cameraX, s.position.y);


  stroke(255);
  strokeWeight(2);
  noFill();

  let r = 7;
  //Draw snowflakes
  //Draw 6 main branches+draw 2 small branches for each branch
  for (let angle = 0; angle < 360; angle += 60) {
    let rad = radians(angle);
    line(0, 0, r * cos(rad), r * sin(rad));
    let midX = (r * 0.5) * cos(rad);
    let midY = (r * 0.5) * sin(rad);

    let branchAngle1 = rad + radians(15);
    let branchAngle2 = rad - radians(15);

    line(
      midX,
      midY,
      midX + (r * 0.3) * cos(branchAngle1),
      midY + (r * 0.3) * sin(branchAngle1)
    );
    line(
      midX,
      midY,
      midX + (r * 0.3) * cos(branchAngle2),
      midY + (r * 0.3) * sin(branchAngle2)
    );
  }

  pop();
}
