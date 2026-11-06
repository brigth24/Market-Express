import { useAuth } from '../context/AuthContext.jsx';
import MovementForm from './MovementForm.jsx';

export default function Exits() {
  const { user } = useAuth();
  return <MovementForm kind="salida" user={user} />;
}
