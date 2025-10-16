import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './LoginAdmin.css';

const LoginAdmin = ({ onLogin }) => {
  const [nombre, setNombre] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [confirmarContraseña, setConfirmarContraseña] = useState('');
  const [error, setError] = useState('');
  const [isFirstAdmin, setIsFirstAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminExists();
  }, []);

  const checkAdminExists = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/check-admin');
      setIsFirstAdmin(!response.data.adminExists);
    } catch (error) {
      console.error('Error verificando administradores:', error);
      setIsFirstAdmin(true); // Asumir que no hay admins si hay error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isFirstAdmin) {
      // Crear primer administrador
      if (contraseña !== confirmarContraseña) {
        setError('Las contraseñas no coinciden.');
        return;
      }
      if (contraseña.length < 6) {
        setError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      try {
        await axios.post('http://localhost:3000/auth/register-admin', { 
          nombre, 
          contraseña 
        });
        alert('Primer administrador creado exitosamente. Ya puedes iniciar sesión.');
        setIsFirstAdmin(false);
        setConfirmarContraseña('');
      } catch (error) {
        setError(error.response?.data?.message || 'Error al crear administrador.');
      }
    } else {
      // Login normal
      try {
        const response = await axios.post('http://localhost:3000/auth/login', { nombre, contraseña });
        const { token } = response.data;
        localStorage.setItem('adminToken', token);
        onLogin();
      } catch (error) {
        setError('Credenciales incorrectas. Inténtalo nuevamente.');
      }
    }
  };

  if (loading) {
    return (
      <div className="login-admin">
        <div className="loading">Verificando sistema...</div>
      </div>
    );
  }

  return (
    <div className="login-admin">
      <h2>{isFirstAdmin ? 'Crear Primer Administrador' : 'Login Administrador'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />
        {isFirstAdmin && (
          <input
            type="password"
            placeholder="Confirmar Contraseña"
            value={confirmarContraseña}
            onChange={(e) => setConfirmarContraseña(e.target.value)}
            required
          />
        )}
        <button type="submit">
          {isFirstAdmin ? 'Crear Administrador' : 'Iniciar Sesión'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
      {isFirstAdmin && (
        <div className="info-message">
          <p>🔐 No hay administradores en el sistema.</p>
          <p>Crea el primer administrador para comenzar.</p>
        </div>
      )}
    </div>
  );
};

export default LoginAdmin;
