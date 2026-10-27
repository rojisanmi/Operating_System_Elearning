// ============================================================
// exercisesData.ts — All 4 exercise problems with answers
// ============================================================

export interface ExerciseProcess {
  name: string;
  allocation: number[];
  maxDemand?: number[];  // C matrix (Avoidance)
  request?: number[];    // Q matrix (Detection)
}

export interface ExecutionStep {
  process: string;
  availableAfter: number[];
}

export interface AvoidanceExercise {
  type: 'avoidance';
  title: string;
  description?: string;
  resourceNames: string[];
  resourceVector: number[];
  processes: ExerciseProcess[];
  answers: {
    totalAllocation: number[];
    stillNeeds: number[][]; // C - A
    initialAvailable: number[];
    executionOrder: ExecutionStep[];
    status: 'SAFE' | 'UNSAFE';
    reason?: string;
  };
}

export interface AvoidanceMultiStepExercise {
  type: 'avoidance-multi';
  title: string;
  resourceNames: string[];
  resourceVector: number[];
  parts: {
    label: string;
    description: string;
    processes: ExerciseProcess[];
    requestInfo?: { process: string; request: number[] };
    answers: {
      totalAllocation: number[];
      stillNeeds: number[][];
      initialAvailable: number[];
      executionOrder: ExecutionStep[];
      status: 'SAFE' | 'UNSAFE';
      reason?: string;
    };
  }[];
}

export interface DetectionExercise {
  type: 'detection';
  title: string;
  resourceNames: string[];
  resourceVector?: number[];
  initialAvailable: number[];
  processes: ExerciseProcess[];
  answers: {
    totalAllocation?: number[];
    availableW: number[];
    markedProcesses: {
      process: string;
      request: number[];
      allocation: number[];
      wAfter: number[];
    }[];
    status: 'SAFE' | 'UNSAFE';
    reason: string;
  };
}

export interface PseudocodeQuestion {
  id: string;
  question: string;
  type: 'choice' | 'number';
  options?: string[];
  correctAnswer: string | number;
  explanation: string;
}

export interface DiningPhilosopherExercise {
  type: 'dining-philosopher';
  title: string;
  subtitle: string;
  contextDescription: string;
  pseudocode: string;
  codeBreakdown: { line: string; desc: string }[];
  questions: PseudocodeQuestion[];
  fullKotretan: { title: string; steps: string[] }[];
}

export type Exercise =
  | AvoidanceExercise
  | AvoidanceMultiStepExercise
  | DetectionExercise
  | DiningPhilosopherExercise;

// ── Soal 1: Avoidance 1 ──────────────────────────────────────
export const avoidance1: AvoidanceExercise = {
  type: 'avoidance',
  title: 'Avoidance 1',
  description: "Banker's Algorithm Dasar — 3 Resource, 4 Proses",
  resourceNames: ['R1', 'R2', 'R3'],
  resourceVector: [9, 3, 6],
  processes: [
    { name: 'P1', allocation: [1, 0, 0], maxDemand: [3, 2, 2] },
    { name: 'P2', allocation: [6, 1, 2], maxDemand: [6, 1, 3] },
    { name: 'P3', allocation: [2, 1, 1], maxDemand: [3, 1, 4] },
    { name: 'P4', allocation: [0, 0, 2], maxDemand: [4, 2, 2] },
  ],
  answers: {
    totalAllocation: [9, 2, 5],
    stillNeeds: [
      [2, 2, 2],
      [0, 0, 1],
      [1, 0, 3],
      [4, 2, 0],
    ],
    initialAvailable: [0, 1, 1],
    executionOrder: [
      { process: 'P2', availableAfter: [6, 2, 3] },
      { process: 'P4', availableAfter: [6, 2, 5] },
      { process: 'P1', availableAfter: [7, 2, 5] },
      { process: 'P3', availableAfter: [9, 3, 6] },
    ],
    status: 'SAFE',
  },
};

