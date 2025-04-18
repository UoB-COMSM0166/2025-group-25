class Settings {
    constructor() {
      this.isOpen = false;
      this.buttonX = width - 100;
      this.buttonY = 20;
      this.buttonSize = 60;
      this.soundEnabled = true;
      this.buttons = [
        { label: "[R] Restart Level", x: width / 2 - 100, y: 250, action: () => switchScene("level") },
        { label: "[M] Main Menu", x: width / 2 - 100, y: 310, action: () => switchScene("menu") },
        { label: "[I] Instructions", x: width / 2 - 100, y: 370, action: () => switchScene("instructions") },
        { label: "[F] Fullscreen", x: width / 2 - 100, y: 430, action: () => this.toggleFullscreen() }
      ];
    }
  
    toggle() {
      this.isOpen = !this.isOpen;

      if (clickSound) {
        clickSound.play();
      } else {

      }
    }
    
  
    //Draw the SET button in the upper right corner
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
  
    //Draw settings interface
    draw() {
      if (!this.isOpen) return;
  
      push();
      fill(50, 50, 50, 220);
      rect(100, 100, width - 200, height - 200, 10);
      fill(255);
      textSize(50);
      textAlign(CENTER, CENTER);
      text("SETTINGS", width / 2, 160);
      this.buttons.forEach((btn) => {
        fill(80);
        rect(btn.x-50, btn.y, 300, 50, 10);
        fill(255);
        textSize(20);
        textAlign(CENTER, CENTER);
        text(btn.label, btn.x + 100, btn.y + 25);
      });
      fill(200);
      textSize(20);
      textAlign(CENTER, CENTER);
      text("Press [P] to close settings", width / 2, height - 140);
  
      pop();
    }
    /*
    handleMouseClick(mx, my) {
      if (clickSound) {
        clickSound.play();
      }

      //Detect the SET button in the upper right corner
      if (
        mx > this.buttonX &&
        mx < this.buttonX + this.buttonSize &&
        my > this.buttonY &&
        my < this.buttonY + this.buttonSize
      ) {
        this.toggle();
        return;
      }
  
      //Click on the detection settings interface button
      if (this.isOpen) {
        for (let btn of this.buttons) {
          if (mx > btn.x && mx < btn.x + 200 && my > btn.y && my < btn.y + 50) {
            btn.action();
            this.toggle();
            return;
          }
        }
      }
    }*/

      handleMouseClick(mx, my) {
        
        if (
          mx > this.buttonX && mx < this.buttonX + this.buttonSize &&
          my > this.buttonY && my < this.buttonY + this.buttonSize
        ) {
          this.toggle();
          return true;
        }
      
        if (this.isOpen) {
          for (let btn of this.buttons) {
            if (mx > btn.x-50 && mx < btn.x+250 && my > btn.y && my < btn.y+50) {
              btn.action();
              this.toggle();
              return true;
            }
          }
        }
        return false;
      }
      
  

    //Full screen switching function
    toggleFullscreen() {
      let fs = fullscreen();
      fullscreen(!fs);
    }
  }
  