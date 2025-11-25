import MainLayout from "../../Layouts/MainLayout";
import { useState, useEffect } from "react";
import { Upload, Plus, X, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import apiService from "../../services/api";

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  prescription_required: boolean;
  stock_quantity: string;
  image_url: string;
}

interface Category {
  id: number;
  name: string;
}

export default function AddProduct() {
  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    description: "",
    price: "",
    category_id: "",
    prescription_required: false,
    stock_quantity: "",
    image_url: ""
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const navigate = useNavigate();

  // Vérification du rôle admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    if (!token || !userStr) {
      alert("❌ Vous devez être connecté");
      navigate("/login");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        alert("❌ Accès réservé aux administrateurs");
        navigate("/");
        return;
      }
      setIsAdmin(true);
      loadCategories();
    } catch {
      navigate("/login");
    }
  }, [navigate]);

  const loadCategories = async () => {
    setCategories([
      { id: 1, name: "Médicaments" },
      { id: 2, name: "Matériel Médical" },
      { id: 3, name: "Consommables" },
      { id: 4, name: "Équipement" }
    ]);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner une image valide");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("L'image ne doit pas dépasser 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData((prev) => ({ ...prev, image_url: e.target?.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, image_url: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation simple
    if (!formData.name.trim()) return setError("Nom requis");
    if (!formData.description.trim()) return setError("Description requise");
    if (!formData.price || parseFloat(formData.price) <= 0) return setError("Prix > 0 requis");
    if (!formData.category_id) return setError("Catégorie requise");
    if (!formData.stock_quantity || parseInt(formData.stock_quantity) < 0) return setError("Stock requis");

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("description", formData.description.trim());
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock_quantity", formData.stock_quantity);
      formDataToSend.append("category_id", formData.category_id);
      formDataToSend.append("prescription_required", String(formData.prescription_required));

      // 🔥 CORRECTION : Ajouter le fichier correctement
      if (selectedFile) {
        formDataToSend.append("image", selectedFile); // "image" doit correspondre à multer
        console.log("📸 Fichier ajouté au FormData:", selectedFile.name);
      }

      // DEBUG: Afficher le contenu du FormData
      console.log("📦 Envoi FormData produit:");
      for (let [key, value] of formDataToSend.entries()) {
        if (key === "image") {
          console.log(`   ${key}:`, (value as File).name);
        } else {
          console.log(`   ${key}:`, value);
        }
      }

      const response = await apiService.createProduct(formDataToSend);

      if (response.success) {
        setSuccess("✅ Produit ajouté !");
        // Réinitialiser le formulaire
        setFormData({
          name: "",
          description: "",
          price: "",
          category_id: "",
          prescription_required: false,
          stock_quantity: "",
          image_url: ""
        });
        setSelectedFile(null);

        setTimeout(() => navigate("/admin/products"), 2000);
      } else {
        setError("❌ " + (response.message || "Erreur lors de l'ajout"));
      }
    } catch (err: any) {
      console.error("💥 Erreur catch:", err);
      setError("❌ " + (err.message || "Erreur serveur"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAdmin) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Vérification des permissions...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/admin/products"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour aux produits
          </Link>
        </div>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Ajouter un Produit</h1>
          <p className="text-gray-600 mb-8">Remplissez les informations du nouveau produit.</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* 🔥 CORRECTION : ajout de encType */}
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="bg-white p-6 rounded-lg shadow-md space-y-6">
            {/* Upload image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image du produit</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                {formData.image_url ? (
                  <div className="relative inline-block">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg shadow-md"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-blue-600 hover:text-blue-500 font-medium">Choisir une image</span>
                      {/* 🔥 CORRECTION : name="image" pour multer */}
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        name="image"
                      />
                    </label>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG, JPEG jusqu'à 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: Doliprane 500mg"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Ex: Boite de 10 comprimés..."
              />
            </div>

            {/* Prix et stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Prix (FCFA) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="1500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData((prev) => ({ ...prev, stock_quantity: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="100"
                />
              </div>
            </div>

            {/* Catégorie et ordonnance */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select
                  required
                  value={formData.category_id}
                  onChange={(e) => setFormData((prev) => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.prescription_required}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, prescription_required: e.target.checked }))
                    }
                    className="mr-2 w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="text-sm font-medium text-gray-700">Ordonnance requise</span>
                </label>
              </div>
            </div>

            {/* Bouton */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Ajout en cours...
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  Ajouter le produit
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}