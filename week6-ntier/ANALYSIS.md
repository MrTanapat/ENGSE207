# 📊 ANALYSIS.md - Week 6 N-Tier Architecture Analysis
## การวิเคราะห์และเปรียบเทียบ 4 Architectures (Week 3-6)

**ชื่อ-นามสกุล:** ธนภัทร นุกูล 
**รหัสนักศึกษา:** 67543210031-0 
**วันที่ส่ง:** 27 มกราคม 2026

---

## คำถาม 1: เปรียบเทียบ 4 Architectures (15 คะแนน)

### ตารางเปรียบเทียบ

| ด้าน | Week 3 (Monolithic) | Week 4 (Layered) | Week 5 (Client-Server) | Week 6 (N-Tier) |
|------|---------------------|------------------|------------------------|-----------------|
| **Database** | SQLite | SQLite | SQLite | PostgreSQL |
| **Web Server** | Node.js (Internal) | Node.js (Internal) | Node.js (Direct) | Nginx |
| **Protocol** | Function Call | Logical Interface | HTTP | HTTPS (SSL/TLS) |
| **Separation Type** | None | Logical | Physical (Process) | Physical (Tier/Network) |
| **Number of Processes** | 1 | 1 | 2 (Front + Back) | 3+ (Nginx, Node, PG) |
| **Network Required** | No | No | Yes (Basic) | Yes (Advanced/Isolated) |
| **Scalability** | Very Low | Low | Medium | High |
| **Security Level** | Low | Low | Medium | High (SSL/Firewall) |
| **Complexity** | 1 | 2 | 3 | 4 |
| **Deploy Difficulty** | 1 | 1 | 2 | 4 |
| **Development Speed** | Very Fast | Fast | Medium | Slow |
| **Production Ready** | No | No | Experimental | Yes |

### อธิบายเพิ่มเติม:

**Week 3 (Monolithic):**
```
- ข้อดีหลัก: พัฒนาได้เร็วมาก ไม่ต้องตั้งค่า Network หรือ Database ภายนอก
- ข้อเสียหลัก: แก้ไขส่วนเดียวอาจกระทบทั้งระบบ และไม่สามารถขยายระบบได้
- เหมาะกับ: โปรเจกต์ขนาดเล็กมาก หรือการทำ Prototype เบื้องต้น
```

**Week 4 (Layered):**
```
- ข้อดีหลัก: โค้ดเป็นระเบียบขึ้น แยกหน้าที่ (Concern) ชัดเจนในระดับ Logic
- ข้อเสียหลัก: ยังรันเป็น Process เดียว ถ้าแอปพัง ระบบทั้งหมดก็หยุดทำงาน
- เหมาะกับ: แอปพลิเคชันที่เริ่มมีความซับซ้อนของ Business Logic
```

**Week 5 (Client-Server):**
```
- ข้อดีหลัก: แยก Frontend และ Backend ชัดเจน ทำให้ทีมทำงานแยกกันได้
- ข้อเสียหลัก: ความปลอดภัยต่ำเพราะส่งข้อมูลผ่าน HTTP ธรรมดา และ Database ยังเป็นไฟล์ SQLite
- เหมาะกับ: แอปพลิเคชันทั่วไปที่ต้องการแยกส่วนการแสดงผล
```

**Week 6 (N-Tier):**
```
- ข้อดีหลัก: มีความปลอดภัยสูงด้วย HTTPS และการแยก Tier ในระดับ Network รองรับ Load Balancing
- ข้อเสียหลัก: การตั้งค่าซับซ้อนมาก ต้องดูแลหลาย Service พร้อมกัน
- เหมาะกับ: ระบบระดับ Production ที่ต้องการความน่าเชื่อถือและความปลอดภัยสูง
```

---

## คำถาม 2: Quality Attributes Radar Chart (10 คะแนน)

### ตารางคะแนน (1-5 คะแนน)