// ── Soal 2: Avoidance 2 (Multi-step: T0, T1, T2) ────────────
export const avoidance2: AvoidanceMultiStepExercise = {
  type: 'avoidance-multi',
  title: 'Avoidance 2',
  resourceNames: ['R1', 'R2', 'R3'],
  resourceVector: [9, 10, 8],
  parts: [
    {
      label: 'A',
      description: 'Kondisi T0',
      processes: [
        { name: 'P0', allocation: [2, 0, 1], maxDemand: [7, 2, 3] },
        { name: 'P1', allocation: [2, 1, 2], maxDemand: [2, 2, 4] },
        { name: 'P2', allocation: [2, 1, 0], maxDemand: [9, 3, 1] },
        { name: 'P3', allocation: [0, 2, 1], maxDemand: [1, 6, 2] },
        { name: 'P4', allocation: [1, 3, 2], maxDemand: [3, 4, 3] },
      ],
      answers: {
        totalAllocation: [7, 7, 6],
        stillNeeds: [
          [5, 2, 2],
          [0, 1, 2],
          [7, 2, 1],
          [1, 4, 1],
          [2, 1, 1],
        ],
        initialAvailable: [2, 3, 2],
        executionOrder: [
          { process: 'P1', availableAfter: [4, 4, 4] },
          { process: 'P3', availableAfter: [4, 6, 5] },
          { process: 'P4', availableAfter: [5, 9, 7] },
          { process: 'P0', availableAfter: [7, 9, 8] },
          { process: 'P2', availableAfter: [9, 10, 8] },
        ],
        status: 'SAFE',
      },
    },
    {
      label: 'B',
      description: 'Jika ada penambahan request (2,0,0) pada P2 di T1 bagaimana state keseluruhan eksekusi proses?',
      requestInfo: { process: 'P2', request: [2, 0, 0] },
      processes: [
        { name: 'P0', allocation: [2, 0, 1], maxDemand: [7, 2, 3] },
        { name: 'P1', allocation: [2, 1, 2], maxDemand: [2, 2, 4] },
        { name: 'P2', allocation: [4, 1, 0], maxDemand: [9, 3, 1] },
        { name: 'P3', allocation: [0, 2, 1], maxDemand: [1, 6, 2] },
        { name: 'P4', allocation: [1, 3, 2], maxDemand: [3, 4, 3] },
      ],
      answers: {
        totalAllocation: [9, 7, 6],
        stillNeeds: [
          [5, 2, 2],
          [0, 1, 2],
          [5, 2, 1],
          [1, 4, 1],
          [2, 1, 1],
        ],
        initialAvailable: [0, 3, 2],
        executionOrder: [
          { process: 'P1', availableAfter: [2, 4, 4] },
          { process: 'P3', availableAfter: [2, 6, 5] },
          { process: 'P4', availableAfter: [3, 9, 7] },
        ],
        status: 'UNSAFE',
        reason: 'Terjadi deadlock — Jumlah available resource tidak memenuhi needs proses manapun (P0 dan P2 blocked).',
      },
    },
    {
      label: 'C',
      description: 'Jika ada penambahan request (0,3,1) pada P3 di T2 bagaimana state keseluruhan eksekusi proses?',
      requestInfo: { process: 'P3', request: [0, 3, 1] },
      processes: [
        { name: 'P0', allocation: [2, 0, 1], maxDemand: [7, 2, 3] },
        { name: 'P1', allocation: [2, 1, 2], maxDemand: [2, 2, 4] },
        { name: 'P2', allocation: [4, 1, 0], maxDemand: [9, 3, 1] },
        { name: 'P3', allocation: [0, 5, 2], maxDemand: [1, 6, 2] },
        { name: 'P4', allocation: [1, 3, 2], maxDemand: [3, 4, 3] },
      ],
      answers: {
        totalAllocation: [9, 10, 7],
        stillNeeds: [
          [5, 2, 2],
          [0, 1, 2],
          [5, 2, 1],
          [1, 1, 0],
          [2, 1, 1],
        ],
        initialAvailable: [0, 0, 1],
        executionOrder: [],
        status: 'UNSAFE',
        reason: 'Jumlah available resource tidak memenuhi needs proses manapun.',
      },
    },
  ],
};

// ── Soal 3: Detection 1 ─────────────────────────────────────
export const detection1: DetectionExercise = {
  type: 'detection',
  title: 'Detection 1',
  resourceNames: ['R1', 'R2', 'R3', 'R4', 'R5'],
  resourceVector: [2, 1, 1, 2, 1],
  initialAvailable: [0, 1, 0, 0, 0],
  processes: [
    { name: 'P1', allocation: [1, 0, 1, 0, 0], request: [1, 0, 0, 1, 0] },
    { name: 'P2', allocation: [1, 0, 0, 2, 0], request: [1, 0, 1, 0, 1] },
    { name: 'P3', allocation: [0, 0, 0, 0, 0], request: [0, 0, 0, 1, 1] },
    { name: 'P4', allocation: [0, 0, 0, 0, 1], request: [0, 1, 0, 0, 0] },
  ],
  answers: {
    totalAllocation: [2, 0, 1, 2, 1],
    availableW: [0, 1, 0, 0, 0],
    markedProcesses: [
      {
        process: 'P3',
        request: [0, 0, 0, 1, 1],
        allocation: [0, 0, 0, 0, 0],
        wAfter: [0, 1, 0, 0, 0],
      },
      {
        process: 'P4',
        request: [0, 1, 0, 0, 0],
        allocation: [0, 0, 0, 0, 1],
        wAfter: [0, 1, 0, 0, 1],
      },
    ],
    status: 'UNSAFE',
    reason: 'Terjadi deadlock pada P1 dan P2.',
  },
};

// ── Soal 4: Detection 2 ─────────────────────────────────────
export const detection2: DetectionExercise = {
  type: 'detection',
  title: 'Detection 2',
  resourceNames: ['R1', 'R2', 'R3', 'R4'],
  resourceVector: [1, 3, 3, 3],
  initialAvailable: [0, 1, 0, 2],
  processes: [
    { name: 'P1', allocation: [0, 0, 1, 0], request: [1, 0, 1, 0] },
    { name: 'P2', allocation: [0, 0, 0, 0], request: [2, 1, 1, 2] },
    { name: 'P3', allocation: [0, 1, 2, 1], request: [2, 1, 1, 2] },
    { name: 'P4', allocation: [1, 1, 0, 0], request: [0, 1, 0, 1] },
  ],
  answers: {
    totalAllocation: [1, 2, 3, 1],
    availableW: [0, 1, 0, 2],
    markedProcesses: [
      {
        process: 'P2',
        request: [2, 1, 1, 2],
        allocation: [0, 0, 0, 0],
        wAfter: [0, 1, 0, 2],
      },
      {
        process: 'P4',
        request: [0, 1, 0, 1],
        allocation: [1, 1, 0, 0],
        wAfter: [1, 2, 0, 2],
      },
    ],
    status: 'UNSAFE',
    reason: 'Terjadi deadlock pada P1 dan P3.',
  },
};

