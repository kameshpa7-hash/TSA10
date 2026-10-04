/**
 * LanguageDetect — Language Detection Engine
 * Experiment 10: Language Detection (Text and Speech Analysis Lab)
 * Lightweight, client-side Unicode character range and linguistic pattern analyzer.
 */

// Supported Languages Configuration & Unicode Range Definitions
const LANGUAGES = {
  en: {
    id: 'en',
    name: 'English',
    nativeName: 'English (Latin Alphabet)',
    flag: '🇬🇧',
    script: 'Latin Script',
    unicodeBlock: 'Basic Latin (U+0041–U+005A, U+0061–U+007A)',
    isoCode: 'en / eng',
    color: '#38bdf8',
    test: (cp) => {
      // Basic Latin letters A-Z, a-z & Latin-1 Supplement letters
      return (
        (cp >= 0x0041 && cp <= 0x005A) || // A-Z
        (cp >= 0x0061 && cp <= 0x007A) || // a-z
        (cp >= 0x00C0 && cp <= 0x00D6) || // À-Ö
        (cp >= 0x00D8 && cp <= 0x00F6) || // Ø-ö
        (cp >= 0x00F8 && cp <= 0x00FF)    // ø-ÿ
      );
    }
  },
  ta: {
    id: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ் (Tamil Script)',
    flag: '🇮🇳',
    script: 'Tamil Script',
    unicodeBlock: 'Tamil (U+0B80–U+0BFF)',
    isoCode: 'ta / tam',
    color: '#fb923c',
    test: (cp) => cp >= 0x0B80 && cp <= 0x0BFF
  },
  hi: {
    id: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी (Devanagari Script)',
    flag: '🇮🇳',
    script: 'Devanagari Script',
    unicodeBlock: 'Devanagari (U+0900–U+097F)',
    isoCode: 'hi / hin',
    color: '#f59e0b',
    test: (cp) => cp >= 0x0900 && cp <= 0x097F
  },
  te: {
    id: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు (Telugu Script)',
    flag: '🇮🇳',
    script: 'Telugu Script',
    unicodeBlock: 'Telugu (U+0C00–U+0C7F)',
    isoCode: 'te / tel',
    color: '#818cf8',
    test: (cp) => cp >= 0x0C00 && cp <= 0x0C7F
  },
  ml: {
    id: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം (Malayalam Script)',
    flag: '🇮🇳',
    script: 'Malayalam Script',
    unicodeBlock: 'Malayalam (U+0D00–U+0D7F)',
    isoCode: 'ml / mal',
    color: '#10b981',
    test: (cp) => cp >= 0x0D00 && cp <= 0x0D7F
  },
  kn: {
    id: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ (Kannada Script)',
    flag: '🇮🇳',
    script: 'Kannada Script',
    unicodeBlock: 'Kannada (U+0C80–U+0CFF)',
    isoCode: 'kn / kan',
    color: '#f43f5e',
    test: (cp) => cp >= 0x0C80 && cp <= 0x0CFF
  }
};

// Preset Examples for Quick Testing
const EXAMPLES = {
  en: "Hello, how are you? Welcome to the Text and Speech Analysis laboratory demonstration on Language Detection.",
  ta: "வணக்கம், எப்படி இருக்கிறீர்கள்? தமிழ் மிகவும் தொன்மையான செம்மொழியாகும்.",
  hi: "नमस्ते, आप कैसे हैं? प्राकृतिक भाषा प्रसंस्करण एक अत्यंत रोचक और महत्वपूर्ण विषय है।",
  te: "నమస్కారం, మీరు ఎలా ఉన్నారు? తెలుగు భాష ఎంతో మధురమైనది మరియు ప్రాచీనమైనది.",
  ml: "നമസ്കാരം, സുഖമാണോ? മലയാളം ഒരു ദ്രാവിഡ ഭാഷയാണ്, അത് കേരളത്തിൽ സംസാരിക്കപ്പെടുന്നു.",
  kn: "ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಿ? ಕನ್ನಡ ಭಾಷೆ ಅತ್ಯಂತ ಪ್ರಾಚೀನವಾದದ್ದು ಮತ್ತು ಶ್ರೀಮಂತ ಸಾಹಿತ್ಯ ಹೊಂದಿದೆ.",
  mixed: "வணக்கம்! Hello, how are you? नमस्ते दोस्त, welcome to multi-script language analysis."
};

