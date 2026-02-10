import React, { useEffect, useState } from 'react';

export default function SplashScreen({ fadeOut }) {
  return (
    <div className={`splash-screen ${fadeOut ? 'fade-out' : ''}`}>
      <div className="splash-content">
        {/* LOGO ANIMÉ */}
        <h1 className="splash-logo">
          POKÉ<span style={{ color: '#e53e3e' }}>DEX</span>
        </h1>

        {/* POKÉBALL QUI TOURNE */}
        <div className="splash-pokeball">
            <div className="splash-pokeball-button"></div>
        </div>

        {/* TEXTE DE CHARGEMENT */}
        <div className="splash-text">
          INITIALISATION DU SYSTÈME...
        </div>
        
        {/* BARRE DE PROGRESSION */}
        <div className="progress-container">
           <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
}