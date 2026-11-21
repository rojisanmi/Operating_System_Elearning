// ============================================================
// memoryMindmapData.ts — Data & Content for Memory Management & Virtual Memory
// ============================================================

export interface MemoryNodeDescription {
  title: string;
  category: 'Paging' | 'Segmentasi' | 'Virtual Memori' | 'Replacement Policy';
  points: string[];
}

export const memoryNodeDescriptions: Record<string, MemoryNodeDescription> = {
  'manajemen-memori': {
    title: 'Manajemen Memori (Memory Management)',
    category: 'Paging',
    points: [
      'Konsep utama: Memecah proses menjadi bagian-bagian kecil yang disimpan secara terpisah dan mungkin tidak berurut di memori fisik.',
      'Menghilangkan kebutuhan alokasi memori secara contiguous (bersebelahan).',
      'Terdiri dari dua metode dasar utama: Paging Sederhana dan Segmentasi Sederhana.',
    ],
  },
  'paging-sederhana': {
    title: 'Paging Sederhana (Simple Paging)',
    category: 'Paging',
    points: [
      'Memori utama dibagi menjadi potongan-potongan kecil berukuran sama yang disebut Frame.',
      'Proses dibagi menjadi potongan-potongan berukuran sama yang disebut Page (ukuran Page = ukuran Frame).',
      'CPU menghasilkan Alamat Logika = [ No. Page | Offset ].',
      'Page Table memetakan No. Page ke No. Frame fisik.',
      'Alamat Fisik = [ No. Frame | Offset ].',
    ],
  },
  'paging-step1': {
    title: 'Langkah 1: Pengalamatan Bit Memori',
    category: 'Paging',
    points: [
      'Informasi kapasitas memori menentukan total panjang bit alamat.',
      'Contoh: Komputer berkapasitas 64 KB = 2^6 × 2^10 = 2^16 Byte.',
      'Sehingga panjang pengalamatan alamat adalah 16 bit.',
    ],
  },
  'paging-step2': {
    title: 'Langkah 2: Konversi Alamat Logika ke Biner',
    category: 'Paging',
    points: [
      'Ubah nilai desimal alamat logika yang dihasilkan CPU menjadi bentuk biner 16 bit.',
      'Contoh: 2050 (desimal) = 0000 1000 0000 0010 (biner 16 bit).',
    ],
  },
  'paging-step3': {
    title: 'Langkah 3: Hitung Bit No. Page & Offset',
    category: 'Paging',
    points: [
      'Panjang bit offset dihitung dari ukuran page: Ukuran Page = 2^Offset.',
      'Contoh 1: Page 2 KB = 2^11 B → Panjang Offset = 11 bit.',
      'Contoh 2: Page 4 KB = 2^12 B → Panjang Offset = 12 bit.',
      'Panjang bit No. Page = Total Bit Alamat − Panjang Bit Offset (16 − 12 = 4 bit).',
    ],
  },
  'paging-step4': {
    title: 'Langkah 4: Pemisahan No. Page & Offset',
    category: 'Paging',
    points: [
      'Potong biner alamat logika sesuai pembagian bit yang didapat.',
      'Bit-bit di sebelah kiri = No. Page (p).',
      'Bit-bit di sebelah kanan = Offset (d).',
    ],
  },
  'paging-step5': {
    title: 'Langkah 5: Lookup ke Page Table',
    category: 'Paging',
    points: [
      'Cari nomor Frame fisik pada Page Table berdasarkan No. Page yang telah didapat.',
      'Setiap baris pada Page Table berisi pemetaan No. Page ke Frame nomor berapa di RAM fisik.',
    ],
  },
  'paging-step6': {
    title: 'Langkah 6: Pembentukan Alamat Fisik',
    category: 'Paging',
    points: [
      'Ganti (replace) No. Page dengan No. Frame hasil lookup tabel.',
      'Gabungkan bit No. Frame dengan bit Offset yang tetap tidak berubah.',
      'Alamat Fisik = [ No. Frame | Offset ].',
      'Konversi biner alamat fisik kembali ke desimal jika diminta di soal.',
    ],
  },
  'segmentasi-sederhana': {
    title: 'Segmentasi Sederhana (Simple Segmentation)',
    category: 'Segmentasi',
    points: [
      'Memecah program menjadi modul-modul logis dengan ukuran yang dinamis/bervariasi (segmen fungsi, stack, data, array).',
      'Alamat Logika terdiri dari: [ No. Segmen | Offset ].',
      'Segment Table memuat dua kolom: Length (panjang batas) dan Base (alamat awal di memori fisik).',
      'Wajib melakukan pengecekan validitas: Offset HARUS lebih kecil dari Length!',
    ],
  },
  'seg-step1': {
    title: 'Langkah 1: Pengalamatan Bit dari Base',
    category: 'Segmentasi',
    points: [
      'Panjang bit pengalamatan sistem sama dengan panjang bit alamat Base pada Segment Table.',
      'Contoh: Kolom Base terdiri dari 16 bit → Total pengalamatan bit adalah 16 bit.',
    ],
  },
  'seg-step2': {
    title: 'Langkah 2: Konversi Alamat Logika ke Biner',
    category: 'Segmentasi',
    points: [
      'Ubah alamat logika desimal menjadi bentuk biner sesuai total panjang bit pengalamatan.',
      'Contoh: 875 (desimal) = 0000 0011 0110 1011 (biner 16 bit).',
    ],
  },
  'seg-step3': {
    title: 'Langkah 3: Hitung Panjang Bit Segmen & Offset',
    category: 'Segmentasi',
    points: [
      'Panjang bit Offset = Panjang bit kolom Length pada Segment Table (misal 12 bit).',
      'Panjang bit No. Segmen = Total Bit − Panjang Bit Offset (16 − 12 = 4 bit).',
      'Kapasitas segmen maksimal yang dapat dibentuk = 2^x (x = panjang bit segmen, misal 2^4 = 16 segmen).',
    ],
  },
  'seg-step4': {
    title: 'Langkah 4: Pisahkan No. Segmen & Offset',
    category: 'Segmentasi',
    points: [
      '4 bit pertama sebelah kiri = No. Segmen (S).',
      '12 bit berikutnya sebelah kanan = Offset (d).',
      'Cari baris No. Segmen tersebut pada Segment Table untuk mengambil nilai Length & Base-nya.',
    ],
  },
  'seg-step5': {
    title: 'Langkah 5: Cek Validasi Segmen (Length > Offset)',
    category: 'Segmentasi',
    points: [
      'Pemeriksaan keamanan batas memori (Limit Check):',
      'Bandingkan: Apakah Length > Offset ?',
      'Jika Length > Offset → VALID! Lanjut ke perhitungan alamat fisik.',
      'Jika Length ≤ Offset → INVALID! Terjadi Trap Error (Segmentation Fault) karena program mencoba mengakses melebihi batas segmen.',
    ],
  },
  'seg-step6': {
    title: 'Langkah 6: Hitung Alamat Fisik (Base + Offset)',
    category: 'Segmentasi',
    points: [
      'Alamat Fisik dihitung dengan menjumlahkan Base dengan Offset secara biner.',
      'Alamat Fisik = Base + Offset.',
      'Contoh: Base (0011 1000 1010 0011) + Offset (0011 0110 1011) = 0011 1100 0000 1110.',
    ],
  },
  'virtual-memori': {
    title: 'Virtual Memori (Virtual Memory)',
    category: 'Virtual Memori',
    points: [
      'Teknik yang memisahkan memori logika pengguna dari memori fisik riil.',
      'Memungkinkan eksekusi proses yang ukurannya melebihi kapasitas RAM fisik yang tersedia.',
      'Hanya bagian proses yang sedang dibutuhkan saja yang dimuat ke frame RAM (Demand Paging).',
      'Memiliki 3 kebijakan utama: Fetch Policy, Placement Policy, dan Replacement Policy.',
    ],
  },
  'fetch-policy': {
    title: 'Fetch Policy',
    category: 'Virtual Memori',
    points: [
      'Menentukan KAPAN sebuah page harus dibawa dari secondary storage (disk) ke memori utama (RAM).',
      'Demand Paging: Page hanya dibawa saat pertama kali direferensikan/dibutuhkan oleh CPU (menimbulkan page fault awal).',
      'Prepaging: Membawa beberapa page berurutan sekaligus lebih awal sebelum direferensikan untuk efisiensi transfer disk.',
    ],
  },
  'placement-policy': {
    title: 'Placement Policy',
    category: 'Virtual Memori',
    points: [
      'Menentukan DI MANA (di frame fisik mana) page yang baru diambil akan diletakkan di dalam memori utama.',
      'Pada sistem paging murni, posisi frame mana pun sama saja (tidak berpengaruh signifikan karena hardware address translation otomatis memetakan frame mana saja).',
    ],
  },
  'replacement-policy': {
    title: 'Replacement Policy',
    category: 'Replacement Policy',
    points: [
      'Menentukan page mana di dalam memori fisik yang harus DITIMPA / DIKELUARKAN (swap out) saat semua frame penuh dan page baru ingin masuk.',
      'Tujuan: Meminimalkan angka terjadinya Page Fault.',
      '4 Algoritma umum: Optimal, LRU, FIFO, dan Clock Policy 1-Bit.',
    ],
  },
  'optimal': {
    title: 'Algoritma Optimal (OPT / MIN)',
    category: 'Replacement Policy',
    points: [
      'Prinsip: Mereplace page yang paling lama tidak akan digunakan di masa depan, atau tidak digunakan lagi sama sekali.',
      'Cara cek praktis: Lihat deretan page masuk ke arah KANAN (ke depan).',
      'Kelebihan: Menghasilkan Page Fault paling sedikit (efisiensi teoritis terbaik).',
      'Kekurangan: Tidak mungkin diimplementasikan di dunia nyata karena OS tidak dapat meramal masa depan secara pasti.',
      'Fungsi: Hanya digunakan sebagai standar acuan (benchmark) untuk mengukur kualitas algoritma lain.',
    ],
  },
  'lru': {
    title: 'Least Recently Used (LRU)',
    category: 'Replacement Policy',
    points: [
      'Prinsip: Mereplace page yang paling lama tidak pernah diakses di masa lalu.',
      'Cara cek praktis: Lihat deretan page masuk ke arah KIRI (ke belakang / masa lalu).',
      'Kelebihan: Menghasilkan performa mendekati algoritma Optimal.',
      'Kekurangan: Sulit diimplementasikan secara efisien di hardware karena membutuhkan pencatatan timestamp atau stack per setiap akses memori (overhead tinggi).',
    ],
  },
  'fifo': {
    title: 'First-In-First-Out (FIFO)',
    category: 'Replacement Policy',
    points: [
      'Prinsip: Mereplace page yang paling lama berada di dalam frame memori (yang masuk paling awal).',
      'Cara kerja: Menggunakan struktur antrean sederhana (Queue). Page paling depan antrean di-replace.',
      'Kelebihan: Sangat mudah dipahami dan diimplementasikan dengan antrean pointer.',
      'Kekurangan: Angka Page Fault sering kali tinggi karena page penting yang sering diakses bisa ikut terbuang hanya karena sudah lama di memori. Rentan terhadap Belady’s Anomaly.',
    ],
  },
  'clock-policy': {
    title: 'Clock Policy (Second Chance Algorithm 1-Bit)',
    category: 'Replacement Policy',
    points: [
      'Prinsip: Meniru algoritma LRU dengan overhead hardware yang jauh lebih ringan menggunakan circular list (seperti jarum jam) dan 1 bit use.',
      'Bit Use: 1 dilambangkan tanda bintang (*) = page baru dipakai; 0 dilambangkan kosong ( ) = belum dipakai lagi.',
      'Pointer (→): Menunjuk ke frame kandidat yang akan diperiksa berikutnya.',
      'Aturan Tracing: Jika menemukan bit 1 (*), ubah menjadi 0 (beri kesempatan kedua) dan geser pointer. Jika menemukan bit 0, langsung replace dengan page baru!',
    ],
  },
};

export const pasSequence = [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2];
