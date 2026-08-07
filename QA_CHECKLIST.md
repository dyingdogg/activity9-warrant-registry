# QA Checklist — Activity 9 HTML Mockup

วันที่ตรวจ: 4 สิงหาคม 2569  
Environment: Static HTML/CSS/Vanilla JavaScript, Chromium  
ข้อมูล: ข้อมูลสมมติสำหรับสาธิต

## ผลตรวจ Browser จริง

- Chromium automation: **ผ่าน 37/37 รายการ**, Fail 0
- Scenario A–N: ผ่านทุก Scenario และตรวจสถานะปลายทางจากหน้าจอ
- บทบาท: ตรวจครบ 7 บทบาท; ผู้บริหารไม่มีเมนูสร้างคำขอ ไม่มีงานปฏิบัติการ และไม่มีปุ่มเปลี่ยนสถานะ
- Navigation: Registry ↔ My Work, Back/Forward และ Deep Link ไม่เกิด State Leak
- Persistence: สร้างคำขอจากกิจกรรมที่ 5 แล้ว Full Reload ยังอยู่ในสถานะล่าสุด
- Presenter: Reset ข้อมูลผ่าน Confirmation แล้วกลับสู่ทะเบียน Seed เริ่มต้น
- Responsive: 1440×900, 768×900 และ 390×844 ไม่มี Root Horizontal Overflow
- Console Error: 0; Network request นอก Static Host/`file://`: 0
- เปิด `index.html` โดยตรงผ่าน `file://`: ผ่าน
- Word/Excel ดาวน์โหลดเป็นไฟล์จริง; PDF เปิด Print View สำหรับ Save as PDF

ผลแบบอ่านโดยเครื่องอยู่ที่ `assets/samples/browser-qa-result.json` และภาพหลักฐานอยู่ใน `assets/screenshots/`

## เกณฑ์พื้นฐาน

| รายการ | วิธีตรวจ | ผล | หมายเหตุ |
|---|---|---|---|
| เปิดโดยไม่ Build .NET | Static HTTP Server และ `file://` | ผ่าน | ทดสอบทั้งสองแบบ |
| ไฟล์ทั้งหมดอยู่นอก Repository | ตรวจ Path | ผ่าน | `/Users/thanthita.korn/Desktop/activity9-html` |
| ไม่มี CDN/Backend request | ตรวจ Source และ Network | ผ่าน | Unexpected request 0 |
| localStorage คง State หลัง Refresh | สร้างคำขอแล้ว Full Reload | ผ่าน | Heading และงานถัดไปคงเดิม |
| Normal mode ไม่มี Presenter Tools | เปิดโดยไม่มี query | ผ่าน | |
| Registry กับ My Work คนละหน้า/ข้อมูล | สลับ Route และตรวจ Table | ผ่าน | |
| Console ไม่มี JavaScript Error | ตรวจ Browser Console | ผ่าน | Error 0 |
| Keyboard/Focus | Tab ผ่านเมนู ตาราง และฟอร์ม | ผ่าน | Focus ย้ายออกจาก `body` และเห็น Focus Ring |
| Desktop/Tablet/Mobile | 1440×900, 768×900, 390×844 | ผ่าน | Root overflow = false ทุกขนาด |

## Scenario A–N

| Scenario | จุดเริ่ม | Transition ที่ต้องยืนยัน | ผล | หลักฐาน/หมายเหตุ |
|---|---|---|---|---|
| A Happy Path | กิจกรรมที่ 5/ฉบับร่าง | ส่งตรวจ → ศาลออกหมาย → ตรวจรับ → นำส่ง → จับกุม → ส่งตัว → กิจกรรม 7 → รายงานศาล → ถอน | ผ่าน | |
| B ผู้ตรวจส่งกลับ | รอตรวจความพร้อม | ส่งกลับ → Version ใหม่ → ผ่านตรวจ | ผ่าน | |
| C ศาลขอแก้ | ศาลขอเอกสาร | ยื่นรอบใหม่และเก็บรอบเดิม | ผ่าน | |
| D กอท. ส่งกลับ | เอกสารอ่านไม่ได้ | แนบฉบับใหม่ → ตรวจซ้ำ → ผ่าน | ผ่าน | |
| E ไปรษณีย์ไม่สำเร็จ | นำจ่ายไม่สำเร็จ | ปิด Attempt เดิม → Tracking ใหม่ → Delivered | ผ่าน | |
| F ไม่พบตัว | อยู่ระหว่างติดตาม | Append เหตุการณ์และกำหนดติดตามต่อ | ผ่าน | |
| G ตำรวจจับเอง | จับกุมยืนยันแล้ว | นัดและส่งตัวให้อัยการ | ผ่าน | |
| H ป.ป.ท. ร่วมตำรวจจับ | อยู่ระหว่างติดตาม | บันทึกรูปแบบร่วมจับ → ตรวจหลักฐาน | ผ่าน | |
| I กิจกรรม 7 ขอข้อมูล | อนุมัติภายใน/รอผล | ขอเพิ่ม → ส่งกลับ → อนุมัติ | ผ่าน | Presenter-only external result |
| J ศาลขอเอกสารถอน | อนุมัติภายใน | แจ้งหน่วยงาน → ยื่นศาล → ขอเพิ่ม → ยื่นใหม่ → ถอน | ผ่าน | |
| K เสียชีวิต | อยู่ระหว่างติดตาม | บันทึกข่าว → รอหลักฐาน → ยืนยัน → ตรวจเหตุยุติ | ผ่าน | |
| L ขาดอายุความ | อยู่ระหว่างติดตาม | บันทึกหลักฐาน → ยืนยัน → ตรวจเหตุยุติ | ผ่าน | |
| M คำสั่ง/คำพิพากษาศาล | อยู่ระหว่างติดตาม | บันทึกวันมีผล → เจ้าของสำนวนยืนยัน → พร้อมเสนอ | ผ่าน | |
| N ครบ 180 วัน | รอจัดทำหนังสือ | Draft → ส่ง → ยืนยันรับ โดยไม่สรุปผลย้ายทะเบียน | ผ่าน | |

