import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function CategoryPage() {
  const { id } = useParams();   // category ObjectId
  const [products, setProducts] = useState([]);
  const [cat, setCat] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/products?category=${id}`);
        setProducts(data.products);
        setCat(data.category);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    }
    fetchProducts();
  }, [id]);

  if (!cat) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{cat.name}</h1>
      {products.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p) => (
            <Link
              to={`/products/${p._id}`}
              key={p._id}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md"
            >
              <img
                src={p.images?.[0] || "https://via.placeholder.com/200"}
                alt={p.name}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-gray-600">₹{p.price}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products in this category.</p>
      )}
    </div>
  );
}
