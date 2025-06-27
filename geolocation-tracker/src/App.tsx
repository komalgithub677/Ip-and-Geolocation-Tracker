import React, { useEffect, useState } from "react";
import axios from "axios";

const App = () => {
  const [status, setStatus] = useState("Securely tracking your location...");

  // 🔐 Example identifiers — replace dynamically as needed
  const userId = "abc123";
  const assessmentId = "quiz789";

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            setStatus("📡 Sending location to server...");

            const res = await axios.post(import.meta.env.VITE_API_URL, {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              userId,
              assessmentId,
            });

            setStatus(`✅ ${res.data.message}`);
          } catch (err: any) {
            console.error("❌ Error posting location:", err);
            setStatus(`❌ ${err.response?.data?.error || "Server Error"}`);
          }
        },
        () => {
          setStatus("❌ Location permission denied.");
        }
      );
    } else {
      setStatus("❌ Geolocation not supported.");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white text-center px-4">
      <h1 className="text-3xl font-bold mb-4"> Geolocation Tracker</h1>
      <p className="text-lg">{status}</p>
    </div>
  );
};

export default App;

// Add the following TypeScript declaration to fix the ImportMeta.env error
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_URL: string;
    // add other env variables here if needed
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}
