# Week 4: Task Board - Layered Architecture

## ภาพรวม

โปรเจกต์นี้ใช้ **Layered (3-Tier) Architecture**:

### Layers:

1. **Presentation Layer** (`src/controllers/`)
   - จัดการ HTTP requests/responses
   - ตรวจสอบรูปแบบข้อมูลเข้า
   - จัดรูปแบบข้อมูลออก

2. **Business Logic Layer** (`src/services/`)
   - กฎทางธุรกิจและการตรวจสอบ
   - การประสานงาน workflow
   - การแปลงข้อมูล

3. **Data Access Layer** (`src/repositories/`)
   - การดำเนินการฐานข้อมูล
   - ประมวลผล queries
   - จัดเก็บข้อมูล

## โครงสร้างโปรเจกต์
```
week4-layered/
├── src/
│   ├── controllers/    # Presentation Layer
│   ├── services/       # Business Logic Layer
│   ├── repositories/   # Data Access Layer
│   ├── models/         # Data Models
│   └── middleware/     # Express middleware
├── database/
├── public/
└── server.js
```
## การติดตั้ง

```bash
npm install
```

## การตั้งค่า

สร้างไฟล์ `.env`:

NODE_ENV=development
PORT=3000
DB_PATH=./database/tasks.db
LOG_LEVEL=debug

## การรัน

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Tasks
- `GET /api/tasks` - ดึง tasks ทั้งหมด (พร้อมตัวกรอง)
- `GET /api/tasks/:id` - ดึง task ตาม ID
- `POST /api/tasks` - สร้าง task ใหม่
- `PUT /api/tasks/:id` - อัพเดท task
- `DELETE /api/tasks/:id` - ลบ task

### Statistics
- `GET /api/tasks/stats` - ดึงสถิติ tasks

### Actions
- `PATCH /api/tasks/:id/next-status` - เลื่อนไปสถานะถัดไป

## กฎทางธุรกิจ

1. ชื่อ task ต้องมี 3-100 ตัวอักษร
2. งาน HIGH priority ต้องมีรายละเอียด
3. ไม่สามารถเปลี่ยนงาน DONE กลับไปเป็น TODO
4. สถานะที่ใช้ได้: TODO, IN_PROGRESS, DONE
5. ระดับความสำคัญที่ใช้ได้: LOW, MEDIUM, HIGH

## ข้อดีของ Layered Architecture

✅ **Maintainability** - แก้ไข layers ที่ต้องการได้ง่าย  
✅ **Testability** - ทดสอบแต่ละ layer ได้อิสระ  
✅ **Reusability** - Layers สามารถนำกลับมาใช้ได้  
✅ **Separation of Concerns** - หน้าที่ชัดเจน  
✅ **Team Collaboration** - ทีมต่างๆ ทำงานใน layers ต่างกันได้

## Trade-offs

❌ **Complexity** - มีไฟล์และโครงสร้างมากขึ้น  
❌ **Performance** - มี overhead จาก layers  
❌ **Over-engineering** - อาจมากเกินไปสำหรับโปรเจกต์เล็ก

Checklist การทดสอบ

**การทดสอบฟังก์ชัน:**
- [x] ✅ GET /api/tasks - คืนค่า tasks ทั้งหมด
- [x] ✅ GET /api/tasks/:id - คืนค่า task ตัวเดียว
- [x] ✅ GET /api/tasks?status=TODO - กรองตาม status
- [x] ✅ GET /api/tasks/stats - คืนค่าสถิติ
- [x] ✅ POST /api/tasks - สร้าง task ที่ถูกต้อง
- [x] ✅ POST /api/tasks - ปฏิเสธ task ที่ title < 3 ตัวอักษร
- [x] ✅ POST /api/tasks - ปฏิเสธ HIGH priority ที่ไม่มี description
- [x] ✅ PUT /api/tasks/:id - อัพเดท task
- [x] ✅ PUT /api/tasks/:id - ปฏิเสธการเปลี่ยนจาก DONE เป็น TODO
- [x] ✅ PATCH /api/tasks/:id/next-status - เลื่อนสถานะไปข้างหน้า
- [x] ✅ DELETE /api/tasks/:id - ลบ task

**การทดสอบการแยก Layer:**
- [x] ✅ Controller ไม่มี business logic
- [x] ✅ Service ไม่มี database queries
- [x] ✅ Repository ไม่มี business rules

## เทคโนโลยีที่ใช้

- Node.js 20+
- Express.js 4.18+
- SQLite3 5.1+
- dotenv

## ผู้พัฒนา

[ธนภัทร นุกูล] - ENGSE207 สัปดาห์ที่ 4

---
