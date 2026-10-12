"""Compatibility entry point: validate selected artwork; never overwrite it."""
from check_pwa_icons import check

if __name__ == '__main__':
    print('Pixel-letter icon generation is retired. Checking committed KHALSA artwork.')
    check()
