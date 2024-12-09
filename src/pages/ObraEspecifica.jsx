import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; // Para obtener parámetros de la ruta y crear enlaces
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";
import BotonFavorito from "../componets/BotonFavorito";

import BotonPedido from "../componets/BotonPedido";

const ObraEspcifica = () => {
  const { id } = useParams(); // Obtener el ID de la obra desde la URL
  const [obra, setObra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updateTrigger, setUpdateTrigger] = useState(false);

  // Fetch la obra específica desde la API
  useEffect(() => {
    const fetchObra = async () => {
      try {
        const response = await axios.get(
          `${localStorage.getItem("url")}obras/${id}`
        );
        setObra(response.data.obra); // Supone que la API devuelve un objeto obra
        setLoading(false);
      } catch (err) {
        setError(
          "No se pudo cargar la obra. Por favor, inténtalo de nuevo más tarde."
        );
        setLoading(false);
      }
    };

    fetchObra();
  }, [id, updateTrigger]);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;
  if (!obra) return <p className="text-center mt-4">Obra no encontrada.</p>;

  const handleUpdate = () => {
    setUpdateTrigger(!updateTrigger); // Alternar el estado para forzar re-render
  };

  return (
    <div>
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <Card>
          <Row className="g-0">
            {/* Columna de la Imagen */}
            <Col xs={12} lg={6}>
              <Card.Img
                variant="top"
                src={obra.imagen_url}
                alt={obra.titulo}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
              />
            </Col>

            {/* Columna de los Datos */}
            <Col xs={12} lg={6} className="d-flex align-items-center">
              <Card.Body>
                <Card.Title className="text-center mb-3">
                  {obra.titulo}
                </Card.Title>
                <Card.Text>
                  <ul className="list-unstyled">
                    <li>
                      <Link
                        to={`/artista/${obra.id_autor}`}
                        style={{
                          textDecoration: "underline",
                          color: "inherit",
                        }}
                      >
                        <strong>Autor:</strong>{" "}
                        {obra.Usuario?.nick || "Desconocido"}
                      </Link>
                    </li>
                    <li>
                      <strong>Descripción:</strong>
                      <p style={{ margin: "0.5rem 0", fontStyle: "italic" }}>
                        {obra.descripcion || "Sin descripción"}
                      </p>
                    </li>
                    <li>
                      <strong>Cantidad disponible:</strong> {obra.cantidad} ud.
                    </li>
                  </ul>
                  <div className="text-center mt-3">
                    <h4>
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        {obra.precio} €
                      </span>
                    </h4>
                  </div>
                </Card.Text>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "5rem",
                    marginTop: "2rem",
                  }}
                >
                  {(localStorage.getItem("rol") === "artista" ||
                    localStorage.getItem("rol") === "usuario") && (
                    <BotonFavorito idObra={obra.id_obra} />
                  )}
                  {(localStorage.getItem("rol") === "artista" ||
                    localStorage.getItem("rol") === "usuario") &&
                    obra.cantidad > 0 && (
                      <BotonPedido
                        idObra={obra.id_obra}
                        onUpdate={handleUpdate}
                      />
                    )}
                </div>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ObraEspcifica;
