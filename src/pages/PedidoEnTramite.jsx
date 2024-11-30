import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";
import QuantitySelector from "../componets/QuantitySelector"; // Importar el componente

import { useNavigate } from "react-router-dom";

const PedidoEnTramite = () => {
  const [obrasCarrito, setObrasCarrito] = useState([]); // Estado para las obras en el carrito
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(""); // Estado de error

  const navigate = useNavigate(); // Hook para redirigir

  const fetchObrasCarrito = async () => {
    try {
      const carritoRaw = localStorage.getItem("carrito");
      const carrito = carritoRaw ? JSON.parse(carritoRaw) : [];

      if (carrito.length === 0) {
        setObrasCarrito([]);
        setLoading(false);
        return;
      }

      const ids = carrito.map((item) => item.id_obra);

      const response = await axios.get("http://localhost:3000/api/obras");
      const todasObras = response.data.obras;

      const obrasEnCarrito = todasObras
        .filter((obra) => ids.includes(obra.id_obra))
        .map((obra) => ({
          ...obra,
          cantidadSeleccionada: carrito.find((c) => c.id_obra === obra.id_obra)
            ?.cantidad || 1, // Inicializar con cantidad del carrito o 1
        }));

      setObrasCarrito(obrasEnCarrito);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar las obras del carrito:", error);
      setError("Hubo un error al cargar las obras del carrito.");
      setLoading(false);
    }
  };

  // Cargar obras del carrito al montar el componente
  useEffect(() => {
    

    fetchObrasCarrito();
  }, []);

  // Manejar cambios en la cantidad
  const handleCantidadChange = (id_obra, nuevaCantidad) => {
    setObrasCarrito((prev) =>
      prev.map((obra) =>
        obra.id_obra === id_obra
          ? { ...obra, cantidadSeleccionada: nuevaCantidad }
          : obra
      )
    );
  };
/*
  // Manejar confirmación del pedido
  const handleConfirmarPedido = () => {
    const nuevoCarrito = obrasCarrito
    .filter((obra) => obra.cantidadSeleccionada > 0) // Eliminar obras con cantidad 0
    .map((obra) => ({
      id_obra: obra.id_obra,
      cantidad: obra.cantidadSeleccionada,
    }));
    
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    console.log("Carrito actualizado:", localStorage.getItem("carrito"));

    fetchObrasCarrito();
    
  };
*/

const handleConfirmarPedido = async () => {
    const nuevoCarrito = obrasCarrito
      .filter((obra) => obra.cantidadSeleccionada > 0)
      .map((obra) => ({
        id_obra: obra.id_obra,
        cantidad: obra.cantidadSeleccionada,
      }));

    if (nuevoCarrito.length === 0) {
      setError("El carrito está vacío.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "http://localhost:3000/api/pedidos/crear",
        { detalles: nuevoCarrito },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Pedido creado exitosamente
      console.log("Pedido creado:", response.data);
      localStorage.removeItem("carrito"); // Limpiar el carrito
      navigate("/pedidos"); // Redirigir a la página de pedidos
    } catch (err) {
      console.error("Error al confirmar el pedido:", err);
      setError("Hubo un error al confirmar el pedido. Intente nuevamente.");
    }
  };


  const calcularPrecioTotal = () => {
    return obrasCarrito.reduce(
      (total, obra) => total + obra.precio * obra.cantidadSeleccionada,
      0
    );
  };


  // Mostrar mientras carga
  if (loading) {
    return <p className="text-center mt-4">Cargando...</p>;
  }

  return (
    <div>
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        {obrasCarrito.length === 0 ? (
          <p className="text-center mt-4">No hay obras en el carrito.</p>
        ) : (
          <>
            <h1 className="text-center mb-4">Pedido en Trámite</h1>
            <Row>
              {obrasCarrito.map((obra) => (
                <Col key={obra.id_obra} xs={12} sm={6} lg={4} className="mb-4">
                  <Card className="shadow-sm">
                    <Card.Img
                      variant="top"
                      src={obra.imagen_url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                    <Card.Body>
                      <Card.Title>{obra.titulo}</Card.Title>
                      <Card.Text>
                        <strong>Precio:</strong> {obra.precio} € <br />
                        <strong>Cantidad disponible:</strong> {obra.cantidad}{" "}
                        <br />
                      </Card.Text>
                      <Form.Group controlId={`cantidad-${obra.id_obra}`}>
                        <Form.Label>Cantidad</Form.Label>
                        <QuantitySelector
                          max={obra.cantidad}
                          initial={obra.cantidadSeleccionada}
                          onChange={(nuevaCantidad) =>
                            handleCantidadChange(obra.id_obra, nuevaCantidad)
                          }
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            <div
  className="d-flex justify-content-center mt-4"
  style={{
    border: "2px solid black",
    backgroundColor: "white",
    padding: "10px 20px",
    borderRadius: "5px",
    display: "inline-block",
  }}
>
  <h4>Total: {calcularPrecioTotal().toFixed(2)} €</h4>
</div>
            

            <div className="d-flex justify-content-center mt-4">
              <Button variant="success" onClick={handleConfirmarPedido}>
                Confirmar Pedido
              </Button>
            </div>
          </>
        )}
      </Container>

      <Footer />
    </div>
  );
};

export default PedidoEnTramite;
