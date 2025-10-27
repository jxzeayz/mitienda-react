import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Accordion } from 'react-bootstrap';

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
    tipoConsulta: 'general'
  });
  const [enviado, setEnviado] = useState(false);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      nuevosErrores.nombre = 'El nombre es obligatorio';
    } else if (formData.nombre.length < 2) {
      nuevosErrores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      nuevosErrores.email = 'El correo electrónico es obligatorio';
    } else if (!regexEmail.test(formData.email)) {
      nuevosErrores.email = 'Por favor, introduce un correo electrónico válido';
    }

    // Validar teléfono
    const regexTelefono = /^[0-9+-\s()]{9,}$/;
    if (formData.telefono && !regexTelefono.test(formData.telefono.replace(/\s/g, ''))) {
      nuevosErrores.telefono = 'Por favor, introduce un teléfono válido';
    }

    // Validar asunto
    if (!formData.asunto.trim()) {
      nuevosErrores.asunto = 'El asunto es obligatorio';
    } else if (formData.asunto.length < 5) {
      nuevosErrores.asunto = 'El asunto debe tener al menos 5 caracteres';
    }

    // Validar mensaje
    if (!formData.mensaje.trim()) {
      nuevosErrores.mensaje = 'El mensaje es obligatorio';
    } else if (formData.mensaje.length < 10) {
      nuevosErrores.mensaje = 'El mensaje debe tener al menos 10 caracteres';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validarFormulario()) {
      // Simular envío del formulario
      console.log('Datos del formulario:', formData);
      setEnviado(true);
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: '',
        tipoConsulta: 'general'
      });
      
      setTimeout(() => setEnviado(false), 5000);
    }
  };

  const preguntasFrecuentes = [
    {
      pregunta: '¿Cuáles son los métodos de pago aceptados?',
      respuesta: 'Aceptamos tarjetas de crédito (Visa, MasterCard, American Express), débito, transferencias bancarias, PayPal y Webpay. Todas las transacciones son 100% seguras.'
    },
    {
      pregunta: '¿Cuánto tarda el envío de mi pedido?',
      respuesta: 'Los envíos estándar tardan 3-5 días hábiles dentro de Santiago y 5-7 días hábiles a regiones. Envío express disponible en 1-2 días hábiles con costo adicional. Los pedidos realizados antes de las 14:00 hrs se despachan el mismo día.'
    },
    {
      pregunta: '¿Puedo devolver o cambiar un producto?',
      respuesta: 'Sí, aceptamos devoluciones y cambios dentro de los 30 días posteriores a la compra. El producto debe estar en perfecto estado, con todos sus accesorios y empaque original. Los costos de envío de la devolución corren por cuenta del cliente, excepto en casos de productos defectuosos.'
    },
    {
      pregunta: '¿Ofrecen garantía en los productos?',
      respuesta: 'Todos nuestros productos incluyen garantía del fabricante que varía según el producto (generalmente 12 meses). Para productos Apple, la garantía es de 1 año. Además, ofrecemos garantía de 30 días de satisfacción por parte de MiTienda.'
    },
    {
      pregunta: '¿Realizan envíos internacionales?',
      respuesta: 'Actualmente solo realizamos envíos dentro de Chile. Estamos trabajando para expandirnos a otros países de Latinoamérica próximamente.'
    }
  ];

  return (
    <Container>
      <Row className="mb-5">
        <Col>
          <h1 className="text-center mb-4">📞 Contáctanos</h1>
          <p className="text-center lead">
            ¿Tienes preguntas? Estamos aquí para ayudarte. Elige la forma más conveniente para contactarnos.
          </p>
        </Col>
      </Row>

      {enviado && (
        <Row className="mb-4">
          <Col>
            <Alert variant="success" className="text-center">
              ✅ ¡Mensaje enviado correctamente! Te contactaremos dentro de las próximas 24 horas.
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="g-4">
        {/* Información de Contacto */}
        <Col lg={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary mb-4">Información de Contacto</Card.Title>
              
              <div className="mb-4">
                <h6>📍 Dirección</h6>
                <p className="mb-0">Rigoberto Jara 1845</p>
                <p>Quilicura, Santiago</p>
              </div>

              <div className="mb-4">
                <h6>📧 Email</h6>
                <p>arma.calderon@duocuc.cl</p>
              </div>

              <div className="mb-4">
                <h6>📞 Teléfono</h6>
                <p>+56 9 8534 1498</p>
              </div>

              <div className="mb-4">
                <h6>🕒 Horario de Atención</h6>
                <p>Lunes a Viernes: 9:00 - 18:00 hrs</p>
                <p>Sábados: 10:00 - 14:00 hrs</p>
                <p>Domingos: Cerrado</p>
              </div>

              <div className="mb-4">
                <h6>🚚 Tiempos de Respuesta</h6>
                <p>Email: 24 horas</p>
                <p>WhatsApp: 2 horas</p>
                <p>Redes Sociales: 4 horas</p>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Formulario de Contacto */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title className="text-primary mb-4">Envíanos un Mensaje</Card.Title>
              
              <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Nombre completo *</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        isInvalid={!!errores.nombre}
                        placeholder="Ej: Juan Pérez"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.nombre}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errores.email}
                        placeholder="ejemplo@email.com"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Teléfono</Form.Label>
                      <Form.Control
                        type="tel"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        isInvalid={!!errores.telefono}
                        placeholder="+56 9 1234 5678"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.telefono}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Tipo de consulta *</Form.Label>
                      <Form.Select
                        name="tipoConsulta"
                        value={formData.tipoConsulta}
                        onChange={handleChange}
                      >
                        <option value="general">Consulta General</option>
                        <option value="tecnica">Soporte Técnico</option>
                        <option value="ventas">Consultas de Ventas</option>
                        <option value="garantia">Garantía y Devoluciones</option>
                        <option value="distribuidor">Ser Distribuidor</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Asunto *</Form.Label>
                      <Form.Control
                        type="text"
                        name="asunto"
                        value={formData.asunto}
                        onChange={handleChange}
                        isInvalid={!!errores.asunto}
                        placeholder="Breve descripción de tu consulta"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.asunto}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Mensaje *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={5}
                        name="mensaje"
                        value={formData.mensaje}
                        onChange={handleChange}
                        isInvalid={!!errores.mensaje}
                        placeholder="Describe detalladamente tu consulta, pregunta o solicitud..."
                      />
                      <Form.Control.Feedback type="invalid">
                        {errores.mensaje}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted">
                        Mínimo 10 caracteres. Incluye todos los detalles necesarios para poder ayudarte mejor.
                      </Form.Text>
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <div className="d-grid">
                      <Button 
                        type="submit" 
                        variant="primary" 
                        size="lg"
                        className="fw-bold"
                      >
                        📤 Enviar Mensaje
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Preguntas Frecuentes */}
      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Body>
              <Card.Title className="text-center mb-4">❓ Preguntas Frecuentes</Card.Title>
              
              <Accordion flush>
                {preguntasFrecuentes.map((faq, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>
                      <strong>{faq.pregunta}</strong>
                    </Accordion.Header>
                    <Accordion.Body>
                      {faq.respuesta}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contacto;