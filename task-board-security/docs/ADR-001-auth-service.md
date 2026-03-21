# ADR-001: เพิ่ม Auth Service แยกจาก Task Service

## Status

Accepted

## Context

ในสถาปัตยกรรม Week 6 (N-Tier Docker) Task Service ทำหน้าที่ทั้งหมดในตัวเดียว ได้แก่
จัดการ Authentication (ตรวจ password, ออก token), จัดการ User และจัดการ Task
ทำให้เกิดปัญหาดังนี้

- **Single Point of Failure**: ถ้า Task Service ถูก compromise ผู้โจมตีจะเข้าถึงทั้ง
  ข้อมูล credentials และข้อมูล task ได้พร้อมกัน
- **ไม่มี Authentication**: ทุก endpoint เรียกได้โดยตรงโดยไม่ต้องพิสูจน์ตัวตน
- **Scale ยาก**: ถ้าต้องการ scale เฉพาะ Authentication (เช่น ช่วง login พร้อมกันมาก)
  ต้อง scale ทั้ง service แทนที่จะ scale เฉพาะส่วนที่ต้องการ
- **Responsibility ซ้อนกัน**: Service เดียวรับผิดชอบหลายเรื่องเกินไป
  ขัดกับ Single Responsibility Principle

## Decision

แยก Authentication ออกเป็น **Auth Service** อิสระ โดยมีโครงสร้างดังนี้

- **Auth Service** (port 3001): รับผิดชอบเฉพาะ Login, Register และออก JWT Token
- **Task Service** (port 3002): รับผิดชอบเฉพาะ CRUD Tasks พร้อม JWT Middleware ตรวจสอบสิทธิ์
- **User Service** (port 3003): รับผิดชอบเฉพาะ User Profile และ Role management
- **Nginx API Gateway**: เป็น entry point เดียว ทำ Rate Limiting และ route ไปยัง service ที่ถูกต้อง
- **JWT Secret** ใช้ร่วมกันผ่าน Docker environment variable (`JWT_SECRET`)
  ทำให้ทุก service verify token ได้โดยไม่ต้องคุยกัน

## Consequences

**Positive:**

- **Single Responsibility**: แต่ละ service ทำหน้าที่เดียว ง่ายต่อการ maintain และ test
- **Security Isolation**: ถ้า Task Service ถูก compromise จะไม่กระทบ credentials
  ที่อยู่ใน Auth Service
- **Independent Scaling**: scale Auth Service แยกได้ในช่วง peak login
- **Defense in Depth**: มีการป้องกันหลายชั้น ได้แก่ Rate Limiting (Nginx),
  JWT Validation (Middleware) และ Role-based Authorization (Service level)
- **Centralized Logging**: แต่ละ service log ผ่าน stdout → Docker driver → Loki
  ทำให้ monitor security events ได้จากที่เดียว

**Negative:**

- **Complexity เพิ่มขึ้น**: จาก 3 containers (Week 6) เป็น 10 containers (Week 12)
  ทำให้ setup และ debug ยากขึ้น
- **Latency เพิ่มขึ้น**: JWT verification เพิ่ม ~5ms ต่อ request
- **JWT Secret Management**: ทุก service ต้องใช้ secret เดียวกัน
  ถ้า secret หลุดจะกระทบทุก service พร้อมกัน

**Trade-offs:**

- ยอมรับ complexity ที่เพิ่มขึ้นเพื่อแลกกับ security และ maintainability ที่ดีขึ้น
- ในระบบขนาดเล็ก (เช่น Lab นี้) overhead อาจดูเกินความจำเป็น
  แต่เป็น pattern ที่ถูกต้องสำหรับ Production scale
- หาก JWT Secret ถูก rotate ต้อง restart ทุก service พร้อมกัน
  แก้ได้ในอนาคตด้วย JWKS (JSON Web Key Set) endpoint
