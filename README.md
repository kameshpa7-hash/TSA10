# LanguageDetect — Language Detection Web Application
### Text &amp; Speech Analysis Laboratory — Experiment 10

A lightweight, high-performance, real-time client-side language detection web application developed for **Experiment 10: Language Detection** in the **Text and Speech Analysis (TSA)** laboratory.

---

## 🎯 Objective

To identify the probable language of a user-provided text using deterministic Unicode character ranges and linguistic script pattern recognition, running entirely client-side without external dependencies or backend APIs.

---

## 🌐 Supported Languages &amp; Scripts

| Language | Flag | Script Family | ISO 639-1 | Unicode Range | Hexadecimal Range | Canonical Test Input |
|---|---|---|---|---|---|---|
| **English** | 🇬🇧 | Latin | `en` | Basic Latin &amp; Latin-1 | `U+0041–U+005A, U+0061–U+007A` | *Hello, how are you?* |
| **Tamil** | 🇮🇳 | Tamil (தமிழ்) | `ta` | Tamil Block | `U+0B80–U+0BFF` | *வணக்கம், எப்படி இருக்கிறீர்கள்?* |
| **Hindi** | 🇮🇳 | Devanagari (देवनागरी) | `hi` | Devanagari Block | `U+0900–U+097F` | *नमस्ते, आप कैसे हैं?* |
| **Telugu** | 🇮🇳 | Telugu (తెలుగు) | `te` | Telugu Block | `U+0C00–U+0C7F` | *నమస్కారం, మీరు ఎలా ఉన్నారు?* |
| **Malayalam** | 🇮🇳 | Malayalam (മലയാളം) | `ml` | Malayalam Block | `U+0D00–U+0D7F` | *നമസ്കാരം, സുഖമാണോ?* |
| **Kannada** | 🇮🇳 | Kannada (ಕನ್ನಡ) | `kn` | Kannada Block | `U+0C80–U+0CFF` | *ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ?* |

---

## ⚙️ How It Works (Detection Pipeline)

> &ldquo;Language detection is the process of identifying the language of a text based on linguistic and character patterns.&rdquo;

1. **Input Traversal &amp; Unicode Decoding:**
   - The engine iterates through the text using JavaScript code point iterators (`for (const char of text)`) to accurately preserve 16-bit and 32-bit surrogate pairs.
2. **Deterministic Script Range Testing:**
   - Each character's hexadecimal code point (`codePointAt(0)`) is tested against non-overlapping Unicode allocations for Brahmic and Latin scripts.
3. **Statistical Frequency Binning:**
   - Script frequencies are tallied into per-language accumulators.
4. **Dominant Language &amp; Confidence Calculation:**
   - The language with the highest script character count is declared the winner:
     $$\text{Confidence (\%)} = \left( \frac{\text{Dominant Script Character Count}}{\text{Total Script Characters Analyzed}} \right) \times 100$$
5. **Distribution &amp; Token Breakdown:**
   - Generates proportional segmented bars, detailed percentage breakdowns, and displays scanned token code points (e.g. `வ [U+0BB5]`).

---

## 🚀 Key Features

- **Zero Backend &amp; 100% Privacy:** Runs completely in the browser using Vanilla JavaScript. Zero API latency and offline-ready.
- **Real-Time Live Detection:** Dynamically detects language as you type or paste text.
- **One-Click Quick Samples:** Built-in canonical test samples for English, Tamil, Hindi, Telugu, Malayalam, Kannada, and Mixed Scripts.
- **Multi-Script Analysis:** Calculates proportional language distribution when code-mixing occurs.
- **Character Code Point Inspector:** Displays visual glyphs alongside their exact Unicode hexadecimal representations.
- **Modern Responsive Design:** Glassmorphic dark UI, animated glow auras, custom typography, and mobile-friendly layouts.

---

## 📂 Project Structure

```
TSA10/
├── index.html       # Semantic HTML5 layout, UI controls & theory sections
├── styles.css       # Modern CSS design system, glassmorphism, responsive grid
├── script.js        # Pure ES6+ Unicode range engine & interactive handlers
└── README.md        # Academic documentation, Unicode tables, & algorithm
```

---

## 💻 How to Run Locally

Since this is a client-side web application with no build steps or dependencies:

1. Clone or download the repository:
   ```bash
   git clone https://github.com/kameshpa7-hash/TSA10.git
   ```
2. Navigate into the folder:
   ```bash
   cd TSA10
   ```
3. Open `index.html` directly in any web browser (Chrome, Edge, Firefox, Safari):
   ```bash
   # On Windows PowerShell
   Start-Process index.html
   ```

---

## 🎓 Academic Lab Reference

- **Experiment:** Experiment 10 — Language Detection
- **Subject:** Text and Speech Analysis (TSA)
- **Methodology:** Lightweight Unicode Character Range &amp; Script Frequency Analysis
- **Department:** Computer Science and Engineering / Information Technology
