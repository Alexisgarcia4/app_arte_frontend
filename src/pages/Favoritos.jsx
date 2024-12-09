import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";
import BotonFavorito from "../componets/BotonFavorito";
import axios from "axios";
import { Link } from "react-router-dom";

const Favoritos = () => {
  const [favoritos, setFavoritos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const response = await axios.get(`${localStorage.getItem("url")}favoritos`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Incluye el token en la solicitud
          },
        });
        setFavoritos(response.data.obras || []);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener favoritos:", error.response?.data || error.message);
        setErrorMessage(error.response?.data?.message || "Error al cargar favoritos.");
        setLoading(false);
      }
    };

    fetchFavoritos();
  }, []);

  if (loading) {
    return <p className="text-center mt-4">Cargando favoritos...</p>;
  }

 

  return (
    <div
    
    >
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Mis Favoritos</h1>

        {errorMessage ? (
  <h3 className="text-center mb-4 text-danger">{errorMessage}</h3>
) : favoritos.length === 0 ? (
    <h3 className="text-center mb-4">No tiene obras en favoritos</h3>
  
) : (
  <Row>
    {favoritos.map((obra) => (
      <Col key={obra.id_obra} xs={12} sm={6} lg={4} className="mb-4">
        <Card
          className="shadow-sm"
          style={{
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
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
              <strong>Autor:</strong> {obra.artista || "Desconocido"} <br />
              <strong>Precio:</strong> {obra.precio} €
            </Card.Text>
            <BotonFavorito idObra={obra.id_obra} />
          </Card.Body>
        </Card>
      </Col>
    ))}
  </Row>
)}


        
      </Container>

      <Footer />
    </div>
  );
};

export default Favoritos;
