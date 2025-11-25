import { useState, useEffect } from 'react';
import { Search, Filter, Eye, CheckCircle, XCircle, Truck, Package } from 'lucide-react';
import SidebarLayout from "../../Layouts/SidebarLayout";
import apiService from "../../services/api";

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  prescription_required: boolean;
}

interface Order {
  id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  shipping_address: string;
  created_at: string;
  prescription_verified?: boolean;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 === DÉBUT CHARGEMENT COMMANDES ===');

      const response = await apiService.getAllOrders();
      console.log('📨 RÉPONSE API COMMANDES:', response);

      if (response.success) {
        console.log('📊 DONNÉES COMMANDES:', response.data);
        
        // Debug de la première commande
        if (response.data && response.data.length > 0) {
          console.log('🔍 PREMIÈRE COMMANDE:', response.data[0]);
        }
        
        setOrders(response.data);
        console.log(`✅ ${response.data.length} commandes chargées`);
      } else {
        console.error('❌ Erreur API commandes:', response.message);
      }
    } catch (error) {
      console.error('💥 Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
      console.log('🔚 === FIN CHARGEMENT COMMANDES ===');
    }
  };

  const updateOrderStatus = async (orderId: number, newStatus: Order['status']) => {
    try {
      console.log(`🔄 Mise à jour commande ${orderId} -> ${newStatus}`);
      
      const response = await apiService.updateOrderStatus(orderId, newStatus);
      
      if (response.success) {
        setOrders(prev =>
          prev.map(order =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
        alert(`✅ Statut mis à jour: ${getStatusText(newStatus)}`);
      } else {
        alert('❌ Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('💥 Erreur mise à jour:', error);
      alert('❌ Erreur lors de la mise à jour');
    }
  };

  const getStatusText = (status: Order['status']) => {
    const statusMap = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    };
    return statusMap[status];
  };

  const getStatusColor = (status: Order['status']) => {
    const colorMap = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      shipped: 'bg-purple-100 text-purple-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colorMap[status];
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des commandes...</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestion des Commandes</h1>

        {/* Filtres et recherche */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher une commande..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="confirmed">Confirmée</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
              </select>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {orders.filter(o => o.status === 'pending').length}
            </div>
            <div className="text-sm text-yellow-600">En attente</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-700">
              {orders.filter(o => o.status === 'confirmed').length}
            </div>
            <div className="text-sm text-blue-600">Confirmées</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-purple-700">
              {orders.filter(o => o.status === 'shipped').length}
            </div>
            <div className="text-sm text-purple-600">Expédiées</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-700">
              {orders.filter(o => o.status === 'delivered').length}
            </div>
            <div className="text-sm text-green-600">Livrées</div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Montant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map(order => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                      <div className="text-sm text-gray-500">{order.items?.length || 0} article(s)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{order.user_name || 'Non spécifié'}</div>
                      <div className="text-sm text-gray-500">{order.user_email || 'Non spécifié'}</div>
                      <div className="text-sm text-gray-500">{order.user_phone || 'Non spécifié'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => console.log('Voir détails:', order.id)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Voir détails"
                      >
                        <Eye className="w-5 h-5" />
                      </button>

                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'confirmed')}
                            className="text-green-600 hover:text-green-900"
                            title="Confirmer la commande"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order.id, 'cancelled')}
                            className="text-red-600 hover:text-red-900"
                            title="Annuler la commande"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}

                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="text-purple-600 hover:text-purple-900"
                          title="Marquer comme expédiée"
                        >
                          <Truck className="w-5 h-5" />
                        </button>
                      )}

                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="text-green-600 hover:text-green-900"
                          title="Marquer comme livrée"
                        >
                          <Package className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucune commande trouvée</p>
            </div>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}