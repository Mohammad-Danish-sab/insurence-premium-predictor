import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";

export default function EditBlog() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    image: "",
  });

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await API.get(`/blogs/${id}`);

      setForm({
        title: res.data.title || "",
        content: res.data.content || "",
        author: res.data.author || "",
        image: res.data.image || "",
      });
    } catch (err) {
      console.log(err);
    }
  };

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

      await API.put(`/admin/blogs/${id}`, form);

      alert("Blog updated successfully");

      navigate("/admin/blogs");
    } catch (err) {
      console.log(err);

      alert("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="bg-white rounded-3xl shadow-lg p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1E3A5F] mb-8">Edit Blog</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Blog Title
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter blog title"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-[#2E86AB]
                "
                required
              />
            </div>

            {/* Author */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Author Name
              </label>

              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-[#2E86AB]
                "
                required
              />
            </div>

            {/* Image */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Image URL
              </label>

              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="Enter image URL"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-[#2E86AB]
                "
              />
            </div>

            {/* Content */}
            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Blog Content
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                rows="10"
                placeholder="Write your blog content..."
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-3
                  outline-none
                  focus:ring-2
                  focus:ring-[#2E86AB]
                "
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="
                bg-[#2E86AB]
                hover:bg-[#1E3A5F]
                text-white
                px-6
                py-3
                rounded-xl
                font-semibold
                transition
              "
            >
              {loading ? "Updating..." : "Update Blog"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
}
