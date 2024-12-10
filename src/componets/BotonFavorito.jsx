import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";

const BotonFavorito = ({ idObra }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  // Verificar si la obra está en favoritos al cargar el componente
  useEffect(() => {
    const verificarFavorito = async () => {
      try {
        const response = await axios.get(
          `${localStorage.getItem("url")}favoritos/${idObra}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(response.data.isFavorite);
      } catch (error) {
        console.error("Error al verificar el favorito:", error.response?.data || error.message);
      }
    };

    verificarFavorito();
  }, [idObra]);

  // Manejar el click del botón
  const handleFavoritoClick = async () => {
    setLoading(true);

    try {
      if (isFavorite) {
        // Si está en favoritos, eliminarlo
        await axios.delete(`${localStorage.getItem("url")}favoritos/${idObra}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setIsFavorite(false);
      } else {
        // Si no está en favoritos, añadirlo
        await axios.post(
          `${localStorage.getItem("url")}favoritos/${idObra}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error al gestionar favoritos:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="light" // Un color neutro para que el ícono destaque
      onClick={handleFavoritoClick}
      disabled={loading}
      className="d-flex align-items-center justify-content-center"
      style={{
        border: "none",
        fontSize: "1.5rem", // Aumenta el tamaño del ícono
      }}
    >
      {loading ? (
        "Procesando..."
      ) : isFavorite ? (
        <i className="bi bi-heart-fill text-danger"></i> // Corazón rojo si es favorito
      ) : (
        <i className="bi bi-heart text-dark"></i> // Corazón negro si no es favorito
      )}
    </Button>
  );
};

export default BotonFavorito;
