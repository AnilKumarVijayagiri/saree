import { useEffect, useState } from "react";
import { api } from "../../lib/api";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [newCat, setNewCat] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch categories from API
  const loadCategories = async () => {
    try {
      const { data } = await api.get("/api/categories");
      setCategories(data);
    } catch (err) {
      console.error("Failed to load categories:", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Add new category
  const addCategory = async () => {
    if (!newCat.trim()) return alert("Category name required!");
    setLoading(true);
    try {
      await api.post("/api/categories", { name: newCat });
      setNewCat("");
      loadCategories(); // refresh list
    } catch (err) {
      console.error("Failed to add category:", err);
      alert("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const delCategory = async (id) => {
    if (!confirm("Delete this category?")) return;
    try {
      await api.delete(`/api/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
    } catch (err) {
      console.error("Failed to delete category:", err);
      alert("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Manage Categories</h1>

      {/* Add new category */}
      <div className="flex gap-2">
        <input
          className="border rounded-lg px-3 py-2 w-full focus:ring focus:ring-brand-200"
          placeholder="New category name"
          value={newCat}
          onChange={(e) => setNewCat(e.target.value)}
        />
        <button
          className="bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700"
          onClick={addCategory}
          disabled={loading}
        >
          Add
        </button>
      </div>

      {/* Existing categories */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="flex items-center justify-between bg-white rounded-xl shadow p-4"
          >
            <div className="font-semibold">{cat.name}</div>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
              onClick={() => delCategory(cat._id)}
            >
              Delete
            </button>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500 italic">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
