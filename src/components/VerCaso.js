import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase'; // Asegúrate de importar auth si es necesario
import './css/VerCaso.css'; // Import the CSS file

const VerCaso = () => {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [mailEnviados, setMailEnviados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate(); // Hook para navegación

  useEffect(() => {
    const fetchPublicacion = async () => {
      setLoading(true);
      try {
        // Obtener el userId del usuario autenticado
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUserId(currentUser.uid);
        } else {
          console.error("No se puede obtener el usuario autenticado.");
          setLoading(false);
          return;
        }

        // Obtener la publicación
        const docRef = doc(db, 'publicaciones', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPublicacion(data);

          // Consultar los mails enviados por el usuario autenticado para la publicación
          const mailQuery = query(
            collection(db, 'mailEnviadosPostulado'),
            where('userIdPublicacion', '==', id),
            where('userIdUsers', '==', currentUser.uid) // Filtrar por el userId del usuario autenticado
          );
          const mailQuerySnapshot = await getDocs(mailQuery);
          const mails = [];
          mailQuerySnapshot.forEach(doc => {
            mails.push({ id: doc.id, ...doc.data() });
          });
          setMailEnviados(mails);
        } else {
          setPublicacion(null);
        }
      } catch (error) {
        console.error("Error al obtener la publicación:", error);
      }
      setLoading(false);
    };

    fetchPublicacion();
  }, [id]);

  const handleBack = () => {
    navigate(-1); // Navegar a la página anterior
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  if (!publicacion) {
    return <div className="text-center">No se encontró la publicación.</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="text-center">Detalles de la Publicación</h1>
      <div className="d-flex flex-column flex-md-row">
        <div className="card mb-3 shadow-sm flex-md-fill me-md-3">
          <div className="card-body">
            <div className="d-flex flex-column align-items-center text-center mb-3">
              <img
                src={publicacion.photo}
                className="rounded-circle patient-photo mb-3"
                alt={`Foto de ${publicacion.cliente}`}
              />
              <h5 className="card-title">{publicacion.cliente}</h5>
            </div>
            <div className="text-start">
              <p className="card-text"><i className="fas fa-birthday-cake me-2"></i><strong>Edad:</strong> {publicacion.edad}</p>
              <p className="card-text"><i className="fas fa-venus-mars me-2"></i><strong>Sexo:</strong> {publicacion.sexo}</p>
              <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Localidad:</strong> {publicacion.localidad}</p>
              <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Zona:</strong> {publicacion.zona}</p>
              <p className="card-text"><i className="fas fa-notes-medical me-2"></i><strong>Diagnóstico:</strong> {publicacion.diagnostico}</p>
              <p className="card-text"><i className="fas fa-align-left me-2"></i><strong>Descripción:</strong> {publicacion.descripcion}</p>
              <p className="card-text"><i className="fas fa-phone-alt me-2"></i><strong>Teléfono:</strong> {publicacion.telefono}</p>
              <p className="card-text"><i className="fas fa-envelope me-2"></i><strong>Email:</strong> {publicacion.email}</p>
            </div>
          </div>
        </div>
        <div className="mail-enviados flex-md-fill ms-md-3">
          <h2 className="text-center mb-4">
            <div className="me-md-3">
              <i className="fas fa-envelope fa-2x text-primary me-2"></i>
            </div>
            Correos Enviados
          </h2>
          {mailEnviados.length > 0 ? (
            <ul className="list-group">
              {mailEnviados.map((mail) => (
                <li key={mail.id} className="list-group-item d-flex flex-column flex-md-row align-items-start mb-3 shadow-sm p-3">
                  <div className="flex-grow-1">
                    <h5 className="mb-1"><strong>{mail.nombre} {mail.apellido}</strong></h5>
                    <p className="mb-1"><i className="fas fa-envelope me-2"></i><strong>Email:</strong> {mail.email}</p>
                    <p className="mb-1"><i className="fas fa-file-alt me-2"></i><strong>Descripción:</strong> {mail.descripcion}</p>
                    <p className="mb-1"><i className="fas fa-calendar-day me-2"></i><strong>Fecha de Envío:</strong> {new Date(mail.fechaEnvio.seconds * 1000).toLocaleDateString()} {new Date(mail.fechaEnvio.seconds * 1000).toLocaleTimeString()}</p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center mt-4">
              <i className="fas fa-inbox fa-3x text-muted"></i>
              <p className="mt-2">No se encontraron correos enviados.</p>
            </div>
          )}
        </div>
       
      </div>
      <div className="text-center mt-2">
        <button className="btn btn-primary" onClick={handleBack}>
          Volver Atrás
        </button>
      </div>
    </div>
  );
};

export default VerCaso;