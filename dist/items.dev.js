"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Coin =
/*#__PURE__*/
function () {
  function Coin(game, x, y) {
    _classCallCheck(this, Coin);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    this.animation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 97, 16, 16, 4, 0.1, 0, false, true);
  }

  _createClass(Coin, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
    }
  }]);

  return Coin;
}();

;

var CoinPop =
/*#__PURE__*/
function () {
  function CoinPop(game, x, y) {
    _classCallCheck(this, CoinPop);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.game.camera.addCoin();
    this.velocity = -480;
    this.animation = new Animator(ASSET_MANAGER.getAsset("./sprites/coins.png"), 0, 112, 16, 16, 4, 0.1, 0, false, true);
  }

  _createClass(CoinPop, [{
    key: "update",
    value: function update() {
      var FALL_ACC = 2025;
      this.velocity += FALL_ACC * this.game.clockTick;
      this.y += this.game.clockTick * this.velocity * PARAMS.SCALE;

      if (this.velocity > 400) {
        this.removeFromWorld = true;
        this.game.addEntity(new Score(this.game, this.x, this.y + PARAMS.BLOCKWIDTH / 2, 200));
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
    }
  }]);

  return CoinPop;
}();

;

var Score =
/*#__PURE__*/
function () {
  function Score(game, x, y, score) {
    _classCallCheck(this, Score);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      score: score
    });
    this.game.camera.score += this.score;
    this.velocity = -2 * PARAMS.BITWIDTH;
    this.elapsed = 0;
  }

  _createClass(Score, [{
    key: "update",
    value: function update() {
      this.elapsed += this.game.clockTick;
      if (this.elapsed > 1) this.removeFromWorld = true;
      this.y += this.game.clockTick * this.velocity * PARAMS.SCALE;
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.font = PARAMS.BLOCKWIDTH / 4 + 'px "Press Start 2P"';
      ctx.fillStyle = "White";
      ctx.fillText(this.score, this.x + (this.score < 1000 ? PARAMS.BLOCKWIDTH / 8 : 0) - this.game.camera.x, this.y);
    }
  }]);

  return Score;
}();

;

var Mushroom =
/*#__PURE__*/
function () {
  function Mushroom(game, x, y, brick, type) {
    _classCallCheck(this, Mushroom);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      brick: brick,
      type: type
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/items.png");
    this.velocity = {
      x: 0,
      y: -PARAMS.BLOCKWIDTH
    };
    this.emerging = true;
    this.updateBB();
  }

  _createClass(Mushroom, [{
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.emerging) {
        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;

        if (this.y < this.BB.top - PARAMS.BLOCKWIDTH) {
          this.emerging = false;
          this.velocity.x = PARAMS.BLOCKWIDTH;
          this.velocity.y = 0;
        }
      } else {
        var FALL_ACC = 1800;
        this.velocity.y += FALL_ACC * this.game.clockTick;
        this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
          if (entity.BB && that.BB.collide(entity.BB)) {
            if (entity instanceof Mario) {} else if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block || entity instanceof Tube) && that.BB.bottom - that.velocity.y * that.game.clockTick * PARAMS.SCALE <= entity.BB.top) {
              that.y = entity.BB.top - PARAMS.BLOCKWIDTH;
              that.velocity.y = 0;
              that.updateBB();
            } else if (entity !== that && !(entity instanceof Flower)) {
              that.velocity.x = -that.velocity.x;
            }
          }

          ;
        });
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.type === 'Growth') {
        ctx.drawImage(this.spritesheet, 184, 34, 16, 16, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
      } else {
        ctx.drawImage(this.spritesheet, 214, 34, 16, 16, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
      }

      if (this.emerging) this.brick.draw(ctx);

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }]);

  return Mushroom;
}();

;

