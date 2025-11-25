import { ShoppingCart, Rocket, Check, Eye, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useState } from 'react';
import ImageWithFallback from './ImageWithFallback';

// Import des images
import im1 from '../assets/Photo1.jpeg';
import im2 from '../assets/Amoxilluin.jpeg';
import im3 from '../assets/DICLOFENAC-AMPOLLA-30.jpg';
import im4 from '../assets/Maalox.jpeg';
import im5 from '../assets/Audmatin.webp';
import im6 from '../assets/ARTES-120.png';
import im7 from '../assets/Paracetamol-500mg-1.webp';
import im8 from '../assets/BComplexeinject.png';
import im9 from '../assets/Ibruporfen400mg.jpg';
import im10 from '../assets/VitaminCbte.jpg';
import im11 from '../assets/Tramadool.jpg';
import im12 from '../assets/Naproxen550mg.png';
import im13 from '../assets/arteziane.jpg';

interface Product {
  image: string;
  name: string;
  price: number;
  description: string;
  category: string;
  prescriptionRequired?: boolean;
}

const products: Product[] = [
  {
    image: im1,
    name: 'Doliprane 500mg',
    price: 1500,
    description: 'Boite de 10 comprimés',
    category: 'Antidouleur',
    prescriptionRequired: false
  },
  {
    image: im2,
    name: 'Amoxicilline 500mg',
    price: 4000,
    description: 'Boite de 10 plaquettes',
    category: 'Antibiotique',
    prescriptionRequired: true
  },
  {
    image: im3,
    name: 'Diclofenac Injection 75mg',
    price: 1000,
    description: 'Boite de 6 ampoules',
    category: 'Anti-inflammatoire',
    prescriptionRequired: true
  },
  {
    image: im6,
    name: 'Artesunate 120mg',
    price: 750,
    description: 'Boite complète',
    category: 'Antipaludéen',
    prescriptionRequired: false
  },
  {
    image: im9,
    name: 'Ibuprofen 400mg',
    price: 1000,
    description: 'Boite de 10 capsules',
    category: 'Antidouleur',
    prescriptionRequired: false
  },
  {
    image: im13,
    name: 'Arteziane 40 mg',
    price: 4000,
    description: 'Boite de 12 comprimés',
    category: 'AntiPalu',
    prescriptionRequired: true
  },
  {
    image: im12,
    name: 'Naproxène',
    price: 4000,
    description: 'Boite de 8 Compprimés',
    category: 'Anti-inflammatoire',
    prescriptionRequired: true
  },
  {
    image: im3,
    name: 'Diclofenac Injection 75mg',
    price: 1000,
    description: 'Boite de 6 Apoules',
    category: 'Anti-douleur',
    prescriptionRequired: false
  },
  {
    image: im5,
    name: 'Augmentin 500mg',
    price: 1500,
    description: 'Boite de 10 comprimés',
    category: 'Antibiotique',
    prescriptionRequired: true
  },
  {
    image: im6,
    name: 'Artesunate 120mg',
    price: 750,
    description: 'Boite complète',
    category: 'Antipaludéen',
    prescriptionRequired: true
  },
  {
    image: im2,
    name: 'Amoxicilline 500mg',
    price: 4000,
    description: 'Boite de 10 plaquettes',
    category: 'Antibiotique',
    prescriptionRequired: false
  }, {
    image: im8,
    name: 'Vitamine B-Complexe 10ml',
    price: 600,
    description: 'Boite de 10 Apoules',
    category: 'Vitamine',
    prescriptionRequired: false
  },
  {
    image: im11,
    name: 'Tramol 325mg',
    price: 65000,
    description: 'Boite de 20 comprimés',
    category: 'Antibiotique',
    prescriptionRequired: true
  },
  {
    image: im4,
    name: 'Maalox 20mg',
    price: 2500,
    description: 'Boite de 10 comprimés',
    category: 'Anti-acide',
    prescriptionRequired: true
  },
  {
    image: im7,
    name: 'Paracetamol 500mg',
    price: 1200,
    description: 'Boite de 10 comprimés',
    category: 'Antidouleur',
    prescriptionRequired: false
  },
  {
    image: im10,
    name: 'Vitamine C 1000mg',
    price: 2000,
    description: 'Boite de 30 comprmés',
    category: 'Vitamine',
    prescriptionRequired: false
  },
];

