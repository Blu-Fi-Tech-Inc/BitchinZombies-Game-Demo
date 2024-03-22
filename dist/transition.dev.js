"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var TransitionScreen =
/*#__PURE__*/
function () {
  function TransitionScreen(game, level, x, y, gameOver) {
    _classCallCheck(this, TransitionScreen);

    Object.assign(this, {
      game: game,
      level: level,
      x: x,
      y: y,
      gameOver: gameOver
    });
    this.elapsed = 0;
  }

  _createClass(TransitionScreen, [{
    key: "update",
    value: function update() {
      this.elapsed += this.game.clockTick;
      if (this.elapsed > 2) this.game.camera.loadLevel(this.level, this.x, this.y, false, this.gameOver);
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.fillStyle = "Black";
      ctx.fillRect(0, 0, PARAMS.CANVAS_WIDTH, PARAMS.CANVAS_HEIGHT);
      ctx.font = PARAMS.BLOCKWIDTH / 2 + 'px "Press Start 2P"';
      ctx.fillStyle = "White";
      ctx.fillStyle = "White";
      ctx.fillText("ZOMBIE", 1.5 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
      ctx.fillText((this.game.camera.score + "").padStart(8, "0"), 1.5 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);
      ctx.fillText("x" + (this.game.camera.coins < 10 ? "0" : "") + this.game.camera.coins, 6.5 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);
      ctx.fillText("WORLD", 9 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH);
      ctx.fillText(this.level.label, 9.5 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);
      ctx.fillText("TIME", 12.5 * PARAMS.BLOCKWIDTH, 1 * PARAMS.BLOCKWIDTH); // ctx.fillText(this.game.time, 13 * PARAMS.BLOCKWIDTH, 1.5 * PARAMS.BLOCKWIDTH);

      if (this.gameOver) {
        ctx.fillText("GAME OVER", 6 * PARAMS.BLOCKWIDTH, 9 * PARAMS.BLOCKWIDTH);
      } else {
        ctx.fillText("WORLD " + this.level.label, 5.5 * PARAMS.BLOCKWIDTH, 5 * PARAMS.BLOCKWIDTH);
        ctx.fillText("x  " + this.game.camera.lives, 7.5 * PARAMS.BLOCKWIDTH, 7.5 * PARAMS.BLOCKWIDTH);
        ctx.drawImage(this.game.mario.spritesheet, 210, 0, 16, 16, 6 * PARAMS.BLOCKWIDTH, 6.5 * PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH, PARAMS.BLOCKWIDTH);
      }
    }
  }, {
    key: "drawMinimap",
    value: function drawMinimap() {}
  }]);

  return TransitionScreen;
}();

;