// ── Soal 5: Dining Philosopher 1 (Soal Resmi UTS Dosen) ─────
export const diningPhilosopher1: DiningPhilosopherExercise = {
  type: 'dining-philosopher',
  title: 'Dining Philosopher 1',
  subtitle: 'Soal UTS Resmi: Analisis Kapasitas Semaphore Room (N = 5)',
  contextDescription:
    'Lima filsuf duduk melingkar dengan lima garpu. Setiap filsuf membutuhkan dua garpu untuk makan. Program menggunakan semaphore room untuk membatasi jumlah filsuf yang dapat mencoba mengambil garpu secara bersamaan.',
  pseudocode: `const int N = 5;

semaphore room = 3;
semaphore fork[5] = {1, 1, 1, 1, 1};

void philosopher(int i) {
    while (true) {
        think();

        semWait(room);

        semWait(fork[i]);
        semWait(fork[(i + 1) % N]);

        eat();

        semSignal(fork[(i + 1) % N]);
        semSignal(fork[i]);

        semSignal(room);
    }
}`,
  codeBreakdown: [
    {
      line: 'const int N = 5;',
      desc: 'Jumlah filsuf dan jumlah garpu di meja makan.',
    },
    {
      line: 'semaphore room = 3;',
      desc: 'Maksimal 3 filsuf diizinkan mencoba mengambil garpu secara bersamaan.',
    },
    {
      line: 'semaphore fork[5] = {1,1,1,1,1};',
      desc: 'Menyediakan 5 garpu (binary semaphore), masing-masing hanya dapat digunakan oleh satu filsuf pada satu waktu.',
    },
    {
      line: 'think();',
      desc: 'Filsuf sedang berpikir (eksekusi mandiri tanpa butuh resource garpu).',
    },
    {
      line: 'semWait(room);',
      desc: 'Meminta izin untuk memasuki proses pengambilan garpu (kuota berkurang 1).',
    },
    {
      line: 'semWait(fork[i]);',
      desc: 'Mengambil garpu pertama (garpu sisi kiri filsuf i).',
    },
    {
      line: 'semWait(fork[(i + 1) % N]);',
      desc: 'Mengambil garpu kedua (garpu sisi kanan filsuf i).',
    },
    {
      line: 'eat();',
      desc: 'Filsuf makan setelah berhasil mendapatkan kedua garpu.',
    },
    {
      line: 'semSignal(fork[(i + 1) % N]); semSignal(fork[i]);',
      desc: 'Mengembalikan kedua garpu ke meja makan setelah selesai makan.',
    },
    {
      line: 'semSignal(room);',
      desc: 'Mengembalikan izin ruangan agar filsuf lain dapat mencoba mengambil garpu.',
    },
  ],
  questions: [
    {
      id: 'q1',
      question: 'a) Apa fungsi room = 3 dalam program tersebut?',
      type: 'choice',
      options: [
        'Membatasi maksimal 3 filsuf yang boleh mencoba mengambil garpu bersamaan, menjamin minimal 1 filsuf pasti mendapat 2 garpu (mencegah deadlock).',
        'Menentukan bahwa setiap proses filsuf hanya dapat makan maksimal 3 suapan.',
        'Mengurangi jumlah garpu fisik di atas meja dari 5 menjadi 3 buah.',
        'Membatasi durasi waktu makan setiap filsuf menjadi maksimal 3 detik.',
      ],
      correctAnswer:
        'Membatasi maksimal 3 filsuf yang boleh mencoba mengambil garpu bersamaan, menjamin minimal 1 filsuf pasti mendapat 2 garpu (mencegah deadlock).',
      explanation:
        'room = 3 adalah counting semaphore pengontrol kapasitas. Dengan 5 garpu dan maksimal 3 filsuf yang aktif memperebutkan garpu, menurut Pigeonhole Principle dijamin minimal 1 filsuf akan mendapatkan 2 garpu sekaligus (karena 5 garpu / 3 orang = setidaknya satu orang dapat ≥ 2 garpu), sehingga Circular Wait terputus dan deadlock dicegah.',
    },
    {
      id: 'q2',
      question:
        'b) Jika nilai room diubah menjadi 5 dan seluruh filsuf berhasil mengambil garpu pertama sebelum meminta garpu kedua, masalah apa yang dapat terjadi?',
      type: 'choice',
      options: [
        'DEADLOCK (Kelima filsuf memegang 1 garpu dan saling menunggu garpu kedua dari tetangganya, terblokir selamanya).',
        'STARVATION (Hanya filsuf nomor 0 yang kelaparan, sedangkan 4 filsuf lainnya makan bergantian).',
        'LIVELOCK (Filsuf terus-menerus melepaskan dan mengambil garpu tanpa pernah terblokir).',
        'NORMAL (Tidak ada masalah karena 5 filsuf memiliki 5 garpu).',
      ],
      correctAnswer:
        'DEADLOCK (Kelima filsuf memegang 1 garpu dan saling menunggu garpu kedua dari tetangganya, terblokir selamanya).',
      explanation:
        'Jika room = 5, kelima filsuf dapat masuk bersamaan. Jika semua mengeksekusi semWait(fork[i]) sebelum meminta garpu kedua, maka setiap filsuf memegang 1 garpu (Hold and Wait) dan menunggu garpu kanan yang dipegang tetangganya (Circular Wait: P0→P1→P2→P3→P4→P0). Karena garpu tidak bisa direbut paksa (No Preemption) dan 1 garpu hanya untuk 1 orang (Mutual Exclusion), keempat kondisi Coffman terpenuhi dan terjadi DEADLOCK.',
    },
    {
      id: 'q3',
      question:
        'c) Berapakah nilai maksimum semaphore room yang paling efisien untuk N = 5 filsuf agar kapasitas meja makan optimal namun tetap 100% bebas deadlock?',
      type: 'number',
      correctAnswer: 4,
      explanation:
        'Nilai optimal adalah N - 1 = 5 - 1 = 4. Dengan room = 4, terdapat 4 filsuf yang memperebutkan 5 garpu. Berdasarkan Pigeonhole Principle, minimal ada 1 filsuf yang pasti memperoleh 2 garpu (5 garpu dibagi 4 orang = minimal satu orang dapat 2 garpu). Filsuf tersebut akan makan dan melepaskan garpunya, memicu eksekusi filsuf lainnya.',
    },
    {
      id: 'q4',
      question:
        'd) Manakah dari empat kondisi Coffman yang berhasil dieliminasi (diputus) oleh penerapan semaphore room = 4?',
      type: 'choice',
      options: [
        'Circular Wait (Memutus rantai tunggu melingkar tertutup karena tidak semua filsuf dapat memegang 1 garpu secara bersamaan).',
        'Mutual Exclusion (Memperbolehkan dua filsuf menggunakan satu garpu secara bersama-sama).',
        'No Preemption (Memaksa sistem operasi merebut garpu dari tangan filsuf).',
        'Hold and Wait (Melarang filsuf memegang garpu pertama jika belum ada garpu kedua).',
      ],
      correctAnswer:
        'Circular Wait (Memutus rantai tunggu melingkar tertutup karena tidak semua filsuf dapat memegang 1 garpu secara bersamaan).',
      explanation:
        'Penggunaan semaphore room memutus kondisi Circular Wait (Pencegahan Tidak Langsung / Indirect Prevention). Dengan membatasi jumlah filsuf menjadi N - 1, skenario di mana semua N filsuf memegang 1 garpu dan saling menunggu garpu berikutnya secara siklikal tidak akan pernah dapat terjadi.',
    },
  ],
  fullKotretan: [
    {
      title: 'Langkah 1: Analisis Variabel dan Inisialisasi Semaphore',
      steps: [
        '• N = 5: Terdapat 5 proses (filsuf P0, P1, P2, P3, P4) dan 5 resource (garpu F0, F1, F2, F3, F4).',
        '• semaphore fork[5] = {1,1,1,1,1}: 5 binary semaphore yang mengontrol akses mutual exclusion ke setiap garpu.',
        '• semaphore room = 3: Counting semaphore yang membatasi konkurensi maksimal 3 proses yang boleh memasuki fase akuisisi resource.',
      ],
    },
    {
      title: 'Langkah 2: Pembuktian Pencegahan Deadlock (Pigeonhole Principle)',
      steps: [
        '• Jika kapasitas ruangan dibatasi ke K filsuf, jumlah garpu total adalah N = 5.',
        '• Skenario terburuk (worst-case): Setiap filsuf yang berada di ruangan berhasil mengambil 1 garpu.',
        '• Jumlah garpu yang tersisa di meja = N - K.',
        '• Jika K = 3 (atau K = 4), sisa garpu di meja adalah 5 - 3 = 2 garpu (atau 5 - 4 = 1 garpu).',
        '• Karena masih ada sisa garpu, minimal 1 filsuf dijamin dapat mengambil garpu kedua dan makan hingga tuntas.',
        '• Setelah selesai, filsuf tersebut melakukan semSignal(fork) dan semSignal(room), membebaskan 2 garpu dan 1 slot ruangan untuk filsuf lainnya.',
      ],
    },
    {
      title: 'Langkah 3: Pembuktian Terjadinya Deadlock pada room = 5',
      steps: [
        '• 1. Mutual Exclusion: Setiap garpu Fi hanya dapat dipegang oleh 1 filsuf (fork[i] bernilai 0 saat dipegang).',
        '• 2. Hold and Wait: P0 memegang F0 sambil menunggu F1; P1 memegang F1 sambil menunggu F2; P2 memegang F2 sambil menunggu F3; P3 memegang F3 sambil menunggu F4; P4 memegang F4 sambil menunggu F0.',
        '• 3. No Preemption: Tidak ada filsuf yang dapat dipaksa melepaskan garpu yang sudah dipegangnya.',
        '• 4. Circular Wait: P0 → P1 → P2 → P3 → P4 → P0 membentuk siklus melingkar tertutup.',
        '• Kesimpulan: Keempat kondisi Coffman terpenuhi → DEADLOCK MUTLAK.',
      ],
    },
  ],
};

