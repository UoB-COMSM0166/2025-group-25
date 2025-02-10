// =========================
// 游戏说明界面
// =========================

function drawInstructions() {
  background(30);
  fill(0, 150);
  rect(40, 40, width - 80, height - 80, 8);

  fill(255);
  textAlign(CENTER, TOP);
  textSize(32);
  text("Instructions", width / 2, 60);

  textSize(20);
  let inst =
    "Controls:\n  ←, →: Move\n  SPACE: Jump (Double Jump supported)\n  Z: Attack\n\n" +
    "Goal:\n  Collect 15 coins to activate the portal, then enter it to pass the level.\n\n" +
    "Items:\n  Flame Gun, Freeze Gun, Greatsword, Timed Bomb, Invincibility,\n  Heart, Mystery Box (random item), Double Jump\n\n" +
    "Obstacles:\n  Flames, Gears, Blades, Spiked Walls, Axes, Saws,\n  Laser, Falling Spikes\n\n" +
    "Dynamic Environment:\n  Day/Night cycle, Rain/Thunderstorm effects\n\n" +
    "Press M to return to Main Menu";

  text(inst, width / 2, 120);
}