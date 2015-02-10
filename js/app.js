/**
 * app.js
 * This is the file that houses the main game logic. It includes an Enemy
 * class (and prototype), Player class, and Scoreboard class.
 * It then initializes these classes appropriately and sets up key handlers.
 */

/**
 * This is the Enemy constructor.
 * It sets the image file, starting coordinates (random), and initial velocity.
 */
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';

    this.x = 0;
    this.y = this.randomStartingPos();
    this.velocity = this.randomVelocity();
}

/**
 * This is the Enemy prototype.
 * It defines functions that apply to all enemies.
 */
Enemy.prototype = {
    /**
     * This function determines if the enemy is within the boundaries of the game.
     * @return {boolean} This returns whether the enemy's x-coordinate is less than 404.
     */
    isInBoundaries: function() {
        return this.x < 404;
    },

    /**
     * This function draws the enemy on the canvas
     */
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },

    /**
     * This function creates a random starting row.
     * @return {integer} This returns a random row number * 83 (number of pixels per row).
     */
    randomStartingPos: function() {
        return (Math.floor(Math.random() * 3) * 83) + 83;
    },

    /**
     * This function creates a random starting velocity.
     * @return {integer} A random number between 50 & 300.
     */
    randomVelocity: function() {
        return Math.random() * (300 - 50) + 50;
    },

    /**
     * This function updates the enemy's position
     * @param  {float} This is the delta time period to multiply by.
     * @return {float} This returns the delta time period multiplied by the enemy's velocity.
     */
    update: function(dt) {
        this.x += (this.velocity * dt);
    }
};

/**
 * This is the Player constructor.
 * It sets the image file and starting coordinates (bottom row, middle square).
 */
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 415;
}

/**
 * This is the Player prototype.
 * It defines functions that apply to all players.
 */
Player.prototype = {
    /**
     * This function takes a direction and changes the player's position accordingly.
     * @param  {string} This direction to move the player.
     * @return {number} The result of applying the direction to the player's current position.
     */
    handleInput: function(direction) {
        switch(direction) {
            case 'left':
                this.x -= 101;
                break;
            case 'right':
                this.x += 101;
                break;
            case 'up':
                this.y -= 83;
                break;
            case 'down':
                this.y += 83;
                break;
        }
    },

    /**
     * This function draws the player on the canvas
     */
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },

    /**
     * This function resets the player to the starting position.
     */
    reset: function() {
        this.x = 202;
        this.y = 415;
    },

    /**
     * This function determines if the player's current position is out of bounds.
     * If it is, it resets the player's position.
     */
    resetOnBoundaries: function() {
        // out of bounds?
        if (this.x < 0 || this.x > 404 || this.y > 415) {
            this.reset();
        }
    },

    /**
     * This function determines if the player's current position overlaps with an enemie's position.
     * If it does, it decreases the score, and reset's the player's position
     */
    resetOnCollisions: function() {
        allEnemies.forEach(function(enemy) {
            // x's are between enemy margin and in same y row
            if (((this.x >= (enemy.x - 40)) && (this.x <= (enemy.x + 40))) && (this.y === enemy.y)) {
                this.reset();
                scoreBoard.decrement();
            }
        }.bind(this));
    },

    /**
     * This function determines if the player's current position is over water.
     * If it it, it resets the player's position and decrements the score.
     */
    resetOnWater: function() {
        // highest y row is water
        if (this.y < 83) {
            this.reset();
            scoreBoard.increment();
        }
    },

    /**
     * This function updates the player's position
     * @param  {float} This is the delta time period to multiply by.
     * @return {null} There is no return value, rather we check for reset conditions.
     */
    update: function(dt) {
        this.resetOnWater();
        this.resetOnCollisions();
        this.resetOnBoundaries();
    }
};


/**
 * This is the Scoreboard constructor.
 * It sets the initial score (0) and the coordinates it should be drawn at.
 */
var Scoreboard = function() {
    this.score = 0;
    this.x = 10;
    this.y = 100;
}

/**
 * This is the Scoreboard prototype.
 * It defines functions that apply to all scoreboards.
 */
Scoreboard.prototype = {
    /**
     * This function decrements the current score.
     */
    decrement: function() {
        this.score--;
    },

    /**
     * This function increments the current score.
     */
    increment: function() {
        this.score++;
    },

    /**
     * This function draws the scoreboard on the canvas.
     */
    render: function() {
        ctx.font = "24pt Impact";

        ctx.fillStyle = "white";
        ctx.fillText(this.text(), this.x, this.y);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(this.text(), this.x, this.y);
    },

    /**
     * This function determines the text to be drawn to the game.
     * @return {string} A label plus the current score value.
     */
    text: function() {
        return "Score: " + this.score;
    }
}


// Instantiate the game objects.
var allEnemies = [];
var player = new Player();
var scoreBoard = new Scoreboard();

// Set initial variable values.
var enemyCount = 0;
var enemyCountMax = 3;

// Create the maximum number of enemies.
while (enemyCount < enemyCountMax) {
    allEnemies.push(new Enemy());
    enemyCount++;
}

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
