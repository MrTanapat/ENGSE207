## Checkpoint 1: App ทำงานได้บนเครื่อง

### ทดสอบ health check

- `curl http://localhost:3000/health`

  ![health](/img_part_a/health_check.png)

### ดู notes ทั้งหมด

- `curl http://localhost:3000/api/notes`

  ![note](/img_part_a/note.png)

# เพิ่ม note ใหม่

- ```bash
    curl -X POST http://localhost:3000/api/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Note ใหม่","content":"สร้างจาก curl"}'
  ```

![post](/img_part_a/new_notes.png)

# ดู notes อีกครั้ง (ควรมี 3 notes)

- `curl http://localhost:3000/api/notes`

  ![check_notes](/img_part_a/check_notes.png)

# ลบ note

- `curl -X DELETE http://localhost:3000/api/notes/1`

  ![Delete](/img_part_a/delete.png)
