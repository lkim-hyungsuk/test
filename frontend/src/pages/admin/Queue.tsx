import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { fetchPendingArticles, approveArticle, rejectArticle } from "../../api";
import { getToken } from "./useAuth";

function ArticleCard({ article, token, onDone }: { article: any; token: string; onDone: () => void }) {
  const [note, setNote] = useState(article.clinical_relevance_note || "");
  const [tags, setTags] = useState<string[]>(article.tags || []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function approve() {
    if (!note.trim()) { setError("Write what this means for the reader's research before approving."); return; }
    setSaving(true);
    setError("");
    try {
      await approveArticle(token, article.id, note, tags);
      onDone();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function reject() {
    await rejectArticle(token, article.id);
    onDone();
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex justify-between items-start gap-4 mb-3">
        <div>
          <a href={article.full_url} target="_blank" rel="noreferrer"
             className="font-bold text-navy hover:text-forest text-sm leading-snug">
            {article.title}
          </a>
          <p className="text-xs text-gray-400 mt-0.5">{article.source_name}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button onClick={reject} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500 transition-colors">
            Reject
          </button>
          <button onClick={approve} disabled={saving}
                  className="text-xs px-3 py-1.5 rounded-lg bg-forest text-white hover:bg-navy transition-colors disabled:opacity-50">
            {saving ? "..." : "Approve"}
          </button>
        </div>
      </div>

      {article.original_summary && (
        <p className="text-xs text-gray-500 italic mb-3 line-clamp-3">{article.original_summary}</p>
      )}

      <label className="block text-xs font-bold text-forest mb-1">
        What this means for the reader's research *
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={2}
        placeholder="Write 1-2 plain-English sentences explaining how this news affects a medical student's or resident's research workflow..."
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-forest resize-none"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

      <div className="mt-2 flex gap-2 flex-wrap">
        {["Literature Review", "Study Design", "Data Analysis", "Clinical Research"].map((tag) => (
          <button
            key={tag}
            onClick={() => setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
            className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors ${
              tags.includes(tag) ? "bg-forest text-white border-forest" : "border-gray-200 text-gray-500 hover:border-forest"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Queue() {
  const navigate = useNavigate();
  const token = getToken();
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    load();
  }, [statusFilter]);

  function load() {
    setLoading(true);
    fetchPendingArticles(token!, statusFilter).then(setArticles).finally(() => setLoading(false));
  }

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-bold text-navy">Article queue</h1>
        <div className="flex gap-2">
          {["pending", "approved", "rejected"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
                    className={`text-xs px-3 py-1.5 rounded-lg font-medium capitalize transition-colors ${
                      statusFilter === s ? "bg-navy text-white" : "bg-white border border-gray-200 text-gray-600 hover:border-navy"
                    }`}>
              {s}
            </button>
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-6">
        Each article needs a plain-English note explaining what it means for a medical student's research workflow before it can be approved.
      </p>
      {loading && <p className="text-gray-400">Loading...</p>}
      <div className="grid gap-4">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} token={token!} onDone={load} />
        ))}
      </div>
      {!loading && articles.length === 0 && (
        <p className="text-gray-400 text-center py-16">No {statusFilter} articles.</p>
      )}
    </AdminLayout>
  );
}
