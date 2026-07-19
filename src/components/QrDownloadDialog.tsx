import { useEffect, useState } from 'react';
import { X, Download, Smartphone, ShieldCheck, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

const APK_URL = 'https://drive.google.com/uc?export=download&id=1FjLw7Hsp_6yKOp3VQYOrZkL0N7zADQmC';
const APK_VERSION = 'v1.0.0';
const APK_SIZE = '2.92 MB';
const INSTALL_KEY = 'petane_apk_installed_version';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function QrDownloadDialog({ open, onClose }: Props) {
  const [installed, setInstalled] = useState(false);
  const [shareUrl, setShareUrl] = useState('');

  useEffect(() => {
    if (!open) return;
    setShareUrl(window.location.origin);
    try {
      const v = localStorage.getItem(INSTALL_KEY);
      setInstalled(v === APK_VERSION);
    } catch {
      setInstalled(false);
    }
  }, [open]);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = APK_URL;
    a.download = 'petane-shipping.apk';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    try { localStorage.setItem(INSTALL_KEY, APK_VERSION); } catch {}
    setInstalled(true);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-gradient-to-br from-[hsl(226,78%,48%)] to-[hsl(226,78%,32%)] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-white" />
            <h3 className="text-white font-bold text-base">Petane Shipping App</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="p-5 text-center">
          <div className="mx-auto w-52 h-52 bg-white p-3 rounded-2xl border-2 border-[hsl(226,78%,90%)] flex items-center justify-center">
            <QRCodeSVG value={shareUrl || 'https://petaneweb.site'} size={192} level="M" includeMargin={false} />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Scanira QR code kugira ngo ufungure Petane Shipping
          </p>

          <div className="mt-4 bg-[hsl(226,78%,96%)] rounded-2xl p-3 flex items-center justify-between">
            <div className="text-left">
              <div className="text-[11px] text-muted-foreground">Andoroid App</div>
              <div className="font-bold text-sm text-foreground">Version {APK_VERSION}</div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground">Ubunini</div>
              <div className="font-bold text-sm text-foreground">{APK_SIZE}</div>
            </div>
          </div>

          {installed ? (
            <div className="mt-4 w-full flex items-center justify-center gap-2 bg-emerald-50 text-emerald-700 font-bold py-3 rounded-2xl">
              <Check className="w-5 h-5" /> Wamaze Kwiyandikisha App
            </div>
          ) : (
            <button
              onClick={handleDownload}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[hsl(226,78%,48%)] to-[hsl(226,78%,32%)] text-white font-bold py-3 rounded-2xl active:scale-[0.98] transition shadow-lg"
            >
              <Download className="w-5 h-5" /> Kuramo Petane Shipping App
            </button>
          )}

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-emerald-600 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Verified Secure APK
          </div>
        </div>
      </div>
    </div>
  );
}
