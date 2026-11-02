# Smart Utility Desk

A responsive Telegram Mini App starter built with plain HTML, CSS and JavaScript.

## Included features

- Text analyzer: word, character and sentence counts, estimated reading time
- Text converter: uppercase, lowercase, title case, sentence case, whitespace cleanup, reverse
- Unit converter: length, weight and temperature
- Quick notes: create, edit and save notes in browser localStorage
- Timer and stopwatch: countdown, pause/resume, reset and lap times
- QR generator: generate and download a PNG QR code

## Run locally

Because this is a static app, you can use any local static server. For example:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

The QR generator loads QRCode.js from a CDN, so it needs an internet connection. For production, consider self-hosting a reviewed copy of that library and pinning its version.

## Deploy

### Cloudflare Pages
1. Create a Git repository and upload the project files.
2. In Cloudflare Dashboard, open Workers & Pages → Create → Pages → Connect to Git.
3. Select the repository.
4. Use no build command and set the build output directory to `/` (or the repository root, depending on the dashboard UI).
5. Deploy and confirm the provided HTTPS URL opens `index.html`.

### Vercel
1. Import the Git repository into Vercel.
2. Choose the Other framework preset.
3. Leave build command and output directory empty/default for a static site.
4. Deploy and test the HTTPS URL.

## Telegram setup
1. Create or select a bot using @BotFather.
2. Configure a Mini App / menu button and use the deployed HTTPS URL.
3. Open the bot in Telegram on Android and Desktop and test all screens.
4. This starter calls `Telegram.WebApp.ready()` and `expand()` when opened inside Telegram.

## Before AdsGram submission
- Replace the project name, icon and sample copy if desired; keep branding consistent.
- Add a real support contact to `privacy.html`.
- Review privacy wording against your actual deployment and any services you add.
- Test all tools on mobile and desktop; test empty, long and invalid inputs.
- Verify the bot, menu button and Mini App URL work reliably.
- If integrating AdsGram, use the current official AdsGram SDK documentation and your own issued block ID. Do not invent a block ID.
- Keep the core utility features usable without ads. Do not force ad views or fabricate user activity.
- Submit the real working Mini App URL and describe its actual functionality truthfully.

## Important limitations
- Notes are stored in localStorage on the current browser/device and do not sync between devices.
- This starter has no backend, user account system, analytics, or AdsGram ad integration.
- Telegram `initDataUnsafe` is used only for a display initial. Never use it as authentication. Validate raw `initData` on a trusted server before relying on Telegram identity.
- Approval is determined by AdsGram moderation; this project cannot guarantee approval.
