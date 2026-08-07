(function () {
  'use strict';

  const routes = [
    { name: 'registry', pattern: /^\/registry\/?$/, title: 'ทะเบียนหมายจับ' },
    { name: 'my-work', pattern: /^\/my-work\/?$/, title: 'ตรวจสอบคำร้อง' },
    { name: 'notifications', pattern: /^\/notifications\/?$/, title: 'การแจ้งเตือน' },
    { name: 'create', pattern: /^\/create\/?$/, title: 'สร้างคำขอหมายจับ' },
    { name: 'warrant', pattern: /^\/warrant\/([^/?]+)\/?$/, title: 'รายละเอียดแฟ้มหมายจับ' },
    { name: 'day180', pattern: /^\/day180\/?$/, title: 'ครบกำหนด 180 วัน' },
    { name: 'reports', pattern: /^\/reports\/?$/, title: 'Dashboard และรายงาน' }
  ];

  function parse() {
    const raw = window.location.hash.replace(/^#/, '') || '/registry';
    const [path, queryText = ''] = raw.split('?');
    for (const route of routes) {
      const match = path.match(route.pattern);
      if (match) return { ...route, path, params: { id: match[1] }, query: Object.fromEntries(new URLSearchParams(queryText)) };
    }
    return { name: 'not-found', path, params: {}, query: {}, title: 'ไม่พบหน้า' };
  }

  function go(path) {
    const normalized = path.startsWith('#') ? path.slice(1) : path;
    if (`#${normalized}` === window.location.hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
    else window.location.hash = normalized;
  }

  function href(path) { return `#${path}`; }

  window.Activity9Router = { parse, go, href };
}());
