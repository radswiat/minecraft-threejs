!function(t){var n={};function e(r){if(n[r])return n[r].exports;var o=n[r]={i:r,l:!1,exports:{}};return t[r].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.d=function(t,n,r){e.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:r})},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="/",e(e.s=7)}([
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_descriptors.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){t.exports=!e(/*! ./_fails */6)(function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a})},
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-object.js ***!
  \************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},
/*!**********************************************!*\
  !*** ./src/app/threejs/utils/_is-defined.js ***!
  \**********************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(t){return void 0!==t}},
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_global.js ***!
  \*********************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n){var e=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=e)},
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_core.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n){var e=t.exports={version:"2.5.7"};"number"==typeof __e&&(__e=e)},
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dp.js ***!
  \************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){var r=e(/*! ./_an-object */21),o=e(/*! ./_ie8-dom-define */22),u=e(/*! ./_to-primitive */24),i=Object.defineProperty;n.f=e(/*! ./_descriptors */0)?Object.defineProperty:function(t,n,e){if(r(t),n=u(n,!0),r(e),o)try{return i(t,n,e)}catch(t){}if("get"in e||"set"in e)throw TypeError("Accessors not supported!");return"value"in e&&(t[n]=e.value),t}},
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_fails.js ***!
  \********************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n){t.exports=function(t){try{return!!t()}catch(t){return!0}}},
/*!***************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib!./src/app/threejs/modules/chunk/noise.worker.js ***!
  \***************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";var r=e(/*! noisejs */8),o=e(/*! ../../utils */9);self.addEventListener("message",function(t){for(var n=t.data,e=n.seed,u=n.chunkSize,i=new r.Noise(e),a={},f=n.chunkLocation,c=n.mod,s=function(t){return t>.2},l=function(t,n,e){if(void 0!==a[t+"_"+n+"_"+e])return a[t+"_"+n+"_"+e].noiseValue;var r=i.perlin3(t/c,n/c,e/c);return r+=(8-n)/10},d=function(t,n,e){return s(l(t,n,e))},p=u/2*-1;p<=u/2;p++)for(var h=u/2*-1;h<=u/2;h++)for(var v=u/2*-1;v<=u/2;v++){var y=f.y*u+p,x=h,_=f.x*u+v,M=l(y,x,_);if(s(M)){var m={px:d(y+1,x,_),nx:d(y-1,x,_),py:d(y,x+1,_),pz:d(y,x,_+1),nz:d(y,x,_-1),ny:d(y,x-1,_)},w=0;x>(0,o.random)(10,12)&&(w=2),x<(0,o.random)(1,4)&&(w=1),a[y+"_"+x+"_"+_]={location:{x:y,y:x,z:_},surrounding:m,noiseValue:M,material:w}}}for(var b=function(t,n,e){a[t+"_"+n+"_"+e]={location:{x:t,y:n,z:e},surrounding:{px:!1,nx:!1,py:!1,pz:!1,nz:!1,ny:!1},noiseValue:l(t,n,e),material:3}},g=function(t,n,e){a[t+"_"+n+"_"+e]={location:{x:t,y:n,z:e},surrounding:{px:!1,nx:!1,py:!1,pz:!1,nz:!1,ny:!1},noiseValue:l(t,n,e),material:4}},P=function(t,n){for(var e=t.x,r=t.z,o=t.y,u=0,i=1-n;n>=u;)g(n+e,o,u+r),g(u+e,o,n+r),g(-n+e,o,u+r),g(-u+e,o,n+r),g(-n+e,o,-u+r),g(-u+e,o,-n+r),g(n+e,o,-u+r),g(u+e,o,-n+r),u++,i+=i<=0?2*o+1:2*(o- --n)+1},z=function(t){var n;if(!(u-t.y<6)){var e=Math.round(Math.round(Math.abs(100*i.simplex3(t.x/150,t.y/150,t.z/150)))/10*3/2);for(e<3&&(e=3),n=t.y;n<=t.y+e;n++)b(t.x,n,t.z);g(t.x,n,t.z),P({x:t.x,y:n-1,z:t.z},1),P({x:t.x,y:n-2,z:t.z},1),P({x:t.x,y:n-2,z:t.z},2)}},j=(Math.round((0,o.random)(5,10)),0);j<Math.round(100*Math.abs(i.perlin2(Math.abs(f.x)/22,Math.abs(f.y)/22)));j++){for(var O=f.y*u+Math.round((0,o.random)(-10,10)),E=f.x*u+Math.round((0,o.random)(-10,10)),S=null,D=-13;D<=13;D++)void 0!==a[O+"_"+D+"_"+E]&&(S=D+1);S&&z({x:O,y:S,z:E})}self.postMessage(a)},!1)},
