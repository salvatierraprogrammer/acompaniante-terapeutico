import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfg/firebase';
import './css/VerCaso.css'; // Import the CSS file

const VerCaso = () => {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [mailEnviados, setMailEnviados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPublicacion = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, 'publicaciones', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPublicacion(data);

          const mailQuery = query(
            collection(db, 'mailEnviadosPostulado'),
            where('userIdPublicacion', '==', id)
          );
          const mailQuerySnapshot = await getDocs(mailQuery);
          const mails = [];
          mailQuerySnapshot.forEach(doc => {
            mails.push(doc.data());
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
          <h2 className="text-center">Mail Enviado</h2>
          {mailEnviados.length > 0 ? (
            <ul className="list-group">
              {mailEnviados.map((mail, index) => (
                <li key={index} className="list-group-item">
                  <p><strong>Nombre:</strong> {mail.nombre}</p>
                  <p><strong>Apellido:</strong> {mail.apellido}</p>
                  <p><strong>Email:</strong> {mail.email}</p>
                  <p><strong>Descripción:</strong> {mail.descripcion}</p>
                  <p><strong>Fecha de Envío:</strong> {new Date(mail.fechaEnvio.seconds * 1000).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center">No se encontraron mails enviados.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerCaso;