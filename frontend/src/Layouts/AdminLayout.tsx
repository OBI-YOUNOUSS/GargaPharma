import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import AddProduct from '../Pages/Admin/AddProduct';
import ProductManagement from '../Pages/Admin/ProductManagement';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/products" element={<ProductManagement />} />
      </Routes>
    </div>
  );
}