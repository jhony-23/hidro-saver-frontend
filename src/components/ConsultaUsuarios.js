import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ConsultaUsuarios.css';

const ConsultaUsuarios = () => {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [sectores, setSectores] = useState([]);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({ nombre: '', apellido: '', dpi: '', sectorId: '' });
  const [filtros, setFiltros] = useState({ search: '', sector: '', page: 1, limit: 10 });
  const [vistaActual, setVistaActual] = useState('busqueda'); // 'busqueda' o 'lista'
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarSectores();
    if (vistaActual === 'lista') {
      cargarUsuarios();
    }
  }, [vistaActual, filtros]);

  const cargarSectores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/sectores');
      setSectores(response.data);
    } catch (error) {
      console.error('Error al cargar sectores:', error);
    }
  };

  const cargarUsuarios = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams();
      if (filtros.search) params.append('search', filtros.search);
      if (filtros.sector) params.append('sector', filtros.sector);
      params.append('page', filtros.page);
      params.append('limit', filtros.limit);

      const response = await axios.get(`http://localhost:3000/usuarios?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarios(response.data.usuarios || response.data);
      setError('');
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError('Error al cargar la lista de usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleBuscar = async () => {
    if (!codigoBarras.trim()) {
      setError('Ingrese un código de barras');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`http://localhost:3000/usuarios/${codigoBarras}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsuarioEncontrado(response.data);
      setFormEdit({
        nombre: response.data.nombre,
        apellido: response.data.apellido,
        dpi: response.data.dpi,
        sectorId: response.data.sector_id,
      });
      setError('');
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      setUsuarioEncontrado(null);
      setError('Usuario no encontrado.');
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id = null) => {
    const usuarioId = id || codigoBarras;
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:3000/usuarios/${usuarioId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Usuario eliminado correctamente');
      setUsuarioEncontrado(null);
      if (vistaActual === 'lista') {
        cargarUsuarios();
      }
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      alert('Hubo un error al eliminar el usuario.');
    }
  };

  const handleEditar = () => {
    setEditando(true);
  };

  const handleCancelar = () => {
    setEditando(false);
  };

  const handleGuardarCambios = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.put(`http://localhost:3000/usuarios/${usuarioEncontrado.id}`, formEdit, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Usuario actualizado correctamente');
      setEditando(false);
      handleBuscar();
      if (vistaActual === 'lista') {
        cargarUsuarios();
      }
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Hubo un error al actualizar el usuario.');
    }
  };

  const handleChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  const renderVistaLista = () => (
    <div className="lista-usuarios">
      <div className="filtros-lista">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o DPI..."
          value={filtros.search}
          onChange={(e) => setFiltros({ ...filtros, search: e.target.value, page: 1 })}
        />
        <select
          value={filtros.sector}
          onChange={(e) => setFiltros({ ...filtros, sector: e.target.value, page: 1 })}
        >
          <option value="">Todos los sectores</option>
          {sectores.map(sector => (
            <option key={sector.id} value={sector.id}>{sector.nombre}</option>
          ))}
        </select>
        <button onClick={cargarUsuarios} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {usuarios.length > 0 ? (
        <div className="tabla-usuarios">
          <table>
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DPI</th>
                <th>Sector</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(usuario => (
                <tr key={usuario.id}>
                  <td>{usuario.codigo_barras}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.apellido}</td>
                  <td>{usuario.dpi}</td>
                  <td>{usuario.sector_nombre || 'N/A'}</td>
                  <td>
                    <button 
                      onClick={() => {
                        setUsuarioEncontrado(usuario);
                        setFormEdit({
                          nombre: usuario.nombre,
                          apellido: usuario.apellido,
                          dpi: usuario.dpi,
                          sectorId: usuario.sector_id
                        });
                        setVistaActual('busqueda');
                      }}
                      className="btn-ver"
                    >
                      Ver/Editar
                    </button>
                    <button 
                      onClick={() => handleEliminar(usuario.id)}
                      className="btn-eliminar"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-usuarios">No se encontraron usuarios</div>
      )}
    </div>
  );

  return (
    <div className="consulta-usuarios-container">
      <div className="vista-selector">
        <button 
          className={vistaActual === 'busqueda' ? 'active' : ''}
          onClick={() => setVistaActual('busqueda')}
        >
          Búsqueda Individual
        </button>
        <button 
          className={vistaActual === 'lista' ? 'active' : ''}
          onClick={() => setVistaActual('lista')}
        >
          Lista de Usuarios
        </button>
      </div>

      {vistaActual === 'busqueda' ? (
        <div>
          <form className="consulta-usuarios-form">
            <h2>Búsqueda por Código de Barras</h2>
            <input
              type="text"
              placeholder="Código de Barras"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
              required
            />
            <button type="button" onClick={handleBuscar} disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>
      ) : (
        renderVistaLista()
      )}

      {error && <p className="error-message">{error}</p>}

      {usuarioEncontrado && (
        <div className="usuario-info">
          <h3>
            {usuarioEncontrado.nombre} {usuarioEncontrado.apellido}
          </h3>
          <p>
            <strong>Sector:</strong> {usuarioEncontrado.Sector?.NombreSector}
          </p>
          <p>
            <strong>Descripción del Sector:</strong> {usuarioEncontrado.Sector?.Descripcion}
          </p>
          <p>
            <strong>DPI:</strong> {usuarioEncontrado.dpi}
          </p>

          {editando ? (
            <div className="form-editar">
              <input name="nombre" value={formEdit.nombre} onChange={handleChange} placeholder="Nombre" required />
              <input name="apellido" value={formEdit.apellido} onChange={handleChange} placeholder="Apellido" required />
              <input name="dpi" value={formEdit.dpi} onChange={handleChange} placeholder="DPI" required />
              <select name="sectorId" value={formEdit.sectorId} onChange={handleChange} required>
                <option value="">Seleccione un sector</option>
                {sectores.map(sector => (
                  <option key={sector.id} value={sector.id}>
                    {sector.nombre} - {sector.descripcion}
                  </option>
                ))}
              </select>
              <button onClick={handleGuardarCambios}>Guardar Cambios</button>
              <button onClick={handleCancelar}>Cancelar</button>
            </div>
          ) : (
            <div className="acciones-usuario">
              <button onClick={handleEditar}>Modificar</button>
              <button onClick={handleEliminar}>Eliminar</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ConsultaUsuarios;
