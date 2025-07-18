import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BooksPage from './pages/BooksPage';
import MyAccount from './pages/MyAccount';
import MyBooks from './pages/MyBooks';
import Community from './pages/Community'; // Create as needed
// src/index.js or src/App.js
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/myaccount" element={<MyAccount />} />
        <Route path="/mybooks" element={<MyBooks />} />
        <Route path="/community" element={<Community />} />
        
      </Routes>
    </Router>
  );
}

export default App;




