import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";

const Contacto = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    mensaje: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Validar y enviar el formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const { nombre, email, mensaje } = formData;

    // Validaciones básicas
    if (!nombre || !email || !mensaje) {
      setErrorMessage("Todos los campos son obligatorios.");
      setSuccessMessage("");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor, ingresa un correo electrónico válido.");
      setSuccessMessage("");
      return;
    }

    // Simular envío del formulario
    setSuccessMessage("¡Gracias por contactarnos! Responderemos pronto.");
    setErrorMessage("");
    setFormData({ nombre: "", email: "", mensaje: "" });
  };

  return (
    <div
      style={{
        backgroundImage: "url('/fondo.webp')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Contáctanos</h1>
        
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Correo Electrónico</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu correo electrónico"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formMensaje">
            <Form.Label>Mensaje</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              placeholder="Escribe tu mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Enviar
          </Button>
        </Form>
      </Container>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Contacto;
