import re
import sys

def filter_for_pdf(md_content):
    lines = md_content.split('\n')
    result = []
    in_code_block = False

    # Sections to skip entirely (heading text → skip until next heading or ---)
    skip_sections = [
        '#### 1.6.6 Франшиза (Franchise Model)',
        '### 2.8 Mobile Application Architecture',
        '### 9.5 Текущее состояние системы (AS IS)',
    ]

    # Patterns for inline content to skip
    skip_inline_patterns = [
        r'^\*\*Локальный запуск:\*\*$',
        r'^\*\*Первый PR:\*\*$',
    ]

    skip_until_heading = False

    for i, line in enumerate(lines):
        stripped = line.rstrip()

        # Track code blocks
        if stripped.startswith('```'):
            in_code_block = not in_code_block
            if not skip_until_heading:
                result.append(line)
            continue

        # Check if this line starts a section to skip
        if stripped in skip_sections:
            skip_until_heading = True
            continue

        # Check if this is an inline block to skip
        is_skip_inline = any(re.match(p, stripped) for p in skip_inline_patterns)

        # If skipping and we hit a new heading or ---, stop skipping
        if skip_until_heading:
            if stripped.startswith('###') or stripped.startswith('##') or stripped.startswith('#') or stripped == '---':
                skip_until_heading = False
                # Don't skip the heading itself (unless it's the section we're skipping)
                if stripped not in skip_sections:
                    result.append(line)
                continue
            # Skip all lines while in a skipped section
            # But still process code blocks
            continue

        # Skip inline blocks (local run, first PR, etc.)
        if is_skip_inline:
            # Skip this line and the next block (code block or list)
            continue

        # Skip Changelog section
        if stripped == '## Changelog':
            skip_until_heading = True
            continue

        # Skip "Источник данных:" line
        if stripped.startswith('> **Источник данных:**'):
            continue

        # Remove "Источник: Раздел ... исходного документа." lines
        if re.match(r'\*\*Источник:\*\* Раздел .+ исходного документа\.$', stripped):
            continue

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
        content = sys.stdin.read()
        print(filter_for_pdf(content))
