import React from "react";

import { Container, Form, Button, Alert } from "react-bootstrap";

import Menu from "../componets/Menu";
import Carrusel from "../componets/Carrusel";

import Footer from "../componets/Footer";



const Home = () => {

    //localStorage.setItem("url","http://localhost:3000/api/");
    localStorage.setItem("url","https://appartebackend-production.up.railway.app/api/");

    


  return (
   
    <div
 
>
      {/* Navbar */}
      <Menu rol={localStorage.getItem("rol")} />

      
        {/* Bienvenida */}
      <Container className="d-flex flex-column justify-content-center align-items-center mt-4 p-4" style={{ minHeight: "50vh" }}>
        <h1 className="mb-3 text-center">Bienvenido a: Tu Galería de Arte en Línea</h1>
        <h3 className="lead text-center">
          Descubre un mundo lleno de creatividad e inspiración. <strong>APP_ARTE</strong> es una plataforma diseñada para conectar artistas y amantes del arte en un espacio digital único. Aquí puedes explorar, admirar y adquirir obras de arte desde la comodidad de tu hogar.
        </h3>
      </Container>
        
        
     

      {/* Carrusel */}
      <Container className="my-4">
        <Carrusel  />
      </Container>

      {/* Footer */}
      <Footer/>
      </div>
  );
};

export default Home;
