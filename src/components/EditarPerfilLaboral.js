import React, { useEffect, useState, useCallback } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';
import { useNavigate } from 'react-router-dom';

const EditarPerfilLaboral = () => {
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    telefono: '',
    email: '',
    experiencia: '',
    formacion: '',
    sobreMi: '',
    localidad: '',
    preferenciaLaboral: '',
    zona: '',
    images: '',
    estado: 'Disponible'
  });

  const navigate = useNavigate();

  const fetchPerfilData = useCallback(async () => {
    try {
      console.log('Fetching perfil data...');
      const user = auth.currentUser;
      if (user) {
        const perfilDoc = doc(db, 'perfilLaboral', user.uid);
        const perfilSnapshot = await getDoc(perfilDoc);
        if (perfilSnapshot.exists()) {
          const data = perfilSnapshot.data();
          console.log('Perfil data:', data);
          setPerfilData(data);
          setFormData(data);
        } else {
          setError('No se encontraron datos del perfil. Crea uno primero.');
          navigate('/crear-perfil-laboral');
        }
      } else {
        setError('Usuario no autenticado.');
        navigate('/login');
      }
    } catch (err) {
      setError('Error al cargar los datos del perfil.');
      console.error('Error fetching perfil data:', err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchPerfilData();
  }, [fetchPerfilData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      const user = auth.currentUser;
      if (user) {
        const perfilDoc = doc(db, 'perfilLaboral', user.uid);
        await updateDoc(perfilDoc, formData);
        alert('Perfil actualizado con éxito.');
        navigate('/perfilLaboralUpdate');
      } else {
        setError('Usuario no autenticado.');
        navigate('/login');
      }
    } catch (err) {
      setError('Error al actualizar el perfil.');
      console.error('Error updating perfil:', err);
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Actualizar Perfil Laboral</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nombreCompleto" className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    id="nombreCompleto"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    className="form-control"
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
                <div className="mb-3">
                  <label htmlFor="experiencia" className="form-label">Experiencia</label>
                  <textarea
                    id="experiencia"
                    name="experiencia"
                    value={formData.experiencia}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="formacion" className="form-label">Formación</label>
                  <input
                    type="text"
                    id="formacion"
                    name="formacion"
                    value={formData.formacion}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="sobreMi" className="form-label">Sobre Mí</label>
                  <textarea
                    id="sobreMi"
                    name="sobreMi"
                    value={formData.sobreMi}
                    onChange={handleChange}
                    className="form-control"
                    rows="3"
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
                  <label htmlFor="preferenciaLaboral" className="form-label">Preferencia Laboral</label>
                  <input
                    type="text"
                    id="preferenciaLaboral"
                    name="preferenciaLaboral"
                    value={formData.preferenciaLaboral}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="zona" className="form-label">Zona</label>
                  <input
                    type="text"
                    id="zona"
                    name="zona"
                    value={formData.zona}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="images" className="form-label">Imagen</label>
                  <input
                    type="url"
                    id="images"
                    name="images"
                    value={formData.images}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="estado" className="form-label">Estado</label>
                  <select
                    id="estado"
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="Disponible">Disponible</option>
                    <option value="Consultar">Consultar</option>
                    <option value="No Disponible">No Disponible</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-warning">Actualizar</button>
              </form>
              {error && <p className="text-danger mt-3">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarPerfilLaboral;