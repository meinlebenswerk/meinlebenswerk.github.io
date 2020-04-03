var pandaemic_lib=function(e){var t={};function i(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,i),r.l=!0,r.exports}return i.m=e,i.c=t,i.d=function(e,t,n){i.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},i.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},i.t=function(e,t){if(1&t&&(e=i(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(i.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)i.d(n,r,function(t){return e[t]}.bind(null,r));return n},i.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return i.d(t,"a",t),t},i.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},i.p="/",i(i.s=6)}([function(e,t,i){"use strict";(function(e){Object.defineProperty(t,"__esModule",{value:!0}),t.parameter=t.parameter_type=t.rect=t.vec2=void 0;var n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r=i(2),a=function(){function e(e,t){void 0===e&&(e=0),void 0===t&&(t=0),e=e||0,t=t||0,this.x=e,this.y=t}return e.prototype.sub=function(t,i){return void 0===i&&(i=0),"object"===(void 0===t?"undefined":n(t))?new e(this.x-t.x,this.y-t.y):(i=i||t,new e(this.x-t,this.y-i))},e.prototype.add=function(t,i){return void 0===i&&(i=0),"object"===(void 0===t?"undefined":n(t))?new e(this.x+t.x,this.y+t.y):new e(this.x+t,this.y+i)},e.prototype.scl=function(t){return void 0===t&&(t=0),"object"===(void 0===t?"undefined":n(t))?new e(this.x*t.x,this.y*t.y):new e(this.x*t,this.y*t)},e.prototype.len=function(){return Math.sqrt(this.x*this.x+this.y*this.y)},e.prototype.norm=function(){var t=this.len();return 0===t?new e(0,0):new e(this.x/t,this.y/t)},e.prototype.fn=function(t){return new e(t(this.x),t(this.y))},e.prototype.min=function(t){return new e(Math.min(this.x,t.x),Math.min(this.x,t.y))},e.prototype.max=function(t){return new e(Math.max(this.x,t.x),Math.max(this.x,t.y))},e.prototype.dot=function(e){return this.x*e.x+this.y*e.y},e}();t.vec2=a;var s=function(){function e(e,t){this.position=e,this.size=t,this.center=this.position.add(this.size).scl(.5)}return e.prototype.isInside=function(e){var t=e.x>this.position.x&&e.x<this.position.x+this.size.x,i=e.y>this.position.y&&e.y<this.position.y+this.size.y;return t&&i},e}();t.rect=s;var o=t.parameter_type=void 0;!function(e){e[e.universal=0]="universal",e[e.entity_scoped=1]="entity_scoped",e[e.universal_percentage=2]="universal_percentage"}(o||(t.parameter_type=o={}));var c=function(){function t(e,i,n,r,a){if(void 0===r&&(r="none"),void 0===a&&(a=null),this.dependecies=[],n===o.universal_percentage?(this.min=0,this.max=1):(this.min=Math.min(e,i),this.max=Math.max(e,i)),this.type=n,this.name=r,this.n=a||t.getParameterByName("nEntities"),this.value=(this.max-this.min)/2+this.min,this._values=[],this.type===o.entity_scoped&&this.n){this.n.registerDependency(this._updateHandler.bind(this));for(var s=0;s<this.n.getValue();s++)this._values.push(this._randomValue())}t.paramList.push(this),t.emitter.emit("paramAdded",this)}return t.prototype._updateHandler=function(t){if(void 0===t&&(t=null),t&&"nEntities"===t.name)for(var i=this._values.length,n=t.getValue()-i,r=0;r<Math.abs(n);r++)n>0?this._values.push(0):this._values.pop();this._updateValues();for(var a=0,s=this.dependecies;a<s.length;a++){var o=s[a];e(o,this)}},t.prototype._randomValue=function(){var e=Math.random();return(this.max-this.min)*e+this.min},t.prototype._updateValues=function(){if(this.n)for(var e=0;e<this.n.getValue();e++)this._values[e]=this._randomValue()},t.prototype.registerDependency=function(e){this.dependecies.push(e)},t.prototype.valueOf=function(){return 10},t.prototype.getValue=function(e){switch(void 0===e&&(e=0),this.type){case o.universal:case o.universal_percentage:return this.value;case o.entity_scoped:return e<0&&(e=0),e>=this._values.length&&(e=this._values.length-1),this._values[e]}return 0},t.prototype.setValue=function(e){e>this.max&&(e=this.max),e<this.min&&(e=this.min),this.value=e,this._updateHandler()},t.prototype.setMin=function(e){this.min=this.type===o.universal_percentage?0:e,this._updateHandler()},t.prototype.setMax=function(e){this.max=this.type===o.universal_percentage?1:e,this._updateHandler()},t.getParametersByName=function(e){for(var i=[],n=0,r=t.paramList;n<r.length;n++){var a=r[n];a.name===e&&i.push(a)}return i},t.getParameterByName=function(e){return this.getParametersByName(e)[0]},t.getParameterByNameOrCreate=function(e,i,n,r){void 0===i&&(i=o.entity_scoped),void 0===n&&(n=0),void 0===r&&(r=1);var a=this.getParametersByName(e)[0];return a||(a=new t(n,r,i,e)),a},t.getParameters=function(){return t.paramList},t.paramList=[],t.emitter=new r.EventEmitter,t}();t.parameter=c}).call(this,i(8).setImmediate)},function(e,t){var i;i=function(){return this}();try{i=i||new Function("return this")()}catch(e){"object"==typeof window&&(i=window)}e.exports=i},function(e,t,i){"use strict";var n,r="object"==typeof Reflect?Reflect:null,a=r&&"function"==typeof r.apply?r.apply:function(e,t,i){return Function.prototype.apply.call(e,t,i)};n=r&&"function"==typeof r.ownKeys?r.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var s=Number.isNaN||function(e){return e!=e};function o(){o.init.call(this)}e.exports=o,o.EventEmitter=o,o.prototype._events=void 0,o.prototype._eventsCount=0,o.prototype._maxListeners=void 0;var c=10;function u(e){if("function"!=typeof e)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof e)}function l(e){return void 0===e._maxListeners?o.defaultMaxListeners:e._maxListeners}function h(e,t,i,n){var r,a,s,o;if(u(i),void 0===(a=e._events)?(a=e._events=Object.create(null),e._eventsCount=0):(void 0!==a.newListener&&(e.emit("newListener",t,i.listener?i.listener:i),a=e._events),s=a[t]),void 0===s)s=a[t]=i,++e._eventsCount;else if("function"==typeof s?s=a[t]=n?[i,s]:[s,i]:n?s.unshift(i):s.push(i),(r=l(e))>0&&s.length>r&&!s.warned){s.warned=!0;var c=new Error("Possible EventEmitter memory leak detected. "+s.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");c.name="MaxListenersExceededWarning",c.emitter=e,c.type=t,c.count=s.length,o=c,console&&console.warn&&console.warn(o)}return e}function p(){if(!this.fired)return this.target.removeListener(this.type,this.wrapFn),this.fired=!0,0===arguments.length?this.listener.call(this.target):this.listener.apply(this.target,arguments)}function d(e,t,i){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:i},r=p.bind(n);return r.listener=i,n.wrapFn=r,r}function m(e,t,i){var n=e._events;if(void 0===n)return[];var r=n[t];return void 0===r?[]:"function"==typeof r?i?[r.listener||r]:[r]:i?function(e){for(var t=new Array(e.length),i=0;i<t.length;++i)t[i]=e[i].listener||e[i];return t}(r):v(r,r.length)}function f(e){var t=this._events;if(void 0!==t){var i=t[e];if("function"==typeof i)return 1;if(void 0!==i)return i.length}return 0}function v(e,t){for(var i=new Array(t),n=0;n<t;++n)i[n]=e[n];return i}Object.defineProperty(o,"defaultMaxListeners",{enumerable:!0,get:function(){return c},set:function(e){if("number"!=typeof e||e<0||s(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");c=e}}),o.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},o.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||s(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},o.prototype.getMaxListeners=function(){return l(this)},o.prototype.emit=function(e){for(var t=[],i=1;i<arguments.length;i++)t.push(arguments[i]);var n="error"===e,r=this._events;if(void 0!==r)n=n&&void 0===r.error;else if(!n)return!1;if(n){var s;if(t.length>0&&(s=t[0]),s instanceof Error)throw s;var o=new Error("Unhandled error."+(s?" ("+s.message+")":""));throw o.context=s,o}var c=r[e];if(void 0===c)return!1;if("function"==typeof c)a(c,this,t);else{var u=c.length,l=v(c,u);for(i=0;i<u;++i)a(l[i],this,t)}return!0},o.prototype.addListener=function(e,t){return h(this,e,t,!1)},o.prototype.on=o.prototype.addListener,o.prototype.prependListener=function(e,t){return h(this,e,t,!0)},o.prototype.once=function(e,t){return u(t),this.on(e,d(this,e,t)),this},o.prototype.prependOnceListener=function(e,t){return u(t),this.prependListener(e,d(this,e,t)),this},o.prototype.removeListener=function(e,t){var i,n,r,a,s;if(u(t),void 0===(n=this._events))return this;if(void 0===(i=n[e]))return this;if(i===t||i.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete n[e],n.removeListener&&this.emit("removeListener",e,i.listener||t));else if("function"!=typeof i){for(r=-1,a=i.length-1;a>=0;a--)if(i[a]===t||i[a].listener===t){s=i[a].listener,r=a;break}if(r<0)return this;0===r?i.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(i,r),1===i.length&&(n[e]=i[0]),void 0!==n.removeListener&&this.emit("removeListener",e,s||t)}return this},o.prototype.off=o.prototype.removeListener,o.prototype.removeAllListeners=function(e){var t,i,n;if(void 0===(i=this._events))return this;if(void 0===i.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==i[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete i[e]),this;if(0===arguments.length){var r,a=Object.keys(i);for(n=0;n<a.length;++n)"removeListener"!==(r=a[n])&&this.removeAllListeners(r);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=i[e]))this.removeListener(e,t);else if(void 0!==t)for(n=t.length-1;n>=0;n--)this.removeListener(e,t[n]);return this},o.prototype.listeners=function(e){return m(this,e,!0)},o.prototype.rawListeners=function(e){return m(this,e,!1)},o.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):f.call(e,t)},o.prototype.listenerCount=f,o.prototype.eventNames=function(){return this._eventsCount>0?n(this._events):[]}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.sicknessRule=t.avoidanceRule=t.randomRule=t.socialRule=t.boidRule=t.distanceElement=void 0,t.distanceAccelerator=function(e){for(var t=e.length,i=[],n=[],r=0;r<t;r++)n=[],i.push(n);for(r=0;r<t;r++)for(var a=r;a<t;a++){var s=e[r].position.sub(e[a].position),o=s.len();i[r][a]={dist:o,vec:s},i[a][r]={dist:o,vec:s.scl(-1)}}return i};var n,r=i(0),a=i(4),s=(n=function(e,t){return(n=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)t.hasOwnProperty(i)&&(e[i]=t[i])})(e,t)},function(e,t){function i(){this.constructor=e}n(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}),o=function(){this.dist=0,this.vec=new r.vec2};t.distanceElement=o;var c=function(){function e(e){this.ruleName=e,console.log("Constructed new rule w/ name:",e)}return e.prototype.executeRule=function(e,t,i){return console.log("Excuting base rule :)"),new r.vec2},e.prototype.weightRule=function(e,t){var i=r.parameter.getParameterByNameOrCreate(this.ruleName+" weight"),n=r.parameter.getParameterByNameOrCreate(this.ruleName+" weight (sick)"),s=t.immuneState===a.sickness_state.sick?n:i;return e.scl(s.getValue(t.id))},e}();t.boidRule=c;var u=function(e){function t(){var t=e.call(this,"SocialRule")||this;return t.view_distance=r.parameter.getParameterByNameOrCreate("View Distance",r.parameter_type.universal,10,30),t.entity_size=r.parameter.getParameterByNameOrCreate("EntitySize",r.parameter_type.universal,4,8),t}return s(t,e),t.prototype.executeRule=function(e,t,i){for(var n=i.length,a=this.view_distance.getValue(),s=new r.vec2,o=0;o<n;o++){var c=t[o];if(e!==c){var u=e.position.sub(c.position);u.len()<a&&(s=s.add(u.fn((function(e){return 1/e}))))}}return s.norm()},t}(c);t.socialRule=u;var l=function(e){function t(){return e.call(this,"randomRule")||this}return s(t,e),t.prototype.executeRule=function(e,t,i){var n=2*(Math.random()-.5),a=2*(Math.random()-.5);return new r.vec2(n,a).norm()},t}(c);t.randomRule=l;var h=function(e){function t(){var t=e.call(this,"avoidanceRule")||this;return t.avoidance_distance=r.parameter.getParameterByNameOrCreate("Avoidance Distance",r.parameter_type.universal,10,30),t}return s(t,e),t.prototype.executeRule=function(e,t,i){for(var n=i.length,a=this.avoidance_distance.getValue(),s=new r.vec2,o=0;o<n;o++){var c=t[o];if(e!==c){var u=c.position.sub(e.position);u.len()<a&&(s=s.add(u.fn((function(e){return 100/e}))))}}return s.norm()},t}(c);t.avoidanceRule=h;var p=function(e){function t(){var t=e.call(this,"sicknessRule")||this;return t.infection_distance=r.parameter.getParameterByNameOrCreate("Infection Distance",r.parameter_type.universal,10,15),t}return s(t,e),t.prototype.weightRule=function(e,t){return e},t.prototype.executeRule=function(e,t,i){for(var n=i.length,s=e.infection.state===a.sickness_state.incubating||e.infection.state===a.sickness_state.sick,o=this.infection_distance.getValue(),c=0;c<n;c++){var u=t[c];if(e!==u)if(e.position.sub(u.position).len()<o&&s)t[c].inVirusVicinity()}return new r.vec2},t}(c);t.sicknessRule=p},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.sickness=t.sickness_state=void 0;var n=i(0),r=t.sickness_state=void 0;!function(e){e[e.healthy=0]="healthy",e[e.incubating=1]="incubating",e[e.sick=2]="sick",e[e.deceased=3]="deceased",e[e.cured=4]="cured"}(r||(t.sickness_state=r={}));var a=function(){function e(){this.mortality_rate=n.parameter.getParameterByNameOrCreate("Mortality Rate",n.parameter_type.universal_percentage),this.infection_rate=n.parameter.getParameterByNameOrCreate("Infection Rate",n.parameter_type.universal_percentage),this.incubation_time=n.parameter.getParameterByNameOrCreate("Incubation Time",n.parameter_type.universal,0,100),this.healing_time=n.parameter.getParameterByNameOrCreate("Healing Time",n.parameter_type.universal,0,100),this.immune_time=n.parameter.getParameterByNameOrCreate("Immune Time",n.parameter_type.universal,0,100),this._state=r.healthy,this.timer=0}return e.prototype.makeSick=function(){this.state!==r.deceased&&(this.state=r.sick)},Object.defineProperty(e.prototype,"state",{get:function(){return this._state},set:function(e){this._state=e,this.onStateUpdated&&this.onStateUpdated(this._state)},enumerable:!0,configurable:!0}),e.prototype.update=function(e){switch(this.state){case r.healthy:break;case r.incubating:this.timer+=e,this.timer>1e3*this.incubation_time.getValue()&&(this.state=r.sick,this.timer=0);break;case r.sick:if(this.timer+=e,this.timer>1e3*this.healing_time.getValue())Math.random()>this.mortality_rate.getValue()?this.state=r.healthy:this.state=r.deceased,this.timer=0;break;case r.deceased:break;case r.cured:this.timer+=e,this.timer>1e3*this.immune_time.getValue()&&(this.state=r.healthy,this.timer=0)}},Object.defineProperty(e.prototype,"infectable",{get:function(){return this._state===r.healthy},enumerable:!0,configurable:!0}),e.prototype.inVirusVicinity=function(){this.infectable&&(Math.random()<=this.infection_rate.getValue()&&(this.state=r.incubating))},e}();t.sickness=a},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.grapher=t.graphedVariable=void 0;var n=i(0),r=i(2),a=function(){function e(t,i){void 0===t&&(t="none"),void 0===i&&(i="#000"),this.name=t,this.color=i,this.n=0,this.values=[],e.variableList.push(this),e.emitter.emit("paramAdded",this)}return e.prototype.appendValue=function(t){this.values.push(t),e.emitter.emit("variableUpdated",t,this)},Object.defineProperty(e.prototype,"data",{get:function(){return this.values},enumerable:!0,configurable:!0}),e.prototype.resetData=function(){this.n=0,this.values=[]},e.on=function(t,i){e.emitter.on(t,i)},e.getGraphVariableByName=function(t){for(var i=[],n=0,r=e.variableList;n<r.length;n++){var a=r[n];a.name===t&&i.push(a)}return 0===i.length?null:i[0]},e.getGraphVariableByNameOrCreate=function(t,i){var n=this.getGraphVariableByName(t);return n||(n=new e(t,i)),n},e.getGraphedVariables=function(){return e.variableList},e.variableList=[],e.emitter=new r.EventEmitter,e}();t.graphedVariable=a;var s=function(){function e(e){var t=this;this.legendSize=50,this.nRows=4,this.dataChanged=!0,this.updateIntervalID=null,this.values=[],this.ctx=e,this.minVal=0,this.maxVal=1,this.boundsChanged=!0;var i=this.ctx.canvas.width,r=this.ctx.canvas.height;this.size=new n.vec2(i,r),a.on("variableUpdated",this.varUpdatedListener.bind(this));this.stepSize=40,this.rowSize=50,this.margin=10,this.yScale=(this.size.y-2*this.margin)/(this.maxVal-this.minVal),this.xScale=(this.size.x-this.rowSize)/12,this.startUpdateInterval(100),this.redrawLegend(),window.addEventListener("resize",(function(){return setTimeout(t.resizeEvent.bind(t),10)}))}return e.prototype.resizeEvent=function(){var e=this.ctx.canvas.width,t=this.ctx.canvas.height;this.size=new n.vec2(e,t),this.yScale=(this.size.y-2*this.margin)/(this.maxVal-this.minVal)},e.prototype.varUpdatedListener=function(e,t){e<this.minVal&&(this.minVal=e,this.boundsChanged=!0),e>this.maxVal&&(this.maxVal=e,this.boundsChanged=!0),this.dataChanged=!0},e.prototype.startUpdateInterval=function(e){null!==this.updateIntervalID&&clearInterval(this.updateIntervalID),this.updateIntervalID=setInterval(this.update.bind(this),e)},e.prototype.update=function(){this.dataChanged&&(this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height),this.boundsChanged&&(this.yScale=(this.size.y-2*this.margin)/(this.maxVal-this.minVal),this.boundsChanged=!1),this.redrawLegend(),this.plotAllGraphVariables(),this.dataChanged=!1)},e.prototype.redrawLegend=function(){this.ctx.fillStyle="#997f89",this.ctx.font="10pt Oswald";var e=(this.maxVal-this.minVal)/this.nRows,t=0;this.ctx.strokeStyle="#997f89";for(var i=this.maxVal;i>=this.minVal;i-=e){var n=this.margin+this.yScale*t*e;this.ctx.fillText(i.toFixed(1),this.margin,n+this.margin/2),this.ctx.moveTo(this.legendSize+90,n),this.ctx.lineTo(this.size.x-this.margin,n),t++}this.ctx.stroke();for(var r=0,s=this.size.y-2*this.margin-25*a.getGraphedVariables().length,o=0,c=a.variableList;o<c.length;o++){var u=c[o];this.ctx.fillStyle=u.color,this.ctx.fillStyle="#292c2e";var l=s+this.margin+25*r;this.ctx.fillText(u.name,this.margin+this.legendSize,l),this.ctx.fillStyle=u.color,this.ctx.beginPath(),this.ctx.arc(this.margin-8+this.legendSize,l-4,4,0,2*Math.PI,!1),this.ctx.fill(),r++}},e.prototype.plotAllGraphVariables=function(){this.ctx.translate(this.legendSize,0);for(var e=0,t=a.getGraphedVariables();e<t.length;e++){var i=t[e];this.ctx.strokeStyle=i.color,this.plotData(i.data)}this.ctx.translate(-this.legendSize,0)},e.prototype.plotData=function(e){var t=e.length,i=this.size.x/t;this.ctx.beginPath(),this.ctx.moveTo(0,this.yScale*(this.maxVal-e[0])+this.margin);for(var n=1;n<t;n++)this.ctx.lineTo(n*i,this.yScale*(this.maxVal-e[n])+this.margin);this.ctx.stroke()},e.prototype.reset=function(){this.minVal=0,this.maxVal=1,this.yScale=(this.size.y-2*this.margin)/(this.maxVal-this.minVal)},e}();t.grapher=s},function(e,t,i){"use strict";var n=o(i(7)),r=o(i(3)),a=i(11),s=i(5);function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t.default=e,t}var c=function(e,t){var i=e.getContext("2d"),n=function(){var t=e.clientHeight;e.height=t;var n=e.clientWidth;e.width=n,i&&(i.canvas.width=n,i.canvas.height=t)};return window.addEventListener("resize",n),n(),i};window.onload=function(){navigator.userAgent.match(/Android/i)||navigator.userAgent.match(/webOS/i)||navigator.userAgent.match(/iPhone/i)||navigator.userAgent.match(/iPad/i)||navigator.userAgent.match(/iPod/i)||navigator.userAgent.match(/BlackBerry/i)||navigator.userAgent.match(/Windows Phone/i)?console.log("Running on mobile, not applying viewport fix."):document.write('<meta name="viewport" content="width=device-width, height=device-height, initial-scale=1">'),function(){var e=document.getElementById("p_container"),t=document.getElementById("window");if(e&&t){e.style.maxHeight=.95*t.getBoundingClientRect().height+"px";new a.ParameterController(e)}}();var e=null,t=null,i=document.getElementById("graph_canvas");i&&(t=function(e){var t=document.getElementById("graph_canvas_container");if(t){var i=c(e);if(i)return new s.grapher(i)}}(i));var o=document.getElementById("canvas");o&&(e=function(e){var t=document.getElementById("be_canvas_container");if(t){var i=c(e);if(i){var a=new n.boidEngineConfig;a.maxEntities=200,a.maxEntitySize=8,a.minEntitySize=8,a.fps=25;var s=new n.boidEngine(i,a),o=new r.randomRule;s.addRule(o);var u=new r.socialRule;s.addRule(u);var l=new r.avoidanceRule;s.addRule(l);var h=new r.sicknessRule;return s.addRule(h),window.infectOne=s.infectOne.bind(s),s}}}(o)),e&&t&&function(e,t){var i=document.getElementById("btn_restart");i&&(i.onclick=function(){i&&(e.restart(),t.reset())})}(e,t)}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.boid=t.boidEngine=t.boidRuleConfig=t.boidEngineConfig=void 0;var n=i(0),r=i(3),a=i(4),s=i(5),o=function(){this.maxEntities=500,this.minEntitySize=3,this.maxEntitySize=3,this.fps=null,this.continuum=!0};t.boidEngineConfig=o;var c=function(){};t.boidRuleConfig=c;var u=function(){function e(e,t){var i=this;void 0===t&&(t=new o),this.entitiesToBeRemoved=[],this.resetInNext=!1,this.renderIntervalID=null,this.updateIntervalID=null,this.updateInterval=0,this.rules=[],this.ctx=e,this.nEntities=new n.parameter(10,t.maxEntities,n.parameter_type.universal,"nEntities"),this.nEntities.registerDependency(this._parameterUpdateHandler.bind(this));var r=n.parameter.getParameterByName("EntitySize");this.entity_size=r||new n.parameter(t.minEntitySize,t.maxEntitySize,n.parameter_type.entity_scoped,"EntitySize"),this.entity_size.registerDependency(this._parameterUpdateHandler.bind(this)),this.entitiesToInfect=n.parameter.getParameterByNameOrCreate("# Infected at Start",n.parameter_type.universal,0,10),this.continuum=t.continuum;var a=this.ctx.canvas.width,c=this.ctx.canvas.height;if(this.size=new n.vec2(a,c),this.bound_size=this.size.sub(4*this.entity_size.getValue()),this._hbs=this.bound_size.scl(.5),this.entities=[],this._initBoids(),t.fps){var u=1e3/t.fps;this.startRenderInterval(u),this.startUpdateInterval(u),this.updateInterval=u}this.gv_EntitiesAlive=s.graphedVariable.getGraphVariableByNameOrCreate("Entites Alive","#198c19"),this.gv_EntitiesInfected=s.graphedVariable.getGraphVariableByNameOrCreate("Entites Infected","#73e500"),this.gv_EntitiesSick=s.graphedVariable.getGraphVariableByNameOrCreate("Entites Sick","#ff4c4c"),this.gv_EntitesImmune=s.graphedVariable.getGraphVariableByNameOrCreate("Entites Immune","#004c00"),this.gv_EntitiesDead=s.graphedVariable.getGraphVariableByNameOrCreate("Entities Dead","#b20000"),window.addEventListener("resize",(function(){return setTimeout(i.resizeEvent.bind(i),10)}))}return e.prototype.resizeEvent=function(){var e=this.ctx.canvas.width,t=this.ctx.canvas.height;this.size=new n.vec2(e,t),this.bound_size=this.size.sub(4*this.entity_size.getValue()),this._hbs=this.bound_size.scl(.5)},e.prototype.infectOne=function(){var e=Math.floor(this.entities.length*Math.random());this.entities[e].setImmuneSystemState(a.sickness_state.incubating)},e.prototype.boidStateUpdateHandler=function(e,t){t===a.sickness_state.deceased&&this.entitiesToBeRemoved.push(e)},e.prototype._generateNewBoid=function(){var e=this.entities.length,t=Math.random(),i=Math.random(),r=new n.vec2(t,i).scl(this.bound_size),a=new l(r,this.entity_size,e);a.onImmuneSystemStateUpdated=this.boidStateUpdateHandler.bind(this,a),this.entities.push(a)},e.prototype._initBoids=function(){for(var e=0;e<this.nEntities.getValue();e++)this._generateNewBoid();for(e=0;e<this.entitiesToInfect.getValue();e++)this.infectOne()},e.prototype._parameterUpdateHandler=function(e){switch(e.name){case"nEntities":for(var t=e.getValue()-this.entities.length,i=0;i<Math.abs(t);i++)t>0?this._generateNewBoid():this.entities.pop();break;case"EntitySize":this.bound_size=this.size.sub(4*this.entity_size.getValue())}},e.prototype.startRenderInterval=function(e){null!==this.renderIntervalID&&clearInterval(this.renderIntervalID),this.renderIntervalID=setInterval(this._render.bind(this),e)},e.prototype.stopRenderInterval=function(){this.renderIntervalID&&(clearInterval(this.renderIntervalID),this.renderIntervalID=null)},e.prototype.startUpdateInterval=function(e){null!==this.updateIntervalID&&clearInterval(this.updateIntervalID),this.updateIntervalID=setInterval(this._update.bind(this),e),this.updateInterval=e},e.prototype.stopUpdateInterval=function(){this.updateIntervalID&&(clearInterval(this.updateIntervalID),this.updateIntervalID=null)},e.prototype.reset=function(){this.entities=[],this._initBoids()},e.prototype.addRule=function(e){console.log(e),this.rules.push(e)},e.prototype.clearRules=function(){this.rules=[]},e.prototype._render=function(){this.ctx.clearRect(0,0,this.ctx.canvas.width,this.ctx.canvas.height);for(var e=0,t=0,i=this.entities;t<i.length;t++){var n=i[t];switch(this.ctx.beginPath(),this.ctx.arc(n.position.x,n.position.y,this.entity_size.getValue(e)/2,0,2*Math.PI,!1),n.immuneState){case a.sickness_state.cured:this.ctx.fillStyle="#004c00";break;case a.sickness_state.healthy:this.ctx.fillStyle="#198c19";break;case a.sickness_state.incubating:this.ctx.fillStyle="#ffff7f";break;case a.sickness_state.sick:this.ctx.fillStyle="#ff4c4c"}this.ctx.fill(),this.ctx.beginPath(),this.ctx.strokeStyle="#2a4e6c",this.ctx.lineWidth=.3,this.ctx.arc(n.position.x,n.position.y,this.entity_size.getValue(e)/2,0,2*Math.PI),this.ctx.stroke(),e++}},e.prototype._updateGraphData=function(){for(var e=this.nEntities.getValue(),t=this.entities.length,i=0,n=0,r=0,s=e-this.entities.length,o=0,c=this.entities;o<c.length;o++){switch(c[o].immuneState){case a.sickness_state.cured:r++;break;case a.sickness_state.incubating:i++;break;case a.sickness_state.sick:n++}}this.gv_EntitiesAlive.appendValue(t),this.gv_EntitiesInfected.appendValue(i),this.gv_EntitiesSick.appendValue(n),this.gv_EntitesImmune.appendValue(r),this.gv_EntitiesDead.appendValue(s)},e.prototype._update=function(){this.resetInNext&&(this.entities=[],this._initBoids(),this.resetInNext=!1),this.entities.length>0&&this._updateGraphData();for(var e=0,t=this.entitiesToBeRemoved;e<t.length;e++){var i=t[e];this.entities.splice(this.entities.indexOf(i),1)}this.entitiesToBeRemoved=[];for(var n=this.updateInterval,a=(0,r.distanceAccelerator)(this.entities),s=0,o=this.entities;s<o.length;s++){(h=o[s]).update(n,this.entities,a,this.rules)}if(this.continuum)for(var c=0,u=0,l=this.entities;u<l.length;u++){var h,p=(h=l[u]).position;p.x<-this.entity_size?h.position.x+=this.size.x+h.size:p.x>this.size.x+this.entity_size.getValue(c)&&(h.position.x-=this.size.x+h.size),p.y<-this.entity_size?h.position.y+=this.size.y+h.size:p.y>this.size.y+this.entity_size.getValue(c)&&(h.position.y-=this.size.y+h.size),c++}},e.prototype.restart=function(){console.log("restarting be"),this.resetInNext=!0,this.gv_EntitiesAlive.resetData(),this.gv_EntitiesInfected.resetData(),this.gv_EntitiesSick.resetData(),this.gv_EntitesImmune.resetData(),this.gv_EntitiesDead.resetData()},e}();t.boidEngine=u;var l=function(){function e(e,t,i){void 0===e&&(e=new n.vec2),void 0===i&&(i=0),this.velocity=new n.vec2,this.position=e,this._size=t,this.state="base",this.id=i,this.acceleration=n.parameter.getParameterByNameOrCreate("Entity Acceleration",n.parameter_type.universal,15,25),this.speed=n.parameter.getParameterByNameOrCreate("Entity Speed",n.parameter_type.universal,15,20),this.infection=new a.sickness}return e.prototype.update=function(e,t,i,r){for(var a=new n.vec2,s=0;s<r.length;s++){var o=r[s],c=o.executeRule(this,t,i);c=o.weightRule(c,this),a=a.add(c)}var u=a.norm().scl(this.acceleration.getValue()*e/1e3);this.velocity=this.velocity.add(u),this.velocity=function(e,t){return e.len()>t?e.norm().scl(t):e}(this.velocity,this.speed.getValue());var l=this.position.add(this.velocity.scl(e/1e3));this.position=this._resolveCollisions(l,a,t),this.infection.update(e)},e.prototype.inVirusVicinity=function(){this.infection.inVirusVicinity()},e.prototype.setImmuneSystemState=function(e){this.infection.state=e},e.prototype._resolveCollisions=function(e,t,i){for(var n=i.length,r=0;r<n;r++){if(i[r]!==this){var a=i[r].position.sub(e),s=a.len(),o=this.size/2+i[r].size/2;if(s<o){var c=a.norm().scl(o-s);e=e.sub(c)}}}return e},Object.defineProperty(e.prototype,"size",{get:function(){return this._size.getValue(this.id)},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"immuneState",{get:function(){return this.infection.state},enumerable:!0,configurable:!0}),Object.defineProperty(e.prototype,"onImmuneSystemStateUpdated",{set:function(e){this.infection.onStateUpdated=e},enumerable:!0,configurable:!0}),e}();t.boid=l},function(e,t,i){(function(e){var n=void 0!==e&&e||"undefined"!=typeof self&&self||window,r=Function.prototype.apply;function a(e,t){this._id=e,this._clearFn=t}t.setTimeout=function(){return new a(r.call(setTimeout,n,arguments),clearTimeout)},t.setInterval=function(){return new a(r.call(setInterval,n,arguments),clearInterval)},t.clearTimeout=t.clearInterval=function(e){e&&e.close()},a.prototype.unref=a.prototype.ref=function(){},a.prototype.close=function(){this._clearFn.call(n,this._id)},t.enroll=function(e,t){clearTimeout(e._idleTimeoutId),e._idleTimeout=t},t.unenroll=function(e){clearTimeout(e._idleTimeoutId),e._idleTimeout=-1},t._unrefActive=t.active=function(e){clearTimeout(e._idleTimeoutId);var t=e._idleTimeout;t>=0&&(e._idleTimeoutId=setTimeout((function(){e._onTimeout&&e._onTimeout()}),t))},i(9),t.setImmediate="undefined"!=typeof self&&self.setImmediate||void 0!==e&&e.setImmediate||this&&this.setImmediate,t.clearImmediate="undefined"!=typeof self&&self.clearImmediate||void 0!==e&&e.clearImmediate||this&&this.clearImmediate}).call(this,i(1))},function(e,t,i){(function(e,t){!function(e,i){"use strict";if(!e.setImmediate){var n,r,a,s,o,c=1,u={},l=!1,h=e.document,p=Object.getPrototypeOf&&Object.getPrototypeOf(e);p=p&&p.setTimeout?p:e,"[object process]"==={}.toString.call(e.process)?n=function(e){t.nextTick((function(){m(e)}))}:!function(){if(e.postMessage&&!e.importScripts){var t=!0,i=e.onmessage;return e.onmessage=function(){t=!1},e.postMessage("","*"),e.onmessage=i,t}}()?e.MessageChannel?((a=new MessageChannel).port1.onmessage=function(e){m(e.data)},n=function(e){a.port2.postMessage(e)}):h&&"onreadystatechange"in h.createElement("script")?(r=h.documentElement,n=function(e){var t=h.createElement("script");t.onreadystatechange=function(){m(e),t.onreadystatechange=null,r.removeChild(t),t=null},r.appendChild(t)}):n=function(e){setTimeout(m,0,e)}:(s="setImmediate$"+Math.random()+"$",o=function(t){t.source===e&&"string"==typeof t.data&&0===t.data.indexOf(s)&&m(+t.data.slice(s.length))},e.addEventListener?e.addEventListener("message",o,!1):e.attachEvent("onmessage",o),n=function(t){e.postMessage(s+t,"*")}),p.setImmediate=function(e){"function"!=typeof e&&(e=new Function(""+e));for(var t=new Array(arguments.length-1),i=0;i<t.length;i++)t[i]=arguments[i+1];var r={callback:e,args:t};return u[c]=r,n(c),c++},p.clearImmediate=d}function d(e){delete u[e]}function m(e){if(l)setTimeout(m,0,e);else{var t=u[e];if(t){l=!0;try{!function(e){var t=e.callback,i=e.args;switch(i.length){case 0:t();break;case 1:t(i[0]);break;case 2:t(i[0],i[1]);break;case 3:t(i[0],i[1],i[2]);break;default:t.apply(void 0,i)}}(t)}finally{d(e),l=!1}}}}}("undefined"==typeof self?void 0===e?this:e:self)}).call(this,i(1),i(10))},function(e,t){var i,n,r=e.exports={};function a(){throw new Error("setTimeout has not been defined")}function s(){throw new Error("clearTimeout has not been defined")}function o(e){if(i===setTimeout)return setTimeout(e,0);if((i===a||!i)&&setTimeout)return i=setTimeout,setTimeout(e,0);try{return i(e,0)}catch(t){try{return i.call(null,e,0)}catch(t){return i.call(this,e,0)}}}!function(){try{i="function"==typeof setTimeout?setTimeout:a}catch(e){i=a}try{n="function"==typeof clearTimeout?clearTimeout:s}catch(e){n=s}}();var c,u=[],l=!1,h=-1;function p(){l&&c&&(l=!1,c.length?u=c.concat(u):h=-1,u.length&&d())}function d(){if(!l){var e=o(p);l=!0;for(var t=u.length;t;){for(c=u,u=[];++h<t;)c&&c[h].run();h=-1,t=u.length}c=null,l=!1,function(e){if(n===clearTimeout)return clearTimeout(e);if((n===s||!n)&&clearTimeout)return n=clearTimeout,clearTimeout(e);try{n(e)}catch(t){try{return n.call(null,e)}catch(t){return n.call(this,e)}}}(e)}}function m(e,t){this.fun=e,this.array=t}function f(){}r.nextTick=function(e){var t=new Array(arguments.length-1);if(arguments.length>1)for(var i=1;i<arguments.length;i++)t[i-1]=arguments[i];u.push(new m(e,t)),1!==u.length||l||o(d)},m.prototype.run=function(){this.fun.apply(null,this.array)},r.title="browser",r.browser=!0,r.env={},r.argv=[],r.version="",r.versions={},r.on=f,r.addListener=f,r.once=f,r.off=f,r.removeListener=f,r.removeAllListeners=f,r.emit=f,r.prependListener=f,r.prependOnceListener=f,r.listeners=function(e){return[]},r.binding=function(e){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(e){throw new Error("process.chdir is not supported")},r.umask=function(){return 0}},function(e,t,i){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.ParameterController=t.ParameterControl=void 0;var n=i(0),r=function(){function e(e,t){this.minElement=null,this.maxElement=null,this.valueSlider=null,this.controller=e,this.controlledParameter=t,this.createUIElement(),this.attachListeners()}return e.prototype.createUIElement=function(){var e=document.createElement("li");e.className="";var t=document.createElement("div");if(t.className="param_options | no_select",t.innerText=this.controlledParameter.name+"\n",this.controlledParameter.type===n.parameter_type.entity_scoped||this.controlledParameter.type===n.parameter_type.universal){var i=document.createElement("label");i.htmlFor=this.controlledParameter.name+"_min",i.innerText="min:";var r=document.createElement("input");r.name=this.controlledParameter.name+"_min",r.type="number",r.value=this.controlledParameter.min+"";var a=document.createElement("br"),s=document.createElement("label");s.htmlFor=this.controlledParameter.name+"_max",s.innerText="max:";var o=document.createElement("input");o.name=this.controlledParameter.name+"_max",o.type="number",o.value=this.controlledParameter.max+"",this.minElement=r,this.maxElement=o,t.appendChild(i),t.appendChild(r),t.appendChild(a),t.appendChild(s),t.appendChild(o)}if(e.appendChild(t),this.controlledParameter.type===n.parameter_type.universal||this.controlledParameter.type===n.parameter_type.universal_percentage){var c=document.createElement("div");c.className="param_setpoint";var u=document.createElement("input");u.type="range",u.min="0",u.max="1000",u.value="500",c.appendChild(u),e.appendChild(c),this.valueSlider=u}this.controller.addUIElement(e)},e.prototype.attachListeners=function(){var e=this;if(this.minElement){var t=this.minElement;this.minElement.onchange=function(){e.controlledParameter.setMin(parseInt(t.value))}}if(this.maxElement){var i=this.maxElement;this.maxElement.onchange=function(){e.controlledParameter.setMax(parseInt(i.value))}}if(this.valueSlider){var n=this.valueSlider;this.valueSlider.onchange=function(){var t=parseInt(n.value)/1e3;t*=e.controlledParameter.max-e.controlledParameter.min,t+=e.controlledParameter.min,e.controlledParameter.setValue(t)}}},e}();t.ParameterControl=r;var a=function(){function e(e){this.parameter_container=e,n.parameter.emitter.on("paramAdded",this.parameterAddHandler.bind(this)),this.controlElements=[]}return e.prototype.parameterAddHandler=function(e){var t=new r(this,e);this.controlElements.push(t)},e.prototype.addUIElement=function(e){this.parameter_container.appendChild(e)},e}();t.ParameterController=a}]);
//# sourceMappingURL=pandaemic.js.map