const express = require("express");
const router = express.Router();
const Location = require("../models/Location");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { Parser } = require("json2csv");

router.post("/", async (req, res) => {
  try {
    console.log(" Request received with:", req.body);

    // Extract IP address
    let rawIp = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;
    rawIp = rawIp?.replace("::ffff:", "").trim() || "0.0.0.0";

    let realIp = rawIp;
    if (
      ["127.0.0.1", "::1", "0.0.0.0"].includes(rawIp) ||
      rawIp.startsWith("::ffff:127.") ||
      rawIp.startsWith("::ffff:0.") ||
      rawIp === "::ffff:1"
    ) {
      const ipRes = await axios.get("https://api64.ipify.org?format=json");
      realIp = ipRes.data.ip;
      console.log("🌍 Using public IP from ipify:", realIp);
    } else {
      console.log("🌐 Detected raw IP:", realIp);
    }

    // Get IP geolocation
    const geoRes = await axios.get(
      `https://api.ipgeolocation.io/ipgeo?apiKey=${process.env.IPGEO_API_KEY}&ip=${realIp}`
    );
    const ipData = geoRes.data;

    if (!ipData || !ipData.ip) {
      return res.status(500).json({ error: "Invalid IP data from ipgeolocation.io" });
    }

    // Region restriction check
    const allowedRegions = process.env.ALLOWED_REGIONS
      ? process.env.ALLOWED_REGIONS.split(",").map((r) => r.trim().toLowerCase())
      : [];

    const userRegion = ipData.state_prov?.toLowerCase() || "";

    console.log("API returned region:", ipData.state_prov);
    console.log("Allowed regions from .env:", allowedRegions);

    if (!allowedRegions.includes(userRegion)) {
      console.warn("Region not allowed:", userRegion);
      return res.status(423).json({ error: `Access denied for region: ${ipData.state_prov}` });
    }

    // Store in MongoDB
    const location = new Location({
      ip: ipData.ip,
      city: ipData.city,
      region: ipData.state_prov,
      isp: ipData.isp || "Unknown",
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      time: new Date().toISOString(),
      userId: req.body.userId || null,
      assessmentId: req.body.assessmentId || null,
    });

    await location.save();

    // Log to file
    const logPath = path.join(__dirname, "../data/location_log.json");
    const logs = fs.existsSync(logPath) ? JSON.parse(fs.readFileSync(logPath)) : [];
    logs.push(location);
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

    res.status(201).json({ message: "Location stored successfully." });
  } catch (err) {
    console.error("❌ Error in POST /api/location:", err.message);
    res.status(500).json({ error: "Internal Server Error", detail: err.message });
  }
});

// Fetch all
router.get("/all", async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (err) {
    res.status(500).json({ error: "Error fetching location data" });
  }
});

// Download as CSV
router.get("/download", async (req, res) => {
  try {
    const locations = await Location.find();
    const fields = ["ip", "city", "region", "isp", "latitude", "longitude", "time", "userId", "assessmentId"];
    const parser = new Parser({ fields });
    const csv = parser.parse(locations);

    const filePath = path.join(__dirname, "../data/location_data.csv");
    fs.writeFileSync(filePath, csv);

    res.download(filePath, "location_data.csv", () => {
      fs.unlinkSync(filePath);
    });
  } catch (err) {
    res.status(500).json({ error: "Error generating CSV" });
  }
});

module.exports = router;
