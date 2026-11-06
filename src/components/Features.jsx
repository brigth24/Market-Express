const FEATURES = [
  { icon: '⚡', title: 'Stock en tiempo real', text: 'Lo que ves, existe' },
  { icon: '🚚', title: 'Entrega 24–48h', text: 'A todo el Perú' },
  { icon: '🔒', title: 'Pago seguro', text: 'Protegemos tus datos' },
  { icon: '💬', title: 'Atención cercana', text: 'Te ayudamos siempre' },
];

export default function Features() {
  return (
    <section className="features container">
      {FEATURES.map((f) => (
        <article className="feature" key={f.title}>
          <span className="feature-icon" aria-hidden="true">{f.icon}</span>
          <h3>{f.title}</h3>
          <p>{f.text}</p>
        </article>
      ))}
    </section>
  );
}
