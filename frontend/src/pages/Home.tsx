import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchTutorials } from "../api";

const TAG_COLORS: Record<string, string> = {
  "Literature Review": "bg-blue-50 text-blue-700",
  "Study Design": "bg-purple-50 text-purple-700",
  "Data Analysis": "bg-amber-50 text-amber-700",
  "Clinical Research": "bg-green-50 text-green-700",
};

function tagColor(tag: string) {
  return TAG_COLORS[tag] || "bg-gray-100 text-gray-600";
}

export default function Home() {
  const [tutorials, setTutorials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTutorials().then(setTutorials).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-bold text-navy mb-3">
          AI tools for your research — in plain English
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Step-by-step guides that show medical students and residents how to use
          AI tools in their everyday research workflow. No technical background needed.
        </p>
        <Link
          to="/subscribe"
          className="inline-block mt-4 bg-forest text-white px-5 py-2.5 rounded-lg font-medium hover:bg-navy transition-colors"
        >
          Get the bi-weekly newsletter →
        </Link>
      </div>

      {loading && <p className="text-gray-400">Loading guides...</p>}

      <div className="grid gap-6">
        {tutorials.map((t) => (
          <Link
            key={t.id}
            to={`/tutorials/${t.slug}`}
            className="block bg-white rounded-xl border border-gray-100 p-6 hover:border-forest hover:shadow-sm transition-all group"
          >
            <h2 className="font-serif text-xl font-bold text-navy group-hover:text-forest transition-colors mb-2">
              {t.title}
            </h2>
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-gray-400">{t.reading_time_minutes} min read</span>
              {t.tags?.map((tag: string) => (
                <span key={tag} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${tagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {!loading && tutorials.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-2xl mb-2">Guides coming soon</p>
          <p>Subscribe to get notified when the first issue goes out.</p>
        </div>
      )}
    </div>
  );
}
