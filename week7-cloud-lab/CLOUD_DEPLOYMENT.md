# Cloud Deployment Analysis
## ENGSE207 - Week 7 Lab

**ชื่อ-นามสกุล:** ธนภัทร นุกูล
**รหัสนักศึกษา:** 67543210031-0

### 1.1 URLs ของระบบที่ Deploy

| Service | URL |
|---------|-----|
| Frontend | https://taskboard-frontend-production-be60.up.railway.app/ |
| Backend API | https://engse207-production.up.railway.app/api |
| Database | (Internal - ไม่มี public URL) |

### 1.2 Screenshot หลักฐาน (5 รูป)

1. [x] Railway Dashboard แสดง 3 Services

![RailwayDashboard](/img/ailwayDashboard.png)

2. [x] Frontend ทำงานบน Browser

![Frontend](/img/frontend.png)

3. [x] API Health check response

![health](/img/health.png)

4. [x] Logs แสดง requests

![log](/img/log.png)

5. [x] Metrics แสดง CPU/Memory

![lmetrics](/img/metrics.png)
---

### 2.1 ความแตกต่างที่สังเกตเห็น (10 คะแนน)

| ด้าน | Docker (Week 6) | Railway (Week 7) |
|------|-----------------|------------------|
| เวลา Deploy | รันได้ทันที | รอ Build/Deploy |
| การตั้งค่า Network | ใช้ Docker Network | Railway Internal Network และ Public URL |
| การจัดการ ENV | เก็บไว้ใน .env | ใช้ Dashboard |
| การดู Logs | docker logs ผ่าน Terminal | Dashboard แบบ Real-time |
| การ Scale | แก้ไขไฟล์ Config และรันใหม่ | ผ่านหน้า UI พื่อเพิ่มทรัพยากรหรือจำนวน Instance |

### 2.2 ข้อดี/ข้อเสีย ของแต่ละแบบ (5 คะแนน)

**Docker Local:**
- ข้อดี: ฟรี รันได้เร็วไม่ต้องใช้ Internet
- ข้อเสีย: ไม่สามารถเข้าถึงจากภายนอก

**Railway Cloud:**
- ข้อดี: เข้าถึงได้จากทุกที่, มีระบบจัดการฐานข้อมูล และ SSL ให้โดยอัตโนมัติ
- ข้อเสีย: มีค่าใช้จ่าย, ต้องใช้อินเทอร์เน็ตในการอัปเดตงาน

---
### 3.1 Railway เป็น Service Model แบบไหน?

[ ] IaaS   [x] PaaS   [ ] SaaS

เพราะ: Railway จัดการโครงสร้างพื้นฐานระดับล่างให้ทั้งหมด ไม่ว่าจะเป็น Server, Operating System (OS), Runtime (เช่น Node.js), และการทำ Network/SSL โดยที่นักศึกษา (ผู้พัฒนา) มีหน้าที่เพียงแค่จัดการในส่วนของ Application Code และ Data (Database) เท่านั้น ซึ่งช่วยให้โฟกัสไปที่การพัฒนาซอฟต์แวร์ได้โดยไม่ต้องกังวลเรื่องการตั้งค่า Server (DevOps)

### 3.2 ถ้าใช้ IaaS (เช่น AWS EC2) ต้องทำอะไรเพิ่มอีก? (ยกตัวอย่าง 4 ข้อ)

