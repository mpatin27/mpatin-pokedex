import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

const statNameMap = {
  'hp': 'PV',
  'attack': 'ATK',
  'defense': 'DEF',
  'special-attack': 'ATK.S',
  'special-defense': 'DEF.S',
  'speed': 'VIT'
};

export default function StatRadar({ stats, color }) {
  const maxStat = Math.max(...stats.map(s => s.base_stat));
  const domainMax = Math.ceil(maxStat / 20) * 20 + 20;

  const data = stats.map(s => ({
    subject: statNameMap[s.stat.name] || s.stat.name,
    value: s.base_stat,
    fullMark: domainMax, 
  }));

  return (
    <div style={{ width: '100%', height: 350, pointerEvents: 'none' }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          
          {/* 1. La grille (tout au fond) */}
          <PolarGrid 
            gridType="honeycomb" 
            stroke="#cbd5e0" 
            strokeWidth={1}
            strokeDasharray="4 4"
          />
          
          {/* 2. Les labels extérieurs (PV, ATK...) */}
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ 
              fill: '#718096', 
              fontSize: 12, 
              fontWeight: '800', 
              fontFamily: 'Outfit, sans-serif' 
            }} 
          />
          
          {/* 3. L'axe vertical (Graduations) - RENDU AVANT LE RADAR */}
          <PolarRadiusAxis 
            angle={90} 
            domain={[0, domainMax]} 
            tickCount={5} 
            tick={{ 
              fill: '#a0aec0', // Gris plus clair pour être discret en arrière-plan
              fontSize: 11, 
              fontWeight: 'bold',
              stroke: 'none', // Supprime le contour pour un rendu plus net
            }}
            axisLine={false} 
          />
          
          {/* 4. Le Radar (Forme) - RENDU EN DERNIER (Au-dessus) */}
          <Radar
            name="Stats"
            dataKey="value"
            stroke={color || '#2d3748'}
            strokeWidth={3}
            fill={color || '#2d3748'}
            fillOpacity={0.5} // La transparence permet de voir les chiffres à travers
            isAnimationActive={true}
            dot={{ 
              r: 4, 
              fill: color, 
              stroke: 'white', 
              strokeWidth: 2,
              fillOpacity: 1
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}