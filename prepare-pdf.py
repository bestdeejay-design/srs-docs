import re
import sys

def convert_pipe_table(lines, start):
    header = re.split(r'\s*\|\s*', lines[start].strip().strip('|'))
    sep = lines[start + 1].strip()
    rows = []
    i = start + 2
    while i < len(lines) and lines[i].strip().startswith('|'):
        cell = re.split(r'\s*\|\s*', lines[i].strip().strip('|'))
        rows.append(cell)
        i += 1

    # Build HTML table
    html = ['<table>']
    # header
    html.append('<thead><tr>')
    for h in header:
        html.append(f'<th>{h}</th>')
    html.append('</tr></thead>')
    # body
    html.append('<tbody>')
    for row in rows:
        html.append('<tr>')
        for c in row:
            html.append(f'<td>{c}</td>')
        html.append('</tr>')
    html.append('</tbody>')
    html.append('</table>')
    return html, i

def is_pipe_table_line(line):
    s = line.strip()
    return s.startswith('|') and s.endswith('|')

def is_separator_line(line):
    s = line.strip()
    return s.startswith('|---') or s.startswith('|:--') or s.startswith('|--:') or s == '|---|'

def process_file(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()

    lines = content.split('\n')
    out_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        # Check if this is the start of a pipe table
        if (is_pipe_table_line(line) and i + 1 < len(lines) and is_separator_line(lines[i + 1])):
            html, end = convert_pipe_table(lines, i)
            out_lines.extend(html)
            i = end
        else:
            out_lines.append(line)
            i += 1

    result = '\n'.join(out_lines)
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(result)

    return result

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print('Usage: python3 prepare-pdf.py input.md output.md')
        sys.exit(1)
    process_file(sys.argv[1], sys.argv[2])
