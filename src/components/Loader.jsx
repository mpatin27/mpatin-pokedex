import React, { useMemo } from 'react';

// Une liste de phrases d'ambiance
const loadingMessages = [
  "Attrapez-les tous...",
  "Lavage des Pokéballs...",
  "Soins au Centre Pokémon...",
  "Communication avec le PC...",
  "Réveil de Ronflex...",
  "Fuite devant un Nosferapti...",
  "Préparation de l'arène...",
  "Consultation du Pokédex...",
  "Cuisson des Baies Oran..."
];

export default function Loader({ text }) {
  // On choisit une phrase au hasard au montage du composant
  // useMemo évite que la phrase change toutes les millisecondes
  const randomMessage = useMemo(() => {
    return loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
  }, []);

  return (
    <div className="loader-wrapper">
      <div className="pokeball-animated"></div>
      
      <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
        {/* Le texte technique (passé en prop, ex: "Chargement...") */}
        <span style={{color: '#2d3748'}}>{text}</span>
        
        {/* Le texte d'ambiance (en plus petit et italique) */}
        <span style={{fontSize:'0.75rem', color:'#a0aec0', fontStyle:'italic', fontWeight:'normal'}}>
          "{randomMessage}"
        </span>
      </div>
    </div>
  );
}