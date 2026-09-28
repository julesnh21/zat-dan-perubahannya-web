# Uji Pertama Codex

## Tujuan
Perbaiki halaman `pages/wujud-zat.html` dan `js/particles.js` tanpa mengubah struktur navigasi utama.

## Tugas
1. Tinjau akurasi representasi partikel padat, cair, dan gas.
2. Perbaiki simulasi agar:
   - padat: partikel tersusun relatif teratur dan hanya bergetar di sekitar posisi keseimbangan;
   - cair: partikel tetap berdekatan tetapi dapat saling berpindah;
   - gas: partikel bergerak lebih cepat, berjauhan, dan mengisi ruang.
3. Jangan menggambarkan partikel cair sebagai hanya berada di garis bawah yang kaku.
4. Tambahkan kontrol `Kecepatan model` yang hanya mengubah kecepatan animasi, bukan mengklaim sebagai temperatur absolut.
5. Tambahkan tombol reset.
6. Pastikan simulasi tetap responsif pada desktop dan mobile.
7. Jangan menambah framework atau dependency eksternal.
8. Pertahankan catatan bahwa visualisasi adalah model konseptual, bukan skala molekuler literal.
9. Periksa aksesibilitas keyboard untuk tombol Padat/Cair/Gas.
10. Setelah selesai, jelaskan file yang diubah dan alasan setiap perubahan.

## Kriteria penerimaan
- Tidak ada error JavaScript di console.
- Navigasi halaman tetap berfungsi.
- Animasi stabil setelah resize browser.
- Perbedaan tiga wujud mudah diamati secara visual.
- Tidak ada klaim sains baru yang tidak didukung oleh isi pembelajaran.
