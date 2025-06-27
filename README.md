# 🌍 IP and Geolocation Tracker

A full-stack web application that tracks and stores IP addresses and geolocation data for logged-in users. Built with React, Tailwind CSS, Node.js, Express, and MongoDB. It integrates `ipgeolocation.io` and `ipify.org` APIs to fetch and store precise user location data for security, analytics, or verification purposes.

---

## 🚀 Features

- 🔍 Fetch public IP using `ipify.org`
- 🌐 Fetch geolocation (city, region, ISP, etc.) using `ipgeolocation.io`
- 🗺️ Track latitude & longitude using browser Geolocation API
- 👤 Store user metadata (userId, email) with location
- 💾 Save geolocation data to MongoDB
- 📡 Trigger tracking automatically after login
- 💨 Lightweight, responsive, and optimized with Tailwind CSS

---

## 🛠️ Tech Stack

### **Frontend**
- React
- Tailwind CSS
- Axios
- Geolocation API
- ipify.org (for public IP)

### **Backend**
- Node.js
- Express.js
- MongoDB + Mongoose
- ipgeolocation.io (for geolocation details)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/ip-geolocation-tracker.git
cd ip-geolocation-tracker

# Install frontend dependencies
cd frontend
npm install
npm run dev

# Install backend dependencies
cd ../backend
npm install
npm run dev
