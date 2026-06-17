#!/usr/bin/env python3
import re, subprocess, os, html as html_mod

def build_html(input_md):
    result = subprocess.run(
        ['pandoc', '-f', 'markdown-implicit_figures', '-o', '-', '-s',
         '--metadata', 'title=SRS — Агрегатор доставки продуктов'],
        input=input_md, capture_output=True, text=True, timeout=30
    )
    body = re.search(r'<body>(.*)</body>', result.stdout, re.DOTALL)
    if not body:
        print("pandoc output:", result.stdout[:500])
        raise RuntimeError("No <body> in pandoc output")
    body = body.group(1)

    headings = re.findall(r'<(h[234])(\s[^>]*)?>(.*?)</\1>', body, re.DOTALL)
    toc, prev = '', 1
    for tag, attrs, text in headings:
        level = int(tag[1])
        clean = re.sub(r'<[^>]+>', '', text).strip()
        eid = (re.search(r'id="([^"]+)"', attrs or '') or ['', ''])[1]
        indent = level - 2
        if indent > prev - 2:
            toc += '\n' + '  ' * indent + '<ul>\n'
        elif indent < prev - 2:
            toc += '\n' + '  ' * (indent + 1) + '</ul>\n' * (prev - 2 - indent)
        toc += f'{"  " * (indent + 1)}<li><a href="#{html_mod.escape(eid)}">{html_mod.escape(clean)}</a></li>\n'
        prev = level
    for _ in range(prev - 2):
        toc += '</ul>\n'

    return '''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SRS — Агрегатор доставки продуктов</title>
<style>
:root {
  --apple-bg: #fff; --apple-bg2: #f5f5f7; --apple-text: #1d1d1f; --apple-text2: #86868b;
  --apple-border: #d2d2d7; --apple-accent: #0071e3; --apple-code: #f5f5f7;
  --google-bg: #fff; --google-bg2: #f8f9fa; --google-text: #202124; --google-text2: #5f6368;
  --google-border: #dadce0; --google-accent: #1a73e8; --google-code: #f1f3f4;
  --dark-bg: #1a1a2e; --dark-bg2: #16213e; --dark-text: #e0e0e0; --dark-text2: #a0a0b0;
  --dark-border: #2a2a3e; --dark-accent: #5c6bc0; --dark-accent2: #7986cb; --dark-code: #2a2a3e;
}
body.theme-apple, .theme-apple { --bg: var(--apple-bg); --bg2: var(--apple-bg2); --text: var(--apple-text); --text2: var(--apple-text2); --border: var(--apple-border); --accent: var(--apple-accent); --code-bg: var(--apple-code); }
body.theme-google, .theme-google { --bg: var(--google-bg); --bg2: var(--google-bg2); --text: var(--google-text); --text2: var(--google-text2); --border: var(--google-border); --accent: var(--google-accent); --code-bg: var(--google-code); }
body.theme-dark, .theme-dark { --bg: var(--dark-bg); --bg2: var(--dark-bg2); --text: var(--dark-text); --text2: var(--dark-text2); --border: var(--dark-border); --accent: var(--dark-accent); --accent2: var(--dark-accent2); --code-bg: var(--dark-code); }
*,*::before,*::after { box-sizing:border-box; margin:0; padding:0; }
html { scroll-behavior:smooth; }
body { font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Segoe UI',Roboto,sans-serif; font-size:15px; line-height:1.6; color:var(--text); background:var(--bg); display:flex; }
#sidebar { position:fixed; top:0; left:0; bottom:0; width:280px; background:var(--bg2); border-right:1px solid var(--border); display:flex; flex-direction:column; z-index:100; transition:transform .3s; }
#sidebar-header { padding:14px 16px; border-bottom:1px solid var(--border); display:flex; align-items:center; justify-content:space-between; }
#sidebar-header span { font-size:12px; font-weight:600; color:var(--accent); }
.theme-btn { width:24px; height:24px; border-radius:50%; border:2px solid var(--border); cursor:pointer; padding:0; transition:transform .2s; margin-left:4px; }
.theme-btn:hover { transform:scale(1.2); }
.theme-btn.apple { background:#0071e3; }
.theme-btn.google { background:#1a73e8; }
.theme-btn.dark { background:#5c6bc0; }
.theme-btn.active { border-color:var(--accent); box-shadow:0 0 0 2px var(--accent); }
#toc-container { flex:1; overflow-y:auto; padding:6px 0; }
#toc-container ul { list-style:none; padding-left:14px; }
#toc-container>ul { padding-left:0; }
#toc-container a { display:block; padding:3px 16px 3px 10px; font-size:12.5px; color:var(--text2); text-decoration:none; border-radius:3px; line-height:1.4; }
#toc-container a:hover { color:var(--accent); background:rgba(0,0,0,0.03); }
#search-wrap { padding:8px 12px; border-bottom:1px solid var(--border); position:relative; }
#search { width:100%; padding:7px 32px 7px 10px; font-size:13px; border:1px solid var(--border); border-radius:8px; background:var(--bg); color:var(--text); outline:none; transition:border-color .2s; }
#search:focus { border-color:var(--accent); }
#search-clear { position:absolute; right:14px; top:50%; transform:translateY(-50%); width:18px; height:18px; border:none; border-radius:50%; background:var(--text2); color:var(--bg); font-size:11px; line-height:18px; text-align:center; cursor:pointer; display:none; padding:0; opacity:.5; }
#search-clear:hover { opacity:1; }
#search-results { display:none; position:absolute; top:100%; left:0; right:0; max-height:50vh; overflow-y:auto; background:var(--bg); border:1px solid var(--border); border-radius:0 0 8px 8px; z-index:200; box-shadow:0 8px 24px rgba(0,0,0,.12); }
#search-results.show { display:block; }
#search-results a { display:block; padding:8px 14px; font-size:13px; text-decoration:none; color:var(--text); border-bottom:1px solid var(--border); }
#search-results a:last-child { border:none; }
#search-results a:hover { background:var(--bg2); }
#search-results .sr-title { font-weight:500; }
#search-results .sr-context { font-size:11.5px; color:var(--text2); margin-top:2px; }
#content { margin-left:280px; flex:1; max-width:900px; padding:40px 48px 80px; }
#content h1 { font-size:28px; font-weight:700; margin:0 0 8px; letter-spacing:-.02em; color:var(--accent); }
#content h2 { font-size:21px; font-weight:600; margin:36px 0 10px; padding-bottom:8px; border-bottom:1px solid var(--border); letter-spacing:-.01em; }
#content h3 { font-size:17px; font-weight:600; margin:24px 0 8px; }
#content h4 { font-size:15px; font-weight:600; margin:18px 0 6px; }
#content p { margin-bottom:12px; }
#content ul,#content ol { margin:8px 0 12px 20px; }
#content li { margin-bottom:4px; }
#content blockquote { border-left:4px solid var(--accent); padding:10px 18px; margin:14px 0; background:var(--bg2); color:var(--text2); border-radius:0 8px 8px 0; font-size:14px; }
#content pre { background:var(--code-bg); padding:14px 18px; border-radius:8px; overflow-x:auto; font-size:13px; margin:14px 0; font-family:'SF Mono','Menlo','Consolas',monospace; }
#content code { font-family:'SF Mono','Menlo','Consolas',monospace; font-size:13px; background:var(--code-bg); padding:2px 6px; border-radius:4px; }
#content pre code { background:none; padding:0; }
#content table { width:100%; border-collapse:collapse; margin:14px 0; font-size:12.5px; }
#content th,#content td { border:1px solid var(--border); padding:7px 10px; text-align:left; }
#content th { background:var(--bg2); font-weight:600; }
#content img { max-width:100%; height:auto; margin:12px 0; border-radius:8px; }
#content hr { border:none; border-top:1px solid var(--border); margin:24px 0; }
#menu-toggle { display:none; position:fixed; top:10px; left:10px; z-index:200; width:36px; height:36px; border:none; border-radius:10px; background:var(--accent); color:#fff; font-size:18px; cursor:pointer; opacity:.9; }
@media (max-width:768px) { #sidebar { transform:translateX(-100%); } #sidebar.open { transform:translateX(0); } #content { margin-left:0; padding:56px 16px 40px; } #menu-toggle { display:block; } }
</style>
</head>
<body class="theme-apple">
<button id="menu-toggle" onclick="toggleSidebar()">☰</button>
<div id="sidebar">
  <div id="sidebar-header">
    <span>SRS — Агрегатор доставки</span>
    <span>
      <button class="theme-btn apple active" onclick="setTheme('apple')" title="Apple"></button>
      <button class="theme-btn google" onclick="setTheme('google')" title="Google"></button>
      <button class="theme-btn dark" onclick="setTheme('dark')" title="Тёмная"></button>
    </span>
  </div>
  <div id="search-wrap">
    <input type="text" id="search" placeholder="Поиск…">
    <button id="search-clear" onclick="clearSearch()">×</button>
    <div id="search-results"></div>
  </div>
  <div id="toc-container">''' + toc + '''</div>
</div>
<div id="content">''' + body + '''</div>
<script>
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open')}
const searchIndex=[];
document.querySelectorAll('#content h2,#content h3,#content h4').forEach(h=>{const id=h.id||'',text=h.textContent.trim();let el=h.nextElementSibling,ctx='';while(el&&!/^h[234]$/i.test(el.tagName)){ctx+=' '+(el.textContent||'').trim();el=el.nextElementSibling;if(ctx.length>200)break}searchIndex.push({id,text,context:ctx.trim().slice(0,300)})});
function searchDocs(q){const r=document.getElementById('search-results');if(!q||q.length<2){r.classList.remove('show');return}q=q.toLowerCase();const m=searchIndex.filter(e=>e.text.toLowerCase().includes(q)||e.context.toLowerCase().includes(q)).slice(0,20);if(!m.length){r.classList.remove('show');return}r.innerHTML=m.map(x=>'<a href="#'+x.id+'" onclick="toggleSidebar()"><div class="sr-title">'+esc(x.text)+'</div><div class="sr-context">'+esc(x.context.slice(0,120))+'</div></a>').join('');r.classList.add('show')}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
document.addEventListener('click',function(e){if(!e.target.closest('#search-wrap'))document.getElementById('search-results').classList.remove('show')});
document.getElementById('search').addEventListener('input',function(){searchDocs(this.value);document.getElementById('search-clear').style.display=this.value?'block':'none'});
function clearSearch(){const i=document.getElementById('search');i.value='';i.focus();searchDocs('');document.getElementById('search-clear').style.display='none'}
function setTheme(n){document.body.className='theme-'+n;document.querySelectorAll('.theme-btn').forEach(b=>b.classList.toggle('active',b.classList.contains(n)));try{localStorage.setItem('srs-theme',n)}catch(e){}}
try{const t=localStorage.getItem('srs-theme');if(t&&['apple','google','dark'].includes(t))setTheme(t)}catch(e){}
</script>
</body>
</html>'''

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    md = subprocess.run(['python3', 'filter-pdf.py', 'SRS/SRS.md'], capture_output=True, text=True, timeout=15).stdout
    filtered = '\n'.join(l for l in md.split('\n') if l.strip() != '---')
    html = build_html(filtered)
    with open('exports/SRS.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"HTML: exports/SRS.html ({os.path.getsize('exports/SRS.html')} bytes)")