var Flower =
/*#__PURE__*/
function () {
  function Flower(game, x, y, brick) {
    _classCallCheck(this, Flower);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      brick: brick
    });
    this.velocity = {
      x: 0,
      y: -PARAMS.BLOCKWIDTH
    };
    this.emerging = true;
    this.animation = new Animator(ASSET_MANAGER.getAsset("./sprites/items.png"), 4, 64, 16, 16, 4, 0.15, 14, false, true);
    ASSET_MANAGER.playAsset("./audio/power-up-appears.mp3");
    this.updateBB();
  }

  _createClass(Flower, [{
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.emerging) {
        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;

        if (this.y < this.BB.top - PARAMS.BLOCKWIDTH) {
          this.emerging = false;
          this.velocity.x = PARAMS.BLOCKWIDTH;
          this.velocity.y = 0;
        }
      } else {
        this.updateBB();
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
      if (this.emerging) this.brick.draw(ctx);

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }]);

  return Flower;
}();

;

var Fireball =
/*#__PURE__*/
function () {
  function Fireball(game, x, y) {
    _classCallCheck(this, Fireball);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.velocity = {
      x: 5 * PARAMS.BLOCKWIDTH,
      y: 2 * PARAMS.BLOCKWIDTH
    };

    if (this.game.camera.mario.facing == 1) {
      this.velocity.x *= -1;
    }

    this.emerging = true;
    this.explode = false;
    this.elapsedTime = 0;
    this.animationTime = 0.05;
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png"); //this.animation = new Animator(ASSET_MANAGER.getAsset("./sprites/enemies.png"), 26, 150, 8, 8, 1, 0.1, 0, false, true);
    // fireball explodes

    this.explodeAnimation = new Animator(this.spritesheet, 360, 184, 16, 16, 3, 0.1, 14, false, false);
    this.updateBB();
  }

  _createClass(Fireball, [{
    key: "updateBB",
    value: function updateBB() {
      if (this.explode) {
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
      } else {
        this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH / 2);
      }
    }
  }, {
    key: "update",
    value: function update() {
      var FALL_ACC = 1000; // 1000/2; // 1800

      this.updateBB();

      if (this.y > 768) {
        this.removeFromWorld = true;
      }

      this.elapsedTime += this.game.clockTick;

      if (this.elapsedTime > 4 * this.animationTime) {
        this.elapsedTime = 0;
      }

      if (!this.explode) {
        this.velocity.y += FALL_ACC * this.game.clockTick;
        this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
        this.updateBB();
      } else {
        this.velocity.x = 0;
        this.velocity.y = 0; //this.velocity.y -= FALL_ACC * this.game.clockTick;
      }

      var that = this;
      this.game.entities.forEach(function (entity) {
        if (entity.BB && that.BB.collide(entity.BB)) {
          if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block) && that.BB.bottom - that.velocity.y * that.game.clockTick * PARAMS.SCALE <= entity.BB.top) {
            that.y = entity.BB.top - PARAMS.BLOCKWIDTH;
            that.velocity.y = -that.velocity.y / 2;
            that.updateBB();
          } else if (entity instanceof Tube || entity instanceof SideTube || entity instanceof Block || entity instanceof Brick && (that.BB.collide(entity.leftBB) || that.BB.collide(entity.rightBB))) {
            that.explode = true;
          } else if ((entity instanceof Goomba || entity instanceof Koopa || entity instanceof PirahnaPlant || entity instanceof KoopaParatroopaGreen || entity instanceof KoopaParatroopaRed) && !entity.dead) {
            entity.dead = true;
            that.explode = true;

            if (entity instanceof PirahnaPlant && that.BB.collide(entity.tube.BB)) {
              entity.dead = false;
            }
          }
        }

        ;
      });
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.explode) {
        this.explodeAnimation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);

        if (this.explodeAnimation.isDone()) {
          this.removeFromWorld = true;
        }
      } else {
        if (this.elapsedTime < this.animationTime) {
          ctx.drawImage(this.spritesheet, 26, 150, 8, 8, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH / 2);
        } else if (this.elapsedTime < 2 * this.animationTime) {
          ctx.drawImage(this.spritesheet, 26, 165, 8, 8, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH / 2);
        } else if (this.elapsedTime < 3 * this.animationTime) {
          ctx.drawImage(this.spritesheet, 41, 150, 8, 8, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH / 2);
        } else {
          ctx.drawImage(this.spritesheet, 41, 165, 8, 8, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH / 2, PARAMS.BLOCKWIDTH / 2);
        }
      }

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }]);

  return Fireball;
}();