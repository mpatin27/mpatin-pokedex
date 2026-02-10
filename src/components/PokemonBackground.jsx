import React, { useMemo } from 'react';

// React.memo empêche le re-rendu inutile si les props ne changent pas
const PokemonBackground = React.memo(() => {
  
  // Génère 150 IDs aléatoires une seule fois
  const randomPokemons = useMemo(() => {
    return Array.from({ length: 300 }, () => Math.floor(Math.random() * 898) + 1);
  }, []);

  return (
    <div className="pokemon-bg-pattern">
      {randomPokemons.map((id, index) => (
        <img 
          key={index}
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
          alt=""
          className="bg-sprite"
          loading="lazy"
        />
      ))}
    </div>
  );
});

export default PokemonBackground;