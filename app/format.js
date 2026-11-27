// format.js — one job: turn numbers and dates into readable Indonesian text.
// Rupiah uses dots as thousand separators (Rp 12.500.000) and dates
// read as "27 Nov 2026".
(function (global) {
  "use strict";

  function formatRp(n) {
    var neg = n < 0;
    var s = String(Math.abs(Math.round(n)));
    var out = "";
    while (s.length > 3) {
      out = "." + s.slice(-3) + out;
      s = s.slice(0, -3);
    }
    out = s + out;
    return (neg ? "-Rp " : "Rp ") + out;
  }

  function formatRpShort(n) {
    if (n >= 1000000) {
      var jt = n / 1000000;
      var rounded = Math.round(jt * 10) / 10;
      return "Rp " + String(rounded).replace(".", ",") + " jt";
    }
    if (n >= 1000) return "Rp " + Math.round(n / 1000) + " rb";
    return "Rp " + n;
  }

  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  function formatDate(iso) {
    var parts = iso.split("-");
    if (parts.length !== 3) return iso;
    var day = parseInt(parts[2], 10);
    var month = MONTHS[parseInt(parts[1], 10) - 1] || "";
    return day + " " + month + " " + parts[0];
  }

  function parseAmount(raw) {
    var cleaned = String(raw || "").replace(/[^0-9]/g, "");
    return cleaned === "" ? NaN : parseInt(cleaned, 10);
  }

  global.BudgetFormat = {
    formatRp: formatRp,
    formatRpShort: formatRpShort,
    formatDate: formatDate,
    parseAmount: parseAmount
  };
})(window);
