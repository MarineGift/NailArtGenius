// app/page.tsx
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold">Connie’s Nail — NEW DEPLOY</h1>
      <p className="mt-2">
        If you still see the old “Build Successful!” page at /, your domain is pointing to a different service
        or Railway is serving an old build cache.
      </p>
    </main>
  );
}
