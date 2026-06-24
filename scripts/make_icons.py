#!/usr/bin/env python3
"""Regenerate the coyote-tan sergeant-chevron app icons at the repo root.
Needs Pillow:  pip install pillow
Usage: python3 scripts/make_icons.py"""
import os
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def make(size, outpath):
    img = Image.new("RGB", (size, size))
    px = img.load()
    # diagonal gradient background #252a1c -> #1a1d12
    c0 = (0x25, 0x2a, 0x1c)
    c1 = (0x1a, 0x1d, 0x12)
    for y in range(size):
        for x in range(size):
            t = (x + y) / (2 * (size - 1))
            px[x, y] = (
                int(c0[0] + (c1[0] - c0[0]) * t),
                int(c0[1] + (c1[1] - c0[1]) * t),
                int(c0[2] + (c1[2] - c0[2]) * t),
            )
    d = ImageDraw.Draw(img)
    tan = (0xb8, 0xa0, 0x6a)  # coyote tan
    th = size * 0.085   # stroke thickness
    w = 0.30            # half-width fraction
    gap = 0.16          # vertical gap between chevrons
    top = 0.30          # top chevron apex y-fraction
    cxf = 0.5
    for i in range(3):
        ay = (top + i * gap) * size
        apex = cxf * size
        lx = (cxf - w) * size
        rx = (cxf + w) * size
        drop = w * size
        d.line([(lx, ay + drop), (apex, ay)], fill=tan, width=int(th))
        d.line([(apex, ay), (rx, ay + drop)], fill=tan, width=int(th))
    img.save(outpath)


if __name__ == "__main__":
    make(192, os.path.join(ROOT, "icon-192.png"))
    make(512, os.path.join(ROOT, "icon-512.png"))
    print("icons written: icon-192.png, icon-512.png")
