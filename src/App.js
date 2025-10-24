import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './Home.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