// ── Soal 6: Dining Philosopher 2 (Trace & Solusi Asimetris) ──
export const diningPhilosopher2: DiningPhilosopherExercise = {
  type: 'dining-philosopher',
  title: 'Dining Philosopher 2',
  subtitle: 'Trace Pseudocode, Urutan Eksekusi & Solusi Asimetris (UTS)',
  contextDescription:
    'Analisis variasi pseudocode Dining Philosopher: kesalahan urutan semaphore wait, solusi asimetris tanpa semaphore room, dan perbedaan kegagalan konkurensi (Deadlock vs Starvation vs Livelock).',
  pseudocode: `// Variasi Pseudocode: Modifikasi Baris SemWait
void philosopher_modified(int i) {
    while (true) {
        think();

        semWait(fork[i]);            // [BARIS DITUKAR!]
        semWait(room);               // semWait(room) dipindah setelah semWait(fork[i])
        semWait(fork[(i + 1) % 5]);

        eat();

        semSignal(fork[(i + 1) % 5]);
        semSignal(room);
        semSignal(fork[i]);
    }
}`,
  codeBreakdown: [
    {
      line: 'semWait(fork[i]); [sebelum room]',
      desc: 'BAHAYA: Filsuf mengambil garpu pertama sebelum meminta izin ruangan!',
    },
    {
      line: 'semWait(room); [setelah fork[i]]',
      desc: 'Izin ruangan baru dicek setelah garpu pertama sudah digenggam.',
    },
    {
      line: 'semWait(fork[(i + 1) % 5]);',
      desc: 'Mencoba mengambil garpu kedua.',
    },
    {
      line: 'eat();',
      desc: 'Makan hanya jika berhasil melewati ketiga semWait di atas.',
    },
  ],
  questions: [
    {
      id: 'q1',
      question:
        'a) Jika baris semWait(room) dipindahkan ke setelah semWait(fork[i]), apakah room = 4 masih efektif mencegah deadlock?',
      type: 'choice',
      options: [
        'TIDAK EFEKTIF (Kelima filsuf sudah terlanjur mengambil garpu pertama sebelum dibatasi oleh room, sehingga deadlock tetap terjadi).',
        'TETAP EFEKTIF (Karena jumlah izin semWait(room) tetap bernilai 4, deadlock tetap tercegah).',
        'LEBIH BAIK (Meningkatkan throughput sistem karena resource pertama diamankan lebih awal).',
        'MENYEBABKAN CRASH (Menghasilkan error kompilasi karena struktur semWait tidak valid).',
      ],
      correctAnswer:
        'TIDAK EFEKTIF (Kelima filsuf sudah terlanjur mengambil garpu pertama sebelum dibatasi oleh room, sehingga deadlock tetap terjadi).',
      explanation:
        'Sangat fatal! Jika semWait(fork[i]) dieksekusi sebelum semWait(room), kelima filsuf dapat mengeksekusi semWait(fork[i]) secara simultan. Kelima garpu telah habis terambil (masing-masing filsuf memegang 1 garpu). Setelah itu, 4 filsuf berhasil lolos semWait(room) dan 1 tertahan di room, namun ke-4 filsuf tersebut tetap terblokir saat mencoba semWait(fork[(i+1)%5]) karena garpu kedua mereka dipegang tetangganya. Deadlock tetap terjadi!',
    },
    {
      id: 'q2',
      question:
        'b) Perhatikan Solusi Asimetris: Filsuf genap (0, 2, 4) mengambil fork[i] lalu fork[(i+1)%5], sedangkan filsuf ganjil (1, 3) mengambil fork[(i+1)%5] lalu fork[i]. Mengapa solusi ini bebas deadlock tanpa perlu semaphore room?',
      type: 'choice',
      options: [
        'Karena dua filsuf bertetangga (misal P0 dan P1) akan memperebutkan garpu yang sama terlebih dahulu, sehingga salah satu pasti terblokir sebelum memegang garpu manapun.',
        'Karena filsuf ganjil tidak memerlukan garpu dan hanya bertindak sebagai pengamat.',
        'Karena jumlah garpu otomatis berlipat ganda menjadi 10 garpu di memori.',
        'Karena sistem operasi akan mengalokasikan garpu virtual tambahan untuk proses genap.',
      ],
      correctAnswer:
        'Karena dua filsuf bertetangga (misal P0 dan P1) akan memperebutkan garpu yang sama terlebih dahulu, sehingga salah satu pasti terblokir sebelum memegang garpu manapun.',
      explanation:
        'Pada solusi asimetris, P0 (genap) meminta F0 lalu F1. P1 (ganjil) meminta F1 lalu F0. Keduanya bersaing memperebutkan F1 sebagai garpu pertama mereka! Siapa yang kalah akan terblokir SEBELUM memegang satu garpu pun. Dengan demikian, kondisi di mana setiap proses memegang 1 garpu tidak akan pernah terjadi secara siklis melingkar, memutus Circular Wait secara langsung.',
    },
    {
      id: 'q3',
      question:
        'c) Berdasarkan slide materi kuliah studi kasus, apa perbedaan mendasar antara STARVATION dan LIVELOCK pada masalah Dining Philosopher?',
      type: 'choice',
      options: [
        'Starvation: proses tertentu tidak pernah mendapat giliran makan; Livelock: proses terus aktif merespons status tapi tidak ada progres eksekusi makan.',
        'Starvation: semua proses terhenti permanen; Livelock: hanya ada 1 proses yang berjalan.',
        'Starvation: kehabisan memori RAM; Livelock: CPU utilization bernilai 0%.',
        'Keduanya adalah istilah yang merujuk pada kondisi identik tanpa perbedaan teknis.',
      ],
      correctAnswer:
        'Starvation: proses tertentu tidak pernah mendapat giliran makan; Livelock: proses terus aktif merespons status tapi tidak ada progres eksekusi makan.',
      explanation:
        'Starvation (kelaparan) terjadi saat ada filsuf yang selalu kalah dalam perebutan giliran (misal P0 dan P2 bergantian makan terus-menerus sehingga P1 kelaparan). Sedangkan Livelock adalah situasi di mana proses terus aktif mengubah state (misal semua filsuf mengambil garpu kanan, mendeteksi garpu kiri tidak ada, lalu serentak melepaskan garpu kanan, lalu serentak mengambil lagi) — proses sibuk dan CPU tinggi, namun tidak ada satu pun yang berhasil makan.',
    },
    {
      id: 'q4',
      question:
        'd) Jika suatu variasi sistem memiliki N = 8 filsuf dan 8 garpu, berapakah nilai kapasitas semaphore room yang paling tepat digunakan?',
      type: 'number',
      correctAnswer: 7,
      explanation:
        'Formula umum pencegahan deadlock dengan semaphore room pembatas kapasitas adalah room = N - 1. Untuk N = 8 filsuf dan 8 garpu, nilai room maksimum yang menjamin bebas deadlock adalah 8 - 1 = 7.',
    },
  ],
  fullKotretan: [
    {
      title: 'Analisis Skenario Baris Tertukar (Penempatan semWait)',
      steps: [
        '• Aturan Semaphore: Urutan semWait menentukan fase kritis alokasi.',
        '• Pada kode yang benar: semWait(room) bertindak sebagai gerbang masuk (gatekeeper) sebelum ada garpu yang dipegang.',
        '• Jika semWait(fork[i]) dilakukan sebelum semWait(room): Gerbang room tidak lagi melindungi garpu pertama.',
        '• Kelima proses dapat meraih fork[i] masing-masing, sehingga kondisi Hold & Wait terjadi pada skala penuh (5 garpu terikat ke 5 proses).',
      ],
    },
    {
      title: 'Analisis Solusi Asimetris (Chandy / Misra / Dijkstra)',
      steps: [
        '• Filsuf genap (i genap): Ambil garpu min(i, (i+1)%N), lalu max(i, (i+1)%N).',
        '• Filsuf ganjil (i ganjil): Ambil garpu max(i, (i+1)%N), lalu min(i, (i+1)%N).',
        '• Dampak: Tidak ada orientasi tunggal searah jarum jam (clockwise bias).',
        '• Garpu diperebutkan secara berlawanan arah, memecah simetri dan mencegah siklus melingkar tertutup.',
      ],
    },
  ],
};

