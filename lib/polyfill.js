"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

var React = require('react');

var reactHooks = require('./withHooks');

var useNative = !!React.useState;

var withHooks = reactHooks.default,
    hooks = _objectWithoutProperties(reactHooks, ["default"]);

var createElement = useNative ? React.createElement : function () {
  var componentMap = new Map();
  return function (el, props) {
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (typeof el === 'function' && el.prototype && !el.prototype.isReactComponent) {
      if (!componentMap.has(el)) {
        if (!/\buse(State|(Mutation|Layout)?Effect|Context|Reducer|Callback|Memo|Ref|ImperativeHandle)\b/.test("".concat(el))) {
          componentMap.set(el, el);
        } else {
          componentMap.set(el, withHooks(el));
        }
      }

      return React.createElement.apply(React, [componentMap.get(el), props].concat(children));
    }

    return React.createElement.apply(React, [el, props].concat(children));
  };
}();

var newReact = _objectSpread({}, React, useNative ? {} : _objectSpread({
  createElement: createElement
}, hooks));

newReact.default = _objectSpread({}, newReact);
module.exports = newReact;