
import MainLayout from "../Layouts/MainLayout";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function OrdersSuccess() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-16 text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Commande Confirmée !</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Votre commande a été enregistrée avec succès. 
          <br />Nous vous contacterons dans les plus brefs délais pour la livraison.
        </p>
        
        <div className="space-y-4 max-w-md mx-auto">
          <Link 
            to="/my-orders" 
            className="block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Voir mes commandes
          </Link>
          <Link 
            to="/products" 
            className="block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Continuer mes achats
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}