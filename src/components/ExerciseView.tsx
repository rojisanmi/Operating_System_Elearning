import React, { useState } from 'react';
import {
  allExercises,
  getAvoidanceSolutionSteps,
  getDetectionSolutionSteps,
} from '../data/exercisesData';
import type {
  AvoidanceExercise,
  AvoidanceMultiStepExercise,
  DetectionExercise,
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
                const correctStep =
                  si < answers.executionOrder.length ? answers.executionOrder[si] : null;
                const isBlockedSlot = !correctStep;
                const isProcessCorrect =
                  checked && (correctStep ? step.process === correctStep.process : step.process === '');
                const isProcessWrong =
                  checked && (correctStep ? step.process !== correctStep.process : step.process !== '');

                return (
                  <tr key={si}>
                    <td className="px-1 py-1">
                      <div className="flex items-center gap-1">
                        <select
                          value={step.process}
                          onChange={(e) => {
                            if (checked) return;
                            const next = [...execOrder];
                            next[si] = { ...next[si], process: e.target.value };
                            setExecOrder(next);
                          }}
                          disabled={checked}
                          className={`w-28 h-8 border rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors ${
                            isProcessCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                              : isProcessWrong
                              ? 'bg-rose-100 border-rose-500 text-rose-900'
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
                        {checked && isProcessWrong && (
                          <span className="text-[10px] text-rose-600 font-bold whitespace-nowrap">
                            → {correctStep ? correctStep.process : 'Blocked'}
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
                          correctValue={correctStep ? correctStep.availableAfter[ri] : undefined}
                          checked={checked && !isBlockedSlot}
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

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      {/* Given data side by side */}
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
              {/* Total row if resource vector provided */}
              {exercise.resourceVector && (
                <tr>
                  <td className="px-2 py-1 font-bold text-gray-600 text-xs">Total</td>
                  {resourceNames.map((_, ri) => (
                    <td key={ri} className="text-center">
                      <InputCell
                        value={totalAlloc[ri]}
                        onChange={(v) => {
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

      {/* Resource Vector R (if given) */}
      {exercise.resourceVector && (
        <div className="mb-5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Resource Vector R
          </h4>
          <div className="flex gap-3">
            {resourceNames.map((r, i) => (
              <div key={r} className="text-center">
                <div className="text-xs text-gray-500 font-mono mb-1">{r}</div>
                <div className="w-11 h-8 bg-gray-100 border border-gray-300 rounded-lg flex items-center justify-center text-sm font-bold text-gray-800 font-mono">
                  {exercise.resourceVector![i]}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Vector W (Awal) */}
      <div className="mb-6">
        <h4 className="text-xs font-bold uppercase tracking-wider text-teal-700 mb-2">
          Available Vector W (Awal)
        </h4>
        <div className="flex gap-3">
          {resourceNames.map((r, ri) => (
            <div key={r} className="text-center">
              <div className="text-xs text-teal-700 font-mono mb-1">{r}</div>
              {exercise.resourceVector ? (
                <InputCell
                  value={initialW[ri]}
                  onChange={(v) => {
                    const next = [...initialW];
                    next[ri] = v;
                    setInitialW(next);
                  }}
                  correctValue={answers.availableW[ri]}
                  checked={checked}
                />
              ) : (
                <InputCell
                  value={String(exercise.initialAvailable[ri])}
                  onChange={() => {}}
                  readOnly
                  checked={false}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Urutan Proses Bertanda */}
      <div className="border-t border-gray-100 pt-5">
        <h4 className="text-sm font-bold text-gray-800 mb-1">Urutan Proses Bertanda</h4>
        <p className="text-xs text-gray-500 mb-3">
          Pilih proses yang dapat ditandai (karena alokasi 0 atau Request Q ≤ W), lalu isi Vektor W setelah proses melepaskan alokasinya. Proses yang tidak dapat ditandai berarti mengalami Deadlock!
        </p>
        <div className="overflow-x-auto">
          <table className="text-sm border-separate border-spacing-x-2 border-spacing-y-1">
            <thead>
              <tr>
                <th className="px-2 py-1 text-gray-500 font-bold text-xs uppercase text-left">Proses</th>
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
                  Vektor W
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
                const correctStep =
                  si < answers.markedProcesses.length ? answers.markedProcesses[si] : null;
                const isBlockedSlot = !correctStep;
                const matchedProc = processes.find(
                  (p) => p.name === (step.process || correctStep?.process)
                );
                const isProcessCorrect =
                  checked && (correctStep ? step.process === correctStep.process : step.process === '');
                const isProcessWrong =
                  checked && (correctStep ? step.process !== correctStep.process : step.process !== '');

                return (
                  <tr key={si}>
                    <td className="px-1 py-1">
                      <div className="flex items-center gap-1">
                        <select
                          value={step.process}
                          onChange={(e) => {
                            if (checked) return;
                            const next = [...markedSteps];
                            next[si] = { ...next[si], process: e.target.value };
                            setMarkedSteps(next);
                          }}
                          disabled={checked}
                          className={`w-28 h-8 border rounded-lg text-xs font-semibold text-center cursor-pointer transition-colors ${
                            isProcessCorrect
                              ? 'bg-emerald-100 border-emerald-500 text-emerald-900'
                              : isProcessWrong
                              ? 'bg-rose-100 border-rose-500 text-rose-900'
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
                        {checked && isProcessWrong && (
                          <span className="text-[10px] text-rose-600 font-bold whitespace-nowrap">
                            → {correctStep ? correctStep.process : 'Deadlock'}
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
                          correctValue={correctStep ? correctStep.wAfter[ri] : undefined}
                          checked={checked && !isBlockedSlot}
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
          <span>📝</span> Modul Latihan Soal Deadlock
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Lengkapi tabel perhitungan matriks, tentukan urutan eksekusi proses, dan periksa kebenaran jawabanmu secara interaktif.
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
            {ex.type === 'avoidance' || ex.type === 'avoidance-multi' ? '🔒 ' : '🔍 '}
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
    </div>
  );
};

export default ExerciseView;
