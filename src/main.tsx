import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n";

// Restore path preserved by static-host 404 fallback (public/404.html)
try {
  const saved = sessionStorage.getItem("spa-redirect");
  if (saved) {
    sessionStorage.removeItem("spa-redirect");
    if (saved && saved !== window.location.pathname + window.location.search + window.location.hash) {
      window.history.replaceState(null, "", saved);
    }
  }
} catch {}

createRoot(document.getElementById("root")!).render(<App />);
