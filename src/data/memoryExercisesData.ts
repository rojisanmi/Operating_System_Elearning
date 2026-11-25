// ============================================================
// memoryExercisesData.ts — Interactive Exercise Data for Memory Management
// ============================================================

export interface PagingExercise {
  id: string;
  type: 'paging-basic' | 'paging-physical';
  title: string;
  subtitle: string;
  description: string;
  given: {
    logicalAddress: number;
    pageSize: string;
    pageSizePower: number;
    addressingBits: number;
    memorySize?: string;
    pageTable?: { page: number; frame: number; frameBinary: string }[];
  };
  answers: {
    binaryLogical: string;
    offsetBits: number;
    pageBits: number;
    pageNumber: number;
    pageBinary: string;
    offsetBinary: string;
    offsetDecimal: number;
    frameNumber?: number;
    frameBinary?: string;
    physicalAddressBinary?: string;
    physicalAddressDecimal?: number;
  };
  steps: {
    title: string;
    explanation: string;
  }[];
}

export interface SegmentationExercise {
  id: string;
  type: 'segmentation';
  title: string;
  subtitle: string;
  description: string;
  given: {
    logicalAddress: number;
    addressingBits: number;
    segmentTable: {
      segment: number;
      lengthBinary: string;
      lengthDecimal: number;
      baseBinary: string;
      baseDecimal: number;
    }[];
  };
  answers: {
    binaryLogical: string;
    offsetBits: number;
    segmentBits: number;
    totalSegments: number;
    segmentNumber: number;
    segmentBinary: string;
    offsetBinary: string;
    offsetDecimal: number;
    targetLengthBinary: string;
    targetLengthDecimal: number;
    isValid: boolean;
    validationReason: string;
    targetBaseBinary: string;
    physicalAddressBinary: string;
    physicalAddressDecimal: number;
  };
  steps: {
    title: string;
    explanation: string;
  }[];
}

export interface VirtualMemoryReplacementExercise {
  id: string;
  type: 'virtual-memory';
  title: string;
  subtitle: string;
  description: string;
  given: {
    pas: number[];
    numFrames: number;
  };
  algorithms: {
    optimal: {
      name: string;
      grid: (number | null)[][]; // [frameIndex][stepIndex]
      faults: boolean[];
      faultRatio: string;
      hitRatio: string;
      explanation: string;
    };
    lru: {
      name: string;
      grid: (number | null)[][];
      faults: boolean[];
      faultRatio: string;
      hitRatio: string;
      explanation: string;
    };
    fifo: {
      name: string;
      grid: (number | null)[][];
      faults: boolean[];
      faultRatio: string;
      hitRatio: string;
      explanation: string;
    };
    clock: {
      name: string;
      grid: (string | null)[][]; // strings like "2*", "3"
      pointers: (number | null)[];
      faults: boolean[];
      faultRatio: string;
      hitRatio: string;
      explanation: string;
    };
  };
}

// ── Soal 1: Paging Sederhana (Basic Page & Offset) ────────────
export const pagingSoal1: PagingExercise = {
  id: 'paging-1',
  type: 'paging-basic',
  title: 'Soal 1: Paging Sederhana',
  subtitle: 'Konversi Alamat Logika ke No. Page & Offset (Pengalamatan 16 Bit)',
  description:
    'Diketahui alamat logika 2050 dengan ukuran page 2KB pada pengalamatan 16 bit. Pada page dan offset ke berapa alamat 2050?',
  given: {
    logicalAddress: 2050,
    pageSize: '2 KB',
    pageSizePower: 11, // 2 KB = 2^11 Byte
    addressingBits: 16,
  },
  answers: {
    binaryLogical: '0000100000000010', // 2050
    offsetBits: 11,
    pageBits: 5, // 16 - 11 = 5
    pageNumber: 1,
    pageBinary: '00001',
    offsetBinary: '00000000010', // 11 bits: 2
    offsetDecimal: 2,
  },
  steps: [
    {
      title: 'Langkah 1: Konversi Alamat Logika ke Biner 16 Bit',
      explanation:
        'Alamat logika 2050 diubah ke biner: 2050 = 2048 + 2 = 2^11 + 2^1 = 0000 1000 0000 0010 (16 bit).',
    },
    {
      title: 'Langkah 2: Hitung Panjang Bit Offset',
      explanation:
        'Ukuran page = 2 KB = 2 × 2^10 Byte = 2^1 × 2^10 = 2^11 Byte.\nSehingga panjang bit offset = 11 bit.',
    },
    {
      title: 'Langkah 3: Hitung Panjang Bit No. Page',
      explanation:
        'Panjang bit No. Page = Pengalamatan Bit − Panjang Bit Offset\n= 16 − 11 = 5 bit.',
    },
    {
      title: 'Langkah 4: Pisahkan Bit No. Page & Offset',
      explanation:
        'Biner: [ 00001 | 000 0000 0010 ]\n• 5 bit pertama (No. Page) = 00001 (biner) = 1 (desimal / #1)\n• 11 bit sisa (Offset) = 000 0000 0010 (biner) = 2 (desimal).',
    },
  ],
};

