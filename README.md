# 🔍 WildLens - AI Wildlife Identification

<div align="center">

**AI-powered wildlife identification system. Identify any animal species instantly.**

[Live Demo](https://wildlens.vercel.app) · [Report Bug](https://github.com/hemant5241/WildLens/issues)

</div>

---

## 📖 About

WildLens is an intelligent web application that identifies **any animal** from images and provides comprehensive real-time information. Using Google's Gemini AI, it delivers instant species identification, danger assessments, habitat information, conservation status, and safety guidance.

Built for wildlife enthusiasts, field researchers, educators, and anyone curious about the natural world.

## ⚡ Features

- 🧠 **AI Species Detection** — Image-based identification of any animal
- ⚠️ **Danger Assessment** — Venomous/Non-venomous & danger level classification
- 📊 **Confidence Score** — AI certainty percentage with visual indicator
- 🌍 **Habitat & Behavior** — Detailed ecological information
- 🩹 **Safety Guidance** — First aid instructions & recommended actions
- 🌱 **Conservation Status** — IUCN status, population trends, key threats
- 💡 **Fun Facts** — AI-generated interesting trivia about each species
- 📷 **Camera + Upload** — Direct capture or gallery upload
- 📜 **Scan History** — Local storage of past identifications
- 📤 **Share & Export** — Share results or download as JSON
- 📱 **Responsive Design** — Works on desktop, tablet, and mobile

## 🚀 How It Works

1. **Capture or upload** an animal image
2. **AI analyzes** the image using Gemini Flash
3. **Get instant results**: species name, danger level, confidence score
4. **Explore details**: habitat, behavior, conservation, fun facts
5. **View safety guidance** with do's and don'ts
6. **Save & share** your identification results

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type Safety |
| Vite | Build Tool |
| Google Gemini AI | Species Identification |
| Lucide React | Icons |
| Framer Motion | Animations |
| Vercel | Deployment |

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- Gemini API Key ([Get one here](https://aistudio.google.com/apikey))

### Installation

```bash
# Clone the repository
git clone https://github.com/hemant5241/WildLens.git
cd WildLens

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env and add your Gemini API key

# Start development server
npm run dev
```

### Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Your Google Gemini API key |

## 📸 Screenshots

### Home Page
Premium dark-themed landing page with camera and upload options.

### Analysis Results
Comprehensive species identification dashboard with danger profile, habitat info, conservation data, and fun facts.

## ⚠️ Important Disclaimer

WildLens provides AI-based predictions, which may not be 100% accurate. Always:
- Keep a safe distance from unknown wildlife
- Avoid handling animals
- Seek professional help for dangerous encounters
- This tool is for **educational purposes only**

## 🤝 Contributing

Contributions are welcome! Feel free to fork the project and submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## ❤️ Final Note

> Technology can help us understand and protect the natural world.
> 🔍 Observe. Learn. Protect.

---

<div align="center">
Made with 💚 and AI
</div>
