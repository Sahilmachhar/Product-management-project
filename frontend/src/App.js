import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    id: '',
    name: '',
    price: '',
    category: '',
  });
  const [errorMessage, setErrorMessage] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };

  const addProduct = async () => {
    setErrorMessage('');
    const { id, name, price, category } = newProduct;

    if (!id || !name || !price || !category) {
      setErrorMessage('All fields are required');
      return;
    }

    if (id <= 0 || id.length > 10) {
      setErrorMessage('ID must be a positive number and no more than 10 characters long');
      return;
    }

    if (!isNaN(name) || name.length < 2 || name.length > 20) {
      setErrorMessage('Name must be a valid string between 2 and 20 characters long');
      return;
    }

    if (price <= 0 || price.toString().length > 10) {
      setErrorMessage('Enter a valid price for the product.');
      return;
    }

    if (!isNaN(category) || category.length < 2 || category.length > 20) {
      setErrorMessage('Category must be a valid string between 2 and 20 characters long');
      return;
    }

    try {
      await axios.post('http://localhost:5000/products', newProduct);
      fetchProducts();
      setNewProduct({ id: '', name: '', price: '', category: '' });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage('Error adding product. Please try again.');
      }
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h1>Product List</h1>
      <div className="add-product">
        <input
          type="text"
          placeholder="ID"
          value={newProduct.id}
          maxLength={10}
          onChange={(e) =>
            setNewProduct({ ...newProduct, id: e.target.value.replace(/[^0-9]/g, '') })
          }
        />
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          maxLength={20}
          onChange={(e) =>
            setNewProduct({ ...newProduct, name: e.target.value.replace(/[^a-zA-Z\s]/g, '') })
          }
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 10 && value >= 0) {
              setNewProduct({ ...newProduct, price: value });
            }
          }}
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          maxLength={20}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value.replace(/[^a-zA-Z\s]/g, '') })
          }
        />
        <button onClick={addProduct}>Add Product</button>
      </div>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {products.length === 0 ? (
        <p className="no-products-message">There is no any product you have to add products.</p>
      ) : (
        <div className="product-table">
          <div className="product-header">
            <div>ID</div>
            <div>Name</div>
            <div>Price</div>
            <div>Category</div>
            <div>Actions</div>
          </div>
          {products.map((product) => (
            <div className="product-row" key={product.id}>
              <div>{product.id}</div>
              <div>{product.name}</div>
              <div>${product.price}</div>
              <div>{product.category}</div>
              <div>
                <button onClick={() => deleteProduct(product.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;
