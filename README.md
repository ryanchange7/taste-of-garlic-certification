# Taste of Garlic Line Cook Certification

A bilingual, mobile-first Netlify application that validates recipe knowledge and finished-dish execution.

## What it does

- embeds the required 2:41 Creamy Garlic Fettuccines training video;
- requires full-video confirmation before submission;
- securely grades 12 recipe and CQP questions on the server;
- supports the full cook experience in English and Spanish;
- requires and optimizes one finished-dish photo;
- stores photos privately in encrypted Netlify Blobs with signed review links;
- sends every attempt through an authenticated, keyless Apps Script webhook to **TOGarlic Certification**;
- shows immediate scores and localized coaching;
- keeps final certification pending until a manager reviews the photo.

## Deploy

Follow [NETLIFY-DEPLOY.md](NETLIFY-DEPLOY.md). The deployment uses a Git-connected Netlify project, three protected environment variables, and the included one-file Apps Script webhook. It does not require a Google Cloud service account or JSON key.

The first certification submission creates and formats the **Certification Results** tab if it does not already exist.

## Commands

```bash
npm install
npm test
npm run build
npm run preview
```

The committed production page is `public/index.html`; Netlify does not need to run a build command. Netlify Functions live in `netlify/functions/`.

## Manager workflow

1. Open **TOGarlic Certification > Certification Results**.
2. Open the cook's signed **Photo URL** and compare the dish with the CQPs.
3. Set **Photo Review** to `Approved` or `Needs Retry`.
4. **Final Status** updates automatically to Certified, Pending Photo Review, Knowledge Retake Required, or Photo Retry Required.

## Certification standard

- Knowledge: 80% or higher (10 of 12 correct).
- Training: full-video confirmation is required.
- Skill evidence: one required photo of the selected Creamy Garlic Fettuccine.
- Final certification: knowledge pass plus manager-approved photo.

## Apps Script files

`AppsScriptWebhook.gs` is the required keyless Google Sheets bridge for the Netlify deployment. `Code.gs` and `appsscript.json` are retained only as references to the earlier all-Apps-Script version and are not required by Netlify.
