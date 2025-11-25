import { Home, LayoutDashboard, Users, Settings, HelpCircle, LogOut } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";

interface MenuItem {
  icon: ReactNode;
  label: string;
  path: string;
  onClick?: () => void;
}

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
    window.location.reload();
  };

  const menuItems: MenuItem[] = [
    { icon: <Home className="w-5 h-5" />, label: "Accueil", path: "/" },
    { icon: <LayoutDashboard className="w-5 h-5" />, label: "Dashboard", path: "/admin" },
    { icon: <Users className="w-5 h-5" />, label: "Utilisateurs", path: "/admin/users" },
    { icon: <Settings className="w-5 h-5" />, label: "Paramètres", path: "/admin/settings" },
    { icon: <HelpCircle className="w-5 h-5" />, label: "Aide", path: "/help" },
    { 
      icon: <LogOut className="w-5 h-5" />, 
      label: "Déconnexion", 
      path: "#",
      onClick: handleLogout
    },
  ];

  return (
    <aside className="w-64 h-screen bg-gray-900 text-gray-100 flex flex-col justify-between py-6 px-4 fixed">
      {/* Widget utilisateur */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold">A</span>
          </div>
          <div>
            <p className="font-semibold">Administrateur</p>
            <p className="text-sm text-gray-400">Admin</p>
          </div>
        </div>

        {/* Menu navigation */}
        <nav className="space-y-2">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              onClick={item.onClick}
              className="flex items-center gap-3 px-3 py-2 rounded hover:bg-gray-800 transition"
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Widget action bas */}
      <div className="mt-8">
        <div className="bg-blue-600 text-white text-sm p-4 rounded shadow">
          <p className="mb-2 font-semibold">Nouveautés disponibles !</p>
          <button className="bg-white text-blue-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100 transition">
            Découvrir
          </button>
        </div>
      </div>
    </aside>
  );
}