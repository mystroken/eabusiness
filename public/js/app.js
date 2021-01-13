!function(){"use strict";function t(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function e(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function n(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}function r(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&u(t,e)}function o(t){return(o=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function u(t,e){return(u=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function i(t,e){return!e||"object"!=typeof e&&"function"!=typeof e?function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}(t):e}function c(t){var e=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=o(t);if(e){var u=o(this).constructor;n=Reflect.construct(r,arguments,u)}else n=r.apply(this,arguments);return i(this,n)}}var f=Object.freeze({__proto__:null}),a=function(){function e(n){t(this,e),this.a=n,this.m={}}return n(e,[{key:"setUp",value:function(){return Promise.resolve()}},{key:"mount",value:function(){throw new TypeError("".concat(this.toString(),": You must implement the mount method."))}},{key:"unmount",value:function(){var t=this;this.clean(),Object.keys(this.m).forEach((function(e){return t.m[e].off()}))}},{key:"init",value:function(t){var e=this;Object.keys(t).forEach((function(n){e.m[n]=t[n](e)}))}},{key:"clean",value:function(){}},{key:"pause",value:function(){console.info("This page does not implement pause function")}},{key:"resume",value:function(){console.info("This page does not implement resume function")}}]),e}(),s=Object.freeze({__proto__:null}),l=function(e){r(u,e);var o=c(u);function u(){return t(this,u),o.apply(this,arguments)}return n(u,[{key:"mount",value:function(){this.init(s)}},{key:"clean",value:function(){}},{key:"pause",value:function(){}},{key:"resume",value:function(){}}]),u}(a),p=Object.freeze({__proto__:null}),h=function(e){r(u,e);var o=c(u);function u(){return t(this,u),o.apply(this,arguments)}return n(u,[{key:"mount",value:function(){this.init(p)}},{key:"clean",value:function(){}}]),u}(a),y={home:function(t){return new l(t)},about:function(t){return new h(t)},contact:function(t){return new h(t)}},v=new(function(){function e(){t(this,e),this.m={},this.p=null,this.d=null}return n(e,[{key:"init",value:function(){var t=this;Object.keys(f).forEach((function(e){t.m[e]=f[e](t)})),this.p=this.getCurrentPage(document.querySelector("#page"))}},{key:"run",value:function(){var t=this;this.init(),this.p&&this.p.setUp().finally((function(){t.p.mount()}))}},{key:"getCurrentPage",value:function(t){var e=t.getAttribute("data-key");if(y.hasOwnProperty(e))return y[e](this);throw new TypeError("This page is not registered.")}}]),e}());v.run(),window.app=v}();
