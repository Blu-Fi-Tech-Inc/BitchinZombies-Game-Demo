"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Goomba =
/*#__PURE__*/
function () {
  function Goomba(game, x, y) {
    _classCallCheck(this, Goomba);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.velocity = {
      x: -PARAMS.BITWIDTH,
      y: 0
    }; // pixels per second

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
    this.animation = new Animator(this.spritesheet, 0, 4, 16, 16, 2, 0.2, 14, false, true);
    this.paused = true;
    this.dead = false;
    this.deadCounter = 0;
    this.flickerFlag = true;
    this.updateBB();
  }

  _createClass(Goomba, [{
    key: "updateBB",
    value: function updateBB() {
      this.lastBB = this.BB;
      this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
    }
  }, {
    key: "update",
    value: function update() {
      var FALL_ACC = 1800;

      if (this.dead) {
        if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 100));
        this.deadCounter += this.game.clockTick;
        if (this.deadCounter > 0.5) this.removeFromWorld = true; // flicker for half a second
      }

      if (this.paused && this.game.camera.x > this.x - PARAMS.CANVAS_WIDTH) {
        this.paused = false;
      }

      if (!this.paused && !this.dead) {
        this.velocity.y += FALL_ACC * this.game.clockTick;
        this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
          if (entity.BB && that.BB.collide(entity.BB)) {
            if (entity instanceof Mario) {
              // if (entity.size == 0) {
              //     entity.die();
              // }
              if (entity.size > 0 && entity.size <= 3) {
                //Mario takes a hit when not invincible
                entity.size -= 1;
              }
            } else if (entity instanceof Mushroom || entity instanceof Flower) {} else if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block || entity instanceof Tube) && that.lastBB.bottom <= entity.BB.top) {
              that.y = entity.BB.top - PARAMS.BLOCKWIDTH;
              that.velocity.y = 0;
              that.updateBB();
            } else if (entity !== that) {
              that.velocity.x = -that.velocity.x;
            }
          }

          ;
        });
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "Tan";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.dead) {
        if (this.flickerFlag) {
          ctx.drawImage(this.spritesheet, 0, 4, //source from sheet
          16, 16, this.x - this.game.camera.x, this.y + PARAMS.BLOCKWIDTH * 3 / 4, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH / 4);
        }

        this.flickerFlag = !this.flickerFlag;
      } else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);

        if (PARAMS.DEBUG) {
          ctx.strokeStyle = 'Red';
          ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
      }
    }
  }]);

  return Goomba;
}();

;

var KoopaParatroopaRed =
/*#__PURE__*/
function () {
  function KoopaParatroopaRed(game, x, y, facing) {
    _classCallCheck(this, KoopaParatroopaRed);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      facing: facing
    });
    this.velocity = {
      x: Math.pow(-2, this.facing) * PARAMS.BITWIDTH,
      y: 0
    }; // pixels per second

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
    this.animations = [];
    this.animations.push(new Animator(this.spritesheet, 270, 30, 16, 24, 2, 0.2, 14, false, true));
    this.animations.push(new Animator(this.spritesheet, 90, 30, 16, 24, 2, 0.2, 14, false, true));
    this.paused = false;
    this.dead = false;
    this.timeLapse = 0;
    this.deadCounter = 0;
    this.updateBB();
  }

  _createClass(KoopaParatroopaRed, [{
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y + 1, PARAMS.BLOCKWIDTH, (1 + 7 / 16) * PARAMS.BLOCKWIDTH);
    }
  }, {
    key: "update",
    value: function update() {
      this.timeLapse += this.game.clockTick;

      if (this.dead) {
        if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 100));
        this.deadCounter += this.game.clockTick;
        this.game.addEntity(new Koopa(this.game, this.x, this.y, this.facing, "red"));
        this.removeFromWorld = true;
      }

      console.log(this.timeLapse);

      if (!this.paused && !this.dead) {
        if (this.timeLapse <= 2) {
          this.y -= 1;
        }

        if (this.timeLapse > 2) {
          this.y += 1;
        }

        if (this.timeLapse > 4) {
          this.timeLapse = 0;
        }

        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
      }

      this.updateBB();
      var that = this;
      this.game.entities.forEach(function (entity) {
        if (entity.BB && that.BB.collide(entity.BB)) {
          if (entity instanceof Mario || entity instanceof Mushroom || entity instanceof Flower) {} else if ((entity instanceof Brick || entity instanceof Block) && that.BB.top - that.velocity.y * that.game.clockTick * PARAMS.SCALE >= entity.BB.bottom) {
            that.velocity.y = 0;
          } else if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block || entity instanceof Tube) && that.BB.bottom - that.velocity.y * that.game.clockTick * PARAMS.SCALE <= entity.BB.top) {
            that.y = entity.BB.top - PARAMS.BLOCKWIDTH * (1 + 7 / 16);
            that.velocity.y = 0;
            that.grounded = true;
          }

          that.updateBB();
        }

        ;
      });
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "LightRed";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE * 1.5);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.dead) {} else {
        this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);

        if (PARAMS.DEBUG) {
          ctx.strokeStyle = 'Red';
          ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
      }
    }
  }]);

  return KoopaParatroopaRed;
}();

