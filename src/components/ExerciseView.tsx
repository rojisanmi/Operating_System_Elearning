import React, { useState, useMemo } from 'react';
import {
  allExercises,
  getAvoidanceSolutionSteps,
  getDetectionSolutionSteps,
} from '../data/exercisesData';
import type {
  AvoidanceExercise,
  AvoidanceMultiStepExercise,
  DetectionExercise,
  DiningPhilosopherExercise,
  ExerciseProcess,
  SolutionStep,
} from '../data/exercisesData';

/* ═══════════════════════════════════════════════════════════
   ExerciseView — Interactive matrix exercises with checking
   ═══════════════════════════════════════════════════════════ */

// ── Small input cell with validation states ──
const InputCell: React.FC<{
  value: string;
  onChange: (v: string) => void;
  correctValue?: number;
  checked: boolean;
  readOnly?: boolean;
}> = ({ value, onChange, correctValue, checked, readOnly }) => {
  const isCorrect = checked && correctValue !== undefined && parseInt(value) === correctValue;
  const isIncorrect =
    checked && correctValue !== undefined && (value === '' || parseInt(value) !== correctValue);

  return (
    <div className="relative inline-block">
      <input
        type="text"
        inputMode="numeric"
        value={readOnly ? (correctValue ?? value) : value}
        onChange={(e) => {
          if (!readOnly && !checked) {
            const v = e.target.value.replace(/[^0-9-]/g, '');
            onChange(v);
          }
        }}
        readOnly={readOnly || checked}
        className={`w-11 h-8 text-center border rounded-lg text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono ${
          readOnly
            ? 'bg-gray-100/70 border-gray-200 text-gray-700 font-semibold'
            : isCorrect
            ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold shadow-xs'
            : isIncorrect
            ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold shadow-xs'
            : 'bg-white border-gray-300 hover:border-blue-400 focus:bg-blue-50/20'
        }`}
      />
      {isCorrect && (
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[8px] font-bold shadow-xs">
          ✓
        </span>
      )}
      {isIncorrect && (
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] text-rose-600 font-black bg-white px-1 border border-rose-200 rounded shadow-xs z-20 whitespace-nowrap">
          {correctValue}
        </div>
      )}
    </div>
  );
};

// ── Status selector (SAFE vs UNSAFE) ──
const StatusSelector: React.FC<{
  value: string;
  onChange: (v: string) => void;
  correctValue: string;
  checked: boolean;
}> = ({ value, onChange, correctValue, checked }) => {
  const isCorrect = checked && value === correctValue;
  const isIncorrect = checked && value !== correctValue;

  return (
    <div className="flex gap-3 items-center bg-gray-50 p-3 rounded-xl border border-gray-200 max-w-md">
      <span className="text-sm font-bold text-gray-800">STATUS / STATE:</span>
      <select
        value={value}
        onChange={(e) => !checked && onChange(e.target.value)}
        disabled={checked}
        className={`px-3 py-1.5 border rounded-lg text-sm font-bold transition-colors cursor-pointer ${
          isCorrect
            ? 'bg-emerald-100 border-emerald-500 text-emerald-800'
            : isIncorrect
            ? 'bg-rose-100 border-rose-500 text-rose-800'
            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-400'
        }`}
      >
        <option value="">-- Pilih Status --</option>
        <option value="SAFE">SAFE</option>
        <option value="UNSAFE">UNSAFE</option>
      </select>
      {isCorrect && <span className="text-emerald-600 text-sm font-bold">✓ Benar!</span>}
      {isIncorrect && (
        <span className="text-rose-600 text-sm font-bold">✗ Kunci: {correctValue}</span>
      )}
    </div>
  );
};

