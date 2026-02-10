# Chimera Arena

An AI-powered genetic splicing laboratory and battle simulator. Fuse any two animals into unique hybrids and generate epic combat scenes using generative AI.

## Features

- **Animal Fusion**: Select two animals and combine them into a unique chimera hybrid
- **AI Image Generation**: Generate images of your chimera using:
  - **Pollinations AI** — Free, no API key required
  - **Gemini Imagen** — Premium quality, requires a Gemini API key
- **Battle Arena**: Generate both chimeras, then pit them against each other in an AI-generated battle scene
- **Google Sign-In**: Authenticate with your Google account

## Getting Started

1. Open `index.html` in a web browser (or serve with any static file server)
2. Select two animals for each chimera panel
3. Click "Generate Chimera" to create AI images of each hybrid
4. Once both chimeras are generated, click "Generate Battle Scene" to watch them fight!

### API Configuration

- **Pollinations AI** works out of the box with no configuration needed
- **Gemini API**: Enter your [Gemini API key](https://aistudio.google.com/apikey) in the API Configuration section and select "Gemini Imagen" as the provider

### Google Sign-In Setup

To enable Google Sign-In, set your Google OAuth Client ID in `js/auth.js`. You can obtain one from the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).

## Tech Stack

- Vanilla HTML / CSS / JavaScript (no build tools required)
- [Pollinations AI](https://pollinations.ai/) for free image generation
- [Gemini API](https://ai.google.dev/) for premium image generation
- [Google Identity Services](https://developers.google.com/identity/gsi/web) for authentication
