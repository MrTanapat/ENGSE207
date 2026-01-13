// src/business/services/productService.js
const productRepository = require('../../data/repositories/productRepository');
const productValidator = require('../validators/productValidator');

class ProductService {
    
    async getAllProducts(category = null) {
        // Validate filter
        if (category) {
            productValidator.validateCategory(category);
        }
        
        // Get data
        const products = await productRepository.findAll(category);
        
        // Business logic: calculate total value
        const totalValue = products.reduce((sum, p) => {
            return sum + (p.price * p.stock);
        }, 0);
        
        // Return formatted data
        return {
            products: products,
            statistics: {
                count: products.length,
                totalValue: parseFloat(totalValue.toFixed(2))
            }
        };
    }
    
    async getProductById(id) {
        const validId = productValidator.validateId(id);
        const product = await productRepository.findById(validId);
        
        if (!product) {
            throw new Error('Product not found');
        }
        
        return product;
    }
    
    async createProduct(productData) {
        // Validate
        productValidator.validateProductData(productData);
        productValidator.validatePrice(productData.price);
        productValidator.validateCategory(productData.category);
        
        if (productData.stock !== undefined) {
            productValidator.validateStock(productData.stock);
        }
        
        // Create
        const product = await productRepository.create(productData);
        return product;
    }
    
    async updateProduct(id, productData) {
        const validId = productValidator.validateId(id);
        
        // Check exists
        const existingProduct = await productRepository.findById(validId);
        if (!existingProduct) {
            throw new Error('Product not found');
        }
        
        // Validate
        productValidator.validateProductData(productData);
        productValidator.validatePrice(productData.price);
        productValidator.validateCategory(productData.category);
        productValidator.validateStock(productData.stock);
        
        // Update
        const updatedProduct = await productRepository.update(validId, productData);
        return updatedProduct;
    }
    
    async deleteProduct(id) {
        const validId = productValidator.validateId(id);
        
        // Check exists
        const product = await productRepository.findById(validId);
        if (!product) {
            throw new Error('Product not found');
        }
        
        // Business rule: cannot delete if stock > 0
        if (product.stock > 0) {
            throw new Error('Cannot delete product with stock > 0. Please reduce stock first.');
        }
        
        // Delete
        await productRepository.delete(validId);
        return { message: 'Product deleted successfully' };
    }
}

module.exports = new ProductService();