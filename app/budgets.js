// budgets.js — one job: the Budgets page.
// Per-category spent-vs-limit bars and the form that changes a limit.
(function (global) {
  "use strict";
  var F = global.BudgetFormat;
  var D = global.BudgetData;

  function render() {
    var status = D.budgetStatus();
    var over = status.filter(function (b) { return b.over; });
    var callout = document.getElementById("over-callout");
    if (over.length > 0) {
      callout.innerHTML = '<div class="callout bad"><b>Perhatian:</b> ' + over.length +
        " kategori sudah lewat batas: " + over.map(function (b) {
          return b.category + " (lewat " + F.formatRpShort(b.spent - b.limit) + ")";
        }).join(", ") + ". Kurangi belanja atau naikkan batasnya di bawah.</div>";
    } else {
      callout.innerHTML = '<div class="callout">Semua kategori masih dalam batas bulan ini. Bagus!</div>';
    }

    document.getElementById("budget-list").innerHTML = status.map(function (b) {
      var cls = b.over ? "over" : (b.pct >= 80 ? "near" : "");
      return '<div class="budget-row"><div class="budget-name">' + b.category + "</div>" +
        '<div><div class="bar ' + cls + '"><div style="width:' + Math.min(100, b.pct) + '%"></div></div>' +
        '<div class="small muted" style="margin-top:4px">' + b.pct + "% terpakai — " +
        (b.over ? '<span class="over-text">lewat ' + F.formatRpShort(b.spent - b.limit) + "</span>"
          : "sisa " + F.formatRpShort(b.left)) + "</div></div>" +
        '<div class="budget-nums"><b>' + F.formatRp(b.spent) + '</b><span class="muted">dari ' + F.formatRp(b.limit) + "</span></div></div>";
    }).join("");

    var sel = document.getElementById("limit-category");
    if (sel.options.length === 0) {
      sel.innerHTML = status.map(function (b) {
        return '<option value="' + b.category + '">' + b.category + "</option>";
      }).join("");
      var first = status[0];
      if (first) document.getElementById("limit-amount").value = first.limit;
      sel.addEventListener("change", function () {
        var b = status.find(function (x) { return x.category === sel.value; });
        if (b) document.getElementById("limit-amount").value = b.limit;
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    App.initNav("budgets");
    App.resetButton();
    D.load();
    render();
    document.getElementById("limit-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var cat = document.getElementById("limit-category").value;
      var limit = F.parseAmount(document.getElementById("limit-amount").value);
      if (isNaN(limit) || limit < 0) { global.alert("Batas harus berupa angka 0 atau lebih."); return; }
      D.updateBudget(cat, limit);
      render();
    });
  });
})(window);
