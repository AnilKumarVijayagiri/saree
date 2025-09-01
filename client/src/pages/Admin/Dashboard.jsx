import { useEffect, useState } from "react";
import { api, setAuthToken } from "../../lib/api";
import { useAuth } from "../../store/useAuth";
import Products from "./Products";
import Categories from "./Categories";
import Gallery from "./Gallery";
import Orders from "./Orders";
import Coupons from "./Coupons";
import Testimonials from "./Testimonials";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronDown } from "@fortawesome/free-solid-svg-icons";

export default function Dashboard() {
  const [tab, setTab] = useState("products");
  const [menuOpen, setMenuOpen] = useState(false); // for hamburger dropdown
  const { token } = useAuth();

  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  const tabs = [
    { key: "products", label: "Products" },
    { key: "categories", label: "Categories" },
    { key: "gallery", label: "Gallery" },
    { key: "orders", label: "Orders" },
    { key: "coupons", label: "Coupons" },
    { key: "testimonials", label: "Testimonials" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row transition-all">
      {/* Sidebar for large screens */}
      <aside className="hidden lg:flex flex-col w-64 bg-white shadow-md p-6 space-y-6">
        <h1 className="text-2xl font-bold text-brand-600">Admin Dashboard</h1>
        <div className="flex flex-col gap-3 mt-6">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`text-left px-4 py-2 rounded-lg font-medium transition
                ${
                  tab === t.key
                    ? "bg-brand-600 text-white shadow-lg"
                    : "hover:bg-brand-100 text-gray-700"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Top bar with hamburger for small screens */}
      {/* Top bar with hamburger for small screens */}
      <div className="lg:hidden flex items-center justify-between p-4 bg-white shadow">
        <h1 className="text-xl font-bold text-brand-600">Admin Dashboard</h1>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-md hover:bg-gray-100 transition"
        >
          <FontAwesomeIcon
            icon={faCircleChevronDown}
            className={`w-6 h-6 text-gray-700 transition-transform ${
              menuOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Hamburger menu dropdown */}
      {menuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-50 flex flex-col p-4 space-y-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => {
                setTab(t.key);
                setMenuOpen(false); // close menu after selection
              }}
              className={`px-4 py-2 rounded-lg font-medium text-left transition
                ${
                  tab === t.key
                    ? "bg-brand-600 text-white"
                    : "hover:bg-brand-100 text-gray-700"
                }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <main className="flex-1  mt-0 lg:mt-0">
        {tab === "products" && <Products />}
        {tab === "categories" && <Categories />}
        {tab === "gallery" && <Gallery />}
        {tab === "orders" && <Orders />}
        {tab === "coupons" && <Coupons />}
        {tab === "testimonials" && <Testimonials />}
      </main>
    </div>
  );
}
