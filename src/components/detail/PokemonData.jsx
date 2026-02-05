// PokemonData.jsx
import React from 'react';
import TabGeneral from './tabs/TabGeneral';
import TabStats from './tabs/TabStats';
import TabEvolution from './tabs/TabEvolution';
import TabForms from './tabs/TabForms';
import TabMoves from './tabs/TabMoves';

export default function PokemonData({ data, activeTab, setActiveTab }) {
  
  const tabs = [
    { key: 'general', label: 'Aperçu' },
    { key: 'stats', label: 'Stats' },
    { key: 'moves', label: 'Attaques' },
    { key: 'evo', label: 'Évolution' },
    { key: 'forms', label: 'Formes' } // Active si tu as fait le composant
  ];

  return (
    <div className="data-terminal">
      {/* Navigation des Onglets */}
      <div className="tabs-scroll-container">
         {tabs.map(tab => (
           <button 
             key={tab.key}
             onClick={() => setActiveTab(tab.key)}
             className={`tab-button ${activeTab === tab.key ? 'active' : ''}`}
             style={{
               borderColor: activeTab === tab.key ? data.color : 'transparent',
               color: activeTab === tab.key ? '#2d3748' : '#a0aec0',
             }}
           >
             {tab.label}
           </button>
         ))}
      </div>

      {/* Affichage du contenu */}
      <div style={{flex: 1, overflowY: 'auto', paddingRight: '5px'}}>
        {activeTab === 'general' && <TabGeneral data={data} />}
        {activeTab === 'stats' && <TabStats data={data} />}
        {activeTab === 'moves' && <TabMoves data={data} />}
        {activeTab === 'evo' && <TabEvolution data={data} />}
        {activeTab === 'forms' && <TabForms data={data} />}
      </div>
    </div>
  );
}