export const allExercises: Exercise[] = [
  avoidance1,
  avoidance2,
  detection1,
  detection2,
  diningPhilosopher1,
  diningPhilosopher2,
];

// ── Step-by-step solution explanations (kotretan) ────────────

export interface SolutionStep {
  step: number;
  text: string;
  highlight?: string; // which cells to highlight
}

export function getAvoidanceSolutionSteps(
  processes: ExerciseProcess[],
  resourceVector: number[],
  _resourceNames: string[],
  answers: AvoidanceExercise['answers']
): SolutionStep[] {
  const steps: SolutionStep[] = [];
  let stepNum = 1;

  steps.push({
    step: stepNum++,
    text: `Hitung Total Allocation: Jumlahkan kolom Allocation semua proses → (${answers.totalAllocation.join(', ')})`,
  });

  steps.push({
    step: stepNum++,
    text: `Hitung Still Needs (C - A) untuk setiap proses:`,
  });

  processes.forEach((p, i) => {
    steps.push({
      step: stepNum++,
      text: `  ${p.name}: C(${p.maxDemand!.join(',')}) - A(${p.allocation.join(',')}) = (${answers.stillNeeds[i].join(', ')})`,
    });
  });

  steps.push({
    step: stepNum++,
    text: `Hitung Available Vector V = R - Total Allocation = (${resourceVector.join(',')}) - (${answers.totalAllocation.join(',')}) = (${answers.initialAvailable.join(', ')})`,
  });

  steps.push({
    step: stepNum++,
    text: `Jalankan Banker's Algorithm — cari proses yang Still Needs ≤ V:`,
  });

  let currentV = [...answers.initialAvailable];
  answers.executionOrder.forEach((exec, i) => {
    const proc = processes.find(p => p.name === exec.process)!;
    steps.push({
      step: stepNum++,
      text: `  ${i + 1}. ${exec.process}: Needs(${answers.stillNeeds[processes.indexOf(proc)].join(',')}) ≤ V(${currentV.join(',')}) ✓ → V += Alloc(${proc.allocation.join(',')}) = (${exec.availableAfter.join(', ')})`,
    });
    currentV = [...exec.availableAfter];
  });

  steps.push({
    step: stepNum++,
    text: `Status: ${answers.status}${answers.status === 'SAFE' ? ' — Semua proses dapat dieksekusi.' : ''}`,
  });

  if (answers.reason) {
    steps.push({
      step: stepNum++,
      text: `Alasan: ${answers.reason}`,
    });
  }

  return steps;
}

