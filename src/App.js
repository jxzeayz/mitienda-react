import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './componentes/Header.jsx';
import Footer from './componentes/Footer.jsx';
import Home from './componentes/Home.jsx';
import Productos from './componentes/Productos.jsx';
import Ofertas from './componentes/Ofertas.jsx';
import Contacto from './componentes/Contacto.jsx';
import Carrito from './componentes/Carrito.jsx';
import { CarritoProvider } from './componentes/CarritoContext.jsx';
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