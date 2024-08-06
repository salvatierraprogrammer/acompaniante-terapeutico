import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase'; // Asegúrate de importar auth

const NuevaPublicacion = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    paciente: '',
    edad: '',
    sexo: '',
    localidad: '',
    zona: '',
    diagnostico: '',
    descripcion: '',
    telefono: '',
    email: '',
  });
  const [userData, setUserData] = useState({
    photo: '',
    nombreEntidad: '',
    emailLaboral: '',
    whatsapp: '',
  });
  const [userRol, setUserRol] = useState(null);
  const [loading, setLoading] = useState(true);

  const nuevaPublicacionCollection = collection(db, "publicaciones");

  useEffect(() => {
    const fetchUserRoleAndData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserRol(userData.userRol);
          setUserData({
            photo: userData.photo || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_AmH_mnnxa5khbmf8sQnFcOIXz3oWgfeU8ZBeXEORIA&s',
            nombreEntidad: userData.nombreEntidad || 'Nombre de la Entidad',
            emailLaboral: userData.emailLaboral || '',
            whatsapp: userData.whatsapp || '',
          });

          // Actualizar el estado del formulario con el email y telefono del usuario
          setFormData((prevData) => ({
            ...prevData,
            telefono: userData.whatsapp || '',
            email: userData.emailLaboral || '',
          }));
        }
      }
      setLoading(false);
    };

    fetchUserRoleAndData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user && userRol === 'reclutador') {
      const newPublication = {
        ...formData,
        userId: user.uid,
        cliente: userData.nombreEntidad,
        photo: userData.photo,
        estado: 'Disponible',
      };
      await addDoc(nuevaPublicacionCollection, newPublication);
      navigate('/');
    } else {
      // Manejar el caso en que el usuario no es un reclutador o no está autenticado
      alert('No tienes permiso para publicar.');
      navigate('/');
    }
  };

  if (loading) {
    return <div className="text-center">Cargando...</div>;
  }

  return (
    <div className="container">
      <h1 className="mt-4 text-center mb-4">Nueva Publicación</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-4 d-flex justify-content-center align-items-center">
                  <img
                    src={userData.photo}
                    alt="Foto del usuario"
                    className="img-fluid rounded-circle"
                    style={{ maxWidth: '150px' }}
                  />
                </div>
                <div className="col-md-8">
                  <h5>{userData.nombreEntidad}</h5>
                </div>
                <div className="col-md-12">
                  <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                    {/* Campos del formulario */}
                    <div className="mb-3">
                      <label htmlFor="paciente" className="form-label">Paciente</label>
                      <input
                        type="text"
                        id="paciente"
                        name="paciente"
                        value={formData.paciente}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="edad" className="form-label">Edad</label>
                      <input
                        type="text"
                        id="edad"
                        name="edad"
                        value={formData.edad}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="sexo" className="form-label">Sexo</label>
                      <input
                        type="text"
                        id="sexo"
                        name="sexo"
                        value={formData.sexo}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="localidad" className="form-label">Localidad</label>
                      <input
                        type="text"
                        id="localidad"
                        name="localidad"
                        value={formData.localidad}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="zona" className="form-label">Zona</label>
                      <select
                        id="zona"
                        name="zona"
                        value={formData.zona}
                        onChange={handleChange}
                        className="form-control"
                        required
                      >
                        <option value="">Seleccionar Zona</option>
                        <option value="CABA">CABA</option>
                        <option value="Zona Sur">Zona Sur</option>
                        <option value="Zona Norte">Zona Norte</option>
                        <option value="Zona Oeste">Zona Oeste</option>
                      </select>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="diagnostico" className="form-label">Diagnóstico</label>
                      <input
                        type="text"
                        id="diagnostico"
                        name="diagnostico"
                        value={formData.diagnostico}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="descripcion" className="form-label">Descripción</label>
                      <textarea
                        id="descripcion"
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleChange}
                        className="form-control"
                        rows="3"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="telefono" className="form-label">Teléfono</label>
                      <input
                        type="text"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary">Agregar Publicación</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NuevaPublicacion;