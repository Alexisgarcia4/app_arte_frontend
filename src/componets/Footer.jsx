import React from 'react'
import {  Link } from "react-router-dom";
import { Container } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-2 mt-lg-2">
        <Container>
          <p className="mb-0">&copy; 2024 Galería de Arte. Todos los derechos reservados.</p>
          <p className="mb-0">
            <Link to="/contacto" className="text-white text-decoration-none">
              Contacto
            </Link>
          </p>
        </Container>
      </footer>
  )
}

export default Footer