(function () {
  'use strict';

  const documentNames = {
    WarrantRequest: 'คำร้องขอออกหมายจับ', CourtWarrant: 'หมายจับฉบับศาลประทับตรา', PoliceDispatchLetter: 'หนังสือนำส่งหมายจับให้ตำรวจ', PostalReceipt: 'ใบรับฝากไปรษณีย์',
    ManualDeliveryReceipt: 'หลักฐานนำส่งด้วยตนเอง', PhoneFollowUpRecord: 'บันทึกผลการติดตามทางโทรศัพท์', ArrestRecord: 'บันทึกการจับกุม', ProsecutorHandoverLetter: 'หนังสือนำส่งตัวให้อัยการ',
    ProsecutorReceipt: 'ใบรับตัวจากอัยการ', TerminationRequest: 'หนังสือขอยุติหมาย', TerminationNoticePolice: 'หนังสือแจ้งยุติให้ตำรวจ', TerminationNoticeAgency: 'หนังสือแจ้งสำนัก/กอง',
    CourtWithdrawalReport: 'รายงานศาลขอถอนหมาย', WithdrawalOrder: 'คำสั่งถอนหมาย', Day180Letter: 'หนังสือถึงผู้อำนวยการทะเบียนกลาง', Day180Receipt: 'หลักฐานการรับหนังสือ',
    InitiationOrder: 'หนังสือหรือคำสั่งที่เป็นเหตุเริ่มดำเนินการ', FactSummary: 'สรุปข้อเท็จจริง', SubjectProfile: 'ข้อมูลผู้ต้องหา', EvidenceAttachment: 'เอกสารประกอบพยานหลักฐาน', AuthorityProof: 'หลักฐานอำนาจผู้ยื่น'
  };

  function esc(value) { return String(value ?? '-').replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char])); }
  function thaiDate(value, long = true) {
    if (!value) return '-';
    const date = new Date(value.length === 10 ? `${value}T00:00:00+07:00` : value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat('th-TH', long ? { day: 'numeric', month: 'long', year: 'numeric' } : { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
  }

  function paper(record, document) {
    const title = document?.name || documentNames[document?.type] || 'เอกสารประกอบแฟ้มหมายจับ';
    const isCourt = ['WarrantRequest', 'CourtWithdrawalReport'].includes(document?.type);
    const recipient = document?.type === 'Day180Letter' ? 'ผู้อำนวยการทะเบียนกลาง กรมการปกครอง' : document?.type?.includes('TerminationNotice') || document?.type === 'PoliceDispatchLetter' ? 'ผู้กำกับการสถานีตำรวจตัวอย่าง' : isCourt ? `ศาล${record.court.replace(/^ศาล/, '')}` : 'ผู้เกี่ยวข้อง';
    return `<article class="document-paper" data-testid="document-preview">
      <div class="document-demo">ข้อมูลสมมติสำหรับสาธิต</div>
      <header class="document-header"><img src="assets/pacc-logo.webp" alt="ตราสำนักงาน ป.ป.ท."><div><strong>สำนักงานคณะกรรมการป้องกันและปราบปรามการทุจริตในภาครัฐ</strong><span>ฉบับร่าง • Version ${esc(document?.version || 1)}</span></div></header>
      <div class="document-meta"><span>ที่ ปปท ${esc(record.systemRef)}</span><span>${thaiDate(document?.createdAt || new Date().toISOString())}</span></div>
      <h2>${esc(title)}</h2>
      <p><strong>เรื่อง</strong> ${esc(title)} กรณี ${esc(record.subject.name)}</p>
      <p><strong>เรียน</strong> ${esc(recipient)}</p>
      <p class="indent">ตามที่สำนักงาน ป.ป.ท. ดำเนินการตามสำนวนเลขที่ ${esc(record.caseNo)} และเกี่ยวข้องกับหมายเลข ${esc(record.warrantNo || record.requestNo)} นั้น</p>
      <p class="indent">สำนักงาน ป.ป.ท. ขอส่งข้อมูลและเอกสารตามรายการแนบเพื่อดำเนินการตามอำนาจหน้าที่ ทั้งนี้ การรับหนังสือฉบับนี้เป็นสถานะการรับเอกสาร และไม่ใช้ยืนยันผลการดำเนินการของหน่วยงานผู้รับ</p>
      <table class="document-table"><tbody>
        <tr><th>เลขอ้างอิงระบบ</th><td>${esc(record.systemRef)}</td><th>เลขหมาย</th><td>${esc(record.warrantNo || '-')}</td></tr>
        <tr><th>ผู้ต้องหา</th><td>${esc(record.subject.name)}</td><th>เลขประชาชน</th><td>${esc(record.subject.citizenId)}</td></tr>
        <tr><th>ศาล</th><td>${esc(record.court)}</td><th>วันที่ออกหมาย</th><td>${thaiDate(record.issueDate)}</td></tr>
      </tbody></table>
      <section class="document-attachments"><strong>สิ่งที่ส่งมาด้วย</strong><ol><li>สำเนาเอกสารตามแฟ้ม จำนวน 1 ชุด</li><li>หลักฐานที่เกี่ยวข้องตามสิทธิ จำนวน 1 ชุด</li></ol></section>
      <div class="document-signature"><span>ขอแสดงความนับถือ</span><strong>(ผู้ลงนามตามอำนาจ)</strong><span>สำนักงาน ป.ป.ท.</span></div>
      <footer><span>ผู้จัดทำ: ${esc(document?.createdBy || record.owner)}</span><span>สถานะเอกสาร: ${esc(document?.status || 'ฉบับร่าง')}</span></footer>
    </article>`;
  }

  function warrantRequestPaper(fields, page) {
    const f = fields || {};
    const chk = (checked) => `<span class="paper-checkbox ${checked ? 'checked' : ''}" aria-hidden="true"></span>`;
    const blank = (value, cls = '') => `<span class="paper-blank ${cls}">${esc(value || '')}</span>`;
    const blockBlank = (value) => `<div class="paper-blank full">${esc(value || '')}</div>`;
    const courtLabel = f.court || 'ศาลอาญาตัวอย่าง';
    const filingDateLabel = f.filingDate ? thaiDate(f.filingDate, false) : '';
    const incidentDateLabel = f.incidentDate ? thaiDate(f.incidentDate, false) : '';

    if (page === 1) {
      return `<article class="official-paper" data-testid="warrant-paper-1">
        <span class="paper-code">ปปท. 8-17</span><span class="paper-watermark">ฉบับร่าง • ตัวอย่างเอกสาร</span>
        <img class="paper-emblem" src="assets/pacc-logo.webp" alt="ตราสำนักงาน ป.ป.ท.">
        <p class="paper-title">(คำร้อง)<br>ขอหมายจับ</p>
        <div class="paper-line"><span>รับคำร้อง</span><span style="margin-left:auto">ที่ ${blank('รอออกเลขที่')} /๒๕..</span></div>
        <div class="paper-line"><span>เรียกสอบ</span><span>ศาล</span>${blank(courtLabel, 'wide')}</div>
        <div class="paper-line">.......ผู้พิพากษา วันที่ ${blank(filingDateLabel)} พุทธศักราช ๒๕..</div>
        <p class="paper-section-title">ความอาญา</p>
        <p>คณะกรรมการ ป.ป.ท. โดย ${blank(f.petitionerName, 'wide')} ${blank(f.requestedByRole)} <b>ผู้ร้อง</b></p>
        <div class="paper-line"><span>ข้าพเจ้า</span>${blank(f.petitionerName, 'wide')}<span>ตำแหน่ง</span>${blank(f.petitionerTitle, 'wide')}</div>
        <div class="paper-line"><span>อายุ</span>${blank(f.petitionerAge)}<span>ปี อาชีพ</span>${blank(f.petitionerOccupation)}<span>สถานที่ทำงาน</span>${blank(f.petitionerWorkplace, 'wide')}</div>
        <div class="paper-line"><span>แขวง/ตำบล</span>${blank(f.petitionerSubdistrict)}<span>เขต/อำเภอ</span>${blank(f.petitionerDistrict)}<span>จังหวัด</span>${blank(f.petitionerProvince)}</div>
        <div class="paper-line"><span>โทรศัพท์</span>${blank(f.petitionerPhone, 'wide')}<span>ขอยื่นคำร้องขอออกหมายจับต่อศาล ดังมีข้อความที่จะกล่าวต่อไปนี้</span></div>
        <p class="paper-indent"><b>ข้อ ๑.</b> ด้วย ${chk(true)} พนักงานอัยการ ${blank(f.prosecutorOffice, 'wide')}</p>
        <p class="paper-indent">ได้ขอให้ ${blank(f.requestedByRole)}/อนุกรรมการและเลขานุการ ขอ${blank(courtLabel, 'wide')}</p>
        <p class="paper-indent">ขออนุมัติหมายจับ (ชื่อ-สกุล ผู้ถูกกล่าวหา) ${blank(f.subjectName, 'wide')} เลขประจำตัวประชาชน ${blank(f.subjectCitizenId, 'wide')}</p>
        <p>${chk(f.committeeResolutionSource)} ปรากฏจากรายงานการไต่สวนและวินิจฉัยชี้มูลของ คณะกรรมการ ป.ป.ท.</p>
        <p>ว่า นาย/นาง/นางสาว ผู้ถูกกล่าวหา ${blank(f.subjectName, 'wide')}</p>
        <div class="paper-line"><span>อายุ</span>${blank(f.subjectAge)}<span>ปี เชื้อชาติ</span>${blank(f.subjectEthnicity)}<span>สัญชาติ</span>${blank(f.subjectNationality)}<span>อาชีพ</span>${blank(f.subjectOccupation)}</div>
        <div class="paper-line"><span>อยู่บ้านเลขที่</span>${blank(f.subjectAddressLine, 'wide')}<span>ตำบล/แขวง</span>${blank(f.subjectSubdistrict)}</div>
        <div class="paper-line"><span>อำเภอ/เขต</span>${blank(f.subjectDistrict)}<span>จังหวัด</span>${blank(f.subjectProvince)}<span>โทรศัพท์</span>${blank(f.subjectPhone)}</div>
        <p>ซึ่งมีตำหนิรูปพรรณตามที่แนบมาพร้อมนี้</p>
        <p>${chk(f.groundSevere)} ได้หรือน่าจะได้กระทำความผิดอาญาร้ายแรงซึ่งมีอัตราโทษจำคุกอย่างสูงเกิน ๓ ปี</p>
        <p>${chk(f.groundFlight)} ได้หรือน่าจะได้กระทำความผิดอาญา และน่าจะหลบหนีหรือจะไปยุ่งเหยิงกับพยานหลักฐานหรือก่ออันตรายประการอื่น</p>
      </article>`;
    }
    if (page === 2) {
      return `<article class="official-paper" data-testid="warrant-paper-2">
        <span class="paper-pageno">๒</span>
        <div class="paper-line"><span>เหตุเกิดที่</span>${blank(f.incidentPlace, 'wide')}</div>
        <div class="paper-line"><span>เมื่อวันที่</span>${blank(incidentDateLabel)}<span>เวลา</span>${blank(f.incidentTime)}<span>น.</span></div>
        <p><b>มีพฤติการณ์กระทำความผิดที่เกี่ยวกับเหตุออกหมายจับ กล่าวคือ</b></p>
        ${blockBlank(f.misconductNarrative)}
        <p class="paper-indent">การกระทำดังกล่าวข้างต้นของผู้ถูกกล่าวหา เป็นเหตุทำให้ (ความเสียหาย)</p>
        ${blockBlank(f.damageDetail)}
        <p class="paper-indent">ดังนั้น การกระทำของผู้ถูกกล่าวหา จึงเป็นการกระทำทุจริตในภาครัฐอันเป็นความผิดตามประมวลกฎหมายอาญา/กฎหมายอื่น ๆ มาตรา ${blank(f.offenseSection, 'wide')}</p>
        <p class="paper-indent">คณะอนุกรรมการไต่สวน/คณะพนักงานไต่สวน ได้แจ้งคำสั่งคณะกรรมการ ป.ป.ท. และรวบรวมพยานหลักฐานที่เกี่ยวข้องของผู้ถูกกล่าวหาแล้ว และได้แจ้งข้อกล่าวหาแก่ผู้ถูกกล่าวหาตามขั้นตอนที่กฎหมายกำหนด</p>
        <p class="paper-indent">ต่อมา คณะกรรมการ ป.ป.ท. ได้มีมติวินิจฉัยชี้มูลความผิดทางอาญาและวินัยแก่ ${blank(f.subjectName, 'wide')} และส่งรายงานการไต่สวนไปยังพนักงานอัยการเพื่อพิจารณาสั่งฟ้องตามกฎหมายต่อไป</p>
      </article>`;
    }
    return `<article class="official-paper" data-testid="warrant-paper-3">
      <span class="paper-pageno">๓</span>
      <p class="paper-indent">กรณีมีพฤติการณ์หลบหนีและเพื่อมิให้เสียหายแก่คดี จึงขอให้พนักงาน ป.ป.ท./อนุกรรมการและเลขานุการคณะอนุกรรมการไต่สวนดำเนินการออกหมายจับ ${blank(f.subjectName, 'wide')} ต่อ${blank(courtLabel, 'wide')}</p>
      <p class="paper-section-title">ข้อ ๒. ผู้ร้องประสงค์จะทำการจับกุม ชื่อ-สกุล ${blank(f.subjectName, 'wide')}</p>
      <p>จึงขอให้ศาลออกหมายจับ ชื่อ-สกุล ${blank(f.subjectName, 'wide')} มาดำเนินคดี</p>
      <p>ผู้ร้อง ${chk(f.everRequestedBefore === 'yes')} เคย ${chk(f.everRequestedBefore !== 'yes')} ไม่เคย ร้องขอให้${blank(courtLabel, 'wide')} ออกหมายจับบุคคลดังกล่าว โดยอาศัยเหตุแห่งการร้องขอเดียวกันนี้ หรือเหตุอื่น (ระบุ)</p>
      ${blockBlank(f.everRequestedDetail)}
      <p>และศาลมีคำสั่ง ${blank('-', 'wide')}</p>
      <p style="text-align:center;margin-top:18px"><b>ควรมิควรแล้วแต่จะโปรด</b></p>
      <div class="paper-signature-row">
        <div class="paper-signature"><div class="sign-line"></div><small>ลงชื่อ ${esc(f.petitionerName || '')}<br>(พนักงาน ป.ป.ท./เจ้าหน้าที่ ป.ป.ท.) ผู้ร้อง</small></div>
        <div class="paper-signature"><div class="sign-line"></div><small>ลงชื่อ ${esc(f.transcriberName || '')}<br>(พนักงาน ป.ป.ท./เจ้าหน้าที่ ป.ป.ท.) ผู้เรียง/พิมพ์</small></div>
      </div>
    </article>`;
  }

  function open(recordId, documentId) {
    const record = window.Activity9Store.findRecord(recordId);
    if (!record) return;
    let document = record.documents.find((item) => item.id === documentId);
    if (!document) document = { id: 'PREVIEW', type: documentId || 'WarrantRequest', name: documentNames[documentId] || 'เอกสารประกอบแฟ้ม', version: 1, status: 'ฉบับร่าง', createdBy: window.Activity9Store.currentUser().name, createdAt: new Date().toISOString() };
    const toolbar = `<div class="document-toolbar"><span class="badge badge-info">ฉบับร่าง Version ${document.version}</span><button class="button button-secondary" data-action="print-document" data-record-id="${record.id}" data-document-id="${document.id}">พิมพ์</button></div>`;
    if (document.type === 'WarrantRequest' && record.warrantFields) {
      const body = `<div class="warrant-paper-shell" style="padding:0"><div class="warrant-paper-counter"><span id="drawer-warrant-counter">หน้า 1 / 3</span><span>เอกสารจากเจ้าของสำนวน • รอตรวจสอบ</span></div><div class="warrant-paper-frame" id="drawer-warrant-frame" style="max-height:64vh">${warrantRequestPaper(record.warrantFields, 1)}</div><div class="warrant-paper-switcher">${[[1, 'หน้า 1'], [2, 'หน้า 2'], [3, 'หน้า 3']].map(([n, label]) => `<button type="button" data-action="drawer-warrant-page" data-record-id="${record.id}" data-value="${n}" class="${n === 1 ? 'active' : ''}">${label}</button>`).join('')}</div></div>`;
      window.Activity9App.openDrawer('คำร้องขอออกหมายจับ (ฉบับที่นักสืบส่งตรวจ)', toolbar + body, 'document');
      return;
    }
    window.Activity9App.openDrawer('ตัวอย่างเอกสาร', toolbar + paper(record, document), 'document');
  }

  function print(recordId, documentId) {
    const record = window.Activity9Store.findRecord(recordId);
    const documentItem = record?.documents.find((item) => item.id === documentId) || { id: 'PREVIEW', type: documentId, name: documentNames[documentId], version: 1, status: 'ฉบับร่าง' };
    if (!record) return;
    const root = window.document.getElementById('print-root');
    root.innerHTML = documentItem.type === 'WarrantRequest' && record.warrantFields ? [1, 2, 3].map((n) => warrantRequestPaper(record.warrantFields, n)).join('') : paper(record, documentItem);
    window.document.body.classList.add('printing-document');
    window.print();
    window.document.body.classList.remove('printing-document');
    root.innerHTML = '';
  }

  function downloadBlob(content, mime, filename) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = filename; document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function exportReport(format, reportKind, rows) {
    const stamp = new Date().toISOString().replace(/[:.]/g, '-');
    const title = window.Activity9Seed.reports.find((item) => item[0] === reportKind)?.[1] || 'รายงานหมายจับ';
    const markExported = (filename, mime) => {
      document.body.dataset.lastExport = JSON.stringify({ format, reportKind, filename, mime, rowCount: rows.length });
      window.Activity9App?.toast('เตรียมไฟล์ Export แล้ว', `${format} • ${rows.length} รายการ • ${filename}`, 'success');
    };
    if (format === 'Excel') {
      const csv = ['เลขอ้างอิงระบบ,เลขหมาย,ผู้ต้องหา,เลขสำนวน,สถานะ,อัปเดตล่าสุด', ...rows.map((r) => [r.systemRef, r.warrantNo || r.requestNo, r.subject.name, r.caseNo, window.Activity9Seed.labels.termination[r.dimensions.termination], r.updatedAt].map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\r\n');
      const filename = `${title}_${stamp}.csv`;
      markExported(filename, 'text/csv;charset=utf-8');
      downloadBlob(`\ufeff${csv}`, 'text/csv;charset=utf-8', filename);
      return;
    }
    const html = `<!doctype html><html lang="th"><meta charset="utf-8"><title>${esc(title)}</title><style>body{font-family:Tahoma,sans-serif;padding:32px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #999;padding:6px;font-size:12px}h1{font-size:20px}.note{color:#8b2e28}</style><h1>${esc(title)}</h1><p>ข้อมูล ณ ${thaiDate(new Date().toISOString())}</p><p class="note">ข้อมูลสมมติสำหรับสาธิต • ฉบับร่าง</p><table><thead><tr><th>เลขอ้างอิง</th><th>เลขหมาย/คำขอ</th><th>ผู้ต้องหา</th><th>สำนวน</th><th>สถานะ</th></tr></thead><tbody>${rows.map((r) => `<tr><td>${esc(r.systemRef)}</td><td>${esc(r.warrantNo || r.requestNo)}</td><td>${esc(r.subject.name)}</td><td>${esc(r.caseNo)}</td><td>${esc(window.Activity9Seed.labels.termination[r.dimensions.termination])}</td></tr>`).join('')}</tbody></table></html>`;
    if (format === 'Word') {
      const filename = `${title}_${stamp}.doc`;
      markExported(filename, 'application/msword;charset=utf-8');
      downloadBlob(html, 'application/msword;charset=utf-8', filename);
    }
    else {
      markExported(`${title}_${stamp}_print-view.html`, 'text/html;charset=utf-8');
      const win = window.open('', '_blank');
      if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 300); }
    }
  }

  window.Activity9Documents = { names: documentNames, open, print, paper, exportReport, thaiDate, esc, warrantRequestPaper };
}());
