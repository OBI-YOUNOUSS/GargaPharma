import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../../services/api';

export default function CreateAdmin() {
  const [formData, setFormData] = useState({
    name: 'Admin GargaPharma',
    email: 'admin@gargapharma.td',
    password: 'admin123',
    company: 'GargaPharma',
    phone: '+235 00 00 00 00'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await apiService.register(formData);
      
      if (response.success) {
        setMessage('✅ Compte admin créé avec succès!');
        
        // Se connecter automatiquement
        const loginResponse = await apiService.login({
          email: formData.email,
          password: formData.password
        });
        
        if (loginResponse.success) {
          localStorage.setItem('token', loginResponse.data.token);
          localStorage.setItem('user', JSON.stringify(loginResponse.data.user));
          setMessage('✅ Compte admin créé et connecté! Redirection...');
          setTimeout(() => navigate('/admin'), 2000);
        }
      } else {
        setMessage('❌ Erreur: ' + response.message);
      }
    } catch (error: any) {
      setMessage('❌ Erreur: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Créer un compte Admin
          </h2>
        </div>

        {message && (
          <div className={`p-4 rounded ${
            message.includes('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="text"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Création...' : 'Créer le compte Admin'}
          </button>
        </form>
      </div>
    </div>
  );
}