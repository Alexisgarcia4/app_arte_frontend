import React, { useState, useEffect } from "react";
import { Carousel } from "react-bootstrap";
import axios from "axios";

const Carrusel = () => {
  const [obras, setObras] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch obras desde el backend con Axios
  const fetchObras = async (page = 1) => {
    try {
      const response = await axios.get("http://localhost:3000/api/obras", {
        params: {
          random: true, // Solicitar obras aleatorias
          limit: 12, // Ajusta el límite de resultados según tus necesidades
        },
      });
      const { obras, totalPages } = response.data;
      setObras(obras || []);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Error al cargar las obras:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchObras(currentPage);
  }, [currentPage]);

  return (
    <div className="carrusel">
      {/* Cambia automáticamente cada 3 segundos */}
      <Carousel interval={3000} fade>
        {obras.map((obra) => (
          <Carousel.Item key={obra.id_obra}>
            <img
              src={obra.imagen_url}
              alt={obra.titulo}
              className="d-block w-100 obra-imagen"
              style={{ maxHeight: "200px", objectFit: "cover" }}
            />
            <Carousel.Caption>
              <h5>{obra.titulo}</h5>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default Carrusel;
