import React, { useState, useRef } from 'react';
import { typeColors, typeTranslations } from '../../utils/pokemonConsts';

export default function PokemonVisual({ data, captured, onToggleCapture }) {
  const [shiny, setShiny] = useState(false);
  
  // --- AUDIO ---
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playCry = () => {
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
      setTimeout(() => setIsPlaying(false), 1500);
    }
  };

  const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`;

  const description = data.desc 
    ? data.desc.replace(/[\f\n\r]/g, ' ') 
    : "Aucune description disponible pour ce Pokémon.";

  // Style commun boutons
  const buttonStyle = (active) => ({
    background: active ? '#2d3748' : 'white',
    color: active ? 'white' : '#2d3748',
    border: 'none', borderRadius: '50%', width: '50px', height: '50px',
    cursor: 'pointer',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: '0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    transform: active ? 'scale(1.1)' : 'scale(1)'
  });

  return (
    <div className="holo-card">
      
      <audio ref={audioRef} src={cryUrl} />

      {/* BOUTONS D'ACTION (Haut Droite) */}
      <div style={{position:'absolute', top:'20px', right:'20px', zIndex:10, display:'flex', flexDirection:'column', gap:'15px'}}>
         
         {/* 1. CAPTURE (Check ou Plus) */}
         <button 
           onClick={() => onToggleCapture(data.id)} 
           title={captured.includes(data.id) ? "Déjà capturé" : "Marquer comme capturé"}
           style={{
             ...buttonStyle(captured.includes(data.id)),
             background: captured.includes(data.id) ? '#4cd137' : 'white',
             color: captured.includes(data.id) ? 'white' : '#2d3748'
           }}
         >
           {captured.includes(data.id) ? (
             // ICONE CHECK (Validé)
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <polyline points="20 6 9 17 4 12"></polyline>
             </svg>
           ) : (
             // ICONE PLUS (Ajouter)
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
               <line x1="12" y1="5" x2="12" y2="19"></line>
               <line x1="5" y1="12" x2="19" y2="12"></line>
             </svg>
           )}
         </button>

         {/* 3. CRI (Haut-parleur) */}
         <button 
           onClick={playCry}
           title="Écouter le cri"
           style={buttonStyle(isPlaying)}
         >
           {/* ICONE SPEAKER */}
           <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
             <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
           </svg>
         </button>

      </div>

      <h1 style={{position:'absolute', top:'10px', left:'20px', margin:0, fontSize:'6rem', color:'rgba(0,0,0,0.05)', zIndex:1}}>
          #{String(data.id).padStart(3,'0')}
      </h1>

      <div style={{position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px', zIndex: 2}}>
        <div className="holo-circle" style={{
           background: shiny ? 'radial-gradient(circle, #f6e58d, #f9ca24)' : data.color
        }}></div>
        
        <img 
          src={shiny ? data.sprites.other['official-artwork'].front_shiny : data.sprites.other['official-artwork'].front_default} 
          className="pokemon-model"
          onClick={() => setShiny(!shiny)}
          alt={data.name}
          style={{position: 'relative', cursor: 'pointer'}}
        />
      </div>

      <div style={{textAlign:'center', zIndex:2, width: '100%'}}>
          <h1 style={{fontSize:'3rem', margin:0, color: '#2d3748', lineHeight:1.1}}>
            {data.frName}
            {shiny && <span style={{fontSize:'1rem', verticalAlign:'top', color:'#f1c40f', marginLeft:'5px'}}>★</span>}
          </h1>
          <div style={{color: '#718096', fontWeight:'600', marginBottom:'15px', textTransform:'uppercase', letterSpacing:'1px', fontSize:'0.9rem'}}>{data.genus}</div>
          
          <div style={{display:'flex', gap:'10px', justifyContent:'center', marginBottom: '30px'}}>
            {data.types.map(t => (
              <span key={t.type.name} style={{background: typeColors[t.type.name], color:'white', padding:'6px 20px', borderRadius:'20px', fontWeight:'800', textTransform:'uppercase', fontSize:'0.75rem', letterSpacing:'0.5px'}}>
                {typeTranslations[t.type.name]}
              </span>
            ))}
          </div>

          <div style={{textAlign: 'left'}}> 
            <div className="section-title" style={{ marginTop: '20px', fontSize: '0.7rem', opacity: 0.6 }}>Description</div>
            <p style={{ color: '#4a5568', background: 'rgba(255,255,255,0.6)', padding: '15px', borderRadius: '10px', borderLeft: `4px solid ${data.color}`, fontStyle: 'italic', fontSize: '0.95rem' }}>
              "{description}"
            </p>
          </div>
      </div>
    </div>
  );
}