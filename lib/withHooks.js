"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useState = useState;
exports.useEffect = useEffect;
exports.useContext = useContext;
exports.useReducer = useReducer;
exports.useCallback = useCallback;
exports.useMemo = useMemo;
exports.useRef = useRef;
exports.useImperativeHandler = useImperativeHandler;
exports.useLayoutEffect = useLayoutEffect;
exports.default = withHooks;

var _react = _interopRequireWildcard(require("react"));

var _invariant = _interopRequireDefault(require("invariant"));

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

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var RE_RENDER_LIMIT = 25;
var NoEffect =
/*             */
0;
var MountPassive =
/*         */
64;
var UnmountPassive =
/*       */
128;
var firstWorkInProgressHook = null;
var firstCurrentHook = null;
var currentHook = null;
var workInProgressHook = null;
var isReRender = false;
var didScheduleRenderPhaseUpdate = false;
var currentInstance = null;
var renderPhaseUpdates = null;
var numberOfReRenders = 0;
var componentUpdateQueue = null;
var componentContext = null;
var isRenderPhase = false;

function basicStateReducer(state, action) {
  return typeof action === 'function' ? action(state) : action;
}

function prepareToUseHooks(current) {
  currentInstance = current;
  firstCurrentHook = current.memoizedState ? current.memoizedState : null;
}

