/**
 * state-manager.js — 轻量状态管理（发布/订阅）
 * 引入方式：<script src="../公共/scripts/state-manager.js"></script>
 * 使用：
 *   var store = StateManager.create('userStore', { name: '', role: '' });
 *   store.set({ name: '张三' });
 *   store.subscribe(function(state) { console.log(state) });
 *   store.getState();
 */
(function (window) {
  'use strict';
  var stores = {};

  function createStore(name, initialState) {
    var state = Common.deepClone(initialState || {});
    var subscribers = [];

    return {
      name: name,
      getState: function () { return Common.deepClone(state); },
      get: function (key) { return key ? Common.deepClone(state[key]) : Common.deepClone(state); },
      set: function (updates) {
        Object.assign(state, updates);
        notify();
        return this.getState();
      },
      subscribe: function (fn) {
        subscribers.push(fn);
        return function unsubscribe() {
          subscribers = subscribers.filter(function (f) { return f !== fn; });
        };
      },
      reset: function () {
        state = Common.deepClone(initialState || {});
        notify();
      }
    };

    function notify() {
      var snapshot = Common.deepClone(state);
      subscribers.forEach(function (fn) { try { fn(snapshot); } catch (e) { console.error(e); } });
    }
  }

  var StateManager = {
    create: function (name, initialState) {
      if (stores[name]) console.warn('Store "' + name + '" already exists, returning existing one.');
      stores[name] = stores[name] || createStore(name, initialState);
      return stores[name];
    },
    get: function (name) { return stores[name] || null; },
    list: function () { return Object.keys(stores); }
  };

  window.StateManager = StateManager;
})(window);
