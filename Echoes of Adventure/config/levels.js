// =========================
// 关卡数据配置
// =========================

// 全局变量 levels 在 sketch.js 中声明
// 这里仅实现 setupLevels() 函数

function setupLevels() {
  function genCoins(startX, endX, baseY, count = 15) {
    let coins = [];
    let step = (endX - startX) / (count - 1);
    for (let i = 0; i < count; i++) {
      let x = startX + i * step;
      let y = baseY + random(-30, 30);
      coins.push(createVector(x, y));
    }
    return coins;
  }

  levels = [
    {
      levelName: "Emerald Isles",
      element: "default",
      playerStart: createVector(100, 500),
      coins: genCoins(300, 1800, 450, 15),
      enemies: [
        { type: "Spider", position: createVector(600, 500) },
        { type: "Fish", position: createVector(1200, 500) }
      ],
      portalPosition: createVector(1900, 500),
      platforms: [
        { x: 0, y: 580, w: 2000, h: 40 },
        { x: 300, y: 450, w: 200, h: 20 },
        { x: 800, y: 400, w: 150, h: 20 },
        { x: 1400, y: 420, w: 200, h: 20 }
      ],
      items: [
        { x: 500, y: 430, type: "Double Jump" }
      ],
      obstacles: [
        { x: 1000, y: 540, type: "Flame", w: 40, h: 40 }
      ]
    },
    {
      levelName: "Lava Castle",
      element: "fire",
      playerStart: createVector(100, 500),
      coins: genCoins(350, 2000, 450, 15),
      enemies: [
        { type: "Spider", position: createVector(700, 520) },
        { type: "Spider", position: createVector(1500, 520) }
      ],
      portalPosition: createVector(2100, 500),
      platforms: [
        { x: 0, y: 580, w: 2200, h: 40 },
        { x: 400, y: 500, w: 250, h: 20 },
        { x: 1000, y: 420, w: 200, h: 20 },
        { x: 1600, y: 460, w: 200, h: 20 }
      ],
      items: [
        { x: 600, y: 460, type: "Flame Gun" },
        { x: 1700, y: 400, type: "Invincibility" }
      ],
      obstacles: [
        { x: 1300, y: 540, type: "Gear", w: 50, h: 50 },
        { x: 1800, y: 540, type: "Blade", w: 40, h: 40 }
      ],
      axes: {
        positions: [createVector(1200, 300)],
        swingTimes: [1]
      },
      saws: {
        positions: [createVector(1400, 550)],
        ranges: [50]
      }
    },
    {
      levelName: "Celestial Citadel",
      element: "ice",
      playerStart: createVector(100, 500),
      coins: genCoins(300, 2000, 450, 15),
      enemies: [
        { type: "Bird", position: createVector(800, 300) },
        { type: "Bird", position: createVector(1500, 250) }
      ],
      portalPosition: createVector(2100, 500),
      platforms: [
        { x: 0, y: 580, w: 2200, h: 40 },
        { x: 350, y: 400, w: 200, h: 20 },
        { x: 1000, y: 350, w: 180, h: 20 },
        { x: 1600, y: 380, w: 200, h: 20 }
      ],
      items: [
        { x: 700, y: 420, type: "Freeze Gun" },
        { x: 1400, y: 360, type: "Greatsword" },
        { x: 1700, y: 320, type: "Heart" },
        { x: 1900, y: 320, type: "Mystery Box" }
      ],
      obstacles: [
        { x: 1200, y: 540, type: "Spiked Wall", w: 40, h: 80 }
      ],
      advancedBirds: {
        positions: [createVector(1000, 200)],
        ranges: [100],
        type: "default"
      }
    },
    {
      levelName: "Shadow Realm",
      element: "wind",
      playerStart: createVector(100, 500),
      coins: genCoins(300, 2200, 400, 15),
      enemies: [
        { type: "Spider", position: createVector(800, 520) },
        { type: "Bird", position: createVector(1600, 300) }
      ],
      portalPosition: createVector(2100, 500),
      platforms: [
        { x: 0, y: 580, w: 2200, h: 40 },
        { x: 300, y: 480, w: 200, h: 20 },
        { x: 900, y: 450, w: 150, h: 20 },
        { x: 1500, y: 430, w: 200, h: 20 }
      ],
      items: [
        { x: 800, y: 460, type: "Greatsword" }
      ],
      obstacles: [
        { x: 1300, y: 540, type: "Gear", w: 50, h: 50 },
        { x: 1700, y: 540, type: "Flame", w: 40, h: 40 },
        { x: 1900, y: 500, type: "Laser", w: 10, h: 100 }
      ]
    },
    {
      levelName: "Crystal Caverns",
      element: "earth",
      playerStart: createVector(100, 500),
      coins: genCoins(300, 2200, 500, 15),
      enemies: [
        { type: "Fish", position: createVector(900, 550) },
        { type: "Bird", position: createVector(1600, 280) }
      ],
      portalPosition: createVector(2100, 500),
      platforms: [
        { x: 0, y: 600, w: 2200, h: 40 },
        { x: 300, y: 500, w: 200, h: 20 },
        { x: 1000, y: 480, w: 150, h: 20 },
        { x: 1600, y: 460, w: 200, h: 20 }
      ],
      items: [
        { x: 700, y: 480, type: "Invincibility" }
      ],
      obstacles: [
        { x: 1200, y: 550, type: "Blade", w: 40, h: 40 },
        { x: 1800, y: 550, type: "Spiked Wall", w: 40, h: 80 }
      ]
    }
  ];
}
