
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
function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Header/>
        <Routes>
          <Route path='/' element={<Show/>} />
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
          <Route path='/verCaso/:id' element={<VerCaso/>} />
          <Route path='/create' element={<Create/>} />
          <Route path='/edit/:id' element={<Edit/>} />        
        </Routes>
        {/* <Footer/> */}
      </BrowserRouter>
   
    </div>
  );
}

export default App;
