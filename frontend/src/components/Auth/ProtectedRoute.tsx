import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ 
  children, 
  adminOnly = false, 
  requireAuth = true 
}: ProtectedRouteProps) {
  
  // Si l'authentification n'est pas requise, afficher directement
  if (!requireAuth) {
    return <>{children}</>;
  }

  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  
  console.log('🔐 ProtectedRoute check:');
  console.log(' - Token exists:', !!token);
  console.log(' - User data exists:', !!userStr);
  
  // Vérifier si l'utilisateur est connecté
  if (!token || !userStr) {
    console.log('❌ No token or user data, redirecting to login');
    alert('🔒 Vous devez être connecté pour accéder à cette page');
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userStr);
    console.log('👤 User object:', user);
    console.log('🎯 User role:', user.role);
    console.log('🔒 Admin required:', adminOnly);
    
    // Vérifier les permissions admin si nécessaire
    if (adminOnly && user.role !== 'admin') {
      console.log('🚫 Access denied: User is not admin');
      alert('❌ Accès réservé aux administrateurs');
      return <Navigate to="/" replace />;
    }
    
    console.log('✅ Access granted');
    return <>{children}</>;
  } catch (error) {
    console.error('❌ Error parsing user:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    alert('❌ Session invalide. Veuillez vous reconnecter.');
    return <Navigate to="/login" replace />;
  }
}
