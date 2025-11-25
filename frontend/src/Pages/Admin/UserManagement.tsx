import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, UserX, UserCheck, Phone, Building } from 'lucide-react';
import SidebarLayout from "../../Layouts/SidebarLayout";
import apiService from '../../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  company?: string;
  phone?: string;
  is_active: boolean;
  created_at: string;
  last_login?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setApiError(null);
      
      // Vérifier si l'API est disponible
      const response = await apiService.getUsers();
      
      // Adapter selon la structure de votre API
      if (response && (response.data || response.users)) {
        const usersData = response.data?.users || response.data || response.users || [];
        setUsers(usersData);
      } else {
        // Si la réponse n'a pas la structure attendue
        throw new Error('Structure de données invalide');
      }
      
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      setApiError('Impossible de charger les utilisateurs depuis l\'API');
      // Fallback sur données mockées uniquement en cas d'erreur réelle
      setUsers(getMockUsers());
    } finally {
      setLoading(false);
    }
  };

  // Fonction de fallback avec données mockées
  const getMockUsers = (): User[] => {
    console.log('📋 Utilisation des données mockées pour les utilisateurs');
    return [
      {
        id: 1,
        name: 'Admin GargaPharma',
        email: 'admin@gargapharma.td',
        role: 'admin',
        company: 'GargaPharma',
        phone: '+235 98 98 00 07',
        is_active: true,
        created_at: '2024-01-01T00:00:00Z',
        last_login: '2024-01-15T14:30:00Z'
      },
      {
        id: 2,
        name: 'Dr. Martin Dubois',
        email: 'martin.dubois@clinique.td',
        role: 'user',
        company: 'Clinique La Providence',
        phone: '+235 70 12 34 56',
        is_active: true,
        created_at: '2024-01-10T09:15:00Z',
        last_login: '2024-01-15T10:20:00Z'
      },
      {
        id: 3,
        name: 'Pharmacie Centrale',
        email: 'contact@pharmacie-centrale.td',
        role: 'user',
        company: 'Pharmacie Centrale de Moundou',
        phone: '+235 22 33 44 55',
        is_active: true,
        created_at: '2024-01-08T14:30:00Z',
        last_login: '2024-01-14T16:45:00Z'
      },
      {
        id: 4,
        name: 'Sarah Koné',
        email: 'sarah.kone@email.td',
        role: 'user',
        phone: '+235 66 77 88 99',
        is_active: false,
        created_at: '2024-01-12T11:20:00Z',
        last_login: '2024-01-12T11:25:00Z'
      },
      {
        id: 5,
        name: 'Dr. Ahmed Kader',
        email: 'ahmed.kader@hopital.td',
        role: 'user',
        company: 'Hôpital Régional de Moundou',
        phone: '+235 55 44 33 22',
        is_active: true,
        created_at: '2024-01-05T08:00:00Z',
        last_login: '2024-01-15T09:30:00Z'
      }
    ];
  };

  const toggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      // Appel API réel pour changer le statut
      const response = await apiService.updateUserStatus(userId, !currentStatus);
      
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, is_active: !currentStatus } : user
        ));
        alert(`✅ Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} avec succès`);
      } else {
        throw new Error(response.message || 'Erreur lors du changement de statut');
      }
    } catch (error: unknown) {
      console.error('Erreur changement statut:', error);
      
      // Fallback : mise à jour locale si l'API échoue
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, is_active: !currentStatus } : user
      ));
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`⚠️ Mode démo: Utilisateur ${!currentStatus ? 'activé' : 'désactivé'} localement\n(Erreur API: ${errorMessage})`);
    }
  };

  const changeUserRole = async (userId: number, newRole: User['role']) => {
    try {
      // Appel API réel pour changer le rôle
      const response = await apiService.updateUserRole(userId, newRole);
      
      if (response.success) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, role: newRole } : user
        ));
        alert(`✅ Rôle changé en ${newRole === 'admin' ? 'administrateur' : 'utilisateur'}`);
      } else {
        throw new Error(response.message || 'Erreur lors du changement de rôle');
      }
    } catch (error: unknown) {
      console.error('Erreur changement rôle:', error);
      
      // Fallback : mise à jour locale si l'API échoue
      setUsers(prev => prev.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`⚠️ Mode démo: Rôle changé localement\n(Erreur API: ${errorMessage})`);
    }
  };

  const getRoleText = (role: User['role']) => {
    return role === 'admin' ? 'Administrateur' : 'Utilisateur';
  };

  const getRoleColor = (role: User['role']) => {
    return role === 'admin'
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.company && user.company.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && user.is_active) ||
      (statusFilter === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <div className="flex gap-2">
            {apiError && (
              <span className="bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-sm">
                ⚠️ Mode démo
              </span>
            )}
            <button
              onClick={fetchUsers}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Actualiser
            </button>
          </div>
        </div>

        {/* Alert si utilisation des données mockées */}
        {apiError && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Mode démo activé
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>{apiError}. Les données affichées sont des exemples.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Tous les rôles</option>
                <option value="admin">Administrateurs</option>
                <option value="user">Utilisateurs</option>
              </select>
            </div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actifs</option>
              <option value="inactive">Inactifs</option>
            </select>
          </div>
        </div>

        {/* Le reste du code reste identique */}
        {/* ... (statistiques, tableau, etc.) */}

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-700">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm text-blue-600">Utilisateurs</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-purple-700">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm text-purple-600">Administrateurs</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-700">
              {users.filter(u => u.is_active).length}
            </div>
            <div className="text-sm text-green-600">Actifs</div>
          </div>
        </div>

        {/* Liste des utilisateurs */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          {user.company && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {user.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {user.email}
                      </div>
                      {user.phone && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                        {getRoleText(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.is_active)}`}>
                        {user.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => {/* Voir profil */ }}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir le profil"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => {/* Modifier */ }}
                        className="text-green-600 hover:text-green-900"
                        title="Modifier l'utilisateur"
                      >
                        <Edit className="w-5 h-5" />
                      </button>

                      {user.role !== 'admin' && (
                        <button
                          onClick={() => changeUserRole(user.id, 'admin')}
                          className="text-purple-600 hover:text-purple-900"
                          title="Promouvoir administrateur"
                        >
                          <UserCheck className="w-5 h-5" />
                        </button>
                      )}

                      <button
                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                        className={user.is_active ? "text-red-600 hover:text-red-900" : "text-green-600 hover:text-green-900"}
                        title={user.is_active ? "Désactiver l'utilisateur" : "Activer l'utilisateur"}
                      >
                        <UserX className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun utilisateur trouvé</p>
              <p className="text-gray-400 mt-2">
                {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                  ? 'Aucun utilisateur ne correspond à vos critères'
                  : 'Aucun utilisateur pour le moment'}
              </p>
            </div>
          )}
        </div>

        {/* Informations importantes */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Gestion des Utilisateurs</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Seuls les administrateurs peuvent gérer les utilisateurs</li>
            <li>• La désactivation empêche la connexion mais conserve les données</li>
            <li>• Les administrateurs ont accès à toutes les fonctionnalités</li>
            <li>• Promouvoir un utilisateur le rend administrateur</li>
          </ul>
        </div>
      </div>
    </SidebarLayout>
  );
}