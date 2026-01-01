# ENGSE207 Software Architecture

## 📝 Homework Lab สัปดาห์ที่ 4 (งานกลุ่ม): Microservices Design & Mini-Debate

**Requirements:**
1. Real-time Chat ในแต่ละ Board
2. แจ้งเตือนเมื่อมีข้อความใหม่
3. ค้นหา Chat History
4. File Sharing

### 1. Service Design (20 คะแนน)
1. ควรสร้าง Service ใหม่ (Chat Service) หรือเพิ่มใน Task Service? <br>
**ตอบ** ควรสร้าง Service ใหม่ เพราะ Chat มีการใช้งานที่ต่างจาก Task การแยกออกมาจะช่วยให้ Scale เฉพาะส่วนได้ง่ายขึ้น 
2. ถ้าสร้าง Service ใหม่ → Technology Stack อะไร? เพราะอะไร? <br>
**ตอบ** Node.js (Express) เพราะรองรับ I/O แบบ Non-blocking ได้ดีเยี่ยม และทำงานร่วมกับ Socket.io ได้อย่างมีประสิทธิภาพ
3. Database ควรใช้อะไร? (SQL/NoSQL/Cache) เพราะอะไร?
**ตอบ** MongoDB (NoSQL) เพราะ Chat History มีโครงสร้างข้อมูลที่ไม่ซับซ้อนและรองรับการบันทึกข้อมูลปริมาณมาก
4. Real-time ใช้ WebSocket หรือ Polling? Trade-offs? <br>
**ตอบ** ใช้ WebSocket เพราะเป็นการสื่อสารแบบ Full-duplex ที่ลด Overhead ของ HTTP Header ทำให้รับส่งข้อความได้ทันที

### 2. Architecture Diagram (30 คะแนน)

<p align="center">
  <img src="week4_homework_Group4/Architecture_Diagram.png" width="80%" alt="Architecture Diagram">
  <br>
  <b>รูปที่ 1: แผนภาพสถาปัตยกรรมระบบ Team Chat</b>
</p>

### 3. Event Design
**Events Definition**
- MessageSent: เกิดขึ้นเมื่อผู้ใช้ส่งข้อความสำเร็จ ข้อมูลประกอบด้วย senderId, boardId, content, timestamp
- UserJoinedChat: เกิดขึ้นเมื่อผู้ใช้เข้าสู่หน้า Chat room เพื่ออัปเดตสถานะ Online
- FileUploaded: เกิดขึ้นเมื่อมีการอัปโหลดไฟล์สำเร็จ ส่งข้อมูลลิงก์ไฟล์ไปยัง Chat room

**Event Flow**
- User ส่งข้อความผ่าน WebSocket send_message
- Chat Service บันทึกลง MongoDB และ Publish Event MessageSent ไปยัง Kafka
- Notification Service รับ Event และส่ง Push Notification ให้สมาชิกคนอื่นใน Board

### 4. API Design (20 คะแนน)
**REST API (HTTP)**
- POST /api/boards/:boardId/messages: ส่งข้อความใหม่
- GET /api/boards/:boardId/messages?limit=50: ดึงประวัติข้อความ
- DELETE /api/boards/:boardId/messages/:messageId: ลบข้อความเฉพาะบุคคล

**WebSocket Events**
- join_room: socket.join(boardId) เพื่อรับข้อความเฉพาะ Board นั้นๆ
- send_message: รับ Payload ข้อความจาก Client
- message_received: Broadcast ข้อความไปยังทุกคนใน boardId

### 5. Challenges & Solutions (10 คะแนน)
- Challenge 1: Message Order (ลำดับข้อความ) <br>
**Solution :** ใช้ Snowflake ID หรือ Timestamp ระดับนาโนวินาที จากฝั่ง Server เพื่อเรียงลำดับเวลาที่แน่นอน 
- Challenge 2: Message Delivery Guarantee <br>
**Solution :** ใช้ Message Ack จาก Client เมื่อได้รับข้อความ หากไม่ได้รับในเวลาที่กำหนด Server จะทำการ Retry
- Challenge 3: Scalability (เมื่อมีผู้ใช้หลายพัน) <br>
**Solution :** ใช้ Redis Pub/Sub เพื่อแชร์ข้อความระหว่าง Chat Service หลายๆ Instance (Horizontal Scaling)
- Challenge 4: Chat History (เก็บอย่างไร? เก็บนานแค่ไหน?) <br>
**Solution :** ใช้ Database Indexing บน boardId และ timestamp พร้อมทำ Data Archiving โดยย้ายข้อความที่เก่ากว่า 1 ปีไปยัง Cold Storage
