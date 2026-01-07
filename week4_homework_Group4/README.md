# 📘 System Design Overview

README นี้อธิบายแนวคิดด้าน System Design ผ่าน 3 โจทย์หลัก ได้แก่
1. Event-Driven E-Commerce
2. เปรียบเทียบโครงสร้าง Netflix vs Grab
3. การเลือก Architecture สำหรับระบบ “หมอพร้อม”

---

## 1. ออกแบบระบบสั่งซื้อ (E-Commerce) ด้วย Event-Driven Architecture

### แนวคิดหลัก
ระบบใช้ **Event-Driven Architecture** โดยให้แต่ละ Service สื่อสารกันผ่าน **Message Broker**  
แทนการเรียกกันตรง ๆ เพื่อให้ระบบสามารถขยายตัวได้ง่าย (Scalable)  
ทนต่อความล้มเหลว (Resilient) และพัฒนาแยกกันได้อิสระ

---

### Flow การทำงานเมื่อผู้ใช้กดสั่งซื้อ

#### User / Order Service
- ผู้ใช้กดปุ่ม **สั่งซื้อ**
- ระบบสร้างคำสั่งซื้อ (Order)
- ส่ง Event `OrderPlaced` เข้า Message Broker

#### Inventory Service
- Subscribe Event `OrderPlaced`
- ตรวจสอบและตัด / จองสต็อกสินค้า
- ส่ง Event `StockReserved`

#### Payment Service
- Subscribe Event `StockReserved`
- ทำการตัดเงินผ่านบัตรเครดิตหรือช่องทางชำระเงิน
- ส่ง Event `PaymentCompleted`

#### Notification Service
- Subscribe Event `PaymentCompleted`
- ส่ง Email / SMS ยืนยันการสั่งซื้อให้ลูกค้า

---

### Diagram (Conceptual)

<img width="822" height="749" alt="image" src="https://github.com/user-attachments/assets/2eeafe83-9ec5-49db-8105-0044bb8dff44" />

---

### ข้อดีของ Event-Driven Architecture
- แต่ละ Service ไม่ต้องรอทำงานพร้อมกัน
- ระบบใดล่ม ระบบอื่นยังทำงานต่อได้
- สามารถ Scale เฉพาะ Service ที่จำเป็น
- เพิ่ม Service ใหม่ได้โดยไม่กระทบระบบเดิม

---

## 2. เปรียบเทียบโครงสร้างระบบ: Netflix vs Grab

### สิ่งที่เหมือนกัน
- ใช้ **Microservices Architecture**
- รองรับผู้ใช้งานจำนวนมหาศาล
- แยกทีมพัฒนาตาม Service / Domain
- สามารถ Deploy และ Scale ได้อิสระ

---

### Netflix (Streaming Platform)

**ลักษณะระบบ**
- Workload แบบ **Read-Heavy**
- ส่งข้อมูลขนาดใหญ่ (Video Streaming)
- ต้องการ Latency ต่ำ แต่ไม่ต้อง Real-time ระดับวินาที

**โครงสร้างเด่น**
- ใช้ **CDN (Content Delivery Network)** อย่างหนัก
- Cache วิดีโอไว้ใกล้ผู้ใช้งาน
- Backend เน้น Metadata และ Recommendation

**เป้าหมายหลัก**
- ดูวิดีโอไม่กระตุก
- ลด Buffering
- ใช้ Bandwidth อย่างมีประสิทธิภาพ

---

### Grab (Ride-Hailing Platform)

**ลักษณะระบบ**
- **Real-time & Location-based**
- ข้อมูลตำแหน่งคนขับเปลี่ยนตลอดเวลา
- ต้องตอบสนองระดับวินาทีต่อวินาที

**โครงสร้างเด่น**
- ใช้ **Event-Driven Architecture**
- ส่งข้อมูลตำแหน่งผ่าน Event / Streaming
- ใช้ Message Broker, WebSocket และ In-memory Store

**เป้าหมายหลัก**
- แสดงตำแหน่งรถแบบ Real-time
- Matching ระหว่างคนขับและผู้โดยสารอย่างรวดเร็ว
- ประสบการณ์ใช้งานที่ลื่นไหล

---

### สรุปเปรียบเทียบ

| มิติ | Netflix | Grab |
|----|--------|------|
| Workload | Read-heavy | Real-time / Write-heavy |
| Data | Video ขนาดใหญ่ | Location & Events |
| Architecture เด่น | CDN + Cache | Event-Driven |
| Latency | ต่ำ | ต่ำมาก (Real-time) |

---

## 3. หากเป็น Architect ของ “หมอพร้อม” ควรเลือก Architecture แบบใด

### Architecture ที่เลือก
**Microservices + Serverless**

---

### เหตุผลในการเลือก

#### 1. Scalability
- หมอพร้อมมีช่วงที่ผู้ใช้งานพุ่งสูงมาก (เช่น เปิดจองวัคซีน)
- Microservices ช่วยให้ Scale เฉพาะส่วนสำคัญ เช่น ระบบจองคิว

#### 2. Cost Efficiency (Serverless)
- ฟีเจอร์บางอย่างใช้งานเป็นช่วง ๆ
- Serverless ช่วยประหยัดงบประมาณ (จ่ายตามการใช้งานจริง)
- เหมาะกับระบบภาครัฐ

#### 3. Resilience
- หากบาง Service ล่ม (เช่น เช็กประวัติวัคซีน)
- Service อื่น (เช่น ระบบนัดหมาย) ยังต้องทำงานได้
- ลด Single Point of Failure

---

### สรุป
ระบบหมอพร้อมควรใช้ **Microservices** เพื่อความยืดหยุ่น  
และ **Serverless** เพื่อรองรับ Traffic ที่ไม่สม่ำเสมอ  
ช่วยให้ระบบมีความทนทาน ควบคุมต้นทุน และขยายได้ในอนาคต
