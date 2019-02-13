"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = withHooks;

var _react = _interopRequireWildcard(require("react"));

var _invariant = _interopRequireDefault(require("invariant"));

var _ReactCurrentDispatcher = _interopRequireDefault(require("./ReactCurrentDispatcher"));

var _ReactSideEffectTags = require("./ReactSideEffectTags");

var _ReactHookEffectTags = require("./ReactHookEffectTags");

var _objectIs = _interopRequireDefault(require("./objectIs"));

var _scheduleCallback = _interopRequireDefault(require("./scheduleCallback"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var RE_RENDER_LIMIT = 25;
var firstCurrentHook = null;
var firstWorkInProgressHook = null;
var currentHook = null;
var nextCurrentHook = null;
var workInProgressHook = null;
var nextWorkInProgressHook = null;
var didScheduleRenderPhaseUpdate = false;
var currentInstance = null;
var renderPhaseUpdates = null;
var numberOfReRenders = 0;
var componentUpdateQueue = null;
var sideEffectTag = 0;
var componentContext = null;
var isRenderPhase = false;
var didReceiveUpdate = false;

function markWorkInProgressReceivedUpdate() {
  didReceiveUpdate = true;
}

function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}

function prepareToUseHooks(current) {
  currentInstance = current;
  firstCurrentHook = nextCurrentHook = current !== null ? current.memoizedState : null;
}

function resetHooks() {
  currentInstance = null;
  firstCurrentHook = null;
  currentHook = null;
  firstWorkInProgressHook = null;
  workInProgressHook = null;
  componentUpdateQueue = null;
  componentContext = null;
  didScheduleRenderPhaseUpdate = false;
  renderPhaseUpdates = null;
  numberOfReRenders = 0;
  isRenderPhase = false;
}

function mountWorkInProgressHook() {
  var hook = {
    memoizedState: null,
    baseState: null,
    queue: null,
    baseUpdate: null,
    next: null
  };

  if (workInProgressHook === null) {
    // This is the first hook in the list
    firstWorkInProgressHook = workInProgressHook = hook;
  } else {
    // Append to the end of the list
    workInProgressHook = workInProgressHook.next = hook;
  }

  return workInProgressHook;
}

function updateWorkInProgressHook() {
  // This function is used both for updates and for re-renders triggered by a
  // render phase update. It assumes there is either a current hook we can
  // clone, or a work-in-progress hook from a previous render pass that we can
  // use as a base. When we reach the end of the base list, we must switch to
  // the dispatcher used for mounts.
  if (nextWorkInProgressHook !== null) {
    // There's already a work-in-progress. Reuse it.
    workInProgressHook = nextWorkInProgressHook;
    nextWorkInProgressHook = workInProgressHook.next;
    currentHook = nextCurrentHook;
    nextCurrentHook = currentHook !== null ? currentHook.next : null;
  } else {
    // Clone from the current hook.
    (0, _invariant.default)(nextCurrentHook !== null, 'Rendered more hooks than during the previous render.');
    currentHook = nextCurrentHook;
    var newHook = {
      memoizedState: currentHook.memoizedState,
      baseState: currentHook.baseState,
      queue: currentHook.queue,
      baseUpdate: currentHook.baseUpdate,
      next: null
    };

    if (workInProgressHook === null) {
      // This is the first hook in the list.
      workInProgressHook = firstWorkInProgressHook = newHook;
    } else {
      // Append to the end of the list.
      workInProgressHook = workInProgressHook.next = newHook;
    }

    nextCurrentHook = currentHook.next;
  }

  return workInProgressHook;
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null
  };
}

function areHookInputsEqual(nextDeps, prevDeps) {
  if (prevDeps === null) {
    return false;
  }

  for (var i = 0; i < prevDeps.length && i < nextDeps.length; i++) {
    if ((0, _objectIs.default)(nextDeps[i], prevDeps[i])) {
      continue;
    }

    return false;
  }

  return true;
}