var KoopaParatroopaGreen =
/*#__PURE__*/
function () {
  function KoopaParatroopaGreen(game, x, y, facing) {
    _classCallCheck(this, KoopaParatroopaGreen);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      facing: facing
    });
    this.velocity = {
      x: Math.pow(-2, this.facing) * PARAMS.BITWIDTH,
      y: 0
    }; // pixels per second

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
    this.animations = [];
    this.animations.push(new Animator(this.spritesheet, 270, 0, 16, 24, 2, 0.2, 14, false, true));
    this.animations.push(new Animator(this.spritesheet, 90, 0, 16, 24, 2, 0.2, 14, false, true));
    this.paused = false;
    this.dead = false;
    this.grounded = true;
    this.deadCounter = 0;
    this.updateBB();
  }

  _createClass(KoopaParatroopaGreen, [{
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y + 1, PARAMS.BLOCKWIDTH, (1 + 7 / 16) * PARAMS.BLOCKWIDTH);
    }
  }, {
    key: "update",
    value: function update() {
      var FALL_ACC = 600;

      if (this.dead) {
        if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 100));
        this.deadCounter += this.game.clockTick;
        this.game.addEntity(new Koopa(this.game, this.x, this.y, this.facing, "green"));
        this.removeFromWorld = true;
      }

      if (!this.paused && !this.dead) {
        this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;

        if (this.grounded == true) {
          this.velocity.y = -210;
          this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
          this.grounded = false;
        } else {
          this.velocity.y += FALL_ACC * this.game.clockTick;
          this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
        }

        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
          if (entity.BB && that.BB.collide(entity.BB)) {
            if (entity instanceof Mario || entity instanceof Mushroom || entity instanceof Flower || entity instanceof KoopaParatroopaRed || entity instanceof Goomba || entity instanceof Koopa || entity instanceof Brick) {} else if ((entity instanceof Ground || entity instanceof Tube || entity instanceof Block) && that.BB.bottom - that.velocity.y * that.game.clockTick * PARAMS.SCALE <= entity.BB.top) {
              that.y = entity.BB.top - PARAMS.BLOCKWIDTH * (1 + 7 / 16);
              that.velocity.y = 0;
              that.grounded = true;
            } else if (entity !== that) {
              that.velocity.x = -that.velocity.x;
              that.facing = (that.facing + 1) % 2;
            }

            that.updateBB();
          }

          ;
        });
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "LightGreen";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE * 1.5);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.dead) {} else {
        this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);

        if (PARAMS.DEBUG) {
          ctx.strokeStyle = 'Red';
          ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
      }
    }
  }]);

  return KoopaParatroopaGreen;
}();

