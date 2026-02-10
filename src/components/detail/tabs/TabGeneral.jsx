import React from 'react';
import StatRadar from '../../StatRadar'; // Vérifie que le chemin est bon !

export default function TabGeneral({ data }) {
  // Sécurité anti-crash
  if (!data) return null;

  // Sécurisation des données
  const abilities = data.abilities || [];
  const height = (data.height || 0) / 10;
  const weight = (data.weight || 0) / 10;
  const capture = data.captureRate || '?';

  return (
    <div className="fade-in">
      
      {/* 1. LE RADAR (Comme avant) */}
      <div className="section-title">Analyse de Combat</div>
      <div style={{ width: '100%', height: '250px', margin: '0 auto' }}>
        {/* On vérifie que stats existe avant d'afficher le radar */}
        {data.stats && <StatRadar stats={data.stats} color={data.color} />}
      </div>
      
      {/* 2. BIOMÉTRIE (Comme avant) */}
      <div className="section-title" style={{marginTop:'75px'}}>Biométrie</div>
      <div className="info-grid">
        
        {/* Talents */}
        <div className="info-box">
            <div className="info-label">Talents</div>
            <div className="info-value" style={{fontSize:'0.9rem', textTransform: 'capitalize'}}>
              {abilities.length > 0 ? (
                abilities.map((a) => (
                  <div key={a.ability.name}>
                    {/* On affiche le nom anglais pour l'instant pour éviter le crash */}
                    {a.ability.name.replace('-', ' ')} 
                    {a.is_hidden && <small style={{opacity: 0.6, marginLeft:'4px'}}>(Caché)</small>}
                  </div>
                ))
              ) : (
                "Aucun"
              )}
            </div>
        </div>

        {/* Taille / Poids / Capture */}
        <div className="info-box">
            <div className="info-label">Taille</div>
            <div className="info-value">{height} m</div>
        </div>
        
        <div className="info-box">
            <div className="info-label">Poids</div>
            <div className="info-value">{weight} kg</div>
        </div>
        
        <div className="info-box">
            <div className="info-label">Capture</div>
            <div className="info-value">{capture} %</div>
        </div>

      </div>

    </div>
  );
}