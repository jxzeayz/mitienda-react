import React, { useState } from 'react';
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Button, 
  Badge, 
  Alert,
  Form 
} from 'react-bootstrap';
import { useCarrito } from './CarritoContext';

const Ofertas = () => {
  const { agregarAlCarrito } = useCarrito();
  const [email, setEmail] = useState('');
  const [suscrito, setSuscrito] = useState(false);

  const ofertasEspeciales = [
    {
      id: 101,
      nombre: 'Laptop Gaming Pro',
      descripcion: 'Laptop gaming con RTX 4060, 16GB RAM, SSD 1TB',
      precio: 819891,
      precioOriginal: 910990,
      descuento: 10,
      imagen: 'laptop1g.webp',
      categoria: 'tecnologia',
      stock: 5,
      fechaFin: '2024-12-31'
    },
    {
      id: 102,
      nombre: 'Smartphone Ultra',
      descripcion: 'Smartphone 5G con cámara 108MP y 256GB almacenamiento',
      precio: 568792,
      precioOriginal: 710990,
      descuento: 20,
      imagen: 'smartphone1.webp',
      categoria: 'tecnologia',
      stock: 8,
      fechaFin: '2024-12-25'
    },
    {
      id: 103,
      nombre: 'Auriculares Premium',
      descripcion: 'Auriculares Bluetooth con cancelación de ruido activa',
      precio: 357693,
      precioOriginal: 510990,
      descuento: 30,
      imagen: 'auriculares1.webp',
      categoria: 'accesorios',
      stock: 12,
      fechaFin: '2024-12-20'
    }
  ];

  const formatearPrecio = (precio) => `$${precio.toLocaleString('es-CL')}`;

  const calcularDiasRestantes = (fechaFin) => {
    const hoy = new Date();
    const fin = new Date(fechaFin);
    const diffTime = fin - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const handleSuscribir = (e) => {
    e.preventDefault();
    if (email) {
      setSuscrito(true);
      setEmail('');
      setTimeout(() => setSuscrito(false), 5000);
    }
  };

  return (
    <Container>
      {/* Header de Ofertas */}
      <Row className="mb-4">
        <Col>
          <div className="text-center py-4 bg-danger text-white rounded">
            <h1 className="display-5 fw-bold">🔥 Ofertas Especiales</h1>
            <p className="lead mb-0">Aprovecha nuestros descuentos por tiempo limitado</p>
          </div>
        </Col>
      </Row>

      {suscrito && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success" className="text-center">
              ✅ ¡Gracias por suscribirte! Te enviaremos las mejores ofertas a: {email}
            </Alert>
          </Col>
        </Row>
      )}

      {/* Grid de Ofertas */}
      <Row className="mb-5">
        {ofertasEspeciales.map(producto => {
          const diasRestantes = calcularDiasRestantes(producto.fechaFin);
          
          return (
            <Col key={producto.id} lg={4} md={6} className="mb-4">
              <Card className="h-100 shadow-lg border-danger">
                <div className="position-relative">
                  <Card.Img 
                    variant="top" 
                    src={producto.imagen}
                    style={{ height: '250px', objectFit: 'cover' }}
                  />
                  <Badge 
                    bg="danger" 
                    className="position-absolute top-0 start-0 m-2 fs-6"
                  >
                    -{producto.descuento}%
                  </Badge>
                  {diasRestantes > 0 && (
                    <Badge 
                      bg="warning" 
                      text="dark"
                      className="position-absolute top-0 end-0 m-2"
                    >
                      ⏳ {diasRestantes}d
                    </Badge>
                  )}
                </div>
                
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="text-danger">{producto.nombre}</Card.Title>
                  <Card.Text className="flex-grow-1">
                    {producto.descripcion}
                  </Card.Text>
                  
                  <div className="mt-auto">
                    {/* Precios */}
                    <div className="mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <span className="text-muted text-decoration-line-through">
                          {formatearPrecio(producto.precioOriginal)}
                        </span>
                        <h4 className="text-success mb-0">
                          {formatearPrecio(producto.precio)}
                        </h4>
                      </div>
                      <small className="text-muted">
                        Ahorras: {formatearPrecio(producto.precioOriginal - producto.precio)}
                      </small>
                    </div>

                    {/* Stock y Categoría */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <Badge bg="secondary">{producto.categoria}</Badge>
                      <Badge bg={producto.stock > 3 ? 'success' : 'warning'}>
                        {producto.stock > 3 ? 'En Stock' : 'Últimas unidades'}
                      </Badge>
                    </div>

                    {/* Botón Comprar */}
                    <Button 
                      variant="danger" 
                      size="lg"
                      onClick={() => agregarAlCarrito({
                        ...producto,
                        precio: producto.precio
                      })}
                      className="w-100 fw-bold"
                      disabled={producto.stock === 0}
                    >
                      {producto.stock === 0 ? 'AGOTADO' : 'COMPRAR OFERTA'}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Newsletter */}
      <Row className="mb-5">
        <Col>
          <Card className="bg-gradient text-white" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <Card.Body className="text-center p-5">
              <h2 className="mb-3">🚀 ¡No te pierdas nuestras ofertas!</h2>
              <p className="lead mb-4">
                Suscríbete a nuestro newsletter y recibe las mejores ofertas directamente en tu email.
                <br />
                <strong>Ofertas exclusivas para suscriptores + 5% de descuento adicional</strong>
              </p>
              
              <Form onSubmit={handleSuscribir} className="row g-3 justify-content-center">
                <Col md={6} lg={4}>
                  <Form.Group>
                    <Form.Control
                      type="email"
                      placeholder="tu.email@ejemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      size="lg"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md="auto">
                  <Button 
                    type="submit" 
                    variant="warning" 
                    size="lg"
                    className="fw-bold"
                  >
                    Suscribirse y Ahorrar
                  </Button>
                </Col>
              </Form>
              
              <small className="mt-3 d-block opacity-75">
                📧 Solo emails con ofertas relevantes. Puedes darte de baja cuando quieras.
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Ofertas;