## Role และ Permission

| บทบาท | งาน/สิทธิที่ต้องเห็น | Negative check | ผล |
|---|---|---|---|
| เจ้าของสำนวน | สร้าง/แก้คำขอ ยื่นศาล บันทึกผล ติดตาม ส่งตัว | ห้ามตรวจความพร้อมแทนผู้ตรวจ | ผ่าน |
| ธุรการสำนัก/กอง | ลงทะเบียน ส่งต่อ รับทราบ รายงานศาล | ห้ามยืนยันผลตรวจ กอท. | ผ่าน |
| เจ้าหน้าที่ กอท. | รับหมาย จัดทำ/นำส่ง ติดตาม 180 วัน | ห้ามอนุมัติผลกิจกรรมที่ 7 | ผ่าน |
| ผู้ตรวจ กอท. | ตรวจความพร้อม ตรวจหมาย ยืนยันผล หลักฐานยุติ | ห้ามทำงานเจ้าของสำนวน | ผ่าน |
| ผู้บังคับบัญชา | ตรวจ/กำกับตาม Permission | ห้ามสร้างผลศาล | ผ่าน |
| ผู้อำนวยการสำนัก/กอง | รับทราบ/รายงานตาม Assignment | ห้ามแก้ผลตามหมาย | ผ่าน |
| ผู้บริหาร | Registry/Dashboard แบบอ่านอย่างเดียว | ไม่มีปุ่ม Mutation | ผ่าน |

## Invariant

| Invariant | จุดตรวจ | ผล |
|---|---|---|
| Delivered ≠ Arrested | Dispatch และ Dimension Summary | ผ่าน |
| โทรศัพท์ ≠ ยืนยันผลสำคัญ | Enforcement report/verification | ผ่าน |
| Arrested ≠ Handover Completed | Dimension Summary | ผ่าน |
| Handover Completed ≠ Internal Approval | Termination tab | ผ่าน |
| Activity 7 Approved ≠ Court Withdrawn | Termination dimensions | ผ่าน |
| Notice sent ≠ Court Withdrawn | Termination dimensions | ผ่าน |
| Day 180 Receipt ≠ DOPA action completed | Day 180 workspace | ผ่าน |
| Notification ≠ official letter | Notification Center copy | ผ่าน |
| Version/Attempt history append-only | Correction, court, tracking timeline | ผ่าน |

## Export และเอกสาร

| รายการ | ผล | หมายเหตุ |
|---|---|---|
| Preview เอกสารกระดาษราชการ | ผ่าน | ต้องมีข้อมูลสมมติ/Version/สถานะ |
| Print เอกสาร | ผ่าน | Browser Print View |
| Word download | ผ่าน | `assets/samples/generated-registry.doc` เปิดเป็น HTML-compatible document |
| Excel download | ผ่าน | `assets/samples/generated-registry.csv` เป็น UTF-8 CSV |
| PDF Print View | ผ่าน | เปิดหน้าพิมพ์ชื่อรายงานถูกต้องเพื่อ Save as PDF |
| Notification link กลับแฟ้ม | ผ่าน | ต้องผูก Recipient และสิทธิ |

## ประเด็นที่ต้องยืนยันกับลูกค้า

- รูปแบบเลขอ้างอิงระบบและเลขหนังสือราชการฉบับจริง
- Permission Matrix รายตำแหน่งและสายมอบหมายเมื่อ Backend Identity พร้อม
- Due Date/SLA ของงานแต่ละประเภท
- รายการเอกสารบังคับตามเหตุและขั้นตอน
- เงื่อนไขว่าต้องรอหลักฐานรับหนังสือก่อนรายงานศาลหรือไม่ (Mockup ใช้ค่าเริ่มต้น “มีหลักฐานส่งแล้วก็เปิดงาน”)
- Contract ของ Activity 5, Activity 7, AWIS, Postal Tracking, DOPA และ Notification Gateway
- Timezone/Cut-off สำหรับการคำนวณ 180 วันใน Production
