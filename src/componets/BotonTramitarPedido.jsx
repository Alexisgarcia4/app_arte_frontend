import React from "react";
import { Button } from "react-bootstrap";

const BotonTramitarPedido = () => {
  // Comprobar si hay elementos en el carrito
  const carrito = JSON.parse(localStorage.getItem("carrito") || "[]"); // Asegura que nunca sea null
  const tieneCarrito = carrito.length > 0;

  const manejarClick = (e) => {
    if (!tieneCarrito) {
      e.preventDefault(); // Evitar la navegación si el carrito está vacío
      alert("No tienes productos en el carrito.");
    }
  };

  return (
    <Button
      variant="success" 
      href={tieneCarrito ? "/pedido-tramite" : "#"}
      onClick={manejarClick}
      
    >
      <i
        className={`bi ${
          tieneCarrito ? "bi-cart-check-fill" : "bi-cart-x-fill"
        }`}
        style={{ fontSize: "1.2rem" }}
      ></i>
    </Button>
  );
};

export default BotonTramitarPedido;
