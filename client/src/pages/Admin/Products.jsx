import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Uploader from "../../components/Uploader";
import { Pencil, Trash2, Tag } from "lucide-react";

const Products = () => {
  const empty = {
    name: "",
    price: 0,
    discount: 0,
    description: "",
    fabric: "",
    color: "",
    occasion: "",
    category: "Sarees",
    images: [],
    categoryRef: "",
  };

  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const { data } = await api.get("/api/products");
      setList(data);
      const c = await api.get("/api/categories");
      setCategories(c.data);
    } catch (err) {
      console.error("Error loading data:", err);
      setError("Failed to load products and categories");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const validateForm = () => {
    if (!form.name) return "Product name is required";
    if (!form.price || form.price <= 0) return "Valid price is required";
    if (!form.categoryRef) return "Category is required";
    if (!form.images || form.images.length === 0) return "At least one image is required";
    return null;
  };

  const save = async () => {
    try {
      setError("");
      setLoading(true);
      
      const validationError = validateForm();
      if (validationError) {
        setError(validationError);
        return;
      }

      if (form._id) {
        await api.put(`/api/products/${form._id}`, form);
      } else {
        await api.post("/api/products", form);
      }
      setForm(empty);
      await load();
    } catch (err) {
      console.error("Error saving product:", err);
      setError(err.response?.data?.message || "Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const del = async (id) => {
    if (confirm("Delete?")) {
      await api.delete(`/api/products/${id}`);
      load();
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4">
      {/* Product Form */}
      <div className="lg:w-1/3 bg-white rounded-2xl shadow-lg p-6 flex-shrink-0">
        <h2 className="text-2xl font-bold mb-4 text-brand-600">
          {form._id ? "✏️ Edit Product" : "➕ Add New Product"}
        </h2>
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Product Name
          </label>
          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
            placeholder="Product Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
              placeholder="Price"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: Number(e.target.value) })
              }
            />
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount %
            </label>
            <input
              type="number"
              className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
              placeholder="Discount %"
              value={form.discount}
              onChange={(e) =>
                setForm({ ...form, discount: Number(e.target.value) })
              }
            />
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
            value={form.categoryRef || ""}
            onChange={(e) => {
              const selected = categories.find((c) => c._id === e.target.value);
              setForm({
                ...form,
                categoryRef: e.target.value,
                category: selected?.name || "Sarees",
              });
            }}
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fabric
          </label>
          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
            placeholder="Fabric"
            value={form.fabric}
            onChange={(e) => setForm({ ...form, fabric: e.target.value })}
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Color
          </label>
          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
            placeholder="Color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
          />
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Occasion
          </label>
          <input
            className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
            placeholder="Occasion"
            value={form.occasion}
            onChange={(e) => setForm({ ...form, occasion: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
              placeholder="Write product details here..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          {/* Uploader Button */}
          <div className="w-full flex justify-end mb-2">
            <div className="w-full sm:w-auto">
              <Uploader
                onUploaded={(urls) =>
                  setForm({ ...form, images: [...form.images, ...urls] })
                }
              />
            </div>
          </div>

          {/* Uploaded Images */}
          {form.images.length > 0 && (
            <div className="w-full flex flex-wrap gap-2 mb-4">
              {form.images.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img
                    src={url}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover border"
                    alt={`Product image ${idx + 1}`}
                  />
                  <button
                    onClick={() => setForm({ ...form, images: form.images.filter((_, i) => i !== idx) })}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  {idx === 0 && (
                    <span className="absolute bottom-1 left-1 bg-brand-600 text-white text-xs px-2 py-0.5 rounded-full">
                      Main
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex flex-col sm:flex-row gap-2">
            <button
              className={`flex-1 bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={save}
              disabled={loading}
            >
              {loading ? "Saving..." : form._id ? "Update Product" : "Create Product"}
            </button>
            {form._id && (
              <button
                className="flex-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                onClick={() => {
                  setForm(empty);
                  setError("");
                }}
                disabled={loading}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}

      <div className="lg:w-2/3 space-y-8 overflow-x-hidden">
        <h2 className="block text-xl font-medium text-gray-700 mb-1">
          Edit Your Products And Items
        </h2>
        {["Sarees", "Kurtis", "Kurti Sets", "Ethnic Frocks", "Other"].map(
          (cat) => (
            <div key={cat}>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-700">
                <Tag className="w-5 h-5 text-brand-600" /> {cat}
              </h3>
              {list.filter((p) => p.category === cat).length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {list
                    .filter((p) => p.category === cat)
                    .map((p) => (
                      <div
                        key={p._id}
                        className="relative bg-white rounded-2xl shadow hover:shadow-lg transition overflow-hidden group"
                      >
                        <img
                          src={
                            p.images?.[0] ||
                            "https://via.placeholder.com/300x200"
                          }
                          alt={p.name}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                          <button
                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                            onClick={() => setForm(p)}
                          >
                            <Pencil className="w-4 h-4 text-gray-700" />
                          </button>
                          <button
                            className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                            onClick={() => del(p._id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-lg truncate">
                            {p.name}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            ID: {p.productId}
                          </p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-gray-700 font-medium">
                              ₹{p.price.toLocaleString()}
                            </span>
                            {p.discount > 0 && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">
                                -{p.discount}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No products in this category.
                </p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Products;
