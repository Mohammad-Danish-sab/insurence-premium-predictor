import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, FileText, Loader2 } from "lucide-react";

import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);

      const res = await API.get("/blogs");

      setBlogs(res.data.blogs || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?",
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/blogs/${id}`);

      fetchBlogs();
    } catch (err) {
      console.log(err);
      alert("Failed to delete blog");
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-[#1E3A5F]">
              Blogs Management
            </h1>

            <p className="text-gray-500 mt-1">
              Create, edit and manage blog posts
            </p>
          </div>

          <Link
            to="/admin/blogs/create"
            className="
              flex items-center gap-2
              bg-[#2E86AB]
              hover:bg-[#1E3A5F]
              text-white
              px-5 py-3
              rounded-xl
              font-semibold
              transition
            "
          >
            <Plus className="w-5 h-5" />
            Create Blog
          </Link>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#2E86AB]" />
          </div>
        ) : blogs.length === 0 ? (
          /* Empty State */
          <div
            className="
              bg-white
              rounded-2xl
              shadow-sm
              border
              p-12
              text-center
            "
          >
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />

            <h2 className="text-2xl font-bold text-[#1E3A5F] mb-2">
              No Blogs Found
            </h2>

            <p className="text-gray-500 mb-6">
              Start by creating your first blog post
            </p>

            <Link
              to="/admin/blogs/create"
              className="
                inline-flex items-center gap-2
                bg-[#2E86AB]
                hover:bg-[#1E3A5F]
                text-white
                px-5 py-3
                rounded-xl
                font-semibold
                transition
              "
            >
              <Plus className="w-5 h-5" />
              Create Blog
            </Link>
          </div>
        ) : (
          /* Blog Cards */
          <div className="grid lg:grid-cols-2 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="
                  bg-white
                  rounded-2xl
                  overflow-hidden
                  shadow-sm
                  border
                  hover:shadow-lg
                  transition
                "
              >
                {/* Image */}
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div
                    className="
                      w-full h-56
                      bg-gradient-to-r
                      from-[#1E3A5F]
                      to-[#2E86AB]
                      flex items-center justify-center
                    "
                  >
                    <FileText className="w-16 h-16 text-white opacity-70" />
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="
                        text-xs
                        bg-blue-100
                        text-blue-700
                        px-3 py-1
                        rounded-full
                      "
                    >
                      Blog Post
                    </span>

                    <span className="text-sm text-gray-400">
                      {new Date(blog.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <h2 className="text-2xl font-bold text-[#1E3A5F] mb-3">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 leading-relaxed line-clamp-3">
                    {blog.content}
                  </p>

                  {/* Author */}
                  <div className="mt-4 text-sm text-gray-500">
                    By{" "}
                    <span className="font-semibold text-[#2E86AB]">
                      {blog.author}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 mt-6">
                    <Link
                      to={`/admin/blogs/edit/${blog._id}`}
                      className="
                        flex items-center gap-2
                        bg-yellow-500
                        hover:bg-yellow-600
                        text-white
                        px-4 py-2
                        rounded-lg
                        transition
                      "
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="
                        flex items-center gap-2
                        bg-red-500
                        hover:bg-red-600
                        text-white
                        px-4 py-2
                        rounded-lg
                        transition
                      "
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
