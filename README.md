# PRESENSI OTOMATIS MAHASISWA SIMARI (SISTEM INFORMASI AKADEMIK UNIVERSITAS LAMBUNG MANGKURAT TERINTEGRASI)

Skrip ini digunakan untuk mahasiswa agar bisa melakukan presensi otomatis di simari. yang mana cara kerja skrip ini adalah skrip akan melakukan fetch atau request ke server setiap 5 menit dan mencek setiap matakuliah yang memiliki pertemuan dan melakukan request untuk presensi

Kode terbagi menjadi dua, yang pertama adalah script.js adalah kode yang dijalankan menggunakan node js. untuk menjalakan scriptnya bisa dengan mengeksekusi perintah di bawah pada terminal. yang mana hasil akan terlihat pada log.txt

```
node script.js
```

Perintah di atas akan menjalan skrip dan memberikan hasil yang muncul di log.txt

Yang kedua adalah script.gs, dimana skrip itu adalah kode yang dijalankan menggunakan Google Script atau Apps Script sehingga tidak memerlukan Node JS sebagai runtime. cara menjalankannya adalah dengan menggunakan Google Sheet kemudian pilih ekstensi dan pilih Apps Script. Masukkan skrip tadi kemudian jalankan trigger setiap 5 menit sekali.

perlu diingat bahwa agar skrip berjalan dengan normal pastikan `appstarter_session` diperbarui setiap minggu sehingga memungkinkan skrip mendapat cookie yang up to date.

### Hal yang perlu ada didalam skrip adalah

- Cookie Value dari appstarter_session
- Tahun Ajar

Data di atas dimasukkan kedalam variabel `initConfig`
