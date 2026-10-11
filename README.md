# Analisis Algoritma Matrix Chain Multiplication

Tugas Analisis Algoritma Komputasi (Algoritma No. 15) — Sandi Mukti Lahambu, D082261025, Magister Teknik Informatika, Universitas Hasanuddin.

Situs: https://sandimukti.github.io/matrix-chain-multiplication/

## Isi repositori

| Berkas | Isi |
| --- | --- |
| `program/tugas.py` | Inti algoritma: `matrix_chain_order` (DP bottom-up), `print_parens`, `brute_force`, dan empat kasus uji |
| `program/eksperiment.py` | Tiga eksperimen: waktu DP vs n, DP vs brute force, studi kasus NumPy (termasuk pembanding `numpy.linalg.multi_dot`) |
| `program/hasil/` | Grafik PNG dan tabel CSV hasil eksperimen (dibuat oleh `eksperiment.py`) |
| `index.html` | Beranda situs, termasuk cuplikan program inti |
| `program.html` | Kode `tugas.py`, `assets/algoritma.js`, dan `eksperiment.py` dengan penjelasan baris demi baris |
| `assets/algoritma.js` | Algoritma utama versi JavaScript (terpisah dari kode tampilan) |
| `visualisasi.html` | Animasi pengisian tabel DP m[i, j] dan s[i, j] serta pohon pengurungan |
| `studi-kasus.html` | Tiga studi kasus: MLP linear, Jacobian × vektor, rantai heterogen |
| `perbandingan.html` | DP bottom-up vs memoisasi, brute force, greedy, dan urutan naif, dijalankan di peramban |
| `presentasi.html` | Slide presentasi 15 menit dengan catatan pembicara |
| `assets/` | CSS, JavaScript bersama, dan gambar |

## Pustaka

- Inti algoritma: Python standar (tanpa pustaka).
- Eksperimen: `numpy`, `matplotlib`.
- Situs: HTML, CSS, dan JavaScript murni (tanpa pustaka).

## Cara menjalankan

```
cd program
python tugas.py            # kasus uji kebenaran
python eksperiment.py      # eksperimen lengkap, sekitar 3–5 menit
cd ..
python -m http.server 8000 # lalu buka http://localhost:8000/
```

## Contoh keluaran

```
[OK] Contoh CLRS, enam matriks
    p = [30, 35, 15, 5, 10, 20, 25]
    biaya DP = 15125, brute force = 15125, harapan = 15125
    pengurungan optimal: ((A1(A2A3))((A4A5)A6))
```
