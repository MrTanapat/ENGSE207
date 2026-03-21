### Test Case 1: ❌ เรียก Protected API โดยไม่มี Token

```bash
# ทดสอบ: เรียก tasks โดยไม่ login
curl -X GET http://localhost/api/tasks/

# ผลที่คาดหวัง: 401 Unauthorized
```

**Expected Response:**

```json
{
  "error": "Unauthorized",
  "message": "กรุณา Login ก่อน — ไม่พบ Token ใน Authorization header"
}
```

**📝 บันทึก:**

```
Status Code ที่ได้: 401
เป็นไปตามที่คาดหวังหรือไม่: ใช่
เพราะเหตุใด: requireAuth middleware ตรวจไม่พบ Authorization header จึงปฏิเสธทันที
```

### Test Case 2: ✅ Register และ Login เพื่อรับ Token

**Step 1: Register**

```bash
curl -X POST http://localhost/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "mypassword123",
    "name": "Test User"
  }'
```

**Expected:** `201 Created` พร้อม JWT token

**Step 2: Login ด้วย user ที่มีอยู่แล้ว**

```bash
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }'
```

**Expected Response:**

```json
{
  "message": "Login สำเร็จ",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-001",
    "email": "alice@example.com",
    "role": "member"
  }
}
```

**📝 บันทึก Token:** (เอาไว้ใช้ Test Cases ต่อไป)

```
TOKEN=$2a$10$VaVmyi.PN/WjwlBi17FzLe9wt0GneSaGaXWfIVoSxs5igLdCX5Ay2
```

```bash
# Save token เป็น variable (Linux/Mac)
TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

echo "Token saved: ${TOKEN:0:30}..."
```

### Test Case 3: ✅ เรียก Protected API ด้วย Token

```bash
# ดู tasks ทั้งหมด (ต้องมี token)
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer $TOKEN"
```

**Expected:** `200 OK` พร้อมรายการ tasks

**📝 บันทึก:**

```
จำนวน tasks ที่ได้: 2 รายการ
Tasks แสดงเฉพาะของ alice หรือทั้งหมด: เฉพาะของ alice (owner_id = user-001)
เพราะเหตุใด (ดู authMiddleware.js ประกอบ): member → authMiddleware ตรวจสอบ role แล้ว
query ด้วย WHERE owner_id = $1 OR assignee_id = $1 จึงเห็นแค่ tasks ของตัวเอง
ต่างจาก admin ที่ query ทุก tasks โดยไม่กรอง
```

---

### Test Case 4: ❌ ใช้ Token ที่หมดอายุหรือ Invalid

```bash
# ทดสอบด้วย token ปลอม
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.INVALID.SIGNATURE"
```

**Expected:** `401 Invalid Token`

```bash
# ทดสอบด้วย token ที่ถูกแก้ไข (เพิ่ม x ท้าย token จริง)
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer ${TOKEN}xxx"
```

**📝 บันทึก:**

```
ทั้ง 2 กรณีให้ผลอย่างไร: 401 Invalid Token
JWT Signature ทำงานอย่างไร:   - Server ใช้ JWT_SECRET สร้าง Signature ตอนออก token
                            - ทุก request ที่เข้ามา server จะ verify signature ใหม่
                            - ถ้า token ถูกแก้ไขแม้แค่ตัวเดียว signature จะไม่ตรง → reject ทันที
```

---

### Test Case 5: ❌ Authorization — Member ลบ Task ของคนอื่น

```bash
# Login เป็น Alice ก่อน
ALICE_TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# ลอง DELETE task id=4 (เจ้าของคือ user-admin ไม่ใช่ alice)
curl -X DELETE http://localhost/api/tasks/4 \
  -H "Authorization: Bearer $ALICE_TOKEN"
```

**Expected:** `403 Forbidden`

**📝 บันทึก:**

```
ผลที่ได้: 403 Forbidden
Authentication vs Authorization ต่างกันอย่างไรในกรณีนี้:   - Authentication (AuthN): พิสูจน์ว่าเป็นใคร → alice มี JWT token ถูกต้อง ผ่านแล้ว
                                                    - Authorization (AuthZ): ตรวจสิทธิ์ว่าทำได้ไหม → alice ไม่ใช่เจ้าของ task id=4
                                                        (owner_id = user-admin) จึงถูกปฏิเสธ 403
```

### Test Case 6: ✅ Admin ทำได้ทุกอย่าง

```bash
# Login เป็น Admin
ADMIN_TOKEN=$(curl -s -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}' | \
  python3 -c "import sys,json; print(json.load(sys.stdin)['token'])")

# Admin ดู tasks ทั้งหมด (ไม่จำกัดเฉพาะของตัวเอง)
curl -X GET http://localhost/api/tasks/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Admin ดู users ทั้งหมด
curl -X GET http://localhost/api/users/ \
  -H "Authorization: Bearer $ADMIN_TOKEN"

# Alice ลอง ดู users ทั้งหมด (ไม่มีสิทธิ์)
curl -X GET http://localhost/api/users/ \
  -H "Authorization: Bearer $ALICE_TOKEN"
```

