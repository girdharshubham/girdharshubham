(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("js");

  /* ---------- Theme toggle: Paper (default) / dark ---------- */
  var toggle = document.querySelector(".theme-toggle");
  function setTheme(theme) {
    if (theme === "dark") root.setAttribute("data-theme", "dark");
    else root.removeAttribute("data-theme");
    toggle.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    try { localStorage.setItem("theme", theme); } catch (e) {}
  }
  function currentTheme() { return root.getAttribute("data-theme") === "dark" ? "dark" : "light"; }
  toggle.addEventListener("click", function () { setTheme(currentTheme() === "dark" ? "light" : "dark"); });
  if (currentTheme() === "dark") toggle.setAttribute("aria-label", "Switch to light theme");

  /* ---------- Header border once scrolled ---------- */
  var header = document.querySelector(".site-header");
  function onScroll() { header.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Active nav link + reveal on scroll ---------- */
  if ("IntersectionObserver" in window) {
    var links = {};
    document.querySelectorAll(".nav a[data-section]").forEach(function (a) {
      links[a.dataset.section] = a;
    });

    var navObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (link && entry.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach(function (s) { navObserver.observe(s); });

    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".card, .role, .oss-item, .post-list li, .stats, .contact-form").forEach(function (el) {
      el.classList.add("reveal");
      revealObserver.observe(el);
    });
  }

  /* ---------- Hero card: profile.yaml / profile.schema.yaml ---------- */
  var manifest = document.querySelector(".manifest[data-view]");
  if (manifest) {
    var tabs = manifest.querySelectorAll("[role='tab']");

    var show = function (view, focus) {
      manifest.dataset.view = view;
      tabs.forEach(function (tab) {
        var on = tab.dataset.view === view;
        tab.setAttribute("aria-selected", on);
        tab.tabIndex = on ? 0 : -1;
        if (on && focus) tab.focus();
      });
    };
    var flip = function (focus) { show(manifest.dataset.view === "profile" ? "schema" : "profile", focus); };

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { show(tab.dataset.view); });
      tab.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); flip(true); }
      });
    });

    // Clicking the code itself flips files, unless the visitor is selecting text to copy.
    manifest.querySelector(".manifest-panels").addEventListener("click", function () {
      var sel = window.getSelection();
      if (sel && !sel.isCollapsed) return;
      flip(false);
    });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Uptime since first job (footer + terminal) ---------- */
  var uptimeEl = document.querySelector(".uptime");
  var since = uptimeEl && uptimeEl.dataset.since; // "YYYY-MM"
  function two(n) { return (n < 10 ? "0" : "") + n; }
  function uptime() {
    var p = since.split("-"), s = new Date(+p[0], +p[1] - 1, 1), n = new Date();
    var y = n.getFullYear() - s.getFullYear(), m = n.getMonth() - s.getMonth(), d = n.getDate() - s.getDate();
    if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); }
    if (m < 0) { y--; m += 12; }
    return y + "y " + m + "m " + d + "d " + two(n.getHours()) + ":" + two(n.getMinutes()) + ":" + two(n.getSeconds());
  }
  if (since) {
    var tick = function () { uptimeEl.textContent = "up " + uptime(); };
    tick();
    setInterval(tick, 1000);
  }

  /* ---------- Stats count up the first time they scroll into view ---------- */
  var stats = document.querySelector(".stats");
  if (stats && !reduceMotion && "IntersectionObserver" in window) {
    var statObserver = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      statObserver.disconnect();
      stats.querySelectorAll("dd").forEach(function (dd) {
        var m = dd.textContent.match(/^(\d+)(.*)$/);
        if (!m) return;
        var target = +m[1], suffix = m[2], start = null;
        var step = function (t) {
          if (start === null) start = t;
          var k = Math.min((t - start) / 900, 1), eased = 1 - Math.pow(1 - k, 3);
          dd.textContent = Math.round(target * eased) + suffix;
          if (k < 1) requestAnimationFrame(step);
        };
        dd.textContent = "0" + suffix;
        requestAnimationFrame(step);
      });
    }, { threshold: 0.6 });
    statObserver.observe(stats);
  }

  /* ---------- Hello, fellow DevTools opener ---------- */
  if (window.console && console.log) {
    console.log(
      "%c$ kubectl describe engineer shubham-girdhar%c\n\n" +
      "You opened DevTools on a portfolio. We'd get along.\n" +
      "Built with Hugo and a little vanilla JS: no frameworks, no trackers.\n" +
      "Press ` on the page for a terminal, or try: sudo hire-me",
      "font: 600 13px monospace; color: #3fb950;", "font: 12px monospace;"
    );
  }

  /* ---------- Hidden terminal: press ` (or the footer hint) ---------- */
  var term = document.querySelector(".term");
  var termData = document.getElementById("term-data");
  if (term && termData) {
    var D = JSON.parse(termData.textContent);
    var out = term.querySelector(".term-out");
    var input = term.querySelector(".term-input");
    var history = [], hIndex = 0, greeted = false, lastFocus = null;

    var esc = function (s) {
      return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
    };
    var pad = function (s, n) { s = String(s); while (s.length < n) s += " "; return s; };
    var link = function (href, text) { return '<a href="' + esc(href) + '"' + (/^https?:/.test(href) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(text) + "</a>"; };
    var print = function (html, cls) {
      var line = document.createElement("div");
      if (cls) line.className = cls;
      line.innerHTML = html;
      out.appendChild(line);
      out.scrollTop = out.scrollHeight;
    };
    var table = function (header, rows) {
      var widths = header.map(function (h, i) {
        return Math.max.apply(null, [h.length].concat(rows.map(function (r) { return String(r[i]).length; }))) + 3;
      });
      var fmt = function (r) { return r.map(function (c, i) { return i === r.length - 1 ? c : pad(c, widths[i]); }).join(""); };
      return '<span class="dim">' + esc(fmt(header)) + "</span>\n" + rows.map(function (r) { return esc(fmt(r)); }).join("\n");
    };
    var goContact = function () {
      var contact = document.getElementById("contact");
      if (!contact) { location.href = D.home + "#contact"; return; }
      close();
      contact.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      var name = document.getElementById("name");
      if (name) setTimeout(function () { name.focus({ preventScroll: true }); }, reduceMotion ? 0 : 500);
    };
    var manifestYaml = function () {
      var m = D.manifest || {};
      return [
        "apiVersion: people.dev/v1", "kind: Engineer", "metadata:", "  name: " + D.slug, "spec:",
        "  role: " + (m.role || D.role), "  experience: " + m.experience,
        "  clouds: [" + (m.clouds || []).join(", ") + "]", "  focus:"
      ].concat((m.focus || []).map(function (f) { return "    - " + f; })).concat([
        "  languages: [" + (m.languages || []).join(", ") + "]", "status:",
        "  phase: " + (D.openToWork ? "OpenToWork" : "Running")
      ]).map(esc).join("\n");
    };
    var hash = function (s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0; return h.toString(16).slice(0, 7); };

    var commands = {
      help: function () {
        return table(["COMMAND", "DESCRIPTION"], [
          ["whoami", "who runs this place"],
          ["ls", "what's here"],
          ["cat profile.yaml", "the manifest"],
          ["kubectl get jobs", "work history (k works too)"],
          ["kubectl get pods", "what's running right now"],
          ["git log", "open-source contributions"],
          ["blog", "recent posts"],
          ["uptime", "time since my first job in tech"],
          ["theme dark|light", "switch the site theme"],
          ["contact", "open the contact form"],
          ["book", "pick a time for a call"],
          ["clear, exit", ""]
        ]) + '\n\n<span class="dim">There may be a few undocumented ones.</span>';
      },
      whoami: function () {
        return "<strong>" + esc(D.name) + "</strong>, " + esc(D.role) + ", " + esc(D.location) + "\n" + esc(D.tagline || "") +
          (D.openToWork ? '\n<span class="ok">Open to new roles.</span> Type <span class="cmd">contact</span> to say hi.' : "");
      },
      ls: function (args) {
        if (args[0] && args[0].replace(/\/$/, "") === "blog") return commands.blog();
        if (args[0] && args[0].replace(/\/$/, "") === "experience") return commands.kubectl(["get", "jobs"]);
        return 'profile.yaml  <span class="ok">experience/</span>  <span class="ok">open-source/</span>  <span class="ok">blog/</span>  contact';
      },
      cat: function (args) {
        if (args[0] === "profile.yaml") return manifestYaml();
        if (args[0] === "contact") { goContact(); return "Opening the contact form..."; }
        return '<span class="err">cat: ' + esc(args[0] || "") + ": No such file or directory</span>";
      },
      kubectl: function (args) {
        var verb = args[0], what = (args[1] || "").replace(/s$/, "");
        if (verb === "get" && (what === "job" || what === "experience" || what === "role")) {
          return table(["COMPANY", "ROLE", "DURATION"], D.jobs.map(function (j) { return [j.company, j.title, j.dates]; }));
        }
        if (verb === "get" && (what === "pod" || what === "po")) {
          return table(["NAME", "READY", "STATUS", "RESTARTS"], D.focus.map(function (f) {
            return [f.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), "1/1", "Running", "0"];
          }));
        }
        if (verb === "describe") return commands.whoami();
        if (verb === "logs") return commands.blog();
        if (verb === "delete") return '<span class="err">Error from server (Forbidden): visitors cannot delete resources. Nice try.</span>';
        return 'Usage: kubectl get jobs | kubectl get pods | kubectl describe engineer';
      },
      git: function (args) {
        if (args[0] !== "log") return "Usage: git log";
        return D.oss.map(function (o) { return '<span class="warn">' + hash(o.repo) + "</span> " + link(o.link, o.repo); }).join("\n");
      },
      blog: function () {
        if (!D.posts.length) return '<span class="dim">No posts yet. Check back soon.</span>';
        return D.posts.map(function (p) { return '<span class="dim">' + esc(p.date) + "</span>  " + link(p.url, p.title); }).join("\n");
      },
      uptime: function () { return since ? "up " + esc(uptime()) + ", load average: curious, ambitious, caffeinated" : "up"; },
      theme: function (args) {
        var t = args[0] === "light" ? "light" : args[0] === "dark" ? "dark" : (currentTheme() === "dark" ? "light" : "dark");
        setTheme(t);
        return "theme." + t + " configured";
      },
      contact: function () { goContact(); return "Opening the contact form..."; },
      book: function () {
        var url = D.links && D.links.booking;
        if (!url) return '<span class="dim">No booking link yet. Try </span><span class="cmd">contact</span>';
        window.open(url, "_blank", "noopener");
        return "Opening my calendar in a new tab... " + link(url, "(or click here)");
      },
      sudo: function (args) {
        if (args.join(" ") === "hire-me") {
          setTimeout(goContact, 1200);
          return '[sudo] password for recruiter: ********\n<span class="ok">Access granted.</span> Opening the contact form...';
        }
        return '<span class="err">guest is not in the sudoers file. This incident will be reported.</span>';
      },
      rm: function () { return '<span class="err">rm: permission denied. This site is immutable infrastructure.</span>'; },
      vim: function () { return "Opening vim... just kidding. You can leave with <span class=\"cmd\">exit</span>, which is more than vim offers."; },
      ping: function () { return "PONG: 1 packet transmitted, 1 received, 0% packet loss"; },
      pwd: function () { return "/home/guest"; },
      hostname: function () { return esc(D.host); },
      date: function () { return esc(new Date().toString()); },
      echo: function (args) { return esc(args.join(" ")); },
      clear: function () { out.innerHTML = ""; return null; },
      exit: function () { close(); return null; }
    };
    commands.k = commands.kubectl;
    commands.vi = commands.emacs = commands.nano = commands.vim;

    var run = function (line) {
      print('<span class="term-prompt">guest@sg:~$</span> <span class="cmd">' + esc(line) + "</span>");
      var parts = line.trim().split(/\s+/), name = parts.shift();
      if (!name) return;
      var fn = Object.prototype.hasOwnProperty.call(commands, name) ? commands[name] : null;
      var result = fn ? fn(parts) : '<span class="err">command not found: ' + esc(name) + '</span>. Try <span class="cmd">help</span>.';
      if (result) print(result);
    };

    var open = function () {
      lastFocus = document.activeElement;
      term.hidden = false;
      if (!greeted) {
        greeted = true;
        print('<span class="dim">Hey there, welcome in!</span>');
        run("help");
      }
      input.focus();
    };
    var close = function () {
      term.hidden = true;
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };

    term.querySelector(".term-line").addEventListener("submit", function (e) {
      e.preventDefault();
      var line = input.value;
      input.value = "";
      if (line.trim()) { history.push(line); hIndex = history.length; }
      run(line);
    });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowUp" && hIndex > 0) { e.preventDefault(); input.value = history[--hIndex]; }
      else if (e.key === "ArrowDown") { e.preventDefault(); hIndex = Math.min(hIndex + 1, history.length); input.value = history[hIndex] || ""; }
      else if (e.key === "Tab") {
        e.preventDefault();
        var matches = Object.keys(commands).filter(function (c) { return c.indexOf(input.value) === 0; });
        if (matches.length === 1) input.value = matches[0] + " ";
        else if (matches.length > 1 && input.value) print('<span class="dim">' + esc(matches.join("  ")) + "</span>");
      }
      else if (e.key === "l" && e.ctrlKey) { e.preventDefault(); out.innerHTML = ""; }
    });
    term.querySelector(".term-close").addEventListener("click", close);
    out.addEventListener("click", function () { if (window.getSelection().isCollapsed) input.focus(); });

    var hint = document.querySelector(".term-hint");
    if (hint) hint.addEventListener("click", open);

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !term.hidden) { close(); return; }
      if (e.key !== "`" || e.ctrlKey || e.metaKey || e.altKey) return;
      var t = e.target, typing = t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName);
      if (typing && t !== input) return;
      e.preventDefault();
      if (term.hidden) open(); else close();
    });
  }

  /* ---------- Contact form (Web3Forms) ---------- */
  var form = document.querySelector(".contact-form");
  if (!form) return;
  var status = form.querySelector(".form-status");
  var button = form.querySelector(".btn-submit");
  var label = button.querySelector(".btn-label");

  function setStatus(text, kind) {
    status.textContent = text;
    status.className = "form-status" + (kind ? " " + kind : "");
  }

  function validate() {
    var ok = true;
    form.querySelectorAll("[required]").forEach(function (input) {
      var valid = input.checkValidity() && input.value.trim() !== "";
      input.closest(".field").classList.toggle("invalid", !valid);
      if (!valid && ok) { input.focus(); ok = false; }
    });
    return ok;
  }

  form.addEventListener("input", function (e) {
    var field = e.target.closest(".field");
    if (field && field.classList.contains("invalid") && e.target.checkValidity()) {
      field.classList.remove("invalid");
    }
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!validate()) {
      setStatus("Please fill in your name, a valid email and a message.", "err");
      return;
    }

    var data = Object.fromEntries(new FormData(form));
    if (!data.access_key || data.access_key.indexOf("YOUR_") === 0) {
      setStatus("The contact form isn\u2019t configured yet. Add a Web3Forms access key.", "err");
      return;
    }
    if (data.botcheck) return; // honeypot ticked: silently drop
    if (form.querySelector(".h-captcha") && !data["h-captcha-response"]) {
      setStatus("Please tick the \u201cI am human\u201d box first.", "err");
      return;
    }
    delete data.botcheck;
    data.replyto = data.email; // so hitting "Reply" in Proton answers the sender

    button.disabled = true;
    label.textContent = "Sending...";
    setStatus("", "");

    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        return res.json().then(function (json) { return { ok: res.ok && json.success, json: json }; });
      })
      .then(function (r) {
        if (r.ok) {
          form.reset();
          setStatus("Thanks! Your message is on its way. I\u2019ll reply soon.", "ok");
        } else {
          setStatus((r.json && r.json.message) || "Something went wrong. Please try again.", "err");
        }
      })
      .catch(function () {
        setStatus("Network error. Please try again in a moment.", "err");
      })
      .finally(function () {
        if (window.hcaptcha) { try { window.hcaptcha.reset(); } catch (e) {} } // a token works only once
        button.disabled = false;
        label.textContent = "Send message";
      });
  });
})();
