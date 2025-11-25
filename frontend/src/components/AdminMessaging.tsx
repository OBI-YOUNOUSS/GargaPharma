import { useState, useEffect, useRef } from 'react';
import { Send, Search, Plus, MessageCircle, Users } from 'lucide-react';
import apiService from '../services/api';

interface Conversation {
  id: number;
  subject: string;
  user_name: string;
  user_email: string;
  message_count: number;
  last_message_at: string;
  status: string;
}

interface Message {
  id: number;
  content: string;
  sender_id: number;
  sender_name: string;
  sender_role: string;
  created_at: string;
  is_read: boolean;
}

export default function UserMessaging() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [newConversationSubject, setNewConversationSubject] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserConversations();
      if (response.success) {
        setConversations(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: number) => {
    try {
      setIsLoading(true);
      const response = await apiService.getConversation(conversationId);
      if (response.success) {
        setSelectedConversation(response.data.conversation);
        setMessages(response.data.messages);
        
        // Marquer les messages comme lus
        const unreadMessages = response.data.messages
          .filter((msg: Message) => !msg.is_read && msg.sender_role === 'admin')
          .map((msg: Message) => msg.id);
        
        if (unreadMessages.length > 0) {
          await apiService.markMessagesAsRead(unreadMessages);
        }
      }
    } catch (error) {
      console.error('Erreur chargement messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      setIsLoading(true);
      const response = await apiService.sendMessage(selectedConversation.id, {
        content: newMessage,
        message_type: 'text'
      });

      if (response.success) {
        setMessages(prev => [...prev, response.data]);
        setNewMessage('');
        loadConversations(); // Rafraîchir la liste des conversations
      }
    } catch (error) {
      console.error('Erreur envoi message:', error);
      alert('Erreur lors de l\'envoi du message');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    if (!newConversationSubject.trim()) return;

    try {
      setIsLoading(true);
      const response = await apiService.createConversation({
        subject: newConversationSubject
      });

      if (response.success) {
        setShowNewConversation(false);
        setNewConversationSubject('');
        await loadConversations();
        await loadMessages(response.data.id);
      }
    } catch (error) {
      console.error('Erreur création conversation:', error);
      alert('Erreur lors de la création de la conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hier';
    } else if (diffDays > 1) {
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit'
      });
    } else {
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'resolved':
        return 'bg-blue-100 text-blue-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'open':
        return 'Ouverte';
      case 'resolved':
        return 'Résolue';
      case 'closed':
        return 'Fermée';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Sidebar des conversations */}
            <div className="w-1/3 border-r border-gray-200 bg-gray-50">
              <div className="p-4 border-b border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Messages</h2>
                  <button
                    onClick={() => setShowNewConversation(true)}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    title="Nouvelle conversation"
                    disabled={isLoading}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="overflow-y-auto h-[500px]">
                {isLoading && conversations.length === 0 ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <>
                    {conversations.map(conversation => (
                      <div
                        key={conversation.id}
                        onClick={() => loadMessages(conversation.id)}
                        className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-white transition-colors ${
                          selectedConversation?.id === conversation.id ? 'bg-blue-50 border-blue-200' : ''
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-gray-900 truncate flex-1 mr-2">
                            {conversation.subject}
                          </h3>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatDate(conversation.last_message_at)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            {conversation.message_count} message(s)
                          </span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(conversation.status)}`}>
                            {getStatusText(conversation.status)}
                          </span>
                        </div>
                      </div>
                    ))}

                    {conversations.length === 0 && (
                      <div className="text-center py-12">
                        <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">Aucune conversation</p>
                        <button
                          onClick={() => setShowNewConversation(true)}
                          className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Commencer une conversation
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Zone de messages */}
            <div className="flex-1 flex flex-col">
              {selectedConversation ? (
                <>
                  {/* En-tête de conversation */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900">{selectedConversation.subject}</h3>
                        <p className="text-sm text-gray-600">
                          Conversation avec l'administrateur
                        </p>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedConversation.status)}`}>
                        {getStatusText(selectedConversation.status)}
                      </span>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                    {isLoading && messages.length === 0 ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <>
                        {messages.map(message => (
                          <div
                            key={message.id}
                            className={`flex ${message.sender_role === 'admin' ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                                message.sender_role === 'admin'
                                  ? 'bg-white border border-gray-200 text-gray-900'
                                  : 'bg-blue-600 text-white'
                              }`}
                            >
                              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                              <p
                                className={`text-xs mt-1 ${
                                  message.sender_role === 'admin' ? 'text-gray-500' : 'text-blue-100'
                                }`}
                              >
                                {formatDate(message.created_at)}
                                {!message.is_read && message.sender_role !== 'admin' && (
                                  <span className="ml-2">✓</span>
                                )}
                              </p>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  {/* Input d'envoi */}
                  <div className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && sendMessage()}
                        placeholder="Tapez votre message..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={isLoading}
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || isLoading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                      >
                        {isLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        Envoyer
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Sélectionnez une conversation
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Ou commencez une nouvelle discussion avec l'administrateur
                    </p>
                    <button
                      onClick={() => setShowNewConversation(true)}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Nouvelle conversation
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal nouvelle conversation */}
      {showNewConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Nouvelle conversation</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sujet de la conversation *
                </label>
                <input
                  type="text"
                  value={newConversationSubject}
                  onChange={(e) => setNewConversationSubject(e.target.value)}
                  placeholder="Ex: Question sur ma commande #12345"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && createNewConversation()}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Décrivez brièvement le sujet de votre message
                </p>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowNewConversation(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isLoading}
                >
                  Annuler
                </button>
                <button
                  onClick={createNewConversation}
                  disabled={!newConversationSubject.trim() || isLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                >
                  {isLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  )}
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}