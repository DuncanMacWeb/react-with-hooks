"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var pendingWorks = [];

var scheduleCallback = function scheduleCallback(callback) {
  pendingWorks.push(callback);
  return function () {
    pendingWorks = pendingWorks.filter(function (cb) {
      return cb === callback;
    });
  };
};

scheduleCallback.flush = function () {
  var work = pendingWorks.shift();

  while (work !== undefined) {
    work();
    work = pendingWorks.shift();
  }
};

var _default = scheduleCallback;
exports.default = _default;