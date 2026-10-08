// Shared header/footer and renderers for the data-driven sections.
// Content lives in data/*.js; you shouldn't need to edit this file to update the site.
(function () {
  const T = window.TIMES || {};
  const S = T.site || {};

  const NAV = [
    ["index.html", "Home"],
    ["research.html", "Research"],
    ["people.html", "People"],
    ["meetings.html", "Meetings"],
    ["papers.html", "Papers"],
    ["software.html", "Software"],
  ];

  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const tbc = (v) => (v ? esc(v) : '<span class="tbc">TBC</span>');
  const $ = (sel) => document.querySelector(sel);

  // ---------- Theme ----------
  try {
    const saved = localStorage.getItem("times-theme");
    if (saved) document.documentElement.dataset.theme = saved;
  } catch (e) {}

  function toggleTheme() {
    const root = document.documentElement;
    const isDark = root.dataset.theme
      ? root.dataset.theme === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.dataset.theme = isDark ? "light" : "dark";
    try { localStorage.setItem("times-theme", root.dataset.theme); } catch (e) {}
  }

  // ---------- Header / footer ----------
  function header() {
    const here = location.pathname.split("/").pop() || "index.html";
    const m = S.meeting || {};
    const links = NAV.map(([href, label]) =>
      `<a href="${href}"${href === here ? ' aria-current="page"' : ""}>${label}</a>`).join("");
    return `
      <a class="skip" href="#main">Skip to content</a>
      <div class="dateline"><div class="wrap">
        <span>${esc(S.longName || "")}</span>
        <span>${esc(m.day || "")} ${esc(m.time || "")} · ${esc(m.location || "")}</span>
      </div></div>
      <header class="masthead"><div class="wrap">
        <a class="brand" href="index.html" aria-label="THE TIMES home"><span class="brand-mark">THE TIMES</span></a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
        <nav class="nav" id="site-nav">${links}</nav>
      </div></header>`;
  }

  function footer() {
    return `
      <footer class="site"><div class="wrap">
        <div>
          <div class="brand-mark">THE TIMES</div>
          <div>${esc(S.longName || "")}</div>
          <div>${esc(S.institution || "")}</div>
        </div>
        <div style="display:grid;gap:8px;justify-items:start">
          <span>Organised by Nikhil Sarin &amp; James Alvey</span>
          ${S.github ? `<a href="${esc(S.github)}">Edit this site on GitHub</a>` : ""}
          <button class="theme-toggle" type="button">Toggle dark mode</button>
        </div>
      </div></footer>`;
  }

  // ---------- Shared bits ----------
  function initials(name) {
    return name.split(/\s+/).filter(Boolean).map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  }

  function avatar(p) {
    const ini = esc(initials(p.name));
    if (!p.photo) return `<div class="avatar initials" aria-hidden="true">${ini}</div>`;
    // If the image fails to load, swap in the initials tile.
    return `<img class="avatar" src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy"
      onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'avatar initials',textContent:'${ini}'}))">`;
  }

  function personLinks(p) {
    const out = [];
    if (p.website) out.push(`<a href="${esc(p.website)}">Website</a>`);
    if (p.github) out.push(`<a href="https://github.com/${esc(p.github)}">GitHub</a>`);
    if (p.arxiv) out.push(`<a href="${esc(p.arxiv)}">arXiv</a>`);
    if (p.email) out.push(`<a href="mailto:${esc(p.email)}">Email</a>`);
    return out.length ? `<div class="links">${out.join("")}</div>` : "";
  }

  const tagList = (xs) => (xs && xs.length ? `<ul class="tags">${xs.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "");

  const FORMATS = {
    talk: ["News + talk", "talk"],
    journal: ["Journal club", "journal"],
    roundtable: ["Round table", "roundtable"],
  };

  function parseDate(d) {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day);
  }
  const fmtDate = (d, opts) => parseDate(d).toLocaleDateString("en-GB", opts || { weekday: "short", day: "numeric", month: "short" });

  function nextMeeting() {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return (T.schedule || []).find((s) => parseDate(s.date) >= today);
  }

  // ---------- Renderers ----------
  const R = {};

  R.nextCard = (el) => {
    const m = S.meeting || {};
    const n = nextMeeting();
    const fmt = n && FORMATS[n.format];
    el.innerHTML = `
      <p class="kicker">Next meeting</p>
      <div class="when">${n ? esc(fmtDate(n.date, { weekday: "long", day: "numeric", month: "long" })) : esc(m.day)}</div>
      <dl>
        <dt>Time</dt><dd>${tbc(m.time)}</dd>
        <dt>Where</dt><dd>${tbc(m.location)}</dd>
        <dt>Format</dt><dd>${fmt ? esc(fmt[0]) : tbc("")}</dd>
        ${n && n.speaker ? `<dt>Speaker</dt><dd>${esc(n.speaker)}</dd>` : ""}
        ${n && n.title ? `<dt>Title</dt><dd>${esc(n.title)}</dd>` : ""}
      </dl>
      <p class="small" style="margin:14px 0 0"><a href="meetings.html">Full schedule and logistics →</a></p>`;
  };

  R.pis = (el) => {
    el.innerHTML = (T.pis || []).map((p) => `
      <article class="pi">
        ${avatar(p)}
        <div>
          <span class="badge">${esc(p.role || "PI")}</span>
          <h3>${esc(p.name)}</h3>
          ${p.title ? `<div class="muted small">${esc(p.title)}</div>` : ""}
          ${tagList(p.interests)}
          ${personLinks(p)}
        </div>
      </article>`).join("");
  };

  R.members = (el) => {
    const list = T.members || [];
    if (!list.length) {
      el.innerHTML = `<div class="empty">No members listed yet. To add yourself, copy the template at the top of
        <code>data/members.js</code> and open a pull request, or send your details to the organisers.</div>`;
      return;
    }
    el.innerHTML = `<div class="member-grid">${list.map((p) => `
      <article class="member">
        ${avatar(p)}
        <h3>${esc(p.name)}</h3>
        ${p.role ? `<div class="role">${esc(p.role)}</div>` : ""}
        ${tagList(p.interests)}
        ${personLinks(p)}
      </article>`).join("")}</div>`;
  };

  R.alumni = (el) => {
    const list = T.alumni || [];
    const section = el.closest("section");
    if (!list.length) { if (section) section.hidden = true; return; }
    el.innerHTML = `<ul class="tut-list">${list.map((p) => `
      <li><strong>${p.website ? `<a href="${esc(p.website)}">${esc(p.name)}</a>` : esc(p.name)}</strong>
      ${p.role ? ` · <span class="muted">${esc(p.role)}</span>` : ""}
      ${p.now ? `<p>Now: ${esc(p.now)}</p>` : ""}</li>`).join("")}</ul>`;
  };

  R.schedule = (el) => {
    const rows = T.schedule || [];
    const n = nextMeeting();
    const today = new Date(); today.setHours(0, 0, 0, 0);
    el.innerHTML = `
      <table class="schedule">
        <thead><tr><th>Date</th><th>Format</th><th>Speaker</th><th>Title</th></tr></thead>
        <tbody>${rows.map((r) => {
          const cls = r === n ? "next" : parseDate(r.date) < today ? "past" : "";
          const f = FORMATS[r.format];
          const links = (r.links || []).map(([l, u]) => ` <a class="mono" href="${esc(u)}">${esc(l)}</a>`).join("");
          return `<tr class="${cls}">
            <td>${esc(fmtDate(r.date))}</td>
            <td>${f ? `<span class="pill ${f[1]}">${esc(f[0])}</span>` : '<span class="pill">TBC</span>'}</td>
            <td data-label="Speaker">${tbc(r.speaker)}</td>
            <td data-label="Title">${tbc(r.title)}${links}</td>
          </tr>`;
        }).join("")}</tbody>
      </table>`;
  };

  R.facts = (el) => {
    const m = S.meeting || {};
    const sl = S.slack || {};
    el.innerHTML = `
      <div class="fact"><div class="label">When</div><div class="value">${esc(m.day)}<br>${esc(m.time)}</div></div>
      <div class="fact"><div class="label">Where</div><div class="value">${tbc(m.location)}</div>
        ${m.locationNote ? `<p>${esc(m.locationNote)}</p>` : ""}
        <p>${esc(S.institution || "")}</p></div>
      <div class="fact"><div class="label">Slack</div><div class="value">${sl.channel ? esc(sl.channel) : "IoA Slack"}</div>
        ${sl.note ? `<p>${esc(sl.note)}</p>` : ""}</div>`;
  };

  R.contacts = (el) => {
    el.innerHTML = `<ul class="contact-list">${(S.contacts || []).map((c) => `
      <li><strong>${esc(c.name)}</strong>
      ${c.email ? `<a class="mono" href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : '<span class="tbc">email TBC · message on Slack</span>'}</li>`).join("")}</ul>`;
  };

  R.papers = (el) => {
    const papers = (T.papers || []).slice().sort((a, b) => b.date.localeCompare(a.date));
    const names = (T.pis || []).concat(T.members || []).map((p) => {
      const parts = p.name.split(/\s+/);
      return parts[parts.length - 1];
    });
    const bold = (authors) => {
      let out = esc(authors);
      // Bold "X. Surname" / "X. Y. Surname" for group members.
      names.forEach((sur) => {
        const re = new RegExp(`((?:[A-Z][a-z]?\\.[-\\s]?)+\\s?${sur})(?=,|$| et al)`, "g");
        out = out.replace(re, "<b>$1</b>");
      });
      return out;
    };
    const tags = ["All", ...Array.from(new Set(papers.flatMap((p) => p.tags || [])))];
    let active = "All";
    let query = "";

    el.innerHTML = `
      <input class="search" type="search" placeholder="Search titles and authors" aria-label="Search papers">
      <div class="filters" role="group" aria-label="Filter by topic">
        ${tags.map((t) => `<button type="button" data-tag="${esc(t)}" aria-pressed="${t === "All"}">${esc(t)}</button>`).join("")}
      </div>
      <p class="muted small" data-count></p>
      <div data-list></div>`;

    const list = el.querySelector("[data-list]");
    const count = el.querySelector("[data-count]");

    function draw() {
      const q = query.toLowerCase();
      const shown = papers.filter((p) =>
        (active === "All" || (p.tags || []).includes(active)) &&
        (!q || (p.title + " " + p.authors).toLowerCase().includes(q)));
      count.textContent = `${shown.length} paper${shown.length === 1 ? "" : "s"}`;
      let year = "";
      list.innerHTML = shown.map((p) => {
        const y = p.date.slice(0, 4);
        const head = y !== year ? `<div class="paper-year">${(year = y)}</div>` : "";
        const url = `https://arxiv.org/abs/${esc(p.arxiv)}`;
        return `${head}<article class="paper${p.featured ? " featured" : ""}">
          ${p.featured ? '<span class="badge">Joint TIMES paper</span>' : ""}
          <a class="title" href="${url}">${esc(p.title)}</a>
          <div class="authors">${bold(p.authors)}</div>
          <div class="meta"><span>arXiv:${esc(p.arxiv)}</span><span>·</span>
            <span>${esc(parseDate(p.date + "-01").toLocaleDateString("en-GB", { month: "short", year: "numeric" }))}</span>
            ${(p.tags || []).map((t) => `<span class="tag ${esc(t)}">${esc(t)}</span>`).join("")}</div>
        </article>`;
      }).join("") || '<div class="empty">No papers match.</div>';
    }

    el.querySelector(".search").addEventListener("input", (e) => { query = e.target.value; draw(); });
    el.querySelectorAll(".filters button").forEach((b) => b.addEventListener("click", () => {
      active = b.dataset.tag;
      el.querySelectorAll(".filters button").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
      draw();
    }));
    draw();
  };

  R.recentPapers = (el) => {
    const papers = (T.papers || []).slice().sort((a, b) => b.date.localeCompare(a.date)).slice(0, 4);
    el.innerHTML = papers.map((p) => `
      <article class="paper">
        <a class="title" href="https://arxiv.org/abs/${esc(p.arxiv)}">${esc(p.title)}</a>
        <div class="authors">${esc(p.authors)}</div>
        <div class="meta"><span>arXiv:${esc(p.arxiv)}</span>${(p.tags || []).map((t) => `<span class="tag ${esc(t)}">${esc(t)}</span>`).join("")}</div>
      </article>`).join("");
  };

  R.software = (el) => {
    const label = { stable: "Stable", active: "Active development", soon: "Coming soon" };
    el.innerHTML = (T.software || []).map((s) => `
      <article class="sw${s.status === "soon" ? " soon" : ""}">
        <div>
          <div class="status ${esc(s.status)}">${esc(label[s.status] || "")}</div>
          <h3>${esc(s.name)}</h3>
          <div class="area">${esc(s.area || "")}</div>
        </div>
        ${s.logo ? `<img class="logo" src="${esc(s.logo)}" alt="">` : "<span></span>"}
        <p>${esc(s.description)}</p>
        ${s.links && s.links.length ? `<div class="links">${s.links.map(([l, u]) => `<a href="${esc(u)}">${esc(l)} ↗</a>`).join("")}</div>` : ""}
      </article>`).join("");
  };

  R.tutorials = (el) => {
    el.innerHTML = `<ul class="tut-list">${(T.tutorials || []).map((t) => `
      <li><a href="${esc(t.url)}">${esc(t.name)}</a><p>${esc(t.description)}</p></li>`).join("")}</ul>`;
  };

  // ---------- Boot ----------
  document.addEventListener("DOMContentLoaded", () => {
    const h = $("#site-header"); if (h) h.outerHTML = header();
    const f = $("#site-footer"); if (f) f.outerHTML = footer();

    const toggle = $(".nav-toggle");
    if (toggle) toggle.addEventListener("click", () => {
      const nav = $("#site-nav");
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    const tt = $(".theme-toggle"); if (tt) tt.addEventListener("click", toggleTheme);

    document.querySelectorAll("[data-render]").forEach((el) => {
      const fn = R[el.dataset.render];
      if (fn) fn(el);
    });
  });
})();
