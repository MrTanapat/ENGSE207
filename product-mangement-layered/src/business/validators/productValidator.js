// src/business/validators/productValidator.js
class ProductValidator {
    
    validateProductData(data) {
        const { name, price, category } = data;
        
        if (!name || !price || !category) {
            throw new Error('Name, price, and category are required');
        }
        
        return true;
    }
    
    validatePrice(price) {
        if (price <= 0) {
            throw new Error('Price must be greater than 0');
        }
        
        if (price > 1000000) {
            throw new Error('Price cannot exceed 1,000,000');
        }
        
        return true;
    }
    
    validateStock(stock) {
        if (stock < 0) {
            throw new Error('Stock cannot be negative');
        }
        
        return true;
    }
    
    validateCategory(category) {
        const validCategories = ['Electronics', 'Clothing', 'Food', 'Books', 'Toys'];
        
        if (!validCategories.includes(category)) {
            throw new Error(`Invalid category. Must be one of: ${validCategories.join(', ')}`);
        }
        
        return true;
    }
    
    validateId(id) {
        const numId = parseInt(id);
        
        if (isNaN(numId) || numId <= 0) {
            throw new Error('Invalid product ID');
        }
        
        return numId;
    }
}

module.exports = new ProductValidator();