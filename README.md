# ✂️ CutOut — AI Background Remover

A production-grade SaaS-style web app to remove image backgrounds using the [remove.bg](https://www.remove.bg/api) API — built entirely in the frontend with React + Vite.

---

## 🚀 Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Configure your API key

Open the `.env` file and replace `your_api_key_here` with your actual remove.bg API key:

```env
VITE_REMOVE_BG_API_KEY=your_actual_api_key
VITE_REMOVE_BG_URL=https://api.remove.bg/v1.0/removebg
```

> Get your free API key at: https://www.remove.bg/api

### 3. Run the app

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173)

---

## 🎯 Features

- **Drag & Drop** — Modern animated drop zone with visual feedback
- **AI Background Removal** — Directly calls remove.bg API from the frontend
- **Before / After Slider** — Interactive comparison slider + side-by-side view toggle
- **Download** — PNG (transparent), JPEG, or WEBP output
- **Toast Notifications** — Success & error feedback
- **File Validation** — Type and size checks (max 12MB, JPG/PNG/WEBP)
- **Re-upload** — Easily start over without refreshing

---

## 📁 Project Structure

```
bg-remover-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── UploadBox.jsx       # Drag & drop upload
│   │   ├── ImagePreview.jsx    # Slider + side-by-side preview
│   │   ├── Loader.jsx          # Animated loading state
│   │   └── DownloadButton.jsx  # Format picker + download
│   ├── hooks/
│   │   └── useRemoveBg.js      # Core state & logic hook
│   ├── pages/
│   │   └── Home.jsx            # Main page + layout
│   ├── services/
│   │   └── removeBg.js         # remove.bg API integration
│   ├── styles/
│   │   └── global.css          # Design system + keyframes
│   ├── App.jsx
│   └── main.jsx
├── .env                        # API key config
├── index.html
├── package.json
└── vite.config.js
```

---

## 🎨 Design System

| Token | Value |
|---|---|
| `--bg-base` | `#0a0a0f` |
| `--bg-surface` | `#111118` |
| `--bg-elevated` | `#16161f` |
| `--accent-primary` | `#6c63ff` |
| `--accent-cyan` | `#00d4ff` |
| `--text-primary` | `#f0f0f8` |
| `--text-secondary` | `#8888aa` |

---

## 🔌 API Details

- **Endpoint:** `https://api.remove.bg/v1.0/removebg`
- **Method:** `POST`
- **Auth Header:** `X-Api-Key: <your_key>`
- **Body:** `FormData` with `image_file` field
- **Response:** PNG image blob (transparent background)

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `react` | UI framework |
| `react-dom` | DOM rendering |
| `axios` | HTTP client with upload progress |
| `vite` | Build tool |
| `@vitejs/plugin-react` | React + Vite integration |

---

## 🏗️ Build for Production

```bash
npm run build
npm run preview
```

---

## ⚠️ Notes

- The remove.bg free plan includes **50 API calls/month**
- CORS is handled by remove.bg — no proxy needed
- PNG downloads preserve full transparency
- JPEG downloads get a white background fill automatically

---

Made with ❤️ using React + Vite + remove.bg API