// ── Solution steps panel (Kotretan) ──
const SolutionPanel: React.FC<{ steps: SolutionStep[]; visible: boolean }> = ({
  steps,
  visible,
}) => {
  if (!visible) return null;

  return (
    <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-2xl p-6 shadow-sm animate-in fade-in duration-300">
      <h4 className="text-base font-bold text-amber-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Cara Jawab & Kotretan Langkah Penyelesaian
      </h4>
      <div className="space-y-2.5">
        {steps.map((s) => (
          <div key={s.step} className="flex gap-3 text-sm">
            <span className="w-6 h-6 bg-amber-200 text-amber-900 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
              {s.step}
            </span>
            <span className="text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
              {s.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Dynamic Banker's Algorithm Validation Engine ──
interface AvoidanceStepValidation {
  stepIndex: number;
  process: string;
  isValidProcess: boolean;
  expectedAvailable: number[];
  errorMessage?: string;
  isCorrectSlot: boolean;
}

function validateAvoidanceOrder(
  processes: ExerciseProcess[],
  initialAvailable: number[],
  stillNeeds: number[][],
  userOrder: { process: string; available: string[] }[]
): {
  results: AvoidanceStepValidation[];
  isAllExecuted: boolean;
} {
  let currentV = [...initialAvailable];
  const executed = new Set<string>();
  const results: AvoidanceStepValidation[] = [];

  for (let si = 0; si < processes.length; si++) {
    const step = userOrder[si];
    const pName = step?.process?.trim() || '';

    // If slot is empty
    if (!pName) {
      // Find if any unexecuted process CAN run with currentV
      const candidates = processes.filter(
        (p, idx) => !executed.has(p.name) && stillNeeds[idx].every((need, ri) => need <= currentV[ri])
      );
      const shouldBeEmpty = candidates.length === 0;
      results.push({
        stepIndex: si,
        process: '',
        isValidProcess: shouldBeEmpty,
        expectedAvailable: [...currentV],
        isCorrectSlot: shouldBeEmpty,
        errorMessage: shouldBeEmpty
          ? undefined
          : `Masih ada proses (${candidates.map((c) => c.name).join(', ')}) yang dapat dieksekusi!`,
      });
      continue;
    }

    const pIdx = processes.findIndex((p) => p.name === pName);
    if (pIdx === -1) {
      results.push({
        stepIndex: si,
        process: pName,
        isValidProcess: false,
        expectedAvailable: [...currentV],
        isCorrectSlot: false,
        errorMessage: 'Proses tidak ditemukan.',
      });
      continue;
    }

    const proc = processes[pIdx];
    const procNeeds = stillNeeds[pIdx];

    // Duplicate check
    if (executed.has(pName)) {
      results.push({
        stepIndex: si,
        process: pName,
        isValidProcess: false,
        expectedAvailable: [...currentV],
        isCorrectSlot: false,
        errorMessage: `${pName} sudah dieksekusi sebelumnya!`,
      });
      continue;
    }

    // Check if Still Needs <= currentV
    const canRun = procNeeds.every((need, ri) => need <= currentV[ri]);
    if (!canRun) {
      results.push({
        stepIndex: si,
        process: pName,
        isValidProcess: false,
        expectedAvailable: [...currentV],
        isCorrectSlot: false,
        errorMessage: `Needs(${procNeeds.join(',')}) > V(${currentV.join(',')}) — Resource tidak cukup!`,
      });
      continue;
    }

    // Process is valid! Compute next V
    const nextV = currentV.map((v, ri) => v + proc.allocation[ri]);
    results.push({
      stepIndex: si,
      process: pName,
      isValidProcess: true,
      expectedAvailable: nextV,
      isCorrectSlot: true,
    });

    executed.add(pName);
    currentV = nextV;
  }

  return {
    results,
    isAllExecuted: executed.size === processes.length,
  };
}

// ── Dynamic Detection Algorithm Validation Engine ──
interface DetectionStepValidation {
  stepIndex: number;
  process: string;
  isValidProcess: boolean;
  expectedW: number[];
  errorMessage?: string;
  isCorrectSlot: boolean;
}

function validateDetectionOrder(
  processes: ExerciseProcess[],
  initialW: number[],
  userOrder: { process: string; wAfter: string[] }[]
): {
  results: DetectionStepValidation[];
  isAllMarked: boolean;
} {
  let currentW = [...initialW];
  const marked = new Set<string>();
  const results: DetectionStepValidation[] = [];

  for (let si = 0; si < processes.length; si++) {
    const step = userOrder[si];
    const pName = step?.process?.trim() || '';

    // If slot is empty
    if (!pName) {
      // Find if any unmarked process CAN be marked
      const candidates = processes.filter((p) => {
        if (marked.has(p.name)) return false;
        const isAllocZero = p.allocation.every((a) => a === 0);
        const reqOk = p.request ? p.request.every((q, ri) => q <= currentW[ri]) : false;
        return isAllocZero || reqOk;
      });
      const shouldBeEmpty = candidates.length === 0;
      results.push({
        stepIndex: si,
        process: '',
        isValidProcess: shouldBeEmpty,
        expectedW: [...currentW],
        isCorrectSlot: shouldBeEmpty,
        errorMessage: shouldBeEmpty
          ? undefined
          : `Masih ada proses (${candidates.map((c) => c.name).join(', ')}) yang dapat ditandai!`,
      });
      continue;
    }

    const pIdx = processes.findIndex((p) => p.name === pName);
    if (pIdx === -1) {
      results.push({
        stepIndex: si,
        process: pName,
        isValidProcess: false,
        expectedW: [...currentW],
        isCorrectSlot: false,
        errorMessage: 'Proses tidak ditemukan.',
      });
      continue;
    }

    const proc = processes[pIdx];

    // Duplicate check
    if (marked.has(pName)) {
      results.push({
        stepIndex: si,
        process: pName,
        isValidProcess: false,
        expectedW: [...currentW],
        isCorrectSlot: false,
        errorMessage: `${pName} sudah ditandai sebelumnya!`,
      });
      continue;
    }

    // Can process be marked?
    const isAllocZero = proc.allocation.every((a) => a === 0);
    const reqOk = proc.request ? proc.request.every((q, ri) => q <= currentW[ri]) : false;
    if (!isAllocZero && !reqOk) {
      results.push({
        stepIndex: si,
        process: pName,
        isValidProcess: false,
        expectedW: [...currentW],
        isCorrectSlot: false,
        errorMessage: `Q(${proc.request?.join(',')}) > W(${currentW.join(',')}) — Tidak dapat ditandai!`,
      });
      continue;
    }

    // Process is valid! Compute next W
    const nextW = currentW.map((w, ri) => w + proc.allocation[ri]);
    results.push({
      stepIndex: si,
      process: pName,
      isValidProcess: true,
      expectedW: nextW,
      isCorrectSlot: true,
    });

    marked.add(pName);
    currentW = nextW;
  }

  return {
    results,
    isAllMarked: marked.size === processes.length,
  };
}

// ═══ Avoidance Exercise Component ═══
const AvoidanceExerciseView: React.FC<{
  processes: AvoidanceExercise['processes'];
  answers: AvoidanceExercise['answers'];
  resourceNames: string[];
  resourceVector: number[];
  partLabel?: string;
  partDescription?: string;
  requestNotice?: string;
}> = ({
  processes,
  answers,
  resourceNames,
  resourceVector,
  partLabel,
  partDescription,
  requestNotice,
}) => {
  const numRes = resourceNames.length;
  const numProc = processes.length;

  // User input states
  const [totalAlloc, setTotalAlloc] = useState<string[]>(Array(numRes).fill(''));
  const [stillNeeds, setStillNeeds] = useState<string[][]>(
    processes.map(() => Array(numRes).fill(''))
  );
  const [initialAvail, setInitialAvail] = useState<string[]>(Array(numRes).fill(''));
  // Up to numProc rows for execution order
  const [execOrder, setExecOrder] = useState<{ process: string; available: string[] }[]>(
    Array.from({ length: numProc }, () => ({ process: '', available: Array(numRes).fill('') }))
  );
  const [status, setStatus] = useState('');
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleCheck = () => setChecked(true);

  const handleReset = () => {
    setTotalAlloc(Array(numRes).fill(''));
    setStillNeeds(processes.map(() => Array(numRes).fill('')));
    setInitialAvail(Array(numRes).fill(''));
    setExecOrder(
      Array.from({ length: numProc }, () => ({
        process: '',
        available: Array(numRes).fill(''),
      }))
    );
    setStatus('');
    setChecked(false);
    setShowSolution(false);
  };

  const handleShowAnswers = () => {
    setTotalAlloc(answers.totalAllocation.map(String));
    setStillNeeds(answers.stillNeeds.map((row) => row.map(String)));
    setInitialAvail(answers.initialAvailable.map(String));

    const filledExec = Array.from({ length: numProc }, (_, i) => {
      if (i < answers.executionOrder.length) {
        return {
          process: answers.executionOrder[i].process,
          available: answers.executionOrder[i].availableAfter.map(String),
        };
      }
      return { process: '', available: Array(numRes).fill('') };
    });

    setExecOrder(filledExec);
    setStatus(answers.status);
    setChecked(true);
  };

  const steps = getAvoidanceSolutionSteps(processes, resourceVector, resourceNames, answers);

  const validation = useMemo(() => {
    return validateAvoidanceOrder(
      processes,
      answers.initialAvailable,
      answers.stillNeeds,
      execOrder
    );
  }, [processes, answers.initialAvailable, answers.stillNeeds, execOrder]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Header / Part notice */}
      {partLabel && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Bagian {partLabel}
            </span>
            <span className="text-base font-semibold text-gray-800">{partDescription}</span>
          </div>
        </div>
      )}

      {/* Request details banner if any */}
      {requestNotice && (
        <div className="mb-5 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-900 leading-relaxed font-sans">
          {requestNotice}
        </div>
      )}

      {/* Resource Vector R */}
      <div className="mb-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
          Resource Vector R
        </h4>
        <div className="flex gap-3">
          {resourceNames.map((r, i) => (
            <div key={r} className="text-center">
              <div className="text-xs text-gray-500 font-mono mb-1">{r}</div>
              <div className="w-11 h-8 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-sm font-bold text-gray-800 font-mono">
                {resourceVector[i]}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matrices table (Allocation A, Max Demand C, Still Needs C-A) */}
      <div className="overflow-x-auto pb-2">
        <table className="text-sm border-separate border-spacing-x-2 border-spacing-y-1">
          <thead>
            <tr>
              <th className="px-2 py-1 text-gray-500 font-bold text-xs uppercase text-left">P</th>
              <th
                colSpan={numRes}
                className="px-2 py-1 text-center font-bold text-xs text-blue-700 bg-blue-50/60 rounded-t-lg"
              >
                Allocation Matrix A
              </th>
              <th
                colSpan={numRes}
                className="px-2 py-1 text-center font-bold text-xs text-purple-700 bg-purple-50/60 rounded-t-lg"
              >
                Maximum Demand C
              </th>
              <th
                colSpan={numRes}
                className="px-2 py-1 text-center font-bold text-xs text-emerald-700 bg-emerald-50/60 rounded-t-lg"
              >
                Still Needs (C - A)
              </th>
            </tr>
            <tr>
              <th></th>
              {resourceNames.map((r) => (
                <th key={`a-${r}`} className="text-xs text-blue-600 font-mono">
                  {r}
                </th>
              ))}
              {resourceNames.map((r) => (
                <th key={`c-${r}`} className="text-xs text-purple-600 font-mono">
                  {r}
                </th>
              ))}
              {resourceNames.map((r) => (
                <th key={`n-${r}`} className="text-xs text-emerald-600 font-mono">
                  {r}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processes.map((p, pi) => (
              <tr key={p.name}>
                <td className="px-2 py-1 font-bold text-gray-800 font-mono text-sm">{p.name}</td>
                {/* Allocation (read-only) */}
                {p.allocation.map((v, ri) => (
                  <td key={`a-${ri}`} className="text-center">
                    <InputCell value={String(v)} onChange={() => {}} readOnly checked={false} />
                  </td>
                ))}
                {/* Max Demand (read-only) */}
                {p.maxDemand!.map((v, ri) => (
                  <td key={`c-${ri}`} className="text-center">
                    <InputCell value={String(v)} onChange={() => {}} readOnly checked={false} />
                  </td>
                ))}
                {/* Still Needs (user inputs) */}
                {resourceNames.map((_, ri) => (
                  <td key={`n-${ri}`} className="text-center">
                    <InputCell
                      value={stillNeeds[pi][ri]}
                      onChange={(v) => {
                        const next = [...stillNeeds];
                        next[pi] = [...next[pi]];
                        next[pi][ri] = v;
                        setStillNeeds(next);
                      }}
                      correctValue={answers.stillNeeds[pi][ri]}
                      checked={checked}
                    />
                  </td>
                ))}
              </tr>
            ))}
            {/* Total Allocation row */}
            <tr>
              <td className="px-2 py-1 font-bold text-gray-600 text-xs">Total</td>
              {resourceNames.map((_, ri) => (
                <td key={`ta-${ri}`} className="text-center">
                  <InputCell
                    value={totalAlloc[ri]}
                    onChange={(v) => {
                      const next = [...totalAlloc];
                      next[ri] = v;
                      setTotalAlloc(next);
                    }}
                    correctValue={answers.totalAllocation[ri]}
                    checked={checked}
                  />
                </td>
              ))}
              <td colSpan={numRes * 2}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Available Vector V & Urutan Eksekusi */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <h4 className="text-sm font-bold text-gray-800 mb-2">
          Available Vector V & Urutan Eksekusi Banker&apos;s Algorithm
        </h4>
        <p className="text-xs text-gray-500 mb-3">
          Tentukan nilai awal V₀ = R - Total Allocation, lalu pilih urutan proses yang dieksekusi dan nilai V setelah selesai. Jika proses terblokir / tidak dapat lanjut, biarkan baris kosong.
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm border-separate border-spacing-x-2 border-spacing-y-1">
            <thead>
              <tr>
                <th className="px-2 py-1 text-gray-500 font-bold text-xs uppercase text-left">Proses</th>
                {resourceNames.map((r) => (
                  <th key={r} className="text-xs text-teal-700 font-mono">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Initial V0 */}
              <tr className="bg-teal-50/70 rounded-lg">
                <td className="px-2 py-1 text-xs text-teal-800 font-bold font-mono">V₀ (Awal)</td>
                {resourceNames.map((_, ri) => (
                  <td key={ri} className="text-center">
                    <InputCell
                      value={initialAvail[ri]}
                      onChange={(v) => {
                        const next = [...initialAvail];
                        next[ri] = v;
                        setInitialAvail(next);
                      }}
                      correctValue={answers.initialAvailable[ri]}
                      checked={checked}
                    />
                  </td>
                ))}
              </tr>
              {/* Step by step execution rows */}
              {execOrder.map((step, si) => {
                const stepVal = validation.results[si];
                const isSelected = step.process !== '';
                const isProcessCorrect =
                  checked && stepVal.isValidProcess && (isSelected || stepVal.isCorrectSlot);
                const isProcessWrong = checked && !stepVal.isValidProcess;

                return (
                  <tr key={si}>
                    <td className="px-1 py-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <select
                          value={step.process}
                          onChange={(e) => {
                            if (checked) return;
                            const next = [...execOrder];
                            next[si] = { ...next[si], process: e.target.value };
                            setExecOrder(next);
                          }}
                          disabled={checked}
                          className={`w-32 h-8 border rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors ${
                            isProcessCorrect && isSelected
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                              : isProcessWrong
                              ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <option value="">-- Kosong / Blocked --</option>
                          {processes.map((p) => (
                            <option key={p.name} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        {checked && isProcessCorrect && isSelected && (
                          <span className="text-[10px] text-emerald-700 font-bold whitespace-nowrap bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            ✓ Valid (Needs ≤ V)
                          </span>
                        )}
                        {checked && isProcessWrong && stepVal.errorMessage && (
                          <span className="text-[10px] text-rose-700 font-bold whitespace-nowrap bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            ✗ {stepVal.errorMessage}
                          </span>
                        )}
                      </div>
                    </td>
                    {resourceNames.map((_, ri) => (
                      <td key={ri} className="text-center">
                        <InputCell
                          value={step.available[ri]}
                          onChange={(v) => {
                            if (checked) return;
                            const next = [...execOrder];
                            next[si] = {
                              ...next[si],
                              available: [...next[si].available],
                            };
                            next[si].available[ri] = v;
                            setExecOrder(next);
                          }}
                          correctValue={isSelected ? stepVal.expectedAvailable[ri] : undefined}
                          checked={checked && isSelected}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status & Reason */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <StatusSelector
          value={status}
          onChange={setStatus}
          correctValue={answers.status}
          checked={checked}
        />
        {answers.reason && checked && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <span className="font-bold">Alasan:</span> {answers.reason}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-3 flex-wrap items-center">
        {!checked && (
          <button
            onClick={handleCheck}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            ✓ Periksa Jawaban (Check)
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
        >
          ↺ Reset Soal
        </button>
        {!checked && (
          <button
            onClick={handleShowAnswers}
            className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-semibold text-sm transition-colors"
          >
            ★ Tampilkan Kunci Jawaban
          </button>
        )}
        {checked && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5"
          >
            {showSolution ? '▲ Sembunyikan Kotretan' : '▼ Lihat Kotretan Langkah Penyelesaian'}
          </button>
        )}
      </div>

      {/* Kotretan Accordion */}
      <SolutionPanel steps={steps} visible={checked && showSolution} />
    </div>
  );
};

// ═══ Detection Exercise Component ═══
const DetectionExerciseView: React.FC<{ exercise: DetectionExercise }> = ({ exercise }) => {
  const { resourceNames, processes, answers } = exercise;
  const numRes = resourceNames.length;
  const numProc = processes.length;

  const [totalAlloc, setTotalAlloc] = useState<string[]>(Array(numRes).fill(''));
  const [initialW, setInitialW] = useState<string[]>(Array(numRes).fill(''));
  const [markedSteps, setMarkedSteps] = useState<
    { process: string; wAfter: string[] }[]
  >(
    Array.from({ length: numProc }, () => ({
      process: '',
      wAfter: Array(numRes).fill(''),
    }))
  );
  const [status, setStatus] = useState('');
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleCheck = () => setChecked(true);

  const handleReset = () => {
    setTotalAlloc(Array(numRes).fill(''));
    setInitialW(Array(numRes).fill(''));
    setMarkedSteps(
      Array.from({ length: numProc }, () => ({
        process: '',
        wAfter: Array(numRes).fill(''),
      }))
    );
    setStatus('');
    setChecked(false);
    setShowSolution(false);
  };

  const handleShowAnswers = () => {
    if (answers.totalAllocation) setTotalAlloc(answers.totalAllocation.map(String));
    setInitialW(answers.availableW.map(String));

    const filled = Array.from({ length: numProc }, (_, i) => {
      if (i < answers.markedProcesses.length) {
        return {
          process: answers.markedProcesses[i].process,
          wAfter: answers.markedProcesses[i].wAfter.map(String),
        };
      }
      return { process: '', wAfter: Array(numRes).fill('') };
    });

    setMarkedSteps(filled);
    setStatus(answers.status);
    setChecked(true);
  };

  const steps = getDetectionSolutionSteps(exercise);

  const validation = useMemo(() => {
    return validateDetectionOrder(processes, answers.availableW, markedSteps);
  }, [processes, answers.availableW, markedSteps]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Resource Vector R (Total Sumber Daya Sistem) */}
      {exercise.resourceVector && (
        <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Resource Vector R (Total Sumber Daya Sistem)
            </h4>
            <span className="text-xs text-slate-500 font-mono font-semibold">
              R = ({exercise.resourceVector.join(', ')})
            </span>
          </div>
          <div className="flex gap-3">
            {resourceNames.map((r, i) => (
              <div key={r} className="text-center">
                <div className="text-xs text-slate-600 font-mono font-semibold mb-1">{r}</div>
                <div className="w-12 h-9 bg-white border border-slate-300 rounded-lg flex items-center justify-center text-sm font-bold text-slate-800 font-mono shadow-sm">
                  {exercise.resourceVector![i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Given data side by side: Matrix A & Matrix Q */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Allocation Matrix A */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
            Allocation Matrix A
          </h4>
          <table className="text-sm border-separate border-spacing-x-2 border-spacing-y-1">
            <thead>
              <tr>
                <th className="px-2 py-1 text-gray-500 font-bold text-xs uppercase text-left">P</th>
                {resourceNames.map((r) => (
                  <th key={r} className="text-xs text-blue-600 font-mono">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.name}>
                  <td className="px-2 py-1 font-bold text-gray-800 font-mono text-sm">{p.name}</td>
                  {p.allocation.map((v, ri) => (
                    <td key={ri} className="text-center">
                      <InputCell value={String(v)} onChange={() => {}} readOnly checked={false} />
                    </td>
                  ))}
                </tr>
              ))}
              {/* Total Allocation row */}
              {exercise.resourceVector && (
                <tr>
                  <td className="px-2 py-1 font-bold text-gray-600 text-xs">Total Alloc</td>
                  {resourceNames.map((_, ri) => (
                    <td key={ri} className="text-center">
                      <InputCell
                        value={totalAlloc[ri]}
                        onChange={(v) => {
                          if (checked) return;
                          const next = [...totalAlloc];
                          next[ri] = v;
                          setTotalAlloc(next);
                        }}
                        correctValue={answers.totalAllocation?.[ri]}
                        checked={checked}
                      />
                    </td>
                  ))}
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Request Matrix Q */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 mb-2">
            Request Matrix Q
          </h4>
          <table className="text-sm border-separate border-spacing-x-2 border-spacing-y-1">
            <thead>
              <tr>
                <th className="px-2 py-1 text-gray-500 font-bold text-xs uppercase text-left">P</th>
                {resourceNames.map((r) => (
                  <th key={r} className="text-xs text-rose-600 font-mono">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {processes.map((p) => (
                <tr key={p.name}>
                  <td className="px-2 py-1 font-bold text-gray-800 font-mono text-sm">{p.name}</td>
                  {p.request!.map((v, ri) => (
                    <td key={ri} className="text-center">
                      <InputCell value={String(v)} onChange={() => {}} readOnly checked={false} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Available Vector W (Awal) */}
      <div className="mb-6 p-4 bg-teal-50/50 border border-teal-200 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Available Vector W (Awal / W₀)
            </h4>
            <p className="text-[11px] text-teal-700 mt-0.5">
              Dihitung dari: <span className="font-mono font-bold">W = Resource Vector (R) − Total Allocation</span>
            </p>
          </div>
        </div>
        <div className="flex gap-3 mt-3">
          {resourceNames.map((r, ri) => (
            <div key={r} className="text-center">
              <div className="text-xs text-teal-700 font-mono font-bold mb-1">{r}</div>
              <InputCell
                value={initialW[ri]}
                onChange={(v) => {
                  if (checked) return;
                  const next = [...initialW];
                  next[ri] = v;
                  setInitialW(next);
                }}
                correctValue={answers.availableW[ri]}
                checked={checked}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Urutan Proses Bertanda */}
      <div className="border-t border-gray-100 pt-5">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-bold text-gray-800">Urutan Proses Bertanda</h4>
          <span className="text-xs text-gray-400 italic">Bebas memilih urutan proses selama syarat terpenuhi</span>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Tandai proses yang memiliki alokasi 0 atau <span className="font-semibold text-rose-600">Request Q ≤ W</span>. Setelah ditandai, alokasinya dilepas ke <span className="font-semibold text-teal-600">Wbaru = W + A</span>. Jika proses tidak dapat ditandai lagi, proses sisanya mengalami Deadlock!
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm border-separate border-spacing-x-2 border-spacing-y-1">
            <thead>
              <tr>
                <th className="px-2 py-1 text-gray-500 font-bold text-xs uppercase text-left">Proses Bertanda</th>
                <th
                  colSpan={numRes}
                  className="px-2 py-1 text-center font-bold text-xs text-rose-700 bg-rose-50/60 rounded-t-lg"
                >
                  Request Q
                </th>
                <th
                  colSpan={numRes}
                  className="px-2 py-1 text-center font-bold text-xs text-blue-700 bg-blue-50/60 rounded-t-lg"
                >
                  Allocation A
                </th>
                <th
                  colSpan={numRes}
                  className="px-2 py-1 text-center font-bold text-xs text-teal-700 bg-teal-50/60 rounded-t-lg"
                >
                  Vektor W (Setelah Selesai)
                </th>
              </tr>
              <tr>
                <th></th>
                {resourceNames.map((r) => (
                  <th key={`q-${r}`} className="text-xs text-rose-500 font-mono">
                    {r}
                  </th>
                ))}
                {resourceNames.map((r) => (
                  <th key={`a-${r}`} className="text-xs text-blue-500 font-mono">
                    {r}
                  </th>
                ))}
                {resourceNames.map((r) => (
                  <th key={`w-${r}`} className="text-xs text-teal-600 font-mono">
                    {r}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {markedSteps.map((step, si) => {
                const stepVal = validation.results[si];
                const isSelected = !!step.process;
                const isProcessCorrect =
                  checked && stepVal.isCorrectSlot && (isSelected ? stepVal.isValidProcess : true);
                const isProcessWrong =
                  checked && (!stepVal.isCorrectSlot || (isSelected && !stepVal.isValidProcess));
                const matchedProc = processes.find((p) => p.name === step.process);

                return (
                  <tr key={si}>
                    <td className="px-1 py-1">
                      <div className="flex items-center gap-1.5">
                        <select
                          value={step.process}
                          onChange={(e) => {
                            if (checked) return;
                            const next = [...markedSteps];
                            next[si] = { ...next[si], process: e.target.value };
                            setMarkedSteps(next);
                          }}
                          disabled={checked}
                          className={`w-36 h-8 border rounded-lg text-xs font-semibold px-2 cursor-pointer transition-colors ${
                            isProcessCorrect && isSelected
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold'
                              : isProcessWrong
                              ? 'bg-rose-100 border-rose-500 text-rose-900 font-bold'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <option value="">-- Kosong / Deadlock --</option>
                          {processes.map((p) => (
                            <option key={p.name} value={p.name}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                        {checked && isProcessCorrect && isSelected && (
                          <span className="text-[10px] text-emerald-700 font-bold whitespace-nowrap bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                            ✓ Valid (Q ≤ W atau Alloc = 0)
                          </span>
                        )}
                        {checked && isProcessWrong && stepVal.errorMessage && (
                          <span className="text-[10px] text-rose-700 font-bold whitespace-nowrap bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            ✗ {stepVal.errorMessage}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Auto-filled Request Q for selected process */}
                    {resourceNames.map((_, ri) => (
                      <td key={`q-${ri}`} className="text-center">
                        <div className="w-11 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-xs font-mono text-gray-600">
                          {matchedProc?.request?.[ri] ?? '-'}
                        </div>
                      </td>
                    ))}
                    {/* Auto-filled Allocation A for selected process */}
                    {resourceNames.map((_, ri) => (
                      <td key={`a-${ri}`} className="text-center">
                        <div className="w-11 h-8 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center text-xs font-mono text-gray-600">
                          {matchedProc?.allocation[ri] ?? '-'}
                        </div>
                      </td>
                    ))}
                    {/* User input for W vector after */}
                    {resourceNames.map((_, ri) => (
                      <td key={`w-${ri}`} className="text-center">
                        <InputCell
                          value={step.wAfter[ri]}
                          onChange={(v) => {
                            if (checked) return;
                            const next = [...markedSteps];
                            next[si] = { ...next[si], wAfter: [...next[si].wAfter] };
                            next[si].wAfter[ri] = v;
                            setMarkedSteps(next);
                          }}
                          correctValue={isSelected ? stepVal.expectedW[ri] : undefined}
                          checked={checked && isSelected}
                        />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status & Reason */}
      <div className="mt-6 border-t border-gray-100 pt-5">
        <StatusSelector
          value={status}
          onChange={setStatus}
          correctValue={answers.status}
          checked={checked}
        />
        {checked && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <span className="font-bold">Alasan:</span> {answers.reason}
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-6 flex gap-3 flex-wrap items-center">
        {!checked && (
          <button
            onClick={handleCheck}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            ✓ Periksa Jawaban (Check)
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors"
        >
          ↺ Reset Soal
        </button>
        {!checked && (
          <button
            onClick={handleShowAnswers}
            className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-semibold text-sm transition-colors"
          >
            ★ Tampilkan Kunci Jawaban
          </button>
        )}
        {checked && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5"
          >
            {showSolution ? '▲ Sembunyikan Kotretan' : '▼ Lihat Kotretan Langkah Penyelesaian'}
          </button>
        )}
      </div>

      <SolutionPanel steps={steps} visible={checked && showSolution} />
    </div>
  );
};

// ═══ DiningPhilosopherExerciseView ═══
const DiningPhilosopherExerciseView: React.FC<{
  exercise: DiningPhilosopherExercise;
}> = ({ exercise }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, string | number>>({});
  const [checked, setChecked] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(true);
  const [copied, setCopied] = useState(false);

  const handleSelectOption = (qid: string, val: string) => {
    if (checked) return;
    setUserAnswers((prev) => ({ ...prev, [qid]: val }));
  };

  const handleNumberChange = (qid: string, val: string) => {
    if (checked) return;
    const num = parseInt(val.replace(/[^0-9-]/g, ''));
    setUserAnswers((prev) => ({
      ...prev,
      [qid]: isNaN(num) ? '' : num,
    }));
  };

  const handleCheck = () => {
    setChecked(true);
  };

  const handleReset = () => {
    setUserAnswers({});
    setChecked(false);
    setShowSolution(false);
  };

  const handleShowAnswers = () => {
    const allAns: Record<string, string | number> = {};
    exercise.questions.forEach((q) => {
      allAns[q.id] = q.correctAnswer;
    });
    setUserAnswers(allAns);
    setChecked(true);
    setShowSolution(true);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exercise.pseudocode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Score calculation
  const totalQuestions = exercise.questions.length;
  const correctCount = checked
    ? exercise.questions.filter((q) => {
        const u = userAnswers[q.id];
        return u !== undefined && String(u).trim() === String(q.correctAnswer).trim();
      }).length
    : 0;

  const renderHighlightedLine = (line: string) => {
    if (line.trim().startsWith('//')) {
      return <span className="text-emerald-400/90 italic font-mono">{line}</span>;
    }
    const tokens = line.split(
      /(\b(?:semaphore|semWait|semSignal|eat|think|createProcess|while|true|const|int|void|for|main|philosopher)\b)/g
    );
    return (
      <span className="font-mono">
        {tokens.map((token, i) => {
          if (/^(semaphore|const|int|void)$/.test(token)) {
            return (
              <span key={i} className="text-cyan-400 font-bold">
                {token}
              </span>
            );
          }
          if (/^(semWait|semSignal)$/.test(token)) {
            return (
              <span key={i} className="text-amber-400 font-bold">
                {token}
              </span>
            );
          }
          if (/^(while|for|true)$/.test(token)) {
            return (
              <span key={i} className="text-pink-400 font-bold">
                {token}
              </span>
            );
          }
          if (/^(eat|think|createProcess|philosopher|main)$/.test(token)) {
            return (
              <span key={i} className="text-emerald-300 font-semibold">
                {token}
              </span>
            );
          }
          return <span key={i}>{token}</span>;
        })}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-xl space-y-8">
      {/* Exercise Header */}
      <div className="border-b border-gray-100 pb-5">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <span>🍽️</span> Studi Kasus UTS — Dining Philosopher
          </div>
          {checked && (
            <div
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 shadow-xs ${
                correctCount === totalQuestions
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : 'bg-amber-100 text-amber-900 border border-amber-300'
              }`}
            >
              <span>{correctCount === totalQuestions ? '🎉 SEMPURNA!' : '📊 SKOR ANDA:'}</span>
              <span>
                {correctCount} / {totalQuestions} Soal Benar
              </span>
            </div>
          )}
        </div>
        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{exercise.title}</h3>
        <p className="text-sm font-semibold text-blue-600 mt-0.5">{exercise.subtitle}</p>
        <p className="text-xs text-gray-600 mt-2 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/70">
          {exercise.contextDescription}
        </p>
      </div>

      {/* Code Block with line numbers and copy button */}
      <div>
        <div className="flex items-center justify-between bg-slate-900 text-slate-300 px-4 py-2.5 rounded-t-2xl border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span className="ml-2 font-semibold text-slate-200">pseudocode_dining_philosopher.c</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="text-xs font-semibold px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
          >
            {copied ? '✓ Tersalin!' : '📋 Salin Pseudocode'}
          </button>
        </div>
        <div className="font-mono text-xs md:text-sm bg-slate-950 text-slate-100 rounded-b-2xl p-4 overflow-x-auto shadow-inner border-x border-b border-slate-900 max-h-[380px] overflow-y-auto">
          {exercise.pseudocode.trim().split('\n').map((line, idx) => (
            <div key={idx} className="flex hover:bg-slate-900/60 px-1 py-0.5 rounded transition-colors">
              <span className="w-8 select-none text-slate-600 text-right pr-4 shrink-0 font-mono text-xs">
                {idx + 1}
              </span>
              <span className="whitespace-pre">{renderHighlightedLine(line)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Code Breakdown Table (from lecturer's JPEG note) */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
        <button
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="w-full flex items-center justify-between px-5 py-3 bg-slate-100/80 hover:bg-slate-200/70 transition-colors text-left font-bold text-xs uppercase tracking-wider text-slate-700 cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <span>📋</span> Bedah Baris Perintah Pseudocode (Slide & Catatan Dosen)
          </span>
          <span className="text-slate-500 text-sm">{showBreakdown ? '▲ Sembunyikan' : '▼ Tampilkan'}</span>
        </button>
        {showBreakdown && (
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-200/70 text-slate-700 font-bold border-b border-slate-300">
                  <th className="py-2.5 px-3 text-left w-1/3">Perintah (Command)</th>
                  <th className="py-2.5 px-3 text-left">Fungsi & Perilaku Sistem Operasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-normal text-slate-700">
                {exercise.codeBreakdown.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/80 transition-colors">
                    <td className="py-2 px-3 font-mono font-bold text-blue-900 bg-blue-50/40 rounded-l">
                      {row.line}
                    </td>
                    <td className="py-2 px-3 leading-relaxed">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Interactive Questions Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-2">
          <h4 className="text-lg font-black text-gray-800 flex items-center gap-2">
            <span>✍️</span> Pertanyaan Analisis Pseudocode UTS
          </h4>
          <span className="text-xs text-gray-500 font-medium">
            Jawab semua sub-pertanyaan lalu klik <b>Periksa Jawaban</b>.
          </span>
        </div>

        {exercise.questions.map((q, qIndex) => {
          const userVal = userAnswers[q.id];
          const isCorrect = checked && userVal !== undefined && String(userVal).trim() === String(q.correctAnswer).trim();
          const isIncorrect = checked && (userVal === undefined || String(userVal).trim() !== String(q.correctAnswer).trim());

          return (
            <div
              key={q.id}
              className={`p-5 rounded-2xl border transition-all duration-200 ${
                isCorrect
                  ? 'bg-emerald-50/40 border-emerald-300 shadow-xs'
                  : isIncorrect
                  ? 'bg-rose-50/40 border-rose-300 shadow-xs'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
            >
              {/* Question text */}
              <div className="flex items-start gap-3 mb-3">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {qIndex + 1}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900 leading-snug">{q.question}</p>
                </div>
              </div>

              {/* Multiple Choice Options */}
              {q.type === 'choice' && q.options && (
                <div className="space-y-2 mt-3 ml-9">
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userVal === opt;
                    const isOptionCorrect = checked && opt === q.correctAnswer;
                    const isOptionWrongSelected = checked && isSelected && opt !== q.correctAnswer;

                    return (
                      <button
                        key={optIdx}
                        disabled={checked}
                        onClick={() => handleSelectOption(q.id, opt)}
                        className={`w-full text-left p-3 rounded-xl border text-xs leading-relaxed transition-all flex items-start gap-3 cursor-pointer ${
                          isOptionCorrect
                            ? 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs'
                            : isOptionWrongSelected
                            ? 'bg-rose-100 border-rose-500 text-rose-950 font-bold'
                            : isSelected
                            ? 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-2 ring-blue-400/30'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] shrink-0 mt-0.5 ${
                            isSelected
                              ? 'border-blue-600 bg-blue-600 text-white'
                              : 'border-gray-300 bg-white text-transparent'
                          }`}
                        >
                          ●
                        </span>
                        <span className="flex-1">{opt}</span>
                        {isOptionCorrect && (
                          <span className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[10px] font-extrabold uppercase shrink-0">
                            ✓ Kunci
                          </span>
                        )}
                        {isOptionWrongSelected && (
                          <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-extrabold uppercase shrink-0">
                            ✗ Pilihan Anda
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Number Input Option */}
              {q.type === 'number' && (
                <div className="mt-3 ml-9 flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">Masukkan Angka:</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={checked}
                    value={userVal !== undefined ? String(userVal) : ''}
                    onChange={(e) => handleNumberChange(q.id, e.target.value)}
                    placeholder="Nilai room"
                    className={`w-28 px-3 py-1.5 border rounded-xl text-center text-sm font-bold font-mono transition-all ${
                      isCorrect
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-2 ring-emerald-300'
                        : isIncorrect
                        ? 'bg-rose-100 border-rose-500 text-rose-900 ring-2 ring-rose-300'
                        : 'bg-white border-gray-300 text-gray-800 focus:ring-2 focus:ring-blue-500'
                    }`}
                  />
                  {isCorrect && (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                      ✓ Benar! Nilai kapasitas tepat.
                    </span>
                  )}
                  {isIncorrect && (
                    <span className="text-xs font-bold text-rose-600 flex items-center gap-1">
                      ✗ Jawaban yang benar adalah: {q.correctAnswer}
                    </span>
                  )}
                </div>
              )}

              {/* Explanation (revealed when checked) */}
              {checked && (
                <div className="mt-4 ml-9 p-3.5 bg-amber-50/80 border border-amber-200/90 rounded-xl text-xs text-amber-950 leading-relaxed shadow-xs">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1">
                    <span>💡</span>
                    <span>Penjelasan Konsep & Logika Jawaban:</span>
                  </div>
                  <p>{q.explanation}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 flex-wrap items-center pt-2 border-t border-gray-100">
        {!checked && (
          <button
            onClick={handleCheck}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            ✓ Periksa Jawaban (Check)
          </button>
        )}
        <button
          onClick={handleReset}
          className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
        >
          ↺ Reset Jawaban
        </button>
        {!checked && (
          <button
            onClick={handleShowAnswers}
            className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
          >
            ★ Tampilkan Kunci Jawaban
          </button>
        )}
        {checked && (
          <button
            onClick={() => setShowSolution(!showSolution)}
            className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            {showSolution ? '▲ Sembunyikan Kotretan & Analisis' : '▼ Lihat Analisis Mendalam & Teori Coffman'}
          </button>
        )}
      </div>

      {/* Full Kotretan & Coffman Theory Panel */}
      {checked && showSolution && (
        <div className="p-6 bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 space-y-5 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <span className="text-xl">📚</span>
            <h4 className="text-base font-bold text-amber-400">
              Rangkuman Kotretan & Bukti Matematis / Teoretis UTS
            </h4>
          </div>
          <div className="space-y-4 text-xs md:text-sm">
            {exercise.fullKotretan.map((section, sIdx) => (
              <div key={sIdx} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80">
                <h5 className="font-bold text-emerald-400 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                  {section.title}
                </h5>
                <ul className="space-y-1.5 text-slate-300 font-mono text-xs">
                  {section.steps.map((st, i) => (
                    <li key={i} className="leading-relaxed">
                      {st}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ═══ Main ExerciseView Component with Sub-Tabs ═══
export const ExerciseView: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [multiPartIdx, setMultiPartIdx] = useState(0);

  const exercise = allExercises[selectedIdx];

  return (
    <div className="min-w-[940px] max-w-[1240px] mx-auto py-24 px-8 select-none">
      {/* Title & subtitle */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
          <span>📝</span> Modul Latihan Soal Deadlock & Kasus UTS
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Lengkapi tabel perhitungan matriks Banker's Algorithm, Detection, dan bedah analisis Pseudocode Dining Philosopher UTS secara interaktif.
        </p>
      </div>

      {/* Main Exercise Selector Tabs */}
      <div className="flex gap-2.5 mb-8 justify-center flex-wrap">
        {allExercises.map((ex, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedIdx(i);
              setMultiPartIdx(0);
            }}
            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${
              selectedIdx === i
                ? 'bg-gray-900 text-white shadow-md scale-105'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            {ex.type === 'avoidance' || ex.type === 'avoidance-multi'
              ? '🔒 '
              : ex.type === 'detection'
              ? '🔍 '
              : '🍽️ '}
            {ex.title}
          </button>
        ))}
      </div>

      {/* Avoidance 2: Sub-tabs for Parts A, B, C */}
      {exercise.type === 'avoidance-multi' && (
        <div className="flex gap-2 mb-6 justify-center">
          {(exercise as AvoidanceMultiStepExercise).parts.map((part, pi) => (
            <button
              key={pi}
              onClick={() => setMultiPartIdx(pi)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                multiPartIdx === pi
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
              }`}
            >
              Bagian {part.label}: {pi === 0 ? 'Kondisi T0' : pi === 1 ? 'Request T1' : 'Request T2'}
            </button>
          ))}
        </div>
      )}

      {/* Render active exercise */}
      {exercise.type === 'avoidance' && (
        <AvoidanceExerciseView
          processes={exercise.processes}
          answers={exercise.answers}
          resourceNames={exercise.resourceNames}
          resourceVector={exercise.resourceVector}
        />
      )}

      {exercise.type === 'avoidance-multi' && (
        <AvoidanceExerciseView
          key={`${selectedIdx}-${multiPartIdx}`}
          processes={
            (exercise as AvoidanceMultiStepExercise).parts[multiPartIdx].processes
          }
          answers={
            (exercise as AvoidanceMultiStepExercise).parts[multiPartIdx].answers
          }
          resourceNames={exercise.resourceNames}
          resourceVector={exercise.resourceVector}
          partLabel={(exercise as AvoidanceMultiStepExercise).parts[multiPartIdx].label}
          partDescription={
            (exercise as AvoidanceMultiStepExercise).parts[multiPartIdx].description
          }
          requestNotice={
            multiPartIdx === 1
              ? '📌 Pertanyaan T1: Jika ada penambahan request (2,0,0) pada P2 di T1 bagaimana state keseluruhan eksekusi proses? Perhatikan: Allocation P2 bertambah (2,0,0), Needs P2 berkurang (2,0,0), dan Initial Available V₀ berkurang (2,0,0).'
              : multiPartIdx === 2
              ? '📌 Pertanyaan T2: Jika ada penambahan request (0,3,1) pada P3 di T2 bagaimana state keseluruhan eksekusi proses? Perhatikan: Allocation P3 bertambah (0,3,1), Needs P3 berkurang (0,3,1), dan Initial Available V₀ berkurang (0,3,1).'
              : undefined
          }
        />
      )}

      {exercise.type === 'detection' && (
        <DetectionExerciseView key={selectedIdx} exercise={exercise} />
      )}

      {exercise.type === 'dining-philosopher' && (
        <DiningPhilosopherExerciseView
          key={selectedIdx}
          exercise={exercise as DiningPhilosopherExercise}
        />
      )}
    </div>
  );
};

export default ExerciseView;
