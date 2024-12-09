import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Para obtener parámetros de la ruta
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";

const Artista = () => {
  const { id } = useParams(); // Obtener el ID del artista
  const [artista, setArtista] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch información del artista
  useEffect(() => {
    const fetchArtista = async () => {
      try {
        const response = await axios.get(`${localStorage.getItem("url")}usuarios/artista/${id}`);
        setArtista(response.data.artista); // Supone que la API devuelve un objeto `artista`
        setLoading(false);
      } catch (err) {
        setError("Error al cargar la información del artista.");
        setLoading(false);
      }
    };

    fetchArtista();
  }, [id]);

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (error) return <p className="text-center text-danger mt-4">{error}</p>;
  if (!artista) return <p className="text-center mt-4">Artista no encontrado.</p>;

  return (
    <div >
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <Card>
          <Row className="g-0">
            {/* Columna de la Imagen */}
            <Col xs={12} lg={6}>
              <Card.Img
                variant="top"
                src={artista.imagen_perfil } // Imagen del artista o avatar predeterminado
                alt={artista.nick}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover", // Mantiene las proporciones de la imagen
                }}
              />
            </Col>

            {/* Columna de los Detalles */}
            <Col xs={12} lg={6} className="d-flex align-items-center">
              <Card.Body>
                <Card.Title className="text-center mb-3">{artista.nick}</Card.Title>
                <Card.Text>
                  <ul className="list-unstyled">
                    <li>
                      <strong>Nombre:</strong> {artista.nombre || "No disponible"}
                    </li>
                    <li>
                      <strong>Correo:</strong> {artista.email || "No disponible"}
                    </li>
                    <li>
                      <strong>Descripción:</strong>
                      <p style={{ margin: "0.5rem 0", fontStyle: "italic" }}>
                        {artista.descripcion || "Sin biografía"}
                      </p>
                    </li>
                    
                  </ul>
                </Card.Text>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </Container>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default Artista;
