export default function DocsSection() {
  const formatRows = [
    {
      format: "MP4",
      codecs: "H.264 / H.265 + AAC",
      support: "Full",
      browsers: "Chrome, Firefox, Safari, Edge",
      badge: "full",
    },
    {
      format: "WebM",
      codecs: "VP8 / VP9 / AV1 + Vorbis / Opus",
      support: "Full",
      browsers: "Chrome, Firefox, Edge, Opera",
      badge: "full",
    },
    {
      format: "MOV",
      codecs: "H.264 (limited) / ProRes ✗",
      support: "Limited",
      browsers: "Safari, Chromium only",
      badge: "limited",
    },
    {
      format: "MKV",
      codecs: "H.264 (partial) / AC3 ✗ / DTS ✗",
      support: "Limited",
      browsers: "Chrome (partial)",
      badge: "limited",
    },
  ];

  const shortcuts = [
    { key: "Space", action: "Play / Pause" },
    { key: "←", action: "Seek back 5 seconds" },
    { key: "→", action: "Seek forward 5 seconds" },
    { key: "M", action: "Mute / Unmute" },
    { key: "F", action: "Toggle fullscreen" },
  ];

  const troubleshoot = [
    {
      issue: "Video won't play",
      fix: "Check codec support. Convert to MP4 (H.264 + AAC) for guaranteed playback.",
    },
    {
      issue: "Audio missing",
      fix: "Video may use AC3/DTS audio. Convert audio track to AAC or Opus.",
    },
    {
      issue: "Seek bar unresponsive",
      fix: "Large files need time to buffer. Wait for initial loading to complete.",
    },
    {
      issue: "MOV / MKV not playing",
      fix: "Convert to MP4 or WebM using FFmpeg or HandBrake for guaranteed cross-browser support.",
    },
    {
      issue: "Memory issues after loading many files",
      fix: "Reload the page to clear accumulated Blob URLs from memory.",
    },
  ];

  return (
    <div className="mt-16 flex flex-col gap-12">
      {/* How to use */}
      <section id="usage">
        <SectionHeader
          title="How to Use"
          subtitle="Load and play your local video files in seconds."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {[
            {
              step: "01",
              title: "Upload",
              desc: "Click the upload area or drag a video file directly onto it.",
            },
            {
              step: "02",
              title: "Validate",
              desc: "The player checks the format and shows warnings for limited-support files.",
            },
            {
              step: "03",
              title: "Play",
              desc: "Use the custom controls or keyboard shortcuts to control playback.",
            },
            {
              step: "04",
              title: "Switch",
              desc: 'Click "Load New Video" to replace the current file without reloading.',
            },
          ].map(({ step, title, desc }) => (
            <div
              key={step}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-2"
            >
              <span className="text-xs font-mono text-primary font-bold">
                {step}
              </span>
              <h3 className="text-foreground font-semibold">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section id="shortcuts">
        <SectionHeader
          title="Keyboard Shortcuts"
          subtitle="Control playback without touching the mouse."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          {shortcuts.map(({ key, action }) => (
            <div
              key={key}
              className="flex items-center gap-3 bg-card border border-border rounded-lg px-4 py-3"
            >
              <kbd className="inline-flex items-center justify-center min-w-[2rem] px-2 py-1 bg-secondary rounded text-xs font-mono text-foreground border border-border font-bold">
                {key}
              </kbd>
              <span className="text-sm text-muted-foreground">{action}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Format support */}
      <section id="formats">
        <SectionHeader
          title="Format Support"
          subtitle="Browser-native support varies by container and codec."
        />
        <div className="mt-6 overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-5 py-3 text-muted-foreground font-semibold">
                  Format
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-semibold">
                  Codecs
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-semibold">
                  Support
                </th>
                <th className="text-left px-5 py-3 text-muted-foreground font-semibold hidden md:table-cell">
                  Browsers
                </th>
              </tr>
            </thead>
            <tbody>
              {formatRows.map((row, i) => (
                <tr
                  key={row.format}
                  className={`border-b border-border last:border-0 ${
                    i % 2 === 0 ? "bg-card" : "bg-card/50"
                  }`}
                >
                  <td className="px-5 py-3.5 font-mono font-bold text-foreground">
                    {row.format}
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">
                    {row.codecs}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                        row.badge === "full"
                          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                          : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      }`}
                    >
                      {row.support}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground hidden md:table-cell">
                    {row.browsers}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture">
        <SectionHeader
          title="Technical Architecture"
          subtitle="100% client-side — your files never leave your device."
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                  />
                </svg>
              ),
              title: "File Management Layer",
              desc: "HTML5 File API reads local files using FileReader.readAsArrayBuffer(). Drag-and-drop events are intercepted via preventDefault() to override default browser behavior.",
            },
            {
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
                  />
                </svg>
              ),
              title: "Playback Engine",
              desc: "ArrayBuffer data is wrapped in a Blob and fed to URL.createObjectURL() to generate a temporary in-memory URL. URL.revokeObjectURL() cleans up memory on file change.",
            },
            {
              icon: (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 1 1-.99-3.467l2.31-.66a2.25 2.25 0 0 0 1.632-2.163Zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 0 1-1.632 2.163l-1.32.377a1.803 1.803 0 0 1-.99-3.467l2.31-.66A2.25 2.25 0 0 0 9 15.553Z"
                  />
                </svg>
              ),
              title: "Control Interface",
              desc: "Custom React state drives all playback controls — seek, volume, fullscreen — synchronized with the native HTMLVideoElement events like timeupdate and loadedmetadata.",
            },
          ].map(({ icon, title, desc }) => (
            <div
              key={title}
              className="bg-card border border-border rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                {icon}
              </div>
              <h3 className="font-semibold text-foreground">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Troubleshooting */}
      <section id="troubleshooting">
        <SectionHeader
          title="Troubleshooting"
          subtitle="Common issues and how to resolve them."
        />
        <div className="mt-6 flex flex-col divide-y divide-border border border-border rounded-xl overflow-hidden">
          {troubleshoot.map(({ issue, fix }) => (
            <div
              key={issue}
              className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 px-5 py-4 bg-card"
            >
              <span className="text-sm font-semibold text-foreground sm:w-56 flex-shrink-0">
                {issue}
              </span>
              <span className="text-sm text-muted-foreground leading-relaxed">
                {fix}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold text-foreground text-balance">{title}</h2>
      <p className="mt-1 text-muted-foreground text-sm">{subtitle}</p>
    </div>
  );
}
