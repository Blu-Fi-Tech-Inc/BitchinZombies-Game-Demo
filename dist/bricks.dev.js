"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Ground =
/*#__PURE__*/
function () {
  function Ground(game, x, y, w, underground) {
    _classCallCheck(this, Ground);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      w: w
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bricks.png");
    if (underground) this.spritesheet = ASSET_MANAGER.getAsset("./sprites/underground_stuff.png");
    this.BB = new BoundingBox(this.x, this.y, this.w, PARAMS.BLOCKWIDTH * 2);
    this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2);
    this.rightBB = new BoundingBox(this.x + this.w - PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2);
  }

  _createClass(Ground, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "Brown";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, this.w / PARAMS.BITWIDTH, PARAMS.SCALE * 2);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var brickCount = this.w / PARAMS.BLOCKWIDTH;

      for (var i = 0; i < brickCount; i++) {
        ctx.drawImage(this.spritesheet, 0, 0, 16, 16, this.x + i * PARAMS.BLOCKWIDTH - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
        ctx.drawImage(this.spritesheet, 0, 0, 16, 16, this.x + i * PARAMS.BLOCKWIDTH - this.game.camera.x, this.y + PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
      }

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }]);

  return Ground;
}();

;

var Brick =
/*#__PURE__*/
function () {
  // type 0 = invis, 1 = brick, 2 = question, 3 = block
  function Brick(game, x, y, type, prize, underground) {
    _classCallCheck(this, Brick);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      prize: prize,
      type: type
    });
    this.bounce = false;
    this.velocity = 0;
    this.startTime = 0;
    this.animation = [];
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bricks.png");
    if (underground) this.spritesheet = ASSET_MANAGER.getAsset("./sprites/underground_stuff.png");
    this.animation.push(null);
    this.animation.push(new Animator(this.spritesheet, 16, 0, 16, 16, 1, 0.33, 0, false, true));
    this.animation.push(new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 80, 16, 16, 4, 1 / 8, 0, false, true));
    this.animation.push(new Animator(this.spritesheet, 48, 0, 16, 16, 1, 1, 0, false, true));
    this.BB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH / 8, this.y, PARAMS.BLOCKWIDTH * 3 / 4, PARAMS.BLOCKWIDTH);
    this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH);
    this.rightBB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH / 2, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH);
    this.topBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH / 2);
    this.bottomBB = new BoundingBox(this.x, this.y + PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH / 2);
  }

  _createClass(Brick, [{
    key: "update",
    value: function update() {
      var FALL_ACC = 562.5;
      this.velocity += FALL_ACC * this.game.clockTick;
      this.y += this.game.clockTick * this.velocity * PARAMS.SCALE;

      if (this.bounce && this.type < 3) {
        this.bounce = false;
        this.velocity = -80;

        switch (this.prize) {
          case 'Coins':
            if (this.startTime === 0) this.startTime = Date.now();

            if (Date.now() - this.startTime < 3000) {
              this.game.addEntity(new CoinPop(this.game, this.x, this.BB.top - PARAMS.BLOCKWIDTH));
              break;
            }

          case 'Coin':
            this.game.addEntity(new CoinPop(this.game, this.x, this.BB.top - PARAMS.BLOCKWIDTH));
            this.type = 3;
            break;

          case 'Growth':
            if (this.game.mario.size === 1) {
              this.game.addEntity(new Flower(this.game, this.x, this.BB.top, this));
            }

            if (this.game.mario.size === 0) {
              this.game.addEntity(new Mushroom(this.game, this.x, this.BB.top, this, 'Growth'));
            }

            this.type = 3;
            ASSET_MANAGER.playAsset("./audio/power-up-appears.mp3");
            break;

          case '1up':
            this.game.addEntity(new Mushroom(this.game, this.x, this.BB.top, this, '1up'));
            this.type = 3;
            break;
        }

        if (this.type === 1) {
          if (this.game.mario.size === 0) {
            ASSET_MANAGER.playAsset("./audio/bump.wav");
          }
        }
      }

      if (this.y > this.BB.top) this.y = this.BB.top;
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = this.type === 2 ? "Gold" : "Brown";
      if (this.type) ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.type) {
        this.animation[this.type].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
      }

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        ctx.strokeRect(this.leftBB.x - this.game.camera.x, this.leftBB.y, this.leftBB.width, this.leftBB.height);
        ctx.strokeRect(this.rightBB.x - this.game.camera.x, this.rightBB.y, this.rightBB.width, this.rightBB.height);
        ctx.strokeRect(this.topBB.x - this.game.camera.x, this.topBB.y, this.topBB.width, this.topBB.height);
        ctx.strokeRect(this.bottomBB.x - this.game.camera.x, this.bottomBB.y, this.bottomBB.width, this.bottomBB.height);
      }
    }
  }, {
    key: "explode",
    value: function explode() {
      this.game.addEntity(new Shard(this.game, this.x, this.y, -150));
      this.game.addEntity(new Shard(this.game, this.x, this.y - PARAMS.BLOCKWIDTH * 1.5, -150));
      this.game.addEntity(new Shard(this.game, this.x + PARAMS.BLOCKWIDTH, this.y - PARAMS.BLOCKWIDTH * 1.5, 150));
      this.game.addEntity(new Shard(this.game, this.x + PARAMS.BLOCKWIDTH, this.y, 150));
      this.removeFromWorld = true;
      ASSET_MANAGER.playAsset("./audio/block.mp3");
    }
  }]);

  return Brick;
}();

