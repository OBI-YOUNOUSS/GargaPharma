import MainLayout from "../Layouts/MainLayout";
import { Truck, Users, Clock, Shield, X } from "lucide-react";
import { useState } from "react";


export default function Services() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const services = [
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Vente en Gros",
      description: "Solutions complètes pour les professionnels de santé",
      features: [
        "Prix compétitifs pour les grossistes",
        "Livraison directe vers vos établissements",
        "Service dédié aux professionnels",
        "Catalogues personnalisés",
        "Support technique"
      ],
      color: "blue",
      images: [
        {
          thumbnail: "src/assets/Artemether-20mgG1.png",
          fullsize: "src/assets/Artemether-20mgG1.png"
        },
        {
          thumbnail: "src/assets/galerie1.jpeg",
          fullsize: "src/assets/galerie1.jpeg"
        },
        {
          thumbnail: "src/assets/galerie2.webp",
          fullsize: "src/assets/galerie2.webp"
        },
        {
          thumbnail: "src/assets/galerie3.png",
          fullsize: "src/assets/galerie3.png"
        }
      ]
    },
    {
      icon: <Truck className="w-8 h-8 text-green-600" />,
      title: "Vente au Détail",
      description: "Service personnalisé pour nos clients individuels",
      features: [
        "Large gamme de produits disponibles",
        "Conseils pharmaceutiques professionnels",
        "Horaires d'ouverture étendus",
        "Promotions régulières",
        "Accueil personnalisé"
      ],
      color: "green",
      images: [
       {
          thumbnail: "src/assets/ge4.jpeg",
          fullsize: "src/assets/ge4.jpeg"
        },
        {
          thumbnail: "src/assets/ge2.jpg",
          fullsize: "src/assets/ge2.jpg"
        },
        {
          thumbnail: "src/assets/ge1.jpg",
          fullsize: "src/assets/ge1.jpg"
        },
        {
          thumbnail: "src/assets/ge3.jpg",
          fullsize: "src/assets/ge3.jpg"
        }
      ]
    }
  ];

  const avantages = [
    {
      icon: <Shield className="w-6 h-6 text-blue-600" />,
      text: "Produits certifiés et garantis"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-600" />,
      text: "Livraison rapide et fiable"
    },
    {
      icon: <Users className="w-6 h-6 text-orange-600" />,
      text: "Équipe experte et dédiée"
    },
    {
      icon: <Truck className="w-6 h-6 text-purple-600" />,
      text: "Service après-vente"
    }
  ];
  const openImage = (imageUrl: string) => {
  setSelectedImage(imageUrl);
};
  const closeImage = () => {
    setSelectedImage(null);
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-[#2563EB] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Nos Services</h1>
          <p className="text-xl text-center text-green-100 max-w-3xl mx-auto">
            Des solutions adaptées à tous vos besoins en produits médicaux
          </p>
        </div>
      </section>

      {/* Services Principaux */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className={`bg-${service.color}-50 p-8 rounded-lg border-l-4 border-${service.color}-500`}>
                <div className="flex items-center mb-6">
                  <div className="bg-white p-3 rounded-lg shadow-sm mr-4">
                    {service.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{service.title}</h2>
                    <p className="text-gray-600">{service.description}</p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className={`w-2 h-2 bg-${service.color}-500 rounded-full mr-3`}></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Galerie d'images */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Galerie</h3>
                  <div className="flex gap-3">
                    {service.images.map((image, imageIndex) => (
                      <div
                        key={imageIndex}
                        className="cursor-pointer transform transition-transform hover:scale-105"
                        onClick={() => openImage(image.fullsize)}
                      >
                        <img
                          src={image.thumbnail}
                          alt={`${service.title} ${imageIndex + 1}`}
                          className="w-24 h-16 object-cover rounded-lg shadow-md border border-gray-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button className={`px-6 py-3 bg-${service.color}-600 text-white rounded-lg hover:bg-${service.color}-700 transition-colors`}>
                  En savoir plus
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 mb-8">
          <h2 className="text-3xl font-bold text-center mb-12">Pourquoi Choisir GARGAPharma ?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {avantages.map((avantage, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                  {avantage.icon}
                </div>
                <p className="font-semibold">{avantage.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="shadow-lg max-w-2xl mx-auto  bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl mt-12 p-8 text-center text-white ">
          <h2 className="text-3xl font-bold mb-4">Prêt à Travailler Ensemble ?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Contactez-nous pour discuter de vos besoins spécifiques
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Demander un Devis
            </button>
            <button className="px-8 py-3 border border-white text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold">
              Nous Contacter
            </button>
          </div>
        </div>

      </section>




      {/* Modal pour image agrandie */}
      {selectedImage && (
        <div className="fixed inset-0 bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImage}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="bg-black bg-opacity-50 w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Image agrandie"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}

    </MainLayout>
  );
}