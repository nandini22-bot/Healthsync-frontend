# HealthSync — Unified Clinical Wellness Hub

HealthSync is a modern, high-performance, full-stack clinical wellness application built with **Next.js 15 (App Router)**, **TypeScript**, and **MongoDB**. It offers a unified portal for tracking biometrics, health objectives, nutrition intake, exercise logs, daily medications, and wellness telemetry. 

Additionally, HealthSync includes an integrated **Google Gemini AI Assistant** for automated clinical safety flags, personalized dietary guidance, and a geo-aware locator for nearby health services (Hospitals, Pharmacies, Clinics, and Gyms) utilizing public geocoding APIs.

---

## 🚀 Key Features

* **Real-time Daily Snapshot**: Visual water jar SVG filling animations, radial calorie progress meters, and dynamic BMI gauge bars.
* **Unified Profile & Settings**: Consolidated biometrics parameters (age, height, weight, physical injuries) and regional preferences in a single view.
* **Smart Wellness Telemetry**: Log scale weights, daily hydration metrics with subtraction options, and tracked sleep patterns.
* **Dosing & Medication Scheduler**: Search regional catalogs (US FDA vs Indian standard), schedule times, and receive safety warning indicators.
* **Dynamic Health Objectives**: Set goals (Weight Loss, Weight Gain, Muscle Building, Maintain Fit) which instantly recalculate intake limits client-side and server-side.
* **Free Geo-Aware Nearby Services**: Auto GPS detection search (Hospitals, Pharmacies, Clinics, Gyms) using OpenStreetMap (Nominatim & Overpass) with no API keys required.
* **AI Wellness Observation Engine**: Gemini-powered conversational interface, custom seeders for missing exercises, and automatic warnings matching logged musculoskeletal injuries.
* **High-Performance MongoDB Handler**: Global singleton pattern caching resolved replica-set URLs in memory to bypass slow ISP/DNS resolution and speed up page loads.

---

## 🛠️ Architecture & Data Flow

### 1. Fast Database Reconnection Flow
Next.js serverless functions often execute on networks where standard MongoDB `mongodb+srv://` SRV DNS records fail or resolve slowly.
1. The driver checks the global memory cache (`global._cachedStandardUri`).
2. If absent, it resolves SRV endpoints via **Google DNS-over-HTTPS (DoH)** to bypass local network DNS blocks.
3. Reconstructs a standard sharded replication URL (e.g. `mongodb://host1,host2:27017/?ssl=true`).
4. Caches the URI in global memory so subsequent database operations connect in **~30-50ms**.

### 2. User Profile Setup & Update Flow
1. User registers or modifies profile settings at `/dashboard/profile`.
2. Biometric inputs are sanitized client-side. Empty inputs are kept clean instead of defaulting to `0` or `NaN`.
3. The API fetches the user document and safely merges new inputs into the existing `profile` subdocument, preventing database errors if the profile is initially `null`.
4. Recalculated targets instantly refresh on the page without full reloads.

---

## 📁 Repository Structure

```
Healthsync/
├── app/                             # Next.js App Router root
│   ├── (auth)/                      # Authentication Pages (Login, Register, Reset)
│   ├── (dashboard)/                 # Authenticated Layout & Navigation
│   │   └── dashboard/               # Core Feature Pages
│   │       ├── ai-assistant/        # Conversational Gemini assistant
│   │       ├── exercise/            # Dynamic workout logger
│   │       ├── goals/               # Client-side target recalculator
│   │       ├── health-history/      # Aggregated daily logs view
│   │       ├── insights/            # AI-generated observations
│   │       ├── medications/         # Scheduler with Indian/US directories
│   │       ├── nearby-services/     # OSM Locator (Hospitals, Gyms)
│   │       ├── nutrition/           # Indian staples & global meal logger
│   │       ├── profile/             # Profile & Settings combined dashboard
│   │       └── wellness/            # Hydration jar, sleep & weight logs
│   ├── api/                         # Backend Serverless API routes
│   └── globals.css                  # Unified CSS Day/Night variables
├── components/                      # Shared layouts, cards, charts
├── lib/                             # Shared utility wrappers (Auth, MongoDB)
├── scripts/                         # Database catalog seeders
├── package.json
└── tsconfig.json
```

---

## 🔌 API Documentation

### Authentication `/api/auth`
* **`POST /api/auth/register`**: Registers accounts, hashes passwords (bcryptjs), and sets session JWT cookies.
* **`POST /api/auth/login`**: Validates credentials and generates session tokens.
* **`POST /api/auth/logout`**: Clears authorization headers and tokens.

### Settings & Profile `/api/settings`
* **`GET /api/settings`**: Retrieves the authenticated user document.
* **`POST /api/settings`**: Merges biometrics (age, height, weight, injuries) and unit preferences into the database.

### Goals `/api/goals`
* **`GET /api/goals`**: Recalculates intake targets and aggregates today's logs.

### Nearby Services (External)
* **Nominatim Geocoding**: `https://nominatim.openstreetmap.org/search` (Resolves Local localities, bounded by preferred country).
* **Overpass API**: `https://overpass-api.de/api/interpreter` (Queries nearby elements: hospital, pharmacy, leisure=fitness_centre).

---

## ⚙️ Setup Instructions

### Prerequisites
* Node.js v18+
* MongoDB Atlas Database
* Gemini API Key

### Environment Variables (`.env.local`)
Create a `.env.local` file in the root directory:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_google_gemini_api_key
AUTH_SECRET=your_jwt_auth_secret_key
```

### Installation
1. Install dependencies:
   ```bash
   npm install
   ```
2. Populate the database catalogs:
   ```bash
   npm run seed           # Seed medications directory
   npm run seed-health    # Seed nutrition & exercise catalogs
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
