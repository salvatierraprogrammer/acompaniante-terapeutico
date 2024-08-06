import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { collection, addDoc, getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfg/firebase';

const EnviarCV = ({ show, handleClose, publicacionId, onSuccess }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cv, setCv] = useState(null);
  const [nombreCliente, setNombreCliente] = useState('');
  const [numeroPaciente, setNumeroPaciente] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPublicacionData = async () => {
      try {
        const publicacionDoc = await getDoc(doc(db, 'publicaciones', publicacionId));
        if (publicacionDoc.exists()) {
          const publicacionData = publicacionDoc.data();
          setNombreCliente(publicacionData.cliente);
          setNumeroPaciente(publicacionData.paciente); // Asegúrate de usar el campo correcto
        } else {
          setError('Publicación no encontrada.');
        }
      } catch (error) {
        setError('Error al obtener los datos de la publicación.');
        console.error("Error fetching publicacion data: ", error);
      }
    };

    if (publicacionId) {
      fetchPublicacionData();
    }
  }, [publicacionId]);

  const handleChange = (e) => {
    if (e.target.name === 'cv') {
      setCv(e.target.files[0]);
    } else {
      const { name, value } = e.target;
      switch (name) {
        case 'nombre':
          setNombre(value);
          break;
        case 'apellido':
          setApellido(value);
          break;
        case 'email':
          setEmail(value);
          break;
        case 'descripcion':
          setDescripcion(value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // Reset error message
    try {
      const user = auth.currentUser;
      if (user) {
        const userId = user.uid;
        const mailEnviadosCollection = collection(db, 'mailEnviadosPostulado');

        // Subida del archivo CV a Firebase Storage (opcional)
        let cvUrl = null;
        if (cv) {
          // Implementar lógica para subir a Firebase Storage si es necesario
          // cvUrl = await uploadFileToFirebaseStorage(cv);
          cvUrl = URL.createObjectURL(cv); // Solo para demostración
        }

        const mailData = {
          userIdUsers: userId,
          userIdPublicacion: publicacionId,
          NombreCliente: nombreCliente,
          numeroPaciente,
          nombre,
          apellido,
          email,
          descripcion,
          cvUrl,
          fechaEnvio: new Date()
        };

        await addDoc(mailEnviadosCollection, mailData);

        onSuccess(); // Notificar que el CV fue enviado
        handleClose(); // Cerrar el modal
      } else {
        setError('Usuario no autenticado.');
      }
    } catch (err) {
      setError('Error al enviar el CV.');
      console.error('Error sending CV:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Enviar CV</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              name="nombre"
              value={nombre}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              name="apellido"
              value={apellido}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control
              as="textarea"
              name="descripcion"
              value={descripcion}
              onChange={handleChange}
              rows={3}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Adjuntar CV</Form.Label>
            <Form.Control
              type="file"
              name="cv"
              onChange={handleChange}
              required
            />
          </Form.Group>
          {error && <p className="text-danger">{error}</p>}
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar CV'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EnviarCV;