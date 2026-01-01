1. **VM IP Address**
   ```bash
   hostname -I
   ```
  <p align="center">
    <img src="Screenshots /VM IP Address.png" align"center">
  </p>
  
2. **PM2 Status**
   ```bash
   pm2 status
   ```
  <p align="center">
    <img src="Screenshots /PM2 Status.png" align"center">
  </p>

3. **API Response** (จาก local browser)
   ```
   http://VM_IP:3000/api/tasks
   ```
  <p align="center">
    <img src="Screenshots /API Response.png" align"center">
  </p>

4. **Frontend ทำงาน** (แสดงการสร้าง task)
  <p align="center">
    <img src="Screenshots /Frontend_ทำงาน.png" align"center">
  </p>

5. **PM2 Logs**
   ```bash
   pm2 logs --lines 20
   ```
  <p align="center">
    <img src="Screenshots /PM2 Logs.png" align"center">
  </p>

6. **Network Ping Test**
   ```bash
   ping VM_IP
   ```
  <p align="center">
    <img src="Screenshots /Network Ping Test.png" align"center">
  </p>