;

var Shard =
/*#__PURE__*/
function () {
  function Shard(game, x, y, xVelocity) {
    var yVelocity = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : -100;

    _classCallCheck(this, Shard);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.animation = new Animator(ASSET_MANAGER.getAsset("./sprites/bricks.png"), 16, 0, 8, 8, 1, 0.33, 0, false, true);
    this.velocity = {
      x: xVelocity,
      y: yVelocity
    };
    this.life = 90; //90 clock ticks -> 1.5 seconds at 60 fps
  }

  _createClass(Shard, [{
    key: "update",
    value: function update() {
      var FALL_ACC = 562.5;
      this.life -= 1;

      if (this.life <= 0) {
        this.removeFromWorld = true;
      }

      this.velocity.y += FALL_ACC * this.game.clockTick;
      this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
      this.x += this.game.clockTick * this.velocity.x;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "Brown";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, this.w / PARAMS.BITWIDTH, PARAMS.SCALE);
    }
  }]);

  return Shard;
}();

;

var Block =
/*#__PURE__*/
function () {
  function Block(game, x, y, w, underground) {
    _classCallCheck(this, Block);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      w: w
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/bricks.png");
    if (underground) this.spritesheet = ASSET_MANAGER.getAsset("./sprites/underground_stuff.png");
    this.BB = new BoundingBox(this.x, this.y, this.w, PARAMS.BLOCKWIDTH);
    this.leftBB = new BoundingBox(this.x, this.y, this.w / 2, PARAMS.BLOCKWIDTH);
    this.rightBB = new BoundingBox(this.x + this.w / 2, this.y, this.w / 2, PARAMS.BLOCKWIDTH);
  }

  _createClass(Block, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "Brown";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, this.w / PARAMS.BITWIDTH, PARAMS.SCALE);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var brickCount = this.w / PARAMS.BLOCKWIDTH;

      for (var i = 0; i < brickCount; i++) {
        ctx.drawImage(this.spritesheet, 64, 0, 16, 16, this.x + i * PARAMS.BLOCKWIDTH - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
      }
    }
  }]);

  return Block;
}();

;

var Tube =
/*#__PURE__*/
function () {
  function Tube(game, x, y, size, destination, enemyType) {
    _classCallCheck(this, Tube);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      size: size,
      destination: destination
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
    this.BB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH / 8, this.y, PARAMS.BLOCKWIDTH * 2 - PARAMS.BLOCKWIDTH * 2 / 8, PARAMS.BLOCKWIDTH * (size + 1));
    this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * (size + 1));
    this.rightBB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * (size + 1));

    if (enemyType) {
      if (enemyType === "piranha") {
        this.game.addEntity(new PirahnaPlant(this.game, this.x, this.y, this));
      }
    }
  }

  _createClass(Tube, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "Green";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE * 2, PARAMS.SCALE * (this.size + 1));
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.spritesheet, 309, 417, 32, 16, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH * 2, PARAMS.BLOCKWIDTH);
      var i = 0;

      for (; i < this.size; i++) {
        ctx.drawImage(this.spritesheet, 309, 433.5, 32, 15, this.x - this.game.camera.x, this.y + PARAMS.BLOCKWIDTH * (i + 1), PARAMS.BLOCKWIDTH * 2, PARAMS.BLOCKWIDTH);
      }

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }]);

  return Tube;
}();