function finishHooks(render, props, children, refOrContext) {
  while (didScheduleRenderPhaseUpdate) {
    // Updates were scheduled during the render phase. They are stored in
    // the `renderPhaseUpdates` map. Call the component again, reusing the
    // work-in-progress hooks and applying the additional updates on top. Keep
    // restarting until no more updates are scheduled.
    didScheduleRenderPhaseUpdate = false;
    numberOfReRenders += 1; // Start over from the beginning of the list

    currentHook = null;
    workInProgressHook = null;
    componentUpdateQueue = null;
    children = currentInstance.applyContext(function () {
      return render(props, refOrContext);
    });
    componentContext = null;
  }

  renderPhaseUpdates = null;
  numberOfReRenders = 0;
  currentInstance.firstHook = firstWorkInProgressHook;
  var renderedInstance = currentInstance;
  renderedInstance.memoizedState = firstWorkInProgressHook;
  renderedInstance.updateQueue = componentUpdateQueue;
  var didRenderTooFewHooks = currentHook !== null && currentHook.next !== null;
  currentInstance = null;
  firstCurrentHook = null;
  currentHook = null;
  firstWorkInProgressHook = null;
  workInProgressHook = null;
  componentUpdateQueue = null;
  componentContext = null;
  isRenderPhase = false;
  (0, _invariant.default)(!didRenderTooFewHooks, 'Rendered fewer hooks than expected. This may be caused by an accidental ' + 'early return statement.');
  return children;
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

function createHook() {
  return {
    memoizedState: null,
    baseState: null,
    queue: null,
    baseUpdate: null,
    next: null
  };
}

function cloneHook(hook) {
  return {
    memoizedState: hook.memoizedState,
    baseState: hook.memoizedState,
    queue: hook.queue,
    baseUpdate: hook.baseUpdate,
    next: null
  };
}

function createWorkInProgressHook() {
  if (workInProgressHook === null) {
    // This is the first hook in the list
    if (firstWorkInProgressHook === null) {
      isReRender = false;
      currentHook = firstCurrentHook;

      if (currentHook === null) {
        // This is a newly mounted hook
        workInProgressHook = createHook();
      } else {
        // Clone the current hook.
        workInProgressHook = cloneHook(currentHook);
      }

      firstWorkInProgressHook = workInProgressHook;
    } else {
      // There's already a work-in-progress. Reuse it.
      isReRender = true;
      currentHook = firstCurrentHook;
      workInProgressHook = firstWorkInProgressHook;
    }
  } else {
    if (workInProgressHook.next === null) {
      isReRender = false;
      var hook = void 0;

      if (currentHook === null) {
        // This is a newly mounted hook
        hook = createHook();
      } else {
        currentHook = currentHook.next;

        if (currentHook === null) {
          // This is a newly mounted hook
          hook = createHook();
        } else {
          // Clone the current hook.
          hook = cloneHook(currentHook);
        }
      } // Append to the end of the list


      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // There's already a work-in-progress. Reuse it.
      isReRender = true;
      workInProgressHook = workInProgressHook.next;
      currentHook = currentHook !== null ? currentHook.next : null;
    }
  }

  return workInProgressHook;
}

function createFunctionComponentUpdateQueue() {
  return {
    lastEffect: null
  };
}

function inputsAreEqual(arr1, arr2) {
  for (var i = 0; i < arr1.length; i++) {
    var val1 = arr1[i];
    var val2 = arr2[i];

    if (val1 === val2 && (val1 !== 0 || 1 / val1 === 1 / val2) || val1 !== val1 && val2 !== val2) {
      continue;
    }

    return false;
  }

  return true;
}

function pushEffect(tag, create, destroy, inputs) {
  var effect = {
    tag: tag,
    create: create,
    destroy: destroy,
    inputs: inputs,
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
    var _update = {
      action: action,
      next: null
    }; // Append the update to the end of the list.

    var last = queue.last;

    if (last === null) {
      // This is the first update. Create a circular list.
      _update.next = _update;
    } else {
      var first = last.next;

      if (first !== null) {
        // Still circular.
        _update.next = first;
      }

      last.next = _update;
    }

    queue.last = _update;
    instance.setState({});
  }
}

function useState(initialState) {
  return useReducer(basicStateReducer, initialState);
}

function useEffect(create, inputs) {
  var workInProgressHook = createWorkInProgressHook();
  var nextInputs = inputs !== undefined && inputs !== null ? inputs : [create];
  var destroy = null;

  if (currentHook !== null) {
    var prevEffect = currentHook.memoizedState;
    destroy = prevEffect.destroy;

    if (inputsAreEqual(nextInputs, prevEffect.inputs)) {
      pushEffect(NoEffect, create, destroy, nextInputs);
      return;
    }
  }

  workInProgressHook.memoizedState = pushEffect(UnmountPassive | MountPassive, create, destroy, nextInputs);
}

function useContext(Context) {
  pushContext(Context);
  return Context._currentValue;
}

function useReducer(reducer, initialState, initialAction) {
  workInProgressHook = createWorkInProgressHook();
  var queue = workInProgressHook.queue;

  if (queue !== null) {
    // Already have a queue, so this is an update.
    if (isReRender) {
      // This is a re-render. Apply the new render phase updates to the previous
      // work-in-progress hook.
      var _dispatch2 = queue.dispatch;

      if (renderPhaseUpdates !== null) {
        // Render phase updates are stored in a map of queue -> linked list
        var firstRenderPhaseUpdate = renderPhaseUpdates.get(queue);

        if (firstRenderPhaseUpdate !== undefined) {
          renderPhaseUpdates.delete(queue);
          var newState = workInProgressHook.memoizedState;
          var update = firstRenderPhaseUpdate;

          do {
            // Process this render phase update. We don't have to check the
            // priority because it will always be the same as the current
            // render's.
            var action = update.action;
            newState = reducer(newState, action);
            update = update.next;
          } while (update !== null);

          workInProgressHook.memoizedState = newState; // Don't persist the state accumlated from the render phase updates to
          // the base state unless the queue is empty.
          // TODO: Not sure if this is the desired semantics, but it's what we
          // do for gDSFP. I can't remember why.

          if (workInProgressHook.baseUpdate === queue.last) {
            workInProgressHook.baseState = newState;
          }

          return [newState, _dispatch2];
        }
      }

      return [workInProgressHook.memoizedState, _dispatch2];
    } // The last update in the entire queue


    var last = queue.last; // The last update that is part of the base state.

    var baseUpdate = workInProgressHook.baseUpdate; // Find the first unprocessed update.

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
      var _newState = workInProgressHook.baseState;
      var newBaseState = null;
      var newBaseUpdate = null;
      var prevUpdate = baseUpdate;
      var _update2 = first;
      var didSkip = false;

      do {
        // Process this update.
        var _action = _update2.action;
        _newState = reducer(_newState, _action);
        prevUpdate = _update2;
        _update2 = _update2.next;
      } while (_update2 !== null && _update2 !== first);

      if (!didSkip) {
        newBaseUpdate = prevUpdate;
        newBaseState = _newState;
      }

      workInProgressHook.memoizedState = _newState;
      workInProgressHook.baseUpdate = newBaseUpdate;
      workInProgressHook.baseState = newBaseState;
    }

    var _dispatch = queue.dispatch;
    return [workInProgressHook.memoizedState, _dispatch];
  } // There's no existing queue, so this is the initial render.


  if (reducer === basicStateReducer) {
    // Special case for `useState`.
    if (typeof initialState === 'function') {
      initialState = initialState();
    }
  } else if (initialAction !== undefined && initialAction !== null) {
    initialState = reducer(initialState, initialAction);
  }

  workInProgressHook.memoizedState = workInProgressHook.baseState = initialState;
  queue = workInProgressHook.queue = {
    last: null,
    dispatch: null
  };
  var dispatch = queue.dispatch = dispatchAction.bind(null, currentInstance, queue);
  return [workInProgressHook.memoizedState, dispatch];
}

