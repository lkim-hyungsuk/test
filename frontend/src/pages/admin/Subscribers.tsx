import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { fetchAdminSubscribers } from "../../api";
import { getToken } from "./useAuth";

export default function Subscribers() {
  const navigate = useNavigate();
  const token = getToken();
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    fetchAdminSubscribers(token).then(setSubscribers).finally(() => setLoading(false));
  }, []);

  const confirmed = subscribers.filter(s => s.confirmed && !s.unsubscribed_at);
  const pending = subscribers.filter(s => !s.confirmed && !s.unsubscribed_at);
  const unsubscribed = subscribers.filter(s => s.unsubscribed_at);

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-bold text-navy mb-2">Subscribers</h1>
      <div className="flex gap-6 mb-8 text-sm">
        <div><span className="font-bold text-forest text-2xl">{confirmed.length}</span><p className="text-gray-500">Confirmed</p></div>
        <div><span className="font-bold text-amber-600 text-2xl">{pending.length}</span><p className="text-gray-500">Pending confirmation</p></div>
        <div><span className="font-bold text-gray-400 text-2xl">{unsubscribed.length}</span><p className="text-gray-500">Unsubscribed</p></div>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {subscribers.map((s) => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-700">{s.email}</td>
                <td className="px-4 py-3">
                  {s.unsubscribed_at ? (
                    <span className="text-xs text-gray-400">Unsubscribed</span>
                  ) : s.confirmed ? (
                    <span className="text-xs text-forest font-medium">Confirmed</span>
                  ) : (
                    <span className="text-xs text-amber-600">Pending</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {s.subscribed_at ? new Date(s.subscribed_at).toLocaleDateString() : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && subscribers.length === 0 && (
          <p className="text-center text-gray-400 py-8">No subscribers yet.</p>
        )}
      </div>
    </AdminLayout>
  );
}
