
import sys
from random import shuffle

def main():
    lines = []
    header = input()
    for line in sys.stdin:
        line = line.strip()
        lines.append(line)
    shuffle(lines)
    print(header)
    print('\n'.join(lines))

if __name__ == '__main__':
    main()
