import React, { useState, useEffect } from 'react';

// --- (Gardez vos dictionnaires typeTranslations et itemTranslations ici si pas importés) ---
// Pour faire court, je mets juste la logique corrigée ci-dessous

const EvolutionNode = ({ node, currentId, onNavigate, isRoot = false }) => {
  const isCurrent = node.id === currentId;
  const hasChildren = node.evolves_to.length > 0;
  // Correction: Shifours a 2 évolutions qui pointent vers le même ID, ça crée des doublons visuels mais c'est l'API qui veut ça.
  const isBranching = node.evolves_to.length > 1;

  return (
    <div className="evo-node">
      {!isRoot && node.condition && (
        <div className="evo-connector-vertical">
           <div className="evo-line-top"></div>
           <div className="evo-condition-badge">{node.condition}</div>
           <div className="evo-arrow-down">▼</div>
        </div>
      )}

      <div 
        className={`evo-card-wrapper ${isCurrent ? 'current' : ''}`}
        onClick={() => onNavigate(node.id)}
      >
        <div className="evo-img-frame">
          <img 
            src={node.img} 
            alt={node.name} 
            // FIX IMAGE: Si l'image de l'évolution n'existe pas (ex: Shifours), on met une pokéball
            onError={(e) => {e.target.onerror = null; e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"}}
          />
        </div>
        <div className="evo-text-content">
          <span className="evo-id">#{String(node.id).padStart(3, '0')}</span>
          <span className="evo-name">{node.name}</span>
          {isCurrent && <span className="current-badge">Actuel</span>}
        </div>
      </div>

      {hasChildren && (
        <div className={`evo-children-container ${isBranching ? 'branching' : ''}`}>
          <div className="evo-children-list">
            {node.evolves_to.map((child, index) => (
              <EvolutionNode 
                // FIX KEY: Utilisation de l'index pour éviter les doublons de clés React (Wushours -> Shifours x2)
                key={`${child.id}-${index}`} 
                node={child} 
                currentId={currentId} 
                onNavigate={onNavigate}
                isRoot={false} 
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ... (Gardez itemTranslations et typeTranslations ici) ...

export default function TabEvolution({ data }) {
  const [evolutionTree, setEvolutionTree] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleNavigate = (id) => {
    if (id === data.id) return;
    const event = new CustomEvent('changePokemonId', { detail: id });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchEvolutionData = async () => {
      setLoading(true);
      try {
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        const chainRes = await fetch(speciesData.evolution_chain.url);
        const chainData = await chainRes.json();

        // Fonction récursive
        const buildTree = async (node) => {
          const urlParts = node.species.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 2]);
          
          // Récupération sécurisée du nom
          let frName = node.species.name;
          try {
             // On utilise data.species.url si c'est le même ID pour économiser un appel
             if (id === data.id) {
                 frName = data.frName || data.name;
             } else {
                 const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
                 const sData = await res.json();
                 const frObj = sData.names.find(n => n.language.name === "fr");
                 if (frObj) frName = frObj.name;
             }
          } catch(e) {}

          // Conditions d'évolution (Simplifié)
          let condition = null;
          if (node.evolution_details.length > 0) {
              const d = node.evolution_details[0];
              // ... ta logique de formatage de condition ...
              if (d.trigger.name === "level-up" && d.min_level) condition = `Niv. ${d.min_level}`;
              else if (d.item) condition = "Objet"; 
              else condition = "Spécial";
          }

          const children = await Promise.all(node.evolves_to.map(child => buildTree(child)));

          return {
            id,
            name: frName,
            // URL Image générique (fonctionne pour 99% des cas, sauf Shifours où on gère l'erreur dans le composant)
            img: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
            condition,
            evolves_to: children
          };
        };

        const tree = await buildTree(chainData.chain);
        if (isMounted) setEvolutionTree(tree);

      } catch (error) { console.error(error); } finally { if(isMounted) setLoading(false); }
    };

    fetchEvolutionData();
    return () => { isMounted = false; };
  }, [data]);

  if (loading) return <div style={{padding:'40px', textAlign:'center', color:'#a0aec0'}}>Analyse génétique...</div>;
  if (!evolutionTree) return null;

  return (
    <div className="fade-in" style={{ paddingBottom: '40px', display:'flex', flexDirection:'column', alignItems:'center' }}>
      <div className="section-title" style={{alignSelf:'flex-start'}}>Lignée Évolutive</div>
      <div className="evo-tree-root">
        <EvolutionNode node={evolutionTree} currentId={data.id} onNavigate={handleNavigate} isRoot={true} />
      </div>
    </div>
  );
}