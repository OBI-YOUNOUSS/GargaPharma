import { useState } from 'react';
import apiService from '../../services/api';

export default function TestConnection() {
  const [status, setStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const testConnection = async () => {
    setStatus('testing');
    setMessage('Test en cours...');
    
    try {
      const response = await apiService.healthCheck();
      setStatus('success');
      setMessage('✅ Backend connecté: ' + JSON.stringify(response));
    } catch (error: any) {
      setStatus('error');
      setMessage('❌ Erreur backend: ' + error.message);
    }
  };

  const testLogin = async () => {
    setStatus('testing');
    setMessage('Test de connexion...');
    
    try {
      const response = await apiService.login({
        email: 'admin@gargapharma.td',
        password: 'admin123'
      });
      setStatus('success');
      setMessage('✅ Connexion réussie: ' + JSON.stringify(response.data.user));
    } catch (error: any) {
      setStatus('error');
      setMessage('❌ Erreur connexion: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-8">
      <h3 className="text-lg font-bold mb-4">Test de Connexion</h3>
      
      <div className="space-y-3">
        <button
          onClick={testConnection}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Tester Backend
        </button>
        
        <button
          onClick={testLogin}
          className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Tester Login Admin
        </button>
      </div>
      
      {message && (
        <div className={`mt-4 p-3 rounded ${
          status === 'success' ? 'bg-green-100 text-green-700' :
          status === 'error' ? 'bg-red-100 text-red-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {status === 'testing' && '🔄 '}
          {message}
        </div>
      )}
    </div>
  );
}