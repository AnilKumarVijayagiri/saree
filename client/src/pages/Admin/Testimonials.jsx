import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { CheckCircle, XCircle } from "lucide-react";

const Testimonials = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  
  const load = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/api/testimonials/admin");
      setList(data);
    } catch (error) {
      console.error('Error loading testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load testimonials initially and refresh every minute
  useEffect(() => {
    load();
    
    // Set up auto-refresh
    const refreshInterval = setInterval(load, 60000); // Refresh every minute
    
    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/api/testimonials/${id}/status`, { status });
      await load();
    } catch (error) {
      console.error('Error updating testimonial status:', error);
      alert('Failed to update testimonial status');
    }
  };

  const filteredList = list.filter(t => {
    // First apply status filter
    if (filter !== 'all' && t.status !== filter) {
      return false;
    }
    
    // Then apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        t.name?.toLowerCase().includes(searchLower) ||
        t.message?.toLowerCase().includes(searchLower) ||
        t.orderId?.toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });

  const stats = {
    all: list.length,
    pending: list.filter(t => !t.status || t.status === 'pending').length,
    approved: list.filter(t => t.status === 'approved').length,
    rejected: list.filter(t => t.status === 'rejected').length
  };

  return (
    <div className="p-6">
      {/* Header with Stats */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">Testimonials</h1>
          
          {/* Stats */}
          <div className="flex items-center gap-4">
            <div 
              className={`px-4 py-2 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${filter === 'all' ? 'ring-2 ring-brand-500' : ''}`} 
              onClick={() => setFilter('all')}
            >
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-xl font-semibold text-gray-800">{stats.all}</p>
            </div>
            <div 
              className={`px-4 py-2 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${filter === 'approved' ? 'ring-2 ring-brand-500' : ''}`}
              onClick={() => setFilter('approved')}
            >
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-xl font-semibold text-green-600">{stats.approved}</p>
            </div>
            <div 
              className={`px-4 py-2 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${filter === 'pending' ? 'ring-2 ring-brand-500' : ''}`}
              onClick={() => setFilter('pending')}
            >
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-xl font-semibold text-yellow-600">{stats.pending}</p>
            </div>
            <div 
              className={`px-4 py-2 bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow ${filter === 'rejected' ? 'ring-2 ring-brand-500' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-xl font-semibold text-red-600">{stats.rejected}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, message or order ID..."
              className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filter:</label>
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
            >
              <option value="all">All</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-600"></div>
        </div>
      ) : filteredList.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((t) => (
            <div
              key={t._id}
              className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-800">{t.name}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-yellow-500">
                      {"★".repeat(t.rating || 5)}
                      <span className="text-gray-300">{"☆".repeat(5 - (t.rating || 5))}</span>
                    </p>
                    <span className="text-sm text-gray-500">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 text-xs rounded-full font-medium ${
                    t.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : t.status === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-yellow-50 text-yellow-700"
                  }`}
                >
                  {t.status || "pending"}
                </span>
              </div>

              {/* Message */}
              <div className="mt-3 relative">
                <p className="text-gray-600 text-sm">
                  {t.message}
                </p>
                {t.orderId && (
                  <div className="mt-2 text-xs text-gray-400">
                    Order ID: {t.orderId}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="mt-4 flex items-center justify-end gap-2">
                {(!t.status || t.status === 'pending') && (
                  <>
                    <button
                      onClick={() => setStatus(t._id, "approved")}
                      className="p-2 rounded-full bg-green-50 text-green-600 hover:bg-green-100 transition-colors flex items-center gap-1"
                      title="Approve Testimonial"
                    >
                      <CheckCircle size={18} />
                      <span className="text-sm">Approve</span>
                    </button>
                    <button
                      onClick={() => setStatus(t._id, "rejected")}
                      className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-1"
                      title="Reject Testimonial"
                    >
                      <XCircle size={18} />
                      <span className="text-sm">Reject</span>
                    </button>
                  </>
                )}
                {t.status === 'approved' && (
                  <button
                    onClick={() => setStatus(t._id, "pending")}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Undo Approval
                  </button>
                )}
                {t.status === 'rejected' && (
                  <button
                    onClick={() => setStatus(t._id, "pending")}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Reconsider
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No {filter !== 'all' ? filter : ''} testimonials found.</p>
        </div>
      )}
    </div>
  );
};

export default Testimonials;
