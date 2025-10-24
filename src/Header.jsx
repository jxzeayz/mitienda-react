import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import { useCarrito } from './CarritoContext';

const Header = () => {
  const location = useLocation();
  const { carrito } = useCarrito();

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          🛒 MiTienda
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link 
              as={Link} 
              to="/" 
              active={location.pathname === '/'}
            >
              Inicio
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/productos"
              active={location.pathname === '/productos'}
            >
              Productos
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/ofertas"
              active={location.pathname === '/ofertas'}
            >
              Ofertas
            </Nav.Link>
            <Nav.Link 
              as={Link} 
              to="/contacto"
              active={location.pathname === '/contacto'}
            >
              Contacto
            </Nav.Link>
          </Nav>
          
          <Nav>
            <Nav.Link as={Link} to="/carrito" className="d-flex align-items-center">
              🛍️ Carrito
              {totalItems > 0 && (
                <Badge bg="danger" className="ms-1">
                  {totalItems}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;