function useCallback(fn, deps) {
  return useMemo(function () {
    return fn;
  }, deps);
}

function useMemo(nextCreate, inputs) {
  var workInProgressHook = createWorkInProgressHook();
  var nextInputs = inputs !== undefined && inputs !== null ? inputs : [nextCreate];
  var prevState = workInProgressHook.memoizedState;

  if (prevState !== null) {
    var prevInputs = prevState[1];

    if (inputsAreEqual(nextInputs, prevInputs)) {
      return prevState[0];
    }
  }

  var nextValue = nextCreate();
  workInProgressHook.memoizedState = [nextValue, nextInputs];
  return nextValue;
}

function useRef(initialValue) {
  workInProgressHook = createWorkInProgressHook();
  var ref;

  if (workInProgressHook.memoizedState === null) {
    ref = {
      current: initialValue
    };
    workInProgressHook.memoizedState = ref;
  } else {
    ref = workInProgressHook.memoizedState;
  }

  return ref;
}

function useImperativeHandler(ref, create, inputs) {
  // TODO: If inputs are provided, should we skip comparing the ref itself?
  var nextInputs = inputs !== null && inputs !== undefined ? inputs.concat([ref]) : [ref, create]; // TODO: I've implemented this on top of useEffect because it's almost the
  // same thing, and it would require an equal amount of code. It doesn't seem
  // like a common enough use case to justify the additional size.

  useEffect(function () {
    if (typeof ref === 'function') {
      var refCallback = ref;
      var inst = create();
      refCallback(inst);
      return function () {
        return refCallback(null);
      };
    } else if (ref !== null && ref !== undefined) {
      var refObject = ref;

      var _inst = create();

      refObject.current = _inst;
      return function () {
        refObject.current = null;
      };
    }
  }, nextInputs);
}

function useLayoutEffect() {
  return useEffect.apply(void 0, arguments);
}

function withHooks(_render) {
  var WithHooks =
  /*#__PURE__*/
  function (_React$Component) {
    _inherits(WithHooks, _React$Component);

    function WithHooks() {
      _classCallCheck(this, WithHooks);

      return _possibleConstructorReturn(this, _getPrototypeOf(WithHooks).apply(this, arguments));
    }

    _createClass(WithHooks, [{
      key: "componentDidMount",
      value: function componentDidMount() {
        this.commitHookEffectList(UnmountPassive, NoEffect);
        this.commitHookEffectList(NoEffect, MountPassive);
        this.mounted = true;
      }
    }, {
      key: "componentDidUpdate",
      value: function componentDidUpdate() {
        this.commitHookEffectList(UnmountPassive, NoEffect);
        this.commitHookEffectList(NoEffect, MountPassive);
      }
    }, {
      key: "componentWillUnmount",
      value: function componentWillUnmount() {
        this.callDestroy();
      }
    }, {
      key: "commitHookEffectList",
      value: function commitHookEffectList(unmountTag, mountTag) {
        var lastEffect = this.updateQueue !== null ? this.updateQueue.lastEffect : null;

        if (lastEffect !== null) {
          var firstEffect = lastEffect.next;
          var effect = firstEffect;

          do {
            if ((effect.tag & unmountTag) !== NoEffect) {
              // Unmount
              var destroy = effect.destroy;
              effect.destroy = null;

              if (destroy !== null) {
                destroy();
              }
            }

            effect = effect.next;
          } while (effect !== firstEffect);

          effect = firstEffect;

          do {
            if ((effect.tag & mountTag) !== NoEffect) {
              // Mount
              var create = effect.create;

              var _destroy = create();

              effect.destroy = typeof _destroy === 'function' ? _destroy : null;
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

              if (destroy !== null) {
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
        var _this = this;

        if (!children) {
          children = render();
        }

        context = context || componentContext;

        if (context !== null) {
          return (0, _react.createElement)(context.Consumer, {}, function () {
            if (_this.mounted) {
              children = render();
            }

            return context.next === null ? children : _this.applyContext(render, context.next, children);
          });
        }

        return children;
      }
    }, {
      key: "render",
      value: function render() {
        resetHooks();
        prepareToUseHooks(this);

        var _this$props = this.props,
            _forwardedRef = _this$props._forwardedRef,
            rest = _objectWithoutProperties(_this$props, ["_forwardedRef"]);

        isRenderPhase = true;
        var nextChildren = this.applyContext(function () {
          return _render(rest, _forwardedRef);
        });
        return finishHooks(_render, rest, nextChildren, _forwardedRef);
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

  wrap.displayName = "WithHooks(".concat(WithHooks.displayName, ")");
  return wrap;
}