// ── Soal 2: Paging & Alamat Fisik Page Table ─────────────────
export const pagingSoal2: PagingExercise = {
  id: 'paging-2',
  type: 'paging-physical',
  title: 'Soal 2: Paging & Alamat Fisik',
  subtitle: 'Pemetaan Page Table ke No. Frame & Alamat Fisik Memori',
  description:
    'Diketahui komputer dengan memori 64 KB dengan ukuran page 4KB. Asumsi satu alamat menampung 1 byte. Berapa alamat fisik dari alamat logika 2050 jika page table terlampir?',
  given: {
    logicalAddress: 2050,
    pageSize: '4 KB',
    pageSizePower: 12, // 4 KB = 2^12 Byte
    addressingBits: 16,
    memorySize: '64 KB',
    pageTable: [
      { page: 0, frame: 6, frameBinary: '00110' },
      { page: 1, frame: 9, frameBinary: '01001' },
      { page: 2, frame: 11, frameBinary: '01011' },
      { page: 3, frame: 1, frameBinary: '00001' },
    ],
  },
  answers: {
    binaryLogical: '0000100000000010',
    offsetBits: 12,
    pageBits: 4, // 16 - 12 = 4
    pageNumber: 0,
    pageBinary: '0000',
    offsetBinary: '100000000010', // 12 bits: 2050
    offsetDecimal: 2050,
    frameNumber: 6,
    frameBinary: '00110',
    physicalAddressBinary: '0110100000000010', // atau 00110 + 1000 0000 0010
    physicalAddressDecimal: 26626,
  },
  steps: [
    {
      title: 'Langkah 1: Tentukan Pengalamatan Bit Sistem',
      explanation:
        'Kapasitas memori = 64 KB = 2^6 × 2^10 = 2^16 Byte. Maka sistem menggunakan pengalamatan 16 bit.',
    },
    {
      title: 'Langkah 2: Konversi Alamat Logika ke Biner',
      explanation:
        '2050 (desimal) = 0000 1000 0000 0010 (biner 16 bit).',
    },
    {
      title: 'Langkah 3: Hitung Panjang Bit Offset & No. Page',
      explanation:
        'Ukuran page = 4 KB = 4 × 2^10 = 2^2 × 2^10 = 2^12 Byte.\n• Panjang bit Offset = 12 bit\n• Panjang bit No. Page = 16 − 12 = 4 bit.',
    },
    {
      title: 'Langkah 4: Tentukan No. Page & Lookup Page Table',
      explanation:
        'Pemisahan biner: [ 0000 | 1000 0000 0010 ]\n• No. Page = 0000 = #0\n• Offset = 1000 0000 0010 (2050)\nLookup Page Table pada Page #0 → Frame = 00110 (desimal 6).',
    },
    {
      title: 'Langkah 5: Hitung Alamat Fisik',
      explanation:
        'Alamat Fisik = No. Frame + Offset\nBiner: 0110 (atau 00110) digabung dengan 1000 0000 0010\n= 0110 1000 0000 0010 (biner)\nDesimal = (6 × 4096) + 2050 = 24576 + 2050 = 26626.',
    },
  ],
};

