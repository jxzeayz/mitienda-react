import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form } from 'react-bootstrap';
import { useCarrito } from './CarritoContext';

const Productos = () => {
  const { agregarAlCarrito } = useCarrito();
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [orden, setOrden] = useState('nombre');

  const productos = [
    {
      id: 1, nombre: 'Laptop Gaming', descripcion: 'Potente laptop para gamers', 
      precio: 910990, imagen: 'laptop1g.webp', categoria: 'tecnologia', stock: 10
    },
    {
      id: 2, nombre: 'Smartphone Pro', descripcion: 'Teléfono última generación', 
      precio: 710990, imagen: 'smartphone1.webp', categoria: 'tecnologia', stock: 15
    },
    {
      id: 3, nombre: 'Auriculares Bluetooth', descripcion: 'Sonido de alta calidad', 
      precio: 510990, imagen: 'auriculares1.webp', categoria: 'accesorios', stock: 20
    },
    {
      id: 4, nombre: 'Tablet Pro', descripcion: 'Tablet para trabajo y estudio', 
      precio: 609990, imagen: 'https://via.placeholder.com/300', categoria: 'tecnologia', stock: 8
    },
    {
      id: 5, nombre: 'Smartwatch', descripcion: 'Reloj inteligente multifunción', 
      precio: 299990, imagen: 'https://via.placeholder.com/300', categoria: 'wearables', stock: 12
    },
    {
      id: 6, nombre: 'Cámara Digital', descripcion: 'Captura momentos especiales', 
      precio: 799990, imagen: 'https://via.placeholder.com/300', categoria: 'tecnologia', stock: 5
    }
  ];

  const categorias = ['todos', ...new Set(productos.map(p => p.categoria))];

  const productosFiltradosYOrdenados = useMemo(() => {
    let filtered = productos;
    
    if (filtroCategoria !== 'todos') {
      filtered = filtered.filter(p => p.categoria === filtroCategoria);
    }
    
    return filtered.sort((a, b) => {
      switch (orden) {
        case 'precio-asc':
          return a.precio - b.precio;
        case 'precio-desc':
          return b.precio - a.precio;
        case 'nombre':
        default:
          return a.nombre.localeCompare(b.nombre);
      }
    });
  }, [filtroCategoria, orden]);

  const formatearPrecio = (precio) => `$${precio.toLocaleString('es-CL')}`;

  return (
    <Container>
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Nuestros Productos</h1>
        </Col>
      </Row>

      {/* Filtros y Ordenamiento */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Filtrar por categoría:</Form.Label>
            <Form.Select 
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'todos' ? 'Todas las categorías' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Ordenar por:</Form.Label>
            <Form.Select 
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="nombre">Nombre (A-Z)</option>
              <option value="precio-asc">Precio (Menor a Mayor)</option>
              <option value="precio-desc">Precio (Mayor a Menor)</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Grid de Productos */}
      <Row>
        {productosFiltradosYOrdenados.map(producto => (
          <Col key={producto.id} lg={4} md={6} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={producto.imagen}
                style={{ height: '250px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{producto.nombre}</Card.Title>
                <Card.Text className="flex-grow-1">
                  {producto.descripcion}
                </Card.Text>
                <div className="mt-auto">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <Badge bg="secondary">{producto.categoria}</Badge>
                    <Badge bg={producto.stock > 5 ? 'success' : 'warning'}>
                      Stock: {producto.stock}
                    </Badge>
                  </div>
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="text-primary mb-0">
                      {formatearPrecio(producto.precio)}
                    </h5>
                  </div>
                  <Button 
                    variant="primary" 
                    onClick={() => agregarAlCarrito(producto)}
                    className="w-100"
                    disabled={producto.stock === 0}
                  >
                    {producto.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Productos;