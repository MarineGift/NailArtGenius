// app/page.tsx
import Link from "next/link";
import { Palette, Camera, Scissors, Heart } from "lucide-react";

export const metadata = {
  title: "Connie's Nail — Washington DC Premium Nail Salon",
  description: "Premium nail salon • AI nail art • Booking • Gallery • Contact",
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-pink-50">
      {/* HERO */}
      <section
        className="relative h-[58vh] w-full overflow-hidden"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0.25)), url('/hero.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" />
        <div className="relative z-10 h-full max-w-6xl mx-auto px-4 flex items-center justify-center text-center">
          <div>
            <h1 className="text-white text-4xl md:text-5xl font-extrabold drop-shadow">
              Connie&apos;s Nail Salon
            </h1>
            <p className="mt-3 text-white/90 text-lg md:text-xl drop-shadow">
              Washington DC Premium Nail Salon
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="#services"
                className="rounded-xl bg-pink-600 text-white px-5 py-3 font-semibold hover:bg-pink-700 transition"
              >
                Explore Services
              </Link>
              <Link
                href="/booking"
                className="rounded-xl bg-white/90 text-pink-700 px-5 py-3 font-semibold hover:bg-white transition"
              >
                Book Now
              </Link>
            </div>
            {/* 작은 도트 인디케이터(시각적만) */}
            <div className="mt-8 flex justify-center gap-2">
              {[0, 1, 2, 3].map((i) => (
                <span
                  key={i}
                  className={`h-2 w-2 rounded-full ${
                    i === 0 ? "bg-white" : "bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">
          <div className="text-pink-600 text-2xl">⭐ 💅</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-pink-700">
            Connie&apos;s Nail Premium Services
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            From traditional nail care to innovative AI nail art,{" "}
            <span className="text-pink-500 font-semibold">perfect beauty care experience</span>{" "}
            awaits you.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ServiceCard
            icon={<Palette className="h-6 w-6" />}
            title="Spa Manicure"
            desc="Perfect nail care with premium spa treatment"
          />
          <ServiceCard
            icon={<Camera className="h-6 w-6" />}
            title="AI Nail Art Generation"
            desc="AI creates unique personalized nail designs just for you"
          />
          <ServiceCard
            icon={<Scissors className="h-6 w-6" />}
            title="Professional Waxing"
            desc="Professional waxing care services from face to full body"
          />
          <ServiceCard
            icon={<Heart className="h-6 w-6" />}
            title="Massage Therapy"
            desc="Relaxing therapy for comfortable, balanced wellness"
          />
        </div>
      </section>
    </main>
  );
}

function ServiceCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl bg-white shadow-sm border p-6 hover:shadow-md transition">
      <div className="h-10 w-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-gray-600">{desc}</p>
    </div>
  );
}
