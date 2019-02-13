"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = scheduleCallback;

function scheduleCallback(callback) {
  var timer = requestAnimationFrame(callback);
  return function () {
    cancelAnimationFrame(timer);
  };
}