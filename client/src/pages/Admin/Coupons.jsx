import { useEffect, useState } from "react";
import { api } from "../../lib/api";

const Coupons = () => {
  const empty = {
    code: "",
    discountPct: 10,
    active: true,
    sourceTag: "website",
  };
  const [list, setList] = useState([]);
  const [form, setForm] = useState(empty);

  const load = async () => {
    const { data } = await api.get("/api/coupons");
    setList(data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    if (!form.code) return alert("Coupon code is required!");

    try {
      const token = localStorage.getItem("token"); // get the admin token
      if (!token) return alert("You must be logged in as admin!");

      await api.post("/api/coupons", form, {
        headers: { Authorization: `Bearer ${token}` }, // attach token
      });

      setForm(empty);
      load(); // reload coupons list
    } catch (err) {
      console.error("Error creating coupon:", err);
      alert(err.response?.data?.message || "Failed to create coupon");
    }
  };

  const del = async (id) => {
    if (confirm("Delete this coupon?")) {
      await api.delete(`/api/coupons/${id}`);
      load();
    }
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">🎟️ Manage Coupons</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Create / Edit Form */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Create New Coupon
          </h2>

          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Coupon Code
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-brand-200"
                placeholder="e.g. FESTIVE20"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Discount %
              </label>
              <input
                type="number"
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-brand-200"
                value={form.discountPct}
                onChange={(e) =>
                  setForm({ ...form, discountPct: Number(e.target.value) })
                }
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Source Tag
              </label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-brand-200"
                placeholder="e.g. Website, Mobile App"
                value={form.sourceTag}
                onChange={(e) =>
                  setForm({ ...form, sourceTag: e.target.value })
                }
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              <label className="text-sm text-gray-700">Active</label>
            </div>
          </div>

          <button
            onClick={save}
            className="w-full bg-brand-600 text-white rounded-lg py-2 font-medium hover:bg-brand-700 transition"
          >
            Create Coupon
          </button>
        </div>

        {/* Coupons List */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Available Coupons
          </h2>
          {list.length > 0 ? (
            <ul className="divide-y">
              {list.map((c) => (
                <li
                  key={c._id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{c.code}</p>
                    <p className="text-sm text-gray-500">
                      {c.discountPct}% off · {c.sourceTag}{" "}
                      {c.active ? (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded-full">
                          Inactive
                        </span>
                      )}
                    </p>
                  </div>
                  <button
                    onClick={() => del(c._id)}
                    className="text-sm px-3 py-1.5 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No coupons created yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Coupons;
