// server.js
// Task Board - Monolithic Application
// ENGSE207 Software Architecture - Week 3 Lab

// ========================================
// PART 1: IMPORT DEPENDENCIES
// ========================================

// TODO 1.1: Import express module
const express = require('express');

// TODO 1.2: Import sqlite3 module with verbose mode
const sqlite3 = require('sqlite3').verbose();

// TODO 1.3: Import path module (for serving static files)
const path = require('path');


// ========================================
// PART 2: INITIALIZE APPLICATION
// ========================================

// TODO 2.1: Create express application instance
const app = express();

// TODO 2.2: Define PORT number (use 3000)
const PORT = 3000;


// ========================================
// PART 3: MIDDLEWARE CONFIGURATION
// ========================================

// TODO 3.1: Add middleware to parse JSON request bodies
app.use(express.json());


// TODO 3.2: Add middleware to serve static files from 'public' folder
app.use(express.static('public'));


// ========================================
// PART 4: DATABASE CONNECTION
// ========================================

// TODO 4.1: Create database connection to './database/tasks.db'
const db = new sqlite3.Database('./database/tasks.db', (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
    }
});


// ========================================
// PART 5: API ROUTES - GET ALL TASKS
// ========================================

// TODO 5.1: Create GET /api/tasks endpoint
app.get('/api/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error fetching tasks:', err.message);
            res.status(500).json({ error: 'Failed to fetch tasks' });
        } else {
            res.json({ tasks: rows });
        }
    });
});


// ========================================
// PART 6: API ROUTES - GET SINGLE TASK
// ========================================

// TODO 6.1: Create GET /api/tasks/:id endpoint
app.get('/api/tasks/:id', (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE id = ?';
    const params = [req.params.id];

    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ task: row });
    });
});


// ========================================
// PART 7: API ROUTES - CREATE TASK
// ========================================

// TODO 7.1: Create POST /api/tasks endpoint
app.post('/api/tasks', (req, res) => {
    const { title, description, priority } = req.body;
    
    // Validation: Check if title exists
    if (!title || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required' });
    }
    
    // SQL to insert new task
    // Note: status defaults to 'TODO' in schema usually, or we explicitly set it here
    const sql = `
        INSERT INTO tasks (title, description, status, priority) 
        VALUES (?, ?, 'TODO', ?)
    `;
    
    // Default priority to MEDIUM if not provided
    const taskPriority = priority || 'MEDIUM';
    const params = [title, description || '', taskPriority];

    // Note: Use function(err) instead of arrow function to access this.lastID
    db.run(sql, params, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            message: 'Task created successfully',
            id: this.lastID,
            task: {
                id: this.lastID,
                title,
                description,
                status: 'TODO',
                priority: taskPriority
            }
        });
    });
});


// ========================================
// PART 8: API ROUTES - UPDATE TASK
// ========================================

// TODO 8.1: Create PUT /api/tasks/:id endpoint
app.put('/api/tasks/:id', (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority } = req.body;
    
    // Build dynamic SQL
    let updates = [];
    let values = [];
    
    if (title !== undefined) {
        updates.push('title = ?');
        values.push(title);
    }
    if (description !== undefined) {
        updates.push('description = ?');
        values.push(description);
    }
    if (status !== undefined) {
        updates.push('status = ?');
        values.push(status);
    }
    if (priority !== undefined) {
        updates.push('priority = ?');
        values.push(priority);
    }

    if (updates.length === 0) {
        return res.status(400).json({ error: 'No fields to update' });
    }

    // Add ID to values array for the WHERE clause
    values.push(id);

    const sql = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    
    db.run(sql, values, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ 
            message: 'Task updated', 
            changes: this.changes 
        });
    });
});


// ========================================
// PART 9: API ROUTES - DELETE TASK
// ========================================

// TODO 9.1: Create DELETE /api/tasks/:id endpoint
app.delete('/api/tasks/:id', (req, res) => {
    const sql = 'DELETE FROM tasks WHERE id = ?';
    
    db.run(sql, req.params.id, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ message: 'Task deleted successfully' });
    });
});


// ========================================
// PART 10: API ROUTES - UPDATE STATUS
// ========================================

// TODO 10.1: Create PATCH /api/tasks/:id/status endpoint
app.patch('/api/tasks/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['TODO', 'IN_PROGRESS', 'DONE'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ 
            error: 'Invalid status. Must be TODO, IN_PROGRESS, or DONE' 
        });
    }
    
    const sql = 'UPDATE tasks SET status = ? WHERE id = ?';
    
    db.run(sql, [status, id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Task not found' });
            return;
        }
        res.json({ 
            message: 'Status updated', 
            status: status 
        });
    });
});


// ========================================
// PART 11: SERVE FRONTEND
// ========================================

// TODO 11.1: Create route to serve index.html for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


// ========================================
// PART 12: START SERVER
// ========================================

// TODO 12.1: Start the server and listen on the PORT
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📝 Task Board application started`);
    console.log(`📊 Architecture: Monolithic (All-in-one)`);
});


// ========================================
// PART 13: GRACEFUL SHUTDOWN (BONUS)
// ========================================

// TODO 13.1: Handle SIGINT for graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('✅ Database connection closed');
        }
        process.exit(0);
    });
});