"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BigHill =
/*#__PURE__*/
function () {
  function BigHill(game, x, y) {
    _classCallCheck(this, BigHill);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
  }

  _createClass(BigHill, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.spritesheet, 86, 0, 80, 40, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH * 5, PARAMS.BLOCKWIDTH * 2.5);
    }
  }]);

  return BigHill;
}();

;

var Hill =
/*#__PURE__*/
function () {
  function Hill(game, x, y) {
    _classCallCheck(this, Hill);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
  }

  _createClass(Hill, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.spritesheet, 169, 20, 48, 20, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH * 3, PARAMS.BLOCKWIDTH * 1.25);
    }
  }]);

  return Hill;
}();

;

var Bush =
/*#__PURE__*/
function () {
  function Bush(game, x, y, size) {
    _classCallCheck(this, Bush);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      size: size
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
  }

  _createClass(Bush, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.spritesheet, 288, 24, 8, 24, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH * 0.5, PARAMS.BLOCKWIDTH * 1.5);
      var i = 0;

      for (; i < this.size; i++) {
        ctx.drawImage(this.spritesheet, 296, 24, 16, 24, this.x - this.game.camera.x + PARAMS.BLOCKWIDTH * (i + 0.5), this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 1.5);
      }

      ctx.drawImage(this.spritesheet, 312, 24, 8, 24, this.x - this.game.camera.x + PARAMS.BLOCKWIDTH * (i + 0.5), this.y, PARAMS.BLOCKWIDTH * 0.5, PARAMS.BLOCKWIDTH * 1.5);
    }
  }]);

  return Bush;
}();

;

var Cloud =
/*#__PURE__*/
function () {
  function Cloud(game, x, y, size) {
    _classCallCheck(this, Cloud);

    Object.assign(this, {
      game: game,
      x: x,
      y: y,
      size: size
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/tiles.png");
  }

  _createClass(Cloud, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.spritesheet, 211, 69, 8, 24, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH * 0.5, PARAMS.BLOCKWIDTH * 1.5);
      var i = 0;

      for (; i < this.size; i++) {
        ctx.drawImage(this.spritesheet, 219, 69, 16, 24, this.x - this.game.camera.x + PARAMS.BLOCKWIDTH * (i + 0.5), this.y, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH * 1.5);
      }

      ctx.drawImage(this.spritesheet, 235, 69, 8, 24, this.x - this.game.camera.x + PARAMS.BLOCKWIDTH * (i + 0.5), this.y, PARAMS.BLOCKWIDTH * 0.5, PARAMS.BLOCKWIDTH * 1.5);
    }
  }]);

  return Cloud;
}();

;

var BigCastle =
/*#__PURE__*/
function () {
  function BigCastle(game, x, y) {
    _classCallCheck(this, BigCastle);

    Object.assign(this, {
      game: game,
      x: x,
      y: y
    });
    this.spritesheet = ASSET_MANAGER.getAsset("./sprites/castle_big.png");
  }

  _createClass(BigCastle, [{
    key: "update",
    value: function update() {}
  }, {
    key: "drawMinimap",
    value: function drawMinimap(ctx, mmX, mmY) {}
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.drawImage(this.spritesheet, 0, 0, 145, 175, this.x - this.game.camera.x, this.y, PARAMS.BLOCKWIDTH * 9, PARAMS.BLOCKWIDTH * 11);
    }
  }]);

  return BigCastle;
}();

;