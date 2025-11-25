import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Section Newsletter */}
      <div className="bg-[#2563EB] px-16 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Restez informé</h3>
              <p className="text-blue-100">
                Abonnez-vous à notre newsletter pour recevoir nos dernières actualités et offres spéciales.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre adresse email"
                  className="flex-1 px-4 py-2 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#2563EB]"
                />
                <button className="px-6 py-2 bg-white text-[#2563EB] hover:bg-green-500 hover:text-white rounded-lg font-medium transition-colors duration-200">
                  S'abonner
                </button>
              </div>
              <p className="text-xs text-blue-200 mt-2">
                En vous abonnant, vous acceptez notre politique de confidentialité.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal du footer */}
      <div className="px-16 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div>
            <p className="text-2xl font-bold">
              <span className="text-blue-600">Garga</span>
              <span className="text-green-600">Pharma</span>
            </p>
            <p className="text-gray-300 mt-2">
              Votre partenaire santé de confiance pour des médicaments de qualité en gros et détail.
            </p>

            <div className="mt-4 flex space-x-4">
              <a href="https://www.facebook.com/obi.dougoulami" aria-label="Facebook">
                <Facebook className="w-5 h-5 hover:text-blue-500 transition-colors duration-200" />
              </a>
              <a href="#" aria-label="Twitter">
                <Twitter className="w-5 h-5 hover:text-blue-400 transition-colors duration-200" />
              </a>
              <a href="#" aria-label="Instagram">
                <Instagram className="w-5 h-5 hover:text-pink-500 transition-colors duration-200" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/services" className="hover:text-white">Ventes en Gros</Link></li>
              <li><Link to="/services" className="hover:text-white">Ventes en Détail</Link></li>
              <li><Link to="/services" className="hover:text-white">Livraison à Domicile</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Liens rapides</h3>
            <ul className="space-y-2 text-gray-300">
              <li><Link to="/" className="hover:text-white">Accueil</Link></li>
              <li><Link to="/products" className="hover:text-white">Produits</Link></li>
              <li><Link to="/services" className="hover:text-white">Services</Link></li>
              <li><Link to="/about" className="hover:text-white">À Propos</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                contact@gargapharma.td
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                +235 98980007
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col md:flex-row items-center justify-between border-t border-gray-700 pt-6 text-sm text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} GargaPharma. Tous droits réservés.</p>
          <p>Politique de confidentialité</p>
          <p>Conditions d'utilisation</p>
        </div>
      </div>
    </footer>
  );
}