# 📊 การวิเคราะห์เปรียบเทียบ: VM vs Docker Deployment
## ENGSE207 - Week 6 N-Tier Architecture

**ชื่อ-นามสกุล:** ธนภัทร นุกูล
**รหัสนักศึกษา:** 67543210031-0
**วันที่:** 28/01/2026

---

## 1. ตารางเปรียบเทียบ Setup Process

| ขั้นตอน | Version 1 (VM) | Version 2 (Docker) |
|---------|----------------|-------------------|
| ติดตั้ง PostgreSQL | ใช้คำสั่ง `sudo apt install postgresql` และจัดการ Service ผ่าน `systemctl` | ระบุ `image: postgres:16-alpine` ใน Compose ไฟล์ ระบบจะดึงและติดตั้งให้อัตโนมัติ |
| ติดตั้ง Node.js | ต้องติดตั้ง `nvm` หรือ `apt` และรัน `npm install` แยกแต่ละโปรเจกต์ | ใช้ `Dockerfile` ในการ Build สภาพแวดล้อมที่พร้อมรัน Code ทันที |
| ติดตั้ง Nginx | ติดตั้งผ่าน `apt` บน Host OS ซึ่งมักจะเกิดปัญหาพอร์ตชนกับงานอื่น | ใช้ `image: nginx:alpine` และ Map พอร์ตผ่าน Docker ทำให้จัดการง่ายกว่า |
| Configure Database | ต้องเข้าไปแก้ไฟล์ `pg_hba.conf` หรือ `postgresql.conf` ด้วยตนเอง | กำหนดผ่าน `environment` ใน `docker-compose.yml` ได้โดยตรง |
| Configure SSL | ต้องสร้างไฟล์และระบุ Path ใน `/etc/nginx/sites-available/` | ใช้ `volumes` เพื่อเชื่อมโยงไฟล์ Cert จาก Host เข้าสู่ Container |
| Start Services | ต้องไล่รัน `systemctl start` ทีละ Service และเช็กสถานะแยกกัน | รันเพียงคำสั่งเดียว `docker compose up -d` ทุก Service จะขึ้นตามลำดับ |
| **เวลาทั้งหมด** | 30-45 นาที | 5-10 นาที |

---

## 2. ตารางเปรียบเทียบ Resource Usage

| Resource | Version 1 (VM) | Version 2 (Docker) |
|----------|----------------|-------------------|
| Memory Usage | [ใช้ `free -h`] | [ใช้ `docker stats`] |
| Disk Usage | [ใช้ `df -h`] | [ใช้ `docker system df`] |
| CPU Usage | ปานกลาง | ต่ำมาก |
| Startup Time | 45-90 วินาที | 2-10 วินาที |

---

## 3. ข้อดีของ Docker Deployment (เขียน 5 ข้อ)

1. **Environment Consistency:** มั่นใจได้ว่าแอปจะทำงานได้เหมือนกันทั้งบนเครื่องผู้พัฒนาและเครื่องเซิร์ฟเวอร์จริง ลดปัญหา "Works on my machine"

2. **Infrastructure as Code:** การตั้งค่าทั้งหมดถูกเก็บไว้ในไฟล์ docker-compose.yml ทำให้สามารถย้ายระบบหรือสร้างใหม่ได้รวดเร็ว

3. **Isolation:** แยก Library และ Dependency ของแต่ละ Service ออกจากกัน ไม่เกิดปัญหาพอร์ตหรือเวอร์ชันซอฟต์แวร์ชนกันบน Host OS

4. **Health Checking:** มีระบบตรวจสอบสถานะอัตโนมัติ (Healthcheck) หาก Service ไหนทำงานผิดปกติ Docker สามารถสั่ง Restart ได้เอง

5. **Scalability:** สามารถขยายจำนวน Instance ของ Container ได้ง่ายและรวดเร็วเพื่อรองรับ Load ที่เพิ่มขึ้น

---

## 4. ข้อเสียของ Docker Deployment (เขียน 3 ข้อ)

1. **Learning Curve:** ต้องเรียนรู้คำสั่งใหม่ๆ และแนวคิดเรื่อง Networking/Volumes ภายใน Docker ซึ่งมีความซับซ้อนในช่วงแรก

2. **Data Persistence Complexity:** ข้อมูลใน Container จะหายไปเมื่อลบ Container ทิ้ง ต้องมีการจัดการ Volume ให้ถูกต้องเพื่อรักษาข้อมูล

3. **Security Risks:** หาก Container ถูกเจาะและมีการตั้งค่าที่ไม่ปลอดภัย (เช่นรันด้วย root) อาจส่งผลกระทบถึง Host OS ได้เนื่องจากแชร์ Kernel ร่วมกัน

---

## 5. เมื่อไหร่ควรใช้ VM vs Docker?

### ควรใช้ VM เมื่อ:
- ต้องการความปลอดภัยระดับสูงสุดและการแยกขาดจาก Kernel (Strict Isolation)
- จำเป็นต้องรันแอปพลิเคชันที่ต้องใช้ OS Kernel ที่แตกต่างกัน (เช่น รัน Windows บน Linux Host)
- แอปพลิเคชันเป็นแบบ Legacy ที่มีการเชื่อมต่อกับ Hardware ระดับลึก

### ควรใช้ Docker เมื่อ:
- พัฒนาแอปพลิเคชันรูปแบบ Microservices ที่มีการแบ่งการทำงานเป็นส่วนๆ (DB, API, Web)
- ต้องการระบบที่รองรับ CI/CD (Continuous Integration/Deployment) ที่รวดเร็ว
- ต้องการใช้งานทรัพยากรเครื่องเซิร์ฟเวอร์ให้คุ้มค่าที่สุด (High Density)

---

## 6. สิ่งที่ได้เรียนรู้จาก Lab นี้

ในการทำ Lab นี้ ผมได้เรียนรู้การจัดการระบบ N-Tier ที่มีความซับซ้อนผ่าน Docker Compose โดยเฉพาะการแก้ปัญหาเรื่อง Dependency Chain ที่ต้องให้ Database พร้อมก่อน API และ API พร้อมก่อน Nginx นอกจากนี้ยังได้ฝึกการแก้ไขปัญหา Port Conflict บนเครื่อง Host และการจัดการความปลอดภัยผ่าน SSL/TLS ใน Nginx ซึ่งเป็นหัวใจสำคัญของการ Deploy แอปพลิเคชันในโลกปัจจุบัน

---

## 7. คำสั่ง Docker ที่ใช้บ่อย (Quick Reference)

```bash
# เริ่มทำงานระบบทั้งหมดแบบ Background
docker compose up -d

# หยุดการทำงานและลบ Container, Network ออก
docker compose down

# ตรวจสอบสถานะความ Healthy ของแต่ละ Service
docker compose ps

# ดู Log การทำงานของแต่ละ Container เพื่อ Debug
docker compose logs -f [service_name]

# เข้าไปรันคำสั่งภายใน Container
docker exec -it [container_name] sh

# ตรวจสอบการใช้ทรัพยากร (RAM/CPU) แบบ Real-time
docker stats
```

### 8.2 คำสั่งสำหรับเก็บข้อมูล

```bash
# ดู memory usage ของ Docker
docker stats --no-stream

# ดู disk usage
docker system df

# ดู container sizes
docker ps -s

# ดู image sizes
docker images

# ดู network
docker network ls
docker network inspect taskboard-network
```