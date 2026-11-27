// goals.js — one job: the Savings Goals page.
// Goal cards with progress bars, adding money to a goal, and the
// form that creates a new goal.
(function (global) {
  "use strict";
  var F = global.BudgetFormat;
  var D = global.BudgetData;

  function render() {
    var state = D.load();
    var totalSaved = 0, totalTarget = 0;
    state.goals.forEach(function (g) { totalSaved += g.saved; totalTarget += g.target; });
    document.getElementById("goal-list").innerHTML = state.goals.map(function (g) {
      var pct = g.target > 0 ? Math.round((g.saved / g.target) * 100) : 0;
      var left = Math.max(0, g.target - g.saved);
      return '<section class="card"><div class="goal-head"><b>' + g.name + "</b><span>" + pct + "%</span></div>" +
        '<div class="goal-meta">' + (g.note || "") + "</div>" +
        '<div class="bar"><div style="width:' + Math.min(100, pct) + '%"></div></div>' +
        '<div style="display:flex;justify-content:space-between;margin-top:8px;font-size:14px"><span><b>' +
        F.formatRp(g.saved) + "</b> terkumpul</span><span class=\"muted\">dari " + F.formatRp(g.target) + "</span></div>" +
        '<div class="small muted">' + (left > 0 ? "Kurang " + F.formatRp(left) + " lagi." : "Tercapai! Selamat!") + "</div>" +
        '<div class="goal-actions"><input type="number" min="1000" step="1000" placeholder="Jumlah (Rp)" data-add="' + g.id + '">' +
        '<button class="btn small" data-addbtn="' + g.id + '" type="button">Tambah Dana</button></div></section>';
    }).join("");
  }

  document.addEventListener("DOMContentLoaded", function () {
    App.initNav("goals");
    App.resetButton();
    D.load();
    render();

    document.getElementById("goal-list").addEventListener("click", function (e) {
      var id = e.target.getAttribute("data-addbtn");
      if (!id) return;
      var input = document.querySelector('input[data-add="' + id + '"]');
      var amount = F.parseAmount(input ? input.value : "");
      if (isNaN(amount) || amount <= 0) { global.alert("Masukkan jumlah dana yang mau ditambahkan."); return; }
      D.addToGoal(id, amount);
      render();
    });

    document.getElementById("goal-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var target = F.parseAmount(document.getElementById("g-target").value);
      var name = document.getElementById("g-name").value.trim();
      if (!name) { global.alert("Nama tujuan wajib diisi."); return; }
      if (isNaN(target) || target <= 0) { global.alert("Target harus lebih dari 0."); return; }
      D.addGoal({
        name: name,
        target: target,
        saved: 0,
        note: document.getElementById("g-note").value.trim()
      });
      e.target.reset();
      render();
    });
  });
})(window);
