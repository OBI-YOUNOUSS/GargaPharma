// src/hooks/useFormValidation.ts
import { useState } from 'react';

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: string) => boolean;
  customMessage?: string;
}

export interface ValidationFields {
  [key: string]: {
    value: string;
    rules: ValidationRules;
  };
}

export function useFormValidation() {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (_name: string, value: string, rules: ValidationRules): string => {
    if (rules.required && !value.trim()) {
      return rules.customMessage || 'Ce champ est obligatoire';
    }

    if (rules.minLength && value.length < rules.minLength) {
      return rules.customMessage || `Minimum ${rules.minLength} caractères requis`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.customMessage || `Maximum ${rules.maxLength} caractères autorisés`;
    }

    if (rules.pattern && value && !rules.pattern.test(value)) {
      return rules.customMessage || 'Format invalide';
    }

    if (rules.custom && !rules.custom(value)) {
      return rules.customMessage || 'Valeur invalide';
    }

    return '';
  };

  const validateForm = (fields: ValidationFields): boolean => {
    const newErrors: Record<string, string> = {};
    
    Object.entries(fields).forEach(([name, { value, rules }]) => {
      const error = validateField(name, value, rules);
      if (error) {
        newErrors[name] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearErrors = () => {
    setErrors({});
  };

  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  return { 
    errors, 
    validateForm, 
    clearErrors, 
    setFieldError,
    setErrors 
  };
}

// Schémas de validation prédéfinis
export const validationSchemas = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    customMessage: 'Veuillez entrer un email valide'
  },
  phone: {
    required: true,
    pattern: /^\+?[\d\s-()]{10,}$/,
    customMessage: 'Veuillez entrer un numéro de téléphone valide'
  },
  name: {
    required: true,
    minLength: 2,
    customMessage: 'Le nom doit contenir au moins 2 caractères'
  },
  message: {
    required: true,
    minLength: 10,
    customMessage: 'Le message doit contenir au moins 10 caractères'
  }
};