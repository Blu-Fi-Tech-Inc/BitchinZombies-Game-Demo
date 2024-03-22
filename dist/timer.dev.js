"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011
var Timer =
/*#__PURE__*/
function () {
  function Timer() {
    _classCallCheck(this, Timer);

    this.gameTime = 0;
    this.maxStep = 0.05;
    this.lastTimestamp = 0;
    this.ticks = [];
  }

  _createClass(Timer, [{
    key: "tick",
    value: function tick() {
      var current = Date.now();
      var delta = (current - this.lastTimestamp) / 1000; // convert milliseconds to seconds

      this.lastTimestamp = current;
      var gameDelta = Math.min(delta, this.maxStep);
      this.gameTime += gameDelta;
      this.ticks.push(delta);
      var index = this.ticks.length - 1;
      var sum = 0;

      while (sum <= 1 && index >= 0) {
        sum += this.ticks[index--];
      }

      index++;
      this.ticks.splice(0, index);
      return gameDelta;
    }
  }]);

  return Timer;
}();

;