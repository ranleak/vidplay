"use client";

interface StatusMessageProps {
  type: "error" | "warning";
  message: string;
  onDismiss: () => void;
}

export default function StatusMessage({
  type,
  message,
  onDismiss,
}: StatusMessageProps) {
  const isError = type === "error";

  return (
    <div
      role="alert"
      aria-live={isError ? "assertive" : "polite"}
      className={`flex items-start gap-3 px-4 py-3 rounded-lg border text-sm leading-relaxed ${
        isError
          ? "bg-red-950/60 border-red-700/50 text-red-200"
          : "bg-amber-950/60 border-amber-600/50 text-amber-200"
      }`}
    >
      {/* Icon */}
      <span className="flex-shrink-0 mt-0.5" aria-hidden="true">
        {isError ? (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg
            className="w-4 h-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </span>

      <span className="flex-1">{message}</span>

      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
