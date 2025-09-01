import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../store/useCart";
import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io"; 

const ProductCard = ({ p }) => {
  const [carts, SetCarts] = useState(false);
  const cart = useCart();
  const navigate = useNavigate();

  const handleClick = (e) => {
    navigate(`/product/${p._id}`);
  };

  const Clickcart = (e) => {
    e.stopPropagation(); // Prevent navigation when clicking the cart button
    cart.add(p, 1);
    SetCarts(true);
    setTimeout(() => {
      SetCarts(false);
    }, 4000);
  };

  const discountPercentage = p.discount || 0;
  const discountedPrice = Math.round(p.price * (1 - discountPercentage / 100));
  const img =
    p.images?.[0] || "https://via.placeholder.com/400x500?text=Shaivyah";

  return (
    <div 
      className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden group cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <img
          src={img}
          alt={p.name}
          className="w-full h-80 object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          {discountPercentage > 0 && (
            <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-semibold shadow">
              {discountPercentage}% OFF
            </div>
          )}
          {p.images?.length > 1 && (
            <div className="bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs font-semibold shadow">
              +{p.images.length - 1} photos
            </div>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-800 mb-1 truncate">
          {p.name}
        </h3>
        <p className="text-sm text-gray-500 mb-2 truncate">
          {p.category} · {p.fabric || "Fabric"}
        </p>

        <div className="flex items-center space-x-2 mb-4">
          <span className="text-xl font-bold text-orange-600">
            ₹{discountedPrice}
          </span>
          {discountPercentage > 0 && (
            <span className="text-gray-500 line-through text-sm">
              ₹{p.price}
            </span>
          )}
        </div>

        <button
          onClick={Clickcart}
          className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 flex items-center justify-center space-x-2"
        >
          {carts ? (
            <>
              <IoMdCheckmark size={16} className="text-white" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <ShoppingBag size={16} />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
