import { useState, useEffect } from 'react';
import { typeColors } from '../utils/pokemonConsts';
import PokemonVisual from './detail/PokemonVisual';
import PokemonData from './detail/PokemonData';
import Loader from './Loader';

export default function PokemonDetail({ id, captured, onToggleCapture, team, onToggleTeam }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  // 1. Chargement des données
  useEffect(() => {
    if (!id) return;
    setLoading(true);

    const fetchData = async () => {
      try {
        // A. Données de base
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const poke = await res.json();
        const specRes = await fetch(poke.species.url);
        const spec = await specRes.json();

        // B. Traduction des Talents
        const abilitiesPromises = poke.abilities.map(async (a) => {
          const abRes = await fetch(a.ability.url);
          const abData = await abRes.json();
          return {
            name: abData.names.find(n => n.language.name === 'fr')?.name || a.ability.name,
            isHidden: a.is_hidden
          };
        });
        const abilitiesTranslated = await Promise.all(abilitiesPromises);

        // C. Chaîne d'évolution
        const evoRes = await fetch(spec.evolution_chain.url);
        const evoData = await evoRes.json();
        const getEvo = async (chain, list = []) => {
          const pR = await fetch(`https://pokeapi.co/api/v2/pokemon/${chain.species.name}`);
          const pD = await pR.json();
          // Nom FR de l'évolution
          const sR = await fetch(pD.species.url);
          const sD = await sR.json();
          const frName = sD.names.find(n => n.language.name === 'fr')?.name;

          list.push({ id: pD.id, name: frName, img: pD.sprites.front_default });
          if (chain.evolves_to.length > 0) await getEvo(chain.evolves_to[0], list);
          return list;
        };
        const evolutions = await getEvo(evoData.chain);

        // D. Variétés (Formes)
        const varietiesPromises = spec.varieties
          .filter(v => !v.is_default)
          .map(async v => {
            const vRes = await fetch(v.pokemon.url);
            const vData = await vRes.json();
            // Fallback image : Artwork > Home > Pixel
            const img = vData.sprites.other['official-artwork'].front_default
              || vData.sprites.other['home'].front_default
              || vData.sprites.front_default;

            return {
              name: vData.name.replace(poke.name + '-', '').replace('-', ' '),
              img: img,
              type: vData.types[0].type.name
            };
          });
        const varieties = await Promise.all(varietiesPromises);

        // E. Faiblesses
        const typeRes = await fetch(poke.types[0].type.url);
        const typeData = await typeRes.json();
        const weaknesses = typeData.damage_relations.double_damage_from.map(t => t.name);
        const resistances = typeData.damage_relations.half_damage_from.map(t => t.name);

        // F. Genre
        const genderRate = spec.gender_rate;
        const gender = genderRate === -1 ? "Asexué" : `♂ ${(1 - genderRate / 8) * 100}% | ♀ ${(genderRate / 8) * 100}%`;

        // G. Attaques (Moves) - Pré-tri rapide, le détail est fait dans TabMoves
        // On passe juste le tableau brut, TabMoves fera le fetch détaillé

        setData({
          ...poke,
          frName: spec.names.find(n => n.language.name === "fr")?.name,
          desc: spec.flavor_text_entries.find(e => e.language.name === 'fr')?.flavor_text,
          genus: spec.genera.find(g => g.language.name === 'fr')?.genus,
          captureRate: spec.capture_rate,
          baseHappiness: spec.base_happiness,
          eggGroups: spec.egg_groups.map(g => g.name).join(', '),
          genderRatio: gender,
          color: typeColors[poke.types[0].type.name],
          abilitiesTranslated,
          evolutions,
          varieties,
          weaknesses,
          resistances
        });
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  // 2. Background Dynamique (AVANT le return conditionnel pour éviter l'erreur de Hooks)
  useEffect(() => {
    if (data?.color) {
      document.body.style.backgroundColor = data.color + '40';
      document.body.style.transition = 'background-color 0.5s ease';
    } else {
      document.body.style.backgroundColor = '#dfe6e9';
    }
    return () => { document.body.style.backgroundColor = '#dfe6e9'; };
  }, [data?.color]);

  // 3. Affichage Loading
  if (!data || loading) return (
    <div className="main-content" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Loader text="Analyse du Pokémon..." />
    </div>
  );

  // 4. Rendu
  return (
    <div className="main-content">
      <PokemonVisual
        data={data}
        captured={captured}
        onToggleCapture={onToggleCapture}
        team={team}
        onToggleTeam={onToggleTeam}
      />
      <PokemonData
        data={data}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
    </div>
  );
}