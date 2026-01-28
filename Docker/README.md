### 📝 แบบฝึกหัดที่ 1: จัดการ Images

**1.1 ดาวน์โหลด (Pull) Images**

- `docker pull node:20-alpine`
<img width="730" height="100" alt="image" src="https://github.com/user-attachments/assets/4b1112fb-3296-4b2c-841f-3b87811e0b40" />

- `docker pull nginx:alpine`
<img width="730" height="300" alt="image" src="https://github.com/user-attachments/assets/ca94711b-2a8f-43b5-927f-dfeb7d170cb7" />

- `docker pull postgres:16-alpine`
<img width="730" height="300" alt="image" src="https://github.com/user-attachments/assets/3bc6e666-7534-49c3-984d-3a7a68ea58c1" />

**สังเกต:** Docker จะดาวน์โหลด ARM64 version โดยอัตโนมัติ

**1.2 ดู Images ที่มี**

- `docker images`
<img width="730" height="100" alt="image" src="https://github.com/user-attachments/assets/09e4a8db-d08f-4181-9558-f66a2505cf36" />


**ผลลัพธ์ที่คาดหวัง:**

```
REPOSITORY    TAG         IMAGE ID       CREATED        SIZE
node          20-alpine   abc123def456   2 days ago     135MB
nginx         alpine      def456abc789   1 week ago     43MB
postgres      16-alpine   789abc123def   3 days ago     238MB
hello-world   latest      d2c94e258dcb   8 months ago   13.3kB
```

**📌 สังเกต:** SIZE ของ alpine images มีขนาดเล็ก

---

### 📝 แบบฝึกหัดที่ 2: รัน Containers

**2.1 รัน Node.js Container**

```bash
# รัน Node.js และดู version
docker run node:20-alpine node --version
```

**ผลลัพธ์:**

```
v20.18.0
```

<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/c23ac106-1c31-411d-ab16-765fec3fde1d" />


**2.2 รัน Container แบบ Interactive**

```bash
# เข้าไปใน Container
docker run -it node:20-alpine /bin/sh
```

**ตอนนี้คุณอยู่ "ข้างใน" Container แล้ว!**

```sh
# ลองพิมพ์คำสั่งใน Container
/ # node --version
v20.18.0

/ # npm --version
10.8.2

/ # uname -m
aarch64        # ← ARM64 architecture

/ # cat /etc/os-release
NAME="Alpine Linux"
...

/ # exit
```
<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/8c254cd9-45ce-46d0-9bdc-7cc57b6e4fab" />

**2.3 รัน Nginx Web Server**

```bash
# รัน Nginx ใน background
docker run -d -p 8080:80 --name my-nginx nginx:alpine
```

**เปิด Browser ไปที่:** http://localhost:8080

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                Welcome to nginx!                                │
│                                                                 │
│  If you see this page, the nginx web server is successfully     │
│  installed and working.                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/306e81f3-92b7-45b8-929f-4ff129d75f97" />


🎉 **คุณเพิ่งรัน Web Server โดยไม่ต้องติดตั้งอะไรเลย!**

---

### 📝 แบบฝึกหัดที่ 3: จัดการ Containers

**3.1 ดู Containers ที่กำลังรัน**

```bash
docker ps
```

**ผลลัพธ์:**

<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/9b4634af-67f6-4fba-b147-bdfdb09a1022" />


```
CONTAINER ID   IMAGE          COMMAND                  STATUS         PORTS                  NAMES
abc123def456   nginx:alpine   "/docker-entrypoint.…"   Up 5 minutes   0.0.0.0:8080->80/tcp   my-nginx
```

**3.2 ดู Logs ของ Container**

```bash
docker logs my-nginx
```

<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/8e4b5789-9503-4d29-960f-aa6f1ac11a9b" />


**3.3 ดูใน Docker Desktop**

เปิด Docker Desktop → Click ที่ **"Containers"** tab

```
┌─────────────────────────────────────────────────────────────────┐
│  Docker Desktop > Containers                                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  NAME        IMAGE          STATUS      PORT(S)        ACTIONS  │
│  my-nginx    nginx:alpine   Running     8080:80        ⏹️ 🗑️    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**3.4 หยุด Container**

```bash
docker stop my-nginx
```

- **Before**
<img width="700" height="460" alt="image" src="https://github.com/user-attachments/assets/aeb77ae9-65ff-4eef-946c-c79e9bbe9cec" />

- **After**
<img width="700" height="460" alt="image" src="https://github.com/user-attachments/assets/df0ba69f-b9b2-490e-bc78-de2cc4c9c2ef" />



**3.5 เริ่ม Container อีกครั้ง**

```bash
docker start my-nginx
```
<img width="700" height="460" alt="image" src="https://github.com/user-attachments/assets/aeb77ae9-65ff-4eef-946c-c79e9bbe9cec" />

**3.6 ลบ Container**

```bash
# หยุดก่อน
docker stop my-nginx

