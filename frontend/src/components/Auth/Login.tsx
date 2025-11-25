import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import apiService from '../../services/api';
import imlogo from '../../assets/logoGP.png';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation basique
    if (!formData.email || !formData.password) {
      setError('Veuillez remplir tous les champs');
      setIsLoading(false);
      return;
    }

    try {
      console.log('🔄 Tentative de connexion...');
      
      const response = await apiService.login(formData);
      
      console.log('✅ Réponse login:', response);
      
      if (response.success) {
        // Sauvegarder le token et les infos utilisateur
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        console.log('🔐 Utilisateur connecté:', response.data.user);
        
        // Rediriger selon le rôle
        if (response.data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
        // Recharger pour mettre à jour l'interface
        setTimeout(() => window.location.reload(), 100);
        
      } else {
        setError(response.message || 'Erreur de connexion');
      }
    } catch (error: unknown) {
      console.error('❌ Erreur de connexion:', error);
      setError((error as Error).message || 'Erreur de connexion au serveur');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex flex-col items-center gap-2 hover:no-underline">
  {/* Logo dans un cercle */}
  <div className="w-20 h-20 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-gray-200 shadow-sm">
    <img
      src={imlogo}
      alt="GargaPharma Logo"
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Texte en dessous */}
  <p className="text-lg sm:text-xl md:text-2xl font-bold text-center">
    <span className="text-blue-600 hover:text-blue-700 transition-colors">Garga</span>
    <span className="text-green-600 hover:text-green-700 transition-colors">Pharma</span>
  </p>
</Link>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Connexion
          </h2>
          <p className="mt-2 text-gray-600">
            Accédez à votre compte GargaPharma
          </p>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Formulaire */}
        <form className="mt-8 space-y-6 bg-white p-6 rounded-xl shadow-lg" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            {/* Mot de passe */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="appearance-none block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Votre mot de passe"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg hover:shadow-xl"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Connexion...
              </div>
            ) : (
              'Se connecter'
            )}
          </button>

          {/* Lien d'inscription */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Pas de compte ?{' '}
              <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                Créer un compte
              </Link>
            </p>
          </div>
        </form>

      </div>
    </div>
  );
}