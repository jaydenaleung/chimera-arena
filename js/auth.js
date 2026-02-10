/**
 * Google Sign-In authentication module.
 *
 * Uses Google Identity Services (GIS) for sign-in.
 * The Google Client ID should be configured for production use.
 * For demo purposes, the sign-in button initializes when a valid client ID is provided.
 */

const AUTH_CONFIG = {
  // Replace with your own Google OAuth Client ID for production
  // Obtain one at https://console.cloud.google.com/apis/credentials
  GOOGLE_CLIENT_ID: ''
};

let currentUser = null;

/**
 * Initialize Google Sign-In.
 */
function initGoogleAuth() {
  const signinBtn = document.getElementById('google-signin-btn');
  const userProfile = document.getElementById('user-profile');

  if (!AUTH_CONFIG.GOOGLE_CLIENT_ID) {
    // No client ID configured — show a manual sign-in placeholder
    signinBtn.innerHTML =
      '<button class="btn btn-small" id="demo-signin" title="Configure a Google OAuth Client ID for real sign-in">' +
      '🔑 Sign in with Google</button>';
    document.getElementById('demo-signin').addEventListener('click', showClientIdPrompt);
    return;
  }

  initGIS();
}

/**
 * Initialize Google Identity Services with a valid client ID.
 */
function initGIS() {
  if (typeof google === 'undefined' || !google.accounts) {
    // GIS library not loaded yet, retry after a short delay
    setTimeout(initGIS, 500);
    return;
  }

  google.accounts.id.initialize({
    client_id: AUTH_CONFIG.GOOGLE_CLIENT_ID,
    callback: handleGoogleSignIn
  });

  google.accounts.id.renderButton(
    document.getElementById('google-signin-btn'),
    { theme: 'outline', size: 'medium', type: 'standard' }
  );
}

/**
 * Prompt the user to enter a Google Client ID for demo purposes.
 */
function showClientIdPrompt() {
  const clientId = prompt(
    'Enter your Google OAuth Client ID to enable sign-in.\n' +
    'Get one at: https://console.cloud.google.com/apis/credentials\n\n' +
    'Leave empty to continue without sign-in.'
  );
  if (clientId && clientId.trim()) {
    AUTH_CONFIG.GOOGLE_CLIENT_ID = clientId.trim();
    initGIS();
  }
}

/**
 * Handle Google Sign-In credential response.
 */
function handleGoogleSignIn(response) {
  const payload = parseJwt(response.credential);
  if (!payload) return;

  currentUser = {
    name: payload.name,
    email: payload.email,
    picture: payload.picture
  };

  updateAuthUI();
}

/**
 * Parse a JWT token to extract the payload.
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

/**
 * Update the UI to reflect the current auth state.
 */
function updateAuthUI() {
  const signinBtn = document.getElementById('google-signin-btn');
  const userProfile = document.getElementById('user-profile');

  if (currentUser) {
    signinBtn.classList.add('hidden');
    userProfile.classList.remove('hidden');
    document.getElementById('user-avatar').src = currentUser.picture || '';
    document.getElementById('user-name').textContent = currentUser.name || currentUser.email;
  } else {
    signinBtn.classList.remove('hidden');
    userProfile.classList.add('hidden');
  }
}

/**
 * Sign out the current user.
 */
function signOut() {
  currentUser = null;
  if (typeof google !== 'undefined' && google.accounts) {
    google.accounts.id.disableAutoSelect();
  }
  updateAuthUI();
  // Re-show sign-in button
  initGoogleAuth();
}
