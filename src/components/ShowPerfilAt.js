import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfg/firebase';
import './css/ShowPerfilAt.css';
import Cargando from './Cargando';

const ShowPerfilAt = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Hook para manejar la navegación
  const [acompanante, setAcompanante] = useState(null);

  const getAcompanante = async () => {
    const docRef = doc(db, 'perfilLaboral', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setAcompanante(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  useEffect(() => {
    getAcompanante();
  }, [id]);

  if (!acompanante) {
    return <Cargando />;
  }

  return (
    <div className="container">
      <h1 className="mt-4 text-center mb-4 text-white">Perfil Completo</h1>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card mb-4 shadow-lg">
            <div className="card-body text-center">
              <img 
                src={acompanante.images || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2WjS_hXJ9gKTPO0DP2wQa9ho1mxaq2aynxQ&s'} 
                className="rounded-circle patient-photo mb-3" 
                alt={acompanante.nombreCompleto} 
              />
              <h2 className="card-title text-white">{acompanante.nombreCompleto}</h2>
              <p className="card-text text-white"><i className="fas fa-check-circle me-2"></i><strong className='text-white'>Estado:</strong> <span className={`badge ${acompanante.estado === 'Disponible' ? 'bg-success' : 'bg-secondary'}`}>{acompanante.estado}</span></p>
              <div className="profile-details">
                <p className="card-text text-white"><i className="fas fa-user me-2"></i><strong className='text-white'>Sobre mí:</strong> {acompanante.sobreMi}</p>
                <p className="card-text text-white"><i className="fas fa-map-marker-alt me-2"></i><strong className='text-white'>Localidad:</strong> {acompanante.localidad}</p>
                <p className="card-text text-white"><i className="fas fa-map-marker-alt me-2"></i><strong className='text-white'>Zona:</strong> {acompanante.zona}</p>
                <p className="card-text text-white"><i className="fas fa-briefcase me-2"></i><strong className='text-white'>Preferencia Laboral:</strong> {acompanante.preferenciaLaboral}</p>
                <p className="card-text text-white"><i className="fas fa-graduation-cap me-2"></i><strong className='text-white'>Formación:</strong> {acompanante.formacion}</p>
                <p className="card-text text-white"><i className="fas fa-certificate me-2"></i><strong className='text-white'>Título:</strong> {acompanante.titulo}</p>
                <p className="card-text text-white"><i className="fas fa-briefcase me-2"></i><strong className='text-white'>Experiencia:</strong> {acompanante.experiencia}</p>
                <p className="card-text text-white"><i className="fas fa-phone me-2"></i><strong className='text-white'>Teléfono:</strong> {acompanante.telefono}</p>
                <p className="card-text text-white"><i className="fas fa-envelope me-2"></i><strong className='text-white'>Email:</strong> {acompanante.email}</p>
              </div>
              <div className="text-center mt-4">
                <a href={`mailto:${acompanante.email}`} className="btn btn-primary btn-lg"><i className="fas fa-envelope me-2"></i> Contactar por Email</a>
              </div>
              <div className="text-center mt-4">
                <button className="btn btn-secondary btn-lg" onClick={() => navigate(-1)}><i className="fas fa-arrow-left me-2"></i> Volver Atrás</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPerfilAt;