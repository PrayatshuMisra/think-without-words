// Design philosophy: Field Notes / Editorial Lab — warm paper, precise instrument panels, near-black ink, and burnt-copper signals.
// This page makes the hidden-state computation visible without pretending the toy model exposes natural-language thoughts.
import { useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Check, ChevronDown, ExternalLink, Menu, Minus, Plus, RotateCcw, Sparkles, X } from "lucide-react";

const inferenceOptions = [1, 2, 4, 8, 16];
const taskPresets = [
  {
    label: "EASY",
    title: "A letter-step transformation",
    prompt: ["A → C", "B → E", "C → G", "D → ?"],
    answer: "I",
    hint: "The jump grows by one each row: +2, +3, +4, then +5.",
    difficulty: "01 / 03",
  },
  {
    label: "MEDIUM",
    title: "A two-track sequence",
    prompt: ["A1 → C2", "B2 → E4", "C3 → G6", "D4 → ?"],
    answer: "I8",
    hint: "The letter and number tracks each follow their own increasing step.",
    difficulty: "02 / 03",
  },
  {
    label: "HARD",
    title: "A mirrored transformation",
    prompt: ["A → Z", "B → X", "C → V", "D → ?"],
    answer: "T",
    hint: "Move backward through the alphabet by odd steps: −1, −2, −3, then −4.",
    difficulty: "03 / 03",
  },
];

const statePatterns: Record<number, number[][]> = {
  1: [[1, 0, 0, 0, 0, 0]],
  2: [[1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0]],
  4: [[1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0], [1, 1, 0, 1, 0, 0], [1, 1, 1, 1, 0, 0]],
  8: [[1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0], [1, 1, 0, 1, 0, 0], [1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 1], [1, 1, 1, 1, 1, 1]],
  16: [[1, 0, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0], [1, 1, 0, 1, 0, 0], [1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1], [1, 1, 1, 0, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 0, 1], [1, 1, 1, 1, 1, 0], [1, 0, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1]],
};

const confidenceBySteps: Record<number, number> = { 1: 54, 2: 63, 4: 76, 8: 91, 16: 94 };
const latencyBySteps: Record<number, number> = { 1: 18, 2: 23, 4: 31, 8: 47, 16: 76 };

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function StatusDot({ active = false }: { active?: boolean }) {
  return <span className={`status-dot ${active ? "status-dot-active" : ""}`} aria-hidden="true" />;
}

function StateBars({ pattern, compact = false }: { pattern: number[]; compact?: boolean }) {
  return (
    <div className={`state-bars ${compact ? "state-bars-compact" : ""}`} aria-label="Hidden activation state">
      {pattern.map((on, i) => <span key={i} className={`state-bar ${on ? "state-bar-on" : ""}`} />)}
    </div>
  );
}

function SectionLabel({ number, label }: { number: string; label: string }) {
  return <div className="section-label"><span>{number}</span><span className="section-label-line" /><span>{label}</span></div>;
}

