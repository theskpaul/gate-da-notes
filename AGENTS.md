# AGENTS.md

Guidance for AI agents (and future-you) working on this repository.

## What this is

A static study-notes site for the **GATE Data Science & AI (DA)** paper, published on GitHub Pages at
<https://theskpaul.github.io/gate-da-notes/>.

**There is no build step.** No framework, no bundler, no `package.json`. The HTML in this repository *is*
what gets served. Edit a file, commit, push — GitHub Pages rebuilds automatically in about 30 seconds.

## Ground rules

- **These are the user's own handwritten notes, digitised.** Every trace, edge, value and date on the site
  should come from a real page the user wrote or typed. Never invent one, and never "tidy up" a trace to make
  it look better.
- **Handwriting is often ambiguous.** When a graph edge or a trace step is unclear, say exactly which part is
  uncertain and ask. Do not guess and publish. A wrong trace in the notes is worse than a missing page,
  because the whole point of the site is that it can be checked against the source photos.
- **Correct mistakes openly.** If a handwritten trace contradicts the algorithm, build the page with the
  correct trace and put a callout on the page explaining where the original went wrong and why.
- **Verify, don't assume.** Load pages in a headless browser and check computed values. Several past bugs
  (a banner scrolled off-screen, a card clipped by a sticky header, a speed control that changed nothing)
  passed visual inspection and only showed up when measured.

## Layout

```
*.html                 one file per page, all self-contained
assets/site.css        the entire design system, one stylesheet
assets/urgency.js      top banner, live counters, pace-vs-needed, next-up
assets/pyq.js          the PYQ tracker — single source of truth for progress
assets/flip.js         home page only: page-flip scroll + banner show/hide
assets/player.js       graph traversal animation (BFS / DFS)
assets/listplayer.js   linked-list animation
assets/stackplayer.js  stack animation
assets/queueplayer.js  queue animation
assets/speed.js        0.5x/1x/2x/4x control, shared by all four players
assets/code.js         syntax highlighting + copy button + line numbers
assets/calendar.js     month grids and countdown on calendar.html
assets/*.py            downloadable copies of the implementations
assets/img/            the original handwritten photos
```

## Pages

| File | What it is |
|---|---|
| `index.html` | Home. A full-height landing (title, progress, live clock, cards of unfinished sections) plus the revision index below it |
| `progress.html` | Every syllabus topic with a status pill, grouped by section. Sections carry `id="sec-1"` … `id="sec-8"` |
| `coverage.html` | What's left, by section, with the pace needed |
| `calendar.html` | Exam countdown, month grids, and the note-upload history |
| `bfs.html`, `dfs.html`, `comparison.html` | BFS / DFS on trees, plus the undirected comparison |
| `bfs-directed.html`, `comparison-directed.html` | The same searches on a 13-node directed graph |
| `matrices.html` | Linear algebra |
| `linked-list.html`, `stack.html`, `stack-linked.html`, `queue.html`, `queue-linked.html` | Data structures, one page per implementation |

## Adding a note page

Copy an existing note page (`stack.html` is a good template) and keep this shape:

```html
<p class="crumb"><a href="index.html">Index</a> › Section name</p>
<div class="hero"><span class="badge">DA-0xx · Section</span><h1>Page title</h1></div>
<!-- optional implementation switcher -->
<div class="impltabs">
  <a class="impltab is-on" href="a.html">Variant A</a>
  <a class="impltab" href="b.html">Variant B</a>
</div>
<h2><span class="bar"></span>1. Section title</h2>
...
<footer>…</footer>
```

Then, in order:

1. **Add the page to `index.html`** — under the right section card, as
   `<li class="has"><span class="dot"></span><span><a href="new.html">Title</a></span></li>`
2. **Update the section's page count** in that same card: `16 topics · 3 covered · 4 pages`.
3. **Link the note from `progress.html`** — make the topic's `<td>` a link to the new page. Do **not** change
   its status pill: that now tracks PYQs, not notes (see “Progress” below).
4. **Add a `calendar.html` event** for today with the page link.
5. **Link the original photos** at the bottom of the page (`assets/img/…`) so the transcription can be
   checked against the handwriting.

## Progress = PYQs solved (the one thing to know)

