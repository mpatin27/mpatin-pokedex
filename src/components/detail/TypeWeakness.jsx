import React from 'react';
import { calculateWeaknesses } from '../../utils/typeHelper';
import { typeColors, typeTranslations } from '../../utils/pokemonConsts';

export default function TypeWeakness({ types }) {
  const typeNames = types.map(t => t.type.name);
  const effectiveness = calculateWeaknesses(typeNames);

  const multipliers = {
    x4: [],   // Très Dangereux
    x2: [],   // Dangereux
    x05: [],  // Résistant
    x025: [], // Très Résistant
    x0: []    // Immunisé
  };

  // On trie les types dans les bonnes cases
  Object.entries(effectiveness).forEach(([type, value]) => {
    if (value === 4) multipliers.x4.push(type);
    if (value === 2) multipliers.x2.push(type);
    if (value === 0.5) multipliers.x05.push(type);
    if (value === 0.25) multipliers.x025.push(type);
    if (value === 0) multipliers.x0.push(type);
  });

  const renderBadge = (type) => (
    <span key={type} style={{
      background: typeColors[type],
      color: 'white',
      padding: '4px 10px',
      borderRadius: '6px',
      fontSize: '0.65rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      marginRight: '6px',
      marginBottom: '6px',
      display: 'inline-block',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
    }}>
      {typeTranslations[type] || type}
    </span>
  );

  return (
    <div className="weakness-container" style={{marginTop:'20px'}}>
      
      {/* 1. LES FAIBLESSES (ROUGE / ORANGE) */}
      {(multipliers.x4.length > 0 || multipliers.x2.length > 0) && (
        <div style={{marginBottom:'15px'}}>
          <div className="section-sub-title danger">Faiblesses</div>
          
          {multipliers.x4.length > 0 && (
            <div className="weakness-row">
              <span className="mult-label danger">x4</span>
              <div className="badges">{multipliers.x4.map(renderBadge)}</div>
            </div>
          )}
          
          {multipliers.x2.length > 0 && (
            <div className="weakness-row">
              <span className="mult-label warning">x2</span>
              <div className="badges">{multipliers.x2.map(renderBadge)}</div>
            </div>
          )}
        </div>
      )}

      {/* 2. LES RÉSISTANCES (VERT) */}
      {(multipliers.x05.length > 0 || multipliers.x025.length > 0) && (
        <div style={{marginBottom:'15px'}}>
          <div className="section-sub-title success">Résistances</div>
          
          {multipliers.x05.length > 0 && (
            <div className="weakness-row">
              <span className="mult-label resistant">x0.5</span>
              <div className="badges">{multipliers.x05.map(renderBadge)}</div>
            </div>
          )}
          
          {multipliers.x025.length > 0 && (
            <div className="weakness-row">
              <span className="mult-label super-resistant">x0.25</span>
              <div className="badges">{multipliers.x025.map(renderBadge)}</div>
            </div>
          )}
        </div>
      )}

      {/* 3. LES IMMUNITÉS (GRIS) */}
      {multipliers.x0.length > 0 && (
        <div>
          <div className="section-sub-title neutral">Immunités</div>
          <div className="weakness-row">
            <span className="mult-label immune">x0</span>
            <div className="badges">{multipliers.x0.map(renderBadge)}</div>
          </div>
        </div>
      )}

    </div>
  );
}