// ── Soal 3: Segmentasi Sederhana ─────────────────────────────
export const segmentationSoal: SegmentationExercise = {
  id: 'segmentasi-1',
  type: 'segmentation',
  title: 'Soal 3: Segmentasi Sederhana',
  subtitle: 'Analisis Segment Table, Limit Check (Length > Offset), & Alamat Fisik',
  description:
    'Diketahui alamat logic: 875 pada konsep segmentasi sederhana dan segment table terlampir. Hitung banyak segmen, nomor segmen, panjang offset biner, validitas, dan alamat fisik!',
  given: {
    logicalAddress: 875,
    addressingBits: 16,
    segmentTable: [
      {
        segment: 0,
        lengthBinary: '011000110110',
        lengthDecimal: 1590,
        baseBinary: '0011100010100011',
        baseDecimal: 14507,
      },
      {
        segment: 1,
        lengthBinary: '010000000011',
        lengthDecimal: 1027,
        baseBinary: '0010101011000001',
        baseDecimal: 10945,
      },
      {
        segment: 2,
        lengthBinary: '001100111101',
        lengthDecimal: 829,
        baseBinary: '1010111010001110',
        baseDecimal: 44686,
      },
      {
        segment: 3,
        lengthBinary: '010001100001',
        lengthDecimal: 1121,
        baseBinary: '0101010110110010',
        baseDecimal: 21938,
      },
    ],
  },
  answers: {
    binaryLogical: '0000001101101011', // 875
    offsetBits: 12,
    segmentBits: 4, // 16 - 12 = 4
    totalSegments: 16, // 2^4 = 16
    segmentNumber: 0,
    segmentBinary: '0000',
    offsetBinary: '001101101011', // 875 in 12-bit
    offsetDecimal: 875,
    targetLengthBinary: '011000110110', // 1590
    targetLengthDecimal: 1590,
    isValid: true,
    validationReason:
      'Length (0110 0011 0110 = 1590) > Offset (0011 0110 1011 = 875) → Segmen Valid!',
    targetBaseBinary: '0011100010100011',
    physicalAddressBinary: '0011110000001110', // 14507 + 875 = 15382
    physicalAddressDecimal: 15382,
  },
  steps: [
    {
      title: 'Langkah a: Banyaknya Segment yang Terbentuk',
      explanation:
        'Pengalamatan bit = 16 bit.\n875 (10) = 0000 0011 0110 1011 (2).\nPanjang bit offset = 12 bit (sesuai panjang bit kolom Length).\nPanjang bit No. Segmen = 16 − 12 = 4 bit.\nBanyaknya segmen yang terbentuk = 2^4 = 16 segmen.',
    },
    {
      title: 'Langkah b: Nomor Segmen Alamat Tersebut',
      explanation:
        'No. Segmen diambil dari 4 bit paling depan (kiri):\nNo. Segmen = 0000 = Segmen #0.',
    },
    {
      title: 'Langkah c: Panjang Offset dari Segmen Tersebut',
      explanation:
        'Offset diambil dari 12 bit berikutnya (kanan):\nOffset = 0011 0110 1011 (biner 12 bit) = 875 (desimal).',
    },
    {
      title: 'Langkah d: Pengecekan Validitas & Perhitungan Alamat Fisik',
      explanation:
        'Pemeriksaan batas (Limit Check):\n• Length Segmen 0 = 0110 0011 0110 (1590)\n• Offset = 0011 0110 1011 (875)\nKarena Length (1590) > Offset (875), maka segmen VALID!\n\nHitung Alamat Fisik = Base + Offset (Penjumlahan Biner):\n  Base:   0011 1000 1010 0011\n  Offset: 0000 0011 0110 1011\n  ---------------------------- +\n  Hasil:  0011 1100 0000 1110 (desimal 15382).',
    },
  ],
};

