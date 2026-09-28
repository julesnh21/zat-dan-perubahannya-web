# Zat dan Perubahannya — Web Learning Prototype

Prototipe multimedia pembelajaran berbasis web untuk mahasiswa PGMI pada mata kuliah Konsep Dasar IPA.

## Tujuan prototipe
- Mengubah materi "Zat dan Perubahannya" menjadi pengalaman belajar web, bukan sekadar e-book digital.
- Menggabungkan fenomena makroskopik, model partikel, dan penjelasan konseptual.
- Menguji workflow GitHub + Codex untuk pengembangan multimedia InkuiriLab.

## Teknologi
- HTML5
- CSS3
- JavaScript vanilla
- Canvas API untuk simulasi partikel

Tidak ada build step atau dependency. Buka `index.html` melalui server lokal sederhana.

## Struktur
- `index.html` — beranda/orientasi
- `pages/wujud-zat.html` — simulasi partikel
- `pages/perubahan-wujud.html` — perubahan wujud dan model suhu
- `pages/fisika-kimia.html` — klasifikasi fenomena
- `assets/` — ilustrasi pembelajaran
- `js/` — interaksi

## Catatan ilmiah
Simulasi suhu merupakan model konseptual air pada tekanan mendekati 1 atm. Simulasi partikel tidak menggambarkan skala, bentuk, atau dinamika molekuler secara literal.

## Arah pengembangan
- Menghubungkan slider suhu ke animasi partikel secara kontinu.
- Membuat representasi makroskopik–submikroskopik–simbolik terkoordinasi.
- Menambahkan asesmen diagnostik dan feedback adaptif.
- Menambahkan aksesibilitas keyboard dan reduced-motion.
