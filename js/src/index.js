var game = {
    width : 640,
    height : 360,
    ctx : undefined,
    platform : undefined,
    ball : undefined,
    rows : 4,
    cols : 4,
    blocks : [],
    sprites : {
        background : undefined,
        platform : undefined,
        ball : undefined,
        block : undefined
    },
    init : function() {
        var canvas = document.querySelector('#mycanvas');
        this.ctx = canvas.getContext("2d");

        window.addEventListener("keydown", function(e) {
            if(e.keyCode == 37 ) {
                game.platform.dx = - game.platform.velocity;
            } else if (e.keyCode == 39) {
                game.platform.dx = game.platform.velocity;
            } else if (e.keyCode == 32) {
                game.platform.releaseBall();
            };
        });

        window.addEventListener("keyup", function(e) {
            game.platform.stop();
        });

    },
    load : function() {
        for (var key in this.sprites) {
            this.sprites[key] = new Image();
            this.sprites[key].src = "img/"+ key +".png";
        };

    },
    create : function() {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                this.blocks.push({
                    x : 130 * col + 60,
                    y : 45 * row + 15,
                    width : 110,
                    height : 37,
                    isAlive: true
                });
            };
        };
    },
    start : function() {
        this.init();
        this.create();
        this.load();
        this.run();
        
    },
    render : function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.ctx.drawImage(this.sprites.background, 0, 0);
        this.ctx.drawImage(this.sprites.platform, this.platform.x, this.platform.y);
        
        this.blocks.forEach(function(element) {
            if (element.isAlive) {
                this.ctx.drawImage(this.sprites.block, element.x, element.y);
            }
        }, this);

        this.ctx.drawImage(this.sprites.ball, this.ball.x, this.ball.y);
    },
    update : function() {
        if (this.platform.ball == false) {
            if (this.ball.collide(this.platform)) {
                this.ball.bumpPlatform(this.platform);
            };
        };

        if (this.platform.dx) {
            this.platform.move();
        };
        if (this.ball.dx || this.ball.dy) {
            this.ball.move();
        };

        this.blocks.forEach(function(element) {
            if (element.isAlive) {
                if (this.ball.collide(element)) {
                        this.ball.bumpBlock(element);
                };
            };
        }, this);

        this.ball.checkBounds();

    },
    run : function() {
        this.update();
        this.render();
        window.requestAnimationFrame(function() {
            game.run();
        });
    },
    over : function() {

    }
};

game.ball = {
    width : 30,
    height : 30,
    x : 320,
    y : 295,
    dx : 0,
    dy : 0,
    velocity : 3,
    jump : function() {
        this.dy = - this.velocity;
        this.dx = - this.velocity;
    },
    move : function() {
        this.x += this.dx;
        this.y += this.dy;
    },
    collide : function(element) {
        var x = this.x + this.dx;
        var y = this.y + this.dy; 
        if (x + this.width > element.x &&
             x < element.x + element.width &&
             y + this.height > element.y &&
             y < element.y + element.height) {
                 return true;
             };
        return false;

    },
    bumpBlock : function(block) {
        this.dy *= -1;
        block.isAlive = false;
    },
    onTheLeftSide : function(platform) {
        return (this.x + this.width / 2) < (platform.x + platform.width / 2)
    },
    bumpPlatform : function(platform) {
        this.dy = -this.velocity;
        this.dx = this.onTheLeftSide(platform) ? -this.velocity : this.velocity;
    },
    checkBounds : function() {
        var x = this.x + this.dx;
        var y = this.y + this.dy;

        if (x < 0) {
            this.x = 0;
            this.dx = this.velocity;
        } else if( x + this.width > game.width) {
            this.x = game.width - this.width;
            this.dx = -this.velocity;
        } else if ( y < 0) {
            this.y = 0;
            this.dy = this.velocity;
        } else if ( y + this.height > game.height) {
            game.over();
        }
    }
};

game.platform = {
    x : 280,
    y : 300,
    velocity : 6,
    dx : 0,
    ball : game.ball,
    width : 110,
    height : 31,
    releaseBall : function() {
        if (this.ball) {
            this.ball.jump();
            this.ball = false;
        }
    },
    move : function() {
        this.x += this.dx;
        if (this.ball) {
            this.ball.x += this.dx;
        }
    },
    stop : function() {
        this.dx = 0;
        if (this.ball) {
            this.ball.dx = 0;
        }
    }
};

window.addEventListener("load", function() {
    game.start();
});