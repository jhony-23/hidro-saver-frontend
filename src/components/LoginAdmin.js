import React, { useState } from 'react';
import axios from 'axios';
import './LoginAdmin.css';

const LoginAdmin = ({ onLogin }) => {
  const [nombre, setNombre] = useState(''); // Cambié 'username' a 'nombre'
  const [contraseña, setContraseña] = useState(''); // Cambié 'password' a 'contraseña'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/admin/login', { nombre, contraseña }); // Cambié 'username' a 'nombre' y 'password' a 'contraseña'
      const { token } = response.data;
      localStorage.setItem('adminToken', token); // Guarda el token en el almacenamiento local
      onLogin(); // Notifica al componente principal que el administrador ha iniciado sesión
    } catch (error) {
      setError('Credenciales incorrectas. Inténtalo nuevamente.');
    }
  };

  return (
    <div className="login-admin">
      <h2>Login Administrador</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={nombre} // Cambié 'username' a 'nombre'
          onChange={(e) => setNombre(e.target.value)} // Cambié 'username' a 'nombre'
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={contraseña} // Cambié 'password' a 'contraseña'
          onChange={(e) => setContraseña(e.target.value)} // Cambié 'password' a 'contraseña'
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default LoginAdmin;
