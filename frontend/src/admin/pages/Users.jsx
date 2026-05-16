import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";
import { Trash2 } from "lucide-react";

function Users() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);

  const [total, setTotal] = useState(0);

  const limit = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await API.get(
        `/admin/users?page=${page}&limit=${limit}`,
      );

      setUsers(response.data.users);

      setTotal(response.data.total);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Delete this user?");

    if (!confirmDelete) return;

    try {
      await API.delete(`/admin/users/${id}`);

      fetchUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Users Management</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center">Loading...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left">Name</th>

                <th className="p-4 text-left">Email</th>

                <th className="p-4 text-left">Role</th>

                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b">
                  <td className="p-4">{user.full_name}</td>

                  <td className="p-4">{user.email}</td>

                  <td className="p-4 capitalize">{user.role}</td>

                  <td className="p-4">
                    <button
                      onClick={() => deleteUser(user._id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}

      <div className="flex justify-center gap-3 mt-6">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-4 py-2 bg-black text-white rounded-lg disabled:bg-gray-400"
        >
          Prev
        </button>

        <span className="px-4 py-2">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-4 py-2 bg-black text-white rounded-lg disabled:bg-gray-400"
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
}

export default Users;
