import { PopupModal } from './PopupModal';
import { Download, Smartphone, ShieldCheck } from 'lucide-react';

/**
 * The APK download link (Google Drive) shown to users.
 * The file must be shared as "Anyone with the link" for this to work.
 */
export const APK_URL =
  'https://drive.usercontent.google.com/download?id=1FjLw7Hsp_6yKOp3VQYOrZkL0N7zADQmC&export=download&confirm=t';
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
          Download yatangiye. Fungura file uyikore install.
        </p>

        {/* Verified badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 bg-primary/15 border border-primary/40 rounded-full px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.4} />
          <span className="text-[11px] font-black tracking-wide text-primary">
            Verified Secure APK
          </span>
        </div>

        <div className="text-[11px] font-bold text-foreground mt-2">
          {APK_VERSION} • {APK_SIZE}
        </div>

        <button
          onClick={startApkDownload}
          className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black text-sm py-3 rounded-2xl shadow-button active:scale-[0.98] transition"
        >
          <Download className="w-5 h-5" strokeWidth={2.4} />
          Ongera ukuremo
        </button>

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
