import Hero from "@/components/Hero";

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient glow effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
        <div className="absolute top-3/4 right-1/4 h-[250px] w-[350px] rounded-full bg-purple-600/6 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <Hero />
    </main>
  );
}