export default function Features() {
  const { dispatch } = useCart();
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  // Filtrer les produits qui nécessitent une ordonnance
  const prescriptionProducts = products.filter(product => product.prescriptionRequired);
  const nonPrescriptionProducts = products.filter(product => !product.prescriptionRequired);

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  const handleAddToCart = (product: Product) => {
    // Vérifier si l'utilisateur est connecté
    if (!isUserLoggedIn()) {
      alert('🔒 Vous devez être connecté pour ajouter des produits au panier');
      navigate('/login');
      return;
    }

    // Vérifier si le produit nécessite une ordonnance
    if (product.prescriptionRequired) {
      setSelectedProduct(product);
      setShowPrescriptionModal(true);
      return;
    }

    // Convertir le prix string en number
    const price = product.price;

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: Date.now() + Math.random(),
        name: product.name,
        price: price,
        image: product.image,
        description: product.description,
        category: product.category,
        prescriptionRequired: product.prescriptionRequired,
        quantity: 1
      }
    });

    setAddedProduct(product.name);
    setTimeout(() => {
      setAddedProduct(null);
    }, 2000);
  };

  const handleConfirmPrescription = () => {
    if (selectedProduct) {
      const price = selectedProduct.price;

      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: Date.now() + Math.random(),
          name: selectedProduct.name,
          price: price,
          image: selectedProduct.image,
          description: selectedProduct.description,
          category: selectedProduct.category,
          prescriptionRequired: selectedProduct.prescriptionRequired,
          quantity: 1
        }
      });

      setAddedProduct(selectedProduct.name);
      setShowPrescriptionModal(false);
      setSelectedProduct(null);

      setTimeout(() => {
        setAddedProduct(null);
      }, 2000);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  return (
    <>
      {/* Section Produits sans ordonnance */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Produits Phares</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection de médicaments essentiels et produits de santé de qualité
            </p>
          </div>

          {/* Notification de confirmation */}
          {addedProduct && (
            <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
              <Check className="w-5 h-5" />
              <span>
                <strong>{addedProduct}</strong> ajouté au panier !
              </span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nonPrescriptionProducts.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                onAddToCart={handleAddToCart}
                formatPrice={formatPrice}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Voir tous les produits
              <Rocket className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Section Produits sur Ordonnance */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <h2 className="text-4xl font-bold text-gray-900">Produits sur Ordonnance</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Médicaments nécessitant une prescription médicale. Une vérification sera effectuée lors de la livraison.
            </p>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-orange-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-800 mb-2">Important</h3>
                <p className="text-orange-700">
                  Ces médicaments nécessitent une ordonnance médicale valide. Veuillez vous assurer
                  d'avoir votre prescription disponible lors de la livraison. Notre équipe procédera
                  à une vérification avant de remettre votre commande.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {prescriptionProducts.map((product, index) => (
              <ProductCard
                key={index}
                product={product}
                onAddToCart={handleAddToCart}
                formatPrice={formatPrice}
                isPrescription={true}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Modal de confirmation pour les produits sur ordonnance */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 max-w-md w-full bg-[#2563EB] bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-900">Produit sur ordonnance</h3>
            </div>

            <p className="text-gray-600 mb-6">
              <strong>{selectedProduct?.name}</strong> nécessite une ordonnance médicale.
              Veuillez confirmer que vous disposez d'une prescription valide pour ce médicament.
            </p>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
              <p className="text-orange-700 text-sm">
                💡 <strong>Rappel :</strong> Notre livreur vérifiera votre ordonnance lors de la livraison.
                Sans ordonnance valide, la commande ne pourra pas être remise.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPrescriptionModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmPrescription}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4" />
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ajout du style pour l'animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

// Composant ProductCard réutilisable
interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  formatPrice: (price: number) => string;
  isPrescription?: boolean;
}

function ProductCard({ product, onAddToCart, formatPrice, isPrescription = false }: ProductCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group relative flex flex-col">
      <div className="relative overflow-hidden">
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          <ImageWithFallback
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallback={
              <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                <div className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-2xl">💊</span>
                </div>
              </div>
            }
          />
        </div>

        {/* Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${isPrescription
              ? 'bg-orange-100 text-orange-800'
              : 'bg-blue-100 text-blue-800'
            }`}>
            {product.category}
          </span>
          {isPrescription && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Ordonnance
            </span>
          )}
        </div>

        {/* Bouton Ajouter au panier - visible au survol sur desktop, toujours visible sur mobile */}
        <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 md:flex hidden">
          <button
            onClick={() => onAddToCart(product)}
            className={`px-6 py-3 text-white rounded-lg hover:opacity-90 transition duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 ${isPrescription ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
              }`}
          >
            <ShoppingCart className="w-5 h-5" />
            Ajouter au panier
          </button>
        </div>
      </div>

      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 flex-grow">{product.description}</p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>

          {/* Bouton Détails - toujours visible */}
          <Link
            to={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Détails
          </Link>
        </div>

        {/* Bouton Ajouter au panier - TOUJOURS visible sur mobile */}
        <button
          onClick={() => onAddToCart(product)}
          className={`text-white p-3 rounded-lg hover:opacity-90 transition-colors flex md:hidden items-center justify-center gap-2 mt-3 w-full ${isPrescription ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Ajouter au panier
        </button>
      </div>
    </div>
  );
}