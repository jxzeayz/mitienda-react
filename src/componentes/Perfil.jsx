import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Table, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import { pedidoService } from '../services/api';

const Perfil = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('perfil');

  // Estado para pedidos reales del backend
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);
  const [errorPedidos, setErrorPedidos] = useState(null);

  // Cargar pedidos reales del backend
  useEffect(() => {
    const cargarPedidos = async () => {
      try {
        setLoadingPedidos(true);
        const data = await pedidoService.getAll();
        setPedidos(data);
        setErrorPedidos(null);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
        setErrorPedidos('Error al cargar el historial de pedidos');
      } finally {
        setLoadingPedidos(false);
      }
    };

    if (user) {
      cargarPedidos();
    }
  }, [user]);

  const formatearPrecio = (precio) => {
    if (typeof precio === 'number') {
      return `$${precio.toLocaleString('es-CL')}`;
    }
    return `$${Number(precio).toLocaleString('es-CL')}`;
  };

  const getEstadoBadge = (estado) => {
    const estados = {
      'COMPLETADO': { variant: 'success', texto: 'Completado' },
      'EN_PROCESO': { variant: 'warning', texto: 'En Proceso' },
      'PENDIENTE': { variant: 'info', texto: 'Pendiente' },
      'CANCELADO': { variant: 'danger', texto: 'Cancelado' }
    };
    const estadoUpper = estado?.toUpperCase() || 'PENDIENTE';
    const estadoInfo = estados[estadoUpper] || estados['PENDIENTE'];
    return <Badge bg={estadoInfo.variant}>{estadoInfo.texto}</Badge>;
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <h1 className="mb-4">Mi Perfil</h1>
        </Col>
      </Row>

      <Row>
        <Col>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            {/* Tab de Información Personal */}
            <Tab eventKey="perfil" title="📋 Información Personal">
              <Card className="shadow-sm">
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h5 className="mb-3">Datos de Usuario</h5>
                      <div className="mb-3">
                        <strong>Nombre:</strong>
                        <p className="text-muted">{user.nombre}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Email:</strong>
                        <p className="text-muted">{user.email}</p>
                      </div>
                      <div className="mb-3">
                        <strong>Rol:</strong>
                        <p>
                          <Badge bg="primary">{user.rol}</Badge>
                        </p>
                      </div>
                      <Button variant="outline-primary" className="me-2">
                        Editar Perfil
                      </Button>
                      <Button variant="outline-secondary" className="me-2">
                        Cambiar Contraseña
                      </Button>
                    </Col>
                    <Col md={6}>
                      <div className="text-center">
                        <div
                          className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center"
                          style={{ width: '150px', height: '150px', fontSize: '3rem' }}
                        >
                          {user.nombre.charAt(0).toUpperCase()}
                        </div>
                        <h5 className="mt-3">{user.nombre}</h5>
                        <p className="text-muted">{user.email}</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>

            {/* Tab de Historial de Pedidos */}
            <Tab eventKey="pedidos" title="📦 Historial de Pedidos">
              <Card className="shadow-sm">
                <Card.Body>
                  {loadingPedidos ? (
                    <div className="text-center py-4">
                      <Spinner animation="border" role="status">
                        <span className="visually-hidden">Cargando pedidos...</span>
                      </Spinner>
                      <p className="mt-2 text-muted">Cargando historial de pedidos...</p>
                    </div>
                  ) : errorPedidos ? (
                    <Alert variant="danger" className="text-center">
                      <p className="mb-0">{errorPedidos}</p>
                    </Alert>
                  ) : pedidos.length === 0 ? (
                    <Alert variant="info" className="text-center">
                      <p className="mb-0">No tienes pedidos aún. ¡Realiza tu primera compra!</p>
                    </Alert>
                  ) : (
                    <Table responsive hover>
                      <thead>
                        <tr>
                          <th>ID Pedido</th>
                          <th>Fecha</th>
                          <th>Productos</th>
                          <th>Total</th>
                          <th>Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {pedidos.map((pedido) => (
                          <tr key={pedido.id}>
                            <td>#{pedido.id}</td>
                            <td>{new Date(pedido.fechaCreacion).toLocaleDateString('es-CL')}</td>
                            <td>
                              <ul className="list-unstyled mb-0">
                                {pedido.items?.map((item, idx) => (
                                  <li key={idx} className="small">
                                    {item.producto?.nombre || 'Producto'} x{item.cantidad}
                                  </li>
                                ))}
                              </ul>
                            </td>
                            <td>
                              <strong>{formatearPrecio(pedido.total)}</strong>
                            </td>
                            <td>{getEstadoBadge(pedido.estado)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Card.Body>
              </Card>
            </Tab>

            {/* Tab de Configuración */}
            <Tab eventKey="configuracion" title="⚙️ Configuración">
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-4">Configuración de Cuenta</h5>
                  
                  <div className="mb-4">
                    <h6>Notificaciones</h6>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="notifEmail"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="notifEmail">
                        Recibir notificaciones por email
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="notifPedidos"
                        defaultChecked
                      />
                      <label className="form-check-label" htmlFor="notifPedidos">
                        Notificaciones de pedidos
                      </label>
                    </div>
                  </div>

                  <hr />

                  <div className="mb-4">
                    <h6>Zona Peligrosa</h6>
                    <Button variant="danger" onClick={handleLogout}>
                      Cerrar Sesión
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
  );
};

export default Perfil;




