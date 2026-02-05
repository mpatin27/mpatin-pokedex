import { typeTranslations, typeColors } from '../../../utils/pokemonConsts';

export default function TabForms({ data }) {
  return (
    <div className="fade-in">
      <div className="section-title">Variétés & Formes</div>
      {data.varieties.length > 0 ? (
        <div style={{display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap:'15px'}}>
          {data.varieties.map((v, i) => (
            <div key={i} style={{background:'#f7fafc', padding:'15px', borderRadius:'15px', textAlign:'center', border:'1px solid #edf2f7'}}>
              <img src={v.img} style={{width:'80px'}} alt={v.name} />
              <div style={{fontWeight:'bold', textTransform:'capitalize', fontSize:'0.9rem', marginTop:'10px'}}>{v.name}</div>
              <span style={{fontSize:'0.7rem', padding:'2px 8px', background: typeColors[v.type] || '#ccc', color:'white', borderRadius:'10px', textTransform:'uppercase'}}>
                {typeTranslations[v.type] || v.type}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div style={{textAlign:'center', padding:'40px', color:'#a0aec0'}}>
          Aucune forme alternative connue.
        </div>
      )}
    </div>
  );
}