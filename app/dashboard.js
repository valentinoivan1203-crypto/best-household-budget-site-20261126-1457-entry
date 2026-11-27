// dashboard.js — one job: fill the Dashboard page.
// Summary cards, spending per category, budget health, recent transactions.
(function (global) {
  "use strict";
  var F = global.BudgetFormat;
  var D = global.BudgetData;
  var C = global.BudgetCharts;

  function render() {
    var state = D.load();
    App.initNav("dashboard");
    var t = App.summary();

    var cats = D.budgetStatus()
      .map(function (b) { return { label: b.category, value: b.spent }; })
      .sort(function (a, b) { return b.value - a.value; });
    document.getElementById("category-bars").innerHTML =
      C.hbarRows(cats, { format: F.formatRpShort });

    var health = D.budgetStatus();
    var over = health.filter(function (b) { return b.over; });
    var near = health.filter(function (b) { return !b.over && b.pct >= 80; });
    var el = document.getElementById("budget-health");
    var html = "";
    health.slice(0, 4).forEach(function (b) {
      var cls = b.over ? "over" : (b.pct >= 80 ? "near" : "");
      html += '<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:14px">' +
        "<b>" + b.category + "</b><span>" + F.formatRpShort(b.spent) + " / " + F.formatRpShort(b.limit) + "</span></div>" +
        '<div class="bar ' + cls + '" style="margin-top:5px"><div style="width:' + Math.min(100, b.pct) + '%"></div></div>' +
        '<div class="small muted">' + b.pct + "% terpakai" + (b.over ? ' — <span class="over-text">lewat ' + F.formatRpShort(b.spent - b.limit) + "</span>" : "") + "</div></div>";
    });
    html += '<p class="small">' + (over.length > 0
      ? '<span class="over-text">' + over.length + " kategori lewat batas</span> (" + over.map(function (b) { return b.category; }).join(", ") + ")."
      : '<span class="ok-text">Semua kategori masih dalam batas</span>, kecuali ' + near.length + " yang hampir penuh.") + "</p>";
    el.innerHTML = html;

    var recent = state.transactions.slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).slice(0, 6);
    var rows = recent.map(function (tx) {
      return "<tr class=\"" + tx.type + "\"><td>" + F.formatDate(tx.date) + "</td><td>" + tx.desc + "</td>" +
        '<td><span class="tag">' + tx.category + "</span></td>" +
        '<td class="num amount">' + (tx.type === "income" ? "+" : "−") + F.formatRp(tx.amount) + "</td></tr>";
    }).join("");
    document.getElementById("recent-list").innerHTML =
      '<table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead><tbody>' + rows + "</tbody></table>";
  }

  document.addEventListener("DOMContentLoaded", function () {
    render();
    App.resetButton();
  });
})(window);
