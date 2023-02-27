
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

// Connection to MongoDB database using Mongoose
mongoose.connect('mongodb://localhost/products');

// Product model created using Mongoose schema
const productSchema = new mongoose.Schema({
  productId: String,
  productName: String,
  qtyPerUnit: Number,
  unitPrice: Number,
  unitInStock: Number,
  discontinued: Boolean,
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }
});

// Category model created using Mongoose schema
const categorySchema = new mongoose.Schema({
  categoryId: String,
  categoryName: String,
});

const Product = mongoose.model('Product', productSchema);
const Category = mongoose.model('Category', categorySchema);

// Middleware to parse JSON
app.use(bodyParser.json());

// Product routes
// Create a new product
app.post('/products', async (req, res) => {
  const { productId, productName, qtyPerUnit, unitPrice, unitInStock, discontinued, categoryId } = req.body;

  try {
    // Find the category by categoryId
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).send('Invalid category ID');
    }

    // Create a new product using the Product model and category data
    const product = new Product({
      productId,
      productName,
      qtyPerUnit,
      unitPrice,
      unitInStock,
      discontinued,
      categoryId: category._id,
    });

    // Save the new product to the database
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Retrieve all products
app.get('/products', async (req, res) => {
  try {
    // Find all products in the database using the Product model and populate the category data
    const products = await Product.find().populate('categoryId');
    res.send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Retrieve a product by ID
app.get('/products/:productId', async (req, res) => {
  const { productId } = req.params;

  try {
    // Find a product by ID in the database using the Product model and populate the category data
    const product = await Product.findById(productId).populate('categoryId');
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Update a product by ID
app.put('/products/:productId', async (req, res) => {
  const { productId } = req.params;
  const { productName, qtyPerUnit, unitPrice, unitInStock, discontinued, categoryId } = req.body;

  try {
    // Find a product by ID in the database using the Product model and populate the category data
    const product = await Product.findById(productId).populate('categoryId');
    if (!product) {
      return res.status(404).send('Product not found');
    }

    // Find the category by categoryId
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(400).send('Invalid category ID');
    }

    // Update the product with the new data
    product.productName = productName;
    product.qtyPerUnit = qtyPerUnit;
    product.unitPrice = unitPrice;
    product.unitInStock = unitInStock;
    product.discontinued = discontinued;
    product.categoryId = category._id;
    await product.save();

    res.send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Delete a category by categoryId
app.delete('/categories/:categoryId', async (req, res) => {
const { categoryId } = req.params;

try {
// Find a category by categoryId and delete it using the Category model
const category = await Category.findOneAndDelete({ categoryId });
res.send(category);
} catch (error) {
res.status(500).send(error);
}
});

// Retrieve a product by ID
app.get('/products/:productId', async (req, res) => {
const { productId } = req.params;

try {
// Find a product by ID using the Product model
const product = await Product.findOne({ productId });

if (!product) {
res.status(404).send({ error: 'Product not found' });
} else {
// If the product has a categoryId, populate the category field with the corresponding category object
if (product.categoryId) {
await product.populate('category').execPopulate();
}

res.send(product);
}
} catch (error) {
res.status(500).send(error);
}
});

// Retrieve all products with their corresponding category objects
app.get('/productsWithCategories', async (req, res) => {
try {
// Find all products in the database using the Product model and populate the category field with the corresponding category object
const products = await Product.find().populate('category');
res.send(products);
} catch (error) {
res.status(500).send(error);
}
});

// Retrieve all categories
app.get('/categories', async (req, res) => {
  try {
    // Find all categories in the database using the Category model
    const categories = await Category.find();
    res.send(categories);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Retrieve a category by ID
app.get('/categories/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Find a category by ID in the database using the Category model
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).send('Category not found');
    }
    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Create a new category
app.post('/categories', async (req, res) => {
  const { categoryId, categoryName } = req.body;

  try {
    // Check if a category with the same categoryId already exists
    const existingCategory = await Category.findOne({ categoryId });
    if (existingCategory) {
      return res.status(400).send('Category ID already exists');
    }

    // Create a new category using the Category model
    const category = new Category({
      categoryId,
      categoryName,
    });

    // Save the new category to the database
    await category.save();
    res.send(category);
  } catch (error) {
    res.status(500).send(error);
  }
});


// Start the server
app.listen(3000, () => {
console.log('Server is started on port 3000');
});