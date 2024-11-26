import React from "react";
import { useForm } from "react-hook-form";
import { Container, Form, Button, Alert } from "react-bootstrap";
import axios from "axios";
import Menu from "../componets/Menu";
import Carrusel from "../componets/Carrusel";
import { useNavigate } from "react-router-dom";

const Home = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [apiError, setApiError] = React.useState("");

  const navigate = useNavigate();

  // Manejar el formulario de inicio de sesión
  const onSubmit = async (data) => {
    setApiError("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/usuarios/login",
        {
          email: data.email,
          password: data.password,
        }
      );

      // Guardar token y usuario en localStorage
      const { token, usuario } = response.data;
      localStorage.setItem("token", token);
      console.log(localStorage.getItem("token"));

      // Guardar el ID del usuario y su rol por separado
      localStorage.setItem("id_usuario", usuario.id_usuario);
      localStorage.setItem("rol", usuario.rol);

      navigate('/obras');

      // Comprobación
      console.log(localStorage.getItem("id_usuario")); // ID del usuario
      console.log(localStorage.getItem("rol")); // Rol del usuario

      
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Error al conectar con el servidor."
      );
    }
  };

  return (
    <>
      {/* Navbar */}
      <Menu rol={""} />

      {/* Formulario de Login */}
      <Container className="d-flex justify-content-center align-items-center mt-4" style={{ minHeight: "40vh" }}>
        <div
          className="p-4 border border-dark rounded shadow"
          style={{ width: "100%", maxWidth: "400px", background: "#f8f9fa" }}
        >
          <h1 className="text-center mb-3">Iniciar Sesión</h1>

          {/* Mensaje de error */}
          {apiError && <Alert variant="danger">{apiError}</Alert>}

          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3">
              <Form.Label>Correo Electrónico</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingresa tu correo"
                {...register("email", { required: "El correo es obligatorio" })}
              />
              {errors.email && (
                <Form.Text className="text-danger">
                  {errors.email.message}
                </Form.Text>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                placeholder="Ingresa tu contraseña"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && (
                <Form.Text className="text-danger">
                  {errors.password.message}
                </Form.Text>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Iniciar Sesión
            </Button>
          </Form>
        </div>
      </Container>

      {/* Carrusel */}
      <Container className="my-4">
        <Carrusel apiEndpoint="http://localhost:3000/api/obras" />
      </Container>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3">
        <Container>
          <p className="mb-0">
            &copy; 2024 Galería de Arte. Todos los derechos reservados.
          </p>
          <p className="mb-0">
            
            <a href="/contacto" className="text-white text-decoration-none">
              Contacto
            </a>
          </p>
        </Container>
      </footer>
    </>
  );
};

export default Home;
