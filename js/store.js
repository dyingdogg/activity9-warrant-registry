(function () {
  'use strict';

  const STORAGE_KEY = 'ecmis.activity9.html.v3';
  let state;
  const subscribers = new Set();

  function clone(value) { return JSON.parse(JSON.stringify(value)); }

  function load() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      state = parsed && parsed.schemaVersion === window.Activity9Seed.schemaVersion ? parsed : window.Activity9Seed.create();
    } catch (error) {
      console.warn('ไม่สามารถอ่าน localStorage ได้ ใช้ข้อมูลชั่วคราวในหน่วยความจำ', error);
      state = window.Activity9Seed.create();
    }
    return state;
  }

  function persist() {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
    catch (error) { console.warn('ไม่สามารถบันทึก localStorage ได้', error); }
  }

  function notify(event) { subscribers.forEach((callback) => callback(state, event)); }

  function mutate(event, mutation) {
    const result = mutation(state);
    persist();
    notify(event);
    return result;
  }

  function reset() {
    state = window.Activity9Seed.create();
    persist();
    notify('reset');
    return state;
  }

  function replace(nextState, event = 'replace') {
    state = clone(nextState);
    persist();
    notify(event);
  }

  function subscribe(callback) {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  }

  function findRecord(id) { return state.records.find((record) => record.id === id); }
  function currentRole() { return state.currentRole; }
  function currentUser() { return window.Activity9Seed.roles[state.currentRole]; }
  function hasPermission(permission, role = state.currentRole) { return (window.Activity9Seed.permissionMatrix[role] || []).includes(permission); }

  window.Activity9Store = { load, getState: () => state || load(), mutate, reset, replace, subscribe, findRecord, currentRole, currentUser, hasPermission, clone, storageKey: STORAGE_KEY };
}());
