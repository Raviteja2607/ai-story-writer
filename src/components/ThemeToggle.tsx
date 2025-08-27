'use client';

export default function ThemeToggle() {
  return (
    <button
      className="px-3 py-2 rounded-xl border"
      onClick={() => {
        const el = document.documentElement;
        const isDark = el.classList.toggle('dark');
        try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch {}
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      <span className="hidden dark:inline">🌙 Night</span>
      <span className="inline dark:hidden">☀️ Day</span>
    </button>
  );
}
