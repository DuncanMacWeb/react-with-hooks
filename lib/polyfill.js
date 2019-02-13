"use strict";

var _react = _interopRequireDefault(require("react"));

var ReactIs = _interopRequireWildcard(require("react-is"));

var hooks = _interopRequireWildcard(require("."));

var _withHooks = _interopRequireDefault(require("./withHooks"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useNative = !!_react.default.useState;
var nativeCreateElement = _react.default.createElement;

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function isSimpleFunctionComponent(type) {
  return typeof type === 'function' && !shouldConstruct(type) && type.defaultProps === undefined;
}

var createElementWithHooks = function () {
  var componentMap = new Map();
  return function (component, props) {
    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    if (componentMap.has(component)) {
      return nativeCreateElement.apply(void 0, [componentMap.get(component), props].concat(children));
    }

    var element = nativeCreateElement.apply(void 0, [component, props].concat(children));
    var wrappedComponent = component;

    if (ReactIs.isForwardRef(element)) {
      wrappedComponent.render = (0, _withHooks.default)(component.render);
      componentMap.set(component, wrappedComponent);
    }

    if (ReactIs.isMemo(component)) {
      wrappedComponent.type = (0, _withHooks.default)(component.type);
      componentMap.set(component, wrappedComponent);
    }

    if (isSimpleFunctionComponent(component) && component.__react_with_hooks !== true) {
      wrappedComponent = (0, _withHooks.default)(component);
      componentMap.set(component, wrappedComponent);
    }

    return nativeCreateElement.apply(void 0, [wrappedComponent, props].concat(children));
  };
}();

_react.default.createElement = useNative ? _react.default.createElement : createElementWithHooks;
Object.keys(hooks).forEach(function (hook) {
  _react.default[hook] = hooks[hook];
});