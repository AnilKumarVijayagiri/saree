import React from 'react';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';
import logo from '../assets/Logo.jpg';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-orange-600  rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  <img src={logo} alt="logo" className="w-8 h-7 rounded-2xl" />
                </span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-700 bg-clip-text text-transparent">
                Shaivyah
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Where tradition meets modern grace. Discover beautiful sarees, kurtis, and ethnic wear 
              that celebrate the essence of Indian fashion.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-200 hover:text-orange-400 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-orange-400 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-200 hover:text-orange-400 transition-colors duration-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/sarees" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Sarees</a></li>
              <li><a href="/kurtis" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Kurtis</a></li>
              <li><a href="/kurti-sets" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Kurti Sets</a></li>
              <li><a href="/ethnic-frocks" className="text-gray-300 hover:text-orange-400 transition-colors duration-200">Ethnic Frocks</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <Phone size={16} />
                <span className="text-gray-300">+91 9876543210</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={16} />
                <span className="text-gray-300">info@shaivyah.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin size={16} />
                <span className="text-gray-300">Hyderabad, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2025 Shaivyah. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;