
import sys
import os.path

argv = sys.argv[1:]

input_file, line_count = argv
line_count = int(line_count)

with open(input_file) as f:
    lines = []
    header = f.readline().strip()

    def write_content(i):
        filename, ext = os.path.splitext(input_file)
        output_file = f'{filename}.{i}{ext}'
        with open(output_file, 'w') as f:
            f.write(header + '\n')
            f.write('\n'.join(lines))
        lines.clear()

    for i, line in enumerate(f):
        lines.append(line.strip())
        if i > 0 and i % line_count == 0:
            write_content(i // line_count)
    write_content(i // line_count + 1)