| Quality Attribute | Week 3 | Week 4 | Week 5 | Week 6 | หมายเหตุ | 
|-------------------|--------|--------|--------|--------|----------|
| **Performance** | 5 | 5 | 4 | 4 | Week 6 มี Network Hop เพิ่มขึ้น |
| **Scalability** | 1 | 1 | 3 | 5 | N-Tier แยก Tier ให้ขยายง่าย |
| **Security** | 1 | 1 | 2 | 5 | HTTPS และ DB Isolation |
| **Maintainability** | 2 | 4 | 4 | 5 | โครงสร้าง src/ แยกชัดเจน |
| **Testability** | 1 | 3 | 4 | 5 | ทดสอบแยกแต่ละ Tier ได้ |
| **Deployability** | 5 | 5 | 3 | 2 | ยิ่ง Tier เยอะ ยิ่ง Deploy ยาก |
| **Availability** | 1 | 1 | 2 | 4 | PostgreSQL ทนทานกว่า SQLite |
| **Modifiability** | 2 | 4 | 4 | 5 | เปลี่ยน DB หรือ Web Server ได้ง่าย |
| **รวม** | 18/40 | 24/40 | 26/40 | 35/40 | |

### คำอธิบายการให้คะแนน:

**Performance (ความเร็ว):**
```
- Week 3: 5 คะแนน เพราะ รันเป็น Process เดียวและคุยกับ SQLite ผ่านการเขียนไฟล์โดยตรง ไม่มี Network Latency มาเกี่ยวข้อง
- Week 4: 5 คะแนน เพราะ แม้จะแยก Layer แต่ยังทำงานใน Memory เดียวกัน ทำให้ความเร็วในการรับส่งข้อมูลสูงที่สุด
- Week 5: 4 คะแนน เพราะ เริ่มมีการส่งข้อมูลผ่าน HTTP Protocol ระหว่าง Frontend และ Backend ทำให้เกิด Overhead เล็กน้อย
- Week 6: 4 คะแนน เพราะ มีการส่งข้อมูลผ่านหลาย Tier (Web -> App -> DB) และมี Nginx เป็นตัวคั่น แต่ PostgreSQL จัดการ Query ขนาดใหญ่ได้ดีกว่า
```

**Scalability (รองรับการขยาย):**
```
- Week 3: 1 คะแนน เพราะ เป็นก้อนเดียว (Monolithic) หากต้องการขยายต้อง Copy ทั้งโปรเจกต์ ไม่สามารถขยายเฉพาะส่วนได้
- Week 4: 1 คะแนน เพราะ การแยก Layer เป็นเพียงเชิงตรรกะ (Logical) แต่ทางกายภาพยังรันอยู่ในเครื่องเดียวและ Process เดียวกัน
- Week 5: 3 คะแนน เพราะ เริ่มแยก Frontend และ Backend ออกจากกัน ทำให้สามารถขยายเฉพาะส่วนที่มีการใช้งานหนักได้
- Week 6: 5 คะแนน เพราะ แยก Tier ชัดเจน สามารถเพิ่ม App Servers (Load Balancing) หรือทำ Database Cluster แยกกันได้อย่างอิสระ
```

**Security (ความปลอดภัย):**
```
- Week 3: 1 คะแนน เพราะ ไม่มีระบบรักษาความปลอดภัย ข้อมูล Database (SQLite) เป็นเพียงไฟล์ที่อยู่ในโฟลเดอร์เดียวกับโค้ด
- Week 4: 1 คะแนน เพราะ โครงสร้างภายในดีขึ้นแต่ความปลอดภัยภายนอกยังเท่าเดิม ข้อมูลถูกเข้าถึงได้ง่าย
- Week 5: 2 คะแนน เพราะ แยกส่วน API ออกมา แต่ยังส่งข้อมูลผ่าน HTTP ธรรมดาที่ไม่มีการเข้ารหัสข้อมูล
- Week 6: 5 คะแนน เพราะ ใช้ HTTPS (SSL/TLS) ในการเข้ารหัสข้อมูล และใช้ Nginx เป็น Reverse Proxy เพื่อซ่อน Backend จริงไว้ข้างหลัง
```