function mountState(initialState) {
  var hook = mountWorkInProgressHook();

  if (typeof initialState === 'function') {
    initialState = initialState();
  }

  hook.memoizedState = hook.baseState = initialState;
  var queue = hook.queue = {
    last: null,
    dispatch: null,
    eagerReducer: basicStateReducer,
    eagerState: initialState
  };
  var dispatch = queue.dispatch = dispatchAction.bind(null, currentInstance, queue);
  return [hook.memoizedState, dispatch];
}

function updateState(initialState) {
  return updateReducer(basicStateReducer, initialState);
}

function pushEffect(tag, create, destroy, deps) {
  var effect = {
    tag: tag,
    create: create,
    destroy: destroy,
    deps: deps,
    // Circular
    next: null
  };

  if (componentUpdateQueue === null) {
    componentUpdateQueue = createFunctionComponentUpdateQueue();
    componentUpdateQueue.lastEffect = effect.next = effect;
  } else {
    var lastEffect = componentUpdateQueue.lastEffect;

    if (lastEffect === null) {
      componentUpdateQueue.lastEffect = effect.next = effect;
    } else {
      var firstEffect = lastEffect.next;
      lastEffect.next = effect;
      effect.next = firstEffect;
      componentUpdateQueue.lastEffect = effect;
    }
  }

  return effect;
}

function pushContext(context) {
  var _context = {
    Consumer: context.Consumer,
    next: null
  };

  if (componentContext === null) {
    componentContext = _context;
  } else {
    componentContext.next = _context;
  }

  return _context;
}

function mountRef(initialValue) {
  var hook = mountWorkInProgressHook();
  var ref = {
    current: initialValue
  };
  hook.memoizedState = ref;
  return ref;
}

function updateRef() {
  var hook = updateWorkInProgressHook();
  return hook.memoizedState;
}

function mountEffectImpl(fiberEffectTag, hookEffectTag, create, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  sideEffectTag |= fiberEffectTag;
  hook.memoizedState = pushEffect(hookEffectTag, create, undefined, nextDeps);
}

function updateEffectImpl(fiberEffectTag, hookEffectTag, create, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var destroy = undefined;

  if (currentHook !== null) {
    var prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;

    if (nextDeps !== null) {
      var prevDeps = prevEffect.deps;

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        pushEffect(_ReactHookEffectTags.NoEffect, create, destroy, nextDeps);
        return;
      }
    }
  }

  sideEffectTag |= fiberEffectTag;
  hook.memoizedState = pushEffect(hookEffectTag, create, destroy, nextDeps);
}

function mountEffect(create, deps) {
  return mountEffectImpl(_ReactSideEffectTags.Update | _ReactSideEffectTags.Passive, _ReactHookEffectTags.UnmountPassive | _ReactHookEffectTags.MountPassive, create, deps);
}

function updateEffect(create, deps) {
  return updateEffectImpl(_ReactSideEffectTags.Update | _ReactSideEffectTags.Passive, _ReactHookEffectTags.UnmountPassive | _ReactHookEffectTags.MountPassive, create, deps);
}

function mountLayoutEffect(create, deps) {
  return mountEffectImpl(_ReactSideEffectTags.Update, _ReactHookEffectTags.UnmountMutation | _ReactHookEffectTags.MountLayout, create, deps);
}

function updateLayoutEffect(create, deps) {
  return updateEffectImpl(_ReactSideEffectTags.Update, _ReactHookEffectTags.UnmountMutation | _ReactHookEffectTags.MountLayout, create, deps);
}

function imperativeHandleEffect(create, ref) {
  if (typeof ref === 'function') {
    var refCallback = ref;
    var inst = create();
    refCallback(inst);
    return function () {
      refCallback(null);
    };
  } else if (ref !== null && ref !== undefined) {
    var refObject = ref;

    var _inst = create();

    refObject.current = _inst;
    return function () {
      refObject.current = null;
    };
  }
}

