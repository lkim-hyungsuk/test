import React from "react";
import { BrowserRouter, Routes, Route, Link, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import TutorialPage from "./pages/TutorialPage";
import Archive from "./pages/Archive";
import IssuePage from "./pages/IssuePage";
import Subscribe from "./pages/Subscribe";
import AdminLogin from "./pages/admin/Login";
import AdminQueue from "./pages/admin/Queue";
import AdminCompose from "./pages/admin/Compose";
import AdminTutorials from "./pages/admin/Tutorials";
import AdminSubscribers from "./pages/admin/Subscribers";

function Nav() {
  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-forest" : "text-gray-600 hover:text-navy"}`;
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-serif text-xl font-bold text-navy">
          Research AI Weekly
        </Link>
        <nav className="flex gap-6">
          <NavLink to="/" end className={linkClass}>Guides</NavLink>
          <NavLink to="/archive" className={linkClass}>Archive</NavLink>
          <NavLink to="/subscribe" className={linkClass}>Subscribe</NavLink>
        </nav>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes — no public nav */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/queue" element={<AdminQueue />} />
        <Route path="/admin/compose" element={<AdminCompose />} />
        <Route path="/admin/tutorials" element={<AdminTutorials />} />
        <Route path="/admin/subscribers" element={<AdminSubscribers />} />

        {/* Public routes */}
        <Route path="/*" element={
          <div className="min-h-screen">
            <Nav />
            <main className="max-w-4xl mx-auto px-4 py-10">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/tutorials/:slug" element={<TutorialPage />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/archive/:id" element={<IssuePage />} />
                <Route path="/subscribe" element={<Subscribe />} />
              </Routes>
            </main>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}
