// src/data/repositories/productRepository.js
const db = require('../database/connection');

class ProductRepository {
    
    async findAll(category = null) {
        return new Promise((resolve, reject) => {
            let sql = 'SELECT * FROM products';
            let params = [];
            
            if (category) {
                sql += ' WHERE category = ?';
                params.push(category);
            }
            
            db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
    
    async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }
    
    async create(productData) {
        const { name, price, stock, category } = productData;
        
        return new Promise((resolve, reject) => {
            const sql = 'INSERT INTO products (name, price, stock, category) VALUES (?, ?, ?, ?)';
            
            db.run(sql, [name, price, stock || 0, category], function(err) {
                if (err) {
                    reject(err);
                } else {
                    db.get('SELECT * FROM products WHERE id = ?', [this.lastID], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }
    
    async update(id, productData) {
        const { name, price, stock, category } = productData;
        
        return new Promise((resolve, reject) => {
            const sql = 'UPDATE products SET name = ?, price = ?, stock = ?, category = ? WHERE id = ?';
            
            db.run(sql, [name, price, stock, category, id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    db.get('SELECT * FROM products WHERE id = ?', [id], (err, row) => {
                        if (err) reject(err);
                        else resolve(row);
                    });
                }
            });
        });
    }
    
    async delete(id) {
        return new Promise((resolve, reject) => {
            db.run('DELETE FROM products WHERE id = ?', [id], function(err) {
                if (err) reject(err);
                else resolve({ deleted: this.changes > 0 });
            });
        });
    }
}

module.exports = new ProductRepository();