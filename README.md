# GATE DA — Notes

Digitised study notes for the GATE **Data Science & AI (DA)** paper, February 2027.

**Live site:** https://theskpaul.github.io/gate-da-notes/

Each topic page carries the typed note *and* the original handwritten pages, so the
transcription can always be checked against the source.

## Pages

| Page | What it is |
|---|---|
| `index.html` | Hub: revision index by syllabus section, with coverage status |
| `progress.html` | Every syllabus topic with its status |
| `calendar.html` | Exam countdown, month grids, note-upload history |
| `bfs.html` | Uninformed Search — BFS (DA-110) |
| `dfs.html` | Depth First Search — DFS (DA-110) |
| `comparison.html` | BFS vs DFS on the same graph (DA-110) |
| `matrices.html` | Matrices & Determinants (DA-032) |

## How it is built

- Plain HTML + one stylesheet (`assets/site.css`). No framework, no build step.
- `assets/player.js` — animated graph traversal: Play / Step / Reset, highlighting the
  current node and everything visited so far. Data comes from a JSON blob per page.
- `assets/calendar.js` — builds the month grids, the exam countdown and the upload log
  from a single JSON blob.
- `assets/img/` — the original handwritten pages, downscaled for the web.
- Light and dark themes follow the system setting.

## Adding a note

1. Digitise the page and add it under `assets/img/`.
2. Create the topic HTML and link it from `index.html` and `progress.html`.
3. Add the date + title to the events list in `calendar.html`.
