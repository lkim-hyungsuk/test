import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchIssue } from "../api";

export default function IssuePage() {
  const { id } = useParams<{ id: string }>();
  const [issue, setIssue] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    fetchIssue(Number(id)).then(setIssue).catch(() => setError("Issue not found."));
  }, [id]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!issue) return <p className="text-gray-400">Loading...</p>;

  return (
    <div>
      <Link to="/archive" className="text-forest text-sm hover:underline mb-6 inline-block">
        ← All issues
      </Link>
      <h1 className="font-serif text-3xl font-bold text-navy mb-2">{issue.title}</h1>
      {issue.sent_at && (
        <p className="text-sm text-gray-400 mb-8">
          {new Date(issue.sent_at).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      )}
      {issue.html_content ? (
        <div
          className="bg-white rounded-xl border border-gray-100 overflow-hidden"
          dangerouslySetInnerHTML={{ __html: issue.html_content }}
        />
      ) : (
        <p className="text-gray-400">Content unavailable.</p>
      )}
    </div>
  );
}
