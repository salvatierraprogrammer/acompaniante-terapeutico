import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container">
            <div className="jumbotron mt-4">
                <h1 className="display-4">Bienvenido a Nuestra Plataforma de Acompañantes Terapéuticos</h1>
                <p className="lead">
                    Esta es la plataforma perfecta tanto para aquellos que buscan un acompañante terapéutico 
                    como para los profesionales que buscan oportunidades de trabajo en este campo.
                </p>
                <hr className="my-4" />
                <p>
                    Encuentra acompañantes terapéuticos calificados y con experiencia que pueden ayudarte a 
                    mejorar tu bienestar y calidad de vida. Si eres un profesional en busca de trabajo, descubre 
                    las numerosas oportunidades que te esperan aquí.
                </p>
                <hr className="my-4" />
                <div className="row">
                    <div className="col-md-6">
                        <h2>Busco Acompañante Terapéutico</h2>
                        <p>
                            Explora perfiles de profesionales, revisa sus calificaciones y encuentra al 
                            acompañante terapéutico adecuado para tus necesidades.
                        </p>
                        <Link className="btn btn-primary btn-lg" to="/buscar-acompanante" role="button">
                            Buscar Acompañante
                        </Link>
                    </div>
                    <div className="col-md-6">
                        <h2>Busco Trabajo como Acompañante Terapéutico</h2>
                        <p>
                            Registra tu perfil, muestra tu experiencia y habilidades, y encuentra oportunidades 
                            de trabajo en tu área.
                        </p>
                        <Link className="btn btn-secondary btn-lg" to="/buscar-trabajo" role="button">
                            Buscar Trabajo
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;