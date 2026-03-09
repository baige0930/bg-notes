(function () {
  "use strict";

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }

  function slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, "-")
      .replace(/[^\w\-]+/g, "");
  }

  function loadState(key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function saveState(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {}
  }

  function setExpanded(btn, expanded) {
    btn.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  // Scroll-sync removed — sidebars now use CSS position:sticky and follow
  // the header naturally without any JavaScript.
  function scheduleHeaderHeight() {}
  function updateSidebarTop() {}

  function initSidebarCollapse() {
    var sidebar = $(".bg-sidebar");
    var btn = $("#bg-sidebar-toggle");
    var openBtn = $("#bg-sidebar-open-btn");
    if (!sidebar || !btn) return;

    function isMobile() {
      return window.innerWidth <= 960;
    }

    function applyCollapsed(collapsed) {
      if (isMobile()) {
        // Mobile: use slide-in drawer via .is-open
        sidebar.classList.toggle("is-open", !collapsed);
        // Keep .is-collapsed in sync so the open button CSS can still work
        sidebar.classList.toggle("is-collapsed", collapsed);
        setExpanded(btn, !collapsed);
        return;
      }

      // Desktop: width collapse
      if (collapsed) {
        sidebar.classList.add("is-collapsed");
        sidebar.classList.remove("is-open");
        setExpanded(btn, false);
      } else {
        sidebar.classList.remove("is-collapsed");
        sidebar.classList.add("is-open");
        setExpanded(btn, true);
      }
    }

    var collapsed = loadState("bg_sidebar_collapsed", false);
    // On small screens, always start collapsed
    if (isMobile()) {
      collapsed = true;
    }
    applyCollapsed(collapsed);

    btn.addEventListener("click", function () {
      var isCollapsed = !sidebar.classList.contains("is-collapsed");
      applyCollapsed(isCollapsed);
      saveState("bg_sidebar_collapsed", isCollapsed);
    });

    if (openBtn) {
      openBtn.addEventListener("click", function () {
        applyCollapsed(false);
        saveState("bg_sidebar_collapsed", false);
      });
    }

    // Re-apply when resizing across breakpoints
    window.addEventListener("resize", function () {
      applyCollapsed(sidebar.classList.contains("is-collapsed"));
    });
  }

  function initPanelCollapse() {
    var toggles = $all("[data-panel-toggle]");
    if (!toggles.length) return;

    toggles.forEach(function (btn) {
      var panelName = btn.getAttribute("data-panel-toggle");
      var panel = btn.closest(".bg-panel");
      if (!panel) return;

      var key = "bg_panel_" + panelName + "_collapsed";
      var collapsed = loadState(key, false);
      if (collapsed) {
        panel.classList.add("is-collapsed");
        setExpanded(btn, false);
      }

      btn.addEventListener("click", function () {
        panel.classList.toggle("is-collapsed");
        var isCollapsed = panel.classList.contains("is-collapsed");
        setExpanded(btn, !isCollapsed);
        saveState(key, isCollapsed);
      });
    });
  }

  function initNavGroupCollapse() {
    var groups = $all(".bg-nav__group");
    groups.forEach(function (group) {
      var chevron = group.querySelector(".bg-nav__chevron");
      if (!chevron) return;

      var link = group.querySelector(".bg-nav__group-link");
      var key = "bg_navgroup_" + (link ? link.getAttribute("href") : "") + "_collapsed";

      // Read the expand setting rendered from front matter:
      //   "all"  (default) → expanded, ignore localStorage
      //   "none"           → collapsed by default, but user can override via localStorage
      //   "1"              → same as "none" for now (one level: group visible, children hidden)
      var expand = group.getAttribute("data-nav-expand") || "all";

      var collapsed;
      if (expand === "none" || expand === "1") {
        // Default is collapsed; respect localStorage if user has explicitly toggled
        collapsed = loadState(key, true);
      } else {
        // "all": default is expanded; respect localStorage if user has explicitly toggled
        collapsed = loadState(key, false);
      }

      if (collapsed) group.classList.add("is-collapsed");

      chevron.addEventListener("click", function (e) {
        e.stopPropagation();
        group.classList.toggle("is-collapsed");
        saveState(key, group.classList.contains("is-collapsed"));
      });
    });
  }

  function buildToc() {
    var tocRoot = $("#bg-toc-right");
    var contentRoot = $("#page-content");
    if (!tocRoot || !contentRoot) return;

    var headings = $all("h2, h3", contentRoot);
    if (!headings.length) {
      tocRoot.innerHTML = "<div style='color: rgba(0,0,0,.6)'>暂无标题</div>";
      return;
    }

    // Ensure stable ids.
    var used = {};
    headings.forEach(function (h) {
      if (!h.id) {
        var base = slugify(h.textContent || "");
        if (!base) base = "section";
        var id = base;
        var i = 2;
        while (document.getElementById(id) || used[id]) {
          id = base + "-" + i;
          i += 1;
        }
        used[id] = true;
        h.id = id;
      }
    });

    var itemsHtml = headings
      .map(function (h) {
        var level = h.tagName.toLowerCase();
        var cls = level === "h3" ? "bg-toc__item bg-toc__item--h3" : "bg-toc__item";
        return (
          "<div class='" +
          cls +
          "'><a href='#" +
          h.id +
          "' data-toc-id='" +
          h.id +
          "'>" +
          (h.textContent || "") +
          "</a></div>"
        );
      })
      .join("");
    tocRoot.innerHTML = itemsHtml;

    // Active heading highlight.
    var linksById = {};
    $all("a[data-toc-id]", tocRoot).forEach(function (a) {
      linksById[a.getAttribute("data-toc-id")] = a;
    });

    function clearActive() {
      $all("a.is-active", tocRoot).forEach(function (a) {
        a.classList.remove("is-active");
      });
    }

    if ("IntersectionObserver" in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          // Choose the most visible heading near top.
          var visible = entries
            .filter(function (e) {
              return e.isIntersecting;
            })
            .sort(function (a, b) {
              return b.intersectionRatio - a.intersectionRatio;
            });
          if (!visible.length) return;
          var id = visible[0].target.id;
          var link = linksById[id];
          if (!link) return;
          clearActive();
          link.classList.add("is-active");
        },
        { rootMargin: "0px 0px -70% 0px", threshold: [0.1, 0.25, 0.5, 0.75, 1.0] }
      );

      headings.forEach(function (h) {
        observer.observe(h);
      });
    } else {
      // Fallback: highlight on hash change.
      window.addEventListener("hashchange", function () {
        var id = (location.hash || "").replace(/^#/, "");
        if (!id) return;
        var link = linksById[id];
        if (!link) return;
        clearActive();
        link.classList.add("is-active");
      });
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function normalizeQuery(q) {
    return (q || "").trim().toLowerCase();
  }

  function initSearch() {
    var input = $("#bg-search-input");
    var results = $("#bg-search-results");
    if (!input || !results) return;

    var index = null;
    var indexPromise = null;

    function fetchIndex() {
      if (index) return Promise.resolve(index);
      if (indexPromise) return indexPromise;

      // Use Liquid-provided relative_url via data attribute (works for project pages baseurl).
      var sidebar = $(".bg-sidebar");
      var baseUrl = (sidebar && sidebar.getAttribute("data-search-index-url")) || "/search.json";
      var url = baseUrl + "?v=" + Date.now();
      indexPromise = fetch(url, { cache: "no-store" })
        .then(function (r) {
          if (!r.ok) throw new Error("fetch search index failed");
          return r.json();
        })
        .then(function (data) {
          index = Array.isArray(data) ? data : [];
          return index;
        })
        .catch(function () {
          index = [];
          return index;
        });
      return indexPromise;
    }

    function render(items, q) {
      if (!q) {
        results.innerHTML = "";
        return;
      }
      if (!items.length) {
        results.innerHTML = "<div style='color: rgba(0,0,0,.6)'>没有找到相关内容</div>";
        return;
      }
      var html = items
        .slice(0, 20)
        .map(function (it) {
          var title = escapeHtml(it.title || it.url || "");
          var url = escapeHtml(it.url || "#");
          var content = String(it.content || "");
          var pos = content.toLowerCase().indexOf(q);
          var snippet = "";
          if (pos >= 0) {
            var start = Math.max(0, pos - 60);
            snippet = content.slice(start, start + 160).replace(/\s+/g, " ").trim();
          } else {
            snippet = content.slice(0, 160).replace(/\s+/g, " ").trim();
          }
          snippet = escapeHtml(snippet);
          return (
            "<div class='bg-search-results__item'>" +
            "<a class='bg-search-results__title' href='" +
            url +
            "'>" +
            title +
            "</a>" +
            "<div class='bg-search-results__snippet'>" +
            snippet +
            "</div>" +
            "</div>"
          );
        })
        .join("");
      results.innerHTML = html;
    }

    var timer = null;
    input.addEventListener("input", function () {
      var q = normalizeQuery(input.value);
      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        if (!q) {
          render([], "");
          return;
        }
        fetchIndex().then(function (idx) {
          var filtered = idx.filter(function (it) {
            var title = String(it.title || "").toLowerCase();
            var content = String(it.content || "").toLowerCase();
            return title.indexOf(q) >= 0 || content.indexOf(q) >= 0;
          });
          render(filtered, q);
        });
      }, 120);
    });

    // Prefetch index after first interaction to keep initial load fast.
    input.addEventListener(
      "focus",
      function () {
        fetchIndex();
      },
      { once: true }
    );
  }

  function initPagination() {
    var lists = $all("[data-bg-paginate='true']");
    if (!lists.length) return;

    lists.forEach(function (list) {
      var listId = list.id;
      if (!listId) return;
      var pageSizeAttr = list.getAttribute("data-bg-page-size");
      var pageSize = parseInt(pageSizeAttr || "10", 10);
      if (!(pageSize > 0)) pageSize = 10;

      var items = $all("li", list);
      if (items.length <= pageSize) return;

      var pager = $("[data-bg-pagination-for='" + listId + "']");
      if (!pager) return;

      var current = 1;
      var total = Math.ceil(items.length / pageSize);

      function renderPage() {
        var start = (current - 1) * pageSize;
        var end = start + pageSize;
        items.forEach(function (el, idx) {
          el.style.display = idx >= start && idx < end ? "" : "none";
        });

        pager.innerHTML = "";
        var prev = document.createElement("button");
        prev.textContent = "← 上一页";
        prev.disabled = current <= 1;
        prev.addEventListener("click", function () {
          if (current > 1) {
            current -= 1;
            renderPage();
          }
        });

        var info = document.createElement("span");
        info.textContent = "第 " + current + " 页，共 " + total + " 页";

        var next = document.createElement("button");
        next.textContent = "下一页 →";
        next.disabled = current >= total;
        next.addEventListener("click", function () {
          if (current < total) {
            current += 1;
            renderPage();
          }
        });

        pager.appendChild(prev);
        pager.appendChild(info);
        pager.appendChild(next);
      }

      renderPage();
    });
  }

  // ── Drag-to-resize sidebars ──────────────────────────────────────────────
  function initResize() {
    var MIN_W = 160;
    var MAX_W = 520;

    var root = document.documentElement;
    var sidebarEl = document.querySelector(".bg-sidebar");
    var tocEl     = document.querySelector(".bg-sidebar-toc");
    var sidebarHandle = document.getElementById("bg-sidebar-resize");
    var tocHandle     = document.getElementById("bg-toc-resize");

    // Restore saved widths
    var savedSidebar = parseInt(localStorage.getItem("bg-sidebar-width"), 10);
    var savedToc     = parseInt(localStorage.getItem("bg-toc-width"), 10);
    if (savedSidebar && savedSidebar >= MIN_W && savedSidebar <= MAX_W) {
      root.style.setProperty("--bg-sidebar-width", savedSidebar + "px");
    }
    if (savedToc && savedToc >= MIN_W && savedToc <= MAX_W) {
      root.style.setProperty("--bg-toc-width", savedToc + "px");
    }

    // Helper: clamp and apply sidebar width
    function applySidebarWidth(w) {
      w = Math.min(MAX_W, Math.max(MIN_W, w));
      root.style.setProperty("--bg-sidebar-width", w + "px");
      return w;
    }

    // Helper: clamp and apply TOC width
    function applyTocWidth(w) {
      w = Math.min(MAX_W, Math.max(MIN_W, w));
      root.style.setProperty("--bg-toc-width", w + "px");
      return w;
    }

    // Left sidebar handle
    if (sidebarHandle) {
      sidebarHandle.addEventListener("mousedown", function (e) {
        e.preventDefault();
        sidebarHandle.classList.add("is-dragging");
        // Disable transition during drag for instant response
        if (sidebarEl) sidebarEl.style.transition = "none";
        var startX   = e.clientX;
        var startW   = sidebarEl ? sidebarEl.offsetWidth : 260;

        function onMove(ev) {
          var newW = startW + (ev.clientX - startX);
          applySidebarWidth(newW);
        }
        function onUp() {
          sidebarHandle.classList.remove("is-dragging");
          // Re-enable transition after drag ends
          if (sidebarEl) sidebarEl.style.transition = "";
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          var finalW = parseInt(getComputedStyle(root).getPropertyValue("--bg-sidebar-width"), 10);
          localStorage.setItem("bg-sidebar-width", finalW);
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    }

    // Right TOC handle
    if (tocHandle) {
      tocHandle.addEventListener("mousedown", function (e) {
        e.preventDefault();
        tocHandle.classList.add("is-dragging");
        // Disable transition during drag for instant response
        if (tocEl) tocEl.style.transition = "none";
        var startX   = e.clientX;
        var startW   = tocEl ? tocEl.offsetWidth : 230;

        function onMove(ev) {
          // Moving handle left → wider TOC
          var newW = startW + (startX - ev.clientX);
          applyTocWidth(newW);
        }
        function onUp() {
          tocHandle.classList.remove("is-dragging");
          // Re-enable transition after drag ends
          if (tocEl) tocEl.style.transition = "";
          document.removeEventListener("mousemove", onMove);
          document.removeEventListener("mouseup", onUp);
          var finalW = parseInt(getComputedStyle(root).getPropertyValue("--bg-toc-width"), 10);
          localStorage.setItem("bg-toc-width", finalW);
        }
        document.addEventListener("mousemove", onMove);
        document.addEventListener("mouseup", onUp);
      });
    }

    // Prevent text selection while dragging
    document.addEventListener("mousedown", function (e) {
      if (e.target === sidebarHandle || e.target === tocHandle) {
        document.body.style.userSelect = "none";
      }
    });
    document.addEventListener("mouseup", function () {
      document.body.style.userSelect = "";
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initSidebarCollapse();
    initPanelCollapse();
    initNavGroupCollapse();
    buildToc();
    initSearch();
    initPagination();
    initResize();
  });
})();

