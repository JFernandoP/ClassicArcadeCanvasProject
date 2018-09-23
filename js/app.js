'use strict'

// game global identifiers
var game = {
  // game tile rows available for character horizontal movement
  lane: {top: 1, middle: 2, bottom: 3, grassShoulder: 4},
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
      this.sprite = 'images/enemy-bug.png';
    } else {
      this.sprite = 'images/enemy-bug-leftward.png';
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
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
function Player () {
  this.sprite = 'images/char-boy.png';

  this.x = 202;
  this.y = game.lane.grassShoulder*83-19;
  // By choice, employ same vertical sprite shift as Enemy:
  // this.y(row) = row*83 - 19.
};

Player.prototype.update = function(dt) {

};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();


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
