import React, { useState, useMemo, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Spinner, Alert } from 'react-bootstrap';
import { useCarrito } from './CarritoContext';
import { productosAPI } from '../services/api';

const Productos = () => {
  const { agregarAlCarrito } = useCarrito();
  const [filtroCategoria, setFiltroCategoria] = useState('todos');
  const [orden, setOrden] = useState('nombre');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const data = await productosAPI.getAll();
        setProductos(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar productos: ' + err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    cargarProductos();
  }, []);

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
  }, [filtroCategoria, orden, productos]);

  const formatearPrecio = (precio) => {
    if (typeof precio === 'number') {
      return `$${precio.toLocaleString('es-CL')}`;
    }
    return `$${Number(precio).toLocaleString('es-CL')}`;
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

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
                    onClick={() => agregarAlCarrito({
                      ...producto,
                      precio: Number(producto.precio)
                    })}
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