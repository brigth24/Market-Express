import { useEffect, useState } from 'react';
import { HERO_IMAGES } from '../data/products.js';

const SLIDES = [
  {
    tag: 'Bebidas',
    title: 'Refréscate sin salir de casa',
    text: 'Agua, jugos y gaseosas listos para tu pedido.',
    cta: 'Comprar bebidas',
    category: 'bebidas',
    image: HERO_IMAGES.bebidas,
  },
  {
    tag: 'Limpieza',
    title: 'Tu hogar, impecable',
    text: 'Detergentes, desinfectantes y todo para la limpieza diaria.',
    cta: 'Comprar limpieza',
    category: 'limpieza',
    image: HERO_IMAGES.limpieza,
  },
  {
    tag: 'Despensa',
    title: 'Lo esencial para tu cocina',
    text: 'Arroz, aceite, fideos y más, con stock confirmado al instante.',
    cta: 'Comprar despensa',
    category: 'alimentos',
    image: HERO_IMAGES.alimentos,
  },
];

export default function Hero({ onShop }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = (i) => setIndex((i + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    if (paused) return undefined;
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 5500);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <section
      className="hero"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
    >
      {SLIDES.map((s, i) => (
        <article
          key={s.category}
          className={`slide ${i === index ? 'is-active' : ''}`}
          aria-hidden={i !== index}
        >
          <div className="slide-media">
            <img src={s.image} alt="" />
          </div>
          <div className="slide-shade" />
          <div className="container slide-content">
            <span className="tag">{s.tag}</span>
            <h1>{s.title}</h1>
            <p>{s.text}</p>
            <div className="slide-actions">
              <button className="btn btn-yellow btn-lg" onClick={() => onShop(s.category)}>
                {s.cta} →
              </button>
              <a href="#nosotros" className="btn btn-outline btn-lg">Conócenos</a>
            </div>
          </div>
        </article>
      ))}

      <button className="hero-arrow hero-arrow--prev" onClick={() => go(index - 1)} aria-label="Anterior">‹</button>
      <button className="hero-arrow hero-arrow--next" onClick={() => go(index + 1)} aria-label="Siguiente">›</button>

      <div className="hero-dots">
        {SLIDES.map((s, i) => (
          <button
            key={s.category}
            className={i === index ? 'is-active' : ''}
            onClick={() => go(i)}
            aria-label={`Ir a la diapositiva ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
