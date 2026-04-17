"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import DropZone from "./DropZone";
import Controls from "./Controls";
import FormatBadge from "./FormatBadge";
import StatusMessage from "./StatusMessage";
import LoadingOverlay from "./LoadingOverlay";

export type FormatInfo = {
  name: string;
  mimeType: string;
  fullySupported: boolean;
  fileName: string;
  fileSize: number;
};

const SUPPORTED_FORMATS: Record<
  string,
  { name: string; fullySupported: boolean; warning?: string }
> = {
  "video/mp4": { name: "MP4", fullySupported: true },
  "video/webm": { name: "WebM", fullySupported: true },
  "video/quicktime": {
    name: "MOV",
    fullySupported: false,
    warning:
      "MOV has limited browser support. Playback requires H.264 codec. If the video does not play, convert to MP4.",
  },
  "video/x-matroska": {
    name: "MKV",
    fullySupported: false,
    warning:
      "MKV is not natively supported in most browsers. AC3/DTS audio codecs will fail. Consider converting to MP4 or WebM.",
  },
};

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerWrapRef = useRef<HTMLDivElement>(null);
  const blobUrlRef = useRef<string | null>(null);
  const controlsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [hasVideo, setHasVideo] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [formatInfo, setFormatInfo] = useState<FormatInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const revokeBlobUrl = useCallback(() => {
    if (blobUrlRef.current) {
      URL.revokeObjectURL(blobUrlRef.current);
      blobUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => revokeBlobUrl();
  }, [revokeBlobUrl]);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (!videoRef.current) return;
      if (e.code === "Space") {
        e.preventDefault();
        togglePlayPause();
      } else if (e.code === "ArrowLeft") {
        e.preventDefault();
        videoRef.current.currentTime = Math.max(
          0,
          videoRef.current.currentTime - 5
        );
      } else if (e.code === "ArrowRight") {
        e.preventDefault();
        videoRef.current.currentTime = Math.min(
          videoRef.current.duration || 0,
          videoRef.current.currentTime + 5
        );
      } else if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      } else if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  const resetControlsTimer = useCallback(() => {
    setShowControls(true);
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    controlsTimerRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 2500);
  }, [isPlaying]);

  const handleFile = useCallback(
    (file: File) => {
      setError(null);
      setWarning(null);

      const fmt = SUPPORTED_FORMATS[file.type];
      if (!fmt) {
        setError(
          `Unsupported format: "${file.type || file.name.split(".").pop()}". Please use MP4, WebM, MOV, or MKV.`
        );
        return;
      }

      if (!fmt.fullySupported && fmt.warning) {
        setWarning(fmt.warning);
      }

      setIsLoading(true);
      revokeBlobUrl();

      const reader = new FileReader();
      reader.onload = (e) => {
        const buffer = e.target?.result as ArrayBuffer;
        const blob = new Blob([buffer], { type: file.type });
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;

        const vid = videoRef.current;
        if (!vid) return;
        vid.src = url;
        vid.load();

        setFormatInfo({
          name: fmt.name,
          mimeType: file.type,
          fullySupported: fmt.fullySupported,
          fileName: file.name,
          fileSize: file.size,
        });
        setHasVideo(true);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError("Failed to read the video file. Please try again.");
        setIsLoading(false);
      };
      reader.readAsArrayBuffer(file);
    },
    [revokeBlobUrl]
  );

  const togglePlayPause = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) {
      vid.play().catch(() =>
        setError("Playback failed. The format or codec may not be supported.")
      );
    } else {
      vid.pause();
    }
  }, []);

  const toggleMute = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  }, []);

  const handleVolumeChange = useCallback((val: number) => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.volume = val;
    vid.muted = val === 0;
    setVolume(val);
    setIsMuted(val === 0);
  }, []);

  const handleSeek = useCallback((val: number) => {
    const vid = videoRef.current;
    if (!vid || !vid.duration) return;
    vid.currentTime = val;
    setCurrentTime(val);
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = playerWrapRef.current;
    if (!container) return;
    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setError("Fullscreen is not supported in this browser.");
    }
  }, []);

  // Video event handlers
  const onPlay = () => setIsPlaying(true);
  const onPause = () => { setIsPlaying(false); setShowControls(true); };
  const onWaiting = () => setIsLoading(true);
  const onCanPlay = () => setIsLoading(false);
  const onTimeUpdate = () => {
    const vid = videoRef.current;
    if (vid) setCurrentTime(vid.currentTime);
  };
  const onLoadedMetadata = () => {
    const vid = videoRef.current;
    if (vid) setDuration(vid.duration);
  };
  const onEnded = () => { setIsPlaying(false); setShowControls(true); };
  const onError = () => {
    setIsLoading(false);
    setError(
      "Video playback error. The file may use an unsupported codec. Try converting to MP4 (H.264/AAC) or WebM (VP9)."
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Status messages */}
      <div className="flex flex-col gap-2">
        {error && (
          <StatusMessage
            type="error"
            message={error}
            onDismiss={() => setError(null)}
          />
        )}
        {warning && (
          <StatusMessage
            type="warning"
            message={warning}
            onDismiss={() => setWarning(null)}
          />
        )}
      </div>

      {/* Player or Drop zone */}
      {!hasVideo ? (
        <DropZone onFile={handleFile} />
      ) : (
        <div
          ref={playerWrapRef}
          className="relative w-full bg-black rounded-xl overflow-hidden group"
          style={{ aspectRatio: "16/9" }}
          onMouseMove={resetControlsTimer}
          onMouseLeave={() => { if (isPlaying) setShowControls(false); }}
          onTouchStart={resetControlsTimer}
        >
          {/* Format badge */}
          {formatInfo && <FormatBadge info={formatInfo} />}

          {/* Video element */}
          <video
            ref={videoRef}
            className="w-full h-full object-contain bg-black"
            preload="metadata"
            aria-label="Video player"
            onPlay={onPlay}
            onPause={onPause}
            onWaiting={onWaiting}
            onCanPlay={onCanPlay}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={onEnded}
            onError={onError}
            onClick={togglePlayPause}
            onDoubleClick={toggleFullscreen}
            playsInline
          >
            <p>Your browser does not support HTML5 video.</p>
          </video>

          {/* Loading overlay */}
          {isLoading && <LoadingOverlay />}

          {/* Controls */}
          <Controls
            isPlaying={isPlaying}
            isMuted={isMuted}
            volume={volume}
            currentTime={currentTime}
            duration={duration}
            isFullscreen={isFullscreen}
            visible={showControls}
            onPlayPause={togglePlayPause}
            onMute={toggleMute}
            onVolumeChange={handleVolumeChange}
            onSeek={handleSeek}
            onFullscreen={toggleFullscreen}
          />
        </div>
      )}

      {/* Replace / change video button */}
      {hasVideo && (
        <button
          onClick={() => {
            revokeBlobUrl();
            setHasVideo(false);
            setFormatInfo(null);
            setIsPlaying(false);
            setError(null);
            setWarning(null);
            setCurrentTime(0);
            setDuration(0);
          }}
          className="self-start text-sm font-medium px-4 py-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors duration-200"
        >
          Load New Video
        </button>
      )}
    </div>
  );
}
