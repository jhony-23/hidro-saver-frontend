import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './GestionSectores.css';

const GestionSectores = () => {
  const [sectores, setSectores] = useState([]);
  const [nuevoSector, setNuevoSector] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    cargarSectores();
  }, []);

  const cargarSectores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/sectores');
      setSectores(response.data);
    } catch (error) {
      setError('Error al cargar sectores');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoSector.nombre.trim()) {
      setError('El nombre del sector es requerido');
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      await axios.post('http://localhost:3000/sectores', nuevoSector, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNuevoSector({ nombre: '', descripcion: '' });
      cargarSectores();
      setError('');
      alert('Sector creado exitosamente');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al crear sector');
    }
  };

  const handleEliminarSector = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este sector?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:3000/sectores/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarSectores();
      alert('Sector eliminado exitosamente');
    } catch (error) {
      setError(error.response?.data?.message || 'Error al eliminar sector');
    }
  };

  if (loading) return <div className="loading">Cargando sectores...</div>;

  return (
    <div className="gestion-sectores">
      <h2>Gestión de Sectores</h2>
      
      {/* Formulario para crear nuevo sector */}
      <div className="crear-sector">
        <h3>Crear Nuevo Sector</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre del Sector:</label>
            <input
              type="text"
              value={nuevoSector.nombre}
              onChange={(e) => setNuevoSector({ ...nuevoSector, nombre: e.target.value })}
              placeholder="Ej: Sector Norte"
              required
            />
          </div>
          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              value={nuevoSector.descripcion}
              onChange={(e) => setNuevoSector({ ...nuevoSector, descripcion: e.target.value })}
              placeholder="Descripción del sector..."
              rows="3"
            />
          </div>
          <button type="submit" className="btn-crear">Crear Sector</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {/* Lista de sectores existentes */}
      <div className="lista-sectores">
        <h3>Sectores Existentes</h3>
        {sectores.length === 0 ? (
          <p>No hay sectores registrados</p>
        ) : (
          <div className="sectores-grid">
            {sectores.map(sector => (
              <div key={sector.id} className="sector-card">
                <div className="sector-info">
                  <h4>{sector.nombre}</h4>
                  <p>{sector.descripcion || 'Sin descripción'}</p>
                  <small>ID: {sector.id}</small>
                </div>
                <div className="sector-actions">
                  <button 
                    onClick={() => handleEliminarSector(sector.id)}
                    className="btn-eliminar"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestionSectores;