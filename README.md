# Week 3 - Task Board Monolithic

## 📁 Project Structure

```
week3-monolithic/
├── server.js
├── package.json
├── database/
│   └── schema.sql
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── .gitignore
└── README.md
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Database

```bash
cd database
sqlite3 tasks.db < schema.sql
cd ..
```

### 3. Run Application

```bash
npm run dev
```

### 4. Open Browser

```
http://localhost:3000
```

## 📦 Dependencies

- express: ^4.18.2
- sqlite3: ^5.1.6
- nodemon: ^3.0.1 (dev)

## 🔧 Available Scripts

- `npm start` - Run server with node
- `npm run dev` - Run server with nodemon (auto-restart)

## 📝 Environment

- Node.js 20+
- npm 10+
- SQLite 3+

## 📖 Lab Guide

See full lab guide in:
- Week3_Lab_Guide_Complete.md
- Week3_Lab_Quick_Reference.md

## ✉️ Support

- Course Discord
- Email: thanit@example.com
- Office Hours: Tue/Thu 14:00-16:00

---

*ENGSE207 Software Architecture - Week 3*

