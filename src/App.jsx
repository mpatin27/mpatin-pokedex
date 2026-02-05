import { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import PokemonDetail from './components/PokemonDetail';

// Configuration des Générations (Ranges d'IDs)
const genConfig = [
  { id: 1, name: "I - Kanto", offset: 0, limit: 151 },
  { id: 2, name: "II - Johto", offset: 151, limit: 100 },
  { id: 3, name: "III - Hoenn", offset: 251, limit: 135 },
  { id: 4, name: "IV - Sinnoh", offset: 386, limit: 107 },
  { id: 5, name: "V - Unys", offset: 493, limit: 156 },
  { id: 6, name: "VI - Kalos", offset: 649, limit: 72 },
  { id: 7, name: "VII - Alola", offset: 721, limit: 88 },
  { id: 8, name: "VIII - Galar", offset: 809, limit: 96 },
  { id: 9, name: "IX - Paldea", offset: 905, limit: 120 },
];

export default function App() {
  // --- ÉTATS GLOBAUX ---
  const [pokemonList, setPokemonList] = useState([]);
  const [selectedId, setSelectedId] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  
  // États de sauvegarde (Local Storage)
  const [captured, setCaptured] = useState(() => JSON.parse(localStorage.getItem('captured') || "[]"));
  const [team, setTeam] = useState(() => JSON.parse(localStorage.getItem('team') || "[]"));
  
  // États d'interface
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // <--- NOUVEAU (Mobile)

  // États de chargement & Pagination
  const [currentGen, setCurrentGen] = useState(1);
  const [isListLoading, setIsListLoading] = useState(false);
  
  // Verrou pour éviter le double chargement (Strict Mode)
  const initialized = useRef(false);

  // --- LOGIQUE DE CHARGEMENT ---
  const loadGeneration = async (genId) => {
    setIsListLoading(true);
    setPokemonList([]); // Reset visuel
    
    // Timer minimum pour l'animation cinématique (2 secondes)
    const minTimer = new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const config = genConfig.find(g => g.id === genId);
      
      // La vraie récupération des données
      const fetchData = async () => {
         const res = await fetch(`https://pokeapi.co/api/v2/pokemon-species?limit=${config.limit}&offset=${config.offset}`);
         const data = await res.json();
         
         const promises = data.results.map(async (p) => {
            const id = parseInt(p.url.split('/')[6]);
            const resSpec = await fetch(p.url);
            const spec = await resSpec.json();
            const frName = spec.names.find(n => n.language.name === "fr")?.name || p.name;

            return {
              id: id,
              name: frName,
              enName: p.name,
              sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
            };
         });
         return Promise.all(promises);
      };

      // On attend que les deux soient finis (Timer + Data)
      const [list] = await Promise.all([fetchData(), minTimer]);
      
      setPokemonList(list);

    } catch (error) {
      console.error("Erreur chargement gen :", error);
    } finally {
      setIsListLoading(false);
    }
  };

  // Initialisation au démarrage
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadGeneration(1);
  }, []);

  // Sauvegardes automatiques
  useEffect(() => { localStorage.setItem('captured', JSON.stringify(captured)) }, [captured]);
  useEffect(() => { localStorage.setItem('team', JSON.stringify(team)) }, [team]);

  // Gestion de la navigation (Event Custom + Mobile)
  useEffect(() => {
    const handleChangePokemon = (e) => {
      setSelectedId(e.detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false); // Ferme le menu mobile au clic
    };

    window.addEventListener('changePokemonId', handleChangePokemon);
    return () => window.removeEventListener('changePokemonId', handleChangePokemon);
  }, []);

  const handleGenChange = (genId) => {
    setCurrentGen(genId);
    loadGeneration(genId);
  };

  // --- ACTIONS ---

  const toggleCapture = (id) => {
    setCaptured(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const toggleTeam = (pokemonData) => {
    setTeam(prev => {
      const exists = prev.find(p => p.id === pokemonData.id);
      if (exists) {
        return prev.filter(p => p.id !== pokemonData.id);
      } else {
        if (prev.length >= 6) return prev;
        // On sauvegarde tout le nécessaire pour l'analyseur et le dock
        return [...prev, {
          id: pokemonData.id,
          name: pokemonData.name, 
          sprite: pokemonData.sprites.front_default, 
          color: pokemonData.color,
          types: pokemonData.types, 
          stats: pokemonData.stats
        }];
      }
    });
  };

  const removeFromTeam = (id) => {
    setTeam(prev => prev.filter(p => p.id !== id));
  };

  // --- RENDU ---
  return (
    <div className="app-container">
      
      {/* BOUTON MENU MOBILE */}
      <button 
        className="mobile-menu-btn"
        onClick={() => setIsMobileMenuOpen(true)}
      >
        ☰ Liste
      </button>

      {/* SIDEBAR (Avec Wrapper pour Mobile) */}
      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
        <button 
          className="close-sidebar-btn" 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          ×
        </button>

        <Sidebar 
          pokemonList={pokemonList} 
          selectedId={selectedId} 
          onSelect={(id) => {
            setSelectedId(id);
            setIsMobileMenuOpen(false);
          }} 
          searchTerm={searchTerm} 
          onSearch={setSearchTerm} 
          captured={captured}
          loading={isListLoading}
          currentGen={currentGen}
          onGenChange={handleGenChange}
          genConfig={genConfig}
        />
      </div>

      {/* OVERLAY SOMBRE (Mobile) */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}
      
      {/* DÉTAIL POKEMON */}
      <PokemonDetail 
        id={selectedId} 
        captured={captured} 
        onToggleCapture={toggleCapture}
        team={team}
        onToggleTeam={toggleTeam}
      />
    </div>
  );
}