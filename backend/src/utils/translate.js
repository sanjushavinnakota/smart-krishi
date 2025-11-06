const translate = require("@vitalets/google-translate-api");

/**
 * Translate text into a target language
 * @param {string} text - text to translate
 * @param {string} targetLang - language code ("hi", "ta", "te", etc.)
 */
const translateText = async (text, targetLang = "en") => {
  try {
    if (!text) return text;
    const res = await translate(text, { to: targetLang });
    return res.text;
  } catch (err) {
    console.error("Translation error:", err.message);
    return text; // fallback to original
  }
};

module.exports = { translateText };
