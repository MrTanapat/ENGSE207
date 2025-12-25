// public/app.js
// Task Board - Frontend Logic (Custom CSS Version)

const API_BASE = API_CONFIG.BASE_URL;
const API = {
    TASKS: `${API_BASE}${API_CONFIG.ENDPOINTS.TASKS}`,
    STATS: `${API_BASE}${API_CONFIG.ENDPOINTS.STATS}`
};

// ========================================
// PART 1: STATE MANAGEMENT
// ========================================

let allTasks = [];
let currentFilter = 'ALL';


// ========================================
// PART 2: DOM ELEMENTS
// ========================================

const addTaskForm = document.getElementById('addTaskForm');
const statusFilter = document.getElementById('statusFilter');
const loadingOverlay = document.getElementById('loadingOverlay');

// Task list containers
const todoTasks = document.getElementById('todoTasks');
const progressTasks = document.getElementById('progressTasks');
const doneTasks = document.getElementById('doneTasks');

// Task counters
const todoCount = document.getElementById('todoCount');
const progressCount = document.getElementById('progressCount');
const doneCount = document.getElementById('doneCount');


// ========================================
// PART 3: API FUNCTIONS - FETCH TASKS
// ========================================

async function fetchTasks() {
    showLoading();
    try {
        const res = await fetch(API.TASKS);
        if (!res.ok) throw new Error('โหลด tasks ล้มเหลว');
        const { data } = await res.json();
        renderTasks(data);
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('โหลด tasks จาก server ล้มเหลว');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 4: API FUNCTIONS - CREATE TASK
// ========================================

async function createTask(taskData) {
    showLoading();
    try {
        const response = await fetch('/api/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const data = await response.json();
        
        // Add new task to the beginning
        allTasks.unshift(data.task); 
        
        renderTasks();
        addTaskForm.reset(); 
        
        alert('✅ Task created successfully!');
    } catch (error) {
        console.error('Error creating task:', error);
        alert('❌ Failed to create task. Please try again.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 5: API FUNCTIONS - UPDATE STATUS
// ========================================

async function updateTaskStatus(taskId, newStatus) {
    showLoading();
    try {
        const response = await fetch(`/api/tasks/${taskId}/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        if (!response.ok) throw new Error('Failed to update status');

        // Update local state
        const taskIndex = allTasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            allTasks[taskIndex].status = newStatus;
            renderTasks();
        }

    } catch (error) {
        console.error('Error updating status:', error);
        alert('❌ Failed to update status.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 6: API FUNCTIONS - DELETE TASK
// ========================================

async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) {
        return;
    }
    
    showLoading();
    try {
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete task');

        // Remove from local state
        allTasks = allTasks.filter(t => t.id !== taskId);
        renderTasks();

    } catch (error) {
        console.error('Error deleting task:', error);
        alert('❌ Failed to delete task.');
    } finally {
        hideLoading();
    }
}


// ========================================
// PART 7: RENDER FUNCTIONS - MAIN RENDER
// ========================================

function renderTasks() {
    // 1. Clear all lists
    todoTasks.innerHTML = '';
    progressTasks.innerHTML = '';
    doneTasks.innerHTML = '';
    
    // 2. Filter tasks
    let filteredTasks = allTasks;
    if (currentFilter !== 'ALL') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }
    
    // 3. Separate tasks by status
    const todo = filteredTasks.filter(t => t.status === 'TODO');
    const progress = filteredTasks.filter(t => t.status === 'IN_PROGRESS');
    const done = filteredTasks.filter(t => t.status === 'DONE');
    
    // 4. Update counters
    todoCount.textContent = todo.length;
    progressCount.textContent = progress.length;
    doneCount.textContent = done.length;
    
    // 5. Render each column
    renderTaskList(todo, todoTasks, 'TODO');
    renderTaskList(progress, progressTasks, 'IN_PROGRESS');
    renderTaskList(done, doneTasks, 'DONE');
}


// ========================================
// PART 8: RENDER FUNCTIONS - RENDER LIST
// ========================================

function renderTaskList(tasks, container, currentStatus) {
    if (tasks.length === 0) {
        // ใช้ class .empty-state จาก style.css
        container.innerHTML = `
            <div class="empty-state">
                <p>No tasks yet</p>
            </div>`;
        return;
    }
    
    tasks.forEach(task => {
        const card = createTaskCard(task, currentStatus);
        container.appendChild(card);
    });
}


// ========================================
// PART 9: RENDER FUNCTIONS - CREATE CARD (Custom CSS)
// ========================================

function createTaskCard(task, currentStatus) {
    const card = document.createElement('div');
    card.className = 'task-card'; // ใช้ class จาก style.css โดยตรง
    
    // กำหนดสี Priority ตาม CSS (.priority-high, .priority-medium, .priority-low)
    const priorityClass = `priority-${task.priority.toLowerCase()}`;
    
    card.innerHTML = `
        <div class="task-header">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <span class="priority-badge ${priorityClass}">${task.priority}</span>
        </div>
        
        ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
        
        <div class="task-meta">
            Created: ${formatDate(task.created_at)}
        </div>
        
        <div class="task-actions">
            ${createStatusButtons(task.id, currentStatus)}
            <button class="btn btn-sm btn-danger" onclick="deleteTask(${task.id})">
                🗑️ Delete
            </button>
        </div>
    `;
    
    return card;
}


// ========================================
// PART 10: HELPER FUNCTIONS - STATUS BUTTONS (Custom CSS)
// ========================================

function createStatusButtons(taskId, currentStatus) {
    let buttons = '';
    
    // ใช้ปุ่มตาม style.css (btn-primary, btn-warning, btn-success)
    if (currentStatus === 'TODO') {
        buttons += `
            <button class="btn btn-sm btn-primary" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">
                Start →
            </button>
        `;
    } else if (currentStatus === 'IN_PROGRESS') {
        buttons += `
            <button class="btn btn-sm btn-warning" onclick="updateTaskStatus(${taskId}, 'TODO')">
                ← To Do
            </button>
            <button class="btn btn-sm btn-success" onclick="updateTaskStatus(${taskId}, 'DONE')">
                Done →
            </button>
        `;
    } else if (currentStatus === 'DONE') {
        buttons += `
            <button class="btn btn-sm btn-warning" onclick="updateTaskStatus(${taskId}, 'IN_PROGRESS')">
                ← Re-open
            </button>
        `;
    }
    
    return buttons;
}


// ========================================
// PART 11: UTILITY FUNCTIONS
// ========================================

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function showLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    if (loadingOverlay) loadingOverlay.style.display = 'none';
}


// ========================================
// PART 12: EVENT LISTENERS
// ========================================

if (addTaskForm) {
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const title = document.getElementById('taskTitle').value.trim();
        const description = document.getElementById('taskDescription').value.trim();
        const priority = document.getElementById('taskPriority').value;
        
        if (!title) {
            alert('Please enter a task title');
            return;
        }
        
        createTask({ title, description, priority });
    });
}

if (statusFilter) {
    statusFilter.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        renderTasks();
    });
}


// ========================================
// PART 13: INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Task Board App Initialized');
    console.log('📊 Architecture: Monolithic (Custom CSS)');
    fetchTasks();
});


// ========================================
// PART 14: GLOBAL FUNCTION EXPOSURE
// ========================================

window.updateTaskStatus = updateTaskStatus;
window.deleteTask = deleteTask;