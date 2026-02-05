import React from 'react';
// On importe le module de calcul qu'on vient de créer
import TypeWeakness from '../TypeWeakness'; 
import { statTranslations } from '../../../utils/pokemonConsts';

export default function TabStats({ data }) {
  return (
    <div className="fade-in">
      
      {/* 1. MODULE STRATÉGIE (Le nouveau tableau intelligent) */}
      {/* Il va s'afficher tout en haut des stats */}
      <TypeWeakness types={data.types} />


      {/* 2. VALEURS DE BASE (Ton code existant pour les barres) */}
      <div className="section-title" style={{marginTop: '30px', marginBottom: '15px'}}>
        Valeurs de base
      </div>

      {data.stats.map(s => (
        <div key={s.stat.name} style={{display:'flex', alignItems:'center', marginBottom:'15px'}}>
          
          {/* Nom de la stat (HP, Attaque...) */}
          <div style={{
             width:'80px', fontWeight:'700', color:'#718096', 
             textTransform:'uppercase', fontSize:'0.75rem'
          }}>
            {statTranslations[s.stat.name] || s.stat.name}
          </div>
          
          {/* Barre de progression */}
          <div style={{flex:1, height:'10px', background:'#edf2f7', borderRadius:'5px', overflow:'hidden'}}>
            <div 
              style={{
                width: `${Math.min(s.base_stat, 150) / 1.5}%`, // Ton calcul de ratio
                height: '100%', 
                background: data.color, // La couleur du Pokémon
                borderRadius: '5px',
                transition: 'width 1s ease-out' // Petite animation fluide
              }} 
            />
          </div>
          
          {/* Valeur chiffrée */}
          <div style={{width:'40px', textAlign:'right', fontWeight:'bold', color:'#2d3748'}}>
            {s.base_stat}
          </div>
        </div>
      ))}
    </div>
  );
}