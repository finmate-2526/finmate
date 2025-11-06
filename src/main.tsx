import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { API_BASE } from "./lib/config";

// Non-intrusive runtime debug: prints the resolved API endpoint in the browser console
if (typeof window !== 'undefined') {
	// Expose for quick inspection in DevTools
	(window as any).FM_API_BASE = API_BASE;
	// eslint-disable-next-line no-console
	console.log("[Finmate] API_BASE:", API_BASE, "hostname:", window.location.hostname);
}

createRoot(document.getElementById("root")!).render(<App />);
