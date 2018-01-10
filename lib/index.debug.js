(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fe-report"] = factory();
	else
		root["fe-report"] = factory();
})(typeof self !== 'undefined' ? self : this, function() {
return /******/ (function(modules) { // webpackBootstrap
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__events__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__utils__ = __webpack_require__(2);
var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self,call){if(!self){throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call&&(typeof call==="object"||typeof call==="function")?call:self;}function _inherits(subClass,superClass){if(typeof superClass!=="function"&&superClass!==null){throw new TypeError("Super expression must either be null or a function, not "+typeof superClass);}subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,enumerable:false,writable:true,configurable:true}});if(superClass)Object.setPrototypeOf?Object.setPrototypeOf(subClass,superClass):subClass.__proto__=superClass;}var Report=function(_Events){_inherits(Report,_Events);function Report(options){_classCallCheck(this,Report);var _this=_possibleConstructorReturn(this,(Report.__proto__||Object.getPrototypeOf(Report)).call(this));var config={dataKey:'',//上报数据的属性名，用于服务器获取数据
mergeReport:true,// mergeReport 是否合并上报， false 关闭， true 启动（默认）
delay:1000,// 当 mergeReport 为 true 可用，延迟多少毫秒，合并缓冲区中的上报（默认）
url:'',// 指定错误上报地址
getPath:'',// get请求路径
postPath:'',// post请求路径
random:1// 抽样上报，1~0 之间数值，1为100%上报（默认 1）
};_this.config=__WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].assignObject(config,options);_this.queue={get:[],post:[]};_this.getUrl=_this.config.url+_this.config.getPath;_this.postUrl=_this.config.url+_this.config.postPath;return _this;}_createClass(Report,[{key:'reportByGet',value:function reportByGet(data){this.sendData('get',data);}},{key:'reportByPost',value:function reportByPost(data){this.sendData('post',data);}},{key:'sendData',value:function sendData(type,data){if(this.catchData(type,data)){this.delayReport();}}},{key:'delayReport',value:function delayReport(cb){var _this2=this;if(!this.trigger('beforeReport'))return;var delay=this.config.mergeReport?this.config.delay:0;setTimeout(function(){if(!_this2.trigger('beforeSend'))return;_this2.report(cb);},delay);}// push数据到pool
},{key:'catchData',value:function catchData(type,data){var rnd=Math.random();if(rnd>=this.config.random){return false;}this.queue[type].push(data);return this.queue[type];}},{key:'report',value:function report(cb){var _this3=this;Promise.all([this.getRequest(),this.postRequest()]).then(function(urls){_this3.trigger('afterReport');cb&&cb.call(_this3,urls);});}},{key:'getRequest',value:function getRequest(){var _this4=this;return new Promise(function(resolve){if(_this4.queue.get.length===0){resolve();}else{var parames=_this4._getParames('get');var url=_this4.getUrl+'?'+_this4.config.dataKey+'='+parames;var img=new window.Image();img.onload=function(){resolve(parames);};img.src=url;}});}},{key:'postRequest',value:function postRequest(){var _this5=this;return new Promise(function(resolve){if(_this5.queue.post.length===0){resolve();}else{var parames=_this5._getParames('post');var xmlhttp=new XMLHttpRequest();xmlhttp.onreadystatechange=function(){if(xmlhttp.readyState==4&&xmlhttp.status==200){resolve(parames);}};xmlhttp.open("POST",_this5.postUrl,true);xmlhttp.setRequestHeader("Content-Type","application/json");var data={};data[_this5.config.dataKey]=parames;xmlhttp.send(JSON.stringify(data));}});}},{key:'_getParames',value:function _getParames(type){var queue=this.queue[type];var mergeReport=this.config.mergeReport;var curQueue=mergeReport?queue:[queue.shift()];if(mergeReport)this.queue[type]=[];var parames=curQueue.map(function(obj){return __WEBPACK_IMPORTED_MODULE_1__utils__["a" /* default */].serializeObj(obj);}).join('|');return parames;}}]);return Report;}(__WEBPACK_IMPORTED_MODULE_0__events__["a" /* default */]);;/* harmony default export */ __webpack_exports__["default"] = (Report);

/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if("value"in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor);}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor;};}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError("Cannot call a class as a function");}}var Events=function(){function Events(){_classCallCheck(this,Events);this.handlers={};}_createClass(Events,[{key:"on",value:function on(event,handler){this.handlers[event]=this.handlers[event]||[];this.handlers[event].push(handler);return this.handlers[event];}},{key:"off",value:function off(event){if(this.handlers[event]){delete this.handlers[event];}}},{key:"trigger",value:function trigger(event,args){var _this=this;var arg=args||[];var funcs=this.handlers[event];if(funcs){return funcs.every(function(f){var ret=f.apply(_this,arg);return ret===false?false:true;});}return true;}}]);return Events;}();;/* harmony default export */ __webpack_exports__["a"] = (Events);

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var _typeof=typeof Symbol==="function"&&typeof Symbol.iterator==="symbol"?function(obj){return typeof obj;}:function(obj){return obj&&typeof Symbol==="function"&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj;};var utils={typeDecide:function typeDecide(o,type){return Object.prototype.toString.call(o)==="[object "+type+"]";},serializeObj:function serializeObj(obj){var parames='';Object.keys(obj).forEach(function(name){if(utils.typeDecide(obj[name],'Object')){parames+=name+'='+utils.stringify(obj[name]);}else{parames+=name+'='+obj[name]+'^';}});return encodeURIComponent(parames.substr(0,parames.length-1));},stringify:function stringify(obj){if(window.JSON&&window.JSON.stringify){return JSON.stringify(obj);}var t=typeof obj==="undefined"?"undefined":_typeof(obj);if(t!="object"||obj===null){// simple data type
if(t=="string")obj='"'+obj+'"';return String(obj);}else{// recurse array or object
var n,v,json=[],arr=obj&&obj.constructor==Array;// fix.
var self=arguments.callee;for(n in obj){if(obj.hasOwnProperty(n)){v=obj[n];t=typeof v==="undefined"?"undefined":_typeof(v);if(obj.hasOwnProperty(n)){if(t=="string")v='"'+v+'"';else if(t=="object"&&v!==null)// v = jQuery.stringify(v);
v=self(v);json.push((arr?"":'"'+n+'":')+String(v));}}}return(arr?"[":"{")+String(json)+(arr?"]":"}");}},assignObject:function assignObject(obj1,obj2){for(var name in obj2){if(obj2.hasOwnProperty(name)){obj1[name]=obj2[name];}}return obj1;}};/* harmony default export */ __webpack_exports__["a"] = (utils);

/***/ })
/******/ ]);
});