1. การติดตั้งและตั้งค่า OS: ต้องเลือกและติดตั้ง Linux Distribution รวมถึงการอัปเดต Security Patches ของระบบปฏิบัติการด้วยตัวเอง
2. การติดตั้ง Runtime และ Middleware: ต้องลงมือติดตั้ง Node.js, Docker หรือ Web Server (เช่น Nginx) และจัดการ Version ต่างๆ ให้พร้อมรันแอปพลิเคชัน
3. การจัดการ Network และ Security: ต้องตั้งค่า Firewall (Security Groups), เปิด/ปิด Port, และติดตั้ง SSL Certificates (เช่น Let's Encrypt) ด้วยตัวเองทั้งหมด
4. การจัดการ Database: ต้องติดตั้งและ Config ตัวฐานข้อมูล (PostgreSQL) เอง รวมถึงต้องวางแผนระบบ Backup และ Scaling ของฐานข้อมูลด้วยมือ

---
### 4.1 Factors ที่เห็นจาก Lab (10 คะแนน)

เลือก 5 Factors และอธิบายว่าเห็นจากไหนใน Railway:

| Factor | เห็นจากไหน? | ทำไมสำคัญ? |
|--------|------------|-----------|
| Factor 3: Config | Variables tab | แยกค่ากำหนดต่างๆ ออกจาก Code เพื่อความปลอดภัยและเปลี่ยนสภาพแวดล้อมได้รวดเร็ว |
| Factor 1: Codebase | การเชื่อมต่อกับ GitHub Repository | เพื่อให้มีแหล่งเก็บ Code ที่เป็นหนึ่งเดียว และติดตามการเปลี่ยนแปลงได้ |
| Factor 4 : Backing Services | การเพิ่ม PostgreSQL Service | เพื่อให้แอปพลิเคชันมองฐานข้อมูลเป็นทรัพยากรที่เชื่อมต่อภายนอก |
| Factor 11: Logs | แท็บ Logs ที่แสดงผลแบบ Real-time | ช่วยให้ตรวจสอบสถานะและพฤติกรรมของแอปพลิเคชันได้ทันที |
| Factor 5: Build, Release, Run | หน้า Deployments | เพื่อให้กระบวนการผลิตซอฟต์แวร์มีความชัดเจนและสามารถย้อนกลับได้ |

### 4.2 ถ้าไม่ทำตาม 12-Factor จะมีปัญหาอะไร? (5 คะแนน)

ยกตัวอย่าง 2 ปัญหา:

**ปัญหา 1:** ถ้าไม่ทำตาม Factor 3 (Config)
- สิ่งที่จะเกิด: หากคุณ Hardcode รหัสผ่านฐานข้อมูลไว้ในไฟล์ database.js เมื่อคุณ Push ขึ้น GitHub รหัสผ่านนั้นจะหลุดสู่สาธารณะทันที และการเปลี่ยนเครื่องฐานข้อมูลจะทำได้ยากเพราะต้องตามแก้ Code และ Deploy ใหม่ทุกรอบ

**ปัญหา 2:** ถ้าไม่ทำตาม Factor 6 (Stateless Processes)
- สิ่งที่จะเกิด: หากแอปพลิเคชันของคุณเก็บไฟล์ข้อมูลไว้ในตัว Container เอง (เช่น รูปโปรไฟล์) เมื่อ Railway ทำการ Redeploy หรือ Restart ระบบ ไฟล์เหล่านั้นจะหายไปทันที
---

### 5.1 สิ่งที่เรียนรู้จาก Lab นี้

1. เข้าใจสถาปัตยกรรม PaaS (Platform as a Service)
2. การทำงานร่วมกันของ Multi-Service บน Cloud
3. หลักการ 12-Factor App ในสถานการณ์จริง

### 5.2 ความท้าทาย/ปัญหาที่พบ และวิธีแก้ไข

ปัญหา: Error CONFIG is not defined และ Unexpected token '<' บน Frontend เนื่องจากระบบหาไฟล์ config.js ไม่เจอหรือ Path ไม่ถูกต้องเมื่อ Deploy ขึ้น Railway
วิธีแก้: ทำการ Hardcode ตัวแปร API_BASE ลงในไฟล์ app.js โดยตรง

### 5.3 จะเลือกใช้ Docker หรือ Cloud เมื่อไหร่?

- ใช้ Docker เมื่อ: อยู่ในขั้นตอนการพัฒนา (Development) หรือทดสอบระบบภายในเครื่องตัวเอง (Local Testing) เพราะประหยัดทรัพยากร และไม่ต้องเสียค่าใช้จ่าย Cloud Credits
- ใช้ Cloud (PaaS) เมื่อ: ต้องการให้แอปพลิเคชันออนไลน์พร้อมใช้งานจริง (Production) เพื่อให้ผู้ใช้ภายนอกเข้าถึงได้ตลอด 24 ชั่วโมง และต้องการระบบ Managed Services ที่มีความเสถียรและปลอดภัยสูง