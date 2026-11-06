import { useEffect, useState } from 'react';
import { PopupModal } from './PopupModal';
import { Download, Smartphone, ShieldCheck, CheckCircle2 } from 'lucide-react';

// Capture the browser's install prompt as early as possible.
let deferredPrompt: any = null;
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
  });
  window.addEventListener('appinstalled', () => { deferredPrompt = null; });
}

export function isAppInstalled() {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as any).standalone === true
  );
}

/** Call inside a click. Shows the native install prompt when available. Returns true if prompted. */
export function startAppInstall(): boolean {
  if (!deferredPrompt) return false;
  const p = deferredPrompt;
  deferredPrompt = null;
  p.prompt();
  return true;
}

const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent);

interface AppDownloadDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AppDownloadDialog({ isOpen, onClose }: AppDownloadDialogProps) {
  const [installed, setInstalled] = useState(false);
  const [hint, setHint] = useState(false);
  useEffect(() => { if (isOpen) setInstalled(isAppInstalled()); }, [isOpen]);

  const steps = isIOS()
    ? ['Kanda akamenyetso ka "Share" hasi.', 'Hitamo "Add to Home Screen".']
    : ['Kanda utudomo 3 (⋮) hejuru muri browser.', 'Hitamo "Install app" cyangwa "Add to Home screen".'];

  return (
    <PopupModal isOpen={isOpen} onClose={onClose} accent="primary">
      <div className="flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-button">
          <Smartphone className="w-8 h-8 text-primary-foreground" strokeWidth={2.2} />
        </div>
        <h3 className="text-lg font-black text-foreground mt-3">App ya RUBIS COMPANY</h3>

        <div className="mt-2 inline-flex items-center gap-1.5 bg-primary/15 border border-primary/40 rounded-full px-3 py-1.5">
          <ShieldCheck className="w-4 h-4 text-primary" strokeWidth={2.4} />
          <span className="text-[11px] font-black tracking-wide text-primary">Verified Secure App</span>
        </div>

        {installed ? (
          <p className="flex items-center gap-1.5 text-[12px] font-bold text-foreground mt-3">
            <CheckCircle2 className="w-4 h-4 text-primary" /> App yamaze gushyirwa kuri telefoni yawe.
          </p>
        ) : (
          <>
            <div className="w-full bg-background/40 border border-border/50 rounded-2xl p-3 mt-3 text-left space-y-2">
              {steps.map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[11px] font-black flex items-center justify-center shrink-0">{i + 1}</span>
                  <span className="text-[12px] font-semibold text-foreground leading-snug">{s}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (startAppInstall()) { onClose(); return; }
                const inFrame = window.self !== window.top;
                if (inFrame) {
                  window.open(window.location.origin, '_blank');
                } else {
                  setHint(true);
                }
              }}
              className="w-full mt-3 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-black text-sm py-3 rounded-2xl shadow-button active:scale-[0.98] transition"
            >
              <Download className="w-5 h-5" strokeWidth={2.4} />
              Shyiramo App
            </button>
            {hint && (
              <p className="text-[12px] font-bold text-primary mt-2 leading-snug">
                Browser yawe ntiyemera gushyiramo App mu buryo bwikora. Kurikiza intambwe 1 na 2 ziri haruguru (koresha Chrome kuri Android cyangwa Safari kuri iPhone).
              </p>
            )}
          </>
        )}

        <button onClick={onClose} className="w-full mt-2 text-[12px] font-bold text-muted-foreground py-2">
          Funga
        </button>
      </div>
    </PopupModal>
  );
}
