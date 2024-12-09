import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]); // Estado para almacenar los pedidos
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(""); // Estado para errores
  const [filtroEstado, setFiltroEstado] = useState(""); // Filtro por estado

  // Función para obtener los pedidos del usuario
  const fetchPedidos = async (estado = "") => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${localStorage.getItem("url")}pedidos/?estado=${estado}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
        setPedidos(response.data.pedidos);
     
      
    } catch (err) {
      console.error("Error al obtener pedidos:", err);
      setError("Hubo un problema al cargar los pedidos.");
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar los pedidos al montar el componente
  useEffect(() => {
    fetchPedidos();
  }, []);

  // Manejar el cambio del filtro
  const handleFiltroChange = (e) => {
    const estado = e.target.value;
    setFiltroEstado(estado);
    fetchPedidos(estado);
  };


  // Función para cancelar un pedido
  const cancelarPedido = async (id_pedido) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${localStorage.getItem("url")}pedidos/${id_pedido}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Actualizar la lista de pedidos después de cancelar
      setPedidos((prevPedidos) =>
        prevPedidos.filter((pedido) => pedido.id_pedido !== id_pedido)
      );
    } catch (err) {
      console.error("Error al cancelar el pedido:", err);
      alert("Hubo un problema al cancelar el pedido.");
    }
  };


  return (
    <div>
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Mis Pedidos</h1>

        {/* Filtro por estado */}
        <Form.Group controlId="filtroEstado" className="mb-4">
          <Form.Label>Filtrar por estado</Form.Label>
          <Form.Select value={filtroEstado} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
          </Form.Select>
        </Form.Group>

        {/* Mostrar mensajes de carga o error */}
        {loading && <p className="text-center">Cargando pedidos...</p>}
        {error && <p className="text-center text-danger">{error}</p>}

        {/* Lista de pedidos */}
        <Row>
          {pedidos.map((pedido) => (
            <Col key={pedido.id_pedido} xs={12} sm={6} lg={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <Card.Title>Pedido #{pedido.id_pedido}</Card.Title>
                  <Card.Text>
                    <strong>Fecha:</strong> {new Date(pedido.fecha_pedido).toLocaleDateString()} <br />
                    <strong>Estado:</strong> {pedido.estado} <br />
                    <strong>Total:</strong> {Number(pedido.total).toFixed(2)} € <br />
                  </Card.Text>
                  <Card.Subtitle className="mt-3">Detalles:</Card.Subtitle>
                  <ul>
                    {pedido.Detalle_Pedidos.map((detalle, index) => (
                      <li key={index}>
                        <strong>{detalle.Obra.titulo}</strong> - {detalle.cantidad} x {Number(detalle.precio_unitario).toFixed(2)} € 
                      </li>
                    ))}
                  </ul>

                  {/* Botón para cancelar pedido si está en estado pendiente */}
                  {pedido.estado === "pendiente" && (
                    <Button
                      variant="danger"
                      className="mt-3"
                      onClick={() => cancelarPedido(pedido.id_pedido)}
                    >
                      Cancelar Pedido
                    </Button>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Mostrar mensaje si no hay pedidos */}
        {!loading && pedidos.length === 0 && (
          <p className="text-center">No se encontraron pedidos.</p>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default Pedidos;
