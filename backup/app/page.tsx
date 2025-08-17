export default function Home() {
  const ts = new Date().toISOString()
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-extrabold text-blue-600">NailArt Genius — TS App Router</h1>
      <p className="text-gray-600">If you can read this, the new build is live.</p>
      <div className="rounded border p-3 text-sm">
        <b>Build marker:</b> {ts}
      </div>
    </section>
  )
}
