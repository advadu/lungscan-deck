# LungScan Research — presentation

Slides for LungScan Research, a tool that cuts the manual work of finding and measuring lung tumors on CT scans, built on Base44 for a (simulated) thoracic oncology research lab as part of a Forward Deployed Engineer home assignment.

**Live:** https://advadu.github.io/lungscan-deck/ · user guide: https://advadu.github.io/lungscan-deck/guide.html

Covers the problem, discovery with the lab, the workflow, results (quality against expert outlines, what fails, how time saved is measured), architecture, feedback for Base44, and next steps. Data shown is from the public RIDER Lung CT collection (TCIA). For research use only; no clinical claims.

## Run locally

```bash
npm install
npm run dev     # http://localhost:5173
npm run build   # static site in dist/
```

Navigate with the arrow keys, Page Up/Down, Home/End, or the dots on the right.

## Stack

Vite, React 19, TypeScript, Tailwind CSS v4, Framer Motion, lucide-react. One slide per file in `src/sections/`, registered in `src/App.tsx`. The user guide is a second page: `guide.html` → `src/guide/Guide.tsx`. Every push to `main` deploys to GitHub Pages through `.github/workflows/pages.yml`.
