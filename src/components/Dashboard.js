import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState('');

  useEffect(() => {
    // Establecer periodo actual por defecto
    const hoy = new Date();
    const periodoActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    setPeriodoSeleccionado(periodoActual);
  }, []);

  useEffect(() => {
    if (periodoSeleccionado) {
      cargarEstadisticas();
    }
  }, [periodoSeleccionado]);

  const cargarEstadisticas = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Cargar estadísticas generales
      const responseGeneral = await axios.get('http://localhost:3000/reportes/general', {
        headers,
        params: { periodo: periodoSeleccionado }
      });

      // Cargar estadísticas adicionales
      const responseSectores = await axios.get('http://localhost:3000/sectores', { headers });
      
      setStats({
        ...responseGeneral.data,
        totalSectores: responseSectores.data.length
      });
      setError('');
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
      setError('Error al cargar las estadísticas del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-GT', {
      style: 'currency',
      currency: 'GTQ'
    }).format(amount || 0);
  };

  const formatPercentage = (value) => {
    return `${(value || 0).toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-dashboard">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard - HidroSaver</h1>
        <div className="periodo-selector">
          <label>Periodo:</label>
          <input
            type="month"
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {stats && (
        <>
          {/* KPIs Principales */}
          <div className="kpis-grid">
            <div className="kpi-card revenue">
              <div className="kpi-icon">💰</div>
              <div className="kpi-content">
                <h3>Recaudación Total</h3>
                <p className="kpi-value">{formatCurrency(stats.totalRecaudado)}</p>
                <span className="kpi-period">{periodoSeleccionado}</span>
              </div>
            </div>

            <div className="kpi-card users">
              <div className="kpi-icon">👥</div>
              <div className="kpi-content">
                <h3>Total Usuarios</h3>
                <p className="kpi-value">{stats.totalUsuarios}</p>
                <span className="kpi-period">Registrados</span>
              </div>
            </div>

            <div className="kpi-card paid">
              <div className="kpi-icon">✅</div>
              <div className="kpi-content">
                <h3>Pagos al Día</h3>
                <p className="kpi-value">{stats.usuariosPagaron}</p>
                <span className="kpi-period">{periodoSeleccionado}</span>
              </div>
            </div>

            <div className="kpi-card overdue">
              <div className="kpi-icon">⚠️</div>
              <div className="kpi-content">
                <h3>Morosos</h3>
                <p className="kpi-value">{stats.morosos}</p>
                <span className="kpi-period">{formatPercentage(stats.porcentajeMorosos)}</span>
              </div>
            </div>

            <div className="kpi-card sectors">
              <div className="kpi-icon">🏘️</div>
              <div className="kpi-content">
                <h3>Sectores Activos</h3>
                <p className="kpi-value">{stats.totalSectores}</p>
                <span className="kpi-period">Configurados</span>
              </div>
            </div>

            <div className="kpi-card efficiency">
              <div className="kpi-icon">📊</div>
              <div className="kpi-content">
                <h3>Eficiencia Cobro</h3>
                <p className="kpi-value">{formatPercentage(100 - stats.porcentajeMorosos)}</p>
                <span className="kpi-period">Tasa de cobro</span>
              </div>
            </div>
          </div>

          {/* Gráficos y estadísticas adicionales */}
          <div className="charts-section">
            <div className="chart-card">
              <h3>Resumen del Periodo</h3>
              <div className="summary-stats">
                <div className="summary-item">
                  <span className="summary-label">Promedio por Usuario:</span>
                  <span className="summary-value">
                    {formatCurrency(stats.usuariosPagaron > 0 ? stats.totalRecaudado / stats.usuariosPagaron : 0)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Usuarios Activos:</span>
                  <span className="summary-value">
                    {formatPercentage((stats.usuariosPagaron / stats.totalUsuarios) * 100)}
                  </span>
                </div>
                <div className="summary-item">
                  <span className="summary-label">Meta de Cobro:</span>
                  <span className="summary-value">
                    {stats.porcentajeMorosos <= 10 ? '✅ Cumplida' : '❌ No Cumplida'}
                  </span>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3>Indicadores de Salud</h3>
              <div className="health-indicators">
                <div className={`indicator ${stats.porcentajeMorosos <= 5 ? 'excellent' : stats.porcentajeMorosos <= 15 ? 'good' : 'warning'}`}>
                  <div className="indicator-title">Estado de Cobranza</div>
                  <div className="indicator-status">
                    {stats.porcentajeMorosos <= 5 ? 'Excelente' : 
                     stats.porcentajeMorosos <= 15 ? 'Bueno' : 'Requiere Atención'}
                  </div>
                </div>
                
                <div className={`indicator ${stats.totalRecaudado > 50000 ? 'excellent' : stats.totalRecaudado > 25000 ? 'good' : 'warning'}`}>
                  <div className="indicator-title">Recaudación</div>
                  <div className="indicator-status">
                    {stats.totalRecaudado > 50000 ? 'Meta Superada' : 
                     stats.totalRecaudado > 25000 ? 'En Meta' : 'Bajo Meta'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="quick-actions">
            <h3>Acciones Rápidas</h3>
            <div className="actions-grid">
              <button className="action-btn" onClick={() => window.open('/reportes/morosos', '_blank')}>
                📋 Ver Morosos
              </button>
              <button className="action-btn" onClick={() => window.open('/reportes/pagos', '_blank')}>
                💳 Ver Pagos
              </button>
              <button className="action-btn" onClick={() => window.open('/agregar', '_blank')}>
                ➕ Agregar Usuario
              </button>
              <button className="action-btn" onClick={() => cargarEstadisticas()}>
                🔄 Actualizar Datos
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;