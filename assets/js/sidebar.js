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

  function initSidebarCollapse() {
    var sidebar = $(".bg-sidebar");
    var btn = $("#bg-sidebar-toggle");
    if (!sidebar || !btn) return;

    var collapsed = loadState("bg_sidebar_collapsed", false);
    if (collapsed) {
      sidebar.classList.add("is-collapsed");
      setExpanded(btn, false);
    }

    btn.addEventListener("click", function () {
      sidebar.classList.toggle("is-collapsed");
      var isCollapsed = sidebar.classList.contains("is-collapsed");
      setExpanded(btn, !isCollapsed);
      saveState("bg_sidebar_collapsed", isCollapsed);
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

  document.addEventListener("DOMContentLoaded", function () {
    initSidebarCollapse();
    initPanelCollapse();
    buildToc();
    initSearch();
    initPagination();
  });
})();

