# 🐳 Week 6: N-Tier Architecture with Docker (Version 2)

**ENGSE207 - Software Architecture**  
**มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา**

---

## 📋 ภาพรวม

โปรเจกต์นี้พัฒนา Task Board Application โดยใช้ **N-Tier Architecture** บน **Docker Containers** ประกอบด้วย 3 containers ที่สื่อสารกันผ่าน Docker Network

```
Browser → Nginx (HTTPS) → Node.js API → PostgreSQL
```

---

## 🏗️ สถาปัตยกรรม

```
┌─────────────────────────────────────────────┐
│              Docker Host                    │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │  nginx:alpine  (Port 80, 443)        │   │
│  │  • Reverse Proxy                     │   │
│  │  • Static File Server               │   │
│  │  • SSL Termination                  │   │
│  └──────────────────┬───────────────────┘   │
│                     │ HTTP :3000             │
│  ┌──────────────────▼───────────────────┐   │
│  │  node:20-alpine  (Internal :3000)    │   │
│  │  • REST API (Layered Architecture)  │   │
│  │  • Controllers / Services / Repos   │   │
│  └──────────────────┬───────────────────┘   │
│                     │ TCP :5432              │
│  ┌──────────────────▼───────────────────┐   │
│  │  postgres:16-alpine (Internal :5432) │   │
│  │  • Persistent Volume                │   │
│  └──────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

---

## 📁 โครงสร้างโปรเจกต์

```
week6-ntier-docker/
├── docker-compose.yml          # Orchestration หลัก
├── .env                        # Environment variables
├── .env.example                # Template
├── api/
│   ├── Dockerfile
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── config/database.js
│       ├── models/Task.js
│       ├── repositories/taskRepository.js
│       ├── services/taskService.js
│       ├── controllers/taskController.js
│       ├── routes/taskRoutes.js
│       └── middleware/errorHandler.js
├── nginx/
│   ├── nginx.conf
│   ├── conf.d/default.conf
│   └── ssl/
├── frontend/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── database/
│   └── init.sql
├── scripts/
│   ├── start.sh
│   ├── stop.sh
│   ├── logs.sh
│   ├── test-api.sh
│   └── generate-ssl.sh
└── docs/
    └── ANALYSIS.md
```

---

## ⚙️ การติดตั้งและการรัน

### สิ่งที่ต้องมีก่อน

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) หรือ Docker Engine + Docker Compose
- Git

### ขั้นตอนการติดตั้ง

**1. Clone repository**
```bash
git clone https://github.com/YOUR_USERNAME/week6-ntier-docker.git
cd week6-ntier-docker
```

**2. สร้างไฟล์ environment**
```bash
cp .env.example .env
```

**3. Generate SSL Certificate**
```bash
chmod +x scripts/generate-ssl.sh
./scripts/generate-ssl.sh
```

**4. Start ทุก containers**
```bash
docker compose up -d
```

**5. เปิดเบราว์เซอร์**
```
https://localhost
```
> ⚠️ กด "Advanced" แล้ว Accept self-signed certificate ได้เลย

---

## 🐳 Docker Commands

### เริ่ม / หยุดระบบ

```bash
# เริ่มต้นทุก containers
docker compose up -d

# หยุดทุก containers
docker compose down

# หยุดและลบ volumes (ข้อมูลจะหาย)
docker compose down -v
```

### ตรวจสอบสถานะ

```bash
# ดู status ของ containers
docker compose ps

# ดู resource usage
docker stats

# ดู disk usage
docker system df
```

### Logs

```bash
# ดู logs ทุก services
docker compose logs

# ดู logs แบบ follow
docker compose logs -f

# ดู logs เฉพาะ service
docker compose logs api
docker compose logs db
docker compose logs nginx
```

### จัดการ Containers

```bash
# Rebuild และ restart
docker compose up -d --build

# Restart service เดียว
docker compose restart api

