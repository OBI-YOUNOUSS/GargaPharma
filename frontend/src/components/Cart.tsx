
import { X, Plus, Minus, ShoppingCart, LogIn } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  name: string;
  image?: string;
  price: number;
  quantity: number;
}

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  const token = localStorage.getItem('token');
  if (!token) {
    alert('Veuillez vous connecter');
    navigate('/login');
    return;
  }

  const updateQuantity = (item: CartItem, newQuantity: number) => {
    if (newQuantity === 0) {
      dispatch({ type: 'REMOVE_ITEM', payload: item.id });
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id: item.id, quantity: newQuantity } });
    }
  };

  const removeItem = (id: number) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const handleCheckout = () => {
    console.log('🛒 Tentative de commande...');
    console.log(' - Utilisateur connecté:', isUserLoggedIn());
    console.log(' - Nombre d\'articles:', state.items.length);

    if (!isUserLoggedIn()) {
      alert('🔒 Vous devez être connecté pour passer commande');
      onClose();
      navigate('/login');
      return;
    }

    if (state.items.length === 0) {
      alert('🛒 Votre panier est vide');
      return;
    }

    console.log('✅ Redirection vers checkout...');
    onClose();
    navigate('/checkout');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Panier */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-bold">Panier ({state.itemCount})</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Liste des articles */}
        <div className="flex-1 overflow-y-auto p-4">
          {state.items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">Votre panier est vide</p>
              <p className="text-gray-400 mt-2">Ajoutez des produits pour commencer</p>
            </div>
          ) : (
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.parentElement!.innerHTML = `
                        <div class="w-16 h-16 bg-gradient-to-br from-blue-50 to-green-50 rounded flex items-center justify-center">
                          <span class="text-2xl">💊</span>
                        </div>
                      `;
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-sm">{item.name}</h3>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-blue-600 font-bold text-sm mb-2">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQuantity(item, item.quantity - 1)}
                        className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="font-semibold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item, item.quantity + 1)}
                        className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span>{formatPrice(state.total)}</span>
            </div>

            {/* Message si utilisateur non connecté */}
            {!isUserLoggedIn() && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800 flex items-center gap-2">
                <LogIn className="w-4 h-4" />
                <span>Connectez-vous pour commander</span>
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={handleCheckout}
                className={`w-full text-center py-3 rounded-lg transition-colors font-semibold ${isUserLoggedIn()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                disabled={!isUserLoggedIn()}
              >
                {isUserLoggedIn() ? 'Commander maintenant' : 'Se connecter pour commander'}
              </button>

              <button
                onClick={() => {
                  dispatch({ type: 'CLEAR_CART' });
                  alert('Panier vidé avec succès');
                }}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Vider le panier
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}