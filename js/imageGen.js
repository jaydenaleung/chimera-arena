/**
 * Image generation module.
 *
 * Supports two providers:
 * 1. Pollinations AI — free, no API key needed, URL-based image generation
 * 2. Gemini Imagen — requires a Gemini API key
 */

/**
 * Get the currently selected image provider.
 */
function getProvider() {
  return document.getElementById('provider-select').value;
}

/**
 * Get the stored Gemini API key.
 */
function getGeminiApiKey() {
  return localStorage.getItem('gemini_api_key') || '';
}

/**
 * Save the Gemini API key to localStorage.
 */
function saveGeminiApiKey(key) {
  localStorage.setItem('gemini_api_key', key);
}

/**
 * Generate a chimera image using the selected provider.
 * Returns a URL (Pollinations) or a base64 data URL (Gemini).
 */
async function generateChimeraImage(animalA, animalB) {
  const chimeraName = buildChimeraName(animalA, animalB);
  const prompt = `A highly detailed digital painting of a mythical hybrid creature that is half ${animalA} and half ${animalB}, called "${chimeraName}". The creature combines physical features of both animals seamlessly. Epic fantasy style, dramatic lighting, full body portrait on a dark atmospheric background.`;

  const provider = getProvider();
  if (provider === 'gemini') {
    return await generateWithGemini(prompt);
  }
  return generateWithPollinations(prompt);
}

/**
 * Generate a battle scene image using the selected provider.
 */
async function generateBattleImage(chimera1Name, chimera2Name, animals1, animals2) {
  const prompt = `An epic battle scene between two mythical hybrid creatures. On the left: "${chimera1Name}", a hybrid of ${animals1[0]} and ${animals1[1]}. On the right: "${chimera2Name}", a hybrid of ${animals2[0]} and ${animals2[1]}. They are fighting each other in a dramatic arena with fire and lightning. Highly detailed digital art, cinematic lighting, action pose, fantasy illustration style.`;

  const provider = getProvider();
  if (provider === 'gemini') {
    return await generateWithGemini(prompt);
  }
  return generateWithPollinations(prompt);
}

/**
 * Generate an image using Pollinations AI (free, no key required).
 * Returns a URL string.
 */
function generateWithPollinations(prompt) {
  const encoded = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${encoded}?width=768&height=768&seed=${seed}&nologo=true`;
}

/**
 * Generate an image using the Gemini API.
 * Returns a base64 data URL string.
 */
async function generateWithGemini(prompt) {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key is not configured. Please add your key in the API Configuration section.');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `Generate an image: ${prompt}` }]
      }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE']
      }
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gemini API error: ${response.status}`);
  }

  const data = await response.json();
  const parts = data.candidates?.[0]?.content?.parts || [];

  for (const part of parts) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
  }

  throw new Error('Gemini did not return an image. Try a different prompt or use Pollinations AI instead.');
}
