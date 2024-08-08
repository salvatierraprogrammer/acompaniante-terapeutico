import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Cargando from './Cargando';

const MySwal = withReactContent(Swal);

const CvEnviados = () => {
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCvs = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          console.log('User ID:', userId); // Mensaje de depuración
          
          // Fetch CVs
          const mailEnviadosCollection = collection(db, 'mailEnviadosPostulado');
          const querySnapshot = await getDocs(mailEnviadosCollection);
          const cvsData = querySnapshot.docs
            .filter((doc) => doc.data().userIdUsers === userId)
            .map((doc) => ({ id: doc.id, ...doc.data() }));
          console.log('CVs data:', cvsData);

          // Fetch publicaciones
          const publicacionesCollection = collection(db, 'publicaciones');
          const publicacionesSnapshot = await getDocs(publicacionesCollection);
          const publicacionesData = publicacionesSnapshot.docs.reduce((acc, doc) => {
            acc[doc.id] = doc.data().photo; // Assumes 'photo' is the field name for image URL
            return acc;
          }, {});

          // Add image URLs to CVs data
          const cvsWithImages = cvsData.map(cv => ({
            ...cv,
            fotoUrl: publicacionesData[cv.userIdPublicacion] || '', // Use an empty string if no URL found
          }));

          setCvs(cvsWithImages);
        } else {
          console.log('No user is currently signed in.');
        }
      } catch (error) {
        console.error("Error fetching CVs: ", error);
      }
      setLoading(false);
    };

    fetchCvs();
  }, []);

  const handleEliminarConfirmation = (id) => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        handleEliminar(id);
      }
    });
  };

  const handleEliminar = async (id) => {
    try {
      await deleteDoc(doc(db, 'mailEnviadosPostulado', id));
      setCvs(cvs.filter(cv => cv.id !== id));
    } catch (error) {
      console.error("Error deleting CV: ", error);
    }
  };

  if (loading) {
    return  <Cargando/>;
  }

  return (
    <div className="container mt-4">
      <h1 className='text-white'>Cv enviados</h1>
      <div className="row">
        <div className="col">
          <div className="footer-modal">
            <Link to={'/buscar-trabajo'} className="btn btn-secondary mt-2 mb-2">Volver al inicio</Link>
          </div>
          <table className="table table-custom table-hover">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nº Paciente</th>
                <th>Entidad</th>
                
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cvs.length > 0 ? (
                cvs.map(cv => (
                  <tr key={cv.id}>
                    <td>
                      <img 
                        src={cv.fotoUrl} 
                        alt="Foto de publicación" 
                        style={{ 
                          width: '50px', 
                          height: '50px', 
                          objectFit: 'cover', 
                          borderRadius: '50%' // Makes the image circular
                        }} 
                      />
                    </td>
                    
                    <td className='text-white'>{cv.numeroPaciente}</td>
                    <td className='text-white'>{cv.NombreCliente}</td>
                    <td className='text-white'>{cv.estado}</td>
                    <td>
                      <Link to={`/verCaso/${cv.userIdPublicacion}`} className="btn btn-light me-2 mb-2">
                        <i className="fa-regular fa-eye"></i>
                      </Link>
                      <button 
                        className="btn btn-light me-2 mb-2"
                        onClick={() => handleEliminarConfirmation(cv.id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="alert alert-secondary text-center">No hay CVs enviados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CvEnviados;