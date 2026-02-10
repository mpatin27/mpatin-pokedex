// --- DANS src/components/Welcome.jsx ---

import React from 'react';

export default function Welcome() {
  return (
    <div className="welcome-container">
      <div className="welcome-content">
        
        {/* 1. LE TITRE */}
        <h1 
          className="anim-enter delay-1"
          style={{ 
            fontSize: '4rem', margin: '0 0 20px 0', 
            color: '#2d3748', letterSpacing: '5px', fontWeight:'900' 
          }}
        >
          POKÉ<span style={{ color: '#e53e3e' }}>DEX</span>
        </h1>

        {/* 2. LA POKÉBALL (MODIFIÉ) */}
        {/* Ce wrapper gère l'arrivée en rebond */}
        <div className="anim-enter delay-2">
           {/* La balle elle-même tourne en permanence */}
           <div className="giant-pokeball spinning-ball">
             <div className="gp-button"></div>
           </div>
        </div>

        {/* 3. LE TEXTE */}
        <p 
          className="anim-enter delay-3"
          style={{ 
            fontSize: '1.2rem', color: '#4a5568', maxWidth: '450px', 
            lineHeight: '1.6', marginTop: '30px', fontWeight:'500' 
          }}
        >
          Bienvenue sur votre base de données ultime.<br />
          Sélectionnez un sujet dans la liste pour accéder aux archives.
        </p>
      </div>
    </div>
  );
}