**Maintainability (ความสะดวกในการดูแล):**
```
- Week 3: 2 คะแนน เพราะ โค้ดปนกัน (Spaghetti Code) เมื่อระบบใหญ่ขึ้นจะแก้ไขยากเพราะทุกอย่างผูกติดกันหมด
- Week 4: 4 คะแนน เพราะ เริ่มใช้ Layered Architecture ทำให้แยก Logic ออกจาก Data Access ได้ชัดเจน บำรุงรักษาง่ายขึ้น
- Week 5: 4 คะแนน เพราะ การแยกเครื่อง Frontend/Backend ช่วยให้ทีมพัฒนาสามารถแยกกันทำงานในส่วนของตนเองได้สะดวก
- Week 6: 5 คะแนน เพราะ การแยก Tier ทางกายภาพและใช้ Layered Architecture ภายใน ทำให้การ Debug และการอัปเกรดทำได้โดยไม่กระทบส่วนอื่น
```

**Testability (ความสะดวกในการทดสอบ):**
```
- Week 3: 1 คะแนน เพราะ การทดสอบทำได้ยากเนื่องจากโค้ดมีความผูกมัดกันสูง (Tight Coupling) ไม่สามารถทำ Mock ข้อมูลได้ง่าย
- Week 4: 3 คะแนน เพราะ สามารถทำ Unit Test แยกตาม Layer ได้ดีขึ้น แต่ยังต้องพึ่งพาสภาพแวดล้อมเดียวกัน
- Week 5: 4 คะแนน เพราะ สามารถแยกทดสอบ API (Integration Test) และทดสอบ UI ได้อย่างเป็นอิสระต่อกัน
- Week 6: 5 คะแนน เพราะ สามารถทดสอบแยกได้ทุกระดับ ตั้งแต่ Logic ภายใน, การเชื่อมต่อ Database ไปจนถึงการตั้งค่า Web Server
```

**Deployability (ความสะดวกในการ Deploy):**
```
- Week 3: 5 คะแนน เพราะ ง่ายที่สุด แค่ก๊อบปี้โฟลเดอร์ไปวางแล้วรัน `node server.js` ก็ทำงานได้ทันที
- Week 4: 5 คะแนน เพราะ ขั้นตอนการ Deploy เหมือนกับ Week 3 ไม่มีความซับซ้อนของ Infrastructure
- Week 5: 3 คะแนน เพราะ ต้องจัดการทั้ง Frontend และ Backend รวมถึงต้องเช็กเรื่อง CORS และ Network ระหว่างเครื่อง
- Week 6: 2 คะแนน เพราะ มีความซับซ้อนสูง ต้องติดตั้งทั้ง Nginx, SSL, PostgreSQL และตั้งค่า Firewall หลายชั้นเพื่อให้ระบบทำงานร่วมกันได้
```

---

## คำถาม 3: สถานการณ์การใช้งาน (10 คะแนน)

### สถานการณ์ A: Startup MVP

**Context:**
- งบประมาณ: 50,000 บาท
- ทีม: 2 คน (Junior developers)
- Timeline: 1 เดือน
- Users: 100 คน
- ความต้องการพิเศษ: ต้องการ feedback จากลูกค้าเร็ว

**Architecture ที่เลือก:** [ ] Week 3 / [X] Week 4 / [ ] Week 5 / [ ] Week 6

**เหตุผล:**
```
เนื่องจากต้องการ Feedback เร็วและงบจำกัด การใช้ Layered Architecture
ช่วยให้โค้ดมีโครงสร้างดีพอที่จะขยายต่อได้ในอนาคต แต่ยังไม่เสียเวลาไปกับการตั้งค่า Infrastructure ที่ซับซ้อนเหมือน N-Tier
```

