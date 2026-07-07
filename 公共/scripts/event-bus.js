/**
 * event-bus.js — 跨组件事件总线
 * 引入方式：<script src="../公共/scripts/event-bus.js"></script>
 * 使用：EventBus.on('event', fn) / EventBus.emit('event', data) / EventBus.off('event', fn)
 */
(function (window) {
  'use strict';
  var listeners = {};

  var EventBus = {
    on: function (event, handler) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(handler);
      return this;
    },
    once: function (event, handler) {
      var self = this;
      var wrapper = function () {
        handler.apply(null, arguments);
        self.off(event, wrapper);
      };
      return this.on(event, wrapper);
    },
    off: function (event, handler) {
      if (!listeners[event]) return this;
      if (!handler) { delete listeners[event]; return this; }
      listeners[event] = listeners[event].filter(function (fn) { return fn !== handler; });
      return this;
    },
    emit: function (event) {
      if (!listeners[event]) return this;
      var args = Array.prototype.slice.call(arguments, 1);
      listeners[event].forEach(function (fn) { try { fn.apply(null, args); } catch (e) { console.error(e); } });
      return this;
    },
    clear: function () { listeners = {}; }
  };

  window.EventBus = EventBus;
})(window);
