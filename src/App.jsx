import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import PokemonVisual from './components/detail/PokemonVisual';
import PokemonData from './components/detail/PokemonData';
import Welcome from './components/Welcome';
import PokemonBackground from './components/PokemonBackground';
import SplashScreen from './components/SplashScreen';
import './index.css';

// Configuration des Générations
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
  const [appLoading, setAppLoading] = useState(true); // Splash Screen
  
  const [pokemonList, setPokemonList] = useState([]);
  const [fullListLite, setFullListLite] = useState([]); // Liste légère pour la recherche
  
  const [selectedId, setSelectedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const [captured, setCaptured] = useState(() => JSON.parse(localStorage.getItem('captured') || "[]"));
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [currentGen, setCurrentGen] = useState(1);
  const [isListLoading, setIsListLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pokemonData, setPokemonData] = useState(null);

  const initialized = useRef(false);

  // --- FONCTION DE CHARGEMENT DE GÉNÉRATION ---
  const loadGeneration = async (genId) => {
    setIsListLoading(true);
    try {
      const config = genConfig.find(g => g.id === genId);
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${config.limit}&offset=${config.offset}`);
      const data = await res.json();
      
      const promises = data.results.map(async (p) => {
         const parts = p.url.split('/');
         const id = parseInt(parts[parts.length - 2]);
         
         let frName = p.name;
         try {
             const specRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
             const specData = await specRes.json();
             const nameObj = specData.names.find(n => n.language.name === 'fr');
             if (nameObj) frName = nameObj.name;
         } catch (e) {}

         return {
            id: id,
            name: frName,
            enName: p.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
         };
      });

      const formattedList = await Promise.all(promises);
      setPokemonList(formattedList);
    } catch (error) {
      console.error("Erreur gen :", error);
    } finally {
      setIsListLoading(false);
    }
  };

  // --- 1. BOOT APPLICATION (SPLASH SCREEN & URL SYNC) ---
  useEffect(() => {
    const boot = async () => {
      // A. Chargement de la liste globale (pour la recherche)
      const fetchGlobal = async () => {
        try {
          const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
          const data = await res.json();
          const lite = data.results.map(p => {
            const parts = p.url.split('/');
            return { name: p.name, id: parseInt(parts[parts.length - 2]) };
          });
          setFullListLite(lite);
        } catch (e) { console.error("Erreur boot global", e); }
      };

      // B. Lecture de l'URL pour savoir quoi charger (Partage de lien)
      const params = new URLSearchParams(window.location.search);
      const sharedId = params.get('id');
      
      let startGen = 1;
      if (sharedId) {
         // Si un ID est présent dans l'URL, on trouve sa génération
         const id = parseInt(sharedId);
         const targetGen = genConfig.find(g => id > g.offset && id <= (g.offset + g.limit));
         if (targetGen) startGen = targetGen.id;
         
         setSelectedId(id); // On sélectionne le Pokémon directement
         setCurrentGen(startGen); // On se place sur la bonne génération
      }

      // C. Lancement des chargements
      await Promise.all([fetchGlobal(), loadGeneration(startGen)]);

      // D. Délai esthétique pour le Splash Screen (2.5s min)
      setTimeout(() => {
        setAppLoading(false);
      }, 2500);
    };

    if (!initialized.current) {
        initialized.current = true;
        boot();
    }
  }, []);


  // --- 2. LOGIQUE DE RECHERCHE & FILTRAGE ---
  useEffect(() => {
    if (appLoading) return;

    const term = searchTerm.toLowerCase().trim();
    const isNumeric = !isNaN(term) && term !== "";
    const shouldSearch = isNumeric || term.length >= 2;

    // A. RECHERCHE
    if (shouldSearch) {
      const filtered = fullListLite.filter(p => {
        const idStr = String(p.id);
        return p.name.includes(term) || idStr.startsWith(term);
      }).slice(0, 50);

      const formatted = filtered.map(p => ({
        id: p.id,
        name: p.name,
        enName: p.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`
      }));
      setPokemonList(formatted);
      return;
    }

    // B. FILTRE TYPE
    if (selectedType !== "all" && searchTerm === "") {
      const fetchByType = async () => {
        setIsListLoading(true);
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/type/${selectedType}`);
          const data = await res.json();
          const formatted = data.pokemon.map(p => {
             const parts = p.pokemon.url.split('/');
             const id = parseInt(parts[parts.length - 2]);
             if (id > 10000 && id < 10100) return null;
             return {
                id: id,
                name: p.pokemon.name,
                enName: p.pokemon.name,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
             };
          }).filter(p => p !== null);
          setPokemonList(formatted);
        } catch(e) { console.error(e); }
        finally { setIsListLoading(false); }
      };
      fetchByType();
      return;
    }

    // C. RETOUR GEN (Permet de revenir aux Gens précédentes)
    if (!shouldSearch && selectedType === "all") {
        const expectedStartId = genConfig[currentGen - 1].offset + 1;
        // Si la liste est vide OU si le premier Pokémon n'est pas celui attendu
        if (pokemonList.length === 0 || (pokemonList[0] && pokemonList[0].id !== expectedStartId)) {
             loadGeneration(currentGen);
        }
    }
  }, [searchTerm, selectedType, currentGen, fullListLite, appLoading]); 


  // --- 3. CHARGEMENT DÉTAILS ---
  useEffect(() => {
    if (!selectedId) return;

    const fetchData = async () => {
      setLoading(true);
      setPokemonData(null); 

      try {
        const pokemonInList = pokemonList.find(p => p.id === selectedId);
        const identifier = pokemonInList ? pokemonInList.enName : selectedId;

        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${identifier}`);
        if (!res.ok) throw new Error("Erreur API");
        const data = await res.json();

        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        const speciesId = speciesData.id;

        const frName = speciesData.names.find(n => n.language.name === 'fr')?.name || data.name;
        const genus = speciesData.genera.find(g => g.language.name === 'fr')?.genus || 'Pokémon';
        
        let descEntry = speciesData.flavor_text_entries.find(f => f.language.name === 'fr');
        if (!descEntry) {
            descEntry = speciesData.flavor_text_entries.find(f => f.language.name === 'en');
        }
        const desc = descEntry 
            ? descEntry.flavor_text.replace(/[\n\f]/g, ' ') 
            : "Pas de description disponible.";

        const captureRate = speciesData.capture_rate; 

        const colorMap = {
            green: '#48bb78', red: '#f56565', blue: '#4299e1', white: '#a0aec0',
            brown: '#ed8936', yellow: '#ecc94b', purple: '#9f7aea', pink: '#ed64a6',
            gray: '#718096', black: '#2d3748'
        };
        const mainColor = colorMap[speciesData.color.name] || '#cbd5e0';

        // --- MISE À JOUR DE L'URL (sans recharger la page) ---
        const newUrl = new URL(window.location);
        newUrl.searchParams.set('id', selectedId);
        window.history.pushState({}, '', newUrl);

        setPokemonData({
          ...data,
          speciesId,
          frName,
          genus,
          desc,
          color: mainColor,
          captureRate,
        });

      } catch (err) {
        console.error(err);
        setPokemonData(null); 
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedId]); 

  // --- 4. SEO DYNAMIQUE (Méthode Native) & RESET URL ---
  useEffect(() => {
    // CORRECTION : On vérifie d'abord si un ID est sélectionné
    if (selectedId && pokemonData) {
      document.title = `#${String(pokemonData.speciesId).padStart(3,'0')} ${pokemonData.frName} | CobbleDex`;
    } else {
      // Si pas d'ID, c'est l'accueil (même si pokemonData traîne encore en mémoire)
      document.title = 'CobbleDex - Accueil';
      
      // Nettoyage de l'URL
      if (!appLoading) {
          const newUrl = new URL(window.location);
          newUrl.searchParams.delete('id');
          window.history.pushState({}, '', newUrl);
      }
    }
  }, [pokemonData, selectedId, appLoading]);

  // --- 5. NAVIGATION CLAVIER ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT') return; 

      switch (e.key) {
        case 'ArrowRight':
          if (selectedId && selectedId < 1025) setSelectedId(prev => prev + 1);
          break;
        case 'ArrowLeft':
          if (selectedId && selectedId > 1) setSelectedId(prev => prev - 1);
          break;
        case ' ': 
        case 'Enter':
          e.preventDefault();
          window.dispatchEvent(new CustomEvent('triggerAudio'));
          break;
        case 'r':
          handleRandom();
          break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);


  // --- HANDLERS ---
  const toggleCapture = (id) => {
    setCaptured(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };
  
  const handleGenChange = (genId) => {
    setSearchTerm(""); 
    setSelectedType("all");
    setCurrentGen(genId);
  };

  const handleRandom = () => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    setSelectedId(randomId);
    setSearchTerm("");
    setSelectedType("all");
    if(window.innerWidth < 1024) setIsMobileMenuOpen(false);
  };

  useEffect(() => { localStorage.setItem('captured', JSON.stringify(captured)) }, [captured]);

  useEffect(() => {
    const handleChangePokemon = (e) => {
      setSelectedId(e.detail);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    };
    window.addEventListener('changePokemonId', handleChangePokemon);
    return () => window.removeEventListener('changePokemonId', handleChangePokemon);
  }, []);


  // --- RENDU ---
  return (
    <div className="app-container">
      
      {/* 1. SPLASH SCREEN */}
      <SplashScreen fadeOut={!appLoading} />

      {/* 2. APP CONTENT */}
      <PokemonBackground />
      
      {/* BOUTON MENU MOBILE (Caché si menu ouvert) */}
      {!isMobileMenuOpen && (
        <button 
          className="mobile-menu-btn" 
          onClick={() => setIsMobileMenuOpen(true)}
          style={{ transition: 'opacity 0.3s' }}
        >
          ☰ Liste
        </button>
      )}

      <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'open' : ''}`}>
        <button className="close-sidebar-btn" onClick={() => setIsMobileMenuOpen(false)}>×</button>
        <Sidebar 
          pokemonList={pokemonList} 
          selectedId={pokemonData ? pokemonData.speciesId : selectedId} 
          onSelect={(id) => { setSelectedId(id); setIsMobileMenuOpen(false); }} 
          
          searchTerm={searchTerm} 
          onSearch={setSearchTerm} 
          
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          
          captured={captured}
          loading={isListLoading}
          currentGen={currentGen}
          onGenChange={handleGenChange}
          genConfig={genConfig}
          onRandom={handleRandom}
          onHome={() => {
            setSelectedId(null);
            setSearchTerm("");
            setSelectedType("all");
            setIsMobileMenuOpen(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      </div>

      {isMobileMenuOpen && <div className="sidebar-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>}
      
      <div className={`main-content ${!selectedId ? 'welcome-mode' : ''}`}>
         {!selectedId ? (
            <Welcome />
         ) : (!pokemonData && loading) ? (
            <div className="loader-wrapper"><div className="pokeball-animated"></div>Chargement...</div>
         ) : pokemonData ? (
             <>
                <PokemonVisual data={pokemonData} captured={captured} onToggleCapture={toggleCapture} />
                <PokemonData data={pokemonData} activeTab={activeTab} setActiveTab={setActiveTab} />
             </>
         ) : (
             <div style={{color: '#4a5568', textAlign:'center', marginTop:'50px', fontWeight:'bold'}}>
                Pokémon introuvable ou erreur de chargement.
             </div>
         )}
      </div>
    </div>
  );
}