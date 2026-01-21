# 📋 Task Board - N-Tier Architecture (Week 6)

## 🏗️ Architecture
Browser → Nginx (HTTPS) → Node.js (API) → PostgreSQL (Data)

## 🚀 Quick Start

```bash
# Start all services
./scripts/start-all.sh

# Access
https://taskboard.local
```

```bash
week6-ntier/
├── src/           # Backend source code
├── public/        # Frontend files
├── database/      # SQL scripts
├── nginx/         # Nginx config
└── scripts/       # Helper scripts
```

## 🛠️ Technologies

| Tier | Technology |
|------|------------|
| Web Server | Nginx |
| Backend | Node.js + Express |
| Database | PostgreSQL |


## TEST CHECKLIST

1. **TIER 3 - Database (PostgreSQL)**

`sudo systemctl status postgresql`

<img width="600" height="225" alt="image" src="https://github.com/user-attachments/assets/1476151f-f6b9-4b98-8327-2348dacfdf7c" />

`psql -h localhost -U taskboard -d taskboard_db -c "SELECT 1"`

<img width="600" height="225" alt="image" src="https://github.com/user-attachments/assets/793b744a-a473-4760-b2cc-7aba623e23ce" />

---

2. **TIER 2 - Backend (Node.js)**

`pm2 status`

<img width="600" height="225" alt="image" src="https://github.com/user-attachments/assets/7f679cc6-ed6f-42b9-afc1-25777f6694cc" />

`curl http://localhost:3000/api/health`

<img width="600" height="630" alt="image" src="https://github.com/user-attachments/assets/9185a1dc-58cb-42f4-891b-0e93a1145316" />


`curl http://localhost:3000/api/tasks`

<img width="600" height="630" alt="image" src="https://github.com/user-attachments/assets/8dfe49f3-4c2c-427b-82c4-205ebeb616e4" />

---

3. **TIER 1 - Web Server (Nginx)**

`sudo systemctl status nginx`

<img width="600" height="360" alt="image" src="https://github.com/user-attachments/assets/e1e895e3-d46a-400b-9266-be5a13e49f10" />

`curl http://taskboard.local (should redirect)`

<img width="600" height="200" alt="image" src="https://github.com/user-attachments/assets/a6901779-ff59-41c6-b6a4-ee1dd216c584" />

`curl -k https://taskboard.local`

<img width="600" height="200" alt="image" src="https://github.com/user-attachments/assets/3a2a265a-767a-487b-b86c-af5d102a39f5" />

`curl -k https://taskboard.local/api/health`

<img width="600" height="480" alt="image" src="https://github.com/user-attachments/assets/5e9b1746-5cd7-48f5-8bcd-b5be5a6d0325" />

---

4. **FULL STACK**

`Open browser: https://taskboard.local`

<img width="1300" height="1000" alt="image" src="https://github.com/user-attachments/assets/a42d2767-236d-40c3-a384-d713bc955eb6" />


`Accept SSL warning`

`Create new task`

<img width="1300" height="1000" alt="image" src="https://github.com/user-attachments/assets/dee4b8ac-bc21-411e-b901-fc041c10b4dd" />

`Edit task`, `Move task status`

<img width="1300" height="1000" alt="image" src="https://github.com/user-attachments/assets/1f46da21-5231-43f7-9f75-2d55fc1693f8" />

`Delete task` 
<img width="1300" height="800" alt="image" src="https://github.com/user-attachments/assets/1461fdc1-2844-46ac-bd14-22ec0e8a3816" />


## 👨‍💻 Author

Tanapat Nukool - ENGSE207 Week 6
```

---

## 🛠️ แก้ปัญหาเบื้องต้น

### PostgreSQL
```bash
# ตรวจสอบ status
sudo systemctl status postgresql

# ดู logs
sudo tail -50 /var/log/postgresql/postgresql-*-main.log

# Reset password
sudo -u postgres psql -c "ALTER USER taskboard PASSWORD 'taskboard123';"
```

### Nginx
```bash
# Test config
sudo nginx -t

# ดู logs
sudo tail -f /var/log/nginx/taskboard_error.log

# Restart
sudo systemctl restart nginx
```

### Node.js
```bash
# ดู PM2 logs
pm2 logs taskboard-api

# Restart
pm2 restart taskboard-api

# ดู process
pm2 show taskboard-api
```

---
