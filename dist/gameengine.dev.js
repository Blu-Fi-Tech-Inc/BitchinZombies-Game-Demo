"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
var GameEngine =
/*#__PURE__*/
function () {
  function GameEngine() {
    _classCallCheck(this, GameEngine);

    this.entities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.left = false;
    this.right = false;
    this.up = false;
    this.down = false;
    this.A = false;
    this.B = false;
    this.gamepad = null;
  }

  _createClass(GameEngine, [{
    key: "init",
    value: function init(ctx) {
      // called after page has loaded
      this.ctx = ctx;
      this.surfaceWidth = this.ctx.canvas.width;
      this.surfaceHeight = this.ctx.canvas.height;
      this.startInput();
      this.timer = new Timer();
    }
  }, {
    key: "start",
    value: function start() {
      var that = this;

      (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
      })();
    }
  }, {
    key: "startInput",
    value: function startInput() {
      this.keyboardActive = false;
      var that = this;

      var getXandY = function getXandY(e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;
        return {
          x: x,
          y: y,
          radius: 0
        };
      };

      function mouseListener(e) {
        that.mouse = getXandY(e);
      }

      function mouseClickListener(e) {
        that.click = getXandY(e);
        if (PARAMS.DEBUG) console.log(that.click);
      }

      function wheelListener(e) {
        e.preventDefault(); // Prevent Scrolling

        that.wheel = e.deltaY;
      }

      function keydownListener(e) {
        that.keyboardActive = true;

        switch (e.code) {
          case "ArrowLeft":
          case "KeyA":
            that.left = true;
            break;

          case "ArrowRight":
          case "KeyD":
            that.right = true;
            break;

          case "ArrowUp":
          case "KeyW":
            that.up = true;
            break;

          case "ArrowDown":
          case "KeyS":
            that.down = true;
            break;

          case "KeyZ":
          case "Comma":
            that.B = true;
            break;

          case "KeyX":
          case "Period":
            that.A = true;
            break;
        }
      }

      function keyUpListener(e) {
        that.keyboardActive = false;

        switch (e.code) {
          case "ArrowLeft":
          case "KeyA":
            that.left = false;
            break;

          case "ArrowRight":
          case "KeyD":
            that.right = false;
            break;

          case "ArrowUp":
          case "KeyW":
            that.up = false;
            break;

          case "ArrowDown":
          case "KeyS":
            that.down = false;
            break;

          case "KeyZ":
          case "Comma":
            that.B = false;
            break;

          case "KeyX":
          case "Period":
            that.A = false;
            break;
        }
      }

      that.mousemove = mouseListener;
      that.leftclick = mouseClickListener;
      that.wheelscroll = wheelListener;
      that.keydown = keydownListener;
      that.keyup = keyUpListener;
      this.ctx.canvas.addEventListener("mousemove", that.mousemove, false);
      this.ctx.canvas.addEventListener("click", that.leftclick, false);
      this.ctx.canvas.addEventListener("wheel", that.wheelscroll, false);
      this.ctx.canvas.addEventListener("keydown", that.keydown, false);
      this.ctx.canvas.addEventListener("keyup", that.keyup, false);
    }
  }, {
    key: "disableInput",
    value: function disableInput() {
      var that = this;
      that.ctx.canvas.removeEventListener("mousemove", that.mousemove);
      that.ctx.canvas.removeEventListener("click", that.leftclick);
      that.ctx.canvas.removeEventListener("wheel", that.wheelscroll);
      that.ctx.canvas.removeEventListener("keyup", that.keyup);
      that.ctx.canvas.removeEventListener("keydown", that.keydown);
      that.left = false;
      that.right = false;
      that.up = false;
      that.down = false;
      that.A = false;
      that.B = false;
    }
  }, {
    key: "addEntity",
    value: function addEntity(entity) {
      this.entities.push(entity);
    }
  }, {
    key: "draw",
    value: function draw() {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
      }

      this.camera.draw(this.ctx);
    }
  }, {
    key: "gamepadUpdate",
    value: function gamepadUpdate() {
      this.gamepad = navigator.getGamepads()[0];
      var gamepad = this.gamepad;

      if (gamepad != null && !this.keyboardActive) {
        this.A = gamepad.buttons[0].pressed;
        this.B = gamepad.buttons[1].pressed;
        this.left = gamepad.buttons[14].pressed || gamepad.axes[0] < -0.3;
        this.right = gamepad.buttons[15].pressed || gamepad.axes[0] > 0.3;
        this.up = gamepad.buttons[12].pressed || gamepad.axes[1] < -0.3;
        this.down = gamepad.buttons[13].pressed || gamepad.axes[1] > 0.3;
      }
    }
  }, {
    key: "update",
    value: function update() {
      var entitiesCount = this.entities.length;
      this.gamepadUpdate();

      for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
          entity.update();
        }
      }

      this.camera.update();

      for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
          this.entities.splice(i, 1);
        }
      }

      this.wheel = 0;
    }
  }, {
    key: "loop",
    value: function loop() {
      this.clockTick = this.timer.tick();
      this.update();
      this.draw();
      this.click = null;
    }
  }]);

  return GameEngine;
}();

;