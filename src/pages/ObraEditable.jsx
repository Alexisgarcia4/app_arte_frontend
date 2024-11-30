import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";
const ObraEditable = () => {
  const { id } = useParams(); // Obtener el ID de la obra desde la URL
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    cantidad: "",
    precio: "",
    activo: true,
  });
  const [imagen, setImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch la obra específica desde la API
  useEffect(() => {
    const fetchObra = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/obras/${id}`);
        const obra = response.data.obra;
        setFormData({
          titulo: obra.titulo,
          descripcion: obra.descripcion || "",
          cantidad: obra.cantidad,
          precio: obra.precio,
          
        });
        setPreviewImagen(obra.imagen_url);
        setLoading(false);
      } catch (err) {
        setErrorMessage("No se pudo cargar la obra. Por favor, inténtalo de nuevo más tarde.");
        setLoading(false);
      }
    };

    fetchObra();
  }, [id]);

  // Manejo de cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Manejo de cambio en la imagen
  const handleImagenChange = (e) => {
    const file = e.target.files[0];
    setImagen(file);
    setPreviewImagen(URL.createObjectURL(file)); // Mostrar vista previa
  };

  // Actualizar datos de la obra
  const handleUpdateObra = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:3000/api/obras/datos/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage("Obra actualizada correctamente.");
    } catch (error) {
      console.error("Error al actualizar la obra:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Error al actualizar la obra.");
    }
  };

  // Actualizar imagen de la obra
  const handleUpdateImagen = async () => {
    if (!imagen) {
      setErrorMessage("Por favor, selecciona una imagen.");
      return;
    }
  
    const data = new FormData();
    data.append("imagen_url", imagen); // El nombre "imagen_url" debe coincidir con el backend
  
    try {
      const response = await axios.put(
        `http://localhost:3000/api/obras/imagen/${id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setSuccessMessage(response.data.message);
      setPreviewImagen(response.data.imagen_url); // Actualizar vista previa
    } catch (error) {
      console.error("Error al actualizar imagen:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Error al actualizar la imagen.");
    }
  };
  

  if (loading) return <p className="text-center mt-4">Cargando...</p>;
  if (errorMessage) return <p className="text-center text-danger mt-4">{errorMessage}</p>;

  return (
    <div >
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Editar Obra</h1>
        {successMessage && <Alert variant="success">{successMessage}</Alert>}
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

        <Form onSubmit={handleUpdateObra}>
          <Row>
            {/* Columna de la Imagen */}
            <Col md={4} className="text-center mb-4">
              <img
                src={previewImagen || "/default-image.png"}
                alt="Vista previa"
                style={{
                  width: "100%",
                  height: "auto",
                  maxHeight: "200px",
                  objectFit: "contain",
                }}
              />
              <Form.Group controlId="formImagen" className="mt-3">
                <Form.Label>Cambiar Imagen</Form.Label>
                <Form.Control type="file" onChange={handleImagenChange} />
              </Form.Group>
              <Button variant="primary" className="mt-3" onClick={handleUpdateImagen}>
                Actualizar Imagen
              </Button>
            </Col>

            {/* Columna de los Datos */}
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  name="titulo"
                  value={formData.titulo}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="descripcion"
                  rows={3}
                  value={formData.descripcion}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Precio (€)</Form.Label>
                <Form.Control
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              

              <Button variant="primary" type="submit">
                Guardar Cambios
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>

      {/* Footer */}
      <Footer/>
    </div>
  );
};

export default ObraEditable;
