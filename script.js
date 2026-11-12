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
