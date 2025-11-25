import { useState } from "react";
import MainLayout from "../Layouts/MainLayout";
import { 
  ShoppingCart, 
  User, 
  Bell,
  LogOut,
  Edit,
  Mail,
  Calendar,
  Star,
  MessageSquare,
  Shield
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function UserDashboard() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Données utilisateur simulées
  const [userData, setUserData] = useState({
    fullName: "Jean Dupont",
    email: "jean.dupont@example.com",
    memberSince: "Janvier 2024",
    loyaltyPoints: 1250,
  });

  const features = [
    {
      title: "Mon Profil",
      description: "Informations personnelles",
      icon: User,
      path: "/profile",
      color: "green"
    },
    {
      title: "Mes Commandes",
      description: "Suivez et gérez vos commandes",
      icon: ShoppingCart,
      path: "/orders",
      color: "blue",
      badge: "3 nouvelles"
    },
    {
      title: "Notifications",
      description: "Préférences de communication",
      icon: Bell,
      path: "/notifications",
      color: "indigo"
    }
  ];

  // Activités récentes avec messages de l'administrateur
  const recentActivities = [
    { 
      action: "Nouveau message de l'administrateur", 
      date: "Il y a 2 heures", 
      status: "Non lu",
      type: "admin",
      icon: Shield,
      color: "text-red-600",
      bgColor: "bg-red-100"
    },
    { 
      action: "Commande #12345 expédiée", 
      date: "Il y a 3 heures", 
      status: "Expédiée",
      type: "order",
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    { 
      action: "Message important: Maintenance programmée", 
      date: "Il y a 1 jour", 
      status: "Info",
      type: "admin",
      icon: MessageSquare,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    { 
      action: "Commande #12344 livrée", 
      date: "Il y a 2 jours", 
      status: "Livrée",
      type: "order",
      icon: ShoppingCart,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    { 
      action: "Nouvelle offre spéciale", 
      date: "Il y a 3 jours", 
      status: "Promotion",
      type: "admin",
      icon: Bell,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: "bg-blue-50", hover: "bg-blue-100", icon: "text-blue-600", text: "text-blue-700" },
      green: { bg: "bg-green-50", hover: "bg-green-100", icon: "text-green-600", text: "text-green-700" },
      indigo: { bg: "bg-indigo-50", hover: "bg-indigo-100", icon: "text-indigo-600", text: "text-indigo-700" },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log("Déconnexion de l'utilisateur");
    navigate("/login");
    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Non lu":
        return "bg-red-100 text-red-700";
      case "Expédiée":
        return "bg-blue-100 text-blue-700";
      case "Livrée":
        return "bg-green-100 text-green-700";
      case "Info":
        return "bg-orange-100 text-orange-700";
      case "Promotion":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50/30">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* En-tête */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {userData.fullName.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bonjour, {userData.fullName.split(' ')[0]} 👋</h1>
                    <p className="text-gray-600 mt-1">Bienvenue sur votre espace personnel</p>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 border border-red-200 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">{isLoading ? "Déconnexion..." : "Déconnexion"}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Section principale - Fonctionnalités et Activités */}
              <div className="lg:col-span-2 space-y-6">
                {/* Fonctionnalités principales */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Services</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => {
                      const colorClasses = getColorClasses(feature.color);
                      const FeatureIcon = feature.icon;
                      
                      return (
                        <Link
                          key={index}
                          to={feature.path}
                          className="group p-6 rounded-xl border border-gray-200 hover:border-gray-300 transition-all duration-200 hover:shadow-md"
                        >
                          <div className="flex flex-col items-center text-center">
                            <div className={`p-4 rounded-xl ${colorClasses.bg} group-hover:${colorClasses.hover} transition-colors mb-4`}>
                              <FeatureIcon className={`w-8 h-8 ${colorClasses.icon}`} />
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                              {feature.badge && (
                                <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                                  {feature.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>

                {/* Activités récentes avec messages admin */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Activités récentes</h2>
                    <Link to="/activities" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                      Voir tout
                    </Link>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity, index) => {
                      const ActivityIcon = activity.icon;
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center gap-4 p-4 rounded-lg border-l-4 ${
                            activity.type === 'admin' 
                              ? 'border-l-red-500 bg-red-50/50' 
                              : 'border-l-blue-500 bg-gray-50'
                          } transition-colors hover:shadow-sm`}
                        >
                          <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                            <ActivityIcon className={`w-5 h-5 ${activity.color}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900">{activity.action}</div>
                            <div className="text-sm text-gray-500 mt-1">{activity.date}</div>
                          </div>
                          <span className={`px-3 py-1 text-sm rounded-full font-medium ${getStatusColor(activity.status)}`}>
                            {activity.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sidebar - Informations personnelles */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Mon Profil</h2>
                    <Link 
                      to="/profile/edit" 
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                    >
                      <Edit className="w-4 h-4" />
                      Modifier
                    </Link>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <User className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">{userData.fullName}</div>
                        <div className="text-sm text-gray-600">Nom complet</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Mail className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">{userData.email}</div>
                        <div className="text-sm text-gray-600">Email</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="font-medium text-gray-900">{userData.memberSince}</div>
                        <div className="text-sm text-gray-600">Membre depuis</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50">
                      <Star className="w-5 h-5 text-amber-600" />
                      <div>
                        <div className="font-medium text-gray-900">{userData.loyaltyPoints} points</div>
                        <div className="text-sm text-amber-600">Fidélité</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Statistiques des messages */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Mes Messages</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-blue-50">
                      <span className="text-sm text-gray-700">Messages non lus</span>
                      <span className="bg-red-500 text-white text-sm px-2 py-1 rounded-full">2</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-700">Messages de l'admin</span>
                      <span className="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">3</span>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                      <span className="text-sm text-gray-700">Total des messages</span>
                      <span className="bg-gray-600 text-white text-sm px-2 py-1 rounded-full">5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}