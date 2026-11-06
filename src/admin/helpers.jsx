export const fmtDate = (iso) => new Date(iso).toLocaleString('es-PE');
export const money = (n) => `S/ ${n.toFixed(2)}`;

export function StockBadge({ p }) {
  if (p.stock <= 0) return <span className="a-badge a-badge--red">Agotado</span>;
  const low = p.stock <= p.min;
  return (
    <span className={`a-badge ${low ? 'a-badge--yellow' : 'a-badge--green'}`}>
      {p.stock} / min {p.min}
    </span>
  );
}

// Reduce la imagen (máx. 480px) para poder guardarla en localStorage
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(jpeg|png|webp)$/.test(file.type)) {
      reject(new Error('Usa una imagen JPG, PNG o WebP.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Imagen no válida.'));
      img.onload = () => {
        const scale = Math.min(1, 480 / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * scale);
        c.height = Math.round(img.height * scale);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        resolve(c.toDataURL('image/jpeg', 0.85));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
