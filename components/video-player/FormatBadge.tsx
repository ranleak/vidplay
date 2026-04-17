"use client";

import type { FormatInfo } from "./VideoPlayer";

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function FormatBadge({ info }: { info: FormatInfo }) {
  return (
    <div
      className="absolute top-3 right-3 z-20 flex items-center gap-1.5"
      aria-live="polite"
    >
      <span
        className={`px-2.5 py-1 rounded-md text-xs font-bold tracking-wide backdrop-blur-sm ${
          info.fullySupported
            ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
            : "bg-amber-500/20 border border-amber-500/40 text-amber-300"
        }`}
      >
        {info.name}
      </span>
      <span className="px-2.5 py-1 rounded-md text-xs text-white/60 bg-black/50 backdrop-blur-sm border border-white/10 max-w-[180px] truncate">
        {info.fileName}
      </span>
      <span className="hidden sm:inline px-2 py-1 rounded-md text-xs text-white/50 bg-black/50 backdrop-blur-sm border border-white/10">
        {formatBytes(info.fileSize)}
      </span>
    </div>
  );
}
