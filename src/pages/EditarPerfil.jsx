import React, { useState, useEffect } from "react";
import { Container, Form, Button, Alert, Row, Col, Image } from "react-bootstrap";
import Menu from "../componets/Menu";
import axios from "axios";
import Footer from "../componets/Footer";

const EditarPerfil = () => {
  const id = localStorage.getItem("id_usuario");
  const [formData, setFormData] = useState({
    nombre: "",
    apellidos: "",
    dni: "",
    nick: "",
    email: "",
    telefono: "",
    direccion: "",
    descripcion: "",
  });
  const [imagen, setImagen] = useState(null); // Imagen de perfil
  const [previewImagen, setPreviewImagen] = useState(null); // Vista previa
  const [rol, setRol] = useState(""); // Rol del usuario
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [passwordData, setPasswordData] = useState({
    contraseña_actual: "",
    nueva_contraseña: "",
  });

  // Fetch datos del usuario
  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get(`${localStorage.getItem("url")}usuarios/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const usuario = response.data.usuario;
        setFormData({
          nombre: usuario.nombre,
          apellidos: usuario.apellidos,
          dni: usuario.dni,
          nick: usuario.nick,
          email: usuario.email,
          telefono: usuario.telefono,
          direccion: usuario.direccion,
          descripcion: usuario.descripcion || "",
        });
        setRol(usuario.rol);
        setPreviewImagen(usuario.imagen_perfil);
      } catch (error) {
        console.error("Error al cargar usuario:", error.response?.data || error.message);
        setErrorMessage("No se pudo cargar la información del usuario.");
      }
    };

    fetchUsuario();
  }, [id]);

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de cambio en la imagen de perfil
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreviewImagen(URL.createObjectURL(file)); // Mostrar vista previa
  };

  // Actualizar datos generales
  const handleUpdateDatos = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${localStorage.getItem("url")}usuarios/datos/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Datos actualizados correctamente.");
      setErrorMessage("");
    } catch (error) {
      console.error("Error al actualizar datos:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Error al actualizar los datos.");
    }
  };

  // Actualizar imagen de perfil
  const handleUpdateImagen = async () => {
    if (!imagen) {
      setErrorMessage("Por favor, selecciona una imagen.");
      return;
    }

    const data = new FormData();
    data.append("imagen_perfil", imagen);

    try {
      const response = await axios.put(
        `${localStorage.getItem("url")}usuarios/imagen/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setPreviewImagen(response.data.imagen_perfil); // Actualizar la vista previa
      setErrorMessage("");
    } catch (error) {
      console.error("Error al actualizar imagen:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Error al actualizar la imagen.");
    }
  };

  // Actualizar contraseña
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `${localStorage.getItem("url")}usuarios/contrasena/${id}`,
        passwordData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Contraseña actualizada correctamente.");
      setPasswordData({ contraseña_actual: "", nueva_contraseña: "" }); // Limpiar los campos
      setErrorMessage("");
    } catch (error) {
      console.error("Error al actualizar contraseña:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Error al actualizar la contraseña.");
    }
  };

  return (
    <div
    >
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Editar Perfil</h1>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Row>
          {/* Imagen de Perfil */}
          <Col md={4} className="text-center mb-4">
            <Image
              src={previewImagen || "/default-profile.png"}
              roundedCircle
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
              alt="Imagen de perfil"
            />
            <Form.Group controlId="formImagen" className="mt-3">
              <Form.Label>Cambiar Imagen de Perfil</Form.Label>
              <Form.Control type="file" onChange={handleImagenChange} />
            </Form.Group>
            <Button className="mt-3" variant="primary" onClick={handleUpdateImagen}>
              Actualizar Imagen
            </Button>
          </Col>

      {/* Datos Personales */}
      <Col md={8}>
            <Form onSubmit={handleUpdateDatos}>
              <Form.Group className="mb-3">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Apellidos</Form.Label>
                <Form.Control
                  type="text"
                  name="apellidos"
                  value={formData.apellidos}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                  type="text"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Nick</Form.Label>
                <Form.Control
                  type="text"
                  name="nick"
                  value={formData.nick}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Correo Electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Dirección</Form.Label>
                <Form.Control
                  type="text"
                  name="direccion"
                  value={formData.direccion}
                  onChange={handleChange}
                />
              </Form.Group>

              {rol === "artista" && (
                <Form.Group className="mb-3">
                  <Form.Label>Descripción</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                  />
                </Form.Group>
              )}

              <Button variant="primary" type="submit">
                Actualizar Datos
              </Button>
            </Form>

            {/* Formulario para cambiar contraseña */}
            <Form className="mt-4" onSubmit={handleUpdatePassword}>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña Actual</Form.Label>
                <Form.Control
                  type="password"
                  name="contraseña_actual"
                  value={passwordData.contraseña_actual}
                  onChange={(e) => setPasswordData({ ...passwordData, contraseña_actual: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Nueva Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="nueva_contraseña"
                  value={passwordData.nueva_contraseña}
                  onChange={(e) => setPasswordData({ ...passwordData, nueva_contraseña: e.target.value })}
                />
              </Form.Group>
              <Button variant="secondary" type="submit">
                Actualizar Contraseña
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default EditarPerfil;