var Koopa =
/*#__PURE__*/
function () {
  function Koopa(game, x, y, facing, color) {
    _classCallCheck(this, Koopa);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      facing: facing,
      color: color
    });
    this.velocity = {
      x: Math.pow(-1, this.facing) * PARAMS.BITWIDTH,
      y: 0
    }; // pixels per second

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
    this.animations = [];
    console.log(this.color);

    if (this.color === "red") {
      this.animations.push(new Animator(this.spritesheet, 210, 30, 16, 24, 2, 0.2, 14, false, true));
      this.animations.push(new Animator(this.spritesheet, 150, 30, 16, 24, 2, 0.2, 14, false, true));
    } else {
      this.animations.push(new Animator(this.spritesheet, 210, 0, 16, 24, 2, 0.2, 14, false, true));
      this.animations.push(new Animator(this.spritesheet, 150, 0, 16, 24, 2, 0.2, 14, false, true));
    }

    this.paused = true;
    this.dead = false;
    this.deadCounter = 0;
    this.updateBB();
  }

  _createClass(Koopa, [{
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, (1 + 7 / 16) * PARAMS.BLOCKWIDTH);
    }
  }, {
    key: "update",
    value: function update() {
      var FALL_ACC = 1800;

      if (this.dead) {
        if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 100));
        this.deadCounter += this.game.clockTick;
        this.game.addEntity(new KoopaShell(this.game, this.x, this.y + 12, this.facing, this.color));
        this.removeFromWorld = true;
      }

      if (this.paused && this.game.camera.x > this.x - PARAMS.CANVAS_WIDTH) {
        this.paused = false;
      }

      if (!this.paused && !this.dead) {
        this.velocity.y += FALL_ACC * this.game.clockTick;
        this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
          if (entity.BB && that.BB.collide(entity.BB)) {
            if (entity instanceof Mario) {} else if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block || entity instanceof Tube) && that.BB.bottom - that.velocity.y * that.game.clockTick * PARAMS.SCALE <= entity.BB.top) {
              that.y = entity.BB.top - PARAMS.BLOCKWIDTH * (1 + 7 / 16);
              that.velocity.y = 0;
              that.updateBB();
            } else if (entity !== that) {
              that.velocity.x = -that.velocity.x;
              that.facing = (that.facing + 1) % 2;
            }
          }

          ;
        });
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "LightGreen";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE * 1.5);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.dead) {} else {
        this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);

        if (PARAMS.DEBUG) {
          ctx.strokeStyle = 'Red';
          ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
      }
    }
  }]);

  return Koopa;
}();

;

var KoopaShell =
/*#__PURE__*/
function () {
  function KoopaShell(game, x, y, facing, color) {
    _classCallCheck(this, KoopaShell);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      facing: facing,
      color: color
    });
    this.speed = PARAMS.BITWIDTH * 8;
    this.velocity = {
      x: 0,
      y: 0
    }; // pixels per second

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
    this.animations = [];
    console.log(this.color);

    if (this.color === "red") {
      this.animations.push(new Animator(this.spritesheet, 360, 34, 16, 15, 1, 0.2, 14, false, true)); // Shell leg blinking

      this.animations.push(new Animator(this.spritesheet, 330, 34, 16, 15, 2, 0.2, 14, false, true));
    } else {
      // Just the shell
      this.animations.push(new Animator(this.spritesheet, 360, 4, 16, 15, 1, 0.2, 14, false, true)); // Shell leg blinking

      this.animations.push(new Animator(this.spritesheet, 330, 4, 16, 15, 2, 0.2, 14, false, true));
    }

    this.paused = true; // Dead is used purely to detect if the player has stepped on the shell

    this.dead = false;
    this.deadCounter = 0; // The amount of time the turtle has been not moving

    this.timeStill = 0;
    this.updateBB();
  }

  _createClass(KoopaShell, [{
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, 15 / 16 * PARAMS.BLOCKWIDTH);
    }
  }, {
    key: "update",
    value: function update() {
      var FALL_ACC = 1800;

      if (this.paused && this.game.camera.x > this.x - PARAMS.CANVAS_WIDTH) {
        this.paused = false;
      }

      var playerMidpoint;

      if (!this.paused) {
        this.velocity.y += FALL_ACC * this.game.clockTick;
        this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
          // Always keep track of where mario is to determine which way to send the shell
          if (entity instanceof Mario) {
            playerMidpoint = (entity.BB.x + entity.BB.right) / 2;
          }

          if (entity.BB && that.BB.collide(entity.BB)) {
            if (entity instanceof Mario) {
              // If the player walks into a still shell then send that shell flying
              if (that.velocity.x == 0 && !that.dead) {
                if (playerMidpoint > (that.BB.x + that.BB.right) / 2) {
                  that.velocity.x = -that.speed;
                  that.x = entity.BB.left - 1 - that.BB.width;
                } else {
                  that.velocity.x = that.speed;
                  that.x = entity.BB.right + 1;
                }
              }
            } else if ((entity instanceof Ground || entity instanceof Brick || entity instanceof Block || entity instanceof Tube) && that.BB.bottom - that.velocity.y * that.game.clockTick * PARAMS.SCALE <= entity.BB.top) {
              that.y = entity.BB.top - that.BB.height;
              that.velocity.y = 0;
              that.updateBB();
            } else if (entity !== that) {
              that.x -= that.game.clockTick * that.velocity.x * PARAMS.SCALE; // If we've run into a wall then let's not linger

              that.velocity.x = -that.velocity.x;
              that.facing = (that.facing + 1) % 2;
            }
          }

          ;
        });
      } // If we've been stomped on


      if (this.dead) {
        // And we are still
        if (this.velocity.x == 0) {
          // Get sent flying
          if (playerMidpoint > this.BB.x + this.BB.width / 2) {
            this.velocity.x = -this.speed;
          } else {
            this.velocity.x = this.speed;
          }
        } else {
          // Stop moving
          this.velocity.x = 0;
        } // Reset the dead variable


        this.dead = false;
      } // Keep track of how long we have been immobile


      if (this.velocity.x == 0) {
        this.timeStill += this.game.clockTick;
      } else {
        this.timeStill = 0;
      } // Come out of our shell if we've been immobile for long enough


      if (this.timeStill > 4) {
        this.game.addEntity(new Koopa(this.game, this.x, this.y - PARAMS.SCALE * 8, 1, this.color));
        this.removeFromWorld = true;
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "LightGreen";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.dead) {} else {
        if (this.timeStill > 2) {
          this.animations[1].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
        } else {
          this.animations[0].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
        }

        if (PARAMS.DEBUG) {
          ctx.strokeStyle = 'Red';
          ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
      }
    }
  }]);

  return KoopaShell;
}();

