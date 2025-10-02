import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import AgregarUsuario from './components/AgregarUsuario';
import AgregarPago from './components/AgregarPago';
import ConsultaUsuarios from './components/ConsultaUsuarios';
import LoginAdmin from './components/LoginAdmin';
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

  return (
    <Router>
      <div className="app-container">
        <header>
          <nav className="nav-bar">
            <Link to="/agregar">Agregar</Link>
            <Link to="/pago">Pago</Link>
            <Link to="/bd">BD</Link>
            {isAdminLoggedIn && <button onClick={handleLogout}>Cerrar Sesión</button>}
          </nav>
        </header>

        <Routes>
          <Route
            path="/login"
            element={!isAdminLoggedIn ? <LoginAdmin onLogin={handleLogin} /> : <Navigate to="/agregar" />}
          />
          {isAdminLoggedIn && (
            <>
              <Route path="/agregar" element={<AgregarUsuario />} />
              <Route path="/pago" element={<AgregarPago />} />
              <Route path="/bd" element={<ConsultaUsuarios />} />
            </>
          )}
          {!isAdminLoggedIn && <Route path="*" element={<Navigate to="/login" />} />}
        </Routes>
      </div>
    </Router>
  );
};

export default App;