/*!***************************************!*\
  !*** ./node_modules/noisejs/index.js ***!
  \***************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){!function(t){function n(t){function n(t,n,e){this.x=t,this.y=n,this.z=e}n.prototype.dot2=function(t,n){return this.x*t+this.y*n},n.prototype.dot3=function(t,n,e){return this.x*t+this.y*n+this.z*e},this.grad3=[new n(1,1,0),new n(-1,1,0),new n(1,-1,0),new n(-1,-1,0),new n(1,0,1),new n(-1,0,1),new n(1,0,-1),new n(-1,0,-1),new n(0,1,1),new n(0,-1,1),new n(0,1,-1),new n(0,-1,-1)],this.p=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],this.perm=new Array(512),this.gradP=new Array(512),this.seed(t||0)}n.prototype.seed=function(t){t>0&&t<1&&(t*=65536),(t=Math.floor(t))<256&&(t|=t<<8);for(var n=this.p,e=0;e<256;e++){var r;r=1&e?n[e]^255&t:n[e]^t>>8&255;var o=this.perm,u=this.gradP;o[e]=o[e+256]=r,u[e]=u[e+256]=this.grad3[r%12]}};var e=.5*(Math.sqrt(3)-1),r=(3-Math.sqrt(3))/6,o=1/6;function u(t){return t*t*t*(t*(6*t-15)+10)}function i(t,n,e){return(1-e)*t+e*n}n.prototype.simplex2=function(t,n){var o,u,i=(t+n)*e,a=Math.floor(t+i),f=Math.floor(n+i),c=(a+f)*r,s=t-a+c,l=n-f+c;s>l?(o=1,u=0):(o=0,u=1);var d=s-o+r,p=l-u+r,h=s-1+2*r,v=l-1+2*r;a&=255,f&=255;var y=this.perm,x=this.gradP,_=x[a+y[f]],M=x[a+o+y[f+u]],m=x[a+1+y[f+1]],w=.5-s*s-l*l,b=.5-d*d-p*p,g=.5-h*h-v*v;return 70*((w<0?0:(w*=w)*w*_.dot2(s,l))+(b<0?0:(b*=b)*b*M.dot2(d,p))+(g<0?0:(g*=g)*g*m.dot2(h,v)))},n.prototype.simplex3=function(t,n,e){var r,u,i,a,f,c,s=(t+n+e)*(1/3),l=Math.floor(t+s),d=Math.floor(n+s),p=Math.floor(e+s),h=(l+d+p)*o,v=t-l+h,y=n-d+h,x=e-p+h;v>=y?y>=x?(r=1,u=0,i=0,a=1,f=1,c=0):v>=x?(r=1,u=0,i=0,a=1,f=0,c=1):(r=0,u=0,i=1,a=1,f=0,c=1):y<x?(r=0,u=0,i=1,a=0,f=1,c=1):v<x?(r=0,u=1,i=0,a=0,f=1,c=1):(r=0,u=1,i=0,a=1,f=1,c=0);var _=v-r+o,M=y-u+o,m=x-i+o,w=v-a+2*o,b=y-f+2*o,g=x-c+2*o,P=v-1+.5,z=y-1+.5,j=x-1+.5;l&=255,d&=255,p&=255;var O=this.perm,E=this.gradP,S=E[l+O[d+O[p]]],D=E[l+r+O[d+u+O[p+i]]],F=E[l+a+O[d+f+O[p+c]]],T=E[l+1+O[d+1+O[p+1]]],k=.5-v*v-y*y-x*x,A=.5-_*_-M*M-m*m,R=.5-w*w-b*b-g*g,V=.5-P*P-z*z-j*j;return 32*((k<0?0:(k*=k)*k*S.dot3(v,y,x))+(A<0?0:(A*=A)*A*D.dot3(_,M,m))+(R<0?0:(R*=R)*R*F.dot3(w,b,g))+(V<0?0:(V*=V)*V*T.dot3(P,z,j)))},n.prototype.perlin2=function(t,n){var e=Math.floor(t),r=Math.floor(n);t-=e,n-=r,e&=255,r&=255;var o=this.perm,a=this.gradP,f=a[e+o[r]].dot2(t,n),c=a[e+o[r+1]].dot2(t,n-1),s=a[e+1+o[r]].dot2(t-1,n),l=a[e+1+o[r+1]].dot2(t-1,n-1),d=u(t);return i(i(f,s,d),i(c,l,d),u(n))},n.prototype.perlin3=function(t,n,e){var r=Math.floor(t),o=Math.floor(n),a=Math.floor(e);t-=r,n-=o,e-=a,r&=255,o&=255,a&=255;var f=this.perm,c=this.gradP,s=c[r+f[o+f[a]]].dot3(t,n,e),l=c[r+f[o+f[a+1]]].dot3(t,n,e-1),d=c[r+f[o+1+f[a]]].dot3(t,n-1,e),p=c[r+f[o+1+f[a+1]]].dot3(t,n-1,e-1),h=c[r+1+f[o+f[a]]].dot3(t-1,n,e),v=c[r+1+f[o+f[a+1]]].dot3(t-1,n,e-1),y=c[r+1+f[o+1+f[a]]].dot3(t-1,n-1,e),x=c[r+1+f[o+1+f[a+1]]].dot3(t-1,n-1,e-1),_=u(t),M=u(n),m=u(e);return i(i(i(s,h,_),i(l,v,_),m),i(i(d,y,_),i(p,x,_),m),M)},t.Noise=n}(t.exports)},
/*!****************************************!*\
  !*** ./src/app/threejs/utils/index.js ***!
  \****************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.toRad=n.toDeg=n.random=n.Perf=n.isDefined=n.degAbs=void 0;var r=c(e(/*! ./_deg-abs */10)),o=c(e(/*! ./_is-defined */2)),u=c(e(/*! ./_perf */11)),i=c(e(/*! ./_random */27)),a=c(e(/*! ./_to-deg */28)),f=c(e(/*! ./_to-rad */29));function c(t){return t&&t.__esModule?t:{default:t}}n.degAbs=r.default,n.isDefined=o.default,n.Perf=u.default,n.random=i.default,n.toDeg=a.default,n.toRad=f.default},