# เข้าไปใน container
docker exec -it taskboard-api sh
docker exec -it taskboard-db psql -U taskboard -d taskboard_db
```

### Clean Up

```bash
# ลบ containers, networks, volumes ทั้งหมด
docker compose down -v

# ลบ unused images และ cache
docker system prune -f
```

---

## 🔌 API Endpoints

Base URL: `https://localhost/api`

| Method | Endpoint | คำอธิบาย |
|--------|----------|---------|
| GET | `/health` | ตรวจสอบสถานะระบบ |
| GET | `/tasks` | ดึง tasks ทั้งหมด |
| GET | `/tasks/:id` | ดึง task ตาม ID |
| POST | `/tasks` | สร้าง task ใหม่ |
| PUT | `/tasks/:id` | อัปเดต task |
| DELETE | `/tasks/:id` | ลบ task |
| GET | `/tasks/stats` | ดูสถิติ |

### ตัวอย่าง Request

```bash
# Health Check
curl -k https://localhost/api/health

# Get All Tasks
curl -k https://localhost/api/tasks

# Create Task
curl -k -X POST https://localhost/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"New Task","description":"Description","priority":"HIGH"}'

# Update Task
curl -k -X PUT https://localhost/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"IN_PROGRESS"}'

# Delete Task
curl -k -X DELETE https://localhost/api/tasks/1
```

---

## 🗄️ Database

**PostgreSQL 16** ทำงานใน Docker Container พร้อม Persistent Volume

```bash
# เข้าถึง database โดยตรง
docker exec -it taskboard-db psql -U taskboard -d taskboard_db

# ตัวอย่าง SQL commands
SELECT * FROM tasks;
SELECT status, COUNT(*) FROM tasks GROUP BY status;
\q
```

### Schema

```sql
CREATE TABLE tasks (
    id          SERIAL PRIMARY KEY,
    title       VARCHAR(200) NOT NULL,
    description TEXT DEFAULT '',
    status      VARCHAR(20) DEFAULT 'TODO',    -- TODO | IN_PROGRESS | DONE
    priority    VARCHAR(20) DEFAULT 'MEDIUM',  -- LOW | MEDIUM | HIGH
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🔐 Environment Variables

| Variable | Default | คำอธิบาย |
|----------|---------|---------|
| `POSTGRES_DB` | `taskboard_db` | ชื่อ database |
| `POSTGRES_USER` | `taskboard` | Username |
| `POSTGRES_PASSWORD` | `taskboard123` | Password |
| `PORT` | `3000` | API port |
| `NODE_ENV` | `development` | Environment |

---

## ❗ แก้ปัญหาเบื้องต้น

**Container ไม่ start**
```bash
docker compose down
docker compose up -d --build
```

**Port 80/443 ถูกใช้งานอยู่**
```bash
# Windows
netstat -ano | findstr :80

# Linux/Mac
sudo lsof -i :80
```

**Database ไม่มีข้อมูล**
```bash
docker compose down -v
docker compose up -d
```

**SSL Certificate Error**
```bash
./scripts/generate-ssl.sh
docker compose restart nginx
```

---

## 📊 เปรียบเทียบ VM vs Docker

| หัวข้อ | Version 1 (VM) | Version 2 (Docker) |
|--------|----------------|-------------------|
| Setup Time | ~30-50 นาที | ~1-5 นาที |
| Cleanup | ซับซ้อน | `docker compose down` |
| Portability | ต่ำ | สูง |
| Consistency | แตกต่างตามเครื่อง | เหมือนกันทุกเครื่อง |
| Resource Usage | หนัก (Full VM) | เบา (Containers) |

---

## 🛠️ เทคโนโลยีที่ใช้

- **Docker** 24.x + Docker Compose v2
- **Node.js** 20 (Alpine)
- **Express.js** 4.18
- **PostgreSQL** 16 (Alpine)
- **Nginx** (Alpine) + SSL
- **Architecture:** N-Tier (Layered)

---

## 👤 ผู้พัฒนา

**ธนภัทร นุกูล**  
รหัสนักศึกษา: 67543210031-0

---
