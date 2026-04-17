export default function LoadingOverlay() {
  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-30"
      aria-busy="true"
      aria-label="Loading video"
    >
      <div
        className="w-12 h-12 rounded-full border-4 border-white/20 border-t-[var(--player-accent)] animate-spin"
        aria-hidden="true"
      />
      <p className="mt-3 text-sm text-white/70 font-medium">Loading video…</p>
    </div>
  );
}