/*!*******************************************!*\
  !*** ./src/app/threejs/utils/_deg-abs.js ***!
  \*******************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(t){return t-360*Math.floor(t/360)}},
/*!****************************************!*\
  !*** ./src/app/threejs/utils/_perf.js ***!
  \****************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var r,o,u=f(e(/*! babel-runtime/helpers/classCallCheck */12)),i=f(e(/*! babel-runtime/helpers/createClass */13)),a=f(e(/*! ./_is-defined */2));function f(t){return t&&t.__esModule?t:{default:t}}var c=function(){function t(n){(0,u.default)(this,t),this.name=n,this.timeStart=(new Date).getTime()}return(0,i.default)(t,[{key:"end",value:function(){this.timeEnd=(new Date).getTime(),console.log("%c "+this.name+" in "+(this.timeEnd-this.timeStart)/1e3+"s","color: blue; font-size: 12px; background: #95D7FF; padding: 1px 5px;")}}]),t}(),s=(o=r=function(){function t(){(0,u.default)(this,t)}return(0,i.default)(t,null,[{key:"get",value:function(n){return(0,a.default)(t.instances[n])||(t.instances[n]=new c(n)),t.instances[n]}}]),t}(),r.instances={},o);n.default=s},
/*!**************************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/classCallCheck.js ***!
  \**************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";n.__esModule=!0,n.default=function(t,n){if(!(t instanceof n))throw new TypeError("Cannot call a class as a function")}},
/*!***********************************************************!*\
  !*** ./node_modules/babel-runtime/helpers/createClass.js ***!
  \***********************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";n.__esModule=!0;var r=function(t){return t&&t.__esModule?t:{default:t}}(e(/*! ../core-js/object/define-property */14));n.default=function(){function t(t,n){for(var e=0;e<n.length;e++){var o=n[e];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),(0,r.default)(t,o.key,o)}}return function(n,e,r){return e&&t(n.prototype,e),r&&t(n,r),n}}()},
/*!**********************************************************************!*\
  !*** ./node_modules/babel-runtime/core-js/object/define-property.js ***!
  \**********************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){t.exports={default:e(/*! core-js/library/fn/object/define-property */15),__esModule:!0}},
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/define-property.js ***!
  \*******************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){e(/*! ../../modules/es6.object.define-property */16);var r=e(/*! ../../modules/_core */4).Object;t.exports=function(t,n,e){return r.defineProperty(t,n,e)}},
