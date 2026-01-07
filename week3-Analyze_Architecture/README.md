
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
   <img height="1080" width="1920" src="https://github.com/user-attachments/assets/1e678224-2107-40cf-9f4d-6c0b64243eac" />
   
    1. API Gateway (The Entry Point)
    ประตูด่านแรก ที่รับ Request ทั้งหมดจาก Mobile Apps (ลูกค้า/ไรเดอร์) และ Web (ร้านค้า)
    * Routing: ส่ง Request ไปหา Service ที่ถูกต้อง
    * Authentication: ตรวจสอบสิทธิ์การเข้าใช้งานเบื้องต้น
    * Load Balancing: กระจายภาระงานไปยัง Server ต่างๆ เพื่อประสิทธิภาพสูงสุด
    
    ---
    
    2. Core Microservices (The Brains)
    ระบบถูกแบ่งออกเป็นบริการย่อยๆ ตามหน้าที่ทางธุรกิจ (Business Capabilities) 
    * Order Service: ดูแลเรื่องการสร้างและจัดการคำสั่งซื้อ
    * Driver Matching Service: ดูแลเรื่องการคำนวณและจับคู่ไรเดอร์
    * Independence: แต่ละ Service สามารถพัฒนา, Deploy และ Scale ได้อย่างอิสระตามความต้องการใช้งาน
    
    ---
    
    3. Database per Service (The Memory)
    การออกแบบที่แต่ละ Service มีฐานข้อมูลเป็นของตัวเอง เพื่อความเป็นอิสระต่อกัน
    * Fault Isolation: ป้องกันไม่ให้ Service หนึ่งพังแล้วฉุดให้ Service อื่นพังตามไปด้วย
    * Polyglot Persistence: เลือกเทคโนโลยี DB ที่เหมาะกับงาน เช่น *Driver Service* อาจใช้ DB ที่เก่งเรื่องแผนที่ (Geospatial)
    
    ---
    
    4. Event Bus / Message Broker (The Nervous System)
    หัวใจหลักของ Event-Driven Architecture (EDA) เช่น Apache Kafka
    * Asynchronous Communication: สื่อสารแบบไม่รอผลตอบกลับทันที (เส้นประในแผนผัง)
    * Workflow Example: * เมื่อลูกค้าสั่งอาหาร Order Service จะ "ประกาศ" (Publish) Event ว่า `OrderCreated` เข้าไปใน Bus
        * Driver Matching Service ที่ "รอฟัง" (Subscribe) อยู่ จะได้รับ Event นั้นแล้วเริ่มทำงานจับคู่ไรเดอร์ทันที

#### ทำไมถึงเลือก styles เหล่านี้
**Microservices** Architecture ตอบโจทย์ Business Context ของ Food Delivery ดังนี้:
- ***Scalability***: ในวันหยุดหรือช่วงพักเที่ยง (Peak Hours) ปริมาณการสั่งอาหารจะพุ่งสูงขึ้นมาก การใช้ Microservices ทำให้เราสามารถสั่ง Scale เฉพาะ Order Service และ Payment Service ให้ใหญ่ขึ้นได้ โดยไม่ต้องไปเสียทรัพยากรเพิ่มขนาดให้กับระบบอื่นๆ เช่น Profile Service หรือ Rating Service ซึ่งไม่ได้มีโหลดเพิ่มขึ้นในสัดส่วนที่เท่ากัน
- ***Fault Isolation***: หากระบบ "รีวิวอาหาร" เกิดล่มขึ้นมา ลูกค้าจะยังคงสามารถ "สั่งอาหาร" และ "จ่ายเงิน" ได้ตามปกติ เพราะบริการถูกแยกออกจากกันอย่างเด็ดขาด ระบบหลักไม่พังไปทั้งยูนิตเหมือนแบบ Monolithic
- ***Independent Deployment***: Grab หรือ LINE MAN มีทีมพัฒนาหลายร้อยคน ทีมที่ดูแลระบบ "โปรโมชั่น" สามารถอัปเดตโค้ดและ Deploy ฟีเจอร์ใหม่ได้ทุกวันโดยไม่ต้องรอคิวจากทีมที่ดูแลระบบ "แผนที่" ทำให้ธุรกิจตอบสนองต่อตลาดได้รวดเร็ว
    
---
### 4. **Quality Attributes Mapping (1 หน้า)**