function mountImperativeHandle(ref, create, deps) {
  // TODO: If deps are provided, should we skip comparing the ref itself?
  var effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : [ref];
  return mountEffectImpl(_ReactSideEffectTags.Update, _ReactHookEffectTags.UnmountMutation | _ReactHookEffectTags.MountLayout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
}

function updateImperativeHandle(ref, create, deps) {
  // TODO: If deps are provided, should we skip comparing the ref itself?
  var effectDeps = deps !== null && deps !== undefined ? deps.concat([ref]) : [ref];
  return updateEffectImpl(_ReactSideEffectTags.Update, _ReactHookEffectTags.UnmountMutation | _ReactHookEffectTags.MountLayout, imperativeHandleEffect.bind(null, create, ref), effectDeps);
}

function mountContext(Context) {
  pushContext(Context);
  return Context._currentValue;
}

function mountReducer(reducer, initialArg, init) {
  var hook = mountWorkInProgressHook();
  var initialState;

  if (init !== undefined) {
    initialState = init(initialArg);
  } else {
    initialState = initialArg;
  }

  hook.memoizedState = hook.baseState = initialState;
  var queue = hook.queue = {
    last: null,
    dispatch: null,
    eagerReducer: reducer,
    eagerState: initialState
  };
  var dispatch = queue.dispatch = dispatchAction.bind(null, // Flow doesn't know this is non-null, but we do.
  currentInstance, queue);
  return [hook.memoizedState, dispatch];
}

function updateReducer(reducer, initialArg, init) {
  var hook = updateWorkInProgressHook();
  var queue = hook.queue;
  (0, _invariant.default)(queue !== null, 'Should have a queue. This is likely a bug in React. Please file an issue.');

  if (numberOfReRenders > 0) {
    // This is a re-render. Apply the new render phase updates to the previous
    // work-in-progress hook.
    var _dispatch = queue.dispatch;

    if (renderPhaseUpdates !== null) {
      // Render phase updates are stored in a map of queue -> linked list
      var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);

      if (firstRenderPhaseUpdate !== undefined) {
        renderPhaseUpdates.delete(queue);
        var newState = hook.memoizedState;
        var update = firstRenderPhaseUpdate;

        do {
          // Process this render phase update. We don't have to check the
          // priority because it will always be the same as the current
          // render's.
          var action = update.action;
          newState = reducer(newState, action);
          update = update.next;
        } while (update !== null); // Mark that the fiber performed work, but only if the new state is
        // different from the current state.


        if (!(0, _objectIs.default)(newState, hook.memoizedState)) {
          markWorkInProgressReceivedUpdate();
        }

        hook.memoizedState = newState; // Don't persist the state accumlated from the render phase updates to
        // the base state unless the queue is empty.
        // TODO: Not sure if this is the desired semantics, but it's what we
        // do for gDSFP. I can't remember why.

        if (hook.baseUpdate === queue.last) {
          hook.baseState = newState;
        }

        return [newState, _dispatch];
      }
    }

    return [hook.memoizedState, _dispatch];
  } // The last update in the entire queue


  var last = queue.last; // The last update that is part of the base state.

  var baseUpdate = hook.baseUpdate;
  var baseState = hook.baseState; // Find the first unprocessed update.

  var first;

  if (baseUpdate !== null) {
    if (last !== null) {
      // For the first update, the queue is a circular linked list where
      // `queue.last.next = queue.first`. Once the first update commits, and
      // the `baseUpdate` is no longer empty, we can unravel the list.
      last.next = null;
    }

    first = baseUpdate.next;
  } else {
    first = last !== null ? last.next : null;
  }

  if (first !== null) {
    var _newState = baseState;
    var newBaseState = null;
    var newBaseUpdate = null;
    var prevUpdate = baseUpdate;
    var _update = first;
    var didSkip = false;

    do {
      // Process this update.
      if (_update.eagerReducer === reducer) {
        // If this update was processed eagerly, and its reducer matches the
        // current reducer, we can use the eagerly computed state.
        _newState = _update.eagerState;
      } else {
        var _action = _update.action;
        _newState = reducer(_newState, _action);
      }

      prevUpdate = _update;
      _update = _update.next;
    } while (_update !== null && _update !== first);

    if (!didSkip) {
      newBaseUpdate = prevUpdate;
      newBaseState = _newState;
    } // Mark that the fiber performed work, but only if the new state is
    // different from the current state.


    if (!(0, _objectIs.default)(_newState, hook.memoizedState)) {
      markWorkInProgressReceivedUpdate();
    }

    hook.memoizedState = _newState;
    hook.baseUpdate = newBaseUpdate;
    hook.baseState = newBaseState;
    queue.eagerReducer = reducer;
    queue.eagerState = _newState;
  }

  var dispatch = queue.dispatch;
  return [hook.memoizedState, dispatch];
}

