import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // Supprimer les données d'authentification
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Rediriger vers la page d'accueil
    navigate('/');
    window.location.reload();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Déconnexion en cours...</p>
      </div>
    </div>
  );
}