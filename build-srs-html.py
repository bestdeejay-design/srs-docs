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

    css = '''
:root {
  --bg:#fff; --bg2:#f8f9fb; --bg3:#f0f2f5;
  --text:#1c1e21; --text2:#606770; --text3:#8a8d91;
  --border:#e4e6eb; --border2:#d0d2d6;
  --accent:#1a73e8; --accent2:#1557b0; --accent-light:rgba(26,115,232,0.08);
  --code:#f5f6f8; --shadow:rgba(0,0,0,0.06); --radius:8px; --radius-sm:6px;
}
body.dark {
  --bg:#0d1117; --bg2:#161b22; --bg3:#1c2333;
  --text:#e6edf3; --text2:#8b949e; --text3:#6e7681;
  --border:#30363d; --border2:#484f58;
  --accent:#58a6ff; --accent2:#79c0ff; --accent-light:rgba(88,166,255,0.1);
  --code:#161b22; --shadow:rgba(0,0,0,0.3);
}
body.nord {
  --bg:#eceff4; --bg2:#e5e9f0; --bg3:#d8dee9;
  --text:#2e3440; --text2:#4c566a; --text3:#81a1c1;
  --border:#d8dee9; --border2:#c8cedb;
  --accent:#5e81ac; --accent2:#81a1c1; --accent-light:rgba(94,129,172,0.12);
  --code:#e5e9f0; --shadow:rgba(0,0,0,0.04);
}
body.nord.dark {
  --bg:#2e3440; --bg2:#3b4252; --bg3:#434c5e;
  --text:#eceff4; --text2:#81a1c1; --text3:#616e88;
  --border:#4c566a; --border2:#5e81ac;
  --accent:#88c0d0; --accent2:#8fbcbb; --accent-light:rgba(136,192,208,0.1);
  --code:#3b4252; --shadow:rgba(0,0,0,0.25);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;scroll-padding-top:20px}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Oxygen,Ubuntu,sans-serif;font-size:15px;line-height:1.65;color:var(--text);background:var(--bg);display:flex;transition:background .2s,color .2s}
#sidebar{position:fixed;top:0;left:0;bottom:0;width:280px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:100;transition:transform .3s,background .2s}
#sidebar-header{padding:16px 16px 12px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
#sidebar-header .logo{font-size:13px;font-weight:700;color:var(--accent);letter-spacing:-.01em}
#sidebar-header .logo small{font-weight:400;color:var(--text3);font-size:11px}
.theme-wrap{display:flex;gap:3px}
.theme-btn{width:22px;height:22px;border-radius:50%;border:2px solid var(--border);cursor:pointer;padding:0;transition:all .2s;position:relative}
.theme-btn:hover{transform:scale(1.2);border-color:var(--accent)}
.theme-btn.light{background:#fff}
.theme-btn.dark{background:#0d1117}
.theme-btn.nord{background:#eceff4}
.theme-btn.nord-dark{background:#2e3440}
.theme-btn.active{border-color:var(--accent);box-shadow:0 0 0 3px var(--accent-light)}
#search-wrap{padding:10px 12px;border-bottom:1px solid var(--border);position:relative}
#search{width:100%;padding:8px 34px 8px 12px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);color:var(--text);outline:none;transition:border-color .2s,background .2s}
#search:focus{border-color:var(--accent)}
#search-clear{position:absolute;right:15px;top:50%;transform:translateY(-50%);width:20px;height:20px;border:none;border-radius:50%;background:var(--text3);color:var(--bg);font-size:11px;line-height:20px;text-align:center;cursor:pointer;display:none;padding:0;opacity:.5}
#search-clear:hover{opacity:1}
#search-results{display:none;position:absolute;top:100%;left:0;right:0;max-height:50vh;overflow-y:auto;background:var(--bg);border:1px solid var(--border);border-radius:0 0 var(--radius) var(--radius);z-index:200;box-shadow:0 12px 32px var(--shadow)}
#search-results.show{display:block}
#search-results a{display:block;padding:8px 14px;font-size:13px;text-decoration:none;color:var(--text);border-bottom:1px solid var(--border);transition:background .15s}
#search-results a:last-child{border:none}
#search-results a:hover{background:var(--bg2)}
#search-results .sr-title{font-weight:500}
#search-results .sr-context{font-size:11.5px;color:var(--text2);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
#toc-container{flex:1;overflow-y:auto;padding:8px 0}
#toc-container ul{list-style:none;padding-left:16px}
#toc-container>ul{padding-left:0}
#toc-container li{margin:1px 0}
#toc-container a{display:block;padding:5px 16px 5px 12px;font-size:13px;color:var(--text2);text-decoration:none;border-radius:var(--radius-sm);line-height:1.35;transition:all .15s;border-left:3px solid transparent}
#toc-container a:hover{color:var(--accent);background:var(--accent-light);border-left-color:var(--accent)}
#toc-container a.active{color:var(--accent);background:var(--accent-light);border-left-color:var(--accent);font-weight:500}
#content{margin-left:280px;flex:1;max-width:960px;padding:48px 56px 100px;transition:background .2s}
#content h1{font-size:30px;font-weight:700;margin:0 0 10px;letter-spacing:-.025em;color:var(--accent)}
#content h2{font-size:22px;font-weight:600;margin:40px 0 12px;padding-bottom:10px;border-bottom:2px solid var(--border);letter-spacing:-.015em;color:var(--text);position:relative}
#content h2 .anchor{position:absolute;left:-28px;top:2px;color:var(--accent);opacity:0;text-decoration:none;font-size:18px;transition:opacity .15s}
#content h2:hover .anchor{opacity:.6}
#content h3{font-size:18px;font-weight:600;margin:28px 0 10px;color:var(--text)}
#content h4{font-size:15.5px;font-weight:600;margin:20px 0 8px;color:var(--text)}
#content p{margin-bottom:14px;color:var(--text)}
#content ul,#content ol{margin:8px 0 14px 22px}
#content li{margin-bottom:5px}
#content blockquote{border-left:4px solid var(--accent);padding:12px 20px;margin:16px 0;background:var(--bg2);color:var(--text2);border-radius:0 var(--radius-sm) var(--radius-sm) 0;font-size:14px}
#content pre{background:var(--code);padding:16px 20px;border-radius:var(--radius);overflow-x:auto;font-size:13px;margin:16px 0;font-family:'SF Mono','JetBrains Mono','Fira Code','Consolas',monospace;line-height:1.5;border:1px solid var(--border);position:relative}
#content code{font-family:'SF Mono','JetBrains Mono','Fira Code','Consolas',monospace;font-size:13px;background:var(--code);padding:2px 6px;border-radius:4px;color:var(--accent)}
#content pre code{background:none;padding:0;color:var(--text)}
#content table{width:100%;border-collapse:separate;border-spacing:0;margin:16px 0;font-size:13px;border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden}
#content th,#content td{padding:8px 12px;text-align:left;border-bottom:1px solid var(--border)}
#content th{background:var(--bg2);font-weight:600;font-size:12.5px;text-transform:uppercase;letter-spacing:.03em;color:var(--text2)}
#content tr:last-child td{border-bottom:none}
#content tr:hover td{background:var(--bg2)}
#content img{max-width:100%;height:auto;margin:16px 0;border-radius:var(--radius);border:1px solid var(--border);transition:opacity .2s}
#content hr{border:none;border-top:1px solid var(--border);margin:28px 0}
#progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:300;background:var(--border)}
#progress-bar{height:100%;background:var(--accent);width:0;transition:width .1s}
#menu-toggle{display:none;position:fixed;top:12px;left:12px;z-index:200;width:38px;height:38px;border:none;border-radius:10px;background:var(--accent);color:#fff;font-size:16px;cursor:pointer;backdrop-filter:blur(8px)}
@media(max-width:768px){
  #sidebar{transform:translateX(-100%)}
  #sidebar.open{transform:translateX(0)}
  #content{margin-left:0;padding:60px 16px 60px}
  #menu-toggle{display:block}
}
'''

    html_output = f'''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>SRS — Агрегатор доставки продуктов</title>
<style>{css}</style>
</head>
<body>
<div id="progress"><div id="progress-bar"></div></div>
<button id="menu-toggle" onclick="toggleSidebar()">☰</button>
<div id="sidebar">
  <div id="sidebar-header">
    <div class="logo">SRS <small>— агрегатор доставки</small></div>
    <div class="theme-wrap">
      <button class="theme-btn light active" onclick="setTheme('light','')" title="Светлая"></button>
      <button class="theme-btn dark" onclick="setTheme('dark','')" title="Тёмная"></button>
      <button class="theme-btn nord" onclick="setTheme('nord','')" title="Nord"></button>
      <button class="theme-btn nord-dark" onclick="setTheme('nord','dark')" title="Nord тёмная"></button>
    </div>
  </div>
  <div id="search-wrap">
    <input type="text" id="search" placeholder="Поиск…">
    <button id="search-clear" onclick="clearSearch()">×</button>
    <div id="search-results"></div>
  </div>
  <div id="toc-container">{toc}</div>
</div>
<div id="content">{body}</div>
<script>
function toggleSidebar(){{document.getElementById('sidebar').classList.toggle('open')}}
const searchIndex=[];
document.querySelectorAll('#content h2,#content h3,#content h4').forEach(h=>{{const id=h.id||'',text=h.textContent.trim();let el=h.nextElementSibling,ctx='';while(el&&!/^h[234]$/i.test(el.tagName)){{ctx+=' '+(el.textContent||'').trim();el=el.nextElementSibling;if(ctx.length>200)break}}searchIndex.push({{id,text,context:ctx.trim().slice(0,300)}})}});
function searchDocs(q){{const r=document.getElementById('search-results');if(!q||q.length<2){{r.classList.remove('show');return}}q=q.toLowerCase();const m=searchIndex.filter(e=>e.text.toLowerCase().includes(q)||e.context.toLowerCase().includes(q)).slice(0,20);if(!m.length){{r.classList.remove('show');return}}r.innerHTML=m.map(x=>'<a href="#'+x.id+'" onclick="toggleSidebar()"><div class="sr-title">'+esc(x.text)+'</div><div class="sr-context">'+esc(x.context.slice(0,120))+'</div></a>').join('');r.classList.add('show')}}
function esc(s){{return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}}
document.addEventListener('click',function(e){{if(!e.target.closest('#search-wrap'))document.getElementById('search-results').classList.remove('show')}});
document.getElementById('search').addEventListener('input',function(){{searchDocs(this.value);document.getElementById('search-clear').style.display=this.value?'block':'none'}});
function clearSearch(){{const i=document.getElementById('search');i.value='';i.focus();searchDocs('');document.getElementById('search-clear').style.display='none'}}
// Theme
function setTheme(base,dark){{document.body.className=base+(dark?' dark':'');document.querySelectorAll('.theme-btn').forEach(b=>b.classList.remove('active'));document.querySelector('.theme-btn.'+base+(dark?'.dark':'')).classList.add('active');try{{localStorage.setItem('srs-theme',base+(dark?' '+dark:''))}}catch(e){{}}}}
try{{const t=localStorage.getItem('srs-theme');if(t){{const p=t.split(' ');setTheme(p[0],p[1]||'')}}}}catch(e){{}}
// Scroll progress + active TOC
window.addEventListener('scroll',function(){{const h=document.documentElement;const p=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;document.getElementById('progress-bar').style.width=p+'%';const els=document.querySelectorAll('#content h2,#content h3,#content h4');let active='';els.forEach(h=>{{if(h.getBoundingClientRect().top<100)active='#'+h.id}});document.querySelectorAll('#toc-container a').forEach(a=>a.classList.toggle('active',a.getAttribute('href')===active))}});
</script>
</body>
</html>'''

    return html_output.replace('"exports/diagrams/', '"assets/')

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    md = subprocess.run(['python3', 'filter-pdf.py', 'SRS/SRS.md'], capture_output=True, text=True, timeout=15).stdout
    filtered = '\n'.join(l for l in md.split('\n') if l.strip() != '---')
    html = build_html(filtered)
    with open('exports/SRS.html', 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"OK: {os.path.getsize('exports/SRS.html')} bytes")
