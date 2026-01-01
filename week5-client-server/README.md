# Week 5: Task Board - Client-Server Architecture

## Overview

This project demonstrates **Client-Server Architecture** with:
- **Client (Frontend):** Runs on local machine
- **Server (Backend):** Runs on Ubuntu VM
- **Communication:** REST API over HTTP

## Architecture Comparison

### Week 4: Layered (Single Machine)
```
Browser → Node.js (all layers) → Database
        (localhost:3000)
```
### Week 5: Client-Server (Two Machines)
```
Local Browser    →   Network   →   Ubuntu VM (Node.js API)   →   Database
(localhost:8080)                   (192.168.1.11:3000)
```
## Project Structure
```
Local Machine:
└── public/
    ├── index.html    # โครงสร้างหน้าเว็บ
    ├── style.css     # การตกแต่ง
    ├── app.js        # Logic การดึงข้อมูล API (Fetch)
    └── config.js     # ไฟล์ตั้งค่า IP ของ API Server

Virtual Machine (Server-side):
└── task-board-api/
    ├── week4-layerd/
    │   ├── server.js # API Entry Point (ติดตั้ง CORS แล้ว)
    │   └── src/      # controllers, services, repositories
    └── database/     # tasks.db (SQLite)
```

## Setup Instructions

### 1. VM Setup
See [DEPLOYMENT.md](DEPLOYMENT.md)

### 2. Local Frontend
```bash
cd public
python -m http.server 8080
# Open http://localhost:8080
```

### 3. Configure API URL
Edit `public/config.js`:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://YOUR_VM_IP:3000'
};
```

## Technologies

### Client (Local)
- HTML5, CSS3, JavaScript (ES6+)
- Fetch API for HTTP requests

### Server (VM)
- Ubuntu Server 22.04 LTS
- Node.js 20+
- Express.js 4.18+
- SQLite3
- PM2 (Process Manager)
- CORS (Cross-Origin Resource Sharing)

## API Documentation

Base URL: `http://VM_IP:3000`

### Endpoints

#### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

#### Statistics
- `GET /api/tasks/stats` - Get task statistics

#### Actions
- `PATCH /api/tasks/:id/next-status` - Move to next status

### Example Request
```javascript
fetch('http://192.168.1.11:3000/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        title: 'New Task',
        description: 'Description',
        priority: 'HIGH'
    })
})
.then(r => r.json())
.then(d => console.log(d));
```
