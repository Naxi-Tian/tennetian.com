# Tenne Tian — Project Portfolio

A responsive, single-page portfolio based on Tenne Tian's current résumé. A cinematic footage sequence introduces the site, followed immediately by the project archive. Project details open in place, and the competition gallery includes ten replaceable photo positions.

## Preview locally

From this folder, run:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Structure

- `index.html` — complete portfolio, project archive, in-page project details, and competition gallery
- `styles.css` — responsive technical-archive design and motion
- `script.js` — navigation, filters, in-page project details, and scroll interactions
- `assets/` — selected photography from the prior website
- `assets/video/` — optimized front-page footage; add future clips to the hero sequence in `index.html`
- `TenneTian-Resume.pdf` — downloadable current résumé

## Production domain

The public URL is configured as `https://tennetian.com/` in the canonical and social-sharing metadata. `robots.txt` and `sitemap.xml` are ready for deployment.

The domain currently uses Spaceship nameservers. After the site is deployed, replace the current parking records with the DNS values supplied by the selected host, configure both `tennetian.com` and `www.tennetian.com`, and make the apex domain canonical.

The production host is GitHub Pages. The `CNAME` file declares the custom apex domain and `.nojekyll` ensures every static asset is served directly.
