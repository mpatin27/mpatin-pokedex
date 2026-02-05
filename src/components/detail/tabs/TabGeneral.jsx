import StatRadar from '../../StatRadar';

export default function TabGeneral({ data }) {
  return (
    <div className="fade-in">
      
      <div className="section-title">Analyse de Combat</div>
      <StatRadar stats={data.stats} color={data.color} />
      
      <div className="section-title" style={{marginTop:'20px'}}>Biométrie</div>
      <div className="info-grid">
        <div className="info-box">
            <div className="info-label">Talents</div>
            <div className="info-value" style={{fontSize:'0.9rem'}}>
              {data.abilitiesTranslated.map(a => (
                  <div key={a.name}>{a.name} {a.isHidden && <small>(Caché)</small>}</div>
              ))}
            </div>
        </div>
        <div className="info-box"><div className="info-label">Taille</div><div className="info-value">{data.height / 10} m</div></div>
        <div className="info-box"><div className="info-label">Poids</div><div className="info-value">{data.weight / 10} kg</div></div>
        <div className="info-box"><div className="info-label">Capture</div><div className="info-value">{data.captureRate} %</div></div>
      </div>

    </div>
  );
}