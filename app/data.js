// data.js — one job: the household's figures and how they are kept.
// Holds the seed data for November 2026, loads and saves it to
// localStorage, and offers the only ways the pages change it
// (add / edit / delete a transaction, change a budget limit,
// add money to a goal, add a goal, reset to the seed).
// Every total the site shows is computed here from the transactions,
// so adding or deleting a transaction updates every page at once.
(function (global) {
  "use strict";

  var KEY = "anggaran-keluarga-v1";

  var CATEGORIES = [
    "Belanja",
    "Sewa",
    "Transportasi",
    "Sekolah",
    "Utilitas",
    "Makan di Luar",
    "Kesehatan",
    "Hiburan",
    "Lainnya"
  ];

  var INCOME_CATEGORIES = ["Gaji", "Usaha"];

  function seed() {
    return {
      family: "Keluarga Santoso",
      month: "November 2026",
      transactions: [
        { id: "t01", date: "2026-11-01", desc: "Gaji Bulanan", category: "Gaji", type: "income", amount: 10000000 },
        { id: "t02", date: "2026-11-02", desc: "Sewa Kontrakan November", category: "Sewa", type: "expense", amount: 2500000 },
        { id: "t03", date: "2026-11-03", desc: "Belanja Pasar Minggu 1", category: "Belanja", type: "expense", amount: 425000 },
        { id: "t04", date: "2026-11-05", desc: "BBM Motor", category: "Transportasi", type: "expense", amount: 85000 },
        { id: "t05", date: "2026-11-06", desc: "SPP Anak", category: "Sekolah", type: "expense", amount: 850000 },
        { id: "t06", date: "2026-11-07", desc: "Makan di Luar (Keluarga)", category: "Makan di Luar", type: "expense", amount: 185000 },
        { id: "t07", date: "2026-11-08", desc: "Belanja Supermarket", category: "Belanja", type: "expense", amount: 612000 },
        { id: "t08", date: "2026-11-10", desc: "Listrik PLN", category: "Utilitas", type: "expense", amount: 385000 },
        { id: "t09", date: "2026-11-10", desc: "Air PDAM", category: "Utilitas", type: "expense", amount: 145000 },
        { id: "t10", date: "2026-11-11", desc: "Ojek Online", category: "Transportasi", type: "expense", amount: 48000 },
        { id: "t11", date: "2026-11-12", desc: "Buku & Alat Tulis", category: "Sekolah", type: "expense", amount: 175000 },
        { id: "t12", date: "2026-11-13", desc: "Belanja Pasar Minggu 2", category: "Belanja", type: "expense", amount: 398000 },
        { id: "t13", date: "2026-11-14", desc: "Nonton Bioskop", category: "Hiburan", type: "expense", amount: 120000 },
        { id: "t14", date: "2026-11-15", desc: "Usaha Sampingan (Jualan Online)", category: "Usaha", type: "income", amount: 2500000 },
        { id: "t15", date: "2026-11-16", desc: "Internet Rumah", category: "Utilitas", type: "expense", amount: 350000 },
        { id: "t16", date: "2026-11-17", desc: "Apotek (Obat)", category: "Kesehatan", type: "expense", amount: 95000 },
        { id: "t17", date: "2026-11-18", desc: "BBM Motor", category: "Transportasi", type: "expense", amount: 90000 },
        { id: "t18", date: "2026-11-19", desc: "Belanja Supermarket", category: "Belanja", type: "expense", amount: 540000 },
        { id: "t19", date: "2026-11-20", desc: "Makan di Luar", category: "Makan di Luar", type: "expense", amount: 150000 },
        { id: "t20", date: "2026-11-21", desc: "Les Matematika Anak", category: "Sekolah", type: "expense", amount: 200000 },
        { id: "t21", date: "2026-11-22", desc: "Ojek Online", category: "Transportasi", type: "expense", amount: 52000 },
        { id: "t22", date: "2026-11-23", desc: "Langganan Streaming", category: "Hiburan", type: "expense", amount: 79000 },
        { id: "t23", date: "2026-11-24", desc: "Belanja Pasar Minggu 3", category: "Belanja", type: "expense", amount: 375000 },
        { id: "t24", date: "2026-11-25", desc: "Dokter Gigi", category: "Kesehatan", type: "expense", amount: 180000 },
        { id: "t25", date: "2026-11-26", desc: "BBM Motor", category: "Transportasi", type: "expense", amount: 88000 },
        { id: "t26", date: "2026-11-27", desc: "Belanja Harian", category: "Belanja", type: "expense", amount: 125000 }
      ],
      budgets: [
        { category: "Belanja", limit: 2000000 },
        { category: "Sewa", limit: 2500000 },
        { category: "Transportasi", limit: 800000 },
        { category: "Sekolah", limit: 1500000 },
        { category: "Utilitas", limit: 900000 },
        { category: "Makan di Luar", limit: 500000 },
        { category: "Kesehatan", limit: 400000 },
        { category: "Hiburan", limit: 300000 }
      ],
      goals: [
        { id: "g1", name: "Dana Darurat", target: 15000000, saved: 9750000, note: "6 bulan biaya hidup" },
        { id: "g2", name: "Liburan Keluarga", target: 5000000, saved: 2350000, note: "Pantai akhir tahun" },
        { id: "g3", name: "DP Rumah", target: 50000000, saved: 12500000, note: "Rumah pertama" },
        { id: "g4", name: "Pendidikan Anak", target: 10000000, saved: 4100000, note: "Biaya masuk SMP" }
      ]
    };
  }

  var state = null;

  function load() {
    if (state) return state;
    try {
      var raw = global.localStorage.getItem(KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && parsed.transactions && parsed.budgets && parsed.goals) {
          state = parsed;
          return state;
        }
      }
    } catch (e) { /* corrupted storage: fall through to the seed */ }
    state = seed();
    save();
    return state;
  }

  function save() {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) { /* storage full or unavailable: keep the in-memory copy */ }
  }

  function reset() {
    state = seed();
    save();
    return state;
  }

  function nextId(prefix) {
    return prefix + Date.now().toString(36) + Math.floor(Math.random() * 1000);
  }

  function addTransaction(t) {
    t.id = nextId("t");
    state.transactions.push(t);
    state.transactions.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    save();
    return t;
  }

  function updateTransaction(id, patch) {
    var t = state.transactions.find(function (x) { return x.id === id; });
    if (!t) return null;
    Object.keys(patch).forEach(function (k) { t[k] = patch[k]; });
    state.transactions.sort(function (a, b) { return a.date < b.date ? -1 : 1; });
    save();
    return t;
  }

  function deleteTransaction(id) {
    state.transactions = state.transactions.filter(function (x) { return x.id !== id; });
    save();
  }

  function updateBudget(category, limit) {
    var b = state.budgets.find(function (x) { return x.category === category; });
    if (b) { b.limit = limit; save(); }
    return b;
  }

  function addToGoal(id, amount) {
    var g = state.goals.find(function (x) { return x.id === id; });
    if (g) { g.saved += amount; save(); }
    return g;
  }

  function addGoal(g) {
    g.id = nextId("g");
    g.saved = g.saved || 0;
    state.goals.push(g);
    save();
    return g;
  }

  // Totals, always computed from the transactions — never stored.
  function totals() {
    var income = 0, spending = 0;
    var byCategory = {};
    CATEGORIES.concat(INCOME_CATEGORIES).forEach(function (c) { byCategory[c] = 0; });
    state.transactions.forEach(function (t) {
      if (t.type === "income") {
        income += t.amount;
      } else {
        spending += t.amount;
      }
      byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
    });
    var remaining = income - spending;
    var savingsRate = income > 0 ? Math.round((remaining / income) * 100) : 0;
    return {
      income: income,
      spending: spending,
      remaining: remaining,
      savingsRate: savingsRate,
      byCategory: byCategory,
      count: state.transactions.length
    };
  }

  function budgetStatus() {
    var t = totals();
    return state.budgets.map(function (b) {
      var spent = t.byCategory[b.category] || 0;
      var pct = b.limit > 0 ? Math.round((spent / b.limit) * 100) : 0;
      return {
        category: b.category,
        limit: b.limit,
        spent: spent,
        left: b.limit - spent,
        pct: pct,
        over: spent > b.limit
      };
    });
  }

  function weekSpending() {
    // Four weeks of November 2026: 1-7, 8-14, 15-21, 22-30.
    var weeks = [0, 0, 0, 0];
    state.transactions.forEach(function (t) {
      if (t.type !== "expense") return;
      var day = parseInt(t.date.slice(8, 10), 10);
      var w = day <= 7 ? 0 : day <= 14 ? 1 : day <= 21 ? 2 : 3;
      weeks[w] += t.amount;
    });
    return weeks;
  }

  global.BudgetData = {
    CATEGORIES: CATEGORIES,
    INCOME_CATEGORIES: INCOME_CATEGORIES,
    load: load,
    save: save,
    reset: reset,
    addTransaction: addTransaction,
    updateTransaction: updateTransaction,
    deleteTransaction: deleteTransaction,
    updateBudget: updateBudget,
    addToGoal: addToGoal,
    addGoal: addGoal,
    totals: totals,
    budgetStatus: budgetStatus,
    weekSpending: weekSpending
  };
})(window);