;

var PirahnaPlant =
/*#__PURE__*/
function () {
  function PirahnaPlant(game, x, y, tube) {
    _classCallCheck(this, PirahnaPlant);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      tube: tube
    }); // Positions the Pirahna Plant in the middle of the Tube is appears from

    this.x += PARAMS.BLOCKWIDTH / 2;
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
    this.animations = new Animator(this.spritesheet, 390, 60, 16, 24, 2, 0.17, 14, false, true);
    this.maxHeight = this.y - 64;
    this.minHeight = this.y + 24;
    this.marioClose = false;
    this.emerging = true;
    this.paused = true;
    this.dead = false;
    this.deadCounter = 0;
    this.wait = 0;
    this.updateBB();
  }

  _createClass(PirahnaPlant, [{
    key: "updateBB",
    value: function updateBB() {
      // The Pirahna Plant has a smaller Bounding Box than what is visually seen
      // These constants define the area for that Bounding Box 
      var xOffset = 2,
          yOffset = 12;
      var widthOfBB = 11,
          heightOfBB = 6;
      this.BB = new BoundingBox(this.x + xOffset * PARAMS.SCALE, this.y + yOffset * PARAMS.SCALE, widthOfBB * PARAMS.SCALE, heightOfBB * PARAMS.SCALE);
    }
  }, {
    key: "update",
    value: function update() {
      var that = this;
      this.game.entities.forEach(function (entity) {
        if (entity instanceof Mario) {
          // If Mario's x position is within 70 pixels he is too close
          var distance = Math.abs(entity.x - that.x);
          that.marioClose = distance <= 70 ? true : false; // Determine who gets hit based on the state of mario

          if (that.BB.collide(entity.BB)) {
            // If mario is small
            if (entity.size === 0) {
              // kill mario, reset level
              entity.die(); // If mario has flower power, or is big
            } else if (entity.size < 3) {
              entity.size -= 1; // otherwise, mario has star man power
            } else {
              that.removeFromWorld = true;
              that.dead = true;
            }
          } // add logic for getting hit by other entities such as koopa shells here

        }

        ;
      });

      if (this.dead) {
        if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 200));
        this.deadCounter += this.game.clockTick;
        if (this.deadCounter > 0.5) this.removeFromWorld = true; // flicker for half a second
      }

      if (this.paused && this.game.camera.x > this.x - PARAMS.CANVAS_WIDTH) {
        this.paused = false;
      }

      if (!this.paused && !this.dead) {
        if (this.emerging) {
          if (this.y != this.maxHeight) {
            this.y--;
          } else if (this.wait < 90) {
            this.wait++;
          } else {
            this.emerging = false;
          }
        } else {
          if (this.y != this.minHeight) {
            this.y++;
          } else if (this.wait > 0) {
            this.wait--;
          } else if (!this.marioClose) {
            this.emerging = true;
          }
        }

        this.updateBB();
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "olive";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE * 1.5);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.dead) {} else {
        this.animations.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);
        if (this.emerging) this.tube.draw(ctx);

        if (PARAMS.DEBUG) {
          ctx.strokeStyle = 'Red';
          ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
      }
    }
  }]);

  return PirahnaPlant;
}();

