import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const BotonPedido = ({ idObra, onUpdate }) => {
  const [enCarrito, setEnCarrito] = useState(false);

  // Verificar si la obra está en el carrito al montar el componente
  useEffect(() => {
    try {
      const carritoRaw = localStorage.getItem("carrito");
      const carrito = carritoRaw ? JSON.parse(carritoRaw) : [];
      setEnCarrito(carrito.some((item) => item.id_obra === idObra));
    } catch (error) {
      console.error("Error al leer el carrito de localStorage:", error);
      localStorage.setItem("carrito", JSON.stringify([])); // Inicializar carrito vacío en caso de error
    }
  }, [idObra]);

  // Manejar la lógica para agregar al carrito si no está
  const manejarCarrito = () => {
    try {
      const carritoRaw = localStorage.getItem("carrito");
      const carrito = carritoRaw ? JSON.parse(carritoRaw) : [];
      // Verificar si el ID de la obra ya está en el carrito
      const existe = carrito.some((item) => item.id_obra === idObra);

      if (!existe) {
        // Agregar al carrito con cantidad predeterminada de 1
        carrito.push({ id_obra: idObra, cantidad: 1 });
        localStorage.setItem("carrito", JSON.stringify(carrito));
        setEnCarrito(true);

        console.log(localStorage.getItem("carrito"))

        // Notificar el cambio
        if (onUpdate) onUpdate();
        
      }
    } catch (error) {
      console.error("Error al manejar el carrito:", error);
    }
  };

  return (
    <Button
      variant={enCarrito ? "success" : "secondary"}
      onClick={manejarCarrito}
      className="d-flex align-items-center justify-content-center mt-3"
    >
      <i
        className={`bi ${enCarrito ? "bi-cart-check-fill" : "bi-cart-plus"}`}
        style={{ fontSize: "1.5rem" }}
      ></i>
    </Button>
  );
};

export default BotonPedido;
