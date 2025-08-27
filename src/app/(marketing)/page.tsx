import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="space-y-12">
      <section className="text-center space-y-6 card card-hover">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Bedtime tales, crafted by <span className="text-indigo-600">AI ✨</span>
        </h1>
        <p className="text-lg text-soft max-w-2xl mx-auto">
          Type a few characters and a setting—watch a magical, kid-safe story appear with a happy ending and a gentle moral.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/create" className="px-5 py-3 rounded-2xl bg-indigo-600 text-white hover:bg-indigo-500">
            Create a Story
          </Link>
          <a href="#features" className="px-5 py-3 rounded-2xl border border-gray-300 hover:bg-white">See Features</a>
        </div>
        <p className="text-sm text-dim">No scary stuff. Just wonder, warmth, and whimsy. 🌟</p>
      </section>

      <section id="features" className="grid gap-6 md:grid-cols-3">
        {[
          {title:"Personalized Adventures", desc:"Your child’s name and favorites woven through each chapter.", chip:"Custom"},
          {title:"Illustrations", desc:"Optional storybook images in watercolor, crayon, or cartoon styles.", chip:"Art"},
          {title:"Read Aloud", desc:"Soothing narration for cozy bedtime listening.", chip:"Audio"},
        ].map((c) => (
          <div key={c.title} className="card card-hover">
            <div className="badge badge-amber mb-3">{c.chip}</div>
            <h3 className="font-semibold mb-2">{c.title}</h3>
            <p className="text-soft">{c.desc}</p>
          </div>
        ))}
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card card-hover">
          <h3 className="font-semibold mb-2">Try a quick demo</h3>
          <p className="text-gray-600 mb-3">Head to the creator to preview an outline and generate a short story.</p>
          <Link href="/create" className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500">Open Creator →</Link>
        </div>
        <div className="card card-hover">
          <h3 className="font-semibold mb-2">Kid-safe by design</h3>
          <p className="text-gray-600">Built-in guardrails keep content gentle and positive. No brands, politics, or scary elements.</p>
        </div>
      </section>
    </main>
  );
}