#### Architecture นี้รองรับ QAs อย่างไร?
| Quality Attribute | วิธีการที่สถาปัตยกรรมรองรับ |
|-------------|-------|
| Scalability | เนื่องจากเป็น Microservices เราสามารถทำ Horizontal Scaling เฉพาะจุดได้ เช่น เพิ่มจำนวน Instance ของ Order Service ในช่วง Peak-time|
| Availability | การมี Fault Isolation หาก Rating Service ล่ม จะไม่กระทบต่อการสั่งอาหาร และการใช้ Load Balancer ช่วยกระจาย Traffic ไปยังเครื่องที่ยังใช้งานได้ ทำให้ระบบโดยรวมยังคงเปิดให้บริการได้|
| Performance | Event-Driven Architecture (EDA) ช่วยลด Latency ในมุมมองของผู้ใช้ โดยการประมวลผลแบบ Asynchronous |
| Maintainability | การแยก Codebase ออกตาม Service ทำให้ทีม SE สามารถทำความเข้าใจ Code ในส่วนที่ตัวเองรับผิดชอบได้ง่ายขึ้น ลดความเสี่ยงในการแก้จุดหนึ่งแล้วไปกระทบอีกจุดหนึ่ง |

#### Trade-offs
| Trade-off Pair | Pros | Cons | Mitigation Strategies |
|-------------|-------|-------|-------|
| Scalability vs. Complexity | สามารถขยายเฉพาะ Service ที่มีโหลดสูงได้ (เช่น ระบบสั่งอาหารช่วงเที่ยง) ช่วยประหยัดทรัพยากร | ระบบมีความซับซ้อนมหาศาลในการจัดการ ต้องดูแล Service จำนวนมากแทนที่จะเป็นก้อนเดียว | ใช้ระบบ Container Orchestration (Kubernetes) และทำ Automated CI/CD |
| Availability vs. Consistency | ระบบทำงานได้ต่อเนื่องแม้บางส่วนจะขัดข้อง | ข้อมูลอาจไม่เป็นปัจจุบันในทันที | ออกแบบ UI ให้รองรับสถานะ "Pending" และใช้เทคนิค Optimistic UI เพื่อให้ผู้ใช้รู้สึกลื่นไหล |
| Decoupling vs. Latency | Service ทำงานอิสระต่อกัน (Event-Driven) ทำให้ระบบยืดหยุ่นและเพิ่มฟีเจอร์ใหม่ได้ง่าย | เกิดความหน่วงจากการสื่อสารผ่านเครือข่าย เพราะต้องส่งข้อมูลข้าม Service | ใช้ gRPC สำหรับการสื่อสารที่ต้องการความเร็วสูง และใช้ Caching (Redis) เพื่อลดการดึงข้อมูลซ้ำ |
| Fault Isolation vs. Debugging Difficulty | หาก Service หนึ่งพังจะไม่ทำให้ระบบหลักล่มตามไปด้วย | เมื่อเกิดข้อผิดพลาด การหาจุดต้นตอ ทำได้ยากเพราะต้องไล่ดูจากหลาย Service | ติดตั้งระบบ Distributed Tracing |

### 5. Lessons Learned (1 หน้า)
#### สิ่งที่เรียนรู้จากการวิเคราะห์?
```
1. GrabFood / LINE MAN ทำให้เข้าใจชัดเจนว่าไม่มีสถาปัตยกรรมใดที่ดีที่สุดในทุกด้าน การเลือก Microservices หรือ Event-Driven ไม่ใช่เพราะมันทันสมัยที่สุด
แต่เพราะมันตอบโจทย์ธุรกิจที่ต้องการความยืดหยุ่น (Scalability) และความพร้อมใช้งานสูง (Availability) โดยยอมแลกกับความซับซ้อนที่เพิ่มขึ้น

2. หัวใจสำคัญของการเป็น Software Engineer ไม่ใช่แค่การเขียนโค้ดให้ทำงานได้ แต่คือการตัดสินใจเลือกโครงสร้างที่เหมาะสมที่สุด (Appropriate Design)
การเข้าใจเรื่อง CAP Theorem และความสมดุลระหว่างความเร็วในการพัฒนาและความเร็วของระบบ เป็นทักษะที่จำเป็นอย่างยิ่ง

3. ในระบบระดับ Enterprise มักจะใช้ Architectural Styles หลายแบบผสมผสานกัน (เช่น มีทั้ง Layered ภายในแต่ละ Service และเชื่อมต่อกันด้วย
Event-Driven ในภาพรวม) เพื่อแก้ปัญหาที่แตกต่างกันในแต่ละส่วนของระบบ
 ```
#### นำไปใช้กับโปรเจกต์ของตัวเองได้อย่างไร?
```
1. การใช้แนวคิด Separation of Concerns
   การแยก Logic ของการคำนวณเงิน ออกจาก Logic ของการเข้าถึงฐานข้อมูล เพื่อให้โค้ดสะอาดและดูแลรักษาง่ายขึ้น
```

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


