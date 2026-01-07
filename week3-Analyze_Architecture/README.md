
### 📝 Lab 1: Analyze Real System Architecture (Due: 1 สัปดาห์)

**วัตถุประสงค์:**
- วิเคราะห์สถาปัตยกรรมของระบบจริง
- ฝึกการระบุ Architectural Styles

## System: GrabFood / LINE MAN
### 1. System Overview (1 หน้า)
### ระบบนี้ทำอะไร?
GrabFood และ LINE MAN เป็นแพลตฟอร์ม **On-demand Delivery Ecosystem** ที่ทำหน้าที่เป็นตัวกลาง (Marketplace) เชื่อมโยงผู้บริโภค ร้านอาหาร และผู้ให้บริการขนส่งเข้าด้วยกันแบบ Real-time

### Stakeholders
| Stakeholder | บทบาท |
|-------------|-------|
| Customer    | ค้นหาร้านอาหาร, สั่งซื้อ, ติดตามสถานะ, และชำระเงิน |
| Merchant    | บริหารจัดการเมนู, รับออเดอร์, และเตรียมอาหาร |
| Driver      | รับงานส่งอาหาร, นำทาง (Navigation), และยืนยันการส่ง |
| Platform Owner | ดูแลระบบ Matching, จัดโปรโมชั่น, คำนวณ GP และค่าธรรมเนียม |

### Quality Attributes (QAs) ที่สำคัญ
* **Availability:** ระบบต้องพร้อมใช้งานตลอด 24 ชั่วโมง โดยเฉพาะในช่วง Peak Hours (เที่ยง/เย็น)
* **Scalability:** สามารถรองรับปริมาณ Transaction มหาศาลได้ในช่วงจัดโปรโมชั่น (เช่น 11.11 หรือ Flash Sale)
* **Performance:** การอัปเดตตำแหน่ง GPS ของไรเดอร์ต้องมีความหน่วงต่ำ (Low Latency)
---
### 2. Architecture Analysis (2-3 หน้า)**
### ใช้ Architectural Style อะไร? (อย่างน้อย 2 styles)
1.  **Microservices Architecture:** - แยกบริการตามโดเมน เช่น *Order Service*, *Payment Service*, *Driver Matching Service*
    - **เหตุผล:** เพื่อให้แต่ละทีม (เช่น ทีมดูแลระบบจ่ายเงิน) พัฒนาและ Deploy งานได้อิสระจากกัน (Independent Deployment)
2.  **Event-Driven Architecture (EDA):**
    - ใช้การสื่อสารผ่าน Message Broker (เช่น Kafka) เมื่อเกิดสถานะใหม่ เช่น "Order Paid" จะส่ง Signal ให้ห้องครัวเริ่มทำอาหารทันที
    - **เหตุผล:** เพื่อลดการรอคอยระหว่าง Service (Asynchronous Processing) และเพิ่มความยืดหยุ่นของระบบ
   - วาดแผนภาพสถาปัตยกรรม (high-level)
   - อธิบายทำไมถึงเลือก styles เหล่านี้

3. **Quality Attributes Mapping (1 หน้า)**
   - Architecture นี้รองรับ QAs อย่างไร?
   - มี Trade-offs อะไรบ้าง?

4. **Lessons Learned (1 หน้า)**
   - สิ่งที่เรียนรู้จากการวิเคราะห์?
   - นำไปใช้กับโปรเจกต์ของตัวเองได้อย่างไร?

## คำถามท้ายบท

### 🤔 ทดสอบความเข้าใจ

1. Architectural Style และ Architectural Pattern ต่างกันอย่างไร?

2. Monolithic Architecture เหมาะกับโปรเจกต์แบบไหน? ยกตัวอย่าง

3. อธิบาย Separation of Concerns ใน Layered Architecture

4. 2-Tier กับ 3-Tier Architecture แตกต่างกันอย่างไร?

5. Pipe-and-Filter Architecture เหมาะกับงานประเภทไหน?

6. ระบบ E-Commerce ควรเลือก Architecture แบบไหน? เพราะอะไร?

7. Trade-offs สำคัญระหว่าง Monolithic กับ Layered คืออะไร?

---
