// src/components/TeamDock.jsx
import React, { useState } from 'react';

// Ajoute la prop onAnalyze
export default function TeamDock({ team, onRemove, onSelect, onAnalyze }) {
  const [isOpen, setIsOpen] = useState(false); 
  const slots = [0, 1, 2, 3, 4, 5];

  return (
    <div className={`team-dock-container ${isOpen ? 'open' : ''}`}>
      
      <div 
        className="dock-handle"
        onClick={() => setIsOpen(!isOpen)}
        title={isOpen ? "Réduire" : "Ouvrir l'équipe"}
      >
        <span style={{marginRight:'10px', fontSize:'1.2rem'}}>
          {isOpen ? '⬇' : '⬆'} 
        </span>
        Mon Équipe ({team.length}/6)
      </div>

      <div className="team-dock">
        {slots.map((i) => {
          const pokemon = team[i];
          return (
            <div key={i} className="team-slot" onClick={() => pokemon ? onSelect(pokemon.id) : null}>
              {pokemon ? (
                <div style={{position: 'relative', width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center'}}>
                   <div style={{position:'absolute', inset: '5px', borderRadius:'50%', background: pokemon.color, opacity: 0.3, zIndex:0}}></div>
                   <img src={pokemon.sprite} alt={pokemon.name} className="team-sprite" />
                   <button 
                     className="remove-btn"
                     onClick={(e) => { e.stopPropagation(); onRemove(pokemon.id); }}
                   >
                     ×
                   </button>
                </div>
              ) : (
                <div className="empty-slot">+</div>
              )}
            </div>
          );
        })}

        {/* --- NOUVEAU BOUTON ANALYSER --- */}
        {team.length > 0 && (
          <button className="analyze-btn" onClick={onAnalyze}>
            📊 Analyser
          </button>
        )}
      </div>
    </div>
  );
}