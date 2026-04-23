import { useState } from "react";

const LANGUAGES = [
  { label: "Bengali", value: "bn" },
  { label: "Spanish", value: "es" },
  { label: "French", value: "fr" },
  { label: "Arabic", value: "ar" },
  { label: "Hindi", value: "hi" },
  { label: "Chinese", value: "zh" },
  { label: "Japanese", value: "ja" },
  { label: "German", value: "de" },
  { label: "Portuguese", value: "pt" },
  { label: "Russian", value: "ru" },
];

function stripHtml(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.innerText || div.textContent || "";
}

async function translateText(text, targetLang) {
  const plainText = stripHtml(text); // MyMemory doesn't handle HTML well
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(plainText)}&langpair=en|${targetLang}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.responseStatus !== 200) throw new Error("Translation failed");
  return data.responseData.translatedText;
}

export default function PostContent({ description, maxLength = 300 }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [translatedContent, setTranslatedContent] = useState(null);
  const [translatedLang, setTranslatedLang] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  if (!description) return null;

  const displayContent = translatedContent ?? description;
  const isLongContent = description.length > maxLength;

  async function handleTranslate(e) {
    const lang = e.target.value;
    if (!lang) return;
    e.target.value = ""; // reset dropdown

    // Toggle off if same language selected again
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
      setTranslatedLang(LANGUAGES.find((l) => l.value === lang)?.label ?? lang);
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

  return (
    <div className="mb-3">
      {/* Content — plain text if translated (HTML if original) */}
      <div
        className={`text-gray-800 leading-relaxed text-sm ${
          !showFullContent && isLongContent ? "line-clamp-3" : ""
        }`}
      >
        {translatedContent ? (
          translatedContent
        ) : (
          <span dangerouslySetInnerHTML={{ __html: description }} />
        )}
      </div>

      <div className="flex items-center gap-3 flex-wrap mt-1">
        {/* Read more / Show less */}
        {isLongContent && (
          <button
            onClick={() => setShowFullContent(!showFullContent)}
            className="text-secondary text-sm font-semibold hover:underline"
          >
            {showFullContent ? "Show less" : "Read more"}
          </button>
        )}

        {/* Translate dropdown */}
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

        {/* Translated badge + revert */}
        {translatedLang && !isTranslating && (
          <span className="text-xs text-gray-400 flex items-center gap-1">
            Translated · {translatedLang} ·{" "}
            <button onClick={handleShowOriginal} className="underline hover:text-gray-600">
              See original
            </button>
          </span>
        )}
      </div>

      {/* Error message */}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}