/*!****************************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.define-property.js ***!
  \****************************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){var r=e(/*! ./_export */17);r(r.S+r.F*!e(/*! ./_descriptors */0),"Object",{defineProperty:e(/*! ./_object-dp */5).f})},
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_export.js ***!
  \*********************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){var r=e(/*! ./_global */3),o=e(/*! ./_core */4),u=e(/*! ./_ctx */18),i=e(/*! ./_hide */20),a=e(/*! ./_has */26),f=function(t,n,e){var c,s,l,d=t&f.F,p=t&f.G,h=t&f.S,v=t&f.P,y=t&f.B,x=t&f.W,_=p?o:o[n]||(o[n]={}),M=_.prototype,m=p?r:h?r[n]:(r[n]||{}).prototype;for(c in p&&(e=n),e)(s=!d&&m&&void 0!==m[c])&&a(_,c)||(l=s?m[c]:e[c],_[c]=p&&"function"!=typeof m[c]?e[c]:y&&s?u(l,r):x&&m[c]==l?function(t){var n=function(n,e,r){if(this instanceof t){switch(arguments.length){case 0:return new t;case 1:return new t(n);case 2:return new t(n,e)}return new t(n,e,r)}return t.apply(this,arguments)};return n.prototype=t.prototype,n}(l):v&&"function"==typeof l?u(Function.call,l):l,v&&((_.virtual||(_.virtual={}))[c]=l,t&f.R&&M&&!M[c]&&i(M,c,l)))};f.F=1,f.G=2,f.S=4,f.P=8,f.B=16,f.W=32,f.U=64,f.R=128,t.exports=f},
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ctx.js ***!
  \******************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){var r=e(/*! ./_a-function */19);t.exports=function(t,n,e){if(r(t),void 0===n)return t;switch(e){case 1:return function(e){return t.call(n,e)};case 2:return function(e,r){return t.call(n,e,r)};case 3:return function(e,r,o){return t.call(n,e,r,o)}}return function(){return t.apply(n,arguments)}}},
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_a-function.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_hide.js ***!
  \*******************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){var r=e(/*! ./_object-dp */5),o=e(/*! ./_property-desc */25);t.exports=e(/*! ./_descriptors */0)?function(t,n,e){return r.f(t,n,o(1,e))}:function(t,n,e){return t[n]=e,t}},
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_an-object.js ***!
  \************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){var r=e(/*! ./_is-object */1);t.exports=function(t){if(!r(t))throw TypeError(t+" is not an object!");return t}},
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ie8-dom-define.js ***!
  \*****************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){t.exports=!e(/*! ./_descriptors */0)&&!e(/*! ./_fails */6)(function(){return 7!=Object.defineProperty(e(/*! ./_dom-create */23)("div"),"a",{get:function(){return 7}}).a})},
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_dom-create.js ***!
  \*************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){var r=e(/*! ./_is-object */1),o=e(/*! ./_global */3).document,u=r(o)&&r(o.createElement);t.exports=function(t){return u?o.createElement(t):{}}},
/*!***************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-primitive.js ***!
  \***************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){var r=e(/*! ./_is-object */1);t.exports=function(t,n){if(!r(t))return t;var e,o;if(n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;if("function"==typeof(e=t.valueOf)&&!r(o=e.call(t)))return o;if(!n&&"function"==typeof(e=t.toString)&&!r(o=e.call(t)))return o;throw TypeError("Can't convert object to primitive value")}},
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_property-desc.js ***!
  \****************************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n){t.exports=function(t,n){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:n}}},
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_has.js ***!
  \******************************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n){var e={}.hasOwnProperty;t.exports=function(t,n){return e.call(t,n)}},
/*!******************************************!*\
  !*** ./src/app/threejs/utils/_random.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(t,n){return Math.random()*(n-t)+t}},
/*!******************************************!*\
  !*** ./src/app/threejs/utils/_to-deg.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(t){return 180*t/Math.PI}},
/*!******************************************!*\
  !*** ./src/app/threejs/utils/_to-rad.js ***!
  \******************************************/
/*! dynamic exports provided */
/*! all exports used */function(t,n,e){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=function(t){return t*Math.PI/180}}]);