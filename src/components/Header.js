import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../firebaseConfg/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Box,
  Container,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import './css/NavBar.css';

const MySwal = withReactContent(Swal);

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userRol, setUserRol] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchUserData = async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRol(userData.userRol);
          } else {
            console.error('No se encontró el documento del usuario');
            setUserRol('guest');
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
          setUserRol('guest');
        }
      } else {
        setUserRol('guest');
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      fetchUserData(user);
    });

    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOutConfirmation = () => {
    MySwal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas cerrar sesión?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        handleSignOut();
      }
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (userRol === null) {
    return <div>Loading...</div>;
  }

  return (
    <AppBar position="fixed" className="app-bar">
      <Container maxWidth="lg">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleMenuOpen}
              className="menu-icon"
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" className="logo">
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Acompañante Terapéuticos
            </Link>
          </Typography>
          {!isMobile && (
            <Box className="nav-links">
              {userRol === 'guest' && (
                <>
                  <Button color="inherit" component={Link} to="/buscar-trabajo">
                    Buscar Trabajo
                  </Button>
                  <Button color="inherit" component={Link} to="/buscar-acompanante">
                    Buscar AT
                  </Button>
                  <Button color="inherit" component={Link} to="/login">
                    Ingresar
                  </Button>
                </>
              )}
              {userRol === 'reclutador' && (
                <>
                  <Button color="inherit" component={Link} to="/buscar-acompanante">
                    Inicio
                  </Button>
                  <Button color="inherit" component={Link} to="/misPublicaciones" className="navbar-button">
                    Mis Publicaciones
                  </Button>
                  <Button color="inherit" component={Link} to="/cv-recibido" className="navbar-button">
                    CV Recibidos
                  </Button>
                </>
              )}
              {userRol === 'empleado' && (
                <>
                  <Button color="inherit" component={Link} to="/buscar-trabajo">
                    Inicio
                  </Button>
                  <Button color="inherit" component={Link} to="/miCuenta" className="navbar-button">
                    Mi Cuenta
                  </Button>
                  <Button color="inherit" component={Link} to="/cvEnvidos" className="navbar-button">
                    CV Enviados
                  </Button>
                  <Button color="inherit" component={Link} to="/perfilLaboralUpdate" className="navbar-button">
                    Mi Perfil Laboral
                  </Button>
                </>
              )}
              {userRol !== 'guest' && (
                <Button color="inherit" onClick={handleSignOutConfirmation} startIcon={<ExitToAppIcon />} className="navbar-button">
                  Cerrar Sesión
                </Button>
              )}
            </Box>
          )}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            className="menu"
          >
            {userRol === 'guest' && (
              <>
                <MenuItem component={Link} to="/buscar-trabajo">Buscar Trabajo</MenuItem>
                <MenuItem component={Link} to="/buscar-acompanante">Buscar AT</MenuItem>
                <MenuItem component={Link} to="/login">Ingresar</MenuItem>
              </>
            )}
            {userRol === 'reclutador' && (
              <>
                <MenuItem component={Link} to="/buscar-acompanante">Inicio</MenuItem>
                <MenuItem component={Link} to="/misPublicaciones"><EditIcon /> Mis Publicaciones</MenuItem>
                <MenuItem component={Link} to="/cv-recibido"><VisibilityIcon /> CV Recibidos</MenuItem>
              </>
            )}
            {userRol === 'empleado' && (
              <>
                <MenuItem component={Link} to="/miCuenta"><AccountCircle /> Mi Cuenta</MenuItem>
                <MenuItem component={Link} to="/cvEnvidos"><VisibilityIcon /> CV Enviados</MenuItem>
                <MenuItem component={Link} to="/perfilLaboralUpdate"><VisibilityIcon /> Mi Perfil Laboral</MenuItem>
              </>
            )}
            {userRol !== 'guest' && (
              <MenuItem onClick={handleSignOutConfirmation}><ExitToAppIcon /></MenuItem>
            )}
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;