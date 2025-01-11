import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Shared/Navbar';
import Contact from './pages/Contact';  
import About from './pages/About';
import CheckoutPage from './components/CheckoutPage';
import CustomerOrders from './components/CustomerOrders';
import OrderDetails from './components/OrderDetails';
import { AuthProvider } from './components/Shared/AuthContext';
import ProtectedRoute from './ProtectedRoute';

const App = () => {
  const [cart, setCart] = useState([]);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const productExists = prevCart.find((item) => item.id === product.id);
      if (productExists) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const deleteFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
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
          <Route path="/" element={<Home addToCart={addToCart} />} />
          <Route path="/about" element={<About />} />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <CustomerOrders customerId={localStorage.getItem('userId')} />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/:orderId" 
            element={
              <ProtectedRoute>
                <OrderDetails />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;