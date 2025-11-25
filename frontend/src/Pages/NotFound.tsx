import { useNavigate } from 'react-router-dom';
import Layout from '../Layouts/MainLayout'; // Adaptez le chemin

function NotFound(){
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="p-8 text-center max-w-md">
          <div className="mb-6">
            <h1 className="text-6xl font-bold text-green-700 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-blue-700 mb-4">Page non trouvée</h2>
            <p className="text-gray-600 mb-8">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>
          
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button 
              onClick={() => window.history.back()}
              className="w-full sm:w-auto bg-blue-500 hover:bg-gray-700 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
            >
              ← Page précédente
            </button>
            <button 
              onClick={() => navigate('/')}
              className="w-full sm:w-auto bg-green-700 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition duration-200 font-medium"
            >
              Accueil
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default NotFound;