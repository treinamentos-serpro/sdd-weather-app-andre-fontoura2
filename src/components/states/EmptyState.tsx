interface EmptyStateProps {
  message?: string;
}

export default function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-slate-200 backdrop-blur-md">
      <p>{message ?? 'Nenhuma cidade encontrada.'}</p>
    </div>
  );
}
