import { PopupModal } from './PopupModal';
import { Download, Smartphone, ShieldCheck, AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * The APK download link (Google Drive) shown to users.
 * The file must be shared as "Anyone with the link" for this to work.
 */
export const APK_URL =
  'https://drive.google.com/uc?export=download&id=1FjLw7Hsp_6yKOp3VQYOrZkL0N7zADQmC';
export const APK_VERSION = 'v1.0.0';
export const APK_SIZE = '2.92 MB';

/**
 * Starts the APK download. Must be called directly inside a user gesture
 * (a click handler) — otherwise mobile browsers block it as a popup.
 * Opening in a new tab is what lets Android Chrome show its download prompt.
 */
export function startApkDownload() {
  const a = document.createElement('a');
  a.href = APK_URL;
  a.download = 'rubis-company.apk';
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

interface AppDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppDownloadDialog({ isOpen, onClose }: AppDownloadDialogProps) {
  return (
    <PopupModal isOpen={isOpen} onClose={onClose} accent="primary">
      <div className="flex flex-col items-center text-center">
        {/* Android icon */}
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-[0_10px_24px_-10px_hsl(var(--primary)/0.8)]">
          <Smartphone className="w-8 h-8 text-primary-foreground" strokeWidth={2.2} />
        </div>

        <h3 className="text-lg font-black text-foreground mt-3">
          App ya Rubis Company
        </h3>
        <p className="text-[12px] text-muted-foreground font-semibold mt-1 leading-snug">
          Download yatangiriye. Fungura file wavuyemo hanyuma uyikore install.
        </p>

        {/* Verified badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/15 border border-primary/40 rounded-full px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.4} />
          <span className="text-[11px] font-black tracking-wide text-primary">
            Verified Secure APK
          </span>
        </div>

        <div className="text-[11px] font-bold text-muted-foreground mt-2">
          {APK_VERSION} • {APK_SIZE}
        </div>

        {/* Install steps */}
        <div className="w-full bg-background/40 border border-border/50 rounded-2xl p-3 mt-4 text-left space-y-2">
          {[
            'Kanda Download hano hasi niba itatangiriye.',
            'Fungura file ya rubis-company.apk wavuyemo.',
            'Ubasabye "Install from unknown sources" emeza.',
            'Kanda Install — app irakora kuri telefoni yawe.',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-[11.5px] font-semibold text-foreground leading-snug">
                {step}
              </span>
            </div>
          ))}
        </div>

        {/* Fallback download button */}
        <button
          onClick={startApkDownload}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black text-sm py-3 rounded-2xl shadow-button active:scale-[0.98] transition"
        >
          <Download className="w-5 h-5" strokeWidth={2.4} />
          Kuriza Download
        </button>

        <div className="w-full flex items-start gap-2 bg-background/40 border border-border/50 rounded-2xl p-2.5 mt-3">
          <RefreshCw className="w-4 h-4 text-primary shrink-0 mt-0.5" strokeWidth={2.2} />
          <span className="text-[10.5px] font-semibold text-muted-foreground leading-snug">
            Download itatangiriye? Kanda "Kuriza Download" hejuru, cyangwa fungura
            browser mushya ukongere ukande.
          </span>
        </div>

        <div className="w-full flex items-start gap-2 rounded-2xl p-2.5 mt-2 bg-destructive/15 border border-destructive/30">
          <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" strokeWidth={2.2} />
          <span className="text-[10.5px] font-semibold text-foreground leading-snug">
            Iyi app ikorera kuri Android gusa. Ntishyire kuri Play Store —
            install ikorwa uva kuri file wavuyemo.
          </span>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-3 text-[12px] font-bold text-muted-foreground py-2 active:opacity-60 transition"
        >
          Funga
        </button>
      </div>
    </PopupModal>
  );
}
