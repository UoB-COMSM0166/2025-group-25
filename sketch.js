let brushSize = 50; // Initial brush size
let sidebarWidth = 150; // Sidebar width
let img1, img2, img3, img4, img5; // Define image variables
let currentImage = null; // Current mouse image
let bgImage; // Background image variable

function preload() {
  // Load mouse images
  img1 = loadImage('1.jpg', 
    () => console.log('1.jpg loaded successfully'), 
    () => console.error('1.jpg failed to load')
  );
  img2 = loadImage('2.jpg', 
    () => console.log('2.jpg loaded successfully'), 
    () => console.error('2.jpg failed to load')
  );
  img3 = loadImage('3.jpg', 
    () => console.log('3.jpg loaded successfully'), 
    () => console.error('3.jpg failed to load')
  );
  img4 = loadImage('4.jpg', 
    () => console.log('4.jpg loaded successfully'), 
    () => console.error('4.jpg failed to load')
  );
  img5 = loadImage('5.jpg', 
    () => console.log('5.jpg loaded successfully'), 
    () => console.error('5.jpg failed to load')
  );

  // Load background image
  bgImage = loadImage('background.jpg', 
    () => console.log('background.jpg loaded successfully'), 
    () => console.error('background.jpg failed to load')
  );
}

function setup() {
  createCanvas(854, 460);
  background(bgImage); // Set background image
}

function draw() {
  // Draw the sidebar
  drawSidebar();

  // If the mouse is pressed and within the canvas, draw the selected image
  if (mouseIsPressed && mouseX > sidebarWidth) {
    if (currentImage) {
      image(currentImage, mouseX - brushSize / 2, mouseY - brushSize / 2, brushSize, brushSize); // Draw mouse image
    }
  }
}

// Mouse click event
function mousePressed() {
  // Check if the sidebar image buttons are clicked
  if (mouseX < sidebarWidth) {
    let buttonHeight = 100; // Height of each button
    if (mouseY < buttonHeight) {
      currentImage = img1; // Switch to image 1
    } else if (mouseY < buttonHeight * 2) {
      currentImage = img2; // Switch to image 2
    } else if (mouseY < buttonHeight * 3) {
      currentImage = img3; // Switch to image 3
    } else if (mouseY < buttonHeight * 4) {
      currentImage = img4; // Switch to image 4
    } else if (mouseY < buttonHeight * 5) {
      currentImage = img5; // Switch to image 5
    }
  }
}

// Mouse wheel event: Adjust brush size
function mouseWheel(event) {
  brushSize += event.delta > 0 ? -5 : 5; // Decrease on scroll up, increase on scroll down
  brushSize = constrain(brushSize, 20, 100); // Limit brush size range
}

// Draw the sidebar
function drawSidebar() {
  noStroke();
  fill(200); // Gray background
  rect(0, 0, sidebarWidth, height);

  // Draw each image button
  let buttonHeight = 100; // Height of each button
  if (img1) image(img1, 20, 10, sidebarWidth - 40, buttonHeight - 20); // Image 1
  if (img2) image(img2, 20, 110, sidebarWidth - 40, buttonHeight - 20); // Image 2
  if (img3) image(img3, 20, 210, sidebarWidth - 40, buttonHeight - 20); // Image 3
  if (img4) image(img4, 20, 310, sidebarWidth - 40, buttonHeight - 20); // Image 4
  if (img5) image(img5, 20, 410, sidebarWidth - 40, buttonHeight - 20); // Image 5
}
