/* home.js - FitZone HOME PAGE ONLY (load with defer, after script.js).
   The mobile menu, footer year and forms stay in script.js. */
(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (id) { return document.getElementById(id); };
  document.documentElement.classList.add("home-js");

  /* 1. Hero stats count up once */
  if (!reduce) {
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var end = +el.dataset.count, suffix = el.dataset.suffix || "", start = performance.now(), dur = 1300;
      el.textContent = "0" + suffix;
      (function step(now) {
        var p = Math.min(1, (now - start) / dur);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
        if (p < 1) requestAnimationFrame(step);
      })(start);
    });
  }

  /* 2. Reveal sections as they scroll into view */
  var items = document.querySelectorAll(".home-reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  } else {
    items.forEach(function (el) { el.classList.add("in"); });
  }

  /* 3. Daily quest demo: goal -> tasks -> XP -> level */
  var GOALS = {
    strength:  [["Warm-up: 5 min mobility", 10], ["Push-ups, 3 sets", 15], ["Bodyweight squats, 3 x 12", 25]],
    endurance: [["Brisk walk, 5 min", 10], ["Easy intervals, 4 x 1 min", 25], ["Cool-down stretch", 15]],
    mobility:  [["Shoulder and neck rolls", 10], ["Hip opener flow", 15], ["Hamstring stretch holds", 25]]
  };
  var goal = "strength", banked = 0, lastLevel = 1;
  var list = $("home-tasks");

  function render() {
    list.innerHTML = "";
    GOALS[goal].forEach(function (t, i) {
      var li = document.createElement("li"), label = document.createElement("label");
      var box = document.createElement("input"), name = document.createElement("span"), xp = document.createElement("span");
      box.type = "checkbox"; box.dataset.xp = t[1]; box.id = "home-task-" + i;
      name.className = "home-task-name"; name.textContent = t[0];
      xp.className = "home-task-xp"; xp.textContent = "+" + t[1] + " XP";
      box.addEventListener("change", update);
      label.appendChild(box); label.appendChild(name); label.appendChild(xp);
      li.appendChild(label); list.appendChild(li);
    });
    update();
  }

  function update() {
    var boxes = list.querySelectorAll("input"), done = 0, doneCount = 0, total = 0;
    boxes.forEach(function (b) { total += +b.dataset.xp; if (b.checked) { done += +b.dataset.xp; doneCount++; } });
    var pct = Math.round(done / total * 100), all = banked + done, level = Math.floor(all / 100) + 1;

    $("home-ring").style.setProperty("--p", pct);
    $("home-pct").textContent = pct + "%";
    $("home-xp-text").textContent = (all % 100) + " / 100";
    $("home-xp-fill").style.width = (all % 100) + "%";
    $("home-level").textContent = "LV " + level;

    var msg = $("home-msg");
    if (level > lastLevel) {
      msg.textContent = "Level up! You reached level " + level + ".";
      var chip = $("home-level"); chip.classList.remove("up"); void chip.offsetWidth; chip.classList.add("up");
    } else if (pct === 100) {
      msg.textContent = "Quest complete. +" + done + " XP earned. Try another goal.";
    } else if (doneCount === 0) {
      msg.textContent = "Pick tasks to start your session.";
    } else {
      msg.textContent = (boxes.length - doneCount) + " of " + boxes.length + " tasks left. Keep going.";
    }
    lastLevel = level;
  }

  document.querySelectorAll(".home-goal").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.dataset.goal === goal) return;
      list.querySelectorAll("input:checked").forEach(function (b) { banked += +b.dataset.xp; });
      goal = btn.dataset.goal;
      document.querySelectorAll(".home-goal").forEach(function (b) { b.setAttribute("aria-pressed", String(b === btn)); });
      render();
    });
  });
  $("home-reset").addEventListener("click", function () { banked = 0; lastLevel = 1; render(); });
  render();
})();
