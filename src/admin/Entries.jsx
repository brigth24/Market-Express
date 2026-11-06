import { useAuth } from '../context/AuthContext.jsx';
import MovementForm from './MovementForm.jsx';

export default function Entries() {
  const { user } = useAuth();
  return <MovementForm kind="entrada" user={user} />;
}