// DOM Element References
const textInput = document.getElementById('textInput');
const detectBtn = document.getElementById('detectBtn');
const clearBtn = document.getElementById('clearBtn');
const loadRandomExampleBtn = document.getElementById('loadRandomExampleBtn');
const liveDetectionToggle = document.getElementById('liveDetectionToggle');
const pasteBtn = document.getElementById('pasteBtn');
const copyBtn = document.getElementById('copyBtn');

// Counters
const charCountEl = document.getElementById('charCount');
const wordCountEl = document.getElementById('wordCount');
const scriptCharCountEl = document.getElementById('scriptCharCount');

// Primary Result Card Elements
const primaryResultCard = document.getElementById('primaryResultCard');
const globeIcon = document.getElementById('globeIcon');
const globeAura = document.getElementById('globeAura');
const resultStatusLabel = document.getElementById('resultStatusLabel');
const confidencePill = document.getElementById('confidencePill');
const confidenceText = document.getElementById('confidenceText');
const detectedFlag = document.getElementById('detectedFlag');
const detectedName = document.getElementById('detectedName');
const detectedNativeName = document.getElementById('detectedNativeName');
const confidencePercent = document.getElementById('confidencePercent');
const confidenceProgressBar = document.getElementById('confidenceProgressBar');
const confidenceBarFill = document.getElementById('confidenceBarFill');

// Diagnostic Boxes
const diagTotalChars = document.getElementById('diagTotalChars');
const diagScriptDetected = document.getElementById('diagScriptDetected');
const diagUnicodeBlock = document.getElementById('diagUnicodeBlock');
const diagIsoCode = document.getElementById('diagIsoCode');

// Distribution Elements
const segmentedBar = document.getElementById('segmentedBar');
const distributionList = document.getElementById('distributionList');
const distSummaryText = document.getElementById('distSummaryText');

// Inspector Elements
const inspectorContent = document.getElementById('inspectorContent');
const inspectorCountBadge = document.getElementById('inspectorCountBadge');

// Tag Pills in Header
const headerTagPills = document.querySelectorAll('.tag-pill');

let lastExampleIndex = 0;
const exampleKeys = ['en', 'ta', 'hi', 'te', 'ml', 'kn', 'mixed'];

/**
 * Core Language Detection Algorithm
 * Analyzes string code points, maps to script ranges, computes statistical distribution & confidence.
 */
function analyzeText(rawText) {
  const text = rawText || '';
  const totalLength = text.length;

  // Words count
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  // Frequency buckets for supported languages
  const counts = {
    en: 0,
    ta: 0,
    hi: 0,
    te: 0,
    ml: 0,
    kn: 0
  };

  const matchedTokens = [];
  let scriptCharactersCount = 0;

  // Code-point traversal (handles surrogate pairs cleanly)
  for (const char of text) {
    const codePoint = char.codePointAt(0);

    // Skip ASCII control and common non-alphabetic characters from script assignment
    // unless they fall into specific Indic script code blocks
    let matchedLangKey = null;

    for (const [key, lang] of Object.entries(LANGUAGES)) {
      if (lang.test(codePoint)) {
        matchedLangKey = key;
        break;
      }
    }

    if (matchedLangKey) {
      counts[matchedLangKey]++;
      scriptCharactersCount++;
      if (matchedTokens.length < 50) {
        matchedTokens.push({
          char: char,
          hex: 'U+' + codePoint.toString(16).toUpperCase().padStart(4, '0'),
          langKey: matchedLangKey
        });
      }
    }
  }

  // Determine dominant language
  let winnerKey = null;
  let maxCount = 0;

  for (const [key, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      winnerKey = key;
    }
  }

  // Calculate confidence and percentages
  const distribution = [];
  let confidence = 0;

  if (scriptCharactersCount > 0 && winnerKey) {
    confidence = Math.round((maxCount / scriptCharactersCount) * 100);

    for (const [key, count] of Object.entries(counts)) {
      if (count > 0) {
        const percentage = ((count / scriptCharactersCount) * 100).toFixed(1);
        distribution.push({
          langKey: key,
          name: LANGUAGES[key].name,
          flag: LANGUAGES[key].flag,
          color: LANGUAGES[key].color,
          count: count,
          percentage: parseFloat(percentage)
        });
      }
    }

    // Sort distribution descending by count
    distribution.sort((a, b) => b.count - a.count);
  }

  return {
    rawText,
    totalLength,
    words,
    scriptCharactersCount,
    winnerKey,
    winnerLang: winnerKey ? LANGUAGES[winnerKey] : null,
    confidence,
    counts,
    distribution,
    matchedTokens
  };
}

