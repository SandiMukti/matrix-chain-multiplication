/*
 * algoritma.js — Algoritma utama Matrix Chain Multiplication (versi JavaScript)
 * Terjemahan langsung dari tugas.py; nama fungsi dan urutan baris dibuat sama
 * agar mudah dibandingkan. Berkas ini murni algoritma: tanpa tampilan.
 *
 * Input  : p = vektor dimensi, panjang n+1. Matriks A_i berukuran p[i-1] x p[i].
 * Output : m[i][j] = biaya minimum A_i..A_j,  s[i][j] = titik belah optimal.
 * Kompleksitas: waktu Θ(n³) = (n³ − n)/6 evaluasi, ruang Θ(n²).
 */
(function (global) {
  "use strict";

  /* ---------- 1. Inti: DP bottom-up (sama dengan matrix_chain_order di tugas.py) ---------- */
  function matrixChainOrder(p) {
    const n = p.length - 1;                                   // banyaknya matriks
    // tabel (n+1) x (n+1) agar indeks 1..n sama dengan pseudocode; baris/kolom 0 tak dipakai
    const m = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    const s = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    let evals = 0;                                            // penghitung evaluasi q (untuk analisis)
    // kasus dasar m[i][i] = 0 sudah terpenuhi karena tabel diisi 0
    for (let l = 2; l <= n; l++) {                            // l = panjang subrantai
      for (let i = 1; i <= n - l + 1; i++) {                  // i = indeks awal
        const j = i + l - 1;                                  // j = indeks akhir
        m[i][j] = Infinity;                                   // belum ada solusi
        for (let k = i; k < j; k++) {                         // k = titik belah
          evals++;
          const q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];   // kiri + kanan + gabung
          if (q < m[i][j]) {                                  // simpan jika lebih murah
            m[i][j] = q;
            s[i][j] = k;
          }
        }
      }
    }
    return { cost: n ? m[1][n] : 0, m, s, evals };
  }

  /* ---------- 2. Rekonstruksi pengurungan (sama dengan print_parens) ---------- */
  function printParens(s, i, j) {
    if (i === j) return `A${i}`;
    const k = s[i][j];
    return "(" + printParens(s, i, k) + printParens(s, k + 1, j) + ")";
  }

  /* ---------- 3. Pembanding: brute force tanpa memoisasi (sama dengan brute_force) ---------- */
  function bruteForce(p) {
    const n = p.length - 1;
    let calls = 0;
    function go(i, j) {
      calls++;
      if (i === j) return 0;
      let best = Infinity;
      for (let k = i; k < j; k++) {
        const q = go(i, k) + go(k + 1, j) + p[i - 1] * p[k] * p[j];
        if (q < best) best = q;
      }
      return best;
    }
    return { cost: go(1, n), evals: calls };
  }

  /* ---------- 4. Pembanding tambahan ---------- */
  function memoized(p) {                                      // DP top-down dengan memoisasi
    const n = p.length - 1, memo = new Map();
    const s = Array.from({ length: n + 1 }, () => Array(n + 1).fill(0));
    let calls = 0;
    function go(i, j) {
      calls++;
      if (i === j) return 0;
      const key = i * 1000 + j;
      if (memo.has(key)) return memo.get(key);
      let best = Infinity;
      for (let k = i; k < j; k++) {
        const q = go(i, k) + go(k + 1, j) + p[i - 1] * p[k] * p[j];
        if (q < best) { best = q; s[i][j] = k; }
      }
      memo.set(key, best);
      return best;
    }
    return { cost: go(1, n), s, evals: calls };
  }
  function greedy(p) {                                        // heuristik: pasangan bertetangga termurah dulu
    const items = p.slice(0, -1).map((_, i) => ({ r: p[i], c: p[i + 1], name: `A${i + 1}` }));
    let cost = 0, evals = 0;
    while (items.length > 1) {
      let bi = 0, bc = Infinity;
      for (let i = 0; i < items.length - 1; i++) {
        evals++;
        const c = items[i].r * items[i].c * items[i + 1].c;
        if (c < bc) { bc = c; bi = i; }
      }
      cost += bc;
      const a = items[bi], b = items[bi + 1];
      items.splice(bi, 2, { r: a.r, c: b.c, name: `(${a.name}${b.name})` });
    }
    return { cost, paren: items[0].name, evals };
  }

  /* ---------- 5. Urutan naif dan biaya sebuah pengurungan ---------- */
  const splitLR = () => (i, j) => j - 1;                      // (((A1A2)A3)...An)
  const splitRL = () => (i, j) => i;                          // A1(A2(...(An-1An)))
  function costBySplit(p, split, i, j) {
    if (i === j) return 0;
    const k = split(i, j);
    return costBySplit(p, split, i, k) + costBySplit(p, split, k + 1, j) + p[i - 1] * p[k] * p[j];
  }
  function parensBySplit(split, i, j) {
    if (i === j) return `A${i}`;
    const k = split(i, j);
    return `(${parensBySplit(split, i, k)}${parensBySplit(split, k + 1, j)})`;
  }

  global.MCMAlgo = { matrixChainOrder, printParens, bruteForce, memoized, greedy, splitLR, splitRL, costBySplit, parensBySplit };
})(window);
