import { Link } from 'react-router-dom';

export default function Logo({ variant = 'default' }) {
  return (
    <Link to="/" className={`logo logo--${variant}`} aria-label="Market Express, inicio">
      <span className="logo-mark">M</span>
      <span className="logo-text">
        Market<span>Express</span>
      </span>
    </Link>
  );
}
