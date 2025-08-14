const Product = require('../models/productModel')
const productController = {
      getTest: (req, res) => {
            res.send('hi');
      },

      // ดึงสินค้าทั้งหมด
      getAllProducts: (req, res) => {
            Product.getAll((err, results) => {
                  if (err) return res.status(500).json({ error: err.message });
                  res.json(results);
            });
      },

      // ดึงสินค้าตาม ID
      getProductById: (req, res) => {
            Product.getById(req.params.id, (err, result) => {
                  if (err) return res.status(500).json({ error: err.message });
                  res.json(result || {}); // คืน object ว่างถ้าไม่พบ
            });
      },

      // ค้นหาสินค้าตาม keyword
      searchProducts: (req, res) => {
            const { keyword } = req.params;
            Product.searchByKeyword(keyword, (err, results) => {
                  if (err) return res.status(500).json({ error: err.message });
                  res.json(results);
            });
      },

      // สร้างสินค้าใหม่
      createProduct: (req, res) => {
            const { name, price } = req.body;

            if (!name || price == null) {
                  return res.status(400).json({ error: 'name and price are required' });
            }

            Product.create({ name, price }, (err, result) => {
                  if (err) return res.status(500).json({ error: err.message });

                  res.status(201).json({
                        message: 'Product created',
                        product: result
                  });
            });
      },

      // อัปเดตสินค้า
      updateProduct: (req, res) => {
            const { id } = req.params;
            Product.update(id, req.body, (err) => {
                  if (err) return res.status(500).json({ error: err.message });
                  res.json({ message: 'Product updated' });
            });
      },

      // ลบสินค้าแบบ soft delete
      softDeleteProduct: (req, res) => {
            const { id } = req.params;
            Product.softDelete(id, (err) => {
                  if (err) return res.status(500).json({ error: err.message });
                  res.json({ message: 'Product soft-deleted' });
            });
      },
      restoreProduct: (req, res) => {
            const { id } = req.params;
            Product.restore(id, (err) => { // เรียกใช้ restore จาก Product Model
                  if (err) return res.status(500).json({ error: err.message });
                  res.json({ message: 'Product restored' });
            });
      },

      getProductsView: (req, res) => {
            Product.getAll((err, results) => { // เรียกใช้ Model
                  if (err) return res.status(500).json({ error: err.message });

                  // ส่งผลลัพธ์ไปยัง view 'products.ejs'
                  res.render('products', { products: results });
            });
      }

};

module.exports = productController;