; //the hammer brother enemy

var HammerBro =
/*#__PURE__*/
function () {
  function HammerBro(game, x, y, facing) {
    _classCallCheck(this, HammerBro);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      facing: facing
    });
    this.velocity = {
      x: Math.pow(-1, this.facing) * PARAMS.BITWIDTH,
      y: 0
    }; // pixels per second

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
    this.animations = [];
    this.animations.push(new Animator(this.spritesheet, 179, 89, 16, 25, 2, 0.1, 14, false, true));
    this.animations.push(new Animator(this.spritesheet, 119, 89, 16, 24, 2, 0.1, 14, false, true));
    this.paused = true;
    this.dead = false;
    this.deadCounter = 0; //this.updateBB();

    this.swap = 60;
    this.jump = 240;
    this.jumpType = 1;
    this.passThrough = 0;
    this["throw"] = 30;
    this["throws"] = 0;
    this.interval = 0;
    this.throwing = 0;
    this.beserk = 3600;
    this.paused = true;
    this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, (1 + 7 / 16) * PARAMS.BLOCKWIDTH);
  }

  _createClass(HammerBro, [{
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH, (1 + 7 / 16) * PARAMS.BLOCKWIDTH);
    }
  }, {
    key: "update",
    value: function update() {
      if (this.paused && this.game.camera.x > this.x - PARAMS.CANVAS_WIDTH) {
        this.paused = false;
      } //changes his direction


      if (this.game.camera.mario.x < this.x) {
        this.facing = 1;
      } else {
        this.facing = 0;
      }

      var FALL_ACC = 1800; //adds in his secret mechanic where after 1 minute he chaces mario

      if (this.beserk > 0) {
        if (this.swap == 0) {
          this.velocity.x = -this.velocity.x;
          this.swap = 60;
        }
      } else {
        this.velocity.x = Math.pow(-1, this.facing) * PARAMS.BITWIDTH * 2;
      } //logic for his jump


      if (this.jump == 0) {
        //small jump
        if (this.jumpType == 1) {
          this.velocity.y = -180 * PARAMS.SCALE;
          this.jumpType = -this.jumpType;
          this.passThrough = 20;
        } //big jump
        else if (this.jumpType == -1) {
            this.velocity.y = -105 * PARAMS.SCALE;
            this.jumpType = -this.jumpType;
            this.passThrough = 25;
          } //jump cooldown


        this.jump = 240;
      } //throw logic, throws between 1 and 4 hammers


      if (this["throw"] <= 0 && this["throws"] == 0) {
        this["throws"] = Math.floor(Math.random() * Math.floor(4)) + 1;
        this.interval = 0;
      }

      if (this["throws"] > 0) {
        if (this.interval == 0) {
          this.game.addEntity(new Hammer(this.game, this.x, this.y, this));
          this.interval = 50;
          this["throws"]--;
          this.throwing = 20;
        } //after he throws all hammers a 2 second cooldown is started


        if (this["throws"] == 0) {
          this["throw"] = 120;
        }
      }

      if (this.dead) {
        if (this.deadCounter === 0) this.game.addEntity(new Score(this.game, this.x, this.y, 100));
        this.deadCounter += this.game.clockTick;
        if (this.deadCounter > 0.5) this.removeFromWorld = true; // flicker for half a second
      }

      if (!this.paused && !this.dead) {
        this.velocity.y += FALL_ACC * this.game.clockTick;
        this.x += this.game.clockTick * this.velocity.x * PARAMS.SCALE;
        this.y += this.game.clockTick * this.velocity.y * PARAMS.SCALE;
        this.updateBB();
        var that = this;
        this.game.entities.forEach(function (entity) {
          if (entity.BB && that.BB.collide(entity.BB)) {
            if (entity instanceof Mario) {} else if ((entity instanceof Brick || entity instanceof Block) && that.BB.bottom - that.velocity.y * that.game.clockTick * PARAMS.SCALE <= entity.BB.top && that.passThrough <= 0) {
              that.y = entity.BB.top - PARAMS.BLOCKWIDTH * (1 + 7 / 16);
              that.velocity.y = 0;
              that.updateBB();
            } else if ((entity instanceof Ground || entity instanceof Tube) && that.BB.bottom - that.velocity.y * that.game.clockTick * PARAMS.SCALE <= entity.BB.top) {
              that.y = entity.BB.top - PARAMS.BLOCKWIDTH * (1 + 7 / 16);
              that.velocity.y = 0;
              that.updateBB();
            }
          }

          ;
        });
        this.swap--;
        this.jump--;
        this.passThrough--;
        this["throw"]--;
        this.interval--;
        this.throwing--;
        this.beserk--;
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "LightGreen";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE * 1.5);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.dead) {} else {
        this.animations[this.facing].drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, PARAMS.SCALE);

        if (this.throwing > 0) {//ctx.drawImage(this.spritesheet,239,89,16,17,this.x,this.y,16*3,17*3);
        }

        if (PARAMS.DEBUG) {
          ctx.strokeStyle = 'Red';
          ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
        }
      }
    }
  }]);

  return HammerBro;
}(); //the hammer thrown by the hammer brother 