/**
 * Update the UI with Analysis Results
 */
function renderResults(analysis) {
  const { totalLength, words, scriptCharactersCount, winnerLang, confidence, distribution, matchedTokens } = analysis;

  // Update Counters
  charCountEl.textContent = totalLength.toLocaleString();
  wordCountEl.textContent = words.toLocaleString();
  scriptCharCountEl.textContent = scriptCharactersCount.toLocaleString();

  // If input is empty
  if (totalLength === 0) {
    renderEmptyState();
    return;
  }

  // If input has text but no supported script characters were detected (e.g. only numbers, symbols, emoji, or unsupported scripts)
  if (scriptCharactersCount === 0) {
    renderUnrecognizedState(totalLength);
    return;
  }

  // Active Detected State
  primaryResultCard.classList.add('analyzed');
  globeIcon.textContent = winnerLang.flag;
  globeAura.style.background = `radial-gradient(circle, ${winnerLang.color}55 0%, transparent 70%)`;

  resultStatusLabel.textContent = 'PREDICTION CONFIRMED';
  confidencePill.className = 'confidence-pill detected';
  confidenceText.textContent = `${confidence}% Match`;

  detectedFlag.textContent = winnerLang.flag;
  detectedName.textContent = winnerLang.name;
  detectedName.style.color = winnerLang.color;
  detectedNativeName.textContent = winnerLang.nativeName;

  // Confidence Meter
  confidencePercent.textContent = `${confidence}%`;
  confidenceBarFill.style.width = `${confidence}%`;
  confidenceBarFill.style.background = `linear-gradient(90deg, #6366f1, ${winnerLang.color})`;
  confidenceProgressBar.setAttribute('aria-valuenow', confidence);

  // Diagnostics
  diagTotalChars.textContent = `${totalLength} (${scriptCharactersCount} analyzed)`;
  diagScriptDetected.textContent = winnerLang.script;
  diagUnicodeBlock.textContent = winnerLang.unicodeBlock.split(' ')[0];
  diagIsoCode.textContent = winnerLang.isoCode;

  // Distribution Bars & List
  renderDistribution(distribution, scriptCharactersCount);

  // Inspector Tokens
  renderInspector(matchedTokens, scriptCharactersCount);

  // Highlight active language in header tag pills
  headerTagPills.forEach(pill => {
    if (pill.dataset.lang === winnerLang.id) {
      pill.classList.add('active');
    } else {
      pill.classList.remove('active');
    }
  });
}

/**
 * Render Segmented Bar and Distribution List
 */
function renderDistribution(distribution, totalAnalyzed) {
  // Clear segmented bar
  segmentedBar.innerHTML = '';
  distributionList.innerHTML = '';

  if (!distribution || distribution.length === 0) {
    segmentedBar.innerHTML = '<div class="segment-empty">Awaiting text</div>';
    distributionList.innerHTML = '<div class="empty-dist-msg">No script characters detected</div>';
    distSummaryText.textContent = 'Calculated from script character frequencies';
    return;
  }

  distSummaryText.textContent = `${distribution.length} script${distribution.length > 1 ? 's' : ''} detected across ${totalAnalyzed} characters`;

  // Populate Segmented Bar
  distribution.forEach(item => {
    const segment = document.createElement('div');
    segment.className = 'segment-item';
    segment.style.width = `${item.percentage}%`;
    segment.style.backgroundColor = item.color;
    segment.setAttribute('data-tooltip', `${item.name}: ${item.percentage}% (${item.count})`);
    segmentedBar.appendChild(segment);
  });

  // Populate Detailed List
  distribution.forEach(item => {
    const row = document.createElement('div');
    row.className = 'dist-row';

    row.innerHTML = `
      <div class="dist-row-left">
        <span class="dist-dot" style="background-color: ${item.color};"></span>
        <span class="dist-lang-name">${item.flag} ${item.name}</span>
        <span class="dist-char-count">(${item.count} chars)</span>
      </div>
      <div class="dist-row-right">
        <span class="dist-percent-badge" style="color: ${item.color};">${item.percentage}%</span>
      </div>
    `;

    distributionList.appendChild(row);
  });
}