export function getDetectionSolutionSteps(
  exercise: DetectionExercise
): SolutionStep[] {
  const steps: SolutionStep[] = [];
  let stepNum = 1;
  const ans = exercise.answers;

  if (exercise.resourceVector) {
    steps.push({
      step: stepNum++,
      text: `Hitung Total Allocation: Jumlahkan kolom Allocation semua proses → (${ans.totalAllocation!.join(', ')})`,
    });

    steps.push({
      step: stepNum++,
      text: `Hitung Available W = R - Total Allocation = (${exercise.resourceVector.join(',')}) - (${ans.totalAllocation!.join(',')}) = (${ans.availableW.join(', ')})`,
    });
  } else {
    steps.push({
      step: stepNum++,
      text: `Available W awal sudah diberikan: (${ans.availableW.join(', ')})`,
    });
  }

  steps.push({
    step: stepNum++,
    text: `Jalankan algoritma Detection — cari proses dengan Request Q ≤ W:`,
  });

  let currentW = [...ans.availableW];
  ans.markedProcesses.forEach((mp, i) => {
    steps.push({
      step: stepNum++,
      text: `  ${i + 1}. ${mp.process}: Q(${mp.request.join(',')}) ≤ W(${currentW.join(',')}) ✓ → Tandai ${mp.process}, W += Alloc(${mp.allocation.join(',')}) = (${mp.wAfter.join(', ')})`,
    });
    currentW = [...mp.wAfter];
  });

  const unmarked = exercise.processes
    .filter(p => !ans.markedProcesses.find(m => m.process === p.name))
    .map(p => p.name);

  if (unmarked.length > 0) {
    steps.push({
      step: stepNum++,
      text: `Proses yang tidak bertanda (unmarked): ${unmarked.join(', ')} — request mereka > W saat ini.`,
    });
  }

  steps.push({
    step: stepNum++,
    text: `State: ${ans.status}`,
  });

  steps.push({
    step: stepNum++,
    text: `Alasan: ${ans.reason}`,
  });

  return steps;
}
