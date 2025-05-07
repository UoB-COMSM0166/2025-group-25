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
      levelNumber: 1,//cailing
      element: "default",
      playerStart: createVector(100, 500),
      coins: [
        //The first platform near the starting position（x=0, y=510）
        { x: 50,  y: 470 },  
      
        { x: 765, y: 335 },

        { x: 1310, y: 280 },
 
        { x: 1600, y: 360 },
      
        
 
        { x: 2600, y: 510 },
        { x: 3400, y: 510 },
        { x: 3000, y: 460 },
        { x: 4040, y: 55 },//Rui
      
        //14~15. Platforms of varying heights near the end (x=4950, y=480) and (x=5150, y=410)
        { x: 5000, y: 440 },
        { x: 5200, y: 370 }
      ],
      enemies: [
        //{ type: "Spider", position: { x: 3250, y: 480 } },
        { type: "Frog", position: { x: 1300, y: 200 } },
        { type: "Frog", position: { x: 3000, y: 250 } },
        //{ type: "Frog", position: { x: 600, y: 500 } }
        //{ type: "Fish", position: createVector(1200, 500) }
      ],
      portalPosition: createVector(5300, 330),//cailing
      //ground: [{ x: 0, y: 600, w: 2200, h: 40 },//kx
        //{ x: 2650, y: 600, w: 1050, h: 40},{ x: 4525, y: 600, w: 850, h: 40}],//The ground is no longer continuous，kx~~~~~

      waterRegions: [  //Add a water area to this level zkx~~~~~~~~
        { x: 2205, y: 557, width: 425, height: 50 },  //Left puddle, y is 600, height is 50
        { x: 3600, y: 557, width: 1100, height: 50 },  //Right puddle
      ],

      platforms: [//cailing
        //{ x: 0, y: 580, w: 2000, h: 16, type: "daaaaae" },
        { x: 5, y: 510, w: 250, h:80, type: "b" },//1.2
        { x: 0, y: 550, w: 450, h:50, type: "daaaaae" },//1.1 ycl
        

        { x: 620, y: 460, w: 50, h:20, type: "c" },//1.3 air gaffer 1
        { x: 750, y: 380, w: 50, h:20, type: "c" },//1.4 air gaffer 2, Height y: 420 is exactly the height from which a two-step jump from the ground cannot be made.

        { x: 1000, y: 320, w: 800, h: 25, type: "daaaaaaaae" },//1.5 Long platforms
        { x: 1600, y: 560, w: 50, h: 40, type: "c" },//1.6(small squares on the ground and gold coins synergise, gold coins are placed in the upper left air y and 1.4 in line with max 380)

        { x: 1900, y: 550, w: 350, h: 50, type: "daae" },//1.7 Puddle on the ground (left)
        { x: 2460, y: 550, w: 1200, h: 50, type: "daaaaaae" },//1.7 Ground puddle right (puddles spaced 300 exactly limit jump over, later levels can be set)


        { x: 5150, y: 410, w: 250, h: 100, type: "b" },//1.11
        { x: 4950, y: 480, w: 450, h: 100, type: "b" },//1.10
        { x: 4550, y: 550, w: 850, h: 50, type: "bb" },//1.8
       
        { x: 3750, y: 420, w: 100, h: 20, type: "c" },//1.9.1 Long Puddle Platform 1
        { x: 3920, y: 325, w: 100, h: 20, type: "c" },//1.9.2 Long Puddle Platform 2 (Height difference 90: a skilfully placed height difference where a section of the jump looks like it's going up, but it's not)
        { x: 4200, y: 255, w: 100, h: 20, type: "c" },//1.9.2 Long Puddle Platform 3
        { x: 4000, y: 110, w: 100, h: 20, type: "c" },//1.9.2 Long Puddle Platform 4
        { x: 4420, y: 400, w: 100, h: 20, type: "c" },

        { x: 0, y: 590, w: 5400, h: 50, type: "daaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaae" },
        
      ],


      items: [
        { x: 4210, y: 120, type: "Heart" }
        //{ x: 500, y: 430, type: "Dash" }
        //{ x: 500, y: 430, type: "Freeze Element" }
      ],
      obstacles: [
        //{ x: 1000, y: 540, type: "Flame", w: 40, h: 40 }
      ],
      /*
      ghosts: [
        { position: createVector(200, 400), range: 150 },
        { position: createVector(300, 300), range: 200 }
      ],*/
    },
    
    {
      levelName: "Lava Castle",
      levelNumber: 2,//cailing
      element: "fire",
      playerStart: createVector(70, 280),
      coins: [
        { x: 270, y: 380 },  // pillar (250,420)
        { x: 670, y: 380 },  // pillar (650,420)
        { x: 880, y: 280 },  // pillar (850,320)
        { x: 2260, y: 400 }, // Between 2300 and 2350
        { x: 2150, y: 200 },  // Above the platform (2800, 240)
        { x: 2630, y: 100 },  // Above the platform (2800, 240)
        { x: 3225, y: 400 },  // Above the platform (2800, 240)
        { x: 4028, y: 190 },   // Above the platform (4000, 240)
        { x: 4828, y: 280 },
        { x: 6228, y: 270 },
      ],
      enemies: [
        { type: "Spider", position: createVector(827, 240) },

        { type: "Spider", position: createVector(438,  240) },

        { type: "Spider", position: createVector(1870, 220) },

        // { type: "Bat", position: createVector(70, 300) },

        { type: "Spider", position: createVector(6850, 265) },

        { type: "Spider", position: createVector(7410, 355) },
        { type: "Bat", position: {x:2800, y:270} },
        { type: "Bat", position: {x:3200, y:400} },
      ],
      portalPosition: createVector(7680, 360),
      waterRegions: [  //Add a magma area to this level kx~~~~~~~~
        { x: 0, y: 680, width: 7800, height: 50 },  //Lava in the second level zkx~~~~~~~~
        { x: 0, y: 680, width: 7800, height: 50 },  
      ],
      //ground: { x: 0, y: 620, w: 7800, h: 40 },
      platforms: [//cailing
        { x: 50, y: 320, w: 80, h: 400, type: "h" },
        { x: 250, y: 420, w: 80, h: 400, type: "h"},
        { x: 450, y: 320, w: 80, h: 400, type: "h" },
        { x: 650, y: 420, w: 80, h: 400, type: "h" },
        { x: 850, y: 320, w: 80, h: 400, type: "h" },

        { x: 1020, y: 200, w: 400, h: 30, type: "kllllm" },//Aerial platforms
        { x: 1450, y: 300, w: 200, h: 30, type: "kllm" },
        { x: 1850, y: 300, w: 200, h: 30, type: "kllm" },
        
        
        { x: 2150, y: 440, w: 50, h: 300, type: "h" },//boulder
        { x: 2350, y: 440, w: 50, h: 300, type: "h" },
        { x: 2150, y: 440, w: 50, h: 50, type: "k" },//Aerial platforms
        { x: 2200, y: 440, w: 50, h: 50, type: "l" },//Aerial platforms
        { x: 2250, y: 440, w: 50, h: 50, type: "l" },//Aerial platforms
        { x: 2300, y: 440, w: 50, h: 50, type: "l" },//Aerial platforms
        { x: 2350, y: 440, w: 50, h: 50, type: "m" },//Aerial platforms

        { x: 2490, y: 290, w: 80, h: 30, type: "j" },

        { x: 2620, y: 140, w: 80, h: 30, type: "j" },//v-shaped rock
        { x: 2800, y: 240, w: 80, h: 30, type: "j"  },
        { x: 3000, y: 340, w: 80, h: 30, type: "j"  },
        { x: 3200, y: 440, w: 80, h: 30, type: "j"   },
        { x: 3400, y: 540, w: 80, h: 30, type: "j"    },
        { x: 3600, y: 440, w: 80, h: 30, type: "j"    },
        { x: 3800, y: 340, w: 80, h: 30, type: "j"     },
        { x: 4000, y: 240, w: 80, h: 30, type: "j" },
        { x: 4200, y: 140, w: 80, h: 30, type: "j"  },

    
        { x: 4500, y: 320, w: 80, h: 400, type: "h" },//pillar
        { x: 4800, y: 320, w: 80, h: 400, type: "h" },
        { x: 5100, y: 320, w: 80, h: 400, type: "h" },
        { x: 5400, y: 320, w: 80, h: 400, type: "h" },
        { x: 5700, y: 320, w: 80, h: 400, type: "h" },
        { x: 6000, y: 320, w: 80, h: 400, type: "h" },
        { x: 6200, y: 320, w: 80, h: 40, type: "j" },//Aerial platforms

        // { x: 6300, y: 320, w: 80, h: 400, type: "h" },

        { x: 6510, y: 240, w: 60, h: 700, type: "i" },
        { x: 6420, y: 240, w: 240, h: 40, type: "km" },//castle
        
        { x: 6810, y: 350, w: 60, h: 700, type: "i" },
        { x: 6720, y: 350, w: 240, h: 40, type: "km" },//castle

        { x: 7110, y: 240, w: 60, h: 700, type: "i" },
        { x: 7020, y: 240, w: 240, h: 40, type: "km" },//castle
        

        { x: 7410, y: 440, w: 60, h: 700, type: "i" },
        { x: 7320, y: 440, w: 440, h: 40, type: "km" },//castle  

    
      ],
      items: [
        { x: 300, y: 250, type: "Flame Element" },
        { x: 2600, y: 80, type: "Freeze Element" },
        { x: 1350, y: 90, type: "Heart" }
        //{ x: 1700, y: 400, type: "Invincibility" }
      ],
      obstacles: [
        //{ x: 1300, y: 540, type: "Gear", w: 50, h: 50 },
        //{ x: 1800, y: 540, type: "Blade", w: 40, h: 40 }
      ],
      axes: {
        //positions: [createVector(1200, 300)],
        positions: [createVector(1200, 100)],
        swingTimes: [1]
      },
      
      
      saws: {
        positions: [
          createVector(1475, 250),
          //createVector(1600, 300),
          //createVector(1750, 200),
          createVector(2280, 300)
        ],
        ranges: [50, 80] //Different travel ranges can be set individually for each saw blade
      }
      
    },
    {
      levelName: "Celestial Citadel",
      levelNumber: 3,//cailing
      element: "ice",
      playerStart: createVector(70, 0),//cailing
      coins: [
        //1-4: Above the platform in the starting area
        //{ x: 100, y: 370 }, // platform (0,400)
        { x: 315, y: 340 }, // platform (350,400)
        { x: 440, y: 340 }, // platform (450,400)
        { x: 565, y: 340 }, // platform (550,400)
      
        // 5-7: Above the large platform zigzag route
        // { x: 800, y: 370 },  // Platform (700, 400) Middle of long platform
        { x: 1070, y: 370 }, 
        { x: 1290, y: 220 }, 
      
        // 8-9: Small aerial platforms
        // { x: 1700, y: 150 }, // platform
        { x: 1850, y: 40 },  // platform
      
        // 10-12: Staircase landing area
        // { x: 2170, y: 510 }, 
        { x: 3140, y: 390 },
        { x: 2720, y: 160 },
      
        // 13-15: High columns in the terminal area
        { x: 3545, y: 200 },
        // { x: 3755, y: 230 },
        { x: 3945, y: 200 },
        // { x: 4155, y: 230 },
      
        // 16-18: Platform in front of the portal area

        // { x: 4500, y: 370 }, // In front of the portal (4450, 400) upwards
        { x: 4590, y: 340 }
      ],
      enemies: [
        { type: "Bird", position: createVector(275, 400) },
        { type: "Bird", position: createVector(400, 275) },
        { type: "Bird", position: createVector(525, 300) },
        { type: "Bird", position: createVector(650, 375) },
        //{ type: "Bird", position: createVector(100, 200) },
        { type: "Bat", position: createVector(800, 300) },
        { type: "Bat", position: createVector(1500, 220) },
        //{ type: "Fish", position: createVector(1200, 500) }
      ],
      portalPosition: createVector(4700, 320),//cailing
      //ground: { x: 0, y: 620, w: 4800, h: 40 },The third level of the city in the sky doesn't want the ground zkx~~~~~~~~
      platforms: [//cailing
      // //{ x: 0, y: 620, w: 4800, h: 40 },//Length of main floor (determined by the width of the first platform)
      { x: 0, y: 400, w: 229, h: 8,type: "o" },//2.1 Starting platform
      { x: 229, y: 400, w: 5, h: 150, type: "o" },//2.1.right

      { x: 310, y: 400, w: 50, h: 8,type: "o" },//2.3 Small platform 1 [two gaps set for flying birds]
      { x: 310, y: 400, w: 5, h: 20, type: "oo" },//2.3.left
      { x: 358, y: 400, w: 5, h: 20,type: "oo" },//2.3.right

      { x: 435, y: 400, w: 50, h: 8, type: "o" },//2.4 Small platform 2 [Setting gold coins in the air]
      { x: 435, y: 400, w: 5, h: 20, type: "o" },//2.4.left
      { x: 483, y: 400, w: 5, h: 20, type: "o" },//2.4.right

      { x: 560, y: 400, w: 50, h: 8 ,type: "o"},//2.5 Small platform 3
      { x: 560, y: 400, w: 5, h: 20, type: "o" },//2.5.left
      { x: 608, y: 400, w: 5, h: 20, type: "o" },//2.5.right

      { x: 700, y: 400, w: 5, h: 150,type: "o" },//2.6.1 Zigzag big platform start
      { x: 700, y: 400, w: 260, h: 8 ,type: "o"},//2.6.2
      { x: 958, y: 400, w: 5, h: 40,type: "o" },//2.6.3
      { x: 958, y: 438, w: 170, h: 8,type: "o" },//2.6.4 [Setting Gold Coins]
      { x: 1125, y: 280, w: 5, h: 160,type: "o" },//2.6.5
      { x: 1125, y: 280, w: 270, h: 8,type: "o" },//2.6.6
      { x: 1393, y: 280, w: 5, h: 40,type: "o" },//2.6.7
      { x: 1393, y: 318, w: 220, h: 8,type: "o" },//2.6.8
      { x: 1613, y: 318, w: 5, h: 220, type: "o" },//2.6.9

      { x: 1690, y: 180, w: 50, h: 8 ,type: "o"},//2.7 Small platform 1
      { x: 1690, y: 180, w: 5, h: 20 ,type: "o"},//2.7.left 
      { x: 1738, y: 180, w: 5, h: 20 , type: "o"},//2.7.right

      { x: 1840, y: 100, w: 50, h: 8 , type: "o"},//2.7 Small platform 2
      { x: 1840, y: 100, w: 5, h: 20 , type: "o"},//2.7.left 
      { x: 1888, y: 100, w: 5, h: 20 , type: "o"},//2.7.right

      { x: 2100, y: 580, w: 50, h: 8,type: "o" },
      // { x: 2160, y: 540, w: 5, h: 40 },//2.8 Stairway to start
      { x: 2160, y: 540, w: 50, h: 8,type: "o" },//
      // //{ x: 2210, y: 500, w: 5, h: 45 },
      { x: 2210, y: 500, w: 50, h: 8 ,type: "o"},
      // //{ x: 2258, y: 460, w: 5, h: 45 },
      { x: 2260, y: 460, w: 50, h: 8 ,type: "o"},
      // //{ x: 2310, y: 422, w: 5, h: 45 },
      { x: 2310, y: 420, w: 50, h: 8 ,type: "o"},
      // //{ x: 2360, y: 382, w: 5, h: 45 },
      { x: 2360, y: 380, w: 50, h: 8 ,type: "o"},
      // //{ x: 2410, y: 342, w: 5, h: 45 },
      { x: 2410, y: 340, w: 200, h: 8, type: "o" },
      // //{ x: 2610, y: 300, w: 5, h: 45 },

      // //{ x: 2610, y: 300, w: 50, h: 8 , type: "oooooo"},//2.9 Second staircase upwards
      { x: 2660, y: 260, w: 50, h: 8 , type: "o"},
      { x: 2710, y: 220, w: 50, h: 8 , type: "o"},
      { x: 2760, y: 180, w: 50, h: 8 , type: "o"},
      { x: 2810, y: 140, w: 50, h: 8 , type: "o"},
      { x: 2860, y: 100, w: 500, h: 8 , type: "o"},

      { x: 2610, y: 380, w: 50, h: 8 , type: "o"},//2.10 Two down the stairs [gold coins in the upper right air]
      { x: 2660, y: 420, w: 50, h: 8 , type: "o"},
      { x: 2710, y: 460, w: 50, h: 8 , type: "o"},
      { x: 2760, y: 500, w: 50, h: 8 , type: "o"},
      { x: 2810, y: 540, w: 300, h: 8 , type: "o"},

      { x: 3550, y: 300, w: 40, h: 380 , type: "oo"},
      { x: 3510, y: 260, w: 120, h: 20 , type: "o"},//2.11 pillar 
      { x: 3520, y: 270, w: 100, h: 20 , type: "o"},
      { x: 3530, y: 280, w: 80, h: 20 , type: "o"},
      { x: 3540, y: 290, w: 60, h: 20 , type: "o"},

      { x: 3710, y: 260, w: 120, h: 20, type: "o" },//2.11 pillar 2
      { x: 3720, y: 270, w: 100, h: 20 , type: "o"},
      { x: 3730, y: 280, w: 80, h: 20 , type: "o"},
      { x: 3740, y: 290, w: 60, h: 20 , type: "o"},
      { x: 3750, y: 300, w: 40, h: 380 , type: "o"},

      { x: 3910, y: 260, w: 120, h: 20 , type: "o"},//2.11 pillar 3
      { x: 3920, y: 270, w: 100, h: 20 , type: "o"},
      { x: 3930, y: 280, w: 80, h: 20 , type: "o"},
      { x: 3940, y: 290, w: 60, h: 20 , type: "o"},
      { x: 3950, y: 300, w: 40, h: 380 , type: "o"},

      { x: 4110, y: 260, w: 120, h: 20 , type: "o"},//2.11 pillar 4
      { x: 4120, y: 270, w: 100, h: 20 , type: "o"},
      { x: 4130, y: 280, w: 80, h: 20 , type: "o"},
      { x: 4140, y: 290, w: 60, h: 20 , type: "o"},
      { x: 4150, y: 300, w: 40, h: 380 , type: "o"},

      { x: 4450, y: 400, w: 350, h: 20, type: "o" },//Portal platform
      ],
      items: [
        //{ x: 300, y: 320, type: "Freeze Element" },
        { x: 200, y: 320, type: "Thunder Element" },
        //{ x: 1400, y: 360, type: "Strengthen" },
        { x: 1675, y: 75, type: "Heart" },
        //{ x: 1900, y: 320, type: "Mystery Box" }
        //{ x: 500, y: 460, type: "Teleport Scroll" }
      ],
      obstacles: [
        //{ x: 1200, y: 540, type: "Spiked Wall", w: 40, h: 80 }
      ],/*
      advancedBirds: {
        positions: [createVector(1000, 200)],
        ranges: [100],
        type: "default"
      }*/
    },
    {
      levelName: "Shadow Realm",
      levelNumber: 4, // cailing
      element: "wind",
      playerStart: createVector(60, 500), // cailing
      coins: [
        //1-3: Jumping platforms in the starting area
        { x: 410, y: 270 },  // Tallest Cube (300, 210)
        // { x: 650, y: 230 },  // cube (640, 260)
        { x: 1050, y: 230 },  // cube (980, 260)
      
        //4-7: Gold coins in the first section of the bridged platform
        { x: 1520, y: 250 }, // cube (1660, 260)
        // { x: 2000, y: 360 }, // Middle of the bridge (2000, 390)
        { x: 2350, y: 200 }, // The end of the bridge (2300, 270)
        // { x: 2600, y: 330 }, // Start of the descent (2600, 360)
      
        //8-11: Gold coins in the second segment of the bridged platform
        // { x: 3000, y: 360 }, // Middle of the bridge (3000, 390)
        { x: 3350, y: 180 }, // The end of the bridge (3300, 270)
        // { x: 3650, y: 330 }, // Start of the descent (3600, 360)
        { x: 3840, y: 400 },
      
        //12-15: Gold coins in the terminal area
        { x: 4030, y: 320 }, // cube (4100, 400)
        // { x: 4250, y: 320 }, // cube (4250, 350)
        { x: 4330, y: 220 }, // cube (4400, 300)
        { x: 4700, y: 120 }  // Portal platform (4800, 200)
      ],
      //Add multiple enemies, spread across different platforms
      enemies: [
        { type: "Spider", position: createVector(2400, 195) },
        { type: "Spider", position: createVector(3200, 195) },
      ],
      portalPosition: createVector(5100, 120), // cailing
      platforms: [
        { x: 0, y: 580, w: 4900, h: 40, type: "u" },  //main ground
        { x: 380, y: 480, w: 80, h: 40, type: "u" },
        { x: 380, y: 345, w: 80, h: 40, type: "u" },
        { x: 650, y: 360, w: 50, h: 50, type: "u" },
        { x: 900, y: 360, w: 50, h: 50, type: "u" },
        { x: 1150, y: 360, w: 50, h: 50, type: "u" },
        { x: 1400, y: 360, w: 50, h: 50, type: "u" },
        { x: 1650, y: 360, w: 50, h: 50, type: "u" },
        { x: 1900, y: 450, w: 50, h: 50, type: "u" },
        { x: 1950, y: 420, w: 50, h: 50, type: "u" },
        { x: 2000, y: 390, w: 50, h: 50, type: "u" },
        { x: 2050, y: 360, w: 50, h: 50, type: "u" },
        { x: 2100, y: 330, w: 50, h: 50, type: "u" },
        { x: 2150, y: 300, w: 50, h: 50, type: "u" },
        { x: 2200, y: 270, w: 50, h: 50, type: "u" },
        { x: 2250, y: 270, w: 50, h: 50, type: "u" },
        { x: 2300, y: 270, w: 50, h: 50, type: "u" },
        { x: 2350, y: 270, w: 50, h: 50, type: "u" },
        { x: 2400, y: 270, w: 50, h: 50, type: "u" },
        { x: 2450, y: 270, w: 50, h: 50, type: "u" },
        { x: 2500, y: 300, w: 50, h: 50, type: "u" },
        { x: 2550, y: 330, w: 50, h: 50, type: "u" },
        { x: 2600, y: 360, w: 50, h: 50, type: "u" },
        { x: 2650, y: 390, w: 50, h: 50, type: "u" },
        { x: 2700, y: 420, w: 50, h: 50, type: "u" },
        { x: 2750, y: 450, w: 50, h: 50, type: "u" },
        { x: 2900, y: 450, w: 50, h: 50, type: "u" },
        { x: 2950, y: 420, w: 50, h: 50, type: "u" },
        { x: 3000, y: 390, w: 50, h: 50, type: "u" },
        { x: 3050, y: 360, w: 50, h: 50, type: "u" },
        { x: 3100, y: 330, w: 50, h: 50, type: "u" },
        { x: 3150, y: 300, w: 50, h: 50, type: "u" },
        { x: 3200, y: 270, w: 50, h: 50, type: "u" },
        { x: 3250, y: 270, w: 50, h: 50, type: "u" },
        { x: 3300, y: 270, w: 50, h: 50, type: "u" },
        { x: 3350, y: 270, w: 50, h: 50, type: "u" },
        { x: 3400, y: 270, w: 50, h: 50, type: "u" },
        { x: 3450, y: 270, w: 50, h: 50, type: "u" },
        { x: 3500, y: 300, w: 50, h: 50, type: "u" },
        { x: 3550, y: 330, w: 50, h: 50, type: "u" },
        { x: 3600, y: 360, w: 50, h: 50, type: "u" },
        { x: 3650, y: 390, w: 50, h: 50, type: "u" },
        { x: 3700, y: 420, w: 50, h: 50, type: "u" },
        { x: 3750, y: 450, w: 50, h: 50, type: "u" },
        { x: 4000, y: 400, w: 80, h: 50, type: "u" },
        { x: 4150, y: 350, w: 80, h: 50, type: "u" },
        { x: 4300, y: 300, w: 80, h: 50, type: "u" },
        { x: 4450, y: 250, w: 80, h: 50, type: "u" },
        { x: 4700, y: 200, w: 500, h: 20, type: "uuu" }
      ],
      
      // Add more ghost configurations for a wider variety of enemies
      ghosts: [
        { position: createVector(1000, 300), range: 250 },
        //{ position: createVector(1900, 300), range: 250 },
        { position: createVector(2100, 350), range: 200 },
        { position: createVector(2700, 300), range: 250 },
        //{ position: createVector(3200, 350), range: 200 },
        { position: createVector(4000, 300), range: 150 }
      ],
      items: [
        { x: 1800, y: 220, type: "Heart" },
        { x: 2800, y: 420, type: "Heart" },
      ],
      obstacles: [
        //{ x: 1300, y: 540, type: "Gear", w: 50, h: 50 },
        //{ x: 1700, y: 540, type: "Flame", w: 40, h: 40 },
        { x: 2515, y: 205, type: "Laser", w: 10, h: 100 }
      ]
    },
    {
      levelName: "Crystal Caverns",
      levelNumber: 5,//cailing
      element: "earth",
      playerStart: createVector(100, 500),
      coins: [
        { x: 478, y: 350 },  
        { x: 878, y: 150 },
        { x: 1278, y: 250 },
        { x: 1698, y: 450 },
        { x: 1820, y: 350 },
        { x: 2120, y: 250 },
        { x: 2420, y: 150 },
        { x: 3020, y: 150 },
        // { x: 3340, y: 70  },
        // { x: 3130, y: 520 },
        { x: 3520, y: 400 },
        { x: 4720, y: 450 }     
      ],
  enemies: [
    // On the ‘vv’ series of platforms
   // { type: "Frog",   position: createVector(2150, 270) },          // platform {x:2100,y:300,...}
    { type: "Frog",   position: createVector(2750, 170) },          // platform {x:2700,y:200,...}
    
    // On a low long platform (vvv)
    { type: "Frog",   position: createVector(3100, 520) },          // Located on the left side of the platform
    { type: "Spider", position: createVector(3300, 520) },          // Located on the right side of the platform
    
    // On the upper floating platform
    { type: "Frog",   position: createVector(3950, 220) },          // platform {x:3900,y:250,...}
  ],
      portalPosition: createVector(4800, 420),
      platforms: [
        //{ x: 0, y: 580, w: 100, h: 8, type: "v"  },
        { x: 0, y: 600, w: 4800, h: 40 , type: "vvvvvvvvvvvvvvvvvvvvvvvvvvvv"},  // main ground
        { x: 300, y: 500, w: 10, h: 100 , type: "v"},  // thin vertical column
        { x: 500, y: 400, w: 10, h: 200, type: "v" },  
        { x: 700, y: 300, w: 10, h: 300, type: "v" },  
        { x: 900, y: 200, w: 10, h: 400 , type: "v"},//Rui   
        { x: 1100, y: 200, w: 10, h: 400 , type: "v"},  
        { x: 1300, y: 300, w: 10, h: 300 , type: "v"},  
        { x: 1500, y: 400, w: 10, h: 200 , type: "v"},
        { x: 1715, y: 500, w: 10, h: 100 , type: "v"},


        { x: 1800, y: 400, w: 100, h: 20,type: "vv" },//Fragile platforms
        { x: 2100, y: 300, w: 100, h: 20 , type: "vv"},  
        { x: 2400, y: 200, w: 100, h: 20 , type: "vv"}, 
        { x: 2700, y: 200, w: 100, h: 20 , type: "vv"}, 
        { x: 3000, y: 200, w: 100, h: 20 , type: "vv"}, 
        { x: 3300, y: 100, w: 100, h: 20 , type: "vv"}, 


        { x: 3000, y: 550, w: 300, h: 50, type: "vvv" },  // low and long platform
        { x: 3500, y: 450, w: 100, h: 20 , type: "vv"},  // Floating platform 1
        { x: 3700, y: 350, w: 100, h: 20, type: "vv" },  // Floating platform 2
        { x: 3900, y: 250, w: 100, h: 20 , type: "vv"},  // Floating platform 3
        { x: 4100, y: 150, w: 100, h: 20 , type: "vv"},  // Floating platform 4

        { x: 4600, y: 500, w: 300, h: 20 , type: "vvv"},  // Final platform (portal location)
      ],
      ghosts: [
        { position: createVector(3350, 70), range: 250 },
        { position: createVector(3550, 420), range: 250 },
        { position: createVector(4150, 120), range: 200 },
        // { position: createVector(2700, 300), range: 250 },
        // { position: createVector(3200, 350), range: 200 },
        // { position: createVector(4000, 300), range: 150 }
      ],
      //ground: [{ x: 0, y: 600, w: 2200, h: 40 },//kx
       // { x: 2650, y: 600, w: 1050, h: 40},{ x: 4525, y: 600, w: 850, h: 40}],//The ground is no longer continuous，kx~~~~~
      items: [
        //{ x: 700, y: 480, type: "Invincibility" }
        { x: 1060, y: 80, type: "Heart" },
        { x: 3708, y: 175, type: "Heart" }
      ],
      axes: {
        //positions: [createVector(1200, 300)],
        positions: [createVector(3580, 240)],
        swingTimes: [1]
      },
      obstacles: [
        //{ x: 1200, y: 550, type: "Blade", w: 40, h: 40 },
        //{// x: 350, y: 520, type: "Spiked Wall", w: 80, h: 80 },
        //{ x: 520, y: 520, type: "Spiked Wall", w: 80, h: 80 },
        { x: 310, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 350, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 390, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 430, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 470, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 510, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 550, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 590, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 630, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 670, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 710, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 750, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 790, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 830, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 870, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 910, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 950, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 990, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1030, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1070, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1110, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1150, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1190, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1230, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1270, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1310, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1350, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1390, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1430, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1470, y: 540, type: "Spiked Wall", w: 40, h: 60 },     
        { x: 1510, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1550, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1590, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1630, y: 540, type: "Spiked Wall", w: 40, h: 60 },
        { x: 1670, y: 540, type: "Spiked Wall", w: 40, h: 60 },   
      ]
    }
  ];
}

function drawHUD(level, settings) {
  push();
  fill(0, 0, 0, 150);
  rect(10, 10, 250, 100, 10);

  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text(`Level: ${level.levelName}`, 20, 20);
  text(`Coins: ${player.coins} / ${level.totalCoins}`, 20, 50);
  text(`Lives: ${player.lives}`, 20, 80);
  pop();

  settings.drawSettingsButton();
}