'use strict'

// game global identifiers other than character classes and their instance vars
var game = {
  // game board character Y positions
  boardY: {
    waterFront: -19,
    topRoadLane: 83 - 19,
    middleRoadLane: 2*83 - 19,
    bottomRoadLane: 3*83 - 19,
    topGrassRow: 4*83 - 19,
    bottomGrassRow: 5*83 - 19
  },
  // The height of the opaque part of a ground tile is effectively given by:
  //   171 - 50 = 121
  // By inspection, the enemy image is centered about this opaque part.
  // Center the enemy image about the lit part of the ground.
  // The height of the lit part of a ground is effectively 83.
  // So, the position shift to center enemy image to this lit part is:
  //   83/2 - 121/2 = -38/2 = -19
  // Note that 38 = 121 - 83 = the height of the unlit part of the ground.
  // Thus, enemy image position at row 0 is: 0 - 19 = -19.
  // Enemy image position at row 1 is: 83 - 19 = 64.
  // . . .
  // Enemy image position at row n is: n*83 - 19.
  // That is, this.y(row) = row*83 - 19.

  /* Check whether rectangles 'a' and 'b' intersect.
   * Each argument is a rectangle side coordinate. */
  coll2Rects: function (aLeft,aRight,aTop,aBottom, bLeft,bRight,bTop,bBottom) {
    return (
      aLeft < bRight && aRight > bLeft &&
      aTop < bBottom && aBottom > bTop
    );
  },
  inProgress: true,
  loss: false,
  messageTime: 0,
  /* Reset game. */
  reset: function () {
      location.reload();
    },
  /* Render loss message. */
  showLossMessage: function (canvas) {
    for (var col = 0; col < 5; col++) {
      ctx.drawImage(Resources.get('images/stone-block.png'),
        col * game.tile.width, 0);
      ctx.drawImage(Resources.get('images/stone-block-down.png'),
        col * game.tile.width, game.tile.fileHeight + 2*game.tile.height);
    }
    ctx.fillStyle = 'gray';
    ctx.fillRect(0,game.tile.fileHeight,canvas.width,2*game.tile.height);
    ctx.fillStyle = 'black';
    ctx.fillText('Avatar met an untimely death.', 2.5*game.tile.width,
      game.tile.fileHeight+game.tile.height);
  },
  /* Render win message. */
  showWinMessage: function (canvas) {
    for (var col = 0; col < 5; col++) {
      ctx.drawImage(Resources.get('images/water-block.png'),
        col * game.tile.width, 0);
      ctx.drawImage(Resources.get('images/water-block-down.png'),
        col * game.tile.width, game.tile.fileHeight + 2*game.tile.height);
    }
    ctx.fillStyle = 'cornflowerblue';
    ctx.fillRect(0,game.tile.fileHeight,canvas.width,2*game.tile.height);
    ctx.fillStyle = 'midnightblue';
    ctx.fillText('Avatar swam to safety. Game won!', 2.5*game.tile.width,
      game.tile.fileHeight+game.tile.height);
  },
  tile: {width: 101, height: 83, fileHeight: 171},
  won: false
};


// Enemies our player must avoid
function Enemy(x,y,vx) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started
  this.x = x;
  this.y = y;

  this.vx = vx; // enemy velocity

  // The image/sprite for our enemies
  if( this.vx > 0 ) {
    this.sprite = 'images/enemy-bug.png';
  } else {
    this.sprite = 'images/enemy-bug-leftward.png';
  }

  // The reference collision profile is defined by 2 rectangles. Each rectangle
  // is defined by the coordinates of its top-left corner (tlx, tly) and its
  // bottom-right corner (brx, bry). Corner coordinates are relative to the
  // Enemy instance current (x, y).
  if( this.vx > 0 ) {
    this.collRect =  [
      { tlx: 16, tly: 87, brx: 93, bry: 129 },
      { tlx: 24, tly: 129, brx: 77, bry: 143 }
    ];
  } else {
    this.collRect =  [
      { tlx: 8, tly: 87, brx: 85, bry: 129 },
      { tlx: 24, tly: 129, brx: 77, bry: 143 }
    ];
  }
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // You should multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x += this.vx*dt;

  if (this.vx > 0) {
    if (this.x > ctx.canvas.width) {
      this.x = -game.tile.width;
    }
  } else {
    if (this.x < -game.tile.width) {
      this.x = 5*game.tile.width;
    }
  }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  ctx.drawImage( Resources.get(this.sprite), this.x, this.y );
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player () {
  this.sprite = 'images/char-boy.png';

  this.x = 2*game.tile.width;
  this.y = game.boardY.topGrassRow;
  // By choice, employ same vertical sprite shift as Enemy:
  // this.y(row) = row*83 - 19.

  // The reference collision profile is defined by 2 rectangles. Each rectangle
  // is defined by the coordinates of its top-left corner (tlx, tly) and its
  // bottom-right corner (brx, bry). Corner coordinates are relative to the
  // Player instance current (x, y).
  this.collRect =  [
    { tlx: 24, tly: 66, brx: 77, bry: 121 },
    { tlx: 36, tly: 121, brx: 66, bry: 138 }
  ];
};

Player.prototype.update = function(dt) {
  // TODO: add smooth motion
};

/* Check for any collision between player and any enemy based on whether there
 * are any rectangles that model the player that intersect any rectangles that
 * model an enemy. */
Player.prototype.collisionWithAnyEnemy = function () {
  // loop over each enemy
  allEnemies.forEach(function eachEnemy(enemy) {
    // loop over each rectangle representing player body
    player.collRect.forEach(function pCollRect(playerCollRect) {
      // loop over each rectangle representing an enemy body
      enemy.collRect.forEach(function eCollRect(enemyCollRect) {
        // if any player rectangle intersects with any enemy rectangle
        if ( game.coll2Rects(
          player.x + playerCollRect.tlx, player.x + playerCollRect.brx,
          player.y + playerCollRect.tly, player.y + playerCollRect.bry,
          enemy.x + enemyCollRect.tlx, enemy.x + enemyCollRect.brx,
          enemy.y + enemyCollRect.tly, enemy.y + enemyCollRect.bry
        ) ) { // player is in collision with enemy
          game.inProgress = false;
          game.loss = true;
          game.messageTime = Date.now();
        }
      });
    });
  });
};

/* Render player sprite. */
Player.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/* Control player 2D snap motion, including boundary and goal line effects. */
Player.prototype.handleInput = function(key) {
  if(key==='left' && this.x>0) {
    // move left unless at farthest left column
    this.x -= game.tile.width;
  } else if (key==='right' && this.x < 4*game.tile.width) {
    // move right unless at farthest right column
    this.x += game.tile.width;
  } else if (key==='down'  &&  this.y < game.boardY.bottomGrassRow) {
    // move down unless at bottom row
    this.y += game.tile.height;
  } else if (key==='up') {
    if (this.y > game.boardY.topRoadLane) {
      // move down unless at row just below water
      this.y -= game.tile.height;
    } else {
      // if at row just below water, then moving up wins the game
      game.inProgress = false;
      game.won = true;
      // game.messageTime = Date.now();
    }
  }
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
