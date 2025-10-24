import React from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Badge } from 'react-bootstrap';
import { useCarrito } from './CarritoContext';
import { Link } from 'react-router-dom';

const Carrito = () => {
  const { 
    carrito, 
    total, 
    eliminarDelCarrito, 
    actualizarCantidad, 
    limpiarCarrito 
  } = useCarrito();

  const formatearPrecio = (precio) => `$${precio.toLocaleString('es-CL')}`;

  const handleCantidadChange = (id, nuevaCantidad) => {
    const cantidad = parseInt(nuevaCantidad);
    if (cantidad >= 0) {
      actualizarCantidad(id, cantidad);
    }
  };

  const calcularSubtotal = (precio, cantidad) => precio * cantidad;

  const handleFinalizarCompra = () => {
    if (carrito.length > 0) {
      alert('¡Compra finalizada con éxito! Serás redirigido al proceso de pago.');
      limpiarCarrito();
    }
  };

  if (carrito.length === 0) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Card className="shadow-sm">
              <Card.Body className="py-5">
                <div className="mb-4">
                  <h1 className="display-1">🛒</h1>
                </div>
                <h2 className="text-muted mb-3">Tu carrito está vacío</h2>
                <p className="text-muted mb-4">
                  Parece que aún no has agregado productos a tu carrito de compras.
                </p>
                <Button as={Link} to="/productos" variant="primary" size="lg">
                  Descubrir Productos
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-4">
      <Row>
        <Col>
          <h1 className="mb-4">🛒 Mi Carrito de Compras</h1>
        </Col>
      </Row>

      <Row className="g-4">
        {/* Lista de Productos */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  Productos en el carrito ({carrito.length})
                </h5>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={limpiarCarrito}
                >
                  Vaciar Carrito
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th width="50%">Producto</th>
                    <th className="text-center">Precio</th>
                    <th className="text-center">Cantidad</th>
                    <th className="text-center">Subtotal</th>
                    <th width="80"></th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map(item => (
                    <tr key={item.id} className="align-middle">
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.imagen} 
                            alt={item.nombre}
                            style={{ 
                              width: '60px', 
                              height: '60px', 
                              objectFit: 'cover',
                              borderRadius: '8px'
                            }}
                            className="me-3"
                          />
                          <div>
                            <h6 className="mb-1">{item.nombre}</h6>
                            <Badge bg="secondary" className="fs-3">
                              {item.categoria}
                            </Badge>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        <strong>{formatearPrecio(item.precio)}</strong>
                      </td>
                      <td className="text-center">
                        <div className="d-flex align-items-center justify-content-center">
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleCantidadChange(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                          >
                            -
                          </Button>
                          <span className="mx-3 fw-bold">{item.cantidad}</span>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            onClick={() => handleCantidadChange(item.id, item.cantidad + 1)}
                          >
                            +
                          </Button>
                        </div>
                      </td>
                      <td className="text-center">
                        <strong className="text-primary">
                          {formatearPrecio(calcularSubtotal(item.precio, item.cantidad))}
                        </strong>
                      </td>
                      <td className="text-center">
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => eliminarDelCarrito(item.id)}
                          title="Eliminar producto"
                        >
                          🗑️
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Continuar Comprando */}
          <div className="mt-3">
            <Button as={Link} to="/productos" variant="outline-primary">
              ← Continuar Comprando
            </Button>
          </div>
        </Col>

        {/* Resumen del Pedido */}
        <Col lg={4}>
          <Card className="shadow-sm sticky-top" style={{ top: '100px' }}>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Resumen del Pedido</h5>
            </Card.Header>
            <Card.Body>
              {/* Subtotal */}
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>{formatearPrecio(total)}</span>
              </div>

              {/* Envío */}
              <div className="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span className={total > 50000 ? 'text-success' : ''}>
                  {total > 50000 ? 'GRATIS' : formatearPrecio(5000)}
                </span>
              </div>

              {/* Descuento */}
              <div className="d-flex justify-content-between mb-2">
                <span>Descuento:</span>
                <span className="text-success">-{formatearPrecio(0)}</span>
              </div>

              <hr />

              {/* Total */}
              <div className="d-flex justify-content-between mb-3">
                <strong>Total:</strong>
                <strong className="fs-4 text-primary">
                  {formatearPrecio(total > 50000 ? total : total + 5000)}
                </strong>
              </div>

              {total <= 50000 && (
                <Alert variant="info" className="small">
                  🚚 Agrega {formatearPrecio(50000 - total)} más para envío GRATIS
                </Alert>
              )}

              {/* Botón Finalizar Compra */}
              <div className="d-grid gap-2">
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={handleFinalizarCompra}
                  className="fw-bold"
                >
                  🛍️ Finalizar Compra
                </Button>
              </div>

              {/* Métodos de Pago */}
              <div className="mt-3 text-center">
                <small className="text-muted d-block mb-2">
                  Métodos de pago aceptados:
                </small>
                <div className="d-flex justify-content-center gap-2">
                  <span>💳</span>
                  <span>📱</span>
                  <span>🏦</span>
                  <span>🔗</span>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Garantías */}
          <Card className="mt-3 border-0 bg-light">
            <Card.Body>
              <h6 className="mb-3">✅ Garantías incluídas:</h6>
              <ul className="list-unstyled small mb-0">
                <li className="mb-1">🛡️ Garantía de 30 días</li>
                <li className="mb-1">🚚 Envío seguro y rastreable</li>
                <li className="mb-1">💬 Soporte 24/7</li>
                <li className="mb-1">↩️ Devolución fácil</li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Carrito;