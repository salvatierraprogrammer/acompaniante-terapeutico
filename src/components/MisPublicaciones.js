import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs,getDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';

const MisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [userRol, setUserRol] = useState(null);
  const navigate = useNavigate();
  
  const publicacionesCollection = collection(db, 'publicaciones');

  useEffect(() => {
    const fetchPublicaciones = async () => {
      // Verificar el rol del usuario
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          setUserRol(userDoc.data().userRol);
          // Obtener las publicaciones solo si el usuario es 'reclutador'
          if (userDoc.data().userRol === 'reclutador') {
            const data = await getDocs(publicacionesCollection);
            setPublicaciones(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          } else {
            navigate('/'); // Redirigir si el usuario no es reclutador
          }
        }
      }
    };

    fetchPublicaciones();
  }, [navigate]);

  const publicacionesMiradaHumana = publicaciones.filter(pub => pub.userId === auth.currentUser?.uid);

  const handleActivar = async (id, currentEstado) => {
    const publicationDoc = doc(db, 'publicaciones', id);
    const newEstado = currentEstado === 'Disponible' ? 'No disponible' : 'Disponible';
    await updateDoc(publicationDoc, { estado: newEstado });
    setPublicaciones(publicaciones.map(pub => pub.id === id ? { ...pub, estado: newEstado } : pub));
  };

  const handleEliminar = async (id) => {
    const publicationDoc = doc(db, 'publicaciones', id);
    await deleteDoc(publicationDoc);
    setPublicaciones(publicaciones.filter(pub => pub.id !== id));
  };

  return (
    <div className="container">
      <h1 className="mt-4 text-center mb-4">Mis Publicaciones</h1>

      <div className="text-center mb-4">
        <Link className="btn btn-primary" to={'/nuevaPublicacion'}>
          <i className="fas fa-plus me-2"></i> Nueva Publicación
        </Link>
      </div>

      <div className="row justify-content-center">
        {publicacionesMiradaHumana.length > 0 ? (
          publicacionesMiradaHumana.map(pub => (
            <div className="col-md-6 col-lg-4" key={pub.id}>
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <div className="text-center mb-3">
                    <img
                      src={pub.photo}
                      className="rounded-circle patient-photo mb-3"
                      alt={`Foto de paciente ${pub.paciente}`}
                    />
                    <h5 className="card-title">Paciente {pub.paciente}</h5>
                  </div>
                  <div className="text-start">
                    <p className="card-text"><i className="fas fa-calendar-day me-2"></i><strong>Edad:</strong> {pub.edad}</p>
                    <p className="card-text"><i className="fas fa-venus-mars me-2"></i><strong>Sexo:</strong> {pub.sexo}</p>
                    <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Localidad:</strong> {pub.localidad}</p>
                    <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Zona:</strong> {pub.zona}</p>
                    <p className="card-text"><i className="fas fa-notes-medical me-2"></i><strong>Diagnóstico:</strong> {pub.diagnostico}</p>
                    <p className="card-text"><i className="fas fa-align-left me-2"></i><strong>Descripción:</strong> {pub.descripcion}</p>
                    <p className="card-text"><i className="fas fa-phone-alt me-2"></i><strong>Teléfono:</strong> {pub.telefono}</p>
                    <p className="card-text"><i className="fas fa-envelope me-2"></i><strong>Email:</strong> {pub.email}</p>
                    <p className="card-text"><i className="fas fa-info-circle me-2"></i><strong>Estado:</strong> {pub.estado}</p>
                  </div>
                  <div className="text-center mt-3">
                    <button
                      className={`btn ${pub.estado === 'Disponible' ? 'btn-warning' : 'btn-success'} me-2 mb-2`}
                      onClick={() => handleActivar(pub.id, pub.estado)}
                    >
                      <i className={`fas ${pub.estado === 'Disponible' ? 'fa-times' : 'fa-check'} me-2`}></i> 
                      {pub.estado === 'Disponible' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      className="btn btn-danger mb-2"
                      onClick={() => handleEliminar(pub.id)}
                    >
                      <i className="fas fa-trash me-2"></i> Eliminar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No tienes publicaciones en Mirada Humana.</p>
        )}
      </div>
    </div>
  );
};

export default MisPublicaciones;