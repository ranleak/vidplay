"use client";

import { useRef, useState, useCallback } from "react";

interface DropZoneProps {
  onFile: (file: File) => void;
}

export default function DropZone({ onFile }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      onFile(file);
    },
    [onFile]
  );

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 1) {
      alert("Please upload only one video file at a time.");
      return;
    }
    if (files[0]) handleFile(files[0]);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so same file can be re-selected
    e.target.value = "";
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Upload video file — click or drag and drop"
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      onKeyDown={onKeyDown}
      className={`
        relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center
        min-h-[340px] md:min-h-[420px] gap-6 cursor-pointer transition-all duration-300 outline-none
        focus-visible:ring-2 focus-visible:ring-primary
        ${
          isDragging
            ? "border-primary bg-[var(--player-accent-dim)] scale-[1.01]"
            : "border-border hover:border-primary/60 hover:bg-secondary/40"
        }
      `}
    >
      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mkv,.mov,.mp4,.webm"
        className="sr-only"
        onChange={onInputChange}
        aria-hidden="true"
      />

      {/* Icon */}
      <div
        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
          isDragging ? "bg-primary/20" : "bg-secondary"
        }`}
      >
        <svg
          className={`w-10 h-10 transition-colors duration-300 ${
            isDragging ? "text-primary" : "text-muted-foreground"
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
          />
        </svg>
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2 text-center px-8">
        <p className="text-foreground text-lg font-semibold">
          {isDragging ? "Drop it here" : "Drop your video here"}
        </p>
        <p className="text-muted-foreground text-sm leading-relaxed">
          or{" "}
          <span className="text-primary font-medium underline-offset-4 hover:underline">
            click to browse
          </span>{" "}
          your files
        </p>
      </div>

      {/* Format pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { label: "MP4", supported: true },
          { label: "WebM", supported: true },
          { label: "MOV", supported: false },
          { label: "MKV", supported: false },
        ].map(({ label, supported }) => (
          <span
            key={label}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${
              supported
                ? "border-primary/40 text-primary bg-primary/10"
                : "border-border text-muted-foreground bg-secondary"
            }`}
          >
            {label}
            {supported ? " ✓" : " ~"}
          </span>
        ))}
      </div>

      <p className="text-xs text-muted-foreground px-8 text-center max-w-sm leading-relaxed">
        Files are processed entirely in your browser. Nothing is uploaded to any
        server.
      </p>
    </div>
  );
}