Progress is **not** notes. A topic counts as done only when its previous-year questions are solved. The
single source of truth is `assets/pyq.js` → `window.PYQ` (a `total` and a `done: []` array per section).

- `assets/pyq.js` — the only place to edit. To mark a topic solved, add its `data-key` (from `progress.html`)
  to that section's `done` array, e.g. `done: ["sec-2-matrices"]`.
- `assets/urgency.js` — reads `window.PYQ` for the global bar, banner, pace and next-up.
- `assets/pyq.js` also renders every per-section number: the `[data-sec]` blocks in `index.html` (cards),
  `progress.html` (section headers) and `coverage.html` (table rows), plus the `tr[data-key]` status pills.
- Numbers written in the HTML are no-JS fallbacks only — do not hand-edit them; they are recomputed from
  `window.PYQ` on load.
- `pyq.js` must load **before** `urgency.js` on every page. Both are `defer`, so source order decides.

## Cache-busting — mandatory

GitHub Pages caches assets hard. **Whenever you edit a CSS or JS file, bump its `?v=` number in every page
that references it**, or users keep the old file and report "the styling is broken".

Current numbers live in the `<script src>` / `<link href>` tags. Search the repo for `?v=` before you commit.

## Animations

Four players, all driven by a JSON blob in a `<script type="application/json">` and a small markup block.

**Graph player** (`player.js`) — used by `bfs.html`, `dfs.html`, `comparison*.html`, `bfs-directed.html`:

```json
{"id":"g-x","directed":true,"width":900,"height":470,"speed":1100,
 "nodes":{"A":[450,42], "...":[0,0]},
 "edges":[["A","B"]],
 "steps":[{"v":"A","p":null,"t":"visit A · enqueue B, C"}]}
```

- `p` is the **parent** — only the edges actually used by the search are highlighted.
- `directed: true` draws arrowheads and trims lines to the circle edge.

**List / stack / queue players** use their own simpler shapes:
`{"steps":[{"list":["a","b"],"hi":0,"cap":"…"}]}`, `{"s":[…],"hi":…}`, `{"q":[…],"hi":…}`.

All four honour the speed control through `assets/speed.js`. **`speed.js` must load before the player
scripts** — they call `window.PlayerSpeed.wire()` at startup, and if it isn't defined yet the buttons render
but do nothing.

## Code blocks

Write them as plain `<pre><code>…</code></pre>` with HTML-escaped Python. `assets/code.js` upgrades them at
runtime into a highlighted block with a copy button and a line-number gutter. No markup changes needed.

After editing, confirm the rendered `textContent` still matches the source file exactly — a bad highlighter
regex silently eats characters.

## Design system

One stylesheet, CSS custom properties, light and dark themes via `prefers-color-scheme`.

- Type: `--font-serif` for headings (Source Serif 4), `--font-sans` for body (Inter), `--font-mono` for code
  (JetBrains Mono)
- Palette: warm cream `--bg`, gold `--accent`, green `--ok`
- Components: `.card`, `.pill`, `.badge`, `.tw` (scrollable table wrapper), `.sec` (collapsible index card),
  `.lcard` (home cards), `.impltabs`, `.codeblock`
- The sticky header is **one element** (`.stickyhead`) containing the banner and the nav. Do not split them
  into two sticky elements and keep their offsets in sync by hand — that produced a visible gap that a
  refresh cleared.
- Anything using `overflow` clips child shadows at its padding edge. If a card has a glow, the container needs
  padding larger than the glow radius.

## Verification checklist

Before committing a page:

- [ ] Loads in a headless browser with **no page errors**
- [ ] Every local `href`/`src` resolves (strip `#…` and `?…` before checking the path)
- [ ] Anchor targets exist (`#sec-1`, `#index`, `#below`, `#top`)
- [ ] Numbers agree across `index`, `progress`, `coverage`, `urgency.js`
- [ ] Looks right at 390px and 1200px wide
- [ ] Any edited CSS/JS has a bumped `?v=`

## Deploying

`git` and `gh` act as the repository owner. Push to `main`; GitHub Pages rebuilds automatically.

```bash
git add -A
git commit -m "…"
git push origin HEAD:main
```

There is no staging step and no build output to commit — the working tree is the site.
