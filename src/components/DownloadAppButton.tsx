import { useState } from 'react';
import { Smartphone, Download, ShieldCheck, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { PopupModal } from './PopupModal';
import { toast } from 'sonner';

const APK_URL = 'https://drive.google.com/uc?export=download&id=1FjLw7Hsp_6yKOp3VQYOrZkL0N7zADQmC';
const APK_SIZE = '2.92 MB';
const APK_VERSION = 'v1.0.0';

export function DownloadAppButton() {
  const [downloading, setDownloading] = useState(false);
  const [showInstall, setShowInstall] = useState(false);
  const [failed, setFailed] = useState(false);

  const startDownload = () => {
    setFailed(false);
    setDownloading(true);
    toast('Download Starting...', { description: `ELITE STORE App ${APK_VERSION} • ${APK_SIZE}` });

    try {
      const a = document.createElement('a');
      a.href = APK_URL;
      a.download = 'samsung-world.apk';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch {
      setFailed(true);
    }

    setTimeout(() => {
      setDownloading(false);
      setShowInstall(true);
    }, 2200);
  };

  const fallbackDownload = () => {
    window.location.href = APK_URL;
  };

  return (
    <>
      <button onClick={startDownload} className="flex flex-col items-center group">
        <div className="relative w-16 h-16 rounded-2xl flex items-center justify-center shadow-button overflow-hidden bg-gradient-to-br from-[hsl(243,75%,55%)] to-[hsl(322,85%,55%)] animate-pulse-glow">
          <span className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Smartphone className="w-7 h-7 text-white relative z-10" />
          <Download className="w-3 h-3 text-white absolute bottom-1.5 right-1.5 z-10" />
        </div>
        <span className="text-xs font-medium text-foreground mt-2">Download App</span>
      </button>

      {/* Downloading popup */}
      <PopupModal isOpen={downloading} onClose={() => setDownloading(false)}>
        <div className="text-center py-2">
          <div className="relative w-20 h-20 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-secondary animate-ping opacity-30" />
            <div className="relative w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center shadow-button">
              <Loader2 className="w-10 h-10 text-white animate-spin" />
            </div>
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
            Downloading App...
          </h3>
          <p className="text-sm text-muted-foreground mb-4">Get Latest Android App</p>
          <div className="bg-muted rounded-xl p-3 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Version {APK_VERSION}</span>
            <span className="font-bold text-foreground">{APK_SIZE}</span>
          </div>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Secure APK
          </div>
          {failed && (
            <button onClick={fallbackDownload} className="mt-4 w-full action-btn flex items-center justify-center gap-2">
              <AlertCircle className="w-4 h-4" /> Retry Download
            </button>
          )}
        </div>
      </PopupModal>

      {/* Install instructions popup */}
      <PopupModal isOpen={showInstall} onClose={() => setShowInstall(false)}>
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-button">
            <CheckCircle2 className="w-9 h-9 text-white" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-1">Download Complete!</h3>
          <p className="text-sm text-muted-foreground mb-4">Follow these steps to install:</p>

          <div className="text-left space-y-2 mb-4">
            {[
              'Open the downloaded app.apk file',
              'Allow "Install from unknown sources" if prompted',
              'Tap Install and wait a few seconds',
              'Open ELITE STORE and login',
            ].map((step, i) => (
              <div key={i} className="flex gap-3 items-start bg-muted rounded-xl p-3">
                <span className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <span className="text-sm text-foreground">{step}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-600 font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Secure APK • {APK_VERSION}
          </div>

          <button onClick={fallbackDownload} className="w-full text-xs text-primary underline">
            Download didn't start? Tap here
          </button>
        </div>
      </PopupModal>
    </>
  );
}

export function DownloadAppInfo() {
  return (
    <div className="text-center -mt-1">
      <p className="text-[10px] text-muted-foreground">
        Get Latest Android App • {APK_VERSION} • {APK_SIZE}
      </p>
    </div>
  );
}
