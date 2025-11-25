import MainLayout from "../Layouts/MainLayout";
import Hero from "../components/Hero";
import Features from "../components/Features";
import { Link } from "react-router-dom";
import { Users, Phone, FileText, Star, Quote, Truck } from "lucide-react";

export default function Home() {
  return (
    <MainLayout>
      <Hero />
      <Features />

      {/* Section Services Détaillés */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Nos Services Spécialisés</h2>
            <p className="text-xl text-gray-900 max-w-2xl mx-auto">
              Des solutions adaptées à tous vos besoins en produits pharmaceutiques
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Vente en Gros */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-blue-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className=" bg-opacity-20 p-3 rounded-xl">
                    <Truck className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Vente en Gros</h3>
                </div>
                <p className="text-blue-100 text-lg">
                  Solutions complètes pour les professionnels de santé
                </p>
              </div>

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Prix compétitifs pour les grossistes</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Livraison directe vers vos établissements</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Service dédié aux professionnels</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Catalogues personnalisés</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Support technique et conseils</span>
                  </li>
                </ul>

                <div className="flex gap-4">
                  <Link
                    to="/contact"
                    className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors text-center font-semibold"
                  >
                    Demander un Devis
                  </Link>
                  <Link
                    to="/catalogs"
                    className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg hover:bg-blue-50 transition-colors text-center font-semibold"
                  >
                    Voir les Catalogues
                  </Link>
                </div>
              </div>
            </div>

            {/* Vente au Détail */}
            <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 border border-green-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-8 text-white">
                <div className="flex items-center gap-4 mb-4">
                  <div className=" bg-opacity-20 p-3 rounded-xl">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold">Vente au Détail</h3>
                </div>
                <p className="text-green-100 text-lg">
                  Service personnalisé pour nos clients individuels
                </p>
              </div>

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Large gamme de produits disponibles</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Conseils pharmaceutiques professionnels</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Horaires d'ouverture étendus</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Promotions régulières</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span className="text-gray-700">Accueil personnalisé et chaleureux</span>
                  </li>
                </ul>

                <div className="flex gap-4">
                  <Link
                    to="/products"
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors text-center font-semibold"
                  >
                    Voir les Produits
                  </Link>
                  <Link
                    to="/contact"
                    className="flex-1 border border-green-600 text-green-600 py-3 px-6 rounded-lg hover:bg-green-50 transition-colors text-center font-semibold"
                  >
                    Nous Contacter
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Prêt à Commencer ?</h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Rejoignez les nombreux professionnels et particuliers qui nous font confiance pour leurs besoins en produits pharmaceutiques
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
              >
                <Phone className="w-5 h-5" />
                Nous Contacter
              </Link>
              <Link
                to="/catalogs"
                className="inline-flex items-center gap-2 border border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-blue-600 transition-colors font-semibold text-lg"
              >
                <FileText className="w-5 h-5" />
                Voir les Catalogues
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Témoignages */}
<section className="py-20 bg-gray-50">
  <div className="container mx-auto px-4">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold text-gray-900 mb-4">
        Ils nous font confiance
      </h2>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Découvrez les retours de nos clients et partenaires
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Témoignage 1 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-blue-100 group">
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
          ))}
        </div>
        <Quote className="w-8 h-8 text-blue-600 mb-4 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
        <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
          "Un partenaire fiable pour notre pharmacie. Les livraisons sont toujours ponctuelles et les produits de qualité. Leur équipe est très réactive et professionnelle."
        </p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-md">
              <img 
                src="src/assets/images1.jpeg" 
                alt="Dr. Martin Dubois"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement as HTMLElement;
                  const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                  target.style.display = 'none';
                  fallback.classList.remove('hidden');
                }}
              />
              <div className="avatar-fallback w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center ring-2 ring-white">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Dr. Martin Dubois</h4>
            <p className="text-blue-600 font-medium">Pharmacien</p>
            <p className="text-gray-500 text-sm">Moundou</p>
          </div>
        </div>
      </div>

      {/* Témoignage 2 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-green-100 group">
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
          ))}
        </div>
        <Quote className="w-8 h-8 text-green-600 mb-4 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
        <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
          "Service client exceptionnel ! Les conseils sont toujours pertinents et les prix très compétitifs. Je recommande vivement pour tous les professionnels de santé."
        </p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-green-100 to-green-200 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-md">
              <img 
                src="src/assets/images1.jpeg" 
                alt="Sarah Leroy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement as HTMLElement;
                  const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                  target.style.display = 'none';
                  fallback.classList.remove('hidden');
                }}
              />
              <div className="avatar-fallback w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Sarah Leroy</h4>
            <p className="text-green-600 font-medium">Directrice de clinique</p>
            <p className="text-gray-500 text-sm">Moundou</p>
          </div>
        </div>
      </div>

      {/* Témoignage 3 */}
      <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border border-purple-100 group">
        <div className="flex items-center gap-2 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
          ))}
        </div>
        <Quote className="w-8 h-8 text-purple-600 mb-4 opacity-50 group-hover:opacity-70 transition-opacity duration-300" />
        <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
          "Depuis que nous travaillons avec eux, notre approvisionnement est beaucoup plus fluide. La qualité des produits et le service après-vente sont impeccables."
        </p>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-white shadow-md">
              <img 
                src="src/assets/images1.jpeg" 
                alt="Pierre Simplice"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  const parent = target.parentElement as HTMLElement;
                  const fallback = parent.querySelector('.avatar-fallback') as HTMLElement;
                  target.style.display = 'none';
                  fallback.classList.remove('hidden');
                }}
              />
              <div className="avatar-fallback w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center ring-2 ring-white">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-lg">Pierre Simplice</h4>
            <p className="text-purple-600 font-medium">Grossiste pharmaceutique</p>
            <p className="text-gray-500 text-sm">Lolo/Moundou</p>
          </div>
        </div>
      </div>
    </div>

    {/* Note globale */}
    <div className="text-center mt-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl p-8 shadow-lg border border-white max-w-2xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4">
        <div className="text-4xl font-bold text-white">4.9/5</div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-8 h-8 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      <p className="text-blue-100 text-lg font-medium">
        Basé sur les avis de plus de 200 clients satisfaits
      </p>
    </div>
  </div>
</section>
      {/* Section Statistiques */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600 font-semibold">Professionnels partenaires</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-green-600 mb-2">1000+</div>
              <div className="text-gray-600 font-semibold">Produits disponibles</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-purple-600 mb-2">24/7</div>
              <div className="text-gray-600 font-semibold">Service client</div>
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-orange-600 mb-2">5+</div>
              <div className="text-gray-600 font-semibold">Ans d'expérience</div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}