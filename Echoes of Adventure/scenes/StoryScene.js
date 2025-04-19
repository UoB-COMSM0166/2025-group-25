class StoryScene {
  constructor() {
    this.backgroundImg = null;
    this.textLines = [
      "Echoes of Adventure",
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
      "[ Click anywhere to skip the story ]"
    ];
    

    this.startTime = millis();
    this.imageDelay = 1000;
    this.fadeInDuration = 800;
    this.storyDuration = 15000;
    this.textIndex = 0;
    this.lineSpacing = 40;

    this.loadBackground();

    if (storyMusic) {
      storyMusic.setVolume(0.6);
      storyMusic.loop();
    }
  }

  loadBackground() {
    this.backgroundImg = loadImage("assets/story_background.png", 
      () => console.log("Background image loaded successfully"),
      () => console.error("Background image loading failed！")
    );
  }

  update() {
    if (millis() - this.startTime > this.storyDuration) {
    if (storyMusic && storyMusic.isPlaying()) {
      storyMusic.stop();
    }
      switchScene("menu");
    }
  }

  draw() {
    background(0);
    
    if (this.backgroundImg) {
      tint(255, 180);
      image(this.backgroundImg, 0, 0, width, height);
      noTint();

      if(storyMusic && !storyMusic.isPlaying()){ //zkx~~~~~~~~~~
        storyMusic.setVolume(0.6);
        storyMusic.loop();
      }
    } else {
      fill(50);
      rect(0, 0, width, height);
    }
  
    let elapsed = millis() - this.startTime;
    let textElapsed = elapsed - this.imageDelay;
  
    textAlign(CENTER, CENTER);
    textSize(26);
  
    if (textElapsed >= 0) {
      for (let i = 0; i < this.textLines.length; i++) {
        let y = height / 5 + i * this.lineSpacing;
        let alpha = map(textElapsed - i * 800, 0, this.fadeInDuration, 0, 255);
        alpha = constrain(alpha, 0, 255);
        
        if (i === 0) {
          textSize(36);
          strokeWeight(6);
        } else if (i === this.textLines.length - 1) {
          textSize(20);
          strokeWeight(3);
        } else {
          textSize(26);
          strokeWeight(4);
        }

        stroke(0, alpha);
        strokeWeight(4);
        fill(255, 255, 255, alpha);
        text(this.textLines[i], width / 2, y);
      }
    }
  }
  

  mousePressed() {
    if (clickSound) clickSound.play();
    if (storyMusic && storyMusic.isPlaying()) {
      storyMusic.stop();
    }
  
    switchScene("menu"); 
  }
  
}
