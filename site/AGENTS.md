# Portfolio site: guide for AI assistants

Hugo static site for https://girdharshubham.com. It lives in `site/` of the `girdharshubham/girdharshubham` repo;
`.github/workflows/deploy.yml` at the repo root builds `site/` and deploys to GitHub Pages on every push to `main`.
All paths below are relative to `site/`. Hugo version is pinned in `mise.toml`. Preview from `site/` with
`mise exec -- hugo server`.

**All content is Markdown under `content/`. Edit content there; only touch `layouts/` or `assets/`
for design or structural changes.**

| What | File | Notes |
|---|---|---|
| Name, headline, intro, photo + share image, links, stats, section headings, YAML card, contact blurb, form key, open-to-work flag | `content/_index.md` | intro is the body; the rest is front matter |
| Jobs | `content/experience/<company>.md` | front matter `title` (role), `company`, `location`, `start: YYYY-MM`, `end: YYYY-MM` (omit while current). Body = bullets, `###` for project subheadings. Sorted automatically: current first, then by end date. |
| Focus cards | `content/focus/*.md` | `weight` orders them; `icon`: chip, network, pulse (add more in `layouts/_partials/icon.html`) |
| Open source | `content/open-source/*.md` | `title` (repo), `link`, `weight` |
| Skills | `content/skills.md` | `##` = group, each bullet = one tag |
| Blog posts | `content/blog/<slug>.md` | `hugo new blog/<slug>.md` uses `archetypes/blog.md`; set `draft: false` to publish |

Generated for machines (don't edit, they come from the content above):
`/llms.txt`, `/llms-full.txt`, `/blog/<slug>/index.md`, schema.org JSON-LD, `sitemap.xml`, RSS.
Templates: `layouts/home.llms.txt`, `layouts/home.llmsfull.txt`, `layouts/page.md.md`, `layouts/_partials/jsonld.html`.

Design: "Paper" (white, near-black text, blue accent) is the default; the header toggle switches to a
GitHub Dark palette and remembers the choice. Solarized Light and Solarized Dark were tried and rejected.
Colors are CSS custom properties at the top of `assets/css/main.css`; code colors in `assets/css/syntax.css`
are generated with `hugo gen chromastyles --style=github / github-dark`.

Easter eggs (keep them subtle): hero card toggles profile.yaml / profile.schema.yaml
(`layouts/_partials/manifest.html`); hidden terminal opened with ` or the footer hint
(`layouts/_partials/terminal.html` + commands in `assets/js/main.js`, data comes from content); live
uptime since the first job in the footer; DevTools console greeting; CrashLoopBackOff 404 (`layouts/404.html`);
blinking cursor, stat count-up. All motion respects prefers-reduced-motion.

Rules:
- Plain ASCII punctuation only in copy: no em/en dashes, curly quotes, ellipsis or arrow characters, no
  middle-dot separators (use commas, colons, periods or " / "). Hugo's typographer is disabled for this.
- Never put the phone number, personal email, or the Proton address on the site. The contact form
  (Web3Forms, delivering to hello@girdharshubham.com) is the only contact channel.
- Don't name employers' customers or disclose deal/revenue figures. Describe them generically.
- Keep it build-free for the editor: no Node, no npm, no Hugo modules.
- After changes run `mise exec -- hugo --gc` and make sure there are no WARN/ERROR lines.
