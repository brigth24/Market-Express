import { useEffect, useRef, useState } from 'react';
import aboutImg from '../assets/img/about.jpg';

function useCountUp(target, active, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return undefined;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return value;
}

export default function About() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const regions = useCountUp(16, seen);
  const cats = useCountUp(3, seen);
  const hours = useCountUp(24, seen);

  return (
    <section id="nosotros" className="about" ref={ref}>
      <div className="container about-grid">
        <div className="about-text">
          <span className="eyebrow eyebrow--yellow">Sobre Market Express</span>
          <h2>
            Productos de primera necesidad, <em>siempre disponibles.</em>
          </h2>
          <p>
            Controlamos nuestro inventario en tiempo real para que nunca compres algo que no
            tenemos. Si está en la tienda, está en nuestro almacén.
          </p>
          <dl className="stats">
            <div>
              <dt>{regions}</dt>
              <dd>regiones</dd>
            </div>
            <div>
              <dt>{cats}</dt>
              <dd>categorías</dd>
            </div>
            <div>
              <dt>{hours}h</dt>
              <dd>entrega</dd>
            </div>
          </dl>
        </div>
        <img className="about-img" src={aboutImg} alt="Alimentos, bebidas y artículos de limpieza" />
      </div>
    </section>
  );
}
