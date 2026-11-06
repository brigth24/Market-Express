import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext.jsx';
import ImageManager from './ImageManager.jsx';
import { fmtDate, fileToDataUrl } from './helpers.jsx';

/* Pantalla compartida por Entradas y Salidas (misma estructura, distintos campos). */
export default function MovementForm({ kind, user }) {
  const isEntry = kind === 'entrada';
  const { products, movements, setImage, registerEntry, registerExit } = useInventory();
  const [params] = useSearchParams();

  const initial = Number(params.get('producto')) || products[0]?.id;
  const [productId, setProductId] = useState(initial);
  const [f, setF] = useState({ qty: '', cost: '', date: '', supplier: '', doc: '', note: '', responsible: user.name, reason: 'Venta' });
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const fileRef = useRef(null);

  useEffect(() => {
    const id = Number(params.get('producto'));
    if (id) setProductId(id);
  }, [params]);

  const product = products.find((p) => p.id === productId) ?? products[0];
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const history = movements
    .filter((m) => m.type === kind)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const submit = (e) => {
    e.preventDefault();
    setOk('');
    if (!product) return setError('No hay productos registrados.');
    const qty = Math.floor(+f.qty);
    if (!(qty > 0)) return setError('Ingresa una cantidad mayor a 0.');
    if (!isEntry && qty > product.stock) return setError(`No puedes sacar más de lo disponible (${product.stock}).`);
    setError('');
    if (isEntry) registerEntry({ productId: product.id, qty, cost: f.cost, date: f.date, supplier: f.supplier, doc: f.doc, note: f.note });
    else registerExit({ productId: product.id, qty, responsible: f.responsible, reason: f.reason, date: f.date, note: f.note });
    setF((s) => ({ ...s, qty: '', cost: '', date: '', supplier: '', doc: '', note: '' }));
    setOk(isEntry ? 'Entrada registrada. El stock se actualizó.' : 'Salida registrada. El stock se actualizó.');
    setTimeout(() => setOk(''), 3000);
  };

  const pickImage = async (file) => {
    try {
      setImage(product.id, await fileToDataUrl(file));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  if (!product) return <p className="a-hint">Primero registra un producto.</p>;

  return (
    <>
      <h1 className="a-title">{isEntry ? 'Entradas de productos' : 'Salidas de productos'}</h1>
      <p className="a-sub">
        {isEntry
          ? 'Registra productos que ingresan al almacén. El stock se actualiza automáticamente.'
          : 'Registra productos entregados o vendidos. No se puede sacar más de lo disponible.'}
      </p>

      <div className="a-split">
        <div className="a-col">
          <form className="a-card a-form" onSubmit={submit}>
            <div className="a-prod-head">
              <img src={product.image} alt="" />
              <div>
                <strong>{product.name}</strong>
                <small>Imagen del producto</small>
                <button type="button" className="a-btn-mini" onClick={() => fileRef.current.click()}>📷 Subir imagen</button>
                <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" hidden
                  onChange={(e) => { pickImage(e.target.files[0]); e.target.value = ''; }} />
              </div>
            </div>

            <select value={product.id} onChange={(e) => setProductId(Number(e.target.value))}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>

            <label>Stock:<input readOnly value={`${product.stock} unidad${product.stock === 1 ? '' : 'es'}`} /></label>
            <label>Cantidad:<input type="number" min="1" placeholder={isEntry ? '20' : 'Cantidad'} value={f.qty} onChange={set('qty')} /></label>

            {isEntry ? (
              <>
                <label>Costo Unitario:<input type="number" min="0" step="0.01" placeholder="S/3.00" value={f.cost} onChange={set('cost')} /></label>
                <label>Fecha de Ingreso:<input type="date" value={f.date} onChange={set('date')} /></label>
                <label>Proveedor:<input placeholder="Alicorp" value={f.supplier} onChange={set('supplier')} /></label>
                <label>Comprobante:<input placeholder="Factura 001" value={f.doc} onChange={set('doc')} /></label>
              </>
            ) : (
              <>
                <label>Responsable:<input value={f.responsible} onChange={set('responsible')} /></label>
                <label>Motivo:<input placeholder="Venta" value={f.reason} onChange={set('reason')} /></label>
                <label>Fecha:<input type="date" value={f.date} onChange={set('date')} /></label>
              </>
            )}
            <label>Nota:<input placeholder="Descripción" value={f.note} onChange={set('note')} /></label>

            {error && <p className="a-error">{error}</p>}
            {ok && <p className="a-ok">{ok}</p>}
            <button className={`a-btn a-btn--block ${isEntry ? '' : 'a-btn--red'}`} type="submit">
              {isEntry ? 'Registrar entrada' : 'Registrar salida'}
            </button>
          </form>

          <ImageManager
            selectedId={product.id}
            onSelect={setProductId}
            hint={isEntry ? null : 'Agrega o cambia la foto de cada producto (JPG, PNG o WebP). También puedes arrastrar una imagen sobre su recuadro.'}
          />
        </div>

        <section className="a-card a-history">
          <h3 className="a-card-title">{isEntry ? 'Historial de entradas' : 'Historial de salidas'}</h3>
          <ul className="a-list a-list--mov">
            {history.map((m) => (
              <li key={m.id}>
                <div>
                  <strong>{m.name}</strong>
                  <small>{fmtDate(m.date)} · {m.detail}</small>
                </div>
                <b className={isEntry ? 'pos' : 'neg'}>{isEntry ? '+' : '−'}{m.qty}</b>
              </li>
            ))}
            {history.length === 0 && <li className="a-hint">Aún no hay movimientos.</li>}
          </ul>
        </section>
      </div>
    </>
  );
}
