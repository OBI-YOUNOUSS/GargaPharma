import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './Pages/Home'
import About from './Pages/About'
import Services from './Pages/Services'
import Products from './Pages/Products'
import Contact from './Pages/Contact'
import Catalogs from './Pages/Catalogs'
import Checkout from './Pages/Checkout'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import UserDashboard from './Pages/UserDashboard'
import AdminDashboard from './Pages/Admin/AdminDashboard'
import AddProduct from './Pages/Admin/AddProduct'
import ProductManagement from './Pages/Admin/ProductManagement'
import OrderManagement from './Pages/Admin/OrderManagement'
import MessageManagement from './Pages/Admin/MessageManagement'
import UserManagement from './Pages/Admin/UserManagement'
import CreateAdmin from './components/Auth/CreateAdmin'
import TestConnection from './components/Auth/TestConnection'
import ProtectedRoute from './components/Auth/ProtectedRoute'
import Logout from './components/Auth/Logout'
import OrdersSuccess from './Pages/OrdersSuccess'
import NotFound from './Pages/NotFound'


function App() {
  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/catalogs" element={<Catalogs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/test-connection" element={<TestConnection />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
        <Route path="/orders-success" element={<OrdersSuccess />} />
        

        {/* Routes protégées - nécessitent une connexion utilisateur */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        } />
        <Route path="/user-dashboard" element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } />

        {/* Routes ADMIN (nécessite connexion + rôle admin) */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/dashboard" element={
          <ProtectedRoute adminOnly={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/products" element={
          <ProtectedRoute adminOnly={true}>
            <ProductManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/add-product" element={
          <ProtectedRoute adminOnly={true}>
            <AddProduct />
          </ProtectedRoute>
        } />
        <Route path="/admin/orders" element={
          <ProtectedRoute adminOnly={true}>
            <OrderManagement />
          </ProtectedRoute>
        } />
        <Route path="/admin/messages" element={
          <ProtectedRoute adminOnly={true}>
            <MessageManagement />
          </ProtectedRoute>
        } />
        {/* NOUVELLE ROUTE UTILISATEURS */}
        <Route path="/admin/users" element={
          <ProtectedRoute adminOnly={true}>
            <UserManagement />
          </ProtectedRoute>
        } />
        
        {/* Route 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App;