import { useState, useEffect } from 'react';
import { Users, ShoppingCart, Package, DollarSign, Plus, List, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SidebarLayout from "../../Layouts/SidebarLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  // Vérification d'authentification et rôle admin
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      alert('❌ Vous devez être connecté pour accéder à cette page');
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      console.log('👤 User role:', user.role); // Debug
      
      if (user.role !== 'admin') {
        alert('❌ Accès réservé aux administrateurs');
        navigate('/');
        return;
      }
      setIsAdmin(true);
      
      // Charger les stats
      fetchDashboardStats();
    } catch (error) {
      console.error('Erreur parsing user:', error);
      navigate('/login');
    }
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('🔐 Token:', token);
      
      // SOLUTION TEMPORAIRE : Données mockées en attendant l'API
      setStats({
        totalUsers: 42,
        totalOrders: 156,
        totalProducts: 89,
        totalRevenue: 1250000
      });
      
      // CODE ORIGINAL (à utiliser quand l'API sera prête)
      const response = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
      
    } catch (error) {
      console.error('Erreur chargement stats:', error);
      // Données par défaut en cas d'erreur
      setStats({
        totalUsers: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalRevenue: 0
      });
    }
  };

  // Couleurs fixes pour Tailwind
  const statCards = [
    {
      title: 'Utilisateurs',
      value: stats.totalUsers,
      icon: Users,
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Commandes',
      value: stats.totalOrders,
      icon: ShoppingCart,
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    },
    {
      title: 'Revenue',
      value: `${stats.totalRevenue.toLocaleString()} FCFA`,
      icon: DollarSign,
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  if (!isAdmin) {
    return (
      <SidebarLayout>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Tableau de Bord Admin</h1>
        
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center">
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gestion Produits */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4">Gestion Produits</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/admin/add-product')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <Plus className="w-4 h-4" />
                Ajouter un produit
              </button>
              <button 
                onClick={() => handleNavigation('/admin/products')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <List className="w-4 h-4" />
                Gérer les produits
              </button>
            </div>
          </div>

          {/* Commandes */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4">Commandes</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/admin/orders')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <List className="w-4 h-4" />
                Voir toutes les commandes
              </button>
              <button 
                onClick={() => handleNavigation('/admin/orders?status=pending')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <ShoppingCart className="w-4 h-4" />
                Commandes en attente
              </button>
            </div>
          </div>

          {/* Utilisateurs & Messages */}
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4">Communication</h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleNavigation('/admin/users')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <Users className="w-4 h-4" />
                Gérer les utilisateurs
              </button>
              <button 
                onClick={() => handleNavigation('/admin/messages')}
                className="w-full flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <MessageCircle className="w-4 h-4" />
                Messages de contact
              </button>
            </div>
          </div>
        </div>

        {/* Section informations */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Informations Système</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><span className="font-medium">Environnement:</span> Développement</p>
              <p><span className="font-medium">Version:</span> 1.0.0</p>
            </div>
            <div>
              <p><span className="font-medium">Dernière mise à jour:</span> Aujourd'hui</p>
              <p><span className="font-medium">Statut:</span> <span className="text-green-600">● En ligne</span></p>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}