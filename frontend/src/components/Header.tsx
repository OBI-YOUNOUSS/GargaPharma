import { Search, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Cart from './Cart';
import imlogo from '../assets/logoGP.png'

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { state } = useCart();

  // Indicateur visuel : Dans le header pour montrer si l'utilisateur est connecté
  
  // const isUserLoggedIn = () => {
  //   const token = localStorage.getItem('token');
  //   const user = localStorage.getItem('user');
  //   return !!(token && user);
  // };

  // const getUserName = () => {
  //   try {
  //     const userStr = localStorage.getItem('user');
  //     if (userStr) {
  //       const user = JSON.parse(userStr);
  //       return user.name || user.email;
  //     }
  //   } catch (error) {
  //     console.error('Error parsing user:', error);
  //   }
  //   return '';
  // };

  return (
    <div className="relative">
      <header className="flex justify-between items-center text-black py-3 sm:py-4 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-32 bg-white drop-shadow-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 hover:no-underline">
          {/* Remplacement du logo texte par une image */}
          <img
            src={imlogo}
            alt="GargaPharma Logo"
            className="w-20 h-20 sm:w-14 sm:h-14 md:w-16 md:h-16 object-contain"
          />
          <p className="text-lg sm:text-xl md:text-2xl font-bold">
            <span className="text-blue-600 hover:text-blue-700 transition-colors">Garga</span>
            <span className="text-green-600 hover:text-green-700 transition-colors">Pharma</span>
          </p>
        </Link>

        {/* Navigation Desktop */}
        <ul className='hidden lg:flex items-center gap-4 xl:gap-6 2xl:gap-8 font-semibold text-sm xl:text-base'>
          <li className='px-2 py-1 xl:px-3 xl:py-2 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer'>
            <Link to="/" className="block">Accueil</Link>
          </li>
          <li className='px-2 py-1 xl:px-3 xl:py-2 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer'>
            <Link to="/products" className="block">Produits</Link>
          </li>
          <li className='px-2 py-1 xl:px-3 xl:py-2 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer'>
            <Link to="/services" className="block">Services</Link>
          </li>
          <li className='px-2 py-1 xl:px-3 xl:py-2 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer'>
            <Link to="/about" className="block">À Propos</Link>
          </li>
          <li className='px-2 py-1 xl:px-3 xl:py-2 hover:bg-sky-400 hover:text-white rounded-md transition-all cursor-pointer'>
            <Link to="/contact" className="block">Contacts</Link>
          </li>
        </ul>

        {/* Section droite : Search, Panier, Profil */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">

          {/* Indicateur de connexion */}
          {/* {isUserLoggedIn() && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connecté</span>
            </div>
          )} */}

          {/* Icône Panier */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-1 sm:p-2  text-blue-700 hover:text-black transition-colors"
            aria-label="Ouvrir le panier"
          >
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            {state.itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs">
                {state.itemCount}
              </span>
            )}
          </button>

          {/* Icône Utilisateur */}
          <Link
            to="/user-dashboard"
            className="text-blue-700 hover:text-black transition-colors p-1 sm:p-2"
            aria-label="Mon compte"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="currentColor"
            >
              <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z" />
            </svg>
          </Link>

          {/* Bouton Menu Mobile */}
          <button
            className="lg:hidden flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Ouvrir le menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg" blue-600
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-5 h-5 sm:w-6 sm:h-6"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Menu Mobile */}
      <div
        className={`lg:hidden absolute top-full left-0 w-full bg-white shadow-lg z-50 transform transition-all duration-300 ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
      >
        {/* Barre de recherche - Mobile */}
        <div className="px-4 py-3 border-b">
          <div className="flex items-center relative">
            <Search className='absolute left-3 text-gray-500 w-4 h-4' />
            <input
              type="text"
              placeholder='Search...'
              className='py-2 pl-10 pr-4 rounded-xl border-2 border-blue-300 focus:bg-slate-100 focus:outline-sky-500 w-full text-sm'
            />
          </div>
        </div>

        {/* Navigation Mobile */}
        <ul className="flex flex-col">
          <li className='border-b'>
            <Link to="/" className="block w-full text-center p-3 sm:p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
              Accueil
            </Link>
          </li>
          <li className='border-b'>
            <Link to="/products" className="block w-full text-center p-3 sm:p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
              Produits
            </Link>
          </li>
          <li className='border-b'>
            <Link to="/services" className="block w-full text-center p-3 sm:p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
              Services
            </Link>
          </li>
          <li className='border-b'>
            <Link to="/about" className="block w-full text-center p-3 sm:p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
              À Propos
            </Link>
          </li>
          <li className='border-b'>
            <Link to="/contact" className="block w-full text-center p-3 sm:p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer text-sm sm:text-base" onClick={() => setIsMenuOpen(false)}>
              Contacts
            </Link>
          </li>
        </ul>
      </div>

      {/* Overlay pour fermer le menu */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0  bg-opacity-50 z-40 mt-20 sm:mt-24"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Panier */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}

export default Header;