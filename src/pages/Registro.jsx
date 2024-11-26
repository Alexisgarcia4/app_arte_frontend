import React from 'react';
import { Container, Form, Button } from 'react-bootstrap';

const Registro = () => {
  return (
    <Container className="mt-5">
      <h1>Registro</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control type="text" placeholder="Ingresa tu nombre" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Correo Electrónico</Form.Label>
          <Form.Control type="email" placeholder="Ingresa tu correo" />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control type="password" placeholder="Ingresa tu contraseña" />
        </Form.Group>
        <Button variant="primary" type="submit">Registrarse</Button>
      </Form>
    </Container>
  );
};

export default Registro;
