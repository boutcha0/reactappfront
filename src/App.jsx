import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Shared/Navbar';
import Contact from './pages/Contact';
import About from './pages/About';
import OrdersAdmin from './components/OrdersAdmin';
import { AuthProvider } from '../src/components/Shared/AuthContext';
import ProtectedRoute from './ProtectedRoute'; // Make sure to import ProtectedRoute

const App = () => {
  const [cart, setCart] = useState([]);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Function to add a product to the cart
  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((item) => item.id === product.id);
      if (productExists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
  };

  const deleteFromCart = (productId) => {
    setCart((prevCart) => {
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  return (
    <AuthProvider>
      <Router>
        <Navbar
          cart={cart}
          deleteFromCart={deleteFromCart}
          onContactClick={() => setIsContactOpen(true)}
        />
        <Contact
          isOpen={isContactOpen}
          onClose={() => setIsContactOpen(false)}
        />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Home addToCart={addToCart} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute>
                <OrdersAdmin />
              </ProtectedRoute>
            } 
          />
          {/* Redirect to login if no route matches */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;