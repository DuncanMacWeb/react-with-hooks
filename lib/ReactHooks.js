"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useContext = useContext;
exports.useState = useState;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useEffect = useEffect;
exports.useLayoutEffect = useLayoutEffect;
exports.useCallback = useCallback;
exports.useMemo = useMemo;
exports.useImperativeHandle = useImperativeHandle;

var _invariant = _interopRequireDefault(require("invariant"));

var _ReactCurrentDispatcher = _interopRequireDefault(require("./ReactCurrentDispatcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
function resolveDispatcher() {
  var dispatcher = _ReactCurrentDispatcher.default.current;
  (0, _invariant.default)(dispatcher !== null, 'Hooks can only be called inside the body of a function component. ' + '(https://fb.me/react-invalid-hook-call)');
  return dispatcher;
}

function useContext(context) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useContext(context);
}

function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}

function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}

function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}

function useEffect(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, inputs);
}

function useLayoutEffect(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, inputs);
}

function useCallback(callback, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, inputs);
}

function useMemo(create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, inputs);
}

function useImperativeHandle(ref, create, inputs) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, inputs);
}