import React from 'react';
import { Navbar, Nav, Container, Badge, NavDropdown } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCarrito } from './CarritoContext';
import { useAuth } from './AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { carrito } = useCarrito();
  const { user, isAuthenticated, isAdmin, isComprador, logout } = useAuth();

  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
            {isAdmin() && (
              <Nav.Link 
                as={Link} 
                to="/admin"
                active={location.pathname === '/admin'}
              >
                🔐 Panel Admin
              </Nav.Link>
            )}
          </Nav>
          
          <Nav>
            {isAuthenticated() ? (
              <>
                {isComprador() && (
                  <Nav.Link as={Link} to="/carrito" className="d-flex align-items-center">
                    🛍️ Carrito
                    {totalItems > 0 && (
                      <Badge bg="danger" className="ms-1">
                        {totalItems}
                      </Badge>
                    )}
                  </Nav.Link>
                )}
                <NavDropdown 
                  title={
                    <span>
                      👤 {user?.nombre || 'Usuario'}
                    </span>
                  } 
                  id="user-dropdown"
                >
                  {isComprador() && (
                    <NavDropdown.Item as={Link} to="/perfil">
                      Mi Perfil
                    </NavDropdown.Item>
                  )}
                  {isAdmin() && (
                    <NavDropdown.Item as={Link} to="/admin">
                      Panel Administración
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Cerrar Sesión
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/carrito" className="d-flex align-items-center">
                  🛍️ Carrito
                  {totalItems > 0 && (
                    <Badge bg="danger" className="ms-1">
                      {totalItems}
                    </Badge>
                  )}
                </Nav.Link>
                <Nav.Link as={Link} to="/login">
                  Iniciar Sesión
                </Nav.Link>
                <Nav.Link as={Link} to="/registro">
                  Registrarse
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;