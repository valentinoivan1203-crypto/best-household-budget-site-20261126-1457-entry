// transactions.js — one job: the Transactions page.
// Search, category and type filters, the table, and the add / edit /
// delete form. Every change saves to the store and re-renders.
(function (global) {
  "use strict";
  var F = global.BudgetFormat;
  var D = global.BudgetData;

  var editingId = null;

  function categoriesFor(type) {
    return type === "income" ? D.INCOME_CATEGORIES : D.CATEGORIES;
  }

  function fillCategorySelects() {
    var type = document.getElementById("f-type").value;
    var sel = document.getElementById("f-category");
    var current = sel.value;
    sel.innerHTML = categoriesFor(type).map(function (c) {
      return '<option value="' + c + '"' + (c === current ? " selected" : "") + ">" + c + "</option>";
    }).join("");
    var filter = document.getElementById("filter-category");
    var all = D.CATEGORIES.concat(D.INCOME_CATEGORIES);
    filter.innerHTML = '<option value="">Semua kategori</option>' +
      all.map(function (c) { return '<option value="' + c + '">' + c + "</option>"; }).join("");
  }

  function filtered() {
    var state = D.load();
    var q = document.getElementById("search").value.trim().toLowerCase();
    var cat = document.getElementById("filter-category").value;
    var type = document.getElementById("filter-type").value;
    return state.transactions.filter(function (t) {
      if (q && t.desc.toLowerCase().indexOf(q) === -1) return false;
      if (cat && t.category !== cat) return false;
      if (type && t.type !== type) return false;
      return true;
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });
  }

  function render() {
    var rows = filtered();
    var html = rows.map(function (t) {
      return "<tr class=\"" + t.type + "\"><td>" + F.formatDate(t.date) + "</td><td>" + t.desc + "</td>" +
        '<td><span class="tag">' + t.category + "</span></td>" +
        '<td class="num amount">' + (t.type === "income" ? "+" : "−") + F.formatRp(t.amount) + "</td>" +
        '<td class="right"><button class="btn ghost small" data-edit="' + t.id + '" type="button">Ubah</button> ' +
        '<button class="btn danger small" data-del="' + t.id + '" type="button">Hapus</button></td></tr>';
    }).join("");
    document.getElementById("table-wrap").innerHTML =
      '<table><thead><tr><th>Tanggal</th><th>Keterangan</th><th>Kategori</th><th class="num">Jumlah</th><th></th></tr></thead><tbody>' +
      (html || '<tr><td colspan="5" class="muted">Tidak ada transaksi yang cocok.</td></tr>') + "</tbody></table>";
    var t = D.totals();
    document.getElementById("table-count").textContent =
      rows.length + " transaksi ditampilkan — total pemasukan " + F.formatRp(t.income) +
      ", pengeluaran " + F.formatRp(t.spending) + ".";
  }

  function resetForm() {
    editingId = null;
    document.getElementById("add-form").reset();
    document.getElementById("f-date").value = "2026-11-27";
    document.getElementById("submit-btn").textContent = "Tambah Transaksi";
    document.getElementById("edit-note").hidden = true;
    fillCategorySelects();
  }

  document.addEventListener("DOMContentLoaded", function () {
    App.initNav("transactions");
    App.resetButton();
    D.load();
    fillCategorySelects();
    render();

    document.getElementById("f-type").addEventListener("change", fillCategorySelects);
    ["search", "filter-category", "filter-type"].forEach(function (id) {
      document.getElementById(id).addEventListener("input", render);
      document.getElementById(id).addEventListener("change", render);
    });

    document.getElementById("add-form").addEventListener("submit", function (e) {
      e.preventDefault();
      var amount = F.parseAmount(document.getElementById("f-amount").value);
      if (isNaN(amount) || amount <= 0) { global.alert("Jumlah harus lebih dari 0."); return; }
      var data = {
        date: document.getElementById("f-date").value,
        desc: document.getElementById("f-desc").value.trim(),
        category: document.getElementById("f-category").value,
        type: document.getElementById("f-type").value,
        amount: amount
      };
      if (!data.desc) { global.alert("Keterangan wajib diisi."); return; }
      if (editingId) D.updateTransaction(editingId, data);
      else D.addTransaction(data);
      resetForm();
      render();
    });

    document.getElementById("cancel-edit").addEventListener("click", resetForm);

    document.getElementById("table-wrap").addEventListener("click", function (e) {
      var del = e.target.getAttribute("data-del");
      var edit = e.target.getAttribute("data-edit");
      if (del) {
        if (global.confirm("Hapus transaksi ini?")) {
          D.deleteTransaction(del);
          render();
        }
        return;
      }
      if (edit) {
        var t = D.load().transactions.find(function (x) { return x.id === edit; });
        if (!t) return;
        editingId = t.id;
        document.getElementById("f-date").value = t.date;
        document.getElementById("f-desc").value = t.desc;
        document.getElementById("f-amount").value = t.amount;
        document.getElementById("f-type").value = t.type;
        fillCategorySelects();
        document.getElementById("f-category").value = t.category;
        document.getElementById("submit-btn").textContent = "Simpan Perubahan";
        document.getElementById("edit-note").hidden = false;
        document.getElementById("f-desc").focus();
      }
    });
  });
})(window);
