// src/Pages/Contact.tsx
import MainLayout from "../Layouts/MainLayout";
import { useState } from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useFormValidation, validationSchemas } from "../hooks/useFormValidation";

type ContactFormType = 'general' | 'Devis';
const API_BASE_URL = 'http://localhost:5000/api';
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
  phone: string;
  needs: string;
}

export default function Contact() {
  const [activeForm, setActiveForm] = useState<ContactFormType>('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { errors, validateForm, clearErrors } = useFormValidation();
  
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    company: '',
    phone: '',
    needs: ''
  });

  const contactInfo = [
    {
      icon: <MapPin className="w-6 h-6 text-blue-600" />,
      title: "Adresse",
      content: "Avenue Charles de Gaulle, Moundou, Tchad",
      description: "Notre siège principal"
    },
    {
      icon: <Phone className="w-6 h-6 text-green-600" />,
      title: "Téléphone",
      content: "+235 30 50 55 78",
      description: "Lun - Ven: 8h-18h"
    },
    {
      icon: <Mail className="w-6 h-6 text-orange-600" />,
      title: "Email",
      content: "contact@gargapharma.td",
      description: "Nous répondons sous 24h"
    },
    {
      icon: <Clock className="w-6 h-6 text-purple-600" />,
      title: "Horaires",
      content: "Lun - Sam: 8h-20h",
      description: "Dimanche: 9h-13h"
    }
  ];

  const horaires = [
    { service: "Vente au détail", horaires: "Lundi - Samedi: 8h00 - 20h00\nDimanche: 9h00 - 13h00" },
    { service: "Vente en gros", horaires: "Lundi - Vendredi: 8h00 - 12h00 / 14h00 - 17h00" },
    { service: "Service client", horaires: "Lundi - Vendredi: 8h00 - 18h00" }
  ];

  const updateField = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      clearErrors();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let validationRules;
      
      if (activeForm === 'general') {
        validationRules = {
          name: { value: formData.name, rules: validationSchemas.name },
          email: { value: formData.email, rules: validationSchemas.email },
          subject: { value: formData.subject, rules: { required: true, minLength: 5 } },
          message: { value: formData.message, rules: validationSchemas.message }
        };
      } else {
        validationRules = {
          name: { value: formData.name, rules: validationSchemas.name },
          company: { value: formData.company, rules: { required: true, minLength: 2 } },
          email: { value: formData.email, rules: validationSchemas.email },
          phone: { value: formData.phone, rules: validationSchemas.phone },
          needs: { value: formData.needs, rules: { required: true, minLength: 10 } }
        };
      }

      const isValid = validateForm(validationRules as any);

      if (isValid) {
        // Préparer les données pour l'API
       // Préparer les données pour l'API
const apiData = {
  name: formData.name,
  email: formData.email,
  phone: formData.phone || '',
  company: formData.company || '',
  subject: formData.subject || '',
  //cette sections gere les demandes de devis
  message: activeForm === 'Devis' ? formData.needs : formData.message,
  needs: formData.needs || '',
  message_type: activeForm
};


        console.log('📤 Sending data to API:', apiData);

        // Appel à l'API avec gestion d'erreur complète
        let response;
        try {
          response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(apiData),
          });
        } catch (networkError) {
          console.error('❌ Network error:', networkError);
          throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
        }

        // Vérifier si la réponse existe
        if (!response) {
          throw new Error('Aucune réponse du serveur');
        }

        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);

        // Gérer la réponse - d'abord comme texte
        const responseText = await response.text();
        console.log('📥 Raw response text:', responseText);

        let result;
        if (responseText && responseText.trim() !== '') {
          try {
            result = JSON.parse(responseText);
          } catch (parseError) {
            console.error('❌ JSON parse error:', parseError);
            // Si le parsing échoue mais le statut est bon, considérer comme succès
            if (response.ok) {
              result = { success: true, message: 'Message envoyé avec succès' };
            } else {
              throw new Error(`Réponse invalide du serveur: ${response.status} ${response.statusText}`);
            }
          }
        } else {
          // Réponse vide
          if (response.ok) {
            result = { success: true, message: 'Message envoyé avec succès' };
          } else {
            throw new Error(`Réponse vide du serveur : ${response.status} ${response.statusText}`);
          }
        }

        // Traiter le résultat
        if (response.ok && result.success) {
          alert(activeForm === 'general' 
            ? 'Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais. ' 
            : 'Demande de devis envoyée! Notre équipe vous contactera rapidement. Merci pour la confiance '
          );
          
          // Réinitialiser le formulaire
          setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
            company: '',
            phone: '',
            needs: ''
          });
          clearErrors();
        } else {
          throw new Error(result.message || `Erreur serveur: ${response.status}`);
        }
      }
    } catch (error) {
      console.error('❌ Form submission error:', error);
      
      // Message d'erreur plus spécifique
      let errorMessage = 'Une erreur est survenue. Veuillez réessayer.';
      
      if (error instanceof Error) {
        if (error.message.includes('NetworkError') || error.message.includes('connexion')) {
          errorMessage = 'Erreur de connexion. Vérifiez votre connexion internet et réessayez.';
        } else if (error.message.includes('JSON')) {
          errorMessage = 'Erreur de communication avec le serveur. Veuillez contacter l\'administrateur.';
        } else {
          errorMessage = error.message;
        }
      }
      
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const switchForm = (formType: ContactFormType) => {
    setActiveForm(formType);
    clearErrors();
  };

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-4">Contactez-Nous</h1>
          <p className="text-xl text-center text-blue-100 max-w-3xl mx-auto">
            Nous sommes à votre écoute pour répondre à toutes vos questions
          </p>
        </div>
      </section>

      {/* Informations de Contact */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {info.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{info.title}</h3>
                <p className="text-gray-700 mb-1">{info.content}</p>
                <p className="text-sm text-gray-500">{info.description}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Formulaire */}
            <div>
              <div className="flex border-b border-gray-200 mb-6">
                <button
                  className={`flex-1 py-3 font-semibold transition-colors ${
                    activeForm === 'general' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => switchForm('general')}
                >
                  Contact Général
                </button>
                <button
                  className={`flex-1 py-3 font-semibold transition-colors ${
                    activeForm === 'Devis' 
                      ? 'text-blue-600 border-b-2 border-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => switchForm('Devis')}
                >
                  Demande de Devis
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {activeForm === 'general' ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Votre nom complet"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="votre@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sujet *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.subject}
                        onChange={(e) => updateField('subject', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.subject ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Objet de votre message"
                      />
                      {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={formData.message}
                        onChange={(e) => updateField('message', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.message ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Votre message..."
                      ></textarea>
                      {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nom complet *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => updateField('name', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Votre nom complet"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Société *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.company}
                          onChange={(e) => updateField('company', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.company ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Nom de votre entreprise"
                        />
                        {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => updateField('phone', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+235 XX XX XX XX"
                        />
                        {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="votre@email.com"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Besoins spécifiques *
                      </label>
                      <textarea
                        rows={4}
                        required
                        value={formData.needs}
                        onChange={(e) => updateField('needs', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                          errors.needs ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Décrivez vos besoins en produits médicaux..."
                      ></textarea>
                      {errors.needs && <p className="text-red-500 text-sm mt-1">{errors.needs}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Liste de produits (optionnel)
                      </label>
                      <input
                        type="file"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        accept=".pdf,.doc,.docx,.xls,.xlsx"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formats acceptés: PDF, Word, Excel (max. 10MB)
                      </p>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition-colors ${
                    activeForm === 'general'
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-orange-600 hover:bg-orange-700 text-white'
                  } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? 'Envoi en cours...' : (
                    activeForm === 'general' ? 'Envoyer le Message' : 'Demander un Devis'
                  )}
                </button>
              </form>
            </div>

            {/* Horaires et Carte */}
            <div className="space-y-8">
              {/* Horaires */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Nos Horaires</h3>
                <div className="space-y-4">
                  {horaires.map((horaire, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg hover:shadow-md transition-shadow">
                      <h4 className="font-semibold text-blue-600 mb-2">{horaire.service}</h4>
                      <p className="text-gray-700 whitespace-pre-line">{horaire.horaires}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Carte */}
              <div>
                <h3 className="text-2xl font-bold mb-6">Notre Localisation</h3>
                <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500 font-semibold">Carte interactive</p>
                    <p className="text-sm text-gray-400 mt-1">Avenue Charles de Gaulle, Moundou</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}