# Responsi Sisop: Deadlock Interactive Board 🚀

Aplikasi web interaktif pembelajaran Sistem Operasi (khususnya materi **Deadlock**) dengan antarmuka bergaya *infinite canvas* (Miro/FigJam).

## ✨ Fitur Utama

1. **Infinite Miro-Style Canvas**:
   - Pan dengan klik-kanan tarik (*drag*), cegah menu konteks bawaan browser.
   - Zoom halus dengan scroll mouse berpusat pada kursor dan widget kontrol on-screen (+ / − / *Fit to Screen*).
   - Latar belakang *dot grid* responsif.

2. **Ephemeral Highlighter (Stabilo Interaktif)**:
   - 5 paleta warna transparan pastel.
   - 3 pilihan ukuran kuas (Kecil, Sedang, Tebal).
   - Hardware-accelerated GPU 2D rendering tanpa lag.
   - Tombol *Hapus Stabilo* instan.

3. **Mind Map Interaktif Deadlock**:
   - Diagram RAG (*Resource Allocation Graph*) dengan panah menyentuh node proses secara presisi.
   - 4 Kondisi Deadlock (*Mutual Exclusion, Hold and Wait, No Preemption, Circular Wait*) lengkap dengan kartu ilustrasi RAG.
   - 3 Metode Penanganan (*Prevention, Avoidance dengan Banker's Algorithm, dan Detection*).
   - Kartu tooltip interaktif saat hover/klik pada setiap konsep.

4. **Modul Latihan Soal Interaktif**:
   - 4 Latihan Soal komprehensif (Avoidance 1, Avoidance 2 bertahap $t_0/t_1/t_2$, Detection 1, dan Detection 2).
   - Validasi otomatis matriks dan jawaban dengan umpan balik visual (*green/red*).
   - Kotretan langkah demi langkah yang dapat dibuka-tutup (*accordion*).
   - Tombol *Reset Jawaban* dan *Kunci Jawaban*.

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Deployment**: Vercel ready (`vercel.json`)

## 🚀 Menjalankan Secara Lokal

```bash
# Install dependencies
npm install

# Jalankan server development
npm run dev

# Build untuk produksi
npm run build
```
