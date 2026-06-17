import re
import sys

def filter_for_pdf(md_content):
    lines = md_content.split('\n')
    result = []
    skip_changelog = False
    in_code_block = False

    for i, line in enumerate(lines):
        stripped = line.rstrip()

        # Track code blocks
        if stripped.startswith('```'):
            in_code_block = not in_code_block
            result.append(line)
            continue

        # Skip Changelog section (## Changelog up to ---)
        if stripped == '## Changelog':
            skip_changelog = True
            continue
        if skip_changelog:
            if stripped == '---':
                skip_changelog = False
            continue

        # Skip "Источник данных:" line
        if stripped.startswith('> **Источник данных:**'):
            continue

        # Remove "Источник: Раздел ... исходного документа." lines
        if re.match(r'\*\*Источник:\*\* Раздел .+ исходного документа\.$', stripped):
            continue

        # Also handle "**Источник:** Раздел ..." without trailing period
        if re.match(r'\*\*Источник:\*\* Раздел .+', stripped) and 'исходного документа' in stripped:
            continue

        result.append(line)

    return '\n'.join(result)


if __name__ == '__main__':
    if len(sys.argv) >= 2:
        with open(sys.argv[1], 'r', encoding='utf-8') as f:
            content = f.read()
        filtered = filter_for_pdf(content)
        if len(sys.argv) >= 3:
            with open(sys.argv[2], 'w', encoding='utf-8') as f:
                f.write(filtered)
        else:
            print(filtered)
    else:
        # Read from stdin
        content = sys.stdin.read()
        print(filter_for_pdf(content))
