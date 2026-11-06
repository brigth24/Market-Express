import { REGIONS } from '../data/products.js';

export default function Ticker() {
  const list = [...REGIONS, ...REGIONS];
  return (
    <div className="ticker" aria-label="Regiones con cobertura">
      <div className="ticker-track">
        {list.map((r, i) => (
          <span className="ticker-item" key={`${r}-${i}`}>
            <span className="pin" aria-hidden="true">📍</span>
            {r}
            <span className="sep" aria-hidden="true">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
