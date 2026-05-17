import { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import API from "../services/adminService";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await API.get("/contacts");
      setContacts(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Contact Messages</h1>

        <div className="grid gap-4">
          {contacts.map((c) => (
            <div key={c._id} className="bg-white p-5 rounded-2xl shadow">
              <h2 className="font-bold">{c.name}</h2>

              <p className="text-gray-500">{c.email}</p>

              <p className="mt-3">{c.message}</p>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
