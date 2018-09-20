// Enemies our player must avoid
function Enemy() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';

    this.x = 101;
    this.y = 64;
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

    this.vx = 100; // enemy velocity
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.vx*dt;
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
var enemy1 = new Enemy();
var allEnemies = [enemy1];
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
