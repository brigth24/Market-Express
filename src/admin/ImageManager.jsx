import { useRef, useState } from 'react';
import { useInventory } from '../context/InventoryContext.jsx';
import { fileToDataUrl } from './helpers.jsx';

// Cuadrícula "Imágenes de productos": las fotos se reflejan en la tienda.
export default function ImageManager({ selectedId, onSelect, hint }) {
  const { products, setImage } = useInventory();
  const [error, setError] = useState('');
  const [over, setOver] = useState(null);
  const inputs = useRef({});

  const upload = async (id, file) => {
    try {
      setError('');
      setImage(id, await fileToDataUrl(file));
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <section className="a-card">
      <h3 className="a-card-title">Imágenes de productos</h3>
      {hint && <p className="a-hint">{hint}</p>}
      {error && <p className="a-error">{error}</p>}
      <div className="img-grid">
        {products.map((p) => (
          <div
            key={p.id}
            className={`img-tile ${selectedId === p.id ? 'is-selected' : ''} ${over === p.id ? 'is-over' : ''}`}
            onClick={() => onSelect?.(p.id)}
            onDragOver={(e) => { e.preventDefault(); setOver(p.id); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => { e.preventDefault(); setOver(null); upload(p.id, e.dataTransfer.files[0]); }}
          >
            <img src={p.image} alt="" />
            <span>{p.name}</span>
            <button type="button" className="a-btn-mini" onClick={(e) => { e.stopPropagation(); inputs.current[p.id].click(); }}>
              📷 Agregar
            </button>
            <input
              ref={(el) => (inputs.current[p.id] = el)}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              hidden
              onChange={(e) => { upload(p.id, e.target.files[0]); e.target.value = ''; }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
