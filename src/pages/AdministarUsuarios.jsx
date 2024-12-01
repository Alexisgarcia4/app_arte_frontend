

import React from "react";
import Menu from "../componets/Menu";
import Footer from "../componets/Footer";
import { Container, Form, Button, Alert } from "react-bootstrap";

const AdministarUsuarios = () => {
  return (
    <div>
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      <Container className="mt-4" style={{ minHeight: "80vh" }}>
        <h1 className="text-center mb-4">Administar Usuarios</h1>
      </Container>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AdministarUsuarios;
