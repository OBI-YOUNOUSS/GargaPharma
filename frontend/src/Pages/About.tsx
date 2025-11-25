import MainLayout from "../Layouts/MainLayout";
import { Shield, Users, Target } from "lucide-react";
import NotreEts from "../assets/etabli.jpeg";

export default function About() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">À Propos de GARGAPharma</h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            Votre partenaire de confiance dans la distribution de produits médicaux à Moundou
          </p>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Notre Histoire</h2>
              <p className="text-gray-700 mb-4">
                Fondée en 2019, GARGAPharma s'est rapidement imposée comme un acteur majeur 
                dans la distribution de produits médicaux à Moundou et dans toute la région.
              </p>
              <p className="text-gray-700 mb-4">
                Notre engagement envers la qualité et le service nous a permis de bâtir 
                des relations solides avec les professionnels de santé et de gagner la 
                confiance de nos clients détaillants.
              </p>
              <p className="text-gray-700">
                Aujourd'hui, nous continuons à innover et à élargir notre gamme de produits 
                pour répondre aux besoins croissants du secteur médical tchadien.
              </p>
            </div>
            <div className="bg-gray-100 h-80 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={NotreEts}
                alt="Notre établissement"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission et Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Notre Mission & Valeurs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Notre Mission</h3>
              <p className="text-gray-700">
                Devenir la plateforme digitale de référence pour l'importation et la distribution 
                de produits et matériels médicaux à Moundou, en offrant un service de qualité 
                supérieure à tous nos clients.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Notre Vision</h3>
              <p className="text-gray-700">
                Contribuer à l'amélioration du système de santé tchadien en fournissant 
                des produits médicaux de qualité accessibles à tous, grâce à une distribution 
                efficace et professionnelle.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-4">Nos Valeurs</h3>
              <ul className="text-gray-700 space-y-2 text-left">
                <li>• Intégrité et transparence</li>
                <li>• Qualité des produits</li>
                <li>• Service client exceptionnel</li>
                <li>• Innovation continue</li>
                <li>• Responsabilité sociale</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Nos Certifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              "Certification ISO 9001",
              "Agrément Ministère de la Santé",
              "Distributeur Agréé",
              "Bonnes Pratiques de Distribution"
            ].map((certification, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold">{certification}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
}