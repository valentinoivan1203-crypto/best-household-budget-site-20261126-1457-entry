// reports.js — one job: the Reports page.
// Summary cards, weekly spending chart, per-category bars, a donut
// of the biggest shares, and the top spending transactions.
(function (global) {
  "use strict";
  var F = global.BudgetFormat;
  var D = global.BudgetData;
  var C = global.BudgetCharts;

  document.addEventListener("DOMContentLoaded", function () {
    App.initNav("reports");
    App.resetButton();
    var state = D.load();
    var t = App.summary();

    var weeks = D.weekSpending();
    document.getElementById("weekly-chart").innerHTML = C.barChart([
      { label: "Minggu 1", value: weeks[0] },
      { label: "Minggu 2", value: weeks[1] },
      { label: "Minggu 3", value: weeks[2] },
      { label: "Minggu 4", value: weeks[3] }
    ], { format: F.formatRpShort });

    var cats = D.budgetStatus()
      .map(function (b) { return { label: b.category, value: b.spent }; })
      .filter(function (c) { return c.value > 0; })
      .sort(function (a, b) { return b.value - a.value; });
    document.getElementById("category-bars").innerHTML =
      C.hbarRows(cats, { format: F.formatRpShort });

    var top4 = cats.slice(0, 4);
    var rest = cats.slice(4).reduce(function (s, c) { return s + c.value; }, 0);
    var donutItems = top4.concat(rest > 0 ? [{ label: "Lainnya", value: rest }] : []);
    document.getElementById("category-donut").innerHTML =
      C.donut(donutItems, { format: F.formatRpShort });
    document.getElementById("category-legend").innerHTML = donutItems.map(function (it, i) {
      var pct = t.spending > 0 ? Math.round((it.value / t.spending) * 100) : 0;
      return '<span style="--dot:' + C.COLORS[i % C.COLORS.length] + '">' + it.label + " — " + pct + "%</span>";
    }).join("");

    var topTx = state.transactions
      .filter(function (x) { return x.type === "expense"; })
      .sort(function (a, b) { return b.amount - a.amount; })
      .slice(0, 5);
    document.getElementById("top-list").innerHTML =
      '<table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th></tr></thead><tbody>' +
      topTx.map(function (x) {
        return "<tr class=\"expense\"><td>" + F.formatDate(x.date) + "</td><td>" + x.desc + "</td>" +
          '<td><span class="tag">' + x.category + "</span></td>" +
          '<td class="num amount">−' + F.formatRp(x.amount) + "</td></tr>";
      }).join("") + "</tbody></table>";
  });
})(window);
