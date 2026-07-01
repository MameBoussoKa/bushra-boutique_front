#!/usr/bin/env python3
"""Make near-black (or any specified color) transparent in PNG images.

Usage:
  python make_transparent.py input.png [output.png] [tolerance]
Or process multiple files:
  python make_transparent.py input1.png input2.png

If output path is omitted, a new file with suffix _transparent.png is created.
"""
import sys
from PIL import Image


def make_transparent(in_path, out_path=None, bg_color=(0, 0, 0), tol=40):
    img = Image.open(in_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        dr = r - bg_color[0]
        dg = g - bg_color[1]
        db = b - bg_color[2]
        dist2 = dr*dr + dg*dg + db*db
        if dist2 <= tol*tol:
            # make pixel transparent
            newData.append((r, g, b, 0))
        else:
            newData.append((r, g, b, a))

    img.putdata(newData)
    if out_path is None:
        if in_path.lower().endswith('.png'):
            out_path = in_path[:-4] + '_transparent.png'
        else:
            out_path = in_path + '_transparent.png'
    img.save(out_path, 'PNG')
    print(f"Saved transparent image: {out_path}")


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return

    # Accept multiple input files. If a single output is provided, it's used only for first input.
    inputs = []
    outputs = []
    tol = 40
    args = argv[1:]

    # parse optional trailing tolerance if numeric
    if args and args[-1].isdigit():
        tol = int(args[-1])
        args = args[:-1]

    for i, p in enumerate(args):
        inputs.append(p)

    for in_path in inputs:
        make_transparent(in_path, None, (0,0,0), tol)


if __name__ == '__main__':
    main(sys.argv)
