import React, { useMemo, useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RecuperarPassword = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [dpi, setDpi] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const minLen = 8;
  const passTooShort = useMemo(() => nueva.length > 0 && nueva.length < minLen, [nueva]);
  const passMismatch = useMemo(() => confirm.length > 0 && nueva !== confirm, [nueva, confirm]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    if (passTooShort) {
      setMsg(`La contraseña debe tener al menos ${minLen} caracteres`);
      return;
    }
    if (nueva !== confirm) {
      setMsg('Las contraseñas no coinciden');
      return;
    }
    try {
      setLoading(true);
  await axios.post('/admin/reset-password', { nombre, apellido, dpi, nuevaContraseña: nueva });
  setMsg('Si los datos son correctos, la contraseña fue actualizada');
  setNombre(''); setApellido(''); setDpi(''); setNueva(''); setConfirm('');
  // Redirigir al login luego de un breve delay para mostrar el mensaje
  setTimeout(() => navigate('/login'), 1200);
    } catch (_) {
      setMsg('No se pudo procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="recuperar-wrapper">
      <h2>Olvidé mi contraseña</h2>
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e)=>setNombre(e.target.value)} required />
        <input type="text" placeholder="Apellido" value={apellido} onChange={(e)=>setApellido(e.target.value)} required />
        <input type="text" placeholder="DPI" value={dpi} onChange={(e)=>setDpi(e.target.value)} required />
        <div>
          <input type="password" placeholder="Nueva contraseña" value={nueva} onChange={(e)=>setNueva(e.target.value)} required />
          {passTooShort && (<div className="hint error">Debe tener al menos {minLen} caracteres</div>)}
        </div>
        <div>
          <input type="password" placeholder="Confirmar contraseña" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
          {passMismatch ? (
            <div className="hint error">Las contraseñas no coinciden</div>
          ) : (confirm.length > 0 && nueva.length >= minLen && (
            <div className="hint success">Coinciden</div>
          ))}
        </div>
        <div className="actions">
          <button type="submit" disabled={loading || passTooShort || passMismatch}>
            {loading ? 'Actualizando...' : 'Actualizar contraseña'}
          </button>
          <Link to="/login" style={{
            display: 'inline-block',
            padding: '10px',
            textAlign: 'center',
            backgroundColor: '#5c3410',
            color: '#fff',
            borderRadius: 4,
            textDecoration: 'none'
          }}>Volver al login</Link>
        </div>
      </form>
      {msg && <p className="info">{msg}</p>}
    </div>
  );
};

export default RecuperarPassword;
