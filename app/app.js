// app.js — one job: the chrome every page shares.
// Marks the current page in the nav, prints the family and month,
// and renders the four summary cards (income, spending, remaining,
// savings rate) from the data. Page scripts call App.summary()
// after they have loaded the data.
(function (global) {
  "use strict";

  var F = global.BudgetFormat;
  var D = global.BudgetData;

  function initNav(currentPage) {
    var links = document.querySelectorAll("nav a[data-page]");
    links.forEach(function (a) {
      if (a.getAttribute("data-page") === currentPage) a.classList.add("active");
    });
    var state = D.load();
    var family = document.getElementById("family-name");
    if (family) family.textContent = state.family;
    var month = document.getElementById("month-label");
    if (month) month.textContent = state.month;
  }

  function summary() {
    var t = D.totals();
    var el = document.getElementById("summary-cards");
    if (!el) return t;
    el.innerHTML =
      card("Pemasukan", F.formatRp(t.income), "Gaji + usaha sampingan", "in") +
      card("Pengeluaran", F.formatRp(t.spending), t.count + " transaksi bulan ini", "out") +
      card("Sisa Uang", F.formatRp(t.remaining), "Pemasukan dikurangi pengeluaran", "left") +
      card("Tingkat Tabungan", t.savingsRate + "%", "Dari pemasukan yang disisihkan", "rate");
    return t;
  }

  function card(label, value, note, kind) {
    return '<div class="card summary-' + kind + '">' +
      '<div class="card-label">' + label + '</div>' +
      '<div class="card-value">' + value + '</div>' +
      '<div class="card-note">' + note + '</div></div>';
  }

  function resetButton() {
    var btn = document.getElementById("reset-data");
    if (btn) {
      btn.addEventListener("click", function () {
        if (global.confirm("Kembalikan semua data ke contoh awal November 2026?")) {
          D.reset();
          global.location.reload();
        }
      });
    }
  }

  global.App = {
    initNav: initNav,
    summary: summary,
    resetButton: resetButton
  };
})(window);
