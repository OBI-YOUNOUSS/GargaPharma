import { useState, useEffect } from 'react';
import { Search, Filter, Eye, Mail, CheckCircle, User, Building, Trash2 } from 'lucide-react';
import SidebarLayout from "../../Layouts/SidebarLayout";
import ApiService from '../../services/api';

interface ContactMessage {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  subject: string;
  message: string;
  message_type: 'general' | 'quote';
  status: 'new' | 'read' | 'replied';
  is_read: boolean;
  created_at: string;
}

export default function MessageManagement() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ApiService.getContactMessages();
      
      if (response.success) {
        setMessages(response.data || response);
      } else {
        throw new Error(response.message || 'Erreur lors du chargement des messages');
      }
      
    } catch (error) {
      console.error('Erreur chargement messages:', error);
      setError('Impossible de charger les messages. Vérifiez que le serveur est démarré.');
      
      // Fallback sur les données mockées en cas d'erreur
      const mockMessages: ContactMessage[] = [
        {
          id: 1,
          name: 'Dr. Martin Dubois',
          email: 'martin.dubois@clinique.td',
          company: 'Clinique La Providence',
          phone: '+235 70 12 34 56',
          subject: 'Demande de devis pour matériel médical',
          message: 'Bonjour, je souhaiterais recevoir un devis pour du matériel médical : stéthoscopes, tensiomètres et gants médicaux. Pouvez-vous me faire parvenir votre catalogue et vos tarifs pour professionnels ?',
          message_type: 'quote',
          status: 'new',
          is_read: false,
          created_at: '2024-01-15T14:30:00Z'
        },
        {
          id: 2,
          name: 'Sarah Koné',
          email: 'sarah.kone@email.td',
          phone: '+235 66 77 88 99',
          subject: 'Question sur les délais de livraison',
          message: 'Bonjour, j\'ai commandé des médicaments il y a 3 jours et je n\'ai pas encore reçu de confirmation de livraison. Pouvez-vous me renseigner sur les délais habituels ?',
          message_type: 'general',
          status: 'read',
          is_read: true,
          created_at: '2024-01-14T09:15:00Z'
        }
      ];
      setMessages(mockMessages);
    } finally {
      setLoading(false);
    }
  };

  const updateMessageStatus = async (messageId: number, newStatus: ContactMessage['status']) => {
    try {
      setError(null);
      
      // 🔥 CORRECTION : Utiliser la bonne route API
      const response = await ApiService.request(`/contact/${messageId}/status`, {
        method: 'PATCH',
        body: { status: newStatus }
      });
      
      if (response.success) {
        // Mettre à jour l'état local
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, status: newStatus } : msg
        ));
        
        // Mettre à jour le message sélectionné s'il est ouvert
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage({ ...selectedMessage, status: newStatus });
        }
        
        const statusText = {
          new: 'non lu',
          read: 'lu',
          replied: 'répondu'
        }[newStatus];
        
        alert(`Message marqué comme ${statusText}`);
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      setError('Erreur lors de la mise à jour du statut');
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const markAsRead = async (messageId: number) => {
    try {
      setError(null);
      
      // 🔥 CORRECTION : Utiliser la route markAsRead existante
      const response = await ApiService.request(`/contact/${messageId}/read`, {
        method: 'PATCH'
      });
      
      if (response.success) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId ? { ...msg, is_read: true, status: 'read' } : msg
        ));
        
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage({ ...selectedMessage, is_read: true, status: 'read' });
        }
        
        alert('Message marqué comme lu');
      }
    } catch (error) {
      console.error('Erreur marquage comme lu:', error);
      // Fallback : mise à jour locale
      setMessages(prev => prev.map(msg => 
        msg.id === messageId ? { ...msg, is_read: true, status: 'read' } : msg
      ));
      alert('Mode démo: Message marqué comme lu localement');
    }
  };

  const deleteMessage = async (messageId: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      return;
    }
    
    try {
      setError(null);
      
      // 🔥 CORRECTION : Utiliser la bonne route API
      const response = await ApiService.request(`/contact/${messageId}`, {
        method: 'DELETE'
      });
      
      if (response.success) {
        // Mettre à jour l'état local
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
        
        // Fermer le modal si le message supprimé était sélectionné
        if (selectedMessage && selectedMessage.id === messageId) {
          setSelectedMessage(null);
        }
        
        alert('Message supprimé avec succès');
      } else {
        throw new Error(response.message || 'Erreur lors de la suppression');
      }
    } catch (error) {
      console.error('Erreur suppression message:', error);
      setError('Erreur lors de la suppression du message');
      alert('Erreur lors de la suppression du message');
    }
  };

  const getStatusText = (status: ContactMessage['status']) => {
    const statusMap = {
      new: 'Non lu',
      read: 'Lu',
      replied: 'Répondu'
    };
    return statusMap[status];
  };

  const getStatusColor = (status: ContactMessage['status']) => {
    const colorMap = {
      new: 'bg-red-100 text-red-800',
      read: 'bg-blue-100 text-blue-800',
      replied: 'bg-green-100 text-green-800'
    };
    return colorMap[status];
  };

  const getTypeText = (type: ContactMessage['message_type']) => {
    return type === 'general' ? 'Général' : 'Devis';
  };

  const getTypeColor = (type: ContactMessage['message_type']) => {
    return type === 'general' 
      ? 'bg-blue-100 text-blue-800' 
      : 'bg-orange-100 text-orange-800';
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

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || message.message_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || message.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  if (loading) {
    return (
      <SidebarLayout>
        <div className="p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">Chargement des messages...</p>
        </div>
      </SidebarLayout>
    );
  }

  return (
    <SidebarLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Messages de Contact</h1>
          <button
            onClick={fetchMessages}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Actualiser
          </button>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-900 hover:text-red-700">
                ×
              </button>
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
                placeholder="Rechercher un message..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="all">Tous les types</option>
                <option value="general">Général</option>
                <option value="quote">Devis</option>
              </select>
            </div>
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="new">Non lu</option>
              <option value="read">Lu</option>
              <option value="replied">Répondu</option>
            </select>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-gray-900">{messages.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-red-700">
              {messages.filter(m => m.status === 'new').length}
            </div>
            <div className="text-sm text-red-600">Non lus</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-blue-700">
              {messages.filter(m => m.status === 'read').length}
            </div>
            <div className="text-sm text-blue-600">Lus</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow text-center">
            <div className="text-2xl font-bold text-green-700">
              {messages.filter(m => m.status === 'replied').length}
            </div>
            <div className="text-sm text-green-600">Répondu</div>
          </div>
        </div>

        {/* Liste des messages */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expéditeur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sujet
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
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
                {filteredMessages.map((message) => (
                  <tr 
                    key={message.id} 
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                      message.status === 'new' ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => setSelectedMessage(message)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {message.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {message.email}
                          </div>
                          {message.company && (
                            <div className="text-sm text-gray-500 flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {message.company}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                        {message.subject}
                      </div>
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {message.message.substring(0, 100)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(message.message_type)}`}>
                        {getTypeText(message.message_type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(message.status)}`}>
                        {getStatusText(message.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(message.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMessage(message);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded transition-colors"
                        title="Voir le message"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      
                      {message.status === 'new' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(message.id);
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded transition-colors"
                          title="Marquer comme lu"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      
                      {message.status !== 'replied' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            updateMessageStatus(message.id, 'replied');
                          }}
                          className="text-purple-600 hover:text-purple-900 p-1 rounded transition-colors"
                          title="Marquer comme répondu"
                        >
                          <Mail className="w-5 h-5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMessage(message.id);
                        }}
                        className="text-red-600 hover:text-red-900 p-1 rounded transition-colors"
                        title="Supprimer le message"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredMessages.length === 0 && (
            <div className="text-center py-12">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Aucun message trouvé</p>
              <p className="text-gray-400 mt-2">
                {searchTerm || typeFilter !== 'all' || statusFilter !== 'all'
                  ? 'Aucun message ne correspond à vos critères' 
                  : 'Aucun message pour le moment'}
              </p>
            </div>
          )}
        </div>

        {/* Modal de détail du message */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMessage.subject}</h2>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(selectedMessage.message_type)}`}>
                        {getTypeText(selectedMessage.message_type)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedMessage.status)}`}>
                        {getStatusText(selectedMessage.status)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Expéditeur</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="font-medium text-gray-900">{selectedMessage.name}</p>
                      <p className="text-gray-600">{selectedMessage.email}</p>
                      {selectedMessage.phone && (
                        <p className="text-gray-600">{selectedMessage.phone}</p>
                      )}
                      {selectedMessage.company && (
                        <p className="text-gray-600">{selectedMessage.company}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Date d'envoi</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900">{formatDate(selectedMessage.created_at)}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Message</h3>
                  <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-gray-900">
                    {selectedMessage.message}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Fermer
                    </button>
                    <button
                      onClick={() => {
                        updateMessageStatus(selectedMessage.id, 'replied');
                        setSelectedMessage(null);
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4" />
                      Marquer comme répondu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}