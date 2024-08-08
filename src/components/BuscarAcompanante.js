import React, { useEffect, useState } from 'react';
import './css/BuscarAcompanante.css';
import OpcionesReclutador from './OpcionesReclutador';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';
import { Button, Form } from 'react-bootstrap';
import Cargando from './Cargando';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';


const MySwal = withReactContent(Swal);

const BuscarAcompanante = () => {
  const [perfilLaboral, setPerfilLaboral] = useState([]);
  const [filteredPerfilLaboral, setFilteredPerfilLaboral] = useState([]);
  const [userRol, setUserRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState('Todos');
  const navigate = useNavigate();
  const perfilLaboralCollection = collection(db, 'perfilLaboral');
  const usersCollection = collection(db, 'usuarios');

  const getPerfilLaboral = async () => {
    const data = await getDocs(perfilLaboralCollection);
    setPerfilLaboral(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getUserRole = async (userId) => {
    const userDoc = await getDoc(doc(usersCollection, userId));
    if (userDoc.exists()) {
      setUserRol(userDoc.data().userRol);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        await getUserRole(userId);
        await getPerfilLaboral();
      } else {
        // No redirigir a login si el usuario no está autenticado
        await getPerfilLaboral();
      }
      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const filtered = perfilLaboral.filter(a =>
      a.nombreCompleto.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedZone === 'Todos' || a.zona === selectedZone)
    );
    setFilteredPerfilLaboral(filtered);
  }, [searchTerm, selectedZone, perfilLaboral]);

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
    } else if (userRol !== 'reclutador') {
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
    return <Cargando/>;
  }

  return (
    <div className="container">
      {userRol === 'reclutador' ? (
        <OpcionesReclutador />
      ) : userRol === 'empleado' ? (
        <div className="text-center">
          <Link to="/buscar-trabajo" className="btn btn-secondary text-white">Buscar Trabajo</Link>
        </div>
      ) : (
        <div className="text-center mb-4">
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </div>
      )}
      
    

      <h1 className="mt-4 text-center text-white">
        <i className="fa-solid fa-search"></i> Buscar Acompañante Terapéutico
      </h1>
      
      <div className="row mb-4">
       
        <div className="col-md-4 offset-md-4">
          <Form.Select
            value={selectedZone}
            onChange={(e) => setSelectedZone(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Zona Sur">Zona Sur</option>
            <option value="CABA">CABA</option>
            <option value="Zona Norte">Zona Norte</option>
            <option value="Zona Oeste">Zona Oeste</option>
          </Form.Select>
        </div>
      </div>

      <div className="row justify-content-center">
        {filteredPerfilLaboral.map(a => (
          <div className="col-md-6 col-lg-4" key={a.id}>
            <div className="card mb-4 shadow-sm">
              <div className="text-center">
                <img
                  src={a.images}
                  className="rounded-circle patient-photo mb-3"
                  alt={a.nombreCompleto}
                />
                <h5 className="card-title text-white">{a.nombreCompleto}</h5>
                <p className="card-text text-white">
                  <i className="fas fa-check-circle me-2"></i>
                  <strong className='text-white'>Estado: </strong>
                  <span className={`badge ${a.estado === 'Disponible' ? 'bg-success' : 'bg-secondary'}`}>
                    {a.estado}
                  </span>
                </p>
              </div>
              <div className="card-body">
                <p className="card-text text-white">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  <strong className='text-white'>Localidad:</strong> {a.localidad}
                </p>
                <p className="card-text text-white">
                  <i className="fas fa-map-marker-alt me-2"></i>
                  <strong className='text-white'>Zona:</strong> {a.zona}
                </p>
                <p className="card-text text-white">
                  <i className="fas fa-briefcase me-2"></i>
                  <strong className='text-white'>Preferencia Laboral:</strong> {a.preferenciaLaboral}
                </p>
                <p className="card-text text-white">
                  <i className="fas fa-graduation-cap me-2"></i>
                  <strong className='text-white'>Formación:</strong> {a.formacion}
                </p>
                <p className="card-text text-white">
                  <i className="fas fa-certificate me-2"></i>
                  <strong className='text-white'>Título:</strong> {a.titulo}
                </p>
                <div className="text-center mt-3">
                  <Button
                    className="btn btn-warning"
                    onClick={() => handleContactClick(a.id)}
                  >
                    <i className="fa-regular fa-pen-to-square"></i> Contactar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BuscarAcompanante;