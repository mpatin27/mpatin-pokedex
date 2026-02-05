import React from 'react';
import StatRadar from './StatRadar';
import { typeColors, typeTranslations } from '../utils/pokemonConsts';

// Table des faiblesses simplifiée (Type Défensif -> Types Attaquants qui font mal)
const weaknesses = {
    normal: ['fighting'],
    fire: ['water', 'ground', 'rock'],
    water: ['electric', 'grass'],
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    electric: ['ground'],
    ice: ['fire', 'fighting', 'rock', 'steel'],
    fighting: ['flying', 'psychic', 'fairy'],
    poison: ['ground', 'psychic'],
    ground: ['water', 'grass', 'ice'],
    flying: ['electric', 'ice', 'rock'],
    psychic: ['bug', 'ghost', 'dark'],
    bug: ['fire', 'flying', 'rock'],
    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
    ghost: ['ghost', 'dark'],
    dragon: ['ice', 'dragon', 'fairy'],
    steel: ['fire', 'fighting', 'ground'],
    dark: ['fighting', 'bug', 'fairy'],
    fairy: ['poison', 'steel']
};

export default function TeamAnalysis({ team, onClose }) {
    if (team.length === 0) return null;

    // 1. Calcul des Stats Moyennes de l'équipe
    const avgStats = [
        { stat: { name: 'hp' }, base_stat: 0 },
        { stat: { name: 'attack' }, base_stat: 0 },
        { stat: { name: 'defense' }, base_stat: 0 },
        { stat: { name: 'special-attack' }, base_stat: 0 },
        { stat: { name: 'special-defense' }, base_stat: 0 },
        { stat: { name: 'speed' }, base_stat: 0 },
    ];

    team.forEach(p => {
        p.stats.forEach((s, i) => {
            avgStats[i].base_stat += s.base_stat;
        });
    });
    // On divise par le nombre de pokemon pour avoir la moyenne
    avgStats.forEach(s => s.base_stat = Math.round(s.base_stat / team.length));

    // 2. Calcul des Menaces (Quels types font mal à mon équipe ?)
    const threatMeter = {}; // ex: { fire: 3 } signifie 3 de mes pokémons craignent le feu

    team.forEach(p => {
        p.types.forEach(t => {
            const typeName = t.type.name;
            // Pour chaque type du Pokémon, on regarde ses faiblesses
            if (weaknesses[typeName]) {
                weaknesses[typeName].forEach(weakType => {
                    threatMeter[weakType] = (threatMeter[weakType] || 0) + 1;
                });
            }
        });
    });

    // On trie les menaces (les pires en premier)
    const sortedThreats = Object.entries(threatMeter)
        .sort(([, a], [, b]) => b - a)
        .filter(([, count]) => count >= 2); // On affiche seulement si 2 pokémons ou plus sont faibles

    return (
        <div className="analysis-overlay">
            <div className="analysis-modal fade-in">
                <button className="close-btn-modal" onClick={onClose}>×</button>

                <h2 className="section-title" style={{ textAlign: 'center', fontSize: '1.5rem', marginBottom: '30px' }}>Diagnostic d'Équipe</h2>

                <div className="analysis-grid">

                    {/* GAUCHE : STATS MOYENNES */}
                    <div className="analysis-card">
                        <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#a0aec0' }}>Profil Moyen</h3>
                        <div style={{ height: '250px', display: 'flex', justifyContent: 'center' }}>
                            <StatRadar stats={avgStats} color="#6c5ce7" />
                        </div>
                        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: '#718096', marginTop: '-20px' }}>
                            Ce graphique montre les points forts globaux de votre équipe.
                        </div>
                    </div>

                    {/* DROITE : MENACES MAJEURES */}
                    <div className="analysis-card">
                        <h3 style={{ marginTop: 0, fontSize: '1rem', color: '#e53e3e' }}>⚠️ Menaces Majeures</h3>
                        <p style={{ fontSize: '0.9rem', color: '#718096' }}>Types contre lesquels votre équipe est vulnérable :</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
                            {sortedThreats.length > 0 ? sortedThreats.map(([type, count]) => (
                                <div key={type} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff5f5', padding: '10px', borderRadius: '10px', border: '1px solid #fed7d7' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ background: typeColors[type], color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                            {typeTranslations[type] || type}
                                        </span>
                                        <span style={{ fontWeight: 'bold', color: '#c53030' }}>est super efficace contre</span>
                                    </div>
                                    <div style={{ fontWeight: '900', fontSize: '1.2rem', color: '#e53e3e' }}>
                                        {count} <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>Membres</span>
                                    </div>
                                </div>
                            )) : (
                                <div style={{ textAlign: 'center', padding: '30px', background: '#f0fff4', color: '#2f855a', borderRadius: '10px', border: '1px solid #c6f6d5' }}>
                                    <div style={{ fontSize: '2rem' }}>🛡️</div>
                                    <strong>Équipe solide !</strong>
                                    <div style={{ fontSize: '0.9rem' }}>Aucune faiblesse partagée majeure détectée.</div>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}