"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var AssetManager =
/*#__PURE__*/
function () {
  function AssetManager() {
    _classCallCheck(this, AssetManager);

    this.successCount = 0;
    this.errorCount = 0;
    this.cache = [];
    this.downloadQueue = [];
  }

  _createClass(AssetManager, [{
    key: "queueDownload",
    value: function queueDownload(path) {
      console.log("Queueing " + path);
      this.downloadQueue.push(path);
    }
  }, {
    key: "isDone",
    value: function isDone() {
      return this.downloadQueue.length === this.successCount + this.errorCount;
    }
  }, {
    key: "downloadAll",
    value: function downloadAll(callback) {
      if (this.downloadQueue.length === 0) setTimeout(callback, 10);

      for (var i = 0; i < this.downloadQueue.length; i++) {
        var that = this;
        var path = this.downloadQueue[i];
        console.log(path);
        var ext = path.substring(path.length - 3);

        switch (ext) {
          case 'jpg':
          case 'png':
            var img = new Image();
            img.addEventListener("load", function () {
              console.log("Loaded " + this.src);
              that.successCount++;
              if (that.isDone()) callback();
            });
            img.addEventListener("error", function () {
              console.log("Error loading " + this.src);
              that.errorCount++;
              if (that.isDone()) callback();
            });
            img.src = path;
            this.cache[path] = img;
            break;

          case 'wav':
          case 'mp3':
          case 'mp4':
            var aud = new Audio();
            aud.addEventListener("loadeddata", function () {
              console.log("Loaded " + this.src);
              that.successCount++;
              if (that.isDone()) callback();
            });
            aud.addEventListener("error", function () {
              console.log("Error loading " + this.src);
              that.errorCount++;
              if (that.isDone()) callback();
            });
            aud.addEventListener("ended", function () {
              aud.pause();
              aud.currentTime = 0;
            });
            aud.src = path;
            aud.load();
            this.cache[path] = aud;
            break;
        }
      }
    }
  }, {
    key: "getAsset",
    value: function getAsset(path) {
      return this.cache[path];
    }
  }, {
    key: "playAsset",
    value: function playAsset(path) {
      var audio = this.cache[path];

      if (audio.currentTime != 0) {
        var bak = audio.cloneNode();
        bak.currentTime = 0;
        bak.volume = audio.volume;
        bak.play();
      } else {
        audio.currentTime = 0;
        audio.play();
      }
    }
  }, {
    key: "muteAudio",
    value: function muteAudio(mute) {
      for (var key in this.cache) {
        var asset = this.cache[key];

        if (asset instanceof Audio) {
          asset.muted = mute;
        }
      }
    }
  }, {
    key: "adjustVolume",
    value: function adjustVolume(volume) {
      for (var key in this.cache) {
        var asset = this.cache[key];

        if (asset instanceof Audio) {
          asset.volume = volume;
        }
      }
    }
  }, {
    key: "pauseBackgroundMusic",
    value: function pauseBackgroundMusic() {
      for (var key in this.cache) {
        var asset = this.cache[key];

        if (asset instanceof Audio) {
          asset.pause();
          asset.currentTime = 0;
        }
      }
    }
  }, {
    key: "autoRepeat",
    value: function autoRepeat(path) {
      var aud = this.cache[path];
      aud.addEventListener("ended", function () {
        aud.play();
      });
    }
  }]);

  return AssetManager;
}();

;