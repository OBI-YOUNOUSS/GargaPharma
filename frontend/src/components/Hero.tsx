import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Truck, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

// Import des images
import pharmacieImage1 from '../assets/Pharmacie-médicaments.jpg';
import pharmacieImage2 from '../assets/Photo1.jpeg'; 
import pharmacieImage3 from '../assets/seringues.jpg';
import pharmacieImage4 from '../assets/seringues1.jpg';

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Tableau des images du carousel
  const slides = [
    {
      image: pharmacieImage1,
      alt: "Pharmacie GargaPharma - Médicaments et produits de santé"
    },
    {
      image: pharmacieImage2,
      alt: "Intérieur de notre pharmacie GargaPharma"
    },
    {
      image: pharmacieImage3,
      alt: "Large sélection de médicaments GargaPharma"
    },
    {
      image: pharmacieImage4,
      alt: "Service client professionnel GargaPharma"
    }
  ];

  // Défilement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 2000); // Change d'image toutes les 2 secondes

    return () => clearInterval(interval);
  }, [slides.length]);

  // Navigation manuelle
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Aller à un slide spécifique
  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  return (
    <section className="relative px-4 md:px-16 min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      {/* Carousel pour mobile - en arrière-plan */}
      <div className="absolute inset-0 lg:hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-30 md:opacity-40' : 'opacity-0'
            }`}
          >
            <img 
              src={slide.image} 
              alt={slide.alt}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texte principal */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              VOTRE PARTENAIRE SANTÉ DE CONFIANCE
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Bienvenue chez{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">
                GargaPharma
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 leading-relaxed">
              Médicaments de qualité en <span className="font-semibold text-blue-600">gros</span> et{' '}
              <span className="font-semibold text-green-600">détail</span>. Livraison rapide et service professionnel.
            </p>
            
            <p className="text-lg text-gray-600 mb-8 max-w-2xl">
              Explorez nos meilleurs produits et services qui répondent parfaitement à vos attentes en matière de santé.
            </p>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                to="/products" 
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl"
              >
                Commander maintenant
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/about" 
                className="inline-flex items-center justify-center gap-3 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all duration-300 font-semibold text-lg"
              >
                En savoir plus
              </Link>
            </div>

            {/* Points forts rapides */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Produits certifiés</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Truck className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Livraison rapide</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">Service 24/7</span>
              </div>
            </div>
          </div>

          {/* Section Carousel - Visible seulement sur desktop */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[500px] w-full">
              {/* Images du carousel */}
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <img 
                    src={slide.image} 
                    alt={slide.alt}
                    className="w-full h-full object-cover rounded-3xl"
                  />
                </div>
              ))}
              
              {/* Boutons de navigation */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Indicateurs de slide */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentSlide 
                        ? 'bg-white scale-125' 
                        : 'bg-white/60 hover:bg-white/80'
                    }`}
                    aria-label={`Aller à l'image ${index + 1}`}
                  />
                ))}
              </div>

              {/* Overlay gradient pour mieux voir le texte sur les images */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent rounded-3xl"></div>
            </div>
            
            {/* Éléments décoratifs */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400 rounded-full opacity-20 animate-ping"></div>
          </div>
        </div>
      </div>
    </section>
  );
}