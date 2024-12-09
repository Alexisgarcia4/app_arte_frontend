import React, { useState } from "react";
import { Container, Form, Button, Alert } from "react-bootstrap";
import Menu from "../componets/Menu";
import axios from "axios";
import Footer from "../componets/Footer";
const Registro = () => {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    nick: "",
    apellidos: "",
    email: "",
    password: "",
    confirmPassword: "",
    telefono: "",
    direccion: "",
    rol: "usuario", // Valor por defecto
    descripcion: "",
    imagen: null, // Campo para la imagen
  });
  const [showDescripcion, setShowDescripcion] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "imagen") {
      setFormData({ ...formData, imagen: e.target.files[0] }); // Guardar el archivo seleccionado
    } else {
      setFormData({ ...formData, [name]: value });

      if (name === "rol" && value === "artista") {
        setShowDescripcion(true);
      } else if (name === "rol" && value === "usuario") {
        setShowDescripcion(false);
      }
    }
  };

  // Validar y enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      dni,
      nombre,
      nick,
      apellidos,
      email,
      password,
      confirmPassword,
      telefono,
      direccion,
      rol,
      descripcion,
      imagen,
    } = formData;

    // Validaciones básicas
    if (!dni || !nombre || !nick || !email || !password || !confirmPassword) {
      setErrorMessage("Por favor, completa todos los campos obligatorios.");
      setSuccessMessage("");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Las contraseñas no coinciden.");
      setSuccessMessage("");
      return;
    }

    if (rol === "artista" && (!descripcion || descripcion.trim().length === 0)) {
      setErrorMessage("La descripción es obligatoria para los artistas.");
      setSuccessMessage("");
      return;
    }

    if (!imagen) {
      setErrorMessage("Por favor, sube una imagen de perfil.");
      setSuccessMessage("");
      return;
    }

    // Crear el FormData para enviar al servidor
    const data = new FormData();
    data.append("dni", dni);
    data.append("nombre", nombre);
    data.append("nick", nick);
    data.append("apellidos", apellidos);
    data.append("email", email);
    data.append("password", password);
    data.append("telefono", telefono);
    data.append("direccion", direccion);
    data.append("rol", rol);
    if (descripcion) data.append("descripcion", descripcion);
    data.append("imagen_perfil", imagen);

    try {
      // Enviar el formulario al backend
      const response = await axios.post(`${localStorage.getItem("url")}usuarios/crear`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccessMessage(response.data.message || "Usuario registrado exitosamente.");
      setErrorMessage("");
      setFormData({
        dni: "",
        nombre: "",
        nick: "",
        apellidos: "",
        email: "",
        password: "",
        confirmPassword: "",
        telefono: "",
        direccion: "",
        rol: "usuario",
        descripcion: "",
        imagen: null,
      });
      setShowDescripcion(false);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Error al registrar usuario.");
    }
  };

  return (
    <div
     
    >
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Regístrate</h1>

        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
          <Form.Group className="mb-3" controlId="formDNI">
            <Form.Label>DNI</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu DNI"
              name="dni"
              value={formData.dni}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre Completo</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nombre completo"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNick">
            <Form.Label>Nick</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu nick"
              name="nick"
              value={formData.nick}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formApellidos">
            <Form.Label>Apellidos</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tus apellidos"
              name="apellidos"
              value={formData.apellidos}
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

          <Form.Group className="mb-3" controlId="formPassword">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formConfirmPassword">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirma tu contraseña"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu número de teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDireccion">
            <Form.Label>Dirección</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingresa tu dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Select name="rol" value={formData.rol} onChange={handleChange}>
              <option value="usuario">Usuario</option>
              <option value="artista">Artista</option>
            </Form.Select>
          </Form.Group>

          {showDescripcion && (
            <Form.Group className="mb-3" controlId="formDescripcion">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Escribe una breve descripción sobre ti"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3" controlId="formImagen">
            <Form.Label>Imagen de Perfil</Form.Label>
            <Form.Control
              type="file"
              name="imagen"
              onChange={handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Registrarse
          </Button>
        </Form>
      </Container>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Registro;
