'use strict'

// game global identifiers other than character classes and their instances
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

  // Center coordinates of a character reference collision circle
  collCircCenterX: function (characterX, collCirc) {
    return characterX + collCirc.tlx + collCirc.rad;
    // return: <circle center x> = <top-left corner x> + radius
  },
  collCircCenterY: function (characterY, collCirc) {
    return characterY + collCirc.tly + collCirc.rad;
  },
  // Distance between two points
  dist2pts: function (x1,y1,x2,y2) {
    return Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) );
  },
  reset: function () {
      location.reload();
    },
  tile: {width: 101, height: 83}//,
  // time: 0
};


// Enemies our player must avoid
function Enemy(x,y,vx) {
  // Variables applied to each of our instances go here,
  // we've provided one for you to get started

  this.x = x;
  this.y = y;

  this.vx = vx; // enemy velocity

  // The image/sprite for our enemies, this uses
  // a helper we've provided to easily load images
  if( this.vx > 0 ) {
    this.sprite = Resources.get('images/enemy-bug.png');
  } else {
    this.sprite = Resources.get('images/enemy-bug-leftward.png');
  }

  // The reference collision shape is the union of 4 circles. Coordinates for
  // top-left corner of circle bounding box are (tlx, tly). These are relative
  // to the Enemy instance current (x, y).
  if( this.vx > 0 ) {
    this.collCirc = [
      { tlx: 8, tly: 83, rad: 30 },
      { tlx: 15, tly: 83, rad: 30 },
      { tlx: 50, tly: 83, rad: 25},
      { tlx: 58, tly: 119, rad: 10},
    ];
  } else {
    this.collCirc = [
      { tlx: 32, tly: 83, rad: 30 },
      { tlx: 25, tly: 83, rad: 30 },
      { tlx: 0, tly: 83, rad: 25},
      { tlx: 22, tly: 119, rad: 10},
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
      // this.onScreen = false;
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
  ctx.drawImage(this.sprite, this.x, this.y);
  ctx.strokeRect(this.x, this.y, this.sprite.width, this.sprite.height);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player () {
  this.sprite = Resources.get('images/char-boy.png');

  this.x = 2*game.tile.width;
  this.y = game.boardY.topGrassRow;
  // By choice, employ same vertical sprite shift as Enemy:
  // this.y(row) = row*83 - 19.

  // The reference collision shape is the union of 2 circles. Coordinates for
  // top-left corner of circle bounding box are (tlx, tly). These are relative
  // to the Player instance current (x, y).
  this.collCirc = [
    { tlx: 12, tly: 62, rad: 34 },
    { tlx: 32, tly: 100, rad: 20 }
  ];
};

Player.prototype.update = function(dt) {

};

Player.prototype.collisionWithAnyEnemy = function () {
  // loop over each circle representing player body
  this.collCirc.forEach(function pCollCirc(playerCollCirc) {
    // loop over each enemy
    allEnemies.forEach(function eachEnemy(enemy) {
      // loop over each circle representing an enemy body
      enemy.collCirc.forEach(function eCollCirc(enemyCollCirc) {
        // if any player circle intersects with any enemy circle
        if (
          game.dist2pts(
            game.collCircCenterX(player.x, playerCollCirc),
            game.collCircCenterY(player.y, playerCollCirc),
            game.collCircCenterX(enemy.x, enemyCollCirc),
            game.collCircCenterY(enemy.y, enemyCollCirc)
          ) < playerCollCirc.rad + enemyCollCirc.rad
        ) { // player is in collision with enemy
          game.reset();
        }
      });
    });
  });
};

Player.prototype.render = function() {
  ctx.drawImage(this.sprite, this.x, this.y);
  ctx.strokeRect(this.x, this.y, this.sprite.width, this.sprite.height);
};

Player.prototype.handleInput = function(key) {
  if(key==='left' && this.x>0) {
    this.x -= game.tile.width;
  } else if (key==='right' && this.x < 4*game.tile.width) {
    this.x += game.tile.width;
  } else if (key==='down'  &&  this.y < game.boardY.bottomGrassRow) {
    this.y += game.tile.height;
  } else if (key==='up') {
    if (this.y > game.boardY.topRoadLane) {
      this.y -= game.tile.height;
    } else {
      game.reset();
    }
  }
  console.log(this.x, this.y);
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
