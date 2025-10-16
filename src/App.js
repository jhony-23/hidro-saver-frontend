import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import AgregarUsuario from './components/AgregarUsuario';
import AgregarPago from './components/AgregarPago';
import ConsultaUsuarios from './components/ConsultaUsuarios';
import LoginAdmin from './components/LoginAdmin';
import Dashboard from './components/Dashboard';
import GestionSectores from './components/GestionSectores';
import Reportes from './components/Reportes';
import './App.css';

const App = () => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay token al cargar la app
    const token = localStorage.getItem('adminToken');
    if (token) {
      // Aquí podrías verificar la validez del token con el backend
      setIsAdminLoggedIn(true);
      // Podrías decodificar el token para obtener el rol
      setUserRole('admin');
    }
    setLoading(false);
  }, []);

  const handleLogin = (role = 'admin') => {
    setIsAdminLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setUserRole('');
  };

  if (loading) {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <p>Cargando HidroSaver...</p>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {isAdminLoggedIn && (
          <header className="app-header">
            <div className="header-brand">
              <h1>💧 HidroSaver</h1>
              <span className="user-info">Admin: {userRole}</span>
            </div>
            <nav className="nav-bar">
              <Link to="/dashboard" className="nav-link">
                <span className="nav-icon">📊</span>
                Dashboard
              </Link>
              <Link to="/agregar" className="nav-link">
                <span className="nav-icon">➕</span>
                Agregar Usuario
              </Link>
              <Link to="/pago" className="nav-link">
                <span className="nav-icon">💳</span>
                Procesar Pago
              </Link>
              <Link to="/consulta" className="nav-link">
                <span className="nav-icon">🔍</span>
                Consultar Usuarios
              </Link>
              <Link to="/reportes" className="nav-link">
                <span className="nav-icon">📋</span>
                Reportes
              </Link>
              <Link to="/sectores" className="nav-link">
                <span className="nav-icon">🏘️</span>
                Sectores
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <span className="nav-icon">🚪</span>
                Cerrar Sesión
              </button>
            </nav>
          </header>
        )}

        <main className="app-main">
          <Routes>
            <Route
              path="/login"
              element={!isAdminLoggedIn ? <LoginAdmin onLogin={handleLogin} /> : <Navigate to="/dashboard" />}
            />
            {isAdminLoggedIn ? (
              <>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/agregar" element={<AgregarUsuario />} />
                <Route path="/pago" element={<AgregarPago />} />
                <Route path="/consulta" element={<ConsultaUsuarios />} />
                <Route path="/reportes" element={<Reportes />} />
                <Route path="/sectores" element={<GestionSectores />} />
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<Navigate to="/dashboard" />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
