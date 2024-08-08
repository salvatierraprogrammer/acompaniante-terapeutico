import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBack = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Va a la página anterior
  };

  return (
    <div className="footer-modal">
      <button onClick={handleGoBack} className="btn btn-secondary mt-2 mb-2">
        Inicio
      </button>
    </div>
  );
};

export default GoBack;