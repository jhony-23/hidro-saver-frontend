import React, { useState } from 'react';
import axios from 'axios';
import ResumenTransaccion from './ResumenTransaccion';
import './AgregarPago.css'; // Importar estilos específicos

const AgregarPago = () => {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [mes, setMes] = useState('');
  const [monto, setMonto] = useState('');
  const [resumen, setResumen] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3000/pagos', { CodigoBarras: codigoBarras, mes, monto });
      setResumen(response.data.resumen);
      setCodigoBarras('');
      setMes('');
      setMonto('');
    } catch (error) {
      console.error('Error al realizar el pago:', error);
      alert('Hubo un error al procesar el pago.');
    }
  };

  const handlePrint = () => {
    const printContent = `
      <div>
        <h3>Resumen de la Transacción</h3>
        <p>Nombre: ${resumen.nombreUsuario}</p>
        <p>Sector: ${resumen.sectorNombre}</p>
        <p>Descripción del Sector: ${resumen.sectorDescripcion}</p>
        <p>Monto Pagado: ${resumen.monto}</p>
        <p>Mes Cancelado: ${resumen.mesCancelado}</p>
      </div>
    `;

    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Imprimir Resumen</title></head><body>');
    printWindow.document.write(printContent);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="pago-container">
      <form onSubmit={handleSubmit} className="pago-form">
        <h2>Realizar Pago</h2>
        <input
          value={codigoBarras}
          onChange={(e) => setCodigoBarras(e.target.value)}
          placeholder="Código de Barras"
          required
        />
        <input
          value={mes}
          onChange={(e) => setMes(e.target.value)}
          placeholder="Mes"
          required
        />
        <input
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Monto"
          required
        />
        <button type="submit">Realizar Pago</button>
      </form>
      {resumen && (
        <div>
          <ResumenTransaccion resumen={resumen} />
          <button onClick={handlePrint} className="imprimir-btn">Imprimir Resumen</button>
        </div>
      )}
    </div>
  );
};

export default AgregarPago;
