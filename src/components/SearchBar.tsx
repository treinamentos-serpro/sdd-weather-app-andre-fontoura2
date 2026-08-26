import { useState, type FormEvent } from 'react';

export interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    onSearch(trimmed);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 font-sans backdrop-blur-md"
    >
      <label htmlFor="city-search" className="sr-only">
        Buscar cidade
      </label>
      <input
        id="city-search"
        type="text"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar cidade..."
        className="w-full rounded-xl border border-transparent bg-slate-900/60 px-4 py-2 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
      <button
        type="submit"
        aria-label="Buscar"
        className="shrink-0 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-slate-100 transition hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-sky-400"
      >
        🔍
      </button>
    </form>
  );
}
