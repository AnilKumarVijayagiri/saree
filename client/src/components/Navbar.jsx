import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingBag, Menu, X, ChevronDown, User } from "lucide-react";
import { useAuth } from "../store/useAuth";
import { useCart } from "../store/useCart";
import logo from '../../src/assets/Logo.jpg';

export default function Navbar() {
  const { user, logout } = useAuth();
  const cart = useCart();
  const nav = useNavigate();

  const [isOpen, setIsOpen] = useState(false); 
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Function to get user display name
  const getUserDisplayName = () => {
    if (!user) return '';
    if (user.role === 'admin') return 'Admin';
    return user.name || 'User';
  };

  // Close profile dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-dropdown')) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdownOpen]);

  const categories = [
    { name: "Sarees", path: "/sarees" },
    { name: "Kurtis", path: "/kurtis" },
    { name: "Kurti Sets", path: "/kurti-sets" },
    { name: "Ethnic Frocks", path: "/ethnic-frocks" },
    { name: "Gallery", path: "/gallery" },
    { name: "Order", path: "/orders" },
  ];

  const totalItems = cart.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className="bg-gray-50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="logo" className="w-7 h-7 rounded-2xl" />
            <span className="text-2xl font-extrabold bg-gradient-to-r from-orange-500 to-red-700 bg-clip-text text-transparent">
              Shaivyah
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6">
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-m font-medium transition-colors duration-200 ${
                  isActive
                    ? "text-orange-500"
                    : "text-gray-800 hover:text-orange-500 hover:bg-orange-50"
                }`
              }
            >
              Home
            </NavLink>

            {/* Categories Dropdown (Click toggle) */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-md text-m font-medium text-gray-800 hover:text-orange-500 hover:bg-orange-50 transition"
              >
                <span>Categories</span>
                <ChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {dropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 py-2 z-50">
                  {categories.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setDropdownOpen(false)} // close after click
                      className={({ isActive }) =>
                        `block px-4 py-2 text-sm transition-colors ${
                          isActive
                            ? "text-orange-500 bg-orange-50"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-gray-800 hover:text-orange-500 transition-colors duration-200"
            >
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Auth */}
            {user ? (
              <div className="relative profile-dropdown">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-full hover:bg-orange-50 transition-colors"
                  aria-label="Open profile menu"
                >
                  <User size={24} className="text-gray-700" />
                </button>
                {profileDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 py-2 z-50"
                    role="menu"
                  >
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">
                      Hi, {getUserDisplayName()}
                    </div>
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        role="menuitem"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                        nav("/");
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                      role="menuitem"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/login"
                className="bg-orange-500 text-white rounded-md px-3 py-1 hover:bg-orange-600 transition"
              >
                Login
              </NavLink>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-800">
              <ShoppingBag size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-orange-500 transition-colors duration-200"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {/* Home */}
              <NavLink
                to="/"
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-m font-medium transition-colors ${
                    isActive
                      ? "text-orange-500 bg-orange-50"
                      : "text-gray-800 hover:text-orange-500 hover:bg-orange-50"
                  }`
                }
              >
                Home
              </NavLink>

              {/* Categories Dropdown (collapsible in mobile) */}
              <details className="px-3">
                <summary className="cursor-pointer text-gray-800 hover:text-orange-500 font-medium">
                  Categories
                </summary>
                <div className="ml-4 mt-2 flex flex-col space-y-1">
                  {categories.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `block px-2 py-1 rounded-md transition-colors ${
                          isActive
                            ? "text-orange-500 bg-orange-50"
                            : "text-gray-700 hover:text-orange-500 hover:bg-orange-50"
                        }`
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </details>

              {/* Auth */}
              {/* Auth */}
              {user ? (
                <div className="space-y-2 px-3">
                  <div className="text-sm text-gray-700 font-medium border-b border-gray-100 pb-2">
                    Hi, {getUserDisplayName()}
                  </div>
                  <button
                    className="w-full text-left bg-orange-500 text-white rounded-md px-3 py-2 hover:bg-orange-600 transition"
                    onClick={() => {
                      logout();
                      nav("/");
                      setIsOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="bg-orange-500 text-white rounded-md px-3 py-2 hover:bg-orange-600 transition"
                >
                  Login
                </NavLink>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
