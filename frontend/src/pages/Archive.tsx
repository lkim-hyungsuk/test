import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchArchive } from "../api";

export default function Archive() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArchive().then(setIssues).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-serif text-3xl font-bold text-navy mb-2">Past issues</h1>
      <p className="text-gray-500 mb-8">Every issue starts with a step-by-step guide, followed by curated news with plain-English context.</p>

      {loading && <p className="text-gray-400">Loading...</p>}

      <div className="grid gap-4">
        {issues.map((issue) => (
          <Link
            key={issue.id}
            to={`/archive/${issue.id}`}
            className="block bg-white rounded-xl border border-gray-100 p-5 hover:border-forest hover:shadow-sm transition-all group"
          >
            <div className="flex justify-between items-start gap-4">
              <h2 className="font-serif text-lg font-bold text-navy group-hover:text-forest transition-colors">
                {issue.title}
              </h2>
              {issue.sent_at && (
                <span className="text-sm text-gray-400 shrink-0">
                  {new Date(issue.sent_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{issue.subject_line}</p>
          </Link>
        ))}
      </div>

      {!loading && issues.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl mb-2">No issues sent yet</p>
          <Link to="/subscribe" className="text-forest hover:underline">Subscribe to get the first issue →</Link>
        </div>
      )}
    </div>
  );
}
