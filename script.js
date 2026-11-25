// תפריט במובייל
document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.querySelector(".menu-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  // פס המלצות נע: משכפלים את ההמלצות כדי שהתנועה תהיה רציפה בלי קפיצה
  document.querySelectorAll(".marquee-track").forEach(function (track) {
    var items = Array.prototype.slice.call(track.children);
    items.forEach(function (item) {
      var copy = item.cloneNode(true);
      copy.setAttribute("aria-hidden", "true");
      track.appendChild(copy);
    });
    // מהירות קבועה בלי קשר למספר ההמלצות (כ־40 פיקסלים לשנייה)
    track.style.setProperty("--marquee-duration", (track.scrollWidth / 2 / 40) + "s");
  });

  // צפייה בתעודות בחלון מעל הדף
  var certLinks = document.querySelectorAll(".cert-link");
  if (certLinks.length) {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.setAttribute("role", "dialog");
    box.setAttribute("aria-modal", "true");
    box.innerHTML = '<button class="lightbox-close" aria-label="סגירה">×</button>' +
      '<button class="lightbox-nav prev" aria-label="הקודמת">›</button>' +
      '<figure><img alt=""><figcaption></figcaption></figure>' +
      '<button class="lightbox-nav next" aria-label="הבאה">‹</button>';
    document.body.appendChild(box);
    var boxImg = box.querySelector("img");
    var boxCap = box.querySelector("figcaption");
    var items = [], index = 0;
    var show = function (i) {
      index = (i + items.length) % items.length;
      boxImg.src = items[index].src;
      boxImg.alt = items[index].caption;
      boxCap.textContent = items[index].caption + (items.length > 1 ? "  (" + (index + 1) + "/" + items.length + ")" : "");
    };
    var close = function () { box.classList.remove("open"); };
    box.addEventListener("click", function (e) {
      if (e.target === box || e.target.classList.contains("lightbox-close")) close();
      else if (e.target.classList.contains("prev")) show(index - 1);
      else if (e.target.classList.contains("next")) show(index + 1);
    });
    document.addEventListener("keydown", function (e) {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") close();
      // האתר מימין לשמאל: חץ שמאלה = הבאה
      if (e.key === "ArrowLeft") show(index + 1);
      if (e.key === "ArrowRight") show(index - 1);
    });
    certLinks.forEach(function (a) {
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var srcs = (a.dataset.gallery || a.getAttribute("href")).split("|");
        var caps = (a.dataset.captions || a.dataset.caption || "").split("|");
        items = srcs.map(function (s, i) { return { src: s, caption: caps[i] || "" }; });
        box.classList.toggle("multi", items.length > 1);
        show(0);
        box.classList.add("open");
      });
    });
  }

  // שנה בתחתית
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});

// מצגת תמונות מתחלפת (קבוצות): בכל דף שיש בו .slideshow
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".slideshow").forEach(function (show) {
    var slides = show.querySelectorAll(".slide"), dots = show.querySelector(".slide-dots"), i = 0, t;
    if (!slides.length) return;
    slides.forEach(function (sl, k) {
      var img = sl.querySelector("img"); if (img) img.loading = "eager";
      if (!dots) return;
      var b = document.createElement("button"); b.type = "button"; b.setAttribute("aria-label", "תמונה " + (k + 1));
      b.addEventListener("click", function () { go(k); restart(); }); dots.appendChild(b);
    });
    function go(k) {
      slides[i].classList.remove("active"); if (dots) dots.children[i].classList.remove("on");
      i = (k + slides.length) % slides.length;
      slides[i].classList.add("active"); if (dots) dots.children[i].classList.add("on");
    }
    var paused = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    function restart() { clearInterval(t); if (!paused) t = setInterval(function () { go(i + 1); }, 4000); }
    var pb = document.createElement("button"); pb.type = "button"; pb.className = "motion-toggle";
    function label() { pb.textContent = paused ? "▶ הפעלה" : "❚❚ עצירה"; pb.setAttribute("aria-label", paused ? "הפעלת החלפת התמונות" : "עצירת החלפת התמונות"); }
    pb.addEventListener("click", function () { paused = !paused; label(); restart(); });
    show.appendChild(pb); label();
    go(0); restart();
  });
});

// נגישות: כפתור עצירה לפסים הנעים, ומקלדת לריבועים שנפתחים בלחיצה
document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".marquee").forEach(function (mq) {
    var wrap = document.createElement("div"); wrap.className = "marquee-wrap";
    mq.parentNode.insertBefore(wrap, mq); wrap.appendChild(mq);
    var b = document.createElement("button"); b.type = "button"; b.className = "motion-toggle";
    function label() { var p = mq.classList.contains("is-paused"); b.textContent = p ? "▶ הפעלה" : "❚❚ עצירה"; b.setAttribute("aria-label", p ? "הפעלת התנועה" : "עצירת התנועה"); }
    b.addEventListener("click", function () { mq.classList.toggle("is-paused"); label(); });
    wrap.appendChild(b); label();
  });
  setTimeout(function () {
    document.querySelectorAll(".approach-grid > div, .text-card, .sub-topic, .hero-quotes .quote:not([aria-hidden])").forEach(function (el) {
      el.setAttribute("tabindex", "0"); el.setAttribute("role", "button");
      el.addEventListener("keydown", function (e) {
        if (e.target !== el) return;
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); }
      });
    });
  }, 0);
});
