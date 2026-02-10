/**
 * Main application logic for Chimera Arena.
 */

// State to track generated chimeras
const state = {
  chimera1: null, // { name, animalA, animalB, imageUrl }
  chimera2: null
};

/**
 * Initialize the application.
 */
function initApp() {
  populateAnimalDropdowns();
  initGoogleAuth();
  loadSavedApiKey();
  bindEvents();
}

/**
 * Load a previously saved API key into the input field.
 */
function loadSavedApiKey() {
  const saved = getGeminiApiKey();
  if (saved) {
    document.getElementById('gemini-key-input').value = saved;
  }
}

/**
 * Bind all event listeners.
 */
function bindEvents() {
  // Save API key
  document.getElementById('save-key-btn').addEventListener('click', () => {
    const key = document.getElementById('gemini-key-input').value.trim();
    saveGeminiApiKey(key);
    showToast(key ? 'Gemini API key saved!' : 'Gemini API key cleared.');
  });

  // Generate chimera buttons
  document.querySelectorAll('.generate-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const chimeraNum = parseInt(btn.dataset.chimera, 10);
      handleGenerateChimera(chimeraNum);
    });
  });

  // Battle button
  document.getElementById('battle-btn').addEventListener('click', handleBattle);

  // Sign out
  document.getElementById('signout-btn').addEventListener('click', signOut);

  // Provider change — warn if Gemini selected without key
  document.getElementById('provider-select').addEventListener('change', (e) => {
    if (e.target.value === 'gemini' && !getGeminiApiKey()) {
      showToast('Please enter your Gemini API key first.');
    }
  });
}

/**
 * Handle chimera generation.
 */
async function handleGenerateChimera(chimeraNum) {
  const animalA = document.getElementById(`animal-${chimeraNum}a`).value;
  const animalB = document.getElementById(`animal-${chimeraNum}b`).value;
  const resultEl = document.getElementById(`result-${chimeraNum}`);

  if (animalA === animalB) {
    showToast('Please select two different animals!');
    return;
  }

  showLoading(`Fusing ${animalA} + ${animalB}...`);

  try {
    const imageUrl = await generateChimeraImage(animalA, animalB);
    const chimeraName = buildChimeraName(animalA, animalB);

    state[`chimera${chimeraNum}`] = {
      name: chimeraName,
      animalA,
      animalB,
      imageUrl
    };

    // Render result
    resultEl.innerHTML = '';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `${chimeraName} - ${animalA} + ${animalB} hybrid`;
    img.addEventListener('load', hideLoading);
    img.addEventListener('error', () => {
      hideLoading();
      resultEl.innerHTML = '<div class="placeholder">Failed to load image. Please try again.</div>';
    });
    resultEl.appendChild(img);

    const nameTag = document.createElement('div');
    nameTag.className = 'chimera-name';
    nameTag.textContent = `${chimeraName} (${animalA} × ${animalB})`;
    resultEl.appendChild(nameTag);

    // If using Pollinations (URL-based), image loading may take time
    if (getProvider() === 'pollinations') {
      // Set a timeout in case load event fires slow
      setTimeout(hideLoading, 15000);
    }

    updateBattleButton();
  } catch (err) {
    hideLoading();
    showToast(err.message || 'Failed to generate chimera.');
  }
}

/**
 * Handle battle generation.
 */
async function handleBattle() {
  if (!state.chimera1 || !state.chimera2) {
    showToast('Generate both chimeras first!');
    return;
  }

  showLoading(`${state.chimera1.name} vs ${state.chimera2.name} — FIGHT!`);

  try {
    const imageUrl = await generateBattleImage(
      state.chimera1.name,
      state.chimera2.name,
      [state.chimera1.animalA, state.chimera1.animalB],
      [state.chimera2.animalA, state.chimera2.animalB]
    );

    const resultEl = document.getElementById('battle-result');
    resultEl.innerHTML = '';

    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = `Battle: ${state.chimera1.name} vs ${state.chimera2.name}`;
    img.addEventListener('load', hideLoading);
    img.addEventListener('error', () => {
      hideLoading();
      resultEl.innerHTML = '<div class="placeholder">Failed to load battle image. Please try again.</div>';
    });
    resultEl.appendChild(img);

    const nameTag = document.createElement('div');
    nameTag.className = 'chimera-name';
    nameTag.textContent = `⚔️ ${state.chimera1.name} vs ${state.chimera2.name} ⚔️`;
    resultEl.appendChild(nameTag);

    if (getProvider() === 'pollinations') {
      setTimeout(hideLoading, 15000);
    }
  } catch (err) {
    hideLoading();
    showToast(err.message || 'Failed to generate battle scene.');
  }
}

/**
 * Enable battle button only when both chimeras exist.
 */
function updateBattleButton() {
  const btn = document.getElementById('battle-btn');
  btn.disabled = !(state.chimera1 && state.chimera2);
}

/**
 * Show the loading overlay with a custom message.
 */
function showLoading(message) {
  document.getElementById('loading-text').textContent = message || 'Generating...';
  document.getElementById('loading-overlay').classList.remove('hidden');
}

/**
 * Hide the loading overlay.
 */
function hideLoading() {
  document.getElementById('loading-overlay').classList.add('hidden');
}

/**
 * Display a temporary toast message.
 */
function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.style.cssText =
      'position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);' +
      'background:rgba(0,0,0,0.85);color:#fff;padding:0.75rem 1.5rem;' +
      'border-radius:8px;z-index:2000;font-size:0.95rem;transition:opacity 0.3s;';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.style.opacity = '1';
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.style.opacity = '0';
  }, 3000);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
