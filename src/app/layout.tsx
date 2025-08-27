import type { Metadata } from "next";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Story Writer",
  description: "Create personalized bedtime stories for kids with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen antialiased bg-stars">
        <ThemeScript />
        <div className="container py-6">
          <Header />
          {children}
          <footer className="mt-16 text-center text-sm opacity-70">
            Made with ✨ for imaginative minds.
          </footer>
        </div>
      </body>
    </html>
  );
}

function ThemeScript() {
  const code = `(function(){
    try{
      const ls = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const theme = ls || (prefersDark ? 'dark' : 'light');
      if(theme === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    }catch(e){}
  })();`;
  // eslint-disable-next-line react/no-danger
  return <script dangerouslySetInnerHTML={{ __html: code }} />;
}

function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Mascot className="w-10 h-10" />
        <span className="text-xl font-bold">AI Story Writer</span>
        <span className="badge badge-indigo">Beta</span>
      </div>
      <nav className="flex items-center gap-3">
        <a href="/" className="px-3 py-2 rounded-xl hover:bg-white/20">Home</a>
        <a href="/create" className="px-3 py-2 rounded-xl hover:bg-white/20">Create</a>
        <ThemeToggle />
      </nav>
    </header>
  );
}


function Mascot({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#a5b4fc" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
      </defs>
      <rect x="8" y="10" width="48" height="44" rx="8" fill="url(#g)" />
      <path d="M12 18h40" stroke="white" strokeWidth="2" />
      <circle cx="26" cy="32" r="3" fill="white" />
      <circle cx="38" cy="32" r="3" fill="white" />
      <path d="M24 40c3 3 13 3 16 0" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}
