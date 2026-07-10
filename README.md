# Mahdi Panahi — Portfolio

Personal portfolio website, live at **[mahdi-panahi.vercel.app](https://mahdi-panahi.vercel.app)**.

It showcases my research (co-authored IEEE ETFA 2026 paper on V2X message authentication), my degree thesis at Autoliv, and six university projects with screenshots — plus my CV in English and Swedish, downloadable as PDF or Word.

## Tech

Vanilla HTML, CSS and JavaScript — no frameworks, no build step. Dark mode, typing effect, scroll animations, screenshot carousels and a lightbox are all plain JS in [js/main.js](js/main.js).

## Run locally

```bash
git clone https://github.com/Mahpan2222/portfolio.git
cd portfolio
python -m http.server 8000   # or just open index.html in a browser
```

Deployed automatically to Vercel on every push to `main`.
