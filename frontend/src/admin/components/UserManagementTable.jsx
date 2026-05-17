import { Trash2, Eye } from "lucide-react";

export default function UserManagementTable() {
  const users = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      role: "User",
      status: "Active",
    },
    {
      id: 2,
      name: "Aman Khan",
      email: "aman@gmail.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: 3,
      name: "Priya Verma",
      email: "priya@gmail.com",
      role: "User",
      status: "Blocked",
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1E3A5F]">User Management</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-500">
                Name
              </th>

              <th className="text-left px-6 py-4 text-sm text-gray-500">
                Email
              </th>

              <th className="text-left px-6 py-4 text-sm text-gray-500">
                Role
              </th>

              <th className="text-left px-6 py-4 text-sm text-gray-500">
                Status
              </th>

              <th className="text-left px-6 py-4 text-sm text-gray-500">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4 font-medium text-[#1E3A5F]">
                  {user.name}
                </td>

                <td className="px-6 py-4 text-gray-600">{user.email}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      user.role === "Admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>

                <td className="px-6 py-4 flex items-center gap-3">
                  <button className="text-blue-600 hover:text-blue-800">
                    <Eye className="w-4 h-4" />
                  </button>

                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
