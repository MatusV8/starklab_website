# Stark Lab Website — Maintenance Manual

A short guide for editing the website's content. You never need to touch code
to update news, publications, members or the journal club schedule.

## 1. How the site works

- **Framework:** Next.js (React), running on Node.js. Content is edited in
  CSV files; the site reads them when it starts.
- **Where content lives:** `public/data/*.csv` (UTF-8 CSV with a header row).
  Columns are matched case-insensitively and tolerate spaces, underscores and
  hyphens: `Main Paper`, `main_paper` and `main-paper` are the same column.
  Blank lines and lines starting with `#` are ignored.
- **Multi-line text:** a real line break cannot be stored inside a CSV cell.
  Write the two characters `\n` where you want a paragraph break.
- **Journal club is the exception:** it reads a published **Google Sheet**
  (set in `lib/data.ts` → `journalClubInfo.sheetUrl`). Edit the sheet online;
  changes appear within about 5 minutes. If the sheet is briefly unreachable
  the site keeps showing the last copy it loaded.
- **Fixed texts** (page titles, section headings, research descriptions,
  banner images) live in `lib/data.ts`. Edit that file when a page's wording
  must change.

## 2. Running the site locally

```bash
npm install        # once
npm run dev        # starts http://localhost:3000
```

Open `http://localhost:3000` in a browser. Changes to CSV files appear after
a refresh; changes to `lib/*.ts` appear automatically.

## 3. Events — `public/data/events.csv`

| Column      | Required | Content |
|-------------|----------|---------|
| `title`     | yes      | Headline of the news item. |
| `date`      | yes      | `DD.MM.YY` or `DD.MM.YYYY` (e.g. `25.08.26`). Displayed as DD.MM.YYYY. |
| `description` | no     | Body text. Supports the link syntax below. |
| `image`     | no       | Path or URL of a picture, e.g. `/images/news/daphnia.jpg`. |

**Links inside descriptions:** `[visible text](/some/page)` for internal pages
or `[visible text](https://example.com)` for external ones. To link a paper's
own page: `[Pachano et al. 2026](/publications/Chen2026)` — the last part is
the paper's `slug` (see below). One event per row, newest at the top.

## 4. Publications — `public/data/publications.csv`

One row per paper. The `slug` decides the paper's web address
(`/publications/<slug>`), so never change a slug once the page is live or
linked from somewhere.

| Column | Required | Content |
|--------|----------|---------|
| `title` | yes | Full paper title. |
| `slug` | auto | Short ID: first-author surname + year, e.g. `Chen2026`. If two papers share author and year, a letter is appended: `Appel2021a`, `Appel2021b`. If left empty it is generated from the title. |
| `authors` | yes | Semicolon-separated, e.g. `Chen T; Loubiere V; Stark A`. |
| `journal` | yes | Journal name as displayed. |
| `year` | yes | `YYYY` or a full date `DD.MM.YYYY` (used for sorting). |
| `url` | yes | Link to the paper (DOI, PubMed or publisher page). |
| `image` | no | Path/URL of a figure, shown on the paper's own page (not in the list), e.g. `/images/publications/Pachano_2026.jpg`. |
| `summary` | no | Abstract shown on the paper's page. Reference numbers are not wanted — write plain prose. |
| `github`, `zenodo`, `geo`, `pride`, `pdb`, `addgene`, `ucsc`, `thread`, `other` | no | Data/code links shown as labelled buttons. Multiple entries per cell are separated by `;`. Default label is the column name; override with `Label|https://…`. |

## 5. Members — `public/data/members.csv`

| Column | Required | Content |
|--------|----------|---------|
| `name` | yes | Full name. |
| `role` | yes | Job title as displayed, e.g. `PhD Student`. |
| `category` | yes | One of: `group-leader`, `postdoc`, `phd`, `master-student`, `research-technician`, `intern`, `alumni`. Common spellings ("Group Leader", "PI", "master") are accepted; unknown values fall back to `phd`. Alumni rows (category `alumni`) are listed on the Alumni page. |
| `nationality` | no | Country of origin. |
| `bio` | no | Short biography. Use `\n` for paragraph breaks. |
| `email` | no | E-mail address. |
| `scholar` | no | Google Scholar profile URL. |
| `image` | no | Portrait, path or URL, e.g. `/images/members/jane.jpg`. |

Leave a cell empty if it does not apply — empty fields simply don't render.

## 6. Journal club — Google Sheet

Columns: `date`, `tag`, `main_presenter`, `short_presenter`, `main_link`,
`short_link`. Date format `DD.MM.YY`.

- `tag`: leave empty for normal weeks; `first_author_JC` marks a First Author
  Journal Club (highlighted card, single paper).
- Presenter cells accept a plain name (`Felix`) or a session label
  (`First Author JC Yusuke (9:30)` — the prefix is stripped automatically).
- `main_link` / `short_link`: paper URLs (bioRxiv/PubMed). Rows without any
  link are not shown.
- Changes in the sheet appear after the sheet's next fetch/refresh.

## 7. Other things you may want to change

- **Banner images and page photos:** `lib/data.ts` → `pageImages` and
  `bannerCredits`. Files belong in `public/images/…`; reference them as
  `/images/…`. Banner size and crop are set in `components/site/page-banner.tsx`.
- **Videos:** research-page banners/videos and inline videos are embedded
  YouTube iframes in `app/research/page.tsx` / `components/site/research-section.tsx`.
  Inline video markers in research descriptions: `{{youtube:VIDEO_ID:seconds}}`.
- **Emphasis in descriptions/captions:** `**bold**` and `*italic*` work in
  research texts and image captions.
- **Navigation links:** `lib/data.ts` → `navLinks`.

## 8. Good practice

1. Edit CSVs in a plain-text editor or Excel (keep UTF-8; the files use a BOM).
2. After editing, refresh the local site and glance at the affected page.
3. Commit changes with a short message, e.g. `content: add Chen2026 paper`.
4. The `.next/` folder is build output — never edit it.