;

var SideTube =
/*#__PURE__*/
function () {
  function SideTube(game, x, y, size, destination) {
    _classCallCheck(this, SideTube);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      size: size,
      destination: destination
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
    this.BB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH / 8, this.y, PARAMS.BLOCKWIDTH * 2, PARAMS.BLOCKWIDTH * 2);
    this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2);
    this.rightBB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 2);
  }

  _createClass(SideTube, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "Green";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE * 2, PARAMS.SCALE * 2);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.spritesheet, 84, 417, 40, 32, this.x - this.game.camera.x, this.y, 2.5 * PARAMS.BLOCKWIDTH, 2 * PARAMS.BLOCKWIDTH);

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }]);

  return SideTube;
}();

;

var Lift =
/*#__PURE__*/
function () {
  function Lift(game, x, y, goingDown) {
    _classCallCheck(this, Lift);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      goingDown: goingDown
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
    this.velocity = 3 * PARAMS.BLOCKWIDTH; // pixels per second

    if (!goingDown) this.velocity = -this.velocity;
    this.updateBB();
  }

  _createClass(Lift, [{
    key: "update",
    value: function update() {
      if (this.goingDown && this.y > 15 * PARAMS.BLOCKWIDTH) {
        var newLift = new Lift(this.game, this.x, 0, this.goingDown);
        this.game.addEntity(newLift);
        this.removeFromWorld = true;
      } else if (!this.goingDown && this.y < 0) {
        var _newLift = new Lift(this.game, this.x, 15 * PARAMS.BLOCKWIDTH, this.goingDown);

        this.game.addEntity(_newLift);
        this.removeFromWorld = true;
      } else {
        this.y += this.velocity * this.game.clockTick;
        this.updateBB();
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = 'Orange';
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE * 3, PARAMS.SCALE);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.spritesheet, 63, 38, 48, 8, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH * 3, PARAMS.BLOCKWIDTH * 0.5);

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }, {
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH * 3, PARAMS.BLOCKWIDTH * 0.5);
      this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 0.5);
      this.rightBB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH * 2, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 0.5);
    }
  }]);

  return Lift;
}();

var Flag =
/*#__PURE__*/
function () {
  function Flag(game, x, y) {
    _classCallCheck(this, Flag);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/flag.png");
    this.flagX = x - 36;
    this.flagY = y + 27;
    this.updateBB();
    this.win = false;
  }

  _createClass(Flag, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {// TODO: add in minimap functionality
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      var TICK = this.game.clockTick; // draw the pole

      ctx.drawImage(this.spritesheet, 20, 0, 8, 152, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH * 9.5);

      if (this.win) {
        var FLAG_SPEED_SCALE = 9;
        var BLOCK_TOP = 13 * PARAMS.BLOCKWIDTH;

        if (this.flagY === this.y + 27) {
          ASSET_MANAGER.playAsset("./audio/flagpole.mp3");
        } // top of the block = 13 * blockwidth - blockwidth


        if (this.flagY < BLOCK_TOP - PARAMS.BLOCKWIDTH) {
          this.flagY += PARAMS.BLOCKWIDTH * TICK * FLAG_SPEED_SCALE;
          this.game.disableInput();
          this.game.camera.paused = true;
        }
      } // draw the triangle flag part


      ctx.drawImage(this.spritesheet, 2, 1, 16, 16, this.flagX - this.game.camera.x, this.flagY, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }, {
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x + 9, this.y, PARAMS.BLOCKWIDTH / 7, PARAMS.BLOCKWIDTH * 9.5); // this.leftBB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 0.5);
      // this.rightBB = new BoundingBox(this.x + PARAMS.BLOCKWIDTH * 2, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 0.5);
    }
  }]);

  return Flag;
}();