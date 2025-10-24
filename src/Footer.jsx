import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="info-footer">
        <div className="columna">
          <h3>MiTienda</h3>
          <p>Tu tienda de confianza para todos tus productos favoritos.</p>
        </div>
        <div className="columna">
          <h3>Enlaces rápidos</h3>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/productos">Productos</Link></li>
            <li><Link to="/ofertas">Ofertas</Link></li>
            <li><Link to="/contacto">Contacto</Link></li>
          </ul>
        </div>
        <div className="columna">
          <h3>Contacto</h3>
          <p>Email: arma.calderon@duocuc.cl</p>
          <p>Teléfono: +56985341498</p>
          <p>Dirección: Rigoberto Jara, Quilicura Santiago</p>
        </div>
      </div>
      <div className="derechos">
        <p>&copy; 2025 MiTienda. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;