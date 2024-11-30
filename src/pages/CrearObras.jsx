import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";

const CrearObra = () => {
  

    const [formData, setFormData] = useState({
        titulo: "",
        descripcion: "",
        precio: "",
        cantidad: "",
      });
      const [imagen, setImagen] = useState(null); // Imagen de la obra
      const [previewImagen, setPreviewImagen] = useState(null); // Vista previa de la imagen
      const [successMessage, setSuccessMessage] = useState("");
      const [errorMessage, setErrorMessage] = useState("");
    
      // Manejo de cambios en los campos del formulario
      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
      };
    
      // Manejo de cambios en la imagen
      const handleImagenChange = (e) => {
        const file = e.target.files[0];
        setImagen(file);
        setPreviewImagen(URL.createObjectURL(file)); // Mostrar vista previa
      };
    
      // Manejo del envío del formulario
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Validar campos obligatorios
        if (!formData.titulo || !formData.precio || !formData.cantidad || !imagen) {
          setErrorMessage("Por favor, completa todos los campos obligatorios.");
          return;
        }
    
        const data = new FormData();
        data.append("titulo", formData.titulo);
        data.append("descripcion", formData.descripcion);
        data.append("precio", formData.precio);
        data.append("cantidad", formData.cantidad);
        data.append("imagen", imagen);
    
        try {
          const response = await axios.post("http://localhost:3000/api/obras", data, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Agregar token
            },
          });
          setSuccessMessage(response.data.message);
          setErrorMessage("");
          setFormData({
            titulo: "",
            descripcion: "",
            precio: "",
            cantidad: "",
          });
          setImagen(null);
          setPreviewImagen(null);
        } catch (error) {
          console.error("Error al crear obra:", error.response?.data || error.message);
          setSuccessMessage("");
          setErrorMessage(error.response?.data?.message || "Error al crear la obra.");
        }
      };
    
      return (
        <div >
          {/* Navbar */}
          <Menu rol={localStorage.getItem("rol")} />
    
          <Container className="mt-4" style={{ minHeight: "80vh" }}>
            <h1 className="text-center mb-4">Crear Obra</h1>
    
            {successMessage && <Alert variant="success">{successMessage}</Alert>}
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
    
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Columna de datos */}
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
                      rows={3}
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
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
    
                  <Button variant="primary" type="submit">
                    Crear Obra
                  </Button>
                </Col>
    
                {/* Columna de imagen */}
                <Col md={4} className="text-center">
                  <Form.Group controlId="formImagen" className="mb-3">
                    <Form.Label>Subir Imagen</Form.Label>
                    <Form.Control type="file" onChange={handleImagenChange} />
                  </Form.Group>
                  {previewImagen && (
                    <img
                      src={previewImagen}
                      alt="Vista previa"
                      style={{
                        width: "100%",
                        maxHeight: "200px",
                        objectFit: "contain",
                      }}
                    />
                  )}
                </Col>
              </Row>
            </Form>
          </Container>
    
          {/* Footer */}
          <Footer/>
        </div>
      );
    };

export default CrearObra;
