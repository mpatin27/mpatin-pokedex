import React from 'react';

export default function RunningPikachuSvg() {
  return (
    <div className="pikachu-runner-container">
      <svg
        className="pikachu-run-cycle"
        width="100"
        height="80"
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="pikachu-all">
          
          {/* QUEUE (ZigZag) */}
          <g className="pika-tail">
             <path d="M15 50 L25 50 L20 40 L35 40 L30 25 L60 10" stroke="black" strokeWidth="2" strokeLinejoin="round" fill="none" opacity="0.2"/> {/* Ombre */}
             <path d="M18 52 L28 52 L23 42 L38 42 L33 27 L65 10 L75 15 L38 35 L42 45 L28 45 L32 55 L18 55 Z" fill="#F6E659" stroke="#3E2723" strokeWidth="1.5"/>
             <path d="M18 52 L28 52 L23 42 L26 42 L20 54 L18 52 Z" fill="#8D5524"/> {/* Base marron */}
          </g>

          {/* JAMBE ARRIÈRE (Cachée) */}
          <g className="pika-leg-back">
            <path d="M45 55 L40 70 L55 70 Z" fill="#F6E659" stroke="#3E2723" strokeWidth="1.5" strokeLinejoin="round"/>
          </g>

          {/* CORPS + TÊTE (Forme unique pour éviter les coupures) */}
          <path d="M35 55 C35 30 50 25 60 25 C75 25 85 35 85 50 C85 65 70 68 60 68 C50 68 35 65 35 55 Z" fill="#F6E659" stroke="#3E2723" strokeWidth="1.5"/>
          
          {/* Rayures Dos */}
          <path d="M45 35 Q50 40 55 35" stroke="#8D5524" strokeWidth="3" strokeLinecap="round" />
          <path d="M48 45 Q53 50 58 45" stroke="#8D5524" strokeWidth="3" strokeLinecap="round" />

          {/* OREILLES */}
          <g className="pika-ear-left">
             <path d="M65 28 L50 5 L60 25 Z" fill="#F6E659" stroke="#3E2723" strokeWidth="1.5"/>
             <path d="M54 12 L50 5 L57 11 Z" fill="#1A1A1A"/> {/* Pointe */}
          </g>
          <g className="pika-ear-right">
             <path d="M75 30 L90 5 L80 30 Z" fill="#F6E659" stroke="#3E2723" strokeWidth="1.5"/>
             <path d="M86 12 L90 5 L83 13 Z" fill="#1A1A1A"/> {/* Pointe */}
          </g>

          {/* VISAGE */}
          <circle cx="63" cy="45" r="2.5" fill="#1A1A1A"/> {/* Oeil Gauche */}
          <circle cx="64" cy="44" r="0.8" fill="white"/>
          
          <circle cx="80" cy="45" r="2.5" fill="#1A1A1A"/> {/* Oeil Droit */}
          <circle cx="81" cy="44" r="0.8" fill="white"/>

          <circle cx="58" cy="52" r="3.5" fill="#E53E3E"/> {/* Joue Gauche */}
          <circle cx="83" cy="52" r="3.5" fill="#E53E3E"/> {/* Joue Droite */}

          <path d="M70 53 Q72 55 74 53" fill="none" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round"/> {/* Bouche */}
          <path d="M71 49 L72 50 L73 49" fill="none" stroke="#3E2723" strokeWidth="1"/> {/* Nez */}

          {/* JAMBE AVANT */}
          <g className="pika-leg-front">
            <path d="M65 60 L65 75 L75 75 L75 65 Z" fill="#F6E659" stroke="#3E2723" strokeWidth="1.5" strokeLinejoin="round"/>
          </g>

          {/* BRAS */}
          <path d="M65 60 Q75 65 80 58" fill="none" stroke="#3E2723" strokeWidth="1.5" strokeLinecap="round"/> 
          
        </g>
      </svg>
    </div>
  );
}