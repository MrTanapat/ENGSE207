# 📊 การวิเคราะห์เปรียบเทียบ: VM vs Docker Deployment
## ENGSE207 - Week 6 N-Tier Architecture

**ชื่อ-นามสกุล:** นายธนภัทร นุกูล
**รหัสนักศึกษา:** 67543210031-0
**วันที่:** 13 กุมภาพันธ์ 2026

---

## 1. ตารางเปรียบเทียบ Setup Process

| ขั้นตอน | Version 1 (VM) | Version 2 (Docker) |
|---------|----------------|-------------------|
| ติดตั้ง PostgreSQL | `apt install postgresql` ลงใน OS โดยตรง | ใช้ `postgres:16-alpine` image ผ่าน Docker Compose |
| ติดตั้ง Node.js | `nvm install 20` + จัดการ Process ด้วย PM2 | `node:20-alpine` พร้อม Build ผ่าน Dockerfile |
| ติดตั้ง Nginx | `apt install nginx` และแก้ไฟล์ Config ใน `/etc/nginx` | `nginx:alpine` image และ Mount config เข้าไป |
| Configure Database | ต้องตั้งค่า User/Permission และจัดการ Service ในระดับ OS | ตั้งค่าผ่าน Environment Variables ในไฟล์เดียว |
| Configure SSL | ต้องติดตั้ง Certbot และจัดการ Virtual Host แยกต่างหาก | จัดการได้ง่ายผ่าน Reverse Proxy container หรือใช้ Auto SSL บน PaaS |
| Start Services | ต้องไล่เปิดทีละ Service (Systemctl start) | ใช้คำสั่งเดียว `docker-compose up -d` |
| **เวลาทั้งหมด** | ประมาณ 30-45 นาที (หากเกิดข้อผิดพลาดในการ Config OS) | ประมาณ 5-10 นาที (หากมี Image พร้อมใช้งาน) |

---

## 2. ตารางเปรียบเทียบ Resource Usage

| Resource | Version 1 (VM) | Version 2 (Docker) |
|----------|----------------|-------------------|
| Memory Usage | สูง (ต้องรัน Guest OS เต็มระบบ) | ต่ำ (ใช้ Kernel ร่วมกับ Host แต่ออกแบบให้ Isolated) |
| Disk Usage | สูง (ต้องเก็บไฟล์ OS และ Library ซ้ำซ้อน) | ต่ำ (ใช้ Layered File System ร่วมกันได้) |
| CPU Usage | มี Overhead จากการจำลอง Hardware | ต่ำมาก (รันในระดับ Process ของ Host OS) |
| Startup Time | ช้า (ต้องรอ OS Boot) | เร็วมาก (รันในระดับวินาที) |

---

## 3. ข้อดีของ Docker Deployment

1. **Portability (ย้ายได้ทุกที่):** พัฒนาในเครื่องเราอย่างไร บน Server ก็ทำงานเหมือนกัน 100% (Build once, run anywhere)
2. **Resource Efficiency:** ใช้ทรัพยากรน้อยกว่า VM มาก ทำให้รันหลาย Container พร้อมกันได้ในเครื่องเดียว
3. **Consistency:** กำหนด Environment ต่างๆ ไว้ในโค้ด (Infrastructure as Code) ลดปัญหา "Works on my machine"
4. **Rapid Deployment:** กระบวนการ Build และ Deploy ทำได้รวดเร็วมาก เหมาะกับระบบ CI/CD
5. **Isolation:** แต่ละ Service แยกออกจากกันชัดเจน หากตัวหนึ่งพังจะไม่กระทบตัวอื่นในระดับ Library

---

## 4. ข้อเสียของ Docker Deployment

1. **Learning Curve:** ต้องมีความรู้เรื่อง Dockerfile, Docker Compose และการจัดการ Container Network
2. **Persistent Data:** การจัดการข้อมูลใน Database ต้องทำอย่างระมัดระวังผ่าน Volumes มิฉะนั้นข้อมูลจะหายเมื่อลบ Container
3. **Security Complexity:** หากตั้งค่าไม่รัดกุม หรือใช้ Image ที่ไม่ปลอดภัย อาจส่งผลกระทบถึง Host OS ได้

---

## 5. เมื่อไหร่ควรใช้ VM vs Docker?

### ควรใช้ VM เมื่อ:
- ต้องการ Isolation ขั้นสูงสุดในระดับ Hardware
- ต้องการรันแอปพลิเคชันที่ต้องใช้ Kernel หรือ OS ที่แตกต่างจาก Host OS
- ต้องการรันแอปพลิเคชันแบบ Legacy ที่ไม่สามารถทำเป็น Container ได้

### ควรใช้ Docker เมื่อ:
- พัฒนาแอปพลิเคชันแบบ Microservices หรือ N-Tier Architecture
- ต้องการระบบที่ Deploy ได้รวดเร็วและรองรับการ Scaling
- ต้องการให้ Environment ในการพัฒนา (Dev) และใช้งานจริง (Prod) เหมือนกันที่สุด

---

## 6. สิ่งที่ได้เรียนรู้จาก Lab นี้

ได้เรียนรู้วิธีการเปลี่ยนจากระบบที่รันบน OS โดยตรงมาเป็น Containerized Application ซึ่งช่วยให้การจัดการระบบ 3-Tier (Frontend, Backend, Database) มีประสิทธิภาพและเป็นระเบียบมากขึ้น นอกจากนี้ยังเข้าใจหลักการของ 12-Factor App เช่น การแยก Config ผ่าน Environment Variables และการทำให้ออกแบบแอปพลิเคชันแบบ Stateless เพื่อรองรับการ Deploy บนระบบ Cloud PaaS อย่าง Railway

---

## 7. คำสั่ง Docker ที่ใช้บ่อย (Quick Reference)

```bash
# สร้างและรันทุก Service ตามที่เขียนใน docker-compose.yml
docker-compose up -d

# ตรวจสอบสถานะและทรัพยากรของ Container
docker ps
docker stats

# ดู Log ของแอปพลิเคชันเพื่อการ Debug
docker logs -f [container_name]

# ลบ Container และ Network ทั้งหมด
docker-compose down

# ล้าง Image หรือข้อมูลที่ไม่ได้ใช้งาน
docker system prune -a