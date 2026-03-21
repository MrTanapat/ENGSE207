// src/presentation/controllers/productController.js
const productService = require('../../business/services/productService');

class ProductController {
    
    async getAllProducts(req, res, next) {
        try {
            const { category } = req.query;
            const result = await productService.getAllProducts(category);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
    
    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await productService.getProductById(id);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }
    
    async createProduct(req, res, next) {
        try {
            const productData = req.body;
            const product = await productService.createProduct(productData);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }
    
    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const productData = req.body;
            const product = await productService.updateProduct(id, productData);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }
    
    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            const result = await productService.deleteProduct(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new ProductController();