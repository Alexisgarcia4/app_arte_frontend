import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

const QuantitySelector = ({ max, initial, onChange }) => {
  const [cantidad, setCantidad] = useState(initial || 1);

  const handleDecrement = () => {
    if (cantidad > 0) {
      setCantidad(cantidad - 1);
      onChange(cantidad - 1);
    }
  };

  const handleIncrement = () => {
    if (cantidad < max) {
      setCantidad(cantidad + 1);
      onChange(cantidad + 1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <Button variant="outline-danger" onClick={handleDecrement}>
        -
      </Button>
      <Form.Control
        type="text"
        value={cantidad}
        readOnly
        style={{
          width: "50px",
          textAlign: "center",
          border: "1px solid #ced4da",
          borderRadius: "0.25rem",
        }}
      />
      <Button variant="outline-success" onClick={handleIncrement}>
        +
      </Button>
    </div>
  );
};

export default QuantitySelector;
