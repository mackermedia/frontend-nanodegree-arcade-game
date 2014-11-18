// Enemies our player must avoid
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';

    this.x = 0;
    this.y = this.randomStartingPos();
    this.velocity = this.randomVelocity();
}

Enemy.prototype = {
    isInBoundaries: function() {
        return this.x < 404;
    },

    // Draw the enemy on the screen, required method for game
    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },

    randomStartingPos: function() {
        return (Math.floor(Math.random() * 3) * 83) + 83;
    },

    randomVelocity: function() {
        // random number between 50 & 300
        return Math.random() * (300 - 50) + 50;
    },

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update: function(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x += (this.velocity * dt);
    }
};

// Now write your own player class
var Player = function() {
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 415;
}

Player.prototype = {
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

    render: function() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    },

    reset: function() {
        // starting position
        this.x = 202;
        this.y = 415;
    },

    resetOnBoundaries: function() {
        // out of bounds?
        if (this.x < 0 || this.x > 404 || this.y > 415) {
            this.reset();
        }
    },

    resetOnCollisions: function() {
        allEnemies.forEach(function(enemy) {
            // x's are between enemy margin and in same y row
            if (((this.x >= (enemy.x - 40)) && (this.x <= (enemy.x + 40))) && (this.y === enemy.y)) {
                this.reset();
                scoreBoard.decrement();
            }
        }.bind(this));
    },

    resetOnWater: function() {
        // highest y row is water
        if (this.y < 83) {
            this.reset();
            scoreBoard.increment();
        }
    },

    update: function(dt) {
        this.resetOnWater();
        this.resetOnCollisions();
        this.resetOnBoundaries();
    }
};


// The Scoreboard
var Scoreboard = function() {
    this.score = 0;
    this.x = 10;
    this.y = 100;
}

Scoreboard.prototype = {
    decrement: function() {
        this.score--;
    },

    increment: function() {
        this.score++;
    },

    render: function() {
        ctx.font = "24pt Impact";

        ctx.fillStyle = "white";
        ctx.fillText(this.text(), this.x, this.y);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 3;
        ctx.strokeText(this.text(), this.x, this.y);
    },

    text: function() {
        return "Score: " + this.score;
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var player = new Player();
var scoreBoard = new Scoreboard();

var enemyCount = 0;
var enemyCountMax = 3;

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