---

### สถานการณ์ B: E-commerce Platform

**Context:**
- งบประมาณ: 2,000,000 บาท
- ทีม: 10 คน (Mixed experience)
- Timeline: 6 เดือน
- Users: 100,000 คน
- ความต้องการพิเศษ: รองรับ Flash Sale, Payment Gateway

**Architecture ที่เลือก:** [ ] Week 3 / [ ] Week 4 / [ ] Week 5 / [X] Week 6

**เหตุผล:**
```
ต้องรองรับผู้ใช้จำนวนมาก (Scalability) และมีความปลอดภัยเรื่องการชำระเงิน
Nginx สามารถทำ Load Balancing เพื่อรับมือช่วง Flash Sale ได้
```

---

### สถานการณ์ C: Internal Company Tool

**Context:**
- งบประมาณ: 200,000 บาท
- ทีม: 3 คน (Mid-level)
- Timeline: 2 เดือน
- Users: 50 คน (พนักงานบริษัท)
- ความต้องการพิเศษ: ใช้งานภายในองค์กร, VPN

**Architecture ที่เลือก:** [ ] Week 3 / [ ] Week 4 / [X] Week 5 / [ ] Week 6

**เหตุผล:**
```
ใช้งานภายในองค์กรผ่าน VPN ความต้องการด้านความปลอดภัยระดับสาธารณะอาจไม่สูงเท่า
Banking แต่ต้องการความง่ายในการบำรุงรักษาและการแยก Frontend/Backend
```

---

### สถานการณ์ D: Banking Application

**Context:**
- งบประมาณ: 10,000,000 บาท
- ทีม: 20 คน (Senior + Mid)
- Timeline: 12 เดือน
- Users: 1,000,000 คน
- ความต้องการพิเศษ: Security Critical, Compliance, Audit logs

**Architecture ที่เลือก:** [ ] Week 3 / [ ] Week 4 / [ ] Week 5 / [X] Week 6

**เหตุผล:**
```
Security เป็นเรื่องวิกฤตที่สุด N-Tier ช่วยให้สามารถวาง Database ไว้ใน
Private Network และใช้ Nginx ทำ SSL Termination เพื่อความปลอดภัยสูงสุด
```

---

## คำถาม 4: ประสบการณ์จากการทำ Lab (5 คะแนน)

### ก. ปัญหาที่พบในการทำ Week 6:

| # | ปัญหา | สาเหตุ | วิธีแก้ไข |
|---|-------|--------|----------|
| 1 | 503 Service Unavailable | Node.js เชื่อมต่อ PostgreSQL ไม่สำเร็จ | ตรวจสอบรหัสผ่านใน .env และ config |
| 2 | Connection Timed Out | UFW Firewall บล็อกพอร์ต 5432 หรือ 443 | ใช้ `sudo ufw allow` เปิดพอร์ตที่จำเป็น |
| 3 | SSL Warning ใน Browser | ใช้ Self-signed Certificate ที่ไม่ได้ผ่าน CA | กดยอมรับความเสี่ยง (Proceed to unsafe) ใน Browser |

### ข. เวลาที่ใช้ในแต่ละส่วน:

| ส่วนงาน | เวลาที่คาด | เวลาจริง | หมายเหตุ |
|---------|-----------|---------|----------|
| ติดตั้ง PostgreSQL | 10 | 5 | |
| ติดตั้ง Nginx | 10 | 5 | |
| สร้าง SSL Certificate | 10 | 5 | |
| Migrate Database | 15 | 10 | |
| ตั้งค่า Nginx Config | 10 | 5 | |
| Testing | 30 | 25 | |
| **รวม** | 75 | 45 | |

### ค. สิ่งที่ได้เรียนรู้ใหม่:

