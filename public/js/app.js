(function (Canvas, Renderable, three, createMouseExplorer, S, Drag) {
	'use strict';

	Canvas = Canvas && Canvas.hasOwnProperty('default') ? Canvas['default'] : Canvas;
	Renderable = Renderable && Renderable.hasOwnProperty('default') ? Renderable['default'] : Renderable;
	createMouseExplorer = createMouseExplorer && createMouseExplorer.hasOwnProperty('default') ? createMouseExplorer['default'] : createMouseExplorer;
	S = S && S.hasOwnProperty('default') ? S['default'] : S;
	Drag = Drag && Drag.hasOwnProperty('default') ? Drag['default'] : Drag;

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var barba = createCommonjsModule(function (module, exports) {
	(function webpackUniversalModuleDefinition(root, factory) {
		module.exports = factory();
	})(commonjsGlobal, function() {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId])
	/******/ 			return installedModules[moduleId].exports;
	/******/
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			exports: {},
	/******/ 			id: moduleId,
	/******/ 			loaded: false
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.loaded = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "http://localhost:8080/dist";
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(0);
	/******/ })
	/************************************************************************/
	/******/ ([
	/* 0 */
	/***/ function(module, exports, __webpack_require__) {

		//Promise polyfill https://github.com/taylorhakes/promise-polyfill
		
		if (typeof Promise !== 'function') {
		 window.Promise = __webpack_require__(1);
		}
		
		var Barba = {
		  version: '1.0.0',
		  BaseTransition: __webpack_require__(4),
		  BaseView: __webpack_require__(6),
		  BaseCache: __webpack_require__(8),
		  Dispatcher: __webpack_require__(7),
		  HistoryManager: __webpack_require__(9),
		  Pjax: __webpack_require__(10),
		  Prefetch: __webpack_require__(13),
		  Utils: __webpack_require__(5)
		};
		
		module.exports = Barba;


	/***/ },
	/* 1 */
	/***/ function(module, exports, __webpack_require__) {

		/* WEBPACK VAR INJECTION */(function(setImmediate) {(function (root) {
		
		  // Store setTimeout reference so promise-polyfill will be unaffected by
		  // other code modifying setTimeout (like sinon.useFakeTimers())
		  var setTimeoutFunc = setTimeout;
		
		  function noop() {
		  }
		
		  // Use polyfill for setImmediate for performance gains
		  var asap = (typeof setImmediate === 'function' && setImmediate) ||
		    function (fn) {
		      setTimeoutFunc(fn, 0);
		    };
		
		  var onUnhandledRejection = function onUnhandledRejection(err) {
		    if (typeof console !== 'undefined' && console) {
		      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
		    }
		  };
		
		  // Polyfill for Function.prototype.bind
		  function bind(fn, thisArg) {
		    return function () {
		      fn.apply(thisArg, arguments);
		    };
		  }
		
		  function Promise(fn) {
		    if (typeof this !== 'object') throw new TypeError('Promises must be constructed via new');
		    if (typeof fn !== 'function') throw new TypeError('not a function');
		    this._state = 0;
		    this._handled = false;
		    this._value = undefined;
		    this._deferreds = [];
		
		    doResolve(fn, this);
		  }
		
		  function handle(self, deferred) {
		    while (self._state === 3) {
		      self = self._value;
		    }
		    if (self._state === 0) {
		      self._deferreds.push(deferred);
		      return;
		    }
		    self._handled = true;
		    asap(function () {
		      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
		      if (cb === null) {
		        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
		        return;
		      }
		      var ret;
		      try {
		        ret = cb(self._value);
		      } catch (e) {
		        reject(deferred.promise, e);
		        return;
		      }
		      resolve(deferred.promise, ret);
		    });
		  }
		
		  function resolve(self, newValue) {
		    try {
		      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
		      if (newValue === self) throw new TypeError('A promise cannot be resolved with itself.');
		      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
		        var then = newValue.then;
		        if (newValue instanceof Promise) {
		          self._state = 3;
		          self._value = newValue;
		          finale(self);
		          return;
		        } else if (typeof then === 'function') {
		          doResolve(bind(then, newValue), self);
		          return;
		        }
		      }
		      self._state = 1;
		      self._value = newValue;
		      finale(self);
		    } catch (e) {
		      reject(self, e);
		    }
		  }
		
		  function reject(self, newValue) {
		    self._state = 2;
		    self._value = newValue;
		    finale(self);
		  }
		
		  function finale(self) {
		    if (self._state === 2 && self._deferreds.length === 0) {
		      asap(function() {
		        if (!self._handled) {
		          onUnhandledRejection(self._value);
		        }
		      });
		    }
		
		    for (var i = 0, len = self._deferreds.length; i < len; i++) {
		      handle(self, self._deferreds[i]);
		    }
		    self._deferreds = null;
		  }
		
		  function Handler(onFulfilled, onRejected, promise) {
		    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
		    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
		    this.promise = promise;
		  }
		
		  /**
		   * Take a potentially misbehaving resolver function and make sure
		   * onFulfilled and onRejected are only called once.
		   *
		   * Makes no guarantees about asynchrony.
		   */
		  function doResolve(fn, self) {
		    var done = false;
		    try {
		      fn(function (value) {
		        if (done) return;
		        done = true;
		        resolve(self, value);
		      }, function (reason) {
		        if (done) return;
		        done = true;
		        reject(self, reason);
		      });
		    } catch (ex) {
		      if (done) return;
		      done = true;
		      reject(self, ex);
		    }
		  }
		
		  Promise.prototype['catch'] = function (onRejected) {
		    return this.then(null, onRejected);
		  };
		
		  Promise.prototype.then = function (onFulfilled, onRejected) {
		    var prom = new (this.constructor)(noop);
		
		    handle(this, new Handler(onFulfilled, onRejected, prom));
		    return prom;
		  };
		
		  Promise.all = function (arr) {
		    var args = Array.prototype.slice.call(arr);
		
		    return new Promise(function (resolve, reject) {
		      if (args.length === 0) return resolve([]);
		      var remaining = args.length;
		
		      function res(i, val) {
		        try {
		          if (val && (typeof val === 'object' || typeof val === 'function')) {
		            var then = val.then;
		            if (typeof then === 'function') {
		              then.call(val, function (val) {
		                res(i, val);
		              }, reject);
		              return;
		            }
		          }
		          args[i] = val;
		          if (--remaining === 0) {
		            resolve(args);
		          }
		        } catch (ex) {
		          reject(ex);
		        }
		      }
		
		      for (var i = 0; i < args.length; i++) {
		        res(i, args[i]);
		      }
		    });
		  };
		
		  Promise.resolve = function (value) {
		    if (value && typeof value === 'object' && value.constructor === Promise) {
		      return value;
		    }
		
		    return new Promise(function (resolve) {
		      resolve(value);
		    });
		  };
		
		  Promise.reject = function (value) {
		    return new Promise(function (resolve, reject) {
		      reject(value);
		    });
		  };
		
		  Promise.race = function (values) {
		    return new Promise(function (resolve, reject) {
		      for (var i = 0, len = values.length; i < len; i++) {
		        values[i].then(resolve, reject);
		      }
		    });
		  };
		
		  /**
		   * Set the immediate function to execute callbacks
		   * @param fn {function} Function to execute
		   * @private
		   */
		  Promise._setImmediateFn = function _setImmediateFn(fn) {
		    asap = fn;
		  };
		
		  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
		    onUnhandledRejection = fn;
		  };
		
		  if (typeof module !== 'undefined' && module.exports) {
		    module.exports = Promise;
		  } else if (!root.Promise) {
		    root.Promise = Promise;
		  }
		
		})(this);
		
		/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate));

	/***/ },
	/* 2 */
	/***/ function(module, exports, __webpack_require__) {

		/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(3).nextTick;
		var apply = Function.prototype.apply;
		var slice = Array.prototype.slice;
		var immediateIds = {};
		var nextImmediateId = 0;
		
		// DOM APIs, for completeness
		
		exports.setTimeout = function() {
		  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
		};
		exports.setInterval = function() {
		  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
		};
		exports.clearTimeout =
		exports.clearInterval = function(timeout) { timeout.close(); };
		
		function Timeout(id, clearFn) {
		  this._id = id;
		  this._clearFn = clearFn;
		}
		Timeout.prototype.unref = Timeout.prototype.ref = function() {};
		Timeout.prototype.close = function() {
		  this._clearFn.call(window, this._id);
		};
		
		// Does not start the time, just sets up the members needed.
		exports.enroll = function(item, msecs) {
		  clearTimeout(item._idleTimeoutId);
		  item._idleTimeout = msecs;
		};
		
		exports.unenroll = function(item) {
		  clearTimeout(item._idleTimeoutId);
		  item._idleTimeout = -1;
		};
		
		exports._unrefActive = exports.active = function(item) {
		  clearTimeout(item._idleTimeoutId);
		
		  var msecs = item._idleTimeout;
		  if (msecs >= 0) {
		    item._idleTimeoutId = setTimeout(function onTimeout() {
		      if (item._onTimeout)
		        item._onTimeout();
		    }, msecs);
		  }
		};
		
		// That's not how node.js implements it but the exposed api is the same.
		exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
		  var id = nextImmediateId++;
		  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
		
		  immediateIds[id] = true;
		
		  nextTick(function onNextTick() {
		    if (immediateIds[id]) {
		      // fn.call() is faster so we optimize for the common use-case
		      // @see http://jsperf.com/call-apply-segu
		      if (args) {
		        fn.apply(null, args);
		      } else {
		        fn.call(null);
		      }
		      // Prevent ids from leaking
		      exports.clearImmediate(id);
		    }
		  });
		
		  return id;
		};
		
		exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
		  delete immediateIds[id];
		};
		/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2).setImmediate, __webpack_require__(2).clearImmediate));

	/***/ },
	/* 3 */
	/***/ function(module, exports) {

		// shim for using process in browser
		
		var process = module.exports = {};
		
		// cached from whatever global is present so that test runners that stub it
		// don't break things.  But we need to wrap it in a try catch in case it is
		// wrapped in strict mode code which doesn't define any globals.  It's inside a
		// function because try/catches deoptimize in certain engines.
		
		var cachedSetTimeout;
		var cachedClearTimeout;
		
		(function () {
		  try {
		    cachedSetTimeout = setTimeout;
		  } catch (e) {
		    cachedSetTimeout = function () {
		      throw new Error('setTimeout is not defined');
		    };
		  }
		  try {
		    cachedClearTimeout = clearTimeout;
		  } catch (e) {
		    cachedClearTimeout = function () {
		      throw new Error('clearTimeout is not defined');
		    };
		  }
		} ());
		var queue = [];
		var draining = false;
		var currentQueue;
		var queueIndex = -1;
		
		function cleanUpNextTick() {
		    if (!draining || !currentQueue) {
		        return;
		    }
		    draining = false;
		    if (currentQueue.length) {
		        queue = currentQueue.concat(queue);
		    } else {
		        queueIndex = -1;
		    }
		    if (queue.length) {
		        drainQueue();
		    }
		}
		
		function drainQueue() {
		    if (draining) {
		        return;
		    }
		    var timeout = cachedSetTimeout(cleanUpNextTick);
		    draining = true;
		
		    var len = queue.length;
		    while(len) {
		        currentQueue = queue;
		        queue = [];
		        while (++queueIndex < len) {
		            if (currentQueue) {
		                currentQueue[queueIndex].run();
		            }
		        }
		        queueIndex = -1;
		        len = queue.length;
		    }
		    currentQueue = null;
		    draining = false;
		    cachedClearTimeout(timeout);
		}
		
		process.nextTick = function (fun) {
		    var args = new Array(arguments.length - 1);
		    if (arguments.length > 1) {
		        for (var i = 1; i < arguments.length; i++) {
		            args[i - 1] = arguments[i];
		        }
		    }
		    queue.push(new Item(fun, args));
		    if (queue.length === 1 && !draining) {
		        cachedSetTimeout(drainQueue, 0);
		    }
		};
		
		// v8 likes predictible objects
		function Item(fun, array) {
		    this.fun = fun;
		    this.array = array;
		}
		Item.prototype.run = function () {
		    this.fun.apply(null, this.array);
		};
		process.title = 'browser';
		process.browser = true;
		process.env = {};
		process.argv = [];
		process.version = ''; // empty string to avoid regexp issues
		process.versions = {};
		
		function noop() {}
		
		process.on = noop;
		process.addListener = noop;
		process.once = noop;
		process.off = noop;
		process.removeListener = noop;
		process.removeAllListeners = noop;
		process.emit = noop;
		
		process.binding = function (name) {
		    throw new Error('process.binding is not supported');
		};
		
		process.cwd = function () { return '/' };
		process.chdir = function (dir) {
		    throw new Error('process.chdir is not supported');
		};
		process.umask = function() { return 0; };


	/***/ },
	/* 4 */
	/***/ function(module, exports, __webpack_require__) {

		var Utils = __webpack_require__(5);
		
		/**
		 * BaseTransition to extend
		 *
		 * @namespace Barba.BaseTransition
		 * @type {Object}
		 */
		var BaseTransition = {
		  /**
		   * @memberOf Barba.BaseTransition
		   * @type {HTMLElement}
		   */
		  oldContainer: undefined,
		
		  /**
		   * @memberOf Barba.BaseTransition
		   * @type {HTMLElement}
		   */
		  newContainer: undefined,
		
		  /**
		   * @memberOf Barba.BaseTransition
		   * @type {Promise}
		   */
		  newContainerLoading: undefined,
		
		  /**
		   * Helper to extend the object
		   *
		   * @memberOf Barba.BaseTransition
		   * @param  {Object} newObject
		   * @return {Object} newInheritObject
		   */
		  extend: function(obj){
		    return Utils.extend(this, obj);
		  },
		
		  /**
		   * This function is called from Pjax module to initialize
		   * the transition.
		   *
		   * @memberOf Barba.BaseTransition
		   * @private
		   * @param  {HTMLElement} oldContainer
		   * @param  {Promise} newContainer
		   * @return {Promise}
		   */
		  init: function(oldContainer, newContainer) {
		    var _this = this;
		
		    this.oldContainer = oldContainer;
		    this._newContainerPromise = newContainer;
		
		    this.deferred = Utils.deferred();
		    this.newContainerReady = Utils.deferred();
		    this.newContainerLoading = this.newContainerReady.promise;
		
		    this.start();
		
		    this._newContainerPromise.then(function(newContainer) {
		      _this.newContainer = newContainer;
		      _this.newContainerReady.resolve();
		    });
		
		    return this.deferred.promise;
		  },
		
		  /**
		   * This function needs to be called as soon the Transition is finished
		   *
		   * @memberOf Barba.BaseTransition
		   */
		  done: function() {
		    this.oldContainer.parentNode.removeChild(this.oldContainer);
		    this.newContainer.style.visibility = 'visible';
		    this.deferred.resolve();
		  },
		
		  /**
		   * Constructor for your Transition
		   *
		   * @memberOf Barba.BaseTransition
		   * @abstract
		   */
		  start: function() {},
		};
		
		module.exports = BaseTransition;


	/***/ },
	/* 5 */
	/***/ function(module, exports) {

		/**
		 * Just an object with some helpful functions
		 *
		 * @type {Object}
		 * @namespace Barba.Utils
		 */
		var Utils = {
		  /**
		   * Return the current url
		   *
		   * @memberOf Barba.Utils
		   * @return {String} currentUrl
		   */
		  getCurrentUrl: function() {
		    return window.location.protocol + '//' +
		           window.location.host +
		           window.location.pathname +
		           window.location.search;
		  },
		
		  /**
		   * Given an url, return it without the hash
		   *
		   * @memberOf Barba.Utils
		   * @private
		   * @param  {String} url
		   * @return {String} newCleanUrl
		   */
		  cleanLink: function(url) {
		    return url.replace(/#.*/, '');
		  },
		
		  /**
		   * Time in millisecond after the xhr request goes in timeout
		   *
		   * @memberOf Barba.Utils
		   * @type {Number}
		   * @default
		   */
		  xhrTimeout: 5000,
		
		  /**
		   * Start an XMLHttpRequest() and return a Promise
		   *
		   * @memberOf Barba.Utils
		   * @param  {String} url
		   * @return {Promise}
		   */
		  xhr: function(url) {
		    var deferred = this.deferred();
		    var req = new XMLHttpRequest();
		
		    req.onreadystatechange = function() {
		      if (req.readyState === 4) {
		        if (req.status === 200) {
		          return deferred.resolve(req.responseText);
		        } else {
		          return deferred.reject(new Error('xhr: HTTP code is not 200'));
		        }
		      }
		    };
		
		    req.ontimeout = function() {
		      return deferred.reject(new Error('xhr: Timeout exceeded'));
		    };
		
		    req.open('GET', url);
		    req.timeout = this.xhrTimeout;
		    req.setRequestHeader('x-barba', 'yes');
		    req.send();
		
		    return deferred.promise;
		  },
		
		  /**
		   * Get obj and props and return a new object with the property merged
		   *
		   * @memberOf Barba.Utils
		   * @param  {object} obj
		   * @param  {object} props
		   * @return {object}
		   */
		  extend: function(obj, props) {
		    var newObj = Object.create(obj);
		
		    for(var prop in props) {
		      if(props.hasOwnProperty(prop)) {
		        newObj[prop] = props[prop];
		      }
		    }
		
		    return newObj;
		  },
		
		  /**
		   * Return a new "Deferred" object
		   * https://developer.mozilla.org/en-US/docs/Mozilla/JavaScript_code_modules/Promise.jsm/Deferred
		   *
		   * @memberOf Barba.Utils
		   * @return {Deferred}
		   */
		  deferred: function() {
		    return new function() {
		      this.resolve = null;
		      this.reject = null;
		
		      this.promise = new Promise(function(resolve, reject) {
		        this.resolve = resolve;
		        this.reject = reject;
		      }.bind(this));
		    };
		  },
		
		  /**
		   * Return the port number normalized, eventually you can pass a string to be normalized.
		   *
		   * @memberOf Barba.Utils
		   * @private
		   * @param  {String} p
		   * @return {Int} port
		   */
		  getPort: function(p) {
		    var port = typeof p !== 'undefined' ? p : window.location.port;
		    var protocol = window.location.protocol;
		
		    if (port != '')
		      return parseInt(port);
		
		    if (protocol === 'http:')
		      return 80;
		
		    if (protocol === 'https:')
		      return 443;
		  }
		};
		
		module.exports = Utils;


	/***/ },
	/* 6 */
	/***/ function(module, exports, __webpack_require__) {

		var Dispatcher = __webpack_require__(7);
		var Utils = __webpack_require__(5);
		
		/**
		 * BaseView to be extended
		 *
		 * @namespace Barba.BaseView
		 * @type {Object}
		 */
		var BaseView  = {
		  /**
		   * Namespace of the view.
		   * (need to be associated with the data-namespace of the container)
		   *
		   * @memberOf Barba.BaseView
		   * @type {String}
		   */
		  namespace: null,
		
		  /**
		   * Helper to extend the object
		   *
		   * @memberOf Barba.BaseView
		   * @param  {Object} newObject
		   * @return {Object} newInheritObject
		   */
		  extend: function(obj){
		    return Utils.extend(this, obj);
		  },
		
		  /**
		   * Init the view.
		   * P.S. Is suggested to init the view before starting Barba.Pjax.start(),
		   * in this way .onEnter() and .onEnterCompleted() will be fired for the current
		   * container when the page is loaded.
		   *
		   * @memberOf Barba.BaseView
		   */
		  init: function() {
		    var _this = this;
		
		    Dispatcher.on('initStateChange',
		      function(newStatus, oldStatus) {
		        if (oldStatus && oldStatus.namespace === _this.namespace)
		          _this.onLeave();
		      }
		    );
		
		    Dispatcher.on('newPageReady',
		      function(newStatus, oldStatus, container) {
		        _this.container = container;
		
		        if (newStatus.namespace === _this.namespace)
		          _this.onEnter();
		      }
		    );
		
		    Dispatcher.on('transitionCompleted',
		      function(newStatus, oldStatus) {
		        if (newStatus.namespace === _this.namespace)
		          _this.onEnterCompleted();
		
		        if (oldStatus && oldStatus.namespace === _this.namespace)
		          _this.onLeaveCompleted();
		      }
		    );
		  },
		
		 /**
		  * This function will be fired when the container
		  * is ready and attached to the DOM.
		  *
		  * @memberOf Barba.BaseView
		  * @abstract
		  */
		  onEnter: function() {},
		
		  /**
		   * This function will be fired when the transition
		   * to this container has just finished.
		   *
		   * @memberOf Barba.BaseView
		   * @abstract
		   */
		  onEnterCompleted: function() {},
		
		  /**
		   * This function will be fired when the transition
		   * to a new container has just started.
		   *
		   * @memberOf Barba.BaseView
		   * @abstract
		   */
		  onLeave: function() {},
		
		  /**
		   * This function will be fired when the container
		   * has just been removed from the DOM.
		   *
		   * @memberOf Barba.BaseView
		   * @abstract
		   */
		  onLeaveCompleted: function() {}
		};
		
		module.exports = BaseView;


	/***/ },
	/* 7 */
	/***/ function(module, exports) {

		/**
		 * Little Dispatcher inspired by MicroEvent.js
		 *
		 * @namespace Barba.Dispatcher
		 * @type {Object}
		 */
		var Dispatcher = {
		  /**
		   * Object that keeps all the events
		   *
		   * @memberOf Barba.Dispatcher
		   * @readOnly
		   * @type {Object}
		   */
		  events: {},
		
		  /**
		   * Bind a callback to an event
		   *
		   * @memberOf Barba.Dispatcher
		   * @param  {String} eventName
		   * @param  {Function} function
		   */
		  on: function(e, f) {
		    this.events[e] = this.events[e] || [];
		    this.events[e].push(f);
		  },
		
		  /**
		   * Unbind event
		   *
		   * @memberOf Barba.Dispatcher
		   * @param  {String} eventName
		   * @param  {Function} function
		   */
		  off: function(e, f) {
		    if(e in this.events === false)
		      return;
		
		    this.events[e].splice(this.events[e].indexOf(f), 1);
		  },
		
		  /**
		   * Fire the event running all the event associated to it
		   *
		   * @memberOf Barba.Dispatcher
		   * @param  {String} eventName
		   * @param  {...*} args
		   */
		  trigger: function(e) {//e, ...args
		    if (e in this.events === false)
		      return;
		
		    for(var i = 0; i < this.events[e].length; i++){
		      this.events[e][i].apply(this, Array.prototype.slice.call(arguments, 1));
		    }
		  }
		};
		
		module.exports = Dispatcher;


	/***/ },
	/* 8 */
	/***/ function(module, exports, __webpack_require__) {

		var Utils = __webpack_require__(5);
		
		/**
		 * BaseCache it's a simple static cache
		 *
		 * @namespace Barba.BaseCache
		 * @type {Object}
		 */
		var BaseCache = {
		  /**
		   * The Object that keeps all the key value information
		   *
		   * @memberOf Barba.BaseCache
		   * @type {Object}
		   */
		  data: {},
		
		  /**
		   * Helper to extend this object
		   *
		   * @memberOf Barba.BaseCache
		   * @private
		   * @param  {Object} newObject
		   * @return {Object} newInheritObject
		   */
		  extend: function(obj) {
		    return Utils.extend(this, obj);
		  },
		
		  /**
		   * Set a key and value data, mainly Barba is going to save promises
		   *
		   * @memberOf Barba.BaseCache
		   * @param {String} key
		   * @param {*} value
		   */
		  set: function(key, val) {
		    this.data[key] = val;
		  },
		
		  /**
		   * Retrieve the data using the key
		   *
		   * @memberOf Barba.BaseCache
		   * @param  {String} key
		   * @return {*}
		   */
		  get: function(key) {
		    return this.data[key];
		  },
		
		  /**
		   * Flush the cache
		   *
		   * @memberOf Barba.BaseCache
		   */
		  reset: function() {
		    this.data = {};
		  }
		};
		
		module.exports = BaseCache;


	/***/ },
	/* 9 */
	/***/ function(module, exports) {

		/**
		 * HistoryManager helps to keep track of the navigation
		 *
		 * @namespace Barba.HistoryManager
		 * @type {Object}
		 */
		var HistoryManager = {
		  /**
		   * Keep track of the status in historic order
		   *
		   * @memberOf Barba.HistoryManager
		   * @readOnly
		   * @type {Array}
		   */
		  history: [],
		
		  /**
		   * Add a new set of url and namespace
		   *
		   * @memberOf Barba.HistoryManager
		   * @param {String} url
		   * @param {String} namespace
		   * @private
		   */
		  add: function(url, namespace) {
		    if (!namespace)
		      namespace = undefined;
		
		    this.history.push({
		      url: url,
		      namespace: namespace
		    });
		  },
		
		  /**
		   * Return information about the current status
		   *
		   * @memberOf Barba.HistoryManager
		   * @return {Object}
		   */
		  currentStatus: function() {
		    return this.history[this.history.length - 1];
		  },
		
		  /**
		   * Return information about the previous status
		   *
		   * @memberOf Barba.HistoryManager
		   * @return {Object}
		   */
		  prevStatus: function() {
		    var history = this.history;
		
		    if (history.length < 2)
		      return null;
		
		    return history[history.length - 2];
		  }
		};
		
		module.exports = HistoryManager;


	/***/ },
	/* 10 */
	/***/ function(module, exports, __webpack_require__) {

		var Utils = __webpack_require__(5);
		var Dispatcher = __webpack_require__(7);
		var HideShowTransition = __webpack_require__(11);
		var BaseCache = __webpack_require__(8);
		
		var HistoryManager = __webpack_require__(9);
		var Dom = __webpack_require__(12);
		
		/**
		 * Pjax is a static object with main function
		 *
		 * @namespace Barba.Pjax
		 * @borrows Dom as Dom
		 * @type {Object}
		 */
		var Pjax = {
		  Dom: Dom,
		  History: HistoryManager,
		  Cache: BaseCache,
		
		  /**
		   * Indicate wether or not use the cache
		   *
		   * @memberOf Barba.Pjax
		   * @type {Boolean}
		   * @default
		   */
		  cacheEnabled: true,
		
		  /**
		   * Indicate if there is an animation in progress
		   *
		   * @memberOf Barba.Pjax
		   * @readOnly
		   * @type {Boolean}
		   */
		  transitionProgress: false,
		
		  /**
		   * Class name used to ignore links
		   *
		   * @memberOf Barba.Pjax
		   * @type {String}
		   * @default
		   */
		  ignoreClassLink: 'no-barba',
		
		  /**
		   * Function to be called to start Pjax
		   *
		   * @memberOf Barba.Pjax
		   */
		  start: function() {
		    this.init();
		  },
		
		  /**
		   * Init the events
		   *
		   * @memberOf Barba.Pjax
		   * @private
		   */
		  init: function() {
		    var container = this.Dom.getContainer();
		    var wrapper = this.Dom.getWrapper();
		
		    wrapper.setAttribute('aria-live', 'polite');
		
		    this.History.add(
		      this.getCurrentUrl(),
		      this.Dom.getNamespace(container)
		    );
		
		    //Fire for the current view.
		    Dispatcher.trigger('initStateChange', this.History.currentStatus());
		    Dispatcher.trigger('newPageReady',
		      this.History.currentStatus(),
		      {},
		      container,
		      this.Dom.currentHTML
		    );
		    Dispatcher.trigger('transitionCompleted', this.History.currentStatus());
		
		    this.bindEvents();
		  },
		
		  /**
		   * Attach the eventlisteners
		   *
		   * @memberOf Barba.Pjax
		   * @private
		   */
		  bindEvents: function() {
		    document.addEventListener('click',
		      this.onLinkClick.bind(this)
		    );
		
		    window.addEventListener('popstate',
		      this.onStateChange.bind(this)
		    );
		  },
		
		  /**
		   * Return the currentURL cleaned
		   *
		   * @memberOf Barba.Pjax
		   * @return {String} currentUrl
		   */
		  getCurrentUrl: function() {
		    return Utils.cleanLink(
		      Utils.getCurrentUrl()
		    );
		  },
		
		  /**
		   * Change the URL with pushstate and trigger the state change
		   *
		   * @memberOf Barba.Pjax
		   * @param {String} newUrl
		   */
		  goTo: function(url) {
		    window.history.pushState(null, null, url);
		    this.onStateChange();
		  },
		
		  /**
		   * Force the browser to go to a certain url
		   *
		   * @memberOf Barba.Pjax
		   * @param {String} url
		   * @private
		   */
		  forceGoTo: function(url) {
		    window.location = url;
		  },
		
		  /**
		   * Load an url, will start an xhr request or load from the cache
		   *
		   * @memberOf Barba.Pjax
		   * @private
		   * @param  {String} url
		   * @return {Promise}
		   */
		  load: function(url) {
		    var deferred = Utils.deferred();
		    var _this = this;
		    var xhr;
		
		    xhr = this.Cache.get(url);
		
		    if (!xhr) {
		      xhr = Utils.xhr(url);
		      this.Cache.set(url, xhr);
		    }
		
		    xhr.then(
		      function(data) {
		        var container = _this.Dom.parseResponse(data);
		
		        _this.Dom.putContainer(container);
		
		        if (!_this.cacheEnabled)
		          _this.Cache.reset();
		
		        deferred.resolve(container);
		      },
		      function() {
		        //Something went wrong (timeout, 404, 505...)
		        _this.forceGoTo(url);
		
		        deferred.reject();
		      }
		    );
		
		    return deferred.promise;
		  },
		
		  /**
		   * Get the .href parameter out of an element
		   * and handle special cases (like xlink:href)
		   *
		   * @private
		   * @memberOf Barba.Pjax
		   * @param  {HTMLElement} el
		   * @return {String} href
		   */
		  getHref: function(el) {
		    if (!el) {
		      return undefined;
		    }
		
		    if (el.getAttribute && typeof el.getAttribute('xlink:href') === 'string') {
		      return el.getAttribute('xlink:href');
		    }
		
		    if (typeof el.href === 'string') {
		      return el.href;
		    }
		
		    return undefined;
		  },
		
		  /**
		   * Callback called from click event
		   *
		   * @memberOf Barba.Pjax
		   * @private
		   * @param {MouseEvent} evt
		   */
		  onLinkClick: function(evt) {
		    var el = evt.target;
		
		    //Go up in the nodelist until we
		    //find something with an href
		    while (el && !this.getHref(el)) {
		      el = el.parentNode;
		    }
		
		    if (this.preventCheck(evt, el)) {
		      evt.stopPropagation();
		      evt.preventDefault();
		
		      Dispatcher.trigger('linkClicked', el, evt);
		
		      var href = this.getHref(el);
		      this.goTo(href);
		    }
		  },
		
		  /**
		   * Determine if the link should be followed
		   *
		   * @memberOf Barba.Pjax
		   * @param  {MouseEvent} evt
		   * @param  {HTMLElement} element
		   * @return {Boolean}
		   */
		  preventCheck: function(evt, element) {
		    if (!window.history.pushState)
		      return false;
		
		    var href = this.getHref(element);
		
		    //User
		    if (!element || !href)
		      return false;
		
		    //Middle click, cmd click, and ctrl click
		    if (evt.which > 1 || evt.metaKey || evt.ctrlKey || evt.shiftKey || evt.altKey)
		      return false;
		
		    //Ignore target with _blank target
		    if (element.target && element.target === '_blank')
		      return false;
		
		    //Check if it's the same domain
		    if (window.location.protocol !== element.protocol || window.location.hostname !== element.hostname)
		      return false;
		
		    //Check if the port is the same
		    if (Utils.getPort() !== Utils.getPort(element.port))
		      return false;
		
		    //Ignore case when a hash is being tacked on the current URL
		    if (href.indexOf('#') > -1)
		      return false;
		
		    //Ignore case where there is download attribute
		    if (element.getAttribute && typeof element.getAttribute('download') === 'string')
		      return false;
		
		    //In case you're trying to load the same page
		    if (Utils.cleanLink(href) == Utils.cleanLink(location.href))
		      return false;
		
		    if (element.classList.contains(this.ignoreClassLink))
		      return false;
		
		    return true;
		  },
		
		  /**
		   * Return a transition object
		   *
		   * @memberOf Barba.Pjax
		   * @return {Barba.Transition} Transition object
		   */
		  getTransition: function() {
		    //User customizable
		    return HideShowTransition;
		  },
		
		  /**
		   * Method called after a 'popstate' or from .goTo()
		   *
		   * @memberOf Barba.Pjax
		   * @private
		   */
		  onStateChange: function() {
		    var newUrl = this.getCurrentUrl();
		
		    if (this.transitionProgress)
		      this.forceGoTo(newUrl);
		
		    if (this.History.currentStatus().url === newUrl)
		      return false;
		
		    this.History.add(newUrl);
		
		    var newContainer = this.load(newUrl);
		    var transition = Object.create(this.getTransition());
		
		    this.transitionProgress = true;
		
		    Dispatcher.trigger('initStateChange',
		      this.History.currentStatus(),
		      this.History.prevStatus()
		    );
		
		    var transitionInstance = transition.init(
		      this.Dom.getContainer(),
		      newContainer
		    );
		
		    newContainer.then(
		      this.onNewContainerLoaded.bind(this)
		    );
		
		    transitionInstance.then(
		      this.onTransitionEnd.bind(this)
		    );
		  },
		
		  /**
		   * Function called as soon the new container is ready
		   *
		   * @memberOf Barba.Pjax
		   * @private
		   * @param {HTMLElement} container
		   */
		  onNewContainerLoaded: function(container) {
		    var currentStatus = this.History.currentStatus();
		    currentStatus.namespace = this.Dom.getNamespace(container);
		
		    Dispatcher.trigger('newPageReady',
		      this.History.currentStatus(),
		      this.History.prevStatus(),
		      container,
		      this.Dom.currentHTML
		    );
		  },
		
		  /**
		   * Function called as soon the transition is finished
		   *
		   * @memberOf Barba.Pjax
		   * @private
		   */
		  onTransitionEnd: function() {
		    this.transitionProgress = false;
		
		    Dispatcher.trigger('transitionCompleted',
		      this.History.currentStatus(),
		      this.History.prevStatus()
		    );
		  }
		};
		
		module.exports = Pjax;


	/***/ },
	/* 11 */
	/***/ function(module, exports, __webpack_require__) {

		var BaseTransition = __webpack_require__(4);
		
		/**
		 * Basic Transition object, wait for the new Container to be ready,
		 * scroll top, and finish the transition (removing the old container and displaying the new one)
		 *
		 * @private
		 * @namespace Barba.HideShowTransition
		 * @augments Barba.BaseTransition
		 */
		var HideShowTransition = BaseTransition.extend({
		  start: function() {
		    this.newContainerLoading.then(this.finish.bind(this));
		  },
		
		  finish: function() {
		    document.body.scrollTop = 0;
		    this.done();
		  }
		});
		
		module.exports = HideShowTransition;


	/***/ },
	/* 12 */
	/***/ function(module, exports) {

		/**
		 * Object that is going to deal with DOM parsing/manipulation
		 *
		 * @namespace Barba.Pjax.Dom
		 * @type {Object}
		 */
		var Dom = {
		  /**
		   * The name of the data attribute on the container
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @type {String}
		   * @default
		   */
		  dataNamespace: 'namespace',
		
		  /**
		   * Id of the main wrapper
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @type {String}
		   * @default
		   */
		  wrapperId: 'barba-wrapper',
		
		  /**
		   * Class name used to identify the containers
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @type {String}
		   * @default
		   */
		  containerClass: 'barba-container',
		
		  /**
		   * Full HTML String of the current page.
		   * By default is the innerHTML of the initial loaded page.
		   *
		   * Each time a new page is loaded, the value is the response of the xhr call.
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @type {String}
		   */
		  currentHTML: document.documentElement.innerHTML,
		
		  /**
		   * Parse the responseText obtained from the xhr call
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @private
		   * @param  {String} responseText
		   * @return {HTMLElement}
		   */
		  parseResponse: function(responseText) {
		    this.currentHTML = responseText;
		
		    var wrapper = document.createElement('div');
		    wrapper.innerHTML = responseText;
		
		    var titleEl = wrapper.querySelector('title');
		
		    if (titleEl)
		      document.title = titleEl.textContent;
		
		    return this.getContainer(wrapper);
		  },
		
		  /**
		   * Get the main barba wrapper by the ID `wrapperId`
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @return {HTMLElement} element
		   */
		  getWrapper: function() {
		    var wrapper = document.getElementById(this.wrapperId);
		
		    if (!wrapper)
		      throw new Error('Barba.js: wrapper not found!');
		
		    return wrapper;
		  },
		
		  /**
		   * Get the container on the current DOM,
		   * or from an HTMLElement passed via argument
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @private
		   * @param  {HTMLElement} element
		   * @return {HTMLElement}
		   */
		  getContainer: function(element) {
		    if (!element)
		      element = document.body;
		
		    if (!element)
		      throw new Error('Barba.js: DOM not ready!');
		
		    var container = this.parseContainer(element);
		
		    if (container && container.jquery)
		      container = container[0];
		
		    if (!container)
		      throw new Error('Barba.js: no container found');
		
		    return container;
		  },
		
		  /**
		   * Get the namespace of the container
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @private
		   * @param  {HTMLElement} element
		   * @return {String}
		   */
		  getNamespace: function(element) {
		    if (element && element.dataset) {
		      return element.dataset[this.dataNamespace];
		    } else if (element) {
		      return element.getAttribute('data-' + this.dataNamespace);
		    }
		
		    return null;
		  },
		
		  /**
		   * Put the container on the page
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @private
		   * @param  {HTMLElement} element
		   */
		  putContainer: function(element) {
		    element.style.visibility = 'hidden';
		
		    var wrapper = this.getWrapper();
		    wrapper.appendChild(element);
		  },
		
		  /**
		   * Get container selector
		   *
		   * @memberOf Barba.Pjax.Dom
		   * @private
		   * @param  {HTMLElement} element
		   * @return {HTMLElement} element
		   */
		  parseContainer: function(element) {
		    return element.querySelector('.' + this.containerClass);
		  }
		};
		
		module.exports = Dom;


	/***/ },
	/* 13 */
	/***/ function(module, exports, __webpack_require__) {

		var Utils = __webpack_require__(5);
		var Pjax = __webpack_require__(10);
		
		/**
		 * Prefetch
		 *
		 * @namespace Barba.Prefetch
		 * @type {Object}
		 */
		var Prefetch = {
		  /**
		   * Class name used to ignore prefetch on links
		   *
		   * @memberOf Barba.Prefetch
		   * @type {String}
		   * @default
		   */
		  ignoreClassLink: 'no-barba-prefetch',
		
		  /**
		   * Init the event listener on mouseover and touchstart
		   * for the prefetch
		   *
		   * @memberOf Barba.Prefetch
		   */
		  init: function() {
		    if (!window.history.pushState) {
		      return false;
		    }
		
		    document.body.addEventListener('mouseover', this.onLinkEnter.bind(this));
		    document.body.addEventListener('touchstart', this.onLinkEnter.bind(this));
		  },
		
		  /**
		   * Callback for the mousehover/touchstart
		   *
		   * @memberOf Barba.Prefetch
		   * @private
		   * @param  {Object} evt
		   */
		  onLinkEnter: function(evt) {
		    var el = evt.target;
		
		    while (el && !Pjax.getHref(el)) {
		      el = el.parentNode;
		    }
		
		    if (!el || el.classList.contains(this.ignoreClassLink)) {
		      return;
		    }
		
		    var url = Pjax.getHref(el);
		
		    //Check if the link is elegible for Pjax
		    if (Pjax.preventCheck(evt, el) && !Pjax.Cache.get(url)) {
		      var xhr = Utils.xhr(url);
		      Pjax.Cache.set(url, xhr);
		    }
		  }
		};
		
		module.exports = Prefetch;


	/***/ }
	/******/ ])
	});

	});

	/**
	 * Bind a context to some methods.
	 *
	 * @param {*} c The context to bind.
	 * @param {Array} a Array of methods to attach context to.
	 *
	 * @example
	 *
	 * BindAll(this, ['bindFunction1', 'bindFunction2']);
	 *
	 */
	function bindAll(c, a) {

	  a.forEach(function(f) {
	    c[f] = c[f].bind(c);
	  });

	}

	/**
	 * RequestAnimationFrame Interface.
	 *
	 * @param {Function} loop The function to call in a loop.
	 * @example
	 *
	 * const raf = new Raf(loop)
	 * raf.run()
	 * raf.stop()
	 *
	 * const loop = elapsed => console.log(elapsed)
	 */
	function Raf(loop) {
	  /**
	   * The callback to call.
	   * @type {Function}
	   */
	  this.cb = loop;

	  /**
	   * requestAnimationFrame ID
	   * @type {*}
	   */
	  this.r = null;

	  /**
	   * The start time.
	   * @type {*}
	   */
	  this.s = null;

	  /**
	   * Is it the end?
	   * @type {boolean}
	   */
	  this.E = false;

	  /**
	   * Tick
	   * @type {FrameRequestCallback}
	   * @private
	   */
	  this._t = this._t.bind(this);
	}

	/**
	 * Start the loop.
	 */
	Raf.prototype.run = function() {
	  this.E = false;
	  this.s = performance.now();
	  this.r = requestAnimationFrame(this._t);
	};

	/**
	 * Break the loop.
	 */
	Raf.prototype.stop = function() {
	  this.E = true;
	  cancelAnimationFrame(this.r);
	};

	/**
	 * The tick function.
	 * @param {number} t the current time.
	 * @private
	 */
	Raf.prototype._t = function(t) {
	  if (this.E) return;
	  this.cb(t - this.s);
	  this.r = requestAnimationFrame(this._t);
	};

	class C2D {

	  constructor(o) {
	    bindAll(this, ['resize', 'run']);

	    this.el = o.el;
	    this.v = {};
	    // Create the canvas.
	    this.c = new Canvas(o.el);
	    this.rAF = new Raf(this.run);
	  }


	  run() {
	    this.c.render();
	  }


	  off() {
	    this.rAF.stop();
	    this.c.clear();
	    this.removeEvents();
	  }


	  on() {
	    this.resize();
	    this.attachEvents();
	    this.rAF.run();
	  }


	  resize() {
	    this.c.resize(window.innerWidth, window.innerHeight);
	  }


	  attachEvents() {
	    window.addEventListener('resize', this.resize);
	  }


	  removeEvents() {
	    window.removeEventListener('resize', this.resize);
	  }
	}

	function init(app) {
	  const c2d = new C2D({
	    el: document.querySelector('#c2d0'),
	  });
	  return c2d;
	}

	/**
	 * Clamps `number` within the inclusive `lower` and `upper` bounds.
	 *
	 * @param {number} number The number to clamp.
	 * @param {number} lower The lower bound.
	 * @param {number} upper The upper bound.
	 * @returns {number} Returns the clamped number.
	 * @example
	 *
	 * clamp(-10, -5, 5)
	 * // => -5
	 *
	 * clamp(10, -5, 5)
	 * // => 5
	 */
	function clamp(number, lower, upper) {
	  return Math.min(Math.max(number, lower), upper);
	}

	/*
	──────────────────────────────────────────
	──────────────────────────────────────────
	EASE
	──────────────────────────────────────────

	──────────────────────────────────────────
	PROPERTIES
	──────────

	i           In
	o           Out
	io          InOut
	1           Sine
	2           Quad
	3           Cubic
	4           Quart
	5           Quint
	6           Expo

	USAGE
	─────
	const eased = Ease['linear'](multiplier);
	*/

	/**
	 * Ease
	 *
	 * @type {{o1: (function(*): number), linear: (function(*): *), o2: (function(*): number), o3: (function(*): number), o4: (function(*): number), o5: (function(*): number), o6: (function(*): number), i1: (function(*): number), i2: (function(*): number), io1: (function(*): number), i3: (function(*): number), i4: (function(*): number), io3: (function(*): number), i5: (function(*): number), io2: (function(*): number), i6: (function(*): number), io5: (function(*): number), io4: (function(*): number), io6: Ease.io6}}
	 */
	var Ease = {
	  linear: function (t) {
	    return t;
	  },

	  // Sine (Sinusoidal)
	  i1: function (t) {
	    return -Math.cos(t * (Math.PI / 2)) + 1;
	  },
	  o1: function (t) {
	    return Math.sin(t * (Math.PI / 2));
	  },
	  io1: function (t) {
	    return -0.5 * (Math.cos(Math.PI * t) - 1);
	  },

	  // Quadratic (Quad)
	  i2: function (t) {
	    return t * t;
	  },
	  o2: function (t) {
	    return t * (2 - t);
	  },
	  io2: function (t) {
	    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
	  },

	  // Cubic
	  i3: function (t) {
	    return t * t * t;
	  },
	  o3: function (t) {
	    return (--t) * t * t + 1;
	  },
	  io3: function (t) {
	    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
	  },

	  // Quartic (Quart)
	  i4: function (t) {
	    return t * t * t * t;
	  },
	  o4: function (t) {
	    return 1 - (--t) * t * t * t;
	  },
	  io4: function (t) {
	    return t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t;
	  },

	  // Quintic (Quint)
	  i5: function (t) {
	    return t * t * t * t * t;
	  },
	  o5: function (t) {
	    return 1 + (--t) * t * t * t * t;
	  },
	  io5: function (t) {
	    return t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t;
	  },

	  // Exponential (Expo)
	  i6: function (t) {
	    return (t === 0) ? 0 : Math.pow(2, 10 * (t - 1));
	  },
	  o6: function (t) {
	    var OUT_EXPO_CORRECTION = 1.000976;
	    return (t === 1) ? 1 : 1 * OUT_EXPO_CORRECTION * (-Math.pow(2, -10 * t) + 1);
	    // return (t === 1) ? 1 : 1 - Math.pow(2, -10 * t);
	  },
	  io6: function (t) {
	    if (t === 0) return 0;
	    if (t === 1) return 1;
	    if ((t /= 0.5) < 1) return 0.5 * Math.pow(2, 10 * (t - 1));
	    return 0.5 * (-Math.pow(2, -10 * --t) + 2);
	  }
	};

	/**
	 * Array.prototype.forEach custom implementation.
	 * @param {Array} arr
	 * @returns {Function}
	 */
	function forEachIn(arr) {
	  var arrLength = arr.length;
	  return function(fn) {
	    for (var i = 0; i < arrLength; i++) fn(arr[i], i);
	  }
	}

	/**
	 * Linear interpolation
	 *
	 * Interpolates from start to end using the given fraction.
	 *
	 * @param {Number} s The min value.
	 * @param {Number} e The max value.
	 * @param {Number} f The fraction (from 0 to 1)
	 * @returns {Number}
	 * @example
	 *
	 * Lerp(start, end, fraction);
	 */
	function lerp(s, e, f) {
	  return (e - s) * f + s;
	}

	/**
	 * Round
	 *
	 * Round a number with a p precision
	 *
	 * @param {Number} n The number to round.
	 * @param {Number} p The precision (decimal length). Default 2
	 * @returns {number}
	 *
	 * @example
	 *
	 * round(4.323)
	 * // => 4.32
	 *
	 * round(4.323, 0)
	 * // => 4
	 *
	 * round(4.383, 1)
	 * // => 4.4
	 */
	function round(n, p) {
	  var p = (typeof p === 'undefined') ? 100 : Math.pow(10, p);
	  return Math.round(n * p) / p;
	}

	/**
	 * Clone an object.
	 * @param {Object} o
	 * @returns {Object}
	 */
	function clone(o) {
	  var clone = {};
	  for (var p in o) clone[p] = o[p];
	  return clone;
	}

	/**
	 * Extends an object.
	 * @param {Object} o1
	 * @param {Object} o2
	 * @returns {Object}
	 */
	function extend(o1, o2) {
	  var o = clone(o1);
	  for (var p in o2) o[p] = o2.hasOwnProperty(p) ? o2[p] : o1[p];
	  return o;
	}

	/**
	 * @typedef InstanceParams
	 * @type Object
	 * @property {HTMLElement|String|Array} el Determines the elements to animate.
	 * @property {Object} p Define element properties to animate.
	 * @property {Number|Function} d Determine the duration of each animation.
	 * @property {Number|Function} delay Determine the delay of each animation.
	 * @property {String|Function} e Determine the ease of animations.
	 * @property {Function|null} update Set the callback to call on each frame during animations.
	 * @property {Function|null} cb Set the callback to call when animations are done.
	 */
	/** @var {InstanceParams} defaultParams */
	var defaultParams = {
	  d: 1000,
	  e: "io4",
	  delay: 0,
	  update: null,
	  cb: null
	};

	/**
	 * Check if an element is contained inside a given array.
	 * @param {Array} anArray
	 * @param {*} element
	 * @returns {boolean}
	 */
	function arrayContains(anArray, element) {
	  if (Array.isArray(anArray)) {
	    var i = 0;
	    var arrayLength = anArray.length;
	    while (i < arrayLength) {
	      if (element === anArray[i++])
	        return true;
	    }
	  }
	  return false;
	}

	// DOM Helper
	/**
	 * Check if the passed element is a DOM element
	 * @param {Object|HTMLElement|HTMLCollection|NodeList|String} element
	 * @returns {boolean}
	 */
	function isDOM(element) {
	  return element instanceof HTMLElement;
	}

	/**
	 * Check if the passed elements is a collection of DOM Elements.
	 * @param {Object|HTMLElement|HTMLCollection|NodeList|String} element
	 * @returns {boolean}
	 */
	function isDOMList(element) {
	  return (
	    element instanceof NodeList ||
	    element instanceof HTMLCollection
	  );
	}

	/**
	 * Select one or many dom elements (or object)
	 * by passing string or their reference
	 * and returns an array of these ones.
	 *
	 * @param {Array|HTMLElement|NodeList|HTMLCollection|string} elements
	 * @returns {Array}
	 * @see https://developer.mozilla.org/en/docs/Web/API/Element
	 */
	function selectElements(elements) {
	  if (isDOM(elements))
	    return [elements];
	  if (isDOMList(elements))
	    return Array.from(elements);
	  if (Array.isArray(elements))
	    return elements;
	  if (typeof elements === "string")
	    return Array.from(document.querySelectorAll(elements));

	  return [elements];
	}

	/**
	 * Returns a number corresponding to an index.
	 * @param {Number|Function} n The stagger amount.
	 * @param {Number} i The index in the iterable.
	 * @returns {Number} The index's value.
	 */
	function getStaggerValue(n, i) {
	  return (typeof n === "function") ? n(i) : n;
	}

	/**
	 * Parse the easing and return a
	 * function to compute a number according to this easing.
	 *
	 * @param {String|Function} parameter
	 * @returns {Function}
	 * @example
	 * var eased = parseEasing(parameter)(value);
	 */
	function parseEasing(parameter) {
	  return (typeof parameter === 'string') ? Ease[parameter] : parameter;
	}

	/**
	 * Retrieves value and unit from a given string property.
	 * @param {String} property
	 * @returns {[Number|null, String|null]}
	 */
	function parseStringProperty(property) {
	  var value = null;
	  var unit = null;
	  property = "" + property;

	  // Select value.
	  var valueMatches = property.match(/[^a-zA-Z]+/g);
	  if (valueMatches) value = valueMatches[0];
	  // Select unit.
	  var unitMatches = property.match(/[a-zA-Z]+/g);
	  if (unitMatches) unit = unitMatches[0];

	  return [value, unit];
	}

	/**
	 * If the passed unit is defined, returns it
	 * Else try to return a default unit according to passed property.
	 * @param {String} propertyKey
	 * @param {undefined|String} unit
	 * @returns {null|String}
	 */
	function getPropertyUnit(propertyKey, unit) {
	  if (unit) return unit;
	  switch (propertyKey) {
	    case 'translateX':
	    case 'translateY':
	    case 'translateZ':
	      return '%';
	    case 'rotate':
	    case 'rotateX':
	    case 'rotateY':
	    case 'rotateZ':
	      return 'deg';
	    default:
	      return null;
	  }
	}

	/**
	 * Parses given properties.
	 *
	 * Each property is about the start and
	 * the end value.
	 *
	 * We've three ways to create a property
	 *  1. By passing an array —> x: [0, 10, 'unit']
	 *  2. By passing a string –> y: '100px'
	 *  3. By passing a number -> scale: 1
	 *
	 *  At the end, we need to find properties to this form:
	 *  {
	 *    x: {
	 *      s: 0,
	 *      e: 100,
	 *      c: 0,
	 *      o: {
	 *        s: 0,
	 *        e: 100
	 *      }
	 *    }
	 *  }
	 *
	 * @param {Object} p properties to parse.
	 * @returns {Object} A parsed form of animatable properties.
	 */
	function parseProperties(p) {
	  var properties = clone(p);

	  // Transform some properties if needed.
	  if (typeof properties.scale !== "undefined") {
	    properties.scaleX = properties.scale;
	    properties.scaleY = properties.scale;
	    delete properties.scale;
	  }

	  if (typeof properties.rotate !== "undefined") {
	    properties.rotateX = properties.rotate;
	    properties.rotateY = properties.rotate;
	    delete properties.rotate;
	  }

	  if (typeof properties.x !== "undefined") {
	    properties.translateX = properties.x;
	    delete properties.x;
	  }

	  if (typeof properties.y !== "undefined") {
	    properties.translateY = properties.y;
	    delete properties.y;
	  }

	  if (typeof properties.z !== "undefined") {
	    properties.translateZ = properties.z;
	    delete properties.z;
	  }

	  forEachIn(Object.keys(properties))(function(key){
	    var property = properties[key];
	    var isPropertyArray = Array.isArray(property);
	    var parsedStringProperty = parseStringProperty(property);

	    // Retrieve the start and the end value.
	    var start = isPropertyArray ? Number(property[0]) : null;
	    var end = isPropertyArray
	      ? Number(property[1])
	      : typeof property === "string"
	        ? Number(parsedStringProperty[0])
	        : !isNaN(property)
	          ? Number(property)
	          : null;

	    // Retrieve the unit of the value (if needed).
	    var unit = isPropertyArray
	      ? getPropertyUnit(key, property[2])
	      : typeof property === "string"
	        ? parsedStringProperty[1]
	        : getPropertyUnit(key);

	    properties[key] = {
	      s: start,
	      c: start,
	      e: end,
	      u: unit,
	      o: {
	        s: start,
	        e: end
	      }
	    };
	  });

	  return properties;
	}

	/**
	 * Return a translation array from a
	 * string (retrieved from style for example)
	 * @param {String} transformationString
	 * @returns {[x: String, y: String, z: String]}
	 */
	function getTranslationArrayFromString(transformationString) {
	  var translationArray = ["0", "0", "0"];

	  if (transformationString.indexOf('translate3d') !== -1) {
	    var translation = transformationString.match(/translate3d\(([^)]+),([^)]+),([^)]+)\)/);
	    translationArray[0] = translation[1].trim();
	    translationArray[1] = translation[2].trim();
	    translationArray[2] = translation[3].trim();
	  }

	  return translationArray;
	}

	/**
	 * Returns the transform value of an element.
	 * TODO: Convert units when reading values.
	 * @param {HTMLElement|Object} element The animatable element.
	 * @param {String} propertyKey The key name of the property to animate.
	 * @returns {Number}
	 */
	function getElementTransformValue(element, propertyKey) {
	  // Typically we've to try reading
	  // the value from the style attribute first,
	  // if there is no value there, We should call the getComputedStyle then :'(
	  var transformationStyleString = element.style.transform;
	  if (typeof transformationStyleString === "string" && transformationStyleString.length > 0) {
	    // We're reading value from element style attribute.
	    // If we found the property inside the string, we get value.

	    // If it is a translation, we'll
	    // retrieve the value from translate3d prop.
	    if (arrayContains(["translateX", "translateY", "translateZ"], propertyKey)) {
	      if (transformationStyleString.indexOf('translate3d') !== -1) {
	        var translationArray = getTranslationArrayFromString(transformationStyleString);
	        switch (propertyKey) {
	          case "translateX": return parseFloat(translationArray[0]);
	          case "translateY": return parseFloat(translationArray[1]);
	          case "translateZ": return parseFloat(translationArray[2]);
	          default: break;
	        }
	      }
	    }
	    else {
	      var values = transformationStyleString.match(new RegExp(propertyKey + "\(([^)]+)\)"));
	      return Array.isArray(values) && values[1]
	        ? parseStringProperty(values[1].substr(1))[0]
	        : arrayContains(["scale", "scaleX", "scaleY"], propertyKey) ? 1 : 0;
	    }
	  }

	  else {
	    // Let's call getComputedStyle.
	    // the function returns either the string "none"
	    // or the computed transformation in the form of a matrix.
	    //var computedTransformValue = getComputedStyle(element).getPropertyValue("transform");
	    if (arrayContains(["scale", "scaleX", "scaleY"], propertyKey)) return 1;
	  }

	  return 0;
	}

	/**
	 * Get the current
	 * value of the animation property
	 * @param {HTMLElement|Object} element The animatable element.
	 * @param {String} animationType The animation type.
	 * @param {String} propertyKey The key name of the property to animate.
	 * @returns {Number}
	 */
	function getElementPropertyValue(element, animationType, propertyKey) {
	  switch (animationType) {
	    case "transform": return getElementTransformValue(element, propertyKey);
	    case "object": return element[propertyKey] || 0;
	    default: return Number(element.style[propertyKey] || getComputedStyle(element).getPropertyValue(propertyKey));
	  }
	}

	/**
	 * Apply a translation to the element.
	 * @param {HTMLElement} element
	 * @param {String} transformationString
	 * @param {Array} translationArray
	 */
	function applyTheTranslationArray(element, transformationString, translationArray) {
	  var regex = /translate3d\(([^)]+)\)/;
	  var translationString = "translate3d("+translationArray[0]+","+translationArray[1]+","+translationArray[2]+")";

	  element.style.transform =
	    transformationString.indexOf('translate3d') !== -1
	      ? transformationString.replace(regex, translationString)
	      : transformationString + " " + translationString
	  ;
	}

	/**
	 * Set a value to the transformation property.
	 * @param {HTMLElement|Object} element The animatable element.
	 * @param {String} propertyKey The property to set the value.
	 * @param {String} value The value to set.
	 */
	function setElementTransformValue(element, propertyKey, value) {
	  // We're trying to do a transformation.
	  // First of all, we should take the current transformation string.
	  // If the current transformation property key already exist in the string, we just have to replace its value.
	  // Else we create a new string and we add it in the transformation string.
	  var transformationString = element.style.transform;

	  // If we tryng to do a translation, use translate3d rather.
	  if (arrayContains(["translateX", "translateY", "translateZ"], propertyKey)) {
	    // Generate the translation array from the transformation string.
	    var translationArray = getTranslationArrayFromString(transformationString);
	    // Fill out the array with the current values.
	    switch (propertyKey) {
	      case "translateX": translationArray[0] = value; break;
	      case "translateY": translationArray[1] = value; break;
	      case "translateZ": translationArray[2] = value; break;
	      default: break;
	    }
	    // Apply the translation.
	    applyTheTranslationArray(element, transformationString, translationArray);
	  }

	  // We're trying to do other transformation than translation.
	  else {
	    element.style.transform =
	      transformationString.indexOf(propertyKey) !== -1
	        ? transformationString.replace(new RegExp(propertyKey + "\(([^)]+)\)"), propertyKey + "("+value)
	        : transformationString + " " + propertyKey + "("+value+")"
	    ;
	  }
	}

	/**
	 * Set animatable element a value.
	 * @param {HTMLElement|Object} element The animatable element.
	 * @param {String} animationType The animation type.
	 * @param {String} propertyKey The property to set the value.
	 * @param {String} value The value to set.
	 * @param {String} unit The unit of the property.
	 */
	function setElementValue(element, animationType, propertyKey, value, unit) {
	  switch (animationType) {
	    case "object": element[propertyKey] = value;break;
	    case "opacity": element.style["opacity"] = value;break;
	    case "transform":
	      var transformValue = unit ? value+""+unit : value;
	      setElementTransformValue(element, propertyKey, transformValue);
	      break;
	  }
	}

	/**
	 * Detect the animation type from
	 * the animatable property key
	 *
	 * There are three types of animations
	 * 'transform', 'opacity', 'object'
	 *
	 * @param {*} element The animatable element.
	 * @param {String} key The property key.
	 * @returns {String}
	 */
	function getAnimationType(element, key) {
	  if (isDOM(element)) {
	    switch (key) {
	      case 'x':
	      case 'y':
	      case 'translateX':
	      case 'translateY':
	      case 'translateZ':
	      case 'scale':
	      case 'scaleX':
	      case 'scaleY':
	      case 'scaleZ':
	      case 'skew':
	      case 'skewX':
	      case 'skewY':
	      case 'skewZ':
	      case 'rotate':
	      case 'rotateX':
	      case 'rotateY':
	      case 'rotateZ':
	        return 'transform';
	      case 'opacity':
	        return 'opacity';
	    }
	  }

	  return 'object';
	}

	/**
	 * @typedef AnimatableProperty
	 * @type Object
	 * @property {String} n The property name.
	 * @property {{
	 *   s: Number,
	 *   c: Number,
	 *   e: Number,
	 *   o: {s:Number, e:Number}
	 * }} v The property values.
	 */

	/**
	 * @typedef {InstanceParams} AnimationParams
	 * @property {String} type The animation type.
	 */

	/**
	 * @typedef AnimationInstance
	 * @type Object
	 * @property {HTMLElement|Object} el The animatable object.
	 * @property {String} type The animation type.
	 * @property {AnimatableProperty} p Property to animate.
	 * @property {{e: String, d: Number, D: Number}} v Animation variables.
	 */

	/**
	 * Create a new animation instance.
	 *
	 * An animation is responsible of animating
	 * the value of one property of a given element.
	 * @param {AnimationParams} params
	 * @returns {AnimationInstance}
	 */
	function createNewAnimation(params) {
	  var animation = {
	    el: params.el,
	    type: params.type,
	    p: params.p,
	    v: {
	      e: params.e,
	      d: params.d,
	      D: params.delay
	    }
	  };

	  /**
	   * Reset the animation.
	   */
	  animation.reset = function() {
	    // Reset keyframes.
	    animation.p.v.s = animation.p.v.o.s;
	    animation.p.v.e = animation.p.v.o.e;
	    animation.p.v.c = animation.p.v.o.s;
	  };

	  return animation;
	}

	/**
	 * Returns an array of animations according
	 * to the number of animatable elements and their properties.
	 *
	 * First of all, we should select and parse properties.
	 * Then for each property, we should create an animation instance.
	 *
	 * @param {Array} elements animatable elements.
	 * @param {InstanceParams} params
	 * @returns {{l: AnimationInstance[], d: Number}}
	 */
	function generateAnimations(elements, params) {
	  // Since each instance allows to set only the
	  // same properties for all selected elements, that
	  // means that we can parse properties first
	  // before looping through elements.
	  // TODO: Retrieve animation type first
	  // before parsing properties (in order to not translate properties of objects)
	  var properties = parseProperties(params.p);
	  var animations = [];
	  var instanceDuration = 0;
	  forEachIn(elements)(function(element, index) {
	    // For each property of each element,
	    // we create an animation.
	    // EDIT: For more control, I need to group transformation animations into one animation.
	    // But first, let us compute the
	    // duration of the instance.
	    var animationDuration = getStaggerValue(params.d, index);
	    var animationDelay = getStaggerValue(params.delay, index);
	    var animationTotalDuration = animationDelay + animationDuration;
	    instanceDuration =
	      animationTotalDuration > instanceDuration
	      ? animationTotalDuration
	      : instanceDuration;
	    forEachIn(Object.keys(properties))(function(key) {
	      var property = { n: key, v: properties[key] };
	      // Get the animation type.
	      var animationType = getAnimationType(element, key);
	      var parameters = extend(params, {
	        el: element,
	        type: animationType,
	        p: property,
	        d: animationDuration,
	        delay: animationDelay
	      });
	      animations.push(createNewAnimation(parameters));
	    });
	  });

	  return {
	    l: animations,
	    d: instanceDuration
	  };
	}

	/**
	 * @typedef Instance
	 * @type Object
	 * @property {Number} id The instance id.
	 * @property {Number} duration The computed instance duration time.
	 * @property {Boolean} paused
	 * @property {Boolean} completed
	 * @property {Function} play Play the instance animations.
	 * @property {Function} pause Pause the instance animations.
	 * @property {Function} _t
	 */

	var instanceId = 0;
	/**
	 * Creates a new animations manager instance.
	 *
	 * An animation manager runs many animations
	 * according to the number of selected elements
	 * and its animatable properties.
	 *
	 * Typically we should retrieve animatable elements first,
	 * Then for each animatable and for each property, we create an animation instance.
	 * @param {InstanceParams} parameters
	 * @returns {Instance}
	 */
	function createNewInstance(parameters) {
	  var params = extend(defaultParams, parameters);
	  var elements = selectElements(params.el);
	  var animations = generateAnimations(elements, params);

	  return {
	    id: instanceId++,
	    a: animations.l,
	    // Variables.
	    v: {
	      e: params.e,
	      el: elements,
	      cb: params.cb,
	      update: params.update
	    },
	    // Time variables.
	    time: {
	      s: null, // Start
	      e: 0, // Elapsed
	      l: 0, // Last elapsed
	      p: 0, // Progress
	      t: animations.d // Total
	    }
	  };
	}
	/** @var {Instance[]} */
	var runningInstances = [];
	var runningInstancesLength = 0;
	var raf;

	/**
	 * Add an instance to running list
	 * @param {Instance} instance
	 */
	function addInstanceToRunningList(instance) {
	  runningInstances.push(instance);
	  runningInstancesLength = runningInstances.length;
	}

	/**
	 * Remove an instance from the running list.
	 * @param {Instance|Number} instance
	 */
	function removeInstanceFromRunningList(instance) {
	  runningInstances.splice(instance, 1);
	  runningInstancesLength = runningInstances.length;
	}

	// Core
	// The Engine.
	var runLoop = (function() {

	  function play() {
	    raf = requestAnimationFrame(step);
	  }

	  function step() {
	    if (runningInstancesLength) {
	      for (var i=0; i<runningInstancesLength; i++) {
	        /**
	         * Run the instance only when it is
	         * not paused and not completed.
	         * Else remove it from the running list.
	         */
	        var runningInstance = runningInstances[i];
	        if (!runningInstance.paused && !runningInstance.completed) {
	          runningInstance._t();
	        } else {
	          removeInstanceFromRunningList(i);
	        }
	      }
	      play();
	    } else {
	      raf = cancelAnimationFrame(raf);
	    }
	  }

	  return play;
	})();

	/**
	 * Creates a new instance.
	 *
	 * Each instance generates animations
	 * and knows all about them.
	 * @param {InstanceParams} params
	 * @returns {Instance}
	 */
	function animate(params) {
	  var instance = createNewInstance(params);

	  /**
	   * Attach the duration property that
	   * exposes the real duration of the instance.
	   * var totalDuration = instance.duration;
	   */
	  Object.defineProperty(instance,
	    'duration', {
	    get: function () {
	      return instance.time.t
	    }
	  });

	  /**
	   * Set Animations Progress
	   * For each animation of the instance, calculate the
	   * progress then set the progress value.
	   * @param {Number} time The instance time.
	   */
	  function setAnimationsProgress(time) {
	    forEachIn(instance.a)(function(animation) {
	      var delay = animation.v.D;
	      var duration = animation.v.d;
	      var easing = animation.v.e;
	      var startTime = delay;
	      var stopTime = delay + duration;
	      // Start the computation only
	      // after the delay
	      if (time >= startTime && time <= stopTime) {
	        var elapsed = clamp(Number(time - startTime), 0, duration);
	        var progress = Number(elapsed / duration).toFixed(4);
	        var eased = parseEasing(easing)(progress);
	        // Compute the property current value
	        // from the progress by using the start and the end values.
	        // If the start value is null, that means that we've to retrieve it
	        // from CSS.
	        animation.p.v.s =
	          animation.p.v.s !== null
	            ? Number(animation.p.v.s)
	            : getElementPropertyValue(
	              animation.el,
	              animation.type,
	              animation.p.n
	            );
	        var startValue = animation.p.v.s;
	        var endValue = animation.p.v.e;
	        animation.p.v.c = round(lerp(startValue, endValue, eased), 3);
	        // Set animation value.
	        setElementValue(animation.el, animation.type, animation.p.n, animation.p.v.c, animation.p.v.u);
	      }
	    });
	  }

	  /**
	   * Reset the instance time.
	   */
	  function resetTime() {
	    instance.time.s = null;
	    instance.time.e = 0;
	    instance.time.l = 0;
	    instance.time.p = 0;
	  }

	  /**
	   * Freeze the animation time.
	   */
	  function freezeTime() {
	    instance.time.s = null;
	    instance.time.l = instance.time.e;
	  }

	  /**
	   * Compute and return the elapsed time.
	   * @returns {Number}
	   */
	  function getTheInstanceElapsedTime() {
	    // Get the last elapsed
	    // time (store when we pause the instance for example)
	    var lastElapsed = instance.time.l;
	    // Compute the current elapsed time.
	    var elapsed = performance.now() - instance.time.s;
	    // The new elapsed time is
	    // the accumulation of all the previous elapsed time.
	    return Number(lastElapsed + elapsed);
	  }

	  /**
	   * Tick
	   * @private
	   */
	  instance._t = function() {
	    // 1. Calculate the progress.
	    instance.time.s = (instance.time.s === null) ? performance.now() : instance.time.s;
	    instance.time.e = clamp(getTheInstanceElapsedTime(), 0, instance.time.t);
	    instance.time.p = Number(instance.time.e / instance.time.t);
	    var eased = parseEasing(instance.v.e)(instance.time.p);

	    // 2. Run all its animations.
	    setAnimationsProgress(instance.time.e);

	    // 3. Call the update callback.
	    instance.v.update &&
	      instance.v.update(eased, instance.time.e, instance.time.t);

	    // 4. Pause the instance when we've done.
	    if (instance.time.p >= 1) {
	      instance.paused = true;
	      instance.completed = true;
	      instance.v.cb && instance.v.cb();
	    }
	  };

	  /**
	   * Reset animations.
	   */
	  instance.reset = function() {
	    instance.paused = true;
	    instance.completed = false;
	    resetTime();
	    // Reset animation keyframes.
	    var animations = instance.a;
	    var animationLength = animations.length;
	    for (var i=0; i<animationLength; i++) animations[i].reset();
	  };

	  /**
	   * Start running the animations.
	   */
	  instance.play = function() {
	    if (!instance.paused) return;
	    if (instance.completed) instance.reset();
	    instance.paused = false;

	    addInstanceToRunningList(this);
	    if (!raf) runLoop();
	  };

	  /**
	   * Pause an instance.
	   * Typically we should freeze the time then
	   * we have to remove the instance from runningInstances list.
	   */
	  instance.pause = function() {
	    instance.paused = true;
	    freezeTime();
	  };

	  /**
	   * Stop animations.
	   */
	  instance.stop = function() {
	    instance.pause();
	    instance.reset();
	  };

	  instance.reset();
	  return instance;
	}

	/**
	 * Returns a function that, as long as it is called,
	 * it run only once every N milliseconds.
	 *
	 * @param {Function} func The function to control
	 * @param {Number} wait The number of milliseconds to wait before to run the func function.
	 * @param {}
	 * @param {*?} context The context in which to run func() (default value is `this`)
	 *
	 *  - leading (optionnel) : Appeler également func() à la première
	 *                          invocation (Faux par défaut)
	 *  - trailing (optionnel) : Appeler également func() à la dernière
	 *                           invocation (Faux par défaut)
	 *  - context (optionnel) : le contexte dans lequel appeler func()
	 *                          (this par défaut)
	 */
	function throttle(func, wait, leading, trailing, context) {
	  var ctx, args, result;
	  var timeout = null;
	  var previous = 0;

	  var later = function() {
	    previous = new Date;
	    timeout = null;
	    result = func.apply(ctx, args);
	  };

	  return function() {
	    var now = new Date;
	    if (!previous && !leading) previous = now;
	    var remaining = wait - (now - previous);
	    ctx = context || this;
	    args = arguments;
	    // Si la période d'attente est écoulée
	    if (remaining <= 0) {
	      // Réinitialiser les compteurs
	      clearTimeout(timeout);
	      timeout = null;
	      // Enregistrer le moment du dernier appel
	      previous = now;
	      // Appeler la fonction
	      result = func.apply(ctx, args);
	    } else if (!timeout && trailing) {
	      // Sinon on s’endort pendant le temps restant
	      timeout = setTimeout(later, remaining);
	    }
	    return result;
	  };
	}

	// eslint-disable-next-line max-classes-per-file

	class Cursor extends Renderable {
	  constructor(p) {
	    super(p);
	    bindAll(this, ['onMove', 'onMouseDown', 'onMouseUp', 'onHover']);

	    // The cursor position.
	    this.p = {
	      x: {
	        l: null, // Last value.
	        c: 0, // Current value.
	        t: 0, // Target value.
	      },
	      y: {
	        l: null, // last value.
	        c: 0, // Current value.
	        t: 0, // Target value.
	      },
	      // Velocity
	      speed: {
	        t: 0, // Ticking
	        x: 0, // Value on X.
	        y: 0, // Value on Y.
	        m: 20, // Max value
	      },
	    };

	    // The cursor size.
	    this.s = {
	      v: 42,
	      s: 0,
	    };

	    this.radius = 21;
	    // this.color = '#707070';
	    this.color = '#ca2d18';
	    this.drawn = {
	      value: 1,
	    };

	    this.setup();

	    // Variables.
	    this.v = {
	      initialized: false,
	    };

	    this.frame = {
	      radius: this.radius,
	      color: this.color,
	      // Deformation.
	      d: {
	        a: 0, // Rotation angle.
	        v: 0, // Deformation value.
	      },
	    };

	    // Hovering variables.
	    this.h = {
	      l: null, // last hovered links.
	      t: throttle(el => this.checkCursorState(el), 100, false, true, this), // Throttle function.
	    };

	    const animationParams = { el: this.s, d: 1000, e: 'o6' };
	    this.onHoverLinkAnimation = animate({ ...animationParams, p: { s: 0.6 } });
	    this.onLeaveLinkAnimation = animate({ ...animationParams, p: { s: 1 } });
	    this.onMouseUpAnimation = animate({ ...animationParams, p: { s: 1 } });
	    this.onMouseDownAnimation = animate({ ...animationParams, p: { s: 0.5 } });
	  }

	  /**
	   *
	   * @param {CanvasRenderingContext2D} c a canvas context.
	   */
	  render(c) {
	    if (this.v.initialized === false) return;

	    // Compute variables.
	    this.p.x.c = lerp(this.p.x.c, this.p.x.t, 0.2);
	    this.p.y.c = lerp(this.p.y.c, this.p.y.t, 0.2);

	    // Compute the cursor transformation.
	    this.radius = this.s.s * (this.s.v / 2);

	    // Draw elements.
	    this.drawFrame(c);
	    this.drawKernel(c);
	  }

	  /**
	   * Draw the Cursor Frame .
	   *
	   * @param {*} c
	   */
	  drawFrame(c) {
	    c.save();

	    // Compute frame deformation.
	    const amplitude = 1 + (this.frame.d.v / this.p.speed.m);
	    // const dpr = window.devicePixelRatio || 1;
	    const X = this.p.x.c;
	    const Y = this.p.y.c;

	    c.translate(X, Y);
	    c.rotate(this.frame.d.a);
	    c.scale(amplitude, 1);

	    c.beginPath();
	    c.arc(0, 0, this.radius, 0, (2 * this.drawn.value) * Math.PI, false);
	    c.lineWidth = 0.3;
	    c.strokeStyle = this.color;
	    c.stroke();
	    c.closePath();

	    c.restore();
	  }

	  /**
	   * Draw the cursor Kernel.
	   *
	   * @param {*} c
	   */
	  drawKernel(c) {
	    c.beginPath();
	    c.arc(this.p.x.t, this.p.y.t, this.radius / 3, Math.PI * 2, false);
	    c.closePath();
	    c.fillStyle = '#ca2d18';
	    c.fill();
	  }

	  setup() {
	    this.addEvents();
	  }

	  init() {
	    animate({
	      el: this.s,
	      d: 1000,
	      e: 'o6',
	      p: { s: 1 },
	    }).play();

	    this.v.initialized = true;
	  }

	  checkLinkHovering(el) {
	    this.h.l = null;

	    // eslint-disable-next-line no-param-reassign
	    while (el && !el.href) el = el.parentNode;

	    if (el) {
	      this.h.l = el;
	      this.onHoverLinkAnimation.play();
	    } else {
	      this.onLeaveLinkAnimation.play();
	      this.h.l = null;
	    }
	  }

	  checkCursorState(el) {
	    // Check the hover state.
	    if (this.s.s > 1) {
	      this.checkLinkHovering(el);
	    }
	  }

	  onMove(e) {
	    this.p.x.t = e.pageX;
	    this.p.y.t = e.pageY;
	    this.p.x.c = (!this.v.initialized) ? e.pageX : this.p.x.c;
	    this.p.y.c = (!this.v.initialized) ? e.pageY : this.p.y.c;

	    const clear = () => {
	      this.p.x.l = null;
	      this.p.y.l = null;
	      this.p.speed.x = 0;
	      this.p.speed.y = 0;
	      this.frame.d.a = 0;
	      this.frame.d.v = 0;
	    };

	    if (this.p.x.l != null) this.p.speed.x = this.p.x.t - this.p.x.l;
	    if (this.p.y.l != null) this.p.speed.y = this.p.y.t - this.p.y.l;
	    if (this.p.x.l != null && this.p.y.l != null) {
	      // Get the movement angle (Radian).
	      this.frame.d.a = Math.atan2(this.p.speed.y, this.p.speed.x);
	      // Clamp the velocity value.
	      this.p.speed.x = clamp(Math.abs(this.p.speed.x), 0, this.p.speed.m);
	      this.p.speed.y = clamp(Math.abs(this.p.speed.y), 0, this.p.speed.m);
	      // Compute the deformation amount.
	      this.frame.d.v = Math.sqrt((this.p.speed.y ** 2) + (this.p.speed.x ** 2));
	    }

	    this.p.x.l = this.p.x.t;
	    this.p.y.l = this.p.y.t;
	    // eslint-disable-next-line no-unused-expressions
	    this.p.speed.t && clearTimeout(this.p.speed.t);
	    this.p.speed.t = setTimeout(clear, 30);

	    this.h.t(e.target);

	    if (this.v.initialized === false) this.init();
	  }

	  onMouseDown() {
	    this.onMouseDownAnimation.play();
	  }

	  onMouseUp() {
	    this.onMouseUpAnimation.play();
	  }

	  onHover(e) {
	    this.checkLinkHovering(e.target);
	  }

	  addEvents() {
	    window.addEventListener('mousemove', this.onMove);
	    window.addEventListener('mousedown', this.onMouseDown);
	    window.addEventListener('mouseup', this.onMouseUp);
	    document.body.addEventListener('mouseover', this.onHover);
	  }
	}

	function init$1(app) {
	  const cursorCanvas = new C2D({
	    el: document.querySelector('#c2d1'),
	  });

	  // Add the custom cursor
	  // only if there's a mouse.
	  if (app.d.hasMouse) {
	    const cursor = new Cursor({}, app);
	    cursorCanvas.c.add(cursor);
	  }

	  return cursorCanvas;
	}

	/* eslint-disable no-use-before-define */

	/**
	 * Resize WebGL Renderer
	 * @param {WebGLRenderer} renderer
	 * @return boolean
	 */
	function resizeRendererToDisplaySize(renderer) {
	  const canvas = renderer.domElement;
	  const width = canvas.clientWidth;
	  const height = canvas.clientHeight;
	  const needResize = canvas.width !== width || canvas.height !== height;
	  if (needResize) {
	    renderer.setSize(width, height, false);
	    renderer.setPixelRatio(window.devicePixelRatio);
	  }
	  return needResize;
	}

	/**
	 * Initialize the module.
	 * @param {{canvas: HTMLElement}} params
	 */
	function initializeGL(params) {
	  const sceneElements = [];
	  const rAF = new Raf(render);
	  const { canvas } = params;
	  const renderer = new three.WebGLRenderer({
	    canvas,
	    alpha: true,
	    antialias: true,
	  });

	  function render() {
	    resizeRendererToDisplaySize(renderer);

	    renderer.setScissorTest(false);
	    renderer.clear(false, true);
	    renderer.setScissorTest(true);

	    // Render scenes.
	    forEachIn(sceneElements)(scene => {
	      if (scene.needRender()) scene.render(renderer, canvas.clientWidth, canvas.clientHeight);
	    });
	  }

	  /**
	   * Turn on the module.
	   */
	  function turnOn() {
	    // Start running the update loop.
	    rAF.run();
	  }

	  /**
	   * Turn off the module.
	   */
	  function turnOff() {
	    // Stop the loop.
	    rAF.stop();
	  }

	  /**
	   * Add a scene to render.
	   * @param {{needRender: Function, render: Function}} scene
	   */
	  function add(scene) {
	    sceneElements.push(scene);
	  }

	  /**
	   * Add a scene (at the top) to render.
	   * @param {{needRender: Function, render: Function}} scene
	   */
	  function prepend(scene) {
	    sceneElements.unshift(scene);
	  }

	  /**
	   * Remove a scene from rendering loop.
	   * @param {{needRender: Function, render: Function}} scene
	   */
	  function remove(scene) {
	    sceneElements.splice(scene, 1);
	  }

	  return {
	    renderer,
	    on: turnOn,
	    off: turnOff,
	    add,
	    prepend,
	    remove,
	  };
	}

	/* eslint-disable no-unused-vars */

	function init$2(app) {
	  return initializeGL({
	    canvas: document.querySelector('#gl'),
	  });
	}

	/**
	 * Timelines are useful to stagger a set animations.
	 * @license see /LICENSE
	 */

	/**
	 * @typedef AnimationInstance
	 * @type Object
	 * @property {Function} play Run the animation instance.
	 * @property {Function} pause Pause the animation instance.
	 * @property {Function} stop Stop the animation instance.
	 * @property {Number} duration The duration of the animation instance.
	 * @see animate.js
	 */

	/**
	 * @typedef TimelineTime
	 * @type Object
	 * @property {Number|null} s The start time of the timeline.
	 * @property {Number} e The elapsed time of the timeline.
	 * @property {Number} t The total time of the timeline.
	 * @property {Number} l The last frozen time.
	 * @property {Number} p The progression amount.
	 */

	/**
	 * @typedef TimelineState
	 * @type Object
	 * @property {Boolean} paused The timeline is paused or not.
	 * @property {Boolean} running The timeline is running or not.
	 * @property {Boolean} completed The timeline is completed or not.
	 */

	/**
	 * @typedef TimelineParameters
	 * @type Object
	 * @property {Number|null} delay Determines the delay before the timeline starts running animations.
	 * @property {Function|null} update Defines a function invoked on every frame of the timeline.
	 * @property {Function|null} cb Defines a function invoked at the end of the timeline.
	 */

	/**
	 * @typedef TimelineQueueElement
	 * @type Object
	 * @property {AnimationInstance} i The animation instance.
	 * @property {Number} s The start time in the queue.
	 * @property {Number} e The end time in the queue.
	 */

	/**
	 * Pause or Stop the timeline animations.
	 * @param {[TimelineQueueElement]} queueElements
	 * @param {Boolean} reset Reset animations after pause.
	 */
	function pauseTimelineAnimations(queueElements, reset) {
	  forEachIn(queueElements)(function(element) {
	    var animation = element.i;
	    if (reset) animation.stop();
	    else animation.pause();
	  });
	}

	/**
	 * Run animations that are ready.
	 * @param {[TimelineQueueElement]} queue
	 * @param {Number} time
	 */
	function runTimelineAnimationsAtTime(queue, time) {
	  if (0 > time) return;
	  forEachIn(queue)(function(element) {
	    var animation = element.i;
	    var startTime = element.s;
	    var endTime = element.e;
	    if (startTime <= time && time < endTime) animation.play();
	  });
	}

	/**
	 * Determine where to place the animation in the timeline.
	 * We place an animation in the
	 * timeline either absolutely or relatively.
	 * @param {[TimelineQueueElement]} queue
	 * @param {String|Number=} offset
	 * @returns {Number}
	 */
	function computeAnimationStartTimeInTimeline(queue, offset) {
	  var queueLength = queue.length;
	  var o = ( queueLength <= 0 ) ? 0
	    : (typeof offset === 'undefined') ? '+=0' : offset;

	  // If it is an absolute placement.
	  if (typeof o === 'number') return Math.abs(o);

	  // It is a relative placement.
	  var offsetOperators = o.split('=');
	  if (offsetOperators.length !== 2 ) return 0;
	  var operationValue = parseInt(offsetOperators[1]);
	  var previousElementEndTime = queue[queueLength - 1].e;
	  return (offsetOperators[0] === '-')
	    ? Math.max(0, previousElementEndTime - operationValue)
	    : previousElementEndTime + operationValue;
	}

	/**
	 * Compute and return the elapsed time.
	 * @param {TimelineTime} time
	 * @returns {Number}
	 */
	function getTimelineElapsedTime(time, delay) {
	  // Get the last elapsed
	  // time (store when we pause the instance for example)
	  var lastElapsed = time.l;
	  // Compute the current elapsed time.
	  var elapsed = performance.now() - time.s;
	  // The new elapsed time is
	  // the accumulation of all the previous elapsed time.
	  return Math.floor(Number(lastElapsed + elapsed)) - Number(delay);
	}

	/**
	 * Generate a timeline queue element.
	 * @param {AnimationInstance} animation The animation instance.
	 * @param {Number} start The start time in the queue.
	 * @param {Number} end The end time in the queue.
	 */
	function generateTimelineQueueElement(animation, start, end) {
	  return { i: animation, s: start, e: end };
	}

	/**
	 * @type {TimelineParameters}
	 */
	var defaultTimelineParameters = {
	  cb: null,
	  delay: 0,
	  update: null
	};

	/**
	 * Timeline instance.
	 * @param {TimelineParameters=} params The timeline parameters.
	 */
	function Timeline(params) {
	  /**
	   * Timeline Parameters
	   * @type {TimelineParameters}
	   * @private
	   */
	  this._p = extend(defaultTimelineParameters, params);

	  /**
	   * Timeline Queue
	   * @type {[TimelineQueueElement]}
	   * @private
	   */
	  this._q = [];

	  /**
	   * Timeline Time
	   * @type {TimelineTime}
	   * @private
	   */
	  this._t = {};

	  /**
	   * Timeline State
	   * @type {TimelineState}
	   * @private
	   */
	  this._s = {};

	  /**
	   * requestAnimationFrame ID.
	   * @type {Integer=}
	   * @private
	   */
	  this._r = null;

	  // Define the
	  // duration property.
	  Object.defineProperty(this, 'duration', {
	    get: function() {
	      return Number(this._t.t);
	    }
	  });

	  this._tick = this._tick.bind(this);
	  this._resetState();
	  this._resetTime();
	 }

	Timeline.prototype = {
	  /**
	   * Add an animation to the timeline.
	   * @param {AnimationInstance} animation
	   * @param {String|Number=} offset Offset of the animation.
	   * @returns {this}
	   */
	  add: function(animation, offset) {
	    // Process
	    // Compute the start time
	    // Compute the end time.
	    // Compute the timeline total time.
	    // Add animation to the queue.

	    var startTime = computeAnimationStartTimeInTimeline(this._q, offset);
	    var endTime = Number(startTime + animation.duration);
	    // If the current end
	    // time, is higher than the
	    // total timeline time, then this value
	    // is the new total time.
	    this._t.t = (endTime > this._t.t) ? endTime : this._t.t;
	    this._q.push(generateTimelineQueueElement(animation, startTime, endTime));
	    return this;
	  },

	  /**
	   * Play the timeline.
	   * @param {TimelineParameters=} params The timeline parameters.
	   */
	  play: function(params) {
	    if (!this._s.paused || this._s.running) return;
	    // Process (only if paused and not running)
	    // Set (Override) timeline parameters.
	    // Run the loop.
	    // Set the timeline state to running.

	    this._p = (typeof params === 'object') ? extend(this._p, params) : this._p;
	    this._s.running = true;
	    this._s.paused = false;
	    this._s.completed = false;
	    this._r = requestAnimationFrame(this._tick);
	  },

	  /**
	   * Pause the timeline.
	   */
	  pause: function() {
	    if (!this._s.running) return;
	    // Process (only if running)
	    // Pause all running animations.
	    // Freeze the timeline time.
	    // Set the timeline state to paused.

	    pauseTimelineAnimations(this._q, false);
	    this._s.paused = true;
	    this._s.running = false;
	    this._freezeTime();
	  },

	  /**
	   * Stop the timeline.
	   */
	  stop: function() {
	    // Process
	    // Stop all animations (running or not).
	    // Reset the timeline time.
	    // Reset the state (paused, not completed and not running).

	    pauseTimelineAnimations(this._q, true);
	    this._resetTime();
	    this._resetState();
	  },

	  /**
	   * The timeline loop.
	   * @private
	   */
	  _tick: function() {
	    // Process
	    // Check the timeline status
	    // If needed, break the loop. Else
	    // Run the timeline loop.

	    // Run the loop only
	    // when running, not paused and not completed.
	    if ( this._s.running
	      && !this._s.paused
	      && !this._s.completed ) this._runLoop();
	    else this._r = cancelAnimationFrame(this._tick);
	  },

	  /**
	   * Run the timeline loop.
	   * @private
	   */
	  _runLoop: function() {
	    // Process
	    // Set the timeline time (progression).
	    // Play ready animations.
	    // Check the end of the timeline.
	    this._setTime();
	    runTimelineAnimationsAtTime(this._q, this._t.e);
	    if (this._p.update && this._t.e > 0) this._p.update(this._t.p, this._t.e, this._t.t);
	    if (this._t.p >= 1) this._setTheEnd();

	    // Maintain the loop.
	    this._r = requestAnimationFrame(this._tick);
	  },

	  /**
	   * When the timeline reach the end,
	   * we have a lot of things to do.
	   * @private
	   */
	  _setTheEnd: function() {
	    // Process
	    // Set completed state
	    // Reset animations
	    // Reset time
	    // Call callback

	    this._s.completed = true;
	    this._s.paused = true;
	    this._s.running = false;
	    pauseTimelineAnimations(this._q, true);
	    this._resetTime();
	    this._p.cb && this._p.cb();
	  },

	  /**
	   * Set the current
	   * time on each loop call.
	   * @private
	   */
	  _setTime: function() {
	    this._t.s = (this._t.s === null) ? performance.now() : this._t.s;
	    this._t.e = getTimelineElapsedTime(this._t, this._p.delay);
	    this._t.p = Number(clamp(this._t.e, 0, this._t.t) / this._t.t);
	  },

	  /**
	   * Reset the timeline state.
	   * @private
	   */
	  _resetState: function() {
	    this._s.paused = true;
	    this._s.completed = false;
	    this._s.running = false;
	  },

	  /**
	   * Reset the timeline time.
	   * @private
	   */
	  _resetTime: function() {
	    this._t.s = null;
	    this._t.e = 0;
	    this._t.l = 0;
	    this._t.p = 0;
	    this._t.t = (this._t.t > 0) ? this._t.t : 0;
	  },

	  /**
	   * Freeze the timeline time.
	   * @private
	   */
	  _freezeTime: function() {
	    this._t.s = null;
	    this._t.l = this._t.e;
	  }
	};

	/* eslint-disable object-curly-newline */


	/**
	 * The container width is the highest width of its elements.
	 * @param {*} container
	 * @param {*} items
	 */
	function fixContainerWidth(container, items) {
	  let containerWidth = 0;
	  forEachIn(Array.from(items))(item => {
	    const { width } = item.getBoundingClientRect();
	    if (width > containerWidth) containerWidth = width;
	    item.parentNode.style.position = 'absolute';
	  });

	  container.style.width = `${containerWidth + 10}px`;
	}

	// function createNode(html) {
	//   return new DOMParser().parseFromString(html, 'text/html').body.firstChild;
	// }

	function reverseArray(arr) {
	  const newArr = [];
	  const { length } = arr;
	  // eslint-disable-next-line no-plusplus
	  for (let i = length - 1; i >= 0; i--) newArr.push(arr[i]);
	  return newArr;
	}

	/**
	 * Split text inside an element.
	 */
	function splitText(element) {
	  let html = '';
	  const txt = element.innerText;
	  const chars = txt.split('');

	  // Generate a html content.
	  forEachIn(chars)(char => {
	    html += (char === ' ') ? '&nbsp;' : `<span class="js-letter">${char}</span>`;
	  });

	  // Insert the generated html.
	  element.innerHTML = html;
	}

	/**
	 * Split all texts of our slider.
	 * @param {*} brand
	 * @param {*} services
	 */
	function splitTexts(brand, services) {
	  // Split brand name text.
	  splitText(brand);

	  // Split services text.
	  forEachIn(Array.from(services))(item => splitText(item));
	}

	/**
	 * Create a new explorer instance.
	 * @param {Object} params
	 * @returns MenuExplorerInstance
	 */
	function createNewInstance$1(params) {
	  // Get parameters.
	  let initialized;
	  let interrupted;
	  let brandTimeline;
	  let servicesTimeline;
	  let exitTimeline;
	  let entranceTimeline;
	  const {
	    container,
	    brandName,
	    servicesItems,
	  } = params;
	  const servicesContainer = document.querySelector('#loader-txt-services');

	  function runEntranceAnimation() {
	    if (exitTimeline) exitTimeline.pause();
	    if (entranceTimeline) {
	      entranceTimeline.stop();
	      entranceTimeline.play();
	    }
	  }

	  function runExitAnimation() {
	    if (entranceTimeline) entranceTimeline.pause();
	    if (exitTimeline) {
	      exitTimeline.stop();
	      exitTimeline.play();
	    }
	  }

	  function generateAnimations() {
	    /**
	     * Entrance animation.
	     * --------------------------------
	     */
	    brandTimeline = new Timeline();
	    servicesTimeline = new Timeline({ cb: () => {
	      servicesTimeline.stop();
	      servicesTimeline.play();
	    } });
	    entranceTimeline = new Timeline();
	    exitTimeline = new Timeline();

	    const allLetters = document.querySelectorAll('#loader .js-letter');
	    const brandLetters = brandName.querySelectorAll('.js-letter');

	    // Pre-animation dispositions.
	    // eslint-disable-next-line no-return-assign
	    forEachIn(Array.from(allLetters))(letter => letter.style.transform = 'translate3d(0,120%,0)');
	    brandName.style.transform = 'translate3d(100%,0,0)';

	    // Stagger the animations.
	    brandTimeline
	      .add(animate({ el: brandLetters, d: 800, delay: i => i * 35, p: { y: [120, 0], scale: [0, 1] } }))
	      .add(animate({ el: brandName, e: 'o3', p: { x: 0 } }), '+=100');

	    forEachIn(Array.from(servicesItems))((service, index) => {
	      const letters = Array.from(service.querySelectorAll('.js-letter'));
	      const reversedLetters = reverseArray(letters);
	      const exitDuration = 600;
	      const delay = index === 0 ? 0 : -1 * ((exitDuration / 2) + 350);

	      servicesTimeline
	        .add(animate({ el: letters, d: 600, delay: i => i * 35, p: { y: [120, 0] } }), delay)
	        .add(animate({ el: reversedLetters, d: exitDuration, delay: i => i * 50, p: { y: [0, -120] } }));
	    });

	    entranceTimeline
	      .add(brandTimeline)
	      .add(servicesTimeline, '-=800');


	    /**
	     * Exit animation.
	     * --------------------------------
	     */
	    exitTimeline
	      .add(animate({ el: allLetters, e: 'linear', d: 200, p: { opacity: [1, 0] } }));
	  }

	  /**
	   * Initalize the slider
	   */
	  function initializeInstance() {
	    fixContainerWidth(servicesContainer, servicesItems);
	    splitTexts(brandName, servicesItems);
	    generateAnimations();
	    // Now we can display the slider elements.
	    container.style.opacity = 1;
	    initialized = true;
	  }

	  function onResize() {
	    fixContainerWidth(servicesContainer, servicesItems);
	  }

	  function addEvents() {
	    window.addEventListener('resize', onResize);
	  }

	  function removeEvents() {
	    window.removeEventListener('resize', onResize);
	  }

	  function off() {
	    if (!interrupted) {
	      removeEvents();
	      runExitAnimation();
	      interrupted = true;
	    }
	  }

	  function on() {
	    if (interrupted) {
	      addEvents();
	      runEntranceAnimation();
	      interrupted = false;
	    }
	  }

	  function reset() {
	    initialized = false;
	    interrupted = true;
	  }

	  reset();
	  initializeInstance();

	  return {
	    initialized,
	    interrupted,
	    on,
	    off,
	  };
	}

	// Keep the instance here.
	let instance = null;

	/**
	 * Initialize the explorer
	 * and returns the instance.
	 * @params {Object} params Parameters.
	 * @returns {MenuExplorerInstance}
	 */
	function initialize(params) {
	  instance = (instance !== null) ? instance : createNewInstance$1(params);
	  return instance;
	}

	function createNewInstance$2(params) {
	  let slider;
	  let initialized;
	  let isDisplayed;
	  const {
	    container,
	    sliderContainer,
	    brandName,
	    services: servicesItems,
	  } = params;

	  const onShowCallback = (typeof params.show === 'function') ? params.show : null;
	  const onHideCallback = (typeof params.hide === 'function') ? params.hide : null;

	  /**
	   * Init the module.
	   */
	  function init() {
	    // Add the init class.
	    container.classList.add('is-init');

	    // Initialize the slider.
	    slider = initialize({
	      brandName,
	      servicesItems,
	      container: sliderContainer,
	    });
	  }

	  function show() {
	    if (initialized && !isDisplayed) {
	      return new Promise(resolve => {
	        isDisplayed = true;
	        if (slider) slider.on();
	        if (onShowCallback) onShowCallback(resolve);
	        else resolve();
	      });
	    }
	    return Promise.resolve();
	  }

	  function hide() {
	    if (initialized && isDisplayed) {
	      return new Promise(resolve => {
	        isDisplayed = false;
	        if (slider) slider.off();
	        if (onHideCallback) onHideCallback(resolve);
	        else resolve();
	      });
	    }
	    return Promise.resolve();
	  }

	  function on() {
	    if (!initialized) {
	      init();
	      if (slider) slider.on();
	      initialized = true;
	    }
	  }

	  function off() {
	    if (initialized) {
	      if (slider) slider.off();
	      initialized = false;
	    }
	  }

	  function reset() {
	    // Set up state variables.
	    initialized = false;
	    isDisplayed = true;
	  }

	  // Setup variables.
	  reset();

	  return {
	    show,
	    hide,
	    on,
	    off,
	  };
	}

	// Keep the instance (Singleton).
	let instance$1 = null;

	function initialize$1(params) {
	  instance$1 = (instance$1 !== null) ? instance$1 : createNewInstance$2(params);
	  return instance$1;
	}

	class LoaderShape extends Renderable {
	  constructor(p) {
	    super(p);
	    bindAll(this, ['resize']);


	    // Variables.
	    this.v = {
	      // viewport dimensions.
	      W: 0,
	      H: 0,
	    };

	    // Animations variables.
	    this.a = {
	      // Background shape variables.
	      Y: 0,
	    };

	    // Setting up stuffs.
	    this.resize();
	    this.addEvents();
	  }

	  render(c, W, H) {
	    this.drawBackground(c, W, H);
	  }

	  /**
	   * Render the background.
	   * @param {CanvasRenderingContext2D} c
	   */
	  drawBackground(c, W, H) {
	    // c.fillStyle = '#ca2d18';
	    c.fillStyle = '#ca2d18';
	    c.fillRect(0, this.a.Y, W, H);
	  }

	  /**
	   * Make shapes appear on the screen.
	   */
	  draw() {
	    return new Promise(resolve => {
	      animate({
	        el: this.a,
	        e: 'o6',
	        d: 1200,
	        cb: () => resolve(),
	        p: {
	          Y: [this.v.H, 0],
	        },
	      }).play();
	    });
	  }

	  /**
	   * Make shapes dissapear from the screen.
	   */
	  undraw() {
	    return new Promise(resolve => {
	      animate({
	        el: this.a,
	        e: 'o6',
	        d: 1200,
	        cb: () => resolve(),
	        p: {
	          Y: [0, this.v.H],
	        },
	      }).play();
	    });
	  }

	  addEvents() {
	    window.addEventListener('resize', this.resize);
	  }

	  resize() {
	    this.v.W = window.innerWidth;
	    this.v.H = window.innerHeight;
	    if (this.a.Y !== 0) this.a.Y = this.v.H;
	  }
	}

	function init$3() {
	  const cssClassIsLoading = 'is-loading';
	  const cssClassIsLoaded = 'is-loaded';
	  const appContainer = document.querySelector('#app');
	  const loaderContainer = appContainer.querySelector('#loader');
	  const shape = new LoaderShape();

	  function onShowLoader(done) {
	    // Change the class of the app.
	    appContainer.classList.remove(cssClassIsLoaded);
	    appContainer.classList.add(cssClassIsLoading);
	    // Draw renderables.
	    shape.draw().then(() => done());
	  }

	  function onHideLoader(done) {
	    // Change the class of the app.
	    appContainer.classList.add(cssClassIsLoaded);
	    appContainer.classList.remove(cssClassIsLoading);
	    // Undraw renderables.
	    shape.undraw().then(() => done());
	  }

	  const loader = initialize$1({
	    show: onShowLoader,
	    hide: onHideLoader,
	    container: loaderContainer,
	    sliderContainer: loaderContainer.querySelector('#loader-txt'),
	    brandName: loaderContainer.querySelector('#loader-txt-name-w .txt-p-l'),
	    services: loaderContainer.querySelectorAll('#loader-txt-services-w .txt-p-l'),
	  });

	  loader.shapes = shape;
	  return loader;
	}

	/* eslint-disable object-curly-newline */

	class Menu2DShapes extends Renderable {
	  constructor(p) {
	    super(p);
	    bindAll(this, ['resize']);

	    // Variables.
	    this.v = {
	      // viewport dimensions.
	      W: 0,
	      H: 0,
	    };

	    // Animations variables.
	    this.a = {
	      // Circle shape variables.
	      c: {
	        o: 1, // Opacity.
	        d: 0, // to 1 the circle is complete.
	      },
	    };

	    this.circleContainer = document.querySelector('#m-s-g-circle');

	    // Setting up stuffs.
	    this.resize();
	    this.addEvents();
	  }

	  /**
	   *
	   * @param {CanvasRenderingContext2D} c a canvas context.
	   */
	  render(c) {
	    if (this.a.c.d <= 0) return;
	    this.drawCircle(c);
	  }

	  /**
	   * Render the circle.
	   * @param {CanvasRenderingContext2D} c
	   */
	  drawCircle(c) {
	    const {
	      width,
	      left,
	      top,
	    } = this.circleContainer.getBoundingClientRect();
	    const radius = width / 2;

	    c.globalAlpha = this.a.c.o;
	    c.beginPath();
	    c.arc(left + radius, top + radius, radius, 0, (2 * this.a.c.d) * Math.PI, false);
	    c.lineWidth = 1;
	    c.strokeStyle = '#707070';
	    c.stroke();
	    c.globalAlpha = 1;
	  }

	  addEvents() {
	    window.addEventListener('resize', this.resize);
	  }

	  resize() {
	    this.v.W = window.innerWidth;
	    this.v.H = window.innerHeight;

	    // Position.
	    this.p.x = (this.v.W / 2);
	    this.p.y = (this.v.H / 2);
	  }
	}

	/* eslint-disable max-len */

	// Create couple of variables
	// in order to control meshes externally.
	const variables = {
	  opacity: 0,
	  needRender: false,
	};

	const containerElement = document.querySelector('#m-s-g-globe');

	// Create a scene.
	const scene = new three.Scene();

	// Create a camera.
	const fov = 45;
	const aspect = 2;
	const near = 0.1;
	const far = 5;
	const camera = new three.PerspectiveCamera(fov, aspect, near, far);
	camera.position.set(0, 1, 2);
	camera.lookAt(0, 0, 0);

	// Add meshes to the scene.
	const radius = 0.85;
	const segments = 18;
	const rings = 18;
	const geometry = new three.SphereGeometry(radius, segments, rings);
	const material = new three.MeshBasicMaterial({ wireframe: true, color: 0xA3A19F, transparent: true });
	const cube = new three.Mesh(geometry, material);
	scene.add(cube);

	/**
	 * @returns boolean
	 */
	function needRender() {
	  return variables.needRender;
	}

	/**
	 *
	 * @param {WebGLRenderer} renderer
	 */
	function render(renderer) {
	  cube.rotation.y = performance.now() / 1000;
	  material.opacity = variables.opacity;

	  // get the viewport relative position of this element
	  const {
	    left,
	    bottom,
	    width,
	    height,
	  } = containerElement.getBoundingClientRect();

	  camera.aspect = width / height;
	  camera.updateProjectionMatrix();

	  const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
	  renderer.setScissor(left, positiveYUpBottom, width, height);
	  renderer.setViewport(left, positiveYUpBottom, width, height);
	  renderer.render(scene, camera);
	}

	var Menu3DScene = {
	  v: variables,
	  scene,
	  camera,
	  render,
	  needRender,
	};

	/**
	 * https://github.com/gre/bezier-easing
	 * BezierEasing - use bezier curve for transition easing function
	 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
	 */

	// These values are established by empiricism with tests (tradeoff: performance VS precision)
	var NEWTON_ITERATIONS = 4;
	var NEWTON_MIN_SLOPE = 0.001;
	var SUBDIVISION_PRECISION = 0.0000001;
	var SUBDIVISION_MAX_ITERATIONS = 10;

	var kSplineTableSize = 11;
	var kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

	var float32ArraySupported = typeof Float32Array === 'function';

	function A (aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
	function B (aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
	function C (aA1)      { return 3.0 * aA1; }

	// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
	function calcBezier (aT, aA1, aA2) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

	// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
	function getSlope (aT, aA1, aA2) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

	function binarySubdivide (aX, aA, aB, mX1, mX2) {
	  var currentX, currentT, i = 0;
	  do {
	    currentT = aA + (aB - aA) / 2.0;
	    currentX = calcBezier(currentT, mX1, mX2) - aX;
	    if (currentX > 0.0) {
	      aB = currentT;
	    } else {
	      aA = currentT;
	    }
	  } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
	  return currentT;
	}

	function newtonRaphsonIterate (aX, aGuessT, mX1, mX2) {
	 for (var i = 0; i < NEWTON_ITERATIONS; ++i) {
	   var currentSlope = getSlope(aGuessT, mX1, mX2);
	   if (currentSlope === 0.0) {
	     return aGuessT;
	   }
	   var currentX = calcBezier(aGuessT, mX1, mX2) - aX;
	   aGuessT -= currentX / currentSlope;
	 }
	 return aGuessT;
	}

	function LinearEasing (x) {
	  return x;
	}

	var src = function bezier (mX1, mY1, mX2, mY2) {
	  if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
	    throw new Error('bezier x values must be in [0, 1] range');
	  }

	  if (mX1 === mY1 && mX2 === mY2) {
	    return LinearEasing;
	  }

	  // Precompute samples table
	  var sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
	  for (var i = 0; i < kSplineTableSize; ++i) {
	    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
	  }

	  function getTForX (aX) {
	    var intervalStart = 0.0;
	    var currentSample = 1;
	    var lastSample = kSplineTableSize - 1;

	    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
	      intervalStart += kSampleStepSize;
	    }
	    --currentSample;

	    // Interpolate to provide an initial guess for t
	    var dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
	    var guessForT = intervalStart + dist * kSampleStepSize;

	    var initialSlope = getSlope(guessForT, mX1, mX2);
	    if (initialSlope >= NEWTON_MIN_SLOPE) {
	      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
	    } else if (initialSlope === 0.0) {
	      return guessForT;
	    } else {
	      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
	    }
	  }

	  return function BezierEasing (x) {
	    // Because JavaScript number are imprecise, we should guarantee the extremes are right.
	    if (x === 0) {
	      return 0;
	    }
	    if (x === 1) {
	      return 1;
	    }
	    return calcBezier(getTForX(x), mY1, mY2);
	  };
	};

	/* eslint-disable no-unused-vars */

	class AbstractMenuAnimator {
	  constructor() {
	    // Animator state.
	    this.initialized = false;
	    this.entranceTimeline = new Timeline();
	    this.exitTimeline = new Timeline();
	  }

	  /**
	   * Initialize the animator.
	   * Prepares elements to be animated.
	   */
	  init() {
	    this.initialized = true;
	  }

	  /**
	   * @returns Promise
	   */
	  runEnter() {
	    this.exitTimeline.stop();
	    return new Promise(resolve => {
	      this.entranceTimeline.play({ cb: resolve });
	    });
	  }

	  /**
	   * @returns Promise
	   */
	  runExit() {
	    this.entranceTimeline.stop();
	    return new Promise(resolve => {
	      this.exitTimeline.play({ cb: resolve });
	    });
	  }
	}

	/* eslint-disable no-return-assign */

	class ExplorableMenuAnimator extends AbstractMenuAnimator {
	  constructor(params) {
	    super();
	    this.e = params.e;
	  }

	  /**
	   * Initialize the animation timeline.
	   */
	  init() {
	    const {
	      interaction,
	      textBrand,
	      textClose,
	      textContact,
	      textInfos,
	      menuContainer,
	      menuLinks,
	      menuInfoLine,
	      menuInfoLabel,
	      menuBackground,
	      shapes2D,
	      shapes3D,
	      windowWidth,
	    } = this.e;

	    // const menuLinks = Array.prototype.slice.call(document.querySelectorAll('#menu .menu-link'));
	    const customEasing = src(0.89, 0, 0.45, 1);

	    // 2D SHAPES ANIMATIONS.
	    //----
	    // 2D Shape background opacity.
	    const shape2dBackgroundShow = animate({ el: menuBackground, e: 'o6', d: 1200, p: { opacity: 1 } });
	    const shape2dBackgroundHide = animate({ el: menuBackground, e: 'linear', d: 400, p: { opacity: 0 } });
	    // 2D Shape circle drawn.
	    const shape2dCircleDraw = animate({ el: shapes2D.a.c, d: 1000, e: t => customEasing(t), p: { d: 1 } });
	    const shape2dCircleUndraw = animate({ el: shapes2D.a.c, d: 200, e: 'o6', p: { d: 0 } });

	    // DOM ANIMATIONS.
	    //----
	    // Text animations.
	    const txtAnimParams = { e: 'o6', d: 1500 };
	    const textBrandShow = animate({ el: textBrand, p: { y: [120, 0] }, ...txtAnimParams });
	    const textOtherShow = animate({ el: [textClose, textContact, textInfos], delay: i => i * 150, p: { y: [120, 0] }, ...txtAnimParams });
	    const textHide = animate({ el: [textBrand, textClose, textContact, textInfos], p: { y: 120 }, ...txtAnimParams });
	    // Menu elements.
	    const menuLinksArray = Array.prototype.slice.call(menuLinks);
	    this.menuContainerShow = animate({
	      el: menuContainer,
	      d: 2000,
	      e: t => customEasing(t),
	      p: { x: [windowWidth, interaction.explorer.positionAt(0, 0).x, 'px'] },
	      update: p => {
	        if (p >= 0.1 && p <= 0.3) forEachIn(menuLinksArray)(link => link.style.transform = 'translate3d(0,0,0)');
	      },
	    });
	    const menuLinksHide = animate({ el: menuLinksArray, p: { y: 120 }, d: 400 });
	    // Menu info
	    const menuInfoLineShow = animate({ el: menuInfoLine, p: { scaleX: [0, 1] } });
	    const menuInfoLineHide = animate({ el: menuInfoLine, d: 200, p: { scaleX: [1, 0] } });
	    const menuInfoLabelShow = animate({ el: menuInfoLabel, p: { y: [120, 0] } });
	    const menuInfoLabelHide = animate({ el: menuInfoLabel, d: 200, p: { y: [0, 120] } });

	    // 3D SHAPES ANIMATIONS.
	    const shapes3dGlobeShow = animate({ el: shapes3D.v, e: 'linear', d: 600, p: { opacity: 1 } });
	    const shapes3dGlobeHide = animate({ el: shapes3D.v, e: 'linear', d: 200, p: { opacity: 0 } });

	    this.entranceTimeline
	      .add(shape2dBackgroundShow)
	      .add(textBrandShow, 0)
	      .add(this.menuContainerShow, 300)
	      .add(menuInfoLineShow)
	      .add(menuInfoLabelShow)
	      .add(shape2dCircleDraw, 1000)
	      .add(textOtherShow, '-=600')
	      .add(shapes3dGlobeShow, 1500);

	    this.exitTimeline
	      .add(shape2dCircleUndraw)
	      .add(shape2dBackgroundHide, 0)
	      .add(shapes3dGlobeHide, 0)
	      .add(textHide, 0)
	      .add(menuLinksHide, 0)
	      .add(menuInfoLineHide, 0)
	      .add(menuInfoLabelHide, 0);

	    super.init();
	  }

	  /**
	   * @returns Promise
	   */
	  runEnter() {
	    this.exitTimeline.stop();
	    return new Promise(resolve => {
	      this.entranceTimeline.play({
	        update: (p, e) => {
	          if (e >= (this.menuContainerShow.duration + 300)) resolve();
	        },
	      });
	    });
	  }
	}

	/* eslint-disable no-return-assign */

	class TouchableMenuAnimator extends AbstractMenuAnimator {
	  constructor(params) {
	    super();
	    this.e = params.e;
	  }

	  /**
	   * Initialize the animation timeline.
	   */
	  init() {
	    const {
	      textClose,
	      textContact,
	      menuLinks,
	      menuBackground,
	      shapes2D,
	      shapes3D,
	    } = this.e;

	    // 2D SHAPES ANIMATIONS.
	    //----
	    // 2D Shape background opacity.
	    const shape2dBackgroundShow = animate({ el: menuBackground, e: 'o6', d: 1200, p: { opacity: 1 } });
	    const shape2dBackgroundHide = animate({ el: menuBackground, e: 'linear', d: 400, p: { opacity: 0 } });
	    // 2D Shape circle drawn.
	    const shape2dCircleDraw = animate({ el: shapes2D.a.c, d: 800, e: 'io6', p: { d: 1 } });
	    const shape2dCircleUndraw = animate({ el: shapes2D.a.c, d: 200, e: 'o6', p: { d: 0 } });

	    // DOM ANIMATIONS.
	    //----
	    // Text animations.
	    const txtAnimParams = { e: 'o6', d: 1500 };
	    const textShow = animate({ el: [textClose, textContact], delay: i => i * 150, p: { y: [120, 0] }, ...txtAnimParams });
	    const textHide = animate({ el: [textClose, textContact], p: { y: 120 }, ...txtAnimParams });
	    // Menu
	    const menuLinksArray = Array.from(menuLinks);
	    forEachIn(menuLinksArray)(menuLink => menuLink.style.transform = 'translate3d(0,120%,0)');
	    const menuLinksShow = animate({ el: menuLinksArray, p: { y: 0 }, ...txtAnimParams });
	    const menuLinksHide = animate({ el: menuLinksArray, p: { y: 120 }, ...txtAnimParams });

	    // 3D SHAPES ANIMATIONS.
	    const shapes3dGlobeShow = animate({ el: shapes3D.v, e: 'linear', d: 600, p: { opacity: 1 } });
	    const shapes3dGlobeHide = animate({ el: shapes3D.v, e: 'linear', d: 200, p: { opacity: 0 } });

	    this.entranceTimeline
	      .add(shape2dBackgroundShow)
	      .add(shape2dCircleDraw, 0)
	      .add(shapes3dGlobeShow, '-=500')
	      .add(menuLinksShow, 150)
	      .add(textShow, `-=${menuLinksShow.duration + 200}`);

	    this.exitTimeline
	      .add(shape2dCircleUndraw)
	      .add(shapes3dGlobeHide, 0)
	      .add(textHide, 0)
	      .add(menuLinksHide, 0)
	      .add(shape2dBackgroundHide, 60);

	    super.init();
	  }
	}

	/* eslint-disable object-curly-newline */
	/* eslint-disable no-return-assign */

	function createNewInstance$3(params) {
	  // Get parameters.
	  let interrupted = true;
	  // const { container } = params;

	  function on() {
	    if (interrupted) {
	      interrupted = false;
	    }
	  }

	  function off() {
	    if (!interrupted) {
	      interrupted = true;
	    }
	  }


	  return {
	    interrupted,
	    on,
	    off,
	  };
	}

	// Keep the instance here.
	let instance$2 = null;

	/**
	 * Initialize the explorer
	 * and returns the instance.
	 * @params {Object} params Parameters.
	 * @returns {MenuExplorerInstance}
	 */
	function initialize$2(params) {
	  instance$2 = (instance$2 !== null) ? instance$2 : createNewInstance$3();
	  return instance$2;
	}

	/* eslint-disable no-return-assign */

	/**
	 * @typedef MenuExplorerInstance
	 * @type {Object}
	 * @property {Function} on Turn on the explorer.
	 * @property {Function} off Turn off the explorer.
	 */


	/**
	 * Create a new explorer instance.
	 * @param {Object} params
	 * @returns MenuExplorerInstance
	 */
	function createNewInstance$4(params) {
	  // Get parameters.
	  let interrupted = true;
	  const { menuContainer } = params;
	  const mouseExplorer = createMouseExplorer({ section: menuContainer, ease: 0.074, center: true });


	  function moveContainer({ x }) {
	    menuContainer.style.transform = `translate3d(${x}px,0,0)`;
	  }

	  function addEvents() {
	    mouseExplorer.on(moveContainer);
	  }

	  function removeEvents() {
	    mouseExplorer.off(moveContainer);
	  }

	  function off() {
	    if (!interrupted) {
	      removeEvents();
	      interrupted = true;
	    }
	  }

	  function on() {
	    if (interrupted) {
	      addEvents();
	      interrupted = false;
	    }
	  }

	  return {
	    interrupted,
	    explorer: mouseExplorer,
	    on,
	    off,
	  };
	}

	// Keep the instance here.
	let instance$3 = null;

	/**
	 * Initialize the explorer
	 * and returns the instance.
	 * @params {Object} params Parameters.
	 * @returns {MenuExplorerInstance}
	 */
	function initialize$3(params) {
	  instance$3 = (instance$3 !== null) ? instance$3 : createNewInstance$4(params);
	  return instance$3;
	}

	/* eslint-disable max-len */


	function createNewInstance$5(params) {
	  let interaction;
	  let animator;
	  let initialized;
	  let isDisplayed;
	  const gl = initializeGL({ canvas: document.querySelector('#menugl') });

	  // Retrieve params.
	  const { app } = params;
	  const onOpenCallback = (typeof params.open === 'function') ? params.open : null;
	  const onCloseCallback = (typeof params.close === 'function') ? params.close : null;
	  const deviceHasMouse = (typeof params.hasMouse !== 'undefined') ? params.hasMouse : false;

	  // Animation elements.
	  let shapes2D;
	  let windowWidth = window.innerWidth;


	  /**
	   * When the browser is resized, we
	   * need to change the re-arrange elements.
	   */
	  function onResize() {
	    windowWidth = window.innerWidth;
	  }

	  /**
	   * Attach events listeners.
	   */
	  function attachEvents() {
	    window.addEventListener('resize', onResize);
	  }

	  /**
	   * Remove events listeners.
	   */
	  function detachEvents() {
	    window.removeEventListener('resize', onResize);
	  }

	  /**
	   * Init the module.
	   */
	  function init() {
	    /**
	     * Initialize the instance
	     */
	    // Attach events listener.
	    attachEvents();

	    // Select elements.
	    shapes2D = new Menu2DShapes();
	    const appContainer = document.querySelector('#app');

	    // Text lines to animate.
	    const textBrand = appContainer.querySelector('#m-s-brand .txt-p-l');
	    const textClose = appContainer.querySelector('#m-s-closer-w .txt-p-l');
	    const textContact = appContainer.querySelector('#m-s-contact-link .txt-p-l');
	    const textInfos = appContainer.querySelector('#m-s-info .txt-p-l');

	    // Menu items to animate.
	    const menuContainer = document.querySelector('#menu');
	    const menuBackground = appContainer.querySelector('#m-s-bg');
	    const menuLinks = menuContainer.querySelectorAll('.menu-link');
	    const menuInfoLine = menuContainer.querySelectorAll('.menu-item__info__line');
	    const menuInfoLabel = menuContainer.querySelectorAll('.menu-item__info__label');

	    // Initialize interactions.
	    interaction = deviceHasMouse
	      ? initialize$3({ menuContainer })
	      : initialize$2();

	    // Initialize animators.

	    animator = deviceHasMouse
	      ? new ExplorableMenuAnimator({
	        e: {
	          interaction,
	          textBrand,
	          textClose,
	          textContact,
	          textInfos,
	          menuContainer,
	          menuLinks,
	          menuInfoLine,
	          menuInfoLabel,
	          menuBackground,
	          shapes2D,
	          shapes3D: Menu3DScene,
	          windowWidth,
	        } })
	      : new TouchableMenuAnimator({
	        e: {
	          textClose,
	          textContact,
	          menuLinks,
	          menuBackground,
	          shapes2D,
	          shapes3D: Menu3DScene,
	        } });
	  }

	  /**
	   * Turn on the module.
	   */
	  function on() {
	    if (!initialized) {
	      init();
	      animator.init();
	      // Add shapes on Canvas 2D & 3D.
	      app.m.cursor.c.prepend(shapes2D);
	      gl.add(Menu3DScene);
	      gl.on();
	      initialized = true;
	    }
	  }

	  /**
	   * Turn off the module.
	   */
	  function off() {
	    // Turn Off interactions.
	    interaction.off();
	    // Removes shapes from Canvas 2D & 3D.
	    app.m.cursor.c.remove(shapes2D);
	    gl.remove(Menu3DScene);
	    gl.off();
	    // Detach events.
	    detachEvents();
	    initialized = false;
	  }

	  function close() {
	    if (isDisplayed) {
	      interaction.off();
	      if (onCloseCallback) onCloseCallback();
	      animator.runExit()
	        .finally(() => {
	          isDisplayed = false;
	          Menu3DScene.v.needRender = false;
	        });
	    }
	  }

	  function open() {
	    if (!isDisplayed) {
	      Menu3DScene.v.needRender = true;
	      animator.runEnter()
	        .then(() => {
	          interaction.on();
	          if (onOpenCallback) onOpenCallback();
	        })
	        .finally(() => { isDisplayed = true; });
	    }
	  }

	  function toggle() {
	    if (!isDisplayed) open();
	    else close();
	  }

	  function reset() {
	    // Set up state variables.
	    initialized = false;
	    isDisplayed = false;
	  }

	  // Setup variables.
	  reset();

	  return {
	    initialized,
	    isDisplayed,
	    on,
	    off,
	    open,
	    close,
	    toggle,
	  };
	}

	// Keep the instance (Singleton).
	let instance$4 = null;

	/**
	 * Initialize the explorer
	 * and returns the instance.
	 * @params {Object} params Parameters.
	 * @returns {MenuExplorerInstance}
	 */
	function initialize$4(params) {
	  instance$4 = (instance$4 !== null) ? instance$4 : createNewInstance$5(params);
	  return instance$4;
	}

	/* eslint-disable object-curly-newline */

	function init$4(app) {
	  const cssClass = 'menu-displayed';
	  const appContainer = document.querySelector('#app');
	  const closer = appContainer.querySelector('#m-s-closer');

	  const menuBackground = document.querySelector('#m-s-bg');
	  menuBackground.style.opacity = 0;

	  const menu = initialize$4({
	    app,
	    hasMouse: app.d.hasMouse,
	    open: () => {
	      app.p.pause();
	      appContainer.classList.add(cssClass);
	    },
	    close: () => {
	      app.p.resume();
	      appContainer.classList.remove(cssClass);
	    },
	  });

	  // Activate closer.
	  closer.addEventListener('click', e => {
	    e.preventDefault();
	    menu.toggle();
	  });

	  // Only for testing
	  // ------------------
	  const opener = appContainer.querySelector('#open-menu');
	  opener.addEventListener('click', e => {
	    e.preventDefault();
	    menu.open();
	  });
	  // ----------------

	  return menu;
	}

	// Import a module (eg modals) and export it directly.

	var modules = /*#__PURE__*/Object.freeze({
		c2d: init,
		cursor: init$1,
		gl: init$2,
		loader: init$3,
		menu: init$4
	});

	/* eslint-disable no-console */
	/* eslint-disable class-methods-use-this */
	class Page {
	  /**
	   * @constructor
	   * @param {object} app The current app.
	   */
	  constructor(app) {
	    // Store the current app in the page.
	    this.a = app;
	    // Store the modules in the app.
	    this.m = {};
	  }

	  /**
	   * The operation to do before
	   * mounting the page.
	   * @returns {Promise}
	   */
	  setUp() {
	    return Promise.resolve();
	  }

	  /**
	   * When the page is mounted.
	   * @abstract
	   */
	  mount() {
	    throw new TypeError(`${this.toString()}: You must implement the mount method.`);
	  }


	  /**
	   * Before unmounting the page.
	   * NEVER CALL DIRECTLY
	   *
	   * If you want to do some operations before the unmount,
	   * Please consider using the clean method instead.
	   */
	  unmount() {
	    // Call the clean operations of
	    // specializations first.
	    // For turning off the parent app modules.
	    this.clean();

	    // We should off all our modules.
	    Object.keys(this.m).forEach(key => this.m[key].off());
	  }

	  /**
	   * Init the page.
	   *
	   * At the init stage we
	   * should first init all necessary
	   * modules.
	   */
	  init(modules) {
	    // Iterate through all modules, execute each module and
	    // submit the page (this) via Dependency Injection.
	    Object.keys(modules).forEach(key => {
	      this.m[key] = modules[key](this);
	    });
	  }

	  /**
	   * Clean the app
	   *
	   * Since each app can be unmounted
	   * We should allows a way to clean the memory.
	   *
	   * Consider using this method if you want to
	   * do something specific on ummounting
	   * (rather than overriding the unmount method).
	   *
	   * For turning off the parent app modules.
	   */
	  clean() {}

	  /**
	   * Pause the page.
	   * When we open the menu,
	   * we need to momently pause activities
	   * inside the page.
	   */
	  pause() {
	    console.info('This page does not implement pause function');
	  }

	  /**
	   * After pausing a page,
	   * We need to resume the page.
	   */
	  resume() {
	    console.info('This page does not implement resume function');
	  }
	}

	/**
	 *
	 * An optimized implementation
	 * of window.setTimeout
	 *
	 * @param {Function} cb The callback to call after the delay.
	 * @param {Number} d The duration, in ms, of the delay.
	 * @returns {void}
	 * @example
	 *
	 * const d = 2000;
	 * const cb = () => console.log(`Call me ${d}ms later`);
	 *
	 * const delay = new Delay(cb, d);
	 * delay.run();
	 * delay.stop();
	 *
	 */
	function Delay(cb, d) {
	  this.d = d;
	  this.cb = cb;
	  this.loop = this.loop.bind(this);
	  this.rAF = new Raf(this.loop);
	}

	Delay.prototype = {

	  run: function() {
	    if (this.d === 0) this.cb();
	    else this.rAF.run();
	  },

	  stop: function() {
	    this.rAF.stop();
	  },

	  loop: function(e) {
	    var elapsed = clamp(e, 0, this.d);
	    if (elapsed === this.d) {
	      this.stop();
	      this.cb();
	    }
	  },
	};

	/* eslint-disable implicit-arrow-linebreak */

	const getSections = s => {
	  const sections = [];

	  if (Array.isArray(s)) return s.map(e => getSections(e)).map(a => a[0]);

	  if (s instanceof HTMLCollection || s instanceof NodeList) {
	    forEachIn(Array.from(s))(e =>
	      sections.push({ el: e, b: null }));
	    return sections;
	  }

	  if (s instanceof HTMLElement || s instanceof Node) {
	    sections.push({ el: s, b: null });
	    return sections;
	  }

	  throw new TypeError('Sections must be DOM elements.');
	};

	class SM {
	  constructor(o) {
	    bindAll(this, ['calc', 'removeClasses', 'resize', 'run']);

	    // Get the listener.
	    // The listener is used to attach/detach
	    // event listeners.
	    this.l = o.listener || document;

	    // Get the content container.
	    // The container is used to calculate the
	    // content height.
	    this.c = o.container || document.body;

	    // Get the sections to move up/down
	    this.s = o.sections ? getSections(o.sections) : getSections(this.c);

	    // Add "pointer-events: none" to each element with
	    // an hover state when the user scroll.
	    // It significantly improve performance on scroll.
	    this.p = o.p || null;

	    // Set a callback to be notified each
	    // time the scroll value change.
	    this.onUp = o.onUpdate || null;

	    // SM variables.
	    this.v = {
	      // Boundings.
	      b: 0,
	      // Current value.
	      c: 0,
	      // Last value.
	      l: 0,
	      // Ease.
	      e: o.ease || 0.075,
	      // Window height,
	      H: 0,
	      // Target
	      t: 0,
	      // are Sections moving
	      moving: false,
	      // Ticking
	      ticking: false,
	      // CSS ClassName
	      class: 'is-scrolling',
	    };

	    // Scroll acceleration.
	    this.a = 0;

	    this.sm = new S({
	      el: this.l,
	      mouseMultiplier: o.mouseMultiplier || 0.55, // 0.618,
	      touchMultiplier: o.touchMultiplier || 2.4,
	      firefoxMultiplier: o.firefoxMultiplier || 34,
	      preventTouch: o.preventTouch || true,
	    });

	    this.rAF = new Raf(this.run);
	    this.delay = new Delay(this.removeClasses, 400);
	  }

	  init() {
	    this.resize();
	    // forEach(this.s)(section => section.el.style['will-change'] = 'transform');
	  }

	  calc(e) {
	    const d = e.deltaY;
	    this.v.t += d * -1;

	    // Clamp the scroll target.
	    this.clampTarget();

	    if (!this.v.ticking) {
	      requestAnimationFrame(() => {
	        // this.addClasses();
	        if (this.p) this.p.style.pointerEvents = 'all';
	        this.delay.run();
	        this.v.ticking = false;
	      });
	      this.delay.stop();
	      this.v.ticking = true;
	    }

	    if (this.v.moving === false) this.rAF.run();
	  }

	  clampTarget() {
	    this.v.t = round(clamp(this.v.t, 0, (this.v.b.height - this.v.H)), 4);
	  }

	  off() {
	    this.rAF.stop();
	    this.removeEvents();
	  }

	  on() {
	    this.addEvents();
	    this.rAF.run();
	  }

	  resize() {
	    // Get the current viewport height.
	    this.v.H = window.innerHeight;

	    // Get the current container bounds.
	    this.v.b = this.c.getBoundingClientRect();

	    // Clamp the scroll target.
	    this.clampTarget();

	    // Get the current bounds of sections.
	    forEachIn(this.s)(section => {
	      section.el.style.transform = `translate3d(0,${-1 * this.v.c}px,0)`;
	      const bound = section.el.getBoundingClientRect();
	      section.b = {};
	      section.b.top = bound.top + this.v.c;
	      section.b.bottom = bound.bottom + this.v.c;
	    });
	  }

	  run() {
	    this.v.moving = true;
	    this.v.c += (this.v.t - this.v.c) * this.v.e;
	    this.v.c = Number(this.v.c.toFixed(4));
	    if (this.v.c <= 0.001) this.v.c = 0;

	    // Calculate the acceleration.
	    this.a = this.v.t - this.v.c;

	    // console.log('Run the loop...', this.v.c, ' – ', this.v.t, ' – Max: ', this.v.b.height);

	    // If the current value is equal to the last one,
	    // This means that we don't need anymore to run the loop.
	    if (this.v.c === this.v.l) {
	      this.rAF.stop();
	      this.v.moving = false;
	    }

	    // Slide sections.
	    forEachIn(this.s)(section => this.positionateSection(section));

	    // Callback
	    if (typeof this.onUp === 'function') this.onUp(this.v.c);

	    // Keep track of the last value.
	    this.v.l = this.v.c;
	  }

	  /**
	   * Positionate a section on a the page according to the scroll amount.
	   * @param {*} section
	   */
	  positionateSection(section) {
	    const bleed = 300;
	    const topLimit = (section.b.top - bleed) - this.v.H;
	    const bottomLimit = section.b.bottom + bleed;
	    const isScrollInInterval = this.v.c >= topLimit && this.v.c <= bottomLimit;

	    if (isScrollInInterval) section.el.style.transform = `translate3d(0,${-1 * this.v.c}px,0)`;
	  }

	  addClasses() {
	    document.body.classList.add(this.v.class);
	  }

	  removeClasses() {
	    // document.body.classList.remove(this.v.class);
	    if (this.p) this.p.style.pointerEvents = 'none';
	  }

	  addEvents() {
	    this.sm.on(this.calc);
	    window.addEventListener('resize', this.resize);
	  }

	  removeEvents() {
	    this.sm.off(this.calc);
	    window.removeEventListener('resize', this.resize);
	  }
	}

	function init$5() {
	  const sm = new SM({
	    listener: document.querySelector('#app'),
	    container: document.querySelector('.home-page'),
	    sections: [
	      document.querySelector('#hero'),
	      document.querySelector('#s0'),
	      document.querySelector('#s1'),
	      document.querySelector('#s2'),
	      document.querySelector('#s3'),
	      document.querySelector('#s4'),
	      document.querySelector('#s5'),
	      document.querySelector('#s6'),
	    ],
	    p: document.querySelector('#_p'),
	    preventTouch: true,
	    mouseMultiplier: 0.618,
	    touchMultiplier: 1,
	  });
	  sm.init();
	  return sm;
	}

	/* eslint-disable no-underscore-dangle */

	class Slider {
	  constructor(o) {
	    bindAll(this, ['_calc', '_run']);

	    // Get the content container.
	    // The container is used to listen the
	    // hold and drag event.
	    this.c = o.container || window;

	    // The wheel to rotate.
	    this.w = o.wheel;

	    // Project items and their container.
	    this.p = Array.from(o.projects);
	    this.pC = this.p[0].parentNode;

	    // Init the slider variables.
	    this.v = {};

	    // Where to store drag variables.
	    this.d = {
	      // The current value.
	      c: 0,
	      // The target value.
	      t: 0,
	      // The last value.
	      l: 0,
	      // Ticking.
	      ticking: false,
	    };

	    // Initialize the Drag library
	    this.D = new Drag({
	      listener: o.container,
	    });

	    // RequestAnimationFrame
	    // interface.
	    this.r = new Raf(this._run);
	  }

	  /**
	   * Turn on the modules
	   */
	  on() {
	    // this.r.run();
	    this._attachEvents();
	    this._drawWheel();
	  }

	  /**
	   * Turn off the module.
	   */
	  off() {
	    this.r.stop();
	    this._removeEvents();
	  }

	  _calc(e) {
	    this.d.t += e.X;

	    if (this.d.ticking === false) this.r.run();
	  }

	  _run() {
	    this.d.ticking = true;
	    this.d.c += (this.d.t - this.d.c) * 0.1;
	    this.d.c = Number(this.d.c.toFixed(3));

	    // If the current value is equal to the last one,
	    // This means that we don't need anymore to run the loop.
	    if (this.d.c === this.d.l) {
	      this.r.stop();
	      this.d.ticking = false;
	    }

	    // Rotate the wheel.
	    this.w.style.transform = `rotate3d(0,0,1,${this.d.c}deg)`;

	    // Slide the images
	    this.pC.style.transform = `translate3d(${this.d.c}px,0,0)`;

	    // Keep track of the last value.
	    this.d.l = this.d.c;
	  }

	  _onMouseDown() {}

	  _onMouseUp() {}

	  _attachEvents() {
	    this.D.on(this._calc);
	  }

	  _removeEvents() {
	    this.D.off(this._calc);
	  }

	  _drawWheel() {

	    const svgWheel = this.w;

	    // For each service, create a
	    // svg text element.
	    const svgWheelFragment = document.createDocumentFragment();
	    Array
	      .from(document.querySelectorAll('.s-slider-wheel-v__item'))
	      .forEach(vertex => {
	        const textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	        textElement.appendChild(document.createTextNode(vertex.innerText));
	        svgWheelFragment.appendChild(textElement);
	      });
	    svgWheel.appendChild(svgWheelFragment);

	    // Select all the texts
	    // we've recently created.
	    const svgTexts = Array.from(svgWheel.querySelectorAll('text'));

	    // Since we have all our texts.
	    // We can now calculate the circumference of our wheel.
	    //
	    // By the way, we'll need to align texts one
	    // after the other.
	    const fsize = window.getComputedStyle(svgWheel, null).getPropertyValue('font-size');
	    const gutter = parseFloat(fsize) * 0.8;
	    const circumference = svgTexts
	      .reduce((acc, cur) => {
	        const { width } = cur.getBBox();
	        cur.setAttributeNS(null, 'dx', acc);
	        cur.setAttributeNS(null, 'dy', -1 * gutter);
	        return acc + width + gutter;
	      }, 0);

	    // With the circumference, now
	    // we can set the correct svg dimension
	    const diameter = circumference / Math.PI;
	    const size = diameter + 40 + (gutter * 2);
	    svgWheel.setAttribute('width', size);
	    svgWheel.setAttribute('height', size);


	    // Then we can draw the wheel.
	    const textPath = svgWheel.querySelector('#s-slider-wheel-curve');
	    const R = diameter / 2;
	    const CX = size / 2;
	    const CY = CX;
	    textPath.setAttributeNS(
	      null,
	      'd',
	      `M ${CX - R}, ${CY} a ${R},${R} 0 1,1 ${R * 2},0 a ${R},${R} 0 1,1 -${R * 2},0`
	    );

	    // And at the end, we are able to
	    // place each text on the path.
	    svgTexts
	      .forEach(textEl => {
	        const textNode = textEl.removeChild(textEl.firstChild);
	        const textPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'textPath');

	        textPathElement.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#s-slider-wheel-curve');
	        textPathElement.appendChild(textNode);

	        textEl.appendChild(textPathElement);
	      });
	  }
	}

	function init$6(app) {
	  return new Slider({
	    container: document.querySelector('#s-slider-w'),
	    wheel: document.querySelector('#s-slider-wheel-svg'),
	    projects: document.querySelectorAll('.s-slider-project-item'),
	  });
	}

	// Import a module (eg modals) and export it directly.

	var modules$1 = /*#__PURE__*/Object.freeze({
		scroll: init$5,
		sslider: init$6
	});

	function rotateX(x, r, angle) {
	  const X = r * Math.cos(angle * (Math.PI / 180));
	  return x + X;
	}

	function rotateY(y, r, angle) {
	  const Y = r * Math.sin(angle * (Math.PI / 180));
	  return y + Y;
	}

	class HeroShapes extends Renderable {
	  constructor(p, page) {
	    super(p);
	    bindAll(this, ['resize']);

	    // Get the app.
	    this._p = page;

	    // radius.
	    this.r = 0;

	    // color.
	    this.c = '#707070';

	    // scroll amount.
	    this.s = 0;

	    // viewport dimensions.
	    this.W = 0;
	    this.H = 0;

	    // Variables.
	    this.v = {
	      // Is the renderable is initialized.
	      initialized: false,
	    };

	    // Animations variables.
	    this.a = {
	    // LEFT CIRCLES.
	      // Stroke First.
	      lsf: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Stroke Second
	      lss: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Ball First.
	      lbf: {
	        r: 45, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Ball Second.
	      lbs: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Ball Third.
	      lbt: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      lf1: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },

	    // CENTER CIRCLES.
	      // Stroke first.
	      csf: {
	        r: 0, // Rotation
	        t: 0, // Transparency.
	      },
	      // Stroke second.
	      css: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Stroke third.
	      cst: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Ball first.
	      cbf: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Ball second.
	      cbs: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Ball third.
	      cbt: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },

	    // RIGHT CIRCLES.
	      // Stroke first.
	      rsf: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Stroke second.
	      rss: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Ball first.
	      rbf: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	      // Ball second.
	      rbs: {
	        r: 0, // Rotation Angle.
	        t: 0, // Transparency.
	      },
	    };

	    this.resize();
	    this.addEvents();
	  }

	  /**
	   * Init the shapes on the canvas.
	   *
	   * This method will be called externally to
	   * trigger the entry animation.
	   */
	  init() {
	    if (!this.v.initialized) {
	      this.v.initialized = true;

	      const r = { d: 1500, e: 'io4' };
	      const t = { d: 700, e: 'io2', p: { t: [0, 1] } };

	      const animateOtherCircles = () => {
	        animate({ ...t, el: this.a.csf }).play();

	        // Left circles.
	        animate({ ...t, el: this.a.lsf }).play();
	        animate({ ...t, el: this.a.lss }).play();
	        animate({ ...t, el: this.a.lbf, delay: 100 }).play();
	        animate({ ...t, el: this.a.lbs }).play();
	        animate({ ...r, d: 1000, el: this.a.lbs, p: { r: [110, 20] } }).play();
	        animate({ ...t, el: this.a.lbt }).play();
	        animate({ ...r, d: 1000, el: this.a.lbt, p: { r: [165, 75] } }).play();

	        // Right circles.
	        animate({ ...t, el: this.a.rsf }).play();
	        animate({ ...t, el: this.a.rss }).play();
	        animate({ ...t, el: this.a.rbf }).play();
	        animate({ ...r, d: 1000, el: this.a.rbf, p: { r: [250, 160] } }).play();
	        animate({ ...t, el: this.a.rbs }).play();
	        animate({ ...r, d: 1000, el: this.a.rbs, p: { r: [210, 120] } }).play();
	      };

	      let otherCirclesDisplayed = false;
	      const displayOtherCirclesOnTime = progress => {
	        if (!otherCirclesDisplayed && progress >= 0.03) {
	          animateOtherCircles();
	          otherCirclesDisplayed = true;
	        }
	      };

	      // Center circles.
	      animate({ ...t, el: this.a.css }).play();
	      animate({ ...t, el: this.a.cst }).play();

	      animate({ ...t, el: this.a.cbf }).play();
	      animate({ ...r, el: this.a.cbf, p: { r: [70, -20] } }).play();
	      animate({ ...t, el: this.a.cbs }).play();
	      animate({ ...r, el: this.a.cbs, p: { r: [45, 135] } }).play();
	      animate({ ...t, el: this.a.cbt }).play();
	      animate({ ...r, el: this.a.cbt, p: { r: [135, 225] }, update: displayOtherCirclesOnTime }).play();
	    }
	  }

	  /**
	   *
	   * @param {*} c
	   */
	  render(c) {
	    // Do not render anythinhg until
	    // they have been initialized.
	    if (!this.v.initialized) return;

	    // Move horizontally the shape on scroll.
	    const p = this.getPosition();

	    // Then draw the shape elements.
	    this.drawCircleSM(c, p);
	    this.drawCircleMed(c, p);
	    this.drawCircleBig(c, p);
	    this.drawCornerLeftCircles(c, p);
	    this.drawCornerRightCircles(c, p);
	  }

	  getPosition() {
	    return {
	      x: this.p.x,
	      y: this.p.y - this.s,
	    };
	  }

	  addEvents() {
	    window.addEventListener('resize', this.resize);
	  }

	  resize() {
	    this.W = window.innerWidth;
	    this.H = window.innerHeight;
	    const t = document.querySelector('#hero h1');

	    // Compute size.
	    const b = t.getBoundingClientRect();
	    this.r = (b.width / 2) + 38;

	    // Positionate.
	    this.p.x = (this.W / 2);
	    this.p.y = (this.H / 2);
	  }

	  computeRotation(accumulator, ease = 0.2) {
	    const acceleration = this._p.m.scroll ? this._p.m.scroll.a : 0;
	    return ((accumulator + (acceleration / 10)) - accumulator) * ease;
	  }

	  /**
	   * Draw the big interrupted circle stroke.
	   */
	  drawCircleBig(c, p) {
	    const r = this.r * 2;
	    this.a.csf.r += 0.1;
	    this.a.csf.r += this.computeRotation(this.a.csf.r);
	    this.a.csf.r = this.a.csf.r >= 360 ? 0 : this.a.csf.r;

	    const radStart = this.a.csf.r * (Math.PI/180);
	    const radEnd = radStart + (2 * Math.PI);
	    c.globalAlpha = this.a.csf.t;
	    c.beginPath();
	    c.setLineDash([10, 10]);
	    c.arc(p.x, p.y, r, radStart, radEnd, false);
	    c.lineWidth = 1;
	    c.strokeStyle = this.c;
	    c.stroke();
	    c.globalAlpha = 1;
	    c.setLineDash([]);
	  }

	  drawCircleMed(c, p) {
	    const r = this.r * 1.4;

	    // Draw the stroke.
	    c.globalAlpha = this.a.css.t;
	    c.beginPath();
	    c.arc(p.x, p.y, r, 2 * Math.PI, false);
	    c.lineWidth = 1;
	    c.strokeStyle = this.c;
	    c.stroke();
	    c.globalAlpha = 1;

	    // Draw the first ball.
	    this.a.cbf.r -= this.computeRotation(this.a.cbf.r);
	    const x2 = rotateX(p.x, r, this.a.cbf.r);
	    const y2 = rotateY(p.y, r, this.a.cbf.r);

	    const r2 = r * 0.05;
	    c.globalAlpha = this.a.cbf.t;
	    c.beginPath();
	    c.arc(x2, y2, r2, 2 * Math.PI, false);
	    c.fillStyle = this.c;
	    c.fill();
	    c.globalAlpha = 1;
	  }

	  drawCircleSM(c, p) {
	    const { r } = this;

	    // Draw the stroke.
	    c.globalAlpha = this.a.cst.t;
	    c.beginPath();
	    c.arc(p.x, p.y, r, 2 * Math.PI, false);
	    c.lineWidth = 1;
	    c.strokeStyle = this.c;
	    c.stroke();
	    c.globalAlpha = 1;

	    // Draw the first ball (big).
	    const r2 = r * 0.19;
	    this.a.cbs.r -= this.computeRotation(this.a.cbs.r);
	    const x2 = rotateX(p.x, r, this.a.cbs.r);
	    const y2 = rotateY(p.y, r, this.a.cbs.r);
	    c.globalAlpha = this.a.cbs.t;
	    c.beginPath();
	    c.arc(x2, y2, r2, 2 * Math.PI, false);
	    c.fillStyle = this.c;
	    c.fill();
	    c.globalAlpha = 1;

	    // Draw the second ball (small).
	    const r3 = r * 0.05;
	    this.a.cbt.r += this.computeRotation(this.a.cbt.r);
	    const x3 = rotateX(p.x, r, this.a.cbt.r);
	    const y3 = rotateY(p.y, r, this.a.cbt.r);
	    c.globalAlpha = this.a.cbt.t;
	    c.beginPath();
	    c.arc(x3, y3, r3, 2 * Math.PI, false);
	    c.fillStyle = this.c;
	    c.fill();
	    c.globalAlpha = 1;
	  }

	  drawCornerLeftCircles(c, p) {
	    // Do not draw corner circles, if the
	    // viewport width is not 1200px at least.
	    if (this.W < 1200) return;

	    const { r } = this;

	    // Draw first stroke
	    const x = 0;
	    const y = p.y - this.H / 2;
	    c.globalAlpha = this.a.lss.t;
	    c.beginPath();
	    c.arc(x, y, r, 2 * Math.PI, false);
	    c.lineWidth = 1;
	    c.strokeStyle = this.c;
	    c.stroke();
	    c.globalAlpha = 1;
	    // Draw first stroke elem #1
	    const r2 = r * 0.19;
	    this.a.lbs.r += this.computeRotation(this.a.lbs.r);
	    const x2 = rotateX(x, r, this.a.lbs.r);
	    const y2 = rotateY(y, r, this.a.lbs.r);
	    c.globalAlpha = this.a.lbs.t;
	    c.beginPath();
	    c.arc(x2, y2, r2, 2 * Math.PI, false);
	    c.fillStyle = this.c;
	    c.fill();
	    c.globalAlpha = 1;
	    // Draw first stroke elem #2
	    const r3 = r * 0.07;
	    this.a.lbt.r += this.computeRotation(this.a.lbt.r);
	    const x3 = rotateX(x, r, this.a.lbt.r);
	    const y3 = rotateY(y, r, this.a.lbt.r);
	    c.globalAlpha = this.a.lbt.t;
	    c.beginPath();
	    c.arc(x3, y3, r3, 2 * Math.PI, false);
	    c.fillStyle = this.c;
	    c.fill();
	    c.globalAlpha = 1;

	    // Draw second
	    const r4 = r * 1.4;
	    c.globalAlpha = this.a.lsf.t;
	    c.beginPath();
	    c.arc(x, y, r4, 2 * Math.PI, false);
	    c.lineWidth = 1;
	    c.strokeStyle = this.c;
	    c.stroke();
	    c.globalAlpha = 1;
	    // Draw second stroke elem #1
	    const r5 = r * 0.04;
	    this.a.lbf.r -= this.computeRotation(this.a.lbf.r);
	    const x5 = rotateX(x, r4, this.a.lbf.r);
	    const y5 = rotateY(y, r4, this.a.lbf.r);
	    c.globalAlpha = this.a.lbf.t;
	    c.beginPath();
	    c.arc(x5, y5, r5, 2 * Math.PI, false);
	    c.fillStyle = this.c;
	    c.fill();
	    c.globalAlpha = 1;
	  }

	  drawCornerRightCircles(c, p) {
	    // Do not draw corner circles, if the
	    // viewport width is not 1200px at least.
	    if (this.W < 1200) return;

	    const { r } = this;

	    // Draw first stroke.
	    const x = this.W;
	    const y = p.y - this.H / 2;
	    c.globalAlpha = this.a.rsf.t;
	    c.beginPath();
	    c.arc(x, y, r, 2 * Math.PI, false);
	    c.lineWidth = 1;
	    c.strokeStyle = this.c;
	    c.stroke();
	    c.globalAlpha = 1;
	    // Draw first stroke element.
	    const r2 = r * 0.07;
	    this.a.rbf.r -= this.computeRotation(this.a.rbf.r);
	    const x2 = rotateX(x, r, this.a.rbf.r);
	    const y2 = rotateY(y, r, this.a.rbf.r);
	    c.globalAlpha = this.a.rbf.t;
	    c.beginPath();
	    c.arc(x2, y2, r2, 2 * Math.PI, false);
	    c.fillStyle = this.c;
	    c.fill();
	    c.globalAlpha = 1;

	    // Draw second stroke.
	    const r3 = r * 1.4;
	    c.globalAlpha = this.a.rss.t;
	    c.beginPath();
	    c.arc(x, y, r3, 2 * Math.PI, false);
	    c.lineWidth = 1;
	    c.strokeStyle = this.c;
	    c.stroke();
	    c.globalAlpha = 1;
	    // Draw second stroke element.
	    const r4 = r * 0.19;
	    this.a.rbs.r += this.computeRotation(this.a.rbs.r);
	    const x4 = rotateX(x, r3, this.a.rbs.r);
	    const y4 = rotateY(y, r3, this.a.rbs.r);
	    c.globalAlpha = this.a.rbs.t;
	    c.beginPath();
	    c.arc(x4, y4, r4, 2 * Math.PI, false);
	    c.fillStyle = this.c;
	    c.fill();
	    c.globalAlpha = 1;
	  }
	}

	/* eslint-disable no-restricted-syntax */

	class HomePage extends Page {
	  constructor(app) {
	    super(app);

	    // Shapes.
	    this.s = {
	      hero: new HeroShapes({}, this),
	    };
	  }

	  /**
	   * Add shapes on the canvas.
	   */
	  addShapes(canvas) {
	    forEachIn(Object.keys(this.s))(key => canvas.prepend(this.s[key]));
	  }

	  /**
	   * Remove shapes from the canvas.
	   */
	  removeShapes(canvas) {
	    forEachIn(Object.keys(this.s))(key => canvas.remove(this.s[key]));
	  }

	  mount() {
	    // Fix the header height
	    // on Safari iOS.
	    const isSafari = !!navigator.userAgent.match(/Version\/[\d.]+.*Safari/);
	    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
	    if (iOS && isSafari) {
	      requestAnimationFrame(() => {
	        document.querySelector('#hero').style.height = `${window.innerHeight}px`;
	      });
	    }

	    // Init all the necessary modules.
	    this.init(modules$1);

	    // Add shapes on the canvas.
	    this.addShapes(this.a.m.c2d.c);

	    // Turn on the global
	    // module C2D.
	    this.a.m.c2d.on();

	    // Turn on the
	    // scroll manager.
	    this.m.scroll.on();
	    this.m.scroll.onUp = v => {
	      this.s.hero.s = v;
	    };

	    // Turn on the
	    // Service Slider.
	    this.m.sslider.on();

	    // Animate the entrance of the hero elements.
	    const HeroSection = document.querySelector('#hero');
	    const HeroSectionElements = HeroSection.querySelectorAll('.txt-p-l');
	    Array.from(HeroSectionElements).forEach(el => el.style.transform = 'translate3d(0,100%,0)');

	    const HeroObserver = new IntersectionObserver((entries, observer) => {
	      for (const entry of entries) {
	        if (entry.isIntersecting) {
	          // Animate elements.
	          const d = 1500;
	          const delay = i => {
	            switch (i) {
	              case 2: return 300;
	              case 3: return 334;
	              default: return i * 200;
	            }
	          };
	          // Initialize shapes on canvas. 0.6727272727
	          const update = p => p >= 0.99 && this.s.hero.init();
	          animate({
	            el: HeroSectionElements,
	            d,
	            delay,
	            e: 'o6',
	            p: {
	              y: [110, 0],
	            },
	            update,
	          }).play();
	          // Stop the hero section observation.
	          observer.unobserve(entry.target);
	        }
	      }
	    });
	    HeroObserver.observe(HeroSection);
	  }

	  clean() {
	    this.a.m.c2d.off();
	    this.removeShapes(this.a.m.c2d.c);
	  }

	  /**
	   * When the menu is displayed.
	   */
	  pause() {
	    this.m.scroll.off();
	    this.m.sslider.off();
	  }

	  /**
	   * When the menu is closed.
	   */
	  resume() {
	    this.m.scroll.on();
	    this.m.sslider.on();
	  }
	}

	/* eslint-disable no-underscore-dangle */

	class AboutExplorer {

	  constructor(o) {
	    bindAll(this, ['_calc', '_run', '_resize']);

	    // Get the content container.
	    // The container is used to get the size.
	    this.c = {
	      // The DOM element.
	      el: o.container,
	      // The container width.
	      w: 0,
	      // The container height.
	      h: 0,
	    };

	    // Mouse Movement.
	    this.m = {
	      ticking: false,
	      x: {
	        // The current value.
	        c: 0,
	        // The target value.
	        t: 0,
	        // The last value.
	        l: 0,
	      },
	      y: {
	        // The current value.
	        c: 0,
	        // The target value.
	        t: 0,
	        // The last value.
	        l: 0,
	      },
	    };

	    // Viewport Width.
	    this.W = 0;

	    // Viewport Height.
	    this.H = 0;

	    // RequestAnimationFrame
	    // interface.
	    this.r = new Raf(this._run);

	    // Call resize to positionate
	    // elements.
	    this._resize();
	  }


	  /**
	   * Turn on the library.
	   */
	  on() {
	    // At the begining, place
	    // the page on center.
	    this.m.x.t = this.c.w / (this.c.w / this.W);
	    this.m.x.c = this.c.w / (this.c.w / this.W);
	    this.m.y.t = this.c.h / (this.c.h / this.H);
	    this.m.y.c = this.c.h / (this.c.h / this.H);

	    // Then run the loop
	    // And bind events.
	    this.r.run();
	    this._addEvents();
	  }


	  /**
	   * Turn off the library.
	   */
	  off() {
	    this.r.stop();
	    this._rmEvents();
	  }


	  _run() {
	    this.m.ticking = true;

	    // Compute.
	    this.m.x.c = round(lerp(this.m.x.c, this.m.x.t, 0.21), 3);
	    this.m.y.c = round(lerp(this.m.y.c, this.m.y.t, 0.21), 3);

	    // If the current value is equal to the last one,
	    // This means that we don't need anymore to run the loop.
	    if (this.m.x.c === this.m.x.l && this.m.y.c === this.m.y.l) {
	      this.r.stop();
	      this.m.ticking = false;
	    }

	    // Displace the container.
	    this.c.el.style.transform = `translate3d(${-1 * this.m.x.c}px,${-1 * this.m.y.c}px,0)`;

	    // Keep track of the last value.
	    this.m.x.l = this.m.x.c;
	    this.m.y.l = this.m.y.c;
	  }


	  _calc(e) {
	    this.m.x.t = e.pageX * ((this.c.w / this.W) - 1);
	    this.m.y.t = e.pageY * ((this.c.h / this.H) - 1);

	    this._clamp();

	    if (this.m.ticking === false) this.r.run();
	  }


	  _clamp() {
	    this.m.x.t = clamp(this.m.x.t, 0, (this.c.w - this.W));
	    this.m.y.t = clamp(this.m.y.t, 0, (this.c.h - this.H));
	  }


	  _resize() {
	    const b = this.c.el.getBoundingClientRect();
	    this.W = window.innerWidth;
	    this.H = window.innerHeight;

	    this.c.w = b.width;
	    this.c.h = b.height;

	    this._clamp();
	  }


	  _addEvents() {
	    window.addEventListener('resize', this._resize);
	    window.addEventListener('mousemove', this._calc);
	  }


	  _rmEvents() {
	    window.removeEventListener('mousemove', this._calc);
	    window.removeEventListener('resize', this._resize);
	  }


	}

	function init$7(app) {
	  console.log('Initialize the explorer');
	  return new AboutExplorer({
	    container: document.querySelector('.about-page'),
	  });
	}

	// Import a module (eg modals) and export it directly.

	var modules$2 = /*#__PURE__*/Object.freeze({
		explorer: init$7
	});

	class AboutPage extends Page {
	  mount() {
	    // Init all the necessary modules.
	    this.init(modules$2);

	    // Turn on the global
	    // module C2D.
	    this.a.m.c2d.on();

	    // Turn on the explorer.
	    this.m.explorer.on();
	  }

	  clean() {
	    this.a.m.c2d.off();
	  }
	}

	/* eslint-disable no-return-assign */

	/**
	 * Translate DOM coordinate to WebGL coordinate.
	 * @param {Number} y The DOM y-axis coordinate.
	 * @returns {Number}
	 */
	function getWebGLCoordinateFromDOM(y) {
	  return -1 * y;
	}

	function initializeScene(params) {
	  // Create couple of variables
	  // in order to control meshes externally.
	  const variables = {
	    opacity: 1,
	    needRender: true,
	    y: 0,
	  };

	  const { slides, viewport } = params;

	  // Create a scene.
	  const scene = new three.Scene();

	  // Create a camera.
	  // Make geometries use screen unit.
	  const perspective = 100;
	  const fov = (180 * (2 * Math.atan(viewport.height / 2 / perspective))) / Math.PI;
	  const camera = new three.PerspectiveCamera(fov, 2, 1, 2000);
	  camera.position.set(0, 0, perspective);
	  // camera.rotateZ(-1 * (Math.PI / 4));
	  // camera.rotateZ(-1 * (Math.PI / 6));

	  // Add meshes to the scene.
	  const planes = slides.map(slide => {
	    const geometry = new three.PlaneGeometry(1, 1);
	    const material = new three.MeshBasicMaterial({ map: slide.texture });
	    const plane = new three.Mesh(geometry, material);
	    scene.add(plane);

	    return plane;
	  });

	  /**
	   * @returns boolean
	   */
	  function needRender() {
	    return variables.needRender;
	  }

	  /**
	   *
	   * @param {WebGLRenderer} renderer
	   */
	  function render(renderer) {
	    const {
	      width: viewportWidth,
	      height: viewportHeight,
	    } = viewport;
	    camera.aspect = viewportWidth / viewportHeight;
	    camera.updateProjectionMatrix();

	    forEachIn(planes)((plane, index) => {
	      const {
	        y,
	        width,
	        height,
	      } = slides[index].bounds;
	      plane.position.y = getWebGLCoordinateFromDOM(y);
	      plane.scale.set(width, height, 1);
	    });

	    renderer.setScissor(0, 0, viewportWidth, viewportHeight);
	    renderer.setViewport(0, 0, viewportWidth, viewportHeight);
	    renderer.render(scene, camera);
	  }

	  return {
	    v: variables,
	    scene,
	    camera,
	    render,
	    needRender,
	  };
	}

	/* eslint-disable no-unused-expressions */

	/**
	 * @typedef ScrollParameters
	 * @type {Object}
	 * @property {Number=} upper The upper bound of scroll.
	 * @property {Number=} lower The lower bound of scroll.
	 * @property {Function} on The callback to call on each scroll operation.
	 * @property {Function} start The callback to call on start of a scroll operation.
	 * @property {Function} end The callback to call on end of a scroll operation.
	 */
	const defaultParameters = {
	  on: null,
	  start: null,
	  end: null,
	};

	/**
	 * @typedef ScrollInstance
	 * @type {Object}
	 * @property {Number} amount The current amount of scroll.
	 * @property {Function} on Enable listening
	 * @property {Function} off Turn off the listening.
	 * @property {Function} set Overrides the parameters.
	 */

	/**
	 * Initialize the scroll listeners.
	 * @param {ScrollParameters} params scroll parameters.
	 * @returns {ScrollInstance}
	 */
	function initializeScrollListener(params = {}) {
	  let instance = {};
	  // let callback = null;

	  let last = 0;
	  let target = 0;
	  let current = 0;
	  let direction = 0;
	  // let velocity = 0;
	  const rAF = { id: null, ticking: false };

	  const onScroll = { callback: null };
	  const onScrollEnd = { timer: null, callback: null };
	  const onScrollStart = { lock: false, callback: null };

	  const scrollObserver = new S({
	    el: document,
	    preventTouch: true,
	    mouseMultiplier: 0.618,
	    touchMultiplier: 2.4,
	  });

	  /**
	   * Run a loop to ease scroll
	   * and positionate slides.
	   */
	  function runLoop() {
	    rAF.ticking = true;

	    // Compute.
	    current += (target - current) * 0.07;
	    current = round(current, 3);

	    // If the current value is equal to the last one,
	    // This means that we don't need anymore to run the loop.
	    if (current === last) {
	      rAF.id = cancelAnimationFrame(runLoop);
	      rAF.ticking = false;
	    } else { rAF.id = requestAnimationFrame(runLoop); }

	    // Notify the onScroll listener.
	    if (typeof onScroll.callback === 'function') onScroll.callback(current);

	    // Keep track of the last value.
	    last = current;
	  }

	  function setTheEndOfTheScroll() {
	    // Call the callback
	    if (onScrollEnd.callback) onScrollEnd.callback();

	    // Unlock the onScrollStart lock.
	    onScrollStart.lock = false;
	  }

	  /**
	   * Get the scroll amount.
	   * @param {Event} event scroll event interface.
	   */
	  function takeScroll(event) {
	    // Notify the start event.
	    if (!onScrollStart.lock
	      && (typeof onScrollStart.callback === 'function')) {
	      onScrollStart.callback();
	      onScrollStart.lock = true;
	    }

	    // Calculate the target value.
	    const newTarget = target - event.deltaY;
	    direction = (newTarget - target) > 0 ? 1 : -1;
	    target = newTarget;

	    // Plan the end scroll in
	    // order to notify the listener.
	    onScrollEnd.timer && window.clearTimeout(onScrollEnd.timer);
	    onScrollEnd.timer = window.setTimeout(setTheEndOfTheScroll, 400);

	    if (rAF.ticking === false) rAF.id = requestAnimationFrame(runLoop);
	  }

	  /**
	   * Attach event listeners.
	   */
	  function addEvents() {
	    scrollObserver.on(takeScroll);
	  }

	  /**
	   * Dettach event listeners.
	   */
	  function removeEvents() {
	    scrollObserver.destroy();
	  }

	  /**
	   * Get parameters.
	   * @param {SliderParameters} parameters parameters.
	   */
	  function getParameters(parameters) {
	    const {
	      on,
	      start,
	      end,
	    } = Object.assign(defaultParameters, parameters);
	    onScroll.callback = on;
	    onScrollStart.callback = start;
	    onScrollEnd.callback = end;
	  }

	  instance = {
	    direction,
	    on: addEvents,
	    off: removeEvents,
	    set: getParameters,
	  };

	  instance.set(params);

	  Object.defineProperty(instance, 'amount', {
	    get: () => current,
	  });

	  return instance;
	}

	/* eslint-disable object-curly-newline */

	function instantiate() {
	  let isExpanded = false;

	  const filter = document.querySelector('.pp__filter');
	  const closer = filter.querySelector('.pp__filter__close-btn');
	  const wrapper = filter.querySelector('.pp__filter__content__overlay');
	  const links = Array.prototype.slice.call(filter.querySelectorAll('.pp__filter__option__link'));
	  const toggler = filter.querySelector('.pp__filter__toggler');
	  const icon = toggler.querySelector('.pp__filter__toggler__icon');
	  const labelOpen = toggler.querySelector('.pp__filter__toggler__label__open');
	  const labelClose = toggler.querySelector('.pp__filter__toggler__label__close');

	  const oTimeline = new Timeline();
	  const cTimeline = new Timeline();
	  const labelOtimeline = new Timeline();
	  const labelCtimeline = new Timeline();

	  // Filter opening
	  const iconHide = animate({ el: icon, e: 'o6', d: 800, p: { y: -120, opacity: 0 } });
	  const wrapperExpand = animate({ el: wrapper, e: 'o6', d: 800, p: { scaleX: 1 } });
	  const linksShow = animate({ el: links, d: 1200, e: 'o6', p: { y: 0 } });
	  const closerShow = animate({ el: closer, d: 1000, p: { opacity: 1 } });

	  const labelOpenHide = animate({ el: labelOpen, e: 'o6', p: { y: -120 } });
	  const labelCloseShow = animate({ el: labelClose, e: 'o6', p: { y: 0 } });
	  labelOtimeline
	    .add(labelOpenHide)
	    .add(labelCloseShow, 150);


	  oTimeline
	    .add(wrapperExpand)
	    .add(closerShow, `-=${closerShow.duration}`)
	    .add(linksShow, 150)
	    .add(iconHide, 0)
	    .add(labelOtimeline, `-=${labelOtimeline.duration - 150}`);


	  // Filter closing.
	  const iconShow = animate({ el: icon, d: 400, p: { y: 0, opacity: 1 } });
	  const linksHide = animate({ el: links, d: 200, p: { y: 120 } });
	  const wrapperCollapse = animate({ el: wrapper, d: 400, p: { scaleX: 0 } });
	  const closerHide = animate({ el: closer, d: 200, p: { opacity: 0 } });

	  const labelOpenShow = animate({ el: labelOpen, d: 400, p: { y: 0 } });
	  const labelCloseHide = animate({ el: labelClose, d: 400, p: { y: 100 } });
	  labelCtimeline
	    .add(labelCloseHide)
	    .add(labelOpenShow, 0);


	  cTimeline
	    .add(linksHide)
	    .add(closerHide, 0)
	    .add(wrapperCollapse, 0)
	    .add(iconShow, `-=${iconShow.duration}`)
	    .add(labelCtimeline, `-=${labelCtimeline.duration}`);


	  /**
	   * Initialize the scene.
	   * Place the different elements.
	   */
	  function initialize() {
	    closer.style.opacity = 0;
	    icon.style.opacity = 1;
	    icon.style.transform = 'translate3d(0,0,0)';
	    labelOpen.style.transform = 'translate3d(0,0,0)';
	    labelClose.style.transform = 'translate3d(0,120%,0)';
	    forEachIn(links)(link => { link.style.transform = 'translate3d(0,120%,0)'; });
	  }

	  /**
	   * Expand the filter.
	   * @returns {Promise}
	   */
	  function expand(event) {
	    event.preventDefault();
	    if (!isExpanded) {
	      isExpanded = true;
	      cTimeline.stop();
	      return new Promise(resolve => {
	        oTimeline.play({
	          cb: () => {
	            filter.classList.add('is-expanded');
	            resolve();
	          },
	        });
	      });
	    }
	    return Promise.resolve();
	  }

	  /**
	   * Collapse the filter.
	   * @returns {Promise}
	   */
	  function collapse(event) {
	    event.preventDefault();
	    if (isExpanded) {
	      isExpanded = false;
	      oTimeline.stop();
	      return new Promise(resolve => {
	        cTimeline.play({
	          cb: () => {
	            filter.classList.remove('is-expanded');
	            resolve();
	          },
	        });
	      });
	    }
	    return Promise.resolve();
	  }

	  /**
	   * Toggle the filter.
	   * @returns {Promise}
	   */
	  function toggle(event) {
	    if (!isExpanded) return expand(event);
	    return collapse(event);
	  }

	  /**
	   * Turn on the filter.
	   * Attach event listeners.
	   */
	  function on() {
	    toggler.addEventListener('click', toggle);
	    closer.addEventListener('click', collapse);
	  }

	  /**
	   * Turn off the filter.
	   * Remove event listeners.
	   */
	  function off() {
	    toggler.removeEventListener('click', toggle);
	    closer.removeEventListener('click', collapse);
	  }

	  return {
	    on,
	    off,
	    initialize,
	    expand,
	    toggle,
	    collapse,
	    isExpanded,
	  };
	}

	/* eslint-disable no-console */

	/**
	 * @typedef SlideBounds
	 * @type {Object}
	 * @property {Number} x The position on x-axis.
	 * @property {Number} y The position on y-axis.
	 * @property {Number} width The width of the slide.
	 * @property {Number} height The height of the slide.
	 * @property {Number} min The min y value.
	 * @property {Number} max The height of the slide.
	 */


	/**
	 * @typedef Slide
	 * @type {Object}
	 * @property {String} image The URL of the slide image.
	 * @property {SlideBounds} bounds The bounds of the slide.
	 */

	/**
	 * Wrap a value.
	 * When the value reach the end,
	 * start over again.
	 * @param {Number} min The minimum value of the range.
	 * @param {Number} max The maximum value of the range.
	 * @param {Number} value The value of the range.
	 * @returns {Number}
	 */
	function wrap(min, max, value) {
	  const range = max - min;
	  return (range + (value - min) % range) % range + min;
	}

	/**
	 * Get the dimension of a slide item.
	 * @param {{width:Number, height:Number}} viewport The viewport dimension.
	 * @returns {{width:Number, height:Number, gutter:Number}}
	 */
	function getSlideSize(viewport) {
	  const gutter = 24;
	  // const width = viewport.width * 0.3;
	  // const height = width / 1.5;
	  const height = viewport.height * 0.36;
	  const width = height * 1.5;

	  return { gutter, width, height };
	}

	/**
	 * Get the total length of an amount of slides.
	 * @param {Integer} num the number of slides.
	 * @param {{width:Number, height:Number}} viewport The current viewport size.
	 * @returns {Number} The total length.
	 */
	function getSlidesHeight(num, viewport) {
	  const {
	    height,
	    gutter,
	  } = getSlideSize(viewport);

	  return round(num * (height + gutter));
	}


	/**
	 * Get the Bounding of a slide.
	 * @param {Integer} index  The index of the slide.
	 * @param {{width: Number, height: Number}} viewport The relative viewport.
	 * @returns {SlideBounds}
	 */
	function getBoundingSlideRect(index, viewport) {
	  const {
	    width,
	    height,
	    gutter,
	  } = getSlideSize(viewport);

	  const bounds = {};
	  bounds.x = 0;
	  bounds.y = round(index * (height + gutter));
	  bounds.width = round(width);
	  bounds.height = round(height);
	  return bounds;
	}

	/**
	 * Compute the slides bounds.
	 * And returns some important dimensions:
	 * - Height of the slider
	 * - Max scroll size
	 * @param {[Slide]} slides An array of slide.
	 * @param {{ width: Number, height: Number }} viewport The viewport for relative positioning.
	 * @returns {{min: Number, max: Number, height: Number}}
	 */
	function computeSlidesBounds(slides, viewport) {
	  const forEachSlide = forEachIn(slides);
	  const slidesLength = slides.length;

	  // Get the bounds of each slide.
	  forEachSlide((slide, index) => (
	    slide.bounds = getBoundingSlideRect(index, viewport)
	  ));

	  // Since we know bounds.
	  // We can calculate now the slider height
	  // and the max scroll value.
	  const lastSlideBounds = slides[slides.length - 1].bounds;
	  const sliderHeight = lastSlideBounds.y + lastSlideBounds.height;
	  const maxScrollValue = sliderHeight;
	  const minScrollValue = 0;

	  // First item is at the
	  // center position.
	  // Divide the rest by two and
	  // align them proportionnally around
	  // the sides of the first one.
	  const slidesToRangeOnBottom = Math.ceil((slidesLength - 1) / 2);
	  const slidesToRangeOnTop = (slidesLength - 1) - slidesToRangeOnBottom;

	  const minValue = -(getSlidesHeight(slidesToRangeOnTop + 1, viewport));
	  const maxValue = getSlidesHeight(slidesToRangeOnBottom, viewport);

	  // Knowing the slider bounds.
	  // We're should clamp the scroll
	  // value of each slide too.
	  forEachSlide(slide => {
	    slide.bounds.min = minValue;
	    slide.bounds.max = maxValue;
	  });

	  return {
	    min: minScrollValue,
	    max: maxScrollValue,
	    height: sliderHeight,
	  };
	}

	/**
	 * Load image.
	 * @param {TextureLoader} loader
	 * @param {string} url
	 * @param {int} index
	 * @returns {Promise}
	 */
	function loadTexture(loader, url, index) {
	  return new Promise((resolve, reject) => {
	    if (!url) {
	      resolve({ texture: null, index });
	      return;
	    }

	    loader.load(
	      url,
	      texture => {
	        resolve({ texture, index });
	      },
	      undefined,
	      error => {
	        console.error('Failed to load texture');
	        reject(error);
	      },
	    );
	  });
	}

	/**
	 * Generate the slider slide collection.
	 * @param {array} items The items of the slider.
	 * @param {array} images The images.
	 * @returns {Promise}
	 */
	function generateSlideCollection(items, images) {
	  // Generate the slides items.
	  const promises = [];
	  const THREEtextureLoader = new three.TextureLoader();

	  const slides = items.map((item, index) => {
	    promises.push(
	      loadTexture(
	        THREEtextureLoader,
	        images[index],
	        index,
	      ),
	    );

	    return {
	      texture: null,
	      bounds: { x: 0, y: 0, width: 0, height: 0 },
	    };
	  });

	  return new Promise(resolve => {
	    Promise.all(promises).then(aLL => {
	      aLL.forEach(promise => {
	        const { texture, index } = promise;
	        slides[index].texture = texture;
	      });
	      resolve(slides);
	    });
	  });
	}


	/**
	 * @typedef SliderParameters
	 * @type {Object}
	 * @property {{prepend:  Function, remove: Function}} gl The canvas interface for adding WebGL Scenes.
	 * @property {NodeCollection} items The items of the slider.
	 * @property {NodeCollection} images The images of the items.
	 */


	/**
	 * @typedef SliderInstance
	 * @type {Object}
	 * @property {Function} on Turn on the slider.
	 * @property {Function} off Turn off the slider.
	 * @property {Function} pause Pause the slider.
	 * @property {Function} resume Resume the slider (after pausing).
	 */

	/**
	 * Create a new Slider instance.
	 * Slider knows about scroll and slides.
	 * @param {SliderParameters} params
	 * @returns SliderInstance
	 */
	function createSliderInstance(params) {
	  let isPaused = false;
	  let scroll = null;
	  let slides = null;
	  let scene = null;
	  let rAF = null;
	  let currentIndex = 0;

	  // Instantiate the filter controller.
	  const filterController = instantiate();

	  // System bouds.
	  const viewport = {
	    width: 0, // The width of the screen.
	    height: 0, // The height of the screen.
	  };

	  // Retrieve parameters.
	  const {
	    gl,
	    items,
	    images,
	  } = params;

	  /**
	   * Setting up the slider.
	   */
	  function setUp() {
	    return new Promise(resolve => {
	      // Init the scroll
	      // manager with initial params.
	      scroll = initializeScrollListener();

	      // Initialize filter.
	      filterController.initialize();

	      // Prepare slides.
	      // Generate them first,
	      // And set their initial bounds.
	      generateSlideCollection(items, images)
	        .then(slideElements => {
	          slides = slideElements;
	          setElementsBounds();

	          // Prepare the
	          // 3D scene.
	          scene = initializeScene({ slides, viewport });

	          resolve();
	        });
	    });
	  }

	  /**
	   * Compute the bounds of
	   * the slider world.
	   */
	  function setElementsBounds() {
	    // Process
	    // Take current bounds.
	    // Notify components.

	    // Get the screen sizes.
	    viewport.width = window.innerWidth;
	    viewport.height = window.innerHeight;

	    // Compute
	    // slides bounds.
	    const {
	      min, // The minimum scroll to see top.
	      max, // The maximum scroll to see bottom.
	      height, // The total height of slides.
	    } = computeSlidesBounds(slides, viewport);

	    // After computation,
	    // Notify others (scroll & scene)
	    scroll.set({
	      on: onScroll,
	      end: onScrollEnd,
	      start: onScrollStart,
	    });
	  }

	  /**
	   * Attach event listeners.
	   */
	  function addEvents() {
	    // Positionate slides.
	    onScroll();

	    // Enable scroll listening.
	    scroll.on();

	    // Enable the filter.
	    filterController.on();

	    // On resize,
	    // Re-calculate the bounds of elements.
	    window.addEventListener('resize', setElementsBounds);
	  }

	  function onScroll() {
	    // Get the current slide.
	    const slideHeight = getSlidesHeight(1, viewport);
	    const scrollLength = Math.abs(scroll.amount / slideHeight);
	    currentIndex = wrap(0, slides.length, Math.floor(scrollLength));
	    // console.log(currentIndex);

	    // Set the new position of each slides.
	    forEachIn(slides)((slide, index) => {
	      const translate = round(getBoundingSlideRect(index, viewport).y - scroll.amount, 3);
	      slide.bounds.y = wrap(slide.bounds.min, slide.bounds.max, translate);
	    });
	  }

	  function onScrollStart() {
	    // console.log(`Start: ${currentIndex}`);
	    // console.log(items[currentIndex]);
	    // Hide current slide item.
	    const item = items[0];
	    const itemTitle = item.querySelector('.project__title a');
	    const itemCategories = item.querySelectorAll('.project__categories .txt-p-l');
	    const itemActionLine = item.querySelector('.project__link__line');
	    const itemActionLabel = item.querySelector('.project__link__label .txt-p-l');

	    const duration = 400;
	    const easing = 'o4';
	    const titleHide = animate({ el: itemTitle, d: duration, p: { y: [0, 100] }, e: easing });
	    const categoriesHide = animate({ el: itemCategories, d: duration, p: { y: [0, 100] }, e: easing });
	    const actionLineHide = animate({ el: itemActionLine, d: 200, p: { scaleX: [1, 0] }, e: easing });
	    const actionLabelHide = animate({ el: itemActionLabel, d: duration, p: { y: [0, 100] }, e: easing });

	    const timeline = new Timeline();
	    timeline
	      .add(titleHide)
	      .add(categoriesHide, 0)
	      .add(actionLineHide, 0)
	      .add(actionLabelHide, 0);
	    timeline.play();
	  }

	  function onScrollEnd() {
	    // console.log(`End: ${currentIndex}`);
	    // Show current slide item.
	    const item = items[0];
	    const itemTitle = item.querySelector('.project__title a');
	    const itemCategories = item.querySelectorAll('.project__categories .txt-p-l');
	    const itemActionLine = item.querySelector('.project__link__line');
	    const itemActionLabel = item.querySelector('.project__link__label .txt-p-l');

	    const easing = 'o6';
	    const duration = 1000;
	    const titleShow = animate({ el: itemTitle, p: { y: [100, 0] }, e: easing, d: duration });
	    const categoriesShow = animate({ el: itemCategories, p: { y: [100, 0] }, e: easing, delay: i => i * 50, d: duration });
	    const actionLineShow = animate({ el: itemActionLine, p: { scaleX: [0, 1] }, e: easing, d: duration });
	    const actionLabelShow = animate({ el: itemActionLabel, p: { y: [100, 0] }, e: easing, d: duration });

	    const timeline = new Timeline();
	    timeline
	      .add(titleShow)
	      .add(categoriesShow, 100)
	      .add(actionLineShow, 0)
	      .add(actionLabelShow, 150);
	    timeline.play();
	  }

	  /**
	   * Dettach event listeners.
	   */
	  function removeEvents() {
	    if (rAF) rAF.stop();
	    // Stop listening the scroll.
	    scroll.off();
	    // Stop the filter.
	    filterController.off();
	    window.removeEventListener('resize', setElementsBounds);
	  }

	  /**
	   * Turn on the slider.
	   */
	  function turnOn() {
	    // Process
	    // Run entrance animation
	    // Add event listeners
	    // Add shapes on canvas.

	    addEvents();
	    gl.prepend(scene);
	  }

	  /**
	   * Turn off the slider.
	   */
	  function turnOff() {
	    // Process
	    // Destroy event listeners.
	    // Remove shapes from canvas.

	    removeEvents();
	    gl.remove(scene);
	    scroll = null;
	    slides = null;
	    scene = null;
	    rAF = null;
	  }

	  /**
	   * Pause the slider
	   * When the menu is open.
	   */
	  function pause() {
	    if (isPaused) return;
	    // Process (only if its not currently paused)
	    // Turn off event listeners.
	    // Set 3D Scene rendering to false.

	    removeEvents();
	    scene.v.needRender = false;
	    isPaused = true;
	  }

	  /**
	   * Resume the slider.
	   * When the menu is closed.
	   */
	  function resume() {
	    if (!isPaused) return;
	    // Process (only if it's currently paused)
	    // Turn on event listeners.
	    // Set 3D Scene rendering to true.

	    addEvents();
	    scene.v.needRender = true;
	    isPaused = false;
	  }

	  // Then, return our instance object.
	  return {
	    on: turnOn,
	    off: turnOff,
	    setUp,
	    pause,
	    resume,
	    slides,
	  };
	}

	function init$8(page) {
	  const items = [].slice.call(document.querySelectorAll('.pp__list__item'));
	  const images = items.map(item => item.dataset.src);

	  const slider = createSliderInstance({
	    gl: page.a.m.gl,
	    items,
	    images,
	  });
	  return slider;
	}

	// Import a module (eg modals) and export it directly.

	var modules$3 = /*#__PURE__*/Object.freeze({
		slider: init$8
	});

	class ProjectsPage extends Page {
	  constructor(app) {
	    super(app);
	    bindAll(this, ['menuOpenerClickHandler']);
	  }

	  menuOpenerClickHandler(e) {
	    e.preventDefault();
	    this.a.m.menu.open();
	    return false;
	  }

	  setUp() {
	    return new Promise(
	      // Some modules may need
	      // a certain delay to get ready
	      // before mounting the page.
	      resolve => {
	        // Init all the modules.
	        this.init(modules$3);
	        // The slider module needs
	        // to be set up before turned on.
	        this.m.slider.setUp().finally(resolve);
	      },
	    );
	  }

	  mount() {
	    // Turn on the global
	    // module C2D.
	    this.a.m.c2d.on();

	    // Turn on the
	    // project slider.
	    this.m.slider.on();

	    // Menu opener
	    document.querySelector('#pp-menu-opener')
	      .addEventListener('click', this.menuOpenerClickHandler);
	  }

	  /**
	   * Manually off modules from app.
	   */
	  clean() {
	    this.a.m.c2d.off();

	    // Menu opener
	    document.querySelector('#pp-menu-opener')
	      .removeEventListener('click', this.menuOpenerClickHandler);
	  }

	  /**
	   * Pause the page.
	   * When we open the menu,
	   * we need to momently pause activities
	   * inside the page.
	   */
	  pause() {
	    // Pause the
	    // project slider.
	    this.m.slider.pause();
	  }

	  /**
	   * After pausing a page,
	   * We need to resume the page.
	   */
	  resume() {
	    // Resume the
	    // project slider.
	    this.m.slider.resume();
	  }
	}



	var modules$4 = /*#__PURE__*/Object.freeze({

	});

	class ProjectDetailsPage extends Page {
	  mount() {
	    // Init all the necessary modules.
	    this.init(modules$4);

	    // Turn on the global
	    // module C2D.
	    this.a.m.c2d.on();
	  }

	  clean() {
	    this.a.m.c2d.off();
	  }
	}

	var Pages = {
	  home: app => new HomePage(app),
	  about: app => new AboutPage(app),
	  projects: app => new ProjectsPage(app),
	  'project-detail': app => new ProjectDetailsPage(app),
	};

	// Load all modules from the folder and save them in the variable


	class App {
	  constructor() {
	    // Store global modules
	    // in the app.
	    this.m = {};

	    // Store the current page.
	    this.p = null;

	    // Store informations about the current device.
	    this.d = null;
	  }

	  init() {

	    // Iterate through all modules, execute each module and
	    // submit the app (this) via Dependency Injection.
	    Object.keys(modules).forEach(key => {
	      this.m[key] = modules[key](this);
	    });

	    // Get the current page.
	    this.p = this.getCurrentPage(document.querySelector('#page'));
	  }

	  /**
	   * Runs the application.
	   */
	  run() {
	    // Initialize the app and its modules.
	    this.init();

	    // Turn on modules
	    // const { cursor } = this.m;

	    // Now we can mount the current page.
	    if (this.p) {
	      this.p
	        .setUp()
	        .finally(() => {
	          this.p.mount();
	        });
	    }

	    // Barba js
	    const app = this;
	    let transitionLock = false;
	    const Transition = barba.BaseTransition.extend({
	      start() {
	        transitionLock = true;
	        menu.close();
	        loader
	          .show()
	          .then(() => {
	            app.p.unmount();
	            transitionLock = false;
	          });

	        this.newContainerLoading.then(this.finish.bind(this));
	      },

	      finish() {
	        if (transitionLock) {
	          requestAnimationFrame(this.finish.bind(this));
	        } else {
	          // Remove the old container.
	          this.done();
	          // Get the current page
	          // Set it up
	          // Hide the loader and mount the page.
	          app.p = app.getCurrentPage(this.newContainer);
	          app.p
	            .setUp()
	            .finally(() => {
	              loader.hide();
	              app.p.mount();
	              cursor.interactionManager.on();
	            });
	        }
	      },
	    });
	    barba.Pjax.Dom.wrapperId = 'app';
	    barba.Pjax.Dom.containerClass = 'page';
	    barba.Pjax.getTransition = () => Transition;
	    barba.Pjax.start();
	  }

	  getCurrentPage(page) {
	    const key = page.getAttribute('data-key');

	    // eslint-disable-next-line no-prototype-builtins
	    if (Pages.hasOwnProperty(key)) {
	      /*eslint-disable-line */
	      return Pages[key](this);
	    }

	    throw new TypeError('This page is not registered.');
	  }
	}

	// We only have one app, so we can instantly create an instance.
	const app = new App();
	app.run();

	// optionally: save the app in Window,
	// so that we can easily access it from the Browser Console for debugging purposes.
	window.app = app;

}(Canvas, Renderable, three, createMouseExplorer, S, Drag));