**📝 บันทึก:**

```
Admin เห็น tasks กี่รายการ: 4 รายการ (เห็นทั้งหมดทุก owner)
Alice เห็น tasks กี่รายการ: 2 รายการ (เฉพาะของตัวเอง)
Alice เรียก /api/users/ ได้ status: 403 Forbidden
สรุป Role-Based Access Control ทำงานอย่างไร:   - member → เห็นเฉพาะ tasks ของตัวเอง, เข้า /api/users/ ไม่ได้
                                            - admin  → เห็น tasks ทุกคน, เข้า /api/users/ ได้
                                            - ระบบตรวจจาก req.user.role ใน JWT payload
```

---

### Test Case 7: ❌ Brute-force Attack (Rate Limiting)

```bash
# ส่ง login ผิดหลายครั้งติดกัน (เกิน 5 ครั้ง/นาที)
for i in {1..8}; do
  echo "Attempt $i:"
  curl -s -o /dev/null -w "%{http_code}" \
    -X POST http://localhost/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"alice@example.com","password":"wrongpassword"}'
  echo ""
  sleep 0.2
done
```

**Expected:** หลัง attempt ที่ 5 จะได้ `429 Too Many Requests`

**📝 บันทึก:**

```
Attempt ที่เท่าไหร่ที่เริ่มได้ 429: attempt ที่ 5
Rate Limiting ช่วยป้องกัน Attack ชนิดใด: Brute-force Attack (การลอง password ซ้ำๆ)
ข้อเสียของ Rate Limiting ที่อาจเกิดขึ้น: ผู้ใช้จริงที่พิมพ์ password ผิดหลายครั้งติดกัน อาจถูก block ชั่วคราวโดยไม่ได้ตั้งใจ
```

---

### Test Case 8: 🔍 SQL Injection Attempt

```bash
# ลอง SQL Injection ผ่าน login
curl -X POST http://localhost/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com'\''-- ",
    "password": "anything"
  }'

# ลอง SQL Injection ผ่าน task query
curl -X GET "http://localhost/api/tasks/?id=1;DROP TABLE tasks--" \
  -H "Authorization: Bearer $ALICE_TOKEN"
```

**Expected:** ทั้งสองกรณีควรไม่สามารถ inject ได้ เพราะใช้ Parameterized Queries

**📝 บันทึก:**

```
ได้ผลลัพธ์อย่างไร: SQL Injection ผ่าน email
Parameterized Query ป้องกัน SQL Injection อย่างไร:
  pool.query('WHERE email = $1', [email])
  → $1 คือ placeholder ที่ pg driver จัดการ escape ให้อัตโนมัติ
  → ค่าที่ส่งมาถูกมองเป็น "string ธรรมดา" ไม่ใช่ SQL command
  → ต่อให้ใส่ ' OR 1=1-- ก็ไม่มีผล
(ดูใน auth.js: pool.query('...WHERE email = $1', [email]))
```

---

### 📊 สรุปผลการทดสอบ

กรอกตารางนี้หลังทำ Test Cases ครบ:

| Test Case           | Expected    | Actual        | ✅/❌ | หมายเหตุ                                                          |
| ------------------- | ----------- | ------------- | ----- | ----------------------------------------------------------------- |
| 1. ไม่มี Token      | 401         | 401           | ✅    | requireAuth middleware ปฏิเสธทันทีเมื่อไม่มี Authorization header |
| 2. Login สำเร็จ     | 200 + Token | 200 + Token   | ✅    | ได้รับ JWT token กลับมาพร้อม user info                            |
| 3. มี Token ถูกต้อง | 200 + data  | 200 + 2 tasks | ✅    | alice เห็นเฉพาะ tasks ของตัวเอง (owner_id = user-001)             |
| 4. Token Invalid    | 401         | 401           | ✅    | ทั้ง token ปลอมและ token ที่ถูกแก้ไขได้ Invalid Token เหมือนกัน   |
| 5. Forbidden (403)  | 403         | 403           | ✅    | alice ไม่มีสิทธิ์ลบ task ของ user-admin                           |
| 6. Admin access     | 200         | 200           | ✅    | admin เห็น 4 tasks, alice เรียก /api/users/ ได้ 403               |
| 7. Rate Limit       | 429         | 429           | ✅    | เริ่ม block ที่ attempt ที่ 5 ตามที่ตั้งค่า 5r/m                  |
| 8. SQL Injection    | Safe        | Safe          | ✅    | Parameterized Query ป้องกัน injection ได้ทุกกรณี                  |

---
