import React, { useEffect, useState } from 'react';
import './css/BuscarTrabajo.css';
import OpcionesAt from './OpcionesAt';
import { Link } from 'react-router-dom';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import EnviarCV from './EnviarCV';
import { Button, Form } from 'react-bootstrap';

const BuscarTrabajo = () => {
  const [publicaciones, setPublicaciones] = useState([]);
  const [users, setUsers] = useState([]);
  const [userRol, setUserRol] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPublicacion, setSelectedPublicacion] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cvEnviado, setCvEnviado] = useState({});
  const [selectedZone, setSelectedZone] = useState('Todos');

  const publicacionesCollection = collection(db, 'publicaciones');
  const usersCollection = collection(db, 'usuarios');
  const mailEnviadosCollection = collection(db, 'mailEnviadosPostulado');

  const getPublicaciones = async () => {
    const data = await getDocs(publicacionesCollection);
    setPublicaciones(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const getUsers = async () => {
    const data = await getDocs(usersCollection);
    setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const fetchUserRol = async (userId) => {
    const userDoc = await getDoc(doc(db, 'usuarios', userId));
    if (userDoc.exists()) {
      setUserRol(userDoc.data().userRol);
    } else {
      setUserRol(null);
    }
  };

  useEffect(() => {
    const checkCvEnviado = async () => {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const querySnapshot = await getDocs(mailEnviadosCollection);
        const enviado = {};
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.userIdUsers === userId) {
            enviado[data.userIdPublicacion] = true;
          }
        });
        setCvEnviado(enviado);
      }
    };

    checkCvEnviado();
  }, [auth.currentUser]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchUserRol(user.uid);
        await getPublicaciones();
        await getUsers();
        setLoading(false);
      } else {
        setUserRol(null);
        await getPublicaciones();  // Fetch publicaciones even if user is not logged in
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleShowModal = (publicacionId) => {
    setSelectedPublicacion(publicacionId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPublicacion(null);
  };

  const handleCvEnviado = (publicacionId) => {
    setCvEnviado((prev) => ({ ...prev, [publicacionId]: true }));
  };

  const publicacionesDisponibles = publicaciones.filter(pub => 
    (selectedZone === 'Todos' || pub.zona === selectedZone) &&
    pub.estado === 'Disponible'
  );

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="container">
      {userRol === 'empleado' && (
        <>
          <OpcionesAt />
          <h1 className="mt-4 text-center">
            <i className="fa-solid fa-search"></i> Buscar Trabajo
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
          <div className="text-center mb-4">
            {selectedPublicacion && (
              <EnviarCV
                show={showModal}
                handleClose={handleCloseModal}
                publicacionId={selectedPublicacion}
                correoPublicacion={publicaciones.find(pub => pub.id === selectedPublicacion)?.email}
                onSuccess={() => {
                  handleCvEnviado(selectedPublicacion);
                }}
              />
            )}
          </div>
        </>
      )}
      <br />
      <div className="row justify-content-center">
        {publicacionesDisponibles.length > 0 ? (
          publicacionesDisponibles.map(p => (
            <div className="col-md-6 col-lg-4" key={p.id}>
              <div className="card mb-4 shadow-sm">
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center text-center mb-3">
                    <img
                      src={p.photo}
                      className="rounded-circle patient-photo mb-3"
                      alt={`Foto de ${p.cliente}`}
                    />
                    <h5 className="card-title">{p.cliente}</h5>
                  </div>
                  <div className="text-start">
                    <p className="card-text"><i className="fas fa-birthday-cake me-2"></i><strong>Edad:</strong> {p.edad}</p>
                    <p className="card-text"><i className="fas fa-venus-mars me-2"></i><strong>Sexo:</strong> {p.sexo}</p>
                    <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Localidad:</strong> {p.localidad}</p>
                    <p className="card-text"><i className="fas fa-map-marker-alt me-2"></i><strong>Zona:</strong> {p.zona}</p>
                    <p className="card-text"><i className="fas fa-notes-medical me-2"></i><strong>Diagnóstico:</strong> {p.diagnostico}</p>
                    <p className="card-text"><i className="fas fa-align-left me-2"></i><strong>Descripción:</strong> {p.descripcion}</p>
                    <p className="card-text"><i className="fas fa-phone-alt me-2"></i><strong>Teléfono:</strong> {p.telefono}</p>
                    <p className="card-text"><i className="fas fa-envelope me-2"></i><strong>Email:</strong> {p.email}</p>
                    <div className="text-center mt-3">
                      {userRol === 'empleado' ? (
                        cvEnviado[p.id] ? (
                          <Button className="btn btn-secondary" disabled>
                            CV Enviado
                          </Button>
                        ) : (
                          <Button
                            className="btn btn-primary"
                            onClick={() => handleShowModal(p.id)}
                          >
                            Enviar CV
                          </Button>
                        )
                      ) : (
                        <Link to="/login" className="btn btn-primary">Iniciar Sesión para Enviar CV</Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">No hay trabajos disponibles.</p>
        )}
      </div>
    </div>
  );
};

export default BuscarTrabajo;