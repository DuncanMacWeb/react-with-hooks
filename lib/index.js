"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.useLayoutEffect = exports.useMutationEffect = exports.useImperativeHandle = exports.useRef = exports.useMemo = exports.useCallback = exports.useReducer = exports.useContext = exports.useEffect = exports.useState = void 0;

var _react = _interopRequireDefault(require("react"));

var _withHooks = _interopRequireDefault(require("./withHooks"));

var hooks = _interopRequireWildcard(require("./ReactHooks"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var useNative = !!_react.default.useState;
var useState = useNative ? _react.default.useState : hooks.useState;
exports.useState = useState;
var useEffect = useNative ? _react.default.useEffect : hooks.useEffect;
exports.useEffect = useEffect;
var useContext = useNative ? _react.default.useContext : hooks.useContext;
exports.useContext = useContext;
var useReducer = useNative ? _react.default.useReducer : hooks.useReducer;
exports.useReducer = useReducer;
var useCallback = useNative ? _react.default.useCallback : hooks.useCallback;
exports.useCallback = useCallback;
var useMemo = useNative ? _react.default.useMemo : hooks.useMemo;
exports.useMemo = useMemo;
var useRef = useNative ? _react.default.useRef : hooks.useRef;
exports.useRef = useRef;
var useImperativeHandle = useNative ? _react.default.useImperativeHandle : hooks.useImperativeHandle;
exports.useImperativeHandle = useImperativeHandle;
var useMutationEffect = useNative ? _react.default.useMutationEffect : hooks.useMutationEffect;
exports.useMutationEffect = useMutationEffect;
var useLayoutEffect = useNative ? _react.default.useLayoutEffect : hooks.useLayoutEffect;
exports.useLayoutEffect = useLayoutEffect;

var _default = useNative ? function (fn) {
  return fn;
} : _withHooks.default;

exports.default = _default;