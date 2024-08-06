import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebaseConfg/firebase'; // Asegúrate de importar correctamente tu configuración de Firebase
import { doc, getDoc } from 'firebase/firestore';
import './css/Login.css'; // Asegúrate de tener estilos si es necesario

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Iniciar sesión con el correo y la contraseña proporcionados
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Obtener la información del usuario desde Firestore
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRol = userData.userRol;

        // Redirigir al usuario según su rol
        if (userRol === 'reclutador') {
          navigate('/buscar-acompanante');
        } else if (userRol === 'empleado') {
          navigate('/buscar-trabajo');
        } else {
          navigate('/'); // Redirige a una página predeterminada si el rol no es reconocido
        }
        setIsAuthenticated(true); // Marca al usuario como autenticado
      } else {
        setError('No se encontró la información del usuario.');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    // Verificar si el usuario ya está autenticado al cargar el componente
    const checkAuth = () => {
      const user = auth.currentUser;
      if (user) {
        const fetchUserRole = async () => {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userRol = userData.userRol;
            if (userRol === 'reclutador') {
              navigate('/buscar-acompanante');
            } else if (userRol === 'empleado') {
              navigate('/buscar-trabajo');
            } else {
              navigate('/'); // Redirige a una página predeterminada si el rol no es reconocido
            }
          }
        };
        fetchUserRole();
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="container">
      <h1 className="text-center mt-4">Iniciar Sesión</h1>
      <div className="row justify-content-center mt-4">
        <div className="col-md-6 col-lg-4">
          <div className="card p-4 shadow-sm">
            <form onSubmit={handleSubmit}>
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
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
              <div className="text-center mt-3">
                <p>¿No tienes cuenta?</p>
                <Link to={"/crearCuenta"} className="btn btn-secondary">Crear Cuenta</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;