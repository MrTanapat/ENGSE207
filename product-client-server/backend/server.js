// server.js
const express = require('express');
const cors = require('cors');
const productRoutes = require('../frontend/src/presentation/routes/productRoutes');
const errorHandler = require('../frontend/src/presentation/middlewares/errorHandler');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/products', productRoutes);
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`
╔══════════════════════════════════════════════╗
║  Product Management System (Layered)         ║
║  Server running on http://localhost:${PORT}  ║
║  API: http://localhost:${PORT}/api/products  ║
╚══════════════════════════════════════════════╝
    `);
    console.log(`🚀 Backend API running on http://<YOUR_VM_IP>:${PORT}`);
});