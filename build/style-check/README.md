# Checking that a stylesheet change changed nothing on screen

Three small scripts that run in the page. They were written for the theme purge (`build/purge-theme.js`) and are
the way to check any change to the main stylesheet: they compare the computed style of every element, so the
answer does not depend on anyone's eye.

They are not part of the app. To use them, copy them into `public/` for the session (`__fp.js`, `__ab.js`,
`__crawl.js`), and delete them afterwards.

- **`fingerprint.js`** — `f("save")` remembers how every element on the page is styled (in the browser's local
  storage, per page); `f("compare")` after a rebuild lists every element whose style changed, and how.
  A second argument labels a state of the same page: `f("save", "drawer-open")`.
- **`crawl.js`** — walks a list of paths through the app's own router and saves or compares each.
  ⚠️ Not for the public site or the platform admin: their page transition never finishes while the browser tab is
  in the background, so the page does not actually change. Load those pages one by one instead.
- **`ab.js`** — the same open state under two stylesheets, in one sitting: it swaps `/css/app.css` for
  `/__app.before.css` (a copy of the stylesheet built with `PURGE_THEME=off`), records, swaps back and compares.
  This is the one for pop-ups, menus, notices and phone width, which a saved record cannot hold.

What to expect: a page with running animations reports differences in `opacity`, `box-shadow` and the like for
its animated elements. Everything else should be zero.

What it found when the purge was written (2026-11-17), all fixed in `purge-theme.js`:
a class inside `:not(...)` was being treated as required; the blog editor's toolbar classes come from a library
our library depends on; BootstrapVue builds `navbar-toggler-icon` by adding an ending to a base name.