```
1. การใช้งาน Nginx เป็น Reverse Proxy เพื่อเพิ่มความปลอดภัยและความเร็ว
2. การ Migrate จาก SQLite ไปเป็น PostgreSQL ซึ่งมีความเป็นมืออาชีพมากกว่า
3. ความสำคัญของ SSL/TLS (HTTPS) ในการปกป้องข้อมูล
4. การจัดการ Private Network ระหว่าง VM ผ่าน IP 10.0.0.x
5. การเขียนเอกสารสถาปัตยกรรมแบบ C4 Model
```

---

## คำถาม 5: Evolution Path (5 คะแนน)

### เมื่อไหร่ควร Evolve จาก Architecture หนึ่งไปอีกแบบ?

**จาก Monolithic → Layered:**
```
เมื่อโค้ดเริ่มปนกันจนแก้ไขยาก ต้องการแยก Logic ออกจากส่วนแสดงผล
```

**จาก Layered → Client-Server:**
```
Trigger/เงื่อนไข:
เมื่อต้องการแยกทีม Frontend และ Backend หรือต้องการพัฒนา
```

**จาก Client-Server → N-Tier:**
```
Trigger/เงื่อนไข:
เมื่อต้องการความปลอดภัยสูงสุด และต้องรองรับผู้ใช้จำนวนมากที่ต้องขยาย Tier อิสระ
```

**จาก N-Tier → Microservices:**
```
Trigger/เงื่อนไข:
เมื่อแอปใหญ่เกินไปจนการแก้ไขส่วนเดียวต้องรอการ Deploy ทั้งระบบ (Build นานเกินไป)
```

### Decision Flowchart:

```
เริ่มโปรเจกต์ใหม่
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  ทีมมีประสบการณ์น้อย?               │
                    │  งบประมาณจำกัด?                  │
                    │  Timeline สั้น?                 │
                    └───────────────┬───────────────┘
                                    │
                        ┌───────────┴───────────┐
                        │ Yes                   │ No
                        ▼                       ▼
                   [Monolithic]           [Client-Server]
                        │                         │
            ┌───────────┴───────────┐             │
            │ โค้ดใหญ่ขึ้น?              │             │
            │ ต้องการ Testability?    │              │
            └───────────┬───────────┘              │
                        │                          │
            ┌───────────┴───────────┐              │
            │ Yes                   │ No           │
            ▼                       │              │
       [Layered] <──────────────────┘              │
            │                                      │
    ┌───────┴───────────────────────┐              │
    │ ต้องการแยก UI/API?               │ <────────────┘
    │ รองรับ Mobile/Web?              │
    └───────┬───────────────────────┘
            │
    ┌───────┴───────┐
    │ Yes           │
    ▼               │
[Client-Server]     │
    │               │
    ├───────────────┴───────────────┐
    │ ต้องการ High Security (SSL)?    │
    │ ต้องการ Load Balancing?         │
    └───────────────┬───────────────┘
                    │
            ┌───────┴───────┐
            │ Yes           │
            ▼               │
        [N-Tier]            │
            │               │
    ┌───────┴───────────────┴───────┐
    │ แอปใหญ่เกินไป? (Monolith Hell)│
    │ ต้องการ Deploy แยกส่วน?       │
    └───────────────┬───────────────┘
                    │
            ┌───────┴───────┐
            │ Yes           │
            ▼               ▼
    [Microservices]       คงเดิม
```

---

## คำถาม 6: บทเรียนสำคัญ (5 คะแนน)

### Top 3 บทเรียนจากการทำ Lab Week 3-6:

**บทเรียนที่ 1:**
```
หัวข้อ: Security is not an option
รายละเอียด: การแยก Database ไว้ในเครื่องที่เข้าถึงไม่ได้จากภายนอก และการใช้ HTTPS เป็นพื้นฐานสำคัญที่ขาดไม่ได้ในปัจจุบัน

จะนำไปใช้อย่างไร: บังคับใช้ HTTPS และ SSL Termination ผ่าน Nginx ในทุกโปรเจกต์เพื่อสร้างความเชื่อมั่นให้กับผู้ใช้งาน
```

