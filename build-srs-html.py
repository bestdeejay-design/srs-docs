#!/usr/bin/env python3
import re, subprocess, os, html as html_mod

def build_html(input_md):
    result = subprocess.run(
        ['pandoc', '-f', 'markdown-implicit_figures', '-o', '-', '-s',
         '--metadata', 'title=SRS'],
        input=input_md, capture_output=True, text=True, timeout=30
    )
    body = re.search(r'<body>(.*)</body>', result.stdout, re.DOTALL)
    if not body: raise RuntimeError("No <body>")
    body = body.group(1)

    headings = re.findall(r'<(h[234])(\s[^>]*)?>(.*?)</\1>', body, re.DOTALL)
    toc, prev = '', 1
    for tag, attrs, text in headings:
        level = int(tag[1])
        clean = re.sub(r'<[^>]+>', '', text).strip()
        eid = (re.search(r'id="([^"]+)"', attrs or '') or ['', ''])[1]
        indent = level - 2
        if indent > prev - 2: toc += '\n' + '  ' * indent + '<ul>\n'
        elif indent < prev - 2: toc += '\n' + '  ' * (indent + 1) + '</ul>\n' * (prev - 2 - indent)
        toc += f'{"  " * (indent + 1)}<li><a href="#{html_mod.escape(eid)}">{html_mod.escape(clean)}</a></li>\n'
        prev = level
    for _ in range(prev - 2): toc += '</ul>\n'

    return '''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SRS</title>
<style>
/* ===== THEME: APPLE (Human Interface) ===== */
.theme-apple,:root{--a-bg:#fff;--a-bg2:#f5f5f7;--a-bg3:#e8e8ed;--a-text:#1d1d1f;--a-text2:#86868b;--a-text3:#aeaeb2;--a-border:#d2d2d7;--a-accent:#0071e3;--a-code:#f5f5f7;--a-shadow:rgba(0,0,0,0.04);--a-radius:10px;--a-font:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif;--a-font-mono:'SF Mono','Menlo',monospace}
.theme-apple-dark{--a-bg:#1c1c1e;--a-bg2:#2c2c2e;--a-bg3:#3a3a3c;--a-text:#f5f5f7;--a-text2:#98989d;--a-text3:#636366;--a-border:#38383a;--a-accent:#0a84ff;--a-code:#2c2c2e;--a-shadow:rgba(0,0,0,0.2)}

/* ===== THEME: GOOGLE (Material You) ===== */
.theme-google{--g-bg:#fff;--g-bg2:#f8f9fa;--g-bg3:#f1f3f4;--g-text:#202124;--g-text2:#5f6368;--g-text3:#9aa0a6;--g-border:#dadce0;--g-accent:#1a73e8;--g-code:#f1f3f4;--g-shadow:rgba(60,64,67,0.08);--g-radius:8px;--g-font:'Google Sans','Roboto',sans-serif;--g-font-mono:'Google Sans Mono','Roboto Mono',monospace}
.theme-google-dark{--g-bg:#202124;--g-bg2:#292a2d;--g-bg3:#303134;--g-text:#e8eaed;--g-text2:#9aa0a6;--g-text3:#5f6368;--g-border:#3c4043;--g-accent:#8ab4f8;--g-code:#303134;--g-shadow:rgba(0,0,0,0.3)}

/* ===== THEME: NORD ===== */
.theme-nord{--n-bg:#eceff4;--n-bg2:#e5e9f0;--n-bg3:#d8dee9;--n-text:#2e3440;--n-text2:#4c566a;--n-text3:#81a1c1;--n-border:#d8dee9;--n-accent:#5e81ac;--n-code:#e5e9f0;--n-shadow:rgba(46,52,64,0.04);--n-radius:6px;--n-font:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;--n-font-mono:'SF Mono','Consolas',monospace}
.theme-nord-dark{--n-bg:#2e3440;--n-bg2:#3b4252;--n-bg3:#434c5e;--n-text:#eceff4;--n-text2:#81a1c1;--n-text3:#616e88;--n-border:#4c566a;--n-accent:#88c0d0;--n-code:#3b4252;--n-shadow:rgba(0,0,0,0.25)}

/* ===== APPLY ACTIVE THEME ===== */
body{--bg:var(--a-bg);--bg2:var(--a-bg2);--bg3:var(--a-bg3);--text:var(--a-text);--text2:var(--a-text2);--text3:var(--a-text3);--border:var(--a-border);--accent:var(--a-accent);--code:var(--a-code);--shadow:var(--a-shadow);--radius:var(--a-radius);--font:var(--a-font);--font-mono:var(--a-font-mono)}
body.google{--bg:var(--g-bg);--bg2:var(--g-bg2);--bg3:var(--g-bg3);--text:var(--g-text);--text2:var(--g-text2);--text3:var(--g-text3);--border:var(--g-border);--accent:var(--g-accent);--code:var(--g-code);--shadow:var(--g-shadow);--radius:var(--g-radius);--font:var(--g-font);--font-mono:var(--g-font-mono)}
body.nord{--bg:var(--n-bg);--bg2:var(--n-bg2);--bg3:var(--n-bg3);--text:var(--n-text);--text2:var(--n-text2);--text3:var(--n-text3);--border:var(--n-border);--accent:var(--n-accent);--code:var(--n-code);--shadow:var(--n-shadow);--radius:var(--n-radius);--font:var(--n-font);--font-mono:var(--n-font-mono)}
body.dark{--bg:var(--a-bg2);--bg2:var(--a-bg3);--text:var(--a-text2);--text2:var(--a-text3);--border:var(--a-border);--accent:var(--g-accent);--code:var(--a-bg3)}
body.google.dark{--bg:var(--g-bg);--bg2:var(--g-bg2);--text:var(--g-text);--text2:var(--g-text2);--border:var(--g-border);--accent:var(--g-accent);--code:var(--g-bg2)}
body.nord.dark{--bg:var(--n-bg);--bg2:var(--n-bg2);--text:var(--n-text);--text2:var(--n-text2);--border:var(--n-border);--accent:var(--n-accent);--code:var(--n-bg2)}

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font);font-size:15px;line-height:1.65;color:var(--text);background:var(--bg);display:flex;transition:background .25s,color .25s}

/* === SIDEBAR === */
#sidebar{position:fixed;top:0;left:0;bottom:0;width:276px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:100;transition:transform .3s,background .25s}
#sidebar-header{padding:16px 16px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px}
#sidebar-header .logo{font-size:13px;font-weight:600;color:var(--text);white-space:nowrap}
#sidebar-header .logo span{color:var(--accent)}
.theme-select{display:flex;gap:2px;background:var(--bg);padding:2px;border-radius:7px;border:1px solid var(--border)}
.theme-btn{width:22px;height:22px;border-radius:5px;border:none;cursor:pointer;padding:0;opacity:.5;transition:all .15s}
.theme-btn:hover{opacity:.8;transform:scale(1.1)}
.theme-btn.cur-apple{background:#0071e3}
.theme-btn.cur-google{background:#1a73e8}
.theme-btn.cur-nord{background:#5e81ac}
.theme-btn.active{opacity:1;box-shadow:0 0 0 1.5px var(--accent)}
.theme-btn .dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin:0 1px}
.theme-btn.dark-mode{background:transparent}
.theme-btn.dark-mode .dot{background:var(--text3)}

/* === SEARCH === */
#search-wrap{padding:10px 12px;position:relative}
#search{width:100%;padding:8px 34px 8px 12px;font-size:13px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);color:var(--text);outline:none;transition:border-color .2s,background .2s}
#search::placeholder{color:var(--text3)}
#search:focus{border-color:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 15%,transparent)}
#search-clear{position:absolute;right:18px;top:50%;transform:translateY(-50%);width:18px;height:18px;border:none;border-radius:50%;background:var(--text3);color:var(--bg);font-size:10px;line-height:18px;text-align:center;cursor:pointer;display:none;padding:0;opacity:.5}
#search-clear:hover{opacity:1;background:var(--accent)}
#search-results{display:none;position:absolute;top:100%;left:8px;right:8px;max-height:50vh;overflow-y:auto;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);z-index:200;box-shadow:0 12px 32px var(--shadow)}
#search-results.show{display:block}
#search-results a{display:block;padding:8px 14px;font-size:13px;text-decoration:none;color:var(--text);border-bottom:1px solid var(--border);transition:background .1s}
#search-results a:last-child{border:none}
#search-results a:hover{background:var(--bg2)}
#search-results .sr-title{font-weight:500}
#search-results .sr-context{font-size:11.5px;color:var(--text2);margin-top:2px}

/* === TABLE OF CONTENTS === */
#toc-container{flex:1;overflow-y:auto;padding:6px 0}
#toc-container ul{list-style:none;padding-left:14px}
#toc-container>ul{padding-left:0}
#toc-container li{margin:1px 0}
#toc-container a{display:block;padding:4px 14px 4px 10px;font-size:12.5px;color:var(--text2);text-decoration:none;border-radius:4px;line-height:1.35;transition:all .12s;border-left:3px solid transparent}
#toc-container a:hover{color:var(--accent);background:color-mix(in srgb,var(--accent) 6%,transparent);border-left-color:var(--accent)}
#toc-container a.active{color:var(--accent);background:color-mix(in srgb,var(--accent) 8%,transparent);border-left-color:var(--accent);font-weight:500}

/* === CONTENT === */
#content{margin-left:276px;flex:1;max-width:960px;padding:48px 56px 100px}
#content h1{font-size:32px;font-weight:700;margin:0 0 10px;letter-spacing:-.025em;color:var(--text)}
body.google #content h1{font-size:34px;font-weight:500;letter-spacing:-.01em}
body.nord #content h1{font-size:28px;font-weight:600}
#content h2{font-size:22px;font-weight:600;margin:36px 0 10px;padding-bottom:10px;border-bottom:1.5px solid var(--border);letter-spacing:-.01em}
#content h3{font-size:17.5px;font-weight:600;margin:28px 0 8px}
#content h4{font-size:15px;font-weight:600;margin:20px 0 6px;color:var(--text2)}
#content p{margin-bottom:14px}
#content ul,#content ol{margin:8px 0 14px 22px}
#content li{margin-bottom:4px}
#content blockquote{border-left:4px solid var(--accent);padding:12px 20px;margin:16px 0;background:var(--bg2);color:var(--text2);border-radius:0 var(--radius) var(--radius) 0;font-size:14px}
body.google #content blockquote{border-left-width:4px;border-radius:4px}
#content pre{background:var(--code);padding:16px 20px;border-radius:var(--radius);overflow-x:auto;font-size:13px;margin:16px 0;font-family:var(--font-mono);line-height:1.5;border:1px solid var(--border)}
#content code{font-family:var(--font-mono);font-size:13px;background:var(--code);padding:2px 6px;border-radius:4px;color:var(--accent)}
#content pre code{background:none;padding:0;color:var(--text)}
#content table{width:100%;border-collapse:separate;border-spacing:0;margin:16px 0;font-size:12.5px;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
body.google #content table{box-shadow:0 1px 3px var(--shadow)}
#content th,#content td{padding:8px 12px;text-align:left;border-bottom:1px solid var(--border)}
#content th{background:var(--bg2);font-weight:600;font-size:12px;color:var(--text2)}
body.google #content th{text-transform:none;letter-spacing:.02em;font-weight:500}
#content tr:last-child td{border-bottom:none}
#content tr:hover td{background:color-mix(in srgb,var(--accent) 3%,transparent)}
#content img{max-width:100%;height:auto;margin:16px 0;border-radius:var(--radius);border:1px solid var(--border)}
body.google #content img{box-shadow:0 2px 8px var(--shadow)}
#content hr{border:none;border-top:1px solid var(--border);margin:28px 0}

/* === PROGRESS BAR === */
#progress{position:fixed;top:0;left:0;right:0;height:3px;z-index:300;background:var(--border)}
#progress-bar{height:100%;background:var(--accent);width:0%;transition:width .05s linear}

/* === MOBILE === */
#menu-toggle{display:none;position:fixed;top:10px;left:10px;z-index:200;width:38px;height:38px;border:none;border-radius:10px;background:var(--accent);color:#fff;font-size:16px;cursor:pointer}
@media(max-width:768px){
  #sidebar{transform:translateX(-100%)}
  #sidebar.open{transform:translateX(0)}
  #content{margin-left:0;padding:56px 16px 60px}
  #menu-toggle{display:block}
}
</style>
</head>
<body class="theme-apple">
<div id="progress"><div id="progress-bar"></div></div>
<button id="menu-toggle" onclick="toggleSidebar()">☰</button>
<div id="sidebar">
  <div id="sidebar-header">
    <div class="logo"><span>SRS</span> — агрегатор доставки</div>
    <div class="theme-select" id="theme-select">
      <button class="theme-btn cur-apple active" data-theme="apple" title="Apple" onclick="setTheme('apple')"></button>
      <button class="theme-btn cur-google" data-theme="google" title="Google" onclick="setTheme('google')"></button>
      <button class="theme-btn cur-nord" data-theme="nord" title="Nord" onclick="setTheme('nord')"></button>
      <button class="theme-btn dark-mode" data-dark="1" onclick="toggleDark()" title="Тёмная версия"><span class="dot"></span></button>
    </div>
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
const si=[];document.querySelectorAll('#content h2,#content h3,#content h4').forEach(h=>{const id=h.id||'',t=h.textContent.trim();let e=h.nextElementSibling,c='';while(e&&!/^h[234]$/i.test(e.tagName)){c+=' '+(e.textContent||'').trim();e=e.nextElementSibling;if(c.length>200)break}si.push({id,text:t,context:c.trim().slice(0,300)})});
function searchDocs(q){const r=document.getElementById('search-results');if(!q||q.length<2){r.classList.remove('show');return}q=q.toLowerCase();const m=si.filter(e=>e.text.toLowerCase().includes(q)||e.context.toLowerCase().includes(q)).slice(0,20);if(!m.length){r.classList.remove('show');return}r.innerHTML=m.map(x=>'<a href="#'+x.id+'" onclick="toggleSidebar()"><div class="sr-title">'+esc(x.text)+'</div><div class="sr-context">'+esc(x.context.slice(0,120))+'</div></a>').join('');r.classList.add('show')}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
document.addEventListener('click',function(e){if(!e.target.closest('#search-wrap'))document.getElementById('search-results').classList.remove('show')});
document.getElementById('search').addEventListener('input',function(){searchDocs(this.value);document.getElementById('search-clear').style.display=this.value?'block':'none'});
function clearSearch(){const i=document.getElementById('search');i.value='';i.focus();searchDocs('');document.getElementById('search-clear').style.display='none'}
function setTheme(t){document.body.className=t+(document.body.classList.contains('dark')?' dark':'');document.querySelectorAll('.theme-btn[data-theme]').forEach(b=>b.classList.toggle('active',b.dataset.theme===t));try{localStorage.setItem('srs-base',t)}catch(e){}}
function toggleDark(){const d=document.body.classList.toggle('dark');const base=document.body.className.replace(' dark','');document.body.className=base+(d?' dark':'');document.querySelector('.theme-btn.dark-mode').classList.toggle('active',d);try{localStorage.setItem('srs-dark',d?'1':'0')}catch(e){}}
try{const b=localStorage.getItem('srs-base');if(b)setTheme(b);const d=localStorage.getItem('srs-dark');if(d==='1')toggleDark()}catch(e){}
window.addEventListener('scroll',function(){const h=document.documentElement;p=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;document.getElementById('progress-bar').style.width=Math.min(p,100)+'%';let a='';document.querySelectorAll('#content h2,#content h3,#content h4').forEach(h=>{if(h.getBoundingClientRect().top<80)a='#'+h.id});document.querySelectorAll('#toc-container a').forEach(l=>l.classList.toggle('active',l.getAttribute('href')===a))});
</script>
</body>
</html>'''

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    md = subprocess.run(['python3', 'filter-pdf.py', 'SRS/SRS.md'], capture_output=True, text=True, timeout=15).stdout
    filtered = '\n'.join(l for l in md.split('\n') if l.strip() != '---')
    html = build_html(filtered).replace('"exports/diagrams/', '"assets/')
    with open('exports/SRS.html', 'w', encoding='utf-8') as f: f.write(html)
    print(f"OK: {os.path.getsize('exports/SRS.html')} bytes")
