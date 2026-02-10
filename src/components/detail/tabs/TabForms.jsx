import React, { useState, useEffect } from 'react';

export default function TabForms({ data }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      setLoading(true);
      try {
        // On récupère les variétés depuis l'URL de l'espèce
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        
        // varieties contient les différentes formes (Mega, Gmax, Alola, Styles de Shifours...)
        const varieties = speciesData.varieties || [];

        const formPromises = varieties.map(async (v) => {
            const parts = v.pokemon.url.split('/');
            const id = parts[parts.length - 2];
            
            // On fetch les détails de la forme pour avoir l'image et les types
            const res = await fetch(v.pokemon.url);
            const formData = await res.json();

            // On essaie de cleaner le nom (ex: "urshifu-rapid-strike" -> "Rapid Strike")
            let formName = formData.name.replace(speciesData.name, '').replace(/-/g, ' ').trim();
            if (!formName) formName = "Forme Normale";

            return {
                id: id,
                name: formName,
                isDefault: v.is_default,
                img: formData.sprites.other['official-artwork'].front_default || formData.sprites.front_default,
                types: formData.types
            };
        });

        const results = await Promise.all(formPromises);
        setForms(results);
      } catch (e) {
        console.error("Erreur Formes:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, [data]);

  const changePokemon = (id) => {
     // Déclenche l'événement pour changer le Pokémon affiché dans l'app
     const event = new CustomEvent('changePokemonId', { detail: parseInt(id) });
     window.dispatchEvent(event);
  };

  if (loading) return <div style={{padding:'20px', textAlign:'center'}}>Recherche des formes...</div>;
  if (forms.length <= 1) return <div style={{padding:'20px', textAlign:'center', color:'#a0aec0'}}>Ce Pokémon ne possède pas de formes alternatives connues.</div>;

  return (
    <div className="fade-in">
       <div className="section-title">Formes Alternatives</div>
       <div style={{display:'flex', flexWrap:'wrap', gap:'20px', justifyContent:'center'}}>
          {forms.map(form => (
             <div 
               key={form.id} 
               onClick={() => changePokemon(form.id)}
               style={{
                   background:'white', borderRadius:'15px', padding:'15px', 
                   width:'140px', display:'flex', flexDirection:'column', alignItems:'center',
                   cursor:'pointer', boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                   border: form.id == data.id ? `2px solid ${data.color}` : '2px solid transparent'
               }}
             >
                 <img 
                    src={form.img} 
                    alt={form.name} 
                    style={{width:'100px', height:'100px', objectFit:'contain'}}
                    onError={(e) => {e.target.onerror = null; e.target.src = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png"}}
                 />
                 <div style={{fontWeight:'bold', textTransform:'capitalize', textAlign:'center', marginTop:'10px', fontSize:'0.85rem'}}>
                     {form.name}
                 </div>
                 {/* Badges types miniatures */}
                 <div style={{display:'flex', gap:'5px', marginTop:'5px'}}>
                     {form.types.map(t => (
                         <div key={t.type.name} style={{width:'10px', height:'10px', borderRadius:'50%', background: getComputedStyle(document.documentElement).getPropertyValue(`--type-${t.type.name}`) || '#ccc'}}></div>
                     ))}
                 </div>
             </div>
          ))}
       </div>
    </div>
  );
}