/**
 * Render Character Inspector Tokens
 */
function renderInspector(tokens, totalCount) {
  inspectorContent.innerHTML = '';
  inspectorCountBadge.textContent = `${totalCount} script characters identified`;

  if (!tokens || tokens.length === 0) {
    inspectorContent.innerHTML = '<p class="inspector-placeholder">No Unicode script symbols to inspect.</p>';
    return;
  }

  tokens.forEach(tok => {
    const chip = document.createElement('div');
    chip.className = 'char-chip';
    chip.title = `${tok.char} — ${LANGUAGES[tok.langKey].name} (${tok.hex})`;

    const glyph = document.createElement('span');
    glyph.className = 'char-glyph';
    glyph.textContent = tok.char;

    const hex = document.createElement('span');
    hex.className = 'char-hex';
    hex.textContent = tok.hex;

    chip.appendChild(glyph);
    chip.appendChild(hex);
    inspectorContent.appendChild(chip);
  });

  if (totalCount > tokens.length) {
    const moreNotice = document.createElement('span');
    moreNotice.className = 'char-hex';
    moreNotice.style.padding = '0.4rem';
    moreNotice.style.color = '#94a3b8';
    moreNotice.textContent = `+ ${totalCount - tokens.length} more characters...`;
    inspectorContent.appendChild(moreNotice);
  }
}

/**
 * Render Empty State when Textarea is Cleared
 */
function renderEmptyState() {
  primaryResultCard.classList.remove('analyzed');
  globeIcon.textContent = '🌐';
  globeAura.style.background = 'radial-gradient(circle, rgba(99, 102, 241, 0.35) 0%, transparent 70%)';

  resultStatusLabel.textContent = 'PREDICTION STATUS';
  confidencePill.className = 'confidence-pill';
  confidenceText.textContent = 'Awaiting Input';

  detectedFlag.textContent = '🌐';
  detectedName.textContent = 'Ready for Analysis';
  detectedName.style.color = '#ffffff';
  detectedNativeName.textContent = 'Enter text to see detection results';

  confidencePercent.textContent = '0%';
  confidenceBarFill.style.width = '0%';
  confidenceProgressBar.setAttribute('aria-valuenow', '0');

  diagTotalChars.textContent = '0';
  diagScriptDetected.textContent = 'None';
  diagUnicodeBlock.textContent = '—';
  diagIsoCode.textContent = '—';

  segmentedBar.innerHTML = '<div class="segment-empty">Awaiting text</div>';
  distributionList.innerHTML = '<div class="empty-dist-msg">No characters to analyze yet.</div>';
  distSummaryText.textContent = 'Calculated from script character frequencies';

  inspectorContent.innerHTML = '<p class="inspector-placeholder">Visual breakdown of matched Unicode characters will appear here after detection.</p>';
  inspectorCountBadge.textContent = '0 tokens scanned';

  headerTagPills.forEach(pill => pill.classList.remove('active'));
}

/**
 * Render State when input has characters but no supported language scripts
 */
