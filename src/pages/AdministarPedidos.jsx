import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Form,
  Button,
  Alert,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";

const AdministarPedidos = () => {
  const [pedidos, setPedidos] = useState([]); // Lista de pedidos
  const [filters, setFilters] = useState({
    estado: "",
    dni: "",
  }); // Filtros
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [error, setError] = useState(""); // Mensajes de error
  const [loading, setLoading] = useState(false); // Estado de carga

  // Fetch pedidos con filtros y paginación
  const fetchPedidos = async (page = 1) => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get("http://localhost:3000/api/pedidos/admin", {
        params: {
          estado: filters.estado,
          dni: filters.dni,
          page,
          limit: 10,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const { pedidos, totalPages } = response.data;

      setPedidos(pedidos || []);
      setTotalPages(totalPages || 1);
      setLoading(false);
    } catch (error) {
      setError("Hubo un error al cargar los pedidos.");
      console.error(error.response?.data || error.message);
      setLoading(false);
    }
  };

  // Cambiar estado del pedido a completado
  const completarPedido = async (idPedido) => {
    try {
      await axios.put(
        `http://localhost:3000/api/pedidos/admin/${idPedido}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setPedidos((prevPedidos) =>
        prevPedidos.map((pedido) =>
          pedido.id_pedido === idPedido
            ? { ...pedido, estado: "completado" }
            : pedido
        )
      );
      alert("Pedido completado exitosamente.");
    } catch (error) {
      console.error("Error al completar el pedido:", error.response?.data || error.message);
      alert("Hubo un error al completar el pedido.");
    }
  };

  // Eliminar pedido
  const eliminarPedido = async (idPedido) => {
    try {
      await axios.delete(`http://localhost:3000/api/pedidos/${idPedido}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Actualizar la lista de pedidos eliminando el pedido borrado
      setPedidos((prevPedidos) =>
        prevPedidos.filter((pedido) => pedido.id_pedido !== idPedido)
      );
      alert("Pedido eliminado exitosamente.");
    } catch (error) {
      console.error("Error al eliminar el pedido:", error.response?.data || error.message);
      alert("Hubo un error al eliminar el pedido.");
    }
  };

  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Aplicar filtros y recargar pedidos
  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // Reiniciar a la primera página
    fetchPedidos(1);
  };

  // Cargar pedidos al cambiar de página
  useEffect(() => {
    fetchPedidos(currentPage);
  }, [currentPage]);

  return (
    <div>
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Administrar Pedidos</h1>

        {/* Mensaje de error */}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* Filtros */}
        <Form onSubmit={handleFilterSubmit} className="mb-4">
          <Row className="g-3">
            <Col md={6} xs={12}>
              <Form.Group controlId="filterEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select name="estado" value={filters.estado} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  <option value="pendiente">Pendiente</option>
                  <option value="completado">Completado</option>
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={6} xs={12}>
              <Form.Group controlId="filterDni">
                <Form.Label>DNI del Usuario</Form.Label>
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

        {/* Pedidos en formato Card */}
        {loading ? (
          <p className="text-center">Cargando...</p>
        ) : pedidos.length > 0 ? (
          <Row className="g-4">
            {pedidos.map((pedido) => (
              <Col key={pedido.id_pedido} xs={12} md={6} lg={4}>
                <Card className="shadow-sm">
                  <Card.Body>
                    <Card.Title>
                      Pedido #{pedido.id_pedido} - {pedido.estado}
                    </Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Fecha: {new Date(pedido.fecha_pedido).toLocaleDateString()}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Usuario:</strong> {pedido.Usuario?.nombre || "Desconocido"} <br />
                      <strong>DNI:</strong> {pedido.Usuario?.dni || "N/A"} <br />
                      <strong>Total:</strong> {pedido.total} € <br />
                    </Card.Text>
                    <hr />
                    <h6>Detalles del Pedido:</h6>
                    <ul className="list-unstyled">
                      {pedido.Detalle_Pedidos?.map((detalle) => (
                        <li key={detalle.id_detalle}>
                          <strong>{detalle.Obra?.titulo || "Obra desconocida"}</strong> -{" "}
                          {detalle.cantidad} unidad(es) a {detalle.precio_unitario} € cada una
                        </li>
                      ))}
                    </ul>
                    {/* Botones para pedidos pendientes */}
                    {pedido.estado === "pendiente" && (
                      <div className="mt-3 d-flex gap-2">
                        <Button
                          variant="success"
                          onClick={() => completarPedido(pedido.id_pedido)}
                        >
                          Completar Pedido
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => eliminarPedido(pedido.id_pedido)}
                        >
                          Eliminar Pedido
                        </Button>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-center">No se encontraron pedidos.</p>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <Pagination className="justify-content-center mt-4">
            <Pagination.Prev
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Pagination.Prev>
            <Pagination.Item active>{currentPage}</Pagination.Item>
            <Pagination.Next
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Pagination.Next>
          </Pagination>
        )}
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdministarPedidos;
