import { useEffect, useState } from "react";
import { Check, RefreshCw } from "lucide-react";

/**
 * Custom human verification:
 *  - Slider must be dragged to the right
 *  - Then a math challenge must be solved
 *  - Calls onVerified(true) only when both pass
 */
export default function HumanVerification({ onVerified }: { onVerified: (ok: boolean) => void }) {
  const [slid, setSlid] = useState(false);
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [op, setOp] = useState<"+" | "-" | "×">("+");
  const [answer, setAnswer] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");

  const generate = () => {
    const ops: ("+" | "-" | "×")[] = ["+", "-", "×"];
    const newOp = ops[Math.floor(Math.random() * ops.length)];
    let x = Math.floor(Math.random() * 9) + 1;
    let y = Math.floor(Math.random() * 9) + 1;
    if (newOp === "-" && y > x) [x, y] = [y, x];
    setA(x); setB(y); setOp(newOp); setAnswer(""); setError("");
  };

  useEffect(() => { generate(); }, []);
  useEffect(() => { onVerified(verified); }, [verified, onVerified]);

  const expected = op === "+" ? a + b : op === "-" ? a - b : a * b;

  const check = () => {
    if (parseInt(answer, 10) === expected) {
      setVerified(true);
      setError("");
    } else {
      setError("Incorrect answer. Try again.");
      generate();
    }
  };

  const reset = () => { setVerified(false); setSlid(false); generate(); };

  return (
    <div className="stone-panel p-4 space-y-4">
      <div className="flex items-center justify-between">
        <span className="font-medieval text-gold text-sm uppercase tracking-wider">Human Verification</span>
        {verified && (
          <button type="button" onClick={reset} className="text-muted-foreground hover:text-gold text-xs flex items-center gap-1">
            <RefreshCw className="h-3 w-3" /> Reset
          </button>
        )}
      </div>

      {!slid ? (
        <SlideToVerify onComplete={() => setSlid(true)} />
      ) : !verified ? (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Solve the challenge to prove you are not a bot:</p>
          <div className="flex items-center gap-3 flex-wrap">
            <div className="font-pixel text-2xl gold-text bg-stone-dark px-4 py-2 rounded-sm border border-border select-none">
              {a} {op} {b} = ?
            </div>
            <input
              type="number"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), check())}
              className="input-medieval px-3 py-2 rounded-sm w-24 font-pixel text-center"
              placeholder="?"
              autoComplete="off"
            />
            <button type="button" onClick={check} className="btn-gold px-4 py-2 rounded-sm text-sm">Verify</button>
            <button type="button" onClick={generate} aria-label="New challenge" className="text-muted-foreground hover:text-gold p-2">
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
          {error && <p className="text-destructive text-xs">{error}</p>}
        </div>
      ) : (
        <div className="flex items-center gap-2 text-emerald font-medieval">
          <div className="w-6 h-6 rounded-full bg-emerald flex items-center justify-center">
            <Check className="h-4 w-4 text-stone-dark" strokeWidth={3} />
          </div>
          <span>Verified — you are human.</span>
        </div>
      )}
    </div>
  );
}

function SlideToVerify({ onComplete }: { onComplete: () => void }) {
  const [x, setX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);
  const max = 240;

  const start = (clientX: number, ref: HTMLDivElement | null) => {
    if (done || !ref) return;
    setDragging(true);
    const startX = clientX;
    const move = (e: MouseEvent | TouchEvent) => {
      const cx = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const dx = Math.max(0, Math.min(max, cx - startX));
      setX(dx);
    };
    const end = () => {
      setDragging(false);
      setX((current) => {
        if (current >= max - 10) { setDone(true); onComplete(); return max; }
        return 0;
      });
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", end);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", end);
  };

  return (
    <div className="relative h-12 bg-stone-dark border border-border rounded-sm overflow-hidden select-none" style={{ width: max + 48 }}>
      <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground pointer-events-none">
        {done ? "Confirmed" : "Slide to begin →"}
      </div>
      <div className="absolute top-0 left-0 h-full bg-gradient-gold/30" style={{ width: x + 48 }} />
      <div
        role="button"
        aria-label="Slide to verify"
        className={`absolute top-1 left-1 h-10 w-10 rounded-sm bg-gradient-gold flex items-center justify-center cursor-grab ${dragging ? 'cursor-grabbing' : ''} pixel-border`}
        style={{ transform: `translateX(${x}px)`, transition: dragging ? 'none' : 'transform 0.3s' }}
        onMouseDown={(e) => start(e.clientX, e.currentTarget.parentElement as HTMLDivElement)}
        onTouchStart={(e) => start(e.touches[0].clientX, e.currentTarget.parentElement as HTMLDivElement)}
      >
        <span className="text-stone-dark font-pixel">»</span>
      </div>
    </div>
  );
}
