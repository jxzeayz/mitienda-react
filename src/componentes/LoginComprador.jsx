import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { useAuth } from './AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginComprador = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { loginComprador } = useAuth();
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
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
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
    const result = await loginComprador(email, password);
    setLoading(false);

    if (result.success) {
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 100);
    } else {
      setErrorMessage(result.error || 'Error al iniciar sesión');
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={5}>
          <Card className="shadow-lg border-0" style={{ borderRadius: '15px' }}>
            <Card.Body className="p-5">
              <div className="text-center mb-4">
                <div 
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #0d6efd, #4a90d9)',
                    borderRadius: '50%',
                    color: 'white',
                    fontSize: '2rem'
                  }}
                >
                  👤
                </div>
                <h2 className="fw-bold mb-2">Iniciar Sesión</h2>
                <p className="text-muted">Accede a tu cuenta de comprador</p>
              </div>

              {errorMessage && (
                <Alert variant="danger" dismissible onClose={() => setErrorMessage('')}>
                  {errorMessage}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="tu@email.com"
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
                    placeholder="Tu contraseña"
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
                    variant="primary" 
                    type="submit" 
                    disabled={loading}
                    size="lg"
                  >
                    {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </div>
              </Form>

              <div className="text-center">
                <p className="mb-2">
                  ¿No tienes cuenta?{' '}
                  <Link to="/registro" className="fw-semibold text-decoration-none">Regístrate aquí</Link>
                </p>
                <p className="mb-0">
                  <Link to="/login-admin" className="text-secondary text-decoration-none">¿Eres administrador?</Link>
                </p>
              </div>

              <hr className="my-4" />

              <div className="bg-light p-3 rounded">
                <small className="text-muted">
                  <strong>Credenciales de prueba:</strong><br />
                  Email: cliente@test.com<br />
                  Contraseña: 123456
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginComprador;
