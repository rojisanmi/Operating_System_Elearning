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

export type Exercise = AvoidanceExercise | AvoidanceMultiStepExercise | DetectionExercise;

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

export const allExercises: Exercise[] = [avoidance1, avoidance2, detection1, detection2];

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
