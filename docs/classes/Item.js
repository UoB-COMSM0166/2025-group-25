class Item {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.width = 30;
    this.height = 30;
    this.type = type;
    this.collected = false;
    this.bounceSpeed = 0.05;
    this.bounceHeight = 1;
    this.time = 0;
  }

  update() {
    if (this.type === "Heart" && !this.collected) {
      //Make the heart beat up and down
      this.time += this.bounceSpeed;
      this.position.y += Math.sin(this.time) * this.bounceHeight;
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
        let scaleFactor = 3;
        image(heartImg, 0, 0, this.width * scaleFactor, this.height * scaleFactor);
      }
/*
     else if (this.type === "Double Jump") {
        fill(0, 255, 0);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("2J", this.width / 2, this.height / 2);
      }else if (this.type === "Dash") { // 新增 Dash 道具
        fill(0, 255, 255);
        rect(0, 0, this.width, this.height, 5);
        fill(0);
        text("Dash", this.width / 2, this.height / 2);
      }else if (this.type === "Teleport Scroll") {
        fill(0, 150, 255); // 蓝色
        rect(0, 0, this.width, this.height, 5);
        fill(255);
        text("TP", this.width / 2, this.height / 2);
    }*/
       else if (this.type === "Thunder Element") {
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
    
    if (player.firstItemPickup && this.type !== "Heart") { 
      player.itemPickupMessage = "Press Z to use item";
      player.messageTimer = 120;
      player.firstItemPickup = false;
    }
     //  **播放拾取音效**
    if (pickItemSound) {
      //console.log("Pick up props and play sound effects");
      pickItemSound.play();
    } else {
      //console.error("`pickItemSound 'is undefined, unable to play pickup sound effects!");
    }

    if (this.type === "Flame Element") {
      player.currentItem = "Flame Element";
    } else if (this.type === "Freeze Element") {
      player.currentItem = "Freeze Element";
    }  else if (this.type === "Invincibility") {
      player.invincibleTimer = 5;
    } else if (this.type === "Heart") {
      player.lives = min(player.lives + 1, 5); 
    } 
  }
}
