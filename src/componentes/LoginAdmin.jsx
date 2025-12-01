import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginAdmin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    const result = await loginAdmin(email, password);
    setLoading(false);

    if (result.success) {
      setTimeout(() => {
        navigate('/admin', { replace: true });
      }, 100);
    } else {
      setErrorMessage(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px', borderTop: '4px solid #ffc107' }}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #ffc107, #fd7e14)',
                    borderRadius: '50%',
                    color: 'white',
                    fontSize: '2rem'
                  }}
                >
                  🔐
                </div>
                <h2 className="fw-bold mb-2">Panel Administrativo</h2>
                <p className="text-muted">Acceso exclusivo para administradores</p>
              </div>

              {errorMessage && (
                <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email de Administrador</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="admin@tienda.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    isInvalid={!!errors.email}
                    size="lg"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Tu contraseña de administrador"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    isInvalid={!!errors.password}
                    size="lg"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid mb-4">
                  <Button 
                    variant="warning" 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                    className="fw-semibold"
                  >
                    {loading ? 'Verificando...' : 'Acceder al Panel'}
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="mb-0">
                  <Link to="/login" className="text-decoration-none">¿Eres comprador? Inicia sesión aquí</Link>
                </p>
              </div>

              <hr className="my-4" />

              <div className="bg-warning bg-opacity-10 p-3 rounded">
                <small className="text-muted">
                  <strong>Credenciales de prueba:</strong><br />
                  Email: admin@test.com<br />
                  Contraseña: admin123
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginAdmin;
