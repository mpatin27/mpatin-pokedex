import React, { useState, useEffect } from 'react';

// --- DICTIONNAIRES ---
const typeTranslations = {
  "fairy": "Fée", "dragon": "Dragon", "psychic": "Psy", "dark": "Ténèbres",
  "ghost": "Spectre", "ice": "Glace", "fighting": "Combat", "flying": "Vol",
  "poison": "Poison", "ground": "Sol", "rock": "Roche", "bug": "Insecte",
  "steel": "Acier", "fire": "Feu", "water": "Eau", "grass": "Plante",
  "electric": "Électrik", "normal": "Normal"
};

const itemTranslations = {
  "water-stone": "Pierre Eau", "thunder-stone": "Pierre Foudre", "fire-stone": "Pierre Feu",
  "leaf-stone": "Pierre Plante", "moon-stone": "Pierre Lune", "sun-stone": "Pierre Soleil",
  "shiny-stone": "Pierre Éclat", "dusk-stone": "Pierre Nuit", "dawn-stone": "Pierre Aube",
  "ice-stone": "Pierre Glace", "oval-stone": "Pierre Ovale", "kings-rock": "Roche Royale",
  "metal-coat": "Peau Métal", "dragon-scale": "Écaille Draco", "up-grade": "Améliorator",
  "dubious-disc": "CD Douteux", "protector": "Protecteur", "electirizer": "Électriseur",
  "magmarizer": "Magmariseur", "reaper-cloth": "Tissu Fauche", "prism-scale": "Bel'Écaille"
};

const formatCondition = (rawName, type = 'item') => {
  if (!rawName) return "Spécial";
  if (type === 'type') return typeTranslations[rawName] || rawName;
  if (itemTranslations[rawName]) return itemTranslations[rawName];
  return rawName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};

// --- FONCTION NOM FR ---
// On met un cache simple pour éviter de spammer l'API si on navigue vite
const nameCache = {};

const getFrenchName = async (id, fallbackName) => {
  if (nameCache[id]) return nameCache[id];
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    const data = await res.json();
    const frObj = data.names.find(n => n.language.name === "fr");
    const name = frObj ? frObj.name : fallbackName;
    nameCache[id] = name;
    return name;
  } catch (e) {
    return fallbackName;
  }
};

// --- COMPOSANT NOEUD ---
const EvolutionNode = ({ node, currentId, onNavigate, isRoot = false }) => {
  const isCurrent = node.id === currentId;
  const hasChildren = node.evolves_to.length > 0;
  // Si plus d'1 enfant, c'est une branche complexe (ex: Évoli) -> On active le mode Grille
  const isBranching = node.evolves_to.length > 1;

  return (
    <div className="evo-node">
      {/* CONNECTEUR (Sauf Racine) */}
      {!isRoot && node.condition && (
        <div className="evo-connector-vertical">
           {/* On affiche la ligne SEULEMENT si ce n'est pas une grille complexe qui a wrappé */}
          <div className="evo-line-top"></div>
          <div className="evo-condition-badge">{node.condition}</div>
          <div className="evo-arrow-down">▼</div>
        </div>
      )}

      {/* CARTE */}
      <div 
        className={`evo-card-wrapper ${isCurrent ? 'current' : ''}`}
        onClick={() => onNavigate(node.id)}
      >
        <div className="evo-img-frame">
          <img src={node.img} alt={node.name} />
        </div>
        <div className="evo-text-content">
          <span className="evo-id">#{String(node.id).padStart(3, '0')}</span>
          <span className="evo-name">{node.name}</span>
          {isCurrent && <span className="current-badge">Actuel</span>}
        </div>
      </div>

      {/* ENFANTS */}
      {hasChildren && (
        <div className={`evo-children-container ${isBranching ? 'branching' : ''}`}>
          
          {/* BARRE HORIZONTALE : Visible seulement si branching ET pas sur mobile */}
          {isBranching && <div className="tree-horizontal-bar"></div>}

          <div className="evo-children-list">
            {node.evolves_to.map((child) => (
              <EvolutionNode 
                key={child.id} 
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
        const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}/`);
        const speciesData = await speciesRes.json();
        const chainRes = await fetch(speciesData.evolution_chain.url);
        const chainData = await chainRes.json();

        // Fonction récursive de construction
        const buildTree = async (node) => {
          const urlParts = node.species.url.split('/');
          const id = parseInt(urlParts[urlParts.length - 2]);
          
          // 1. Nom FR
          const frName = await getFrenchName(id, node.species.name);

          // 2. Conditions
          let condition = null;
          if (node.evolution_details.length > 0) {
            const d = node.evolution_details[0];
            const conditions = [];
            
            if (d.min_level) conditions.push(`Niv. ${d.min_level}`);
            if (d.item) conditions.push(formatCondition(d.item.name));
            if (d.trigger.name === "trade") conditions.push("Échange");
            if (d.min_happiness) conditions.push("Bonheur");
            if (d.time_of_day) conditions.push(d.time_of_day === 'day' ? 'Jour' : 'Nuit');
            if (d.known_move_type) conditions.push(`Att. ${formatCondition(d.known_move_type.name, 'type')}`);
            if (d.location) conditions.push("Lieu Spécial");
            
            if (d.min_happiness && d.time_of_day) condition = `Bonheur + ${d.time_of_day === 'day' ? 'Jour' : 'Nuit'}`;
            else if (d.min_happiness && d.known_move_type) condition = "Bonheur + Fée";
            else condition = conditions.join(' + ') || "Spécial";
          }

          const children = await Promise.all(node.evolves_to.map(child => buildTree(child)));

          return {
            id,
            name: frName,
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
  }, [data.id]);

  if (loading) return <div style={{padding:'40px', textAlign:'center', color:'#a0aec0'}}>Recherche génétique...</div>;
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