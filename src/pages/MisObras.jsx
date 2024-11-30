import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import { Link } from "react-router-dom";
import Footer from "../componets/Footer";

const MisObras = () => {
  const id = localStorage.getItem("id_usuario"); // Obtener ID del usuario desde localStorage
  const [obras, setObras] = useState([]);
  const [filters, setFilters] = useState({
    precio_min: "",
    precio_max: "",
    titulo: "",
    estado: "", // Estado de la obra (disponible/no disponible)
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch obras con filtros y paginación
  const fetchObras = async (page = 1) => {
    try {
      const response = await axios.get("http://localhost:3000/api/obras", {
        params: {
          page,
          limit: 6,
          id_autor: id, // Solo obras del autor especificado
          precio_min: filters.precio_min,
          precio_max: filters.precio_max,
          titulo: filters.titulo,
          activo: filters.estado, // Filtro por estado
        },
      });
      const { obras, totalPages } = response.data;
      setObras(obras || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error(
        "Error al cargar las obras:",
        error.response?.data || error.message
      );
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
    setCurrentPage(1); // Reiniciar a la primera página
    fetchObras(1);
  };

  // Cambiar estado de una obra (activar/desactivar)
  const toggleObraActivo = async (obraId, isActive) => {
    const url = `http://localhost:3000/api/obras/activo/desactivar/${obraId}`;
    try {
      const response = await axios.put(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response.data.message);
      fetchObras(currentPage); // Refrescar lista de obras
    } catch (error) {
      console.error(
        "Error al cambiar el estado de la obra:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchObras(currentPage);
  }, [currentPage]);

  return (
    <div>
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4">
        <h1 className="text-center mb-4">Mis Obras</h1>

        {/* Filtros */}
        <Form onSubmit={handleFilterSubmit} className="mb-4">
          <Row>
            <Col md={3}>
              <Form.Group controlId="filterEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="estado"
                  value={filters.estado}
                  onChange={handleFilterChange}
                >
                  <option value="">Todos</option>
                  <option value="1">Disponible</option>
                  <option value="0">No Disponible</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
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
            <Col md={3}>
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
            <Col md={3}>
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
          </Row>
          <Button variant="primary" type="submit" className="mt-3">
            Filtrar
          </Button>
        </Form>

        {/* Obras */}
        <Row>
          {obras.map((obra) => (
            <Col key={obra.id_obra} xs={12} sm={6} lg={4} className="mb-4">
              <Card
                className="shadow-sm"
                style={{
                  transition: "transform 0.2s", // Suaviza el efecto
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                 {obra.activo ? (
  <Link
    to={`/obras-editable/${obra.id_obra}`}
    style={{ textDecoration: "none", color: "inherit" }}
  >
    <Card.Img
      variant="top"
      src={obra.imagen_url}
      style={{ height: "200px", objectFit: "cover" }}
    />
  </Link>
) : (
  <Card.Img
    variant="top"
    src={obra.imagen_url}
    style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
      }}
  />
)}
                
                <Card.Body>
                  <Card.Title>{obra.titulo}</Card.Title>
                  <Card.Text>
                  <strong>Cantidad:</strong> {obra.cantidad} <br />
                  <strong>Precio:</strong> {obra.precio} €
                </Card.Text>
                  {/* Mostrar el botón solo si la obra está activa */}
                  {obra.activo && (
                    <Button
                      variant="danger"
                      onClick={() =>
                        toggleObraActivo(obra.id_obra, obra.activo)
                      }
                    >
                      Desactivar
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
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </Container>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default MisObras;
