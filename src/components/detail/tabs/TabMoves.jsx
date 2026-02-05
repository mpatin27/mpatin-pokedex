import React, { useState, useEffect } from 'react';
import { typeTranslations, typeColors } from '../../../utils/pokemonConsts';

export default function TabMoves({ data }) {
  const [movesDetails, setMovesDetails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMoves = async () => {
      setLoading(true);
      try {
        // Filtre : Attaques apprises par niveau (level-up)
        const levelUpMoves = data.moves
          .filter(m => m.version_group_details[0].move_learn_method.name === 'level-up')
          .sort((a, b) => a.version_group_details[0].level_learned_at - b.version_group_details[0].level_learned_at);

        const promises = levelUpMoves.map(async (m) => {
          // Note: Dans une vraie app, on utiliserait un cache global ou Redux ici
          const res = await fetch(m.move.url);
          const moveData = await res.json();
          
          const frName = moveData.names.find(n => n.language.name === 'fr')?.name || moveData.name;
          
          return {
            id: moveData.id,
            name: frName,
            level: m.version_group_details[0].level_learned_at,
            type: moveData.type.name,
            power: moveData.power,
            accuracy: moveData.accuracy,
            category: moveData.damage_class.name, // physical, special, status
            pp: moveData.pp
          };
        });

        const results = await Promise.all(promises);
        if (isMounted) {
          setMovesDetails(results);
        }
      } catch (error) {
        console.error("Erreur chargement attaques:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMoves();
    return () => { isMounted = false; };
  }, [data.id]);


  // --- ICONES SVG POUR LES CATÉGORIES ---
  const CategoryIcon = ({ category }) => {
    if (category === 'physical') {
      // Étoile d'impact (Physique) - Orange/Rouge
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="#e53e3e" stroke="none">
          <path d="M12 2L14.5 9.5L22 9.5L16 14L18.5 22L12 17L5.5 22L8 14L2 9.5L9.5 9.5L12 2Z" />
        </svg>
      );
    }
    if (category === 'special') {
      // Spirale/Onde (Spécial) - Bleu/Violet
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3182ce" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
           <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" />
           <path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18Z" />
           <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="#3182ce" stroke="none"/>
        </svg>
      );
    }
    // Statut (Yin Yang ou Cercle gris)
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#718096" stroke="none">
        <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12 6C8.69 6 6 8.69 6 12H12V6Z"/>
      </svg>
    );
  };

  if (loading) return <div style={{padding:'40px', textAlign:'center', color:'#a0aec0'}}>Téléchargement des données de combat...</div>;

  return (
    <div className="fade-in">
      <div className="section-title">Attaques par Niveau</div>
      
      <div style={{display:'flex', flexDirection:'column', gap:'10px'}}>
        
        {/* EN-TÊTE TABLEAU (CSS Grid) */}
        <div style={{
          display:'grid', 
          gridTemplateColumns:'45px 1fr 70px 40px 40px 40px', 
          padding:'0 15px', 
          fontSize:'0.65rem', fontWeight:'800', color:'#a0aec0', textTransform:'uppercase', letterSpacing:'1px'
        }}>
          <span>Niv.</span>
          <span>Nom</span>
          <span>Type</span>
          <span title="Catégorie">Cat.</span>
          <span title="Puissance">Pui.</span>
          <span title="Précision">Pré.</span>
        </div>

        {/* LISTE */}
        {movesDetails.map((move) => (
          <div key={move.id} style={{
            display:'grid', 
            gridTemplateColumns:'45px 1fr 70px 40px 40px 40px', 
            alignItems:'center', 
            background:'white', 
            padding:'12px 15px', 
            borderRadius:'12px',
            boxShadow:'0 2px 5px rgba(0,0,0,0.02)', 
            fontSize:'0.85rem',
            border: '1px solid #edf2f7',
            transition: 'transform 0.2s',
            cursor: 'default'
          }}>
            
            {/* Niveau */}
            <div style={{fontWeight:'800', color:'#718096', fontSize:'0.75rem'}}>N.{move.level}</div>
            
            {/* Nom */}
            <div style={{fontWeight:'700', textTransform:'capitalize', color:'#2d3748'}}>{move.name}</div>
            
            {/* Type */}
            <div>
              <span style={{
                background: typeColors[move.type], color:'white', 
                padding:'4px 8px', borderRadius:'6px', fontSize:'0.65rem', 
                textTransform:'uppercase', fontWeight:'800',
                display: 'inline-block', minWidth: '50px', textAlign: 'center'
              }}>
                {typeTranslations[move.type]?.slice(0, 3) || move.type.slice(0,3)}
              </span>
            </div>

            {/* Catégorie (Icône) */}
            <div title={move.category} style={{display:'flex', alignItems:'center'}}>
              <CategoryIcon category={move.category} />
            </div>

            {/* Puissance */}
            <div style={{fontWeight:'700', color: move.power ? '#2d3748' : '#cbd5e0'}}>
              {move.power || '-'}
            </div>

            {/* Précision */}
            <div style={{color: '#718096', fontSize:'0.75rem'}}>
              {move.accuracy ? move.accuracy + '%' : '-'}
            </div>
          </div>
        ))}
      </div>
      
      {movesDetails.length === 0 && (
        <div style={{textAlign:'center', marginTop:'40px', color:'#a0aec0', fontStyle:'italic'}}>
          Aucune attaque par niveau trouvée.
        </div>
      )}
    </div>
  );
}