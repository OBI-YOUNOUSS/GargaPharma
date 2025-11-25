import MainLayout from "../Layouts/MainLayout";
import { useCart, type CartItem } from "../contexts/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../services/api"; // Import du service API

export default function Checkout() {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    phone: '',
    email: '',
    notes: ''
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    console.log('🛒 Début du processus de commande...');

    // Vérifications
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    console.log('🔐 Token présent:', !!token);
    console.log('👤 User data présent:', !!userData);
    
    if (!token || !userData) {
      throw new Error('Utilisateur non connecté');
    }

    const user = JSON.parse(userData);
    console.log('👤 Données utilisateur:', user);

    // Préparer les données SANS user_id
    const orderData = {
      items: state.items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price
      })),
      customer_name: formData.fullName,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: formData.address,
      notes: formData.notes
    };

    console.log('📦 Données envoyées au backend:', orderData);

    // Appel API
    const result = await apiService.createOrder(orderData);
    
    console.log('✅ Réponse backend:', result);

    dispatch({ type: 'CLEAR_CART' });
    navigate('/orders-success');
    
  } catch (error: any) {
    console.error('❌ Erreur complète:', error);
    alert(`❌ Erreur: ${error.message}`);
  } finally {
    setIsSubmitting(false);
  }
};

  // Si le panier est vide, rediriger
  if (state.items.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-8">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8">Ajoutez des produits avant de passer commande.</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir les produits
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser la commande</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulaire de commande */}
          <div className="space-y-6">
            <h2 className="text-xl font-semibold">Informations de livraison</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre nom complet"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Adresse de livraison *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Votre adresse complète"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+235 XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes de livraison (optionnel)
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Instructions spéciales pour la livraison..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Traitement en cours...' : `Confirmer la commande `}
              </button>
            </form>
          </div>
          
          {/* Récapitulatif du panier */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>
            <div className="space-y-3 mb-4">
              {state.items.map((item: CartItem) => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 text-sm ml-2">x {item.quantity}</span>
                  </div>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-4">
              <span>Total:</span>
              <span>{formatPrice(state.total)}</span>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Informations importantes</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Livraison sous 24-48h à Moundou</li>
                <li>• Paiement à la livraison</li>
                <li>• Vérification des ordonnances si nécessaire</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}