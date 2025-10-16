import React, { useState } from 'react';
import axios from 'axios';
import ResumenTransaccion from './ResumenTransaccion';
import './AgregarPago.css'; // Importar estilos específicos

const AgregarPago = () => {
  const [codigoBarras, setCodigoBarras] = useState('');
  const [mes, setMes] = useState('');
  const [monto, setMonto] = useState('');
  const [resumen, setResumen] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Establecer mes actual por defecto
  React.useEffect(() => {
    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    setMes(mesActual);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (!codigoBarras.trim()) {
      setError('El código de barras es requerido');
      setLoading(false);
      return;
    }
    
    if (!mes) {
      setError('Debe seleccionar un mes');
      setLoading(false);
      return;
    }

    if (!monto || parseFloat(monto) <= 0) {
      setError('El monto debe ser mayor a 0');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post('http://localhost:3000/pagos', { 
        codigoBarras, 
        mes, 
        monto: parseFloat(monto)
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setResumen(response.data.resumen);
      setShowModal(true);
      setCodigoBarras('');
      setMes('');
      setMonto('');
    } catch (error) {
      console.error('Error al realizar el pago:', error);
      const mensaje = error.response?.data?.message || 'Hubo un error al procesar el pago.';
      setError(mensaje);
    } finally {
      setLoading(false);
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
      <div className="pago-card">
        <form onSubmit={handleSubmit} className="pago-form">
          <h2>💳 Procesar Pago</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label htmlFor="codigoBarras">Código de Barras del Usuario:</label>
            <input
              id="codigoBarras"
              type="text"
              value={codigoBarras}
              onChange={(e) => setCodigoBarras(e.target.value)}
              placeholder="Escanee o ingrese el código de barras"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mes">Mes a Cancelar:</label>
            <input
              id="mes"
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="monto">Monto a Pagar (Q):</label>
            <input
              id="monto"
              type="number"
              step="0.01"
              min="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn-pagar" disabled={loading}>
            {loading ? '⏳ Procesando...' : '💰 Procesar Pago'}
          </button>
        </form>
      </div>

      {/* Modal de confirmación */}
      {showModal && resumen && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>✅ Pago Procesado Exitosamente</h3>
              <button 
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <ResumenTransaccion resumen={resumen} />
            </div>
            <div className="modal-footer">
              <button onClick={handlePrint} className="btn-print">
                🖨️ Imprimir Comprobante
              </button>
              <button 
                onClick={() => setShowModal(false)}
                className="btn-close"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgregarPago;
