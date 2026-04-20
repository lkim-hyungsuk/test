import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import {
  fetchPendingArticles, fetchAdminTutorials, fetchAdminNewsletters,
  createNewsletter, sendNewsletter,
} from "../../api";
import { getToken } from "./useAuth";

export default function Compose() {
  const navigate = useNavigate();
  const token = getToken();

  const [approvedArticles, setApprovedArticles] = useState<any[]>([]);
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [newsletters, setNewsletters] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [tutorialId, setTutorialId] = useState<number | null>(null);
  const [selectedArticleIds, setSelectedArticleIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    fetchPendingArticles(token, "approved").then(setApprovedArticles);
    fetchAdminTutorials(token).then(ts => setTutorials(ts.filter((t: any) => t.published)));
    fetchAdminNewsletters(token).then(setNewsletters);
  }, []);

  function toggleArticle(id: number) {
    setSelectedArticleIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }

  async function handleCreate() {
    setError(""); setSuccess("");
    if (!title.trim() || !subject.trim()) { setError("Title and subject line are required."); return; }
    if (!tutorialId) { setError("Select a featured tutorial — every issue must lead with a guide."); return; }
    if (selectedArticleIds.length === 0) { setError("Select at least one article."); return; }
    setSaving(true);
    try {
      await createNewsletter(token!, { title, subject_line: subject, featured_tutorial_id: tutorialId, article_ids: selectedArticleIds });
      setSuccess("Issue created as draft.");
      fetchAdminNewsletters(token!).then(setNewsletters);
      setTitle(""); setSubject(""); setTutorialId(null); setSelectedArticleIds([]);
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function handleSend(id: number) {
    if (!window.confirm("Send this issue to all confirmed subscribers?")) return;
    try {
      const res = await sendNewsletter(token!, id);
      setSuccess(`Sent to ${res.sent_to} subscriber(s).`);
      fetchAdminNewsletters(token!).then(setNewsletters);
    } catch (e: any) { setError(e.message); }
  }

  return (
    <AdminLayout>
      <h1 className="font-serif text-2xl font-bold text-navy mb-6">Compose issue</h1>

      <div className="grid grid-cols-2 gap-8">
        {/* Compose form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-navy mb-4 text-sm">New issue</h2>

          <label className="block text-xs font-medium text-gray-600 mb-1">Issue title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
                 className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-forest"
                 placeholder="e.g. Issue #3 — April 2026" />

          <label className="block text-xs font-medium text-gray-600 mb-1">Email subject line</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)}
                 className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-forest"
                 placeholder="e.g. How AI is changing literature reviews for residents" />

          <label className="block text-xs font-bold text-forest mb-2">Featured guide (required)</label>
          <div className="grid gap-2 mb-4">
            {tutorials.length === 0 && <p className="text-gray-400 text-xs">No published tutorials yet.</p>}
            {tutorials.map((t) => (
              <button key={t.id} onClick={() => setTutorialId(t.id)}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                        tutorialId === t.id ? "border-forest bg-green-50 text-forest font-medium" : "border-gray-200 text-gray-600 hover:border-forest"
                      }`}>
                {t.title} ({t.reading_time_minutes} min)
              </button>
            ))}
          </div>

          <label className="block text-xs font-bold text-gray-700 mb-2">
            Articles ({selectedArticleIds.length} selected)
          </label>
          <div className="grid gap-2 mb-4 max-h-60 overflow-y-auto pr-1">
            {approvedArticles.length === 0 && <p className="text-gray-400 text-xs">No approved articles yet.</p>}
            {approvedArticles.map((a) => (
              <button key={a.id} onClick={() => toggleArticle(a.id)}
                      className={`text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                        selectedArticleIds.includes(a.id) ? "border-forest bg-green-50 text-forest" : "border-gray-200 text-gray-600 hover:border-forest"
                      }`}>
                <span className="font-medium">{a.title}</span>
                <span className="text-gray-400"> · {a.source_name}</span>
                {a.clinical_relevance_note && (
                  <p className="text-gray-400 mt-0.5 line-clamp-1">{a.clinical_relevance_note}</p>
                )}
              </button>
            ))}
          </div>

          {error && <p className="text-red-500 text-xs mb-3">{error}</p>}
          {success && <p className="text-green-600 text-xs mb-3">{success}</p>}
          <button onClick={handleCreate} disabled={saving}
                  className="bg-forest text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-navy transition-colors disabled:opacity-50">
            {saving ? "Creating..." : "Save as draft"}
          </button>
        </div>

        {/* Drafts / sent */}
        <div>
          <h2 className="font-bold text-navy mb-4 text-sm">Issues</h2>
          <div className="grid gap-3">
            {newsletters.map((nl) => (
              <div key={nl.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="font-medium text-navy text-sm">{nl.title}</p>
                    <p className="text-xs text-gray-400">{nl.subject_line}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    nl.status === "sent" ? "bg-green-50 text-forest" : "bg-amber-50 text-amber-700"
                  }`}>
                    {nl.status}
                  </span>
                </div>
                {nl.status !== "sent" && (
                  <button onClick={() => handleSend(nl.id)}
                          className="mt-3 text-xs px-3 py-1.5 bg-navy text-white rounded-lg hover:bg-forest transition-colors">
                    Send to subscribers
                  </button>
                )}
                {nl.sent_at && (
                  <p className="text-xs text-gray-400 mt-2">
                    Sent {new Date(nl.sent_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
            {newsletters.length === 0 && <p className="text-gray-400 text-sm">No issues yet.</p>}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
