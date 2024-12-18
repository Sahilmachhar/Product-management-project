const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory product array
const products = [
  { id: '1', name: 'Laptop', price: 1000, category: 'Electronics' },
  { id: '2', name: 'Shoes', price: 50, category: 'Fashion' },
  { id: '3', name: 'Watch', price: 200, category: 'Accessories' },
];

// Default route for root
app.get('/', (req, res) => {
  res.send('Welcome to the Product API');
});

// GET all products
app.get('/products', (req, res) => {
  if (products.length === 0) {
    return res.status(200).json({ message: 'No products available' });
  }
  res.json(products);
});

// POST a new product
app.post('/products', (req, res) => {
  const { id, name, price, category } = req.body;

  if (!id || !name || !price || !category) {
    return res.status(400).send('All fields are required');
  }

  // ID validation
  if (id <= 0 || id.toString().length > 10) {
    return res.status(400).send('ID must be a positive number and no more than 10 characters long');
  }

  // Name validation
  if (!isNaN(name) || name.length < 2 || name.length > 20) {
    return res.status(400).send('Name must be a valid string between 2 and 50 characters long');
  }

  // Price validation
  if (price <= 0 || price.toString().length > 10) {
    return res.status(400).send('Enter a valid price (positive number, no more than 10 characters)');
  }

  // Category validation
  if (!isNaN(category) || category.length < 2 || category.length > 20) {
    return res.status(400).send('Category must be a valid string between 2 and 30 characters long');
  }

  const productExists = products.find((product) => product.id === id);
  if (productExists) {
    return res.status(400).send(`Product with ID ${id} already exists`);
  }

  const newProduct = { id, name, price, category };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// DELETE a product by ID
app.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((product) => product.id === id);

  if (index === -1) {
    return res.status(404).send(`Product with ID ${id} not found`);
  }

  products.splice(index, 1);
  res.send(`Product with ID ${id} deleted`);
});

// DELETE all products
app.delete('/products', (req, res) => {
  products.length = 0;  // This clears the array without causing an error
  res.send('All products have been deleted');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
