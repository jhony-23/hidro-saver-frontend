import React from 'react';

const ResumenTransaccion = ({ resumen }) => {
  return (
    <div>
      <h3>Resumen de la Transacción</h3>
      <p>Nombre: {resumen.nombreUsuario}</p>
      <p>Sector: {resumen.sectorNombre}</p>
      <p>Descripción del Sector: {resumen.sectorDescripcion}</p>
      <p>Monto Pagado: {resumen.monto}</p>
      <p>Mes Cancelado: {resumen.mesCancelado}</p>
    </div>
  );
};

export default ResumenTransaccion;
