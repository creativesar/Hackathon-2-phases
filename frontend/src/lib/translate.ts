"use client";

/**
 * Translation utility using OpenAI API
 * Automatically translates task content based on current locale
 */

interface TranslationCache {
  [key: string]: string;
}

// In-memory cache for translations
const translationCache: TranslationCache = {};

// Load cache from localStorage on client side
if (typeof window !== "undefined") {
  try {
    const cached = localStorage.getItem("translation_cache");
    if (cached) {
      Object.assign(translationCache, JSON.parse(cached));
    }
  } catch (e) {
    console.error("Failed to load translation cache:", e);
  }
}

/**
 * Save translation cache to localStorage
 */
function saveCache() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("translation_cache", JSON.stringify(translationCache));
    } catch (e) {
      console.error("Failed to save translation cache:", e);
    }
  }
}

/**
 * Generate cache key for translation
 */
function getCacheKey(text: string, targetLang: string): string {
  return `${text}|${targetLang}`;
}

/**
 * Detect if text is in English (simple heuristic)
 */
function isEnglish(text: string): boolean {
  // Check if text contains mostly ASCII characters
  const asciiCount = text.split("").filter((c) => c.charCodeAt(0) < 128).length;
  return asciiCount / text.length > 0.8;
}

/**
 * Detect if text is in Urdu (simple heuristic)
 */
function isUrdu(text: string): boolean {
  // Check if text contains Urdu Unicode range (0600-06FF)
  const urduCount = text.split("").filter((c) => {
    const code = c.charCodeAt(0);
    return code >= 0x0600 && code <= 0x06ff;
  }).length;
  return urduCount / text.length > 0.3;
}

/**
 * Translate text using OpenAI API
 */
async function translateWithOpenAI(
  text: string,
  targetLang: string
): Promise<string> {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${API_URL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        target_language: targetLang === "ur" ? "Urdu" : "English",
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.status}`);
    }

    const data = await response.json();
    return data.translated_text || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Return original text on error
  }
}

/**
 * Translate text to target language with caching
 */
export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (!text || !text.trim()) {
    return text;
  }

  // If target is English and text is already English, return as-is
  if (targetLang === "en" && isEnglish(text)) {
    return text;
  }

  // If target is Urdu and text is already Urdu, return as-is
  if (targetLang === "ur" && isUrdu(text)) {
    return text;
  }

  // Check cache first
  const cacheKey = getCacheKey(text, targetLang);
  if (translationCache[cacheKey]) {
    return translationCache[cacheKey];
  }

  // Translate using OpenAI
  const translated = await translateWithOpenAI(text, targetLang);

  // Cache the result
  translationCache[cacheKey] = translated;
  saveCache();

  return translated;
}

/**
 * Batch translate multiple texts
 */
export async function translateBatch(
  texts: string[],
  targetLang: string
): Promise<string[]> {
  const promises = texts.map((text) => translateText(text, targetLang));
  return Promise.all(promises);
}

/**
 * Clear translation cache
 */
export function clearTranslationCache() {
  Object.keys(translationCache).forEach((key) => delete translationCache[key]);
  if (typeof window !== "undefined") {
    localStorage.removeItem("translation_cache");
  }
}