function mountCallback(callback, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function updateCallback(callback, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;

  if (prevState !== null) {
    if (nextDeps !== null) {
      var prevDeps = prevState[1];

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function mountMemo(nextCreate, deps) {
  var hook = mountWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo(nextCreate, deps) {
  var hook = updateWorkInProgressHook();
  var nextDeps = deps === undefined ? null : deps;
  var prevState = hook.memoizedState;

  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      var prevDeps = prevState[1];

      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }

  var nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function dispatchAction(instance, queue, action) {
  (0, _invariant.default)(numberOfReRenders < RE_RENDER_LIMIT, 'Too many re-renders. React limits the number of renders to prevent ' + 'an infinite loop.');

  if (isRenderPhase) {
    // This is a render phase update. Stash it in a lazily-created map of
    // queue -> linked list of updates. After this render pass, we'll restart
    // and apply the stashed updates on top of the work-in-progress hook.
    didScheduleRenderPhaseUpdate = true;
    var update = {
      action: action,
      next: null
    };

    if (renderPhaseUpdates === null) {
      renderPhaseUpdates = new Map();
    }

    var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);

    if (firstRenderPhaseUpdate === undefined) {
      renderPhaseUpdates.set(queue, update);
    } else {
      // Append the update to the end of the list.
      var lastRenderPhaseUpdate = firstRenderPhaseUpdate;

      while (lastRenderPhaseUpdate.next !== null) {
        lastRenderPhaseUpdate = lastRenderPhaseUpdate.next;
      }

      lastRenderPhaseUpdate.next = update;
    }
  } else {
    var _update2 = {
      action: action,
      next: null
    }; // Append the update to the end of the list.

    var last = queue.last;

    if (last === null) {
      // This is the first update. Create a circular list.
      _update2.next = _update2;
    } else {
      var first = last.next;

      if (first !== null) {
        // Still circular.
        _update2.next = first;
      }

      last.next = _update2;
    }

    queue.last = _update2; // The queue is currently empty, which means we can eagerly compute the
    // next state before entering the render phase. If the new state is the
    // same as the current state, we may be able to bail out entirely.
    // const eagerReducer = queue.eagerReducer;
    // if (eagerReducer !== null) {
    //   let prevDispatcher;
    //   try {
    //     const currentState = queue.eagerState;
    //     const eagerState = eagerReducer(currentState, action);
    //     // Stash the eagerly computed state, and the reducer used to compute
    //     // it, on the update object. If the reducer hasn't changed by the
    //     // time we enter the render phase, then the eager state can be used
    //     // without calling the reducer again.
    //     update.eagerReducer = eagerReducer;
    //     update.eagerState = eagerState;
    //     if (is(eagerState, currentState)) {
    //       // Fast path. We can bail out without scheduling React to re-render.
    //       // It's still possible that we'll need to rebase this update later,
    //       // if the component re-renders for a different reason and by that
    //       // time the reducer has changed.
    //       return;
    //     }
    //   } catch (error) {
    //     // Suppress the error. It will throw again in the render phase.
    //   }
    // }

    instance.setState({});
  }
}

var HooksDispatcherOnMount = {
  useCallback: mountCallback,
  useContext: mountContext,
  useEffect: mountEffect,
  useImperativeHandle: mountImperativeHandle,
  useLayoutEffect: mountLayoutEffect,
  useMemo: mountMemo,
  useReducer: mountReducer,
  useRef: mountRef,
  useState: mountState
};
var HooksDispatcherOnUpdate = {
  useCallback: updateCallback,
  useContext: mountContext,
  useEffect: updateEffect,
  useImperativeHandle: updateImperativeHandle,
  useLayoutEffect: updateLayoutEffect,
  useMemo: updateMemo,
  useReducer: updateReducer,
  useRef: updateRef,
  useState: updateState
};

function withHooks(_render) {
  var WithHooks =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(WithHooks, _React$Component);

    function WithHooks() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, WithHooks);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(WithHooks)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "memoizedState", null);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "cancelPassiveEffectCallback", null);

      _defineProperty(_assertThisInitialized(_assertThisInitialized(_this)), "passiveEffectCallback", null);

      return _this;
    }

    _createClass(WithHooks, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        // useLayoutEffect
        this.commitHookEffectList(_ReactHookEffectTags.UnmountMutation, _ReactHookEffectTags.MountMutation);
        this.commitHookEffectList(_ReactHookEffectTags.UnmountLayout, _ReactHookEffectTags.MountLayout); // useEffect

        this.passiveEffectCallback = this.commitPassiveEffects.bind(this);
        this.cancelPassiveEffectCallback = (0, _scheduleCallback.default)(this.passiveEffectCallback);
        this.mounted = true;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        // useLayoutEffect
        this.commitHookEffectList(_ReactHookEffectTags.UnmountMutation, _ReactHookEffectTags.MountMutation);
        this.commitHookEffectList(_ReactHookEffectTags.UnmountLayout, _ReactHookEffectTags.MountLayout); // useEffect

        this.passiveEffectCallback = this.commitPassiveEffects.bind(this);
        this.cancelPassiveEffectCallback = (0, _scheduleCallback.default)(this.passiveEffectCallback);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.callDestroy();
      }
    }, {
      key: "commitPassiveEffects",
      value: function commitPassiveEffects() {
        this.passiveEffectCallback = null;
        this.cancelPassiveEffectCallback = null;
        this.commitPassiveHookEffects();
      }
    }, {
      key: "commitPassiveHookEffects",
      value: function commitPassiveHookEffects() {
        this.commitHookEffectList(_ReactHookEffectTags.UnmountPassive, _ReactHookEffectTags.NoEffect);
        this.commitHookEffectList(_ReactHookEffectTags.NoEffect, _ReactHookEffectTags.MountPassive);
      }
    }, {
      key: "flushPassiveEffects",
      value: function flushPassiveEffects() {
        if (this.cancelPassiveEffectCallback !== null) {
          this.cancelPassiveEffectCallback();
        }

        if (this.passiveEffectCallback !== null) {
          this.passiveEffectCallback();
        }
      }
    }, {
      key: "commitHookEffectList",
      value: function commitHookEffectList(unmountTag, mountTag) {
        var lastEffect = this.updateQueue !== null ? this.updateQueue.lastEffect : null;

        if (lastEffect !== null) {
          var firstEffect = lastEffect.next;
          var effect = firstEffect;

          do {
            if ((effect.tag & unmountTag) !== _ReactHookEffectTags.NoEffect) {
              // Unmount
              var destroy = effect.destroy;
              effect.destroy = undefined;

              if (destroy !== undefined) {
                destroy();
              }
            }

            effect = effect.next;
          } while (effect !== firstEffect);

          effect = firstEffect;

          do {
            if ((effect.tag & mountTag) !== _ReactHookEffectTags.NoEffect) {
              // Mount
              var create = effect.create;

              var _destroy = create();

              effect.destroy = typeof _destroy === 'function' ? _destroy : undefined;
            }

            effect = effect.next;
          } while (effect !== firstEffect);
        }
      }
    }, {
      key: "callDestroy",
      value: function callDestroy() {
        var updateQueue = this.updateQueue;

        if (updateQueue !== null) {
          var lastEffect = updateQueue.lastEffect;

          if (lastEffect !== null) {
            var firstEffect = lastEffect.next;
            var effect = firstEffect;

            do {
              var destroy = effect.destroy;

              if (destroy !== undefined) {
                destroy();
              }

              effect = effect.next;
            } while (effect !== firstEffect);
          }
        }
      }
    }, {
      key: "applyContext",
      value: function applyContext(render, context, children) {
        var _this2 = this;

        if (!children) {
          children = render();
        }

        context = context || componentContext;

        if (context !== null) {
          return (0, _react.createElement)(context.Consumer, {}, function () {
            if (_this2.mounted) {
              children = render();
            }

            return context.next === null ? children : _this2.applyContext(render, context.next, children);
          });
        }

        return children;
      }
    }, {
      key: "render",
      value: function render() {
        resetHooks();
        prepareToUseHooks(this);
        this.flushPassiveEffects();
        _ReactCurrentDispatcher.default.current = nextCurrentHook === null ? HooksDispatcherOnMount : HooksDispatcherOnUpdate;

        var _this$props = this.props,
            _forwardedRef = _this$props._forwardedRef,
            rest = _objectWithoutProperties(_this$props, ["_forwardedRef"]);

        isRenderPhase = true;
        var children = this.applyContext(function () {
          return _render(rest, _forwardedRef);
        });

        if (didScheduleRenderPhaseUpdate) {
          do {
            didScheduleRenderPhaseUpdate = false;
            numberOfReRenders += 1; // Start over from the beginning of the list

            firstCurrentHook = nextCurrentHook = this.memoizedState;
            nextWorkInProgressHook = firstWorkInProgressHook;
            currentHook = null;
            workInProgressHook = null;
            componentUpdateQueue = null;
            _ReactCurrentDispatcher.default.current = HooksDispatcherOnUpdate;
            children = _render(this.props, _forwardedRef);
          } while (didScheduleRenderPhaseUpdate);

          renderPhaseUpdates = null;
          numberOfReRenders = 0;
        }

        this.memoizedState = firstWorkInProgressHook;
        this.updateQueue = componentUpdateQueue;
        this.effectTag |= sideEffectTag;
        var didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
        currentInstance = null;
        firstCurrentHook = null;
        currentHook = null;
        nextCurrentHook = null;
        firstWorkInProgressHook = null;
        workInProgressHook = null;
        nextWorkInProgressHook = null;
        componentUpdateQueue = null;
        sideEffectTag = 0;
        isRenderPhase = false; // These were reset above
        // didScheduleRenderPhaseUpdate = false;
        // renderPhaseUpdates = null;
        // numberOfReRenders = 0;

        (0, _invariant.default)(!didRenderTooFewHooks, 'Rendered fewer hooks than expected. This may be caused by an accidental ' + 'early return statement.');
        return children;
      }
    }]);

    return WithHooks;
  }(_react.default.Component);

  WithHooks.displayName = _render.displayName || _render.name;

  var wrap = function wrap(props, ref) {
    return _react.default.createElement(WithHooks, _extends({}, props, {
      _forwardedRef: ref
    }));
  };

  wrap.__react_with_hooks = true;
  wrap.displayName = "WithHooks(".concat(WithHooks.displayName, ")");
  return wrap;
}