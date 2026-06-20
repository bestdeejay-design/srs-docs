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
  document.querySelectorAll('.toc-toggle').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var children = this.parentElement.querySelector('.toc-children');
      if (children) {
        var open = children.classList.toggle('open');
        this.classList.toggle('open', open);
      }
    });
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

  /* ===== Mermaid ===== */
  function makeZoomable(wrapper) {
    var svg = wrapper.querySelector('svg');
    if (!svg) return;

    var scale = 1;
    var panX = 0, panY = 0;
    var dragging = false, startX, startY, startPanX, startPanY;

    var controls = document.createElement('div');
    controls.className = 'mermaid-zoom';
    controls.innerHTML =
      '<button class="z-in" title="\u0423\u0432\u0435\u043B\u0438\u0447\u0438\u0442\u044C">+</button>' +
      '<span class="zoom-level">100%</span>' +
      '<button class="z-out" title="\u0423\u043C\u0435\u043D\u044C\u0448\u0438\u0442\u044C">\u2212</button>' +
      '<button class="z-reset" title="\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C">\u27F3</button>';
    wrapper.insertBefore(controls, wrapper.firstChild);

    function applyTransform() {
      svg.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + scale + ')';
      controls.querySelector('.zoom-level').textContent = Math.round(scale * 100) + '%';
      wrapper.classList.toggle('zoomed', scale !== 1);
    }

    controls.querySelector('.z-in').addEventListener('click', function () {
      scale = Math.min(scale * 1.4, 10);
      applyTransform();
    });
    controls.querySelector('.z-out').addEventListener('click', function () {
      scale = Math.max(scale / 1.4, 0.2);
      panX = Math.min(0, panX);
      panY = Math.min(0, panY);
      applyTransform();
    });
    controls.querySelector('.z-reset').addEventListener('click', function () {
      scale = 1; panX = 0; panY = 0;
      applyTransform();
      wrapper.scrollLeft = 0;
      wrapper.scrollTop = 0;
    });

    wrapper.addEventListener('wheel', function (e) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      var rect = wrapper.getBoundingClientRect();
      var mx = e.clientX - rect.left;
      var my = e.clientY - rect.top;
      var ox = (mx - panX) / scale;
      var oy = (my - panY) / scale;
      scale = e.deltaY < 0 ? Math.min(scale * 1.15, 10) : Math.max(scale / 1.15, 0.2);
      panX = mx - ox * scale;
      panY = my - oy * scale;
      applyTransform();
    });

    wrapper.addEventListener('mousedown', function (e) {
      if (e.button !== 0 || e.target.closest('.mermaid-zoom')) return;
      dragging = true;
      startX = e.clientX; startY = e.clientY;
      startPanX = panX; startPanY = panY;
      wrapper.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', function (e) {
      if (!dragging) return;
      panX = startPanX + (e.clientX - startX);
      panY = startPanY + (e.clientY - startY);
      applyTransform();
    });
    document.addEventListener('mouseup', function () {
      if (dragging) { dragging = false; wrapper.style.cursor = ''; }
    });

    svg.addEventListener('dblclick', function () {
      scale = 1; panX = 0; panY = 0;
      applyTransform();
      wrapper.scrollLeft = 0;
      wrapper.scrollTop = 0;
    });
  }

  function loadMermaid() {
    var blocks = document.querySelectorAll('pre.mermaid');
    if (!blocks.length) return;

    blocks.forEach(function (block) {
      var ph = document.createElement('div');
      ph.className = 'mermaid-placeholder';
      ph.textContent = '\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430 \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u044B\u2026';
      block.parentElement.insertBefore(ph, block.nextSibling);
      block._placeholder = ph;
    });

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

      blocks.forEach(function (block) {
        var codeEl = block.querySelector('code');
        if (!codeEl) return;
        var code = codeEl.textContent.trim();
        var wrapper = document.createElement('div');
        wrapper.className = 'mermaid-wrapper';

        mermaid.render('d' + Math.random().toString(36).slice(2), code)
          .then(function (result) {
            wrapper.innerHTML = result.svg;
            if (result.bindFunctions) result.bindFunctions(wrapper);
            if (block._placeholder) {
              block._placeholder.parentElement.replaceChild(wrapper, block._placeholder);
            }
            makeZoomable(wrapper);
          })
          .catch(function (err) {
            console.error('Mermaid error:', err);
            wrapper.textContent = '\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0440\u0438\u0441\u043E\u0432\u0430\u043D\u0438\u0438 \u0434\u0438\u0430\u0433\u0440\u0430\u043C\u043C\u044B: ' + err.message;
            wrapper.style.color = '#ff3b30';
            wrapper.style.padding = '20px';
            if (block._placeholder) {
              block._placeholder.parentElement.replaceChild(wrapper, block._placeholder);
            }
          });
      });
    };
    document.head.appendChild(script);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadMermaid);
  } else {
    loadMermaid();
  }
})();