var Hammer =
/*#__PURE__*/
function () {
  function Hammer(game, x, y, parent) {
    _classCallCheck(this, Hammer);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      parent: parent
    });
    this.velocity = {
      x: 0,
      y: 0
    }; // pixels per second

    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/enemies.png");
    this.lifeTime = 150;
    this.state = 0;
    this.delay = 5;
    this.thrown = false;
    this.throwDelay = 20;
    this.facing = this.parent.facing; //faces the same direction as parent untill thrown

    if (this.facing == 1) {
      this.x = this.parent.x + 20;
      this.y = this.parent.y - 25;
    } else {
      this.x = this.parent.x;
      this.y = this.parent.y - 20;
    }

    this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH / 3, PARAMS.BLOCKWIDTH / 3);
  } //needs to be finished to properly follow the head of the hammer


  _createClass(Hammer, [{
    key: "updateBB",
    value: function updateBB() {
      this.BB = new BoundingBox(this.x, this.y, PARAMS.BLOCKWIDTH / 3, PARAMS.BLOCKWIDTH / 3);
    }
  }, {
    key: "update",
    value: function update() {
      var FALL_ACC = 10; //when not thrown follows the parent position and direction

      if (!this.thrown) {
        if (this.facing == 1) {
          this.x = this.parent.x + 20;
          this.y = this.parent.y - 25;
        } else {
          this.x = this.parent.x;
          this.y = this.parent.y - 20;
        }

        this.facing = this.parent.facing;

        if (this.throwDelay == 0) {
          this.thrown = true;

          if (this.facing == 1) {
            this.velocity.x = -3;
            this.velocity.y = -6;
          } else {
            this.velocity.x = 3;
            this.velocity.y = -6;
          }
        } //is removed if held when the parent is killed


        if (this.parent.dead) {
          this.removeFromWorld = true;
        }

        this.throwDelay--;
      }

      if (this.thrown) {
        if (this.delay == 0) {
          this.state++;

          if (this.state == 4) {
            this.state = 0;
          }

          this.delay = 5;
        }

        this.velocity.y += FALL_ACC * this.game.clockTick;
        this.delay--;
      }

      this.x += this.velocity.x;
      this.y += this.velocity.y;
      this.updateBB();
      this.lifeTime--; //dissapearsd after a set time

      if (this.lifeTime == 0) {
        this.removeFromWorld = true;
      }
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      if (this.facing == 1) {
        if (this.state == 0) {
          ctx.drawImage(this.spritesheet, 263, 99, 9, 17, this.x - this.game.camera.x, this.y, 9 * 3, 17 * 3);
        }

        if (this.state == 1) {
          ctx.drawImage(this.spritesheet, 278, 107, 17, 9, this.x - this.game.camera.x, this.y, 17 * 3, 9 * 3);
        }

        if (this.state == 2) {
          ctx.drawImage(this.spritesheet, 283, 86, 9, 17, this.x - this.game.camera.x, this.y, 9 * 3, 17 * 3);
        }

        if (this.state == 3) {
          ctx.drawImage(this.spritesheet, 263, 86, 17, 9, this.x - this.game.camera.x, this.y, 17 * 3, 9 * 3);
        }
      } else {
        if (this.state == 0) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(this.spritesheet, 263, 99, 9, 17, -this.x - 9 * 3 + this.game.camera.x, this.y, 9 * 3, 17 * 3);
          ctx.restore();
        }

        if (this.state == 1) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(this.spritesheet, 278, 107, 17, 9, -this.x - 17 * 3 + this.game.camera.x, this.y, 17 * 3, 9 * 3);
          ctx.restore();
        }

        if (this.state == 2) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(this.spritesheet, 283, 86, 9, 17, -this.x - 9 * 3 + this.game.camera.x, this.y, 9 * 3, 17 * 3);
          ctx.restore();
        }

        if (this.state == 3) {
          ctx.save();
          ctx.scale(-1, 1);
          ctx.drawImage(this.spritesheet, 263, 86, 17, 9, -this.x - 17 * 3 + this.game.camera.x, this.y, 17 * 3, 9 * 3);
          ctx.restore();
        }
      }

      if (PARAMS.DEBUG) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "Red";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE, PARAMS.SCALE * 1.5);
    }
  }]);

  return Hammer;
}();

