import React from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import BotonTramitarPedido from "./BotonTramitarPedido";

const Menu = ({ rol }) => {
  const cerrarSecion = () => {
    localStorage.clear();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="/">Galería de Arte</Navbar.Brand>
        <Navbar.Toggle aria-controls="menu-navbar" />
        <Navbar.Collapse id="menu-navbar">
          <Nav className="me-auto d-flex align-items-center">
            {/* Botones comunes a todos los usuarios */}
            {rol === null && (
              <>
                <Nav.Link href="/inicio">Login</Nav.Link>
                <Nav.Link href="/registro">Registro</Nav.Link>
                <Nav.Link href="/obras">Obras</Nav.Link>
              </>
            )}

            {/* Opciones según el rol */}
            {rol === "usuario" && (
              <>
                <Nav.Link href="/obras">Obras</Nav.Link>
                <Nav.Link href="/favoritos">Favoritos</Nav.Link>
                <Nav.Link href="/pedidos">Pedidos</Nav.Link>
                <Nav.Link href="/editar-perfil">Editar Perfil</Nav.Link>
              </>
            )}
            {rol === "artista" && (
              <>
                <Nav.Link href="/obras">Obras</Nav.Link>
                <Nav.Link href="/favoritos">Favoritos</Nav.Link>
                <Nav.Link href="/pedidos">Pedidos</Nav.Link>
                <Nav.Link href="/mis-obras">Mis Obras</Nav.Link>
                <Nav.Link href="/crear-obra">Crear Obra</Nav.Link>
                <Nav.Link href="/editar-perfil">Editar Perfil</Nav.Link>
              </>
            )}
            {rol === "administrador" && (
              <>
                <Nav.Link href="/administrar-usuarios">
                  Gestionar Usuarios
                </Nav.Link>
                <Nav.Link href="/administrar-obras">Gestionar Obras</Nav.Link>
                
                <Nav.Link href="/administrar-pedidos">Completar Pedido</Nav.Link>
              </>
            )}
          </Nav>
           <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-start", gap: "5rem", marginTop: ".5rem" }}>
          {/* Botón de cerrar sesión */}
          {rol && (
            <Button
              variant="outline-danger"
              href="/"
              
              onClick={cerrarSecion}
            >
              Cerrar Sesión
            </Button>

            
          )}

          {(rol==="usuario"|| rol ==="artista") && (
            
          <BotonTramitarPedido />

          )}

          
          </div> 
            
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Menu;
