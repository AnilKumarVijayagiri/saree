import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Sarees from "./pages/Sarees";
import Kurtis from "./pages/Kurtis";
import KurtiSets from "./pages/KurtiSets";
import EthnicFrocks from "./pages/EthnicFrocks";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Gallery from "./pages/Gallery";
import Review from "./pages/Review";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import Dashboard from "./pages/Admin/Dashboard";
import AdminCategories from "./pages/Admin/Categories";
import AdminGuard from "./components/AdminGuard";
import Orders from "./pages/Orders";
import { AuthProvider } from "./components/AuthProvider";

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories/:name" element={<AdminCategories />} />
            <Route path="/sarees" element={<Sarees />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/kurtis" element={<Kurtis />} />
            <Route path="/kurti-sets" element={<KurtiSets />} />
            <Route path="/ethnic-frocks" element={<EthnicFrocks />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/review/:orderId" element={<Review />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <AdminGuard>
                  <Dashboard />
                </AdminGuard>
              }
            />
            <Route
              path="/admin/categories"
              element={
                <AdminGuard>
                  <AdminCategories />
                </AdminGuard>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
