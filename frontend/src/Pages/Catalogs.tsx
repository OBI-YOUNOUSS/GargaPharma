import MainLayout from "../Layouts/MainLayout";
import { Download, FileText, Calendar } from "lucide-react";
import { useState } from "react";

interface Catalog {
  id: number;
  title: string;
  description: string;
  fileSize: string;
  lastUpdate: string;
  category: string;
  requiresAuth: boolean;
}

export default function Catalogs() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: ""
  });

  const catalogs: Catalog[] = [
    {
      id: 1,
      title: "Catalogue Médicaments 2024",
      description: "Notre gamme complète de médicaments disponibles en gros et détail",
      fileSize: "2.4 MB",
      lastUpdate: "15 Jan 2024",
      category: "Médicaments",
      requiresAuth: true
    },
    {
      id: 2,
      title: "Catalogue Matériel Médical",
      description: "Équipements et instruments médicaux pour professionnels",
      fileSize: "3.1 MB",
      lastUpdate: "10 Jan 2024",
      category: "Matériel",
      requiresAuth: true
    },
    {
      id: 3,
      title: "Catalogue Consommables",
      description: "Produits consommables et dispositifs médicaux",
      fileSize: "1.8 MB",
      lastUpdate: "05 Jan 2024",
      category: "Consommables",
      requiresAuth: true
    },
    {
      id: 4,
      title: "Brochure Grand Public",
      description: "Nos services et produits pour les particuliers",
      fileSize: "1.2 MB",
      lastUpdate: "20 Déc 2023",
      category: "Général",
      requiresAuth: false
    }
  ];

  const handleDownload = (catalog: Catalog) => {
    if (catalog.requiresAuth) {
      setShowForm(true);
    } else {
      // Logique de téléchargement direct
      alert(`Téléchargement de ${catalog.title}`);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du formulaire et téléchargement
    alert(`Formulaire soumis pour ${formData.name}`);
    setShowForm(false);
    setFormData({ name: "", company: "", email: "", phone: "" });
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-orange-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Nos Catalogues</h1>
          <p className="text-xl text-center text-orange-100 max-w-3xl mx-auto">
            Accédez à nos catalogues professionnels pour découvrir nos produits et services
          </p>
        </div>
      </section>

      {/* Section Catalogues */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {catalogs.map(catalog => (
              <div key={catalog.id} className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <FileText className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <h3 className="text-xl font-bold">{catalog.title}</h3>
                      <span className="text-sm text-blue-600 font-semibold">{catalog.category}</span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{catalog.description}</p>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Mis à jour: {catalog.lastUpdate}
                  </div>
                  <span>{catalog.fileSize}</span>
                </div>

                <button
                  onClick={() => handleDownload(catalog)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                  <Download className="w-5 h-5" />
                  {catalog.requiresAuth ? "Télécharger (Professionnels)" : "Télécharger"}
                </button>

                {catalog.requiresAuth && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Réservé aux professionnels de santé
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal Formulaire */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Accès Professionnel</h3>
            <p className="text-gray-600 mb-6">
              Veuillez remplir ce formulaire pour accéder à nos catalogues professionnels.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Entreprise/Établissement *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.company}
                  onChange={(e) => setFormData({...formData, company: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email professionnel *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Télécharger
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Information Professionnels */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Espace Professionnels</h2>
          <p className="text-xl mb-8 text-gray-700 max-w-2xl mx-auto">
            En tant que professionnel de santé, bénéficiez d'un accès privilégié à nos catalogues 
            complets, des prix spéciaux et un service dédié.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Devenir Partenaire
            </button>
            <button className="px-8 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors font-semibold">
              Nous Contacter
            </button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}