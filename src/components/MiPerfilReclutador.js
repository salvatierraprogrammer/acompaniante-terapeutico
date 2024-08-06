import React, { useEffect, useState } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfg/firebase'; // Ensure Firebase configuration is correctly imported
import { Button, Form } from 'react-bootstrap';

const MiPerfilReclutador = ({ currentUserId }) => {
  const [profileData, setProfileData] = useState({
    emailLaboral: '',
    nombreEntidad: '',
    photo: '',
    userId: '',
    whatsapp: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({
    emailLaboral: '',
    nombreEntidad: '',
    photo: '',
    whatsapp: ''
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        if (!currentUserId) return; // Ensure currentUserId is available

        const profileRef = doc(db, 'reclutador', currentUserId);
        const profileDoc = await getDoc(profileRef);
        
        if (profileDoc.exists()) {
          // Document exists, set the data
          const data = profileDoc.data();
          setProfileData({
            emailLaboral: data.emailLaboral || '',
            nombreEntidad: data.nombreEntidad || '',
            photo: data.photo || '',
            userId: data.userId || '',
            whatsapp: data.whatsapp || ''
          });
          setUpdatedData({
            emailLaboral: data.emailLaboral || '',
            nombreEntidad: data.nombreEntidad || '',
            photo: data.photo || '',
            whatsapp: data.whatsapp || ''
          });
        } else {
          // Document does not exist, create a new one with default values
          const defaultData = {
            emailLaboral: '',
            nombreEntidad: '',
            photo: '', // Consider adding a placeholder image URL if needed
            userId: currentUserId,
            whatsapp: ''
          };
          await setDoc(profileRef, defaultData);
          setProfileData(defaultData);
          setUpdatedData(defaultData);
          console.warn('Profile created with default values for the given user ID.');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [currentUserId]);

  const handleUpdateProfile = async () => {
    try {
      if (!currentUserId) return; // Ensure currentUserId is available

      const profileRef = doc(db, 'reclutador', currentUserId);
      await updateDoc(profileRef, updatedData);
      alert('Perfil actualizado exitosamente.');
      setProfileData(updatedData);
      setIsEditing(false);
    } catch (error) {
      alert('Error al actualizar el perfil: ' + error.message);
    }
  };

  return (
    <div>
      <h5>Perfil del Reclutador</h5>
      <Form>
        <Form.Group controlId="formEmailLaboral">
          <Form.Label>Email Laboral</Form.Label>
          <Form.Control
            type="email"
            value={isEditing ? updatedData.emailLaboral : profileData.emailLaboral}
            onChange={(e) => setUpdatedData({ ...updatedData, emailLaboral: e.target.value })}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group controlId="formNombreEntidad">
          <Form.Label>Nombre de la Entidad</Form.Label>
          <Form.Control
            type="text"
            value={isEditing ? updatedData.nombreEntidad : profileData.nombreEntidad}
            onChange={(e) => setUpdatedData({ ...updatedData, nombreEntidad: e.target.value })}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group controlId="formPhoto">
          <Form.Label>Foto</Form.Label>
          <Form.Control
            type="text"
            value={isEditing ? updatedData.photo : profileData.photo}
            onChange={(e) => setUpdatedData({ ...updatedData, photo: e.target.value })}
            readOnly={!isEditing}
          />
        </Form.Group>
        <Form.Group controlId="formWhatsapp">
          <Form.Label>Whatsapp</Form.Label>
          <Form.Control
            type="text"
            value={isEditing ? updatedData.whatsapp : profileData.whatsapp}
            onChange={(e) => setUpdatedData({ ...updatedData, whatsapp: e.target.value })}
            readOnly={!isEditing}
          />
        </Form.Group>
        <div className="mt-3">
          {isEditing ? (
            <>
              <Button variant="primary" onClick={handleUpdateProfile}>Actualizar</Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)} className="ms-2">Cancelar</Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setIsEditing(true)}>Editar</Button>
          )}
        </div>
      </Form>
    </div>
  );
};

export default MiPerfilReclutador;