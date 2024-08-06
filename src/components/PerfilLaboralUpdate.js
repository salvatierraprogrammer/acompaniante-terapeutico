import React, { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';
import { Link, useNavigate } from 'react-router-dom';
import './css/ShowPerfilAt.css'; // Usa el mismo archivo CSS para los estilos

const PerfilLaboralUpdate = () => {
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estado, setEstado] = useState('Disponible');
  const navigate = useNavigate();

  const fetchPerfilData = useCallback(async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const perfilDoc = doc(db, 'perfilLaboral', user.uid);
        const perfilSnapshot = await getDoc(perfilDoc);
        if (perfilSnapshot.exists()) {
          const data = perfilSnapshot.data();
          setPerfilData(data);
          setEstado(data.estado || 'Disponible');
        } else {
          setPerfilData(null);
          setError('No se encontraron datos del perfil.');
          navigate('/crear-perfil-laboral');
        }
      } else {
        setError('Usuario no autenticado.');
      }
    } catch (err) {
      setError('Error al cargar los datos del perfil.');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPerfilData();
  }, [fetchPerfilData]);

  const handleChangeEstado = async (e) => {
    const newEstado = e.target.value;
    try {
      const user = auth.currentUser;
      if (user) {
        const perfilDoc = doc(db, 'perfilLaboral', user.uid);
        await updateDoc(perfilDoc, { estado: newEstado });
        setEstado(newEstado);
        setPerfilData((prevData) => ({ ...prevData, estado: newEstado }));
      } else {
        setError('Usuario no autenticado.');
      }
    } catch (err) {
      setError('Error al actualizar el estado.');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Perfil Laboral</h1>
      {perfilData ? (
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card mb-4 shadow-lg">
              <div className="card-body text-center">
                <img 
                  src={perfilData.images} 
                  className="rounded-circle patient-photo mb-3" 
                  alt={perfilData.nombreCompleto} 
                />
                <h2 className="card-title">{perfilData.nombreCompleto}</h2>
                <div className="profile-details">
                  <p className="card-text"><i className="fas fa-envelope me-2"></i><strong>Email:</strong> {perfilData.email}</p>
                  <p className="card-text"><i className="fas fa-phone me-2"></i><strong>Teléfono:</strong> {perfilData.telefono}</p>
                  <p className="card-text"><i className="fas fa-briefcase me-2"></i><strong>Experiencia:</strong> {perfilData.experiencia}</p>
                  <p className="card-text"><i className="fas fa-graduation-cap me-2"></i><strong>Formación:</strong> {perfilData.formacion}</p>
                  <p className="card-text"><i className="fas fa-user me-2"></i><strong>Sobre Mí:</strong> {perfilData.sobreMi}</p>
                  <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Localidad:</strong> {perfilData.localidad}</p>
                  <p className="card-text"><i className="fas fa-briefcase me-2"></i><strong>Preferencia Laboral:</strong> {perfilData.preferenciaLaboral}</p>
                  <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Zona:</strong> {perfilData.zona}</p>
                  <p className="card-text"><i className="fas fa-tag me-2"></i><strong>Estado:</strong> {estado}</p>
                </div>
                <div className="text-center mt-4">
                  <label htmlFor="estado" className="form-label">Cambiar Estado:</label>
                  <select
                    id="estado"
                    value={estado}
                    onChange={handleChangeEstado}
                    className="form-select"
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Consultar">Consultar</option>
                    <option value="No Disponible">No Disponible</option>
                  </select>
                  <div className="mt-3">
                    <Link to="/editarPerfilLaboral" className="btn btn-primary btn-lg">
                      Editar Perfil Laboral
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>No se encontraron datos del perfil.</p>
          <Link to="/crear-perfil-laboral" className="btn btn-secondary mt-3">Crear Perfil Laboral</Link>
        </div>
      )}
    </div>
  );
};

export default PerfilLaboralUpdate;