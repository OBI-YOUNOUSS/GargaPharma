import MainLayout from "../Layouts/MainLayout";
import { useState, useEffect } from "react";
import { Search, Filter, ShoppingCart, Check, AlertCircle } from "lucide-react";
import { useCart } from "../contexts/CartContext";
import { Link, useNavigate } from "react-router-dom";
import apiService from "../services/api";
import defaultImage from "../assets/Photo1.jpeg";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  prescriptionRequired?: boolean;
}

interface ApiProduct {
  id: number | string;
  name: string;
  category_name?: string;
  price?: number | string;
  description?: string;
  image_url?: string;
  image?: string;
  prescription_required?: boolean;
}

export default function Products() {
  const { dispatch } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [addedProduct, setAddedProduct] = useState<string | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  const categories = [
    "all",
    "Médicaments",
    "Matériel Médical",
    "Consommables",
    "Équipement"
  ];

  const isUserLoggedIn = () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  };

  // 🔥 CORRECTION : Fonction buildImageUrl simplifiée
  const buildImageUrl = (imagePath: string | undefined | null): string => {
    if (!imagePath) return defaultImage;
    
    // Si déjà une URL complète
    if (imagePath.startsWith('http')) return imagePath;
    
    // Si chemin relatif
    if (imagePath.startsWith('/')) {
      return `http://localhost:5000${imagePath}`;
    }
    
    // Si nom de fichier seul
    return `http://localhost:5000/uploads/${imagePath}`;
  };

  useEffect(() => {
  const loadProductsFromAPI = async () => {
    try {
      setLoading(true);
      console.log("🔄 === DÉBUT CHARGEMENT PRODUITS ===");

      const result = await apiService.getProducts();
      
      // 🔥 AJOUTEZ CES 2 LIGNES CRUCIALES :
      console.log("📨 RÉPONSE API COMPLÈTE:", result);
      console.log("🔍 Premier produit:", result.data?.products?.[0] || result.data?.[0]);
      
      if (result.success && result.data) {
        const productsArray = result.data.products || result.data;
        
        if (Array.isArray(productsArray) && productsArray.length > 0) {
          // 🔥 AJOUTEZ CE DEBUG POUR CHAQUE PRODUIT :
          productsArray.forEach((product, index) => {
            console.log(`📦 Produit ${index + 1}:`, {
              name: product.name,
              image: product.image,
              image_url: product.image_url,
              id: product.id
            });
          });
          
          const apiProducts: Product[] = productsArray.map((product: ApiProduct) => {
            const imageFromApi = product.image || product.image_url;
            const finalImageUrl = buildImageUrl(imageFromApi);
            
            // 🔥 AJOUTEZ CE LOG :
            console.log(`🎯 ${product.name} -> ${finalImageUrl}`);
            
            return {
              id: Number(product.id),
              name: product.name,
              category: product.category_name || "Médicaments",
              price: Number(product.price) || 0,
              description: product.description || "Description non disponible",
              image: finalImageUrl,
              prescriptionRequired: product.prescription_required || false
            };
          });

          setProducts(apiProducts);
        }
      }
    } catch (error) {
      console.error("💥 Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  loadProductsFromAPI();
}, []);

  const handleImageError = (productId: number, imageUrl: string) => {
    console.log(`❌ Erreur image produit ${productId}: ${imageUrl}`);
    setImageErrors(prev => new Set(prev).add(productId));
  };

  const getProductImage = (product: Product): string => {
    if (imageErrors.has(product.id)) {
      return defaultImage;
    }
    return product.image;
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    if (!isUserLoggedIn()) {
      alert('🔒 Vous devez être connecté pour ajouter des produits au panier');
      navigate('/login');
      return;
    }

    if (product.prescriptionRequired) {
      setSelectedProduct(product);
      setShowPrescriptionModal(true);
      return;
    }

    dispatch({
      type: 'ADD_ITEM',
      payload: {
        id: product.id,
        name: product.name,
        price: product.price,
        image: getProductImage(product),
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
      dispatch({
        type: 'ADD_ITEM',
        payload: {
          id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          image: getProductImage(selectedProduct),
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

  // 🔥 CORRECTION : Debug des URLs d'images
  useEffect(() => {
    if (products.length > 0) {
      console.log("🎯 DIAGNOSTIC FINAL - URLs d'images:");
      products.forEach(product => {
        console.log(`📋 ${product.name}:`, product.image);
        
        // Tester chaque image
        fetch(product.image, { method: 'HEAD' })
          .then(response => {
            console.log(`🔍 ${product.name}: ${response.status} ${response.ok ? '✅ OK' : '❌ ERROR'}`);
          })
          .catch(error => {
            console.error(`🔍 ${product.name}: ❌ ${error.message}`);
          });
      });
    }
  }, [products]);

  if (loading) {
    return (
      <MainLayout>
        <section className="bg-[#2563EB] text-white py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">Nos Produits</h1>
          </div>
        </section>
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des produits...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-[#2563EB] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Nos Produits</h1>
          <p className="text-xl text-center text-purple-100 max-w-3xl mx-auto">
            Découvrez notre large gamme de produits médicaux de qualité
          </p>
        </div>
      </section>

      {/* Filtres et Recherche */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative w-full lg:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full lg:w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-4 w-full lg:w-auto">
              <Filter className="w-5 h-5 text-gray-600" />
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-auto"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === "all" ? "Toutes les catégories" : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Notification de confirmation */}
      {addedProduct && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 animate-fade-in">
          <Check className="w-5 h-5" />
          <span>
            <strong>{addedProduct}</strong> ajouté au panier !
          </span>
        </div>
      )}

      {/* Liste des Produits */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 overflow-hidden group relative flex flex-col">
                <div className="relative overflow-hidden">
                  <div className="relative h-48 bg-gray-100 flex items-center justify-center rounded-t-lg overflow-hidden">
                    <img
                      src={product.image} // VRAIE image du produit
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={() => handleImageError(product.id, product.image)}
                      onLoad={() => console.log(`✅ Image chargée pour ${product.name}: ${product.image}`)}
                    />
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.prescriptionRequired
                        ? 'bg-orange-100 text-orange-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}>
                      {product.category}
                    </span>
                    {product.prescriptionRequired && (
                      <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Ordonnance
                      </span>
                    )}
                  </div>

                  {/* Bouton Ajouter au panier */}
                  <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 md:flex hidden">
                    <button
                      onClick={() => handleAddToCart(product)}
                      className={`px-6 py-3 text-white rounded-lg hover:opacity-90 transition duration-300 flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 ${product.prescriptionRequired ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
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

                    {/* Bouton Détails */}
                    <Link
                      to={`/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center gap-2"
                    >
                      Détails
                    </Link>
                  </div>

                  {/* Bouton mobile */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`text-white p-3 rounded-lg hover:opacity-90 transition-colors flex md:hidden items-center justify-center gap-2 mt-3 w-full ${product.prescriptionRequired ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au panier
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucun produit trouvé pour votre recherche.</p>
            </div>
          )}
        </div>
      </section>

      {/* Modal prescription */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-500" />
              <h3 className="text-xl font-bold text-gray-900">Produit sur ordonnance</h3>
            </div>

            <p className="text-gray-600 mb-6">
              <strong>{selectedProduct?.name}</strong> nécessite une ordonnance médicale.
            </p>

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

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
      `}</style>
    </MainLayout>
  );
}