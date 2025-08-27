'use client';

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { Textarea } from "@/components/Textarea";
import { Button } from "@/components/Button";
import type { CreateStoryRequest, StoryJSON } from "@/lib/contracts";

function titleCase(str: string) {
  return str.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
}

type Step = "input" | "outline" | "story";

const GENRES = ["adventure","fantasy","mystery","sci-fi","moral tale"];
const STYLES = ["watercolor","crayon","cartoon","vector"];
const LEVELS = ["K-1","G2-3","G4-5"] as const;

export default function CreatePage() {
  const [step, setStep] = useState<Step>("input");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [request, setRequest] = useState<CreateStoryRequest>({
    names: [""],
    ageOrGrade: "",
    genre: "adventure",
    setting: "a cozy forest",
    moral: "kindness matters",
    readingLevel: "K-1",
    wordCount: 600,
    illustrationStyle: "watercolor"
  });
  const [story, setStory] = useState<StoryJSON | null>(null);

  const outline = request.names[0]
    ? [
        { heading: `A New Day in ${request.setting}` },
        { heading: "A Friendly Guide Appears" },
        { heading: "The Little Challenge" },
        { heading: "Home with a Happy Heart" },
      ]
    : [];

  // Confetti canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const confettiTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (confettiTimer.current) cancelAnimationFrame(confettiTimer.current);
    }
  }, []);

  function launchConfetti() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width = window.innerWidth;
    const H = canvas.height = 300;
    const pieces = Array.from({ length: 120 }, () => ({
      x: Math.random() * W,
      y: Math.random() * -H,
      r: 4 + Math.random() * 6,
      c: `hsl(${Math.random()*360},90%,60%)`,
      s: 2 + Math.random() * 3,
      a: Math.random() * Math.PI
    }));

    function draw() {
      ctx.clearRect(0,0,W,H);
      pieces.forEach(p => {
        p.y += p.s;
        p.x += Math.sin(p.a += 0.03) * 1.2;
        if (p.y > H + 20) p.y = -10;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
        ctx.fill();
      });
      confettiTimer.current = requestAnimationFrame(draw);
      setTimeout(() => { if (confettiTimer.current) cancelAnimationFrame(confettiTimer.current); }, 1600);
    }
    draw();
  }

  async function generate() {
    setLoading(true); setError(null);
    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });
      if (!res.ok) throw new Error((await res.json()).error || "Failed to generate");
      const data = await res.json();
      setStory(data.story);
      setStep("story");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(launchConfetti, 250);
    } catch (e:any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="space-y-8 relative">
      <canvas ref={canvasRef} className="absolute left-0 right-0 top-0 pointer-events-none" />
      <h1 className="text-3xl font-extrabold">Create a Magical Story ✨</h1>
      <Stepper step={step} />

      {step === "input" && (
        <section className="grid gap-6 md:grid-cols-3">
          {/* Left: Form */}
          <div className="md:col-span-2 card card-hover space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Child name(s) (comma-separated)"
                placeholder="Avery, Sam"
                value={request.names.join(", ")}
                onChange={(e) =>
                  setRequest({ ...request, names: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })
                }
              />
              <Input
                label="Age or Grade"
                placeholder="Grade 2"
                value={request.ageOrGrade}
                onChange={(e) => setRequest({ ...request, ageOrGrade: e.target.value })}
              />
              <Input
                label="Setting"
                placeholder="enchanted garden"
                value={request.setting}
                onChange={(e) => setRequest({ ...request, setting: e.target.value })}
              />
              <Input
                label="Moral / Theme"
                placeholder="Share and be kind"
                value={request.moral}
                onChange={(e) => setRequest({ ...request, moral: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm opacity-80">Genre</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {GENRES.map(g => (
                  <button
                    key={g}
                    onClick={() => setRequest({ ...request, genre: g })}
                    className={`badge ${request.genre===g?'badge-indigo':'bg-white border'} border-[rgb(var(--border))]`}
                    type="button"
                  >
                    {emojiForGenre(g)} {g}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm opacity-80">Reading Level</label>
                <div className="mt-2 flex gap-2">
                  {LEVELS.map(l => (
                    <button
                      key={l}
                      onClick={() => setRequest({ ...request, readingLevel: l })}
                      className={`badge ${request.readingLevel===l?'badge-emerald':'bg-white border'} border-[rgb(var(--border))]`}
                      type="button"
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm opacity-80">Word Count: {request.wordCount}</label>
                <input
                  type="range" min={400} max={1500} step={50}
                  className="w-full"
                  value={request.wordCount}
                  onChange={(e) => setRequest({ ...request, wordCount: Number(e.target.value) })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm opacity-80">Illustration Style</label>
              <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
                {STYLES.map(s => (
                  <button
                    key={s}
                    onClick={() => setRequest({ ...request, illustrationStyle: s as any })}
                    className={`card ${request.illustrationStyle===s?'ring-2':'border-dashed'} text-sm`}
                    type="button"
                  >
                    {sTitle(s)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep("outline")} disabled={!request.names.length || !request.setting}>Preview Outline</Button>
              <Button variant="secondary" onClick={generate} disabled={loading}>
                {loading ? "Generating" : "Generate Story"}{loading && <span className="dots"></span>}
              </Button>
            </div>
            {error && <p className="text-red-500">{error}</p>}
          </div>

          {/* Right: SVG cover preview + download */}
          <div className="card card-hover space-y-3">
            <CoverSVG
                  title={request.names[0] ? `${request.names[0]}'s ${titleCase(request.genre)}` : "Your Story Title"}
                  subtitle={`in ${request.setting || "a magical place"}`}
            />
            <DownloadCoverButton
                  title={request.names[0] ? `${request.names[0]}'s ${titleCase(request.genre)}` : "Your Story Title"}
                  subtitle={`in ${request.setting || "a magical place"}`}
            />

            <ul className="mt-1 space-y-1 text-sm opacity-80">
              <li>• Level: {request.readingLevel}</li>
              <li>• Target words: {request.wordCount}</li>
              <li>• Style: {request.illustrationStyle}</li>
            </ul>
          </div>
        </section>
      )}

      {step === "outline" && (
        <section className="space-y-4 card card-hover">
          <h2 className="text-xl font-semibold">Outline Preview</h2>
          {!outline.length && <p className="opacity-80">Add at least one name to see the outline.</p>}
          <ol className="list-decimal ml-6 space-y-1">
            {outline.map((ch, i) => <li key={i}>{ch.heading}</li>)}
          </ol>
          <div className="flex gap-3">
            <Button onClick={() => setStep("input")} variant="ghost">Back</Button>
            <Button onClick={generate} disabled={loading}>
              {loading ? "Generating" : "Generate Story"}{loading && <span className="dots"></span>}
            </Button>
          </div>
        </section>
      )}

      {step === "story" && story && (
        <section className="space-y-6">
          <header className="space-y-1">
            <h2 className="text-2xl font-extrabold">{story.title}</h2>
            <p className="text-sm opacity-80">Reading Level: {story.reading_level}</p>
          </header>
          <div className="space-y-6">
            {story.chapters.map((c, i) => (
              <article key={i} className="card">
                <h3 className="font-semibold mb-2">{i+1}. {c.heading}</h3>
                <p className="leading-relaxed">{c.text}</p>
              </article>
            ))}
          </div>
          <footer className="card">
            <p className="font-medium">Moral: {story.moral}</p>
          </footer>
          <div className="flex gap-3">
            <Button onClick={() => setStep("input")} variant="secondary">Create Another</Button>
          </div>
        </section>
      )}
    </main>
  );
}

function Stepper({ step }: { step: Step }) {
  const steps: Step[] = ["input","outline","story"];
  const idx = steps.indexOf(step);
  return (
    <ol className="flex items-center gap-2 text-sm">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-2">
          <span className={`inline-flex w-7 h-7 items-center justify-center rounded-full ${i<=idx ? 'bg-indigo-600 text-white':'bg-indigo-100 text-indigo-700'}`}>{i+1}</span>
          <span className={`${i<=idx ? 'font-semibold':'opacity-80'}`}>{s}</span>
          {i<steps.length-1 && <span className="w-6 h-px bg-[rgb(var(--border))] mx-1" />}
        </li>
      ))}
    </ol>
  );
}

function emojiForGenre(g: string) {
  switch(g) {
    case "adventure": return "🗺️";
    case "fantasy": return "🐉";
    case "mystery": return "🕵️";
    case "sci-fi": return "🚀";
    case "moral tale": return "💖";
    default: return "📚";
  }
}

function sTitle(s: string) { return s.replace(/\b\w/g, m => m.toUpperCase()); }

function CoverSVG({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <svg viewBox="0 0 600 360" className="w-full h-56 rounded-xl overflow-hidden" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c7d2fe"/>
          <stop offset="100%" stopColor="#fde68a"/>
        </linearGradient>
        <filter id="soft"><feGaussianBlur stdDeviation="8" /></filter>
      </defs>
      <rect width="600" height="360" fill="url(#cg)"/>
      <g opacity=".25" filter="url(#soft)">
        <circle cx="520" cy="60" r="80" fill="#818cf8"/>
        <circle cx="80" cy="300" r="90" fill="#f59e0b"/>
      </g>
      <text x="50%" y="46%" dominantBaseline="middle" textAnchor="middle" fontSize="28" fontWeight="700" fill="#111827">{title}</text>
      <text x="50%" y="60%" dominantBaseline="middle" textAnchor="middle" fontSize="16" fill="#374151">{subtitle}</text>
      <text x="20" y="330" fontSize="12" fill="#374151">AI Story Writer</text>
    </svg>
  );
}

function DownloadCoverButton({ title, subtitle }: { title: string; subtitle: string }) {
  const handle = () => {
    const svg = document.querySelector('svg');
    if (!svg) return;
    const cloned = svg.cloneNode(true) as SVGElement;
    const serializer = new XMLSerializer();
    const src = serializer.serializeToString(cloned);
    const blob = new Blob([src], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g,'_')}_cover.svg`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };
  return <button className="btn-secondary px-4 py-2 rounded-2xl" onClick={handle}>Download Cover (SVG)</button>;
}
