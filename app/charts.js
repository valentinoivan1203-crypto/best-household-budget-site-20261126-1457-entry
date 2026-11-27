// charts.js — one job: draw the site's charts as plain inline SVG.
// No library, no canvas, no network: every chart is a string of SVG
// the page drops into the document. Colours are the site's own palette.
(function (global) {
  "use strict";

  var COLORS = ["#1b7a4d", "#2e9e6b", "#57b98a", "#8ac6a8", "#c98a2e", "#d9a441", "#e5c07a", "#7a5c2e", "#5b8a72", "#9db8a6"];

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  // Vertical bars with a value label above each bar.
  function barChart(items, opts) {
    var w = (opts && opts.width) || 520;
    var h = (opts && opts.height) || 220;
    var fmt = (opts && opts.format) || function (v) { return String(v); };
    var max = 0;
    items.forEach(function (it) { if (it.value > max) max = it.value; });
    if (max <= 0) max = 1;
    var padBottom = 28, padTop = 26;
    var innerH = h - padTop - padBottom;
    var slot = w / items.length;
    var barW = Math.min(64, slot * 0.55);
    var out = '<svg viewBox="0 0 ' + w + ' ' + h + '" width="100%" role="img" aria-label="Grafik batang">';
    items.forEach(function (it, i) {
      var bh = Math.max(2, (it.value / max) * innerH);
      var x = slot * i + (slot - barW) / 2;
      var y = padTop + (innerH - bh);
      var color = COLORS[i % COLORS.length];
      out += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + barW.toFixed(1) + '" height="' + bh.toFixed(1) + '" rx="4" fill="' + color + '"/>';
      out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (y - 7).toFixed(1) + '" text-anchor="middle" font-size="12" font-weight="600" fill="#1f2937">' + esc(fmt(it.value)) + '</text>';
      out += '<text x="' + (x + barW / 2).toFixed(1) + '" y="' + (h - 8).toFixed(1) + '" text-anchor="middle" font-size="12" fill="#6b7280">' + esc(it.label) + '</text>';
    });
    out += "</svg>";
    return out;
  }

  // Horizontal bars: a label, a track, a filled bar, and the value.
  function hbarRows(items, opts) {
    var fmt = (opts && opts.format) || function (v) { return String(v); };
    var max = 0;
    items.forEach(function (it) { if (it.value > max) max = it.value; });
    if (max <= 0) max = 1;
    var out = "";
    items.forEach(function (it, i) {
      var pct = Math.round((it.value / max) * 100);
      var color = it.color || COLORS[i % COLORS.length];
      out += '<div class="hbar-row"><div class="hbar-label">' + esc(it.label) + '</div>' +
        '<div class="hbar-track"><div class="hbar-fill" style="width:' + pct + '%;background:' + color + '"></div></div>' +
        '<div class="hbar-value">' + esc(fmt(it.value)) + '</div></div>';
    });
    return out;
  }

  // A simple donut: one ring per item, with a centre total.
  function donut(items, opts) {
    var size = (opts && opts.size) || 180;
    var fmt = (opts && opts.format) || function (v) { return String(v); };
    var total = 0;
    items.forEach(function (it) { total += it.value; });
    var cx = size / 2, cy = size / 2, r = size / 2 - 14, thick = 26;
    var circ = 2 * Math.PI * r;
    var offset = 0;
    var out = '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size + '" role="img" aria-label="Grafik lingkaran">';
    out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="#e5e7eb" stroke-width="' + thick + '"/>';
    items.forEach(function (it, i) {
      if (total <= 0 || it.value <= 0) return;
      var frac = it.value / total;
      var len = frac * circ;
      var color = it.color || COLORS[i % COLORS.length];
      out += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="' + thick + '" stroke-dasharray="' + len.toFixed(1) + ' ' + (circ - len).toFixed(1) + '" stroke-dashoffset="' + (-offset).toFixed(1) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      offset += len;
    });
    out += '<text x="' + cx + '" y="' + (cy - 4) + '" text-anchor="middle" font-size="15" font-weight="700" fill="#1f2937">' + esc(fmt(total)) + '</text>';
    out += '<text x="' + cx + '" y="' + (cy + 16) + '" text-anchor="middle" font-size="11" fill="#6b7280">Total belanja</text>';
    out += "</svg>";
    return out;
  }

  global.BudgetCharts = {
    barChart: barChart,
    hbarRows: hbarRows,
    donut: donut,
    COLORS: COLORS
  };
})(window);
