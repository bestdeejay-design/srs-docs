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
    toc, stack = '', []
    for tag, attrs, text in headings:
        level = int(tag[1])
        clean = re.sub(r'<[^>]+>', '', text).strip()
        eid = (re.search(r'id="([^"]+)"', attrs or '') or ['', ''])[1]

        while stack and stack[-1] >= level:
            stack.pop()
            toc += '</ul></li>\n'

        if level == 2:
            toc += f'<li class="s"><button class="st" onclick="st(this)">▸</button><a href="#{html_mod.escape(eid)}">{html_mod.escape(clean)}</a><ul class="su">\n'
        elif level == 3:
            toc += f'<li class="s"><button class="st" onclick="st(this)">▸</button><a href="#{html_mod.escape(eid)}">{html_mod.escape(clean)}</a><ul class="su">\n'
        else:
            toc += f'<li><a href="#{html_mod.escape(eid)}">{html_mod.escape(clean)}</a></li>\n'

        stack.append(level)

    while stack:
        stack.pop()
        toc += '</ul></li>\n'

    return '''<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>SRS</title>
<style>
:root{--bg:#fff;--bg2:#f6f8fa;--text:#1a1a1a;--text2:#444;--border:#ddd;--accent:#0052cc;--accent2:#003d99;--code:#f6f8fa;--font:-apple-system,BlinkMacSystemFont,sans-serif;--font-mono:'SF Mono','Menlo',monospace;--shadow:rgba(0,0,0,0.06);--radius:6px}
body.dark{--bg:#0d1117;--bg2:#161b22;--text:#e6edf3;--text2:#8b949e;--border:#30363d;--accent:#58a6ff;--accent2:#79c0ff;--code:#161b22;--shadow:rgba(0,0,0,0.3)}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--font);font-size:16px;line-height:1.6;color:var(--text);background:var(--bg);display:flex;transition:background .15s,color .15s}
#sidebar{position:fixed;top:0;left:0;bottom:0;width:270px;background:var(--bg2);border-right:1px solid var(--border);display:flex;flex-direction:column;z-index:100;transition:transform .25s}
#sidebar-header{padding:14px 16px 10px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;flex-shrink:0}
#sidebar-header .logo{font-size:14px;font-weight:700;color:var(--accent)}
.theme-btn{width:32px;height:28px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);color:var(--text2);font-size:13px;cursor:pointer;padding:0;line-height:28px;text-align:center;transition:all .12s}
.theme-btn:hover{border-color:var(--accent);color:var(--accent)}
#search-wrap{padding:10px 12px;flex-shrink:0}
#search{width:100%;padding:8px 10px;font-size:14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg);color:var(--text);outline:none}
#search:focus{border-color:var(--accent)}
#search-clear{display:none;position:absolute;right:20px;top:50%;transform:translateY(-50%);width:18px;height:18px;border:none;border-radius:50%;background:var(--text2);color:#fff;font-size:10px;line-height:18px;text-align:center;cursor:pointer;padding:0}
#search-results{display:none;position:absolute;top:100%;left:8px;right:8px;max-height:50vh;overflow-y:auto;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);z-index:200;box-shadow:0 8px 24px var(--shadow)}
#search-results.show{display:block}
#search-results a{display:block;padding:8px 14px;font-size:14px;text-decoration:none;color:var(--text);border-bottom:1px solid var(--border)}
#search-results a:last-child{border:none}
#search-results a:hover{background:var(--bg2)}
#search-results .sr-title{font-weight:600}
#search-results .sr-context{font-size:12px;color:var(--text2);margin-top:1px}
#toc-container{flex:1;overflow-y:auto;padding:4px 0}
#toc-container ul{list-style:none;padding-left:0}
#toc-container>ul{padding-left:0}
#toc-container li{margin:0}
#toc-container a{display:inline;padding:4px 6px;font-size:13px;color:var(--text2);text-decoration:none;line-height:1.35;border-radius:4px;transition:color .1s}
#toc-container a:hover{color:var(--accent)}
#toc-container a.active{color:var(--accent);font-weight:600;background:rgba(0,82,204,0.06)}
body.dark #toc-container a.active{background:rgba(88,166,255,0.08)}
.st{background:none;border:none;cursor:pointer;font-size:11px;color:var(--text2);padding:4px 2px;width:18px;text-align:center;transition:transform .15s;vertical-align:middle;flex-shrink:0}
.st:hover{color:var(--accent)}
.st.open{transform:rotate(90deg)}
.s{display:flex;flex-wrap:wrap;align-items:baseline;padding:1px 0}
.s .st{margin-left:4px}
.s>a{order:-1}
.su{overflow:hidden;max-height:0;transition:max-height .25s ease;width:100%;padding-left:10px;border-left:1px solid var(--border);margin:2px 0 2px 12px}
.su.open{max-height:2000px}
.s .su a{padding-left:4px}
#content{margin-left:270px;flex:1;max-width:960px;padding:40px 48px 80px}
#content h1{font-size:30px;font-weight:700;margin:0 0 8px;color:var(--accent)}
#content h2{font-size:22px;font-weight:600;margin:36px 0 10px;padding-bottom:8px;border-bottom:1px solid var(--border)}
#content h3{font-size:18px;font-weight:600;margin:28px 0 8px}
#content h4{font-size:16px;font-weight:600;margin:20px 0 6px;color:var(--text2)}
#content p{margin-bottom:16px}
#content ul,#content ol{margin:8px 0 16px 24px}
#content li{margin-bottom:4px}
#content blockquote{border-left:3px solid var(--accent);padding:10px 18px;margin:16px 0;background:var(--bg2);color:var(--text2);border-radius:0 var(--radius) var(--radius) 0}
#content pre{background:var(--code);padding:14px 18px;border-radius:var(--radius);overflow-x:auto;font-size:13px;margin:16px 0;font-family:var(--font-mono);line-height:1.45;border:1px solid var(--border)}
#content code{font-family:var(--font-mono);font-size:13px;background:var(--code);padding:1px 5px;border-radius:3px;color:var(--accent)}
#content pre code{background:none;padding:0;color:inherit}
#content table{width:100%;border-collapse:collapse;margin:16px 0;font-size:14px;border:1px solid var(--border)}
#content th,#content td{padding:6px 10px;text-align:left;border:1px solid var(--border)}
#content th{background:var(--bg2);font-weight:600;font-size:13px}
#content img{max-width:100%;height:auto;margin:16px 0;border-radius:var(--radius);border:1px solid var(--border)}
#content hr{border:none;border-top:1px solid var(--border);margin:28px 0}
#progress{position:fixed;top:0;left:0;right:0;height:2px;z-index:300;background:var(--border)}
#progress-bar{height:100%;background:var(--accent);width:0%}
#menu-toggle{display:none;position:fixed;top:10px;left:10px;z-index:200;width:36px;height:36px;border:none;border-radius:8px;background:var(--accent);color:#fff;font-size:16px;cursor:pointer}
@media(max-width:768px){
  #sidebar{transform:translateX(-100%)}
  #sidebar.open{transform:translateX(0)}
  #content{margin-left:0;padding:56px 16px 60px}
  #menu-toggle{display:block}
}
</style>
</head>
<body>
<div id="progress"><div id="progress-bar"></div></div>
<button id="menu-toggle" onclick="t()">☰</button>
<div id="sidebar">
  <div id="sidebar-header">
    <div class="logo">SRS</div>
    <button class="theme-btn" onclick="d()" id="theme-switch">●</button>
  </div>
  <div id="search-wrap" style="position:relative">
    <input type="text" id="search" placeholder="Поиск…">
    <button id="search-clear" onclick="c()">×</button>
    <div id="search-results"></div>
  </div>
  <div id="toc-container"><ul>''' + toc + '''</ul></div>
</div>
<div id="content">''' + body + '''</div>
<script>
function t(){document.getElementById('sidebar').classList.toggle('open')}
function st(b){b.classList.toggle('open');b.nextElementSibling.nextElementSibling.classList.toggle('open')}
const si=[];document.querySelectorAll('#content h2,#content h3,#content h4').forEach(h=>{const id=h.id||'',t=h.textContent.trim();let e=h.nextElementSibling,c='';while(e&&!/^h[234]$/i.test(e.tagName)){c+=' '+(e.textContent||'').trim();e=e.nextElementSibling;if(c.length>200)break}si.push({id,text:t,context:c.trim().slice(0,300)})});
function s(q){const r=document.getElementById('search-results');if(!q||q.length<2){r.classList.remove('show');return}q=q.toLowerCase();const m=si.filter(e=>e.text.toLowerCase().includes(q)||e.context.toLowerCase().includes(q)).slice(0,20);if(!m.length){r.classList.remove('show');return}r.innerHTML=m.map(x=>'<a href="#'+x.id+'" onclick="t()"><b>'+esc(x.text)+'</b><br><small>'+esc(x.context.slice(0,120))+'</small></a>').join('');r.classList.add('show')}
function esc(s){return(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
document.addEventListener('click',function(e){if(!e.target.closest('#search-wrap'))document.getElementById('search-results').classList.remove('show')});
document.getElementById('search').addEventListener('input',function(){s(this.value);document.getElementById('search-clear').style.display=this.value?'block':'none'});
function c(){const i=document.getElementById('search');i.value='';i.focus();s('');document.getElementById('search-clear').style.display='none'}
function d(){document.body.classList.toggle('dark');document.getElementById('theme-switch').textContent=document.body.classList.contains('dark')?'◐':'●';try{localStorage.setItem('dark',document.body.classList.contains('dark')?'1':'0')}catch(e){}}
try{if(localStorage.getItem('dark')==='1')d()}catch(e){}
window.addEventListener('scroll',function(){const h=document.documentElement;p=(h.scrollTop/(h.scrollHeight-h.clientHeight))*100;document.getElementById('progress-bar').style.width=p+'%';let a='';document.querySelectorAll('#content h2,#content h3,#content h4').forEach(h=>{if(h.getBoundingClientRect().top<80)a=''+h.id});document.querySelectorAll('#toc-container a').forEach(l=>l.classList.toggle('active',l.getAttribute('href')==='#'+a));document.querySelectorAll('.s').forEach(s=>{const u=s.querySelector('.su');if(u&&u.querySelector('a.active')){s.querySelector('.st').classList.add('open');u.classList.add('open')}})})
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
