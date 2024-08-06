import React, { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase'; // Asegúrate de que la configuración de Firebase esté correctamente importada

const MiCuenta = () => {
  const [userData, setUserData] = useState(null); // Estado para almacenar los datos del usuario
  const [loading, setLoading] = useState(true); // Estado para manejar la carga de datos
  const [error, setError] = useState(null); // Estado para manejar posibles errores

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser; // Obtiene el usuario actual autenticado
        if (user) {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid)); // Obtiene el documento del usuario desde Firestore usando el UID
          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Almacena los datos del usuario en el estado
          } else {
            setError('No se encontraron datos del usuario.'); // Maneja el caso en que el documento no existe
          }
        } else {
          setError('Usuario no autenticado.'); // Maneja el caso en que no hay un usuario autenticado
        }
      } catch (err) {
        setError('Error al cargar los datos del usuario.'); // Maneja cualquier error durante la recuperación de datos
      } finally {
        setLoading(false); // Cambia el estado de carga a false independientemente del resultado
      }
    };

    fetchUserData(); // Llama a la función para obtener los datos del usuario
  }, []); // El efecto se ejecuta solo una vez cuando el componente se monta

  if (loading) return <p>Cargando...</p>; // Muestra un mensaje de carga mientras se obtienen los datos
  if (error) return <p>{error}</p>; // Muestra un mensaje de error si ocurrió algún problema

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Mi Cuenta</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Datos de Usuario</h5>
              {userData ? (
                <>
                  <p className="card-text"><strong>Nombre:</strong> {userData.nombre} {userData.apellido}</p>
                  <p className="card-text"><strong>Teléfono:</strong> {userData.phoneNumber}</p>
                  <p className="card-text"><strong>Email:</strong> {userData.email}</p>
                  <div className="d-flex justify-content-between mt-4">
                    <button className="btn btn-primary">Cambiar Contraseña</button>
                    <button className="btn btn-secondary">Editar Cuenta</button>
                    <button className="btn btn-danger">Eliminar Perfil</button>
                  </div>
                </>
              ) : (
                <p>No se encontraron datos del usuario.</p> // Mensaje en caso de que no haya datos del usuario
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiCuenta;