import re
import sys

def filter_for_pdf(md_content):
    lines = md_content.split('\n')
    result = []
    skip_until_heading = False

    skip_sections = [
        '#### 1.6.6 Франшиза (Franchise Model)',
        '### 2.8 Mobile Application Architecture',
        '### 9.5 Текущее состояние системы (AS IS)',
    ]

    skip_inline_patterns = [
        r'^\*\*Локальный запуск:\*\*$',
        r'^\*\*Первый PR:\*\*$',
    ]

    def is_heading(text):
        return text.startswith('###') or text.startswith('##') or text.startswith('#')

    for line in lines:
        stripped = line.rstrip()

        # Track code blocks
        if stripped.startswith('```'):
            if not skip_until_heading:
                result.append(line)
            continue

        # Sections to skip entirely (heading text → skip until next heading)
        if stripped in skip_sections:
            skip_until_heading = True
            continue

        # Inline blocks to skip — skip until next heading
        if any(re.match(p, stripped) for p in skip_inline_patterns):
            skip_until_heading = True
            continue

        # When skipping, only a heading line stops skipping
        if skip_until_heading:
            if is_heading(stripped):
                skip_until_heading = False
                if stripped not in skip_sections:
                    result.append(line)
            continue

        # Changelog
        if stripped == '## Changelog':
            skip_until_heading = True
            continue

        # Источник данных: line
        if stripped.startswith('> **Источник данных:**'):
            continue

        # Источник: Раздел ... исходного документа.
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
