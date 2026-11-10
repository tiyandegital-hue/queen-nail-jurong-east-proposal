/* Queen Nail — shared front-end behaviour.
   Business name is ONE swappable constant: change BUSINESS_NAME here and
   every [data-business-name] element on the site updates. */
"use strict";

var BUSINESS_NAME = "Queen Nail";
var BUSINESS_PHONE = "+65 9349 1257";
var BUSINESS_EMAIL = "suwei.poh@gmail.com";
var BUSINESS_ADDRESS = "348 Jurong East Ave 1, #01-1257, Singapore 600348";
var BUSINESS_HOURS = "Mon–Sun 9am–9pm";

document.addEventListener("DOMContentLoaded", function () {
  /* Business name constant -> every branded element. */
  document.querySelectorAll("[data-business-name]").forEach(function (el) {
    el.textContent = BUSINESS_NAME;
  });

  /* Copy-address button (Visit Us page). */
  var copyBtn = document.getElementById("copy-address");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var done = function () {
        copyBtn.textContent = "Address copied";
        setTimeout(function () { copyBtn.textContent = "Copy Address"; }, 2500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(BUSINESS_ADDRESS).then(done, done);
      } else {
        done();
      }
    });
  }

  /* Style filters (Gallery + Nail Art pages). */
  document.querySelectorAll("[data-filter-group]").forEach(function (group) {
    var buttons = group.querySelectorAll(".filter-btn");
    var scope = group.getAttribute("data-filter-group");
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        buttons.forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        var wanted = btn.getAttribute("data-filter");
        document.querySelectorAll('[data-filter-item="' + scope + '"]').forEach(function (card) {
          var cats = (card.getAttribute("data-category") || "").split(" ");
          card.hidden = wanted !== "all" && cats.indexOf(wanted) === -1;
        });
      });
    });
  });

  initBooking();
});

/* ---------- Booking (star page): live dates, slots, summary, demo confirmation ---------- */
function initBooking() {
  var form = document.getElementById("booking-form");
  if (!form) return;

  var dayRow = document.getElementById("day-row");
  var timeRow = document.getElementById("time-row");
  var summaryServices = document.getElementById("sum-services");
  var summaryDate = document.getElementById("sum-date");
  var summaryTime = document.getElementById("sum-time");
  var confirmBox = document.getElementById("booking-confirmation");
  var confirmText = document.getElementById("confirm-summary");

  var state = { services: [], dateLabel: "", dateValue: "", time: "" };

  /* Services: collect checked boxes (Acrylic Nails + Custom Nail Art start checked). */
  var boxes = Array.prototype.slice.call(form.querySelectorAll('input[name="service"]'));
  function refreshServices() {
    state.services = boxes.filter(function (b) { return b.checked; }).map(function (b) { return b.value; });
    summaryServices.textContent = state.services.length ? state.services.join(", ") : "No service selected yet";
  }
  boxes.forEach(function (b) { b.addEventListener("change", refreshServices); });
  refreshServices();

  /* Dates: next 6 days, generated LIVE from today (never hard-coded). */
  var dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var today = new Date();
  for (var i = 0; i < 6; i++) {
    (function (offset) {
      var d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset);
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "slot-btn";
      btn.setAttribute("aria-pressed", offset === 0 ? "true" : "false");
      var label = (offset === 0 ? "Today" : dayNames[d.getDay()]) + " " + d.getDate() + " " + monthNames[d.getMonth()];
      btn.innerHTML = label + "<small>" + d.getFullYear() + "</small>";
      btn.addEventListener("click", function () {
        dayRow.querySelectorAll(".slot-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
        btn.setAttribute("aria-pressed", "true");
        state.dateLabel = label + " " + d.getFullYear();
        state.dateValue = d.toISOString().slice(0, 10);
        summaryDate.textContent = state.dateLabel;
      });
      dayRow.appendChild(btn);
      if (offset === 0) {
        state.dateLabel = label + " " + d.getFullYear();
        state.dateValue = d.toISOString().slice(0, 10);
        summaryDate.textContent = state.dateLabel;
      }
    })(i);
  }

  /* Times: hourly slots inside opening hours, 9:00 AM – 8:00 PM. */
  var times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00"];
  times.forEach(function (t, idx) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "slot-btn";
    btn.setAttribute("aria-pressed", idx === 0 ? "true" : "false");
    btn.textContent = formatTime(t);
    btn.addEventListener("click", function () {
      timeRow.querySelectorAll(".slot-btn").forEach(function (b) { b.setAttribute("aria-pressed", "false"); });
      btn.setAttribute("aria-pressed", "true");
      state.time = formatTime(t);
      summaryTime.textContent = state.time;
    });
    timeRow.appendChild(btn);
    if (idx === 0) { state.time = formatTime(t); summaryTime.textContent = state.time; }
  });

  function formatTime(hhmm) {
    var parts = hhmm.split(":");
    var h = parseInt(parts[0], 10);
    var suffix = h >= 12 ? "PM" : "AM";
    var h12 = h % 12 === 0 ? 12 : h % 12;
    return h12 + ":" + parts[1] + " " + suffix;
  }

  /* Submit: front-end demo only — shows a confirmation state clearly labelled
     as a demo request, NOT a confirmed booking. No data leaves the browser. */
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!state.services.length) {
      summaryServices.textContent = "Please pick at least one service above.";
      document.getElementById("step-1").scrollIntoView({ behavior: "smooth" });
      return;
    }
    var name = document.getElementById("bk-name").value.trim();
    confirmText.textContent =
      state.services.join(", ") + " — " + state.dateLabel + " at " + state.time +
      " — for " + name + ".";
    form.style.display = "none";
    confirmBox.classList.add("show");
    confirmBox.scrollIntoView({ behavior: "smooth" });
  });
}
