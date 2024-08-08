import React, { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';
import { Link, useNavigate } from 'react-router-dom';
import './css/ShowPerfilAt.css';
import Cargando from './Cargando';

const PerfilLaboralUpdate = () => {
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [estado, setEstado] = useState('');
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

  if (loading) return <Cargando />;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4 text-white">Perfil Laboral</h1>
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
                <h2 className="card-title text-white">{perfilData.nombreCompleto}</h2>
                <div className="profile-details">
                  <p className="card-text text-white"><i className="fas fa-envelope me-2"></i><strong className='text-white'>Email:</strong> {perfilData.email}</p>
                  <p className="card-text text-white"><i className="fas fa-phone me-2"></i><strong className='text-white'>Teléfono:</strong> {perfilData.telefono}</p>
                  <p className="card-text text-white"><i className="fas fa-briefcase me-2"></i><strong className='text-white'>Experiencia:</strong> {perfilData.experiencia}</p>
                  <p className="card-text text-white"><i className="fas fa-graduation-cap me-2"></i><strong className='text-white'>Formación:</strong> {perfilData.formacion}</p>
                  <p className="card-text text-white"><i className="fas fa-user me-2"></i><strong className='text-white'>Sobre Mí:</strong> {perfilData.sobreMi}</p>
                  <p className="card-text text-white"><i className="fas fa-map-marker-alt me-2"></i><strong className='text-white'>Localidad:</strong> {perfilData.localidad}</p>
                  <p className="card-text text-white"><i className="fas fa-briefcase me-2"></i><strong className='text-white'>Preferencia Laboral:</strong> {perfilData.preferenciaLaboral}</p>
                  <p className="card-text text-white"><i className="fas fa-map-marker-alt me-2"></i><strong className='text-white'>Zona:</strong> {perfilData.zona}</p>
                  <p className="card-text text-white"><i className="fas fa-tag me-2"></i><strong className='text-white'>Estado:</strong> <span className={`badge ${estado === 'Disponible' ? 'bg-success' : estado === 'Consultar' ? 'bg-warning' : 'bg-secondary'}`}>{estado}</span></p>
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
                </div>
                <div className="modal-footer mt-2 d-flex justify-content-center">
                  <Link to="/editarPerfilLaboral" className="btn btn-warning me-2 text-white">
                    Editar Perfil
                  </Link>
                  <Link to="/buscar-trabajo" className="btn btn-secondary">
                    Volver a inicio
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className='alert alert-secondary'>No se encontraron datos del perfil.</p>
          <Link to="/crear-perfil-laboral" className="btn btn-secondary mt-3">Crear Perfil Laboral</Link>
        </div>
      )}
    </div>
  );
};

export default PerfilLaboralUpdate;