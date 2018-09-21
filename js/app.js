'use strict'

// game global identifiers
var game = {
  roadRows: [1,2,3],
  tile: {width: 101, height: 83},
  time: 0
};

// Enemies our player must avoid
function Enemy(x,y,vx) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = x;
    this.y = y;
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

    this.vx = vx; // enemy velocity

    this.timeLeftScreen;
    this.onScreen = true;
    this.xRes = 0;
    this.xResAccum = 0;
    this.xInt;
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  if(this.onScreen) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    console.log(this.xInt, this.x, this.xRes, this.xResAccum);
    this.x += this.vx*dt;
    this.xRes = Math.floor(this.x) - this.x;
    this.xInt = Math.floor(this.x); // TODO: set to this.x
    this.xResAccum += this.xRes;

    // if this.x > threshold, remove enemy, respawn enemy
    // if (this.x > ctx.canvas.width) {
    if (this.x > -95) {
      this.timeLeftScreen = game.time;
      this.onScreen = false;
      // this.x = -game.tile.width;
    }
  }
  // if this.x > 0, then lane becomes available
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
  this.y = 166-19;
  // By choice, employ same sprite shift as Enemy:
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

// y = n*83-19, where n is a randomly selected row of the road
// every 20 s spawn another enemy until there are 3

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
