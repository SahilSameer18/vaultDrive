import { useState, useEffect } from "react";
import { filesApi } from "../api/files.api";
import { useAuth } from "../context/AuthContext";
import { formatBytes } from "../utils/formatters";

function StorageSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* 4 Category Highlight Skeleton Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/40 space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5">
              <div className="skeleton w-8 h-8 rounded-xl" />
              <div className="skeleton h-4 w-24 rounded" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="skeleton h-3 w-12 rounded" />
                <div className="skeleton h-3 w-16 rounded" />
              </div>
              <div className="skeleton h-1.5 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Details Section */}
      <div className="space-y-4">
        <div className="skeleton h-6 w-36 rounded" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Donut Card */}
          <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/40 flex flex-col items-center justify-center relative min-h-[300px]">
            <div className="relative w-44 h-44 rounded-full border-8 border-[var(--theme-surface)] skeleton flex items-center justify-center">
              <div className="w-28 h-28 rounded-full bg-[var(--theme-panel)] flex flex-col items-center justify-center space-y-1.5">
                <div className="skeleton h-5 w-16 rounded" />
                <div className="skeleton h-3 w-12 rounded" />
              </div>
            </div>
            <div className="skeleton h-3 w-32 rounded mt-4" />
          </div>

          {/* Right 4 Detail Tiles + Free space */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="skeleton w-3 h-3 rounded-full" />
                    <div className="space-y-1.5">
                      <div className="skeleton h-3.5 w-20 rounded" />
                      <div className="skeleton h-2.5 w-12 rounded" />
                    </div>
                  </div>
                  <div className="space-y-1.5 text-right">
                    <div className="skeleton h-3.5 w-14 rounded ml-auto" />
                    <div className="skeleton h-2.5 w-8 rounded ml-auto" />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-panel)]/40 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="skeleton w-3 h-3 rounded-full" />
                <div className="space-y-1.5">
                  <div className="skeleton h-3.5 w-32 rounded" />
                  <div className="skeleton h-2.5 w-20 rounded" />
                </div>
              </div>
              <div className="skeleton h-4 w-16 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StoragePage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await filesApi.getStorageStats();
      setStats(res.data.data);
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const totalQuota = stats?.totalQuotaBytes || 1024 * 1024 * 1024;
  const totalUsed = stats?.totalBytes || 0;
  const freeBytes = Math.max(0, totalQuota - totalUsed);
  const usedPercent = stats?.usedPercentage || 0;

  const categories = stats?.categories || {
    doc: { bytes: 0, count: 0 },
    image: { bytes: 0, count: 0 },
    media: { bytes: 0, count: 0 },
    archive: { bytes: 0, count: 0 },
  };

  const docPct = (categories.doc.bytes / totalQuota) * 100;
  const imgPct = (categories.image.bytes / totalQuota) * 100;
  const mediaPct = (categories.media.bytes / totalQuota) * 100;
  const archivePct = (categories.archive.bytes / totalQuota) * 100;

  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.82

  const docDash = (docPct / 100) * circumference;
  const imgDash = (imgPct / 100) * circumference;
  const mediaDash = (mediaPct / 100) * circumference;
  const archiveDash = (archivePct / 100) * circumference;

  let currentOffset = 0;
  const imgOffset = currentOffset;
  currentOffset += imgDash;
  const mediaOffset = currentOffset;
  currentOffset += mediaDash;
  const docOffset = currentOffset;
  currentOffset += docDash;
  const archiveOffset = currentOffset;

  return (
    <div className="space-y-8 fade-in select-none pb-12">
      
      {/* ── Top Header ────────────────────────────────────────────────────── */}
      <div className="border-b border-[var(--theme-border)] pb-5">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)]" />
          <span className="text-[10px] font-mono font-semibold tracking-widest text-[var(--theme-accent)] uppercase">
            STORAGE METRICS & TELEMETRY
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--theme-text)] mt-1">
          {user?.username ? `${user.username}’s Allocation Overview` : "Hardware Allocation Overview"}
        </h1>
        <p className="text-xs sm:text-sm text-[var(--theme-text-muted)] mt-1">
          Real-time allocation breakdown for your 1.0 GB secure encrypted vault.
        </p>
      </div>

      {/* ── Content Viewport: Skeleton vs Data ─────────────────────────────── */}
      {loading ? (
        <StorageSkeleton />
      ) : (
        <>
          {/* ── 4 Category Highlight Cards ────────────────────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
            {/* 1. Documents Card */}
            <div className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] flex flex-col justify-between space-y-4 shadow-sm hover:border-[var(--theme-accent)]/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shadow-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="1.75" />
                    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-[var(--theme-text)]">Documents</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--theme-text-muted)]">
                  <span>{categories.doc.count} files</span>
                  <span className="text-[var(--theme-text)] font-semibold">{formatBytes(categories.doc.bytes)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--theme-surface)] overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-sky-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(docPct > 0 ? 3 : 0, docPct))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 2. Images Card */}
            <div className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] flex flex-col justify-between space-y-4 shadow-sm hover:border-[var(--theme-accent)]/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/30 flex items-center justify-center text-[var(--theme-accent)] shadow-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.75" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="m21 15-5-5L5 21" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-[var(--theme-text)]">Images</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--theme-text-muted)]">
                  <span>{categories.image.count} files</span>
                  <span className="text-[var(--theme-text)] font-semibold">{formatBytes(categories.image.bytes)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--theme-surface)] overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-[var(--theme-accent)] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(imgPct > 0 ? 3 : 0, imgPct))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 3. Media & Audio Card */}
            <div className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] flex flex-col justify-between space-y-4 shadow-sm hover:border-[var(--theme-accent)]/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <polygon points="5 3 19 12 5 21 5 3" stroke="currentColor" strokeWidth="1.75" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-[var(--theme-text)]">Video & Audio</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--theme-text-muted)]">
                  <span>{categories.media.count} files</span>
                  <span className="text-[var(--theme-text)] font-semibold">{formatBytes(categories.media.bytes)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--theme-surface)] overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(mediaPct > 0 ? 3 : 0, mediaPct))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 4. Archives & Other Card */}
            <div className="p-4 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] flex flex-col justify-between space-y-4 shadow-sm hover:border-[var(--theme-accent)]/40 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-sm">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M21 8v13H3V8M1 3h22v5H1zM10 12h4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="font-semibold text-sm text-[var(--theme-text)]">Other Archives</span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-[var(--theme-text-muted)]">
                  <span>{categories.archive.count} files</span>
                  <span className="text-[var(--theme-text)] font-semibold">{formatBytes(categories.archive.bytes)}</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--theme-surface)] overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-purple-400 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(archivePct > 0 ? 3 : 0, archivePct))}%` }}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* ── Main Section: Storage Details (Donut Chart + Breakdown Cards) ─── */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight text-[var(--theme-text)]">Hardware Allocation Matrix</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left: Donut Ring Chart Card */}
              <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-panel)] flex flex-col items-center justify-center relative shadow-xl">
                <div className="relative w-52 h-52 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 180 180">
                    {/* Background Ring */}
                    <circle
                      cx="90"
                      cy="90"
                      r={radius}
                      stroke="currentColor"
                      strokeWidth="14"
                      fill="transparent"
                      className="text-[var(--theme-surface)]"
                    />

                    {/* Images Segment (Champagne Gold) */}
                    {imgDash > 0 && (
                      <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        stroke="var(--color-vault-accent)"
                        strokeWidth="14"
                        fill="transparent"
                        strokeDasharray={`${imgDash} ${circumference}`}
                        strokeDashoffset={-imgOffset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}

                    {/* Media Segment (Amber) */}
                    {mediaDash > 0 && (
                      <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        stroke="#f59e0b"
                        strokeWidth="14"
                        fill="transparent"
                        strokeDasharray={`${mediaDash} ${circumference}`}
                        strokeDashoffset={-mediaOffset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}

                    {/* Docs Segment (Sky) */}
                    {docDash > 0 && (
                      <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        stroke="#38bdf8"
                        strokeWidth="14"
                        fill="transparent"
                        strokeDasharray={`${docDash} ${circumference}`}
                        strokeDashoffset={-docOffset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}

                    {/* Archives Segment (Purple) */}
                    {archiveDash > 0 && (
                      <circle
                        cx="90"
                        cy="90"
                        r={radius}
                        stroke="#c084fc"
                        strokeWidth="14"
                        fill="transparent"
                        strokeDasharray={`${archiveDash} ${circumference}`}
                        strokeDashoffset={-archiveOffset}
                        strokeLinecap="round"
                        className="transition-all duration-700"
                      />
                    )}
                  </svg>

                  {/* Center Donut Label */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--theme-text)] font-mono">
                      {formatBytes(totalUsed)}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--theme-text-muted)] mt-0.5">
                      of 1.0 GB
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-xs font-mono text-[var(--theme-text-muted)] text-center">
                  <span className="text-[var(--theme-accent)] font-semibold">{stats?.fileCount || 0} payloads</span> · {usedPercent}% consumed
                </p>
              </div>

              {/* Right: Detailed Metric Grid */}
              <div className="lg:col-span-7 flex flex-col justify-between gap-3">
                
                {/* Top 4 Detail Tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Documents Detail */}
                  <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]/70 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-sky-400 shadow-sm" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--theme-text)]">Documents</p>
                        <p className="text-[10px] font-mono text-[var(--theme-text-muted)]">{categories.doc.count} files</p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-xs font-bold text-[var(--theme-text)]">{formatBytes(categories.doc.bytes)}</p>
                      <p className="text-[10px] text-[var(--theme-text-muted)]">{docPct.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Images Detail */}
                  <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]/70 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-[var(--theme-accent)] shadow-sm" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--theme-text)]">Images</p>
                        <p className="text-[10px] font-mono text-[var(--theme-text-muted)]">{categories.image.count} files</p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-xs font-bold text-[var(--theme-text)]">{formatBytes(categories.image.bytes)}</p>
                      <p className="text-[10px] text-[var(--theme-text-muted)]">{imgPct.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Media Detail */}
                  <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]/70 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-amber-400 shadow-sm" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--theme-text)]">Video & Audio</p>
                        <p className="text-[10px] font-mono text-[var(--theme-text-muted)]">{categories.media.count} files</p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-xs font-bold text-[var(--theme-text)]">{formatBytes(categories.media.bytes)}</p>
                      <p className="text-[10px] text-[var(--theme-text-muted)]">{mediaPct.toFixed(1)}%</p>
                    </div>
                  </div>

                  {/* Archives Detail */}
                  <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]/70 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-purple-400 shadow-sm" />
                      <div>
                        <p className="text-xs font-semibold text-[var(--theme-text)]">Other Files</p>
                        <p className="text-[10px] font-mono text-[var(--theme-text-muted)]">{categories.archive.count} files</p>
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <p className="text-xs font-bold text-[var(--theme-text)]">{formatBytes(categories.archive.bytes)}</p>
                      <p className="text-[10px] text-[var(--theme-text-muted)]">{archivePct.toFixed(1)}%</p>
                    </div>
                  </div>

                </div>

                {/* Free Available Space Banner */}
                <div className="p-4 rounded-xl border border-[var(--theme-border)] bg-[var(--theme-surface)]/90 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                    <div>
                      <p className="text-xs font-semibold text-[var(--theme-text)]">Available Free Storage</p>
                      <p className="text-[10px] font-mono text-[var(--theme-text-muted)]">{(100 - usedPercent).toFixed(1)}% unallocated</p>
                    </div>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400">
                    {formatBytes(freeBytes)}
                  </span>
                </div>

              </div>

            </div>

          </div>
        </>
      )}

    </div>
  );
}
