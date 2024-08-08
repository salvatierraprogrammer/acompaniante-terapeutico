import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, getDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cargando from './Cargando';
import GoBack from './GoBack';



const MySwal = withReactContent(Swal);

const MisPublicaciones = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [userRol, setUserRol] = useState(null);
  const [loading, setLoading] = useState(true); // Estado de carga
  const navigate = useNavigate();
  
  const publicacionesCollection = collection(db, 'publicaciones');

  useEffect(() => {
    const fetchPublicaciones = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRol(userData.userRol);

          // Mostrar publicaciones solo para administradores y reclutadores
          if (userData.userRol === 'reclutador' || userData.userRol === 'administrador') {
            const data = await getDocs(publicacionesCollection);
            setPublicaciones(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          } else {
            navigate('/'); // Redirigir si el usuario no tiene permiso
          }
        }
      }
      setLoading(false); // Fin del estado de carga
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
    const result = await MySwal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    });

    if (result.isConfirmed) {
      const publicationDoc = doc(db, 'publicaciones', id);
      await deleteDoc(publicationDoc);
      setPublicaciones(publicaciones.filter(pub => pub.id !== id));
      MySwal.fire(
        '¡Eliminado!',
        'La publicación ha sido eliminada.',
        'success'
      );
    }
  };

  if (loading) {
    return (
     <Cargando/>
    );
  }

  return (
    <div className="container">
      <h1 className="mt-4 text-center mb-4 text-white">Mis Publicaciones</h1>
      <GoBack/>
      {userRol === 'reclutador' ? (
        <div className="text-center mb-4">
         
          <Link className="btn btn-warning text-white" to={'/nuevaPublicacion'}>
            <i className="fas fa-plus me-2 text-white"></i> Nueva Publicación
          </Link>
        </div>
      ) : userRol === 'administrador' ? (
        <p className="text-center">Como administrador, no puedes agregar nuevas publicaciones.</p>
      ) : (
        <p className="text-center">No tienes permiso para ver esta página.</p>
      )}

      <div className="row justify-content-center">
        {publicacionesMiradaHumana.length > 0 ? (
          publicacionesMiradaHumana.map(pub => (
            <div className="col-md-6 col-lg-4 mb-4" key={pub.id}>
              <div className="card shadow-sm border-light">
                <div className="card-body">
                  <div className="text-center mb-3">
                    <img
                      src={pub.photo}
                      className="rounded-circle mb-3"
                      alt={`Foto de paciente ${pub.paciente}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                    />
                    <h5 className="card-title text-white">{pub.cliente}</h5>
                  </div>
                  <div className="text-start">
                  <p className="card-text text-white">Nº Paciente {pub.paciente}</p>
                    <p className="card-text text-white"><i className="fas fa-calendar-day me-2"></i><strong className='text-white'>Edad:</strong> {pub.edad}</p>
                    <p className="card-text text-white"><i className="fas fa-venus-mars me-2"></i><strong className='text-white'>Sexo:</strong> {pub.sexo}</p>
                    <p className="card-text text-white"><i className="fas fa-map-marker-alt me-2"></i><strong className='text-white'>Localidad:</strong> {pub.localidad}</p>
                    <p className="card-text text-white"><i className="fas fa-map-marker-alt me-2"></i><strong className='text-white'>Zona:</strong> {pub.zona}</p>
                    <p className="card-text text-white"><i className="fas fa-notes-medical me-2"></i><strong className='text-white'>Diagnóstico:</strong> {pub.diagnostico}</p>
                    <p className="card-text text-white"><i className="fas fa-align-left me-2"></i><strong className='text-white'>Descripción:</strong> {pub.descripcion}</p>
                    <p className="card-text text-white"><i className="fas fa-phone-alt me-2"></i><strong className='text-white'>Teléfono:</strong> {pub.telefono}</p>
                    <p className="card-text text-white"><i className="fas fa-envelope me-2"></i><strong className='text-white'>Email:</strong> {pub.email}</p>
                    <p className="card-text text-white"><i className="fas fa-info-circle me-2"></i><strong className='text-white'>Estado:</strong> {pub.estado}</p>
                  </div>
                  <div className="text-center mt-3">
                    <button
                      className={`btn text-white ${pub.estado === 'Disponible' ? 'btn-warning' : 'btn-success'} me-2`}
                      onClick={() => handleActivar(pub.id, pub.estado)}
                      style={{ minWidth: '120px' }}
                    >
                      <i className={`fas ${pub.estado === 'Disponible' ? 'fa-times' : 'fa-check'} me-2`}></i> 
                      {pub.estado === 'Disponible' ? 'Desactivar' : 'Activar'}
                    </button>
                    <button
                      className="btn btn-warning text-white"
                      onClick={() => handleEliminar(pub.id)}
                      style={{ minWidth: '120px' }}
                    >
                      <i className="fas fa-trash me-2 text-white"></i> Eliminar
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