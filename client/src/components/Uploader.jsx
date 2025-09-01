import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../store/useAuth"; // assuming you have a store

export default function Uploader({ onUploaded }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth(); // get token from auth store/context

  const upload = async () => {
    if (!files.length) return;
    const fd = new FormData();
    files.forEach((f) => fd.append("images", f));

    setLoading(true);
    try {
      const { data } = await api.post("/api/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
          
 // 👈 put token back
        },
        
      });
      console.log("Using token:", token);

      onUploaded?.(data.urls);
      setFiles([]); // clear after upload
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-col sm:flex-row sm:items-center gap-2 w-full">
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
        className="border rounded-lg px-3 py-2 w-full sm:w-auto"
      />
      <button
        type="button"
        onClick={upload}
        className="bg-brand-600 text-white py-2 px-4 rounded-lg hover:bg-brand-700 w-full sm:w-auto"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
