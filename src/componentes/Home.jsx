import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCarrito } from './CarritoContext';

const Home = () => {
  const { agregarAlCarrito } = useCarrito();

  const productosDestacados = [
    {
      id: 1,
      nombre: 'Laptop Gaming',
      descripcion: 'Potente laptop para gamers con RTX 4060',
      precio: 910990,
      imagen: 'laptop1g.webp',
      categoria: 'tecnologia'
    },
    {
      id: 2,
      nombre: 'Smartphone Pro',
      descripcion: 'Teléfono de última generación 5G',
      precio: 710990,
      imagen: 'smartphone1.webp',
      categoria: 'tecnologia'
    },
    {
      id: 3,
      nombre: 'Auriculares Bluetooth',
      descripcion: 'Sonido de alta calidad con cancelación de ruido',
      precio: 510990,
      imagen: 'auriculares1.webp',
      categoria: 'accesorios'
    }
  ];

  const formatearPrecio = (precio) => {
    return `$${precio.toLocaleString('es-CL')}`;
  };

  const handleComprar = (producto) => {
    agregarAlCarrito(producto);
  };

  return (
    <Container>
      {/* Hero Section */}
      <Row className="text-center py-5 mb-4 bg-primary text-white rounded">
        <Col>
          <h1 className="display-4 fw-bold">Bienvenido a MiTienda</h1>
          <p className="lead">Encuentra los mejores productos al mejor precio</p>
          <Button as={Link} to="/productos" variant="warning" size="lg">
            Ver Todos los Productos
          </Button>
        </Col>
      </Row>

      {/* Productos Destacados */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Productos Destacados</h2>
          <Row>
            {productosDestacados.map(producto => (
              <Col key={producto.id} md={4} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img 
                    variant="top" 
                    src={producto.imagen}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title>{producto.nombre}</Card.Title>
                    <Card.Text className="flex-grow-1">
                      {producto.descripcion}
                    </Card.Text>
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <Badge bg="secondary">{producto.categoria}</Badge>
                        <h5 className="text-primary mb-0">
                          {formatearPrecio(producto.precio)}
                        </h5>
                      </div>
                      <Button 
                        variant="success" 
                        onClick={() => handleComprar(producto)}
                        className="w-100"
                      >
                        Agregar al Carrito
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Video Presentación */}
      <Row className="mb-5">
        <Col>
          <h2 className="text-center mb-4">Conoce Nuestra Tienda</h2>
          <div className="ratio ratio-16x9">
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Video de presentación"
              allowFullScreen
            ></iframe>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;