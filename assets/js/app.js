(function () {
  'use strict';

  /* ===== Theme ===== */
  var themeToggle = document.getElementById('theme-toggle');
  var dark = localStorage.getItem('srs-theme') === 'dark' ||
    (localStorage.getItem('srs-theme') === null &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  function setTheme(d) {
    dark = d;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (themeToggle) themeToggle.textContent = dark ? '\u25D0' : '\u25CF';
    try { localStorage.setItem('srs-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
  setTheme(dark);
  if (themeToggle) themeToggle.addEventListener('click', function () { setTheme(!dark); });

  /* ===== Sidebar ===== */
  var sidebar = document.getElementById('sidebar');
  var overlay = document.getElementById('sidebar-overlay');
  var menuBtn = document.getElementById('menu-toggle');

  function toggleSidebar() {
    if (!sidebar || !overlay) return;
    var open = sidebar.classList.toggle('open');
    overlay.classList.toggle('show', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }
  function closeSidebar() {
    if (!sidebar || !overlay) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
  if (menuBtn) menuBtn.addEventListener('click', toggleSidebar);
  if (overlay) overlay.addEventListener('click', toggleSidebar);

  /* ===== TOC ===== */
  function toggleToc(el) {
    var item = el.closest('.toc-item');
    if (!item) return;
    var children = item.querySelector('.toc-children');
    var btn = item.querySelector('.toc-toggle');
    if (!children) return;
    var open = children.classList.toggle('open');
    if (btn) btn.classList.toggle('open', open);
  }

  document.querySelectorAll('.toc-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      toggleToc(this);
    });
  });

  document.querySelectorAll('.toc-link').forEach(function (link) {
    var item = link.closest('.toc-item');
    if (item && item.querySelector('.toc-children')) {
      link.classList.add('has-children');
      link.addEventListener('click', function (e) {
        if (e.target.closest('.toc-toggle')) return;
        toggleToc(this);
      });
    }
  });

  /* ===== Search ===== */
  var searchData = [];
  document.querySelectorAll('#content h2, #content h3, #content h4, #content h5').forEach(function (h) {
    var id = h.id || '';
    var text = (h.textContent || '').trim();
    var el = h.nextElementSibling;
    var context = '';
    while (el && !/^H[2345]$/i.test(el.tagName)) {
      context += ' ' + (el.textContent || '').trim();
      el = el.nextElementSibling;
      if (context.length > 300) break;
    }
    searchData.push({ id: id, text: text, context: context.trim().slice(0, 400) });
  });

  var searchInput = document.getElementById('search');
  var searchResults = document.getElementById('search-results');
  var searchClear = document.getElementById('search-clear');

  function doSearch(q) {
    if (!searchResults || !q || q.length < 2) {
      if (searchResults) searchResults.classList.remove('show');
      return;
    }
    q = q.toLowerCase();
    var matches = searchData.filter(function (item) {
      return item.text.toLowerCase().indexOf(q) !== -1 ||
        item.context.toLowerCase().indexOf(q) !== -1;
    }).slice(0, 25);
    if (!matches.length) { searchResults.classList.remove('show'); return; }
    searchResults.innerHTML = matches.map(function (x) {
      var ctx = x.context.length > 120 ? x.context.slice(0, 120) + '...' : x.context;
      return '<a href="#' + esc(x.id) + '"><span class="sr-title">' + esc(x.text) +
        '</span><div class="sr-context">' + esc(ctx) + '</div></a>';
    }).join('');
    searchResults.classList.add('show');
  }

  function esc(s) { return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') }
  function clearSearch() {
    if (!searchInput) return;
    searchInput.value = '';
    searchInput.focus();
    doSearch('');
    if (searchClear) searchClear.style.display = 'none';
  }

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      doSearch(this.value);
      if (searchClear) searchClear.style.display = this.value ? 'block' : 'none';
    });
    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { clearSearch(); e.target.blur(); }
    });
  }
  if (searchClear) searchClear.addEventListener('click', clearSearch);
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#search-wrap') && searchResults) searchResults.classList.remove('show');
  });

  /* ===== Progress Bar ===== */
  var progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var st = document.documentElement.scrollTop || document.body.scrollTop;
      var sh = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = sh > 0 ? (st / sh) * 100 : 0;
      progressBar.style.setProperty('--pct', Math.min(pct, 100) + '%');
    });
  }

  /* ===== Active TOC Link ===== */
  var tocLinks = document.querySelectorAll('.toc-link');
  if (tocLinks.length) {
    var headings = [];
    document.querySelectorAll('#content h2, #content h3, #content h4, #content h5').forEach(function (h) {
      if (h.id) headings.push(h);
    });
    window.addEventListener('scroll', function () {
      var current = '';
      for (var i = 0; i < headings.length; i++) {
        if (headings[i].getBoundingClientRect().top < 80) current = headings[i].id;
      }
      tocLinks.forEach(function (link) {
        link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      });
    });
  }

  /* ===== Auto-expand TOC ===== */
  document.querySelectorAll('.toc-children').forEach(function (el) {
    setTimeout(function () {
      if (el.querySelector('.toc-link.active')) {
        el.classList.add('open');
        var toggle = el.closest('.toc-item');
        if (toggle) {
          var btn = toggle.querySelector('.toc-toggle');
          if (btn) btn.classList.add('open');
        }
      }
    }, 100);
  });

  /* ===== Keyboard: Cmd+K ===== */
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

  /* ===== Mindmap → Markdown ===== */
  function mindmapToMarkdown(code) {
    var lines = code.split('\n');
    var md = [];
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var trimmed = line.trim();
      if (!trimmed || trimmed === 'mindmap') continue;
      if (/^root\s*\(/.test(trimmed)) {
        md.push('- ' + trimmed.replace(/^root\s*\(\s*|\)\s*$/g, ''));
        continue;
      }
      var indent = line.search(/\S/);
      var level = Math.max(0, Math.floor(indent / 2) - 1);
      var prefix = '';
      for (var j = 0; j < level; j++) prefix += '  ';
      if (level === 0) md.push(prefix + '- **' + trimmed + '**');
      else md.push(prefix + '- ' + trimmed);
    }
    return md.join('\n');
  }

  /* ===== Load all diagrams ===== */
  function loadDiagrams() {
    var blocks = document.querySelectorAll('pre.mermaid');
    if (!blocks.length) return;

    var mermaidBlocks = [];
    var mindmapBlocks = [];

    blocks.forEach(function (block) {
      var ph = document.createElement('div');
      ph.className = 'mermaid-placeholder';
      ph.textContent = '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u044B\u2026';
      block.parentElement.insertBefore(ph, block.nextSibling);
      block._placeholder = ph;

      var codeEl = block.querySelector('code');
      if (!codeEl) return;
      var code = codeEl.textContent.trim();
      if (/^\s*mindmap\s/.test(code)) {
        mindmapBlocks.push({ block: block, code: code });
      } else {
        mermaidBlocks.push({ block: block, code: code });
      }
    });

    /* Markmap (feature map only) */
    if (mindmapBlocks.length) {
      mindmapBlocks.forEach(function (item) {
        var md = mindmapToMarkdown(item.code);

        var container = document.createElement('div');
        container.className = 'markmap-wrap';

        var toolbar = document.createElement('div');
        toolbar.className = 'markmap-toolbar';
        var btn = document.createElement('button');
        btn.className = 'markmap-fullscreen-btn';
        btn.textContent = '\u26F6 \u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043A\u0430\u0440\u0442\u0443 \u043F\u043E\u043B\u043D\u043E\u0441\u0442\u044C\u044E';
        toolbar.appendChild(btn);

        var svgEl = document.createElement('div');
        svgEl.className = 'markmap';

        container.appendChild(toolbar);
        container.appendChild(svgEl);

        if (item.block._placeholder) {
          item.block._placeholder.parentElement.replaceChild(container, item.block._placeholder);
        }

        /* Fullscreen overlay */
        var overlay = document.createElement('div');
        overlay.className = 'markmap-overlay';
        var closeBtn = document.createElement('button');
        closeBtn.className = 'markmap-overlay-close';
        closeBtn.textContent = '\u2716';
        var overlaySvg = document.createElement('div');
        overlaySvg.className = 'markmap markmap-overlay-content';
        overlay.appendChild(closeBtn);
        overlay.appendChild(overlaySvg);
        document.body.appendChild(overlay);

        btn.addEventListener('click', function () {
          overlay.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          initMarkmap(overlaySvg, md, true);
        });
        closeBtn.addEventListener('click', function () {
          overlay.style.display = 'none';
          document.body.style.overflow = '';
        });
        overlay.addEventListener('click', function (e) {
          if (e.target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
          }
        });

        /* Load markmap libs and render inline */
        function initMarkmap(el, mdown, fullscreen) {
          if (el._markmapReady) return;
          el._markmapReady = true;
          try {
            var t = new markmap.Transformer();
            var root = t.transform(mdown);
            var opts = {
              colorFreezeLevel: 2,
              zoom: true,
              pan: true,
              duration: 300,
              nodeMinHeight: fullscreen ? 24 : 16,
              spacingVertical: fullscreen ? 8 : 5,
              spacingHorizontal: fullscreen ? 140 : 80,
              paddingX: fullscreen ? 12 : 8,
              paddingY: fullscreen ? 8 : 4,
              maxWidth: fullscreen ? 400 : 260,
            };
            markmap.Markmap.create(el, opts, root);
          } catch (e) {
            el.textContent = '\u041E\u0448\u0438\u0431\u043A\u0430: ' + e.message;
            el.style.color = '#ff3b30';
            el.style.padding = '20px';
          }
        }

        var libLoaded = false;
        function loadMarkmapLib(cb) {
          if (libLoaded) { cb(); return; }
          var d3 = document.createElement('script');
          d3.src = 'https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js';
          d3.onload = function () {
            var l = document.createElement('script');
            l.src = 'https://cdn.jsdelivr.net/npm/markmap-lib@0.15.4/dist/browser/index.js';
            l.onload = function () {
              var v = document.createElement('script');
              v.src = 'https://cdn.jsdelivr.net/npm/markmap-view@0.15.4/dist/browser/index.js';
              v.onload = function () {
                libLoaded = true;
                cb();
              };
              document.head.appendChild(v);
            };
            document.head.appendChild(l);
          };
          document.head.appendChild(d3);
        }

        loadMarkmapLib(function () {
          initMarkmap(svgEl, md, false);
        });
      });
    }

    /* Mermaid (all other diagrams) */
    if (!mermaidBlocks.length) return;

    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js';
    script.onload = function () {
      mermaid.initialize({
        theme: dark ? 'dark' : 'default',
        maxTextSize: 100000,
        themeVariables: dark ? {
          primaryColor: '#2997ff',
          primaryTextColor: '#f5f5f7',
          primaryBorderColor: '#2997ff',
          lineColor: '#a1a1a6',
          secondaryColor: '#2c2c2e',
          tertiaryColor: '#3a3a3c',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        } : {
          primaryColor: '#0071e3',
          primaryTextColor: '#1d1d1f',
          primaryBorderColor: '#0071e3',
          lineColor: '#6e6e73',
          secondaryColor: '#f5f5f7',
          tertiaryColor: '#e8e8ed',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
        }
      });

      mermaidBlocks.forEach(function (item) {
        var wrapper = document.createElement('div');
        wrapper.className = 'mermaid-wrapper';

        mermaid.render('d' + Math.random().toString(36).slice(2), item.code)
          .then(function (result) {
            wrapper.innerHTML = result.svg;
            if (result.bindFunctions) result.bindFunctions(wrapper);
            if (item.block._placeholder) {
              item.block._placeholder.parentElement.replaceChild(wrapper, item.block._placeholder);
            }
          })
          .catch(function (err) {
            console.error('Mermaid error:', err);
            wrapper.textContent = '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0438 \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u044B: ' + err.message;
            wrapper.style.color = '#ff3b30';
            wrapper.style.padding = '20px';
            if (item.block._placeholder) {
              item.block._placeholder.parentElement.replaceChild(wrapper, item.block._placeholder);
            }
          });
      });
    };
    document.head.appendChild(script);
  }

  /* ===== Init ===== */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadDiagrams);
  } else {
    loadDiagrams();
  }
})();
