import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';
import './css/VerCaso.css';
import Cargando from './Cargando';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import CargaComponet from './CargaComponet';

const MySwal = withReactContent(Swal);

const VerReclutadorEmail = () => {
  const { id } = useParams();
  const [publicacion, setPublicacion] = useState(null);
  const [mailEnviados, setMailEnviados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublicacion = async () => {
      setLoading(true);
      try {
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUserId(currentUser.uid);

          // Obtener el rol del usuario
          const userDocRef = doc(db, 'usuarios', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserRole(userDocSnap.data().userRol);
          } else {
            console.error("No se encontró el documento del usuario.");
            setUserRole(null);
          }

          const docRef = doc(db, 'publicaciones', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPublicacion(data);

            // Obtener los correos enviados a esta publicación
            const mailQuery = query(
              collection(db, 'mailEnviadosPostulado'),
              where('userIdPublicacion', '==', id)
            );
            const mailQuerySnapshot = await getDocs(mailQuery);
            const mails = [];
            mailQuerySnapshot.forEach(doc => {
              mails.push({ id: doc.id, ...doc.data() });
            });
            setMailEnviados(mails);

            // Cambiar el estado del último correo a 'Leído'
            if (mails.length > 0) {
              const lastMail = mails[mails.length - 1];
              const mailDocRef = doc(db, 'mailEnviadosPostulado', lastMail.id);
              await updateDoc(mailDocRef, { estado: 'Leído' });
            }
          } else {
            setPublicacion(null);
          }
        } else {
          console.error("No se puede obtener el usuario autenticado.");
        }
      } catch (error) {
        console.error("Error al obtener la publicación:", error);
      }
      setLoading(false);
    };

    fetchPublicacion();
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleContactClick = (acompananteId) => {
    const user = auth.currentUser;
    if (!user) {
      MySwal.fire({
        title: 'Debes iniciar sesión',
        text: 'Por favor, inicia sesión para poder contactar con el acompañante.',
        icon: 'warning',
        showCloseButton: true,
        confirmButtonText: 'Iniciar sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login');
        }
      });
    } else if (userRole !== 'reclutador') {
      MySwal.fire({
        title: 'Acceso denegado',
        text: 'Solo los reclutadores pueden contactar con los acompañantes.',
        icon: 'error',
        showCloseButton: true,
        confirmButtonText: 'Aceptar'
      });
    } else {
      navigate(`/showPerfil/${acompananteId}`);
    }
  };

  if (loading) {
    return (
  <CargaComponet/>
    );
  }

  if (!publicacion) {
    return <div className="text-center">No se encontró la publicación.</div>;
  }

  return (
    <div className="card ver-reclutador-email-container">
      <h2 className="text-center mb-4 text-white">
        <div className="me-md-3">
          <i className="fas fa-envelope fa-2x text-white me-2"></i>
        </div>
        Correos recibidos
      </h2>
      
      {mailEnviados.length > 0 ? (
        <ul className="list-group text-start">
          {mailEnviados.map((mail) => (
            <li key={mail.id} className="list-group-item d-flex flex-column flex-md-row align-items-start mb-3 shadow-sm p-3">
              <div className="flex-grow-1">
                <h5 className="mb-1 text-white"><strong>{mail.nombre} {mail.apellido}</strong></h5>
                <p className="mb-1 text-white"><i className="fas fa-envelope me-2"></i><strong>Email:</strong> {mail.email}</p>
                <p className="mb-1 text-white"><i className="fas fa-file-alt me-2"></i><strong>Descripción:</strong> {mail.descripcion}</p>
                <p className="mb-1 text-white"><i className="fas fa-calendar-day me-2"></i><strong>Fecha de Envío:</strong> {new Date(mail.fechaEnvio.seconds * 1000).toLocaleDateString()} {new Date(mail.fechaEnvio.seconds * 1000).toLocaleTimeString()}</p>
                <p className="mb-1 text-white"><i className="fas fa-file-alt me-2"></i><strong>Estado:</strong> {mail.estado}</p>
              </div>
              <button className="btn btn-warning text-white" onClick={() => handleContactClick(mail.userIdUsers)}>
              <i class="fa-solid fa-eye"></i>
              </button>
            </li>
          ))}
          <div className="text-height">
            <button className="btn btn-secondary text-white" onClick={handleBack}>
              Volver Atrás
            </button>
          </div>
        </ul>
      ) : (
        <div className="text-center mt-4">
          <i className="fas fa-inbox fa-3x text-muted"></i>
          <p className="alert alert-danger">No se encontraron correos enviados. O eliminaron la publicación.</p>
        </div>
      )}
    </div>
  );
};

export default VerReclutadorEmail;