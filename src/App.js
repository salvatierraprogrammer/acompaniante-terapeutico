
import './App.css';
import Show from './components/Show';
import Create from './components/Create';
import Edit from './components/Edit';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BuscarTrabajo from './components/BuscarTrabajo';
import BuscarAcompanante from './components/BuscarAcompanante';
import ShowPerfilAt from './components/ShowPerfilAt';
import MisPublicaciones from './components/MisPublicaciones';
import NuevaPublicacion from './components/NuevaPublicacion';
import MiCuenta from './components/MiCuenta';
import CvEnviados from './components/CvEnviados';
import PerfilLaboralUpdate from './components/PerfilLaboralUpdate';
import Login from './components/Login';
import CrearCuenta from './components/CrearCuenta';
import EditarPerfilLaboral from './components/EditarPerfilLaboral';
import CrearPerfilLaboral from './components/CrearPerfilLaboral';
import Header from './components/Header';
import Footer from './components/Footer';
import VerCaso from './components/VerCaso';
import Administrador from './components/Administrador';
import UsuariosNuevos from './components/UsuariosNuevos';
import VerUsuarios from './components/VerUsuarios';
import CvRecibido from './components/CvRecibido';
import Iniciar from './components/Iniciar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<Show/>} />
          <Route path='/acompaniante-terapeutico' element={<Iniciar />} />
          <Route path='/buscar-trabajo' element={<BuscarTrabajo />} />
          <Route path='/buscar-acompanante' element={<BuscarAcompanante />} />
          <Route path='/showPerfil/:id' element={<ShowPerfilAt />} />
          <Route path='/misPublicaciones' element={<MisPublicaciones/>} />
          <Route path='/nuevaPublicacion' element={<NuevaPublicacion/>} />
          <Route path='/perfilLaboralUpdate' element={<PerfilLaboralUpdate/>} />
          <Route path='/cvEnvidos' element={<CvEnviados/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/crearCuenta' element={<CrearCuenta/>} />
          <Route path='/editarPerfilLaboral' element={<EditarPerfilLaboral/>} />
          <Route path="/crear-perfil-laboral" element={<CrearPerfilLaboral />} />
          <Route path='/miCuenta' element={<MiCuenta/>} />
          <Route path='/admin' element={<Administrador/>} />
          <Route path='/usuarios-nuevos' element={<UsuariosNuevos/>} />
          <Route path='/verCaso/:id' element={<VerCaso/>} />
          <Route path='/ver-usuario/:id' element={<VerUsuarios/>} />
          <Route path='/cv-recibido' element={<CvRecibido/>} />
       


          
          <Route path='/create' element={<Create/>} />
          <Route path='/edit/:id' element={<Edit/>} />        
        </Routes>
        <br></br>
                <Footer/>
      </BrowserRouter>
   
    </div>
  );
}

export default App;
