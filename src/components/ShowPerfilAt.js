import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfg/firebase';
import './css/ShowPerfilAt.css';

const ShowPerfilAt = () => {
  const { id } = useParams();
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
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h1 className="mt-4 text-center mb-4">Perfil Completo</h1>
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card mb-4 shadow-lg">
            <div className="card-body text-center">
              <img 
                src={acompanante.images} 
                className="rounded-circle patient-photo mb-3" 
                alt={acompanante.nombreCompleto} 
              />
              <h2 className="card-title">{acompanante.nombreCompleto}</h2>
              <p className="card-text"><i className="fas fa-check-circle me-2"></i><strong>Estado:</strong> <span className={`badge ${acompanante.estado === 'Disponible' ? 'bg-success' : 'bg-secondary'}`}>{acompanante.estado}</span></p>
              <div className="profile-details">
                <p className="card-text"><i className="fas fa-user me-2"></i><strong>Sobre mí:</strong> {acompanante.sobreMi}</p>
                <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Localidad:</strong> {acompanante.localidad}</p>
                <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Zona:</strong> {acompanante.zona}</p>
                <p className="card-text"><i className="fas fa-briefcase me-2"></i><strong>Preferencia Laboral:</strong> {acompanante.preferenciaLaboral}</p>
                <p className="card-text"><i className="fas fa-graduation-cap me-2"></i><strong>Formación:</strong> {acompanante.formacion}</p>
                <p className="card-text"><i className="fas fa-certificate me-2"></i><strong>Título:</strong> {acompanante.titulo}</p>
                <p className="card-text"><i className="fas fa-briefcase me-2"></i><strong>Experiencia:</strong> {acompanante.experiencia}</p>
                <p className="card-text"><i className="fas fa-phone me-2"></i><strong>Teléfono:</strong> {acompanante.telefono}</p>
                <p className="card-text"><i className="fas fa-envelope me-2"></i><strong>Email:</strong> {acompanante.email}</p>
              </div>
              <div className="text-center mt-4">
                <a href={`mailto:${acompanante.email}`} className="btn btn-primary btn-lg"><i className="fas fa-envelope me-2"></i> Contactar por Email</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowPerfilAt;