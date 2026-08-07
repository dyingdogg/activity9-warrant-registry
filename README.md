# Activity 9 — Interactive HTML Mockup

Mockup แบบ Interactive สำหรับ “กิจกรรมที่ 9 ระบบฐานข้อมูลการดำเนินการตามหมายจับ” ถอด Design Language, Component, สถานะ และกติกาสำคัญจากระบบ E-CMIS Blazor/.NET โดยทำงานแยกจาก Repository ต้นทางทั้งหมด

> ข้อมูลทุกชื่อ เลขคดี หมาย และเอกสารเป็นข้อมูลสมมติสำหรับสาธิต ห้ามใช้เป็นข้อมูลราชการจริง

## วิธีเปิด

### เปิดผ่าน Static HTTP Server (แนะนำ)

```bash
cd /Users/thanthita.korn/Desktop/activity9-html
python3 -m http.server 4173
```

จากนั้นเปิด:

- หน้าปกติ: `http://localhost:4173/`
- โหมดนำเสนอ: `http://localhost:4173/?presenter=1`

### เปิดไฟล์โดยตรง

เปิด `index.html` ด้วย Browser ได้โดยตรงใน Browser ที่อนุญาต JavaScript และ `localStorage` สำหรับ `file://` หาก Browser จำกัดการเก็บข้อมูล ให้ใช้ Static HTTP Server ตามวิธีข้างต้น

ไม่ต้อง Build .NET, ไม่ใช้ CDN และไม่เรียก Backend จริง

## ผลตรวจล่าสุด

- Chromium Browser QA ผ่าน 37/37 รายการ: Routes, Registry/My Work separation, สร้างคำขอและ Reload, Scenario A–N, 7 บทบาท, Export, Presenter Reset, `file://` และ Responsive
- Console Error 0 และไม่มี Network request ออกนอก Static Host
- หลักฐานแบบอ่านโดยเครื่อง: [`assets/samples/browser-qa-result.json`](assets/samples/browser-qa-result.json)
- ภาพหน้าจอ: [`assets/screenshots/`](assets/screenshots/)

## หน้าหลัก

- `#/registry` — ทะเบียนคำขอและหมายทั้งหมดตามสิทธิ ใช้ค้นหา กรอง เรียง และเปิดแฟ้ม
- `#/my-work` — เฉพาะงานเปิดของบทบาทปัจจุบัน มี Due Date, Priority และ Deep link ไปขั้นทำงาน
- `#/create` — Stepper 6 ขั้น รองรับกิจกรรมที่ 5, เจ้าหน้าที่บันทึกข้อมูล และนำเข้าหมายเก่า
- `#/warrant/{id}?tab=...` — แฟ้มหมายจับ 360 องศา แยกสถานะ 7 มิติและ 8 Tabs
- `#/day180` — คัดกรอง Data Quality จัดทำหนังสือ ส่ง ยืนยันรับ และติดตามส่งซ้ำ
- `#/reports` — Dashboard, Drill-down, รายงาน, Export และ Notification Center

## โหมดนำเสนอ

เพิ่ม `?presenter=1` ก่อน Hash เพื่อเปิด Presenter Drawer เช่น:

```text
http://localhost:4173/?presenter=1#/registry
```

Drawer ใช้สำหรับทีมสาธิตเท่านั้นและไม่ปรากฏใน URL ปกติ รองรับ:

- เปลี่ยน 7 บทบาทเพื่อดูเมนู สิทธิ และคิวงานต่างกัน
- เลือก Scenario A–N
- เดินขั้นก่อนหน้า/ถัดไป
- เปิดแฟ้มของ Scenario
- Reset ข้อมูลสมมติ
- อธิบายผู้ปฏิบัติงาน ข้อมูลเข้า ผลที่ได้รับ และงานถัดไป

การจำลองผลจากกิจกรรมที่ 7 ทำได้เฉพาะ Presenter Mode เพื่อไม่ให้หน้าปฏิบัติงานมีปุ่มสร้างผลอนุมัติเอง

## ข้อมูลและ Persistence

- State ทั้งหมดเก็บใน `localStorage` key `ecmis.activity9.html.v3`
- Registry, My Work, Dashboard, Report, Document, Timeline และ Notification อ่าน State ชุดเดียวกัน
- Refresh แล้ว State ยังคงอยู่
- Reset อยู่เฉพาะ Presenter Mode
- เอกสารแก้ไขเพิ่ม Version ใหม่และไม่ลบ Version เดิม
- ทุก Action สำคัญสร้าง Audit Event พร้อมผู้ทำ บทบาท วันเวลา มิติสถานะเดิม/ใหม่ และรายละเอียด

## กติกาที่ Mockup รักษา

- การยื่นและรับผลศาลเป็นการบันทึกโดยเจ้าหน้าที่; AWIS แสดง `รอ MOU/รอ Interface`
- ข้อมูลผลจากตำรวจเข้าผ่านโทรศัพท์ หนังสือ หรือการประสานงาน แล้วเจ้าหน้าที่บันทึก
- หนังสือส่งให้ตำรวจผ่านไปรษณีย์หรือนำส่งด้วยตนเอง
- Tracking บันทึกครั้งเดียวต่อ Attempt และ Event ถัดไปเพิ่มใน Timeline
- นำจ่ายเอกสารสำเร็จไม่เปลี่ยนสถานะผลตามหมายเป็นจับกุม
- ส่งตัวให้อัยการเป็นการบันทึกผลจากบุคคลภายนอก ไม่มีบัญชีอัยการใน E-CMIS
- ผลอนุมัติภายในจากกิจกรรมที่ 7 ไม่ใช่คำสั่งถอนจากศาล
- หนังสือครบ 180 วันที่ได้รับการยืนยันรับ ไม่ใช่ผลย้ายทะเบียนบ้านกลาง
- Notification Email/LINE/Push เป็น Safe Summary และลิงก์กลับ E-CMIS ไม่ใช่หนังสือราชการ

รายละเอียด Flow และ Assignment อยู่ใน [FLOW_MATRIX.md](FLOW_MATRIX.md) และผล QA อยู่ใน [QA_CHECKLIST.md](QA_CHECKLIST.md)

## Export ใน Mockup

- Word: ดาวน์โหลดไฟล์ `.doc` ที่เป็น HTML-compatible document
- Excel: ดาวน์โหลด `.csv` แบบ UTF-8 BOM เปิดใน Excel ได้
- PDF: เปิด Print View เพื่อเลือก “Save as PDF” จาก Browser

ไฟล์เหล่านี้เป็นตัวอย่างการทำงานของ Frontend ไม่ใช่ Template ราชการฉบับยืนยัน

## โครงสร้างโค้ด

- `js/seed-data.js` — ข้อมูลสมมติ 16 แฟ้ม บทบาท สิทธิ Label และ Scenario
- `js/store.js` — State กลางและ localStorage
- `js/state-machine.js` — Permission guard, transition, task, audit, notification และ document version
- `js/router.js` — Hash router เพื่อรองรับ Static Server และการเปิด `index.html`
- `js/document-preview.js` — เอกสารกระดาษราชการ Preview, Print และ Export
- `js/presentation-mode.js` — Presenter-only role/scenario controls
- `js/app.js` — Rendering และ Interaction ของทุกหน้า

## ข้อจำกัดของ Simulation

- ไม่เชื่อม Backend, Authentication, Activity 5, Activity 7, AWIS, Postal Tracking, DOPA หรือ Notification Gateway จริง
- Activity 5 ใช้ Snapshot fixture เพื่อสาธิต Contract และ Duplicate guard เท่านั้น
- Postal Event เป็นลำดับจำลองจาก State Machine ไม่ใช่ข้อมูลสถานะสิ่งส่งจริง
- เอกสารที่เลือกผ่าน `<input type="file">` ไม่ถูกอัปโหลดหรืออ่านเนื้อหา
- Clock ของข้อมูลเริ่มจากวันที่ควบคุมเพื่อให้ Scenario ทำซ้ำได้
- รูปแบบเลขอ้างอิงและ Template ราชการเป็นรูปแบบชั่วคราว ต้องยืนยันกับเจ้าของกระบวนงานก่อนพัฒนา Backend จริง
