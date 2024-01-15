const express = require('express');
const router = express.Router();
const Inventory = require('../models/inventory');
const{check, validationResult }=require('express-validator')
const auth =require('../middleware/auth');
const inventory = require('../models/inventory');
/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get all products in the inventory.
 *     responses:
 *       200:
 *         description: Successful response. Returns an array of products.
 *       500:
 *         description: Internal server error.
 */
router.get('/', auth, async (req, res) => {
  try {
    const inventories = await Inventory.find({user:req.user.id}).sort({
      created_at:-1,
    });
    res.json(inventories);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/inventory:
 *   post:
 *     summary: Create a new product in the inventory.
 *     requestBody:
 *       description: JSON object representing the new product.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       201:
 *         description: Product created successfully.
 *       400:
 *         description: Bad request. Check the request payload.
 */
router.post('/',
[auth,
[
  check('productName','please enter your product name').exists(),
  check('buyingPrice','please enter your product buying price').exists(),
  check('sellingPrice','please enter your product selling price').exists(),
  check('supplierName','please enter your product supplier name').exists(),
  check('category','please enter your product category').exists(),
]
],

async (req, res) => {

    const result = validationResult(req.body);
    if(!result.isEmpty()) {
      return res.status(400).json({
        errors: result,
      });
    }

    const { productName, buyingPrice, sellingPrice, supplierName,category } = req.body;

    try {
      const inventory = new Inventory({
        productName, 
        buyingPrice,
        sellingPrice,
        supplierName,
        category,
        user: req.user.id,
      });

      await inventory.save();
    res.status(201).json(inventory);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/inventory/{id}:
 *   put:
 *     summary: Update a product in the inventory by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to be updated.
 *         schema:
 *           type: string
 *     requestBody:
 *       description: JSON object representing the updated product.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Inventory'
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *       404:
 *         description: Product not found.
 *       400:
 *         description: Bad request. Check the request payload.
 */
router.put('/:id',auth, async (req, res) => {
  const id = req.params.id;

  const { productName, buyingPrice, sellingPrice, supplierName,category } = req.body;

  try {
    const inventoryFields = {};

    if (productName) inventoryFields.productName = productName;
    if (buyingPrice) inventoryFields.buyingPrice = buyingPrice;
    if (sellingPrice) inventoryFields.sellingPrice = sellingPrice;
    if (supplierName) inventoryFields.supplierName = supplierName;
    if (category) inventoryFields.category = category;

    let inventory = await Inventory.findById(id);

    if (!inventory) {
      return res.status(400).json({
        msg: 'inventory not found',
      });
    }

    if (req.user.id.toString() !== inventory.user.toString()) {
      res.status(401).json({
        msg: 'Invalid authorization',
      });
    }

    inventory = await Inventory.findByIdAndUpdate(
      id,
      { $set: inventoryFields },
      { new: true }
    );

    return res.json(inventory);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      msg: 'Server error',
    });
  }
});
/**
 * @swagger
 * /api/inventory/{id}:
 *   delete:
 *     summary: Delete a product in the inventory by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the product to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully.
 *       404:
 *         description: Product not found.
 *       400:
 *         description: Bad request.
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedInventory = await Inventory.findByIdAndDelete(id);
    if (!deletedInventory) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;