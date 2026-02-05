import React from 'react';
import Loader from './Loader'; 

export default function PokemonList({ 
  pokemonList, 
  selectedId, 
  onSelect, 
  searchTerm, 
  onSearch, 
  captured, 
  loading, 
  currentGen, 
  onGenChange, 
  genConfig 
}) {
  
  // Filtrage
  const filtered = pokemonList.filter(p => {
    const term = searchTerm.toLowerCase();
    return (
      p.name.toLowerCase().includes(term) ||
      p.enName.toLowerCase().includes(term) ||
      String(p.id).includes(term)
    );
  });

  return (
    <div className="sidebar" style={{display:'flex', flexDirection:'column', height:'100%'}}>
      {/* Titre */}
      <h2 style={{margin:'0 0 15px 0', fontSize:'1.5rem', fontWeight:'900', color:'#2d3748'}}>
        COBBLE<span style={{color:'#e53e3e'}}>DEX</span>
      </h2>
      
      {/* SÉLECTEUR DE GÉNÉRATION */}
      <div style={{marginBottom: '15px'}}>
        <select 
          value={currentGen} 
          onChange={(e) => onGenChange(Number(e.target.value))}
          disabled={loading}
          style={{
            width: '100%', padding: '12px', borderRadius: '12px',
            border: '2px solid #cbd5e0', background: loading ? '#f7fafc' : 'white',
            fontWeight: 'bold', color: '#2d3748', cursor: loading ? 'wait' : 'pointer',
            fontSize: '0.9rem', outline: 'none', transition: 'all 0.2s'
          }}
        >
          {genConfig.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>
      </div>

      {/* RECHERCHE */}
      <input 
        className="search-input" 
        placeholder="Rechercher..." 
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        disabled={loading}
      />
      
      {/* LISTE DÉFILANTE */}
      <div style={{flex:1, overflowY:'auto', paddingRight:'5px'}}>
        
        {loading ? (
          <div style={{marginTop: '50px'}}>
            <Loader text="Voyage vers la région..." />
          </div>
        ) : (
          <>
            {filtered.map(p => (
              <div 
                key={p.id} 
                className={`list-item ${selectedId === p.id ? 'active' : ''}`}
                onClick={() => onSelect(p.id)}
              >
                {/* Sprite Pixel */}
                <img src={p.sprite} style={{width:'40px', marginRight:'10px'}} alt={p.name} />
                
                {/* Noms */}
                <div style={{flex:1}}>
                  <div style={{fontWeight:'600', textTransform:'capitalize'}}>{p.name}</div>
                  {searchTerm && p.enName.toLowerCase().includes(searchTerm.toLowerCase()) && (
                     <div style={{fontSize:'0.7rem', color:'#ff5350', fontStyle:'italic'}}>({p.enName})</div>
                  )}
                </div>

                {/* --- INDICATEUR DE CAPTURE (VRAIE POKÉBALL) --- */}
                {captured.includes(p.id) && (
                  <div title="Capturé !">
                    {/* SVG de la vraie Pokéball Classique */}
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      {/* Cercle extérieur (Bordure foncée) */}
                      <circle cx="12" cy="12" r="10" stroke="#2d3748" strokeWidth="2"/>
                      {/* Demi-cercle du haut (Rouge) */}
                      <path d="M2 12C2 6.48 6.48 2 12 2C17.52 2 22 6.48 22 12" fill="#f56565" stroke="#2d3748" strokeWidth="2"/>
                      {/* Demi-cercle du bas (Blanc) */}
                      <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12" fill="white" stroke="#2d3748" strokeWidth="2"/>
                      {/* Ligne centrale */}
                      <line x1="2" y1="12" x2="22" y2="12" stroke="#2d3748" strokeWidth="2"/>
                      {/* Bouton central extérieur (Blanc) */}
                      <circle cx="12" cy="12" r="3" fill="white" stroke="#2d3748" strokeWidth="2"/>
                      {/* Bouton central intérieur (Gris clair) */}
                      <circle cx="12" cy="12" r="1.5" fill="#cbd5e0"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}

            {filtered.length === 0 && (
              <div style={{textAlign:'center', color:'#a0aec0', marginTop:'20px', fontSize:'0.9rem'}}>
                Aucun Pokémon trouvé.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}