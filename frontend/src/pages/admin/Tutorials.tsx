import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import { fetchAdminTutorials, createTutorial, updateTutorial, deleteTutorial } from "../../api";
import { getToken } from "./useAuth";

const AVAILABLE_TAGS = ["Literature Review", "Study Design", "Data Analysis", "Clinical Research"];

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

const EMPTY_FORM = { title: "", slug: "", content: "", reading_time_minutes: 5, tags: [] as string[], published: false };

export default function AdminTutorials() {
  const navigate = useNavigate();
  const token = getToken();
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) { navigate("/admin/login"); return; }
    load();
  }, []);

  function load() {
    fetchAdminTutorials(token!).then(setTutorials);
  }

  function startNew() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  function startEdit(t: any) {
    setEditing(t);
    setForm({ title: t.title, slug: t.slug, content: t.content, reading_time_minutes: t.reading_time_minutes, tags: t.tags, published: t.published });
    setError("");
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      if (editing) {
        await updateTutorial(token!, editing.id, form);
      } else {
        await createTutorial(token!, form);
      }
      load();
      startNew();
    } catch (e: any) { setError(e.message); }
    finally { setSaving(false); }
  }

  async function remove(id: number) {
    if (!window.confirm("Delete this tutorial?")) return;
    await deleteTutorial(token!, id);
    load();
  }

  function toggleTag(tag: string) {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  }

  return (
    <AdminLayout>
      <div className="grid grid-cols-5 gap-8">
        {/* Left: list */}
        <div className="col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h1 className="font-serif text-2xl font-bold text-navy">Tutorials</h1>
            <button onClick={startNew} className="text-xs px-3 py-1.5 bg-forest text-white rounded-lg hover:bg-navy transition-colors">
              + New
            </button>
          </div>
          <div className="grid gap-3">
            {tutorials.map((t) => (
              <div key={t.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="font-medium text-navy text-sm leading-snug mb-1">{t.title}</p>
                <div className="flex justify-between items-center">
                  <span className={`text-xs ${t.published ? "text-forest" : "text-gray-400"}`}>
                    {t.published ? "Published" : "Draft"}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(t)} className="text-xs text-forest hover:underline">Edit</button>
                    <button onClick={() => remove(t.id)} className="text-xs text-red-400 hover:underline">Delete</button>
                  </div>
                </div>
              </div>
            ))}
            {tutorials.length === 0 && <p className="text-gray-400 text-sm">No tutorials yet.</p>}
          </div>
        </div>

        {/* Right: editor */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-bold text-navy mb-4">{editing ? "Edit tutorial" : "New tutorial"}</h2>

          <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm(f => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-forest"
            placeholder="How to use AI for literature review"
          />

          <label className="block text-xs font-medium text-gray-600 mb-1">Slug (auto-filled)</label>
          <input
            value={form.slug}
            onChange={(e) => setForm(f => ({ ...f, slug: e.target.value }))}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-forest font-mono"
          />

          <label className="block text-xs font-medium text-gray-600 mb-1">Reading time (minutes)</label>
          <input
            type="number" min={1} max={60}
            value={form.reading_time_minutes}
            onChange={(e) => setForm(f => ({ ...f, reading_time_minutes: Number(e.target.value) }))}
            className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-forest"
          />

          <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
          <div className="flex gap-2 flex-wrap mb-3">
            {AVAILABLE_TAGS.map((tag) => (
              <button key={tag} onClick={() => toggleTag(tag)}
                      className={`text-xs px-2.5 py-0.5 rounded-full border transition-colors ${
                        form.tags.includes(tag) ? "bg-forest text-white border-forest" : "border-gray-200 text-gray-500 hover:border-forest"
                      }`}>
                {tag}
              </button>
            ))}
          </div>

          <label className="block text-xs font-medium text-gray-600 mb-1">Content (Markdown)</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm(f => ({ ...f, content: e.target.value }))}
            rows={14}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-forest font-mono resize-none"
            placeholder="## Step 1&#10;&#10;Explain clearly..."
          />

          <div className="flex items-center gap-3 mb-4">
            <input
              type="checkbox" id="published" checked={form.published}
              onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="published" className="text-sm text-gray-700">Published (visible to public)</label>
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <div className="flex gap-3">
            <button onClick={save} disabled={saving}
                    className="bg-forest text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-navy transition-colors disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={startNew} className="text-gray-400 text-sm hover:text-gray-600">Cancel</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