export default function Home() {
  const [steps, setSteps] = useState(8);
  const [taskIndex, setTaskIndex] = useState(0);
  const [showStates, setShowStates] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const task = taskPresets[taskIndex];
  const patterns = statePatterns[steps];
  const confidence = confidenceBySteps[steps];
  const latency = latencyBySteps[steps];
  const output = steps >= 4 ? task.answer : taskIndex === 2 ? "U" : taskIndex === 1 ? "I6" : "G";
  const correct = output === task.answer;
  const stateSummary = useMemo(() => `${patterns.length} state updates`, [patterns.length]);

  const changeTask = () => setTaskIndex((current) => (current + 1) % taskPresets.length);

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Think Without Words home">
          <img src="/manus-storage/tww-mark_4212a90b.png" alt="" className="brand-mark" />
          <span>THINK<br />WITHOUT WORDS</span>
        </a>
        <nav className={`main-nav ${mobileNavOpen ? "main-nav-open" : ""}`} aria-label="Primary navigation">
          <a href="#question" onClick={() => setMobileNavOpen(false)}>Explore</a>
          <a href="#experiment" onClick={() => setMobileNavOpen(false)}>Experiment</a>
          <a href="#bdh" onClick={() => setMobileNavOpen(false)}>BDH-CQ</a>
          <a href="#compare" onClick={() => setMobileNavOpen(false)}>Compare</a>
          <a href="#learn" onClick={() => setMobileNavOpen(false)}>Learn</a>
        </nav>
        <button className="header-cta" onClick={() => scrollToId("experiment")}>Start experiment <ArrowRight size={14} /></button>
        <button className="mobile-menu-button" aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"} onClick={() => setMobileNavOpen((open) => !open)}>
          {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <main id="top">
        <section className="hero-section content-width">
          <div className="hero-copy">
            <div className="eyebrow"><StatusDot active /> AN INTERACTIVE EXPLORATION OF LATENT REASONING</div>
            <div className="brand-signal"><img src="/manus-storage/tww-mark_4212a90b.png" alt="" /><span className="brand-signal-rule" /><StateBars pattern={[1, 1, 0, 1, 0, 1]} compact /><span>STATE / 00→01</span></div>
            <h1>Think<br /><em>without</em> words.</h1>
            <p className="hero-question">Can an AI reason without telling you how?</p>
            <p className="hero-support">Modern reasoning systems do not always need to express every intermediate step as natural-language tokens. Watch hidden computation evolve, control how much computation the system receives, and discover what changes.</p>
            <div className="hero-actions">
              <button className="button button-copper" onClick={() => scrollToId("experiment")}>Start the experiment <ArrowRight size={15} /></button>
              <a className="text-link" href="#why">Why this matters <ArrowDown size={14} /></a>
            </div>
          </div>
          <div className="hero-visual-wrap">
            <div className="hero-visual-topline"><span>LIVE TRACE / 001</span><span>LATENT STATE</span></div>
            <div className="hero-visual">
              <img src="/manus-storage/latent-field-hero_627f1a9f.png" alt="Abstract hidden-state trace moving through a sequence of matrices" />
              <div className="hero-visual-overlay">
                <div className="trace-label trace-question">QUESTION</div>
                <div className="trace-label trace-answer">ANSWER</div>
                <div className="trace-axis" />
              </div>
            </div>
            <div className="hero-visual-foot"><span>↓ recurrent updates</span><span className="mono">f(x, hₜ) → hₜ₊₁</span></div>
          </div>
        </section>

        <section className="statement-band" id="why">
          <div className="content-width statement-grid">
            <div className="statement-index">01 / 07</div>
            <div>
              <p className="statement-kicker">THE QUESTION</p>
              <h2>Words are one way to show work.<br /><span>They are not the only way to do it.</span></h2>
              <div className="statement-trace"><StateBars pattern={[1, 1, 0, 1, 1, 0]} compact /><span>hidden state / repeated update</span><ArrowRight size={14} /></div>
            </div>
            <p className="statement-aside">This is a comparison of computational approaches, not a claim that one universally dominates the other.</p>
          </div>
        </section>

        <section className="section-block content-width" id="question">
          <SectionLabel number="02" label="VISIBLE VS. HIDDEN" />
          <div className="question-intro">
            <h2>Does thinking<br /><em>require words?</em></h2>
            <p>Both approaches allocate computation to solving the task. They differ in what is exposed as an intermediate representation.</p>
          </div>
          <div className="reasoning-compare">
            <div className="reasoning-card reasoning-verbal">
              <div className="card-kicker">01 / VERBAL REASONING <span>serialized</span></div>
              <div className="flow-rail">
                <div className="flow-node flow-question-node">QUESTION</div><ArrowDown className="flow-arrow" size={16} />
                <div className="token-row"><span>if A then C</span><span>+2</span></div><ArrowDown className="flow-arrow" size={16} />
                <div className="token-row"><span>if B then E</span><span>+3</span></div><ArrowDown className="flow-arrow" size={16} />
                <div className="token-row"><span>pattern grows</span><span>+4</span></div><ArrowDown className="flow-arrow" size={16} />
                <div className="flow-node flow-answer-node">ANSWER</div>
              </div>
              <p>Intermediate steps become readable tokens. Useful for inspection; expensive in sequence length.</p>
            </div>
            <div className="reasoning-card reasoning-latent">
              <div className="card-kicker">02 / LATENT REASONING <span>recurrent</span></div>
              <div className="flow-rail">
                <div className="flow-node flow-question-node">QUESTION</div><ArrowDown className="flow-arrow" size={16} />
                {[0, 1, 2].map((i) => <div key={i} className="latent-state-row"><span>HIDDEN STATE 0{i + 1}</span><StateBars pattern={patterns[Math.min(i * 2, patterns.length - 1)] || patterns[0]} compact /></div>)}
                <ArrowDown className="flow-arrow" size={16} /><div className="flow-node flow-answer-node">ANSWER</div>
              </div>
              <p>Intermediate steps remain compact internal states. Less exposed text; computation can continue in place.</p>
            </div>
          </div>
        </section>

        <section className="experiment-section" id="experiment">
          <div className="content-width">
            <SectionLabel number="03" label="INTERACTIVE EXPERIMENT" />
            <div className="experiment-heading">
              <div><p className="eyebrow"><StatusDot active /> TOY SIMULATION / DETERMINISTIC TASK</p><h2>Give the model<br /><em>more time to think.</em></h2></div>
              <p>Increase inference-time computation and observe the trade-off: a better chance of solving the task, a longer wait, and no additional verbal trace.</p>
            </div>

            <div className="experiment-panel">
              <aside className="task-column">
                <div className="panel-topline"><span>TASK / {task.difficulty}</span><span className="mono">PRESET {taskIndex + 1}</span></div>
                <div className="task-title">{task.title}</div>
                <div className="task-rule" />
                <div className="task-prompt">{task.prompt.map((line) => <div key={line}>{line}</div>)}</div>
                <button className="button button-quiet" onClick={changeTask}><RotateCcw size={14} /> New task</button>
                <div className="task-hint"><span className="hint-mark">i</span><span>{task.hint}</span></div>
              </aside>

              <div className="model-column">
                <div className="panel-topline"><span>MODEL / RECURRENT STATE</span><span className="live-chip"><StatusDot active /> RUNNING</span></div>
                <div className="model-flow">
                  <div className="model-input"><span className="model-input-label">INPUT</span><strong>{task.prompt[0].split(" → ")[0]} …</strong></div>
                  <ArrowDown className="model-arrow" size={17} />
                  {showStates && patterns.map((pattern, i) => (
                    <div className="model-state" key={`${steps}-${i}`} style={{ animationDelay: `${i * 24}ms` }}><span className="state-number">STATE {String(i + 1).padStart(2, "0")}</span><StateBars pattern={pattern} /><span className="state-delta">Δ {String((i + 1) * 3).padStart(2, "0")}</span></div>
                  ))}
                  {!showStates && <div className="states-hidden">State trace hidden — toggle it back on to inspect the updates.</div>}
                  <ArrowDown className="model-arrow" size={17} />
                  <div className="model-output"><span>ANSWER</span><strong>{output}</strong><span className={correct ? "result-correct" : "result-incorrect"}>{correct ? "CORRECT" : "INCORRECT"}</span></div>
                </div>
              </div>
            </div>

            <div className="controls-grid">
              <div className="steps-control">
                <div className="control-heading"><span>INFERENCE STEPS</span><strong>{steps}</strong></div>
                <div className="range-wrap"><input type="range" min="0" max="4" step="1" value={inferenceOptions.indexOf(steps)} onChange={(event) => setSteps(inferenceOptions[Number(event.target.value)])} aria-label="Inference steps" /><div className="range-labels">{inferenceOptions.map((value) => <span key={value} className={value === steps ? "range-label-active" : ""}>{value}</span>)}</div></div>
                <p>More state updates can improve the result, but they also increase latency and cost.</p>
              </div>
              <button className={`state-toggle ${showStates ? "state-toggle-on" : ""}`} onClick={() => setShowStates((visible) => !visible)}><span className="toggle-copy"><span>SHOW STATE CHANGES</span><small>Make the hidden computation visible</small></span><span className="toggle-switch"><span /></span></button>
            </div>

            <div className="results-grid">
              <div className="result-card result-card-emphasis"><span>MODEL OUTPUT</span><strong>{output}</strong><span className={correct ? "result-correct" : "result-incorrect"}>{correct ? <><Check size={14} /> Correct</> : <><X size={14} /> Incorrect</>}</span></div>
              <div className="result-card"><span>GROUND TRUTH</span><strong>{task.answer}</strong><span className="result-neutral">deterministic</span></div>
              <div className="metrics-card"><span className="metrics-title">COMPUTATION / TOY SIMULATION</span><div className="metric-row"><span>Inference steps</span><strong>{steps}</strong></div><div className="metric-row"><span>State updates</span><strong>{stateSummary}</strong></div><div className="metric-row"><span>Latency</span><strong>~{latency} ms</strong></div><div className="metric-row"><span>Confidence</span><strong>{confidence}%</strong></div></div>
            </div>
          </div>
        </section>

        <section className="aha-section content-width">
          <div className="aha-callout"><span className="aha-mark">↗</span><div><p className="eyebrow">THE AHA MOMENT</p><h2>More computation<br /><em>does not have to mean more words.</em></h2><p>The hidden state is not a secret paragraph. It is a changing representation: compact, recurrent, and useful for getting to an answer.</p></div></div>
          <div className="aha-note"><span>OBSERVATION</span><p>Increase the steps. The output may stabilize before the trace becomes any more readable.</p></div>
        </section>

        <section className="failure-section">
          <div className="content-width failure-grid"><div><SectionLabel number="04" label="FAILURE MODE" /><h2>Now break it.</h2><p>Latent computation is not magic. More steps can help, plateau, or still produce a wrong answer. A hidden process is harder to inspect when it fails.</p><button className="text-link" onClick={() => { setTaskIndex(2); setSteps(1); scrollToId("experiment"); }}>Test a low-budget run <ArrowRight size={14} /></button></div><div className="failure-graphic"><div className="failure-graph-header"><span>SUCCESS / INFERENCE BUDGET</span><span className="mono">SIMULATED</span></div><div className="graph-axis"><span>100%</span><span>50%</span><span>0%</span></div><div className="graph-area"><div className="graph-line graph-line-copper" /><div className="graph-line graph-line-dashed" /><span className="graph-dot graph-dot-1" /><span className="graph-dot graph-dot-2" /><span className="graph-dot graph-dot-3" /></div><div className="graph-labels"><span>1</span><span>4</span><span>8</span><span>16 steps</span></div><div className="graph-legend"><span><i className="legend-copper" /> task accuracy</span><span><i className="legend-dashed" /> latency cost</span></div></div></div>
        </section>

        <section className="bdh-section" id="bdh">
          <div className="content-width"><SectionLabel number="05" label="FROM TOY MODEL TO RESEARCH IDEA" /><div className="bdh-heading"><div><p className="eyebrow">BDH-CQ / DRAGON HATCHLING CONTEXTUAL QUERY</p><h2>What happens when<br /><em>the loop becomes the model?</em></h2></div><p>BDH-CQ is a useful bridge from this toy experiment to a research direction: contextual queries, recurrent hidden updates, and a readout only when an answer is needed.</p></div><div className="bdh-visual"><div className="bdh-diagram-grid" aria-label="BDH-CQ conceptual flow diagram"><div className="bdh-node bdh-node-query"><span>01</span><strong>contextual<br />query</strong></div><div className="bdh-wire wire-one" /><div className="bdh-loop"><div className="bdh-loop-top"><span>h₀</span><span>h₁</span><span>h₂</span><span>hₙ</span></div><div className="bdh-state-field">{Array.from({ length: 24 }).map((_, i) => <i key={i} className={i % 4 === 0 || i % 7 === 0 ? "field-cell field-cell-hot" : "field-cell"} />)}</div><div className="bdh-loop-bottom"><span>state update</span><span>state update</span><span>state update</span></div></div><div className="bdh-wire wire-two" /><div className="bdh-node bdh-node-readout"><span>03</span><strong>answer<br />readout</strong></div><div className="bdh-diagram-label label-query">CONTEXTUAL QUERY</div><div className="bdh-diagram-label label-state">RECURRENT HIDDEN STATE</div><div className="bdh-diagram-label label-readout">READOUT</div></div></div><div className="bdh-steps"><div><span>01</span><strong>Context enters</strong><p>A query provides the task and the starting state.</p></div><div><span>02</span><strong>State recurs</strong><p>Computation continues without serializing every intermediate step.</p></div><div><span>03</span><strong>Answer exits</strong><p>The model emits a result when the computation budget is spent.</p></div></div></div>
        </section>

        <section className="compare-section content-width" id="compare"><SectionLabel number="06" label="THREE WAYS TO THINK" /><div className="compare-heading"><h2>Same goal.<br /><em>Different trace.</em></h2><p>Use this frame to keep the distinction precise. These are computational strategies, not personality types or a leaderboard.</p></div><div className="compare-table"><div className="compare-row compare-row-header"><span>APPROACH</span><span>INTERMEDIATE REPRESENTATION</span><span>TRADE-OFF</span></div><div className="compare-row"><span><b>Verbal reasoning</b><small>serialized tokens</small></span><span>Readable natural-language sequence</span><span>Inspectable, but longer and more expensive</span></div><div className="compare-row compare-row-active"><span><b>Latent reasoning</b><small>recurrent state</small></span><span>Compact hidden-state updates</span><span>Efficient, but harder to observe directly</span></div><div className="compare-row"><span><b>Hybrid</b><small>selective readout</small></span><span>Hidden work with occasional explanations</span><span>Balances traceability and computation</span></div></div></section>

        <section className="learn-section" id="learn"><div className="content-width learn-grid"><div><SectionLabel number="07" label="EXPLAIN IT BACK" /><h2>Your turn.</h2><p>Complete the sentence in your own words:</p><blockquote>“A model can reason without words because…”</blockquote><button className="button button-dark" onClick={() => scrollToId("top")}>Run the experiment again <RotateCcw size={14} /></button></div><div className="learn-card"><div className="learn-card-top"><span>ONE-SENTENCE TAKEAWAY</span><Sparkles size={16} /></div><p>“A model can perform repeated reasoning in a hidden state without serializing every intermediate step as natural-language tokens — but more computation changes the trade-off between accuracy, observability, cost, latency, and reliability.”</p><div className="learn-card-foot"><span>KEEP THIS FRAME</span><span className="mono">reasoning ≠ words</span></div></div></div></section>
      </main>

      <footer className="site-footer"><div className="content-width footer-grid"><div className="footer-brand"><img src="/manus-storage/tww-mark_4212a90b.png" alt="" className="brand-mark" /><div><strong>THINK WITHOUT WORDS</strong><p>An interactive exploration of latent reasoning.</p></div></div><div className="footer-meta"><span>DATAFORGE 2026 / PATHWAY TRACK</span><span className="footer-disclaimer">Toy simulation. Not a measurement of an actual BDH model.</span></div><a href="#top" className="back-top">Back to top <ArrowRight size={14} /></a></div></footer>
    </div>
  );
}
