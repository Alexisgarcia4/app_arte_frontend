import React, { useState, useEffect } from "react";
import { Container, Card, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";

const AdministarUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios
  const [filters, setFilters] = useState({
    rol: "",
    activo: "",
    nombre: "",
    nick: "",
    dni: "",
  }); // Filtros
  const [error, setError] = useState(""); // Mensaje de error
  const [loading, setLoading] = useState(false); // Estado de carga

 // Fetch usuarios con filtros
const fetchUsuarios = async () => {
  try {
    setLoading(true);
    setError("");
    const response = await axios.get(`${localStorage.getItem("url")}usuarios`, {
      params: {
        rol: filters.rol || undefined, // Si no hay filtro de rol, traer todos menos administradores
        activo: filters.activo,
        nombre: filters.nombre,
        nick: filters.nick,
        dni: filters.dni,
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // Excluir administradores en la respuesta
    const usuariosSinAdministradores = response.data.usuarios.filter(
      (usuario) => usuario.rol !== "administrador"
    );

    setUsuarios(usuariosSinAdministradores || []);
    setLoading(false);
  } catch (error) {
    setError("Hubo un error al cargar los usuarios.");
    console.error(error.response?.data || error.message);
    setLoading(false);
  }
};

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Aplicar filtros y recargar usuarios
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchUsuarios();
  };

  // Manejar activación/desactivación de cuentas
  const toggleCuenta = async (idUsuario, activo) => {
    try {
      const url = `${localStorage.getItem("url")}usuarios/activo/${activo ? "desactivar" : "activar"}/${idUsuario}`;
      await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      // Recargar usuarios
      fetchUsuarios();
      alert(`Cuenta ${activo ? "desactivada" : "activada"} exitosamente.`);
    } catch (error) {
      console.error(`Error al ${activo ? "desactivar" : "activar"} la cuenta:`, error.response?.data || error.message);
      alert(`Hubo un error al ${activo ? "desactivar" : "activar"} la cuenta.`);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div>
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Administrar Usuarios</h1>

        {/* Mensaje de error */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Filtros */}
        <Form onSubmit={handleFilterSubmit} className="mb-4">
          <Row className="g-3">
            <Col md={4} xs={12}>
              <Form.Group controlId="filterRol">
                <Form.Label>Rol</Form.Label>
                <Form.Select name="rol" value={filters.rol} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  <option value="usuario">Usuario</option>
                  <option value="artista">Artista</option>
                  
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} xs={12}>
              <Form.Group controlId="filterActivo">
                <Form.Label>Estado</Form.Label>
                <Form.Select name="activo" value={filters.activo} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4} xs={12}>
              <Form.Group controlId="filterNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={filters.nombre}
                  onChange={handleFilterChange}
                  placeholder="Buscar por nombre"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-3 mt-3">
            <Col md={6} xs={12}>
              <Form.Group controlId="filterNick">
                <Form.Label>Nick</Form.Label>
                <Form.Control
                  type="text"
                  name="nick"
                  value={filters.nick}
                  onChange={handleFilterChange}
                  placeholder="Buscar por nick"
                />
              </Form.Group>
            </Col>
            <Col md={6} xs={12}>
              <Form.Group controlId="filterDni">
                <Form.Label>DNI</Form.Label>
                <Form.Control
                  type="text"
                  name="dni"
                  value={filters.dni}
                  onChange={handleFilterChange}
                  placeholder="Buscar por DNI"
                />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3 d-flex justify-content-end">
            <Button variant="primary" type="submit">
              Filtrar
            </Button>
          </div>
        </Form>

        {/* Usuarios en formato Card */}
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : usuarios.length > 0 ? (
          <Row className="g-4">
            {usuarios.map((usuario) => (
              <Col key={usuario.id_usuario} xs={12} sm={6} md={4}>
                <Card className="shadow-sm">
                <Card.Img
                    variant="top"
                    src={usuario.imagen_perfil}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                  />
                  <Card.Body>
                    <Card.Title>{usuario.nombre}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {usuario.rol} - {usuario.activo ? "Activo" : "Inactivo"}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Nick:</strong> {usuario.nick} <br />
                      <strong>Email:</strong> {usuario.email} <br />
                      <strong>DNI:</strong> {usuario.dni || "N/A"}
                    </Card.Text>
                    <Button
                      variant={usuario.activo ? "danger" : "success"}
                      onClick={() => toggleCuenta(usuario.id_usuario, usuario.activo)}
                    >
                      {usuario.activo ? "Desactivar" : "Activar"}
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center">No se encontraron usuarios.</p>
        )}
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdministarUsuarios;
