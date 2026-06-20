(function () {
  'use strict';

  /* ===== Theme ===== */
  const themeToggle = document.getElementById('theme-toggle');
  let dark = localStorage.getItem('srs-theme') === 'dark' ||
    (localStorage.getItem('srs-theme') === null &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  function setTheme(d) {
    dark = d;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    if (themeToggle) themeToggle.textContent = dark ? '\u25D0' : '\u25CF';
    try { localStorage.setItem('srs-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }

  setTheme(dark);
  if (themeToggle) {
    themeToggle.addEventListener('click', function () { setTheme(!dark); });
  }

  /* ===== Sidebar / Mobile Menu ===== */
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebar-overlay');
  const menuBtn = document.getElementById('menu-toggle');

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

  /* ===== TOC Collapse ===== */
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
    searchData.push({
      id: id,
      text: text,
      context: context.trim().slice(0, 400)
    });
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

    if (!matches.length) {
      searchResults.classList.remove('show');
      return;
    }

    searchResults.innerHTML = matches.map(function (x) {
      var ctx = x.context.length > 120 ? x.context.slice(0, 120) + '...' : x.context;
      return '<a href="#' + escapeHtml(x.id) + '" onclick="setTimeout(function(){closeSidebar()},100)"><span class="sr-title">' +
        escapeHtml(x.text) + '</span><div class="sr-context">' + escapeHtml(ctx) + '</div></a>';
    }).join('');
    searchResults.classList.add('show');
  }

  function escapeHtml(s) {
    return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

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
      if (e.key === 'Escape') { clearSearch(); searchInput.blur(); }
    });
  }

  if (searchClear) searchClear.addEventListener('click', clearSearch);

  document.addEventListener('click', function (e) {
    if (!e.target.closest('#search-wrap')) {
      if (searchResults) searchResults.classList.remove('show');
    }
  });

  /* ===== Progress Bar ===== */
  var progressBar = document.getElementById('progress-bar');
  if (progressBar) {
    window.addEventListener('scroll', function () {
      var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      var pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.setProperty('--pct', Math.min(pct, 100) + '%');
      progressBar.style.setProperty('width', Math.min(pct, 100) + '%');
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
        if (headings[i].getBoundingClientRect().top < 80) {
          current = headings[i].id;
        }
      }
      tocLinks.forEach(function (link) {
        var href = link.getAttribute('href');
        link.classList.toggle('active', href === '#' + current);
      });
    });
  }

  /* ===== Auto-collapse TOC on load ===== */
  document.querySelectorAll('.toc-children').forEach(function (el) {
    setTimeout(function () {
      if (el.querySelector('.toc-link.active')) {
        el.classList.add('open');
        el.closest('.toc-item')?.querySelector('.toc-toggle')?.classList.add('open');
      }
    }, 100);
  });

  /* ===== Keyboard shortcut: Cmd+K / Ctrl+K ===== */
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
    }
  });

})();
