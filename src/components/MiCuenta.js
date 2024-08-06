import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase'; // Asegúrate de que la configuración de Firebase esté correctamente importada
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import MiPerfilReclutador from './MiPerfilReclutador';

const MiCuenta = () => {
  const [userData, setUserData] = useState(null);
  const [userRol, setUserRol] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showEditAccountModal, setShowEditAccountModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updatedUserData, setUpdatedUserData] = useState({
    nombre: '',
    apellido: '',
    phoneNumber: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);
            setUserRol(data.userRol);
            setUpdatedUserData({
              nombre: data.nombre,
              apellido: data.apellido,
              phoneNumber: data.phoneNumber
            });
          } else {
            setError('No se encontraron datos del usuario.');
          }
        } else {
          setError('Usuario no autenticado.');
        }
      } catch (err) {
        setError('Error al cargar los datos del usuario.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePassword = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await user.updatePassword(newPassword);
        alert('Contraseña cambiada exitosamente.');
        setShowChangePasswordModal(false);
        setNewPassword('');
      } catch (error) {
        alert('Error al cambiar la contraseña: ' + error.message);
      }
    }
  };

  const handleEditAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'usuarios', user.uid);
        await updateDoc(userRef, updatedUserData);
        alert('Datos de usuario actualizados exitosamente.');
        setUserData(updatedUserData);
        setShowEditAccountModal(false);
      } catch (error) {
        alert('Error al actualizar los datos: ' + error.message);
      }
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userRef = doc(db, 'usuarios', user.uid);
        await deleteDoc(userRef);
        await user.delete();
        alert('Cuenta eliminada exitosamente.');
        // Redirigir a la página de inicio o cerrar sesión
      } catch (error) {
        alert('Error al eliminar la cuenta: ' + error.message);
      }
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

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
                    <button className="btn btn-circle btn-circle-primary" onClick={() => setShowChangePasswordModal(true)}>
                      <i className="fa-solid fa-key"></i> {/* Icono para cambiar contraseña */}
                    </button>
                    <button className="btn btn-circle btn-circle-secondary" onClick={() => setShowEditAccountModal(true)}>
                      <i className="fa-solid fa-user-edit"></i> {/* Icono para editar cuenta */}
                    </button>
                    <button className="btn btn-circle btn-circle-danger" onClick={() => setShowDeleteAccountModal(true)}>
                      <i className="fa-solid fa-trash"></i> {/* Icono para eliminar cuenta */}
                    </button>
                  </div>
                </>
              ) : (
                <p>No se encontraron datos del usuario.</p>
              )}
            </div>
          </div>
          
          {/* Mostrar MiPerfilReclutador solo si el rol es 'reclutador' */}
          {userRol === 'reclutador' && (
            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">Mi perfil reclutador</h5>
                <MiPerfilReclutador />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Cambiar Contraseña */}
      <Modal show={showChangePasswordModal} onHide={() => setShowChangePasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Cambiar Contraseña</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formNewPassword">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Introduce tu nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowChangePasswordModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleChangePassword}>Cambiar Contraseña</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Editar Cuenta */}
      <Modal show={showEditAccountModal} onHide={() => setShowEditAccountModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formNombre">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tu nombre"
                value={updatedUserData.nombre}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, nombre: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formApellido">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tu apellido"
                value={updatedUserData.apellido}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, apellido: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Introduce tu teléfono"
                value={updatedUserData.phoneNumber}
                onChange={(e) => setUpdatedUserData({ ...updatedUserData, phoneNumber: e.target.value })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditAccountModal(false)}>Cancelar</Button>
          <Button variant="primary" onClick={handleEditAccount}>Guardar Cambios</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Eliminar Cuenta */}
      <Modal show={showDeleteAccountModal} onHide={() => setShowDeleteAccountModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar Cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteAccountModal(false)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDeleteAccount}>Eliminar Cuenta</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MiCuenta;