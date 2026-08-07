(function () {
  'use strict';

  const roles = {
    CaseOwner: { name: 'นางสาวอรุณี ใจมั่น', short: 'อ', title: 'เจ้าหน้าที่ ป.ป.ท.', unit: 'สำนักปราบปรามการทุจริต 1' },
    PaccSupervisor: { name: 'นางศิริพร กำกับงาน', short: 'ศ', title: 'ผู้บังคับบัญชาชั้นต้น', unit: 'กลุ่มงานกำกับคดี' },
    AgencyCaseAdministrator: { name: 'นายธนกฤต งานดี', short: 'ธ', title: 'เจ้าหน้าที่ธุรการคดีของสำนัก/กอง', unit: 'สำนักปราบปรามการทุจริต 1' },
    GotOfficer: { name: 'นางสาวพิมพ์ชนก รอบคอบ', short: 'พ', title: 'เจ้าหน้าที่ กอท. (ธุรการคดี)', unit: 'กองอำนวยการต่อต้านการทุจริต' },
    GotReviewer: { name: 'นายวรพล ตรวจชัด', short: 'ว', title: 'ผู้ตรวจวิเคราะห์หรือคัดกรองของ กอท.', unit: 'กลุ่มงานตรวจสอบหมายจับ' },
    AgencyDirector: { name: 'นายกิตติศักดิ์ อำนวยการ', short: 'ก', title: 'ผอ.สำนัก/กอง', unit: 'สำนักปราบปรามการทุจริต 1' },
    Executive: { name: 'นางวาสนา บริหารผล', short: 'ว', title: 'ผู้บริหาร', unit: 'สำนักงาน ป.ป.ท.' },
    SuperAdmin: { name: 'นายสุพัฒน์ ดูแลระบบ', short: 'ส', title: 'Super Admin', unit: 'ศูนย์เทคโนโลยีสารสนเทศ' }
  };

  const permissionMatrix = {
    CaseOwner: ['view', 'create', 'submitReadiness', 'correctRequest', 'submitCourt', 'recordCourtResult', 'correctReview', 'recordEnforcement', 'manageHandover', 'reviewTermination', 'confirmCourtEffect', 'respondExecutiveOrder'],
    PaccSupervisor: ['view', 'reviewReadiness', 'verifyEnforcement', 'reviewTermination', 'submitActivity7', 'respondExecutiveOrder'],
    AgencyCaseAdministrator: ['view', 'agencyRegister', 'agencyForward', 'correctReview', 'agencyAcknowledge', 'submitWithdrawal', 'respondExecutiveOrder'],
    GotOfficer: ['view', 'gotReceive', 'prepareDispatch', 'recordEnforcement', 'prepareTerminationNotice', 'manageDay180', 'respondExecutiveOrder'],
    GotReviewer: ['view', 'reviewWarrant', 'verifyEnforcement', 'reviewTermination', 'submitActivity7', 'respondExecutiveOrder'],
    AgencyDirector: ['view', 'agencyAcknowledge', 'submitWithdrawal', 'respondExecutiveOrder'],
    Executive: ['view', 'viewExecutiveDashboard', 'manageExecutiveOrders'],
    SuperAdmin: ['view', 'create', 'submitReadiness', 'correctRequest', 'submitCourt', 'recordCourtResult', 'correctReview', 'recordEnforcement', 'manageHandover', 'reviewTermination', 'confirmCourtEffect', 'reviewReadiness', 'agencyRegister', 'agencyForward', 'agencyAcknowledge', 'submitWithdrawal', 'gotReceive', 'prepareDispatch', 'prepareTerminationNotice', 'manageDay180', 'reviewWarrant', 'verifyEnforcement', 'submitActivity7', 'viewExecutiveDashboard', 'manageExecutiveOrders', 'respondExecutiveOrder']
  };

  const labels = {
    request: {
      Draft: 'ฉบับร่าง', AwaitingReadinessReview: 'รอตรวจความพร้อม', ReadinessCorrectionRequested: 'ส่งกลับแก้ไข', ReadyForCourt: 'พร้อมยื่นศาล',
      SubmittedManually: 'ยื่นศาลแบบ Manual แล้ว', CourtRequestedCorrection: 'ศาลขอแก้ไข', UnderCourtConsideration: 'ศาลอยู่ระหว่างพิจารณา', WarrantIssued: 'ศาลออกหมาย', CourtRejected: 'ศาลไม่อนุมัติ'
    },
    review: {
      NotStarted: 'ยังไม่เริ่ม', AwaitingAgencyRegistration: 'รอลงทะเบียนสำนัก/กอง', AwaitingGotForward: 'รอส่งต่อ กอท.', GotReceived: 'กอท. รับแล้ว',
      UnderReview: 'อยู่ระหว่างตรวจ', ReturnedForCorrection: 'ส่งกลับแก้ไข', Resubmitted: 'ส่งกลับมาตรวจใหม่', Complete: 'ตรวจครบถ้วนแล้ว'
    },
    dispatch: {
      NotPrepared: 'ยังไม่จัดทำหนังสือ', ReadyToDispatch: 'พร้อมนำส่ง', PostalAwaitingTrackingNumber: 'ส่งไปรษณีย์ รอเลข Tracking', PostalAccepted: 'รับฝากแล้ว',
      PostalInTransit: 'อยู่ระหว่างขนส่ง', PostalOutForDelivery: 'ออกนำจ่าย', PostalDelivered: 'นำจ่ายสำเร็จ', PostalDeliveryFailed: 'นำจ่ายไม่สำเร็จ',
      PostalReturned: 'ตีกลับ', ManualAwaitingReceipt: 'นำส่งด้วยตนเอง รอยืนยันรับ', ManualReceived: 'นำส่งด้วยตนเอง รับแล้ว'
    },
    enforcement: { NotStarted: 'ยังไม่เริ่ม', CoordinationTracking: 'อยู่ระหว่างประสานติดตาม', Arrested: 'จับกุม', Detained: 'อายัดตัว', LimitationExpired: 'ขาดอายุความ', Deceased: 'เสียชีวิต', WarrantRevokedDuringTracking: 'หมายถูกถอน/เพิกถอนระหว่างติดตาม (พบภายหลัง)' },
    enforcementResult: {
      NotFoundContinueTracking: 'ไม่พบตัว', ArrestSucceeded: 'จับกุมสำเร็จ', Detained: 'อายัดตัว', EvidenceDeceased: 'พบหลักฐานเสียชีวิต', EvidenceLimitationExpired: 'พบหลักฐานขาดอายุความ',
      WarrantRevokedDuringTracking: 'พบหมายถูกถอน/เพิกถอนระหว่างติดตาม', Escaped: 'หลบหนีระหว่างติดตาม', Obstruction: 'ถูกขัดขวางการปฏิบัติงาน', Uncontactable: 'ติดต่อเจ้าของสำนวนไม่ได้'
    },
    orderStatus: { Open: 'เปิดงาน', Acknowledged: 'รับทราบแล้ว', InProgress: 'กำลังดำเนินการ', Escalated: 'ทวงถาม/ยกระดับ', Closed: 'ปิดงานแล้ว' },
    handover: { NotRequired: 'ไม่ต้องส่ง', AwaitingProsecutorCoordination: 'รอประสานอัยการ', AppointmentScheduled: 'นัดหมายแล้ว', ProsecutorRequestedDocuments: 'อัยการขอเอกสารเพิ่ม', Completed: 'ส่งตัวสำเร็จ', UnableToComplete: 'ดำเนินการไม่สำเร็จ' },
    termination: {
      NoReason: 'ยังไม่มีเหตุ', ReviewingReasonAndEvidence: 'ตรวจเหตุและหลักฐาน', AwaitingAdditionalInformation: 'รอข้อมูลเพิ่ม', ReadyForSubmission: 'พร้อมเสนอ',
      SentToActivity7: 'ส่งกิจกรรมที่ 7', Activity7RequestedInformation: 'กิจกรรมที่ 7 ขอข้อมูลเพิ่ม', InternallyRejected: 'ไม่อนุมัติภายใน', InternallyApproved: 'อนุมัติภายใน',
      PoliceAndAgencyNotified: 'แจ้งตำรวจและสำนัก/กอง', AwaitingCourtReport: 'รอรายงานศาล', WithdrawalSubmittedToCourt: 'ยื่นถอนต่อศาล', CourtRequestedDocuments: 'ศาลขอเอกสาร',
      AwaitingWithdrawalOrder: 'รอคำสั่งถอน', WithdrawnByCourt: 'ศาลถอนหมายแล้ว'
    },
    day180: {
      NotDue: 'ยังไม่ครบ', NearDue: 'ใกล้ครบ', DueAwaitingReview: 'ครบกำหนดรอตรวจ', DataQualityBlocked: 'ข้อมูลขัดแย้ง', Screened: 'ผ่านการคัดกรอง',
      AwaitingLetter: 'รอจัดทำหนังสือ', NoticeSent: 'ส่งหนังสือแล้ว', ReceiptConfirmed: 'ยืนยันรับหนังสือ', FollowUpOrResendRequired: 'ต้องติดตามหรือส่งซ้ำ'
    }
  };

  const sourceCases = [
    { id: 'A5-2569-00142', version: '5.3', snapshotAt: '2026-08-01T09:30:00+07:00', caseNo: 'ปปท.1/142/2569', title: 'ตรวจสอบการจัดซื้ออุปกรณ์สำนักงาน', allegation: 'ปฏิบัติหน้าที่โดยมิชอบ', owner: roles.CaseOwner.name, bureau: roles.CaseOwner.unit, subjects: [{ personId: 'P-A5-142-01', name: 'นาย ก.', citizenId: '1-10XX-XXXXX-21-4' }] },
    { id: 'A5-2569-00157', version: '3.1', snapshotAt: '2026-08-02T14:10:00+07:00', caseNo: 'ปปท.1/157/2569', title: 'ตรวจสอบการเบิกจ่ายโครงการฝึกอบรม', allegation: 'เรียกรับผลประโยชน์', owner: roles.CaseOwner.name, bureau: roles.CaseOwner.unit, subjects: [{ personId: 'P-A5-157-01', name: 'นาง ข.', citizenId: '3-32XX-XXXXX-08-7' }] },
    { id: 'A5-2569-00166', version: '2.8', snapshotAt: '2026-08-03T11:05:00+07:00', caseNo: 'ปปท.1/166/2569', title: 'ตรวจสอบการใช้ทรัพย์สินราชการ', allegation: 'ใช้อำนาจหน้าที่โดยมิชอบ', owner: roles.CaseOwner.name, bureau: roles.CaseOwner.unit, subjects: [{ personId: 'P-A5-166-01', name: 'นาย ค.', citizenId: '2-45XX-XXXXX-46-2' }] }
  ];

  const now = '2026-08-04T10:00:00+07:00';
  const date = (day, time = '09:00:00') => `2026-08-${String(day).padStart(2, '0')}T${time}+07:00`;
  const task = (id, recordId, type, title, assignedRole, dueDate, actionTab, reason, priority = 'Normal') => ({
    id, recordId, type, title, assignedRole, assignedUnit: roles[assignedRole].unit, assignedUser: roles[assignedRole].name, createdAt: date(Math.max(1, Number(id.slice(-2)) || 1)), dueDate, status: 'Open', priority, actionTab, reason, sourceEvent: type, completedAt: null, completedBy: null
  });
  const audit = (id, action, actorRole, detail, dimension = 'System', from = '-', to = '-') => ({ id, at: date(Math.max(1, Number(id.slice(-2)) || 1)), action, actorRole, actor: roles[actorRole]?.name || 'ระบบ E-CMIS', detail, dimension, from, to });
  const doc = (id, type, name, version = 1, status = 'Draft') => ({ id, type, name, version, status, createdAt: date(Math.max(1, version)), createdBy: roles.CaseOwner.name, attachments: [] });

  function makeRecord(n, spec) {
    const id = `AW-DEMO-${String(n).padStart(4, '0')}`;
    const subjectIndex = (n - 1) % 14;
    const names = ['นาย ก.', 'นาง ข.', 'นาย ค.', 'นาง ง.', 'นาย จ.', 'นาง ฉ.', 'นาย ช.', 'นาง ซ.', 'นาย ฌ.', 'นาง ญ.', 'นาย ฎ.', 'นาง ฏ.', 'นาย ฐ.', 'นาง ฑ.'];
    const subjectName = names[subjectIndex];
    const subjectCitizenId = `${(n % 8) + 1}-${String(10 + n).padStart(2, '0')}XX-XXXXX-${String(10 + n).padStart(2, '0')}-${n % 9}`;
    return Object.assign({
      id,
      systemRef: `AW-2569-${String(n).padStart(6, '0')}`,
      requestNo: `คขม-${String(n).padStart(4, '0')}/2569`,
      warrantNo: null,
      subject: { personId: `P-DEMO-${String(n).padStart(3, '0')}`, name: subjectName, citizenId: subjectCitizenId, address: `เลขที่ XX ตำบลตัวอย่าง อำเภอตัวอย่าง จังหวัดตัวอย่าง` },
      caseNo: `ปปท.1/${String(120 + n)}/2569`,
      court: 'ศาลอาญาตัวอย่าง',
      bureau: 'สำนักปราบปรามการทุจริต 1',
      owner: roles.CaseOwner.name,
      source: { type: 'Activity5', caseId: `A5-2569-${String(120 + n).padStart(5, '0')}`, version: '1.0', snapshotAt: date(1) },
      issueDate: null,
      limitationDate: '2029-08-04',
      due180: null,
      updatedAt: date(Math.min(4, n)),
      dimensions: { request: 'Draft', review: 'NotStarted', dispatch: 'NotPrepared', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'NotDue' },
      currentStage: 'จัดทำคำขอ',
      currentTask: 'จัดทำข้อมูลคำขอออกหมายจับ',
      responsible: roles.CaseOwner.name,
      tasks: [], documents: [], audits: [], corrections: [], courtAttempts: [], dispatchAttempts: [], enforcementReports: [], handoverAttempts: [], terminationAttempts: [], withdrawalAttempts: [], day180Issues: [], notifications: [],
      versions: [{ version: 1, at: date(1), by: roles.CaseOwner.name, note: 'สร้างฉบับร่าง' }],
      dataQuality: { name: true, citizenId: true, address: true, issueDate: true, enforcementConsistent: true, withdrawalConsistent: true },
      warrantFields: {
        court: 'ศาลอาญาตัวอย่าง', filingDate: '2026-08-04', courtNote: '',
        petitionerName: roles.CaseOwner.name, petitionerTitle: roles.CaseOwner.title, petitionerAge: '38', petitionerOccupation: 'รับราชการ', petitionerWorkplace: 'สำนักงาน ป.ป.ท.', petitionerSubdistrict: 'คลองเกลือ', petitionerDistrict: 'ปากเกร็ด', petitionerProvince: 'นนทบุรี', petitionerPhone: '02-000-0000',
        prosecutorOffice: 'สำนักงานอัยการพิเศษฝ่ายคดีปราบปรามการทุจริต 1', requestedByRole: 'พนักงาน ป.ป.ท.', committeeResolutionSource: true,
        subjectName, subjectCitizenId, subjectAge: '45', subjectEthnicity: 'ไทย', subjectNationality: 'ไทย', subjectOccupation: 'ข้าราชการ',
        subjectAddressLine: 'เลขที่ 99 หมู่ 4 ถนนตัวอย่าง', subjectSubdistrict: 'ตัวอย่าง', subjectDistrict: 'ตัวอย่าง', subjectProvince: 'ตัวอย่าง', subjectPhone: '08X-XXX-XXXX',
        groundSevere: true, groundFlight: true,
        incidentPlace: 'สำนักงานหน่วยงานต้นสังกัดของผู้ถูกกล่าวหา', incidentDate: '2026-06-15', incidentTime: '10.00 น.',
        misconductNarrative: 'ผู้ถูกกล่าวหาใช้อำนาจหน้าที่โดยมิชอบในการอนุมัติเบิกจ่ายงบประมาณโดยไม่ดำเนินการตามระเบียบราชการ ก่อให้เกิดความเสียหายแก่ทางราชการ ตามที่ปรากฏในรายงานการไต่สวนของคณะกรรมการ ป.ป.ท.',
        damageDetail: 'ทางราชการได้รับความเสียหายเป็นจำนวนเงินตามที่ปรากฏในรายงานการไต่สวนและเอกสารประกอบที่แนบ',
        offenseSection: 'มาตรา 157 ประมวลกฎหมายอาญา',
        everRequestedBefore: 'no', everRequestedDetail: '-', transcriberName: roles.CaseOwner.name
      }
    }, spec, { id });
  }

  const records = [
    makeRecord(1, {
      source: { type: 'Activity5', caseId: sourceCases[0].id, version: sourceCases[0].version, snapshotAt: sourceCases[0].snapshotAt }, caseNo: sourceCases[0].caseNo,
      tasks: [task('TK-01', 'AW-DEMO-0001', 'PrepareRequest', 'จัดทำคำขอหมายจับ', 'CaseOwner', '2026-08-07', 'court', 'ได้รับข้อมูลจากกิจกรรมที่ 5')],
      documents: [doc('DOC-001', 'WarrantRequest', 'คำร้องขอออกหมายจับ', 1)], audits: [audit('AU-01', 'รับข้อมูลจากกิจกรรมที่ 5', 'CaseOwner', 'เชื่อม Source Case และ Snapshot Version แล้ว')]
    }),
    makeRecord(2, {
      dimensions: { request: 'AwaitingReadinessReview', review: 'NotStarted', dispatch: 'NotPrepared', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'NotDue' },
      currentStage: 'ตรวจความพร้อม', currentTask: 'ตรวจความพร้อมก่อนยื่นศาล', responsible: roles.PaccSupervisor.name,
      tasks: [task('TK-02', 'AW-DEMO-0002', 'ReviewReadiness', 'ตรวจความพร้อมคำขอ', 'PaccSupervisor', '2026-08-04', 'court', 'เจ้าของสำนวนส่งตรวจความพร้อม', 'High')],
      documents: [doc('DOC-002', 'WarrantRequest', 'คำร้องขอออกหมายจับ', 2, 'AwaitingReview'), doc('DOC-002-A1', 'InitiationOrder', 'หนังสือหรือคำสั่งที่เป็นเหตุเริ่มดำเนินการ', 1, 'Ready'), doc('DOC-002-A2', 'FactSummary', 'สรุปข้อเท็จจริง', 1, 'Ready'), doc('DOC-002-A3', 'SubjectProfile', 'ข้อมูลผู้ต้องหา', 1, 'Ready'), doc('DOC-002-A4', 'EvidenceAttachment', 'เอกสารประกอบพยานหลักฐาน', 1, 'Ready')], audits: [audit('AU-02', 'ส่งตรวจความพร้อม', 'CaseOwner', 'ส่งคำร้องฉบับที่ 2 ให้ผู้ตรวจ', 'Request', 'Draft', 'AwaitingReadinessReview')]
    }),
    makeRecord(3, {
      dimensions: { request: 'ReadinessCorrectionRequested', review: 'NotStarted', dispatch: 'NotPrepared', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'NotDue' },
      currentStage: 'แก้ไขคำขอ', currentTask: 'แก้ไขเหตุขอหมายและเอกสารประกอบ', responsible: roles.CaseOwner.name,
      tasks: [task('TK-03', 'AW-DEMO-0003', 'CorrectRequest', 'แก้ไขคำขอตามผลตรวจ', 'CaseOwner', '2026-08-03', 'court', 'เหตุขอหมายยังไม่เชื่อมกับข้อเท็จจริง', 'Urgent')],
      corrections: [{ id: 'CR-003', source: 'ReadinessReview', detail: 'กรุณาเพิ่มข้อเท็จจริงเชื่อมโยงเหตุขอหมาย', assignedRole: 'CaseOwner', dueDate: '2026-08-03', status: 'Open' }],
      documents: [doc('DOC-003', 'WarrantRequest', 'คำร้องขอออกหมายจับ', 1, 'Returned')], audits: [audit('AU-03', 'ส่งกลับแก้ไข', 'PaccSupervisor', 'เปิดข้อแก้ไข 1 รายการ', 'Request', 'AwaitingReadinessReview', 'ReadinessCorrectionRequested')]
    }),
    makeRecord(4, {
      dimensions: { request: 'CourtRequestedCorrection', review: 'NotStarted', dispatch: 'NotPrepared', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'NotDue' },
      currentStage: 'แก้ไขตามศาล', currentTask: 'จัดทำเอกสารเพิ่มเติมตามที่ศาลขอ', responsible: roles.CaseOwner.name,
      tasks: [task('TK-04', 'AW-DEMO-0004', 'CourtCorrection', 'แก้ไขเอกสารตามที่ศาลขอ', 'CaseOwner', '2026-08-06', 'court', 'ศาลขอสำเนาหลักฐานอำนาจผู้ยื่น', 'High')],
      courtAttempts: [{ attempt: 1, submittedAt: date(1), channel: 'ยื่นด้วยตนเอง', receiptNo: 'ศอ-รับ-001/69', result: 'CourtRequestedCorrection', note: 'ขอเอกสารเพิ่มเติม' }],
      corrections: [{ id: 'CR-004', source: 'Court', detail: 'แนบสำเนาหลักฐานอำนาจผู้ยื่น', assignedRole: 'CaseOwner', dueDate: '2026-08-06', status: 'Open' }], audits: [audit('AU-04', 'บันทึกผลศาลขอเอกสารเพิ่ม', 'CaseOwner', 'เก็บผลในรอบยื่นที่ 1')]
    }),
    makeRecord(5, {
      warrantNo: 'มจ.105/2569', issueDate: '2026-07-28', due180: '2027-01-24',
      dimensions: { request: 'WarrantIssued', review: 'AwaitingAgencyRegistration', dispatch: 'NotPrepared', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'NotDue' },
      currentStage: 'ลงทะเบียนรับหมาย', currentTask: 'ลงทะเบียนหมายที่สำนัก/กอง', responsible: roles.AgencyCaseAdministrator.name,
      tasks: [task('TK-05', 'AW-DEMO-0005', 'AgencyRegister', 'ลงทะเบียนรับหมาย', 'AgencyCaseAdministrator', '2026-08-05', 'review', 'ศาลออกหมายและส่งสำเนาหมายแล้ว')],
      documents: [doc('DOC-005', 'CourtWarrant', 'หมายจับฉบับศาลประทับตรา', 1, 'Issued')], audits: [audit('AU-05', 'บันทึกศาลออกหมาย', 'CaseOwner', 'เลขหมาย มจ.105/2569', 'Request', 'UnderCourtConsideration', 'WarrantIssued')]
    }),
    makeRecord(6, {
      warrantNo: 'มจ.106/2569', issueDate: '2026-06-10', due180: '2026-12-07',
      dimensions: { request: 'WarrantIssued', review: 'ReturnedForCorrection', dispatch: 'NotPrepared', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'NotDue' },
      currentStage: 'แก้ไขเอกสารหมาย', currentTask: 'ขอสำเนาหมายใหม่ที่อ่านได้', responsible: roles.AgencyCaseAdministrator.name,
      tasks: [task('TK-06', 'AW-DEMO-0006', 'CorrectWarrantReview', 'จัดส่งสำเนาหมายใหม่', 'AgencyCaseAdministrator', '2026-08-02', 'review', 'ไฟล์หมายหน้าที่ 2 อ่านไม่ได้', 'Urgent')],
      corrections: [{ id: 'CR-006', source: 'GotReview', detail: 'ไฟล์หมายหน้าที่ 2 อ่านไม่ได้ กรุณาแนบสำเนาใหม่', assignedRole: 'AgencyCaseAdministrator', dueDate: '2026-08-02', status: 'Open' }], audits: [audit('AU-06', 'กอท. ส่งกลับแก้ไข', 'GotReviewer', 'เอกสารอ่านไม่ได้ 1 รายการ', 'Review', 'UnderReview', 'ReturnedForCorrection')]
    }),
    makeRecord(7, {
      warrantNo: 'มจ.107/2569', issueDate: '2026-01-10', due180: '2026-07-09',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'PostalInTransit', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'DueAwaitingReview' },
      currentStage: 'ติดตามการนำส่ง', currentTask: 'ตรวจสถานะสิ่งส่ง', responsible: roles.GotOfficer.name,
      tasks: [task('TK-07', 'AW-DEMO-0007', 'TrackDispatch', 'ติดตามการนำส่งหมาย', 'GotOfficer', null, 'dispatch', 'ไปรษณีย์รับฝากและอยู่ระหว่างขนส่ง')],
      dispatchAttempts: [{ attempt: 1, type: 'WarrantDispatch', channel: 'Postal', trackingNumber: 'TH6900000007', sentAt: date(1), sentBy: roles.GotOfficer.name, current: true, status: 'PostalInTransit', events: [{ at: date(1), place: 'ปณ. ตัวอย่าง', detail: 'รับฝากแล้ว', status: 'PostalAccepted' }, { at: date(2), place: 'ศูนย์ไปรษณีย์ตัวอย่าง', detail: 'อยู่ระหว่างขนส่ง', status: 'PostalInTransit' }] }],
      audits: [audit('AU-07', 'บันทึกเลขติดตามสิ่งส่ง', 'GotOfficer', 'TH6900000007', 'Dispatch', 'PostalAwaitingTrackingNumber', 'PostalAccepted')]
    }),
    makeRecord(8, {
      warrantNo: 'มจ.108/2569', issueDate: '2025-12-20', due180: '2026-06-18',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'PostalDeliveryFailed', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'FollowUpOrResendRequired' },
      currentStage: 'แก้ไขการนำส่ง', currentTask: 'ตรวจที่อยู่และจัดส่งใหม่', responsible: roles.GotOfficer.name,
      tasks: [task('TK-08', 'AW-DEMO-0008', 'ResendDispatch', 'แก้ไขที่อยู่และส่งหมายใหม่', 'GotOfficer', '2026-08-04', 'dispatch', 'นำจ่ายไม่สำเร็จ: ไม่พบผู้รับตามจ่าหน้า', 'Urgent')],
      dispatchAttempts: [{ attempt: 1, type: 'WarrantDispatch', channel: 'Postal', trackingNumber: 'TH6900000008', sentAt: date(1), sentBy: roles.GotOfficer.name, current: true, status: 'PostalDeliveryFailed', failureReason: 'ไม่พบผู้รับตามจ่าหน้า', events: [{ at: date(1), place: 'ปณ. ตัวอย่าง', detail: 'รับฝากแล้ว', status: 'PostalAccepted' }, { at: date(3), place: 'ปณ. ปลายทาง', detail: 'นำจ่ายไม่สำเร็จ', status: 'PostalDeliveryFailed' }] }], audits: [audit('AU-08', 'รับสถานะนำจ่ายไม่สำเร็จ', 'GotOfficer', 'เปิดงานตรวจที่อยู่และส่งใหม่')]
    }),
    makeRecord(9, {
      warrantNo: 'มจ.109/2568', issueDate: '2025-10-10', due180: '2026-04-08',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'PostalDelivered', enforcement: 'CoordinationTracking', handover: 'NotRequired', termination: 'NoReason', day180: 'NoticeSent' },
      currentStage: 'ติดตามตามหมาย', currentTask: 'ติดตามผลครั้งถัดไป', responsible: roles.CaseOwner.name,
      tasks: [task('TK-09', 'AW-DEMO-0009', 'FollowEnforcement', 'ประสานติดตามผลตามหมาย', 'CaseOwner', '2026-08-09', 'enforcement', 'ตำรวจแจ้งว่าไม่พบตัว ให้ติดตามต่อ')],
      enforcementReports: [{ id: 'ER-009', occurredAt: date(2), receivedAt: date(2, '14:30:00'), channel: 'โทรศัพท์', result: 'NotFoundContinueTracking', verification: 'AwaitingEvidence', policeUnit: 'สถานีตำรวจตัวอย่าง', informer: 'เจ้าหน้าที่ประสานงาน', receiver: roles.CaseOwner.name, detail: 'ตรวจค้นตามที่อยู่แล้วไม่พบตัว', nextFollowUp: '2026-08-09' }],
      audits: [audit('AU-09', 'บันทึกผลไม่พบตัว', 'CaseOwner', 'รับแจ้งทางโทรศัพท์และกำหนดติดตามต่อ', 'Enforcement', 'CoordinationTracking', 'CoordinationTracking')]
    }),
    makeRecord(10, {
      warrantNo: 'มจ.110/2568', issueDate: '2025-09-15', due180: '2026-03-14',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'PostalDelivered', enforcement: 'Arrested', handover: 'AwaitingProsecutorCoordination', termination: 'ReviewingReasonAndEvidence', day180: 'NotDue' },
      currentStage: 'ส่งตัวให้อัยการ', currentTask: 'ประสานนัดส่งตัว', responsible: roles.CaseOwner.name,
      tasks: [task('TK-10', 'AW-DEMO-0010', 'ManageHandover', 'ประสานนัดส่งตัวให้อัยการ', 'CaseOwner', '2026-08-04', 'handover', 'ยืนยันผลจับกุมแล้ว', 'Urgent')],
      enforcementReports: [{ id: 'ER-010', occurredAt: date(2), receivedAt: date(2), channel: 'หนังสือราชการ', result: 'ArrestSucceeded', verification: 'Confirmed', participation: 'PoliceOnly', policeUnit: 'สถานีตำรวจตัวอย่าง', receiver: roles.CaseOwner.name, detail: 'ตำรวจจับกุมและแจ้งผลพร้อมบันทึกการจับกุม', custodyAgency: 'สถานีตำรวจตัวอย่าง', requiresHandover: true }],
      documents: [doc('DOC-010', 'ArrestRecord', 'บันทึกการจับกุม', 1, 'Complete')], audits: [audit('AU-10', 'ยืนยันผลจับกุม', 'GotReviewer', 'สร้างงานประสานส่งตัวให้อัยการ', 'Enforcement', 'CoordinationTracking', 'Arrested')]
    }),
    makeRecord(11, {
      warrantNo: 'มจ.111/2568', issueDate: '2025-07-01', due180: '2025-12-28',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'PostalDelivered', enforcement: 'Arrested', handover: 'Completed', termination: 'InternallyApproved', day180: 'NotDue' },
      currentStage: 'แจ้งยุติ', currentTask: 'จัดทำหนังสือแจ้งตำรวจและสำนัก/กอง', responsible: roles.GotOfficer.name,
      tasks: [task('TK-11A', 'AW-DEMO-0011', 'PrepareTerminationNotice', 'จัดทำหนังสือแจ้งยุติให้ตำรวจ', 'GotOfficer', '2026-08-05', 'termination', 'กิจกรรมที่ 7 อนุมัติภายในแล้ว', 'High')],
      terminationAttempts: [{ attempt: 1, sentAt: date(2), result: 'Approved', source: 'Activity7', packageRef: 'A7-2569-00011', note: 'อนุมัติให้ดำเนินการแจ้งหน่วยงานและรายงานศาล' }],
      audits: [audit('AU-11', 'รับผลอนุมัติจากกิจกรรมที่ 7', 'GotReviewer', 'ผลอนุมัติภายใน ไม่ใช่คำสั่งถอนจากศาล', 'Termination', 'SentToActivity7', 'InternallyApproved')]
    }),
    makeRecord(12, {
      warrantNo: 'มจ.112/2567', issueDate: '2024-05-01', due180: '2024-10-28',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'PostalDelivered', enforcement: 'Arrested', handover: 'Completed', termination: 'WithdrawnByCourt', day180: 'NotDue' },
      currentStage: 'เสร็จสิ้น', currentTask: 'ไม่มีงานเปิด', responsible: '-',
      tasks: [], withdrawalAttempts: [{ attempt: 1, submittedAt: '2026-07-15T10:00:00+07:00', receiptNo: 'ศอ-ถอน-112/69', result: 'Withdrawn', orderNo: 'คส.ถอน 88/2569', orderDate: '2026-07-30', court: 'ศาลอาญาตัวอย่าง', documentId: 'DOC-012-W' }],
      documents: [doc('DOC-012-W', 'WithdrawalOrder', 'คำสั่งถอนหมายจับ', 1, 'Complete')], audits: [audit('AU-12', 'ยืนยันคำสั่งถอนจากศาล', 'AgencyCaseAdministrator', 'มีเลขคำสั่ง วันที่ และไฟล์ยืนยันครบ', 'Termination', 'AwaitingWithdrawalOrder', 'WithdrawnByCourt')]
    }),
    makeRecord(13, {
      warrantNo: 'มจ.113/2568', issueDate: '2025-12-01', due180: '2026-05-30',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'PostalDelivered', enforcement: 'CoordinationTracking', handover: 'NotRequired', termination: 'NoReason', day180: 'AwaitingLetter' },
      currentStage: 'ครบ 180 วัน', currentTask: 'จัดทำหนังสือถึงทะเบียนกลาง', responsible: roles.GotOfficer.name,
      tasks: [task('TK-13', 'AW-DEMO-0013', 'ManageDay180', 'จัดทำหนังสือครบกำหนด 180 วัน', 'GotOfficer', '2026-08-06', 'day180', 'ผ่านการคัดกรองและยืนยันข้อมูลแล้ว', 'High')],
      audits: [audit('AU-13', 'ผ่านการคัดกรอง 180 วัน', 'GotOfficer', 'ชื่อ เลขประชาชน ที่อยู่ และสถานะหมายครบ')]
    }),
    makeRecord(14, {
      warrantNo: 'มจ.114/2568', issueDate: '2025-11-15', due180: '2026-05-14',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'PostalDelivered', enforcement: 'CoordinationTracking', handover: 'NotRequired', termination: 'NoReason', day180: 'DataQualityBlocked' },
      currentStage: 'แก้ไขคุณภาพข้อมูล', currentTask: 'ตรวจสอบที่อยู่ตามทะเบียนล่าสุด', responsible: roles.CaseOwner.name,
      tasks: [task('TK-14', 'AW-DEMO-0014', 'ResolveDataQuality', 'แก้ไขข้อมูลที่อยู่ก่อนทำหนังสือ 180 วัน', 'CaseOwner', '2026-08-05', 'day180', 'ที่อยู่จากสองแหล่งข้อมูลไม่ตรงกัน', 'Urgent')],
      dataQuality: { name: true, citizenId: true, address: false, issueDate: true, enforcementConsistent: true, withdrawalConsistent: true },
      day180Issues: [{ id: 'DQ-014', field: 'ที่อยู่ตามทะเบียนบ้าน', detail: 'ข้อมูลจากเอกสารล่าสุดไม่ตรงกับทะเบียนในแฟ้ม', status: 'Open', assignedRole: 'CaseOwner', dueDate: '2026-08-05' }], audits: [audit('AU-14', 'สร้างประเด็นคุณภาพข้อมูล', 'GotOfficer', 'นำออกจาก Batch จนกว่าจะแก้ไข')]
    }),
    makeRecord(15, {
      warrantNo: 'มจ.115/2569', issueDate: '2026-05-10', due180: '2026-11-06',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'NotPrepared', enforcement: 'NotStarted', handover: 'NotRequired', termination: 'NoReason', day180: 'NotDue' },
      currentStage: 'จัดทำหนังสือนำส่ง', currentTask: 'จัดทำหนังสือนำส่งหมายให้ตำรวจ', responsible: roles.GotOfficer.name,
      tasks: [task('TK-15', 'AW-DEMO-0015', 'PrepareDispatch', 'จัดทำหนังสือนำส่งหมาย', 'GotOfficer', '2026-08-05', 'dispatch', 'หมายผ่านการตรวจรับครบถ้วน')], audits: [audit('AU-15', 'ตรวจหมายครบถ้วน', 'GotReviewer', 'เปิดงานจัดทำหนังสือนำส่ง', 'Review', 'UnderReview', 'Complete')]
    }),
    makeRecord(16, {
      warrantNo: 'มจ.116/2568', issueDate: '2025-08-15', due180: '2026-02-11',
      dimensions: { request: 'WarrantIssued', review: 'Complete', dispatch: 'ManualReceived', enforcement: 'Detained', handover: 'NotRequired', termination: 'NoReason', day180: 'NotDue' },
      currentStage: 'อายัดตัว', currentTask: 'ติดตามสถานะการควบคุมตัว', responsible: roles.CaseOwner.name,
      tasks: [task('TK-16', 'AW-DEMO-0016', 'FollowDetention', 'ติดตามการอายัดตัว', 'CaseOwner', null, 'enforcement', 'ยังไม่เข้าเงื่อนไขส่งตัวให้อัยการ')],
      enforcementReports: [{ id: 'ER-016', occurredAt: date(2), receivedAt: date(2), channel: 'หนังสือราชการ', result: 'Detained', verification: 'Confirmed', custodyAgency: 'เรือนจำตัวอย่าง', requiresHandover: false, receiver: roles.CaseOwner.name, detail: 'อายัดตัวในคดีอื่นและยังไม่ต้องส่งอัยการ' }], audits: [audit('AU-16', 'ยืนยันผลอายัดตัว', 'GotReviewer', 'ไม่สร้างงานส่งอัยการเพราะยังไม่เข้าเงื่อนไข', 'Enforcement', 'CoordinationTracking', 'Detained')]
    })
  ];

  const reports = [
    ['Registry', 'รายงานทะเบียนหมายจับ'], ['Outstanding', 'รายงานหมายค้าง'], ['Arrested', 'รายงานจับกุม'], ['Detained', 'รายงานอายัดตัว'], ['LimitationExpired', 'รายงานขาดอายุความ'],
    ['Deceased', 'รายงานผู้ต้องหาเสียชีวิต'], ['Withdrawn', 'รายงานถอนหมาย'], ['Day180', 'รายงานครบ 180 วัน'], ['NearLimitation', 'รายงานหมายใกล้ขาดอายุความ'],
    ['DispatchHistory', 'รายงานประวัติการนำส่ง'], ['AuditHistory', 'รายงานประวัติการแก้ไขและ Audit Log']
  ];

  const scenarios = {
    A: { name: 'Happy Path: กิจกรรมที่ 5 ถึงศาลถอนหมาย', recordId: 'AW-DEMO-0001', role: 'CaseOwner', steps: ['submit-readiness', 'readiness-pass', 'submit-court', 'court-under-review', 'court-issued', 'agency-register', 'agency-forward', 'got-receive', 'review-start', 'review-complete', 'dispatch-prepare', 'dispatch-postal', 'add-tracking', 'tracking-sync', 'tracking-sync', 'tracking-sync', 'enforcement-arrest', 'verify-enforcement', 'handover-schedule', 'handover-complete', 'termination-start', 'termination-ready', 'activity7-submit', 'activity7-approved', 'termination-notice', 'agency-ack', 'withdrawal-submit', 'withdrawal-order'] },
    B: { name: 'ผู้บังคับบัญชาชั้นต้นส่งกลับคำขอแก้ไข', recordId: 'AW-DEMO-0002', role: 'PaccSupervisor', steps: ['readiness-return', 'correction-resubmit', 'readiness-pass'] },
    C: { name: 'ศาลขอแก้ไขและยื่นใหม่', recordId: 'AW-DEMO-0004', role: 'CaseOwner', steps: ['court-correction-resubmit', 'court-under-review', 'court-issued'] },
    D: { name: 'กอท. ส่งกลับเอกสารหมาย', recordId: 'AW-DEMO-0006', role: 'AgencyCaseAdministrator', steps: ['review-resubmit', 'review-start', 'review-complete'] },
    E: { name: 'ไปรษณีย์ไม่สำเร็จและส่งใหม่', recordId: 'AW-DEMO-0008', role: 'GotOfficer', steps: ['dispatch-resend', 'add-tracking', 'tracking-sync', 'tracking-sync', 'tracking-sync'] },
    F: { name: 'ตำรวจแจ้งไม่พบตัวและติดตามต่อ', recordId: 'AW-DEMO-0009', role: 'CaseOwner', steps: ['enforcement-not-found'] },
    G: { name: 'ตำรวจจับเองแล้วส่งอัยการ', recordId: 'AW-DEMO-0010', role: 'CaseOwner', steps: ['handover-schedule', 'handover-complete'] },
    H: { name: 'ป.ป.ท. และตำรวจร่วมจับ', recordId: 'AW-DEMO-0009', role: 'CaseOwner', steps: ['enforcement-joint-arrest', 'verify-enforcement'] },
    I: { name: 'กิจกรรมที่ 7 ขอข้อมูลเพิ่ม', recordId: 'AW-DEMO-0011', role: 'GotReviewer', steps: ['activity7-more-info', 'termination-ready', 'activity7-submit', 'activity7-approved'] },
    J: { name: 'ศาลขอเอกสารเพิ่มก่อนถอน', recordId: 'AW-DEMO-0011', role: 'AgencyCaseAdministrator', steps: ['termination-notice', 'agency-ack', 'withdrawal-submit', 'withdrawal-more-docs', 'withdrawal-resubmit', 'withdrawal-order'] },
    K: { name: 'ผู้ต้องหาเสียชีวิต', recordId: 'AW-DEMO-0009', role: 'CaseOwner', steps: ['enforcement-deceased', 'verify-enforcement', 'termination-start'] },
    L: { name: 'คดีขาดอายุความ', recordId: 'AW-DEMO-0009', role: 'CaseOwner', steps: ['enforcement-expired', 'verify-enforcement', 'termination-start'] },
    M: { name: 'ศาลมีคำสั่งหรือคำพิพากษา', recordId: 'AW-DEMO-0009', role: 'CaseOwner', steps: ['termination-court-order', 'confirm-court-effect', 'termination-ready'] },
    N: { name: 'ครบ 180 วันและหนังสือกรมการปกครอง', recordId: 'AW-DEMO-0013', role: 'GotOfficer', steps: ['day180-letter', 'day180-send', 'day180-receipt'] }
  };

  window.Activity9Seed = {
    schemaVersion: 6,
    now,
    labels,
    roles,
    permissionMatrix,
    sourceCases,
    reports,
    scenarios,
    create() {
      return JSON.parse(JSON.stringify({ schemaVersion: 6, clock: now, currentRole: 'CaseOwner', records, sourceCases, reports, notifications: [], executiveOrders: [], createDraft: { step: 1, sourceMode: 'Activity5', sourceCaseId: sourceCases[1].id }, ui: { selectedReport: 'Registry', presenterScenario: 'A', presenterStep: 0 } }));
    }
  };
}());
