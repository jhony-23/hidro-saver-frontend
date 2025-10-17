import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import AgregarUsuario from './components/AgregarUsuario';
import AgregarPago from './components/AgregarPago';
import ConsultaUsuarios from './components/ConsultaUsuarios';
import LoginAdmin from './components/LoginAdmin';
import RecuperarPassword from './components/RecuperarPassword';
import './App.css';

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
  };

  // Validar token al arrancar la app: si es válido, mantener sesión; si no, limpiar y forzar login
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsAdminLoggedIn(false);
      return;
    }
    axios
      .get('/admin/perfil')
      .then(() => setIsAdminLoggedIn(true))
      .catch(() => {
        localStorage.removeItem('adminToken');
        setIsAdminLoggedIn(false);
      });
  }, []);

  return (
    <Router>
      <div className="app-container">
        {isAdminLoggedIn && (
          <header>
            <nav className="nav-bar">
              <Link to="/agregar">Agregar</Link>
              <Link to="/pago">Pago</Link>
              <Link to="/bd">BD</Link>
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </nav>
          </header>
        )}

        <Routes>
          <Route
            path="/login"
            element={!isAdminLoggedIn ? <LoginAdmin onLogin={handleLogin} /> : <Navigate to="/agregar" />}
          />
          <Route path="/recuperar" element={<RecuperarPassword />} />
          {isAdminLoggedIn && (
            <>
              <Route path="/agregar" element={<AgregarUsuario />} />
              <Route path="/pago" element={<AgregarPago />} />
              <Route path="/bd" element={<ConsultaUsuarios />} />
            </>
          )}
          {!isAdminLoggedIn && (
            <>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
