import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfg/firebase'; // Asegúrate de importar correctamente tu configuración de Firebase y Firestore
import { doc, setDoc } from 'firebase/firestore';
import './/css/CrearCuenta.css'; // Asegúrate de tener estilos si es necesario

const CrearCuenta = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [dni, setDni] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [userRol, setUserRol] = useState('empleado'); // Valor por defecto
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            // Validaciones
            if (!nombre.trim()) {
                setError('Por favor, ingresa tu nombre.');
                return;
            }
            if (!apellido.trim()) {
                setError('Por favor, ingresa tu apellido.');
                return;
            }
            if (dni.length <= 7) {
                setError('El DNI debe tener más de 8 caracteres.');
                return;
            }
            if (phoneNumber.length <= 7) {
                setError('El número de teléfono debe tener más de 10 caracteres.');
                return;
            }
            const emailRegex = /^(?=.*[@])(?=.*[.]).*$/;
            const validEmailProviders = ['gmail.com', 'hotmail.com', 'yahoo.com'];
            const emailProvider = email.split('@')[1];
            if (!emailRegex.test(email) || !validEmailProviders.includes(emailProvider)) {
                setError('Ingresa un correo electrónico válido de Gmail, Hotmail o Yahoo.');
                return;
            }
            if (password.length <= 5) {
                setError('La contraseña debe tener al menos 7 caracteres.');
                return;
            }

            // Crear el usuario en Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Guardar información adicional en Firestore
            await setDoc(doc(db, 'usuarios', user.uid), {
                nombre,
                apellido,
                dni,
                phoneNumber,
                userRol,
                userId: user.uid,
                email,
                // Puedes agregar más campos aquí si es necesario
            });

            // Navegar a la pantalla de inicio de sesión después del registro exitoso
            navigate('/login');
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            setError('Hubo un problema al crear el usuario. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="container">
            <h1 className="text-center mt-4">Crear Cuenta</h1>
            <div className="row justify-content-center mt-4">
                <div className="col-md-6 col-lg-4">
                    <div className="card p-4 shadow-sm">
                        <form onSubmit={handleRegister}>
                            <div className="mb-3">
                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="nombre"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="apellido" className="form-label">Apellido</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="apellido"
                                    value={apellido}
                                    onChange={(e) => setApellido(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="dni" className="form-label">DNI</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="dni"
                                    value={dni}
                                    onChange={(e) => setDni(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="phoneNumber" className="form-label">Número de Teléfono</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="phoneNumber"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Correo Electrónico</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="role" className="form-label">Selecciona un Rol</label>
                                <select
                                    id="role"
                                    className="form-control"
                                    value={userRol}
                                    onChange={(e) => setUserRol(e.target.value)}
                                >
                                    <option value="empleado">Acompañante Terapeútico</option>
                                    <option value="reclutador">Reclutador</option>
                                </select>
                            </div>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <button type="submit" className="btn btn-primary">Crear Cuenta</button>
                            <div className="text-center mt-3">
                                <p>¿Ya tienes cuenta?</p>
                                <Link to={"/login"} className="btn btn-secondary">Iniciar Sesión</Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CrearCuenta;