function renderUnrecognizedState(totalLength) {
  primaryResultCard.classList.remove('analyzed');
  globeIcon.textContent = '❓';
  globeAura.style.background = 'radial-gradient(circle, rgba(245, 158, 11, 0.35) 0%, transparent 70%)';

  resultStatusLabel.textContent = 'NON-SCRIPT INPUT';
  confidencePill.className = 'confidence-pill';
  confidenceText.textContent = 'Unclassified';

  detectedFlag.textContent = '❓';
  detectedName.textContent = 'Unassigned Script';
  detectedName.style.color = '#f59e0b';
  detectedNativeName.textContent = 'Contains numbers, emojis, punctuation, or unsupported scripts';

  confidencePercent.textContent = '0%';
  confidenceBarFill.style.width = '0%';

  diagTotalChars.textContent = `${totalLength} (0 script letters)`;
  diagScriptDetected.textContent = 'Non-Alphabetical';
  diagUnicodeBlock.textContent = 'Punctuation / Symbols';
  diagIsoCode.textContent = 'und (Undetermined)';

  segmentedBar.innerHTML = '<div class="segment-empty">No supported scripts identified</div>';
  distributionList.innerHTML = '<div class="empty-dist-msg">Please enter words in English, Tamil, Hindi, Telugu, Malayalam, or Kannada.</div>';
  distSummaryText.textContent = 'No language frequency available';

  inspectorContent.innerHTML = '<p class="inspector-placeholder">Entered characters do not match the Unicode ranges for English, Tamil, Hindi, Telugu, Malayalam, or Kannada.</p>';
  inspectorCountBadge.textContent = '0 recognized tokens';

  headerTagPills.forEach(pill => pill.classList.remove('active'));
}

/**
 * Main Trigger Handler
 */
function performDetection() {
  const text = textInput.value;
  const analysis = analyzeText(text);
  renderResults(analysis);
}

/**
 * Set Text and Run Detection
 */
function setTextInput(sampleText) {
  textInput.value = sampleText;
  performDetection();
  textInput.focus();
  // Scroll slightly to workspace if on small screens
  if (window.innerWidth <= 768) {
    primaryResultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

// Event Listeners
detectBtn.addEventListener('click', () => {
  performDetection();
  // Subtle button press feedback
  detectBtn.style.transform = 'scale(0.97)';
  setTimeout(() => {
    detectBtn.style.transform = '';
  }, 150);
});

clearBtn.addEventListener('click', () => {
  textInput.value = '';
  performDetection();
  textInput.focus();
});

// Real-time live detection
textInput.addEventListener('input', () => {
  if (liveDetectionToggle.checked) {
    performDetection();
  } else {
    // Only update character counter
    charCountEl.textContent = textInput.value.length;
    wordCountEl.textContent = textInput.value.trim() ? textInput.value.trim().split(/\s+/).length : 0;
  }
});

// Load Random / Cycle Example Button
loadRandomExampleBtn.addEventListener('click', () => {
  const key = exampleKeys[lastExampleIndex % exampleKeys.length];
  lastExampleIndex++;
  setTextInput(EXAMPLES[key]);
});

// Quick Example Buttons Row
document.querySelectorAll('.btn-example').forEach(button => {
  button.addEventListener('click', () => {
    const langKey = button.dataset.lang;
    if (EXAMPLES[langKey]) {
      setTextInput(EXAMPLES[langKey]);
    }
  });
});

// Header Tag Pills Clickable
headerTagPills.forEach(pill => {
  pill.addEventListener('click', () => {
    const langKey = pill.dataset.lang;
    if (EXAMPLES[langKey]) {
      setTextInput(EXAMPLES[langKey]);
    }
  });
});

// Clipboard Paste
pasteBtn.addEventListener('click', async () => {
  try {
    const clipboardText = await navigator.clipboard.readText();
    if (clipboardText) {
      setTextInput(clipboardText);
    }
  } catch (err) {
    // Fallback prompt if clipboard API is restricted
    const userPrompt = prompt('Paste your text here:');
    if (userPrompt) {
      setTextInput(userPrompt);
    }
  }
});

// Clipboard Copy
copyBtn.addEventListener('click', async () => {
  if (!textInput.value) return;
  try {
    await navigator.clipboard.writeText(textInput.value);
    const originalText = copyBtn.innerHTML;
    copyBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" style="width:14px;height:14px;"><polyline points="20 6 9 17 4 12"></polyline></svg>
      Copied!
    `;
    setTimeout(() => {
      copyBtn.innerHTML = originalText;
    }, 1800);
  } catch (err) {
    console.warn('Copy failed:', err);
  }
});

// Initial Detection on Load (defaults to Tamil canonical example or empty ready state)
window.addEventListener('DOMContentLoaded', () => {
  // Load default canonical Tamil example requested in prompt for instant visual delight!
  setTextInput("வணக்கம், எப்படி இருக்கிறீர்கள்?");
});
