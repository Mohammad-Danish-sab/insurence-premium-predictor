import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";

export default function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blogs");
      setBlogs(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Blogs</h1>

        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div key={blog._id} className="bg-white p-5 rounded-2xl shadow">
              <h2 className="font-bold text-xl">{blog.title}</h2>

              <p className="text-gray-500 mt-2">{blog.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
