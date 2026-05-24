import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";

export default function CreateBlog() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    content: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/blogs", form);

      navigate("/admin/blogs");
    } catch (err) {
      console.log(err);
      alert("Failed to create blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#1E3A5F]">Create Blog</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow p-6 space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">Blog Title</label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Enter blog title"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Blog Image URL</label>

            <input
              type="text"
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border rounded-xl px-4 py-3"
              placeholder="Paste image URL"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Short Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Blog Content</label>

            <textarea
              name="content"
              value={form.content}
              onChange={handleChange}
              rows={10}
              className="w-full border rounded-xl px-4 py-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              bg-[#2E86AB]
              hover:bg-[#1E3A5F]
              text-white
              px-6 py-3
              rounded-xl
              font-semibold
            "
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}