# ลบ
docker rm my-nginx
```

---

### 📝 แบบฝึกหัดที่ 4: รัน PostgreSQL Database

**4.1 รัน PostgreSQL Container**

```bash
docker run -d \
  --name my-postgres \
  -e POSTGRES_USER=student \
  -e POSTGRES_PASSWORD=secret123 \
  -e POSTGRES_DB=testdb \
  -p 5432:5432 \
  postgres:16-alpine
```

<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/43cc6c27-ebbc-4e9b-a76f-ab6488b7296e" />


**4.2 เชื่อมต่อเข้าไปใน Database**

```bash
docker exec -it my-postgres psql -U student -d testdb
```

**ตอนนี้คุณอยู่ใน PostgreSQL แล้ว!**

```sql
-- สร้าง table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
);

-- เพิ่มข้อมูล
INSERT INTO students (name, email) VALUES ('สมชาย', 'somchai@example.com');
INSERT INTO students (name, email) VALUES ('สมหญิง', 'somying@example.com');

-- ดูข้อมูล
SELECT * FROM students;

-- ออกจาก psql
\q
```

**ผลลัพธ์:**

<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/b8c31ac1-5d9a-4027-bc5e-f2fa6c56eb5c" />


```
 id |   name   |        email
----+----------+---------------------
  1 | สมชาย    | somchai@example.com
  2 | สมหญิง   | somying@example.com
```

🎉 **คุณเพิ่งรัน Database Server โดยไม่ต้องติดตั้ง PostgreSQL!**

---

### 📝 แบบฝึกหัดที่ 5: ทดสอบ Multi-Platform Image

**5.1 ตรวจสอบว่า Image รองรับ ARM64 หรือไม่**

```bash
docker manifest inspect node:20-alpine | grep architecture
```

**ผลลัพธ์:**

```
"architecture": "amd64",
"architecture": "arm64",
...
```

**ถ้าเห็น `arm64` แสดงว่ารองรับ Apple Silicon native**

<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/4127a37d-a2f4-4416-808f-8099ee29477f" />


**5.2 บังคับใช้ Platform เฉพาะ (สำหรับทดสอบ)**

```bash
# รัน ARM64 image (native - เร็ว)
docker run --platform linux/arm64 node:20-alpine node --version

# รัน AMD64 image (ผ่าน Rosetta - ช้ากว่า)
docker run --platform linux/amd64 node:20-alpine node --version
```

<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/d7f7b969-36f4-4bfc-8e19-ee531df543f9" />



**📌 หมายเหตุ:** ปกติไม่ต้องระบุ `--platform` Docker จะเลือกให้อัตโนมัติ

---

### 📝 แบบฝึกหัดที่ 6: ทำความสะอาด

**6.1 หยุดและลบ Containers ทั้งหมด**

```bash
# หยุดทุก Container
docker stop $(docker ps -q)

# ลบทุก Container
docker rm $(docker ps -aq)
```
<img width="700" height="300" alt="image" src="https://github.com/user-attachments/assets/6ae71045-cc02-4284-959c-f21bb225cd4c" />

**6.2 ลบ Images ที่ไม่ใช้**

```bash
docker image prune -a
```

**6.3 ทำความสะอาดทั้งระบบ**

```bash
docker system prune -a
```
<img width="700" height="580" alt="image" src="https://github.com/user-attachments/assets/213a1e03-5f73-4562-954f-10c800fd806a" />

**หรือใช้ Docker Desktop:**

1. Click 🐳 icon ใน Menu Bar
2. เลือก **"Troubleshoot"** (🔧)
3. Click **"Clean / Purge data"**

---

## 10. Checklist ก่อนมาเรียน

### ✅ ตรวจสอบว่าทำครบทุกข้อ

| #   | รายการ                            | สถานะ |
| --- | --------------------------------- | ----- |
| 1   | Mac เป็น Apple Silicon (M1/M2/M3) | ✅     |
| 2   | macOS 13.0+ (Ventura/Sonoma)      | ✅     |
| 3   | Rosetta 2 ติดตั้งแล้ว             | ✅     |
| 4   | Docker Desktop ติดตั้งสำเร็จ      | ✅     |
| 5   | Docker Engine รันได้ (icon เขียว) | ✅     |
| 6   | `docker --version` ทำงานได้       | ✅     |
| 7   | `docker run hello-world` สำเร็จ   | ✅     |
| 8   | สมัคร Docker Hub แล้ว             | ✅     |
| 9   | `docker login` สำเร็จ             | ✅     |
| 10  | ทำแบบฝึกหัดครบทุกข้อ              | ✅     |

### 📸 Screenshot ที่ต้องเตรียม

เตรียม Screenshot เหล่านี้เพื่อยืนยันการติดตั้ง:

1. **About This Mac** - แสดง Chip เป็น Apple M1/M2/M3
2. **Docker Desktop** - หน้าจอ Dashboard แสดงว่า Engine Running
3. **Terminal** - ผลลัพธ์ของ `docker --version`
4. **Terminal** - ผลลัพธ์ของ `docker run hello-world`
5. **Terminal** - ผลลัพธ์ของ `docker images` (หลังจาก pull images)

---
