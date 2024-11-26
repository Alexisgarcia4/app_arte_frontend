import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Obras from './pages/Obras';
import Registro from './pages/Registro';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/" element={<Home />} />

        {/* Ruta para el listado de obras */}
        <Route path="/obras" element={<Obras />} />

        {/* Ruta para el formulario de registro */}
        <Route path="/registro" element={<Registro />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
