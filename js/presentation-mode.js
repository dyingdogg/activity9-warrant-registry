(function () {
  'use strict';

  function enabled() { return new URLSearchParams(window.location.search).get('presenter') === '1'; }
  function esc(value) { return window.Activity9Documents.esc(value); }

  function render() {
    const drawer = document.getElementById('presenter-drawer');
    if (!enabled()) { drawer.hidden = true; drawer.innerHTML = ''; return; }
    const state = window.Activity9Store.getState();
    const scenarioKey = state.ui.presenterScenario || 'A';
    const scenario = window.Activity9Seed.scenarios[scenarioKey];
    const step = state.ui.presenterStep || 0;
    const roleOptions = Object.entries(window.Activity9Seed.roles).map(([key, value]) => `<option value="${key}" ${state.currentRole === key ? 'selected' : ''}>${esc(value.title)}</option>`).join('');
    const scenarioOptions = Object.entries(window.Activity9Seed.scenarios).map(([key, value]) => `<option value="${key}" ${scenarioKey === key ? 'selected' : ''}>${key}. ${esc(value.name)}</option>`).join('');
    const record = state.records.find((item) => item.id === scenario.recordId);
    const nextAction = scenario.steps[step] || null;
    drawer.hidden = false;
    drawer.innerHTML = `<div class="presenter-header"><strong>โหมดนำเสนอ</strong><span class="badge badge-warning">Presenter</span><button class="icon-button" data-action="presenter-hide" aria-label="ซ่อนเครื่องมือนำเสนอ">×</button></div>
      <div class="presenter-body">
        <div class="presenter-section"><label class="field"><span>บทบาทผู้ใช้งาน</span><select id="presenter-role" data-action="presenter-role">${roleOptions}</select></label><small>การเปลี่ยนบทบาทมีผลต่อเมนู สิทธิ และงานของฉัน</small></div>
        <div class="presenter-section"><label class="field"><span>Scenario</span><select id="presenter-scenario" data-action="presenter-scenario">${scenarioOptions}</select></label></div>
        <div class="presenter-note"><strong>${esc(scenario.name)}</strong><br>แฟ้ม ${esc(record?.systemRef || '-')} • ขั้น ${Math.min(step + 1, scenario.steps.length)}/${scenario.steps.length}<br>${nextAction ? `การดำเนินการถัดไป: ${esc(nextAction)}` : 'Scenario นี้ถึงจุดสิ้นสุดแล้ว'}</div>
        <div class="presenter-flow"><button class="button button-secondary" data-action="presenter-previous" ${step === 0 ? 'disabled' : ''}>ย้อนขั้น</button><button class="button button-primary" data-action="presenter-next" ${!nextAction ? 'disabled' : ''}>ดำเนินขั้นถัดไป</button></div>
        <div class="presenter-section"><h3>ตอนนี้ใครทำอะไร</h3><div class="kv-list"><div><span>ผู้ปฏิบัติงาน</span><strong>${esc(window.Activity9Seed.roles[window.Activity9StateMachine.actionRoles[nextAction]]?.title || window.Activity9Seed.roles[state.currentRole].title)}</strong></div><div><span>ข้อมูลเข้า</span><strong>แฟ้ม เอกสาร และผลจากขั้นก่อนหน้า</strong></div><div><span>สิ่งที่ได้รับกลับ</span><strong>สถานะใหม่ เอกสาร Version และ Audit</strong></div><div><span>งานถัดไป</span><strong>${esc(record?.currentTask || '-')}</strong></div></div></div>
        <div class="presenter-flow"><button class="button button-secondary" data-action="presenter-open-record">เปิดแฟ้ม Scenario</button><button class="button button-danger" data-action="presenter-reset">Reset ข้อมูล</button></div>
      </div>`;
  }

  function selectScenario(key) {
    window.Activity9Store.mutate('presenter:scenario', (state) => { state.ui.presenterScenario = key; state.ui.presenterStep = 0; state.currentRole = window.Activity9Seed.scenarios[key].role; });
    const scenario = window.Activity9Seed.scenarios[key];
    window.Activity9Router.go(`/warrant/${scenario.recordId}?tab=overview`);
  }

  function next() {
    const state = window.Activity9Store.getState();
    const scenario = window.Activity9Seed.scenarios[state.ui.presenterScenario];
    const action = scenario.steps[state.ui.presenterStep];
    if (!action) return;
    try {
      window.Activity9StateMachine.perform(action, scenario.recordId, {}, { presenter: true });
      window.Activity9Store.mutate('presenter:step', (nextState) => { nextState.ui.presenterStep += 1; });
      window.Activity9App.toast('ดำเนิน Scenario แล้ว', `สถานะและงานถัดไปอัปเดตจาก Action ${action}`, 'success');
    } catch (error) { window.Activity9App.toast('ไม่สามารถดำเนินขั้นนี้ได้', error.message, 'danger'); }
  }

  function previous() {
    const state = window.Activity9Store.getState();
    const key = state.ui.presenterScenario;
    const target = Math.max(0, state.ui.presenterStep - 1);
    const fresh = window.Activity9Seed.create();
    fresh.ui.presenterScenario = key; fresh.ui.presenterStep = 0; fresh.currentRole = window.Activity9Seed.scenarios[key].role;
    window.Activity9Store.replace(fresh, 'presenter:rewind-reset');
    for (let i = 0; i < target; i += 1) {
      const action = window.Activity9Seed.scenarios[key].steps[i];
      try { window.Activity9StateMachine.perform(action, window.Activity9Seed.scenarios[key].recordId, {}, { presenter: true }); }
      catch (error) { console.warn('ไม่สามารถย้อนสร้าง Scenario ได้ครบ', action, error); break; }
    }
    window.Activity9Store.mutate('presenter:rewind', (nextState) => { nextState.ui.presenterScenario = key; nextState.ui.presenterStep = target; });
  }

  function handle(action, target) {
    if (action === 'presenter-role') window.Activity9Store.mutate('presenter:role', (state) => { state.currentRole = target.value; });
    if (action === 'presenter-scenario') selectScenario(target.value);
    if (action === 'presenter-next') next();
    if (action === 'presenter-previous') previous();
    if (action === 'presenter-reset' && window.confirm('Reset ข้อมูลสมมติทั้งหมดกลับสู่ค่าเริ่มต้นหรือไม่?')) { window.Activity9Store.reset(); window.Activity9App.toast('Reset ข้อมูลแล้ว', 'ข้อมูล Scenario กลับสู่สถานะเริ่มต้น', 'success'); }
    if (action === 'presenter-open-record') { const scenario = window.Activity9Seed.scenarios[window.Activity9Store.getState().ui.presenterScenario]; window.Activity9Router.go(`/warrant/${scenario.recordId}?tab=overview`); }
    if (action === 'presenter-hide') document.getElementById('presenter-drawer').hidden = true;
  }

  window.Activity9Presenter = { enabled, render, handle, next, previous, selectScenario };
}());
