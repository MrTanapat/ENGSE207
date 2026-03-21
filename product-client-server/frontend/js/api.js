// frontend/js/api.js

// 🚨 สำคัญมาก: เปลี่ยน localhost เป็น IP ของ Ubuntu VM ของคุณ
const BASE_URL = 'http://192.168.1.6:3000/api/products'; 

async function getAllProducts() {
    try {
        const response = await fetch(BASE_URL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.products; // ส่งข้อมูลสินค้ากลับไปแสดงผล
    } catch (error) {
        console.error('Fetch Error:', error);
        alert('ไม่สามารถเชื่อมต่อกับ Server ได้');
    }
}

async function createProduct(product) {
    const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
    });
    return response.json();
}