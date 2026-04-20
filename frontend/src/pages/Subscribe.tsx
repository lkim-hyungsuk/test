import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { subscribe } from "../api";

export default function Subscribe() {
  const [params] = useSearchParams();
  const confirmed = params.get("confirmed");
  const unsubscribed = params.get("unsubscribed");

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const res = await subscribe(email);
      setMessage(res.message);
      setEmail("");
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      {confirmed && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 mb-8">
          You're confirmed! You'll receive the next issue in your inbox.
        </div>
      )}
      {unsubscribed && (
        <div className="bg-gray-50 border border-gray-200 text-gray-600 rounded-xl p-5 mb-8">
          You've been unsubscribed. Sorry to see you go.
        </div>
      )}

      <h1 className="font-serif text-3xl font-bold text-navy mb-3">
        Stay up to date — without the jargon
      </h1>
      <p className="text-gray-600 mb-2">
        <strong>Research AI Weekly</strong> is a bi-weekly newsletter for medical students
        and residents who want to use AI tools in their research — but don't have a technical background.
      </p>
      <ul className="text-gray-600 mb-8 space-y-2 list-none">
        {[
          "Step-by-step guides written for clinical workflows",
          "AI news explained in plain English — with context for what it means for your research",
          "No coding. No jargon. No prior AI experience needed.",
        ].map((item) => (
          <li key={item} className="flex gap-2">
            <span className="text-forest font-bold">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>

      {message ? (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 text-center">
          {message}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-forest text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-navy transition-colors disabled:opacity-50"
          >
            {loading ? "..." : "Subscribe"}
          </button>
        </form>
      )}
      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      <p className="text-xs text-gray-400 mt-4">No spam. Unsubscribe anytime from any email.</p>
    </div>
  );
}
