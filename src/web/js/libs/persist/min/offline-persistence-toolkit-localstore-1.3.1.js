/**
 * Copyright (c) 2017, Oracle and/or its affiliates.
 * All rights reserved.
 */

define("persist/PersistenceStore",[],function(){"use strict";var e=function(e){this._name=e};return e.prototype={},e.prototype.getName=function(){return this._name},e.prototype.getVersion=function(){return this._version},e.prototype.Init=function(e){return e&&e.version?this._version=e.version:this._version="0",Promise.resolve()},e.prototype.upsert=function(e,t,n,r){throw TypeError("failed in abstract function")},e.prototype.upsertAll=function(e){throw TypeError("failed in abstract function")},e.prototype.find=function(e){throw TypeError("failed in abstract function")},e.prototype.findByKey=function(e){throw TypeError("failed in abstract function")},e.prototype.removeByKey=function(e){throw TypeError("failed in abstract function")},e.prototype.delete=function(e){throw TypeError("failed in abstract function")},e.prototype.keys=function(){throw TypeError("failed in abstract function")},e}),define("persist/impl/storageUtils",["./logger"],function(e){"use strict";function t(t,r){e.log("Offline Persistence Toolkit storageUtils: Processing selector: "+JSON.stringify(t));if(!t)return!0;var s=n(t);return i(s,r)}function n(e){var t,i=[];for(var a in e)if(e.hasOwnProperty(a)){var f=e[a];if(a.indexOf("$")===0){if(s(a)){if(!(f instanceof Array))throw new Error("not a valid expression: "+e);t={operator:a,array:[]};for(var l=0;l<f.length;l++){var c=n(f[l]);t.array.push(c)}}else if(o(a))throw new Error("not a valid expression: "+e)}else if(u(f))i.push({left:a,right:f,operator:"$eq"});else{var h={left:a};r(h,f),i.push(h)}}return i.length>1?t={operator:"$and",array:i}:i.length===1&&(t=i[0]),t}function r(e,t){var n=!1;for(var r in t)if(t.hasOwnProperty(r)){var i=t[r];if(n||!o(r))throw new Error("parsing error "+t);e.operator=r,e.right=i,n=!0}}function i(e,t){var n=e.operator;if(s(n)){if(!e.left&&e.array instanceof Array){var r,u=e.array;for(var a=0;a<u.length;a++){var c=i(u[a],t);if(n==="$or"&&c===!0)return!0;if(n==="$and"&&c===!1)return!1;r=c}return r}throw new Error("invalid expression tree!"+e)}if(o(n)){var h=l(e.left,t),p=e.right;if(n==="$lt"){var d=f(h,p);return h=d[0],p=d[1],h<p}if(n==="$gt"){var d=f(h,p);return h=d[0],p=d[1],h>p}if(n==="$lte"){var d=f(h,p);return h=d[0],p=d[1],h<=p}if(n==="$gte"){var d=f(h,p);return h=d[0],p=d[1],h>=p}if(n==="$eq")return h===p;if(n==="$ne")return h!==p;if(n==="$regex"){var v=h.match(p);return v!==null}if(n==="$exists")return p?h!==null&&h!==undefined:h===null||h===undefined;throw new Error("not a valid expression! "+e)}throw new Error("not a valid expression!"+e)}function s(e){return e==="$and"||e==="$or"}function o(e){return e==="$lt"||e==="$gt"||e==="$lte"||e==="$gte"||e==="$eq"||e==="$ne"||e==="$regex"||e==="$exists"}function u(e){return typeof e!="object"}function a(e){return e!=null&&(e instanceof String||typeof e=="string")}function f(e,t){return a(e)&&t==null?t="":a(t)&&e==null&&(e=""),[e,t]}function l(e,t){var n=e.split("."),r=t;for(var i=0;i<n.length;i++)r=r[n[i]];return r}function c(e,t){var n;if(!t)n=e;else{n={};for(var r=0;r<t.length;r++){var i=n,s=e,o=t[r],u=o.split(".");for(var a=0;a<u.length;a++)s=s[u[a]],!i[u[a]]&&a<u.length-1&&(i[u[a]]={}),a===u.length-1?i[u[a]]=s:i=i[u[a]]}}return n}return{satisfy:t,getValue:l,assembleObject:c}}),define("persist/impl/keyValuePersistenceStore",["../PersistenceStore","./storageUtils","./logger"],function(e,t,n){"use strict";var r=function(t){e.call(this,t)};return r.prototype=new e,r.prototype.Init=function(e){return this._version=e&&e.version||"0",Promise.resolve()},r.prototype.getItem=function(e){throw TypeError("failed in abstract function")},r.prototype.removeByKey=function(e){throw TypeError("failed in abstract function")},r.prototype.keys=function(){throw TypeError("failed in abstract function")},r.prototype.findByKey=function(e){return n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: findByKey() with key: "+e),this.getItem(e).then(function(e){return e?Promise.resolve(e.value):Promise.resolve()})},r.prototype.find=function(e){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: find() with expression: "+JSON.stringify(e));var r=this,i=[],s=[],e=e||{};return this.keys().then(function(n){var o=[];for(var u=0;u<n.length;u++){var a=n[u];a&&o.push(function(n){return r.getItem(n).then(function(r){r&&t.satisfy(e.selector,r)&&(r.key=n,s.push(r))})}(a))}return Promise.all(o).then(function(){var t=r._sort(s,e.sort);for(var n=0;n<t.length;n++)i.push(r._constructReturnObject(e.fields,t[n]));return Promise.resolve(i)})})},r.prototype._sort=function(e,t){return!e||!e.length||!t||!t.length?e:e.sort(this._sortFunction(t,this))},r.prototype._sortFunction=function(e,n){return function(n,r){for(var i=0;i<e.length;i++){var s=e[i],o,u=!0;if(typeof s=="string")o=s;else{if(typeof s!="object")throw new Error("invalid sort criteria.");var a=Object.keys(s);if(!a||a.length!==1)throw new Error("invalid sort criteria");o=a[0],u=s[o].toLowerCase()==="asc"}var f=t.getValue(o,n),l=t.getValue(o,r);if(f==l)continue;return u?f<l?-1:1:f<l?1:-1}return 0}},r.prototype._constructReturnObject=function(e,n){var r;return e?r=t.assembleObject(n,e):r=n.value,r},r.prototype._removeByKeyMapCallback=function(e){var t=this;return function(n){var r;return e?r=n[e]:r=n,t.removeByKey(r)}},r.prototype.delete=function(e){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: delete() with expression: "+JSON.stringify(e));var t=this;if(!e)return this.deleteAll();var r=e;return r.fields=["key"],t.find(r).then(function(e){if(e&&e.length){var n=e.map(t._removeByKeyMapCallback("key"),t);return Promise.all(n)}return Promise.resolve()})},r.prototype.deleteAll=function(){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: deleteAll()");var e=this,t=[],r;return this.keys().then(function(n){for(r=0;r<n.length;r++)t.push(e.removeByKey(n[r]));return Promise.all(t)})},r.prototype.upsert=function(e,t,r,i){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: upsert() for key: "+e);var s=this;return this.getItem(e).then(function(n){if(n&&i){var o=n.metadata.versionIdentifier;if(o!==i)return Promise.reject({status:409});var u=t.versionIdentifier;return u!==o?s._insert(e,t,r):Promise.resolve()}return s._insert(e,t,r)})},r.prototype.upsertAll=function(e){n.log("Offline Persistence Toolkit keyValuePersistenceStore called by subclass: upsertAll()");var t=[];for(var r=0;r<e.length;r++){var i=e[r];t.push(this.upsert(i.key,i.metadata,i.value,i.expectedVersionIndentifier))}return Promise.all(t)},r}),define("persist/impl/localPersistenceStore",["./keyValuePersistenceStore","./logger"],function(e,t){"use strict";var n=function(t){e.call(this,t)};return n.prototype=new e,n.prototype.Init=function(e){return this._version=e&&e.version||"0",Promise.resolve()},n.prototype._insert=function(e,t,n){var r=this._createRawKey(e),i={metadata:t,value:n},s=JSON.stringify(i);return localStorage.setItem(r,s),Promise.resolve()},n.prototype.removeByKey=function(e){t.log("Offline Persistence Toolkit localPersistenceStore: removeByKey() with key: "+e);var n=this;return this.findByKey(e).then(function(t){if(t){var r=n._createRawKey(e);return localStorage.removeItem(r),Promise.resolve(!0)}return Promise.resolve(!1)})},n.prototype._createRawKey=function(e){return this._name+this._version+e.toString()},n.prototype._extractKey=function(e){var t=this._name+this._version,n=t.length;return e.indexOf(t)===0?e.slice(n):null},n.prototype.keys=function(){t.log("Offline Persistence Toolkit localPersistenceStore: keys()");var e=Object.keys(localStorage),n=[];for(var r=0;r<e.length;r++){var i=this._extractKey(e[r]);i&&n.push(i)}return Promise.resolve(n)},n.prototype.getItem=function(e){t.log("Offline Persistence Toolkit localPersistenceStore: getItem() with key: "+e);var n=this._createRawKey(e),r=localStorage.getItem(n);if(!r)return Promise.resolve();try{var i=JSON.parse(r);return i.key=e,Promise.resolve(i)}catch(s){return Promise.resolve()}},n}),define("persist/localPersistenceStoreFactory",["./impl/localPersistenceStore"],function(e){"use strict";var t=function(){function t(t,n){var r=new e(t);return r.Init(n).then(function(){return r})}return{createPersistenceStore:function(e,n){return t(e,n)}}}();return t}),define("persist/persistenceStoreFactory",[],function(){"use strict";var e={createPersistenceStore:function(e,t){}};return e});