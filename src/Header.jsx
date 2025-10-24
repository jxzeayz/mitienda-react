import React from 'react';
import { NavLink } from 'react-router-dom';

const Header = () => {
  return (
    <header>
      <div className="logo">
        <h1>MiTienda</h1>
      </div>
      <nav>
        <ul>
          <li>
            <NavLink 
              to="/" 
              className={({ isActive }) => isActive ? 'activo' : ''}
            >
              Inicio
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/productos"
              className={({ isActive }) => isActive ? 'activo' : ''}
            >
              Productos
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/ofertas"
              className={({ isActive }) => isActive ? 'activo' : ''}
            >
              Ofertas
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contacto"
              className={({ isActive }) => isActive ? 'activo' : ''}
            >
              Contacto
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;