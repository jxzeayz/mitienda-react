import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Home from './Home.jsx';
import Productos from './Productos.jsx';
import Ofertas from './Ofertas.jsx';
import Contacto from './Contacto.jsx';
import Carrito from './Carrito.jsx';
import { CarritoProvider } from './CarritoContext.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <CarritoProvider>
      <div className="App d-flex flex-column min-vh-100">
        <Header />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/productos" element={<Productos />} />
            <Route path="/ofertas" element={<Ofertas />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/carrito" element={<Carrito />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </CarritoProvider>
  );
}

export default App;