interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-200 backdrop-blur-md">
      <p role="alert">{message ?? 'Não foi possível carregar o clima.'}</p>
      <button
        type="button"
        onClick={onRetry}
        className="rounded-lg border border-white/20 bg-white/10 px-4 py-2 font-medium text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        Tentar novamente
      </button>
    </div>
  );
}
