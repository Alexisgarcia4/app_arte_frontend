import React, { useState, useEffect } from "react";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";

const AdministrarObras = () => {
  const [obras, setObras] = useState([]);
  const [artistas, setArtistas] = useState([]);
  const [filters, setFilters] = useState({
    autor: "",
    precio_min: "",
    precio_max: "",
    titulo: "",
    activo: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch obras con filtros y paginación
  const fetchObras = async (page = 1) => {
    try {
      const response = await axios.get(`${localStorage.getItem("url")}obras`, {
        params: {
          activo: filters.activo,
          page,
          limit: 6,
          id_autor: filters.autor,
          precio_min: filters.precio_min,
          precio_max: filters.precio_max,
          titulo: filters.titulo,
        },
      });
      const { obras, totalPages } = response.data;
      setObras(obras || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Error al cargar las obras:", error.response?.data || error.message);
    }
  };

  // Fetch lista de artistas (autores)
  const fetchArtistas = async () => {
    try {
      const response = await axios.get(`${localStorage.getItem("url")}usuarios?rol=artista`);
      setArtistas(response.data.usuarios || []);
    } catch (error) {
      console.error("Error al cargar los artistas:", error.response?.data || error.message);
    }
  };

  // Manejo de filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Filtrar y recargar obras
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchObras(1);
  };

  // Activar obra
  const activarObra = async (idObra) => {
    try {
      await axios.put(`${localStorage.getItem("url")}obras/activo/activar/${idObra}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchObras(currentPage); // Actualizar lista
    } catch (error) {
      console.error("Error al activar la obra:", error.response?.data || error.message);
    }
  };

  // Desactivar obra
  const desactivarObra = async (idObra) => {
    try {
      await axios.put(`${localStorage.getItem("url")}obras/activo/desactivar/${idObra}`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchObras(currentPage); // Actualizar lista
    } catch (error) {
      console.error("Error al desactivar la obra:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchObras(currentPage);
  }, [currentPage]);

  useEffect(() => {
    fetchArtistas();
  }, []);

  return (
    <div>
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Administrar Obras</h1>

        {/* Filtros */}
        <Form onSubmit={handleFilterSubmit} className="mb-4">
          <Row>
            <Col md={2}>
              <Form.Group controlId="filterAutor">
                <Form.Label>Autor</Form.Label>
                <Form.Select name="autor" value={filters.autor} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  {artistas.map((artista) => (
                    <option key={artista.id_usuario} value={artista.id_usuario}>
                      {artista.nick}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="filterPrecioMin">
                <Form.Label>Precio Mínimo</Form.Label>
                <Form.Control
                  type="number"
                  name="precio_min"
                  value={filters.precio_min}
                  onChange={handleFilterChange}
                  placeholder="Precio mínimo"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="filterPrecioMax">
                <Form.Label>Precio Máximo</Form.Label>
                <Form.Control
                  type="number"
                  name="precio_max"
                  value={filters.precio_max}
                  onChange={handleFilterChange}
                  placeholder="Precio máximo"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="filterTitulo">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={filters.titulo}
                  onChange={handleFilterChange}
                  placeholder="Título de la obra"
                />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group controlId="filterActivo">
                <Form.Label>Activo</Form.Label>
                <Form.Select name="activo" value={filters.activo} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit" className="mt-3">
            Filtrar
          </Button>
        </Form>

        {/* Obras */}
        <Row>
          {obras.map((obra) => (
            <Col key={obra.id_obra} xs={12} sm={6} lg={4} className="mb-4">
              <Card className="shadow-sm">
                <Link to={`/obras/${obra.id_obra}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <Card.Img
                    variant="top"
                    src={obra.imagen_url}
                    style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                  />
                </Link>
                <Card.Body>
                  <Card.Title>{obra.titulo}</Card.Title>
                  <Card.Text>
                    <strong>Autor:</strong> {obra.Usuario?.nick || "Desconocido"} <br />
                    <strong>Precio:</strong> {obra.precio} € <br />
                    <strong>Cantidad:</strong> {obra.cantidad} <br />
                    <strong>Estado:</strong> {obra.activo ? "Activo" : "Inactivo"} <br />
                  </Card.Text>
                  {/* Botones de activar/desactivar */}
                  {obra.activo ? (
                    <Button variant="danger" onClick={() => desactivarObra(obra.id_obra)}>
                      Desactivar
                    </Button>
                  ) : (
                    <Button variant="success" onClick={() => activarObra(obra.id_obra)}>
                      Activar
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Paginación */}
        <div className="d-flex justify-content-center mt-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <span className="mx-3 align-self-center">
            Página {currentPage} de {totalPages}
          </span>
          <Button
            variant="secondary"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </Container>

      <Footer />
    </div>
  );
};

export default AdministrarObras;