var FireBar =
/*#__PURE__*/
function () {
  function FireBar(game, x, y, numOfFires) {
    _classCallCheck(this, FireBar);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      numOfFires: numOfFires
    });
    var brick = new Brick(this.game, this.x, this.y, 3, "None");
    this.game.addEntity(brick);
    this.angle = 0;
    this.fires = [];

    for (var i = 0; i < this.numOfFires; i++) {
      var x = i * 25 * Math.sin(this.angle);
      var y = i * 25 * Math.cos(this.angle);

      if (i <= 1) {
        var fire = new FireBar_Fire(this.game, this.x + x + 12, this.y + y + 12, true);
      } else {
        var fire = new FireBar_Fire(this.game, this.x + x + 12, this.y + y + 12, false);
      }

      this.fires.push(fire);
      this.game.addEntity(fire);
    }
  }

  _createClass(FireBar, [{
    key: "update",
    value: function update() {
      this.angle += this.game.clockTick;

      if (this.angle >= 360) {
        this.angle = 0;
      }

      console.log(this.numOfFires);

      for (var i = 0; i < this.numOfFires; i++) {
        var x = i * 25 * Math.sin(this.angle);
        var y = i * 25 * Math.cos(this.angle);
        this.fires[i].x = this.x + x + 12;
        this.fires[i].y = this.y + y + 12;
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {// blockd
    }
  }]);

  return FireBar;
}();

var FireBar_Fire =
/*#__PURE__*/
function () {
  function FireBar_Fire(game, x, y, inner) {
    _classCallCheck(this, FireBar_Fire);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      inner: inner
    });
    this.angle = 0;
    this.spritesheetFire = ASSET_MANAGER.getAsset("./sprites/firebar_fire.png");
    this.animation = new Animator(this.spritesheetFire, 0, 0, 8, 8, 4, 0.1, 0, false, true);

    if (!this.inner) {
      this.BB = new BoundingBox(this.x, this.y, 30, 30);
    }
  }

  _createClass(FireBar_Fire, [{
    key: "update",
    value: function update() {
      if (!this.inner) {
        this.BB = new BoundingBox(this.x, this.y, 30, 30);
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {
      ctx.fillStyle = "DarkRed";
      ctx.fillRect(mmX + this.x / PARAMS.BITWIDTH, mmY + this.y / PARAMS.BITWIDTH, PARAMS.SCALE / 2, PARAMS.SCALE / 2);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      this.animation.drawFrame(this.game.clockTick, ctx, this.x - this.game.camera.x, this.y, 3);

      if (PARAMS.DEBUG && !this.inner) {
        ctx.strokeStyle = 'Red';
        ctx.strokeRect(this.BB.x - this.game.camera.x, this.BB.y, this.BB.width, this.BB.height);
      }
    }
  }]);

  return FireBar_Fire;
}();