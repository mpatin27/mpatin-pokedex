import React from 'react';

const TYPES = [
  { name: 'all', label: 'Tous les types' },
  { name: 'normal', label: 'Normal' },
  { name: 'fire', label: 'Feu' },
  { name: 'water', label: 'Eau' },
  { name: 'electric', label: 'Électrik' },
  { name: 'grass', label: 'Plante' },
  { name: 'ice', label: 'Glace' },
  { name: 'fighting', label: 'Combat' },
  { name: 'poison', label: 'Poison' },
  { name: 'ground', label: 'Sol' },
  { name: 'flying', label: 'Vol' },
  { name: 'psychic', label: 'Psy' },
  { name: 'bug', label: 'Insecte' },
  { name: 'rock', label: 'Roche' },
  { name: 'ghost', label: 'Spectre' },
  { name: 'dragon', label: 'Dragon' },
  { name: 'dark', label: 'Ténèbres' },
  { name: 'steel', label: 'Acier' },
  { name: 'fairy', label: 'Fée' },
];

export default function Sidebar({ 
  pokemonList, selectedId, onSelect, 
  searchTerm, onSearch, 
  selectedType, onTypeChange, 
  captured, loading, 
  currentGen, onGenChange, genConfig,
  onRandom,
  onHome 
}) {

  return (
    <div className="sidebar">
      
      {/* HEADER FIXE */}
      <div className="sidebar-header">
        
        {/* TITRE + DÉ ALÉATOIRE */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'15px'}}>
            <h2 
              onClick={onHome} 
              style={{
                margin:0, fontSize:'1.8rem', fontWeight:'800', color:'#2d3748', 
                letterSpacing:'-1px', cursor: 'pointer'
              }}
              title="Retour à l'accueil"
            >
              POKÉ<span style={{color:'#e53e3e'}}>DEX</span>
            </h2>
        </div>
        
        {/* BARRE DE RECHERCHE */}
        <div style={{marginBottom: '10px'}}>
          <input 
            className="search-input" 
            placeholder="Rechercher (Nom ou N°)..." 
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            disabled={loading}
          />

          {/* FILTRES (LIGNE DU DESSOUS) */}
          <div style={{display:'flex', gap:'10px'}}>
            {/* TYPE */}
            <select
              className="search-input"
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              disabled={loading}
              style={{marginBottom:0, cursor:'pointer'}}
            >
              {TYPES.map(t => (
                <option key={t.name} value={t.name}>{t.label}</option>
              ))}
            </select>

            {/* GÉNÉRATION */}
            <select 
              className="search-input"
              value={currentGen} 
              onChange={(e) => onGenChange(Number(e.target.value))}
              disabled={loading || searchTerm !== "" || selectedType !== "all"}
              style={{marginBottom:0, cursor:'pointer'}}
            >
              {genConfig.map(g => (
                <option key={g.id} value={g.id}>{g.name.split(' - ')[1]}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* LISTE DÉFILANTE AVEC LE NOUVEAU LOADER */}
      <div style={{flex:1, overflowY:'auto', padding:'0 5px'}}>
        {loading ? (
          <div className="sidebar-loader-wrapper">
             <div className="sidebar-pokeball-spinner"></div>
             <span>Chargement...</span>
          </div>
        ) : (
          <>
            {pokemonList.map(p => (
              <div 
                key={p.id} 
                className={`list-item ${selectedId === p.id ? 'active' : ''}`}
                onClick={() => onSelect(p.id)}
              >
                <img src={p.sprite} style={{width:'40px', marginRight:'10px'}} alt="" loading="lazy"/>
                
                <div style={{flex:1}}>
                  <div style={{fontWeight:'700', textTransform:'capitalize', fontSize:'0.95rem', color:'#2d3748'}}>{p.name}</div>
                  <div style={{fontSize:'0.75rem', color:'#a0aec0', fontWeight:'600', fontFamily:'monospace'}}>#{String(p.id).padStart(3,'0')}</div>
                </div>

                {captured.includes(p.id) && (
                  <div title="Capturé" style={{color:'#e53e3e', fontSize:'1.2rem', marginLeft:'10px'}}>•</div>
                )}
              </div>
            ))}
            
            {pokemonList.length === 0 && (
              <div style={{textAlign:'center', color:'#a0aec0', marginTop:'30px'}}>Aucun résultat.</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}