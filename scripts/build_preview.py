#!/usr/bin/env python3
"""Build dist/operations-preview.html: a single self-contained file with quizbank.js
inlined, for instant browser preview. Usage: python3 scripts/build_preview.py"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
html = open(os.path.join(ROOT, "index.html")).read()
qb = open(os.path.join(ROOT, "quizbank.js")).read()

out = html.replace('<script src="quizbank.js"></script>', "<script>\n" + qb + "\n</script>")
if out == html:
    raise SystemExit('ERROR: could not find <script src="quizbank.js"></script> to inline.')

os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
dest = os.path.join(ROOT, "dist", "operations-preview.html")
open(dest, "w").write(out)
print(f"preview written: {dest} ({len(out)} bytes)")
