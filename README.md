# SQL Trainer

An interactive, in-browser SQL learning app — 10 progressive lessons (SELECT through window functions), a real SQLite engine running client-side via [sql.js](https://github.com/sql-js/sql.js) (SQLite compiled to WebAssembly), and auto-checked exercises. No backend, no signup, no data leaves your browser.

**Live demo:** _add your GitHub Pages link here after deploying_

## Why this exists

Built as a hands-on companion while studying SQL for a Data Analyst role — rather than just reading syntax references, this lets you run real queries against a real (small) e-commerce dataset and get immediate pass/fail feedback graded against a reference query, not just "does it look right."

## Features

- 10 lessons: `SELECT`/`LIMIT` → `WHERE` → `ORDER BY` → aggregates → `GROUP BY`/`HAVING` → `JOIN` → `LEFT JOIN` → subqueries → CTEs (`WITH`) → window functions (`RANK() OVER`)
- Real SQLite database in the browser (via WebAssembly) seeded with a small customers/products/orders/order_items schema
- Syntax-highlighted SQL editor (CodeMirror) with `Ctrl/Cmd+Enter` to run
- Auto-graded exercises: your query's result set is diffed against a reference solution (columns + rows), not string-matched
- Hints and worked solutions per lesson
- Progress tracked locally (`localStorage`) with a completion progress bar
- Light/dark theme toggle

## Tech stack

Plain HTML/CSS/JS — no build step, no framework, no server. Everything runs client-side:
- [sql.js](https://github.com/sql-js/sql.js) — SQLite compiled to WASM
- [CodeMirror 5](https://codemirror.net/5/) — SQL editor with syntax highlighting

## Running locally

Because the app loads WebAssembly, opening `index.html` directly via `file://` is blocked by browser security policy in some browsers. Serve it over a local HTTP server instead:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then open `http://localhost:8080`.

## Deploying (GitHub Pages)

This is a fully static site, so GitHub Pages works out of the box:

1. Push this repo to GitHub
2. Repo **Settings → Pages → Source**: deploy from the `main` branch, root folder
3. Your app will be live at `https://<username>.github.io/<repo-name>/`

## Roadmap ideas

- More lesson tracks (date/time functions, `CASE` expressions, set operations)
- A "free practice" mode against the same schema with no fixed answer key
- Swap in a larger/real-world dataset (e.g. a public GA4 sample export)

## License

MIT — see [LICENSE](LICENSE).
