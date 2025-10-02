import React, { useState } from 'react';
import axios from 'axios';
import './AgregarUsuario.css';

const AgregarUsuario = () => {
  const [form, setForm] = useState({ nombre: '', apellido: '', dpi: '', sectorId: '' });
  const [usuarioAgregado, setUsuarioAgregado] = useState(null); // Nuevo estado para almacenar el usuario agregado

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/usuarios/agregar', form);
      setUsuarioAgregado(response.data.usuario); // Guardar el usuario agregado en el estado
      setForm({ nombre: '', apellido: '', dpi: '', sectorId: '' }); // Resetear el formulario
    } catch (error) {
      console.error('Error al agregar usuario:', error);
      alert('Hubo un error al agregar el usuario.');
    }
  };

  const handleImprimir = () => {
    const printContent = document.getElementById('usuarioResumen').innerHTML;
    const newWindow = window.open('', '', 'width=600,height=600');
    newWindow.document.write(printContent);
    newWindow.document.close();
    newWindow.print();
  };

  const handleDescargar = () => {
    const element = document.getElementById('usuarioResumen');
    const content = element.innerText;
    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Resumen_Usuario.txt';
    link.click();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="agregar-usuario-form">
        <h2 className="form-title">Agregar Usuario</h2>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            id="nombre"
            className="form-input"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido:</label>
          <input
            id="apellido"
            className="form-input"
            name="apellido"
            value={form.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="dpi">DPI:</label>
          <input
            id="dpi"
            className="form-input"
            name="dpi"
            value={form.dpi}
            onChange={handleChange}
            placeholder="DPI"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="sectorId">ID del Sector:</label>
          <input
            id="sectorId"
            className="form-input"
            name="sectorId"
            value={form.sectorId}
            onChange={handleChange}
            placeholder="ID del Sector"
            required
          />
        </div>
        <button type="submit" className="form-button">
          Agregar Usuario
        </button>
      </form>

      {usuarioAgregado && (
        <div id="usuarioResumen" className="usuario-resumen">
          <h3>Resumen del Usuario Agregado</h3>
          <p><strong>Nombre:</strong> {usuarioAgregado.nombre}</p>
          <p><strong>Apellido:</strong> {usuarioAgregado.apellido}</p>
          <p><strong>DPI:</strong> {usuarioAgregado.dpi}</p>
          <p><strong>ID del Sector:</strong> {usuarioAgregado.sectorId}</p>
          <p><strong>Código de Barras:</strong> {usuarioAgregado.CodigoBarras}</p>
          <div>
            <button onClick={handleImprimir} className="form-button">Imprimir Resumen</button>
            <button onClick={handleDescargar} className="form-button">Descargar Resumen</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarUsuario;
