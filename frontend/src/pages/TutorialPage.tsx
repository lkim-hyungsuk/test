import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { fetchTutorial } from "../api";

export default function TutorialPage() {
  const { slug } = useParams<{ slug: string }>();
  const [tutorial, setTutorial] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;
    fetchTutorial(slug).then(setTutorial).catch(() => setError("Guide not found."));
  }, [slug]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!tutorial) return <p className="text-gray-400">Loading...</p>;

  return (
    <article>
      <Link to="/" className="text-forest text-sm hover:underline mb-6 inline-block">
        ← All guides
      </Link>
      <div className="bg-green-50 border border-green-100 rounded-xl p-6 mb-8">
        <p className="text-xs text-forest font-bold uppercase tracking-widest mb-2">Guide</p>
        <h1 className="font-serif text-3xl font-bold text-navy mb-3">{tutorial.title}</h1>
        <div className="flex gap-2 flex-wrap">
          <span className="text-sm text-gray-500">{tutorial.reading_time_minutes} min read</span>
          {tutorial.tags?.map((tag: string) => (
            <span key={tag} className="text-xs bg-white border border-green-200 text-forest px-2.5 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="prose max-w-none">
        <ReactMarkdown>{tutorial.content}</ReactMarkdown>
      </div>
      <div className="mt-12 bg-navy text-white rounded-xl p-8 text-center">
        <p className="font-serif text-xl font-bold mb-2">Get guides like this in your inbox</p>
        <p className="text-gray-300 mb-4 text-sm">
          Bi-weekly newsletter for medical students and residents — practical AI tips for your research workflow.
        </p>
        <Link
          to="/subscribe"
          className="inline-block bg-mint text-navy font-bold px-6 py-2.5 rounded-lg hover:bg-white transition-colors"
        >
          Subscribe free →
        </Link>
      </div>
    </article>
  );
}
