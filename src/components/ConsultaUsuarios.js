import React, { useState } from 'react';
import axios from 'axios';
import './ConsultaUsuarios.css'; // Importar estilos específicos

const ConsultaUsuarios = () => {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [formEdit, setFormEdit] = useState({ nombre: '', apellido: '', dpi: '', sectorId: '' });

  const handleBuscar = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/usuarios/${codigoBarras}`);
      setUsuarioEncontrado(response.data);
      setFormEdit({
        nombre: response.data.nombre,
        apellido: response.data.apellido,
        dpi: response.data.dpi,
        sectorId: response.data.sectorId,
      });
      setError('');
    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      setUsuarioEncontrado(null);
      setError('Usuario no encontrado.');
    }
  };

  const handleEliminar = async () => {
    try {
      await axios.delete(`http://localhost:3000/usuarios/${codigoBarras}`);
      alert('Usuario eliminado correctamente');
      setUsuarioEncontrado(null);
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
      await axios.put(`http://localhost:3000/usuarios/${codigoBarras}`, formEdit);
      alert('Usuario actualizado correctamente');
      setEditando(false);
      handleBuscar();
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      alert('Hubo un error al actualizar el usuario.');
    }
  };

  const handleChange = (e) => {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value });
  };

  return (
    <div className="consulta-usuarios-container">
      <form className="consulta-usuarios-form">
        <h2>Consulta de Usuarios</h2>
        <input
          type="text"
          placeholder="Código de Barras"
          value={codigoBarras}
          onChange={(e) => setCodigoBarras(e.target.value)}
          required
        />
        <button type="button" onClick={handleBuscar}>
          Buscar
        </button>
      </form>

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
              <input
                name="sectorId"
                value={formEdit.sectorId}
                onChange={handleChange}
                placeholder="ID del Sector"
                required
              />
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
