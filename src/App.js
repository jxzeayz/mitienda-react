import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Componentes de layout
import Header from './componentes/Header';
import Footer from './componentes/Footer';

// Páginas públicas
import Home from './componentes/Home';
import Productos from './componentes/Productos';
import Ofertas from './componentes/Ofertas';
import Contacto from './componentes/Contacto';
import Carrito from './componentes/Carrito';

// Páginas de autenticación
import LoginComprador from './componentes/LoginComprador';
import LoginAdmin from './componentes/LoginAdmin';
import Registro from './componentes/Registro';

// Páginas protegidas
import Perfil from './componentes/Perfil';
import PanelAdmin from './componentes/PanelAdmin';
import ProtectedRoute from './componentes/ProtectedRoute';

// Contextos
import { CarritoProvider } from './componentes/CarritoContext';
import { AuthProvider } from './componentes/AuthContext';

// Estilos
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CarritoProvider>
        <div className="App d-flex flex-column min-vh-100">
          <Header />
          
          <main className="flex-grow-1">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Home />} />
              <Route path="/productos" element={<Productos />} />
              <Route path="/ofertas" element={<Ofertas />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/carrito" element={<Carrito />} />
              
              {/* Rutas de autenticación */}
              <Route path="/login" element={<LoginComprador />} />
              <Route path="/login-admin" element={<LoginAdmin />} />
              <Route path="/registro" element={<Registro />} />
              
              {/* Rutas protegidas para compradores */}
              <Route 
                path="/perfil" 
                element={
                  <ProtectedRoute requireAuth={true} requireComprador={true}>
                    <Perfil />
                  </ProtectedRoute>
                } 
              />
              
              {/* Rutas protegidas para administradores */}
              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute requireAuth={true} requireAdmin={true}>
                    <PanelAdmin />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </CarritoProvider>
    </AuthProvider>
  );
}

export default App;
