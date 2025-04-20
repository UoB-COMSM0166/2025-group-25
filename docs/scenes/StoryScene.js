class StoryScene {
  constructor() {
    this.backgroundImg = null;
    this.textLines = [
      "Echoes of Adventure",
      "",
      "In the ancient and magical world of Echoes of Adventure.",
      "Five enchanted continents once lived in harmony:",
      "Emerald Isles, Lava Castle, Celestial Citadel, Shadow Realm, and Crystal Caverns.",
      "But over time, human greed scarred the land pollution, waste.",
      "And ecological destruction broke the balance of nature.",
      "The once-pure elements are now shrouded in darkness.",
      "You are a brave little fox, chosen by nature to restore the beauty of the world.",
      "To heal the continents, you must cross toxic lands, dodge deadly traps,",
      "clean up environmental waste, and defeat creatures corrupted by pollution.",
      "Only by collecting the scattered trash can you unlock the portal to the next continent.",
      "This is more than a quest, it is a journey of restoration and hope.",
      "Are you ready to begin?",
      "",
      "[ Click anywhere to skip the story ]"
    ];    

    this.startTime = millis();
    this.imageDelay = 1000;
    this.fadeInDuration = 800;
    this.storyDuration = 20000;
    this.textIndex = 0;
    this.lineSpacing = 40;

    this.loadBackground();

    if (storyMusic) {
      console.log("music loaded successfully!");
      storyMusic.setVolume(0.6);
      storyMusic.loop();
    }
  }

  loadBackground() {
    this.backgroundImg = loadImage("assets/story_background.png", 
      () => console.log("picture loaded successfully!"),
      () => console.error("picture loading failed!")
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

      if (storyMusic && !storyMusic.isPlaying()) {
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
        let y = height / 5 - 75 + i * this.lineSpacing;
        let alpha = map(textElapsed - i * 800, 0, this.fadeInDuration, 0, 255);
        alpha = constrain(alpha, 0, 255);

        if (i === 0) {
          textSize(36);
          strokeWeight(6);
        } else if (i === this.textLines.length - 1) {
          textSize(20);
          strokeWeight(3);
        } else {
          textSize(24);
          strokeWeight(4);
        }

        stroke(0, alpha);
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
