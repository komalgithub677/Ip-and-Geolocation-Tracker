import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  userId: string;
  assessmentId?: string | null;
}

const GeolocationTracker: React.FC<Props> = ({ userId, assessmentId = null }) => {
  const [status, setStatus] = useState("Securely tracking your location...");

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setStatus("❌ Geolocation not supported.");
      return;
    }

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
      (error) => {
        console.warn("❌ Geolocation error:", error.message);
        setStatus("❌ Location permission denied.");
      }
    );
  }, [userId, assessmentId]);

  return (
    <div className="text-sm text-center text-gray-400 mt-2">
      <p>{status}</p>
    </div>
  );
};

export default GeolocationTracker;
