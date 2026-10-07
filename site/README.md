# girdharshubham.com

My portfolio, published from the `site/` folder of the `girdharshubham/girdharshubham` repo.
Everything you'd want to change is a Markdown file in `site/content/`. Run the commands below from `site/`.

## Editing

| To change | Edit |
|---|---|
| Headline, intro, stats, links, section headings, photo, "open to new roles" badge | `content/_index.md` |
| A job | `content/experience/<company>.md` (copy one to add a new job) |
| Focus cards | `content/focus/*.md` |
| Open-source list | `content/open-source/*.md` |
| Skills | `content/skills.md` |
| Colors (light "Paper" + dark toggle) | tokens at the top of `assets/css/main.css` |

Commit and push to `main`. GitHub Actions rebuilds and deploys the site in about a minute.
Small edits work straight from the GitHub web editor, too.

## Writing a post

```sh
mise exec -- hugo new blog/gpu-scheduling-with-dra.md
```

Write in Markdown, then change `draft: true` to `draft: false` and push.
Short thoughts work the same way: a title and a paragraph is a complete post; `description` and `tags` are optional.
The Writing section (nav link and "Recent posts" on the home page) appears once the first post is published.
Each post also gets published as raw Markdown (`/blog/<slug>/index.md`) and listed in `/llms.txt`.

## Easter eggs

Press `` ` `` on any page for a terminal (`help` lists commands; its answers come from `content/`).
Also: the profile.yaml / profile.schema.yaml card, a live uptime in the footer, a DevTools console note,
and a CrashLoopBackOff 404 page. New terminal commands go in the `commands` object in `assets/js/main.js`.

## Previewing locally

```sh
mise install                       # one time: installs the pinned Hugo version
mise exec -- hugo server -D        # http://localhost:1313, live reload, -D shows drafts
```

## For LLMs

The site publishes machine-readable copies of itself, generated from the same Markdown:

- `/llms.txt`: short index ([llmstxt.org](https://llmstxt.org) format)
- `/llms-full.txt`: the whole profile and every post as a single Markdown file
- `/blog/<slug>/index.md`: each post as raw Markdown
- schema.org `Person` / `BlogPosting` JSON-LD in each page's `<head>`

`AGENTS.md` (also loaded through `CLAUDE.md`) tells coding assistants how the repo is laid out.

## Contact form to Proton Mail

GitHub Pages can't send email, so the form posts to [Web3Forms](https://web3forms.com)
(free, 250 messages a month), which forwards to your inbox. Your address never appears on the site.

1. At https://web3forms.com, enter your Proton address and create an access key.
2. Paste the key into `contact.web3formsKey` in `content/_index.md`.
3. After deploying, send yourself a test message. Check Proton's spam folder the first time.

The key is safe to publish; it only lets people send mail *to* you.

## Deploys

Every push to `main` runs `.github/workflows/deploy.yml` (at the repo root), which builds `site/` with Hugo
and publishes it to GitHub Pages. Repo **Settings > Pages > Source** is set to **GitHub Actions**.

## Custom domain: girdharshubham.com

The domain is registered at Hostinger (nameservers `*.dns-parking.com`).

1. **Verify the domain with GitHub** (stops anyone else from claiming it on Pages):
   github.com **Settings > Pages > Add a domain**, enter `girdharshubham.com`, and add the TXT record
   GitHub shows you in Hostinger. Click **Verify** once it's in.
2. **Point DNS at GitHub Pages.** In Hostinger: **Domains > girdharshubham.com > DNS / Nameservers**.
   Delete the existing parking `A` record for `@` (`2.57.91.91`) and any existing `www` record, then add:

   | Type  | Name | Points to                  |
   |-------|------|----------------------------|
   | A     | @    | 185.199.108.153            |
   | A     | @    | 185.199.109.153            |
   | A     | @    | 185.199.110.153            |
   | A     | @    | 185.199.111.153            |
   | AAAA  | @    | 2606:50c0:8000::153        |
   | AAAA  | @    | 2606:50c0:8001::153        |
   | AAAA  | @    | 2606:50c0:8002::153        |
   | AAAA  | @    | 2606:50c0:8003::153        |
   | CNAME | www  | girdharshubham.github.io   |

3. **Tell the repo about the domain:** **Settings > Pages > Custom domain** is `girdharshubham.com`.
   (With GitHub Actions deploys no `CNAME` file is needed.)
4. Once the DNS check passes (minutes to a few hours), tick **Enforce HTTPS**.

Check propagation with `dig +short girdharshubham.com` (should list the four `185.199.x.153` addresses).
`www.girdharshubham.com` redirects to `girdharshubham.com` automatically.
