import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Reportes.css';

const Reportes = () => {
  const [tipoReporte, setTipoReporte] = useState('pagos');
  const [periodo, setPeriodo] = useState('');
  const [sector, setSector] = useState('');
  const [sectores, setSectores] = useState([]);
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    cargarSectores();
    // Establecer periodo actual por defecto
    const hoy = new Date();
    const periodoActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    setPeriodo(periodoActual);
  }, []);

  const cargarSectores = async () => {
    try {
      const response = await axios.get('http://localhost:3000/sectores');
      setSectores(response.data);
    } catch (error) {
      console.error('Error al cargar sectores:', error);
    }
  };

  const buscarReportes = async () => {
    if (!periodo) {
      setError('Debe seleccionar un periodo');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };
      
      let endpoint = '';
      let params = { periodo };
      
      if (sector) params.sector = sector;

      switch (tipoReporte) {
        case 'pagos':
          endpoint = 'http://localhost:3000/reportes/pagos';
          break;
        case 'morosos':
          endpoint = 'http://localhost:3000/reportes/morosos';
          break;
        case 'general':
          endpoint = 'http://localhost:3000/reportes/general';
          break;
        default:
          endpoint = 'http://localhost:3000/reportes/pagos';
      }

      const response = await axios.get(endpoint, { headers, params });
      
      if (tipoReporte === 'general') {
        setStats(response.data);
        setResultados([]);
      } else {
        setResultados(response.data);
        setStats(null);
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error al generar reporte');
      setResultados([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  };

  const exportarExcel = () => {
    if (resultados.length === 0 && !stats) {
      alert('No hay datos para exportar');
      return;
    }

    // Crear contenido CSV
    let csvContent = '';
    
    if (tipoReporte === 'general' && stats) {
      csvContent = `Reporte General - ${periodo}\n`;
      csvContent += `Total Recaudado,${stats.totalRecaudado}\n`;
      csvContent += `Total Usuarios,${stats.totalUsuarios}\n`;
      csvContent += `Usuarios que Pagaron,${stats.usuariosPagaron}\n`;
      csvContent += `Morosos,${stats.morosos}\n`;
      csvContent += `Porcentaje Morosos,${stats.porcentajeMorosos}%\n`;
    } else {
      // Headers
      if (tipoReporte === 'pagos') {
        csvContent = 'Nombre,Apellido,DPI,Sector,Monto,Fecha Pago,Mes Cancelado\n';
        resultados.forEach(pago => {
          csvContent += `${pago.nombre},${pago.apellido},${pago.dpi},${pago.sector_nombre},${pago.monto},${pago.fecha_pago},${pago.mes_cancelado}\n`;
        });
      } else if (tipoReporte === 'morosos') {
        csvContent = 'Nombre,Apellido,DPI,Sector,Código Barras,Último Pago\n';
        resultados.forEach(moroso => {
          csvContent += `${moroso.nombre},${moroso.apellido},${moroso.dpi},${moroso.sector_nombre},${moroso.codigo_barras},${moroso.ultimo_pago || 'Nunca'}\n`;
        });
      }
    }

    // Descargar archivo
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `reporte_${tipoReporte}_${periodo}.csv`;
    link.click();
  };

  const renderResultados = () => {
    if (stats) {
      return (
        <div className="stats-container">
          <h3>Estadísticas Generales - {periodo}</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <h4>Total Recaudado</h4>
              <p className="stat-value">Q{stats.totalRecaudado}</p>
            </div>
            <div className="stat-card">
              <h4>Total Usuarios</h4>
              <p className="stat-value">{stats.totalUsuarios}</p>
            </div>
            <div className="stat-card">
              <h4>Usuarios que Pagaron</h4>
              <p className="stat-value">{stats.usuariosPagaron}</p>
            </div>
            <div className="stat-card">
              <h4>Morosos</h4>
              <p className="stat-value morosos">{stats.morosos}</p>
            </div>
            <div className="stat-card">
              <h4>% Morosos</h4>
              <p className="stat-value">{stats.porcentajeMorosos}%</p>
            </div>
          </div>
        </div>
      );
    }

    if (resultados.length === 0) {
      return <div className="no-results">No se encontraron resultados</div>;
    }

    return (
      <div className="resultados-tabla">
        <table>
          <thead>
            <tr>
              {tipoReporte === 'pagos' ? (
                <>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>DPI</th>
                  <th>Sector</th>
                  <th>Monto</th>
                  <th>Fecha Pago</th>
                  <th>Mes Cancelado</th>
                </>
              ) : (
                <>
                  <th>Nombre</th>
                  <th>Apellido</th>
                  <th>DPI</th>
                  <th>Sector</th>
                  <th>Código Barras</th>
                  <th>Último Pago</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {resultados.map((item, index) => (
              <tr key={index}>
                {tipoReporte === 'pagos' ? (
                  <>
                    <td>{item.nombre}</td>
                    <td>{item.apellido}</td>
                    <td>{item.dpi}</td>
                    <td>{item.sector_nombre}</td>
                    <td>Q{item.monto}</td>
                    <td>{new Date(item.fecha_pago).toLocaleDateString()}</td>
                    <td>{item.mes_cancelado}</td>
                  </>
                ) : (
                  <>
                    <td>{item.nombre}</td>
                    <td>{item.apellido}</td>
                    <td>{item.dpi}</td>
                    <td>{item.sector_nombre}</td>
                    <td>{item.codigo_barras}</td>
                    <td>{item.ultimo_pago ? new Date(item.ultimo_pago).toLocaleDateString() : 'Nunca'}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="reportes-container">
      <h2>Reportes y Consultas</h2>
      
      <div className="filtros-container">
        <div className="filtro-grupo">
          <label>Tipo de Reporte:</label>
          <select 
            value={tipoReporte} 
            onChange={(e) => setTipoReporte(e.target.value)}
          >
            <option value="pagos">Pagos Realizados</option>
            <option value="morosos">Usuarios Morosos</option>
            <option value="general">Estadísticas Generales</option>
          </select>
        </div>

        <div className="filtro-grupo">
          <label>Periodo (YYYY-MM):</label>
          <input
            type="month"
            value={periodo}
            onChange={(e) => setPeriodo(e.target.value)}
            required
          />
        </div>

        <div className="filtro-grupo">
          <label>Sector (Opcional):</label>
          <select value={sector} onChange={(e) => setSector(e.target.value)}>
            <option value="">Todos los sectores</option>
            {sectores.map(s => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
        </div>

        <div className="botones-grupo">
          <button 
            onClick={buscarReportes} 
            disabled={loading}
            className="btn-buscar"
          >
            {loading ? 'Buscando...' : 'Generar Reporte'}
          </button>
          
          <button 
            onClick={exportarExcel}
            disabled={loading || (resultados.length === 0 && !stats)}
            className="btn-exportar"
          >
            Exportar CSV
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      
      <div className="resultados-container">
        {renderResultados()}
      </div>
    </div>
  );
};

export default Reportes;