/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
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
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(1);
module.exports = __webpack_require__(4);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


if (typeof Promise === 'undefined') {
  window.Promise = __webpack_require__(2)
}

// Object.assign() is commonly used with React.
// It will use the native implementation if it's present and isn't buggy.
Object.assign = __webpack_require__(3)


/***/ }),
/* 2 */
/***/ (function(module, exports) {

(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (!(this instanceof Promise)) throw new TypeError('Promises must be constructed via new');
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
    Promise._immediateFn(function () {
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
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
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
    return new Promise(function (resolve, reject) {
      if (!arr || typeof arr.length === 'undefined') throw new TypeError('Promise.all accepts an array');
      var args = Array.prototype.slice.call(arr);
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

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(this);


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// CONCATENATED MODULE: ./src/events.js
var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Events=function(){function Events(){_classCallCheck(this,Events);this.handlers={};}_createClass(Events,[{key:"on",value:function on(event,handler){this.handlers[event]=this.handlers[event]||[];this.handlers[event].push(handler);return this.handlers[event];}},{key:"off",value:function off(event){if(this.handlers[event]){delete this.handlers[event];}}},{key:"trigger",value:function trigger(event,args){var _this=this;var arg=args||[];var funcs=this.handlers[event];if(funcs){return funcs.every(function(f){var ret=f.apply(_this,arg);return ret===false?false:true;});}return true;}}]);return Events;}();;/* harmony default export */ var events = (Events);
// CONCATENATED MODULE: ./src/utils.js
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};var utils={typeDecide:function typeDecide(o,type){return Object.prototype.toString.call(o)==="[object "+type+"]";},serializeObj:function serializeObj(obj){var parames='';Object.keys(obj).forEach(function(name){if(utils.typeDecide(obj[name],'Object')){parames+=name+'='+utils.stringify(obj[name]);}else{parames+=name+'='+obj[name]+'^';}});return encodeURIComponent(parames.substr(0,parames.length-1));},stringify:function stringify(obj){if(window.JSON&&window.JSON.stringify){return JSON.stringify(obj);}var t=typeof obj==="undefined"?"undefined":_typeof(obj);if(t!="object"||obj===null){// simple data type
if(t=="string")obj='"'+obj+'"';return String(obj);}else{// recurse array or object
var n,v,json=[],arr=obj&&obj.constructor==Array;// fix.
var self=arguments.callee;for(n in obj){if(obj.hasOwnProperty(n)){v=obj[n];t=typeof v==="undefined"?"undefined":_typeof(v);if(obj.hasOwnProperty(n)){if(t=="string")v='"'+v+'"';else if(t=="object"&&v!==null)// v = jQuery.stringify(v);
v=self(v);json.push((arr?"":'"'+n+'":')+String(v));}}}return(arr?"[":"{")+String(json)+(arr?"]":"}");}},assignObject:function assignObject(obj1,obj2){for(var name in obj2){if(obj2.hasOwnProperty(name)){obj1[name]=obj2[name];}}return obj1;}};/* harmony default export */ var src_utils = (utils);
// CONCATENATED MODULE: ./src/index.js
var src__createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function src__classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var src_Report=function(_Events){_inherits(Report,_Events);function Report(options){src__classCallCheck(this,Report);var _this=_possibleConstructorReturn(this,(Report.__proto__||Object.getPrototypeOf(Report)).call(this));var config={dataKey:'',//上报数据的属性名，用于服务器获取数据
mergeReport:true,// mergeReport 是否合并上报， false 关闭， true 启动（默认）
delay:1000,// 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
url:'',// 指定错误上报地址
getPath:'',// get请求路径
postPath:'',// post请求路径
random:1// 抽样上报，1~0 之间数值，1为100%上报（默认 1）
};_this.config=src_utils.assignObject(config,options);_this.queue={get:[],post:[]};_this.getUrl=_this.config.url+_this.config.getPath;_this.postUrl=_this.config.url+_this.config.postPath;return _this;}src__createClass(Report,[{key:'reportByGet',value:function reportByGet(data,cb){this.sendData('get',data,cb);}},{key:'reportByPost',value:function reportByPost(data,cb){this.sendData('post',data,cb);}},{key:'sendData',value:function sendData(type,data,cb){if(this.catchData(type,data)){this.delayReport(cb);}}},{key:'delayReport',value:function delayReport(cb){var _this2=this;if(!this.trigger('beforeReport'))return;var delay=this.config.mergeReport?this.config.delay:0;setTimeout(function(){if(!_this2.trigger('beforeSend'))return;_this2.report(cb);},delay);}// push数据到pool
},{key:'catchData',value:function catchData(type,data){var rnd=Math.random();if(rnd>=this.config.random){return false;}this.queue[type].push(data);return this.queue[type];}},{key:'report',value:function report(cb){var _this3=this;Promise.all([this.getRequest(),this.postRequest()]).then(function(urls){_this3.trigger('afterReport');cb&&cb.call(_this3,urls);});}},{key:'getRequest',value:function getRequest(){var _this4=this;return new Promise(function(resolve){if(_this4.queue.get.length===0){resolve();}else{var parames=_this4._getParames('get');var url=_this4.getUrl+'?'+_this4.config.dataKey+'='+parames;var img=new window.Image();img.onload=function(){resolve(parames);};img.src=url;}});}},{key:'postRequest',value:function postRequest(){var _this5=this;return new Promise(function(resolve){if(_this5.queue.post.length===0){resolve();}else{var parames=_this5._getParames('post');var xmlhttp=new XMLHttpRequest();xmlhttp.onreadystatechange=function(){if(xmlhttp.readyState==4&&xmlhttp.status==200){resolve(parames);}};xmlhttp.open("POST",_this5.postUrl,true);xmlhttp.setRequestHeader("Content-Type","application/json");var data={};data[_this5.config.dataKey]=parames;xmlhttp.send(JSON.stringify(data));}});}},{key:'_getParames',value:function _getParames(type){var queue=this.queue[type];var mergeReport=this.config.mergeReport;var curQueue=mergeReport?queue:[queue.shift()];if(mergeReport)this.queue[type]=[];var parames=curQueue.map(function(obj){return src_utils.serializeObj(obj);}).join('|');return parames;}}]);return Report;}(events);;/* harmony default export */ var src = (src_Report);
// CONCATENATED MODULE: ./src/view/index/index.js
/**
 * @author xiaojue
 * @fileoverview 前端信息上报demo
 * @date 2018/01/04
 */var rep=new src({dataKey:'err_msg',//上报数据的属性名，用于服务器获取数据
mergeReport:true,// mergeReport 是否合并上报， false 关闭， true 启动（默认）
delay:1000,// 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
url:'http://localhost:80',// 指定错误上报地址
getPath:'/read.gif',// get请求路径
postPath:'/post/jserr',// post请求路径
random:1// 抽样上报，1~0 之间数值，1为100%上报（默认 1）
});rep.on('afterReport',function(){console.log('afterReport');});rep.reportByPost({msg:'1111'},function(data){console.log(data);});

/***/ })
/******/ ]);