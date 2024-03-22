"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var BoundingBox =
/*#__PURE__*/
function () {
  function BoundingBox(x, y, width, height) {
    _classCallCheck(this, BoundingBox);

    Object.assign(this, {
      x: x,
      y: y,
      width: width,
      height: height
    });
    this.left = x;
    this.top = y;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;
  }

  _createClass(BoundingBox, [{
    key: "collide",
    value: function collide(oth) {
      if (this.right > oth.left && this.left < oth.right && this.top < oth.bottom && this.bottom > oth.top) return true;
      return false;
    }
  }, {
    key: "overlap",
    value: function overlap(oth) {
      var a_half = {
        x: this.width / 2,
        y: this.height / 2
      };
      var b_half = {
        x: oth.width / 2,
        y: oth.height / 2
      };
      var a_center = {
        x: this.right - a_half.x,
        y: this.bottom - a_half.y
      };
      var b_center = {
        x: oth.right - b_half.x,
        y: oth.bottom - b_half.y
      };
      var ox = a_half.x + b_half.x - Math.abs(a_center.x - b_center.x);
      var oy = a_half.y + b_half.y - Math.abs(a_center.y - b_center.y);
      return {
        x: ox,
        y: oy
      };
    }
  }]);

  return BoundingBox;
}();

;