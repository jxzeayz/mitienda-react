import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tab, Tabs, Table, Button, Form, Modal, Badge, Spinner } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { productosAPI, pedidosAPI, usuariosAPI } from '../services/api';

const PanelAdmin = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estado para productos
  const [productos, setProductos] = useState([]);
  const [loadingProductos, setLoadingProductos] = useState(true);

  // Estado para pedidos
  const [pedidos, setPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(true);

  // Estado para usuarios
  const [usuarios, setUsuarios] = useState([]);
  const [loadingUsuarios, setLoadingUsuarios] = useState(true);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarProductos();
    cargarPedidos();
    cargarUsuarios();
  }, []);

  const cargarProductos = async () => {
    try {
      setLoadingProductos(true);
      const data = await productosAPI.getAll();
      setProductos(data);
    } catch (error) {
      console.error('Error al cargar productos:', error);
    } finally {
      setLoadingProductos(false);
    }
  };

  const cargarPedidos = async () => {
    try {
      setLoadingPedidos(true);
      const data = await pedidosAPI.getAllAdmin();
      setPedidos(data);
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
    } finally {
      setLoadingPedidos(false);
    }
  };

  const cargarUsuarios = async () => {
    try {
      setLoadingUsuarios(true);
      const data = await usuariosAPI.getAll();
      setUsuarios(data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoadingUsuarios(false);
    }
  };

  // Estados para modales
  const [showProductoModal, setShowProductoModal] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formProducto, setFormProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria: 'tecnologia',
    stock: '',
    imagen: ''
  });

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

  const handleActualizarEstadoPedido = async (id, nuevoEstado) => {
    try {
      await pedidosAPI.updateEstado(id, nuevoEstado);
      cargarPedidos(); // Recargar pedidos
    } catch (error) {
      alert('Error al actualizar estado: ' + error.message);
    }
  };

  // Funciones para gestión de productos
  const handleAbrirModalProducto = (producto = null) => {
    if (producto) {
      setProductoEditando(producto);
      setFormProducto({
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        precio: producto.precio.toString(),
        categoria: producto.categoria,
        stock: producto.stock.toString(),
        imagen: producto.imagen
      });
    } else {
      setProductoEditando(null);
      setFormProducto({
        nombre: '',
        descripcion: '',
        precio: '',
        categoria: 'tecnologia',
        stock: '',
        imagen: ''
      });
    }
    setShowProductoModal(true);
  };

  const handleGuardarProducto = async () => {
    try {
      const productoData = {
        nombre: formProducto.nombre,
        descripcion: formProducto.descripcion,
        precio: parseFloat(formProducto.precio),
        categoria: formProducto.categoria,
        stock: parseInt(formProducto.stock),
        imagen: formProducto.imagen
      };

      if (productoEditando) {
        // Editar producto existente
        await productosAPI.update(productoEditando.id, productoData);
      } else {
        // Crear nuevo producto
        await productosAPI.create(productoData);
      }
      
      setShowProductoModal(false);
      cargarProductos(); // Recargar productos
    } catch (error) {
      alert('Error al guardar producto: ' + error.message);
    }
  };

  const handleEliminarProducto = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productosAPI.delete(id);
        cargarProductos(); // Recargar productos
      } catch (error) {
        alert('Error al eliminar producto: ' + error.message);
      }
    }
  };

  // Estadísticas
  const totalVentas = pedidos.reduce((sum, p) => sum + Number(p.total || 0), 0);
  const pedidosCompletados = pedidos.filter(p => p.estado === 'COMPLETADO').length;
  const totalUsuarios = usuarios.length;

  return (
    <Container fluid className="my-4">
      <Row className="mb-4">
        <Col>
          <h1>Panel de Administración</h1>
          <p className="text-muted">Bienvenido, {user?.nombre}</p>
        </Col>
      </Row>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* Dashboard */}
        <Tab eventKey="dashboard" title="📊 Dashboard">
          <Row className="g-4 mb-4">
            <Col md={3}>
              <Card className="text-center border-primary">
                <Card.Body>
                  <h3 className="text-primary">{formatearPrecio(totalVentas)}</h3>
                  <p className="text-muted mb-0">Total de Ventas</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-success">
                <Card.Body>
                  <h3 className="text-success">{pedidos.length}</h3>
                  <p className="text-muted mb-0">Total de Pedidos</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-warning">
                <Card.Body>
                  <h3 className="text-warning">{pedidosCompletados}</h3>
                  <p className="text-muted mb-0">Pedidos Completados</p>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
              <Card className="text-center border-info">
                <Card.Body>
                  <h3 className="text-info">{totalUsuarios}</h3>
                  <p className="text-muted mb-0">Usuarios Registrados</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Card>
            <Card.Header>
              <h5 className="mb-0">Resumen de Actividad Reciente</h5>
            </Card.Header>
            <Card.Body>
              <p className="text-muted">Aquí se mostrarían gráficos y estadísticas detalladas.</p>
            </Card.Body>
          </Card>
        </Tab>

        {/* Gestión de Productos */}
        <Tab eventKey="productos" title="📦 Productos">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Gestión de Productos</h5>
              <Button variant="success" onClick={() => handleAbrirModalProducto()}>
                + Nuevo Producto
              </Button>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingProductos ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <Spinner animation="border" size="sm" /> Cargando...
                      </td>
                    </tr>
                  ) : productos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No hay productos registrados
                      </td>
                    </tr>
                  ) : (
                    productos.map((producto) => (
                      <tr key={producto.id}>
                        <td>{producto.id}</td>
                        <td>{producto.nombre}</td>
                        <td><Badge bg="secondary">{producto.categoria}</Badge></td>
                        <td>{formatearPrecio(producto.precio)}</td>
                        <td>
                          <Badge bg={producto.stock > 5 ? 'success' : 'warning'}>
                            {producto.stock}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleAbrirModalProducto(producto)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleEliminarProducto(producto.id)}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Gestión de Pedidos */}
        <Tab eventKey="pedidos" title="🛒 Pedidos">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Gestión de Pedidos</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingPedidos ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <Spinner animation="border" size="sm" /> Cargando...
                      </td>
                    </tr>
                  ) : pedidos.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No hay pedidos registrados
                      </td>
                    </tr>
                  ) : (
                    pedidos.map((pedido) => (
                    <tr key={pedido.id}>
                      <td>#{pedido.id}</td>
                      <td>{pedido.usuario?.nombre || 'N/A'}</td>
                      <td>{new Date(pedido.fechaCreacion).toLocaleDateString('es-CL')}</td>
                      <td><strong>{formatearPrecio(pedido.total)}</strong></td>
                      <td>{getEstadoBadge(pedido.estado)}</td>
                      <td>
                        <Form.Select
                          size="sm"
                          value={pedido.estado}
                          onChange={(e) => handleActualizarEstadoPedido(pedido.id, e.target.value)}
                          style={{ width: '150px', display: 'inline-block' }}
                        >
                          <option value="PENDIENTE">Pendiente</option>
                          <option value="EN_PROCESO">En Proceso</option>
                          <option value="COMPLETADO">Completado</option>
                          <option value="CANCELADO">Cancelado</option>
                        </Form.Select>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* Gestión de Usuarios */}
        <Tab eventKey="usuarios" title="👥 Usuarios">
          <Card>
            <Card.Header>
              <h5 className="mb-0">Gestión de Usuarios</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Fecha Registro</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingUsuarios ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <Spinner animation="border" size="sm" /> Cargando...
                      </td>
                    </tr>
                  ) : usuarios.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted">
                        No hay usuarios registrados
                      </td>
                    </tr>
                  ) : (
                    usuarios.map((usuario) => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>{usuario.nombre}</td>
                      <td>{usuario.email}</td>
                      <td><Badge bg="primary">{usuario.rol?.toLowerCase() || 'N/A'}</Badge></td>
                      <td>{new Date(usuario.fechaRegistro).toLocaleDateString('es-CL')}</td>
                      <td>
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={async () => {
                            if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
                              try {
                                await usuariosAPI.delete(usuario.id);
                                cargarUsuarios();
                              } catch (error) {
                                alert('Error al eliminar usuario: ' + error.message);
                              }
                            }
                          }}
                        >
                          Eliminar
                        </Button>
                      </td>
                    </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Modal para Productos */}
      <Modal show={showProductoModal} onHide={() => setShowProductoModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {productoEditando ? 'Editar Producto' : 'Nuevo Producto'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={formProducto.nombre}
                onChange={(e) => setFormProducto({ ...formProducto, nombre: e.target.value })}
                placeholder="Nombre del producto"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formProducto.descripcion}
                onChange={(e) => setFormProducto({ ...formProducto, descripcion: e.target.value })}
                placeholder="Descripción del producto"
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Precio</Form.Label>
                  <Form.Control
                    type="number"
                    value={formProducto.precio}
                    onChange={(e) => setFormProducto({ ...formProducto, precio: e.target.value })}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Stock</Form.Label>
                  <Form.Control
                    type="number"
                    value={formProducto.stock}
                    onChange={(e) => setFormProducto({ ...formProducto, stock: e.target.value })}
                    placeholder="0"
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={formProducto.categoria}
                onChange={(e) => setFormProducto({ ...formProducto, categoria: e.target.value })}
              >
                <option value="tecnologia">Tecnología</option>
                <option value="accesorios">Accesorios</option>
                <option value="wearables">Wearables</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>URL de Imagen</Form.Label>
              <Form.Control
                type="text"
                value={formProducto.imagen}
                onChange={(e) => setFormProducto({ ...formProducto, imagen: e.target.value })}
                placeholder="ruta/imagen.webp"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProductoModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardarProducto}>
            {productoEditando ? 'Actualizar' : 'Crear'} Producto
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default PanelAdmin;


