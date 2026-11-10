# Stark Lab Website

The website is built with [Next.js](https://nextjs.org) (React, TypeScript, Tailwind CSS).
All content — news, publications and team members — lives in plain CSV files,
so updating the site never requires touching code. See
[MAINTENANCE.md](MAINTENANCE.md) for how to edit each kind of content.

## Requirements

- [Node.js](https://nodejs.org) **20.9 or newer** (npm comes with it)
- [Git](https://git-scm.com)


## Run it locally

```bash
git clone https://github.com/MatusV8/starklab_website.git
cd starklab_website
npm ci
npm run dev
```

Then open <http://localhost:3000>. `npm ci` installs the exact package
versions recorded in `package-lock.json`.

Edits to the CSV files in `public/data/` appear after a page refresh.

## Run it in production

```bash
npm ci
npm run build
SITE_URL=https://your-domain.org npm start
```

The site listens on port 3000 by default (`npm start -- -p 8080` to change
it). Put it behind a web server such as nginx or Caddy for HTTPS.

Hosting services that support Next.js, such as Vercel or Netlify, run these
steps automatically: connect the GitHub repository and set `SITE_URL` in their
settings.

### Settings

| Variable   | Purpose                                                        |
|------------|----------------------------------------------------------------|
| `SITE_URL` | The site's public address, used for link previews when a page is shared. Defaults to `http://localhost:3000`. |

### Updating content on a running site

Pages refresh their content from the CSV files every 5 minutes, so edited CSV
files on the server show up without a rebuild. New or changed images need a restart (`npm start` again). Changes to code or `lib/data.ts` need npm run build followed by a restart.

## Internet access

The server needs outbound internet access for two things:

- **Journal club:** entries are read from a published Google Sheet (set in
  `lib/data.ts` → `journalClubInfo.sheetUrl`). The sheet must stay shared as
  "anyone with the link can view".
- **Paper details:** titles, authors and journals for journal club papers are
  looked up from PubMed, bioRxiv and Crossref.

If these are unreachable, the rest of the site works normally.

## Project structure

```
app/              Pages (one folder per URL, e.g. app/events → /events)
components/site/  Building blocks used by the pages (cards, navbar, footer…)
lib/              Data loading and helpers
  data.ts         Fixed texts: page titles, research descriptions, contact info
public/data/      Content: events.csv, publications.csv, members.csv
public/images/    Photos and figures, referenced as /images/…
public/fonts/     Self-hosted fonts (Inter, Inter Tight, JetBrains Mono)
proxy.ts          Security headers for every page
MAINTENANCE.md    How to edit the content
```

## Useful commands

| Command         | What it does                              |
|-----------------|-------------------------------------------|
| `npm run dev`   | Development server with live reload       |
| `npm run build` | Production build                          |
| `npm start`     | Serve the production build                |
| `npm run lint`  | Check the code for common mistakes        |
