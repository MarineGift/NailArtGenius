export default function Home() {
  const hasPublicEnv =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome to NailArtGenius</h1>
      <p className="text-gray-600">
        Build is TypeScript-first. This page is a typed Server Component.
      </p>

      {!hasPublicEnv && (
        <div className="rounded-lg border bg-yellow-50 p-4 text-sm">
          <b>Heads up:</b> Missing <code>NEXT_PUBLIC_SUPABASE_URL</code> or <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>.
          Some dynamic content will not render until these are set.
        </div>
      )}
    </section>
  )
}
