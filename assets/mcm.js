/* Pustaka bersama situs MCM: navigasi, tema, algoritma, data eksperimen, komponen tampilan */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const fmt = (v, d = 0) => (v === null || v === undefined || !isFinite(v)) ? "—"
    : v.toLocaleString("id-ID", { maximumFractionDigits: d, minimumFractionDigits: 0 });

  /* ---------------- tema ---------------- */
  function getTheme() { try { return localStorage.getItem("mcm-theme"); } catch (e) { return null; } }
  function setTheme(t) {
    if (t) document.documentElement.setAttribute("data-theme", t); else document.documentElement.removeAttribute("data-theme");
    try { t ? localStorage.setItem("mcm-theme", t) : localStorage.removeItem("mcm-theme"); } catch (e) {}
  }
  const saved = getTheme(); if (saved) setTheme(saved);
  function isDark() {
    const a = document.documentElement.getAttribute("data-theme");
    return a ? a === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  }

  /* ---------------- navigasi & footer ---------------- */
  const PAGES = [
    ["beranda", "index.html", "Beranda"],
    ["program", "program.html", "Program Inti"],
    ["visualisasi", "visualisasi.html", "Visualisasi DP"],
    ["studi-kasus", "studi-kasus.html", "Studi Kasus"],
    ["perbandingan", "perbandingan.html", "Perbandingan Algoritma"],
    ["presentasi", "presentasi.html", "Presentasi"],
  ];
  function mountChrome() {
    const holder = document.querySelector("[data-page]"); const page = holder ? holder.dataset.page : "";
    const head = document.createElement("header");
    head.className = "site-header";
    head.innerHTML = `<nav class="wrap nav" aria-label="Utama">
      <a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true"><i style="width:8px;height:18px"></i><i style="width:14px;height:10px"></i><i style="width:5px;height:22px"></i></span>Matrix Chain</a>
      <div class="nav-links">${PAGES.map(([id, href, name]) =>
        `<a href="${href}"${id === page ? ' aria-current="page"' : ""}>${name}</a>`).join("")}
        <button class="theme-btn" id="themeBtn" aria-label="Ganti tema terang atau gelap" title="Ganti tema"><svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor"/></svg></button></div></nav>`;
    document.body.prepend(head);
    $("#themeBtn").onclick = () => { setTheme(isDark() ? "light" : "dark"); document.dispatchEvent(new Event("mcm-theme")); };
    const foot = document.createElement("footer");
    foot.className = "site-footer";
    foot.innerHTML = `<div class="wrap row"><span>Sandi Mukti Lahambu · D082261025 · Magister Teknik Informatika, Universitas Hasanuddin</span>
      <span><a href="https://github.com/SandiMukti/matrix-chain-multiplication">Kode di GitHub</a> · Tugas Analisis Algoritma Komputasi, Algoritma No. 15</span></div>`;
    document.body.append(foot);
  }

  /* ---------------- algoritma: diambil dari assets/algoritma.js ---------------- */
  const A = window.MCMAlgo;
  const { matrixChainOrder, memoized, bruteForce, greedy, splitLR, splitRL, costBySplit, parensBySplit } = A;
  const parens = A.printParens;
  const catalan = k => { let c = 1; for (let i = 0; i < k; i++) c = c * 2 * (2 * i + 1) / (i + 2); return Math.round(c); };
  function rng(seed) { let x = seed >>> 0 || 1; return () => { x ^= x << 13; x >>>= 0; x ^= x >> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; }; }

  /* ---------------- data hasil eksperimen (laptop penulis) ---------------- */
  const EXP1 = [{ n: 50, t: 0.0057, sd: 0.0002 }, { n: 100, t: 0.0436, sd: 0.0012 }, { n: 200, t: 0.3449, sd: 0.0129 },
                { n: 400, t: 3.1829, sd: 0.1635 }, { n: 800, t: 33.9035, sd: 2.7034 }];
  const EXP2 = [[2,.004,.003],[3,.010,.005],[4,.014,.014],[5,.019,.043],[6,.031,.127],[7,.031,.323],[8,.046,.831],
                [9,.056,2.508],[10,.070,7.475],[11,.094,28.610],[12,.177,69.645],[13,.143,216.114],[14,.208,641.469],[15,.221,2031.797]]
               .map(([n, dp, bf]) => ({ n, dp, bf }));
  const CASES = [
    { id: "mlp", name: "MLP linear", p: [10, 128, 256, 512, 784, 1024],
      tag: "Jaringan saraf",
      desc: "Matriks bobot jaringan saraf 784–512–256–128–10 (W₄W₃W₂W₁) dikalikan dengan batch 1.024 data X. Urutan alami jaringan saraf adalah menerapkan layer satu per satu ke data, yaitu kanan-ke-kiri.",
      insight: "Karena keluaran jaringan hanya berdimensi 10, menggabungkan bobot dari kiri jauh lebih murah. Urutan yang terasa alami justru 42 kali lebih banyak perkaliannya. Catatan: pada run ini pengukuran baris Optimal sempat terganggu (4,51 ms), padahal pengurungan yang sama terukur 1,40 ms sebagai kiri-ke-kanan.",
      rows: [{ u: "Kiri-ke-kanan", par: "((((A1A2)A3)A4)A5)", flop: 13680640, ms: 1.40 },
             { u: "Kanan-ke-kiri", par: "(A1(A2(A3(A4A5))))", flop: 580124672, ms: 31.38 },
             { u: "Optimal (DP)", par: "((((A1A2)A3)A4)A5)", flop: 13680640, ms: 4.51, opt: true }] },
    { id: "jacobian", name: "Jacobian × vektor", p: [1500, 1500, 1500, 1500, 1],
      tag: "Automatic differentiation",
      desc: "Tiga matriks Jacobian 1.500 × 1.500 dikalikan dengan sebuah vektor, seperti pada automatic differentiation. Urutan kiri-ke-kanan setara forward mode, kanan-ke-kiri setara reverse mode.",
      insight: "Mengalikan dari kanan menjaga setiap hasil antara tetap berupa vektor. Perkalian berkurang 1.000 kali, tetapi waktu hanya 94 kali, karena BLAS lebih efisien pada matriks besar daripada matriks-vektor.",
      rows: [{ u: "Kiri-ke-kanan", par: "(((A1A2)A3)A4)", flop: 6752250000, ms: 225.13 },
             { u: "Kanan-ke-kiri", par: "(A1(A2(A3A4)))", flop: 6750000, ms: 2.52 },
             { u: "Optimal (DP)", par: "(A1(A2(A3A4)))", flop: 6750000, ms: 2.40, opt: true }] },
    { id: "heterogen", name: "Rantai heterogen", p: [766, 257, 1284, 20, 362, 340, 823, 564, 251],
      tag: "Dimensi bervariasi",
      desc: "Delapan matriks dengan dimensi bervariasi. Dimensinya dipilih agar urutan optimal berbeda dari kedua urutan naif.",
      insight: "Tidak ada urutan naif yang mendekati optimal. DP menemukan pengurungan campuran yang memanfaatkan dimensi kecil 20 di tengah rantai.",
      rows: [{ u: "Kiri-ke-kanan", par: "(((((((A1A2)A3)A4)A5)A6)A7)A8)", flop: 1050602704, ms: 44.58 },
             { u: "Kanan-ke-kiri", par: "(A1(A2(A3(A4(A5(A6(A7A8)))))))", flop: 358137342, ms: 15.85 },
             { u: "Optimal (DP)", par: "((A1(A2A3))((((A4A5)A6)A7)A8))", flop: 34555040, ms: 2.98, opt: true }] },
  ];

  /* ---------------- komponen ---------------- */
  function chainViz(el, p, opts = {}) {     // matriks digambar dengan ukuran sebanding (skala log)
    const n = p.length - 1, max = Math.max(...p), min = Math.min(...p);
    const sc = v => { const lo = opts.min || 14, hi = opts.max || 90;
      if (max === min) return (lo + hi) / 2;
      return lo + (Math.log(v) - Math.log(min)) / (Math.log(max) - Math.log(min)) * (hi - lo); };
    el.innerHTML = Array.from({ length: n }, (_, x) => {
      const cls = opts.cls ? opts.cls(x + 1) : "";
      return `<div class="mx"><div class="box ${cls}" style="width:${sc(p[x + 1]).toFixed(0)}px;height:${sc(p[x]).toFixed(0)}px" title="A${x + 1}: ${p[x]} × ${p[x + 1]}"></div>
        <b>A<sub>${x + 1}</sub></b><span>${fmt(p[x])}×${fmt(p[x + 1])}</span></div>`;
    }).join("");
  }
  function bars(el, rows, key, unit, digits) {
    const max = Math.max(...rows.map(r => r[key]));
    const opt = (rows.find(r => r.opt) || rows.reduce((a, b) => b[key] < a[key] ? b : a))[key];
    el.innerHTML = rows.map(r => {
      const w = r[key] / max * 100;
      const ratio = r.opt ? "" : ` · ${fmt(r[key] / opt, 1)}×`;
      const label = `${fmt(r[key], digits)}${unit}${ratio}`;
      const inside = false;
      return `<div class="bar-row"><div class="bar-name"><span>${r.u} <b class="bar-num">${label}</b></span>${r.par ? `<code>${r.par}</code>` : ""}</div>
        <div class="bar-track" title="${r.u}: ${label}"><div class="bar-fill${r.opt ? " opt" : ""}" style="width:${w}%"></div></div></div>`;
    }).join("");
  }

  window.MCM = { $, fmt, mountChrome, isDark, matrixChainOrder, memoized, bruteForce, greedy, splitLR, splitRL,
    costBySplit, parensBySplit, parens, catalan, rng, EXP1, EXP2, CASES, chainViz, bars };
  document.addEventListener("DOMContentLoaded", mountChrome);
})();