// ── Soal 4: Virtual Memory Replacement Simulation (from Excel) ─
export const virtualMemorySoal: VirtualMemoryReplacementExercise = {
  id: 'virtual-memori-1',
  type: 'virtual-memory',
  title: 'Soal 4: Simulasi Page Replacement Virtual Memori',
  subtitle: 'Studi Komparasi 4 Algoritma: Optimal, LRU, FIFO, dan Clock Policy 1-Bit',
  description:
    'Diberikan Page Address Stream (PAS): 2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2 dengan jumlah kapasitas 3 Page Frame. Simulasikan dan hitung Fault Ratio (FR) serta Hit Ratio (HR) untuk ke-4 algoritma!',
  given: {
    pas: [2, 3, 2, 1, 5, 2, 4, 5, 3, 2, 5, 2],
    numFrames: 3,
  },
  algorithms: {
    optimal: {
      name: 'Optimal (OPT)',
      grid: [
        // Frame 1
        [2, 2, 2, 2, 2, 2, 4, 4, 4, 2, 2, 2],
        // Frame 2
        [null, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        // Frame 3
        [null, null, null, 1, 5, 5, 5, 5, 5, 5, 5, 5],
      ],
      faults: [false, false, false, false, true, false, true, false, false, true, false, false],
      faultRatio: '3 / 12',
      hitRatio: '9 / 12',
      explanation:
        'Cek ke arah KANAN. Pada step ke-5 (page 5), page 1 diganti karena tidak dipakai lagi. Pada step ke-7 (page 4), page 2 diganti karena paling lama baru dipakai lagi. Pada step ke-10 (page 2), page 4 diganti. Total replacement fault = 3 kali.',
    },
    lru: {
      name: 'Least Recently Used (LRU)',
      grid: [
        // Frame 1
        [2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3],
        // Frame 2
        [null, 3, 3, 3, 5, 5, 5, 5, 5, 5, 5, 5],
        // Frame 3
        [null, null, null, 1, 1, 1, 4, 4, 4, 2, 2, 2],
      ],
      faults: [false, false, false, false, true, false, true, false, true, true, false, false],
      faultRatio: '4 / 12',
      hitRatio: '8 / 12',
      explanation:
        'Cek ke arah KIRI. Pada step ke-5 (page 5), page 3 paling lama tidak dipakai (diganti). Pada step ke-7 (page 4), page 1 paling lama tidak dipakai (diganti). Pada step ke-9 (page 3), page 2 diganti. Pada step ke-10 (page 2), page 4 diganti. Total replacement fault = 4 kali.',
    },
    fifo: {
      name: 'First-In-First-Out (FIFO)',
      grid: [
        // Frame 1
        [2, 2, 2, 2, 5, 5, 5, 5, 3, 3, 3, 3],
        // Frame 2
        [null, 3, 3, 3, 3, 2, 2, 2, 2, 2, 5, 5],
        // Frame 3
        [null, null, null, 1, 1, 1, 4, 4, 4, 4, 4, 2],
      ],
      faults: [false, false, false, false, true, true, true, false, true, false, true, true],
      faultRatio: '6 / 12',
      hitRatio: '6 / 12',
      explanation:
        'Page yang masuk paling awal diganti pertama kali. Mengalami 6 kali replacement fault karena page yang sering dibutuhkan ikut tergeser. FR = 6/12, HR = 6/12.',
    },
    clock: {
      name: 'Clock Policy 1-Bit',
      grid: [
        // Frame 1
        ['2*', '2*', '2*', '2*', '5*', '5*', '5*', '5*', '3*', '3*', '3*', '3*'],
        // Frame 2
        [null, '3*', '3*', '3*', '3', '2*', '2*', '2*', '2', '2*', '2', '2*'],
        // Frame 3
        [null, null, null, '1*', '1', '1', '4*', '4*', '4', '4', '5*', '5*'],
      ],
      pointers: [1, 2, 2, 0, 1, 2, 0, 0, 1, 1, 0, 0], // Pointer position (0, 1, 2)
      faults: [false, false, false, false, true, true, true, false, true, false, true, false],
      faultRatio: '5 / 12',
      hitRatio: '7 / 12',
      explanation:
        'Menggunakan bit use (*) dan pointer (→). Jika menemukan bit 1, ubah menjadi 0. Jika menemukan bit 0, replace dengan page baru dan set bit use = 1*. Total fault = 5 kali. FR = 5/12, HR = 7/12.',
    },
  },
};
