"""Generate dependency-free PNG icons for KDN Social Studio."""
import struct
import zlib
from pathlib import Path

GLYPHS = {
    "K": ["10001","10010","10100","11000","10100","10010","10001"],
    "D": ["11110","10001","10001","10001","10001","10001","11110"],
    "N": ["10001","11001","10101","10011","10001","10001","10001"],
}

def png(size):
    bg = (36, 24, 15, 255)
    gold = (234, 194, 109, 255)
    pixels = bytearray(bg * (size * size))
    def rect(x0, y0, x1, y1, color):
        for y in range(max(0,y0), min(size,y1)):
            for x in range(max(0,x0), min(size,x1)):
                p = (y * size + x) * 4
                pixels[p:p+4] = bytes(color)
    border = max(3, size // 42)
    inset = size // 7
    rect(inset, inset, size-inset, inset+border, gold)
    rect(inset, size-inset-border, size-inset, size-inset, gold)
    rect(inset, inset, inset+border, size-inset, gold)
    rect(size-inset-border, inset, size-inset, size-inset, gold)
    scale = max(3, size // 33)
    text_width = 17 * scale
    left = (size - text_width) // 2
    top = (size - 7 * scale) // 2
    for i, letter in enumerate("KDN"):
        for row, pattern in enumerate(GLYPHS[letter]):
            for col, on in enumerate(pattern):
                if on == "1":
                    x = left + i * 6 * scale + col * scale
                    y = top + row * scale
                    rect(x, y, x + scale, y + scale, gold)
    def chunk(kind, data):
        return struct.pack(">I",len(data))+kind+data+struct.pack(">I",zlib.crc32(kind+data)&0xffffffff)
    rows = b"".join(b"\x00"+pixels[y*size*4:(y+1)*size*4] for y in range(size))
    header = struct.pack(">IIBBBBB",size,size,8,6,0,0,0)
    return b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",header)+chunk(b"IDAT",zlib.compress(rows,9))+chunk(b"IEND",b"")

for n in (192, 512):
    Path(f"icon-{n}.png").write_bytes(png(n))
    print(f"Created icon-{n}.png")