**บทเรียนที่ 2:**
```
หัวข้อ: Infrastructure as Code (Vagrant)
รายละเอียด: การแยก Database ไว้ในเครื่องที่เข้าถึงไม่ได้จากภายนอก และการใช้ HTTPS เป็นพื้นฐานสำคัญที่ขาดไม่ได้ในปัจจุบัน

จะนำไปใช้อย่างไร: ใช้ Vagrantfile ในการสร้างสภาพแวดล้อมจำลองสำหรับการทดสอบซอฟต์แวร์ เพื่อให้มั่นใจว่าเครื่องของทีมพัฒนาทุกคนมีระบบที่เหมือนกัน (Consistency)
```

**บทเรียนที่ 3:**
```
หัวข้อ: Separation of Concerns
รายละเอียด: การแยก Tier ไม่ใช่แค่เรื่อง Physical แต่คือการแยกความรับผิดชอบ ทำให้ระบบบำรุงรักษาง่ายขึ้นในระยะยาว


จะนำไปใช้อย่างไร: รักษาโครงสร้างโฟลเดอร์แบบ Layered Architecture (Controllers, Services, Repositories) ในการเขียนโค้ด Node.js เพื่อให้ง่ายต่อการเพิ่มฟีเจอร์ใหม่ๆ ในอนาคตโดยไม่กระทบโค้ดส่วนเดิม
```

### ถ้าเริ่มทำใหม่ตั้งแต่ Week 3 จะทำอะไรต่างไป?

```
1. การวางโครงสร้างโปรเจกต์แบบ Scalable: จะออกแบบโครงสร้างโฟลเดอร์ให้รองรับ Layered Architecture ตั้งแต่วันแรก
เพื่อให้การข้ามจาก SQLite ใน Week 3 ไปเป็น PostgreSQL ใน Week 6 ทำได้ง่ายขึ้นโดยไม่ต้องรื้อโค้ดใหม่ทั้งหมด

2. การนำ Infrastructure as Code มาใช้เร็วขึ้น: จะศึกษาและใช้ Vagrant ในการจัดการ VM ตั้งแต่เริ่มต้น
เพื่อลดปัญหาเรื่อง IP Address เปลี่ยนแปลงบ่อย (เหมือนที่เจอใน Fedora) และช่วยให้สภาพแวดล้อมการพัฒนานิ่งตั้งแต่วันแรก

3. การทำ Documentation และ API Testing: จะเริ่มทำไฟล์สำหรับทดสอบ API (เช่น scripts/test-api.sh)
ตั้งแต่ Week 3 เพื่อให้การตรวจสอบการทำงานของระบบในแต่ละ Tier ทำได้รวดเร็วและแม่นยำขึ้นเมื่อระบบมีความซับซ้อนสูงขึ้น
```

### ทักษะที่ได้พัฒนามากที่สุด:

| ทักษะ | ระดับก่อนทำ (1-5) | ระดับหลังทำ (1-5) | หมายเหตุ |
|-------|------------------|------------------|----------|
| Linux/Ubuntu | 2 | 4 | เข้าใจคำสั่งจัดการ Network, Firewall (UFW) และการดู Logs |
| Database (SQL) | 2 | 4 | สามารถ Migrate ข้อมูลจาก SQLite ไปยัง PostgreSQL และจัดการ Permission ได้ |
| Web Server (Nginx) | 1 | 4 | เข้าใจการทำ Reverse Proxy และการตั้งค่า Upstream สำหรับ Load Balancer |
| Node.js/Express | 3 | 4 | พัฒนา Layered Architecture ให้มีความเป็นระเบียบและแยกหน้าที่ชัดเจน |
| REST API | 3 | 4 | ออกแบบ API ให้รองรับการทำงานข้าม Tier และมีความปลอดภัยมากขึ้น |
| Git/Version Control | 3 | 4 | จัดการ Repository ที่มีโครงสร้างซับซ้อนและแยกไฟล์คอนฟิก (.env) ได้ดีขึ้น |
| Networking | 2 | 4 | เข้าใจการจัดการ Private Network, IP Routing และปัญหา DNS ในเครื่อง Local |
| Security (SSL/HTTPS) | 1 | 4 | สามารถสร้างและติดตั้ง Self-signed Certificate รวมถึงทำ SSL Termination ได้ |
| Architecture Thinking | 2 | 5 | มองเห็นภาพรวมการเชื่อมต่อของระบบขนาดใหญ่และการแยก Tier อย่างชัดเจน |

