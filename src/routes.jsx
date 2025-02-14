import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Obras from './pages/Obras';
import Registro from './pages/Registro';
import Inicio from './pages/Inicio';
import ObraEspcifica from './pages/ObraEspecifica';
import Artista from './pages/Artista'
import Contacto from './pages/Contacto';
import EditarPerfil from './pages/EditarPerfil';
import MisObras from './pages/MisObras';
import ObraEditable from './pages/ObraEditable';
import CrearObra from './pages/CrearObras';
import Favoritos from './pages/Favoritos';
import PedidoEnTramite from './pages/PedidoEnTramite';
import Pedidos from './pages/Pedidos';
import AdministarPedidos from './pages/AdministarPedidos';
import AdministarUsuarios from './pages/AdministarUsuarios';
import AdministrarObras from './pages/AdministrarObras';

const AppRoutes = () => {
  return (
    <Router>
        
      <Routes>
        {/* Ruta para la página principal */}
        <Route path="/" element={<Home />} />

        {/* Ruta para el listado de obras */}
        <Route path="/obras" element={<Obras />} />

        {/* Ruta para obras especifica*/}
        <Route path="/obras/:id" element={<ObraEspcifica />} />

        {/* Ruta para obras especifica editable*/}
        <Route path="/obras-editable/:id" element={<ObraEditable />} />

         {/* Ruta para crear obras*/}
         <Route path="/crear-obra" element={<CrearObra />} />

        {/* Ruta para ver obras del artista */}
        <Route path="/mis-obras" element={<MisObras />} />

        {/* Ruta para Artista especifica*/}
        <Route path="/artista/:id" element={<Artista />} />

        {/* Ruta para el formulario de registro */}
        <Route path="/registro" element={<Registro />} />

        {/* Ruta para el formulario de editar perfil */}
        <Route path={`/editar-perfil` }element={<EditarPerfil />} />

        {/* Ruta para lista de favoritos */}
        <Route path="/favoritos" element={<Favoritos />} />

         {/* Ruta para el formulario de contacto */}
         <Route path="/contacto" element={<Contacto />} />

        {/* Ruta para el formulario de inicio sesion */}
        <Route path="/inicio" element={<Inicio />} />

        {/* Ruta para lista de pedidos */}
        <Route path="/pedidos" element={<Pedidos />} />

        {/* Ruta para administrar pedidos */}
        <Route path="/administrar-pedidos" element={<AdministarPedidos />} />

        {/* Ruta para administrar usuarios */}
        <Route path="/administrar-usuarios" element={<AdministarUsuarios />} />

        {/* Ruta para administrar obras */}
        <Route path="/administrar-obras" element={<AdministrarObras />} />

         {/* Ruta para el pedido en tramite */}
         <Route path="/pedido-tramite" element={<PedidoEnTramite />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
