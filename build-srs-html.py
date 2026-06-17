#!/usr/bin/env python3
"""
Build a single-file self-contained SRS HTML page with:
- Sticky table of contents (collapsible on mobile)
- Search-as-you-type
- Dark/light theme toggle
- Responsive layout
"""

import re, sys, html as html_mod

def build_html(input_md):
    import subprocess, os
    
    # 1. Run pandoc to get base HTML
    result = subprocess.run(
        ['pandoc', '-f', 'markdown-implicit_figures', '-o', '-', '-s',
         '--metadata', 'title=SRS — Агрегатор доставки продуктов'],
        input=input_md, capture_output=True, text=True, timeout=30
    )
    base_html = result.stdout
    
    # 2. Extract body content (between <body> and </body>)
    body_match = re.search(r'<body>(.*)</body>', base_html, re.DOTALL)
    if not body_match:
        return base_html
    body_content = body_match.group(1)
    
    # 3. Build heading tree for TOC
    headings = re.findall(
        r'<(h[234])(\s[^>]*)?>(.*?)</\1>',
        body_content, re.DOTALL
    )
    
    toc_entries = []
    for tag, attrs, text in headings:
        level = int(tag[1])  # 2, 3, or 4
        # Clean text from inner HTML
        clean = re.sub(r'<[^>]+>', '', text).strip()
        # Get id if present
        id_match = re.search(r'id="([^"]+)"', attrs or '')
        entry_id = id_match.group(1) if id_match else ''
        toc_entries.append((level, clean, entry_id))
    
    # 4. Build TOC HTML
    toc_html = ''
    prev_level = 1
    for level, text, eid in toc_entries:
        indent = level - 2
        prefix = '  ' * indent
        if indent > prev_level - 2:
            toc_html += '\n' + prefix + '<ul>\n'
        elif indent < prev_level - 2:
            toc_html += '\n' + prefix + '</ul>\n' * (prev_level - 2 - indent)
        
        target = f'#{html_mod.escape(eid)}' if eid else ''
        toc_html += f'{prefix}  <li><a href="{target}">{html_mod.escape(text)}</a></li>\n'
        prev_level = level
    
    # Close remaining ul
    for _ in range(prev_level - 2):
        toc_html += '  </ul>\n'
    
    # 5. Build full HTML with framework
    full_html = f'''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SRS — Агрегатор доставки продуктов</title>
<style>
  :root {{
    --bg: #fff;
    --bg2: #f5f7fa;
    --text: #1a1a2e;
    --text2: #555;
    --border: #e0e0e0;
    --accent: #3f51b5;
    --accent2: #303f9f;
    --code-bg: #f0f0f0;
    --shadow: rgba(0,0,0,0.08);
  }}
  @media (prefers-color-scheme:dark) {{
    :root {{
      --bg: #1a1a2e;
      --bg2: #16213e;
      --text: #e0e0e0;
      --text2: #aaa;
      --border: #333;
      --accent: #5c6bc0;
      --accent2: #7986cb;
      --code-bg: #2a2a3e;
      --shadow: rgba(0,0,0,0.3);
    }}
  }}
  *, *::before, *::after {{ box-sizing: border-box; margin: 0; padding: 0; }}
  html {{ scroll-behavior: smooth; }}
  body {{
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    font-size: 15px; line-height: 1.6; color: var(--text); background: var(--bg);
    display: flex;
  }}
  /* Layout */
  #sidebar {{
    position: fixed; top: 0; left: 0; bottom: 0; width: 280px;
    background: var(--bg2); border-right: 1px solid var(--border);
    display: flex; flex-direction: column; z-index: 100;
    transition: transform .3s;
  }}
  #sidebar-header {{
    padding: 16px 20px; border-bottom: 1px solid var(--border);
    font-size: 14px; font-weight: 700; color: var(--accent);
  }}
  #toc-container {{ flex: 1; overflow-y: auto; padding: 10px 0; }}
  #toc-container ul {{ list-style: none; padding-left: 16px; }}
  #toc-container > ul {{ padding-left: 0; }}
  #toc-container li {{ margin: 2px 0; }}
  #toc-container a {{
    display: block; padding: 4px 20px 4px 8px; font-size: 13px;
    color: var(--text2); text-decoration: none; border-radius: 4px;
    transition: color .15s, background .15s;
  }}
  #toc-container a:hover {{ color: var(--accent); background: rgba(63,81,181,0.06); }}
  /* Search */
  #search-wrap {{ padding: 8px 12px; border-bottom: 1px solid var(--border); position: relative; }}
  #search {{
    width: 100%; padding: 8px 12px; font-size: 13px;
    border: 1px solid var(--border); border-radius: 6px;
    background: var(--bg); color: var(--text); outline: none;
  }}
  #search:focus {{ border-color: var(--accent); }}
  #search-results {{
    display: none; position: absolute; top: 100%; left: 0; right: 0;
    max-height: 50vh; overflow-y: auto;
    background: var(--bg); border: 1px solid var(--border); z-index: 200;
    box-shadow: 0 4px 12px var(--shadow);
  }}
  #search-results.show {{ display: block; }}
  #search-results a {{
    display: block; padding: 10px 16px; font-size: 13px; text-decoration: none;
    color: var(--text); border-bottom: 1px solid var(--border);
  }}
  #search-results a:hover {{ background: var(--bg2); }}
  #search-results .sr-title {{ font-weight: 600; }}
  #search-results .sr-context {{ font-size: 12px; color: var(--text2); margin-top: 2px; }}
  /* Content */
  #content {{
    margin-left: 280px; flex: 1; max-width: 900px; padding: 40px 48px 80px;
  }}
  #content h1 {{ font-size: 26px; margin-top: 0; margin-bottom: 12px; color: var(--accent); }}
  #content h2 {{
    font-size: 20px; margin-top: 32px; margin-bottom: 10px;
    padding-bottom: 6px; border-bottom: 1px solid var(--border);
  }}
  #content h3 {{ font-size: 17px; margin-top: 24px; margin-bottom: 8px; }}
  #content h4 {{ font-size: 15px; margin-top: 18px; margin-bottom: 6px; }}
  #content p {{ margin-bottom: 12px; }}
  #content ul, #content ol {{ margin: 8px 0 12px 20px; }}
  #content li {{ margin-bottom: 4px; }}
  #content blockquote {{
    border-left: 4px solid var(--accent); padding: 8px 16px; margin: 12px 0;
    background: var(--bg2); color: var(--text2); border-radius: 0 6px 6px 0;
  }}
  #content pre {{
    background: var(--code-bg); padding: 12px 16px; border-radius: 6px;
    overflow-x: auto; font-size: 13px; margin: 12px 0;
    font-family: 'SF Mono', 'Menlo', 'Consolas', monospace;
  }}
  #content code {{
    font-family: 'SF Mono', 'Menlo', 'Consolas', monospace;
    font-size: 13px; background: var(--code-bg); padding: 2px 5px; border-radius: 3px;
  }}
  #content pre code {{ background: none; padding: 0; }}
  #content table {{
    width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;
  }}
  #content th, #content td {{
    border: 1px solid var(--border); padding: 8px 10px; text-align: left;
  }}
  #content th {{ background: var(--bg2); font-weight: 600; }}
  #content img {{ max-width: 100%; height: auto; margin: 12px 0; border-radius: 4px; }}
  #content hr {{ border: none; border-top: 1px solid var(--border); margin: 24px 0; }}
  /* Mobile toggle */
  #menu-toggle {{
    display: none; position: fixed; top: 12px; left: 12px; z-index: 200;
    width: 40px; height: 40px; border: none; border-radius: 8px;
    background: var(--accent); color: #fff; font-size: 20px; cursor: pointer;
  }}
  @media (max-width: 768px) {{
    #sidebar {{ transform: translateX(-100%); }}
    #sidebar.open {{ transform: translateX(0); }}
    #content {{ margin-left: 0; padding: 60px 16px 40px; }}
    #menu-toggle {{ display: block; }}
  }}
</style>
</head>
<body>
<button id="menu-toggle" onclick="toggleSidebar()">☰</button>
<div id="sidebar">
  <div id="sidebar-header">SRS — Агрегатор доставки</div>
  <div id="search-wrap">
    <input type="text" id="search" placeholder="Поиск…">
    <div id="search-results"></div>
  </div>
  <div id="toc-container">
    {toc_html}
  </div>
</div>
<div id="content">
{body_content}
</div>
<script>
function toggleSidebar() {{
  document.getElementById('sidebar').classList.toggle('open');
}}
// Build search index
const searchIndex = [];
document.querySelectorAll('#content h2, #content h3, #content h4').forEach(h => {{
  const id = h.id || '';
  const text = h.textContent.trim();
  // Get context (next paragraph or list)
  let el = h.nextElementSibling;
  let context = '';
  while (el && !/^h[234]$/i.test(el.tagName)) {{
    context += ' ' + (el.textContent || '').trim();
    el = el.nextElementSibling;
    if (context.length > 200) break;
  }}
  searchIndex.push({{ id, text, context: context.trim().slice(0, 300) }});
}});
function searchDocs(query) {{
  const results = document.getElementById('search-results');
  if (!query || query.length < 2) {{
    results.classList.remove('show');
    return;
  }}
  query = query.toLowerCase();
  const matches = searchIndex
    .filter(e => e.text.toLowerCase().includes(query) || e.context.toLowerCase().includes(query))
    .slice(0, 20);
  if (matches.length === 0) {{
    results.classList.remove('show');
    return;
  }}
  results.innerHTML = matches.map(m => 
    '<a href="#' + m.id + '" onclick="toggleSidebar()"><div class="sr-title">' +
    escapeHtml(m.text) + '</div><div class="sr-context">' +
    escapeHtml(m.context.slice(0, 120)) + '</div></a>'
  ).join('');
  results.classList.add('show');
}}
function escapeHtml(s) {{
  return (s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}}
// Close search on click outside
document.addEventListener('click', function(e) {{
  if (!e.target.closest('#search-wrap')) {{
    document.getElementById('search-results').classList.remove('show');
  }}
}});
// Search on input
document.getElementById('search').addEventListener('input', function() {{
  searchDocs(this.value);
}});
</script>
</body>
</html>'''

    # 6. Fix image paths for standalone HTML
    full_html = full_html.replace('"exports/diagrams/', '"assets/')

    return full_html

if __name__ == '__main__':
    import sys, os
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    # Read filtered markdown
    result = __import__('subprocess').run(
        ['python3', 'filter-pdf.py', 'SRS/SRS.md'],
        capture_output=True, text=True, timeout=15
    )
    filtered_md = '\n'.join(
        line for line in result.stdout.split('\n')
        if not line.strip().startswith('---') or not line.strip() == '---'
    )
    
    html = build_html(filtered_md)
    
    output = 'exports/SRS.html'
    with open(output, 'w', encoding='utf-8') as f:
        f.write(html)
    
    size = os.path.getsize(output)
    print(f"HTML: {output} ({size} bytes)")