### สิ่งที่ยังสับสนหรืออยากเรียนรู้เพิ่ม:

```
1. การจัดการ Database Replication: ต้องการเรียนรู้เชิงลึกเกี่ยวกับการทำ Data Synchronization
ระหว่าง PostgreSQL Master และ Slave ในกรณีที่ระบบมีขนาดใหญ่มาก

2. Automated CI/CD Pipelines: สนใจการใช้ GitHub Actions ร่วมกับ Self-hosted Runner
เพื่อให้การ Deploy งานไปยัง VMs ทั้ง 3 เครื่องทำได้อัตโนมัติทันทีที่ Push code

3. Containerization (Docker): อยากเปรียบเทียบข้อดี-ข้อเสีย ระหว่างการใช้ Vagrant VM
กับการใช้ Docker Container ในการจัดการ N-Tier Architecture ในสถานการณ์จริง
```

---

## 📸 Screenshots

### Screenshot 1: Services Status
<img width="1400" height="800" alt="image" src="https://github.com/user-attachments/assets/2c2f8bae-cde7-4768-b15d-30ead6962e66" />


### Screenshot 2: HTTPS in Browser
<img width="1400" height="800" alt="image" src="https://github.com/user-attachments/assets/d4bd3d28-af1d-436d-933c-54657f1a1c62" />

### Screenshot 3: API Response
<img width="900" height="360" alt="image" src="https://github.com/user-attachments/assets/ecee1e36-2991-425d-8ff2-1efecbcff011" />


### Screenshot 4: Task Board UI Working
<img width="1400" height="800" alt="image" src="https://github.com/user-attachments/assets/588cbc25-b5d9-450e-9bfd-8642c267ed47" />


### Screenshot 5: Create/Edit Task
- **Before**
<img width="515" height="425" alt="image" src="https://github.com/user-attachments/assets/30348f7b-fe7a-4f4f-8261-e818b593ac98" />

- **After**
<img width="1400" height="800" alt="image" src="https://github.com/user-attachments/assets/b11440b7-5253-465b-a2fc-a2123bff278a" />




---

## 🔗 Links

- **GitHub Repository:** https://github.com/MrTanapat/ENGSE207/tree/main/week6-ntier
- **VM IP Address:** 10.0.0.10
- **API Endpoint:** https://taskboard.local/api

---

## ✅ Self-Check Before Submit

- [ X ] ตารางเปรียบเทียบกรอกครบทุกช่อง
- [ X ] Quality Attributes ให้คะแนนและอธิบายครบ
- [ X ] สถานการณ์ 4 ข้อ ตอบครบทุกข้อ
- [ X ] ปัญหาและวิธีแก้ไขระบุชัดเจน
- [ X ] Evolution Path วาดครบ
- [ X ] บทเรียนสำคัญ 3 ข้อ
- [ X ] Screenshots ครบ 5 รูป
- [ X ] Push ไป GitHub แล้ว

---

**หมายเหตุ:** เอกสารนี้มีน้ำหนัก **37.5%** ของคะแนนทั้งหมด โปรดตอบอย่างละเอียดและจริงใจ!

---

*ENGSE207 - Software Architecture - Week 6*  
*มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา*
