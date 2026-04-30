import { useState } from "react";

const LANGUAGES = [
  { label: "Bengali", value: "bn" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "Arabic", value: "ar" },
  { label: "Hindi", value: "hi" },
  { label: "Chinese", value: "zh-CN" },
  { label: "Japanese", value: "ja" },
  { label: "German", value: "de" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
  { label: "Italian", value: "it" },
  { label: "Korean", value: "ko" },
];

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText || div.textContent || "";
}

function chunkText(text, maxChars = 490) {
  // Split by sentence endings to keep chunks meaningful
  const sentences = text.match(/[^.!?]+[.!?]*/g) || [text];
  const chunks = [];
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxChars) {
      if (current) chunks.push(current.trim());
      // If a single sentence itself exceeds limit, split by words
      if (sentence.length > maxChars) {
        const words = sentence.split(" ");
        let wordChunk = "";
        for (const word of words) {
          if ((wordChunk + " " + word).length > maxChars) {
            if (wordChunk) chunks.push(wordChunk.trim());
            wordChunk = word;
          } else {
            wordChunk += " " + word;
          }
        }
        if (wordChunk) chunks.push(wordChunk.trim());
        current = "";
      } else {
        current = sentence;
      }
    } else {
      current += sentence;
    }
  }
  if (current) chunks.push(current.trim());
  return chunks;
}

async function translateChunk(chunk, targetLang) {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|${targetLang}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.responseStatus !== 200) throw new Error("Translation failed");
  return data.responseData.translatedText;
}

async function translateText(text, targetLang) {
  const plainText = stripHtml(text);
  const chunks = chunkText(plainText);

  // Translate all chunks in parallel
  const results = await Promise.all(
    chunks.map((chunk) => translateChunk(chunk, targetLang))
  );

  return results.join(" ");
}

export default function PostContent({ description, maxLength = 300 }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [translatedLang, setTranslatedLang] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  if (!description) return null;

  const isLongContent = description.length > maxLength;

  async function handleTranslate(e) {
    const lang = e.target.value;
    if (!lang) return;
    e.target.value = "";

    // Clicking same language reverts
    if (lang === translatedLang) {
      setTranslatedContent(null);
      setTranslatedLang(null);
      return;
    }

    setIsTranslating(true);
    setError(null);

    try {
      const result = await translateText(description, lang);
      setTranslatedContent(result);
      setTranslatedLang(lang);
    } catch (err) {
      setError("Translation failed. Please try again.");
    } finally {
      setIsTranslating(false);
    }
  }

  function handleShowOriginal() {
    setTranslatedContent(null);
    setTranslatedLang(null);
    setError(null);
  }

  const langLabel = LANGUAGES.find((l) => l.value === translatedLang)?.label;

  return (
    <div className="mb-3">
      <div
        className={`text-gray-800 leading-relaxed text-sm ${
          !showFullContent && isLongContent ? "line-clamp-3" : ""
        }`}
      >
        {translatedContent ? (
          // Plain text after translation (HTML stripped)
          translatedContent
        ) : (
          // Original with HTML preserved
          <span dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap mt-1">
        {isLongContent && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-secondary text-sm font-semibold hover:underline"
          >
            {showFullContent ? "Show less" : "Read more"}
          </button>
        )}

        {isTranslating ? (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Translating...
          </span>
        ) : (
          <select
            onChange={handleTranslate}
            defaultValue=""
            className="text-xs border border-gray-200 rounded-md px-2 py-1 text-gray-600 bg-gray-50 cursor-pointer"
          >
            <option value="" disabled>🌐 Translate</option>
            {LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>
        )}

        {translatedLang && !isTranslating && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            Translated · {langLabel} ·{" "}
            <button
              onClick={handleShowOriginal}
              className="underline hover:text-gray-600"
            >
              See original
            </button>
          </span>
        )}
      </div>

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}