"use client";
import { useState } from "react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("This is a placeholder login page. Wire up Supabase auth in /lib/supabase.ts and call signInWithPassword here.");
  };

  return (
    <main className="min-h-screen p-8">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <form onSubmit={handleSubmit} className="mt-4 max-w-sm space-y-3">
        <input
          className="w-full border p-2 rounded"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">
          Sign in
        </button>
      </form>
      {msg && <p className="mt-3 text-sm">{msg}</p>}
    </main>
  );
}
